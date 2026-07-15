import React from 'react';
import { Compass, ShieldAlert } from 'lucide-react';

/*
  ========================================================================
  NotFoundView - 「404」文字主体の質素で上品な和風 404 / 準備中画面
  ========================================================================
  絵文字不使用・完全SVG対応。装飾過多を省き、「404」の筆文字風タイポグラフィと
  朱色の落款（スタンプ）、質素な和紙調背景により落ち着いた和風世界観を表現。
*/

interface NotFoundViewProps {
  onNavigateHome: () => void;
  onNavigateAdmin?: () => void;
  isAdminLoggedIn?: boolean;
  isHiddenPage?: boolean;
  customMessage?: string;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onNavigateHome,
  onNavigateAdmin,
  isAdminLoggedIn = false,
  isHiddenPage = false,
  customMessage,
}) => {
  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-center px-6 py-20 bg-[#FAF8F5] text-wafuu-sumi font-serif select-none relative overflow-hidden">
      
      {/* 質素な背景アクセント（極薄の和紙市松模様） */}
      <div className="absolute inset-0 pattern-ichimatsu opacity-[0.15] pointer-events-none" />

      {/* メインコンテンツ（404または準備中文字主体・質素な和風構成） */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto space-y-8 animate-fade-in">
        
        {/* 主体となるタイポグラフィ ＋ 朱色の落款（ハンコ）風あしらい */}
        <div className="relative flex items-center justify-center my-4">
          <span className={`font-black tracking-widest text-[#2C3E55] leading-none select-all font-serif ${
            isHiddenPage ? 'text-5xl sm:text-7xl py-2' : 'text-7xl sm:text-9xl'
          }`}>
            {isHiddenPage ? '準備中' : '404'}
          </span>
          {/* 朱色の落款風スタンプあしらい */}
          <div className="absolute -top-3 -right-6 sm:-top-4 sm:-right-8 w-10 h-10 sm:w-12 sm:h-12 border-2 border-wafuu-shu bg-wafuu-shu/10 rounded-sm flex items-center justify-center rotate-12 select-none pointer-events-none shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold text-wafuu-shu leading-tight tracking-tighter text-center font-serif">
              {isHiddenPage ? '非公開' : '迷い道'}
            </span>
          </div>
        </div>

        {/* 和風の細いひし形区切り線 */}
        <div className="flex items-center justify-center gap-3 w-40 opacity-70">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-wafuu-kincha" />
          <div className="w-1.5 h-1.5 rotate-45 bg-wafuu-shu" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-wafuu-kincha" />
        </div>

        {/* 質素で丁寧な日本語説明 */}
        <div className="space-y-3 font-sans">
          <h2 className="text-lg sm:text-xl font-serif font-bold tracking-wider text-[#2C3E55]">
            {isHiddenPage ? 'ただいま準備中です' : 'ページが見つかりません'}
          </h2>
          {customMessage ? (
            <div className="p-4 rounded-2xl bg-white/80 border border-wafuu-shu/30 shadow-xs max-w-md mx-auto my-3">
              <p className="text-sm font-bold text-wafuu-shu font-serif leading-relaxed">
                {customMessage}
              </p>
            </div>
          ) : null}
          <p className="text-xs sm:text-sm text-wafuu-sumi/75 leading-relaxed max-w-md mx-auto">
            {isHiddenPage ? (
              <>
                アクセスされたページは現在、公開が停止されているか、準備中です。<br className="hidden sm:inline" />
                公開までお待ちいただくか、総合トップページより他の企画をお楽しみください。
              </>
            ) : (
              <>
                お探しのページは移動または削除されたか、アドレスが誤っている可能性があります。<br className="hidden sm:inline" />
                恐れ入りますが、下記のボタンよりトップページへお戻しください。
              </>
            )}
          </p>
        </div>

        {/* 質素で品のあるアクションボタン */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 w-full font-serif">
          <button
            onClick={onNavigateHome}
            className="px-8 py-3.5 rounded-xl bg-[#2C3E55] text-white text-sm tracking-widest hover:bg-wafuu-shu transition-colors shadow-sm flex items-center justify-center gap-2 group border border-white/10"
          >
            <Compass className="w-4 h-4 text-wafuu-kincha group-hover:text-white transition-colors" />
            <span>総合トップページへ戻る</span>
          </button>

          {onNavigateAdmin && isAdminLoggedIn && (
            <button
              onClick={onNavigateAdmin}
              className="px-6 py-3.5 rounded-xl bg-transparent hover:bg-[#2C3E55]/5 text-[#2C3E55] text-xs tracking-wider transition-colors border border-[#2C3E55]/20 flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-wafuu-shu" />
              <span>管理者ポータル</span>
            </button>
          )}
        </div>

        {/* 下部テキスト */}
        <div className="pt-6 text-[11px] font-mono tracking-widest text-wafuu-sumi/40">
          ― NAZUNA FESTIVAL 2026 ―
        </div>

      </div>
    </div>
  );
};
