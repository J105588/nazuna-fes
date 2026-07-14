import React, { useState, useMemo } from 'react';
import { Bell, ChevronRight, Calendar } from 'lucide-react';
import type { Announcement, AnnouncementCategory } from '../types/database';
import { AnnouncementDetailModal } from '../components/common/AnnouncementDetailModal';

/*
  ========================================================================
  AnnouncementsPage - 実行委員会からのお知らせ（速報・通知） 独立ページ
  ========================================================================
  絵文字不使用・完全SVG対応。他のメイン画面（企画一覧・タイムテーブル等）と
  デザイン・トーン＆マナー（生成り白 #FAF8F5・市松模様・和風モダン表形式）を完全統一。
  クリックで展開する詳細モーダルはスクロールロック・適切なz-indexを設定。
*/

interface AnnouncementsPageProps {
  announcements: Announcement[];
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ announcements }) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | AnnouncementCategory>('all');

  // フロントカテゴリ表示を管理画面と同一の日本語名・スタイルに完全統一
  const getCategoryBadge = (category: AnnouncementCategory) => {
    switch (category) {
      case 'urgent':
        return {
          label: '緊急・重要',
          className: 'bg-rose-500/15 border border-rose-500/40 text-rose-700 font-bold px-3 py-1 rounded-md text-xs tracking-wider shadow-xs'
        };
      case 'stage':
        return {
          label: 'ステージ予定',
          className: 'bg-amber-500/15 border border-amber-500/40 text-amber-800 font-bold px-3 py-1 rounded-md text-xs tracking-wider shadow-xs'
        };
      case 'general':
      default:
        return {
          label: '一般お知らせ',
          className: 'bg-blue-500/15 border border-blue-500/40 text-blue-700 font-bold px-3 py-1 rounded-md text-xs tracking-wider shadow-xs'
        };
    }
  };

  // 公開設定（is_published === true）のデータのみを抽出し、新しい日時順（降順）にソート
  const publishedAnnouncements = useMemo(() => {
    return announcements
      .filter((a) => a.is_published)
      .filter((a) => (activeCategoryFilter === 'all' ? true : a.category === activeCategoryFilter))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [announcements, activeCategoryFilter]);

  // 日時フォーマット処理
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}/${month}/${day} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-16 sm:py-24 font-serif relative overflow-hidden text-wafuu-sumi select-none">
      {/* 背景の市松模様あしらい */}
      <div className="absolute top-0 right-0 w-48 h-48 pattern-ichimatsu pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-48 h-48 pattern-ichimatsu pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12 relative z-10 animate-fade-in">

        {/* ヘッダー */}
        <div className="text-center space-y-4 border-b border-wafuu-sumi/15 pb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-wafuu-sumi tracking-wider font-serif">
            実行委員会からのお知らせ
          </h1>
          <p className="text-sm sm:text-base text-wafuu-sumi/75 max-w-2xl mx-auto leading-relaxed font-sans">
            なずな祭実行委員会が配信する公式速報・ご案内一覧です。新しい項目が上部に表示されます。各項目をクリックすると、本文詳細のモーダルをご確認いただけます。
          </p>

          {/* カテゴリフィルタータブ */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4 font-sans">
            {[
              { id: 'all' as const, label: 'すべて表示' },
              { id: 'urgent' as const, label: '緊急・重要' },
              { id: 'stage' as const, label: 'ステージ予定' },
              { id: 'general' as const, label: '一般お知らせ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 border ${
                  activeCategoryFilter === tab.id
                    ? 'bg-[#2C3E55] text-white border-[#2C3E55] shadow-md scale-[1.03]'
                    : 'bg-white/80 hover:bg-white text-wafuu-sumi/80 border-wafuu-ekasumi/80 hover:border-wafuu-sumi/30 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* お知らせ一覧テーブル（表形式） */}
        <div className="bg-white/90 p-6 sm:p-10 rounded-3xl border border-wafuu-ekasumi/60 shadow-sm font-sans">
          {publishedAnnouncements.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4 space-y-4 font-serif">
              <div className="w-16 h-16 rounded-full bg-wafuu-sumi/5 border border-wafuu-sumi/10 flex items-center justify-center text-wafuu-kincha">
                <Bell className="w-7 h-7" />
              </div>
              <p className="text-base text-wafuu-sumi/80 tracking-wider font-bold">
                該当するお知らせは現在ございません。
              </p>
              <p className="text-xs sm:text-sm text-wafuu-sumi/50 font-sans">
                新しい速報・通知が配信され次第、こちらにリアルタイム掲載されます。
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-wafuu-sumi/15 text-wafuu-sumi/70 text-xs sm:text-sm font-serif tracking-wider">
                    <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap w-44">配信日時</th>
                    <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap w-36">区分</th>
                    <th className="py-4 px-4 sm:px-6 font-bold">タイトル / プレビュー</th>
                    <th className="py-4 px-4 sm:px-6 font-bold text-right whitespace-nowrap w-24">詳細</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wafuu-ekasumi/60">
                  {publishedAnnouncements.map((ann) => {
                    const badge = getCategoryBadge(ann.category);
                    const previewText = ann.content.length > 25
                      ? `${ann.content.slice(0, 25)}...`
                      : ann.content;

                    return (
                      <tr
                        key={ann.id}
                        onClick={() => setSelectedAnnouncement(ann)}
                        className="hover:bg-wafuu-sumi/[0.03] transition-all duration-200 cursor-pointer group"
                      >
                        {/* 配信日時 */}
                        <td className="py-5 px-4 sm:px-6 text-xs sm:text-sm font-mono text-wafuu-sumi/85 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-wafuu-kincha shrink-0" />
                            <span>{formatDate(ann.created_at)}</span>
                          </div>
                        </td>

                        {/* カテゴリ（管理画面と完全一致） */}
                        <td className="py-5 px-4 sm:px-6 align-middle whitespace-nowrap">
                          <span className={badge.className}>
                            {badge.label}
                          </span>
                        </td>

                        {/* タイトル & プレビュー */}
                        <td className="py-5 px-4 sm:px-6 align-middle">
                          <div className="flex flex-col gap-1">
                            <span className="font-serif font-bold text-sm sm:text-base text-wafuu-sumi group-hover:text-wafuu-shu transition-colors line-clamp-1">
                              {ann.title}
                            </span>
                            <span className="text-xs text-wafuu-sumi/60 line-clamp-1 font-normal">
                              {previewText}
                            </span>
                          </div>
                        </td>

                        {/* 詳細開閉インジケーター */}
                        <td className="py-5 px-4 sm:px-6 text-right align-middle">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-wafuu-sumi/5 border border-wafuu-sumi/10 group-hover:bg-wafuu-shu group-hover:border-wafuu-shu transition-all">
                            <ChevronRight className="w-4 h-4 text-wafuu-sumi group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* 共通詳細内容モーダル（標準クラス z-[100] と useScrollLock によりスクロール抑止・前面表示） */}
      <AnnouncementDetailModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </div>
  );
};
