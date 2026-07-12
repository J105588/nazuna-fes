import React from 'react';
import { Sparkles, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-32 relative bg-gradient-to-b from-[#060814] via-[#04060c] to-[#020307] pt-20 pb-16 text-[#94A1B2] text-xs font-sans overflow-hidden">
      {/* 上部金彩グラデーション境界線 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F5D061] to-transparent shadow-[0_0_25px_#F5D061]" />
      <div className="absolute top-0 left-1/3 w-96 h-32 bg-[#E51937]/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 right-1/3 w-96 h-32 bg-[#F5D061]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-[rgba(245,208,97,0.2)]">
          {/* コラム 1 */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E51937] via-[#A30E24] to-[#800010] flex items-center justify-center border border-[#F5D061]/60 shadow-[0_4px_20px_rgba(229,25,55,0.6)]">
                <Sparkles className="w-6 h-6 text-[#F5D061]" />
              </div>
              <div>
                <span className="font-serif font-black text-2xl text-white tracking-widest block">
                  百輝夜行
                </span>
                <span className="text-[10px] text-[#F5D061] tracking-widest font-mono">
                  2026 NAZUNA FESTIVAL PORTAL
                </span>
              </div>
            </div>
            <p className="text-[#94A1B2]/90 leading-relaxed max-w-md text-xs sm:text-sm font-sans">
              2026年度 なずな祭（市川中学校・市川高等学校 文化祭）公式Webポータル。赤い和傘と金茶の光が紡ぐ、熱気あふれる夜のパレードをお楽しみください。
            </p>
            <div className="flex items-center gap-2.5 text-[#E2E8F0] pt-1 text-xs font-medium">
              <div className="p-1.5 rounded-lg bg-[#E51937]/20 border border-[#E51937]/40">
                <MapPin className="w-4 h-4 text-[#E51937]" />
              </div>
              <span>千葉県市川市本北方2-38-1 市川学園キャンパス</span>
            </div>
          </div>

          {/* コラム 2 */}
          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wider text-sm flex items-center gap-2.5 font-serif border-l-2 border-[#00D2FF] pl-3 py-0.5">
              <ShieldCheck className="w-4.5 h-4.5 text-[#00D2FF]" />
              <span>システムインフラ</span>
            </h4>
            <ul className="space-y-2.5 text-[#94A1B2]/90 text-xs">
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
                <span>SPA: React 18 + TypeScript + Vite</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F5D061] shadow-[0_0_8px_#F5D061]" />
                <span>Realtime Store & Zero-Latency UI</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#E51937] shadow-[0_0_8px_#E51937]" />
                <span>GAS Pyramid & Forms Integration</span>
              </li>
            </ul>
          </div>

          {/* コラム 3 */}
          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wider text-sm flex items-center gap-2.5 font-serif border-l-2 border-[#F5D061] pl-3 py-0.5">
              <ExternalLink className="w-4.5 h-4.5 text-[#F5D061]" />
              <span>外部連携ポータル</span>
            </h4>
            <ul className="space-y-2.5 text-[#94A1B2]/90 text-xs">
              <li>
                <a
                  href="https://www.ichigaku.ac.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">市川学園 公式ホームページ</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-[#F5D061] transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://map.nazuna.jp/campus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">校内デジタル専用マップ</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-[#F5D061] transition-colors" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between text-[#94A1B2]/70 gap-4 text-xs font-sans">
          <p className="font-mono tracking-wider">© 2026 NAZUNA FESTIVAL EXECUTIVE COMMITTEE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-1.5 text-white/90 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <span>Built for</span>
            <span className="text-[#E51937] font-bold tracking-wide">PROJECT HYAKKI-YAKO</span>
            <Heart className="w-3.5 h-3.5 text-[#E51937] inline fill-current ml-0.5 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};
