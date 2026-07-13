import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, Shield, Trash2, Mail, CheckCircle2, RefreshCw, Edit3, X } from 'lucide-react';
import type { AdminUser, AdminRole } from '../../types/database';
import { fetchAdminUsersFromDB, createAdminUserInDB, updateAdminUserRoleInDB, updateAdminUserInfoInDB, deleteAdminUserInDB } from '../../lib/supabase';

interface AdminUserManagementProps {
  currentUser?: AdminUser | null;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // インライン編集状態
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ display_name: string; email: string; role: AdminRole }>({
    display_name: '',
    email: '',
    role: 'admin'
  });

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchAdminUsersFromDB();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newDisplayName) return;

    setIsSubmitting(true);
    try {
      await createAdminUserInDB({
        email: newEmail,
        role: newRole,
        display_name: newDisplayName,
        password: newPassword || undefined
      });
      setNewEmail('');
      setNewDisplayName('');
      setNewPassword('');
      setNewRole('admin');
      setNotification('新しい管理者アカウントを作成しました。');
      setTimeout(() => setNotification(null), 4000);
      await loadUsers();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (u: AdminUser) => {
    setEditingUserId(u.id);
    setEditForm({
      display_name: u.display_name,
      email: u.email,
      role: u.role
    });
  };

  const handleSaveEdit = async (id: string) => {
    await updateAdminUserInfoInDB(id, editForm);
    setEditingUserId(null);
    setNotification('管理者情報を更新しました。');
    setTimeout(() => setNotification(null), 4000);
    await loadUsers();
  };

  const handleRoleChange = async (id: string, role: AdminRole) => {
    await updateAdminUserRoleInDB(id, role);
    setNotification(`ユーザーの権限を「${role === 'superadmin' ? '統括管理 (Superadmin)' : '業務担当 (Admin)'}」に変更しました。`);
    setTimeout(() => setNotification(null), 4000);
    await loadUsers();
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`「${name}」のアカウントを削除しますか？`)) {
      await deleteAdminUserInDB(id);
      setNotification(`アカウント「${name}」を削除しました。`);
      setTimeout(() => setNotification(null), 4000);
      await loadUsers();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {notification && (
        <div className="p-3.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-blue-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 新規ユーザー登録フォーム */}
      <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-500" />
            <span>新規管理者アカウント登録</span>
          </h3>
          <button
            type="button"
            onClick={loadUsers}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>リスト同期</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">メールアドレス (必須)</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@nazuna.jp"
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm font-mono"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">担当者・所属名 (必須)</label>
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="実行委員会 山田"
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">初期パスワード (任意)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">権限レベル</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as AdminRole)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
            >
              <option value="admin">業務担当 (Admin)</option>
              <option value="superadmin">統括管理 (Superadmin)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !newEmail || !newDisplayName}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isSubmitting ? '登録処理中...' : 'アカウントを作成して登録'}</span>
        </button>
      </form>

      {/* 登録済み管理者一覧 */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-500" />
          <span>登録済み管理者 ({users.length}名)</span>
        </h3>

        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            読み込み中...
          </div>
        ) : (
          <div className="space-y-2.5">
            {users.map((u) => {
              const isEditing = editingUserId === u.id;
              const isCurrent = currentUser?.email === u.email || currentUser?.id === u.id;
              const isSuper = u.role === 'superadmin';

              if (isEditing) {
                return (
                  <div key={u.id} className="bg-slate-900 border border-blue-500/50 rounded-2xl p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">メールアドレス</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">担当者名</label>
                        <input
                          type="text"
                          value={editForm.display_name}
                          onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">権限</label>
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as AdminRole })}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs"
                        >
                          <option value="admin">業務担当 (Admin)</option>
                          <option value="superadmin">統括管理 (Superadmin)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-medium"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={() => handleSaveEdit(u.id)}
                        className="px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      isSuper ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {isSuper ? <Shield className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white truncate">{u.display_name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-600 text-white">ログイン中</span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          isSuper ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {isSuper ? 'Superadmin' : 'Admin'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleStartEdit(u)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                      title="編集"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                      className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>

                    <button
                      onClick={() => handleDeleteUser(u.id, u.display_name)}
                      disabled={isCurrent}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-all"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
