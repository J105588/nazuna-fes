import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Calendar,
  Bell,
  Search,
  TrendingUp,
  Shield,
  LogOut,
  User,
  ChevronRight,
  Globe
} from 'lucide-react';
import type { AdminUser } from '../../types/database';

export type AdminTabId = 'overview' | 'users' | 'pages' | 'orgs' | 'events' | 'announcements' | 'lostfound' | 'pyramid';

export interface AdminSidebarProps {
  activeTab: AdminTabId;
  setActiveTab: (tab: AdminTabId) => void;
  role: 'superadmin' | 'admin' | string;
  currentUser?: AdminUser | null;
  onLogout: () => void;
  onNavigateHome?: () => void;
  counts: {
    orgs: number;
    events: number;
    announcements: number;
    lostItems: number;
    users: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  role,
  currentUser,
  onLogout,
  counts
}) => {
  const isSuper = role === 'superadmin' || currentUser?.role === 'superadmin';

  const navItems: Array<{
    id: AdminTabId;
    label: string;
    icon: React.ElementType;
    badge?: number;
    description: string;
  }> = [
      {
        id: 'overview',
        label: 'サマリー',
        icon: LayoutDashboard,
        description: '状況一覧とクイック操作'
      },
      ...(isSuper
        ? [
          {
            id: 'users' as const,
            label: 'アカウント管理',
            icon: Shield,
            badge: counts.users,
            description: '権限・管理者設定'
          }
        ]
        : []),
      {
        id: 'pages',
        label: 'ページ公開設定',
        icon: Globe,
        description: 'ページ単位の公開切替'
      },
      {
        id: 'orgs',
        label: '団体・企画管理',
        icon: Layers,
        badge: counts.orgs,
        description: '出展情報・公開状況'
      },
      {
        id: 'events',
        label: 'タイムテーブル',
        icon: Calendar,
        badge: counts.events,
        description: 'ステージ演目スケジュール'
      },
      {
        id: 'announcements',
        label: 'お知らせ配信',
        icon: Bell,
        badge: counts.announcements,
        description: 'プッシュ・速報配信'
      },
      {
        id: 'lostfound',
        label: '落とし物管理',
        icon: Search,
        badge: counts.lostItems,
        description: '拾得物・返却ステータス'
      },
      {
        id: 'pyramid',
        label: 'ピラミッド結果',
        icon: TrendingUp,
        description: '開示設定・結果ロック'
      }
    ];

  return (
    <>
      {/* PCサイドバー (中〜大画面用) */}
      <aside className="w-64 bg-white flex-col justify-between p-4 fixed top-0 bottom-0 left-0 z-40 hidden md:flex select-none border-r border-slate-200 shadow-sm">
        <div className="space-y-6 overflow-y-auto no-scrollbar pb-4">
          <div className="flex items-center gap-3 px-2 py-1">
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>管理画面</span>
              </h1>
              <p className="text-[10px] text-blue-600 font-mono tracking-wider uppercase">Nazuna Fes 2026</p>
            </div>
          </div>

          {/* ユーザープロフィールカード */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 relative group transition-all hover:border-slate-300">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 group-hover:border-blue-400 transition-colors shadow-2xs">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentUser?.display_name || (isSuper ? '統括管理者' : '実行委員')}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${isSuper ? 'bg-amber-500 shadow-xs shadow-amber-500' : 'bg-blue-600 shadow-xs shadow-blue-600'
                    }`}
                />
                <p className="text-[10px] text-slate-500 font-mono truncate">
                  {isSuper ? 'Superadmin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>

          {/* メインナビゲーション */}
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-mono text-slate-400 tracking-widest uppercase pb-1 flex items-center justify-between">
              <span>Navigation</span>
              <span className="w-8 h-0.5 bg-slate-200 rounded-full" />
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all text-left ${isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-xs" />
                    )}
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                          }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${isActive
                            ? 'bg-white/20 text-white shadow-2xs'
                            : 'bg-slate-100 text-blue-700 border border-slate-200 group-hover:border-blue-300 transition-colors'
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-white/70' : 'text-slate-400'
                          }`}
                      />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* フッターアクション（ログアウト） */}
        <div className="pt-3 border-t border-slate-200 mt-auto space-y-1">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-left border border-transparent hover:border-red-200"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 shrink-0" />
              <span>ログアウト</span>
            </div>
            <span className="text-[10px] text-red-600/70 font-mono">Exit</span>
          </button>
        </div>
      </aside>

      {/* モバイル用トップヘッダー＆セグメントバー (小画面用) */}
      <div className="md:hidden flex flex-col sticky top-0 z-40 bg-white border-b border-slate-200 select-none shadow-sm">
        <div className="p-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="min-w-0">
              <span className="font-bold text-sm text-slate-900 block truncate">管理画面</span>
              <span className="text-[10px] text-blue-600 font-mono block truncate">
                {currentUser?.display_name || 'no-user'} ({isSuper ? 'Superadmin' : 'Admin'})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-xl text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-all text-xs font-medium flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>

        {/* 水平スクロールナビゲーション */}
        <div className="px-3 pb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium text-xs whitespace-nowrap transition-all shrink-0 ${isActive
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                  }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ml-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-700 border border-slate-200'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
