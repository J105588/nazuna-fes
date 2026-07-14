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
  const [errorMessage, setErrorMessage] = useState(
    '認証に失敗しました。正しいメールアドレスとパスワードを入力してください。'
  );
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
        setErrorMessage(
          'アカウントが見つからないか、パスワードが正しくありません。実行委員会に権限情報をご確認ください。'
        );
      }
    } catch {
      setError(true);
      setErrorMessage(
        'サーバー認証処理中にエラーが発生しました。通信環境およびSupabase設定をお確かめの上、再度お試しください。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-portal min-h-screen bg-[#F8FAFC] text-slate-800 flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
      {/* モダン背景グロー効果 */}
      <div className="absolute top-1/4 left-1/3 -mt-32 -ml-32 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 -mb-32 -mr-32 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 sm:p-10 space-y-8 shadow-xl relative z-10">
        {/* ログインヘッダー */}
        <div className="text-center space-y-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-md">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-black text-2xl text-slate-900 tracking-tight">管理ポータル</h1>
          </div>
        </div>

        {/* メイン認証フォーム */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>メールアドレス</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              placeholder="メールアドレス"
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>パスワード</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="パスワード"
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3 shadow-2xs animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${loading || !email || !password
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
              }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                <span>認証処理中...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>ログイン</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
