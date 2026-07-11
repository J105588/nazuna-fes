import React from 'react';
import { Sparkles, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-28 border-t border-[rgba(255,255,255,0.08)] bg-[#050711] pt-16 pb-12 text-[#94A1B2] text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[rgba(255,255,255,0.08)]">
          {/* コラム 1 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E51937] to-[#800010] flex items-center justify-center border border-[rgba(245,208,97,0.3)] shadow-[0_0_15px_rgba(229,25,55,0.4)]">
                <Sparkles className="w-5 h-5 text-[#F5D061]" />
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-widest">
                百輝夜行
              </span>
            </div>
            <p className="text-[#94A1B2]/80 leading-relaxed max-w-sm">
              2026年度 なずな祭（市川中学校・市川高等学校 文化祭）公式Webポータル。赤い和傘と金茶の光が紡ぐ、熱気あふれる夜のパレードをお楽しみください。
            </p>
            <div className="flex items-center gap-2 text-[#94A1B2]/60 pt-2">
              <MapPin className="w-4 h-4 text-[#E51937]" />
              <span>千葉県市川市本北方2-38-1 市川学園キャンパス</span>
            </div>
          </div>

          {/* コラム 2 */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider text-sm flex items-center gap-2 font-serif">
              <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
              <span>システムインフラ</span>
            </h4>
            <ul className="space-y-2 text-[#94A1B2]/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                <span>SPA: React 18 + TypeScript + Vite</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5D061]" />
                <span>Realtime Store & Zero-Latency UI</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E51937]" />
                <span>GAS Pyramid & Forms Integration</span>
              </li>
            </ul>
          </div>

          {/* コラム 3 */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wider text-sm flex items-center gap-2 font-serif">
              <ExternalLink className="w-4 h-4 text-[#F5D061]" />
              <span>外部連携ポータル</span>
            </h4>
            <ul className="space-y-2 text-[#94A1B2]/80">
              <li>
                <a
                  href="https://www.ichigaku.ac.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>市川学園 公式ホームページ</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://map.nazuna.jp/campus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>校内デジタル専用マップ</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[#94A1B2]/60 gap-4">
          <p>© 2026 NAZUNA FESTIVAL EXECUTIVE COMMITTEE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-1 text-[#94A1B2]/80">
            <span>Built for</span>
            <span className="text-[#E51937] font-bold">PROJECT HYAKKI-YAKO</span>
            <Heart className="w-3.5 h-3.5 text-[#E51937] inline fill-current ml-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
