import React, { useState } from 'react';
import type { Organization, TimetableEvent } from '../../types/database';
import {
  toggleOrganizationPublish,
  toggleTimetableEventPublish
} from '../../lib/supabase';
import {
  ShieldAlert,
  Power,
  Layers,
  Calendar,
  LogOut,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  organizations: Organization[];
  timetableEvents: TimetableEvent[];
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  organizations,
  timetableEvents,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'orgs' | 'events'>('orgs');

  return (
    <div className="space-y-8 animate-fadeIn py-6">
      {/* 管理ヘッダーバー */}
      <div className="glass-panel p-6 sm:p-8 border border-[#E51937]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#E51937]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#E51937] to-[#800010] text-white shadow-[0_0_20px_rgba(229,25,55,0.6)]">
            <ShieldAlert className="w-7 h-7 text-[#F5D061]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B] text-[10px]">
                AUTHENTICATED ADMIN
              </span>
              <span className="text-xs text-[#9AA5B1]">実行委員会・教職員ロール</span>
            </div>
            <h2 className="font-serif-title font-bold text-2xl text-white tracking-wider mt-1">
              オンデマンド即時公開制御ダッシュボード
            </h2>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="btn-secondary text-xs py-2.5 px-4 text-[#FF6B81] hover:text-white hover:bg-[#E51937]/30 border-[#E51937]/40 self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>管理セッションログアウト</span>
        </button>
      </div>

      {/* タブ切り替えバー */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('orgs')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'orgs'
              ? 'bg-white/15 text-white border border-white/30 shadow-lg scale-105'
              : 'text-white/60 hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Layers className="w-4 h-4 text-[#E51937]" />
          <span>団体・出し物マスタ公開制御 ({organizations.length}件)</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'events'
              ? 'bg-white/15 text-white border border-white/30 shadow-lg scale-105'
              : 'text-white/60 hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#00D2FF]" />
          <span>ステージ演目公開制御 ({timetableEvents.length}件)</span>
        </button>
      </div>

      {/* リスト・トグルスイッチ画面 */}
      <div className="space-y-4">
        {activeTab === 'orgs' ? (
          organizations.map((org) => {
            const isPub = org.is_published;
            return (
              <div
                key={org.id}
                className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isPub ? 'border-white/20 bg-[#0c1024]/80' : 'border-[#E51937]/50 bg-[#16080e]/60 opacity-75'
                }`}
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="badge bg-white/10 text-white/80 border border-white/15 text-[10px]">
                      {org.category.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-[#00D2FF]">{org.room_code}</span>
                  </div>
                  <h4 className="font-serif-title font-bold text-lg text-white">
                    {org.name}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-1">{org.description}</p>
                </div>

                {/* リアルタイム公開/非公開トグルスイッチ */}
                <div className="flex items-center gap-4 self-start sm:self-center">
                  <span
                    className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full ${
                      isPub
                        ? 'bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/40'
                        : 'bg-[#E51937]/20 text-[#FF6B81] border border-[#E51937]/40'
                    }`}
                  >
                    {isPub ? '一般公開中 (リアルタイム反映)' : '非公開停止 (取下げ中)'}
                  </span>

                  <button
                    onClick={() => toggleOrganizationPublish(org.id, !isPub)}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2 font-bold text-xs shadow-md ${
                      isPub
                        ? 'bg-[#E51937] text-white hover:bg-[#B30A24] border-white/30 shadow-[0_0_15px_rgba(229,25,55,0.6)]'
                        : 'bg-[#00F59B] text-[#060814] hover:bg-[#00D28A] border-white/30 shadow-[0_0_15px_rgba(0,245,155,0.6)]'
                    }`}
                    title={isPub ? 'クリックで即時非公開化' : 'クリックで即時公開'}
                  >
                    <Power className="w-4 h-4" />
                    <span>{isPub ? '非公開に切替' : '公開に切替'}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          timetableEvents.map((evt) => {
            const isPub = evt.is_published;
            return (
              <div
                key={evt.id}
                className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isPub ? 'border-white/20 bg-[#0c1024]/80' : 'border-[#E51937]/50 bg-[#16080e]/60 opacity-75'
                }`}
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#F5D061]">
                    <span>{new Date(evt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 〜</span>
                    <span className="badge bg-white/10 text-white border border-white/15 text-[10px] ml-2">
                      {evt.stage_location.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-serif-title font-bold text-lg text-white">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-white/60">
                    出演：{evt.organization_name || 'ステージ企画'}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <span
                    className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full ${
                      isPub
                        ? 'bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/40'
                        : 'bg-[#E51937]/20 text-[#FF6B81] border border-[#E51937]/40'
                    }`}
                  >
                    {isPub ? '公開配信中' : '非公開（時間割から除外）'}
                  </span>

                  <button
                    onClick={() => toggleTimetableEventPublish(evt.id, !isPub)}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2 font-bold text-xs shadow-md ${
                      isPub
                        ? 'bg-[#E51937] text-white hover:bg-[#B30A24] border-white/30 shadow-[0_0_15px_rgba(229,25,55,0.6)]'
                        : 'bg-[#00F59B] text-[#060814] hover:bg-[#00D28A] border-white/30 shadow-[0_0_15px_rgba(0,245,155,0.6)]'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{isPub ? '非公開に切替' : '公開に切替'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="glass-panel p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-white/60 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-[#F5D061]" />
        <span>変更はプログラムやサーバーリブートを介さず、Supabase/リアルタイムストア経由で即時に一般閲覧側のUIに反映・取り下げされます。</span>
      </div>
    </div>
  );
};
