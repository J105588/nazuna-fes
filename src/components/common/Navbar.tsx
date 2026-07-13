import React, { useState } from 'react';
import { BurgerMenu } from './BurgerMenu';

/*
  ========================================================================
  Navbar - モダン和風フローティングナビゲーション
  ========================================================================
*/

interface NavbarProps {
  currentTab: 'home' | 'timetable' | 'info' | 'lostfound' | 'admin';
  isIntroFinished?: boolean;
  onSelectTab: (tab: 'home' | 'timetable' | 'info' | 'lostfound' | 'admin') => void;
  onSelectGenreQuick?: (genre: string) => void;
  onSelectStageQuick?: (stage: string) => void;
  onReplayIntro?: () => void;
  onOpenMapModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  isIntroFinished = true,
  onSelectTab,
  onSelectGenreQuick,
  onSelectStageQuick,
  onReplayIntro,
  onOpenMapModal
}) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  return (
    <>
      {/* フローティングメニューボタン */}
      <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none p-5 sm:p-7 flex items-center justify-end max-w-[100vw] overflow-x-hidden">
        
        {/* メニューボタン（和風） */}
        <div className={`transition-all duration-1000 ease-out transform ${
          isIntroFinished ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-12 scale-90 pointer-events-none'
        }`}>
          <button
            onClick={() => setIsBurgerOpen(!isBurgerOpen)}
            className={`group w-13 h-13 sm:w-15 sm:h-15 rounded-2xl sm:rounded-3xl backdrop-blur-xl border transition-all duration-500 flex items-center justify-center select-none shrink-0 ${
              isBurgerOpen
                ? 'bg-wafuu-shu/90 border-wafuu-kincha shadow-[0_0_25px_rgba(209,75,65,0.4)]'
                : 'bg-white/85 hover:bg-white/95 border-wafuu-ekasumi/60 hover:border-wafuu-shu/60 shadow-[0_4px_20px_rgba(30,30,30,0.12)] hover:shadow-[0_8px_30px_rgba(30,30,30,0.18)]'
            }`}
            title={isBurgerOpen ? "メニューを閉じる" : "総合メニューを開く"}
            aria-label={isBurgerOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {/* 筆ストローク風ハンバーガー ↔ 閉じるバツ */}
            <div className="relative w-6 sm:w-7 h-5 flex items-center justify-center">
              <span
                className={`absolute w-full h-[2.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                  isBurgerOpen
                    ? 'translate-y-0 rotate-45 bg-white'
                    : '-translate-y-2.5 rotate-0 bg-wafuu-sumi'
                }`}
              />
              <span
                className={`absolute w-full h-[2.5px] rounded-full transition-all duration-300 ease-out ${
                  isBurgerOpen
                    ? 'opacity-0 scale-x-0 bg-white'
                    : 'opacity-100 scale-x-100 bg-wafuu-shu'
                }`}
              />
              <span
                className={`absolute w-full h-[2.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                  isBurgerOpen
                    ? 'translate-y-0 -rotate-45 bg-white'
                    : 'translate-y-2.5 rotate-0 bg-wafuu-sumi'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* 総合案内メニュー */}
      <BurgerMenu
        isOpen={isBurgerOpen}
        onClose={() => setIsBurgerOpen(false)}
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        onSelectGenreQuick={onSelectGenreQuick}
        onSelectStageQuick={onSelectStageQuick}
        onReplayIntro={onReplayIntro}
        onOpenMapModal={onOpenMapModal}
      />
    </>
  );
};
