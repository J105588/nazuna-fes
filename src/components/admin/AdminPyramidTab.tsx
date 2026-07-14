import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Lock,
  Unlock,
  Save,
  Clock,
  ShieldAlert,
  PlusCircle,
  Trash2,
  X,
  Award,
  CheckCircle2
} from 'lucide-react';
import type { PyramidRelease, Organization } from '../../types/database';

export interface AdminPyramidTabProps {
  pyramidReleases: PyramidRelease[];
  organizations?: Organization[];
  selectedReleaseIndex: number;
  setSelectedReleaseIndex: (idx: number) => void;
  onSaveTitleMessage: (releaseId: string, title: string, embargoMessage: string) => Promise<void>;
  onSaveRelease?: (releaseId: string, updates: Partial<PyramidRelease>) => Promise<void>;
  onToggleEmbargo: (releaseId: string, nextEmbargo: boolean) => Promise<void>;
  onCreateRelease?: (data: {
    title: string;
    scheduledTime: string;
    embargoMessage: string;
    pyramidTiers?: { high: string[]; upper: string[]; middle: string[] };
  }) => Promise<void>;
  onDeleteRelease?: (releaseId: string, title: string) => void;
}

export const AdminPyramidTab: React.FC<AdminPyramidTabProps> = ({
  pyramidReleases,
  organizations = [],
  selectedReleaseIndex,
  setSelectedReleaseIndex,
  onSaveTitleMessage,
  onSaveRelease,
  onToggleEmbargo,
  onCreateRelease,
  onDeleteRelease
}) => {
  const currentRelease = pyramidReleases[selectedReleaseIndex] || pyramidReleases[0];
  
  // 編集フォーム状態
  const [releaseTitleInput, setReleaseTitleInput] = useState(currentRelease?.title || '');
  const [embargoMsgInput, setEmbargoMsgInput] = useState(currentRelease?.embargoMessage || '');
  const [scheduledTimeInput, setScheduledTimeInput] = useState(currentRelease?.scheduledTime ? currentRelease.scheduledTime.slice(0, 16) : '');
  const [pyramidTiersInput, setPyramidTiersInput] = useState<{ high: string[]; upper: string[]; middle: string[] }>({
    high: currentRelease?.pyramidTiers?.high || [],
    upper: currentRelease?.pyramidTiers?.upper || [],
    middle: currentRelease?.pyramidTiers?.middle || []
  });
  const [isSaving, setIsSaving] = useState(false);

  // 新規登録モーダル状態
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '中間発表・結果開示',
    scheduledTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    embargoMessage: '集計完了後に順位と詳細を公開します。'
  });
  const [isCreatingSaving, setIsCreatingSaving] = useState(false);

  useEffect(() => {
    if (currentRelease) {
      setReleaseTitleInput(currentRelease.title || '');
      setEmbargoMsgInput(currentRelease.embargoMessage || '');
      setScheduledTimeInput(currentRelease.scheduledTime ? currentRelease.scheduledTime.slice(0, 16) : '');
      setPyramidTiersInput({
        high: currentRelease.pyramidTiers?.high || [],
        upper: currentRelease.pyramidTiers?.upper || [],
        middle: currentRelease.pyramidTiers?.middle || []
      });
    }
  }, [selectedReleaseIndex, currentRelease]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRelease) return;
    const releaseId = currentRelease.releaseId || currentRelease.id;
    setIsSaving(true);
    try {
      if (onSaveRelease) {
        await onSaveRelease(releaseId, {
          title: releaseTitleInput,
          embargoMessage: embargoMsgInput,
          scheduledTime: scheduledTimeInput ? new Date(scheduledTimeInput).toISOString() : currentRelease.scheduledTime,
          pyramidTiers: pyramidTiersInput
        });
      } else {
        await onSaveTitleMessage(releaseId, releaseTitleInput, embargoMsgInput);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateRelease) return;
    setIsCreatingSaving(true);
    try {
      await onCreateRelease({
        title: createForm.title,
        scheduledTime: new Date(createForm.scheduledTime).toISOString(),
        embargoMessage: createForm.embargoMessage,
        pyramidTiers: { high: [], upper: [], middle: [] }
      });
      setIsCreating(false);
    } finally {
      setIsCreatingSaving(false);
    }
  };

  const handleAddOrgToTier = (tier: 'high' | 'upper' | 'middle', orgIdOrName: string) => {
    if (!orgIdOrName) return;
    setPyramidTiersInput((prev) => {
      const currentList = prev[tier] || [];
      if (currentList.includes(orgIdOrName)) return prev;
      return { ...prev, [tier]: [...currentList, orgIdOrName] };
    });
  };

  const handleRemoveOrgFromTier = (tier: 'high' | 'upper' | 'middle', orgIdOrName: string) => {
    setPyramidTiersInput((prev) => ({
      ...prev,
      [tier]: (prev[tier] || []).filter((item) => item !== orgIdOrName)
    }));
  };

  const getOrgDisplayName = (idOrName: string) => {
    const org = organizations.find((o) => o.id === idOrName || o.name === idOrName);
    return org ? `${org.name} (${org.room_code || '企画'})` : idOrName;
  };

  return (
    <div className="space-y-8 select-none animate-in fade-in duration-300">
      {/* 画面ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>ピラミッド結果開示設定</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono border border-indigo-200">
              {pyramidReleases.length}タイミング
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            後夜祭ピラミッド企画の結果発表スケジュールおよび、ユーザー画面への即時開示・ロック・受賞構成をすべて管理画面から制御します。
          </p>
        </div>

        {onCreateRelease && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-md self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>＋ 新規開示タイミングを追加</span>
          </button>
        )}
      </div>

      {/* 開示選択カードタブ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pyramidReleases.map((release, index) => {
          const isSelected = selectedReleaseIndex === index;
          const isEmbargo = Boolean(release.isEmbargoed);
          const releaseId = release.releaseId || release.id || String(index);

          return (
            <button
              key={releaseId}
              onClick={() => setSelectedReleaseIndex(index)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3.5 ${
                isSelected
                  ? 'bg-white border-indigo-500 shadow-md scale-[1.02]'
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider">
                  RELEASE #{index + 1}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 tracking-wider uppercase ${
                    isEmbargo
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                  }`}
                >
                  {isEmbargo ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{isEmbargo ? 'ロック中' : '開示中'}</span>
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {release.title || `開示タイミング ${index + 1}`}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {release.scheduledTime
                      ? new Date(release.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '--:--'} 予定
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 選択中の開示詳細＆コントロール */}
      {currentRelease && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

          {/* ステータスバナー */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider">
                  Target Configuration
                </span>
                <span className="text-slate-400 font-mono">•</span>
                <span className="text-xs font-mono text-slate-600">
                  予定日時: {currentRelease.scheduledTime ? new Date(currentRelease.scheduledTime).toLocaleString() : '未定'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{currentRelease.title}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onToggleEmbargo(currentRelease.releaseId || currentRelease.id, !currentRelease.isEmbargoed)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all border shadow-md ${
                  currentRelease.isEmbargoed
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white border-emerald-500'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-90 text-white border-rose-500'
                }`}
              >
                {currentRelease.isEmbargoed ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>結果を即時開示する (ロック解除)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>結果をロック状態に戻す (非表示)</span>
                  </>
                )}
              </button>

              {onDeleteRelease && (
                <button
                  onClick={() => onDeleteRelease(currentRelease.releaseId || currentRelease.id, currentRelease.title)}
                  className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-all border border-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>スケジュールを削除</span>
                </button>
              )}
            </div>
          </div>

          {/* 編集フォーム */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <span>開示タイトル</span>
                </label>
                <input
                  type="text"
                  value={releaseTitleInput}
                  onChange={(e) => setReleaseTitleInput(e.target.value)}
                  placeholder="例: 中間発表1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <span>開示予定時刻</span>
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTimeInput}
                  onChange={(e) => setScheduledTimeInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <span>ロック中の表示メッセージ</span>
                </label>
                <input
                  type="text"
                  value={embargoMsgInput}
                  onChange={(e) => setEmbargoMsgInput(e.target.value)}
                  placeholder="例: 13:00 頃に結果発表を行います"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* ピラミッド受賞構成の設定パネル */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">ピラミッド受賞構成・順位団体設定</h4>
                  <p className="text-xs text-slate-500">
                    このタイミングで発表される各賞（金賞・銀賞・銅賞）に該当する出展団体を選択して登録します。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 金賞 (High) */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>金賞 (TOP層)</span>
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {pyramidTiersInput.high.length}団体
                    </span>
                  </div>

                  <select
                    onChange={(e) => {
                      handleAddOrgToTier('high', e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="" disabled>＋ 金賞に団体を追加...</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.room_code || '企画'})
                      </option>
                    ))}
                  </select>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {pyramidTiersInput.high.map((orgIdOrName) => (
                      <div
                        key={orgIdOrName}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-amber-200 text-xs shadow-2xs"
                      >
                        <span className="font-medium text-slate-800 truncate">{getOrgDisplayName(orgIdOrName)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOrgFromTier('high', orgIdOrName)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {pyramidTiersInput.high.length === 0 && (
                      <p className="text-[11px] text-amber-700/60 text-center py-3">団体が選択されていません</p>
                    )}
                  </div>
                </div>

                {/* 銀賞 (Upper) */}
                <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-slate-500" />
                      <span>銀賞 (UPPER層)</span>
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {pyramidTiersInput.upper.length}団体
                    </span>
                  </div>

                  <select
                    onChange={(e) => {
                      handleAddOrgToTier('upper', e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-500"
                  >
                    <option value="" disabled>＋ 銀賞に団体を追加...</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.room_code || '企画'})
                      </option>
                    ))}
                  </select>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {pyramidTiersInput.upper.map((orgIdOrName) => (
                      <div
                        key={orgIdOrName}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                      >
                        <span className="font-medium text-slate-800 truncate">{getOrgDisplayName(orgIdOrName)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOrgFromTier('upper', orgIdOrName)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {pyramidTiersInput.upper.length === 0 && (
                      <p className="text-[11px] text-slate-500 text-center py-3">団体が選択されていません</p>
                    )}
                  </div>
                </div>

                {/* 銅賞 (Middle) */}
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-orange-600" />
                      <span>銅賞 (MIDDLE層)</span>
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                      {pyramidTiersInput.middle.length}団体
                    </span>
                  </div>

                  <select
                    onChange={(e) => {
                      handleAddOrgToTier('middle', e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="" disabled>＋ 銅賞に団体を追加...</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.room_code || '企画'})
                      </option>
                    ))}
                  </select>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {pyramidTiersInput.middle.map((orgIdOrName) => (
                      <div
                        key={orgIdOrName}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-orange-200 text-xs shadow-2xs"
                      >
                        <span className="font-medium text-slate-800 truncate">{getOrgDisplayName(orgIdOrName)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOrgFromTier('middle', orgIdOrName)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {pyramidTiersInput.middle.length === 0 && (
                      <p className="text-[11px] text-orange-700/60 text-center py-3">団体が選択されていません</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>変更はデータベースに保存され、すべてのユーザーにリアルタイム反映されます。</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>保存中...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>設定と受賞構成をすべて保存する</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 新規開示タイミング作成モーダル */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono text-indigo-600 block uppercase tracking-wider">New Schedule</span>
                <h3 className="font-bold text-lg text-slate-900">新規ピラミッド開示タイミングの追加</h3>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">開示タイトル</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="例: 中間発表2, 最終結果発表"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">開示予定時刻</label>
                <input
                  type="datetime-local"
                  value={createForm.scheduledTime}
                  onChange={(e) => setCreateForm({ ...createForm, scheduledTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">ロック中の表示メッセージ</label>
                <input
                  type="text"
                  value={createForm.embargoMessage}
                  onChange={(e) => setCreateForm({ ...createForm, embargoMessage: e.target.value })}
                  placeholder="例: 15:00 頃に順位と結果を公開します"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  disabled={isCreatingSaving}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all border border-slate-200"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSaving}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all flex items-center gap-2 shadow-md"
                >
                  {isCreatingSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>追加中...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>スケジュールを追加</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
