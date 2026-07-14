import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Lock,
  Unlock,
  Save,
  Clock,
  ShieldAlert
} from 'lucide-react';
import type { PyramidRelease } from '../../types/database';

export interface AdminPyramidTabProps {
  pyramidReleases: PyramidRelease[];
  selectedReleaseIndex: number;
  setSelectedReleaseIndex: (idx: number) => void;
  onSaveTitleMessage: (releaseId: string, title: string, embargoMessage: string) => Promise<void>;
  onToggleEmbargo: (releaseId: string, nextEmbargo: boolean) => Promise<void>;
}

export const AdminPyramidTab: React.FC<AdminPyramidTabProps> = ({
  pyramidReleases,
  selectedReleaseIndex,
  setSelectedReleaseIndex,
  onSaveTitleMessage,
  onToggleEmbargo
}) => {
  const currentRelease = pyramidReleases[selectedReleaseIndex] || pyramidReleases[0];
  const [releaseTitleInput, setReleaseTitleInput] = useState(currentRelease?.title || '');
  const [embargoMsgInput, setEmbargoMsgInput] = useState(currentRelease?.embargoMessage || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentRelease) {
      setReleaseTitleInput(currentRelease.title || '');
      setEmbargoMsgInput(currentRelease.embargoMessage || '');
    }
  }, [selectedReleaseIndex, currentRelease]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRelease) return;
    const releaseId = currentRelease.releaseId || currentRelease.id;
    setIsSaving(true);
    try {
      await onSaveTitleMessage(releaseId, releaseTitleInput, embargoMsgInput);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 select-none animate-in fade-in duration-300">
      {/* 画面ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>ピラミッド結果開示設定</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            後夜祭ピラミッド企画の結果発表スケジュールおよび、ユーザー画面への即時開示・ロックを制御します。
          </p>
        </div>
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
                  <span>{new Date(release.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 予定</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 選択中の開示詳細＆コントロール */}
      {currentRelease && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
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
                  予定日時: {new Date(currentRelease.scheduledTime).toLocaleString()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{currentRelease.title}</h3>
            </div>

            <div className="flex items-center gap-3">
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
            </div>
          </div>

          {/* 編集フォーム */}
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <span>開示タイトル</span>
                </label>
                <input
                  type="text"
                  value={releaseTitleInput}
                  onChange={(e) => setReleaseTitleInput(e.target.value)}
                  placeholder="例: 第1弾 中間発表"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  required
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
                  placeholder="例: 14:00 頃に結果発表を行います"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>開示中に変更したタイトル・メッセージはユーザー端末へ即時反映されます。</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>保存中...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>タイトル＆メッセージを保存</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
