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
  PyramidRelease,
  PageSetting
} from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// 管理画面およびローカルプレビュー環境ですぐに全機能を使用できるよう初期状態シードデータを用意
// プログラム内で初期状態シードデータを用意せず、すべてDBから参照する
export let mockOrganizations: Organization[] = [];
export let mockTimetableDays: TimetableDay[] = [];
export let mockTimetableEvents: TimetableEvent[] = [];
export let mockAnnouncements: Announcement[] = [];
export let mockLostItems: LostItem[] = [];
export let mockPyramidReleases: PyramidRelease[] = [];
export let mockPageSettings: PageSetting[] = [
  { id: 'home', title: 'トップページ', is_public: true, custom_message: '現在メンテナンス中です。しばらくお待ちください。' },
  { id: 'news', title: '実行委員会からのお知らせ', is_public: true, custom_message: '現在、お知らせ準備中です。公開までしばらくお待ちください。' },
  { id: 'exhibitions', title: '出し物・展示 企画一覧', is_public: true, custom_message: '現在、企画詳細を最終調整中です。公開までしばらくお待ちください。' },
  { id: 'timetable', title: 'タイムテーブル', is_public: true, custom_message: '現在、ステージスケジュールを最終調整中です。公開までしばらくお待ちください。' },
  { id: 'map', title: '校内マップ', is_public: true, custom_message: '現在、校内マップを準備中です。公開までしばらくお待ちください。' },
  { id: 'guidance', title: 'ご案内・総合案内所', is_public: true, custom_message: '現在準備中です。公開までしばらくお待ちください。' },
  { id: 'info', title: 'テーマ「百輝夜行」について', is_public: true, custom_message: '現在準備中です。公開までしばらくお待ちください。' },
  { id: 'lostfound', title: '落とし物掲示板', is_public: true, custom_message: '現在準備中です。公開までしばらくお待ちください。' },
  { id: 'policy', title: 'プライバシー＆サイトポリシー', is_public: true, custom_message: '現在準備中です。公開までしばらくお待ちください。' }
];

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
      if (!error && data) {
        mockPyramidReleases = data.map((d: any) => ({
          id: d.id || d.release_id,
          releaseId: d.release_id || d.id,
          title: d.title,
          scheduledTime: d.scheduled_time || d.scheduledTime,
          isEmbargoed: d.is_embargoed ?? d.isEmbargoed,
          embargoMessage: d.embargo_message || d.embargoMessage,
          pyramidTiers: typeof d.pyramid_tiers === 'string' ? JSON.parse(d.pyramid_tiers) : (d.pyramid_tiers || d.pyramidTiers || { high: [], upper: [], middle: [] })
        }));
        return mockPyramidReleases;
      }
    } catch {
      // ネットワーク・DB未接続時
    }
  }
  return mockPyramidReleases;
}

export async function createPyramidReleaseInDB(releaseData: {
  title: string;
  scheduledTime: string;
  embargoMessage: string;
  isEmbargoed?: boolean;
  pyramidTiers?: { high: string[]; upper: string[]; middle: string[] };
}): Promise<PyramidRelease> {
  const newId = `rel_${crypto.randomUUID()}`;
  const newItem: PyramidRelease = {
    id: newId,
    releaseId: newId,
    title: releaseData.title,
    scheduledTime: releaseData.scheduledTime,
    isEmbargoed: releaseData.isEmbargoed ?? false,
    embargoMessage: releaseData.embargoMessage,
    pyramidTiers: releaseData.pyramidTiers || { high: [], upper: [], middle: [] },
    updated_at: new Date().toISOString()
  };
  mockPyramidReleases = [...mockPyramidReleases, newItem];
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('pyramid_releases').insert([{
        id: newId,
        release_id: newId,
        title: newItem.title,
        scheduled_time: newItem.scheduledTime,
        is_embargoed: newItem.isEmbargoed,
        embargo_message: newItem.embargoMessage,
        pyramid_tiers: newItem.pyramidTiers,
        updated_at: newItem.updated_at
      }]);
    } catch {
      // オフラインフォールバック
    }
  }
  return newItem;
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

export async function deletePyramidReleaseInDB(idOrReleaseId: string) {
  mockPyramidReleases = mockPyramidReleases.filter((r) => r.id !== idOrReleaseId && r.releaseId !== idOrReleaseId);
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('pyramid_releases').delete().or(`id.eq.${idOrReleaseId},release_id.eq.${idOrReleaseId}`);
    } catch {
      // オフラインフォールバック
    }
  }
}

// ページ公開設定の取得と操作
export async function fetchPageSettingsFromDB(): Promise<PageSetting[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        mockPageSettings = data as PageSetting[];
        return mockPageSettings;
      }
    } catch {
      // ネットワーク・DB未接続時
    }
  }
  return mockPageSettings;
}

export async function updatePageSettingInDB(id: string, updates: Partial<PageSetting>): Promise<void> {
  mockPageSettings = mockPageSettings.map((p) =>
    p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
  );
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('page_settings').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {
      // オフラインフォールバック
    }
  }
}

// リアルタイム更新用リスナー・エミッター
type ChangeListener = (orgs: Organization[], evts: TimetableEvent[], anns: Announcement[], losts: LostItem[], pages: PageSetting[]) => void;
const listeners: ChangeListener[] = [];

export function subscribeToDataChanges(
  onOrgsOrListener: ChangeListener | ((orgs: Organization[]) => void),
  onEvts?: (evts: TimetableEvent[]) => void,
  onAnns?: (anns: Announcement[]) => void,
  onLosts?: (losts: LostItem[]) => void,
  onPages?: (pages: PageSetting[]) => void
) {
  const listener: ChangeListener = (orgs, evts, anns, losts, pages) => {
    if (onEvts || onAnns || onLosts || onPages) {
      if (onOrgsOrListener) (onOrgsOrListener as (orgs: Organization[]) => void)(orgs);
      if (onEvts) onEvts(evts);
      if (onAnns) onAnns(anns);
      if (onLosts) onLosts(losts);
      if (onPages) onPages(pages);
    } else {
      (onOrgsOrListener as ChangeListener)(orgs, evts, anns, losts, pages);
    }
  };
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function notifyDataChanged() {
  listeners.forEach((l) => l(mockOrganizations, mockTimetableEvents, mockAnnouncements, mockLostItems, mockPageSettings));
}

// --- 管理画面用 CRUD & トグル操作 (即時反映・リアルタイム同期) ---

// 1. 出展団体操作
export async function createOrganizationInDB(orgData: Omit<Organization, 'id' | 'updated_at'>): Promise<Organization> {
  const newItem: Organization = {
    ...orgData,
    id: crypto.randomUUID(),
    updated_at: new Date().toISOString()
  };
  mockOrganizations = [newItem, ...mockOrganizations];
  notifyDataChanged();

  if (supabase) {
    try {
      await supabase.from('organizations').insert([newItem]);
    } catch {
      // オフラインフォールバック
    }
  }
  return newItem;
}

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
  mockOrganizations = mockOrganizations.map((o) => {
    if (o.id !== id) return o;
    const finalOwnerId = menu_owner_id !== undefined ? menu_owner_id : (o.menu_owner_id || id);
    return { ...o, use_menu_api, menu_owner_id: finalOwnerId, updated_at: new Date().toISOString() };
  });
  notifyDataChanged();

  if (supabase) {
    try {
      const finalOwnerId = menu_owner_id !== undefined ? menu_owner_id : id;
      await supabase.from('organizations').update({ use_menu_api, menu_owner_id: finalOwnerId, updated_at: new Date().toISOString() }).eq('id', id);
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
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
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

export let mockAdminUsers: AdminUser[] = [];

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
  let targetUserId: string = crypto.randomUUID();
  const newUser: AdminUser = {
    id: targetUserId,
    email: user.email,
    role: user.role,
    display_name: user.display_name,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    // 1. もしパスワードが入力されている場合、まず Supabase Auth にアカウントを作成・同期
    //    (現在のログインセッションを上書きしないよう、セッション保持・自動更新をオフにした専用クライアントで実行)
    if (user.password) {
      const tempClient = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            display_name: user.display_name,
            role: user.role
          }
        }
      });
      if (authError) {
        const msg = (authError.message || '').toLowerCase();
        if (authError.status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
          throw new Error('【レート制限(429)】短時間での新規アカウント作成が集中し、Supabase Authのレート制限に達しました。時間をおいて再試行するか、Supabaseダッシュボード (Authentication > Rate Limits > Email rate limit) で制限を緩和してください。');
        } else if (authError.message === 'User already registered' || msg.includes('already registered') || msg.includes('already exists')) {
          throw new Error('【登録済み(400)】このメールアドレスは既にSupabase Authに登録されています。');
        } else if (msg.includes('password should be at least') || msg.includes('weak password')) {
          throw new Error('【パスワード要件(400)】パスワードは6文字以上で設定してください。');
        } else if (msg.includes('signups not allowed') || msg.includes('signups are disabled')) {
          throw new Error('【新規登録オフ(400)】Supabaseの認証設定で新規登録(SignUp)がオフになっています。Supabaseダッシュボード (Authentication > Providers > Email > Enable Signups) を有効にしてください。');
        } else if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
          throw new Error('【形式エラー(400)】有効なメールアドレスの形式で入力してください。');
        } else {
          throw new Error(`認証登録エラー (${authError.status || '400'}): ${authError.message}`);
        }
      }
      if (authData?.user?.id) {
        targetUserId = authData.user.id;
        newUser.id = targetUserId;
      }
    }

    // 2. admin_users テーブルの情報を確実に同期（email または id で既存確認の上、update/insert を切り分け）
    const { data: existingByEmail } = await supabase.from('admin_users').select('id').eq('email', user.email).maybeSingle();
    if (existingByEmail) {
      const { error: updateError } = await supabase.from('admin_users').update({
        role: user.role,
        display_name: user.display_name,
        updated_at: new Date().toISOString()
      }).eq('id', existingByEmail.id);
      if (updateError) throw updateError;
    } else {
      const { data: existingById } = await supabase.from('admin_users').select('id').eq('id', targetUserId).maybeSingle();
      if (existingById) {
        const { error: updateIdError } = await supabase.from('admin_users').update({
          email: user.email,
          role: user.role,
          display_name: user.display_name,
          updated_at: new Date().toISOString()
        }).eq('id', targetUserId);
        if (updateIdError) throw updateIdError;
      } else {
        const { error: insertError } = await supabase.from('admin_users').insert([{
          id: targetUserId,
          email: user.email,
          role: user.role,
          display_name: user.display_name,
          created_at: newUser.created_at
        }]);
        if (insertError) throw insertError;
      }
    }
  }

  mockAdminUsers = [...mockAdminUsers.filter(u => u.email !== newUser.email), newUser];
  notifyDataChanged();
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
          .maybeSingle();
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
            const { data: existingById } = await supabase.from('admin_users').select('id').eq('id', authData.user.id).maybeSingle();
            if (existingById) {
              await supabase.from('admin_users').update({
                email: fallbackUser.email,
                role: fallbackUser.role,
                display_name: fallbackUser.display_name
              }).eq('id', authData.user.id);
            } else {
              await supabase.from('admin_users').insert([fallbackUser]);
            }
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

