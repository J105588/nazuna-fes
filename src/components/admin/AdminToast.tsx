import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface AdminToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const AdminToast: React.FC<AdminToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3500
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-950/90 border-red-500/40 text-red-200',
          icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        };
      case 'info':
        return {
          bg: 'bg-blue-950/90 border-[#607D8B]/40 text-blue-200',
          icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />
        };
      case 'success':
      default:
        return {
          bg: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 duration-300 max-w-sm w-full select-none">
      <div className={`flex items-center gap-3 w-full ${styles.bg}`}>
        {styles.icon}
        <span className="text-xs font-medium flex-1 leading-relaxed">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
