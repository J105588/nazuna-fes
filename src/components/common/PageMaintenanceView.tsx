import React from 'react';
import { Lock, Compass, Settings, Sparkles, ShieldAlert, Clock } from 'lucide-react';

interface PageMaintenanceViewProps {
  pageTitle?: string;
  customMessage?: string;
  onNavigateHome: () => void;
  onNavigateAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const PageMaintenanceView: React.FC<PageMaintenanceViewProps> = ({
  pageTitle = '該当ページ',
  customMessage = '現在メンテナンス中です。しばらくお待ちください。',
  onNavigateHome,
  onNavigateAdmin,
  isAdminLoggedIn = false
}) => {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-16 animate-fade-in relative overflow-hidden bg-gradient-to-b from-wafuu-kinari via-[#FAF6F0] to-wafuu-kinari">
      {/* 背景の優雅な和紙・霞模様演出 */}
      <div className="absolute inset-0 bg-opacity-40 pointer-events-none mix-blend-multiply opacity-30" />
      
      {/* 和の霞を表現する淡いぼかしサークル */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-wafuu-shu/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-wafuu-ai/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full mx-auto relative z-10">
        {/* 白鷺城の漆喰白壁を想起させる高級感あるメインカード */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-wafuu-ekasumi shadow-[0_15px_45px_rgba(44,62,85,0.08)] relative overflow-hidden text-center">
          
          {/* 上部の極細 和風トリコロールアクセントライン */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wafuu-shu via-[#D4AF37] to-wafuu-ai opacity-90" />

          {/* アイコンオーブ */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#FAF6F0] to-[#F3ECE0] border border-wafuu-ekasumi/80 flex items-center justify-center text-wafuu-shu shadow-sm mb-6 relative group">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-wafuu-shu transition-transform group-hover:scale-105" />
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white shadow-2xs border border-wafuu-ekasumi flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
          </div>

          {/* タイトルとステータスバッジ */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold font-mono tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>COMING SOON / PREPARING</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2C3E55] tracking-wide leading-tight mt-2">
              {pageTitle} は<br className="sm:hidden" />ただいま準備中です
            </h1>
            <p className="text-xs sm:text-sm font-mono text-wafuu-kincha tracking-widest uppercase">
              Nazuna Fes 2026 Portal
            </p>
          </div>

          {/* カスタムメッセージボックス */}
          <div className="bg-[#FAF6F0]/80 border border-wafuu-ekasumi rounded-2xl p-5 mb-8 text-left relative">
            <p className="text-xs sm:text-sm text-[#2C3E55] leading-relaxed font-sans text-center whitespace-pre-wrap">
              {customMessage}
            </p>
          </div>

          {/* ホームへ戻るメインアクションボタン */}
          <div className="flex justify-center">
            <button
              onClick={onNavigateHome}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-wafuu-shu to-[#C23B31] text-white font-bold text-sm shadow-[0_6px_20px_rgba(209,75,65,0.25)] hover:shadow-[0_8px_25px_rgba(209,75,65,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>トップページに戻る</span>
            </button>
          </div>

          {/* 管理者ログイン中の場合のお知らせカード */}
          {isAdminLoggedIn && onNavigateAdmin && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 text-left">
              <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-200/80 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-blue-900 mb-1">
                    管理者向けご案内
                  </p>
                  <p className="text-[11px] text-blue-800 leading-normal mb-2.5">
                    このページは現在、一般ユーザーに対して非公開設定（メニュー非表示および直接アクセス制限）となっています。管理画面からいつでも公開設定や準備中メッセージを変更可能です。
                  </p>
                  <button
                    onClick={onNavigateAdmin}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 underline transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>管理ポータルでページ公開設定を開く</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
