import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Bell, ChevronRight, X, Calendar } from 'lucide-react';
import type { Announcement } from '../../types/database';
import { useScrollLock } from '../../hooks/useScrollLock';

/*
  ========================================================================
  UrgentAnnouncementModal - 緊急速報 全画面強制表示ポップアップ
  ========================================================================
  絵文字不使用・完全SVG対応。
  緊急・重要（category === 'urgent' かつ is_published === true）のお知らせが
  存在する場合、サイトアクセス時（または新規追加時）に全画面で強制表示。
*/

interface UrgentAnnouncementModalProps {
  announcements: Announcement[];
  isIntroFinished: boolean;
  onNavigateToNews?: () => void;
}

export const UrgentAnnouncementModal: React.FC<UrgentAnnouncementModalProps> = ({
  announcements,
  isIntroFinished,
  onNavigateToNews,
}) => {
  const [activeUrgentItems, setActiveUrgentItems] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const prevUrgentIdsRef = useRef<string>('');

  useScrollLock(activeUrgentItems.length > 0);

  // 公開中かつ緊急のものを抽出（最新順）し、セッション内でまだ確認（既読）していない項目を判定
  useEffect(() => {
    if (!isIntroFinished) return;

    const urgentList = announcements
      .filter((a) => a.is_published && a.category === 'urgent')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const currentIdsKey = urgentList.map((a) => a.id).join(',');
    if (currentIdsKey === prevUrgentIdsRef.current && activeUrgentItems.length === 0) {
      return;
    }
    prevUrgentIdsRef.current = currentIdsKey;

    if (urgentList.length === 0) {
      setActiveUrgentItems([]);
      return;
    }

    try {
      const dismissedRaw = sessionStorage.getItem('nazuna_dismissed_urgent_ids');
      const dismissedIds: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];

      // 1つでも未読の緊急配信があれば表示
      const unacknowledged = urgentList.filter((item) => !dismissedIds.includes(item.id));
      if (unacknowledged.length > 0) {
        setActiveUrgentItems(unacknowledged);
        setCurrentIndex(0);
      } else {
        setActiveUrgentItems([]);
      }
    } catch {
      setActiveUrgentItems(urgentList);
    }
  }, [announcements, isIntroFinished]);

  const handleDismissAll = () => {
    try {
      const dismissedRaw = sessionStorage.getItem('nazuna_dismissed_urgent_ids');
      const dismissedIds: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];
      const updated = Array.from(new Set([...dismissedIds, ...activeUrgentItems.map((a) => a.id)]));
      sessionStorage.setItem('nazuna_dismissed_urgent_ids', JSON.stringify(updated));
    } catch { }
    setActiveUrgentItems([]);
  };

  const handleNext = () => {
    if (currentIndex < activeUrgentItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleDismissAll();
    }
  };

  useEffect(() => {
    if (activeUrgentItems.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismissAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeUrgentItems]);

  if (activeUrgentItems.length === 0) return null;

  const currentItem = activeUrgentItems[currentIndex] || activeUrgentItems[0];
  if (!currentItem) return null;

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div
      onClick={handleDismissAll}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in font-serif"
    >
      {/* 和風モーダル本体（生成り色の和紙調テクスチャ ＋ 朱＆金の和風装飾） */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] border-2 border-[#D4AF37]/60 overflow-hidden text-[#2C3E55] animate-scale-up"
        style={{
          background: 'linear-gradient(135deg, #FAF8F5 0%, #F5F0E6 100%)',
        }}
      >
        {/* 背景 麻の葉模様透かしパターン */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.22]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0L60 15L30 30L0 15Z' fill='none' stroke='%23C4A574' stroke-width='0.5'/%3E%3Cpath d='M30 30L60 45L30 60L0 45Z' fill='none' stroke='%23C4A574' stroke-width='0.5'/%3E%3Cpath d='M0 15L30 30L0 45' fill='none' stroke='%23C4A574' stroke-width='0.5'/%3E%3Cpath d='M60 15L30 30L60 45' fill='none' stroke='%23C4A574' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* 上部の朱色→金茶→朱色のアクセント装飾ライン */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-wafuu-shu via-[#D4AF37] to-wafuu-shu" />
        {/* 上部の淡い金色グロー */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#D4AF37]/10 to-transparent pointer-events-none" />

        {/* ヘッダー帯 */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#2C3E55]/15 pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-wafuu-shu text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(209,75,65,0.35)]">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-wafuu-kincha tracking-[0.2em] block mb-0.5">
                実行委員会からの重要通知
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-[#2C3E55] tracking-wider">
                【 緊急・重要速報 】
              </h2>
            </div>
          </div>

          {activeUrgentItems.length > 1 && (
            <span className="px-3 py-1 rounded-lg bg-[#F5F0E6] border border-[#2C3E55]/20 text-[#2C3E55] text-xs font-mono font-bold shadow-2xs">
              {currentIndex + 1} / {activeUrgentItems.length}件
            </span>
          )}
        </div>

        {/* お知らせ詳細領域 */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#2C3E55]/70">
            <Calendar className="w-3.5 h-3.5 text-wafuu-shu" />
            <span>配信日時: {formatDate(currentItem.created_at)}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-wafuu-shu leading-snug border-l-[5px] border-wafuu-shu pl-4 py-1">
            {currentItem.title}
          </h3>

          <div className="bg-white/95 border border-[#2C3E55]/15 rounded-2xl p-5 sm:p-6 text-sm sm:text-base text-[#2C3E55] font-sans leading-relaxed whitespace-pre-wrap max-h-[45vh] overflow-y-auto custom-scrollbar shadow-inner">
            {currentItem.content}
          </div>
        </div>

        {/* 下部アクションボタン群 */}
        <div className="relative z-10 pt-6 mt-6 border-t border-[#2C3E55]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-serif">
          {onNavigateToNews ? (
            <button
              onClick={() => {
                handleDismissAll();
                onNavigateToNews();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F5F0E6] hover:bg-[#EDE6D6] text-[#2C3E55] hover:text-wafuu-shu text-xs sm:text-sm tracking-wider transition-all border border-[#2C3E55]/20 flex items-center justify-center gap-2 shadow-sm"
            >
              <Bell className="w-4 h-4 text-wafuu-kincha" />
              <span>お知らせ一覧を詳しく見る</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-wafuu-shu to-[#B83A30] hover:from-[#B83A30] hover:to-wafuu-shu text-white font-bold text-sm sm:text-base tracking-widest transition-all shadow-[0_4px_15px_rgba(209,75,65,0.35)] hover:shadow-[0_6px_20px_rgba(209,75,65,0.45)] flex items-center justify-center gap-2 hover:translate-y-[-1px]"
          >
            <span>{currentIndex < activeUrgentItems.length - 1 ? '次のお知らせを見る' : '確認しました（閉じる）'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 右上バツボタン */}
        <button
          onClick={handleDismissAll}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/80 hover:bg-wafuu-shu text-[#2C3E55] hover:text-white transition-all border border-[#2C3E55]/15 shadow-sm"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
