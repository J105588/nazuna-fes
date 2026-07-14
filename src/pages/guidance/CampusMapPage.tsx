import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import type { GuidanceSectionId } from '../GuidanceDetailPage';

interface CampusMapPageProps {
  onNavigateSection?: (section: GuidanceSectionId) => void;
  onNavigateTab?: (tab: any) => void;
}

export const CampusMapPage: React.FC<CampusMapPageProps> = ({ onNavigateTab }) => {
  return (
    <section id="campus-map" className="w-full scroll-mt-28">
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-wafuu-ekasumi shadow-sm font-sans space-y-8">
        <div className="border-b border-wafuu-sumi/15 pb-5">
          <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif flex items-center gap-3">
            <MapPin className="w-8 h-8 text-wafuu-ai shrink-0" />
            <span>校内マップ</span>
          </h2>
        </div>

        <div className="space-y-6 text-sm sm:text-base font-sans">
          <p className="leading-relaxed text-wafuu-sumi/85">
            市川学園内用の道案内システムです。校内のポスターのQRコードと一緒にご活用ください。
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigateTab && onNavigateTab('map')}
              className="px-8 py-4 rounded-2xl bg-[#2C3E55] text-white font-bold text-sm sm:text-base shadow-md hover:bg-wafuu-shu hover:shadow-lg transition-all flex items-center gap-2.5 group"
            >
              <span>校内マップを開く</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
