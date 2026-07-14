import React, { useEffect } from 'react';
import { ShieldCheck, MapPin, Compass, Recycle, ArrowUp } from 'lucide-react';
import { FaqCustomIcon } from '../components/common/FaqCustomIcon';
import { PrecautionsPage } from './guidance/PrecautionsPage';
import { CampusMapPage } from './guidance/CampusMapPage';
import { InfoDeskPage } from './guidance/InfoDeskPage';
import { FaqPage } from './guidance/FaqPage';
import { WasteRulesPage } from './guidance/WasteRulesPage';

export type GuidanceSectionId =
  | 'precautions'
  | 'campus-map'
  | 'info-desk'
  | 'faq'
  | 'waste-rules'
  | 'lost-found'
  | 'barrier-free'
  | 'press-coverage'
  | 'pamphlet';

interface GuidanceDetailPageProps {
  initialSection?: GuidanceSectionId;
  onNavigateTab?: (tab: 'home' | 'timetable' | 'info' | 'lostfound' | 'guidance' | 'policy' | 'map') => void;
}

export const GuidanceDetailPage: React.FC<GuidanceDetailPageProps> = ({
  initialSection = 'precautions',
  onNavigateTab
}) => {
  useEffect(() => {
    if (initialSection === 'lost-found') {
      if (onNavigateTab) {
        onNavigateTab('lostfound');
        return;
      }
    }

    // 初期セクションへスムーズスクロール
    const timer = setTimeout(() => {
      let targetId = initialSection as string;
      if (initialSection === 'barrier-free' || initialSection === 'press-coverage' || initialSection === 'pamphlet') {
        targetId = 'info-desk';
      }
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [initialSection, onNavigateTab]);

  const navItems: { id: GuidanceSectionId; label: string; badge: string; icon: React.ReactNode }[] = [
    { id: 'precautions', label: 'ご来場の際の注意点', badge: 'お願い', icon: <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-wafuu-shu" /> },
    { id: 'campus-map', label: '校内マップ', badge: 'マップ', icon: <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-wafuu-ai" /> },
    { id: 'info-desk', label: '総合案内所', badge: '窓口', icon: <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-wafuu-kincha" /> },
    { id: 'faq', label: 'よくあるご質問 (FAQ)', badge: 'Q&A', icon: <FaqCustomIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#2C3E55]" /> },
    { id: 'waste-rules', label: 'ごみ分別ルール', badge: 'エコ', icon: <Recycle className="w-6 h-6 sm:w-7 sm:h-7 text-[#1E6B47]" /> },
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-16 sm:py-24 font-serif select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-16">

        {/* タイトルヘッダー */}
        <div className="text-center space-y-5 relative pb-8 border-b border-wafuu-sumi/15">
          <h1 className="text-3xl sm:text-5xl font-black text-wafuu-sumi tracking-wider font-serif">
            ご来場者ガイド ＆ 総合案内所
          </h1>
          <p className="text-sm sm:text-base text-wafuu-sumi/80 max-w-2xl mx-auto leading-relaxed font-sans">
            第76回なずな祭「百輝夜行」へようこそ。安心・安全に文化祭をお楽しみいただくための公式ご案内窓口およびすべての注意事項・ガイドラインを独立項目として掲載しております。
          </p>
        </div>

        {/* クイックアンカー目次（切り替えではなく、各独立セクションへのジャンプリンク） */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs font-mono font-bold text-wafuu-sumi/60">
            <span>INDEX NAVIGATION</span>
            <span>↓ タップで各セクションへ移動</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 font-sans">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className="p-4 rounded-2xl bg-white border border-wafuu-ekasumi/80 shadow-sm hover:shadow-md hover:border-wafuu-kincha transition-all flex flex-col items-center text-center gap-2 group cursor-pointer active:scale-95"
              >
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-wafuu-sumi/10 text-wafuu-sumi/80">
                  {item.badge}
                </span>
                <span className="font-bold text-xs sm:text-sm text-wafuu-sumi font-serif pt-0.5 group-hover:text-wafuu-shu transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ==========================================================
            すべてのガイドタブを独立したセクションとして連続展開
        ========================================================== */}
        <div className="space-y-16 pt-4">

          {/* 1. ご来場の際の注意点 */}
          <PrecautionsPage />

          {/* 2. アクセス・立体マップ */}
          <CampusMapPage onNavigateTab={onNavigateTab} />

          {/* 3. 総合案内所（本館2階） */}
          <InfoDeskPage onNavigateTab={onNavigateTab} />

          {/* 4. よくあるご質問 (FAQ) */}
          <FaqPage />

          {/* 5. ごみ分別ルール */}
          <WasteRulesPage />

        </div>

        {/* フッターアクション */}
        <div className="pt-12 border-t border-wafuu-sumi/15 flex flex-col sm:flex-row items-center justify-center gap-4 font-serif">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3.5 rounded-2xl bg-white border border-wafuu-ekasumi text-wafuu-sumi hover:bg-[#FAF8F5] transition-colors font-bold flex items-center gap-2 shadow-sm text-sm"
          >
            <ArrowUp className="w-4 h-4 text-wafuu-shu" />
            <span>ページトップに戻る</span>
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('home')}
            className="px-8 py-4 rounded-2xl bg-wafuu-sumi text-white hover:bg-wafuu-shu transition-colors font-bold flex items-center gap-2 shadow-lg active:scale-95 text-sm sm:text-base"
          >
            <span>総合トップページへ戻る</span>
          </button>
        </div>

      </div>
    </div>
  );
};
