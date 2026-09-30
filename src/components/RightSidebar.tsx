import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Clock as ClockIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  Music, 
  Gift, 
  BookOpen, 
  GraduationCap, 
  Mic, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Star,
  CheckCircle2,
  Edit3,
  FileText,
  Link,
  Search,
  Calendar,
  Trophy,
  Tablet,
  Languages,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyTask, LeaderboardUser, UserAccount, UserRole } from '../types';
import { audioService } from '../utils/audio';
import { UserAvatar } from './UserAvatar';
import { LeaderboardModal } from './LeaderboardModal';
import { useLanguage } from '../context/LanguageContext';

interface RightSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  reportSubTab?: 'overview' | 'map' | 'parent' | 'tips';
  checkedInToday: boolean;
  onClaimCheckIn: () => void;
  onSimulateNewDayLostStreak?: () => void;
  dailyTasks: DailyTask[];
  onClaimTask: (taskId: string) => void;
  onClaimAllTasks?: () => void;
  leaderboard: LeaderboardUser[];
  accounts?: UserAccount[];
  userRole?: UserRole;
  onTriggerNotification: (title: string, msg: string) => void;
  userAvatar?: string;
  userName?: string;
  quizProgress?: { current: number; total: number; difficulty: string; isPlaying?: boolean };
}

const KidoMascotToysGraphic = () => (
  <div className="w-24 h-24 mx-auto relative flex items-center justify-center">
    {/* Soft aura background */}
    <div className="absolute inset-0 rounded-full bg-sky-200/40 blur-md" />
    <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
      {/* Sky circle background */}
      <circle cx="80" cy="80" r="62" fill="#bae6fd" opacity="0.6" />
      <circle cx="80" cy="80" r="52" fill="#38bdf8" opacity="0.25" />

      {/* Background clouds */}
      <path d="M 40 52 Q 50 42 60 52 Q 70 46 80 52 Q 80 62 40 62 Z" fill="#ffffff" opacity="0.95" />
      <path d="M 98 48 Q 108 40 118 48 Q 126 44 132 50 Q 128 60 98 60 Z" fill="#ffffff" opacity="0.95" />

      {/* Decorative Stars */}
      <polygon points="36,32 39,38 45,39 41,43 42,49 36,46 30,49 31,43 27,39 33,38" fill="#facc15" />
      <polygon points="126,30 128,35 133,36 129,39 130,44 126,41 122,44 123,39 119,36 124,35" fill="#f472b6" />

      {/* Left Toy - Stacking Rings */}
      <g transform="translate(24, 92)">
        <ellipse cx="12" cy="26" rx="13" ry="5" fill="#f43f5e" />
        <ellipse cx="12" cy="20" rx="10" ry="4" fill="#3b82f6" />
        <ellipse cx="12" cy="14" rx="7.5" fill="#eab308" />
        <ellipse cx="12" cy="9" rx="5" fill="#10b981" />
        <circle cx="12" cy="4" r="3" fill="#ec4899" />
      </g>

      {/* Right Toy - Ball */}
      <g transform="translate(120, 102)">
        <circle cx="10" cy="10" r="11" fill="#f97316" />
        <path d="M 10 0 A 11 11 0 0 0 10 20 A 11 11 0 0 0 10 0" fill="#ec4899" opacity="0.6" />
        <path d="M 0 10 A 11 11 0 0 0 20 10 A 11 11 0 0 0 0 10" fill="#3b82f6" opacity="0.5" />
      </g>

      {/* Central Dino Mascot Body */}
      {/* Head */}
      <ellipse cx="80" cy="68" rx="26" ry="24" fill="#4ade80" />
      {/* Cheeks */}
      <ellipse cx="66" cy="74" rx="5" ry="3" fill="#f472b6" opacity="0.75" />
      <ellipse cx="94" cy="74" rx="5" ry="3" fill="#f472b6" opacity="0.75" />
      {/* Eyes */}
      <ellipse cx="72" cy="65" rx="4" ry="5" fill="#1e293b" />
      <ellipse cx="88" cy="65" rx="4" ry="5" fill="#1e293b" />
      <circle cx="73.5" cy="63.5" r="1.5" fill="#ffffff" />
      <circle cx="89.5" cy="63.5" r="1.5" fill="#ffffff" />
      {/* Cute Smile */}
      <path d="M 74 75 Q 80 82 86 75" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />

      {/* Blue Hoodie Jacket */}
      <path d="M 58 84 Q 80 80 102 84 L 106 110 Q 80 116 54 110 Z" fill="#2563eb" />
      <path d="M 66 84 Q 80 88 94 84 L 92 110 Q 80 114 68 110 Z" fill="#f8fafc" />

      {/* Arms Waving */}
      <ellipse cx="49" cy="94" rx="7" ry="12" fill="#4ade80" transform="rotate(-25 49 94)" />
      <ellipse cx="111" cy="87" rx="7" ry="12" fill="#4ade80" transform="rotate(45 111 87)" />

      {/* Feet / Paws */}
      <ellipse cx="60" cy="118" rx="10" ry="7" fill="#4ade80" />
      <ellipse cx="100" cy="118" rx="10" ry="7" fill="#4ade80" />
      <circle cx="56" cy="118" r="2" fill="#fde047" />
      <circle cx="60" cy="120" r="2" fill="#fde047" />
      <circle cx="64" cy="118" r="2" fill="#fde047" />
      <circle cx="96" cy="118" r="2" fill="#fde047" />
      <circle cx="100" cy="120" r="2" fill="#fde047" />
      <circle cx="104" cy="118" r="2" fill="#fde047" />

      {/* Building Blocks A, B, Star in Front */}
      <g transform="translate(68, 108)">
        {/* Block A (Yellow) */}
        <rect x="0" y="8" width="14" height="14" rx="3" fill="#facc15" stroke="#eab308" strokeWidth="1" />
        <text x="7" y="19" textAnchor="middle" fill="#854d0e" fontSize="10" fontWeight="900">A</text>
        {/* Block B (Red) */}
        <rect x="12" y="8" width="14" height="14" rx="3" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
        <text x="19" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">B</text>
        {/* Block Star (Blue) on top */}
        <rect x="6" y="-3" width="13" height="13" rx="3" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
        <polygon points="12.5,-1 13.8,2 17,2.3 14.6,4.5 15.3,7.6 12.5,6 9.7,7.6 10.4,4.5 8,2.3 11.2,2" fill="#facc15" />
      </g>
    </svg>
  </div>
);

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab,
  setActiveTab,
  reportSubTab = 'overview',
  checkedInToday,
  onClaimCheckIn,
  onSimulateNewDayLostStreak,
  dailyTasks,
  onClaimTask,
  onClaimAllTasks,
  leaderboard,
  accounts,
  userRole,
  onTriggerNotification,
  userAvatar,
  userName,
  quizProgress,
}) => {
  const { lang, t } = useLanguage();

  // Leaderboard Timeframe state
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<'week' | 'last_week' | 'month' | 'all'>('week');
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [showCheckInSuccessModal, setShowCheckInSuccessModal] = useState(false);
  const [showSpeakingHistoryModal, setShowSpeakingHistoryModal] = useState(false);

  // Compute 100% real leaderboard from actual accounts data
  const getDisplayLeaderboard = () => {
    let rawList: LeaderboardUser[] = [];

    if (accounts && accounts.length > 0) {
      const kidAccounts = accounts.filter((a) => a.role === 'kid');
      
      // Ensure current logged in user is represented if student
      if (userName && !kidAccounts.some((a) => a.name === userName || a.username === userName)) {
        kidAccounts.push({
          id: 'curr-user',
          username: userName,
          passwordHash: '',
          role: 'kid',
          name: userName,
          avatar: userAvatar || '🦖',
          vipExpiryDate: '2027-12-31',
          isVip: true,
          createdAt: new Date().toISOString(),
          stars: 0,
        });
      }

      // Sort by real stars / points descending
      const sorted = [...kidAccounts].sort((a, b) => (b.stars || 0) - (a.stars || 0));

      rawList = sorted.map((acc, index) => ({
        rank: index + 1,
        name: acc.name || acc.username,
        avatar: (acc.name === userName || acc.username === userName) && userAvatar ? userAvatar : (acc.avatar || '🦖'),
        points: acc.stars || 0,
      }));
    } else {
      rawList = leaderboard;
    }

    return rawList.map((item, idx) => {
      if ((item.name === 'Cao Quốc Minh' || item.name === userName) && userAvatar) {
        return { ...item, rank: idx + 1, avatar: userAvatar };
      }
      return { ...item, rank: idx + 1 };
    });
  };

  const currentLeaderboardList = getDisplayLeaderboard();

  // Hide Daily Tasks and Weekly Leaderboard on all pages except the Home page ('home')
  const isLeaderboardAndTasksHidden = activeTab !== 'home';

  // Active check-in day index (1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7, 7 = CN)
  // Default to 4 (Thursday / T5 - Thứ Năm)
  const [activeDayIndex, setActiveDayIndex] = useState<number>(4);

  // Real-time Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(900); // 15:00 default
  const [initialTimer, setInitialTimer] = useState(900);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showEditTimer, setShowEditTimer] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('15');

  // Music Player State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [trackIndex, setTrackIndex] = useState(0);

  const playlist = [
    { title: 'English Adventure Melody', artist: 'Kido relaxation' },
    { title: 'Morning Lofi Study Beats', artist: 'Kido English' },
    { title: 'Alpha Waves Concentration', artist: 'Focus Music' },
  ];

  // Update real clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const onTriggerRef = useRef(onTriggerNotification);
  useEffect(() => {
    onTriggerRef.current = onTriggerNotification;
  }, [onTriggerNotification]);

  // Countdown timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerRunning]);

  // Handle timer completion side effects cleanly in useEffect
  useEffect(() => {
    if (isTimerRunning && timerSeconds === 0) {
      setIsTimerRunning(false);
      audioService.playTimerAlarm();
      if (onTriggerRef.current) {
        onTriggerRef.current(
          '⏰ Hết giờ học tập!',
          'Bé đã hoàn thành xuất sắc khoảng thời gian học tập theo bộ hẹn giờ! Hãy nghỉ ngơi chút nhé.'
        );
      }
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [timerSeconds, isTimerRunning]);

  const handleStartTimer = () => {
    audioService.playClickSound();
    if (timerSeconds === 0) {
      setTimerSeconds(initialTimer);
    }
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    audioService.playClickSound();
    setIsTimerRunning(false);
    setTimerSeconds(initialTimer);
  };

  const handleQuickTimer = (mins: number) => {
    audioService.playClickSound();
    const secs = mins * 60;
    setInitialTimer(secs);
    setTimerSeconds(secs);
    setIsTimerRunning(false);
  };

  const handleApplyCustomMinutes = () => {
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      handleQuickTimer(mins);
      setShowEditTimer(false);
    }
  };

  const toggleMusic = () => {
    const newState = audioService.toggleStudyMusic(undefined, (playing) => setIsMusicPlaying(playing));
    setIsMusicPlaying(newState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    audioService.setMusicVolume(val / 100);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getFormattedDateStr = (date: Date) => {
    if (lang === 'en') {
      const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNamesEn[date.getDay()];
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dayName}, ${mm}/${dd}/${yyyy}`;
    }
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = dayNames[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dayName}, ${dd}/${mm}/${yyyy}`;
  };

  const formattedTimeStr = currentTime.toLocaleTimeString(lang === 'en' ? 'en-US' : 'vi-VN', { hour12: false });
  const formattedDateStr = getFormattedDateStr(currentTime);

  // Dynamic 7-Day Attendance Week Status
  const currentDayOfWeek = activeDayIndex;
  const attendanceWeekDays = [
    { day: 'T2', index: 1 },
    { day: 'T3', index: 2 },
    { day: 'T4', index: 3 },
    { day: 'T5', index: 4 },
    { day: 'T6', index: 5 },
    { day: 'T7', index: 6 },
    { day: 'CN', index: 7, bonus: true },
  ].map((d) => {
    const isPast = d.index < currentDayOfWeek;
    const isToday = d.index === currentDayOfWeek;
    return {
      ...d,
      done: isPast ? true : isToday ? checkedInToday : false,
      isToday,
    };
  });

  if (activeTab === 'listening-speaking-img' || activeTab === 'listening') {
    return (
      <div className="w-full lg:w-[270px] xl:w-[300px] 2xl:w-[320px] shrink-0 space-y-4 font-sans select-none lg:sticky lg:top-3 self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto custom-scrollbar px-1 pt-3 pb-3 overscroll-contain transition-all duration-300">
        {/* 1. Clock & Study Timer & Music Widget */}
        <div className="bg-[#eff6ff] rounded-[28px] p-4 border-[2.5px] border-[#3b82f6] shadow-xs space-y-3.5">
          {/* Realtime Clock Header */}
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-2xl shadow-2xs border border-sky-100">
            <div>
              <div className="text-xl font-black text-[#1d50b4] tracking-tight leading-none">
                {formattedTimeStr}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                {formattedDateStr}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-[#1d50b4]">
              <ClockIcon size={18} />
            </div>
          </div>

          {/* Study Timer Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span className="flex items-center gap-1">
                <ClockIcon size={14} className="text-sky-600" />
                Bộ hẹn giờ học tập
              </span>
            </div>

            {/* Preset Buttons */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {[5, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleQuickTimer(mins)}
                  className={`flex-1 py-1 rounded-xl transition cursor-pointer ${
                    initialTimer === mins * 60 
                      ? 'bg-[#1d50b4] text-white shadow-xs' 
                      : 'bg-white text-slate-700 hover:bg-sky-100 border border-sky-100'
                  }`}
                >
                  {mins}p
                </button>
              ))}
              <button
                onClick={() => setShowEditTimer(!showEditTimer)}
                className="px-2 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 text-[#1d50b4] text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1"
              >
                <Edit3 size={11} />
                Sửa phút
              </button>
            </div>

            {/* Modal / Form for editing timer minutes */}
            {showEditTimer && (
              <div className="bg-white p-2 rounded-xl border border-sky-200 flex items-center gap-2 animate-fadeIn">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyCustomMinutes();
                    }
                  }}
                  className="w-16 px-2 py-1 text-xs font-bold border rounded-lg text-slate-800"
                />
                <span className="text-xs font-bold text-slate-500">phút</span>
                <button
                  onClick={handleApplyCustomMinutes}
                  className="ml-auto px-2.5 py-1 bg-[#1d50b4] text-white text-xs font-bold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            )}

            {/* Countdown timer display & Play/Pause controls */}
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-2xl border border-sky-100 shadow-2xs">
              <span className="text-xl font-black text-slate-800 tracking-wider">
                {formatTimer(timerSeconds)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleStartTimer}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xs transition cursor-pointer ${
                    isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                  }`}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Music Player Section */}
          <div className="pt-2 border-t border-sky-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span className="flex items-center gap-1">
                <Music size={14} className="text-purple-600" />
                Nhạc học tập thư giãn
              </span>
            </div>

            {/* Track Display */}
            <div className="bg-white p-2.5 rounded-2xl border border-sky-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="truncate pr-2">
                  <p className="text-xs font-extrabold text-slate-800 truncate">
                    {playlist[trackIndex].title}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400">
                    {isMusicPlaying ? 'Đang phát 🎵' : 'Dừng phát'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full shrink-0 ${isMusicPlaying ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
              </div>

              {/* Play controls & Volume */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setTrackIndex((prev) => (prev > 0 ? prev - 1 : playlist.length - 1))}
                    className="text-slate-500 hover:text-[#1d50b4] transition cursor-pointer"
                  >
                    <SkipBack size={14} />
                  </button>
                  <button 
                    onClick={toggleMusic}
                    className="w-7 h-7 rounded-full bg-[#1d50b4] text-white flex items-center justify-center shadow-2xs hover:bg-blue-700 transition cursor-pointer"
                  >
                    {isMusicPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                  </button>
                  <button 
                    onClick={() => setTrackIndex((prev) => (prev + 1) % playlist.length)}
                    className="text-slate-500 hover:text-[#1d50b4] transition cursor-pointer"
                  >
                    <SkipForward size={14} />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-1.5">
                  {volume === 0 ? <VolumeX size={13} className="text-slate-400" /> : <Volume2 size={13} className="text-slate-500" />}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 accent-[#1d50b4] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Mẹo học cùng Kido Card matching Image 2 & 5 100% */}
        <div className="bg-white rounded-3xl p-4 border border-sky-200/80 shadow-xs space-y-3 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 p-1 flex items-center justify-center text-3xl shadow-sm border border-emerald-200 overflow-hidden">
            <span className="text-4xl">🐊</span>
          </div>
          <h4 className="text-xs font-black text-slate-800">
            Mẹo học cùng Kido:
          </h4>
          <div className="text-[11px] font-medium text-slate-600 leading-relaxed text-left space-y-1.5">
            <p>• Chọn hình ảnh có ánh sáng tốt và chữ rõ nét để Kido nhận diện chính xác nhất.</p>
            <p>• Hãy nghe Kido đọc trước 2 lần để học cách phát âm chuẩn và ngắt nghỉ đúng chỗ.</p>
            <p>• Đọc to, rõ ràng và đặt micro gần miệng khi tham gia thử thách Nói để nhận thưởng sao vàng nhé!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[270px] xl:w-[300px] 2xl:w-[320px] shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 items-start font-sans select-none lg:sticky lg:top-3 self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto custom-scrollbar px-1 pt-3 pb-3 overscroll-contain transition-all duration-300">
      {/* 1. Clock & Study Timer & Music Widget */}
      <div className="bg-[#eff6ff] rounded-[28px] p-4 border-[2.5px] border-[#3b82f6] shadow-xs space-y-3.5">
        {/* Realtime Clock Header */}
        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-2xl shadow-2xs border border-sky-100">
          <div>
            <div className="text-xl font-black text-[#1d50b4] tracking-tight leading-none">
              {formattedTimeStr}
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5">
              {formattedDateStr}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-[#1d50b4]">
            <ClockIcon size={18} />
          </div>
        </div>

        {/* Study Timer Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
            <span className="flex items-center gap-1">
              <ClockIcon size={14} className="text-sky-600" />
              Bộ hẹn giờ học tập
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {[5, 15, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => handleQuickTimer(mins)}
                className={`flex-1 py-1 rounded-xl transition cursor-pointer ${
                  initialTimer === mins * 60 
                    ? 'bg-[#1d50b4] text-white shadow-xs' 
                    : 'bg-white text-slate-700 hover:bg-sky-100 border border-sky-100'
                }`}
              >
                {mins}p
              </button>
            ))}
            <button
              onClick={() => setShowEditTimer(!showEditTimer)}
              className="px-2 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 text-[#1d50b4] text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <Edit3 size={11} />
              Sửa phút
            </button>
          </div>

          {/* Modal / Form for editing timer minutes */}
          {showEditTimer && (
            <div className="bg-white p-2 rounded-xl border border-sky-200 flex items-center gap-2 animate-fadeIn">
              <input
                type="number"
                min="1"
                max="180"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyCustomMinutes();
                  }
                }}
                className="w-16 px-2 py-1 text-xs font-bold border rounded-lg text-slate-800"
              />
              <span className="text-xs font-bold text-slate-500">phút</span>
              <button
                onClick={handleApplyCustomMinutes}
                className="ml-auto px-2.5 py-1 bg-[#1d50b4] text-white text-xs font-bold rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Lưu
              </button>
            </div>
          )}

          {/* Countdown timer display & Play/Pause controls */}
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-2xl border border-sky-100 shadow-2xs">
            <span className="text-xl font-black text-slate-800 tracking-wider">
              {formatTimer(timerSeconds)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleStartTimer}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xs transition cursor-pointer ${
                  isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isTimerRunning ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
              <button
                onClick={handleResetTimer}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Music Player Section */}
        <div className="pt-2 border-t border-sky-200/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
            <span className="flex items-center gap-1">
              <Music size={14} className="text-purple-600" />
              Nhạc học tập thư giãn
            </span>
          </div>

          {/* Track Display */}
          <div className="bg-white p-2.5 rounded-2xl border border-sky-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="truncate pr-2">
                <p className="text-xs font-extrabold text-slate-800 truncate">
                  {playlist[trackIndex].title}
                </p>
                <p className="text-[10px] font-semibold text-slate-400">
                  {isMusicPlaying ? 'Đang phát 🎵' : 'Dừng phát'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full shrink-0 ${isMusicPlaying ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
            </div>

            {/* Play controls & Volume */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setTrackIndex((prev) => (prev > 0 ? prev - 1 : playlist.length - 1))}
                  className="text-slate-500 hover:text-[#1d50b4] transition cursor-pointer"
                >
                  <SkipBack size={14} />
                </button>
                <button 
                  onClick={toggleMusic}
                  className="w-7 h-7 rounded-full bg-[#1d50b4] text-white flex items-center justify-center shadow-2xs hover:bg-blue-700 transition cursor-pointer"
                >
                  {isMusicPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                </button>
                <button 
                  onClick={() => setTrackIndex((prev) => (prev + 1) % playlist.length)}
                  className="text-slate-500 hover:text-[#1d50b4] transition cursor-pointer"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5">
                {volume === 0 ? <VolumeX size={13} className="text-slate-400" /> : <Volume2 size={13} className="text-slate-500" />}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 accent-[#1d50b4] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Điểm danh nhận thưởng Card (Chỉ hiển thị ở Trang chủ) */}
      {activeTab === 'home' && !checkedInToday && (
        <div className="bg-[#fffdf0] rounded-[28px] p-4 sm:p-5 border-2 border-dashed border-[#fcd34d] shadow-xs space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#78350f]" />
              <h4 className="text-sm sm:text-base font-black text-[#78350f] leading-tight">
                Điểm danh nhận thưởng
              </h4>
            </div>
            <Gift size={22} className="text-[#ec4899] animate-bounce" />
          </div>

          <p className="text-xs font-bold text-[#92400e] leading-snug">
            Bé đăng nhập hôm nay nhận quà! Nhấn nhận ngay 5 sao và 5 điểm XP nhé.
          </p>

          <button
            onClick={() => {
              onClaimCheckIn();
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
              if (onTriggerNotification) {
                onTriggerNotification('🎁 Điểm danh thành công!', 'Bạn vừa nhận được +5 Sao Vàng & +5 Điểm XP điểm danh hôm nay!');
              }
              setShowCheckInSuccessModal(true);
            }}
            className="w-full py-2.5 sm:py-3 px-4 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#ea580c] to-[#d97706] hover:from-[#d97706] hover:to-[#ea580c] shadow-md shadow-orange-200 cursor-pointer active:scale-95 transition text-center"
          >
            Nhận +5 Sao & +5 XP
          </button>
        </div>
      )}

      {/* Quiz Specific Widgets */}
      {activeTab === 'quiz' && (
        <div className="space-y-3.5 animate-fadeIn">
          {!quizProgress?.isPlaying ? (
            /* State BEFORE playing quiz: Kido khuyên bé Card (Matching reference image 100%) */
            <div className="bg-[#fffdf0] rounded-3xl p-5 border border-amber-200/80 shadow-2xs text-center space-y-3">
              <KidoMascotToysGraphic />
              <div className="space-y-1.5 pt-1">
                <h4 className="text-sm sm:text-base font-black text-[#1e2b4f] tracking-tight">
                  Kido khuyên bé:
                </h4>
                <p className="text-xs font-bold text-slate-600 leading-relaxed px-1">
                  Vừa học vừa chơi, tích lũy thật nhiều Sao Vàng để đổi quà nhé bé yêu! Hãy chọn một chủ đề để bắt đầu trò chơi nào!
                </p>
              </div>
            </div>
          ) : (
            /* State WHEN playing quiz: Đồng hành cùng bé Card + Trạng thái thử thách Card */
            <>
              <div className="bg-[#fffdf0] rounded-3xl p-5 border border-amber-200/80 shadow-2xs text-center space-y-3">
                <KidoMascotToysGraphic />
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-sm sm:text-base font-black text-[#1e2b4f] tracking-tight">
                    Đồng hành cùng bé:
                  </h4>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed px-1">
                    Hãy giúp chú khủng long Kido bò về đích nhé bé! Trả lời đúng sẽ giúp Kido đi nhanh hơn đó nha!
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-100/90 shadow-2xs space-y-3">
                <h4 className="text-sm sm:text-base font-black text-[#1e2b4f] tracking-tight">
                  Trạng thái thử thách
                </h4>
                <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#2a3859]">
                  <span>Câu hỏi hiện tại:</span>
                  <span className="font-black text-[#1e293b] tracking-wider">
                    {quizProgress?.current || 1} / {quizProgress?.total || 8}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#2a3859]">
                  <span>Độ khó bài giảng:</span>
                  <div className="flex items-center gap-1 text-[#3b82f6] font-black">
                    <span>{quizProgress?.difficulty || 'Dễ thương 🧸'}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. Nhiệm vụ hàng ngày Card (Matching Image 1 100%) */}
      {!isLeaderboardAndTasksHidden && (
        <div className="bg-[#f5f3ff] rounded-[28px] p-4 sm:p-5 border-2 border-[#ddd6fe] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-black text-[#1e1b4b] tracking-tight">
              Nhiệm vụ hàng ngày
            </h4>
            {(() => {
              const claimableCount = dailyTasks.filter((t) => !t.claimed && t.current >= t.target).length;
              if (claimableCount > 0 && onClaimAllTasks) {
                return (
                  <button
                    onClick={() => {
                      onClaimAllTasks();
                      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
                    }}
                    className="px-2.5 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs active:scale-95 transition animate-pulse cursor-pointer"
                  >
                    Nhận tất cả 🎉
                  </button>
                );
              }
              return null;
            })()}
          </div>

          <div className="space-y-2 text-xs">
            {dailyTasks.map((task) => {
              const isCompleted = task.current >= task.target;
              const canClaim = isCompleted && !task.claimed;

              return (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-100/80 shadow-2xs transition hover:bg-slate-50 gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      task.icon === 'book' ? 'bg-emerald-50 text-emerald-600' :
                      task.icon === 'graduation' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {task.icon === 'book' && <Tablet size={16} />}
                      {task.icon === 'graduation' && <Languages size={16} />}
                      {task.icon === 'microphone' && <Mic size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-slate-800 text-[12px] sm:text-[13px] leading-snug break-words">
                        {task.title}
                      </p>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">
                        {task.current} / {task.target} {task.icon === 'book' ? 'bài' : 'từ'}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!canClaim}
                    onClick={() => {
                      if (!canClaim) return;
                      onClaimTask(task.id);
                      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition shrink-0 whitespace-nowrap ${
                      task.claimed 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-not-allowed opacity-80'
                        : canClaim
                          ? 'bg-gradient-to-r from-[#ea580c] to-[#d97706] hover:from-[#d97706] hover:to-[#ea580c] text-white shadow-md shadow-orange-200 active:scale-95 animate-pulse cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {task.claimed ? 'Đã nhận' : `Nhận +${task.rewardStars}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Thi đua tuần Card (Matching Image 2 100%) */}
      {!isLeaderboardAndTasksHidden && (
        <div className="bg-[#fffdf0] rounded-[28px] p-4 sm:p-5 border-2 border-[#fde047] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-black text-[#1e1b4b] leading-tight">
              Thi đua tuần
            </h4>

            {/* Timeframe Select Dropdown */}
            <div className="relative flex items-center">
              <select
                value={leaderboardTimeframe}
                onChange={(e) => setLeaderboardTimeframe(e.target.value as any)}
                className="appearance-none bg-white hover:bg-slate-50 text-[#1e1b4b] text-xs font-black pl-3 pr-7 py-1.5 rounded-2xl border border-slate-200 cursor-pointer focus:outline-none shadow-2xs transition"
              >
                <option value="week">Tuần này</option>
                <option value="last_week">Tuần trước</option>
                <option value="month">Tháng này</option>
                <option value="all">Tất cả</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 text-[#1e1b4b] pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {currentLeaderboardList.slice(0, 5).map((user) => (
              <div 
                key={user.rank}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-100/80 shadow-2xs hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className={`w-5 font-black text-sm text-center shrink-0 ${
                    user.rank === 1 ? 'text-[#eab308]' :
                    user.rank === 2 ? 'text-[#3b82f6]' :
                    user.rank === 3 ? 'text-[#f97316]' : 'text-[#94a3b8]'
                  }`}>
                    {user.rank}
                  </span>
                  <UserAvatar 
                    avatar={user.avatar} 
                    name={user.name} 
                    className="w-8 h-8 rounded-full border border-slate-200 shrink-0"
                  />
                  <span className="font-black text-slate-800 text-[13px] truncate">
                    {user.name}
                  </span>
                </div>
                <span className="font-black text-[#1e1b4b] text-[13px] shrink-0">
                  {user.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Button to open Modal matching Images 3, 4, 5 */}
          <button
            onClick={() => {
              audioService.playClickSound();
              setIsLeaderboardModalOpen(true);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer active:scale-98"
          >
            <Trophy size={16} />
            <span>Xem bảng xếp hạng</span>
          </button>
        </div>
      )}

      {/* Contextual Info Card for Sample Exams */}
      {activeTab === 'sample-exams' && (
        <div className="space-y-3">
          <div className="bg-[#f0f9ff] rounded-3xl p-4 border border-sky-100 shadow-2xs space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-2xl shadow-2xs">
              🐢
            </div>
            <h4 className="text-xs font-black text-slate-800">
              Đề cương & Thi mẫu:
            </h4>
            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
              Trang ôn tập toàn diện giúp bé chuẩn bị tốt nhất cho các bài kiểm tra học kỳ sắp tới. Hãy bắt đầu ôn tập từng Unit và thử sức thi mẫu nhé!
            </p>
          </div>

          <div className="bg-[#fffbeb] rounded-3xl p-4 border border-amber-200 shadow-2xs space-y-2 text-center">
            <h4 className="text-xs font-black text-amber-800 flex items-center justify-center gap-1">
              <span>🏆</span>
              <span>Phần thưởng thi mẫu</span>
            </h4>
            <p className="text-[11px] font-semibold text-amber-900 leading-relaxed">
              Làm đề thi mẫu để nhận thêm tới <strong className="text-amber-700">5 Sao vàng ⭐️</strong> và <strong className="text-cyan-700">10 Kim cương 💎</strong> bé nhé!
            </p>
          </div>
        </div>
      )}

      {/* Custom Widgets for Vocabulary View (activeTab === 'vocab') */}
      {activeTab === 'vocab' && (
        <div className="space-y-3 animate-fadeIn">
          {/* 1. Tiến độ hôm nay Card */}
          <div className="bg-[#f0f7ff] rounded-3xl p-4 border border-sky-200/80 shadow-2xs space-y-3">
            <h4 className="text-sm sm:text-base font-black text-slate-800 text-center tracking-tight">
              Tiến độ hôm nay
            </h4>

            {/* Circular Progress Ring */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-sky-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              {/* Top Blue Indicator Dot */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#0284c7] rounded-full border-2 border-white shadow-2xs"></div>
              <span className="absolute text-xl font-black text-[#0284c7]">0%</span>
            </div>

            {/* Stats Breakdown */}
            <div className="space-y-1.5 text-xs font-bold px-1.5 pt-1">
              <div className="flex items-center justify-between text-slate-500">
                <span>Đã học thuộc:</span>
                <span className="text-[#0284c7] font-black">0 từ</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Cần ôn lại:</span>
                <span className="text-[#8b5cf6] font-black">0 từ</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Chưa học:</span>
                <span className="text-slate-800 font-black">56 từ</span>
              </div>
            </div>
          </div>

          {/* 2. Ôn tập nhanh Card */}
          <div className="bg-[#fff7ed] rounded-3xl p-3.5 border border-amber-200/80 shadow-2xs space-y-2.5">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <span className="text-amber-500 text-base">⚡</span>
              <span>Ôn tập nhanh</span>
            </h4>

            <div className="space-y-2">
              {/* Option 1: Thẻ ghi nhớ */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  if (setActiveTab) setActiveTab('flashcards');
                }}
                className="w-full bg-[#eff6ff] hover:bg-blue-100/90 rounded-2xl p-2.5 flex items-center gap-2.5 border border-blue-100/90 transition text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0284c7] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-[#1d50b4] group-hover:text-blue-700 leading-tight">
                    Thẻ ghi nhớ (Flashcards)
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    Lật thẻ nhớ từ vựng
                  </div>
                </div>
              </button>

              {/* Option 2: Nghe & Chọn hình đúng */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  if (setActiveTab) setActiveTab('listening');
                }}
                className="w-full bg-[#eff6ff] hover:bg-blue-100/90 rounded-2xl p-2.5 flex items-center gap-2.5 border border-blue-100/90 transition text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-base shrink-0 shadow-2xs">
                  👂
                </div>
                <div>
                  <div className="text-xs font-black text-[#1d50b4] group-hover:text-blue-700 leading-tight">
                    Nghe & Chọn hình đúng
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    Luyện tai nghe tinh anh
                  </div>
                </div>
              </button>

              {/* Option 3: Ghép đôi */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  if (setActiveTab) setActiveTab('practice-ex');
                }}
                className="w-full bg-[#eff6ff] hover:bg-blue-100/90 rounded-2xl p-2.5 flex items-center gap-2.5 border border-blue-100/90 transition text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <Link size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-[#1d50b4] group-hover:text-blue-700 leading-tight">
                    Ghép đôi (Word Match)
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    Nối từ tiếng Anh với nghĩa
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Chơi cùng từ vựng Card */}
          <div className="bg-[#faf5ff] rounded-3xl p-3.5 border border-purple-200/80 shadow-2xs space-y-2.5">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <span className="text-purple-600 text-base">🎮</span>
              <span>Chơi cùng từ vựng</span>
            </h4>

            <div className="space-y-2">
              {/* Game 1: Tìm từ ẩn giấu */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  if (setActiveTab) setActiveTab('practice-ex');
                }}
                className="w-full bg-[#fdf2f8] hover:bg-pink-100/90 rounded-2xl p-2.5 flex items-center gap-2.5 border border-pink-200/80 transition text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <Search size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-[#db2777] group-hover:text-pink-800 leading-tight">
                    Tìm từ ẩn giấu (Word Hunt)
                  </div>
                  <div className="text-[10px] font-semibold text-pink-600/80 mt-0.5">
                    Tìm các từ theo hàng dọc/ngang
                  </div>
                </div>
              </button>

              {/* Game 2: Bong bóng từ */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  if (setActiveTab) setActiveTab('practice-ex');
                }}
                className="w-full bg-[#ecfeff] hover:bg-cyan-100/90 rounded-2xl p-2.5 flex items-center gap-2.5 border border-cyan-200/80 transition text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-[#0891b2] flex items-center justify-center text-base shrink-0 shadow-2xs">
                  🎈
                </div>
                <div>
                  <div className="text-xs font-black text-[#0891b2] group-hover:text-cyan-800 leading-tight">
                    Bong bóng từ (Word Bubble)
                  </div>
                  <div className="text-[10px] font-semibold text-cyan-700/80 mt-0.5">
                    Bắn vỡ bong bóng để ghép từ
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Info Cards for Reading Comprehension View (Matching Sample Image 3 100%) */}
      {activeTab === 'reading' && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* 1. Mẹo đọc bài hiệu quả Card */}
          <div className="bg-[#f0f4ff] rounded-3xl p-4 border border-blue-200 text-center space-y-2 shadow-2xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white p-1 border border-blue-200 shadow-2xs flex items-center justify-center text-2xl">
              🤖
            </div>
            <h4 className="text-xs sm:text-sm font-black text-indigo-950">Mẹo đọc bài hiệu quả</h4>
            <p className="text-[11px] font-bold text-indigo-900/80 leading-relaxed">
              Bé hãy bấm vào các <strong className="text-slate-900 font-extrabold">từ đơn màu đen</strong> để nghe phát âm chính xác từ đó. Bấm vào <strong className="text-purple-700 font-extrabold">nút loa 🔊 màu tím</strong> đầu câu để nghe đọc nguyên cả câu nhé!
            </p>
          </div>

          {/* 2. Thành tích luyện đọc Card */}
          <div className="bg-[#fffdf0] rounded-3xl p-4 border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs sm:text-sm">
              <span>✨</span>
              <span>Thành tích luyện đọc</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span>Bài đã đọc:</span>
                <span className="text-amber-800 font-extrabold">0 / 16 bài</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-amber-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[12%]"></div>
              </div>
            </div>

            <p className="text-[11px] font-bold text-amber-900/80 leading-snug">
              Bé đang học bài <strong className="text-slate-900 font-extrabold">Fun in the Playground</strong>. Hãy tiếp tục học các bài khác để mở khóa Sticker <strong className="text-slate-900 font-extrabold">Mọt Sách Chăm Chỉ 📚</strong> nhé!
            </p>
          </div>
        </div>
      )}

      {/* Contextual Info Cards for Grammar Tenses View (Matching Sample Image 3 100%) */}
      {activeTab === 'grammar-tenses' && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* 1. Chinh phục Ngữ pháp Card */}
          <div className="bg-white p-4 rounded-3xl border border-sky-200 shadow-2xs space-y-2">
            <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
              <span>⚙️</span>
              <span>Chinh phục Ngữ pháp</span>
            </h4>

            <div className="space-y-1.5 text-xs font-bold text-slate-700">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-600 font-semibold">Thì đã hoàn thành:</span>
                <span className="font-black text-sky-700">0/4</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900">
                <span className="text-slate-600 font-semibold">Sao đã nhận:</span>
                <span className="font-black text-amber-600">+0 Sao</span>
              </div>
            </div>
          </div>

          {/* 2. Khủng long Dino khuyên Card */}
          <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-3xl space-y-2 text-center shadow-2xs">
            <div className="w-12 h-12 bg-white rounded-full border-2 border-amber-300 mx-auto flex items-center justify-center text-2xl shadow-2xs">
              🦖
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-800">Khủng long Dino khuyên:</h4>
            <p className="text-[11px] font-bold text-slate-600 leading-snug">
              Hãy hoàn thành cả 4 Module để nắm vững các thì cơ bản trong tiếng Anh tiểu học nhé con yêu! 🦕🌟
            </p>
          </div>
        </div>
      )}

      {/* Contextual Info Cards for Daily Quotes View (Matching Sample Image 1 100%) */}
      {activeTab === 'daily-quotes' && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* 1. Thành tích hôm nay của bé Card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
              <span>🏆</span>
              <span>Thành tích hôm nay của bé</span>
            </h4>

            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-center justify-between p-2.5 bg-sky-50 rounded-2xl border border-sky-100 text-sky-900">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span>🎧</span>
                  <span>Câu đã nghe phát âm:</span>
                </span>
                <span className="font-black text-xs sm:text-sm text-slate-900">0/150</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span>🎙️</span>
                  <span>Câu đã phát âm đạt:</span>
                </span>
                <span className="font-black text-xs sm:text-sm text-emerald-800">0/150</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span>⭐</span>
                  <span>Sao đã nhận hôm nay:</span>
                </span>
                <span className="font-black text-xs sm:text-sm text-amber-600">+0 Sao</span>
              </div>
            </div>
          </div>

          {/* 2. Lời nhắn nhủ từ Dino Card */}
          <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] p-4 rounded-3xl space-y-2 flex items-start gap-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#059669] text-white flex items-center justify-center text-2xl shrink-0 shadow-xs">
              🦖
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-emerald-900">Lời nhắn nhủ từ Dino</h4>
              <p className="text-[11px] font-semibold text-emerald-800 leading-snug mt-1">
                "Mỗi ngày bé học 1-2 câu danh ngôn sẽ giúp vốn từ và sự tự tin của bé tăng vọt đấy!"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Info Cards for Speaking Practice View (Matching Sample Image 1 100%) */}
      {(activeTab === 'speaking' || activeTab === 'shadowing') && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* 1. Dino hướng dẫn phát âm Card */}
          <div className="bg-[#fefce8] border-2 border-[#fde047] rounded-3xl p-4 shadow-2xs text-center space-y-2 relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-2xs">
              🐊
            </div>

            <h4 className="text-xs sm:text-sm font-black text-amber-900">
              Dino hướng dẫn phát âm
            </h4>

            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
              Nhấp 🔊 để nghe Dino đọc mẫu chuẩn Mỹ. Sau đó nhấp 🎙️, ghé sát micro và đọc thật to từ{' '}
              <span className="font-black text-amber-900">doll</span> nhé!
            </p>
          </div>

          {/* 2. Huấn luyện phát âm Card */}
          <div className="bg-[#faf5ff] border-2 border-[#e9d5ff] rounded-3xl p-4 shadow-2xs space-y-2">
            <h4 className="text-xs sm:text-sm font-black text-purple-900 flex items-center gap-1.5">
              <span>🏆</span>
              <span>Huấn luyện phát âm</span>
            </h4>

            <div className="space-y-2 text-xs font-bold text-slate-700 pt-1">
              <div className="flex justify-between items-center border-b border-purple-100 pb-1.5">
                <span className="text-slate-600 font-semibold">Đã nói đúng:</span>
                <span className="font-black text-purple-900">0 từ/câu</span>
              </div>

              <div className="flex justify-between items-center border-b border-purple-100 pb-1.5">
                <span className="text-slate-600 font-semibold">Điểm sao tích lũy:</span>
                <span className="font-black text-amber-500">+0 ⭐</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Mức độ tự tin:</span>
                <span className="font-black text-purple-700 flex items-center gap-1">
                  <span>Khá tốt</span>
                  <span className="text-amber-500">⚡</span>
                </span>
              </div>
            </div>
          </div>

          {/* 3. Lịch sử 135 câu Card */}
          <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-3xl p-4 shadow-2xs space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-emerald-900 flex items-center gap-1.5">
              <span>📖</span>
              <span>Lịch sử 135 câu</span>
            </h4>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="text-slate-600 font-semibold">Đã luyện đúng:</span>
              <span className="font-black text-emerald-800">0 / 135 câu</span>
            </div>

            <button
              onClick={() => {
                audioService.playClickSound();
                setShowSpeakingHistoryModal(true);
              }}
              className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-white font-black py-2.5 px-4 rounded-2xl text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Search size={14} />
              <span>Lịch sử chi tiết</span>
            </button>
          </div>
        </div>
      )}

      {/* Contextual Info Card for Practice Exercises */}
      {activeTab === 'practice-ex' && (
        <div className="bg-[#fdf2f8] rounded-3xl p-4 border border-pink-100 shadow-2xs space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-2xl shadow-2xs">
            🐢
          </div>
          <h4 className="text-xs font-black text-slate-800">
            Bài tập ôn tập:
          </h4>
          <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
            Các bài tập tương tác như Tìm ô chữ, Sắp xếp chữ cái, và Lật hình trí nhớ giúp bé khắc sâu kiến thức từ vựng cực kỳ dễ nhớ!
          </p>
        </div>
      )}

      {/* Contextual Info Cards for Flashcard View (Matching Sample Image 1 100%) */}
      {activeTab === 'flashcards' && (
        <div className="space-y-3">
          {/* Kido mách nhỏ Card */}
          <div className="bg-[#fffbeb] rounded-3xl p-4 border border-amber-200/80 shadow-xs text-center space-y-2.5 relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 p-1 flex items-center justify-center text-3xl shadow-sm border border-emerald-200">
              🦖
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-800">
              Kido mách nhỏ:
            </h4>
            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
              Khi lật mặt sau, bé nhớ đọc to ví dụ tiếng Anh để luyện nói và nhớ lâu hơn nhé!
            </p>
          </div>

          {/* Phát âm tiếng Anh Card */}
          <div className="bg-white rounded-3xl p-4 border border-sky-100 shadow-2xs text-center space-y-2.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-800">
              Phát âm tiếng Anh
            </h4>
            <button
              onClick={() => {
                audioService.playClickSound();
                audioService.speakEnglish("Hello! Let's practice English flashcards together!");
              }}
              className="w-12 h-12 mx-auto rounded-full bg-[#3b82f6] hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
              title="Phát âm tiếng Anh"
            >
              <Volume2 size={22} />
            </button>
            <p className="text-[11px] font-bold text-slate-500">
              Bấm để nghe giọng chuẩn
            </p>
          </div>
        </div>
      )}

      {/* Contextual Info Card for Roadmap View */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3">
          {/* Thành tích của Bé Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>🏆</span>
              <span>Thành tích của Bé</span>
            </h4>
            <div className="space-y-1.5 text-[11px] font-bold text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Khối lớp hiện tại:</span>
                <span className="text-slate-800 font-black">Lớp 1 🎒</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Hoàn thành:</span>
                <span className="text-emerald-600 font-black">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Tổng số Sao:</span>
                <span className="text-amber-600 font-black">⭐ 243</span>
              </div>
            </div>
          </div>

          {/* Kido mách nhỏ Card */}
          <div className="bg-[#f0fdf4] rounded-3xl p-4 border border-emerald-200/80 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-lg shadow-2xs shrink-0">
                🦖
              </div>
              <h4 className="text-xs font-black text-emerald-900">
                Kido mách nhỏ
              </h4>
            </div>
            <p className="text-[11px] font-semibold text-emerald-800/90 leading-relaxed">
              Các Unit có huy hiệu tập luyện <strong className="text-emerald-950 font-extrabold">✨</strong> cho phép bé bấm vào để ôn tập lại ngắt quãng đấy! Càng ôn bài bé càng nhớ lâu!
            </p>
          </div>
        </div>
      )}

      {/* Contextual Info Card for Grade View */}
      {activeTab?.startsWith('grade-') && (() => {
        const gradeNum = parseInt(activeTab.replace('grade-', ''), 10) || 2;
        return (
          <div className="space-y-3">
            {/* Bé học rất tốt Card */}
            <div className="bg-[#fffbeb] rounded-3xl p-4 border border-amber-200 shadow-xs text-center space-y-2 relative overflow-hidden">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 p-1 flex items-center justify-center text-3xl shadow-sm border border-emerald-200">
                🐊
              </div>
              <h4 className="text-sm font-black text-slate-800">
                Bé học rất tốt!
              </h4>
              <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                Hoàn thành các bài học Lớp {gradeNum} - KNTT để tích lũy thật nhiều <strong className="text-amber-600">ngôi sao ⭐️</strong> và cúp vàng nhé bé yêu!
              </p>
              <button
                onClick={() => {
                  audioService.playClickSound();
                  onTriggerNotification('⚡ Học từ vựng', `Bắt đầu học từ vựng Lớp ${gradeNum} - Kết Nối Tri Thức!`);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#facc15] hover:bg-[#eab308] text-amber-950 font-black text-xs shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡</span>
                <span>Học từ vựng ngay</span>
              </button>
            </div>

            {/* Thông tin học lực Card */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-xs font-black text-slate-800">
                Thông tin học lực
              </h4>
              <p className="text-[11px] font-bold text-slate-700">
                Bài học Lớp {gradeNum} - KNTT:{gradeNum === 4 ? 21 : (gradeNum === 3 || gradeNum === 5 ? 20 : 16)} bài học lớn
              </p>
              <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full animate-pulse" />
              </div>
            </div>
          </div>
        );
      })()}
      {activeTab === 'settings' && (
        <div className="bg-sky-50/70 rounded-3xl p-3.5 border border-sky-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#1d50b4] font-black text-xs">
            <span>⚙️</span>
            <span>Tùy chỉnh góc cá nhân</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
            Hãy điều chỉnh tốc độ đọc và giọng đọc phù hợp với tai nghe của bé để bé có thể phát âm theo thật giống nhé!
          </p>
        </div>
      )}

      {/* Contextual Info Card for Theme Settings */}
      {activeTab === 'theme-settings' && (
        <div className="bg-purple-50/70 rounded-3xl p-3.5 border border-purple-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-700 font-black text-xs">
            <span>🎨</span>
            <span>Chủ đề hiển thị</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
            Bé hãy chọn một tông màu yêu thích nhé! Giao diện học tập sẽ ngay lập tức đổi theo ý thích của bé đó! 🌟
          </p>
        </div>
      )}

      {/* Contextual Info Card for Journal */}
      {activeTab === 'journal' && (
        <div className="space-y-3">
          <div className="bg-emerald-50/70 rounded-3xl p-3.5 border border-emerald-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-xs">
              <span>🐢</span>
              <span>Kido gợi ý bé:</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
              Bé học từ mới nào có thể note lại kèm hình ảnh minh họa cho dễ nhớ nha! Hoặc bố mẹ lưu giữ video phát âm dễ thương của bé để theo dõi tiến bộ hằng ngày!
            </p>
          </div>

          <div className="bg-sky-50/70 rounded-3xl p-3.5 border border-sky-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#1d50b4] font-black text-xs">
              <span>☁️</span>
              <span>Dữ liệu đám mây</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
              🟢 Bé đang đăng nhập (Cao Quốc Minh). Nhật ký sẽ được đồng bộ an toàn lên cơ sở dữ liệu <strong className="font-extrabold text-slate-800">Google Firebase Cloud</strong> riêng biệt.
            </p>
          </div>
        </div>
      )}

      {/* Contextual Info Card for Parent Corner */}
      {activeTab === 'parent-corner' && (
        <div className="space-y-3">
          <div className="bg-sky-50/70 rounded-3xl p-3.5 border border-sky-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#1d50b4] font-black text-xs">
              <span>🔗</span>
              <span>Thông tin kết nối</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-600 space-y-1">
              <p>Dự án: <span className="font-bold text-slate-800">english-hu-hmc</span></p>
              <p>Database: <span className="font-extrabold text-emerald-600">Firestore Active</span></p>
              <p>Storage: <span className="font-extrabold text-emerald-600">Storage Bucket OK</span></p>
            </div>
          </div>

          <div className="bg-amber-50/70 rounded-3xl p-3.5 border border-amber-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-black text-xs">
              <span>💡</span>
              <span>Tính năng tối ưu</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
              Hệ thống tự động so khớp từ vựng cũ bé đã học trong Firestore để lọc bỏ, giúp tiết kiệm đến 90% lượng token khi gọi Gemini.
            </p>
          </div>
        </div>
      )}

      {/* Contextual Card for Reports */}
      {(activeTab === 'reports' || activeTab === 'report') && (
        <div className="space-y-3">
          {/* Sub-tab 2: MAP -> Huy hiệu lớp học Card (Image 2) */}
          {reportSubTab === 'map' && (
            <div className="bg-white rounded-3xl p-4 border border-sky-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className="text-amber-500">💡</span>
                <span>Huy hiệu lớp học</span>
              </h4>
              <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                Tích lũy bài học của lớp học này để kích hoạt huy hiệu vinh danh đặc quyền:
              </p>
              <div className="space-y-2 text-[11px] font-extrabold">
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-900">
                  <span className="text-base">🌱</span>
                  <div>
                    <div className="font-black">Khởi đầu hứng khởi</div>
                    <div className="text-[10px] font-bold text-emerald-600">Đạt được (Hoàn thành 25%)</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center gap-2 text-sky-900">
                  <span className="text-base">🛡️</span>
                  <div>
                    <div className="font-black">Hiệp sĩ trí thức</div>
                    <div className="text-[10px] font-bold text-sky-600">Cần hoàn thành 50% lớp</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
                  <span className="text-base">👑</span>
                  <div>
                    <div className="font-black">Nhà vô địch khối lớp</div>
                    <div className="text-[10px] font-bold text-slate-500">Cần hoàn thành 100% lớp</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 3: PARENT -> Tiến độ đồng hành & Lối tắt nhanh Cards (Images 3, 4, 5) */}
          {reportSubTab === 'parent' && (
            <div className="space-y-3">
              <div className="bg-white rounded-3xl p-4 border border-teal-200/80 shadow-xs space-y-2.5">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span className="text-teal-600">📉</span>
                  <span>Tiến độ đồng hành</span>
                </h4>
                <div className="flex items-center justify-between text-xs font-black text-slate-700">
                  <span>Đã hoàn thành:</span>
                  <span className="text-teal-600">0/22 mốc</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-0" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 text-right">0% hành trình</p>
              </div>

              <div className="bg-amber-50/80 rounded-3xl p-4 border border-amber-200/80 shadow-xs space-y-2">
                <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Kido nhắn nhủ ba mẹ:</span>
                </h4>
                <p className="text-[11px] font-semibold italic text-amber-800 leading-relaxed">
                  "Học cùng con không chỉ là dạy học, mà là cùng tạo ra tiếng cười và kỷ niệm đẹp. Ba mẹ hãy cười thật nhiều và đập tay ăn mừng mỗi nỗ lực của con nha! ❤️"
                </p>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Lối tắt nhanh</span>
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      audioService.playClickSound();
                      onTriggerNotification('📙 Lộ trình bài học', 'Đã chuyển sang Lộ trình bài học của con!');
                    }}
                    className="w-full py-2 px-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer text-center"
                  >
                    📙 Lộ trình bài học của con
                  </button>

                  <button
                    onClick={() => {
                      audioService.playClickSound();
                      onTriggerNotification('🛡️ Phụ huynh', 'Đã mở Góc Phụ Huynh quản lý!');
                    }}
                    className="w-full py-2 px-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-[#1d50b4] border border-sky-200 font-black text-xs shadow-xs transition active:scale-95 cursor-pointer text-center"
                  >
                    🛡️ Góc Phụ Huynh quản lý
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 4: TIPS -> Lời khuyên phụ huynh Card (Image 6) */}
          {reportSubTab === 'tips' && (
            <div className="bg-emerald-50/80 rounded-3xl p-4 border border-emerald-200/80 shadow-xs space-y-2">
              <h4 className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                <span>🏠</span>
                <span>Lời khuyên phụ huynh</span>
              </h4>
              <p className="text-[11px] font-semibold text-emerald-800 leading-relaxed">
                Hãy giúp bé biến việc học thành niềm vui khám phá bằng cách khuyến khích bé giải thích lại các thẻ ghi nhớ (Flashcards) đã học trong tuần này!
              </p>
            </div>
          )}

          {/* Sub-tab 1: OVERVIEW -> Default Cards (Image 1) */}
          {reportSubTab === 'overview' && (
            <>
              {/* AI Mascot Khuyên Bé Card (Matching Image 1) */}
              <div className="bg-[#fffdf0] rounded-[28px] p-4 sm:p-5 border-2 border-[#fcd34d] shadow-xs space-y-3.5 relative overflow-hidden transition hover:shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-100 border border-amber-300/80 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                    🦖
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#78350f] tracking-tight">
                    AI Mascot khuyên bé:
                  </h4>
                </div>

                {/* Speech Bubble Box */}
                <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-2xs relative text-slate-800 text-xs sm:text-sm font-bold leading-relaxed">
                  <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white rotate-45 border-t border-l border-amber-200/80" />
                  <p className="text-slate-800 font-extrabold relative z-10 leading-relaxed">
                    "Chào bé <span className="text-[#78350f] font-black">{userName || 'Minh'}</span>! Tuần này bé học rất chăm chỉ đó nha, thuộc <span className="text-[#ea580c] font-black">3 từ vựng mới</span> rồi nè! Tớ khuyên bé nên luyện nói (Speaking) thêm 5 phút mỗi ngày để phát âm thật chuẩn như người bản xứ nhé! Chúng mình cùng cố lên! 🚀"
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    audioService.playClickSound();
                    if (setActiveTab) setActiveTab('practice-ex');
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#d97706] hover:to-[#ea580c] text-white font-black text-sm sm:text-base shadow-md shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Luyện Nói Ngay!</span>
                  <Mic size={18} className="shrink-0" />
                </button>
              </div>

              {/* Mục tiêu tuần này Card */}
              <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Mục tiêu tuần này</span>
                </h4>
                <div className="space-y-2 text-[11px] font-extrabold text-slate-700">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span>✅ Học 5 bài mới</span>
                    <span>(5/5)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span>✅ Thuộc 15 từ vựng</span>
                    <span>(15/15)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                    <span>🌟 Tích lũy 200 Sao</span>
                    <span>(248/200)</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Leaderboard Detailed Full Modal (Images 3, 4, 5) */}
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        userName={userName}
        userAvatar={userAvatar}
        accounts={accounts}
      />

      {/* Check-In Success Popup Modal (Matching reference image 100%) */}
      {showCheckInSuccessModal && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowCheckInSuccessModal(false)}
        >
          <div 
            className="bg-white rounded-[32px] border-4 border-dashed border-[#2563eb] p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 transform transition-all duration-300 scale-100 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Dotted Mint Badge with Trophy Icon */}
            <div className="w-20 h-20 rounded-full bg-[#e6f4ea] border-2 border-dashed border-[#10b981] flex items-center justify-center mx-auto shadow-inner">
              <div className="w-12 h-12 rounded-full bg-[#10b981]/15 flex items-center justify-center text-[#059669]">
                <Trophy size={32} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
                <span>Tuyệt vời ông mặt trời</span>
                <span className="text-amber-400">🌟</span>
              </h3>
              
              <p className="text-sm sm:text-base font-bold text-slate-500 leading-relaxed px-2">
                Chúc mừng bé đã điểm danh nhận thưởng thành công <span className="text-amber-500 font-extrabold">+5 Sao vàng & +5 Điểm XP! 🌟</span> Hãy tiếp tục thói quen học tập mỗi ngày nhé!
              </p>
            </div>

            {/* Confirm Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setShowCheckInSuccessModal(false);
                }}
                className="px-8 py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-blue-500/30 transition duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Đồng ý</span>
                <ArrowRight size={20} className="stroke-[3]" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Speaking History Detail Modal */}
      {showSpeakingHistoryModal && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowSpeakingHistoryModal(false)}
        >
          <div 
            className="bg-white rounded-[32px] p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Search size={18} className="text-cyan-600" />
                <span>Lịch Sử Luyện Nói Tiếng Anh AI</span>
              </h3>
              <button
                onClick={() => setShowSpeakingHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              <div className="text-center py-8 text-slate-400 font-bold text-xs space-y-1">
                <p>Bé chưa có lịch sử luyện tập nào trong phiên này.</p>
                <p>Hãy bấm Micro và trổ tài nói ngay nhé!</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSpeakingHistoryModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
