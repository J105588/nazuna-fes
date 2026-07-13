import type { VotePyramidData, InventoryStatus, PyramidTierLevel, NazunaGraphItem, Organization } from '../types/database';
import pyramidSchedule from '../data/pyramidSchedule.json';
import { mockOrganizations, mockPyramidReleases, fetchPyramidReleasesFromDB } from './supabase';

const API_PYRAMID_URL = import.meta.env.VITE_PYRAMID_API_URL || '';
const EXTERNAL_MAP_BASE = import.meta.env.VITE_EXTERNAL_MAP_URL || 'https://map.nazuna.jp/map.html';
const INVENTORY_API_BASE = import.meta.env.VITE_INVENTORY_API || 'https://inventory.nazuna.jp/api';
const GOOGLE_FORM_BASE_URL = import.meta.env.VITE_GOOGLE_FORM_URL || 'https://docs.google.com/forms/d/e/1FAIpQLSc_FORM_ID/viewform';
const GOOGLE_FORM_ENTRY_ID = import.meta.env.VITE_GOOGLE_FORM_ENTRY_ID || 'entry.100001';
const GOOGLE_FORM_ENTRY_NAME = import.meta.env.VITE_GOOGLE_FORM_ENTRY_NAME || 'entry.100002';

// ============================================================================
// 1. NazunaGraph (メニュー在庫管理システム) 連携 API & キャッシュ機構
// ============================================================================
// ※ 在庫管理システムおよび校内マップシステムは本サイトから完全に独立した外部システムです。
// ※ 本機能は「喫茶展示 (genre === 'food') かつ API連携トグル (use_menu_api) がオン」の場合のみ動作します。

interface CacheEntry {
  data: NazunaGraphItem[];
  timestamp: number;
  isUpdating?: boolean;
}

const nazunaGraphCache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 30000;  // 30秒の即時有効キャッシュ期間
const STALE_TTL_MS = 600000; // 10分間はバックグラウンド再検証(SWR)で古いキャッシュを即時フォールバック返却

// 定時自動フェッチ・キャッシュ更新タイマー（喫茶展示などのAPI連携団体用）
let periodicSyncTimer: any = null;

/**
 * 喫茶展示等の対象団体について、定時リクエストを行いキャッシュを最新化するポーリング処理を開始します。
 */
export function startNazunaGraphPeriodicSync(ownerIds: string[], intervalMs = 45000) {
  if (periodicSyncTimer) clearInterval(periodicSyncTimer);
  if (!ownerIds || ownerIds.length === 0) return;

  periodicSyncTimer = setInterval(() => {
    ownerIds.forEach(id => {
      fetchNazunaGraphItems({ owner_id: id, _background_refresh: true }).catch(() => {});
    });
  }, intervalMs);
}

/**
 * NazunaGraph 外部プラットフォーム API から品目・在庫データを取得します。
 * キャッシュ機構を内蔵し、定時リクエスト時や高頻度アクセス時におけるサーバー負荷を最小限に抑えます。
 */
export async function fetchNazunaGraphItems(options: {
  owner_id?: string;
  category_id?: number;
  status_id?: number;
  limit?: number;
  _background_refresh?: boolean;
} = {}): Promise<NazunaGraphItem[]> {
  const cacheKey = JSON.stringify({
    owner_id: options.owner_id,
    category_id: options.category_id,
    status_id: options.status_id,
    limit: options.limit
  });
  const now = Date.now();

  // 1. キャッシュが新しく有効な場合（TTL内）、即座にキャッシュから返却（バックグラウンド更新時を除く）
  if (!options._background_refresh && nazunaGraphCache[cacheKey] && (now - nazunaGraphCache[cacheKey].timestamp < CACHE_TTL_MS)) {
    return nazunaGraphCache[cacheKey].data;
  }

  // 2. 期限切れだが Stale キャッシュがある場合、ただちに Stale キャッシュを返却しつつ裏で再検証 (Stale-while-revalidate)
  if (!options._background_refresh && nazunaGraphCache[cacheKey] && (now - nazunaGraphCache[cacheKey].timestamp < STALE_TTL_MS)) {
    if (!nazunaGraphCache[cacheKey].isUpdating) {
      nazunaGraphCache[cacheKey].isUpdating = true;
      fetchNazunaGraphItems({ ...options, _background_refresh: true }).catch(() => {});
    }
    return nazunaGraphCache[cacheKey].data;
  }

  const params = new URLSearchParams();
  if (options.owner_id) params.set('owner_id', options.owner_id);
  if (options.category_id !== undefined) params.set('category_id', String(options.category_id));
  if (options.status_id !== undefined) params.set('status_id', String(options.status_id));
  if (options.limit !== undefined) params.set('limit', String(options.limit));

  const queryString = params.toString();
  const url = `${INVENTORY_API_BASE}/items${queryString ? `?${queryString}` : ''}`;

  let result: NazunaGraphItem[] = [];

  // 実サーバー環境変数が設定されている場合のみ外部 fetch
  if (import.meta.env.VITE_USE_REAL_API === 'true') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.ok) {
        result = await res.json();
        nazunaGraphCache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    } catch {
      // ネットワーク通信エラーやタイムアウト時はフォールバックデータへ遷移
    }
  }

  // 外部APIからの取得が得られなかった場合、空配列を返却（ハードコーディング/モックデータを排除）

  nazunaGraphCache[cacheKey] = { data: result, timestamp: now, isUpdating: false };
  return result;
}

// ============================================================================
// 2. 喫茶展示ステータス集計判定ロジック
// ============================================================================

/**
 * 取得したメニュー一覧の状態を解析し、団体の総合ステータス（スムーズ/残りわずか/完売等）を算出します。
 */
export function computeNazunaGraphAggregateStatus(items: NazunaGraphItem[]): InventoryStatus {
  if (!items || items.length === 0) return 'STATUS_AVAILABLE';

  // 1. 販売中: 販売可能なアイテムが1つでもあれば「販売中（スムーズ）」
  const hasAvailable = items.some(i => i.status.id === 1 || i.status.label === '販売中');
  if (hasAvailable) return 'STATUS_AVAILABLE';

  // 2. 残りわずか: 注意すべきアイテム（残りわずか）がある場合
  const hasFew = items.some(i => i.status.id === 2 || i.status.label === '残りわずか');
  if (hasFew) return 'STATUS_FEW';

  // 3. 準備中: 全アイテムが準備中の場合
  const allPreparing = items.every(i => i.status.id === 4 || i.status.label === '準備中');
  if (allPreparing) return 'STATUS_PREPARING';

  // 4. 完売: すべてのアイテムが完売ステータスの場合
  return 'STATUS_SOLD_OUT';
}

/**
 * 出展団体のステータスを取得します。
 * 【仕様】「喫茶展示 (genre === 'food') かつ API連携トグル (use_menu_api) がオン」の場合のみ
 * NazunaGraph API と通信を行いステータスを集計します。それ以外の団体やトグルオフ時は外部リクエストを行いません。
 */
export async function fetchInventoryStatus(orgOrId: Organization | string): Promise<InventoryStatus> {
  let org: Organization | undefined;
  if (typeof orgOrId === 'string') {
    org = mockOrganizations.find(o => o.id === orgOrId);
  } else {
    org = orgOrId;
  }

  // 喫茶展示 (genre === 'food') かつ API連携トグルがオンにされている場合のみ、外部APIへリクエスト
  if (org && org.genre === 'food' && org.use_menu_api) {
    const items = await fetchNazunaGraphItems({ owner_id: org.menu_owner_id || org.id });
    return computeNazunaGraphAggregateStatus(items);
  }

  // トグルオフおよび非喫茶展示ではステータス機能は動作させず、デフォルト値を返却
  return 'STATUS_AVAILABLE';
}

// ============================================================================
// 3. ピラミッド・タイムスケジュール等 API 連携
// ============================================================================

export async function fetchVotePyramid(orgId: string): Promise<VotePyramidData> {
  if (import.meta.env.VITE_USE_REAL_API === 'true' && API_PYRAMID_URL) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const response = await fetch(`${API_PYRAMID_URL}?orgId=${encodeURIComponent(orgId)}`, {
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // フォールバックへ遷移
    }
  }

  await fetchPyramidReleasesFromDB();
  const releases: any[] = (mockPyramidReleases && mockPyramidReleases.length > 0)
    ? mockPyramidReleases
    : pyramidSchedule.releases;

  const now = new Date().getTime();
  let activeRelease = releases[0];

  // 定時公開判定（現在時刻が設定時刻を超えているスケジュールで最も新しいものを適用）
  for (const release of releases) {
    const scheduledTime = new Date(release.scheduledTime || release.scheduled_time).getTime();
    if (now >= scheduledTime || import.meta.env.VITE_DEMO_RELEASE === (release.releaseId || release.id)) {
      activeRelease = release;
    }
  }

  // 開発・プレビュー時等に直近の中間開示を即座に表示したい場合のフォールバック適用
  if (!activeRelease || (activeRelease.scheduledTime || activeRelease.scheduled_time) > new Date().toISOString()) {
    activeRelease = releases[1] || releases[0];
  }

  // 最終結果開示前などでロック中 (embargoed) の場合
  const isEmbargoed = activeRelease.isEmbargoed ?? activeRelease.is_embargoed;
  const embargoMessage = activeRelease.embargoMessage || activeRelease.embargo_message || '最終結果の集計および厳正な審査期間中です。公式結果発表までお待ちください。';

  if (isEmbargoed) {
    return {
      class_id: orgId,
      pyramid_tier: 'embargoed',
      tier_label: '集計ロック・非表示',
      release_title: activeRelease.title,
      is_embargoed: true,
      embargo_message: embargoMessage
    };
  }

  // 上・中・高のいずれの階層に属しているかを判定
  const tiers = activeRelease.pyramidTiers || activeRelease.pyramid_tiers;
  let pyramid_tier: PyramidTierLevel = 'normal';
  let tier_label: '高' | '上' | '中' | '一般' | '集計ロック・非表示' = '一般';

  if (tiers?.high?.includes(orgId)) {
    pyramid_tier = 'high';
    tier_label = '高';
  } else if (tiers?.upper?.includes(orgId)) {
    pyramid_tier = 'upper';
    tier_label = '上';
  } else if (tiers?.middle?.includes(orgId)) {
    pyramid_tier = 'middle';
    tier_label = '中';
  }

  return {
    class_id: orgId,
    pyramid_tier,
    tier_label,
    release_title: activeRelease.title,
    is_embargoed: false
  };
}

// ============================================================================
// 4. 校内マップ (i-Compass) & Googleフォーム投票リンク生成
// ============================================================================

export interface ICompassOptions {
  current?: string;
  end?: string;
  floor?: string | number;
  barrierFree?: boolean;
  autoRotate?: boolean;
}

export function buildICompassUrl(options: ICompassOptions = {}): string {
  const base = EXTERNAL_MAP_BASE;
  const params = new URLSearchParams();
  if (options.current) params.set('current', options.current);
  if (options.end) params.set('end', options.end);
  if (options.floor !== undefined && options.floor !== 'all') params.set('floor', String(options.floor));
  if (options.barrierFree !== undefined) params.set('barrier_free', options.barrierFree ? 'true' : 'false');
  if (options.autoRotate !== undefined) params.set('auto_rotate', options.autoRotate ? 'true' : 'false');

  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}

export function openExternalMap(roomCodeOrDest?: string, currentLoc?: string, options: Omit<ICompassOptions, 'current' | 'end'> = {}) {
  const url = buildICompassUrl({
    current: currentLoc,
    end: roomCodeOrDest,
    ...options
  });
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openGoogleFormVote(orgId: string, orgName: string) {
  const url = new URL(GOOGLE_FORM_BASE_URL);
  url.searchParams.set('usp', 'pp_url');
  url.searchParams.set(GOOGLE_FORM_ENTRY_ID, orgId);
  url.searchParams.set(GOOGLE_FORM_ENTRY_NAME, orgName);
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}
