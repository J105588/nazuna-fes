import React, { useState } from 'react';
import { BurgerMenu } from './BurgerMenu';
import type { PageSetting } from '../../types/database';

/*
  ========================================================================
  Navbar - モダン和風固定ヘッダーバー＆メニューコントローラー
  ========================================================================
*/

interface NavbarProps {
  currentTab: 'home' | 'exhibitions' | 'timetable' | 'map' | 'news' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy';
  isIntroFinished?: boolean;
  onSelectTab: (tab: 'home' | 'exhibitions' | 'timetable' | 'map' | 'news' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy') => void;
  onSelectGenreQuick?: (genre: string) => void;
  onSelectStageQuick?: (stage: string) => void;
  onOpenMapModal?: () => void;
  pageSettings?: PageSetting[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  isIntroFinished = true,
  onSelectTab,
  onSelectGenreQuick,
  onOpenMapModal,
  pageSettings
}) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  if (!isIntroFinished) {
    return null;
  }

  return (
    <>
      {/* 上部固定モダン和風ヘッダーバー (城に近い和風な色：漆喰白・白鷺城しらさぎじょうの白壁を想起させる生成り白グラデーション＋藍と朱の上質アクセント) */}
      <header className="fixed top-0 left-0 right-0 z-[100] animate-header-slide-down backdrop-blur-xl bg-gradient-to-r from-[#FBF9F5]/95 via-[#FAF6F0]/95 to-[#FBF9F5]/95 text-[#2C3E55] shadow-[0_4px_25px_rgba(44,62,85,0.12)] border-b border-wafuu-ekasumi/80">
        {/* 上部の極細 朱＆金茶＆藍アクセントライン */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-wafuu-shu via-[#D4AF37] to-wafuu-ai opacity-90" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* 左側：サイトロゴ・名称「上に小さく2026年、その下に大きくなずな祭」 */}
          <button
            onClick={() => {
              if (isBurgerOpen) setIsBurgerOpen(false);
              onSelectTab('home');
            }}
            className="flex flex-col justify-center text-left group transition-all duration-300 hover:opacity-90 focus:outline-none py-1"
            title="総合トップポータルへ戻る"
          >
            <span className="text-[11px] sm:text-xs font-mono font-bold text-wafuu-kincha tracking-[0.2em] block leading-tight">
              2026年
            </span>
            <span className="text-xl sm:text-2xl font-black font-serif text-[#2C3E55] tracking-widest block leading-tight group-hover:text-wafuu-shu transition-colors -mt-0.5 drop-shadow-2xs">
              なずな祭
            </span>
          </button>

          {/* 右端：三本線 ↔ × に滑らかに変形するメニューボタン */}
          <button
            onClick={() => setIsBurgerOpen(!isBurgerOpen)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border transition-all duration-300 flex items-center justify-center shrink-0 shadow-sm ${
              isBurgerOpen
                ? 'bg-wafuu-shu text-white border-wafuu-shu shadow-[0_0_15px_rgba(209,75,65,0.5)]'
                : 'bg-white hover:bg-[#F3ECE0] text-[#2C3E55] border-wafuu-ekasumi/80 hover:border-wafuu-kincha'
            }`}
            title={isBurgerOpen ? "メニューを閉じる" : "総合メニューを開く"}
            aria-label={isBurgerOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {/* 三本線 ↔ × 変形アニメーションアイコン */}
            <div className="relative w-6 h-5 flex items-center justify-center shrink-0">
              {/* 上の線 ↔ ×の片側 */}
              <span
                className={`absolute w-full h-[2.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                  isBurgerOpen
                    ? 'translate-y-0 rotate-45 bg-white'
                    : '-translate-y-2 rotate-0 bg-current'
                }`}
              />
              {/* 真ん中の線 */}
              <span
                className={`absolute w-full h-[2.5px] rounded-full transition-all duration-300 ease-out ${
                  isBurgerOpen
                    ? 'opacity-0 scale-x-0 bg-white'
                    : 'opacity-100 scale-x-100 bg-current'
                }`}
              />
              {/* 下の線 ↔ ×のもう片側 */}
              <span
                className={`absolute w-full h-[2.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                  isBurgerOpen
                    ? 'translate-y-0 -rotate-45 bg-white'
                    : 'translate-y-2 rotate-0 bg-current'
                }`}
              />
            </div>
          </button>

        </div>
      </header>

      {/* 総合案内メニュー（質素で洗練されたページ遷移リスト） */}
      <BurgerMenu
        isOpen={isBurgerOpen}
        onClose={() => setIsBurgerOpen(false)}
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        onSelectGenreQuick={onSelectGenreQuick}
        onOpenMapModal={onOpenMapModal}
        pageSettings={pageSettings}
      />
    </>
  );
};
