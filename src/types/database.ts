export type OrganizationCategory = 'class' | 'club' | 'volunteer';
export type OrganizationGenre = 'food' | 'exhibition' | 'attraction' | 'stage';
export type InventoryStatus = 'STATUS_AVAILABLE' | 'STATUS_FEW' | 'STATUS_SOLD_OUT';
export type StageLocation = 'gym' | 'courtyard' | 'av_room';

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
}

export interface TimetableEvent {
  id: string;
  organization_id?: string;
  title: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  stage_location: StageLocation;
  is_published: boolean;
  updated_at: string;
  organization_name?: string;
}

export type PyramidTierLevel = 'high' | 'upper' | 'middle' | 'normal' | 'embargoed';

export interface VotePyramidData {
  class_id: string;
  pyramid_tier: PyramidTierLevel; // 'high': 高(頂点層), 'upper': 上(上層), 'middle': 中(中核層)
  tier_label: '高' | '上' | '中' | '一般' | '集計ロック・非表示';
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
}
