import React, { useState } from 'react';
import type { Organization, TimetableEvent, Announcement, LostItem } from '../types/database';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';

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
  const [role, setRole] = useState<'admin' | 'shift' | null>(null);

  if (!role) {
    return <AdminLogin onLoginSuccess={(loggedInRole) => setRole(loggedInRole)} />;
  }

  return (
    <AdminDashboard
      organizations={organizations}
      timetableEvents={timetableEvents}
      announcements={announcements}
      lostItems={lostItems}
      role={role}
      onLogout={() => setRole(null)}
    />
  );
};
