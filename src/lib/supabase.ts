import { createClient } from '@supabase/supabase-js';
import type { Organization, TimetableEvent } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.nazuna.jp';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// モック・インメモリデータストア（環境変数がない・またはローカル検証時に完全に動く）
export let mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: '3年A組 幻影茶屋・百夜の宴',
    category: 'class',
    genre: 'food',
    description: '和モダンを追求した特製抹茶ラテと手作り団子をご提供します。静寂なる極夜に灯る赤提灯のもとで、特別な和スイーツをお楽しみください。',
    image_url: '/assets/poster/poster_complete.png',
    room_code: '3A_ROOM',
    floor_info: '本館3F 西棟',
    is_published: true,
    updated_at: new Date().toISOString(),
    inventory_status: 'STATUS_AVAILABLE'
  },
  {
    id: 'org-2',
    name: '3年B組 迷宮・あやかしの館',
    category: 'class',
    genre: 'attraction',
    description: '最先端の照明と音響で演出する和風ホラーアトラクション。赤傘が舞う暗闇を抜け、無事に脱出できるか挑戦してください。',
    image_url: '/assets/poster/poster_complete.png',
    room_code: '3B_ROOM',
    floor_info: '本館3F 中央棟',
    is_published: true,
    updated_at: new Date().toISOString(),
    inventory_status: 'STATUS_FEW'
  },
  {
    id: 'org-3',
    name: '2年C組 百輝焼きそば本舗',
    category: 'class',
    genre: 'food',
    description: '秘伝の特製ソースとシャキシャキキャベツで焼き上げる絶品屋台焼きそば！ポスターキーカラーを模した赤紅生姜つき。',
    image_url: '/assets/poster/poster_complete.png',
    room_code: '2C_ROOM',
    floor_info: '中庭 屋台スペース',
    is_published: true,
    updated_at: new Date().toISOString(),
    inventory_status: 'STATUS_SOLD_OUT'
  },
  {
    id: 'org-4',
    name: '書道部・蒼墨会',
    category: 'club',
    genre: 'exhibition',
    description: '今年度のテーマ「百輝夜行」の題字およびポスター輪郭を手掛けた部員による大作展示会。巨大筆文字の迫力を体感してください。',
    image_url: '/assets/poster/poster_complete.png',
    room_code: 'SHODO_ROOM',
    floor_info: '東館2F 書道室',
    is_published: true,
    updated_at: new Date().toISOString(),
    inventory_status: 'STATUS_AVAILABLE'
  },
  {
    id: 'org-5',
    name: 'ダンス部・LUMINOUS',
    category: 'club',
    genre: 'stage',
    description: '夜を照らすホタルのように舞い踊る圧巻のステージ演目。ヒップホップからコンテンポラリーまで、全8曲をお届けします。',
    image_url: '/assets/poster/poster_complete.png',
    room_code: 'GYM_STAGE',
    floor_info: '第一体育館',
    is_published: true,
    updated_at: new Date().toISOString(),
    inventory_status: 'STATUS_AVAILABLE'
  },
  {
    id: 'org-6',
    name: '科学部・サイバー工学班',
    category: 'club',
    genre: 'exhibition',
    description: 'レーザー光線とスモークを用いた光学アートの没入型展示。ネオンの青と金が交差する幻想空間を創り出します。',
    image_url: '/assets/poster/poster_complete.png',
    room_code: 'SCIENCE_ROOM',
    floor_info: '理科棟3F 物理実験室',
    is_published: true,
    updated_at: new Date().toISOString(),
    inventory_status: 'STATUS_AVAILABLE'
  }
];

export let mockTimetableEvents: TimetableEvent[] = [
  {
    id: 'evt-1',
    organization_id: 'org-5',
    title: 'ダンス部 OPパフォーマンス「百夜の目覚め」',
    start_time: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 現在進行中（NOWハイライトテスト用）
    end_time: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    stage_location: 'gym',
    is_published: true,
    updated_at: new Date().toISOString(),
    organization_name: 'ダンス部・LUMINOUS'
  },
  {
    id: 'evt-2',
    title: '書道部 音楽コラボ書道パフォーマンス',
    start_time: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    stage_location: 'gym',
    is_published: true,
    updated_at: new Date().toISOString(),
    organization_name: '書道部・蒼墨会'
  },
  {
    id: 'evt-3',
    title: '有志バンド「THE NAZUNA NEON」スペシャルライブ',
    start_time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 現在進行中
    end_time: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    stage_location: 'courtyard',
    is_published: true,
    updated_at: new Date().toISOString(),
    organization_name: '有志バンド団体'
  },
  {
    id: 'evt-4',
    title: '軽音楽部 「極夜のロックフェスティバル」',
    start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    stage_location: 'courtyard',
    is_published: true,
    updated_at: new Date().toISOString(),
    organization_name: '軽音楽部'
  },
  {
    id: 'evt-5',
    title: '演劇部 公演「あやかしの街角で」',
    start_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 70 * 60 * 1000).toISOString(),
    stage_location: 'av_room',
    is_published: true,
    updated_at: new Date().toISOString(),
    organization_name: '演劇部'
  }
];

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

export function toggleOrganizationPublish(id: string, published: boolean) {
  mockOrganizations = mockOrganizations.map((o) =>
    o.id === id ? { ...o, is_published: published, updated_at: new Date().toISOString() } : o
  );
  notifyDataChanged();
}

export function toggleTimetableEventPublish(id: string, published: boolean) {
  mockTimetableEvents = mockTimetableEvents.map((e) =>
    e.id === id ? { ...e, is_published: published, updated_at: new Date().toISOString() } : e
  );
  notifyDataChanged();
}
