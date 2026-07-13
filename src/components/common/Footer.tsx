import React from 'react';
import { MapPin, ExternalLink, Heart, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-32 relative bg-gradient-to-b from-wafuu-deep via-[#1C2840] to-[#121A2B] pt-20 pb-16 text-wafuu-kinari text-xs font-serif overflow-hidden border-t border-wafuu-ekasumi/40 shadow-[0_-20px_60px_rgba(30,30,30,0.4)]">
      {/* 上部の和柄ボーダー（市松模様） */}
      <div className="absolute top-0 left-0 right-0 h-1.5 pattern-ichimatsu" />
      <div className="absolute top-0 left-1/3 w-96 h-32 bg-wafuu-shu/20 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 right-1/3 w-96 h-32 bg-wafuu-kincha/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-wafuu-ekasumi/30">
          {/* コラム 1: 総合開催概要 */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wafuu-shu via-wafuu-shu-dark to-[#8B1A1E] flex items-center justify-center border border-wafuu-ekasumi/60 shadow-[0_4px_20px_rgba(209,75,65,0.4)]">
                {/* 和傘アイコン */}
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.5 2 2 6.5 2 12h20c0-5.5-4.5-10-10-10z" />
                  <path d="M12 2v20" />
                </svg>
              </div>
              <div>
                <span className="font-serif font-black text-2xl sm:text-3xl text-white tracking-widest block drop-shadow-sm">
                  百輝夜行
                </span>
                <span className="text-[11px] text-wafuu-kincha tracking-widest font-mono font-bold">
                  2026 ICHIKAWA GAKUEN NAZUNA FESTIVAL
                </span>
              </div>
            </div>
            <p className="text-wafuu-kinari/90 leading-relaxed max-w-md text-xs sm:text-sm font-serif bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner">
              2026年度 なずな祭（市川中学校・市川高等学校 文化祭）公式Webポータル。
              全クラス・部活動・有志団体が手掛ける「百輝夜行」――一夜限りの熱意と赤い和傘が織りなす幻想のパレードを心ゆくまでご堪能ください。
            </p>
            <div className="flex items-center gap-2.5 text-wafuu-kinari pt-1 text-xs font-serif bg-black/30 p-3.5 rounded-xl border border-wafuu-ekasumi/30">
              <div className="p-1.5 rounded-lg bg-wafuu-shu/20 border border-wafuu-shu/40 text-wafuu-kincha">
                <MapPin className="w-4 h-4 shrink-0" />
              </div>
              <span>〒272-0816 千葉県市川市本北方2-38-1 市川学園キャンパス</span>
            </div>
          </div>

          {/* コラム 2: ご来場・館内インフォメーション */}
          <div className="space-y-4">
            <h4 className="text-white font-black tracking-wider text-sm flex items-center gap-2.5 font-serif border-l-4 border-wafuu-kincha pl-3 py-0.5">
              <Compass className="w-4.5 h-4.5 text-wafuu-kincha" />
              <span>ご来場インフォメーション</span>
            </h4>
            <ul className="space-y-3 text-wafuu-kinari/85 text-xs font-serif">
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-wafuu-kincha shadow-sm mt-1 shrink-0" />
                <span>総合案内所・パンフレット配布ブース（正門付近）</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-wafuu-shu shadow-sm mt-1 shrink-0" />
                <span>お忘れ物・迷子センター（本部棟 1F インフォメーション）</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-wafuu-ekasumi shadow-sm mt-1 shrink-0" />
                <span>救護室・AED設置場所（保健室および第一体育館前）</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-white/70 mt-1 shrink-0" />
                <span>直通シャトルバス・駐輪場のご案内</span>
              </li>
            </ul>
          </div>

          {/* コラム 3: 外部ポータル＆実行委員会リンク */}
          <div className="space-y-4">
            <h4 className="text-white font-black tracking-wider text-sm flex items-center gap-2.5 font-serif border-l-4 border-wafuu-shu pl-3 py-0.5">
              <ExternalLink className="w-4.5 h-4.5 text-wafuu-shu" />
              <span>公式ポータル・組織リンク</span>
            </h4>
            <ul className="space-y-3 text-wafuu-kinari/85 text-xs font-serif">
              <li>
                <a
                  href="https://www.ichigaku.ac.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 group p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-wafuu-ekasumi/40"
                >
                  <span className="group-hover:underline">市川中学校・市川高等学校 公式サイト</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-wafuu-kincha transition-colors shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://map.nazuna.jp/campus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 group p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-wafuu-ekasumi/40"
                >
                  <span className="group-hover:underline">校内デジタル専用マップ（フロア案内）</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-wafuu-kincha transition-colors shrink-0" />
                </a>
              </li>
              <li className="p-2.5 rounded-lg bg-black/30 border border-white/10 text-white/90">
                <span className="text-[11px] block font-bold text-wafuu-kincha">主催・企画運営</span>
                <span>2026年度 なずな祭実行委員会本部・生徒会役員会</span>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between text-wafuu-kinari/70 gap-4 text-xs font-serif">
          <p className="font-mono tracking-wider text-center sm:text-left">
            &copy; 2026 NAZUNA FESTIVAL EXECUTIVE COMMITTEE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-white/90 bg-black/40 px-4 py-2 rounded-full border border-wafuu-ekasumi/40 shadow-sm">
            <span>Official Portal of</span>
            <span className="text-wafuu-kincha font-bold tracking-wider font-mono">PROJECT HYAKKI-YAKO</span>
            <Heart className="w-3.5 h-3.5 text-wafuu-shu inline fill-current animate-pulse ml-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
