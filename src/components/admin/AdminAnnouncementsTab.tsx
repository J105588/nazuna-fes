import React, { useState, useMemo } from 'react';
import {
  Bell,
  Send,
  Eye,
  EyeOff,
  Trash2,
  Sparkles,
  Search,
  X,
  Radio
} from 'lucide-react';
import type { Announcement, AnnouncementCategory } from '../../types/database';

export interface AdminAnnouncementsTabProps {
  announcements: Announcement[];
  onCreateAnnouncement: (title: string, content: string, category: AnnouncementCategory) => Promise<void>;
  onTogglePublish: (id: string, current: boolean) => Promise<void>;
  onDeleteAnnouncement: (id: string, title: string) => void;
}

export const AdminAnnouncementsTab: React.FC<AdminAnnouncementsTabProps> = ({
  announcements,
  onCreateAnnouncement,
  onTogglePublish,
  onDeleteAnnouncement
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<'all' | AnnouncementCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateAnnouncement(title.trim(), content.trim(), category);
      setTitle('');
      setContent('');
      setCategory('general');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAnnouncements = useMemo(() => {
    return [...announcements]
      .filter((ann) => {
        if (categoryFilter !== 'all' && ann.category !== categoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = ann.title?.toLowerCase().includes(q);
          const matchContent = ann.content?.toLowerCase().includes(q);
          if (!matchTitle && !matchContent) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [announcements, categoryFilter, searchQuery]);

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'urgent':
        return {
          label: '緊急・重要',
          badgeBg: 'bg-[#D14B41]/5 text-[#D14B41] border-[#D14B41]/20 font-bold',
          border: 'border-[#D14B41]/20 bg-[#D14B41]/5/50'
        };
      case 'stage':
        return {
          label: 'ステージ予定',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
          border: 'border-amber-200 bg-amber-50/50'
        };
      case 'general':
      default:
        return {
          label: '一般お知らせ',
          badgeBg: 'bg-[#EEF2F6] text-[#2C3E55] border-[#B0BEC5]',
          border: 'border-[#CBD5E1] bg-white'
        };
    }
  };

  return (
    <div className="space-y-8 select-none animate-in fade-in duration-300">
      {/* 画面ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E55] flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>お知らせ・速報配信管理</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E2E8F0] text-[#2C3E55] text-xs font-mono border border-[#CBD5E1]">
              全{announcements.length}配信
            </span>
          </h2>
          <p className="text-xs text-[#4A5568] mt-1">
            来場者のスマートフォンや会場電子掲示板へ即時反映されるお知らせを配信します。
          </p>
        </div>
      </div>

      {/* 新規お知らせ配信フォーム & ライブプレビュー (2カラム) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 作成フォーム */}
        <form
          onSubmit={handleCreate}
          className="lg:col-span-3 bg-white border border-[#CBD5E1] rounded-2xl p-6 space-y-5 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <h3 className="font-bold text-sm text-[#2C3E55] flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-500" />
                <span>新規お知らせの作成・配信</span>
              </h3>
              <span className="text-[10px] text-amber-600 font-mono tracking-wider uppercase">Real-time Push</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#2C3E55]">配信タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: 【速報】中庭ステージ開演10分前"
                className="w-full bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#2C3E55] focus:outline-none focus:border-amber-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#2C3E55]">配信カテゴリ</label>
              <div className="grid grid-cols-3 gap-3.5">
                {[
                  { id: 'general' as const, label: '一般お知らせ', color: 'blue' },
                  { id: 'stage' as const, label: 'ステージ予定', color: 'amber' },
                  { id: 'urgent' as const, label: '緊急・重要', color: 'red' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      category === item.id
                        ? item.id === 'urgent'
                          ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs font-semibold'
                          : item.id === 'stage'
                          ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-2xs font-semibold'
                          : 'bg-[#EEF2F6] border-[#78909C] text-blue-900 shadow-2xs font-semibold'
                        : 'bg-[#FAF8F5] border-[#CBD5E1] text-[#4A5568] hover:text-[#2C3E55] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs">{item.label}</span>
                      <Radio
                        className={`w-3.5 h-3.5 ${
                          category === item.id
                            ? item.id === 'urgent'
                              ? 'text-rose-600'
                              : item.id === 'stage'
                              ? 'text-amber-600'
                              : 'text-[#2C3E55]'
                            : 'text-[#94A3B8]'
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#2C3E55]">本文メッセージ</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="配信する詳細なテキストや案内事項を入力してください。"
                className="w-full bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#2C3E55] focus:outline-none focus:border-amber-500 leading-relaxed transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#CBD5E1] flex items-center justify-between gap-4">
            <span className="text-[11px] text-[#708090]">
              ※ 配信直後からポータルおよびアプリのユーザー画面に公開されます。
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:opacity-90 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? '配信処理中...' : 'お知らせを配信する'}</span>
            </button>
          </div>
        </form>

        {/* ライブプレビュー */}
        <div className="lg:col-span-2 bg-white border border-[#CBD5E1] rounded-2xl p-6 space-y-4 flex flex-col justify-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-amber-100 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
            <span className="text-xs font-mono text-amber-600 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </span>
            <span className="text-[10px] text-[#708090] font-mono">ユーザー画面プレビュー</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-[#708090]">以下のようにユーザーに表示されます：</p>
            <div
              className={`p-5 rounded-2xl border space-y-3 transition-all ${
                category === 'urgent'
                  ? 'bg-rose-50 border-rose-300 shadow-sm'
                  : category === 'stage'
                  ? 'bg-amber-50 border-amber-300 shadow-sm'
                  : 'bg-[#FAF8F5] border-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    getCategoryStyles(category).badgeBg
                  }`}
                >
                  {getCategoryStyles(category).label}
                </span>
                <span className="text-[10px] font-mono text-[#708090]">たった今</span>
              </div>
              <h4 className="font-bold text-sm text-[#2C3E55] break-words">
                {title || '【タイトルがここに入ります】'}
              </h4>
              <p className="text-xs text-[#2C3E55] leading-relaxed break-words whitespace-pre-wrap">
                {content || '本文のメッセージ本文がリアルタイムでこちらに反映されます。'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 配信済み一覧セクション */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#CBD5E1] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as const, label: 'すべて表示' },
              { id: 'urgent' as const, label: '緊急・重要' },
              { id: 'stage' as const, label: 'ステージ予定' },
              { id: 'general' as const, label: '一般お知らせ' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCategoryFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  categoryFilter === f.id
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-[#4A5568] hover:text-[#2C3E55] hover:bg-[#E2E8F0]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タイトル・本文から検索..."
              className="w-full bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#2C3E55] placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2C3E55]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* リスト表示 */}
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white border border-[#CBD5E1] rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <Bell className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <h3 className="font-bold text-sm text-[#2C3E55]">該当するお知らせが見つかりませんでした</h3>
            <p className="text-xs text-[#708090]">条件を変更するか、新しいお知らせを配信してください。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnnouncements.map((ann) => {
              const isPub = Boolean(ann.is_published);
              const styles = getCategoryStyles(ann.category);

              return (
                <div
                  key={ann.id}
                  className={`border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-2xs ${styles.border}`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${styles.badgeBg}`}>
                        {styles.label}
                      </span>
                      <span className="text-xs font-mono text-[#708090]">
                        {new Date(ann.created_at).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-[#2C3E55]">{ann.title}</h4>
                    <p className="text-xs text-[#2C3E55] leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                  </div>

                  <div className="pt-3 border-t border-[#CBD5E1] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onTogglePublish(ann.id, isPub)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                        isPub
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-[#D14B41]/5 text-[#D14B41] border-[#D14B41]/20 hover:bg-[#D14B41]/10'
                      }`}
                    >
                      {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isPub ? '公開中' : '停止中'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteAnnouncement(ann.id, ann.title)}
                      className="p-2 rounded-xl bg-[#E2E8F0] hover:bg-[#D14B41]/5 text-[#4A5568] hover:text-[#D14B41] transition-all border border-[#CBD5E1]"
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
      </div>
    </div>
  );
};
