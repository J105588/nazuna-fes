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

  // ステージ列定義（本祭の3大ステージ＋拡張ステージ）
  const stages: { id: StageLocation; label: string }[] = [
    { id: 'gym', label: '第一体育館 メインステージ' },
    { id: 'courtyard', label: '中庭 屋外特設ステージ' },
    { id: 'av_room', label: '視聴覚室 演劇・アコースティック' }
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
            <span>公式ステージ進行表</span>
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
        <div className="min-w-[760px] lg:min-w-full">

          {/* 列ヘッダー（各ステージ名） */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] sm:grid-cols-[90px_1fr_1fr_1fr] border-b-2 border-[#2C3E55]/60 bg-white sticky top-0 z-20">
            <div className="p-3 text-center text-[11px] font-mono font-bold text-wafuu-sumi/50 border-r border-wafuu-sumi/10 flex items-center justify-center bg-[#FAF8F5]">
              TIME
            </div>
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="py-3.5 px-3 text-center border-r last:border-r-0 border-wafuu-sumi/15 font-serif font-bold text-xs sm:text-sm text-[#2C3E55] tracking-wide bg-white shadow-sm"
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
                {/* ハートマーク目印（添付画像 input_file_2.png 準拠） */}
                <div className="-ml-3 w-6 h-6 rounded-sm bg-[#A8B5C2] border border-white text-white flex items-center justify-center shadow-md shrink-0 z-10">
                  <Heart className="w-3.5 h-3.5 fill-current text-white" />
                </div>
                {/* 赤または紺の横断ライン */}
                <div className="w-full h-[2px] bg-gradient-to-r from-[#D14B41] via-[#2C3E55] to-[#D14B41] shadow-[0_0_8px_rgba(209,75,65,0.7)]" />
              </div>
            )}

            {/* 演目カード配置（各イベントの start_time と end_time から座標と高さを計算） */}
            {stages.map((stage, colIdx) => {
              const stageEvts = dayEvents.filter((e) => e.stage_location === stage.id);
              return stageEvts.map((evt) => {
                const startV = parseHourValue(evt.start_time);
                const endV = parseHourValue(evt.end_time);

                // 表示範囲(START_HOUR 〜 END_HOUR)外や異常値の安全クリップ
                const clampedStart = Math.max(START_HOUR, startV);
                const clampedEnd = Math.min(END_HOUR, Math.max(clampedStart + 0.3, endV));

                const topPx = (clampedStart - START_HOUR) * (SLOT_HEIGHT * 2);
                const heightPx = Math.max(35, (clampedEnd - clampedStart) * (SLOT_HEIGHT * 2));

                const colClass = colIdx === 0
                  ? 'left-[80px] sm:left-[90px] w-[calc((100%-80px)/3)] sm:w-[calc((100%-90px)/3)]'
                  : colIdx === 1
                    ? 'left-[calc(80px+(100%-80px)/3)] sm:left-[calc(90px+(100%-90px)/3)] w-[calc((100%-80px)/3)] sm:w-[calc((100%-90px)/3)]'
                    : 'left-[calc(80px+(100%-80px)*2/3)] sm:left-[calc(90px+(100%-90px)*2/3)] w-[calc((100%-80px)/3)] sm:w-[calc((100%-90px)/3)]';

                return (
                  <div
                    key={evt.id}
                    className={`absolute ${colClass} p-1.5 sm:p-2 z-10 transition-all duration-300 hover:z-25`}
                    style={{ top: `${topPx}px`, height: `${heightPx}px` }}
                  >
                    {/* カード本体（添付画像 input_file_2.png 準拠：朱色または淡い和風色合いのスマートなブロック） */}
                    <div className="w-full h-full bg-[#FCECEB] border-2 border-[#D14B41] rounded-lg p-2.5 sm:p-3.5 flex flex-col justify-center shadow-sm hover:shadow-lg transition-all overflow-hidden relative group font-serif">
                      <div className="font-bold text-xs sm:text-sm text-[#2C3E55] leading-snug line-clamp-2">
                        {evt.title}
                      </div>
                      <div className="font-mono text-[11px] text-wafuu-sumi/75 mt-1 font-bold">
                        {formatTimeText(evt.start_time)} - {formatTimeText(evt.end_time)}
                      </div>
                      {evt.organization_name && (
                        <div className="text-[11px] text-wafuu-sumi/65 font-sans mt-0.5 line-clamp-1">
                          {evt.organization_name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })}

          </div>
        </div>
      </div>

    </div>
  );
};
