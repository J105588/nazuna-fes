import React from 'react';
import { Compass, HelpCircle, PhoneCall, ShieldCheck, Search, ArrowRight } from 'lucide-react';
import type { GuidanceSectionId } from '../GuidanceDetailPage';

interface InfoDeskPageProps {
  onNavigateSection?: (section: GuidanceSectionId) => void;
  onNavigateTab?: (tab: any) => void;
}

export const InfoDeskPage: React.FC<InfoDeskPageProps> = ({ onNavigateTab }) => {
  return (
    <section id="info-desk" className="w-full scroll-mt-28">
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-wafuu-ekasumi shadow-sm font-sans space-y-8">
        <div className="border-b border-wafuu-sumi/15 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-wafuu-sumi font-serif pt-2 flex items-center gap-3">
              <Compass className="w-8 h-8 text-wafuu-kincha shrink-0" />
              <span>本館2階 総合案内所</span>
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm sm:text-base text-wafuu-sumi/80 leading-relaxed font-serif">
            なずな祭当日は、<strong>「本館2階 総合案内所」</strong>にて実行委員が常駐し、ご来場の皆様をサポートしております。ご不明点やお困りごとがございましたら、お気軽にお立ち寄りください。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 font-sans">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-wafuu-ekasumi/70 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm text-wafuu-sumi font-serif">
                <HelpCircle className="w-4 h-4 text-wafuu-shu" />
                <span>企画場所・経路案内</span>
              </div>
              <p className="text-xs text-wafuu-sumi/70 leading-relaxed">
                校内マップの見方がわからないなどの場合に、ルートをご案内いたします。
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-wafuu-ekasumi/70 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm text-wafuu-sumi font-serif">
                <PhoneCall className="w-4 h-4 text-wafuu-kincha" />
                <span>迷子・お連れ様のお尋ね</span>
              </div>
              <p className="text-xs text-wafuu-sumi/70 leading-relaxed">
                校内ではぐれてしまったお連れ様のお尋ねや、迷子へのご対応・ご相談を承ります。
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-wafuu-ekasumi/70 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm text-wafuu-sumi font-serif">
                <ShieldCheck className="w-4 h-4 text-wafuu-ai" />
                <span>校内サポートご相談</span>
              </div>
              <p className="text-xs text-wafuu-sumi/70 leading-relaxed">
                緊急時のお問い合わせや、車椅子等で移動に介助が必要な際のご案内窓口として対応いたします。
              </p>
            </div>
          </div>

          {/* 落とし物との接続バナー */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border-2 border-wafuu-kincha/60 text-wafuu-sumi space-y-5 shadow-lg relative overflow-hidden mt-6">
            <div className="absolute right-0 bottom-0 opacity-[0.07] pointer-events-none">
              <Search className="w-64 h-64 -mr-12 -mb-12 text-wafuu-kincha" />
            </div>

            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wafuu-shu/10 border border-wafuu-shu/30 text-xs font-bold text-wafuu-shu">
                <span>落とし物・遺失物についてのお知らせ</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black font-serif tracking-wide text-wafuu-sumi">
                落とし物は「落とし物掲示板」から検索が可能です
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed max-w-3xl relative z-10 font-serif">
              校内での落とし物・お忘れ物は、実行委員より<strong className="text-wafuu-shu font-bold">『落とし物掲示板』</strong>へ随時配信されております。<br />
              お探しの品物がある場合は、総合案内所でお並びいただく前に、まずは<strong className="text-wafuu-shu font-bold">『落とし物掲示板』</strong>をご確認ください。
            </p>

            <div className="pt-2 relative z-10">
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('lostfound')}
                className="py-3.5 px-8 rounded-2xl font-bold text-sm bg-[#2C3E55] hover:bg-wafuu-shu text-white transition-all shadow-md flex items-center gap-3 active:scale-95"
              >
                <span>落とし物掲示板へ移動</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
