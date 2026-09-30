import { useState, useEffect, useMemo, useCallback } from 'react';
import { ToastMessage, ToastType, AppNotification, SystemBroadcastNotification, UserProfile, UserAccount } from '../types';

interface UseNotificationSystemProps {
  user: UserProfile;
  systemBroadcasts?: SystemBroadcastNotification[];
  accounts?: UserAccount[];
}

export function useNotificationSystem({
  user,
  systemBroadcasts,
  accounts = []
}: UseNotificationSystemProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notificationsEnabled] = useState<boolean>(true);

  // Load persistent notification history for current logged in account
  const [notificationsHistory, setNotificationsHistory] = useState<AppNotification[]>(() => {
    try {
      const keysToTry = [
        `KIDO_NOTIFICATIONS_V1_${user.id}`,
        `KIDO_NOTIFICATIONS_V1_${user.username}`,
      ];
      if (user.role === 'kid') keysToTry.push(`KIDO_NOTIFICATIONS_V1_user-kid`);

      for (const k of keysToTry) {
        if (!k) continue;
        const saved = localStorage.getItem(k);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading notifications history:', e);
    }
    return [
      {
        id: `notif-init-${Date.now()}`,
        title: '🎉 Đăng nhập thành công',
        message: `Chào mừng ${user.name} đến với DinoEnglish! Hãy cùng học tập và tích lũy Sao nhé!`,
        type: 'success',
        createdAt: new Date().toISOString(),
        read: false,
        targetUserId: user.id || user.username || 'default',
      },
    ];
  });

  // Reload notification history on user account switch
  useEffect(() => {
    try {
      const keysToTry = [
        `KIDO_NOTIFICATIONS_V1_${user.id}`,
        `KIDO_NOTIFICATIONS_V1_${user.username}`,
      ];
      if (user.role === 'kid') keysToTry.push(`KIDO_NOTIFICATIONS_V1_user-kid`);

      let loaded: AppNotification[] | null = null;
      for (const k of keysToTry) {
        if (!k) continue;
        const saved = localStorage.getItem(k);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loaded = parsed;
              break;
            }
          } catch (e) {}
        }
      }

      if (loaded) {
        setNotificationsHistory(loaded);
      } else {
        setNotificationsHistory([
          {
            id: `notif-init-${Date.now()}`,
            title: '🎉 Đăng nhập thành công',
            message: `Chào mừng ${user.name} đến với DinoEnglish!`,
            type: 'success',
            createdAt: new Date().toISOString(),
            read: false,
            targetUserId: user.id || user.username || 'default',
          },
        ]);
      }
    } catch (e) {
      console.error('Error reloading notifications:', e);
    }
  }, [user.id, user.username, user.name, user.role]);

  // Save notification history to localStorage
  useEffect(() => {
    try {
      if (user.id) {
        localStorage.setItem(`KIDO_NOTIFICATIONS_V1_${user.id}`, JSON.stringify(notificationsHistory));
      }
      if (user.username) {
        localStorage.setItem(`KIDO_NOTIFICATIONS_V1_${user.username}`, JSON.stringify(notificationsHistory));
      }
      if (user.role === 'kid') {
        localStorage.setItem(`KIDO_NOTIFICATIONS_V1_user-kid`, JSON.stringify(notificationsHistory));
      }
    } catch (e) {
      console.error('Error saving notifications history:', e);
    }
  }, [notificationsHistory, user.id, user.username, user.role]);

  // Sync real-time system broadcasts into notification history
  useEffect(() => {
    if (!systemBroadcasts || systemBroadcasts.length === 0) return;

    setNotificationsHistory((prev) => {
      let updated = [...prev];
      let hasChanges = false;

      systemBroadcasts.forEach((broadcast) => {
        if (!broadcast.isActive) return;

        const targetAudienceStr = String(broadcast.targetAudience || 'all');
        const isTargetMatch =
          targetAudienceStr === 'all' ||
          targetAudienceStr === 'all_accounts' ||
          targetAudienceStr === 'all_students' ||
          targetAudienceStr === 'online_students' ||
          broadcast.targetAccountId === user.id ||
          broadcast.targetAccountId === user.username;

        if (!isTargetMatch) return;

        const broadcastNotifId = `broadcast-${broadcast.id}`;
        const alreadyExists = updated.some(
          (n) => n.id === broadcastNotifId || (n.title === broadcast.title && n.message === broadcast.message)
        );

        if (!alreadyExists) {
          hasChanges = true;
          const notifItem: AppNotification = {
            id: broadcastNotifId,
            title: broadcast.title,
            message: broadcast.message,
            type: (broadcast.toastType as any) || (broadcast.priority === 'urgent' ? 'error' : 'broadcast'),
            createdAt: broadcast.timestamp || (broadcast.timestampMs ? new Date(broadcast.timestampMs).toISOString() : new Date().toISOString()),
            read: false,
            userId: user.id || user.username || 'default',
            targetUserId: user.id || user.username || 'default',
            actionTab: broadcast.actionTab,
          };
          updated = [notifItem, ...updated];
        }
      });

      return hasChanges ? updated.slice(0, 100) : prev;
    });
  }, [systemBroadcasts, user.id, user.username, user.role]);

  // Filter notifications for current target user
  const userFilteredNotifications = useMemo(() => {
    return notificationsHistory.filter((n) => {
      const target = n.targetUserId || n.userId;
      if (target) {
        if (target === 'all') return true;
        const matchesUser =
          target === user.id ||
          target === user.username ||
          (user.role === 'kid' && (target === 'user-kid' || target === 'kid')) ||
          (user.role === 'admin' && (target === 'admin' || target === 'user-admin'));
        if (matchesUser) return true;
        return false;
      }

      if (user.role === 'admin') {
        const msg = (n.title + ' ' + n.message).toLowerCase();
        if (
          msg.includes('cao quốc minh') ||
          (msg.includes('tài khoản ') && !msg.includes(`tài khoản ${user.name.toLowerCase()}`))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [notificationsHistory, user.id, user.username, user.name, user.role]);

  const unreadNotifCount = useMemo(() => {
    return userFilteredNotifications.filter((n) => !n.read).length;
  }, [userFilteredNotifications]);

  // Dispatch notification (transient toast + persistent bell history)
  const triggerNotification = useCallback((
    title: string,
    message: string,
    type?: ToastType,
    actionTab?: string,
    targetAccountId?: string
  ) => {
    if (!notificationsEnabled) return;

    const targetId = targetAccountId || user.id || user.username || 'default';
    const notifItem: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      message,
      type: type || 'default',
      createdAt: new Date().toISOString(),
      read: false,
      userId: targetId,
      targetUserId: targetId,
      actionTab,
    };

    const currentUserId = user.id || user.username || 'default';
    const isTargetingCurrent =
      !targetAccountId ||
      targetAccountId === currentUserId ||
      targetAccountId === user.id ||
      targetAccountId === user.username ||
      targetAccountId === 'all';

    if (isTargetingCurrent) {
      setToasts((prev) => {
        if (prev.some((t) => t.title === title && t.message === message)) {
          return prev;
        }
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newToast: ToastMessage = { id, title, message, type: type || 'default' };
        setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
        }, 5000);
        return [newToast, ...prev];
      });

      setNotificationsHistory((prev) => {
        const isDup = prev.some(
          (n) => n.title === title && n.message === message && Date.now() - new Date(n.createdAt).getTime() < 2500
        );
        if (isDup) return prev;
        return [notifItem, ...prev].slice(0, 100);
      });
    } else {
      try {
        const targetKeys = [`KIDO_NOTIFICATIONS_V1_${targetAccountId}`];
        const matchedAcc = accounts.find((a) => a.id === targetAccountId || a.username === targetAccountId);
        if (matchedAcc) {
          if (matchedAcc.id) targetKeys.push(`KIDO_NOTIFICATIONS_V1_${matchedAcc.id}`);
          if (matchedAcc.username) targetKeys.push(`KIDO_NOTIFICATIONS_V1_${matchedAcc.username}`);
          if (matchedAcc.role === 'kid') targetKeys.push(`KIDO_NOTIFICATIONS_V1_user-kid`);
        }

        const uniqueKeys = Array.from(new Set(targetKeys));
        uniqueKeys.forEach((key) => {
          let existing: AppNotification[] = [];
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              existing = JSON.parse(saved);
            } catch (e) {}
          }
          const isDup = existing.some(
            (n) => n.title === title && n.message === message && Date.now() - new Date(n.createdAt).getTime() < 2500
          );
          if (!isDup) {
            const updated = [notifItem, ...existing].slice(0, 100);
            localStorage.setItem(key, JSON.stringify(updated));
          }
        });
      } catch (e) {
        console.error('Error saving target notification to localStorage:', e);
      }
    }
  }, [notificationsEnabled, user.id, user.username, accounts]);

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotificationsHistory((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleClearAllNotifications = useCallback(() => {
    setNotificationsHistory([]);
  }, []);

  const handleMarkNotificationRead = useCallback((id: string) => {
    setNotificationsHistory((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  return {
    toasts,
    userFilteredNotifications,
    unreadNotifCount,
    triggerNotification,
    handleDismissToast,
    handleMarkAllNotificationsRead,
    handleClearAllNotifications,
    handleMarkNotificationRead,
  };
}
