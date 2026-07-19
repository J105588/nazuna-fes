import React, { useState } from 'react';
import type { PageSetting } from '../../types/database';
import { Globe, Lock, Edit3, Check, Sparkles, Layers } from 'lucide-react';

interface AdminPagesTabProps {
  pageSettings: PageSetting[];
  onTogglePublic: (id: string, is_public: boolean) => Promise<void>;
  onUpdateMessage: (id: string, custom_message: string) => Promise<void>;
  onBatchToggle: (is_public: boolean) => Promise<void>;
}

export const AdminPagesTab: React.FC<AdminPagesTabProps> = ({
  pageSettings,
  onTogglePublic,
  onUpdateMessage,
  onBatchToggle
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);

  const handleStartEdit = (page: PageSetting) => {
    setEditingId(page.id);
    setEditMessage(page.custom_message || '');
  };

  const handleSaveMessage = async (id: string) => {
    setIsSubmitting(true);
    try {
      await onUpdateMessage(id, editMessage);
      setEditingId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatch = async (is_public: boolean) => {
    setBatchLoading(true);
    try {
      await onBatchToggle(is_public);
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ヘッダー・一括操作ボタン */}
      <div className="bg-white rounded-2xl p-5 border border-[#CBD5E1]/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#2C3E55] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#2C3E55]" />
            <span>ページ単位の公開・メニュー表示設定</span>
          </h2>
          <p className="text-xs text-[#708090] mt-1">
            サイト上の各主要ページの公開状況をリアルタイムで切替できます。非公開（準備中）に設定したページはハンバーガーメニュー内に表示されなくなり、URLで直接アクセスした際も準備中案内画面とメッセージが表示されます。
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleBatch(true)}
            disabled={batchLoading}
            className="px-3.5 py-2 rounded-xl bg-[#EEF2F6] text-[#2C3E55] hover:bg-[#E2E8F0] border border-[#B0BEC5]/60 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#2C3E55]" />
            <span>一括公開する</span>
          </button>
          <button
            onClick={() => handleBatch(false)}
            disabled={batchLoading}
            className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Lock className="w-4 h-4 text-amber-600" />
            <span>一括準備中にする</span>
          </button>
        </div>
      </div>

      {/* ページ一覧カードグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pageSettings.map((page) => {
          const isEditing = editingId === page.id;
          return (
            <div
              key={page.id}
              className={`bg-white rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between shadow-xs ${page.is_public
                ? 'border-[#CBD5E1]/80 hover:border-[#90A4AE]'
                : 'border-amber-300/80 bg-amber-50/20 hover:border-amber-400'
                }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${page.is_public
                        ? 'bg-[#EEF2F6] text-[#2C3E55] border border-[#B0BEC5]/60'
                        : 'bg-amber-100 text-amber-700 border border-amber-300/60'
                        }`}
                    >
                      {page.is_public ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#2C3E55] truncate">{page.title}</h3>
                      <p className="text-[10px] text-[#94A3B8] font-mono tracking-wider uppercase">
                        ID: {page.id}
                      </p>
                    </div>
                  </div>

                  {/* トグルスイッチ */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${page.is_public
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                    >
                      {page.is_public ? '公開中（メニュー表示）' : '準備中（メニュー非表示）'}
                    </span>
                    <button
                      onClick={() => onTogglePublic(page.id, !page.is_public)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#607D8B] focus:ring-offset-2 ${page.is_public ? 'bg-[#2C3E55]' : 'bg-slate-300'
                        }`}
                      title={page.is_public ? '準備中（メニュー非表示）に切り替える' : '公開する（メニュー表示）'}
                      aria-label={page.is_public ? '公開中（メニュー表示）' : '準備中（メニュー非表示）'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${page.is_public ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* カスタム準備中メッセージ */}
                <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#CBD5E1]/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-[#4A5568] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>準備中時 表示メッセージ</span>
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(page)}
                        className="text-[11px] font-medium text-[#2C3E55] hover:text-[#2C3E55] flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>編集</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        placeholder="例：現在、企画一覧を最終確認中です。9月19日 9:00より公開予定ですのでしばらくお待ちください。"
                        className="w-full text-xs p-2.5 rounded-lg border border-[#90A4AE] focus:outline-none focus:ring-2 focus:ring-[#90A4AE] bg-white text-[#2C3E55] h-20 resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#4A5568] hover:bg-slate-200/60 transition-colors"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={() => handleSaveMessage(page.id)}
                          disabled={isSubmitting}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#2C3E55] text-white hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>保存</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#2C3E55] italic bg-white p-2 rounded-lg border border-[#CBD5E1]/50">
                      {page.custom_message || '現在メンテナンス中です。しばらくお待ちください。'}
                    </p>
                  )}
                </div>
              </div>

              {/* 最終更新時刻 */}
              <div className="mt-4 pt-3 border-t border-[#CBD5E1] flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                <span>Updated</span>
                <span>{page.updated_at ? new Date(page.updated_at).toLocaleString('ja-JP') : '―'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
