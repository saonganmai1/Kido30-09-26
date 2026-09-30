import { useState, useEffect, useCallback } from 'react';
import { UserAccount, UserProfile, UserRole } from '../types';
import { sampleAccounts } from '../data/mockData';
import { 
  saveAccountToFirebase, 
  deleteAccountFromFirebase, 
  saveAllAccountsToFirebase, 
  syncLinkedAccounts 
} from '../lib/firebaseSync';

export function useAccountManagement(
  user: UserProfile,
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>
) {
  // Accounts list with localStorage persistence
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('KIDO_ACCOUNTS_V1') || localStorage.getItem('DINO_ACCOUNTS_V1');
      if (saved) {
        const parsed: UserAccount[] = JSON.parse(saved);
        return parsed.map((acc) => {
          const avatarStr = typeof acc.avatar === 'string' ? acc.avatar : '';
          let avatar = acc.avatar;
          if (acc.role === 'admin' && (!avatarStr || avatarStr.startsWith('http'))) {
            avatar = '🛡️';
          }
          if (acc.role === 'parent' && (!avatarStr || avatarStr.startsWith('http'))) {
            avatar = '👨‍👩‍👧';
          }
          return {
            ...acc,
            avatar,
            stars: acc.stars !== undefined ? acc.stars : 0,
            level: acc.level !== undefined ? acc.level : 1,
            completedLessons: acc.completedLessons !== undefined ? acc.completedLessons : 0,
          };
        });
      }
    } catch (e) {
      console.warn('Failed to load saved accounts:', e);
    }
    return sampleAccounts;
  });

  // Persist accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('KIDO_ACCOUNTS_V1', JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save accounts to localStorage:', e);
    }
  }, [accounts]);

  // Handle saving an individual account to state & Firebase
  const saveAccount = useCallback(async (updatedAcc: UserAccount) => {
    setAccounts((prev) => {
      const idx = prev.findIndex((a) => a.id === updatedAcc.id || (updatedAcc.username && a.username === updatedAcc.username));
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedAcc;
        return next;
      }
      return [...prev, updatedAcc];
    });

    try {
      await saveAccountToFirebase(updatedAcc);
    } catch (e) {
      console.error('Failed to sync account to Firebase:', e);
    }
  }, []);

  // Handle deleting an account
  const deleteAccount = useCallback(async (accId: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== accId));
    try {
      await deleteAccountFromFirebase(accId);
    } catch (e) {
      console.error('Failed to delete account from Firebase:', e);
    }
  }, []);

  // Handle updating permissions / allowedGrades for a specific student
  const updateStudentPermissions = useCallback(async (targetAccId: string, allowedGrades: string[]) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === targetAccId) {
          const updated = { ...acc, allowedGrades };
          saveAccountToFirebase(updated).catch(() => {});
          return updated;
        }
        return acc;
      })
    );

    setUser((prev) => {
      if (prev.id === targetAccId) {
        return { ...prev, allowedGrades };
      }
      return prev;
    });
  }, [setUser]);

  // Handle switching active user profile
  const switchActiveAccount = useCallback((targetAcc: UserAccount) => {
    if (targetAcc.id) {
      localStorage.setItem('KIDO_ACTIVE_ACCOUNT_ID', targetAcc.id);
    }

    const isNowActiveVip = Boolean(
      targetAcc.isVip && (!targetAcc.vipExpiryDate || new Date(targetAcc.vipExpiryDate.replace(' ', 'T')).getTime() > Date.now())
    );

    let currentSeconds = 300;
    if (isNowActiveVip) {
      if (targetAcc.vipExpiryDate) {
        const parsed = new Date(targetAcc.vipExpiryDate.replace(' ', 'T'));
        if (!isNaN(parsed.getTime()) && parsed > new Date()) {
          currentSeconds = Math.floor((parsed.getTime() - Date.now()) / 1000);
        } else {
          currentSeconds = targetAcc.trialTimeSeconds || 31536000;
        }
      } else {
        currentSeconds = targetAcc.trialTimeSeconds || 31536000;
      }
    } else {
      currentSeconds = targetAcc.trialTimeSeconds !== undefined && targetAcc.trialTimeSeconds <= 300 ? targetAcc.trialTimeSeconds : 300;
    }

    setUser({
      id: targetAcc.id,
      name: targetAcc.name,
      username: targetAcc.username,
      role: targetAcc.role,
      avatar: targetAcc.avatar || (targetAcc.role === 'admin' ? '🛡️' : targetAcc.role === 'parent' ? '👨‍👩‍👧' : '🦖'),
      stars: targetAcc.stars !== undefined ? targetAcc.stars : 0,
      level: targetAcc.level !== undefined ? targetAcc.level : 1,
      completedLessonsCount: targetAcc.completedLessons !== undefined ? targetAcc.completedLessons : 0,
      isVip: isNowActiveVip,
      vipExpiryDate: targetAcc.vipExpiryDate || '',
      allowedGrades: targetAcc.allowedGrades || ['all'],
      trialTimeSeconds: currentSeconds,
      checkedInToday: targetAcc.checkedInToday ?? false,
      streakDays: targetAcc.streakDays !== undefined ? targetAcc.streakDays : 1,
      studyTimeMinutes: targetAcc.studyTimeMinutes !== undefined ? targetAcc.studyTimeMinutes : 15,
      learnedVocabCount: targetAcc.learnedVocabCount !== undefined ? targetAcc.learnedVocabCount : 12,
      linkedKidIds: targetAcc.linkedKidIds || [],
      linkedParentIds: targetAcc.linkedParentIds || [],
      pendingParentRequests: targetAcc.pendingParentRequests || [],
    });
  }, [setUser]);

  return {
    accounts,
    setAccounts,
    saveAccount,
    deleteAccount,
    updateStudentPermissions,
    switchActiveAccount,
  };
}
