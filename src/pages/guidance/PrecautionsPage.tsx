import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { GuidanceSectionId } from '../GuidanceDetailPage';

interface PrecautionsPageProps {
  onNavigateSection?: (section: GuidanceSectionId) => void;
}

export const PrecautionsPage: React.FC<PrecautionsPageProps> = () => {
  return (
    <section id="precautions" className="w-full scroll-mt-28">
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-wafuu-ekasumi shadow-sm font-sans space-y-8">
        <div className="border-b border-wafuu-sumi/15 pb-5">
          <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi mt-1 font-serif flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-wafuu-shu shrink-0" />
            <span>ご来場の際の注意点 （お願い事項）</span>
          </h2>
        </div>

        <div className="space-y-6 text-sm sm:text-base font-sans">
          <div className="bg-wafuu-shu/8 p-6 sm:p-8 rounded-3xl border-l-4 border-wafuu-shu space-y-3 shadow-inner">
            <div className="flex items-center gap-2 font-bold text-wafuu-shu text-lg font-serif">
              <span>ご来場者様へ・厳守のお願い</span>
            </div>
            <p className="leading-relaxed text-wafuu-sumi">
              ご来場いただくすべての皆様にお楽しみいただくため、公共マナーおよび安全な行事運営へのご協力をお願いいたします。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
              <h4 className="font-bold text-lg font-serif text-wafuu-sumi flex items-center gap-2 border-b border-wafuu-sumi/10 pb-2.5">
                <span className="w-2 h-2 rounded-full bg-wafuu-shu" />
                <span>公共交通機関ご利用のお願い</span>
              </h4>
              <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                校内および周辺道路に一般ご来場者様用の駐車場・パーキング等は一切ございません。お車・オートバイ等でのご来場は固くお断りいたします。JR本八幡駅・市川大野駅・西船橋駅等の各駅から路線バス等の公共交通機関をご利用ください。
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
              <h4 className="font-bold text-lg font-serif text-wafuu-sumi flex items-center gap-2 border-b border-wafuu-sumi/10 pb-2.5">
                <span className="w-2 h-2 rounded-full bg-wafuu-ai" />
                <span>全面禁煙および酒類持込禁止</span>
              </h4>
              <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                市川学園敷地内および周辺道路はすべて全面禁煙（電子タバコ含む）です。また、酒類の持ち込み・飲酒された状態でのご入場は固くお断り申し上げます。
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-wafuu-ekasumi/50 space-y-3">
              <h4 className="font-bold text-lg font-serif text-wafuu-sumi flex items-center gap-2 border-b border-wafuu-sumi/10 pb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2C3E55]" />
                <span>写真撮影およびSNS投稿ルール</span>
              </h4>
              <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed">
                生徒や他のご来場者様のお顔がはっきりと写っている写真を許可なくインターネットや各種SNS（Instagram、X、TikTok等）へ投稿することはプライバシー保護の観点から禁止しております。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
