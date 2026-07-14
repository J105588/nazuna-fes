import React from 'react';
import type { GuidanceSectionId } from '../GuidanceDetailPage';

interface WasteRulesPageProps {
  onNavigateSection?: (section: GuidanceSectionId) => void;
}

export const WasteRulesPage: React.FC<WasteRulesPageProps> = () => {
  return (
    <section id="waste-rules" className="w-full scroll-mt-28">
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-wafuu-ekasumi shadow-sm font-sans space-y-8">
        <div className="border-b border-wafuu-sumi/15 pb-5">
          <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif">
            ごみ分別のお願い
          </h2>
        </div>

        <div className="space-y-6 text-sm sm:text-base">
          <p className="leading-relaxed text-wafuu-sumi/85">
            校内には複数個所のごみ箱を設置しております。必ず実行委員会の誘導に従い、以下の分別ルールにご協力ください。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-white border-2 border-[#1E6B47] font-bold text-center space-y-1 shadow-sm">
              <div className="text-sm text-[#1E6B47]">燃えるごみ</div>
              <div className="text-[11px] text-wafuu-sumi/70 font-sans">紙くず・割り箸・紙コップ等</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border-2 border-[#1E6B47] font-bold text-center space-y-1 shadow-sm">
              <div className="text-sm text-[#1E6B47]">プラスチック類</div>
              <div className="text-[11px] text-wafuu-sumi/70 font-sans">食品プラスチック容器・フィルム等</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border-2 border-[#1E6B47] font-bold text-center space-y-1 shadow-sm">
              <div className="text-sm text-[#1E6B47]">ペットボトル・缶</div>
              <div className="text-[11px] text-wafuu-sumi/70 font-sans">キャップとラベルを必ず分離</div>
            </div>
          </div>
          <p className="text-xs text-wafuu-sumi/70 pt-2 font-serif">
            ※ 学園内で汁物は処理できません。また、ビンのごみに関しては該当する喫茶展示団体にてのみ回収可能です。
          </p>
        </div>
      </div>
    </section>
  );
};
