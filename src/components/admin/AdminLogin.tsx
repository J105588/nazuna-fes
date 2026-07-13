import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (role: 'admin' | 'shift') => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 実行委員会・教職員用マスターパスコード「2026admin」「nazuna」またはシフト担当用パスコード「shift2026」
    if (passcode === '2026admin' || passcode === 'nazuna') {
      onLoginSuccess('admin');
    } else if (passcode === 'shift2026' || passcode === 'shift') {
      onLoginSuccess('shift');
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 animate-fade-in font-sans px-4 select-none">
      <div className="wafuu-panel p-8 sm:p-10 rounded-3xl border border-wafuu-sumi/10 space-y-7 relative overflow-hidden shadow-md bg-white">
        {/* 上部朱色アクセント */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-wafuu-shu to-transparent" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-wafuu-shu/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wafuu-shu via-wafuu-shu-dark to-[#8B1A1E] flex items-center justify-center mx-auto shadow-sm border border-wafuu-ekasumi/40">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-wafuu-shu font-bold block">
              SECURE ADMIN PORTAL
            </span>
            <h2 className="font-bold text-2xl sm:text-3xl text-wafuu-sumi tracking-wider font-serif">
              関係者専用 管理ログイン壁
            </h2>
          </div>
          <p className="text-xs text-wafuu-text-sub leading-relaxed bg-wafuu-kinari p-4 rounded-xl border border-wafuu-sumi/10">
            本管理画面は、なずな祭実行委員会・教職員および当日シフト（在庫更新担当・広報部）専用システムです。関係者以外のアカウントはアクセスを完全に遮断します。
          </p>
          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-wafuu-kinari/80 border border-wafuu-sumi/10 text-left text-xs text-wafuu-text-sumi font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-wafuu-kincha shrink-0" />
              <span>実行委員会・教職員用: <strong className="font-mono text-wafuu-shu ml-1 font-bold">nazuna</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-wafuu-ai shrink-0" />
              <span>当日シフト・在庫担当用: <strong className="font-mono text-wafuu-ai ml-1 font-bold">shift2026</strong></span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-wafuu-sumi tracking-wider block flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-wafuu-shu" />
              <span>認証パスワード / トークン</span>
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              className="w-full bg-wafuu-kinari text-wafuu-sumi placeholder-wafuu-text-muted text-sm px-4 py-4 rounded-2xl border border-wafuu-sumi/10 focus:outline-none focus:border-wafuu-shu focus:ring-2 focus:ring-wafuu-shu/20 transition-all font-mono font-semibold shadow-inner"
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-wafuu-shu/10 border border-wafuu-shu text-wafuu-shu text-xs flex items-center gap-2.5 animate-shake shadow-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0 text-wafuu-shu" />
              <span>認証に失敗しました。関係者専用の正しい管理パスコードを入力してください。</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-bold btn-wafuu-shu text-sm sm:text-base flex items-center justify-center gap-3 shadow-md hover:scale-[1.02] transition-all font-serif"
          >
            <ShieldCheck className="w-5 h-5 text-white" />
            <span>管理画面へ認証アクセス</span>
          </button>
        </form>
      </div>
    </div>
  );
};
