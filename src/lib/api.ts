import type { VotePyramidData, InventoryStatus, PyramidTierLevel } from '../types/database';
import pyramidSchedule from '../data/pyramidSchedule.json';

const API_PYRAMID_URL = import.meta.env.VITE_PYRAMID_API_URL || '';
const EXTERNAL_MAP_BASE = import.meta.env.VITE_EXTERNAL_MAP_URL || 'https://map.nazuna.jp/campus';
const INVENTORY_API_BASE = import.meta.env.VITE_INVENTORY_API || 'https://inventory.nazuna.jp/api';

export async function fetchVotePyramid(orgId: string): Promise<VotePyramidData> {
  // 実サーバー環境変数が設定されている場合のみ外部フェッチ
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
      // フォールバック
    }
  }

  // 管理画面スケジュールJSONからの自動算出・公開ロジック
  const now = new Date().getTime();
  let activeRelease = pyramidSchedule.releases[0];

  // 定時公開判定（現在時刻が設定時刻を超えているスケジュールで最も新しいものを自動適用）
  for (const release of pyramidSchedule.releases) {
    const scheduledTime = new Date(release.scheduledTime).getTime();
    if (now >= scheduledTime || import.meta.env.VITE_DEMO_RELEASE === release.releaseId) {
      activeRelease = release;
    }
  }

  // もし開発・プレビュー時等に直近の中間開示を即座に表示したい場合のフォールバック適用
  if (!activeRelease || activeRelease.scheduledTime > new Date().toISOString()) {
    activeRelease = pyramidSchedule.releases[1] || pyramidSchedule.releases[0];
  }

  // 最終結果開示前などでロック中（embargoed）の場合
  if (activeRelease.isEmbargoed) {
    return {
      class_id: orgId,
      pyramid_tier: 'embargoed',
      tier_label: '集計ロック・非表示',
      release_title: activeRelease.title,
      is_embargoed: true,
      embargo_message: activeRelease.embargoMessage || '最終結果の集計および厳正な審査期間中です。公式結果発表までお待ちください。'
    };
  }

  // 上・中・高のいずれの階層に属しているかを判定
  const tiers = activeRelease.pyramidTiers;
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

export async function fetchInventoryStatus(orgId: string): Promise<InventoryStatus> {
  // 実サーバー環境変数が設定されている場合のみ外部フェッチ
  if (import.meta.env.VITE_USE_REAL_API === 'true') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${INVENTORY_API_BASE}/status/${orgId}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        return data.status as InventoryStatus;
      }
    } catch {
      // フォールバック
    }
  }
  
  // モック・スタンドアロン時のリアルタイム状況返却
  if (orgId === 'org-2') return 'STATUS_FEW';
  if (orgId === 'org-3') return 'STATUS_SOLD_OUT';
  return 'STATUS_AVAILABLE';
}

export function openExternalMap(roomCode: string, floorInfo: string) {
  const url = `${EXTERNAL_MAP_BASE}?room=${encodeURIComponent(roomCode)}&floor=${encodeURIComponent(floorInfo)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openGoogleFormVote(orgId: string, orgName: string) {
  const formUrl = `https://docs.google.com/forms/d/e/mock-form-id/viewform?usp=pp_url&entry.100001=${encodeURIComponent(orgId)}&entry.100002=${encodeURIComponent(orgName)}`;
  window.open(formUrl, '_blank', 'noopener,noreferrer');
}
