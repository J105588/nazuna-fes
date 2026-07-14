import React from 'react';
import type { GuidanceSectionId } from '../GuidanceDetailPage';

interface FaqPageProps {
  onNavigateSection?: (section: GuidanceSectionId) => void;
}

export const FaqPage: React.FC<FaqPageProps> = () => {
  return (
    <section id="faq" className="w-full scroll-mt-28">
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-wafuu-ekasumi shadow-sm font-sans space-y-8">
        <div className="border-b border-wafuu-sumi/15 pb-5">
          <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#2C3E55] text-white flex items-center justify-center text-lg font-mono shrink-0 shadow-sm">Q</span>
            <span>よくあるご質問 (FAQ)</span>
          </h2>
        </div>

        <div className="space-y-6 text-sm sm:text-base font-sans">
          <div className="p-6 rounded-3xl bg-[#FAF8F5] space-y-2 border border-wafuu-ekasumi/50 shadow-sm">
            <h4 className="font-bold text-[#2C3E55] flex items-center gap-2.5 text-base font-serif">
              <span className="w-6 h-6 rounded-lg bg-[#2C3E55] text-white flex items-center justify-center text-xs font-mono shrink-0">Q</span>
              <span>途中退場や再入場は可能ですか？</span>
            </h4>
            <p className="pl-8 text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
              はい、可能です。正門にて事前にご登録いただいたQRコードをご提示いただくことで、開催時間内であれば何度でも再入場いただけます。
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F5] space-y-2 border border-wafuu-ekasumi/50 shadow-sm">
            <h4 className="font-bold text-[#2C3E55] flex items-center gap-2.5 text-base font-serif">
              <span className="w-6 h-6 rounded-lg bg-[#2C3E55] text-white flex items-center justify-center text-xs font-mono shrink-0">Q</span>
              <span>校内での飲食ルールについて教えてください。</span>
            </h4>
            <p className="pl-8 text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
              歩行中の飲食はご遠慮ください。指定された飲食エリア、または指定の休憩教室でのお食事にご協力をお願いいたします。
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F5] space-y-2 border border-wafuu-ekasumi/50 shadow-sm">
            <h4 className="font-bold text-[#2C3E55] flex items-center gap-2.5 text-base font-serif">
              <span className="w-6 h-6 rounded-lg bg-[#2C3E55] text-white flex items-center justify-center text-xs font-mono shrink-0">Q</span>
              <span>落とし物をした場合はどこへ行けばよいですか？</span>
            </h4>
            <p className="pl-8 text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
              まずは<strong>「落とし物掲示板」</strong>をご確認ください。該当する品物が見つかった場合は、スマートフォン画面をご提示の上、<strong>「本館2階 総合案内所」</strong>までお越しください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
