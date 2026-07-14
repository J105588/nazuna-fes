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

  const getPageDescription = (id: string): string => {
    switch (id) {
      case 'home':
        return '総合トップページ・お知らせサマリー・オープニング演出等';
      case 'exhibitions':
        return 'クラス・部活動・有志等の出し物・展示の企画一覧ページ';
      case 'timetable':
        return '体育館・中庭等各ステージの演目タイムテーブルページ';
      case 'map':
        return '校内キャンパスマップおよび外部案内マップページ';
      case 'info':
        return '2026年度なずな祭テーマ「百輝夜行」紹介・学校案内ページ';
      case 'lostfound':
        return '遺失物・拾得物の検索および総合案内所への返却状況ページ';
      case 'guidance':
        return 'アクセス窓口・ご来場者様向け諸注意・よくある質問ページ';
      case 'policy':
        return '撮影規約・プライバシーポリシーおよび利用規約ページ';
      default:
        return '個別公開管理ページ';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ヘッダー・一括操作ボタン */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>ページ単位の公開・準備中設定</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            サイト上の各主要ページの公開状況をリアルタイムで切替できます。非公開（準備中）に設定したページに一般ユーザーがアクセスした際は、専用の和風ご案内画面とメッセージが表示されます。
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleBatch(true)}
            disabled={batchLoading}
            className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
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
              className={`bg-white rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between shadow-xs ${
                page.is_public
                  ? 'border-slate-200/80 hover:border-blue-300'
                  : 'border-amber-300/80 bg-amber-50/20 hover:border-amber-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                        page.is_public
                          ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                          : 'bg-amber-100 text-amber-700 border border-amber-300/60'
                      }`}
                    >
                      {page.is_public ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{page.title}</h3>
                      <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                        ID: {page.id}
                      </p>
                    </div>
                  </div>

                  {/* トグルスイッチ */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        page.is_public
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {page.is_public ? '公開中' : '準備中（非公開）'}
                    </span>
                    <button
                      onClick={() => onTogglePublic(page.id, !page.is_public)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                        page.is_public ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                      title={page.is_public ? '非公開（準備中）に切り替える' : '公開する'}
                      aria-label={page.is_public ? '公開中' : '準備中'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          page.is_public ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 ml-1">
                  {getPageDescription(page.id)}
                </p>

                {/* カスタム準備中メッセージ */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>準備中時 表示メッセージ</span>
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(page)}
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                        className="w-full text-xs p-2.5 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 h-20 resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={() => handleSaveMessage(page.id)}
                          disabled={isSubmitting}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>保存</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200/50">
                      {page.custom_message || '現在メンテナンス中です。しばらくお待ちください。'}
                    </p>
                  )}
                </div>
              </div>

              {/* 最終更新時刻 */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
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
