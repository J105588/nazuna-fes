import React from 'react';
import { AlertTriangle, ShieldAlert, Info, X } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = '実行する',
  cancelLabel = 'キャンセル',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-500/15 border-red-500/30 text-red-400',
          confirmBtn: 'bg-red-600 hover:bg-red-500 text-white shadow-md',
          icon: <ShieldAlert className="w-6 h-6" />
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          confirmBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-md',
          icon: <AlertTriangle className="w-6 h-6" />
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
          confirmBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md',
          icon: <Info className="w-6 h-6" />
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-slate-900/95 border border-slate-700/80 text-white rounded-3xl p-6 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${styles.iconBg}`}>
              {styles.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">確認が必要な操作です</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-sm text-slate-200 leading-relaxed">
          {message}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-700/80">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all border border-slate-700 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${styles.confirmBtn}`}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                <span>処理中...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
