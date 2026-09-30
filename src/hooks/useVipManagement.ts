import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { UserProfile, UserAccount, VipTransaction, VipPromotionConfig } from '../types';
import { audioService } from '../utils/audio';
import { saveAccountToFirebase, getLocalVipTransactions } from '../lib/firebaseSync';

interface UseVipManagementProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  accounts: UserAccount[];
  triggerNotification?: (title: string, message: string, type?: any) => void;
}

export function useVipManagement({
  user,
  setUser,
  accounts,
  triggerNotification
}: UseVipManagementProps) {
  const [vipTransactions, setVipTransactions] = useState<VipTransaction[]>(() => getLocalVipTransactions());
  
  const [vipDowngradeModalData, setVipDowngradeModalData] = useState<{
    isOpen: boolean;
    accountName: string;
    previousExpiry?: string;
    reason: string;
  }>({
    isOpen: false,
    accountName: '',
    previousExpiry: '',
    reason: '',
  });

  const closeVipDowngradeModal = useCallback(() => {
    setVipDowngradeModalData(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Synchronous real-time VIP check for instant UI status
  const isEffectiveVip = useMemo(() => {
    if (!user.isVip) return false;
    if (!user.vipExpiryDate) return true; // Permanent VIP
    const parsed = new Date(user.vipExpiryDate.replace(' ', 'T'));
    return !isNaN(parsed.getTime()) && parsed.getTime() > Date.now();
  }, [user.isVip, user.vipExpiryDate]);

  // Real-time immediate downgrade if VIP expires
  useEffect(() => {
    if (user.isVip && !isEffectiveVip) {
      audioService.playClickSound();
      setUser((prev) => ({
        ...prev,
        isVip: false,
        vipExpiryDate: '',
        trialTimeSeconds: 0,
      }));
      setVipDowngradeModalData({
        isOpen: true,
        accountName: user.name,
        previousExpiry: user.vipExpiryDate,
        reason: 'Thời gian gia hạn VIP đã tự động hết hạn',
      });
      if (triggerNotification) {
        triggerNotification('⚠️ Gói VIP đã hết hạn', 'Tài khoản VIP của bạn đã hết hạn. Đã chuyển về gói Miễn Phí.', 'error');
      }
      const existing = accounts.find((a) => a.id === user.id || (user.username && a.username === user.username));
      if (existing) {
        saveAccountToFirebase({
          ...existing,
          isVip: false,
          vipExpiryDate: '',
          trialTimeSeconds: 0,
        }).catch(() => {});
      }
    }
  }, [user.isVip, isEffectiveVip, user.name, user.vipExpiryDate, user.id, user.username, accounts, setUser, triggerNotification]);

  // High-precision 1-second timer for VIP expiry & trial countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setUser((prev) => {
        // Active VIP User Timer
        if (prev.isVip) {
          if (prev.vipExpiryDate) {
            const parsed = new Date(prev.vipExpiryDate.replace(' ', 'T'));
            if (!isNaN(parsed.getTime())) {
              const remainingSecs = Math.max(0, Math.floor((parsed.getTime() - Date.now()) / 1000));
              if (remainingSecs <= 0) {
                return {
                  ...prev,
                  isVip: false,
                  vipExpiryDate: '',
                  trialTimeSeconds: 0,
                };
              }
              return { ...prev, trialTimeSeconds: remainingSecs };
            }
          }
          return prev;
        }

        // Free Trial User Timer
        if (prev.trialTimeSeconds <= 0) return prev;
        const nextSecs = Math.max(0, prev.trialTimeSeconds - 1);
        return { ...prev, trialTimeSeconds: nextSecs };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setUser]);

  return {
    isEffectiveVip,
    vipTransactions,
    setVipTransactions,
    vipDowngradeModalData,
    setVipDowngradeModalData,
    closeVipDowngradeModal,
  };
}
