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

export interface VotePyramidData {
  class_id: string;
  rank: number;
  total_votes: number;
  pyramid_tier: 'gold' | 'silver' | 'bronze' | 'normal';
}
