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
      <aside className="w-64 bg-[#FAF8F5] flex-col justify-between p-5 fixed top-0 bottom-0 left-0 z-40 hidden md:flex select-none border-r border-[#CBD5E1]">
        <div className="space-y-7 overflow-y-auto no-scrollbar pb-4">
          {/* ブランドヘッダー */}
          <div className="px-1 pt-1">
            <h1 className="font-bold text-base tracking-tight text-[#2C3E55]">
              管理画面
            </h1>
            <p className="text-[11px] text-[#D14B41] font-semibold tracking-wider mt-0.5">
              Nazuna Fes 2026
            </p>
          </div>

          {/* ユーザープロフィール */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#CBD5E1] flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#2C3E55] flex items-center justify-center text-white shrink-0 shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#2C3E55] truncate">
                {currentUser?.display_name || (isSuper ? '統括管理者' : '実行委員')}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSuper ? 'bg-[#D14B41]' : 'bg-[#2C3E55]'}`}
                />
                <p className="text-[11px] text-[#708090] font-medium truncate">
                  {isSuper ? 'Superadmin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-[#8293A6] tracking-widest uppercase pb-2">
              メニュー
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all text-left ${isActive
                      ? 'bg-[#2C3E55] text-white shadow-md font-bold'
                      : 'text-[#4A5568] hover:text-[#2C3E55] hover:bg-white font-medium'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-[#708090] group-hover:text-[#D14B41]'
                          }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#E2E8F0] text-[#5A6B7D]'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ログアウト */}
        <div className="pt-4 border-t border-[#CBD5E1] mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-[#D14B41]/80 hover:text-[#D14B41] hover:bg-[#D14B41]/5 transition-all text-left"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>

      {/* モバイル用トップヘッダー＆セグメントバー */}
      <div className="md:hidden flex flex-col sticky top-0 z-40 bg-[#FAF8F5] border-b border-[#CBD5E1] select-none shadow-sm">
        <div className="p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#2C3E55] flex items-center justify-center text-white shrink-0 shadow-sm">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm text-[#2C3E55] block truncate">管理画面</span>
              <span className="text-[11px] text-[#708090] font-medium block truncate">
                {currentUser?.display_name || 'no-user'}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl text-[#D14B41] bg-[#D14B41]/5 border border-[#D14B41]/15 hover:bg-[#D14B41]/10 transition-all text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ログアウト</span>
          </button>
        </div>

        {/* 水平スクロールナビ */}
        <div className="px-3 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs whitespace-nowrap transition-all shrink-0 ${isActive
                  ? 'bg-[#2C3E55] text-white shadow-sm font-bold'
                  : 'text-[#5A6B7D] hover:text-[#2C3E55] bg-white border border-[#CBD5E1] font-medium'
                  }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#708090]'
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
