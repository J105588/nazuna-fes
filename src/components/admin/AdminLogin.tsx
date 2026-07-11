import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 実行委員会・教職員用の認証チェック (デモ用パスコード「2026admin」または「nazuna」)
    if (passcode === '2026admin' || passcode === 'nazuna') {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-fadeIn">
      <div className="glass-panel p-8 sm:p-10 border border-white/20 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(229,25,55,0.25)]">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E51937]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E51937] to-[#800010] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(229,25,55,0.5)] border border-white/20">
            <Lock className="w-7 h-7 text-[#F5D061]" />
          </div>
          <h2 className="font-serif-title font-bold text-2xl text-white tracking-wider">
            関係者専用 管理ログイン壁
          </h2>
          <p className="text-xs text-[#9AA5B1]">
            実行委員会および教職員以外のアカウントはアクセスを遮断します。認証パスコードを入力してください。
          </p>
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#00D2FF]">
            検証用パスコード: <span className="font-mono font-bold text-white">nazuna</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 block flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#F5D061]" />
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
              className="w-full bg-[#060814]/90 text-white placeholder-white/30 text-sm px-4 py-3.5 rounded-2xl border border-white/15 focus:outline-none focus:border-[#E51937] focus:ring-1 focus:ring-[#E51937] transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#E51937]/20 border border-[#E51937]/40 text-[#FF6B81] text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>認証に失敗しました。正しい管理権限パスコードを入力してください。</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-3.5 text-sm font-bold shadow-[0_0_25px_rgba(229,25,55,0.6)] flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>管理画面へ認証アクセス</span>
          </button>
        </form>
      </div>
    </div>
  );
};
