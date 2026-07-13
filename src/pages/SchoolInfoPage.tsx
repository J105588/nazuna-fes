import React from 'react';
import { Award, ShieldCheck, Compass, BookOpen } from 'lucide-react';

export const SchoolInfoPage: React.FC = () => {
  return (
    <div className="space-y-20 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ヒーローセクション（藍鉄紺＋和紙テクスチャ） */}
      <div className="relative overflow-hidden rounded-3xl border border-wafuu-ekasumi/60 bg-gradient-to-br from-wafuu-deep via-[#1A253C] to-[#0F1626] p-8 sm:p-16 shadow-lg">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-wafuu-shu/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-wafuu-kincha/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-wafuu-ekasumi/60 text-xs text-wafuu-kincha tracking-wider font-bold shadow-sm backdrop-blur-md">
            <svg className="w-4 h-4 text-wafuu-kincha" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.5 2 2 6.5 2 12h20c0-5.5-4.5-10-10-10z" />
              <path d="M12 2v20" />
            </svg>
            <span>完全HTML/CSS静的ビルド最適化 (0ms高速レスポンス)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide leading-tight font-serif drop-shadow-sm">
            市川中学校・市川高等学校<br />
            <span className="text-gradient-shu-kincha">2026年度 なずな祭 「百輝夜行」</span>
          </h1>

          <p className="text-sm sm:text-base text-wafuu-kinari/90 leading-relaxed font-serif bg-black/40 p-6 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
            伝統と先進テクノロジーが結実する市川学園最大の祭典。今年度のテーマは「百輝夜行」。
            生徒一人ひとりの個性が夜行を彩る光となり、極夜を照らす熱意あるパレードを創り出します。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-wafuu-ekasumi/30">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
              <span className="text-[10px] text-wafuu-ekasumi uppercase tracking-widest block font-mono font-bold">PHILOSOPHY</span>
              <span className="text-sm sm:text-base font-bold text-white font-serif tracking-wide block mt-1">独自進取・第三教育</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
              <span className="text-[10px] text-wafuu-ekasumi uppercase tracking-widest block font-mono font-bold">SCHEDULE</span>
              <span className="text-sm sm:text-base font-bold text-wafuu-kincha font-serif tracking-wide block mt-1">2026年9月 秋季開催</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
              <span className="text-[10px] text-wafuu-ekasumi uppercase tracking-widest block font-mono font-bold">VISITORS</span>
              <span className="text-sm sm:text-base font-bold text-white font-serif tracking-wide block mt-1">約 12,000名以上</span>
            </div>
          </div>
        </div>
      </div>

      {/* コンセプト */}
      <div className="space-y-10">
        <div className="section-heading-line">
          <h2 className="text-2xl sm:text-3xl font-bold text-wafuu-sumi tracking-wider font-serif">
            百輝夜行の3大コンセプト
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="wafuu-panel wafuu-panel-hover p-8 sm:p-9 space-y-5 rounded-3xl border border-wafuu-sumi/10 relative overflow-hidden group bg-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-wafuu-shu/10 rounded-full blur-2xl pointer-events-none group-hover:bg-wafuu-shu/20 transition-colors" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark border border-wafuu-ekasumi/60 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-wafuu-sumi group-hover:text-wafuu-shu transition-colors tracking-wide">
              01. 和傘が導く熱意
            </h3>
            <p className="text-xs sm:text-sm text-wafuu-text-sub leading-relaxed font-sans">
              ポスターの象徴「赤い和傘」。個々の情熱を雨や逆境から守り、共に夜のパレードを駆け抜ける団結を意味します。
            </p>
          </div>

          <div className="wafuu-panel wafuu-panel-hover p-8 sm:p-9 space-y-5 rounded-3xl border border-wafuu-sumi/10 relative overflow-hidden group bg-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-wafuu-ai/10 rounded-full blur-2xl pointer-events-none group-hover:bg-wafuu-ai/20 transition-colors" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wafuu-ai to-[#1E3050] border border-wafuu-ai/60 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-wafuu-sumi group-hover:text-wafuu-ai transition-colors tracking-wide">
              02. 迷路の探究心
            </h3>
            <p className="text-xs sm:text-sm text-wafuu-text-sub leading-relaxed font-sans">
              広大なキャンパス全体をあやかしの街角に見立て、来場者が新たな感動と驚きに出会えるデジタルマップ連動を展開します。
            </p>
          </div>

          <div className="wafuu-panel wafuu-panel-hover p-8 sm:p-9 space-y-5 rounded-3xl border border-wafuu-sumi/10 relative overflow-hidden group bg-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-wafuu-kincha/10 rounded-full blur-2xl pointer-events-none group-hover:bg-wafuu-kincha/20 transition-colors" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wafuu-kincha to-[#B08A2E] border border-wafuu-kincha/60 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-wafuu-sumi group-hover:text-wafuu-kincha transition-colors tracking-wide">
              03. 伝統と先進の結実
            </h3>
            <p className="text-xs sm:text-sm text-wafuu-text-sub leading-relaxed font-sans">
              毛筆の一筆書きと最新の React SPA + リアルタイムインフラ。第三教育の先進性がここに結実しています。
            </p>
          </div>
        </div>
      </div>

      {/* ビジュアル解説 (金屏風アートフレーム仕様) */}
      <div className="wafuu-panel p-8 sm:p-14 rounded-3xl border-2 border-wafuu-ekasumi/60 grid grid-cols-1 md:grid-cols-12 gap-10 items-center shadow-lg relative overflow-hidden bg-white">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-tl from-wafuu-shu/10 via-wafuu-kincha/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="md:col-span-5 flex justify-center relative z-10">
          <div className="p-3.5 rounded-3xl bg-gradient-to-b from-wafuu-kincha via-[#A67C28] to-wafuu-shu shadow-md">
            <div className="p-2 rounded-2xl bg-wafuu-deep overflow-hidden">
              <img
                src="/assets/poster/poster_complete.png"
                alt="百輝夜行 ポスター完成版"
                className="w-full max-w-[320px] h-auto object-contain rounded-xl transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-wafuu-shu/10 border border-wafuu-shu/30 text-xs text-wafuu-shu font-bold tracking-wider shadow-sm font-serif">
            <ShieldCheck className="w-4 h-4 text-wafuu-shu" />
            <span>ポスター5層レイヤー構造解説</span>
          </div>

          <h3 className="font-serif font-bold text-2xl sm:text-4xl text-wafuu-sumi tracking-wide">
            一筆書きから結ばれる、<br />
            <span className="text-gradient-shu-kincha">シネマティックな臨場感。</span>
          </h3>

          <p className="text-xs sm:text-sm text-wafuu-text-sub leading-relaxed font-serif">
            今年度のポスター（フォルダ「パンフレット用1」全素材）は、5層の精密な Z-Index 分離構造（夜空、掛け軸線画、和傘パレード、浮雲、タイトルロゴ）に分解・再統合されています。
          </p>

          <p className="text-xs sm:text-sm text-wafuu-text-sumi leading-relaxed font-serif bg-wafuu-kinari p-5 rounded-2xl border border-wafuu-sumi/10 shadow-inner">
            初回オープニングでは、和紙の障子が開いたのち、毛筆の力強い輪郭線が一筆書きで描かれ、輪郭が閉じた瞬間に漆黒と緋赤・金茶が着色されるシネマティックアニメーションをお届けします。
          </p>
        </div>
      </div>
    </div>
  );
};
