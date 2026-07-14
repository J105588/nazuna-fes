import React, { useState, useMemo } from 'react';
import {
  Calendar,
  PlusCircle,
  Clock,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  X,
  Plus,
  Filter,
  ChevronDown
} from 'lucide-react';
import type { TimetableEvent, TimetableDay, StageLocation } from '../../types/database';

export interface AdminEventsTabProps {
  timetableEvents: TimetableEvent[];
  days: TimetableDay[];
  onTogglePublish: (id: string, current: boolean) => Promise<void>;
  onCreateEvent: (data: {
    title: string;
    day_id: string;
    start_time: string;
    end_time: string;
    stage_location: StageLocation;
    description?: string;
    organization_id?: string;
  }) => Promise<void>;
  onSaveEvent: (
    id: string,
    data: {
      title: string;
      day_id: string;
      start_time: string;
      end_time: string;
      stage_location: StageLocation;
      description?: string;
      organization_id?: string;
    }
  ) => Promise<void>;
  onDeleteEvent: (id: string, title: string) => void;
  onCreateDay: (dateString: string, label: string) => Promise<void>;
  onDeleteDay: (id: string, label: string) => void;
}

export const AdminEventsTab: React.FC<AdminEventsTabProps> = ({
  timetableEvents,
  days,
  onTogglePublish,
  onCreateEvent,
  onSaveEvent,
  onDeleteEvent,
  onCreateDay,
  onDeleteDay
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<'all' | StageLocation>('all');
  const [showDayManager, setShowDayManager] = useState(false);
  const [dayForm, setDayForm] = useState({ date_string: '', label: '' });

  // 演目新規登録の開閉
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<{
    title: string;
    day_id: string;
    start_time: string;
    end_time: string;
    location: StageLocation;
    description: string;
    organization_id: string;
  }>({
    title: '',
    day_id: days[0]?.id || 'day-1',
    start_time: '',
    end_time: '',
    location: 'courtyard',
    description: '',
    organization_id: ''
  });

  // 演目編集モーダルの状態
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [editForm, setEditForm] = useState<{
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOpenEdit = (evt: TimetableEvent) => {
    setEditingEvent(evt);
    setEditForm({
      title: evt.title,
      day_id: evt.day_id || days[0]?.id || 'day-1',
      start_time: formatDatetimeLocal(evt.start_time),
      end_time: formatDatetimeLocal(evt.end_time),
      location: evt.stage_location || 'courtyard',
      description: '',
      organization_id: evt.organization_id || ''
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.start_time || !createForm.end_time || !createForm.title) return;
    setIsSubmitting(true);
    try {
      await onCreateEvent({
        title: createForm.title,
        day_id: createForm.day_id || days[0]?.id || 'day-1',
        start_time: new Date(createForm.start_time).toISOString(),
        end_time: new Date(createForm.end_time).toISOString(),
        stage_location: createForm.location,
        description: createForm.description || undefined,
        organization_id: createForm.organization_id || undefined
      });
      setShowCreateModal(false);
      setCreateForm({
        title: '',
        day_id: days[0]?.id || 'day-1',
        start_time: '',
        end_time: '',
        location: 'courtyard',
        description: '',
        organization_id: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editForm.start_time || !editForm.end_time) return;
    setIsSubmitting(true);
    try {
      await onSaveEvent(editingEvent.id, {
        title: editForm.title,
        day_id: editForm.day_id,
        start_time: new Date(editForm.start_time).toISOString(),
        end_time: new Date(editForm.end_time).toISOString(),
        stage_location: editForm.location,
        description: editForm.description || undefined,
        organization_id: editForm.organization_id || undefined
      });
      setEditingEvent(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayForm.date_string || !dayForm.label) return;
    await onCreateDay(dayForm.date_string, dayForm.label);
    setDayForm({ date_string: '', label: '' });
  };

  const getLocationBadge = (loc: StageLocation) => {
    switch (loc) {
      case 'gym':
        return { label: '第一体育館', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'av_room':
        return { label: '多目的ホール', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'courtyard':
      default:
        return { label: '中庭メインステージ', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    }
  };

  // フィルタおよびソート済みのタイムテーブル演目
  const filteredEvents = useMemo(() => {
    return [...timetableEvents]
      .filter((evt) => {
        if (selectedDayId !== 'all' && evt.day_id !== selectedDayId) return false;
        if (selectedLocation !== 'all' && evt.stage_location !== selectedLocation) return false;
        return true;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [timetableEvents, selectedDayId, selectedLocation]);

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* 画面ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>タイムテーブルステージ管理</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
              全{timetableEvents.length}演目
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowDayManager(!showDayManager)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${showDayManager
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-300 shadow-sm'
              }`}
          >
            <span>日にち (DAY) 設定</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDayManager ? 'rotate-180 text-blue-600' : ''}`} />
          </button>
          <button
            onClick={() => {
              setCreateForm({ ...createForm, day_id: selectedDayId === 'all' ? days[0]?.id || 'day-1' : selectedDayId });
              setShowCreateModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20 border border-blue-400/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>新規演目を追加</span>
          </button>
        </div>
      </div>

      {/* 日にち設定パネル (アコーディオン) */}
      {showDayManager && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">日にちタブ (DAY) 管理</h3>
              <p className="text-xs text-slate-600">開催日ごとのタブを作成・削除します。</p>
            </div>
            <button onClick={() => setShowDayManager(false)} className="text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {days.map((day) => (
              <div
                key={day.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 shadow-xs"
              >
                <span className="font-bold text-blue-600">{day.label}</span>
                <span className="text-slate-500 font-mono">({day.date_string})</span>
                <button
                  onClick={() => onDeleteDay(day.id, day.label)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddDaySubmit} className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
            <input
              type="date"
              value={dayForm.date_string}
              onChange={(e) => setDayForm({ ...dayForm, date_string: e.target.value })}
              className="bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-600"
              required
            />
            <input
              type="text"
              value={dayForm.label}
              onChange={(e) => setDayForm({ ...dayForm, label: e.target.value })}
              placeholder="表示ラベル (例: DAY 1)"
              className="bg-white border border-slate-300 text-slate-800 rounded-xl px-3.5 py-1.5 text-xs w-48 focus:outline-none focus:border-blue-600"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>日にち追加</span>
            </button>
          </form>
        </div>
      )}

      {/* タブ＆フィルタツールバー */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        {/* 日にち選択セグメント */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0 border-b md:border-b-0 border-slate-200">
          <button
            onClick={() => setSelectedDayId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${selectedDayId === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 border border-blue-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            すべての日にち
          </button>
          {days.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDayId(d.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedDayId === d.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 border border-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <span>{d.label}</span>
              <span className="text-[10px] font-mono opacity-80">({d.date_string})</span>
            </button>
          ))}
        </div>

        {/* ステージ場所フィルタ */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-xs text-slate-700 font-semibold shrink-0">場所:</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value as any)}
            className="bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-600 transition-all shadow-xs"
          >
            <option value="all">すべてのステージ</option>
            <option value="courtyard">中庭メインステージ</option>
            <option value="gym">第一体育館</option>
            <option value="av_room">多目的ホール</option>
          </select>
        </div>
      </div>

      {/* 演目タイムラインリスト */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">表示するステージ演目がありません</h3>
          <p className="text-xs text-slate-600">条件に合致する演目がないか、まだ登録されていません。</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((evt) => {
            const isPub = Boolean(evt.is_published);
            const locBadge = getLocationBadge(evt.stage_location);
            const dayInfo = days.find((d) => d.id === evt.day_id);
            const startTimeStr = new Date(evt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTimeStr = new Date(evt.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={evt.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-blue-500 hover:shadow-md group"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {/* 時刻表示ボックス */}
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center shrink-0 min-w-[5.5rem]">
                    <div className="text-xs font-mono font-black text-blue-600 tracking-tight">{startTimeStr}</div>
                    <div className="text-[10px] font-mono text-slate-400 my-0.5">〜</div>
                    <div className="text-xs font-mono font-bold text-slate-800 tracking-tight">{endTimeStr}</div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${locBadge.bg}`}>
                        {locBadge.label}
                      </span>
                      {dayInfo && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                          {dayInfo.label}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-base text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {evt.title}
                    </h4>
                  </div>
                </div>

                {/* 操作アクション */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleOpenEdit(evt)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all border border-slate-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>編集</span>
                  </button>

                  <button
                    onClick={() => onTogglePublish(evt.id, isPub)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${isPub
                        ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/25'
                      }`}
                  >
                    {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{isPub ? '公開中' : '非公開'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteEvent(evt.id, evt.title)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all border border-slate-300"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 新規ステージ演目登録モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-600 block uppercase tracking-wider">New Stage Event</span>
                <h3 className="font-bold text-lg text-slate-900">新規ステージ演目の追加</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-800 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">演目タイトル</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="例: 軽音楽部 ライブステージ"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">開催日</label>
                  <select
                    value={createForm.day_id}
                    onChange={(e) => setCreateForm({ ...createForm, day_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                  >
                    {days.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label} ({d.date_string})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">ステージ場所</label>
                  <select
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value as StageLocation })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                  >
                    <option value="courtyard">中庭メインステージ</option>
                    <option value="gym">第一体育館</option>
                    <option value="av_room">多目的ホール</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">開始日時</label>
                  <input
                    type="datetime-local"
                    value={createForm.start_time}
                    onChange={(e) => setCreateForm({ ...createForm, start_time: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">終了日時</label>
                  <input
                    type="datetime-local"
                    value={createForm.end_time}
                    onChange={(e) => setCreateForm({ ...createForm, end_time: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-600/20"
                >
                  {isSubmitting ? '登録処理中...' : '演目を登録する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 演目編集モーダル */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-600 block uppercase tracking-wider">Edit Event</span>
                <h3 className="font-bold text-lg text-slate-900">演目編集: {editingEvent.title}</h3>
              </div>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-800 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">演目タイトル</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">開催日</label>
                  <select
                    value={editForm.day_id}
                    onChange={(e) => setEditForm({ ...editForm, day_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                  >
                    {days.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label} ({d.date_string})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">ステージ場所</label>
                  <select
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value as StageLocation })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                  >
                    <option value="courtyard">中庭メインステージ</option>
                    <option value="gym">第一体育館</option>
                    <option value="av_room">多目的ホール</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">開始日時</label>
                  <input
                    type="datetime-local"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">終了日時</label>
                  <input
                    type="datetime-local"
                    value={editForm.end_time}
                    onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-600/20"
                >
                  {isSubmitting ? '保存中...' : '変更を保存する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
