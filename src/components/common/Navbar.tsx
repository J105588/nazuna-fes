import React, { useState } from 'react';
import { BurgerMenu } from './BurgerMenu';

/*
  ========================================================================
  Navbar (Floating Menu Controls)
  ========================================================================
  
  【上部ヘッダーの完全撤廃】
  横長のバー (header) を排除し、ポスター演出を 100% 遮らない
  「左上ロゴバッジ」と「右上メニューボタン」のみをフローティング配置。
  すべての画面遷移・ボタンは右上のハンバーガーメニュー内に集約。
*/

interface NavbarProps {
  currentTab: 'home' | 'timetable' | 'info';
  onSelectTab: (tab: 'home' | 'timetable' | 'info') => void;
  onSelectGenreQuick?: (genre: string) => void;
  onSelectStageQuick?: (stage: string) => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onSelectGenreQuick,
  onSelectStageQuick,
  onReplayIntro
}) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  return (
    <>
      {/* フローティングコントロールコンテナ (クリック判定のみ有効化) */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-4 sm:p-6 flex items-center justify-between">
        
        {/* 左上: ミニマル・ラグジュアリーロゴバッジ */}
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="pointer-events-auto group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#060919]/80 hover:bg-[#0d132a]/95 backdrop-blur-xl border border-[#F5D061]/40 hover:border-[#F5D061]/80 shadow-[0_8px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-105 select-none"
          title="トップページ・演出へ戻る"
        >
          {/* 金赤和傘エンブレムSVG */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E51937] to-[#800010] flex items-center justify-center border border-[#F5D061]/60 shadow-[0_0_12px_rgba(229,25,55,0.6)]">
            <svg className="w-4 h-4 text-[#F5D061]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="text-left">
            <span className="font-serif font-bold text-sm sm:text-base tracking-wider text-white group-hover:text-[#F5D061] transition-colors block leading-tight">
              百輝夜行
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#00D2FF] block leading-none mt-0.5">
              2026 NAZUNA FES
            </span>
          </div>
        </button>

        {/* 右上: 総合ハンバーガーメニューボタン */}
        <button
          onClick={() => setIsBurgerOpen(true)}
          className="pointer-events-auto group px-5 py-3 rounded-2xl bg-gradient-to-r from-[#131a3b]/90 to-[#1e2756]/90 hover:from-[#1c2654] hover:to-[#283570] backdrop-blur-xl text-[#F5D061] border border-[#F5D061]/60 hover:border-white shadow-[0_8px_32px_rgba(0,0,0,0.85),0_0_20px_rgba(245,208,97,0.25)] flex items-center gap-3 font-bold text-xs sm:text-sm transition-all duration-300 hover:scale-105 select-none"
          title="すべての画面遷移・総合メニューを開く"
        >
          {/* 和の格子調バーガーメニューアイコン */}
          <svg className="w-5 h-5 text-[#F5D061] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="7" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="tracking-widest font-serif">メニュー</span>
        </button>
      </div>

      {/* 総合案内ドロワーメニュー */}
      <BurgerMenu
        isOpen={isBurgerOpen}
        onClose={() => setIsBurgerOpen(false)}
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        onSelectGenreQuick={onSelectGenreQuick}
        onSelectStageQuick={onSelectStageQuick}
        onReplayIntro={onReplayIntro}
      />
    </>
  );
};
