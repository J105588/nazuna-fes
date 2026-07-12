import React, { useState, useEffect, useRef } from 'react';
import type { TimetableEvent, StageLocation } from '../../types/database';
import { Calendar, Clock, MapPin, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';

interface TimetableSectionProps {
  events: TimetableEvent[];
  initialStage?: StageLocation;
}

export const TimetableSection: React.FC<TimetableSectionProps> = ({ events, initialStage = 'gym' }) => {
  const [activeTab, setActiveTab] = useState<StageLocation>(initialStage);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const activeCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (initialStage) setActiveTab(initialStage);
  }, [initialStage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isEventNow = (startIso: string, endIso: string) => {
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    return currentTime >= start && currentTime <= end;
  };

  const filteredEvents = events
    .filter((e) => e.is_published && e.stage_location === activeTab)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const scrollToNowEvent = () => {
    const nowEvt = filteredEvents.find((e) => isEventNow(e.start_time, e.end_time));
    if (nowEvt && activeCardRefs.current[nowEvt.id]) {
      activeCardRefs.current[nowEvt.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToNowEvent();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const stages: { id: StageLocation; label: string; iconColor: string; description: string }[] = [
    { id: 'gym', label: '第一体育館 メインステージ', iconColor: 'text-[#E51937]', description: 'ダンス・書道・オープニング公演' },
    { id: 'courtyard', label: '中庭 屋外特設ステージ', iconColor: 'text-[#00D2FF]', description: '有志バンド・軽音楽部ライブフェス' },
    { id: 'av_room', label: '視聴覚室・演劇ステージ', iconColor: 'text-[#F5D061]', description: '演劇部・アコースティック公演' }
  ];

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 上部ヘッダー＆説明 */}
      <div className="wamodern-panel p-6 sm:p-10 rounded-3xl border border-[rgba(245,208,97,0.35)] space-y-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#E51937]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4.5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E51937] via-[#A30E24] to-[#800010] text-white shadow-[0_6px_25px_rgba(229,25,55,0.6)] border border-[#F5D061]/50">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wider font-serif">
                ステージ・演目 タイムテーブル
              </h2>
              <p className="text-xs sm:text-sm text-[#94A1B2] mt-1.5 font-sans leading-relaxed max-w-xl">
                進行中演目は赤和傘の緋赤背景と金彩エンブレムにより自動ハイライト・追従表示されます。
              </p>
            </div>
          </div>

          <button
            onClick={scrollToNowEvent}
            className="btn-wamodern-gold text-xs sm:text-sm flex items-center gap-2.5 self-start sm:self-center py-3 px-5 shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            <span>現在進行中の演目へジャンプ</span>
          </button>
        </div>

        {/* タブバー */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-[rgba(245,208,97,0.25)] relative z-10">
          {stages.map((stg) => {
            const isActive = activeTab === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setActiveTab(stg.id)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border relative overflow-hidden group ${
                  isActive
                    ? 'bg-gradient-to-br from-[rgba(245,208,97,0.25)] via-[#131a3b] to-[#0a0e22] border-[#F5D061] shadow-[0_8px_30px_rgba(245,208,97,0.25)] scale-[1.02]'
                    : 'bg-[#060814]/80 hover:bg-[#131a3b]/60 border-[rgba(255,255,255,0.1)] text-white/80 hover:border-[#F5D061]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base sm:text-lg tracking-wide text-white group-hover:text-[#F5D061] transition-colors">
                    {stg.label}
                  </span>
                  <MapPin className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#F5D061]' : stg.iconColor}`} />
                </div>
                <p className={`text-xs mt-2 font-sans ${isActive ? 'text-[#F0F4F8]' : 'text-[#94A1B2]'}`}>
                  {stg.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* タイムラインリスト */}
      <div className="relative pl-6 sm:pl-10 space-y-7 before:absolute before:left-2.5 sm:before:left-4.5 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-[#E51937] before:via-[#F5D061] before:to-[#00D2FF]">
        {filteredEvents.length === 0 ? (
          <div className="wamodern-panel p-16 text-center rounded-3xl text-white/70 space-y-4 border border-[rgba(245,208,97,0.3)] shadow-xl">
            <Clock className="w-12 h-12 mx-auto text-[#F5D061]/50" />
            <p className="text-base font-serif font-bold">現在、このステージで公開されている演目はありません。</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isNow = isEventNow(evt.start_time, evt.end_time);

            return (
              <div
                key={evt.id}
                ref={(el) => {
                  activeCardRefs.current[evt.id] = el;
                }}
                className={`relative transition-all duration-400 rounded-3xl p-6 sm:p-7 border ${
                  isNow
                    ? 'bg-gradient-to-r from-[#2a0c1a] via-[#1d1024] to-[#121633] border-[#E51937] shadow-[0_15px_45px_rgba(229,25,55,0.5),0_0_30px_rgba(245,208,97,0.2)] scale-[1.02]'
                    : 'wamodern-panel wamodern-panel-hover border-[rgba(255,255,255,0.12)]'
                }`}
              >
                {/* 丸印（タイムラインピン） */}
                <div
                  className={`absolute -left-6 sm:-left-10 top-7 w-4 h-4 rounded-full border-2 border-[#050711] transition-transform ${
                    isNow
                      ? 'bg-[#E51937] shadow-[0_0_20px_#E51937] scale-125'
                      : 'bg-[#F5D061] shadow-[0_0_10px_#F5D061]'
                  }`}
                >
                  {isNow && (
                    <span className="absolute -inset-1.5 rounded-full bg-[#E51937] animate-ping opacity-75" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        className={`font-mono text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl border ${
                          isNow
                            ? 'bg-black/80 text-[#F5D061] border-[#F5D061]/70 shadow-inner'
                            : 'bg-white/5 text-[#00D2FF] border-white/15'
                        }`}
                      >
                        {formatTime(evt.start_time)} 〜 {formatTime(evt.end_time)}
                      </div>

                      {isNow && (
                        <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#E51937] via-[#C40D2A] to-[#800010] text-white font-black border border-[#F5D061]/80 text-xs tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(229,25,55,0.8)] animate-pulse">
                          <Sparkles className="w-4 h-4 text-[#F5D061]" />
                          <span>NOW ON STAGE</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide">
                      {evt.title}
                    </h3>

                    {evt.organization_name && (
                      <p className="text-xs sm:text-sm text-[#94A1B2] font-sans">
                        主催・出演：
                        <span className={`font-bold ml-1.5 ${isNow ? 'text-[#F5D061]' : 'text-white'}`}>
                          {evt.organization_name}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {isNow ? (
                      <span className="text-xs font-bold text-[#E51937] flex items-center gap-2 bg-black/60 px-4 py-2.5 rounded-xl border border-[#E51937]/50 shadow-md">
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#E51937]" />
                        <span>和傘緋赤ハイライト適用中</span>
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A1B2] font-mono bg-black/40 px-3.5 py-2 rounded-xl border border-white/10">
                        待機 / スケジュール
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
