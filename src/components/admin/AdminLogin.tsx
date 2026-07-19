import React, { useState } from 'react';
import { KeyRound, AlertCircle, Mail, ShieldCheck } from 'lucide-react';
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
    <div className="admin-portal min-h-screen bg-[#FAF8F5] text-[#2C3E55] flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
      {/* 和風背景グロー */}
      <div className="absolute top-1/4 left-1/3 -mt-32 -ml-32 w-96 h-96 bg-[#E2E8F0] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 -mb-32 -mr-32 w-96 h-96 bg-[#D14B41]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-md w-full p-8 sm:p-10 space-y-8 shadow-lg relative z-10">
        {/* ログインヘッダー */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2C3E55] flex items-center justify-center mx-auto text-white shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-black text-2xl text-[#2C3E55] tracking-tight">管理ポータル</h1>
            <p className="text-sm text-[#708090] mt-1">Nazuna Fes 2026</p>
          </div>
        </div>

        {/* メイン認証フォーム */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#4A5568] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D14B41]" />
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
              className="w-full bg-[#FAF8F5] text-[#2C3E55] placeholder-[#94A3B8] text-sm px-4 py-3.5 rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#607D8B] focus:ring-1 focus:ring-[#90A4AE] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#4A5568] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#D14B41]" />
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
              className="w-full bg-[#FAF8F5] text-[#2C3E55] placeholder-[#94A3B8] text-sm px-4 py-3.5 rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#607D8B] focus:ring-1 focus:ring-[#90A4AE] transition-all"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-[#D14B41]/5 border border-[#D14B41]/20 text-[#D14B41] text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${loading || !email || !password
              ? 'bg-[#E2E8F0] text-[#2C3E55]/30 cursor-not-allowed border border-[#2C3E55]/5'
              : 'bg-[#2C3E55] hover:bg-[#D14B41] text-white'
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
