import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, X, Star, Mic, Flame } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { UserAccount } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userAvatar?: string;
  accounts?: UserAccount[];
}

type ModalTab = 'superstar' | 'speaking' | 'streak';

interface RankUser {
  rank: number;
  name: string;
  avatar: string;
  level: string;
  score: string;
  isCurrentUser?: boolean;
}

// 3D Trophy Graphic elements
const TrophyCrownGold = () => (
  <div className="w-12 h-12 -mb-2 z-10 mx-auto relative flex items-center justify-center filter drop-shadow-md">
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 flex items-center justify-center border-2 border-amber-300 shadow-lg">
      <span className="text-xl">👑</span>
    </div>
  </div>
);

const TrophyBadgeSilver = () => (
  <div className="w-10 h-10 -mb-2 z-10 mx-auto relative flex items-center justify-center filter drop-shadow-xs">
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-100 flex items-center justify-center border-2 border-slate-300 shadow-md">
      <span className="text-base">🛡️</span>
    </div>
  </div>
);

const TrophyBadgeBronze = () => (
  <div className="w-10 h-10 -mb-2 z-10 mx-auto relative flex items-center justify-center filter drop-shadow-xs">
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 via-orange-400 to-amber-300 flex items-center justify-center border-2 border-amber-400 shadow-md">
      <span className="text-base">🏆</span>
    </div>
  </div>
);

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  userName = 'Cao Quốc Minh',
  userAvatar,
  accounts = [],
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('speaking');

  if (!isOpen) return null;

  // Filter 100% real active student accounts
  const kidAccounts = accounts.filter((a) => a.role === 'kid' && !a.isDeleted);

  // Ensure current logged in student is represented if missing
  if (userName && !kidAccounts.some((a) => a.name === userName || a.username === userName)) {
    kidAccounts.push({
      id: 'current-logged-user',
      username: userName,
      passwordHash: '',
      role: 'kid',
      name: userName,
      avatar: userAvatar || '🦖',
      vipExpiryDate: '2027-12-31',
      isVip: true,
      createdAt: new Date().toISOString(),
      stars: 0,
      level: 1,
      streakDays: 0,
      completedLessons: 0,
    });
  }

  // 1. SUPERSTAR DATA (Ranked by Stars)
  const sortedSuperstar = [...kidAccounts].sort((a, b) => {
    const starsA = Number(a.stars) || 0;
    const starsB = Number(b.stars) || 0;
    if (starsB !== starsA) return starsB - starsA;
    return (Number(b.level) || 1) - (Number(a.level) || 1);
  });

  const superstarList: RankUser[] = sortedSuperstar.map((acc, idx) => {
    const isMe = Boolean(userName && (acc.name === userName || acc.username === userName));
    return {
      rank: idx + 1,
      name: acc.name || acc.username,
      avatar: isMe && userAvatar ? userAvatar : (acc.avatar || '🦖'),
      level: `Lv.${acc.level !== undefined ? acc.level : 1}`,
      score: `${acc.stars !== undefined ? acc.stars : 0} Sao`,
      isCurrentUser: isMe,
    };
  });

  // 2. SPEAKING DATA (Ranked by Completed Lessons)
  const sortedSpeaking = [...kidAccounts].sort((a, b) => {
    const lessonsA = Number(a.completedLessons) || 0;
    const lessonsB = Number(b.completedLessons) || 0;
    if (lessonsB !== lessonsA) return lessonsB - lessonsA;
    return (Number(b.stars) || 0) - (Number(a.stars) || 0);
  });

  const speakingList: RankUser[] = sortedSpeaking.map((acc, idx) => {
    const isMe = Boolean(userName && (acc.name === userName || acc.username === userName));
    const lessons = acc.completedLessons !== undefined ? acc.completedLessons : 0;
    return {
      rank: idx + 1,
      name: acc.name || acc.username,
      avatar: isMe && userAvatar ? userAvatar : (acc.avatar || '🦖'),
      level: `Lv.${acc.level !== undefined ? acc.level : 1}`,
      score: `${lessons} Bài hoàn thành`,
      isCurrentUser: isMe,
    };
  });

  // 3. STREAK DATA (Ranked by Streak Days)
  const sortedStreak = [...kidAccounts].sort((a, b) => {
    const streakA = Number(a.streakDays) || 0;
    const streakB = Number(b.streakDays) || 0;
    if (streakB !== streakA) return streakB - streakA;
    return (Number(b.stars) || 0) - (Number(a.stars) || 0);
  });

  const streakList: RankUser[] = sortedStreak.map((acc, idx) => {
    const isMe = Boolean(userName && (acc.name === userName || acc.username === userName));
    const streak = acc.streakDays !== undefined ? acc.streakDays : 0;
    return {
      rank: idx + 1,
      name: acc.name || acc.username,
      avatar: isMe && userAvatar ? userAvatar : (acc.avatar || '🦖'),
      level: `Lv.${acc.level !== undefined ? acc.level : 1}`,
      score: `${streak} Ngày`,
      isCurrentUser: isMe,
    };
  });

  // Helper to construct podium & list
  const buildRankData = (fullList: RankUser[]) => {
    const podium: RankUser[] = [];
    if (fullList[1]) podium[0] = fullList[1]; // Rank 2 (Left - Silver)
    if (fullList[0]) podium[1] = fullList[0]; // Rank 1 (Center - Gold)
    if (fullList[2]) podium[2] = fullList[2]; // Rank 3 (Right - Bronze)

    const list = fullList.slice(3); // Rank 4+
    return { fullList, podium, list };
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'superstar':
        return buildRankData(superstarList);
      case 'streak':
        return buildRankData(streakList);
      case 'speaking':
      default:
        return buildRankData(speakingList);
    }
  };

  const currentData = getTabData();

  const myEntry = currentData.fullList.find((u) => u.isCurrentUser || (userName && u.name === userName));
  const myRankBadge = myEntry ? `Hạng #${myEntry.rank}` : 'Chưa xếp hạng';
  const myScore = myEntry ? myEntry.score : '0';

  // Header background theme
  const getHeaderTheme = () => {
    switch (activeTab) {
      case 'superstar':
        return 'bg-gradient-to-r from-[#831843] via-[#9d174d] to-[#be123c]';
      case 'streak':
        return 'bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669]';
      case 'speaking':
      default:
        return 'bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#2563eb]';
    }
  };

  const getBottomBannerTheme = () => {
    switch (activeTab) {
      case 'superstar':
        return {
          bg: 'bg-[#831843]',
          rankBadge: myRankBadge,
          subtext: `Bé đang đạt ${myScore} thi đua! Nhấp xem tóm tắt 🚀`,
        };
      case 'streak':
        return {
          bg: 'bg-[#064e3b]',
          rankBadge: myRankBadge,
          subtext: `Bé đang duy trì ${myScore} thi đua! Nhấp xem tóm tắt 🚀`,
        };
      case 'speaking':
      default:
        return {
          bg: 'bg-[#1e3a8a]',
          rankBadge: myRankBadge,
          subtext: `Bé đang đạt ${myScore} thi đua! Nhấp xem tóm tắt 🚀`,
        };
    }
  };

  const bottomTheme = getBottomBannerTheme();

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="absolute inset-0 bg-slate-950/40" onClick={onClose} />
      <div className="max-w-xl w-full bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100 animate-scaleUp relative z-10">
        {/* Header Banner */}
        <div className={`${getHeaderTheme()} p-4 sm:p-5 text-white relative flex items-start justify-between`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy size={24} className="text-amber-300 animate-bounce" />
              <h2 className="text-lg sm:text-xl font-black tracking-wide uppercase">
                BẢNG XẾP HẠNG THI ĐƯA
              </h2>
            </div>
            <p className="text-xs font-semibold text-white/80">
              Thi đua học tập hăng hái — Tuyên dương học sinh xuất sắc!
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3 Tab Selector Buttons matching 100% Images 3, 4, 5 */}
        <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Tab 1: Siêu Sao Tuần */}
          <button
            onClick={() => setActiveTab('superstar')}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition cursor-pointer ${
              activeTab === 'superstar'
                ? 'bg-[#ec4899] text-white shadow-md shadow-pink-200 border-none'
                : 'bg-[#fdf2f8] hover:bg-pink-100 text-[#db2777] border border-pink-200'
            }`}
          >
            <Star size={14} className={activeTab === 'superstar' ? 'fill-white' : 'fill-[#db2777]'} />
            <span className="whitespace-nowrap">Siêu Sao Tuần</span>
          </button>

          {/* Tab 2: Dũng Sĩ Phát Âm */}
          <button
            onClick={() => setActiveTab('speaking')}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition cursor-pointer ${
              activeTab === 'speaking'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-200 border-none'
                : 'bg-[#eff6ff] hover:bg-blue-100 text-[#2563eb] border border-blue-200'
            }`}
          >
            <Mic size={14} />
            <span className="whitespace-nowrap">Dũng Sĩ Phát Âm</span>
          </button>

          {/* Tab 3: Chuỗi Chăm Chỉ */}
          <button
            onClick={() => setActiveTab('streak')}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition cursor-pointer ${
              activeTab === 'streak'
                ? 'bg-[#10b981] text-white shadow-md shadow-emerald-200 border-none'
                : 'bg-[#ecfdf5] hover:bg-emerald-100 text-[#059669] border border-emerald-200'
            }`}
          >
            <Flame size={14} className={activeTab === 'streak' ? 'fill-white' : 'fill-[#059669]'} />
            <span className="whitespace-nowrap">Chuỗi Chăm Chỉ</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-5 space-y-4">
          {/* Top 3 Podium Cards Arrangement */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-2 pb-1 px-1">
            {/* Rank 2 (Left) */}
            {currentData.podium[0] && (
              <div className="bg-[#f1f5f9] border-2 border-[#cbd5e1] rounded-2xl p-2 sm:p-3 text-center shadow-xs flex flex-col items-center relative">
                <TrophyBadgeSilver />
                <UserAvatar
                  avatar={(userName ? currentData.podium[0].name === userName : currentData.podium[0].isCurrentUser) && userAvatar ? userAvatar : currentData.podium[0].avatar}
                  name={currentData.podium[0].name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-300 shadow-sm"
                />
                <h4 className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full">
                  {currentData.podium[0].name}
                </h4>
                <div className="text-lg sm:text-xl font-black text-slate-600 my-0.5">
                  2
                </div>
                <div className="bg-white px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black text-slate-700 shadow-2xs border border-slate-200 flex items-center justify-center gap-1">
                  {activeTab === 'superstar' && '⭐ '}
                  {activeTab === 'speaking' && '🎙 '}
                  {activeTab === 'streak' && '💧 '}
                  <span>{currentData.podium[0].score}</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Center - Gold Highlight) */}
            {currentData.podium[1] && (
              <div className="bg-[#fef08a] border-2 border-[#facc15] rounded-2xl p-2.5 sm:p-3.5 text-center shadow-md flex flex-col items-center relative -translate-y-2">
                <TrophyCrownGold />
                <UserAvatar
                  avatar={(userName ? currentData.podium[1].name === userName : currentData.podium[1].isCurrentUser) && userAvatar ? userAvatar : currentData.podium[1].avatar}
                  name={currentData.podium[1].name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-amber-400 shadow-md"
                />
                <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1 truncate max-w-full">
                  {currentData.podium[1].name}
                </h4>
                <div className="text-xl sm:text-2xl font-black text-amber-900 my-0.5">
                  1
                </div>
                <div className="bg-white px-2.5 py-1 rounded-full text-[10.5px] sm:text-xs font-black text-amber-900 shadow-xs border border-amber-200 flex items-center justify-center gap-1">
                  {activeTab === 'superstar' && '⭐ '}
                  {activeTab === 'speaking' && '🎙 '}
                  {activeTab === 'streak' && '💧 '}
                  <span>{currentData.podium[1].score}</span>
                </div>
              </div>
            )}

            {/* Rank 3 (Right) */}
            {currentData.podium[2] && (
              <div className="bg-[#ffedd5] border-2 border-[#fdba74] rounded-2xl p-2 sm:p-3 text-center shadow-xs flex flex-col items-center relative">
                <TrophyBadgeBronze />
                <UserAvatar
                  avatar={(userName ? currentData.podium[2].name === userName : currentData.podium[2].isCurrentUser) && userAvatar ? userAvatar : currentData.podium[2].avatar}
                  name={currentData.podium[2].name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-orange-300 shadow-sm"
                />
                <h4 className="text-[11px] sm:text-xs font-black text-slate-800 mt-1 truncate max-w-full">
                  {currentData.podium[2].name}
                </h4>
                <div className="text-lg sm:text-xl font-black text-orange-800 my-0.5">
                  3
                </div>
                <div className="bg-white px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black text-orange-900 shadow-2xs border border-orange-200 flex items-center justify-center gap-1">
                  {activeTab === 'superstar' && '⭐ '}
                  {activeTab === 'speaking' && '🎙 '}
                  {activeTab === 'streak' && '💧 '}
                  <span>{currentData.podium[2].score}</span>
                </div>
              </div>
            )}
          </div>

          {/* Rank List #4 onwards matching Images 3, 4, 5 */}
          <div className="space-y-2 pt-1">
            {currentData.list.map((user) => {
              const isMe = userName ? user.name === userName : Boolean(user.isCurrentUser);
              return (
                <div
                  key={user.rank}
                  className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition ${
                    isMe
                      ? 'bg-blue-50/70 border-2 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Rank Badge with medal icon */}
                    <div className="flex items-center gap-1 w-9 shrink-0 text-slate-600 font-black text-xs sm:text-sm">
                      <span className="text-amber-500 text-sm">
                        {user.rank === 4 ? '🏆' : user.rank === 5 ? '🥇' : user.rank === 6 ? '🏅' : '🎖️'}
                      </span>
                      <span>#{user.rank}</span>
                    </div>

                    <UserAvatar
                      avatar={isMe && userAvatar ? userAvatar : user.avatar}
                      name={user.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-slate-800 text-xs sm:text-sm truncate">
                          {user.name}
                        </span>
                        {isMe && (
                          <span className="bg-[#2563eb] text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                            Bạn
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] font-semibold text-slate-400 truncate">
                        {user.level}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-black text-slate-800 text-xs sm:text-sm shrink-0">
                    {activeTab === 'superstar' && <Star size={14} className="fill-amber-400 text-amber-500" />}
                    {activeTab === 'speaking' && <Mic size={14} className="text-blue-500" />}
                    {activeTab === 'streak' && <Flame size={14} className="fill-orange-500 text-orange-500" />}
                    <span>{user.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Sticky User Performance Banner matching Images 3, 4, 5 */}
        <div className={`${bottomTheme.bg} p-3 sm:p-4 text-white flex items-center justify-between gap-2 border-t border-white/10`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="bg-white/20 text-amber-300 font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-white/20 shrink-0">
              {bottomTheme.rankBadge}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <h4 className="text-xs sm:text-sm font-black truncate text-white">
                Thành tích của Bé ({userName || 'Cao Quốc Minh'})
              </h4>
              <p className="text-[10.5px] sm:text-xs font-semibold text-white/90 truncate">
                {bottomTheme.subtext}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="text-amber-300 font-black text-xs sm:text-sm hover:underline shrink-0 px-2 py-1 cursor-pointer"
          >
            Cố lên!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
