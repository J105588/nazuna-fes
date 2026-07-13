import React, { useState } from 'react';
import { ShieldAlert, KeyRound, AlertCircle, Mail, ShieldCheck } from 'lucide-react';
import { verifyAdminCredentials } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: (userOrRole: any) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('認証に失敗しました。正しいメールアドレスとパスワードを入力してください。');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      const user = await verifyAdminCredentials(email, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError(true);
        setErrorMessage('アカウントが見つからないか、パスワードが正しくありません。実行委員会に権限情報をご確認ください。');
      }
    } catch (err) {
      setError(true);
      setErrorMessage('サーバー認証処理中にエラーが発生しました。通信環境およびSupabase設定をお確かめの上、再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-8 space-y-8 shadow-2xl">
        {/* ログインヘッダー */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white tracking-tight">
              統合管理ポータル ログイン
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              なずな祭 2026 管理システム
            </p>
          </div>
        </div>

        {/* メイン認証フォーム */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>メールアドレス</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              placeholder="admin@nazuna.jp"
              className="w-full bg-slate-950 text-white placeholder-slate-600 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>パスワード</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 text-white placeholder-slate-600 text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              required
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              loading || !email || !password
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'ログイン処理中...' : '管理画面へログイン'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            アカウントの発行や権限の変更は統括管理者までお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
};
