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
    <div className="space-y-10 animate-fade-in">
      {/* 上部ヘッダー＆説明 */}
      <div className="wamodern-panel p-6 sm:p-10 rounded-2xl border border-[rgba(245,208,97,0.25)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#E51937] to-[#800010] text-white shadow-[0_4px_20px_rgba(229,25,55,0.4)]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wider font-serif">
                ステージ・演目タイムテーブル
              </h2>
              <p className="text-xs text-[#94A1B2] mt-1 font-sans">
                スマートフォン最適化・縦軸タイムライン。進行中演目は和傘の緋赤背景と金茶バッジで自動ハイライトされます。
              </p>
            </div>
          </div>

          <button
            onClick={scrollToNowEvent}
            className="btn-wamodern-gold text-xs flex items-center gap-2 self-start sm:self-center"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>進行中演目へスクロール</span>
          </button>
        </div>

        {/* タブバー */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          {stages.map((stg) => {
            const isActive = activeTab === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setActiveTab(stg.id)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-[rgba(245,208,97,0.2)] to-[#101633] border-[#F5D061] shadow-[0_4px_20px_rgba(245,208,97,0.15)] scale-[1.01]'
                    : 'bg-[#060814]/80 hover:bg-[#101633] border-[rgba(255,255,255,0.08)] text-white/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base tracking-wide text-white">
                    {stg.label}
                  </span>
                  <MapPin className={`w-4 h-4 ${isActive ? 'text-[#F5D061]' : stg.iconColor}`} />
                </div>
                <p className={`text-xs mt-1 font-sans ${isActive ? 'text-[#F0F4F8]/90' : 'text-[#94A1B2]'}`}>
                  {stg.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* タイムラインリスト */}
      <div className="relative pl-4 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#E51937] before:via-[#F5D061] before:to-transparent">
        {filteredEvents.length === 0 ? (
          <div className="wamodern-panel p-16 text-center rounded-2xl text-white/60 space-y-3 border border-white/10">
            <Clock className="w-8 h-8 mx-auto text-white/30" />
            <p className="text-sm">現在、このステージで公開されている演目はありません。</p>
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
                className={`relative transition-all duration-300 rounded-xl p-6 border ${
                  isNow
                    ? 'bg-gradient-to-r from-[#1b0c16] via-[#210f1e] to-[#121633] border-[#E51937] shadow-[0_10px_35px_rgba(229,25,55,0.4)] scale-[1.01]'
                    : 'wamodern-panel border-[rgba(255,255,255,0.08)]'
                }`}
              >
                {/* 丸印 */}
                <div
                  className={`absolute -left-5 sm:-left-9 top-6 w-3.5 h-3.5 rounded-full border-2 border-[#050711] transition-transform ${
                    isNow
                      ? 'bg-[#E51937] shadow-[0_0_15px_#E51937] scale-125'
                      : 'bg-[#F5D061]'
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-lg border ${
                          isNow
                            ? 'bg-black/60 text-[#F5D061] border-[#F5D061]/50 shadow-inner'
                            : 'bg-white/5 text-[#00D2FF] border-white/10'
                        }`}
                      >
                        {formatTime(evt.start_time)} 〜 {formatTime(evt.end_time)}
                      </div>

                      {isNow && (
                        <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#E51937] to-[#B30A24] text-white font-black border border-white/30 text-xs tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,25,55,0.7)]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>NOW ON STAGE</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-white">
                      {evt.title}
                    </h3>

                    {evt.organization_name && (
                      <p className="text-xs text-[#94A1B2] font-sans">
                        主催・出演：
                        <span className={`font-semibold ml-1 ${isNow ? 'text-[#F5D061]' : 'text-white'}`}>
                          {evt.organization_name}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {isNow ? (
                      <span className="text-xs font-bold text-[#E51937] flex items-center gap-1.5 bg-black/40 px-3.5 py-2 rounded-lg border border-[#E51937]/30">
                        <CheckCircle2 className="w-4 h-4 text-[#E51937]" />
                        <span>和傘緋赤ハイライト適用中</span>
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A1B2] font-mono">
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
