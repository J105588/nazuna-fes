import React from 'react';
import {
  Layers,
  Calendar,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import type { Organization, TimetableEvent, Announcement, LostItem, AdminUser } from '../../types/database';
import type { AdminTabId } from './AdminSidebar';

export interface AdminOverviewTabProps {
  organizations: Organization[];
  timetableEvents: TimetableEvent[];
  announcements: Announcement[];
  lostItems: LostItem[];
  currentUser?: AdminUser | null;
  role: string;
  onNavigate: (tab: AdminTabId) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  organizations,
  timetableEvents,
  announcements,
  lostItems,
  currentUser,
  onNavigate
}) => {
  const publishedOrgs = organizations.filter((o) => o.is_published).length;
  const orgsPublishRate = organizations.length > 0 ? Math.round((publishedOrgs / organizations.length) * 100) : 0;

  const publishedEvents = timetableEvents.filter((e) => e.is_published).length;
  const returnedLostItems = lostItems.filter((l) => l.status === 'returned').length;
  const urgentAnnouncements = announcements.filter((a) => a.category === 'urgent').length;

  // 最新のお知らせ (最大3件)
  const recentAnnouncements = [...announcements]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // 最新の落とし物 (最大3件)
  const recentLostItems = [...lostItems]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 select-none animate-in fade-in duration-300">
      {/* ヒーローウェルカムバナー */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-blue-200">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/3 -mb-12 w-48 h-48 bg-indigo-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              お疲れ様です、{currentUser?.display_name || 'no-user'} さん
            </h2>
          </div>
        </div>
      </div>

      {/* サマリー統計カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 団体・企画 */}
        <div
          onClick={() => onNavigate('orgs')}
          className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md cursor-pointer flex flex-col justify-between space-y-4 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">出展団体・企画数</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {organizations.length} <span className="text-xs font-normal text-slate-500">団体</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600">公開率 ({publishedOrgs}件 公開中)</span>
              <span className="font-mono font-bold text-blue-600">{orgsPublishRate}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${orgsPublishRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* タイムテーブル演目 */}
        <div
          onClick={() => onNavigate('events')}
          className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md cursor-pointer flex flex-col justify-between space-y-4 border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ステージ演目数</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {timetableEvents.length} <span className="text-xs font-normal text-slate-500">演目</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">公開スケジュール</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{publishedEvents}件 公開</span>
            </span>
          </div>
        </div>

        {/* お知らせ配信 */}
        <div
          onClick={() => onNavigate('announcements')}
          className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md cursor-pointer flex flex-col justify-between space-y-4 border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">配信お知らせ数</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {announcements.length} <span className="text-xs font-normal text-slate-500">配信</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">緊急・重要配信</span>
            <span className={`font-semibold flex items-center gap-1 ${urgentAnnouncements > 0 ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
              {urgentAnnouncements > 0 && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-bounce" />}
              <span>{urgentAnnouncements}件</span>
            </span>
          </div>
        </div>

        {/* 落とし物掲示板 */}
        <div
          onClick={() => onNavigate('lostfound')}
          className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md cursor-pointer flex flex-col justify-between space-y-4 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">落とし物登録数</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {lostItems.length} <span className="text-xs font-normal text-slate-500">拾得</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
              <Search className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">返却完了件数</span>
            <span className="font-mono font-bold text-emerald-600">
              {returnedLostItems} / {lostItems.length}件
            </span>
          </div>
        </div>
      </div>

      {/* クイックアクションパネル */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">クイックアクション</h3>
          <span className="text-xs text-slate-500">ワンクリックで主要な登録画面や管理タブへ移動</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <button
            onClick={() => onNavigate('orgs')}
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">出展団体の管理・検索</h4>
              <p className="text-xs text-slate-600 leading-relaxed">企画内容や公開状態、混雑メニューAPI設定の更新</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1.5 transition-all shrink-0 mt-1" />
          </button>

          <button
            onClick={() => onNavigate('events')}
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">タイムテーブル管理</h4>
              <p className="text-xs text-slate-600 leading-relaxed">ステージ演目の日時追加や進行状況・場所の調整</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1.5 transition-all shrink-0 mt-1" />
          </button>

          <button
            onClick={() => onNavigate('announcements')}
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all text-left flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-2 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight">お知らせの即時配信</h4>
              <p className="text-xs text-slate-600 leading-relaxed">来場者向けプッシュや緊急・重要アナウンスの作成</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1.5 transition-all shrink-0 mt-1" />
          </button>

          <button
            onClick={() => onNavigate('lostfound')}
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">拾得物のクイック登録</h4>
              <p className="text-xs text-slate-600 leading-relaxed">落とし物の特徴や保管窓口情報、写真プレビュー登録</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1.5 transition-all shrink-0 mt-1" />
          </button>
        </div>
      </div>

      {/* アクティビティフィード (最近のお知らせ & 落とし物) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近の配信お知らせ */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <span>直近の配信お知らせ</span>
            </h3>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold transition-colors bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
            >
              <span>すべて見る</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {recentAnnouncements.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono bg-slate-50 rounded-xl border border-slate-200">
              まだお知らせは配信されていません
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${ann.category === 'urgent'
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : ann.category === 'stage'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                    >
                      {ann.category === 'urgent' ? '緊急・重要' : ann.category === 'stage' ? 'ステージ予定' : '一般お知らせ'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(ann.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{ann.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 最近の落とし物 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span>直近の落とし物登録状況</span>
            </h3>
            <button
              onClick={() => onNavigate('lostfound')}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold transition-colors bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
            >
              <span>すべて見る</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {recentLostItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono bg-slate-50 rounded-xl border border-slate-200">
              現在、登録された落とし物はありません
            </div>
          ) : (
            <div className="space-y-3">
              {recentLostItems.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-blue-400 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <Search className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${item.status === 'storage'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                        >
                          {item.status === 'storage' ? '保管中' : '返却完了'}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{item.item_name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate">
                        拾得: {item.found_place} | 窓口: {item.storage_location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
