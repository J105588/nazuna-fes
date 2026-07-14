import React, { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import type { Announcement, AnnouncementCategory } from '../../types/database';
import { useScrollLock } from '../../hooks/useScrollLock';

/*
  ========================================================================
  AnnouncementDetailModal - お知らせ詳細モーダル（共通コンポーネント）
  ========================================================================
  絵文字不使用・完全SVG対応。
  Home（トップページ）や一覧ページ（/#news）から共通で呼び出せる詳細表示モーダル。
  useScrollLockにより展開時は背景のスクロールを完全に防止。
*/

interface AnnouncementDetailModalProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export const AnnouncementDetailModal: React.FC<AnnouncementDetailModalProps> = ({
  announcement,
  onClose,
}) => {
  useScrollLock(Boolean(announcement));

  useEffect(() => {
    if (!announcement) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [announcement, onClose]);

  if (!announcement) return null;

  const getCategoryBadge = (category?: AnnouncementCategory | string) => {
    switch (category) {
      case 'urgent':
        return {
          label: '緊急・重要',
          className: 'bg-rose-500/15 border border-rose-500/40 text-rose-700 font-bold px-3 py-1 rounded-md text-xs tracking-wider shadow-xs font-serif'
        };
      case 'stage':
        return {
          label: 'ステージ予定',
          className: 'bg-amber-500/15 border border-amber-500/40 text-amber-800 font-bold px-3 py-1 rounded-md text-xs tracking-wider shadow-xs font-serif'
        };
      case 'general':
      default:
        return {
          label: '一般お知らせ',
          className: 'bg-blue-500/15 border border-blue-500/40 text-blue-700 font-bold px-3 py-1 rounded-md text-xs tracking-wider shadow-xs font-serif'
        };
    }
  };

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

  const badge = getCategoryBadge(announcement.category);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-wafuu-sumi/50 backdrop-blur-sm animate-fade-in select-none font-serif"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="wafuu-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto relative rounded-2xl border border-wafuu-sumi/15 bg-white p-6 sm:p-8 space-y-6 shadow-[0_20px_60px_rgba(30,30,30,0.2)] animate-modal-scale text-wafuu-sumi font-sans"
      >
        {/* モーダルヘッダー */}
        <div className="flex items-start justify-between gap-4 border-b border-wafuu-sumi/15 pb-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <span className={badge.className}>
                {badge.label}
              </span>
              <span className="text-xs font-mono text-wafuu-text-sub flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-wafuu-kincha shrink-0" />
                <span>{formatDate(announcement.created_at)}</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-wafuu-sumi leading-snug">
              {announcement.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-wafuu-sumi/5 hover:bg-wafuu-shu text-wafuu-sumi hover:text-white transition-all shrink-0"
            title="詳細を閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 本文内容 */}
        <div className="py-2 text-sm sm:text-base text-wafuu-sumi/85 leading-relaxed whitespace-pre-wrap max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar font-sans">
          {announcement.content}
        </div>

        {/* モーダルフッター */}
        <div className="pt-4 border-t border-wafuu-sumi/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-wafuu-sumi hover:bg-wafuu-shu text-white text-xs sm:text-sm font-bold font-serif tracking-widest transition-colors shadow-md"
          >
            確認して閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
