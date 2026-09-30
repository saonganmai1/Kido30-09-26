import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Sparkles,
  Crown,
  Star,
  Flame,
  Radio,
  AlertOctagon,
  Mail,
  AlertTriangle,
  Target,
  CheckCircle2,
  Info,
  ChevronRight,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { AppNotification } from '../types';
import { audioService } from '../utils/audio';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onMarkAsRead: (id: string) => void;
  onSelectActionTab?: (tab: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onMarkAsRead,
  onSelectActionTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotif, setSelectedNotif] = useState<AppNotification | null>(null);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotifStyle = (type?: string) => {
    switch (type) {
      case 'vip':
        return {
          icon: <Crown size={18} className="text-amber-600 fill-amber-300 animate-bounce" />,
          iconBg: 'bg-gradient-to-br from-amber-100 to-yellow-200 border-amber-300 text-amber-900',
          badgeText: 'VIP Pro 👑',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'stars':
        return {
          icon: <Star size={18} className="text-yellow-600 fill-yellow-400" />,
          iconBg: 'bg-yellow-100 border-yellow-300 text-yellow-800',
          badgeText: 'Thưởng Sao ⭐',
          badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
        };
      case 'streak':
        return {
          icon: <Flame size={18} className="text-rose-600 fill-rose-400 animate-pulse" />,
          iconBg: 'bg-rose-100 border-rose-300 text-rose-800',
          badgeText: 'Chuỗi Lửa 🔥',
          badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
        };
      case 'broadcast':
        return {
          icon: <Radio size={18} className="text-purple-600 animate-pulse" />,
          iconBg: 'bg-purple-100 border-purple-300 text-purple-800',
          badgeText: 'Phát Sóng 📻',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
        };
      case 'error':
        return {
          icon: <AlertOctagon size={18} className="text-red-600 animate-pulse" />,
          iconBg: 'bg-red-100 border-red-300 text-red-800',
          badgeText: 'Cảnh Báo 🚨',
          badgeBg: 'bg-red-100 text-red-900 border-red-300',
        };
      case 'email':
        return {
          icon: <Mail size={18} className="text-indigo-600" />,
          iconBg: 'bg-indigo-100 border-indigo-300 text-indigo-800',
          badgeText: 'Lời Nhắn 💬',
          badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={18} className="text-amber-600 animate-pulse" />,
          iconBg: 'bg-amber-100 border-amber-300 text-amber-800',
          badgeText: 'Lưu Ý ⚠️',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'goal':
        return {
          icon: <Target size={18} className="text-emerald-600" />,
          iconBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
          badgeText: 'Mục Tiêu 🎯',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'success':
        return {
          icon: <CheckCircle2 size={18} className="text-emerald-600" />,
          iconBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
          badgeText: 'Thành Công 🎉',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      default:
        return {
          icon: <Bell size={18} className="text-[#1d50b4]" />,
          iconBg: 'bg-sky-100 border-sky-300 text-[#1d50b4]',
          badgeText: 'Thông Báo 🔔',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
        };
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays === 1) return `Hôm qua, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'Vừa xong';
    }
  };

  const handleItemClick = (notif: AppNotification) => {
    audioService.playClickSound();
    onMarkAsRead(notif.id);
    setSelectedNotif(notif);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn font-sans">
      <div className="bg-white rounded-[28px] border-2 border-sky-400 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-between gap-3 shrink-0 relative">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
              <Bell className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2 truncate">
                <span>Lịch Sử Thông Báo</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                    {unreadCount} mới
                  </span>
                )}
              </h3>
              <p className="text-xs font-medium text-sky-100 truncate">
                Xem lại tất cả thông báo & quà tặng của bé
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playClickSound();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition active:scale-90 cursor-pointer shrink-0"
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Detail Modal View inside center */}
        {selectedNotif ? (
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4 flex flex-col justify-between">
            <div>
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setSelectedNotif(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition mb-4 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Quay lại danh sách</span>
              </button>

              <div className="p-4 sm:p-5 rounded-2xl border-2 border-sky-300 bg-sky-50/50 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      getNotifStyle(selectedNotif.type).badgeBg
                    }`}
                  >
                    {getNotifStyle(selectedNotif.type).badgeText}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatTimeAgo(selectedNotif.createdAt)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-xs ${
                      getNotifStyle(selectedNotif.type).iconBg
                    }`}
                  >
                    {getNotifStyle(selectedNotif.type).icon}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 leading-snug">
                      {selectedNotif.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      Đã nhận: {new Date(selectedNotif.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-sky-200 text-xs sm:text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotif.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {selectedNotif.actionTab && onSelectActionTab && (
                <button
                  onClick={() => {
                    audioService.playClickSound();
                    onSelectActionTab(selectedNotif.actionTab!);
                    onClose();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>Mở trang liên quan</span>
                  <ChevronRight size={16} />
                </button>
              )}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setSelectedNotif(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-extrabold cursor-pointer transition active:scale-95"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Tabs & Quick Actions */}
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap shrink-0">
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setFilter('all');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                    filter === 'all'
                      ? 'bg-sky-500 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Tất cả ({notifications.length})
                </button>
                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setFilter('unread');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                    filter === 'unread'
                      ? 'bg-sky-500 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Chưa đọc</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      audioService.playClickSound();
                      onMarkAllAsRead();
                    }}
                    title="Đánh dấu tất cả là đã đọc"
                    className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition active:scale-95 shadow-2xs"
                  >
                    <CheckCheck size={14} />
                    <span className="hidden sm:inline">Đã đọc tất cả</span>
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử thông báo?')) {
                        audioService.playClickSound();
                        onClearAll();
                      }
                    }}
                    title="Xóa lịch sử thông báo"
                    className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition active:scale-95 shadow-2xs"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Xóa tất cả</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2.5 min-h-[250px]">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-500 border border-sky-200 mx-auto flex items-center justify-center">
                    <Bell size={28} className="opacity-60" />
                  </div>
                  <h4 className="text-sm font-black text-slate-700">Chưa có thông báo nào</h4>
                  <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
                    {filter === 'unread'
                      ? 'Bạn đã đọc hết tất cả thông báo!'
                      : 'Các thông báo thưởng Sao, lên Cấp độ, lời nhắn phụ huynh sẽ tự động xuất hiện tại đây.'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const style = getNotifStyle(notif.type);

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleItemClick(notif)}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer relative flex items-start gap-3 shadow-2xs hover:shadow-md ${
                        !notif.read
                          ? 'bg-sky-50/80 border-sky-300 hover:border-sky-400'
                          : 'bg-white border-slate-200 hover:border-slate-300 opacity-90'
                      }`}
                    >
                      {/* Unread Badge Dot */}
                      {!notif.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-white absolute top-3.5 right-3.5 animate-pulse" />
                      )}

                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBg}`}
                      >
                        {style.icon}
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${style.badgeBg}`}
                          >
                            {style.badgeText}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {formatTimeAgo(notif.createdAt)}
                          </span>
                        </div>

                        <h5
                          className={`text-xs font-black truncate ${
                            !notif.read ? 'text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          {notif.title}
                        </h5>

                        <p className="text-xs font-semibold text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                      </div>

                      <ChevronRight size={16} className="text-slate-300 shrink-0 self-center" />
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] font-bold text-slate-500 shrink-0">
          💡 Tất cả thông báo đều được lưu tự động để bé xem lại bất kỳ lúc nào!
        </div>
      </div>
    </div>
  );
};
