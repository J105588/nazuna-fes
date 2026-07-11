import React from 'react';
import { Sparkles, Award, ShieldCheck, Compass, BookOpen } from 'lucide-react';

export const SchoolInfoPage: React.FC = () => {
  return (
    <div className="space-y-16 animate-fade-in">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(245,208,97,0.3)] bg-gradient-to-br from-[#070b1e] via-[#101738] to-[#050711] p-8 sm:p-16 shadow-[0_20px_70px_rgba(0,0,0,0.9)]">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#E51937]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F5D061]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131a3b] border border-[#F5D061]/40 text-xs text-[#F5D061] tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>完全HTML/CSS静的ビルド最適化 (最速描画保証)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wide leading-tight font-serif">
            市川中学校・市川高等学校<br />
            <span className="text-gradient-red-gold">2026年度 なずな祭 「百輝夜行」</span>
          </h1>

          <p className="text-sm sm:text-base text-[#94A1B2] leading-relaxed font-sans">
            伝統と先進テクノロジーが結実する市川学園最大の祭典。今年度のテーマは「百輝夜行」。
            生徒一人ひとりの個性が夜行を彩る光となり、極夜を照らす熱意あるパレードを創り出します。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
            <div className="wamodern-panel p-4 rounded-xl border border-white/10">
              <span className="text-[10px] text-[#94A1B2] uppercase tracking-wider block font-mono">PHILOSOPHY</span>
              <span className="text-sm font-bold text-white font-serif">独自進取・第三教育</span>
            </div>
            <div className="wamodern-panel p-4 rounded-xl border border-white/10">
              <span className="text-[10px] text-[#94A1B2] uppercase tracking-wider block font-mono">SCHEDULE</span>
              <span className="text-sm font-bold text-[#00D2FF]">2026年9月 秋季開催</span>
            </div>
            <div className="wamodern-panel p-4 rounded-xl border border-white/10">
              <span className="text-[10px] text-[#94A1B2] uppercase tracking-wider block font-mono">VISITORS</span>
              <span className="text-sm font-bold text-[#F5D061]">約 12,000名以上</span>
            </div>
          </div>
        </div>
      </div>

      {/* コンセプト */}
      <div className="space-y-8">
        <div className="section-heading-line">
          <h2 className="text-2xl font-bold text-white tracking-wider font-serif whitespace-nowrap">
            百輝夜行の3大コンセプト
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="wamodern-panel p-8 space-y-4 rounded-xl border border-[rgba(255,255,255,0.08)] relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-[#E51937]/20 border border-[#E51937]/50 flex items-center justify-center text-[#E51937] transition-transform group-hover:scale-110">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">
              01. 和傘が導く熱意
            </h3>
            <p className="text-xs text-[#94A1B2] leading-relaxed font-sans">
              ポスターの象徴「赤い和傘」。個々の情熱を雨や逆境から守り、共に夜のパレードを駆け抜ける団結を意味します。
            </p>
          </div>

          <div className="wamodern-panel p-8 space-y-4 rounded-xl border border-[rgba(255,255,255,0.08)] relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-[#00D2FF]/20 border border-[#00D2FF]/50 flex items-center justify-center text-[#00D2FF] transition-transform group-hover:scale-110">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">
              02. 迷路の探究心
            </h3>
            <p className="text-xs text-[#94A1B2] leading-relaxed font-sans">
              広大なキャンパス全体をあやかしの街角に見立て、来場者が新たな感動と驚きに出会えるデジタルマップ連動を展開します。
            </p>
          </div>

          <div className="wamodern-panel p-8 space-y-4 rounded-xl border border-[rgba(255,255,255,0.08)] relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-[#F5D061]/20 border border-[#F5D061]/50 flex items-center justify-center text-[#F5D061] transition-transform group-hover:scale-110">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-white">
              03. 伝統と先進の結実
            </h3>
            <p className="text-xs text-[#94A1B2] leading-relaxed font-sans">
              毛筆の一筆書きと最新の React SPA + リアルタイムストアインフラ。第三教育の先進性がここに結実しています。
            </p>
          </div>
        </div>
      </div>

      {/* ビジュアル解説 */}
      <div className="wamodern-panel p-8 sm:p-12 rounded-2xl border border-[rgba(245,208,97,0.3)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 flex justify-center">
          <div className="p-2 rounded-2xl bg-[#080b1d] border border-white/10 shadow-2xl">
            <img
              src="/assets/poster/poster_complete.png"
              alt="百輝夜行 ポスター完成版"
              className="w-full max-w-[300px] h-auto object-contain rounded-xl"
            />
          </div>
        </div>
        <div className="md:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E51937]/20 border border-[#E51937]/40 text-xs text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#F5D061]" />
            <span>ポスターレイヤー構造解説</span>
          </div>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            一筆書きから結ばれる臨場感
          </h3>
          <p className="text-xs sm:text-sm text-[#94A1B2] leading-relaxed font-sans">
            今年度のポスター（フォルダ「パンフレット用1」全素材）は、5層の精密な Z-Index 分離構造（夜空、掛け軸線画、和傘パレード、浮雲、タイトルロゴ）に分解・再統合されています。
          </p>
          <p className="text-xs sm:text-sm text-[#94A1B2] leading-relaxed font-sans">
            初回オープニングでは、毛筆の力強い輪郭線が一筆書きで描かれ、輪郭が閉じた瞬間に漆黒と緋赤・金茶・シアンが着色されるシネマティックアニメーションをお届けします。
          </p>
        </div>
      </div>
    </div>
  );
};
