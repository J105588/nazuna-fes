import React from 'react';
import type { PolicySectionId } from '../../pages/PolicyPage';

interface FooterProps {
  onNavigatePolicyPage?: (section: PolicySectionId) => void;
  onSelectTab?: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="mt-24 relative bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE6] to-[#EBE4D8] pt-12 pb-10 text-wafuu-sumi text-xs font-serif border-t border-wafuu-ekasumi/70 shadow-sm select-none">
      {/* 上部の柔らかい和風アクセントライン（朱色と金茶の細い筆跡調グラデーション） */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wafuu-shu/60 via-wafuu-kincha/60 to-wafuu-sumi/40" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-wafuu-sumi/15 text-center md:text-left">

          {/* 左側：紋様ロゴ＆実行委員会名 */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.2em] text-wafuu-kincha font-bold block">
                ICHIKAWA GAKUEN NAZUNA FESTIVAL 2026
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-wafuu-sumi tracking-wider font-serif">
                市川中学校・高等学校 なずな祭
              </h2>
            </div>
          </div>

          {/* 右側：正確な所在地およびお問い合わせ（添付内容準拠） */}
          <div className="space-y-2 text-xs text-wafuu-sumi/80 font-sans md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 font-medium">
              <svg className="w-4 h-4 text-wafuu-kincha shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>〒272-0816 千葉県市川市本北方2-38-1 市川中学校・高等学校</span>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-5 text-wafuu-sumi/75 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-wafuu-shu shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span>Tel: 047-339-2681 (代表)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-wafuu-kincha shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>Email: contact@nazuna-fes.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* コピーライト表示 */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-wafuu-sumi/60 font-mono">
          <div>
            &copy; {new Date().getFullYear()} 市川中学校・高等学校 なずな祭実行委員会 All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
