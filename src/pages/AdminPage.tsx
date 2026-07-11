import React, { useState } from 'react';
import type { Organization, TimetableEvent } from '../types/database';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';

interface AdminPageProps {
  organizations: Organization[];
  timetableEvents: TimetableEvent[];
}

export const AdminPage: React.FC<AdminPageProps> = ({ organizations, timetableEvents }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <AdminDashboard
      organizations={organizations}
      timetableEvents={timetableEvents}
      onLogout={() => setIsAuthenticated(false)}
    />
  );
};
