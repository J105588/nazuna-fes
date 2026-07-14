import React, { useState, useEffect } from 'react';
import type { Organization, TimetableEvent, Announcement, LostItem, AdminUser } from '../types/database';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { supabase } from '../lib/supabase';

interface AdminPageProps {
  organizations: Organization[];
  timetableEvents: TimetableEvent[];
  announcements: Announcement[];
  lostItems: LostItem[];
  onNavigateHome?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  organizations,
  timetableEvents,
  announcements,
  lostItems,
  onNavigateHome
}) => {
  const [role, setRole] = useState<'superadmin' | 'admin' | string | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    // Supabase Auth セッションユーザーから admin_users 情報を確実に同期・取得するヘルパー
    const syncUserFromSession = async (sessionUser: any) => {
      if (!sessionUser) return;
      try {
        const { data: userData } = await client
          .from('admin_users')
          .select('*')
          .eq('email', sessionUser.email)
          .maybeSingle();

        if (userData) {
          setCurrentUser(userData as AdminUser);
          setRole(userData.role);
        } else {
          // DB側レコードが未生成または遅延している場合のセキュアな自動同期フォールバック
          const fallbackUser: AdminUser = {
            id: sessionUser.id,
            email: sessionUser.email || '',
            role: (sessionUser.user_metadata?.role as 'superadmin' | 'admin') || 'admin',
            display_name: sessionUser.user_metadata?.display_name || sessionUser.email?.split('@')[0] || '実行委員会 担当',
            created_at: new Date().toISOString()
          };
          try {
            const { data: existingById } = await client.from('admin_users').select('id').eq('id', sessionUser.id).maybeSingle();
            if (existingById) {
              await client.from('admin_users').update({
                email: fallbackUser.email,
                role: fallbackUser.role,
                display_name: fallbackUser.display_name
              }).eq('id', sessionUser.id);
            } else {
              await client.from('admin_users').insert([fallbackUser]);
            }
          } catch { }
          setCurrentUser(fallbackUser);
          setRole(fallbackUser.role);
        }
      } catch {
        // オフライン・通信エラーフォールバック
        const fallbackUser: AdminUser = {
          id: sessionUser.id,
          email: sessionUser.email || '',
          role: (sessionUser.user_metadata?.role as 'superadmin' | 'admin') || 'admin',
          display_name: sessionUser.user_metadata?.display_name || sessionUser.email?.split('@')[0] || '実行委員会 担当',
          created_at: new Date().toISOString()
        };
        setCurrentUser(fallbackUser);
        setRole(fallbackUser.role);
      }
    };

    // 1. 初期セッション確認
    client.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await syncUserFromSession(session.user);
      }
    });

    // 2. リアルタイム認証状態変更の監視 (サインイン、トークン更新、ユーザー情報変更、サインアウト対応)
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setRole(null);
        setCurrentUser(null);
      } else if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        if (session.user) {
          await syncUserFromSession(session.user);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 管理画面の自動タイムアウト (30分無操作で自動ログアウト)
  useEffect(() => {
    if (!role) return;

    const TIMEOUT_MS = 30 * 60 * 1000; // 30分
    let lastActivity = Date.now();

    const resetActivity = () => {
      lastActivity = Date.now();
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetActivity));

    const checkInterval = setInterval(async () => {
      if (Date.now() - lastActivity > TIMEOUT_MS) {
        clearInterval(checkInterval);
        activityEvents.forEach((evt) => window.removeEventListener(evt, resetActivity));
        if (supabase) {
          try {
            await supabase.auth.signOut();
          } catch { }
        }
        setRole(null);
        setCurrentUser(null);
        alert('長時間の無操作状態が続いたため、セキュリティ保護のために自動タイムアウト（ログアウト）しました。再度ログインしてください。');
      }
    }, 15000);

    return () => {
      clearInterval(checkInterval);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetActivity));
    };
  }, [role]);

  const handleLoginSuccess = (userOrRole: any) => {
    if (typeof userOrRole === 'object' && userOrRole !== null && userOrRole.role) {
      setCurrentUser(userOrRole as AdminUser);
      setRole((userOrRole as AdminUser).role);
    }
  };

  if (!role) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminDashboard
      organizations={organizations}
      timetableEvents={timetableEvents}
      announcements={announcements}
      lostItems={lostItems}
      role={role}
      currentUser={currentUser}
      onNavigateHome={onNavigateHome}
      onLogout={async () => {
        if (supabase) {
          try {
            await supabase.auth.signOut();
          } catch { }
        }
        setRole(null);
        setCurrentUser(null);
      }}
    />
  );
};
