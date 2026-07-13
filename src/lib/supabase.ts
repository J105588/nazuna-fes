import { createClient } from '@supabase/supabase-js';
import type {
  Organization,
  TimetableEvent,
  TimetableDay,
  Announcement,
  LostItem,
  InventoryStatus,
  LostItemStatus,
  AnnouncementCategory,
  AdminUser,
  AdminRole,
  PyramidRelease
} from '../types/database';
import pyramidScheduleJson from '../data/pyramidSchedule.json';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// 管理画面およびローカルプレビュー環境ですぐに全機能を使用できるよう初期状態シードデータを用意
export let mockOrganizations: Organization[] = [
  { id: 'org-1', name: '3年A組「赤い和傘と極夜の謎解き迷宮」', category: 'class', genre: 'attraction', description: '百輝夜行の世界観を完全に再現した巨大脱出ゲーム。あやかしの街角で失われた和傘の謎を解き明かせ！難易度調整可能な3つのルートを完備。', room_code: '3A', floor_info: '本館3F 北側教室', image_url: '/assets/poster/poster_complete.png', inventory_status: 'STATUS_AVAILABLE', is_published: true, use_menu_api: false, menu_owner_id: 'org-1', updated_at: new Date().toISOString() },
  { id: 'org-2', name: '2年C組「極夜カフェ 〜緋と金のあやかし茶屋〜」', category: 'class', genre: 'food', description: '市川学園名物の手作りマドレーヌと、夜をイメージした金粉入り極上の和風タピオカドリンクをお届けします。ポスターの窓の灯りを再現した癒やしの空間へどうぞ。', room_code: '2C', floor_info: '本館2F 中央ホールそば', image_url: '/assets/poster/poster_complete.png', inventory_status: 'STATUS_AVAILABLE', is_published: true, use_menu_api: false, menu_owner_id: 'org-2', updated_at: new Date().toISOString() },
  { id: 'org-3', name: '軽音楽部「HYAKKI-YAKO ROCK FESTIVAL 2026」', category: 'club', genre: 'stage', description: '中庭特設ステージを熱気と爆音で揺らす総勢12バンドの白熱ライブ！和モダンロックやオリジナルテーマソング「百の輝き」を初披露します。', room_code: 'STAGE-1', floor_info: '中庭 屋外特設ステージ', image_url: '/assets/poster/poster_complete.png', inventory_status: 'STATUS_AVAILABLE', is_published: true, use_menu_api: false, menu_owner_id: 'org-3', updated_at: new Date().toISOString() },
  { id: 'org-4', name: '物理・科学部「あやかしネオンと光の実験展示」', category: 'club', genre: 'exhibition', description: 'レーザー光線とホログラムで百輝夜行を科学の力で表現！自分で作れる蛍光和傘ストラップのワークショップも同時開催中。', room_code: 'SCI-3', floor_info: '理科棟3F 物理実験室', image_url: '/assets/poster/poster_complete.png', inventory_status: 'STATUS_AVAILABLE', is_published: true, use_menu_api: false, menu_owner_id: 'org-4', updated_at: new Date().toISOString() },
  { id: 'org-5', name: '3年F組「百物語・戦慄のあやかし屋敷」', category: 'class', genre: 'attraction', description: '最新の立体音響プロジェクションマッピング技術を結集させた本格お化け屋敷。赤い和傘を持って進む、未だかつてない恐怖と感動体験。', room_code: '3F', floor_info: '本館3F 南側教室', image_url: '/assets/poster/poster_complete.png', inventory_status: 'STATUS_AVAILABLE', is_published: true, use_menu_api: false, menu_owner_id: 'org-5', updated_at: new Date().toISOString() },
  { id: 'org-6', name: '書道部「一筆書きの奇跡 〜毛筆の覚醒〜」', category: 'club', genre: 'exhibition', description: 'ポスタービジュアルの原点となった力強い毛筆線画の巨大掛け軸展示と、当日の書道パフォーマンス。文字の中に灯る熱意を感じてください。', room_code: 'ART-1', floor_info: '東館2F 書道室', image_url: '/assets/poster/poster_complete.png', inventory_status: 'STATUS_AVAILABLE', is_published: true, use_menu_api: false, menu_owner_id: 'org-6', updated_at: new Date().toISOString() }
];

export let mockTimetableDays: TimetableDay[] = [
  { id: 'day-1', date_string: '2026-09-19', label: 'DAY 1 (9/19 校内祭)', is_published: true, display_order: 1 },
  { id: 'day-2', date_string: '2026-09-20', label: 'DAY 2 (9/20 一般公開)', is_published: true, display_order: 2 }
];

export let mockTimetableEvents: TimetableEvent[] = [
  { id: 'evt-1', title: 'オープニングセレモニー ＆ 書道パフォーマンス「百輝夜行」', organization_name: '書道部・文化祭実行委員会', day_id: 'day-1', start_time: '2026-09-19T09:00:00+09:00', end_time: '2026-09-19T09:45:00+09:00', stage_location: 'gym', is_published: true, updated_at: new Date().toISOString() },
  { id: 'evt-2', title: '有志バンドトップバッター「THE NAZUNA BEATS」', organization_name: '軽音楽部有志', day_id: 'day-1', start_time: '2026-09-19T10:15:00+09:00', end_time: '2026-09-19T11:00:00+09:00', stage_location: 'courtyard', is_published: true, updated_at: new Date().toISOString() },
  { id: 'evt-3', title: '演劇部 秋季特別公演「極夜にさす赤い傘」', organization_name: '演劇部', day_id: 'day-1', start_time: '2026-09-19T11:30:00+09:00', end_time: '2026-09-19T12:45:00+09:00', stage_location: 'av_room', is_published: true, updated_at: new Date().toISOString() },
  { id: 'evt-4', title: 'ダンス部メインステージ「HYAKKI DANCE PARADE」', organization_name: 'ダンス部', day_id: 'day-2', start_time: '2026-09-20T13:30:00+09:00', end_time: '2026-09-20T14:30:00+09:00', stage_location: 'gym', is_published: true, updated_at: new Date().toISOString() },
  { id: 'evt-5', title: '後夜祭フィナーレ ＆ 表彰式「金銀銅・ピラミッド授与式」', organization_name: '文化祭実行委員会', day_id: 'day-2', start_time: '2026-09-20T16:00:00+09:00', end_time: '2026-09-20T17:15:00+09:00', stage_location: 'gym', is_published: true, updated_at: new Date().toISOString() }
];

export let mockAnnouncements: Announcement[] = [
  { id: 'ann-1', title: '【重要】第1日目の開門および受付開始時間について', content: '本日9月12日(土)は午前8:45より正門・東門にて来場受付を開始いたします。招待チケットまたはデジタル入場コードをご準備のうえお並びください。', category: 'general', is_published: true, created_at: new Date().toISOString() },
  { id: 'ann-2', title: '【雨天時変更】中庭ステージ演目の第一体育館への移動案内', content: '10:15開始予定の軽音楽部ライブ「THE NAZUNA BEATS」は、天候への配慮のため中庭特設ステージから第一体育館メインステージへ会場を変更して実施いたします。', category: 'stage', is_published: true, created_at: new Date().toISOString() },
  { id: 'ann-3', title: '【緊急・混雑警報】3年F組お化け屋敷および2年C組カフェの整理券配布状況', content: '大変多くのご来場をいただき、3年F組および2年C組はただいま整理券によるご案内を実施中です。詳細はインフォメーションセンターまたは企画ページからご確認ください。', category: 'urgent', is_published: true, created_at: new Date().toISOString() }
];

export let mockLostItems: LostItem[] = [
  { id: 'lost-1', item_name: '黒い折り畳み傘 (木製ハンドル)', found_place: '第一体育館 入口ベンチ', storage_location: '本館2階総合案内所', status: 'storage', created_at: new Date().toISOString() },
  { id: 'lost-2', item_name: '水色のパスケース・学生証在中', found_place: '中庭 屋台エリアそば', storage_location: '本館2階総合案内所', status: 'storage', created_at: new Date().toISOString() },
  { id: 'lost-3', item_name: 'ワイヤレスイヤホン (白いケース)', found_place: '本館3F 北側階段踊り場', storage_location: '本館2階総合案内所', status: 'returned', created_at: new Date().toISOString() }
];

export let mockPyramidReleases: PyramidRelease[] = pyramidScheduleJson.releases as PyramidRelease[];

// DBからのデータ取得関数
export async function fetchOrganizationsFromDB(): Promise<Organization[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('room_code', { ascending: true });
      if (!error && data && data.length > 0) {
        mockOrganizations = data as Organization[];
        return mockOrganizations;
      }
    } catch {
      // ネットワークまたはDB未接続時
    }
  }
  return mockOrganizations;
}

export async function fetchTimetableEventsFromDB(): Promise<TimetableEvent[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('timetable_events')
        .select('*')
        .order('start_time', { ascending: true });
      if (!error && data && data.length > 0) {
        mockTimetableEvents = data as TimetableEvent[];
        return mockTimetableEvents;
      }
    } catch {
      // ネットワークまたはDB未接続時
    }
  }
  return mockTimetableEvents;
}

export async function fetchTimetableDaysFromDB(): Promise<TimetableDay[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('timetable_days')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        mockTimetableDays = data as TimetableDay[];
        return mockTimetableDays;
      }
    } catch {
      // ネットワーク・DB未接続時
    }
  }
  return mockTimetableDays;
}

export async function createTimetableDayInDB(dayData: Omit<TimetableDay, 'id' | 'is_published'>) {
  const newItem: TimetableDay = {
    id: `day-${Date.now()}`,
    ...dayData,
    is_published: true
  };
  mockTimetableDays = [...mockTimetableDays, newItem];
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('timetable_days').insert([newItem]);
    } catch {}
  }
  return newItem;
}

export async function deleteTimetableDayInDB(id: string) {
  mockTimetableDays = mockTimetableDays.filter((d) => d.id !== id);
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('timetable_days').delete().eq('id', id);
    } catch {}
  }
}

export async function fetchAnnouncementsFromDB(): Promise<Announcement[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        mockAnnouncements = data as Announcement[];
        return mockAnnouncements;
      }
    } catch {
      // ネットワークまたはDB未接続時
    }
  }
  return mockAnnouncements;
}

export async function fetchLostItemsFromDB(): Promise<LostItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('lost_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        mockLostItems = data as LostItem[];
        return mockLostItems;
      }
    } catch {
      // ネットワークまたはDB未接続時
    }
  }
  return mockLostItems;
}

export async function fetchPyramidReleasesFromDB(): Promise<PyramidRelease[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pyramid_releases')
        .select('*')
        .order('scheduled_time', { ascending: true });
      if (!error && data && data.length > 0) {
        mockPyramidReleases = data.map((d: any) => ({
          id: d.id || d.release_id,
          releaseId: d.release_id || d.id,
          title: d.title,
          scheduledTime: d.scheduled_time || d.scheduledTime,
          isEmbargoed: d.is_embargoed ?? d.isEmbargoed,
          embargoMessage: d.embargo_message || d.embargoMessage,
          pyramidTiers: typeof d.pyramid_tiers === 'string' ? JSON.parse(d.pyramid_tiers) : (d.pyramid_tiers || d.pyramidTiers)
        }));
        return mockPyramidReleases;
      }
    } catch {
      // ネットワーク・DB未接続時はフォールバック
    }
  }
  return mockPyramidReleases;
}

export async function updatePyramidReleaseInDB(idOrReleaseId: string, updates: Partial<PyramidRelease>) {
  mockPyramidReleases = mockPyramidReleases.map((r) =>
    (r.id === idOrReleaseId || r.releaseId === idOrReleaseId)
      ? { ...r, ...updates, updated_at: new Date().toISOString() }
      : r
  );
  notifyDataChanged();

  if (supabase) {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.scheduledTime !== undefined) dbUpdates.scheduled_time = updates.scheduledTime;
      if (updates.isEmbargoed !== undefined) dbUpdates.is_embargoed = updates.isEmbargoed;
      if (updates.embargoMessage !== undefined) dbUpdates.embargo_message = updates.embargoMessage;
      if (updates.pyramidTiers !== undefined) dbUpdates.pyramid_tiers = updates.pyramidTiers;

      await supabase.from('pyramid_releases').update(dbUpdates).or(`id.eq.${idOrReleaseId},release_id.eq.${idOrReleaseId}`);
    } catch {
      // オフラインフォールバック
    }
  }
}

// リアルタイム更新用リスナー・エミッター
type ChangeListener = (orgs: Organization[], evts: TimetableEvent[], anns: Announcement[], losts: LostItem[]) => void;
const listeners: ChangeListener[] = [];

export function subscribeToDataChanges(
  onOrgsOrListener: ChangeListener | ((orgs: Organization[]) => void),
  onEvts?: (evts: TimetableEvent[]) => void,
  onAnns?: (anns: Announcement[]) => void,
  onLosts?: (losts: LostItem[]) => void
) {
  const listener: ChangeListener = (orgs, evts, anns, losts) => {
    if (onEvts || onAnns || onLosts) {
      if (onOrgsOrListener) (onOrgsOrListener as (orgs: Organization[]) => void)(orgs);
      if (onEvts) onEvts(evts);
      if (onAnns) onAnns(anns);
      if (onLosts) onLosts(losts);
    } else {
      (onOrgsOrListener as ChangeListener)(orgs, evts, anns, losts);
    }
  };
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function notifyDataChanged() {
  listeners.forEach((l) => l(mockOrganizations, mockTimetableEvents, mockAnnouncements, mockLostItems));
}

// --- 管理画面用 CRUD & トグル操作 (即時反映・リアルタイム同期) ---

// 1. 出展団体操作
export async function toggleOrganizationPublish(id: string, published: boolean) {
  mockOrganizations = mockOrganizations.map((o) =>
    o.id === id ? { ...o, is_published: published, updated_at: new Date().toISOString() } : o
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('organizations').update({ is_published: published, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function updateOrganizationInDB(id: string, updates: Partial<Organization>) {
  mockOrganizations = mockOrganizations.map((o) =>
    o.id === id ? { ...o, ...updates, updated_at: new Date().toISOString() } : o
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('organizations').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function updateOrganizationInventoryInDB(id: string, inventory_status: InventoryStatus) {
  mockOrganizations = mockOrganizations.map((o) =>
    o.id === id ? { ...o, inventory_status, updated_at: new Date().toISOString() } : o
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('organizations').update({ inventory_status, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function updateOrganizationMenuApiInDB(id: string, use_menu_api: boolean, menu_owner_id?: string) {
  mockOrganizations = mockOrganizations.map((o) =>
    o.id === id ? { ...o, use_menu_api, menu_owner_id: menu_owner_id || o.id, updated_at: new Date().toISOString() } : o
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('organizations').update({ use_menu_api, menu_owner_id: menu_owner_id || id, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

// 2. タイムテーブル操作
export async function toggleTimetableEventPublish(id: string, published: boolean) {
  mockTimetableEvents = mockTimetableEvents.map((e) =>
    e.id === id ? { ...e, is_published: published, updated_at: new Date().toISOString() } : e
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('timetable_events').update({ is_published: published, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function updateTimetableEventInDB(id: string, updates: Partial<TimetableEvent>) {
  mockTimetableEvents = mockTimetableEvents.map((e) =>
    e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('timetable_events').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function createTimetableEventInDB(eventData: Omit<TimetableEvent, 'id' | 'updated_at' | 'is_published'>) {
  const newItem: TimetableEvent = {
    id: `evt-${Date.now()}`,
    ...eventData,
    is_published: true,
    updated_at: new Date().toISOString()
  };
  mockTimetableEvents = [...mockTimetableEvents, newItem];
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('timetable_events').insert([newItem]);
    } catch {
      // オフラインフォールバック
    }
  }
  return newItem;
}

export async function deleteTimetableEventInDB(id: string) {
  mockTimetableEvents = mockTimetableEvents.filter((e) => e.id !== id);
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('timetable_events').delete().eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

// 3. お知らせ配信操作
export async function createAnnouncementInDB(title: string, content: string, category: AnnouncementCategory) {
  const newItem: Announcement = {
    id: `ann-${Date.now()}`,
    title,
    content,
    category,
    is_published: true,
    created_at: new Date().toISOString()
  };
  mockAnnouncements = [newItem, ...mockAnnouncements];
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('announcements').insert([newItem]);
    } catch {
      // オフラインフォールバック
    }
  }
  return newItem;
}

export async function toggleAnnouncementPublish(id: string, published: boolean) {
  mockAnnouncements = mockAnnouncements.map((a) =>
    a.id === id ? { ...a, is_published: published } : a
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('announcements').update({ is_published: published }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function deleteAnnouncementInDB(id: string) {
  mockAnnouncements = mockAnnouncements.filter((a) => a.id !== id);
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('announcements').delete().eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

// 4. 落とし物掲示板操作
export async function createLostItemInDB(item_name: string, found_place: string, storage_location?: string, image_url?: string) {
  const newItem: LostItem = {
    id: `lost-${Date.now()}`,
    item_name,
    found_place,
    storage_location: storage_location || '本館2階総合案内所',
    status: 'storage',
    created_at: new Date().toISOString(),
    image_url
  };
  mockLostItems = [newItem, ...mockLostItems];
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('lost_items').insert([newItem]);
    } catch {
      // オフラインフォールバック
    }
  }
  return newItem;
}

export async function updateLostItemInDB(id: string, updates: Partial<LostItem>) {
  mockLostItems = mockLostItems.map((l) =>
    l.id === id ? { ...l, ...updates } : l
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('lost_items').update(updates).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function updateLostItemStatusInDB(id: string, status: LostItemStatus) {
  mockLostItems = mockLostItems.map((l) =>
    l.id === id ? { ...l, status } : l
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('lost_items').update({ status }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function deleteLostItemInDB(id: string) {
  mockLostItems = mockLostItems.filter((l) => l.id !== id);
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('lost_items').delete().eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

// =========================================================================
// 管理者権限 (superadmin / admin) アカウント管理 API
// =========================================================================

export let mockAdminUsers: AdminUser[] = [
  { id: 'usr-superadmin', email: 'superadmin@nazuna.jp', role: 'superadmin', display_name: 'なずな祭 統括管理本部 (Superadmin)', created_at: new Date().toISOString() },
  { id: 'usr-admin-1', email: 'admin@nazuna.jp', role: 'admin', display_name: '文化祭実行委員会 業務担当 (Admin)', created_at: new Date().toISOString() }
];

export async function fetchAdminUsersFromDB(): Promise<AdminUser[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        mockAdminUsers = data as AdminUser[];
        return mockAdminUsers;
      }
    } catch {
      // オフラインまたはDB未接続フォールバック
    }
  }
  return mockAdminUsers;
}

export async function createAdminUserInDB(user: { email: string; role: AdminRole; display_name: string; password?: string }): Promise<AdminUser> {
  const newUser: AdminUser = {
    id: `usr-${Date.now()}`,
    email: user.email,
    role: user.role,
    display_name: user.display_name,
    created_at: new Date().toISOString()
  };
  mockAdminUsers = [...mockAdminUsers, newUser];
  notifyDataChanged();

  if (supabase) {
    try {
      let targetUserId = newUser.id;

      // 1. もしパスワードが入力されている場合、まず Supabase Auth にアカウントを作成・同期
      //    (DB側の RLS/トリガー 'trg_sync_auth_users_to_admin' が発動して自動的に admin_users へ行が作成されます)
      if (user.password) {
        const { data: authData } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              display_name: user.display_name,
              role: user.role
            }
          }
        });
        if (authData?.user?.id) {
          targetUserId = authData.user.id;
          newUser.id = targetUserId;
        }
      }

      // 2. admin_users テーブルの情報を確実に同期（emailで一意連携）
      await supabase.from('admin_users').upsert([{
        id: targetUserId,
        email: user.email,
        role: user.role,
        display_name: user.display_name,
        created_at: newUser.created_at
      }], { onConflict: 'email' });
    } catch {
      // オフラインフォールバック
    }
  }
  return newUser;
}

export async function updateAdminUserInfoInDB(id: string, updates: Partial<AdminUser>): Promise<void> {
  mockAdminUsers = mockAdminUsers.map((u) => (u.id === id ? { ...u, ...updates } : u));
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('admin_users').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
      // メタデータの同期試行
      if (updates.display_name || updates.role) {
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser?.user && (authUser.user.id === id || authUser.user.email === updates.email)) {
          await supabase.auth.updateUser({
            data: {
              display_name: updates.display_name || authUser.user.user_metadata?.display_name,
              role: updates.role || authUser.user.user_metadata?.role
            }
          });
        }
      }
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function updateAdminUserRoleInDB(id: string, role: AdminRole): Promise<void> {
  mockAdminUsers = mockAdminUsers.map((u) => (u.id === id ? { ...u, role } : u));
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('admin_users').update({ role, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function deleteAdminUserInDB(id: string): Promise<void> {
  mockAdminUsers = mockAdminUsers.filter((u) => u.id !== id);
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('admin_users').delete().eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

export async function verifyAdminCredentials(email: string, pass?: string): Promise<AdminUser | null> {
  if (!email || !pass) return null;

  // 1. Supabase Auth による実ログイン試行 (メール＆パスワード)
  if (supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass
      });
      if (!authError && authData.user) {
        const { data: userData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', authData.user.email || email)
          .single();
        if (userData) {
          // Supabase AuthのユーザーIDやメタデータ情報が更新されている場合は同期
          return userData as AdminUser;
        } else {
          // メタデータまたはデフォルトロールでAdminUserを構成し自動登録・連動
          const fallbackUser: AdminUser = {
            id: authData.user.id,
            email: authData.user.email || email,
            role: (authData.user.user_metadata?.role as 'superadmin' | 'admin') || 'admin',
            display_name: authData.user.user_metadata?.display_name || '実行委員会 担当',
            created_at: new Date().toISOString()
          };
          try {
            await supabase.from('admin_users').upsert([fallbackUser], { onConflict: 'email' });
            mockAdminUsers = [...mockAdminUsers.filter(u => u.email !== fallbackUser.email), fallbackUser];
          } catch {
            // テーブル作成権限またはオフラインのフォールバック
          }
          return fallbackUser;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  // 2. ネットワーク/DBオフライン開発環境用 (Supabase未接続時のみ: admin_usersテーブル/モックデータ照合)
  const foundByEmail = mockAdminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (foundByEmail && pass.length >= 6) {
    return foundByEmail;
  }

  return null;
}

