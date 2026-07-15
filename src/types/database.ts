export type OrganizationCategory = 'class' | 'club' | 'volunteer';
export type OrganizationGenre = 'food' | 'exhibition' | 'attraction' | 'stage';
export type InventoryStatus = 'STATUS_AVAILABLE' | 'STATUS_FEW' | 'STATUS_SOLD_OUT' | 'STATUS_PREPARING';
export type StageLocation = 'gym' | 'courtyard' | 'av_room' | 'kunieda_hall' | 'koga_arena' | 'n_stage';

// NazunaGraph (Public Items API /api/items) インターフェース定義
export interface NazunaGraphItemStatus {
  id: number;
  color: string;
  label: string; // '販売中' | '残りわずか' | '完売' | '準備中'
}

export interface NazunaGraphItemCategory {
  id: number;
  name: string;
}

export interface NazunaGraphItemOwner {
  id: string;
  image_url?: string;
  group_name: string;
  description?: string;
  display_name: string;
}

export interface NazunaGraphItem {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  updated_at: string;
  category_id: number;
  status_id: number;
  owner_id: string;
  status: NazunaGraphItemStatus;
  category: NazunaGraphItemCategory;
  owner: NazunaGraphItemOwner;
}

export interface Organization {
  id: string;
  name: string;
  category: OrganizationCategory;
  genre: OrganizationGenre;
  description: string;
  image_url?: string;
  room_code: string;
  floor_info: string;
  is_published: boolean;
  updated_at: string;
  // リアルタイム在庫APIから取得または紐付けられる状況
  inventory_status?: InventoryStatus;
  // NazunaGraph (メニュー在庫API) 自動連携設定
  use_menu_api?: boolean;
  menu_owner_id?: string;
}

export interface TimetableDay {
  id: string; // 例: 'day-1', 'day-2'
  date_string: string; // 例: '2026-09-19'
  label: string; // 例: 'DAY 1 (9/19)'
  is_published: boolean;
  display_order: number;
}

export interface TimetableEvent {
  id: string;
  organization_id?: string;
  day_id?: string; // 対象の日付ID ('day-1', 'day-2'等)
  title: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  stage_location: StageLocation;
  is_published: boolean;
  updated_at: string;
  organization_name?: string;
  description?: string;
}

export type PyramidTierLevel = 'high' | 'upper' | 'middle' | 'normal' | 'embargoed';

export interface PyramidRelease {
  id: string; // 'day1_noon', 'day1_evening', 'day2_noon', 'day2_final_pre_embargo'等
  releaseId: string;
  title: string;
  scheduledTime: string;
  isEmbargoed: boolean;
  embargoMessage?: string;
  pyramidTiers?: {
    high: string[];
    upper: string[];
    middle: string[];
  };
  updated_at?: string;
}

export interface VotePyramidData {
  class_id: string;
  pyramid_tier: PyramidTierLevel; // 'high': 高(頂点層), 'upper': 上(上層), 'middle': 中(中核層)
  tier_label: '高' | '上' | '中' | '一般' | '集計ロック・非表示' | '集計準備中';
  release_title: string;
  is_embargoed: boolean;
  embargo_message?: string;
}

export type AnnouncementCategory = 'urgent' | 'general' | 'stage';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  is_published: boolean;
  created_at: string;
}

export type LostItemStatus = 'storage' | 'returned';

export interface LostItem {
  id: string;
  item_name: string;
  found_place: string;
  storage_location: string;
  status: LostItemStatus;
  created_at: string;
  image_url?: string;
}

export type AdminRole = 'superadmin' | 'admin';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  display_name: string;
  created_at: string;
}

export interface PageSetting {
  id: 'home' | 'exhibitions' | 'timetable' | 'map' | 'news' | 'info' | 'lostfound' | 'guidance' | 'policy' | string;
  title: string;
  is_public: boolean;
  custom_message?: string;
  updated_at?: string;
}

