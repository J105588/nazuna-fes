import React, { useState, useEffect } from 'react';
import type {
  Organization,
  TimetableEvent,
  TimetableDay,
  Announcement,
  LostItem,
  AnnouncementCategory,
  StageLocation,
  OrganizationCategory,
  OrganizationGenre,
  AdminUser,
  PyramidRelease
} from '../../types/database';
import {
  toggleOrganizationPublish,
  toggleTimetableEventPublish,
  updateOrganizationInDB,
  updateTimetableEventInDB,
  updateOrganizationMenuApiInDB,
  createAnnouncementInDB,
  toggleAnnouncementPublish,
  deleteAnnouncementInDB,
  createLostItemInDB,
  updateLostItemStatusInDB,
  deleteLostItemInDB,
  createTimetableEventInDB,
  deleteTimetableEventInDB,
  fetchTimetableDaysFromDB,
  createTimetableDayInDB,
  deleteTimetableDayInDB,
  mockPyramidReleases,
  fetchPyramidReleasesFromDB,
  updatePyramidReleaseInDB
} from '../../lib/supabase';
import {
  Layers,
  Calendar,
  LogOut,
  Edit3,
  Bell,
  Search,
  PlusCircle,
  Trash2,
  X,
  Lock,
  Unlock,
  TrendingUp,
  Coffee,
  Shield,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import pyramidSchedule from '../../data/pyramidSchedule.json';
import { AdminUserManagement } from './AdminUserManagement';

interface AdminDashboardProps {
  organizations: Organization[];
  timetableEvents: TimetableEvent[];
  announcements: Announcement[];
  lostItems: LostItem[];
  role: 'superadmin' | 'admin' | string;
  onLogout: () => void;
  currentUser?: AdminUser | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  organizations,
  timetableEvents,
  announcements,
  lostItems,
  role,
  onLogout,
  currentUser
}) => {
  const isSuper = role === 'superadmin' || currentUser?.role === 'superadmin';
  const [activeTab, setActiveTab] = useState<'users' | 'orgs' | 'events' | 'announcements' | 'lostfound' | 'pyramid'>(
    isSuper ? 'users' : 'orgs'
  );

  const [selectedReleaseIndex, setSelectedReleaseIndex] = useState(0);
  const [pyramidReleases, setPyramidReleases] = useState<PyramidRelease[]>((mockPyramidReleases && mockPyramidReleases.length > 0) ? mockPyramidReleases : (pyramidSchedule.releases as any));

  // 出展団体編集状態
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgForm, setOrgForm] = useState<{
    name: string;
    description: string;
    image_url: string;
    room_code: string;
    floor_info: string;
    category: OrganizationCategory;
    genre: OrganizationGenre;
    use_menu_api: boolean;
  }>({
    name: '',
    description: '',
    image_url: '',
    room_code: '',
    floor_info: '',
    category: 'class',
    genre: 'exhibition',
    use_menu_api: false
  });

  // 日にち設定状態
  const [days, setDays] = useState<TimetableDay[]>([]);
  const [dayForm, setDayForm] = useState({ date_string: '', label: '' });

  // タイムテーブル編集状態
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [eventForm, setEventForm] = useState<{
    title: string;
    day_id: string;
    start_time: string;
    end_time: string;
    location: StageLocation;
    description: string;
    organization_id: string;
  }>({
    title: '',
    day_id: 'day-1',
    start_time: '',
    end_time: '',
    location: 'courtyard',
    description: '',
    organization_id: ''
  });

  // お知らせ作成状態
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<AnnouncementCategory>('general');

  // 落とし物登録状態
  const [lostName, setLostName] = useState('');
  const [lostPlace, setLostPlace] = useState('');
  const [lostStorage, setLostStorage] = useState('本館2階総合案内所');
  const [lostImage, setLostImage] = useState('');

  // 日にち情報の取得
  useEffect(() => {
    fetchTimetableDaysFromDB().then((data) => {
      setDays(data);
    });
    fetchPyramidReleasesFromDB().then((data) => {
      if (data && data.length > 0) setPyramidReleases(data);
    });
  }, []);

  // 団体情報編集モーダル開閉
  const handleOpenOrgEdit = (org: Organization) => {
    setEditingOrg(org);
    setOrgForm({
      name: org.name,
      description: org.description || '',
      image_url: org.image_url || '',
      room_code: org.room_code || '',
      floor_info: org.floor_info || '',
      category: (org.category as OrganizationCategory) || 'class',
      genre: (org.genre as OrganizationGenre) || 'exhibition',
      use_menu_api: Boolean(org.use_menu_api)
    });
  };

  const handleSaveOrgEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;

    await updateOrganizationInDB(editingOrg.id, {
      name: orgForm.name,
      description: orgForm.description,
      image_url: orgForm.image_url,
      room_code: orgForm.room_code,
      floor_info: orgForm.floor_info,
      category: orgForm.category,
      genre: orgForm.genre
    });
    await updateOrganizationMenuApiInDB(editingOrg.id, orgForm.use_menu_api);
    setEditingOrg(null);
  };

  // 日にちタブの作成・削除
  const handleCreateDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayForm.date_string || !dayForm.label) return;
    const added = await createTimetableDayInDB({
      date_string: dayForm.date_string,
      label: dayForm.label,
      display_order: days.length + 1
    });
    if (added) {
      setDays((prev) => [...prev, added]);
      setDayForm({ date_string: '', label: '' });
    }
  };

  const handleDeleteDay = async (id: string) => {
    if (window.confirm('この日付タブを削除してもよろしいですか？')) {
      await deleteTimetableDayInDB(id);
      setDays((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // タイムテーブル演目の作成・編集・削除
  const formatDatetimeLocal = (isoStr: string) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const handleOpenEventEdit = (evt: TimetableEvent) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title,
      day_id: evt.day_id || 'day-1',
      start_time: formatDatetimeLocal(evt.start_time),
      end_time: formatDatetimeLocal(evt.end_time),
      location: evt.stage_location || 'courtyard',
      description: '',
      organization_id: evt.organization_id || ''
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.start_time || !eventForm.end_time) return;

    await createTimetableEventInDB({
      title: eventForm.title || '新しい演目',
      day_id: eventForm.day_id || 'day-1',
      start_time: new Date(eventForm.start_time).toISOString(),
      end_time: new Date(eventForm.end_time).toISOString(),
      stage_location: eventForm.location,
      organization_id: eventForm.organization_id || undefined
    });
    setEventForm({
      title: '',
      day_id: 'day-1',
      start_time: '',
      end_time: '',
      location: 'courtyard',
      description: '',
      organization_id: ''
    });
  };

  const handleSaveEventEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !eventForm.start_time || !eventForm.end_time) return;

    await updateTimetableEventInDB(editingEvent.id, {
      title: eventForm.title,
      day_id: eventForm.day_id,
      start_time: new Date(eventForm.start_time).toISOString(),
      end_time: new Date(eventForm.end_time).toISOString(),
      stage_location: eventForm.location,
      organization_id: eventForm.organization_id || undefined
    });
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('この演目を削除してもよろしいですか？')) {
      await deleteTimetableEventInDB(id);
      if (editingEvent?.id === id) setEditingEvent(null);
    }
  };

  // お知らせ作成
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    await createAnnouncementInDB(annTitle.trim(), annContent.trim(), annCategory);
    setAnnTitle('');
    setAnnContent('');
  };

  // 落とし物登録
  const handleCreateLostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostName.trim() || !lostPlace.trim()) return;

    await createLostItemInDB(
      lostName.trim(),
      lostPlace.trim(),
      lostStorage.trim() || '本館2階総合案内所',
      lostImage || undefined
    );
    setLostName('');
    setLostPlace('');
    setLostStorage('本館2階総合案内所');
    setLostImage('');
  };

  // ピラミッド結果開示操作
  const currentRelease = pyramidReleases[selectedReleaseIndex] || pyramidReleases[0];
  const [releaseTitleInput, setReleaseTitleInput] = useState(currentRelease?.title || '');
  const [embargoMsgInput, setEmbargoMsgInput] = useState(currentRelease?.embargoMessage || '');

  useEffect(() => {
    if (currentRelease) {
      setReleaseTitleInput(currentRelease.title || '');
      setEmbargoMsgInput(currentRelease.embargoMessage || '');
    }
  }, [selectedReleaseIndex, currentRelease]);

  const handleSaveReleaseTitle = async () => {
    if (!currentRelease) return;
    const releaseId = currentRelease.releaseId || currentRelease.id;
    await updatePyramidReleaseInDB(releaseId, {
      title: releaseTitleInput,
      embargoMessage: embargoMsgInput
    });
    setPyramidReleases((prev) =>
      prev.map((r) => ((r.releaseId || r.id) === releaseId ? { ...r, title: releaseTitleInput, embargoMessage: embargoMsgInput } : r))
    );
  };

  const handleToggleEmbargo = async () => {
    if (!currentRelease) return;
    const releaseId = currentRelease.releaseId || currentRelease.id;
    const nextEmbargo = !currentRelease.isEmbargoed;
    await updatePyramidReleaseInDB(releaseId, { isEmbargoed: nextEmbargo });
    setPyramidReleases((prev) =>
      prev.map((r) => ((r.releaseId || r.id) === releaseId ? { ...r, isEmbargoed: nextEmbargo } : r))
    );
  };

  const navItems = [
    ...(isSuper ? [{ id: 'users' as const, label: 'アカウント管理', icon: Shield }] : []),
    { id: 'orgs' as const, label: '団体・企画管理', icon: Layers },
    { id: 'events' as const, label: 'タイムテーブル', icon: Calendar },
    { id: 'announcements' as const, label: 'お知らせ配信', icon: Bell },
    { id: 'lostfound' as const, label: '落とし物管理', icon: Search },
    { id: 'pyramid' as const, label: 'ピラミッド結果', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* PCサイドバーナビゲーション */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between p-4 fixed top-0 bottom-0 left-0 z-40 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              N
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white">統合管理ポータル</h1>
              <p className="text-[11px] text-slate-400 font-mono">なずな祭 2026</p>
            </div>
          </div>

          <div className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-200 truncate">
                {currentUser?.display_name || (isSuper ? '統括管理者' : '実行委員')}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                {isSuper ? 'Superadmin' : 'Admin'}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-red-400 hover:bg-red-500/10 transition-all text-left mt-auto"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>ログアウト</span>
        </button>
      </aside>

      {/* モバイル用トップヘッダー＆セグメントナビゲーション */}
      <div className="md:hidden flex flex-col sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              N
            </div>
            <span className="font-bold text-sm text-white">統合管理ポータル</span>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-xs flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ログアウト</span>
          </button>
        </div>

        <div className="px-2 pb-2 flex gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* メインコンテンツ領域 */}
      <main className="flex-1 md:pl-64 p-4 sm:p-8 overflow-y-auto min-h-screen space-y-6">
        {/* 1. アカウント統括管理 */}
        {activeTab === 'users' && isSuper && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>管理者アカウント統括管理</span>
            </h2>
            <AdminUserManagement />
          </div>
        )}

        {/* 2. 出展団体・企画管理 */}
        {activeTab === 'orgs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <span>団体・企画管理 ({organizations.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {organizations.map((org) => {
                const isPub = Boolean(org.is_published);
                return (
                  <div key={org.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-slate-700">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {org.category === 'class' ? 'クラス展示' : org.category === 'club' ? '部活動・委員会' : '有志企画'}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {org.room_code} | {org.floor_info}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-white line-clamp-1">{org.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{org.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenOrgEdit(org)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all border border-slate-700"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>編集</span>
                      </button>

                      <button
                        onClick={() => toggleOrganizationPublish(org.id, !isPub)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                          isPub
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                        }`}
                      >
                        {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{isPub ? '公開中' : '非公開'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. タイムテーブル管理 */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>タイムテーブル管理</span>
            </h2>

            {/* 日にちタブ管理 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-slate-300">日にちタブ (DAY) 設定</h3>
              <div className="flex flex-wrap items-center gap-2">
                {days.map((day) => (
                  <div key={day.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200">
                    <span className="font-bold">{day.label}</span>
                    <span className="text-slate-400 font-mono">({day.date_string})</span>
                    <button onClick={() => handleDeleteDay(day.id)} className="text-slate-400 hover:text-red-400 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCreateDay} className="flex flex-wrap items-center gap-2 pt-2">
                <input
                  type="date"
                  value={dayForm.date_string}
                  onChange={(e) => setDayForm({ ...dayForm, date_string: e.target.value })}
                  className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-mono"
                />
                <input
                  type="text"
                  value={dayForm.label}
                  onChange={(e) => setDayForm({ ...dayForm, label: e.target.value })}
                  placeholder="表示ラベル (例: DAY 1)"
                  className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs w-44"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>日にち追加</span>
                </button>
              </form>
            </div>

            {/* 新規演目登録・演目リスト */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleCreateEvent} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 lg:col-span-1 h-fit">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-blue-500" />
                  <span>新規ステージ演目登録</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">演目タイトル</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      placeholder="例：軽音楽部 ライブ"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">開催日</label>
                      <select
                        value={eventForm.day_id}
                        onChange={(e) => setEventForm({ ...eventForm, day_id: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                      >
                        {days.map((d) => (
                          <option key={d.id} value={d.id}>{d.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">ステージ場所</label>
                      <select
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value as StageLocation })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                      >
                        <option value="courtyard">中庭ステージ</option>
                        <option value="gym">体育館</option>
                        <option value="av_room">多目的室</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">開始日時</label>
                      <input
                        type="datetime-local"
                        value={eventForm.start_time}
                        onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">終了日時</label>
                      <input
                        type="datetime-local"
                        value={eventForm.end_time}
                        onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">詳細説明</label>
                    <textarea
                      rows={2}
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium text-sm transition-all">
                  登録する
                </button>
              </form>

              <div className="lg:col-span-2 space-y-3">
                <h3 className="font-bold text-sm text-slate-300">登録済み演目 ({timetableEvents.length})</h3>
                <div className="space-y-2">
                  {timetableEvents.map((evt) => {
                    const isPub = Boolean(evt.is_published);
                    return (
                      <div key={evt.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              {evt.stage_location === 'courtyard' ? '中庭ステージ' : evt.stage_location === 'gym' ? '体育館' : '多目的室'}
                            </span>
                            <span className="text-xs text-blue-400 font-mono">
                              {new Date(evt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 〜 {new Date(evt.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white truncate">{evt.title}</h4>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleOpenEventEdit(evt)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                            title="編集"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleTimetableEventPublish(evt.id, !isPub)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isPub ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {isPub ? '公開中' : '非公開'}
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                            title="削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. お知らせ配信管理 */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <span>お知らせ配信管理</span>
            </h2>

            <form onSubmit={handleCreateAnnouncement} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white">新規お知らせ配信</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-slate-400">タイトル</label>
                  <input
                    type="text"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="お知らせタイトル"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">カテゴリ</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as AnnouncementCategory)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm"
                  >
                    <option value="general">一般お知らせ</option>
                    <option value="stage">ステージ予定</option>
                    <option value="urgent">緊急・重要</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">詳細内容</label>
                <textarea
                  rows={2}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="配信内容の詳細を入力してください。"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm"
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>配信する</span>
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-300">配信済み一覧 ({announcements.length})</h3>
              <div className="space-y-2">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ann.category === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ann.category === 'stage' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {ann.category === 'urgent' ? '緊急・重要' : ann.category === 'stage' ? 'ステージ予定' : 'お知らせ'}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{new Date(ann.created_at).toLocaleString()}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{ann.title}</h4>
                      <p className="text-xs text-slate-400">{ann.content}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => toggleAnnouncementPublish(ann.id, !ann.is_published)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          ann.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {ann.is_published ? '公開中' : '停止'}
                      </button>
                      <button
                        onClick={() => deleteAnnouncementInDB(ann.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. 落とし物掲示板管理 */}
        {activeTab === 'lostfound' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              <span>落とし物掲示板管理</span>
            </h2>

            <form onSubmit={handleCreateLostItem} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white">拾得物新規登録</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">拾得品目・特徴</label>
                  <input
                    type="text"
                    value={lostName}
                    onChange={(e) => setLostName(e.target.value)}
                    placeholder="例：黒い折り畳み傘"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">拾得場所</label>
                  <input
                    type="text"
                    value={lostPlace}
                    onChange={(e) => setLostPlace(e.target.value)}
                    placeholder="例：第一体育館 入口"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">保管・引き取り窓口</label>
                  <input
                    type="text"
                    value={lostStorage}
                    onChange={(e) => setLostStorage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">写真URL (任意)</label>
                  <input
                    type="text"
                    value={lostImage}
                    onChange={(e) => setLostImage(e.target.value)}
                    placeholder="画像URL"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>登録・公開</span>
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-300">登録済み落とし物 ({lostItems.length})</h3>
              <div className="space-y-2">
                {lostItems.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.item_name} className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0" />
                      )}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'storage' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {item.status === 'storage' ? '保管中' : '返却完了'}
                          </span>
                          <span className="text-xs font-mono text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{item.item_name}</h4>
                        <p className="text-xs text-slate-400">拾得場所: {item.found_place} / 保管: {item.storage_location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => updateLostItemStatusInDB(item.id, item.status === 'storage' ? 'returned' : 'storage')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all border border-slate-700"
                      >
                        {item.status === 'storage' ? '返却済みにする' : '保管中に戻す'}
                      </button>
                      <button
                        onClick={() => deleteLostItemInDB(item.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. ピラミッド結果開示管理 */}
        {activeTab === 'pyramid' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>ピラミッド結果開示設定</span>
            </h2>

            <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
              {pyramidReleases.map((release, index) => {
                const isSelected = selectedReleaseIndex === index;
                const isEmbargo = Boolean(release.isEmbargoed);
                return (
                  <button
                    key={release.releaseId || release.id || index}
                    onClick={() => setSelectedReleaseIndex(index)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                      isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{release.title || `開示 ${index + 1}`}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${isEmbargo ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isEmbargo ? 'ロック中' : '開示中'}
                    </span>
                  </button>
                );
              })}
            </div>

            {currentRelease && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-base text-white">{currentRelease.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">予定開示時刻: {new Date(currentRelease.scheduledTime).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handleToggleEmbargo}
                    className={`px-4 py-2 rounded-xl font-medium text-xs flex items-center gap-2 transition-all border ${
                      currentRelease.isEmbargoed
                        ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                  >
                    {currentRelease.isEmbargoed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{currentRelease.isEmbargoed ? '結果ロック中 (クリックで即時開示)' : '開示中 (クリックで即時ロック)'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">開示タイトル</label>
                    <input
                      type="text"
                      value={releaseTitleInput}
                      onChange={(e) => setReleaseTitleInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">ロック時メッセージ</label>
                    <input
                      type="text"
                      value={embargoMsgInput}
                      onChange={(e) => setEmbargoMsgInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveReleaseTitle}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition-all"
                >
                  タイトル＆メッセージを保存
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 団体情報編集モーダル */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">団体企画の編集: {editingOrg.name}</h3>
              <button onClick={() => setEditingOrg(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrgEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">団体・企画名</label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">教室コード</label>
                  <input
                    type="text"
                    value={orgForm.room_code}
                    onChange={(e) => setOrgForm({ ...orgForm, room_code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">フロア情報</label>
                  <input
                    type="text"
                    value={orgForm.floor_info}
                    onChange={(e) => setOrgForm({ ...orgForm, floor_info: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">種別</label>
                  <select
                    value={orgForm.category}
                    onChange={(e) => setOrgForm({ ...orgForm, category: e.target.value as OrganizationCategory })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="class">クラス企画</option>
                    <option value="club">部活動・委員会</option>
                    <option value="volunteer">有志企画</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">ジャンル</label>
                  <select
                    value={orgForm.genre}
                    onChange={(e) => setOrgForm({ ...orgForm, genre: e.target.value as OrganizationGenre })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="attraction">アトラクション</option>
                    <option value="food">喫茶・食品</option>
                    <option value="exhibition">展示・アート</option>
                    <option value="stage">ステージ</option>
                  </select>
                </div>
              </div>

              {orgForm.genre === 'food' && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">NazunaGraph メニュー在庫API連携</span>
                      <span className="text-[11px] text-slate-400">オンにすると定時リクエスト＆キャッシュでメニュー・混雑状況が自動同期されます</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={orgForm.use_menu_api}
                    onChange={(e) => setOrgForm({ ...orgForm, use_menu_api: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-400">紹介説明文</label>
                <textarea
                  rows={3}
                  value={orgForm.description}
                  onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">画像URL</label>
                <input
                  type="text"
                  value={orgForm.image_url}
                  onChange={(e) => setOrgForm({ ...orgForm, image_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* タイムテーブル演目編集モーダル */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">演目編集: {editingEvent.title}</h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEventEdit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">演目タイトル</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">開催日</label>
                  <select
                    value={eventForm.day_id}
                    onChange={(e) => setEventForm({ ...eventForm, day_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                  >
                    {days.map((d) => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">ステージ場所</label>
                  <select
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value as StageLocation })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="courtyard">中庭ステージ</option>
                    <option value="gym">体育館</option>
                    <option value="av_room">多目的室</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">開始日時</label>
                  <input
                    type="datetime-local"
                    value={eventForm.start_time}
                    onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">終了日時</label>
                  <input
                    type="datetime-local"
                    value={eventForm.end_time}
                    onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">詳細説明</label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
                >
                  変更を保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
