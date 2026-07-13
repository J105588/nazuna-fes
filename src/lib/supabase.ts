import { createClient } from '@supabase/supabase-js';
import type {
  Organization,
  TimetableEvent,
  Announcement,
  LostItem,
  InventoryStatus,
  LostItemStatus,
  AnnouncementCategory
} from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// フロントエンドにはDBから読み込む予定のものたちは何も事前データを書き込まないため初期値は空配列 []
export let mockOrganizations: Organization[] = [];
export let mockTimetableEvents: TimetableEvent[] = [];
export let mockAnnouncements: Announcement[] = [];
export let mockLostItems: LostItem[] = [];

// DBからのデータ取得関数
export async function fetchOrganizationsFromDB(): Promise<Organization[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('room_code', { ascending: true });
      if (!error && data) {
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
      if (!error && data) {
        mockTimetableEvents = data as TimetableEvent[];
        return mockTimetableEvents;
      }
    } catch {
      // ネットワークまたはDB未接続時
    }
  }
  return mockTimetableEvents;
}

export async function fetchAnnouncementsFromDB(): Promise<Announcement[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
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
      if (!error && data) {
        mockLostItems = data as LostItem[];
        return mockLostItems;
      }
    } catch {
      // ネットワークまたはDB未接続時
    }
  }
  return mockLostItems;
}

// リアルタイム更新用リスナー・エミッター
type ChangeListener = () => void;
const listeners: ChangeListener[] = [];

export function subscribeToDataChanges(listener: ChangeListener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function notifyDataChanged() {
  listeners.forEach((l) => l());
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
export async function createLostItemInDB(item_name: string, found_place: string, storage_location: string) {
  const newItem: LostItem = {
    id: `lost-${Date.now()}`,
    item_name,
    found_place,
    storage_location,
    status: 'storage',
    created_at: new Date().toISOString()
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
