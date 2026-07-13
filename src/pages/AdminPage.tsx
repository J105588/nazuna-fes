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
}

export const AdminPage: React.FC<AdminPageProps> = ({
  organizations,
  timetableEvents,
  announcements,
  lostItems
}) => {
  const [role, setRole] = useState<'superadmin' | 'admin' | string | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    // 初期セッション確認
    client.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const { data: userData } = await client
            .from('admin_users')
            .select('*')
            .eq('email', session.user.email)
            .single();
          if (userData) {
            setCurrentUser(userData as AdminUser);
            setRole(userData.role);
          } else {
            const fallbackUser: AdminUser = {
              id: session.user.id,
              email: session.user.email || '',
              role: (session.user.user_metadata?.role as 'superadmin' | 'admin') || 'admin',
              display_name: session.user.user_metadata?.display_name || '実行委員会 担当',
              created_at: new Date().toISOString()
            };
            setCurrentUser(fallbackUser);
            setRole(fallbackUser.role);
          }
        } catch {}
      }
    });

    // 認証状態の監視
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setRole(null);
        setCurrentUser(null);
      } else if (event === 'SIGNED_IN' && session.user && !currentUser) {
        const { data: userData } = await client
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .single();
        if (userData) {
          setCurrentUser(userData as AdminUser);
          setRole(userData.role);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      onLogout={async () => {
        if (supabase) {
          try {
            await supabase.auth.signOut();
          } catch {}
        }
        setRole(null);
        setCurrentUser(null);
      }}
    />
  );
};
