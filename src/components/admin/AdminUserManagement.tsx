import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, Shield, Trash2, Mail, RefreshCw, Edit3 } from 'lucide-react';
import type { AdminUser, AdminRole } from '../../types/database';
import {
  fetchAdminUsersFromDB,
  createAdminUserInDB,
  updateAdminUserRoleInDB,
  updateAdminUserInfoInDB,
  deleteAdminUserInDB
} from '../../lib/supabase';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminToast } from './AdminToast';

export interface AdminUserManagementProps {
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

  // トースト通知
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // インライン編集状態
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ display_name: string; email: string; role: AdminRole }>({
    display_name: '',
    email: '',
    role: 'admin'
  });

  // 確認モーダル状態
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminUsersFromDB();
      setUsers(data);
    } finally {
      setLoading(false);
    }
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
      showToast('新しい管理者アカウントを作成しました。', 'success');
      await loadUsers();
    } catch (err: any) {
      showToast(err instanceof Error ? err.message : (err?.message || 'アカウント登録に失敗しました。'), 'error');
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
    try {
      await updateAdminUserInfoInDB(id, editForm);
      setEditingUserId(null);
      showToast('管理者情報を更新しました。', 'success');
      await loadUsers();
    } catch {
      showToast('更新中にエラーが発生しました。', 'error');
    }
  };

  const handleRoleChange = async (id: string, role: AdminRole) => {
    try {
      await updateAdminUserRoleInDB(id, role);
      showToast(`権限を「${role === 'superadmin' ? 'Superadmin' : 'Admin'}」に変更しました。`, 'info');
      await loadUsers();
    } catch {
      showToast('権限変更に失敗しました。', 'error');
    }
  };

  const handleDeleteUserClick = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: '管理者アカウントの削除確認',
      message: `「${name}」の管理者アカウントを完全に削除しますか？\n削除すると、このユーザーは管理画面にアクセスできなくなります。`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteAdminUserInDB(id);
          showToast(`アカウント「${name}」を削除しました。`, 'success');
          await loadUsers();
        } catch {
          showToast('削除中にエラーが発生しました。', 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-8 select-none animate-in fade-in duration-300">
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant="danger"
        confirmLabel="アカウントを削除する"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <AdminToast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      {/* 新規ユーザー登録フォーム (Superadminのみ表示・実行可能) */}
      {currentUser?.role === 'superadmin' ? (
        <form
          onSubmit={handleCreateUser}
          className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-md"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>新規管理者アカウントの追加 (Superadmin専用)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                どんなメールアドレスでもSupabase Authおよびadmin_usersに新規アカウントとして登録・連携可能です。
              </p>
            </div>
            <button
              type="button"
              onClick={loadUsers}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all text-xs flex items-center gap-1.5 border border-slate-200 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>リスト同期</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">メールアドレス (必須)</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@nazuna.jp"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">担当者・所属名 (必須)</label>
              <input
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="例: 実行委員会 本部・山田"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">初期パスワード (任意)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">権限レベル</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="admin">通常 (Admin)</option>
                <option value="superadmin">統括管理 (Superadmin)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !newEmail || !newDisplayName}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-90 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? '登録処理中...' : 'アカウントを作成して追加'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-900">新規アカウント追加制限</h3>
              <p className="text-xs text-amber-800 mt-0.5">
                新規アカウントの追加・登録は Superadmin（統括管理者）権限を持つユーザーのみ実行できます。
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 transition-all text-xs flex items-center gap-1.5 border border-amber-300 shadow-xs shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>リスト同期</span>
          </button>
        </div>
      )}

      {/* 登録済み管理者一覧 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>登録済み管理者一覧 ({users.length}名)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Superadmin は自分の権限を変更できません。
          </span>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs font-mono shadow-sm">
            アカウント一覧を読み込み中...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => {
              const isEditing = editingUserId === u.id;
              const isCurrent = currentUser?.email === u.email || currentUser?.id === u.id;
              const isSuper = u.role === 'superadmin';

              if (isEditing) {
                return (
                  <div
                    key={u.id}
                    className="bg-white border border-indigo-500 rounded-2xl p-5 space-y-4 shadow-md animate-in zoom-in-95 duration-200"
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-700">メールアドレス</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-700">担当者名</label>
                        <input
                          type="text"
                          value={editForm.display_name}
                          onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-700">権限</label>
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as AdminRole })}
                          disabled={isCurrent && isSuper}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
                        >
                          <option value="admin">通常 (Admin)</option>
                          <option value="superadmin">統括管理 (Superadmin)</option>
                        </select>
                        {isCurrent && isSuper && (
                          <span className="text-[10px] text-rose-600 block mt-0.5">※自身の Superadmin 権限は変更できません</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingUserId(null)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all border border-slate-200"
                      >
                        キャンセル
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(u.id)}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md"
                      >
                        保存する
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={u.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-indigo-400 hover:shadow-md group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs shadow-xs ${isSuper
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                    >
                      {isSuper ? <Shield className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {u.display_name}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                            現在ログイン中
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${isSuper
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                        >
                          {isSuper ? 'SUPERADMIN' : 'ADMIN'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleStartEdit(u)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
                      title="編集"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                      disabled={(isCurrent && isSuper) || currentUser?.role !== 'superadmin'}
                      title={isCurrent && isSuper ? "自身のSuperadmin権限は変更できません" : "権限変更"}
                      className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>

                    <button
                      onClick={() => handleDeleteUserClick(u.id, u.display_name)}
                      disabled={isCurrent || currentUser?.role !== 'superadmin'}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 disabled:opacity-30 text-slate-500 hover:text-red-600 transition-all border border-slate-200 disabled:cursor-not-allowed"
                      title={isCurrent ? "自身のアカウントは削除できません" : "削除"}
                    >
                      <Trash2 className="w-4 h-4" />
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
