import React, { useState } from 'react';
import type {
  Organization,
  TimetableEvent,
  Announcement,
  LostItem,
  AnnouncementCategory,
  StageLocation,
  OrganizationCategory,
  OrganizationGenre
} from '../../types/database';
import {
  toggleOrganizationPublish,
  toggleTimetableEventPublish,
  updateOrganizationInDB,
  updateTimetableEventInDB,
  updateOrganizationInventoryInDB,
  createAnnouncementInDB,
  toggleAnnouncementPublish,
  deleteAnnouncementInDB,
  createLostItemInDB,
  updateLostItemStatusInDB,
  deleteLostItemInDB
} from '../../lib/supabase';
import {
  ShieldAlert,
  Power,
  Layers,
  Calendar,
  LogOut,
  Sparkles,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  PackageCheck,
  Bell,
  Search,
  PlusCircle,
  Trash2,
  FileText,
  X,
  Lock,
  Unlock,
  TrendingUp
} from 'lucide-react';
import { OfficialPyramidGraphic } from '../common/OfficialPyramidGraphic';
import pyramidSchedule from '../../data/pyramidSchedule.json';

interface AdminDashboardProps {
  organizations: Organization[];
  timetableEvents: TimetableEvent[];
  announcements: Announcement[];
  lostItems: LostItem[];
  role: 'admin' | 'shift';
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  organizations,
  timetableEvents,
  announcements,
  lostItems,
  role,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'orgs' | 'events' | 'inventory' | 'announcements' | 'lostfound' | 'pyramid' | 'manual'>(
    role === 'shift' ? 'inventory' : 'orgs'
  );
  const [selectedReleaseIndex, setSelectedReleaseIndex] = useState(0);
  const [isEmbargoLocked, setIsEmbargoLocked] = useState(false);

  // 出展団体 編集モーダル用 State
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgForm, setOrgForm] = useState<{
    name: string;
    description: string;
    image_url: string;
    room_code: string;
    floor_info: string;
    category: OrganizationCategory;
    genre: OrganizationGenre;
  }>({
    name: '',
    description: '',
    image_url: '',
    room_code: '',
    floor_info: '',
    category: 'class',
    genre: 'food'
  });

  // タイムテーブル 編集モーダル用 State
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [eventForm, setEventForm] = useState<{
    title: string;
    start_time: string;
    end_time: string;
    stage_location: StageLocation;
    organization_name: string;
  }>({
    title: '',
    start_time: '',
    end_time: '',
    stage_location: 'gym',
    organization_name: ''
  });

  // お知らせ新規作成用 State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<AnnouncementCategory>('general');

  // 落とし物新規登録用 State
  const [lostName, setLostName] = useState('');
  const [lostPlace, setLostPlace] = useState('');
  const [lostStorage, setLostStorage] = useState('本部棟1F インフォメーションセンター保管中');

  // 時間フォーマット変換ヘルパー
  const formatTimeInput = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '12:00';
      return d.toTimeString().slice(0, 5);
    } catch {
      return '12:00';
    }
  };

  const applyTimeChangeToIso = (origIso: string, newTimeStr: string) => {
    try {
      const d = new Date(origIso);
      const [hh, mm] = newTimeStr.split(':').map(Number);
      d.setHours(hh || 0, mm || 0, 0, 0);
      return d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  const handleOpenOrgEdit = (org: Organization) => {
    setEditingOrg(org);
    setOrgForm({
      name: org.name,
      description: org.description,
      image_url: org.image_url || '/assets/poster/poster_complete.png',
      room_code: org.room_code,
      floor_info: org.floor_info,
      category: org.category,
      genre: org.genre
    });
  };

  const handleSaveOrgEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    await updateOrganizationInDB(editingOrg.id, orgForm);
    setEditingOrg(null);
  };

  const handleOpenEventEdit = (evt: TimetableEvent) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title,
      start_time: formatTimeInput(evt.start_time),
      end_time: formatTimeInput(evt.end_time),
      stage_location: evt.stage_location,
      organization_name: evt.organization_name || ''
    });
  };

  const handleSaveEventEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    await updateTimetableEventInDB(editingEvent.id, {
      title: eventForm.title,
      start_time: applyTimeChangeToIso(editingEvent.start_time, eventForm.start_time),
      end_time: applyTimeChangeToIso(editingEvent.end_time, eventForm.end_time),
      stage_location: eventForm.stage_location,
      organization_name: eventForm.organization_name
    });
    setEditingEvent(null);
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    await createAnnouncementInDB(annTitle, annContent, annCategory);
    setAnnTitle('');
    setAnnContent('');
    setAnnCategory('general');
  };

  const handleCreateLostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostName || !lostPlace) return;
    await createLostItemInDB(lostName, lostPlace, lostStorage);
    setLostName('');
    setLostPlace('');
    setLostStorage('本部棟1F インフォメーションセンター保管中');
  };

  return (
    <div className="space-y-8 animate-fade-in py-6 font-sans text-wafuu-sumi select-none">
      {/* 管理ヘッダーバー */}
      <div className="wafuu-panel p-6 sm:p-8 rounded-3xl border border-wafuu-sumi/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden shadow-sm bg-white">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-wafuu-shu/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4.5 relative z-10">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark text-white shadow-sm border border-wafuu-ekasumi/40">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="status-pill status-available text-xs font-mono font-bold">
                AUTHENTICATED SESSION ({role.toUpperCase()})
              </span>
              <span className="text-xs text-wafuu-text-sub font-semibold">
                {role === 'admin' ? '実行委員会・教職員 管理権限' : '当日シフト・広報部 権限'}
              </span>
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl text-wafuu-sumi tracking-wider mt-1 font-serif">
              オンデマンド即時制御・統合管理ダッシュボード
            </h2>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="py-3 px-5 rounded-2xl font-bold text-xs bg-wafuu-kinari hover:bg-wafuu-shu text-wafuu-sumi hover:text-white border border-wafuu-sumi/10 flex items-center gap-2.5 self-start sm:self-center shadow-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>管理セッションログアウト</span>
        </button>
      </div>

      {/* タブ切り替えナビゲーション */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[#D4AF37]/30 pb-4">
        {role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('orgs')}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'orgs'
                  ? 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white border-2 border-[#F5D061] shadow-[0_6px_20px_rgba(229,25,55,0.6)] scale-105'
                  : 'text-white/70 hover:text-white bg-[#1b120c]/80 border border-[#D4AF37]/25'
              }`}
            >
              <Layers className="w-4 h-4 text-[#F5D061]" />
              <span>団体紹介文・画像・公開制御 ({organizations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'events'
                  ? 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white border-2 border-[#F5D061] shadow-[0_6px_20px_rgba(229,25,55,0.6)] scale-105'
                  : 'text-white/70 hover:text-white bg-[#1b120c]/80 border border-[#D4AF37]/25'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#F5D061]" />
              <span>タイムテーブル時間変更 ({timetableEvents.length})</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'inventory'
              ? 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white border-2 border-[#F5D061] shadow-[0_6px_20px_rgba(229,25,55,0.6)] scale-105'
              : 'text-white/70 hover:text-white bg-[#1b120c]/80 border border-[#D4AF37]/25'
          }`}
        >
          <PackageCheck className="w-4 h-4 text-[#FFE895]" />
          <span>シフト端末：在庫・混雑 3段階クイック更新</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'announcements'
              ? 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white border-2 border-[#F5D061] shadow-[0_6px_20px_rgba(229,25,55,0.6)] scale-105'
              : 'text-white/70 hover:text-white bg-[#1b120c]/80 border border-[#D4AF37]/25'
          }`}
        >
          <Bell className="w-4 h-4 text-[#F5D061]" />
          <span>お知らせ配信システム ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lostfound')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'lostfound'
              ? 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white border-2 border-[#F5D061] shadow-[0_6px_20px_rgba(229,25,55,0.6)] scale-105'
              : 'text-white/70 hover:text-white bg-[#1b120c]/80 border border-[#D4AF37]/25'
          }`}
        >
          <Search className="w-4 h-4 text-[#FFE895]" />
          <span>落とし物掲示板 配信管理 ({lostItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pyramid')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'pyramid'
              ? 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white border-2 border-[#F5D061] shadow-[0_6px_20px_rgba(229,25,55,0.6)] scale-105'
              : 'text-white/70 hover:text-white bg-[#1b120c]/80 border border-[#D4AF37]/25'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#F5D061]" />
          <span>ピラミッド評価配信 JSON管理 (1日2回開示)</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'manual'
              ? 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white border-2 border-[#F5D061] shadow-[0_6px_20px_rgba(229,25,55,0.6)] scale-105'
              : 'text-white/70 hover:text-white bg-[#1b120c]/80 border border-[#D4AF37]/25'
          }`}
        >
          <FileText className="w-4 h-4 text-[#F5D061]" />
          <span>操作マニュアル・ガイド</span>
        </button>
      </div>

      {/* 1. 出展団体マスタ・紹介文修正・画像差し替え・オンデマンド公開スイッチ */}
      {activeTab === 'orgs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#1b120c]/90 border border-[#D4AF37]/40 flex items-center justify-between text-xs sm:text-sm text-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#F5D061]" />
              <span>「公開/非公開」トグルスイッチを操作すると、DBの公開フラグが即座に書き換わり、一般公開サイトの検索結果・展示一覧にプログラムやリブートを介さずリアルタイムに反映されます。</span>
            </div>
          </div>

          {organizations.map((org) => {
            const isPub = org.is_published;
            return (
              <div
                key={org.id}
                className={`wamodern-panel p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  isPub ? 'border-[#D4AF37]/50 bg-[#160f0a]' : 'border-[#E51937]/80 bg-[#1f0b12] opacity-80'
                }`}
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge bg-[#1b120c] text-[#F5D061] border border-[#D4AF37]/60 text-xs">
                      {org.category === 'class' ? 'クラス展示' : org.category === 'club' ? '部活動・委員会' : '有志企画'}
                    </span>
                    <span className="font-mono text-xs font-bold text-white/90 bg-black/50 px-3 py-1 rounded-lg border border-white/10">
                      教室コード: {org.room_code} | {org.floor_info}
                    </span>
                  </div>
                  <h4 className="font-bold text-xl text-white tracking-wide">{org.name}</h4>
                  <p className="text-xs sm:text-sm text-[#E2E8F0]/80 leading-relaxed line-clamp-2">{org.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3.5 self-start md:self-center">
                  <button
                    onClick={() => handleOpenOrgEdit(org)}
                    className="py-3 px-5 rounded-2xl font-bold text-xs btn-wamodern-gold flex items-center gap-2 shadow-md"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>紹介文修正・画像差し替え</span>
                  </button>

                  <button
                    onClick={() => toggleOrganizationPublish(org.id, !isPub)}
                    className={`p-3.5 px-6 rounded-2xl border transition-all flex items-center gap-2.5 font-bold text-xs sm:text-sm shadow-xl ${
                      isPub
                        ? 'bg-[#E51937] text-white hover:bg-[#b80e26] border-[#F5D061]/80 shadow-[0_0_20px_rgba(229,25,55,0.7)]'
                        : 'bg-[#102a1c] text-[#4af096] hover:bg-[#183d29] border-[#4af096]/60 shadow-[0_0_20px_rgba(74,240,150,0.4)]'
                    }`}
                  >
                    <Power className="w-4.5 h-4.5" />
                    <span>{isPub ? '公開中（クリックで即時非公開化）' : '非公開（クリックで即時公開する）'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. タイムテーブル ステージ演目 急な時間変更＆オンデマンド公開スイッチ */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#1b120c]/90 border border-[#D4AF37]/40 flex items-center justify-between text-xs sm:text-sm text-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#F5D061]" />
              <span>当日の急な進行遅延・演目時間変更をその場で入力・保存できます。保存と同時に一般タイムテーブル画面の時間割・自動NOW追従へ即時適用されます。</span>
            </div>
          </div>

          {timetableEvents.map((evt) => {
            const isPub = evt.is_published;
            return (
              <div
                key={evt.id}
                className={`wamodern-panel p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  isPub ? 'border-[#D4AF37]/50 bg-[#160f0a]' : 'border-[#E51937]/80 bg-[#1f0b12] opacity-80'
                }`}
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3 font-mono text-xs sm:text-sm text-[#F5D061] font-bold">
                    <span className="bg-black/60 px-3 py-1 rounded-xl border border-[#D4AF37]/40">
                      {new Date(evt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 〜 {new Date(evt.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="badge bg-[#1b120c] text-white border border-white/20 text-xs">
                      {evt.stage_location === 'gym' ? '第一体育館' : evt.stage_location === 'courtyard' ? '中庭特設ステージ' : '視聴覚室ステージ'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xl text-white tracking-wide">{evt.title}</h4>
                  <p className="text-xs text-[#E2E8F0]/70">出演団体：{evt.organization_name || '公式プログラム'}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3.5 self-start md:self-center">
                  <button
                    onClick={() => handleOpenEventEdit(evt)}
                    className="py-3 px-5 rounded-2xl font-bold text-xs btn-wamodern-gold flex items-center gap-2 shadow-md"
                  >
                    <Clock className="w-4 h-4" />
                    <span>急な時間変更・演目編集</span>
                  </button>

                  <button
                    onClick={() => toggleTimetableEventPublish(evt.id, !isPub)}
                    className={`p-3.5 px-6 rounded-2xl border transition-all flex items-center gap-2.5 font-bold text-xs sm:text-sm shadow-xl ${
                      isPub
                        ? 'bg-[#E51937] text-white hover:bg-[#b80e26] border-[#F5D061]/80 shadow-[0_0_20px_rgba(229,25,55,0.7)]'
                        : 'bg-[#102a1c] text-[#4af096] hover:bg-[#183d29] border-[#4af096]/60 shadow-[0_0_20px_rgba(74,240,150,0.4)]'
                    }`}
                  >
                    <Power className="w-4.5 h-4.5" />
                    <span>{isPub ? 'タイムテーブル公開中' : '非公開（時間割から除外中）'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. シフト担当者用：喫茶展示・物販・アトラクション 在庫混雑状況 3段階更新パネル */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="wamodern-panel p-6 rounded-3xl border border-[#D4AF37]/50 space-y-3 bg-gradient-to-r from-[#1b120c] to-[#140e0a]">
            <h3 className="font-bold text-lg text-[#F5D061] flex items-center gap-2">
              <PackageCheck className="w-5 h-5" />
              <span>シフト巡回担当用：リアルタイム在庫・混雑状況 3段階クイック操作</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#E2E8F0]/85 leading-relaxed">
              当日のシフト担当は一定時間間隔で巡回し、専用タブレット・スマートフォン端末の下記ボタンをタップして更新してください。選択した状態は即座に本体サイトの各クラス紹介ページ・索引バッジに反映されます。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {organizations.map((org) => {
              const currentStatus = org.inventory_status || 'STATUS_AVAILABLE';
              return (
                <div key={org.id} className="wamodern-panel p-6 rounded-3xl border border-[#D4AF37]/45 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-[#F5D061]">{org.room_code} | {org.floor_info}</span>
                      <h4 className="font-bold text-lg text-white">{org.name}</h4>
                    </div>
                    <span className="badge bg-black/60 text-xs text-white border border-white/20">
                      {org.genre === 'food' ? '喫茶・屋台' : 'アトラクション・展示'}
                    </span>
                  </div>

                  {/* 3段階クイック更新ボタン群 */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <button
                      onClick={() => updateOrganizationInventoryInDB(org.id, 'STATUS_AVAILABLE')}
                      className={`py-3.5 px-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all border ${
                        currentStatus === 'STATUS_AVAILABLE'
                          ? 'bg-[#102a1c] text-[#4af096] border-[#4af096] shadow-[0_0_20px_rgba(74,240,150,0.5)] scale-[1.03]'
                          : 'bg-[#1b120c]/80 text-white/70 hover:text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>スムーズにご案内 / 販売中</span>
                    </button>

                    <button
                      onClick={() => updateOrganizationInventoryInDB(org.id, 'STATUS_FEW')}
                      className={`py-3.5 px-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all border ${
                        currentStatus === 'STATUS_FEW'
                          ? 'bg-[#3b2d11] text-[#FFE895] border-[#F5D061] shadow-[0_0_20px_rgba(245,208,97,0.5)] scale-[1.03]'
                          : 'bg-[#1b120c]/80 text-white/70 hover:text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span>残りわずか / 混雑</span>
                    </button>

                    <button
                      onClick={() => updateOrganizationInventoryInDB(org.id, 'STATUS_SOLD_OUT')}
                      className={`py-3.5 px-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all border ${
                        currentStatus === 'STATUS_SOLD_OUT'
                          ? 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white border-[#F5D061] shadow-[0_0_20px_rgba(229,25,55,0.8)] scale-[1.03]'
                          : 'bg-[#1b120c]/80 text-white/70 hover:text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      <X className="w-5 h-5" />
                      <span>本日の受付終了 / 完売</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. お知らせ配信システム・緊急速報管理 */}
      {activeTab === 'announcements' && (
        <div className="space-y-8">
          <form onSubmit={handleCreateAnnouncement} className="wamodern-panel p-7 rounded-3xl border border-[#D4AF37]/60 space-y-5">
            <h3 className="font-bold text-lg text-white flex items-center gap-2.5 border-b border-[#D4AF37]/30 pb-3">
              <PlusCircle className="w-6 h-6 text-[#F5D061]" />
              <span>お知らせ・緊急速報の新規配信</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">お知らせタイトル</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="例：【雨天時変更】中庭ステージ演目の体育館移動について"
                  className="w-full bg-[#0d0906]/90 text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">配信カテゴリ</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as AnnouncementCategory)}
                  className="w-full bg-[#0d0906]/90 text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-sans"
                >
                  <option value="general">一般お知らせ・ご案内</option>
                  <option value="urgent">【緊急・重要速報】</option>
                  <option value="stage">ステージスケジュール変更</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F5D061]">本文メッセージ</label>
              <textarea
                rows={3}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="配信内容の詳細を入力してください。公開と同時にメインページ上部および公式通知バーに表示されます。"
                className="w-full bg-[#0d0906]/90 text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-sans"
              />
            </div>

            <button type="submit" className="py-3.5 px-8 rounded-2xl font-bold text-sm btn-wamodern-red shadow-lg flex items-center justify-center gap-2">
              <Bell className="w-4 h-4" />
              <span>お知らせを即時配信・公開する</span>
            </button>
          </form>

          {/* 配信済みお知らせ一覧 */}
          <div className="space-y-4">
            <h4 className="font-bold text-base text-[#F5D061]">配信済みお知らせ一覧 ({announcements.length})</h4>
            {announcements.length === 0 ? (
              <div className="wamodern-panel p-10 text-center rounded-2xl text-white/60 text-sm">配信中のお知らせはありません。</div>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="wamodern-panel p-6 rounded-2xl border border-[#D4AF37]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`badge text-xs font-bold ${
                        ann.category === 'urgent' ? 'bg-[#E51937] text-white' : ann.category === 'stage' ? 'bg-[#3b2d11] text-[#FFE895]' : 'bg-[#1b120c] text-white/80'
                      }`}>
                        {ann.category === 'urgent' ? '緊急・重要' : ann.category === 'stage' ? 'ステージ予定' : 'お知らせ'}
                      </span>
                      <span className="font-mono text-xs text-white/50">{new Date(ann.created_at).toLocaleString()}</span>
                    </div>
                    <h5 className="font-bold text-lg text-white">{ann.title}</h5>
                    <p className="text-xs sm:text-sm text-[#E2E8F0]/80 font-sans leading-relaxed">{ann.content}</p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <button
                      onClick={() => toggleAnnouncementPublish(ann.id, !ann.is_published)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                        ann.is_published ? 'bg-[#102a1c] text-[#4af096] border-[#4af096]/60' : 'bg-[#E51937]/30 text-[#ff8596] border-[#E51937]/50'
                      }`}
                    >
                      {ann.is_published ? '公開中' : '非公開停止'}
                    </button>
                    <button
                      onClick={() => deleteAnnouncementInDB(ann.id)}
                      className="p-2.5 rounded-xl bg-black/60 hover:bg-[#E51937]/40 text-[#ff8596] border border-white/10 transition-all"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. 落とし物掲示板 配信管理 */}
      {activeTab === 'lostfound' && (
        <div className="space-y-8">
          <form onSubmit={handleCreateLostItem} className="wamodern-panel p-7 rounded-3xl border border-[#D4AF37]/60 space-y-5">
            <h3 className="font-bold text-lg text-white flex items-center gap-2.5 border-b border-[#D4AF37]/30 pb-3">
              <PlusCircle className="w-6 h-6 text-[#FFE895]" />
              <span>落とし物・お忘れ物の拾得登録</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">拾得品目・特徴</label>
                <input
                  type="text"
                  value={lostName}
                  onChange={(e) => setLostName(e.target.value)}
                  placeholder="例：黒い折り畳み傘・水色のパスケース等"
                  className="w-full bg-[#0d0906]/90 text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">拾得場所</label>
                <input
                  type="text"
                  value={lostPlace}
                  onChange={(e) => setLostPlace(e.target.value)}
                  placeholder="例：第一体育館 入口ベンチ・中庭屋台前"
                  className="w-full bg-[#0d0906]/90 text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">現在の保管・引き取り場所</label>
                <input
                  type="text"
                  value={lostStorage}
                  onChange={(e) => setLostStorage(e.target.value)}
                  className="w-full bg-[#0d0906]/90 text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-sans"
                />
              </div>
            </div>

            <button type="submit" className="py-3.5 px-8 rounded-2xl font-bold text-sm btn-wamodern-gold shadow-lg flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              <span>落とし物を掲示板に登録して公開</span>
            </button>
          </form>

          <div className="space-y-4">
            <h4 className="font-bold text-base text-[#FFE895]">登録済み落とし物一覧 ({lostItems.length})</h4>
            {lostItems.length === 0 ? (
              <div className="wamodern-panel p-10 text-center rounded-2xl text-white/60 text-sm">現在、登録されている落とし物はありません。</div>
            ) : (
              lostItems.map((item) => (
                <div key={item.id} className="wamodern-panel p-6 rounded-2xl border border-[#D4AF37]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`badge text-xs font-bold ${
                        item.status === 'storage' ? 'bg-[#102a1c] text-[#4af096] border border-[#4af096]/60' : 'bg-[#E51937]/30 text-white/70'
                      }`}>
                        {item.status === 'storage' ? 'インフォメーション保管中' : '持ち主へ返還完了'}
                      </span>
                      <span className="font-mono text-xs text-white/50">{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                    <h5 className="font-bold text-lg text-white">{item.item_name}</h5>
                    <p className="text-xs text-[#E2E8F0]/80">拾得場所: {item.found_place} | 保管場所: {item.storage_location}</p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <button
                      onClick={() => updateLostItemStatusInDB(item.id, item.status === 'storage' ? 'returned' : 'storage')}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                        item.status === 'storage' ? 'bg-[#3b2d11] text-[#FFE895] border-[#F5D061]' : 'bg-[#102a1c] text-[#4af096]'
                      }`}
                    >
                      {item.status === 'storage' ? '返還済みに変更' : '保管中に戻す'}
                    </button>
                    <button
                      onClick={() => deleteLostItemInDB(item.id)}
                      className="p-2.5 rounded-xl bg-black/60 hover:bg-[#E51937]/40 text-[#ff8596] border border-white/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. 詳細操作マニュアル・ガイドライン */}
      {activeTab === 'manual' && (
        <div className="wamodern-panel p-8 rounded-3xl border border-[#D4AF37]/60 space-y-8 leading-relaxed font-serif">
          <div className="border-b border-[#D4AF37]/30 pb-5">
            <h3 className="font-bold text-2xl text-[#F5D061] flex items-center gap-3">
              <HelpCircle className="w-7 h-7" />
              <span>なずな祭 百輝夜行 公式総合システム 管理運用マニュアル</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#E2E8F0]/80 mt-2 font-sans">
              本仕様書・操作ガイドラインは、実行委員会・教職員および広報部・当日シフト担当者が迷わず迅速に管理業務を遂行するために策定されました。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
            <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-[#D4AF37]/35">
              <h4 className="font-bold text-lg text-[#F5D061] font-serif flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F5D061]" />
                <span>A. 広報部および当日シフト担当 運用手順</span>
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#E2E8F0]/90 list-disc list-inside">
                <li>
                  <strong className="text-white">在庫・混雑状況の3段階更新:</strong> 当日シフト担当は30〜60分間隔で各展示・喫茶・物販団体を巡回し、専用タブレット・スマートフォン端末より「スムーズ」「混雑」「完売」のボタンをタップしてください。即座に一般サイト側へ反映されます。
                </li>
                <li>
                  <strong className="text-white">落とし物掲示板の即時登録:</strong> インフォメーションセンター等に届いたお忘れ物は、本管理画面の「落とし物掲示板」タブより品目・拾得場所を入力して登録してください。持ち主が現れた際は「返還済みに変更」をタップします。
                </li>
              </ul>
            </div>

            <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-[#D4AF37]/35">
              <h4 className="font-bold text-lg text-[#FFE895] font-serif flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E51937]" />
                <span>B. 実行委員会・教職員 運用手順</span>
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#E2E8F0]/90 list-disc list-inside">
                <li>
                  <strong className="text-white">オンデマンド即時公開スイッチ:</strong> 各団体の「公開に切替 / 非公開に切替」トグルを操作すると、プログラム修正やサーバーリブートを行うことなく、Supabaseデータベースの公開フラグが瞬時に書き換わり一般閲覧側へ反映・取り下げされます。
                </li>
                <li>
                  <strong className="text-white">紹介文・画像・タイムテーブル時間修正:</strong> 各行の編集ボタンより、展示紹介文やタイムテーブルの急な時間変更をその場で行えます。
                </li>
                <li>
                  <strong className="text-white">なずな大賞 投票状況ピラミッド開示:</strong> 1日目終了時および2日目12時の第1次・第2次開示は事前スケジュール設定に基づき自動公開されます（一般数値は非公開で「高・上・中」の3段階表示のみ）。
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 6. ピラミッド評価配信 JSON管理＆開示制御・1日2回自動更新＆最終審査ロック */}
      {activeTab === 'pyramid' && (
        <div className="space-y-8 animate-fade-in font-serif">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#1b120c]/90 border border-[#D4AF37]/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F5D061]" />
                <span className="text-xs font-mono font-bold text-[#F5D061] uppercase tracking-wider">
                  PYRAMID RANKING JSON CONTROL & EMBARGO SYSTEM
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                なずな大賞 投票ピラミッド 配信制御＆ロック管理
              </h3>
              <p className="text-xs sm:text-sm text-[#E2E8F0]/80 font-sans">
                配信するデータは1日2回（定時）、JSON形式で「高・上・中」の3段階にて管理画面または事前に流し込まれます。最終結果開示前はオンデマンドスイッチで即座に非表示ロック可能です。
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsEmbargoLocked(!isEmbargoLocked)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-lg ${
                  isEmbargoLocked
                    ? 'bg-gradient-to-r from-[#E51937] to-[#800010] text-white border-2 border-[#F5D061] scale-105 shadow-[0_0_25px_rgba(229,25,55,0.8)]'
                    : 'bg-[#140e0a] hover:bg-[#241710] text-[#FFE895] border border-[#D4AF37]/60'
                }`}
              >
                {isEmbargoLocked ? (
                  <>
                    <Lock className="w-4.5 h-4.5 text-[#F5D061]" />
                    <span>【封印中】最終結果開示前ロック (非公開)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4.5 h-4.5 text-[#4af096]" />
                    <span>【開示中】定時ピラミッド公開モード</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 左側：リアルタイムで確認できる本格的幾何学ピラミッド図形 */}
            <div className="lg:col-span-6">
              <OfficialPyramidGraphic
                tier={isEmbargoLocked ? 'embargoed' : 'high'}
                tierLabel="高"
                releaseTitle={pyramidSchedule.releases[selectedReleaseIndex]?.title || '第1回 中間開示'}
                isEmbargoed={isEmbargoLocked || pyramidSchedule.releases[selectedReleaseIndex]?.isEmbargoed}
                embargoMessage={pyramidSchedule.releases[selectedReleaseIndex]?.embargoMessage}
                showDetails={false}
              />
            </div>

            {/* 右側：1日2回配信タイムテーブル＆階層別データ管理 */}
            <div className="lg:col-span-6 space-y-5">
              <div className="wamodern-panel p-6 rounded-3xl border border-[#D4AF37]/50 space-y-4">
                <h4 className="font-bold text-base sm:text-lg text-[#F5D061] border-b border-[#D4AF37]/30 pb-3 flex items-center justify-between">
                  <span>配信スケジュールセレクター (1日2回開示)</span>
                  <span className="text-xs font-mono text-white/70">JSON Driven</span>
                </h4>

                <div className="space-y-2.5 font-sans">
                  {pyramidSchedule.releases.map((rel, idx) => (
                    <div
                      key={rel.releaseId}
                      onClick={() => {
                        setSelectedReleaseIndex(idx);
                        if (rel.isEmbargoed) setIsEmbargoLocked(true);
                        else setIsEmbargoLocked(false);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedReleaseIndex === idx
                          ? 'bg-[#2a1b12] border-[#F5D061] shadow-md scale-[1.01]'
                          : 'bg-black/50 border-white/10 hover:border-[#D4AF37]/50 text-white/80'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            rel.isEmbargoed ? 'bg-[#E51937] text-white' : 'bg-[#D4AF37] text-[#130d09]'
                          }`}>
                            {rel.isEmbargoed ? '集計ロック期間' : `配信第 ${idx + 1} 回`}
                          </span>
                          <span className="text-xs font-bold text-white">{rel.title}</span>
                        </div>
                        <span className="text-[11px] text-[#94A1B2] block font-mono">
                          予定時刻: {rel.scheduledTime.replace('T', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#F5D061]">
                        {selectedReleaseIndex === idx ? '▶ 選択中' : '選択して確認'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 選択された開示回の内訳情報 */}
              {!isEmbargoLocked && !pyramidSchedule.releases[selectedReleaseIndex]?.isEmbargoed && (
                <div className="wamodern-panel p-6 rounded-3xl border border-[#D4AF37]/40 space-y-4 font-sans">
                  <h5 className="font-bold text-sm text-white font-serif tracking-wider">
                    現在の「高・上・中」所属団体数 (詳細数値秘匿モード)
                  </h5>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#382614] to-[#1c120a] border border-[#F5D061]/80">
                      <span className="text-xs font-serif font-bold text-[#F5D061] block">頂点層 (高)</span>
                      <span className="text-2xl font-mono font-black text-white mt-1 block">
                        {pyramidSchedule.releases[selectedReleaseIndex]?.pyramidTiers?.high?.length || 4} 団体
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#3a1218] to-[#1c080b] border border-[#E51937]/80">
                      <span className="text-xs font-serif font-bold text-[#ff8596] block">上層 (上)</span>
                      <span className="text-2xl font-mono font-black text-white mt-1 block">
                        {pyramidSchedule.releases[selectedReleaseIndex]?.pyramidTiers?.upper?.length || 6} 団体
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#1f160e] border border-[#D4AF37]/40">
                      <span className="text-xs font-serif font-bold text-[#D4AF37] block">中核層 (中)</span>
                      <span className="text-2xl font-mono font-black text-white mt-1 block">
                        {pyramidSchedule.releases[selectedReleaseIndex]?.pyramidTiers?.middle?.length || 10} 団体
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#94A1B2]">
                    ※ 一般閲覧者には個別の詳細得票数は一切表示されず、上記ピラミッド階層図形と階層ラベルのみが表示されます。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- モーダル：団体紹介文・画像 編集フォーム --- */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-serif">
          <div className="wamodern-panel w-full max-w-2xl p-6 sm:p-8 rounded-3xl border-2 border-[#F5D061] space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/35 pb-4">
              <h3 className="font-bold text-xl text-white flex items-center gap-2.5">
                <Edit3 className="w-6 h-6 text-[#F5D061]" />
                <span>出展団体・出し物紹介の修正フォーム ({editingOrg.room_code})</span>
              </h3>
              <button onClick={() => setEditingOrg(null)} className="p-2 text-white/70 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveOrgEdit} className="space-y-4 font-sans">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">団体・企画名</label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-serif"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">紹介文 (リアルタイム修正)</label>
                <textarea
                  rows={4}
                  value={orgForm.description}
                  onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                  className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm leading-relaxed font-serif"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">画像URL・ポスター差し替え</label>
                <input
                  type="text"
                  value={orgForm.image_url}
                  onChange={(e) => setOrgForm({ ...orgForm, image_url: e.target.value })}
                  className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F5D061]">教室コード</label>
                  <input
                    type="text"
                    value={orgForm.room_code}
                    onChange={(e) => setOrgForm({ ...orgForm, room_code: e.target.value })}
                    className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F5D061]">階層・場所情報</label>
                  <input
                    type="text"
                    value={orgForm.floor_info}
                    onChange={(e) => setOrgForm({ ...orgForm, floor_info: e.target.value })}
                    className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 text-sm font-serif"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#D4AF37]/30 font-serif">
                <button type="button" onClick={() => setEditingOrg(null)} className="px-6 py-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 text-sm font-bold">
                  キャンセル
                </button>
                <button type="submit" className="py-3 px-8 rounded-xl btn-wamodern-red font-bold text-sm shadow-xl">
                  保存して即時反映する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- モーダル：タイムテーブル 急な時間変更・演目内容 編集フォーム --- */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-serif">
          <div className="wamodern-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border-2 border-[#F5D061] space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/35 pb-4">
              <h3 className="font-bold text-xl text-white flex items-center gap-2.5">
                <Clock className="w-6 h-6 text-[#F5D061]" />
                <span>タイムテーブルの急な時間変更・演目修正</span>
              </h3>
              <button onClick={() => setEditingEvent(null)} className="p-2 text-white/70 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEventEdit} className="space-y-4 font-sans">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F5D061]">演目・ステージタイトル</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 focus:outline-none focus:border-[#F5D061] text-sm font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F5D061]">開始時刻 (HH:mm)</label>
                  <input
                    type="time"
                    value={eventForm.start_time}
                    onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                    className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F5D061]">終了時刻 (HH:mm)</label>
                  <input
                    type="time"
                    value={eventForm.end_time}
                    onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                    className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F5D061]">ステージロケーション</label>
                  <select
                    value={eventForm.stage_location}
                    onChange={(e) => setEventForm({ ...eventForm, stage_location: e.target.value as StageLocation })}
                    className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 text-sm"
                  >
                    <option value="gym">第一体育館 メインステージ</option>
                    <option value="courtyard">中庭 屋外特設ステージ</option>
                    <option value="av_room">視聴覚室・演劇ステージ</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F5D061]">出演団体名</label>
                  <input
                    type="text"
                    value={eventForm.organization_name}
                    onChange={(e) => setEventForm({ ...eventForm, organization_name: e.target.value })}
                    className="w-full bg-[#0d0906] text-white px-4 py-3 rounded-xl border border-[#D4AF37]/45 text-sm font-serif"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#D4AF37]/30 font-serif">
                <button type="button" onClick={() => setEditingEvent(null)} className="px-6 py-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 text-sm font-bold">
                  キャンセル
                </button>
                <button type="submit" className="py-3 px-8 rounded-xl btn-wamodern-red font-bold text-sm shadow-xl">
                  変更を即時反映・適用
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
