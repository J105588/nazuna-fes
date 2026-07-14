import React from 'react';
import { ShieldCheck, MapPin, Compass, Recycle } from 'lucide-react';
import { FaqCustomIcon } from '../common/FaqCustomIcon';
import type { GuidanceSectionId } from '../../pages/GuidanceDetailPage';

interface GuidanceSubNavProps {
  currentSection: GuidanceSectionId;
  onNavigateSection: (section: GuidanceSectionId) => void;
}

export const GuidanceSubNav: React.FC<GuidanceSubNavProps> = ({
  currentSection,
  onNavigateSection
}) => {
  const navItems: { id: GuidanceSectionId; label: string; badge: string; icon: React.ReactNode }[] = [
    { id: 'precautions', label: 'ご来場の際の注意点', badge: 'お願い', icon: <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'campus-map', label: '校内マップ', badge: 'マップ', icon: <MapPin className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'info-desk', label: '総合案内所', badge: '総合案内', icon: <Compass className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'faq', label: 'よくあるご質問 (FAQ)', badge: 'Q&A', icon: <FaqCustomIcon className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'waste-rules', label: 'ごみ分別ルール', badge: 'エコ', icon: <Recycle className="w-6 h-6 sm:w-7 sm:h-7" /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 font-sans my-8 select-none">
      {navItems.map((item) => {
        const isActive = currentSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              onNavigateSection(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hexagon-border-box group"
          >
            <div className="hexagon-outer">
              <div className={`hexagon-inner ${isActive ? '!bg-gradient-to-br !from-[#2C3E55] !to-[#1B273E] !text-white' : ''}`}>
                <div className={`hexagon-decor-ring ${isActive ? '!border-[#F5D061]' : ''}`} />
                <div className="flex items-center justify-between w-full mb-3 px-1">
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isActive ? 'bg-wafuu-kincha text-white' : 'bg-wafuu-sumi/10 text-wafuu-sumi/80'}`}>
                    {item.badge}
                  </span>
                  <div className={`${isActive ? 'text-wafuu-kincha' : 'text-[#2C3E55] group-hover:text-wafuu-shu transition-colors'}`}>
                    {item.icon}
                  </div>
                </div>
                <span className={`font-black text-xs sm:text-sm lg:text-base leading-tight font-serif mt-1 ${isActive ? 'text-white' : 'text-[#2C3E55] group-hover:text-white transition-colors'}`}>
                  {item.label}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
