import React from 'react';
import { Bell, X, Sparkles, Mail, AlertTriangle, CheckCircle2, Target, Flame, Crown, Star, AlertOctagon, Radio, Info } from 'lucide-react';
import { ToastMessage } from '../types';

export type { ToastMessage };

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getToastConfig = (type?: string) => {
    switch (type) {
      case 'vip':
        return {
          borderColor: 'border-amber-400',
          bgGlow: 'bg-amber-50/50',
          iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 ring-2 ring-amber-200',
          titleColor: 'text-amber-950',
          badgeText: 'Gói VIP Pro',
          badgeBg: 'bg-amber-200 text-amber-950 font-black',
          icon: <Crown size={18} className="animate-bounce" />,
        };
      case 'stars':
        return {
          borderColor: 'border-yellow-400',
          bgGlow: 'bg-yellow-50/50',
          iconBg: 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300',
          titleColor: 'text-yellow-950',
          badgeText: 'Thưởng Sao ⭐',
          badgeBg: 'bg-yellow-200 text-yellow-900',
          icon: <Star size={18} className="fill-yellow-500 text-yellow-600" />,
        };
      case 'streak':
        return {
          borderColor: 'border-orange-500',
          bgGlow: 'bg-orange-50/50',
          iconBg: 'bg-gradient-to-tr from-orange-500 to-rose-500 text-white ring-2 ring-orange-300',
          titleColor: 'text-orange-950',
          badgeText: 'Chuỗi Lửa 🔥',
          badgeBg: 'bg-orange-100 text-orange-900',
          icon: <Flame size={18} className="animate-pulse" />,
        };
      case 'broadcast':
        return {
          borderColor: 'border-purple-400',
          bgGlow: 'bg-purple-50/50',
          iconBg: 'bg-purple-100 text-purple-700 ring-2 ring-purple-200',
          titleColor: 'text-purple-950',
          badgeText: 'Phát Sóng',
          badgeBg: 'bg-purple-100 text-purple-900',
          icon: <Radio size={18} className="animate-pulse" />,
        };
      case 'error':
        return {
          borderColor: 'border-red-500',
          bgGlow: 'bg-red-50/60',
          iconBg: 'bg-red-100 text-red-700 ring-2 ring-red-300',
          titleColor: 'text-red-950',
          badgeText: 'Lỗi / Cảnh Báo',
          badgeBg: 'bg-red-100 text-red-900',
          icon: <AlertOctagon size={18} className="animate-pulse" />,
        };
      case 'email':
        return {
          borderColor: 'border-indigo-400',
          bgGlow: 'bg-indigo-50/40',
          iconBg: 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200',
          titleColor: 'text-indigo-900',
          badgeText: 'Email Phụ Huynh',
          badgeBg: 'bg-indigo-100 text-indigo-800',
          icon: <Mail size={18} className="animate-bounce" />,
        };
      case 'warning':
        return {
          borderColor: 'border-rose-400',
          bgGlow: 'bg-rose-50/40',
          iconBg: 'bg-rose-100 text-rose-700 ring-2 ring-rose-200',
          titleColor: 'text-rose-900',
          badgeText: 'Cảnh Báo',
          badgeBg: 'bg-rose-100 text-rose-800',
          icon: <AlertTriangle size={18} className="animate-pulse" />,
        };
      case 'goal':
        return {
          borderColor: 'border-amber-400',
          bgGlow: 'bg-amber-50/40',
          iconBg: 'bg-amber-100 text-amber-700 ring-2 ring-amber-200',
          titleColor: 'text-amber-950',
          badgeText: 'Tiến Độ Học',
          badgeBg: 'bg-amber-100 text-amber-800',
          icon: <Target size={18} />,
        };
      case 'success':
        return {
          borderColor: 'border-emerald-400',
          bgGlow: 'bg-emerald-50/40',
          iconBg: 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200',
          titleColor: 'text-emerald-950',
          badgeText: 'Thành Tựu',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          icon: <CheckCircle2 size={18} />,
        };
      case 'urgent':
        return {
          borderColor: 'border-orange-400',
          bgGlow: 'bg-orange-50/40',
          iconBg: 'bg-orange-100 text-orange-700 ring-2 ring-orange-200',
          titleColor: 'text-orange-950',
          badgeText: 'Khẩn Cấp',
          badgeBg: 'bg-orange-100 text-orange-800',
          icon: <Flame size={18} />,
        };
      case 'info':
        return {
          borderColor: 'border-blue-400',
          bgGlow: 'bg-blue-50/40',
          iconBg: 'bg-blue-100 text-blue-700 ring-2 ring-blue-200',
          titleColor: 'text-blue-950',
          badgeText: 'Thông Tin',
          badgeBg: 'bg-blue-100 text-blue-800',
          icon: <Info size={18} />,
        };
      case 'account_status':
      case 'account':
      case 'status':
        return {
          borderColor: 'border-cyan-400',
          bgGlow: 'bg-cyan-50/50',
          iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white ring-2 ring-cyan-200 shadow-xs',
          titleColor: 'text-cyan-950',
          badgeText: 'Cập Nhật Tài Khoản',
          badgeBg: 'bg-cyan-100 text-cyan-900 font-extrabold',
          icon: <CheckCircle2 size={18} className="animate-bounce" />,
        };
      default:
        return {
          borderColor: 'border-sky-300',
          bgGlow: 'bg-white',
          iconBg: 'bg-sky-100 text-[#1d50b4]',
          titleColor: 'text-[#1d50b4]',
          badgeText: 'Thông Báo',
          badgeBg: 'bg-sky-100 text-sky-800',
          icon: <Bell size={18} />,
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2.5 max-w-sm sm:max-w-md w-full select-none font-sans pointer-events-auto">
      {toasts.map((toast) => {
        const config = getToastConfig(toast.type);

        return (
          <div
            key={toast.id}
            className={`bg-white/95 backdrop-blur-md rounded-2xl p-4 border-2 ${config.borderColor} ${config.bgGlow} shadow-2xl flex items-start gap-3.5 transition-all duration-300 animate-expandDown hover:-translate-y-1 hover:shadow-indigo-500/10 text-slate-800`}
          >
            <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
              {config.icon}
            </div>

            <div className="flex-1 pr-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase ${config.badgeBg}`}>
                  {config.badgeText}
                </span>
                <h4 className={`text-xs font-black flex items-center gap-1 ${config.titleColor} truncate`}>
                  <span>{toast.title}</span>
                  <Sparkles size={12} className="text-amber-500 fill-amber-400 shrink-0" />
                </h4>
              </div>

              <p className="text-xs font-semibold text-slate-700 mt-1 leading-snug break-words">
                {toast.message}
              </p>

              {toast.actionLabel && toast.onAction && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      toast.onAction?.();
                      onDismiss(toast.id);
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-extrabold shadow-xs transition cursor-pointer"
                  >
                    {toast.actionLabel}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
              title="Đóng thông báo"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};


