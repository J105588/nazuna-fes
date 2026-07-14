import React, { useState, useEffect, useMemo } from 'react';
import type { TimetableEvent, TimetableDay, StageLocation } from '../../types/database';
import { fetchTimetableDaysFromDB } from '../../lib/supabase';
import { Calendar, Clock, Heart } from 'lucide-react';

/*
  ========================================================================
  TimetableSection - 時間表グリッド形式（1時間・30分区切り・現在時刻バー・日にちタブ対応）
  ========================================================================
*/

interface TimetableSectionProps {
  events: TimetableEvent[];
  initialStage?: StageLocation;
}

export const TimetableSection: React.FC<TimetableSectionProps> = ({ events }) => {
  const [days, setDays] = useState<TimetableDay[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>('day-1');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);

  useEffect(() => {
    fetchTimetableDaysFromDB().then((data) => {
      if (data && data.length > 0) {
        setDays(data);
        setSelectedDayId(data[0].id);
      }
    });

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1分ごとに更新
    return () => clearInterval(timer);
  }, []);

  // 日にちに紐づく公開イベント
  const dayEvents = useMemo(() => {
    return events.filter((e) => e.is_published && (!e.day_id || e.day_id === selectedDayId));
  }, [events, selectedDayId]);

  // ステージ列定義（ご指定の3大ステージ会場）
  const stages: { id: StageLocation; label: string; aliases: string[] }[] = [
    { id: 'av_room', label: '國枝記念国際ホール', aliases: ['av_room', 'kunieda_hall', '國枝記念国際ホール'] },
    { id: 'gym', label: '古賀記念アリーナ', aliases: ['gym', 'koga_arena', '第一体育館', '古賀記念アリーナ'] },
    { id: 'courtyard', label: 'Nステ会場', aliases: ['courtyard', 'n_stage', '中庭', 'Nステ会場'] }
  ];

  // 時間軸：8:30 〜 17:30 まで 30分（0.5時間）単位でスロットを生成
  // 1時間スロット = 120px, 30分スロット = 60px
  const START_HOUR = 8.5; // 8:30
  const END_HOUR = 17.5;  // 17:30
  const SLOT_HEIGHT = 60; // 30分あたりの高さ(px)

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = START_HOUR; h <= END_HOUR; h += 0.5) {
      const hour = Math.floor(h);
      const min = h % 1 === 0 ? '00' : '30';
      slots.push({
        timeValue: h,
        label: `${hour}:${min}`
      });
    }
    return slots;
  }, []);

  // 時刻文字列 (ISO または HH:mm) から時間数値 (例: 9:30 -> 9.5) を取得
  const parseHourValue = (isoString: string): number => {
    const d = new Date(isoString);
    if (!isNaN(d.getTime())) {
      return d.getHours() + d.getMinutes() / 60;
    }
    // HH:mm 形式の場合
    const parts = isoString.split(':');
    if (parts.length >= 2) {
      return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
    }
    return START_HOUR;
  };

  const formatTimeText = (isoString: string) => {
    const d = new Date(isoString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return isoString;
  };

  // 現在時刻バーの Y座標算出
  const currentHourValue = currentTime.getHours() + currentTime.getMinutes() / 60;
  const isTodayInRange = currentHourValue >= START_HOUR && currentHourValue <= END_HOUR;
  const currentTimeOffsetY = (currentHourValue - START_HOUR) * (SLOT_HEIGHT * 2);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-2 sm:px-6">

      {/* 上部ヘッダー（日にちタブ ＆ タイトル） */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-wafuu-sumi/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-serif font-bold text-wafuu-shu tracking-widest mb-1.5">
            <Calendar className="w-4 h-4" />
            <span>ステージ進行表</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-wafuu-sumi tracking-wider font-serif">
            ステージタイムテーブル
          </h2>
        </div>

        {/* 日にち切り替えタブ（DB設定から流し込み） */}
        <div className="flex flex-wrap items-center gap-2.5">
          {days.length === 0 ? (
            <button className="px-5 py-2.5 rounded-xl bg-[#2C3E55] text-white font-bold text-xs sm:text-sm font-serif shadow-sm">
              DAY 1 (本祭)
            </button>
          ) : (
            days.map((day) => {
              const isSelected = selectedDayId === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayId(day.id)}
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 font-serif font-bold text-xs sm:text-sm flex items-center gap-2 border ${isSelected
                    ? 'bg-wafuu-shu text-white border-wafuu-shu shadow-md scale-[1.03]'
                    : 'bg-white hover:bg-[#FAF8F5] text-wafuu-sumi border-wafuu-sumi/20 hover:border-wafuu-shu/60'
                    }`}
                >
                  <Clock className={`w-4 h-4 ${isSelected ? 'text-[#F5D061]' : 'text-wafuu-sumi/40'}`} />
                  <span>{day.label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* タイムテーブル・時間表グリッドカレンダー (1時間・30分単位の横区切り) */}
      <div className="bg-[#FAF8F5] rounded-3xl border border-wafuu-sumi/20 shadow-sm overflow-x-auto relative">
        <div className="min-w-[860px] sm:min-w-[940px] lg:min-w-full">

          {/* 列ヘッダー（各ステージ名：國枝記念国際ホール、古賀記念アリーナ、Nステ会場） */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] sm:grid-cols-[90px_1fr_1fr_1fr] border-b-2 border-[#2C3E55]/60 bg-white sticky top-0 z-20">
            <div className="p-3 text-center text-[11px] font-mono font-bold text-wafuu-sumi/50 border-r border-wafuu-sumi/10 flex items-center justify-center bg-[#FAF8F5]">
              TIME
            </div>
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="py-4 px-3 text-center border-r last:border-r-0 border-wafuu-sumi/15 font-serif font-extrabold text-xs sm:text-base text-[#2C3E55] tracking-wider bg-white shadow-sm flex items-center justify-center"
              >
                {stage.label}
              </div>
            ))}
          </div>

          {/* 時間軸＆グリッド本体（Y軸方向に時間が進行） */}
          <div className="relative grid grid-cols-[80px_1fr_1fr_1fr] sm:grid-cols-[90px_1fr_1fr_1fr]" style={{ height: `${(timeSlots.length - 1) * SLOT_HEIGHT}px` }}>

            {/* 左側：時刻目盛り列 ＆ 右側：横区切り線（1時間=実線, 30分=点線） */}
            <div className="col-span-4 absolute inset-0 pointer-events-none grid grid-cols-[80px_1fr_1fr_1fr] sm:grid-cols-[90px_1fr_1fr_1fr]">
              {timeSlots.map((slot, idx) => {
                const isHourly = slot.timeValue % 1 === 0;
                return (
                  <React.Fragment key={slot.label}>
                    {/* 左目盛り時刻ラベル */}
                    <div
                      className={`text-right pr-3 font-mono text-xs border-r border-wafuu-sumi/15 select-none -mt-2.5 ${isHourly ? 'font-bold text-wafuu-sumi' : 'text-wafuu-sumi/40 text-[11px]'
                        }`}
                      style={{ top: `${idx * SLOT_HEIGHT}px`, position: 'absolute', width: '80px' }}
                    >
                      {slot.label}
                    </div>

                    {/* ステージ1〜3を横断する区切り線 */}
                    <div
                      className={`absolute left-[80px] sm:left-[90px] right-0 ${isHourly
                        ? 'border-t border-wafuu-sumi/25'
                        : 'border-t border-dashed border-wafuu-sumi/12'
                        }`}
                      style={{ top: `${idx * SLOT_HEIGHT}px` }}
                    />
                  </React.Fragment>
                );
              })}
            </div>

            {/* ステージ列ごとの境界線 */}
            <div className="col-start-2 border-r border-wafuu-sumi/10 h-full" />
            <div className="col-start-3 border-r border-wafuu-sumi/10 h-full" />
            <div className="col-start-4 h-full" />

            {/* 現在時刻を示すインジケーター（赤＆紺ラインとハートマークバッジ） */}
            {isTodayInRange && (
              <div
                className="absolute left-[80px] sm:left-[90px] right-0 z-30 pointer-events-none flex items-center transition-all duration-1000"
                style={{ top: `${currentTimeOffsetY}px` }}
              >
                <div className="-ml-3 w-6 h-6 rounded-sm bg-[#A8B5C2] border border-white text-white flex items-center justify-center shadow-md shrink-0 z-10">
                  <Heart className="w-3.5 h-3.5 fill-current text-white" />
                </div>
                <div className="w-full h-[2px] bg-gradient-to-r from-[#D14B41] via-[#2C3E55] to-[#D14B41] shadow-[0_0_8px_rgba(209,75,65,0.7)]" />
              </div>
            )}

            {/* 演目カード配置（各イベントの start_time と end_time から座標と高さを計算） */}
            {stages.map((stage, colIdx) => {
              const stageEvts = dayEvents.filter((e) => stage.aliases.includes(e.stage_location) || e.stage_location === stage.id);
              return stageEvts.map((evt) => {
                const startV = parseHourValue(evt.start_time);
                const endV = parseHourValue(evt.end_time);

                const clampedStart = Math.max(START_HOUR, startV);
                const clampedEnd = Math.min(END_HOUR, Math.max(clampedStart + 0.3, endV));

                const topPx = (clampedStart - START_HOUR) * (SLOT_HEIGHT * 2);
                const heightPx = Math.max(48, (clampedEnd - clampedStart) * (SLOT_HEIGHT * 2));
                const isShort = heightPx <= 65;

                const colClass = colIdx === 0
                  ? 'left-[80px] sm:left-[90px] w-[calc((100%-80px)/3)] sm:w-[calc((100%-90px)/3)]'
                  : colIdx === 1
                    ? 'left-[calc(80px+(100%-80px)/3)] sm:left-[calc(90px+(100%-90px)/3)] w-[calc((100%-80px)/3)] sm:w-[calc((100%-90px)/3)]'
                    : 'left-[calc(80px+(100%-80px)*2/3)] sm:left-[calc(90px+(100%-90px)*2/3)] w-[calc((100%-80px)/3)] sm:w-[calc((100%-90px)/3)]';

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`absolute ${colClass} p-0.5 sm:p-1 z-10 transition-all duration-300 hover:z-25 cursor-pointer`}
                    style={{ top: `${topPx}px`, height: `${heightPx}px` }}
                  >
                    {/* カード本体（ショートイベント時も文字切れゼロにする弾力レイアウト） */}
                    <div className="w-full h-full bg-[#FCECEB] border-2 border-[#D14B41] rounded-xl p-1.5 sm:p-2.5 flex flex-col justify-center shadow-xs hover:shadow-lg transition-all overflow-hidden relative group font-serif select-none">
                      {isShort ? (
                        <div className="flex items-center justify-between gap-1 overflow-hidden">
                          <div className="font-bold text-xs sm:text-sm text-[#2C3E55] truncate leading-tight">
                            {evt.title}
                          </div>
                          <div className="font-mono text-[10px] sm:text-[11px] text-wafuu-sumi/80 font-extrabold shrink-0">
                            {formatTimeText(evt.start_time)}-{formatTimeText(evt.end_time)}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-bold text-xs sm:text-sm text-[#2C3E55] leading-snug line-clamp-2 break-words">
                            {evt.title}
                          </div>
                          <div className="font-mono text-[10px] sm:text-[11px] text-wafuu-sumi/85 mt-1 font-extrabold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-wafuu-shu shrink-0" />
                            <span>{formatTimeText(evt.start_time)} - {formatTimeText(evt.end_time)}</span>
                          </div>
                          {evt.organization_name && (
                            <div className="text-[10px] sm:text-[11px] text-wafuu-sumi/70 font-sans mt-0.5 truncate font-semibold">
                              {evt.organization_name}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              });
            })}

          </div>
        </div>
      </div>

      {/* 演目詳細確認用ポップアップモーダル (クリックですべての文字や内容を綺麗に確認) */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="wafuu-panel w-full max-w-lg bg-white border border-wafuu-sumi/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-modal-scale font-serif"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-wafuu-sumi/10 pb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#FCECEB] text-wafuu-shu font-mono text-xs font-extrabold border border-wafuu-shu/30 mb-2">
                  {stages.find((s) => s.aliases.includes(selectedEvent.stage_location) || s.id === selectedEvent.stage_location)?.label || '特設会場'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#2C3E55] leading-snug">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-wafuu-shu text-slate-600 hover:text-white transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-wafuu-sumi/85 font-sans">
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <Clock className="w-5 h-5 text-wafuu-shu shrink-0" />
                <span className="font-mono font-extrabold text-base text-[#2C3E55]">
                  {formatTimeText(selectedEvent.start_time)} 〜 {formatTimeText(selectedEvent.end_time)}
                </span>
              </div>

              {selectedEvent.organization_name && (
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  <span className="font-bold text-xs bg-[#2C3E55] text-white px-2 py-0.5 rounded">出演・団体</span>
                  <span className="font-bold text-[#2C3E55]">{selectedEvent.organization_name}</span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-wafuu-ekasumi/60 leading-relaxed font-serif">
                  {selectedEvent.description}
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2.5 rounded-xl bg-[#2C3E55] hover:bg-wafuu-shu text-white font-bold transition-all shadow-sm text-sm font-serif"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
