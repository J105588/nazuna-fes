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
  ChevronDown,
  Users,
  Grid,
  List
} from 'lucide-react';
import type { TimetableEvent, TimetableDay, StageLocation, Organization } from '../../types/database';

const COLOR_OPTIONS: { value: string; label: string; dotColor: string }[] = [
  { value: 'red', label: '朱赤 (デフォルト)', dotColor: 'bg-[#D14B41]' },
  { value: 'blue', label: '藍紺', dotColor: 'bg-[#2C3E55]' },
  { value: 'green', label: '若草', dotColor: 'bg-[#558F3E]' },
  { value: 'purple', label: '藤紫', dotColor: 'bg-[#8F3E9C]' },
  { value: 'yellow', label: '黄金', dotColor: 'bg-[#D4982A]' }
];

const getColorDot = (color?: string) => {
  const found = COLOR_OPTIONS.find((c) => c.value === color);
  return found ? found.dotColor : COLOR_OPTIONS[0].dotColor;
};

export interface AdminEventsTabProps {
  timetableEvents: TimetableEvent[];
  days: TimetableDay[];
  organizations?: Organization[];
  onTogglePublish: (id: string, current: boolean) => Promise<void>;
  onCreateEvent: (data: {
    title: string;
    day_id: string;
    start_time: string;
    end_time: string;
    stage_location: StageLocation;
    description?: string;
    organization_id?: string;
    organization_name?: string;
    color?: string;
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
      organization_name?: string;
      color?: string;
    }
  ) => Promise<void>;
  onDeleteEvent: (id: string, title: string) => void;
  onCreateDay: (dateString: string, label: string) => Promise<void>;
  onDeleteDay: (id: string, label: string) => void;
}

export const AdminEventsTab: React.FC<AdminEventsTabProps> = ({
  timetableEvents,
  days,
  organizations = [],
  onTogglePublish,
  onCreateEvent,
  onSaveEvent,
  onDeleteEvent,
  onCreateDay,
  onDeleteDay
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<'all' | StageLocation>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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
    organization_name: string;
    color: string;
  }>({
    title: '',
    day_id: days[0]?.id || 'day-1',
    start_time: '',
    end_time: '',
    location: 'courtyard',
    description: '',
    organization_id: '',
    organization_name: '',
    color: 'red'
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
    organization_name: string;
    color: string;
  }>({
    title: '',
    day_id: 'day-1',
    start_time: '',
    end_time: '',
    location: 'courtyard',
    description: '',
    organization_id: '',
    organization_name: '',
    color: 'red'
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
      description: evt.description || '',
      organization_id: evt.organization_id || '',
      organization_name: evt.organization_name || '',
      color: evt.color || 'red'
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
        organization_id: createForm.organization_id || undefined,
        organization_name: createForm.organization_name || undefined,
        color: createForm.color
      });
      setShowCreateModal(false);
      setCreateForm({
        title: '',
        day_id: days[0]?.id || 'day-1',
        start_time: '',
        end_time: '',
        location: 'courtyard',
        description: '',
        organization_id: '',
        organization_name: '',
        color: 'red'
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
        organization_id: editForm.organization_id || undefined,
        organization_name: editForm.organization_name || undefined,
        color: editForm.color
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
        return { label: '古賀記念アリーナ', bg: 'bg-[#2C3E55]/15 text-[#2C3E55] border-[#607D8B]/30' };
      case 'av_room':
        return { label: '國枝記念国際ホール', bg: 'bg-purple-500/15 text-purple-700 border-purple-500/30' };
      case 'courtyard':
      default:
        return { label: 'Nステ会場', bg: 'bg-[#2C3E55]/15 text-[#2C3E55] border-[#607D8B]/30' };
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
          <h2 className="text-xl font-bold text-[#2C3E55] flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#2C3E55]" />
            <span>タイムテーブルステージ管理</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E2E8F0] text-[#2C3E55] text-xs font-mono border border-[#CBD5E1]">
              全{timetableEvents.length}演目
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowDayManager(!showDayManager)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              showDayManager
                ? 'bg-[#2C3E55] text-white border-blue-600 shadow-md'
                : 'bg-white text-[#2C3E55] hover:text-[#2C3E55] hover:bg-[#FAF8F5] border-[#B0BEC5] shadow-sm'
            }`}
          >
            <span>日にち (DAY) 設定</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDayManager ? 'rotate-180 text-[#2C3E55]' : ''}`} />
          </button>
          <button
            onClick={() => {
              setCreateForm({ ...createForm, day_id: selectedDayId === 'all' ? days[0]?.id || 'day-1' : selectedDayId });
              setShowCreateModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2C3E55] via-[#2C3E55] to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#607D8B]/20 border border-[#78909C]/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>新規演目を追加</span>
          </button>
        </div>
      </div>

      {/* 日にち設定パネル (アコーディオン) */}
      {showDayManager && (
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#2C3E55]">日にちタブ (DAY) 管理</h3>
              <p className="text-xs text-[#4A5568]">開催日ごとのタブを作成・削除します。</p>
            </div>
            <button onClick={() => setShowDayManager(false)} className="text-[#708090] hover:text-[#2C3E55] bg-[#E2E8F0] hover:bg-slate-200 p-1 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {days.map((day) => (
              <div
                key={day.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-xs text-[#2C3E55] shadow-xs"
              >
                <span className="font-bold text-[#2C3E55]">{day.label}</span>
                <span className="text-[#708090] font-mono">({day.date_string})</span>
                <button
                  onClick={() => onDeleteDay(day.id, day.label)}
                  className="text-[#94A3B8] hover:text-rose-600 p-1 rounded transition-colors ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddDaySubmit} className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#CBD5E1]">
            <input
              type="date"
              value={dayForm.date_string}
              onChange={(e) => setDayForm({ ...dayForm, date_string: e.target.value })}
              className="bg-white border border-[#B0BEC5] text-[#2C3E55] rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-600"
              required
            />
            <input
              type="text"
              value={dayForm.label}
              onChange={(e) => setDayForm({ ...dayForm, label: e.target.value })}
              placeholder="表示ラベル (例: DAY 1)"
              className="bg-white border border-[#B0BEC5] text-[#2C3E55] rounded-xl px-3.5 py-1.5 text-xs w-48 focus:outline-none focus:border-blue-600"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#2C3E55] to-[#2C3E55] hover:opacity-90 text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>日にち追加</span>
            </button>
          </form>
        </div>
      )}

      {/* タブ＆フィルタツールバー */}
      <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0 border-b md:border-b-0 border-[#CBD5E1]">
          <button
            onClick={() => setSelectedDayId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedDayId === 'all'
                ? 'bg-gradient-to-r from-[#2C3E55] to-[#2C3E55] text-white shadow-md shadow-blue-500/20 border border-[#607D8B]/30'
                : 'text-[#4A5568] hover:text-[#2C3E55] hover:bg-[#E2E8F0]'
            }`}
          >
            すべての日にち
          </button>
          {days.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDayId(d.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedDayId === d.id
                  ? 'bg-gradient-to-r from-[#2C3E55] to-[#2C3E55] text-white shadow-md shadow-blue-500/20 border border-[#607D8B]/30'
                  : 'text-[#4A5568] hover:text-[#2C3E55] hover:bg-[#E2E8F0]'
              }`}
            >
              <span>{d.label}</span>
              <span className="text-[10px] font-mono opacity-80">({d.date_string})</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center bg-[#E2E8F0] p-1 rounded-xl border border-[#CBD5E1]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white text-[#2C3E55] shadow-xs' : 'text-[#4A5568] hover:text-[#2C3E55]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>グリッド表 (フロント同等)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-[#2C3E55] shadow-xs' : 'text-[#4A5568] hover:text-[#2C3E55]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>リスト表</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#2C3E55] shrink-0" />
            <span className="text-xs text-[#2C3E55] font-semibold shrink-0">場所:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as any)}
              className="bg-white border border-[#B0BEC5] text-[#2C3E55] rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-600 transition-all shadow-xs"
            >
              <option value="all">すべてのステージ・会場</option>
              <option value="av_room">國枝記念国際ホール</option>
              <option value="gym">古賀記念アリーナ</option>
              <option value="courtyard">Nステ会場</option>
            </select>
          </div>
        </div>
      </div>

      {/* 演目タイムテーブル表示 (グリッド or リスト) */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Clock className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <h3 className="font-bold text-sm text-[#2C3E55]">表示するステージ演目がありません</h3>
          <p className="text-xs text-[#4A5568]">条件に合致する演目がないか、まだ登録されていません。</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
            <div>
              <h3 className="font-bold text-sm text-[#2C3E55] flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#2C3E55]" />
                <span>タイムテーブル表 (フロント画面と同等の3列構成)</span>
              </h3>
              <p className="text-xs text-[#708090] mt-0.5">各ステージの演目カードから、直接編集や公開ステータスの一発切り替えが可能です。</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { id: 'av_room', label: '國枝記念国際ホール', bgHeader: 'bg-[#2C3E55]', borderHeader: 'border-blue-600' },
              { id: 'gym', label: '古賀記念アリーナ', bgHeader: 'bg-[#2C3E55]', borderHeader: 'border-indigo-600' },
              { id: 'courtyard', label: 'Nステ会場', bgHeader: 'bg-purple-600', borderHeader: 'border-purple-600' }
            ]
              .filter((stg) => selectedLocation === 'all' || selectedLocation === stg.id)
              .map((stg) => {
                const stageEvts = filteredEvents
                  .filter((e) => e.stage_location === stg.id)
                  .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

                return (
                  <div key={stg.id} className="bg-[#FAF8F5] border border-[#CBD5E1] rounded-2xl overflow-hidden flex flex-col shadow-xs">
                    <div className={`${stg.bgHeader} text-white px-4 py-3 font-bold text-xs flex items-center justify-between`}>
                      <span>{stg.label}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">{stageEvts.length}件</span>
                    </div>

                    <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[680px] divide-y divide-slate-200/70">
                      {stageEvts.length === 0 ? (
                        <div className="py-12 text-center text-[#94A3B8] text-xs font-medium">
                          演目登録なし
                        </div>
                      ) : (
                        stageEvts.map((evt) => {
                          const isPub = Boolean(evt.is_published);
                          const startTimeStr = new Date(evt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const endTimeStr = new Date(evt.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                          return (
                            <div
                              key={evt.id}
                              className={`pt-3 first:pt-0 flex flex-col gap-2 transition-all ${
                                !isPub ? 'opacity-75 bg-[#D14B41]/5/60 p-2 rounded-xl border border-[#D14B41]/20/80' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="font-mono font-bold text-xs text-[#2C3E55] bg-[#EEF2F6] px-2 py-0.5 rounded border border-[#B0BEC5]">
                                  {startTimeStr} 〜 {endTimeStr}
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                  isPub ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-[#D14B41] border border-red-300'
                                }`}>
                                  {isPub ? '公開中' : '非公開'}
                                </span>
                              </div>

                              <div className="font-bold text-sm text-[#2C3E55] leading-snug flex items-center gap-1.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${getColorDot(evt.color)} shrink-0`} />
                                {evt.title}
                              </div>

                              {evt.organization_name && (
                                <div className="text-xs text-[#4A5568] font-medium flex items-center gap-1.5 truncate bg-white px-2 py-1 rounded border border-[#CBD5E1]">
                                  <Users className="w-3.5 h-3.5 text-[#2C3E55] shrink-0" />
                                  <span className="truncate">{evt.organization_name}</span>
                                </div>
                              )}

                              <div className="flex items-center justify-end gap-1.5 pt-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(evt)}
                                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E2E8F0] text-[#2C3E55] hover:text-[#2C3E55] transition-all border border-[#B0BEC5] text-xs font-bold flex items-center gap-1 shadow-2xs"
                                >
                                  <Edit3 className="w-3 h-3 text-[#2C3E55]" />
                                  <span>編集</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onTogglePublish(evt.id, isPub)}
                                  className={`px-2.5 py-1 rounded-lg transition-all text-xs font-bold flex items-center gap-1 shadow-2xs border ${
                                    isPub
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                      : 'bg-[#D14B41]/5 text-[#D14B41] border-red-300 hover:bg-[#D14B41]/10'
                                  }`}
                                >
                                  {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                  <span>{isPub ? '非公開へ' : '公開へ'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteEvent(evt.id, evt.title)}
                                  className="p-1.5 rounded-lg bg-white hover:bg-[#D14B41]/5 text-[#94A3B8] hover:text-[#D14B41] transition-all border border-[#B0BEC5] text-xs"
                                  title="削除"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#CBD5E1] text-[11px] font-bold text-[#4A5568] uppercase tracking-wider">
                  <th className="py-3.5 px-4">時間</th>
                  <th className="py-3.5 px-4">日にち</th>
                  <th className="py-3.5 px-4">ステージ会場</th>
                  <th className="py-3.5 px-4">団体・サークル名</th>
                  <th className="py-3.5 px-4">演目タイトル</th>
                  <th className="py-3.5 px-4 text-center">状態</th>
                  <th className="py-3.5 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-[#2C3E55]">
                {filteredEvents.map((evt) => {
                  const isPub = Boolean(evt.is_published);
                  const locBadge = getLocationBadge(evt.stage_location);
                  const dayInfo = days.find((d) => d.id === evt.day_id);
                  const startTimeStr = new Date(evt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const endTimeStr = new Date(evt.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={evt.id} className="hover:bg-[#FAF8F5]/80 transition-colors group">
                      <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                        <span className="text-[#2C3E55]">{startTimeStr}</span>
                        <span className="text-[#94A3B8] mx-1">〜</span>
                        <span>{endTimeStr}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {dayInfo ? (
                          <span className="px-2 py-0.5 rounded-md bg-[#E2E8F0] text-[#2C3E55] font-mono text-[11px] border border-[#CBD5E1]">
                            {dayInfo.label}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-lg font-semibold border ${locBadge.bg}`}>
                          {locBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#2C3E55]">
                        {evt.organization_name ? (
                          <span className="flex items-center gap-1 text-[#2C3E55] font-semibold">
                            <Users className="w-3.5 h-3.5 text-[#2C3E55]" />
                            {evt.organization_name}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8] italic">未指定</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#2C3E55] group-hover:text-[#2C3E55] transition-colors">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${getColorDot(evt.color)} shrink-0`} />
                          {evt.title}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPub ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-[#D14B41]/5 text-[#D14B41] border border-[#D14B41]/20'
                        }`}>
                          {isPub ? '公開中' : '非公開'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(evt)}
                            className="p-2 rounded-xl bg-[#E2E8F0] hover:bg-slate-200 text-[#2C3E55] hover:text-[#2C3E55] transition-all border border-[#B0BEC5]"
                            title="編集"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onTogglePublish(evt.id, isPub)}
                            className={`p-2 rounded-xl transition-all border ${
                              isPub
                                ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25'
                                : 'bg-[#D14B41]/50/15 text-[#D14B41] border-red-500/30 hover:bg-[#D14B41]/50/25'
                            }`}
                            title={isPub ? "非公開にする" : "公開する"}
                          >
                            {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteEvent(evt.id, evt.title)}
                            className="p-2 rounded-xl bg-[#E2E8F0] hover:bg-[#D14B41]/5 text-[#708090] hover:text-[#D14B41] transition-all border border-[#B0BEC5]"
                            title="削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 新規ステージ演目登録モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white border border-[#CBD5E1] text-[#2C3E55] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#2C3E55] block uppercase tracking-wider font-bold">New Stage Event</span>
                <h3 className="font-bold text-lg text-[#2C3E55]">新規ステージ演目の追加</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-[#94A3B8] hover:text-[#2C3E55] p-1.5 rounded-xl hover:bg-[#E2E8F0] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C3E55]">演目タイトル <span className="text-[#D14B41]">*</span></label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="例: 軽音楽部 ライブステージ"
                  className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2.5 text-sm text-[#2C3E55] placeholder-slate-400 focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C3E55]">団体・サークル選択 / 名称</label>
                <select
                  value={createForm.organization_id || ''}
                  onChange={(e) => {
                    const orgId = e.target.value;
                    if (!orgId) {
                      setCreateForm({ ...createForm, organization_id: '', organization_name: '' });
                    } else {
                      const found = organizations?.find((o) => o.id === orgId);
                      setCreateForm({
                        ...createForm,
                        organization_id: orgId,
                        organization_name: found ? found.name : ''
                      });
                    }
                  }}
                  className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2 text-xs text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                >
                  <option value="">-- 登録団体から選択（または自由入力） --</option>
                  {organizations?.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.category === 'class' ? 'クラス' : org.category === 'club' ? '部活・委員会' : '有志'})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={createForm.organization_name}
                  onChange={(e) => setCreateForm({ ...createForm, organization_name: e.target.value })}
                  placeholder="団体名（リスト選択時は自動補完、手動編集も可能）"
                  className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2 text-xs text-[#2C3E55] placeholder-slate-400 focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C3E55]">開催日</label>
                  <select
                    value={createForm.day_id}
                    onChange={(e) => setCreateForm({ ...createForm, day_id: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                  >
                    {days.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label} ({d.date_string})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C3E55]">ステージ場所</label>
                  <select
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value as StageLocation })}
                    className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                  >
                    <option value="av_room">國枝記念国際ホール</option>
                    <option value="gym">古賀記念アリーナ</option>
                    <option value="courtyard">Nステ会場</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C3E55]">開始日時 <span className="text-[#D14B41]">*</span></label>
                  <input
                    type="datetime-local"
                    value={createForm.start_time}
                    onChange={(e) => setCreateForm({ ...createForm, start_time: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3 py-2.5 text-xs text-[#2C3E55] font-mono focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C3E55]">終了日時 <span className="text-[#D14B41]">*</span></label>
                  <input
                    type="datetime-local"
                    value={createForm.end_time}
                    onChange={(e) => setCreateForm({ ...createForm, end_time: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3 py-2.5 text-xs text-[#2C3E55] font-mono focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C3E55]">カラーテーマ</label>
                <div className="flex items-center gap-2">
                  <select
                    value={createForm.color}
                    onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                    className="flex-1 bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <span className={`w-6 h-6 rounded-lg ${getColorDot(createForm.color)} border-2 border-[#CBD5E1] shrink-0 shadow-sm`} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#CBD5E1]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-[#E2E8F0] hover:bg-slate-200 text-[#2C3E55] text-xs font-medium transition-all border border-[#B0BEC5]"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2C3E55] to-[#2C3E55] hover:opacity-90 text-white text-xs font-semibold transition-all shadow-lg shadow-[#607D8B]/20 disabled:opacity-50"
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
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white border border-[#CBD5E1] text-[#2C3E55] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-4">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-[#2C3E55] block uppercase tracking-wider font-bold">Edit Event</span>
                <h3 className="font-bold text-lg text-[#2C3E55] truncate">演目編集: {editingEvent.title}</h3>
              </div>
              <button onClick={() => setEditingEvent(null)} className="text-[#94A3B8] hover:text-[#2C3E55] p-1.5 rounded-xl hover:bg-[#E2E8F0] transition-colors shrink-0 ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C3E55]">演目タイトル <span className="text-[#D14B41]">*</span></label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2.5 text-sm text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C3E55]">団体・サークル選択 / 名称</label>
                <select
                  value={editForm.organization_id || ''}
                  onChange={(e) => {
                    const orgId = e.target.value;
                    if (!orgId) {
                      setEditForm({ ...editForm, organization_id: '', organization_name: '' });
                    } else {
                      const found = organizations?.find((o) => o.id === orgId);
                      setEditForm({
                        ...editForm,
                        organization_id: orgId,
                        organization_name: found ? found.name : ''
                      });
                    }
                  }}
                  className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2 text-xs text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                >
                  <option value="">-- 登録団体から選択（または自由入力） --</option>
                  {organizations?.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.category === 'class' ? 'クラス' : org.category === 'club' ? '部活・委員会' : '有志'})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editForm.organization_name}
                  onChange={(e) => setEditForm({ ...editForm, organization_name: e.target.value })}
                  placeholder="団体名（リスト選択時は自動補完、手動編集も可能）"
                  className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2 text-xs text-[#2C3E55] placeholder-slate-400 focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C3E55]">開催日</label>
                  <select
                    value={editForm.day_id}
                    onChange={(e) => setEditForm({ ...editForm, day_id: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                  >
                    {days.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label} ({d.date_string})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C3E55]">ステージ場所</label>
                  <select
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value as StageLocation })}
                    className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                  >
                    <option value="av_room">國枝記念国際ホール</option>
                    <option value="gym">古賀記念アリーナ</option>
                    <option value="courtyard">Nステ会場</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C3E55]">開始日時 <span className="text-[#D14B41]">*</span></label>
                  <input
                    type="datetime-local"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3 py-2.5 text-xs text-[#2C3E55] font-mono focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C3E55]">終了日時 <span className="text-[#D14B41]">*</span></label>
                  <input
                    type="datetime-local"
                    value={editForm.end_time}
                    onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3 py-2.5 text-xs text-[#2C3E55] font-mono focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C3E55]">カラーテーマ</label>
                <div className="flex items-center gap-2">
                  <select
                    value={editForm.color}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    className="flex-1 bg-[#FAF8F5] border border-[#B0BEC5] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E55] focus:outline-none focus:border-[#607D8B] focus:ring-2 focus:ring-[#90A4AE]/20 transition-all"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <span className={`w-6 h-6 rounded-lg ${getColorDot(editForm.color)} border-2 border-[#CBD5E1] shrink-0 shadow-sm`} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#CBD5E1]">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-[#E2E8F0] hover:bg-slate-200 text-[#2C3E55] text-xs font-medium transition-all border border-[#B0BEC5]"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2C3E55] to-[#2C3E55] hover:opacity-90 text-white text-xs font-semibold transition-all shadow-lg shadow-[#607D8B]/20 disabled:opacity-50"
                >
                  {isSubmitting ? '更新処理中...' : '変更を保存する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
