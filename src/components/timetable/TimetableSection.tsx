import React, { useState, useEffect, useRef } from 'react';
import type { TimetableEvent, StageLocation } from '../../types/database';
import { Calendar, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

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

  const isEventNow = React.useCallback((startIso: string, endIso: string) => {
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    return currentTime >= start && currentTime <= end;
  }, [currentTime]);

  const filteredEvents = React.useMemo(() => events
    .filter((e) => e.is_published && e.stage_location === activeTab)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()),
    [events, activeTab]
  );

  const scrollToNowEvent = React.useCallback(() => {
    const nowEvt = filteredEvents.find((e) => isEventNow(e.start_time, e.end_time));
    if (nowEvt && activeCardRefs.current[nowEvt.id]) {
      activeCardRefs.current[nowEvt.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [filteredEvents, isEventNow]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToNowEvent();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, scrollToNowEvent]);

  const stages: { id: StageLocation; label: string; iconColor: string; description: string }[] = [
    { id: 'gym', label: '第一体育館 メインステージ', iconColor: 'text-wafuu-shu', description: 'ダンス・書道・オープニング公演' },
    { id: 'courtyard', label: '中庭 屋外特設ステージ', iconColor: 'text-wafuu-kincha', description: '有志バンド・軽音楽部ライブフェス' },
    { id: 'av_room', label: '視聴覚室・演劇ステージ', iconColor: 'text-wafuu-ai', description: '演劇部・アコースティック公演' }
  ];

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 上部ヘッダー＆説明 */}
      <div className="wafuu-panel p-6 sm:p-10 rounded-3xl border border-wafuu-sumi/10 space-y-7 shadow-sm relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-wafuu-shu/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4.5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark text-white shadow-sm border border-wafuu-ekasumi/40">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-wafuu-sumi tracking-wider font-serif">
                ステージ・演目 タイムテーブル
              </h2>
              <p className="text-xs sm:text-sm text-wafuu-text-sub mt-1.5 font-serif leading-relaxed max-w-xl">
                進行中の演目は朱色と金茶の伝統色フレームでリアルタイムに自動ハイライト・追従表示されます。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-serif text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-wafuu-shu shadow-[0_0_10px_#D14B41] animate-ping" />
            <span className="text-wafuu-sumi font-bold bg-wafuu-kinari px-4 py-2 rounded-xl border border-wafuu-sumi/10 shadow-inner">
              自動追従・現在進行時刻ハイライト機能 稼働中
            </span>
          </div>
        </div>

        {/* タブ選択 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-wafuu-sumi/8">
          {stages.map((stage) => {
            const isActive = activeTab === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveTab(stage.id)}
                className={`p-5 rounded-2xl transition-all duration-300 text-left relative overflow-hidden flex items-start gap-4 border ${
                  isActive
                    ? 'bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark text-white border-wafuu-kincha shadow-[0_8px_25px_rgba(209,75,65,0.25)] scale-[1.01]'
                    : 'bg-wafuu-kinari/80 hover:bg-wafuu-kinari text-wafuu-sumi border-wafuu-sumi/10 hover:border-wafuu-ekasumi/60 font-serif'
                }`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    isActive ? 'bg-white/20 text-white' : `bg-white ${stage.iconColor} shadow-sm border border-wafuu-sumi/6`
                  }`}
                >
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base sm:text-lg tracking-wide">{stage.label}</h4>
                  <p className={`text-xs mt-1 font-serif ${isActive ? 'text-white/90' : 'text-wafuu-text-sub'}`}>
                    {stage.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* タイムラインリスト */}
      <div className="relative pl-6 sm:pl-10 space-y-7 before:absolute before:left-2.5 sm:before:left-4.5 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-wafuu-shu before:via-wafuu-kincha before:to-wafuu-ekasumi/40 before:rounded-full">
        {filteredEvents.length === 0 ? (
          <div className="wafuu-panel p-16 text-center rounded-3xl text-wafuu-text-muted space-y-4 border border-wafuu-sumi/10 shadow-sm font-serif">
            <Clock className="w-12 h-12 mx-auto text-wafuu-kincha/50" />
            <p className="text-base font-bold text-wafuu-sumi">現在、このステージで公開されている演目はありません。</p>
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
                className={`relative transition-all duration-400 rounded-3xl p-6 sm:p-7 border font-serif ${
                  isNow
                    ? 'bg-gradient-to-r from-wafuu-shu/10 via-wafuu-kincha/5 to-white border-wafuu-shu shadow-[0_12px_36px_rgba(209,75,65,0.15)] scale-[1.01]'
                    : 'wafuu-panel wafuu-panel-hover border-wafuu-sumi/10'
                }`}
              >
                {/* 丸印（タイムラインピン） */}
                <div
                  className={`absolute -left-6 sm:-left-10 top-7 w-4 h-4 rounded-full border-2 border-white transition-transform ${
                    isNow
                      ? 'bg-wafuu-shu shadow-[0_0_15px_#D14B41] scale-125'
                      : 'bg-wafuu-kincha shadow-[0_0_8px_#C9A83E]'
                  }`}
                >
                  {isNow && (
                    <span className="absolute -inset-1.5 rounded-full bg-wafuu-shu animate-ping opacity-75" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        className={`font-mono text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl border ${
                          isNow
                            ? 'bg-wafuu-shu text-white border-wafuu-shu shadow-sm'
                            : 'bg-wafuu-kinari text-wafuu-sumi border-wafuu-sumi/10'
                        }`}
                      >
                        {formatTime(evt.start_time)} 〜 {formatTime(evt.end_time)}
                      </div>

                      {isNow && (
                        <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-wafuu-shu to-wafuu-shu-dark text-white font-black border border-wafuu-kincha/60 text-xs tracking-widest flex items-center gap-2 shadow-[0_4px_12px_rgba(209,75,65,0.3)] animate-pulse">
                          <Sparkles className="w-4 h-4 text-wafuu-kincha" />
                          <span>NOW ON STAGE</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-wafuu-sumi tracking-wide">
                      {evt.title}
                    </h3>

                    {evt.organization_name && (
                      <p className="text-xs sm:text-sm text-wafuu-text-sub font-sans">
                        主催・出演：
                        <span className={`font-bold ml-1.5 font-serif ${isNow ? 'text-wafuu-shu' : 'text-wafuu-sumi'}`}>
                          {evt.organization_name}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {isNow ? (
                      <span className="text-xs font-bold text-wafuu-shu flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-wafuu-shu/30 shadow-sm">
                        <CheckCircle2 className="w-4.5 h-4.5 text-wafuu-shu" />
                        <span>只今上演中</span>
                      </span>
                    ) : (
                      <span className="text-xs text-wafuu-text-muted font-mono bg-wafuu-kinari px-3.5 py-2 rounded-xl border border-wafuu-sumi/8">
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
