import React from 'react';
import { Sparkles, Award, ShieldCheck, Compass, BookOpen } from 'lucide-react';

export const SchoolInfoPage: React.FC = () => {
  return (
    <div className="space-y-20 animate-fade-in">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(245,208,97,0.4)] bg-gradient-to-br from-[#080c1f] via-[#12193e] to-[#050711] p-8 sm:p-16 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#E51937]/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F5D061]/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(245,208,97,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#131a3b]/90 border border-[#F5D061]/50 text-xs text-[#F5D061] tracking-wider font-bold shadow-[0_0_20px_rgba(245,208,97,0.2)]">
            <Sparkles className="w-4 h-4 text-[#F5D061]" />
            <span>完全HTML/CSS静的ビルド最適化 (0ms高速レスポンス)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide leading-tight font-serif drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            市川中学校・市川高等学校<br />
            <span className="text-gradient-red-gold">2026年度 なずな祭 「百輝夜行」</span>
          </h1>

          <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed font-sans bg-[#060814]/70 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
            伝統と先進テクノロジーが結実する市川学園最大の祭典。今年度のテーマは「百輝夜行」。
            生徒一人ひとりの個性が夜行を彩る光となり、極夜を照らす熱意あるパレードを創り出します。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[rgba(245,208,97,0.25)]">
            <div className="wamodern-panel p-5 rounded-2xl border border-white/10 shadow-md">
              <span className="text-[10px] text-[#94A1B2] uppercase tracking-widest block font-mono font-bold">PHILOSOPHY</span>
              <span className="text-sm sm:text-base font-bold text-white font-serif tracking-wide block mt-1">独自進取・第三教育</span>
            </div>
            <div className="wamodern-panel p-5 rounded-2xl border border-white/10 shadow-md">
              <span className="text-[10px] text-[#94A1B2] uppercase tracking-widest block font-mono font-bold">SCHEDULE</span>
              <span className="text-sm sm:text-base font-bold text-[#00D2FF] font-serif tracking-wide block mt-1">2026年9月 秋季開催</span>
            </div>
            <div className="wamodern-panel p-5 rounded-2xl border border-white/10 shadow-md">
              <span className="text-[10px] text-[#94A1B2] uppercase tracking-widest block font-mono font-bold">VISITORS</span>
              <span className="text-sm sm:text-base font-bold text-[#F5D061] font-serif tracking-wide block mt-1">約 12,000名以上</span>
            </div>
          </div>
        </div>
      </div>

      {/* コンセプト */}
      <div className="space-y-10">
        <div className="section-heading-line">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wider font-serif whitespace-nowrap">
            百輝夜行の3大コンセプト
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="wamodern-panel wamodern-panel-hover p-8 sm:p-9 space-y-5 rounded-3xl border border-[rgba(255,255,255,0.12)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#E51937]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E51937]/20 transition-colors" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E51937] to-[#800010] border border-[#F5D061]/60 flex items-center justify-center text-white shadow-[0_6px_20px_rgba(229,25,55,0.5)] transition-transform duration-300 group-hover:scale-110">
              <Award className="w-7 h-7 text-[#F5D061]" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-white group-hover:text-[#F5D061] transition-colors tracking-wide">
              01. 和傘が導く熱意
            </h3>
            <p className="text-xs sm:text-sm text-[#94A1B2] leading-relaxed font-sans">
              ポスターの象徴「赤い和傘」。個々の情熱を雨や逆境から守り、共に夜のパレードを駆け抜ける団結を意味します。
            </p>
          </div>

          <div className="wamodern-panel wamodern-panel-hover p-8 sm:p-9 space-y-5 rounded-3xl border border-[rgba(255,255,255,0.12)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00D2FF]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00D2FF]/20 transition-colors" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00A8CC] to-[#0a1e3f] border border-[#00D2FF]/60 flex items-center justify-center text-white shadow-[0_6px_20px_rgba(0,210,255,0.4)] transition-transform duration-300 group-hover:scale-110">
              <Compass className="w-7 h-7 text-[#00D2FF]" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-white group-hover:text-[#00D2FF] transition-colors tracking-wide">
              02. 迷路の探究心
            </h3>
            <p className="text-xs sm:text-sm text-[#94A1B2] leading-relaxed font-sans">
              広大なキャンパス全体をあやかしの街角に見立て、来場者が新たな感動と驚きに出会えるデジタルマップ連動を展開します。
            </p>
          </div>

          <div className="wamodern-panel wamodern-panel-hover p-8 sm:p-9 space-y-5 rounded-3xl border border-[rgba(255,255,255,0.12)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#F5D061]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#F5D061]/20 transition-colors" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5A823] to-[#7a540a] border border-[#F5D061]/80 flex items-center justify-center text-white shadow-[0_6px_20px_rgba(245,208,97,0.4)] transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-white group-hover:text-[#F5D061] transition-colors tracking-wide">
              03. 伝統と先進の結実
            </h3>
            <p className="text-xs sm:text-sm text-[#94A1B2] leading-relaxed font-sans">
              毛筆の一筆書きと最新の React SPA + リアルタイムストアインフラ。第三教育の先進性がここに結実しています。
            </p>
          </div>
        </div>
      </div>

      {/* ビジュアル解説 (金屏風アートフレーム仕様) */}
      <div className="wamodern-panel p-8 sm:p-14 rounded-3xl border border-[rgba(245,208,97,0.45)] grid grid-cols-1 md:grid-cols-12 gap-10 items-center shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(245,208,97,0.15)] relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-tl from-[#E51937]/15 via-[#F5D061]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="md:col-span-5 flex justify-center relative z-10">
          <div className="p-3.5 rounded-3xl bg-gradient-to-b from-[#F5D061] via-[#806010] to-[#E51937] shadow-[0_15px_50px_rgba(0,0,0,0.95)]">
            <div className="p-2 rounded-2xl bg-[#060814] overflow-hidden">
              <img
                src="/assets/poster/poster_complete.png"
                alt="百輝夜行 ポスター完成版"
                className="w-full max-w-[320px] h-auto object-contain rounded-xl transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E51937]/25 border border-[#E51937]/50 text-xs text-white font-bold tracking-wider shadow-md">
            <ShieldCheck className="w-4 h-4 text-[#F5D061]" />
            <span>ポスター5層レイヤー構造解説</span>
          </div>

          <h3 className="font-serif font-bold text-2xl sm:text-4xl text-white tracking-wide">
            一筆書きから結ばれる、<br />
            <span className="text-[#F5D061]">シネマティックな臨場感。</span>
          </h3>

          <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed font-sans">
            今年度のポスター（フォルダ「パンフレット用1」全素材）は、5層の精密な Z-Index 分離構造（夜空、掛け軸線画、和傘パレード、浮雲、タイトルロゴ）に分解・再統合されています。
          </p>

          <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed font-sans bg-[#060814]/80 p-5 rounded-2xl border border-white/10 shadow-inner">
            初回オープニングでは、毛筆の力強い輪郭線が一筆書きで描かれ、輪郭が閉じた瞬間に漆黒と緋赤・金茶・シアンが着色されるシネマティックアニメーションをお届けします。
          </p>
        </div>
      </div>
    </div>
  );
};
