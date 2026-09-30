import React, { useState } from 'react';
import { Star, Flame, LogOut, Wifi, Lock, Shield, Bell, Mic } from 'lucide-react';
import { UserProfile, Language, ActiveTab, AppNotification } from '../types';
import { audioService } from '../utils/audio';
import { hasGradeAccess, formatAllowedGradesText } from '../utils/permissions';
import { UserAvatar } from './UserAvatar';
import { useLanguage } from '../context/LanguageContext';
import { getUserLevelAndXp } from '../utils/levelSystem';
import { NotificationCenterModal } from './NotificationCenterModal';

interface HeaderProps {
  user: UserProfile;
  lang?: Language;
  setLang?: (lang: Language) => void;
  isOnline: boolean;
  onToggleOnline?: () => void;
  onLogout: () => void;
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  onTriggerNotification?: (title: string, message: string) => void;
  notifications?: AppNotification[];
  unreadCount?: number;
  onMarkAllAsRead?: () => void;
  onClearAllNotifications?: () => void;
  onMarkNotificationAsRead?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isOnline,
  onToggleOnline,
  onLogout,
  activeTab,
  setActiveTab,
  onTriggerNotification,
  notifications = [],
  unreadCount = 0,
  onMarkAllAsRead,
  onClearAllNotifications,
  onMarkNotificationAsRead,
}) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showNotifModal, setShowNotifModal] = useState<boolean>(false);
  const { lang, toggleLang, t } = useLanguage();

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-1 px-1 mb-4 select-none min-w-0">
        {/* Left Welcome Message / Grade Heading */}
        <div className="min-w-0 flex-1">
          {activeTab && activeTab.startsWith('grade-') ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
                <span>{t(`Lộ trình học: Lớp ${activeTab.replace('grade-', '')} - Kết Nối Tri Thức`, `Learning Path: Grade ${activeTab.replace('grade-', '')} Curriculum`)} 🎒</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Cùng Kido phiêu lưu qua các bài giảng tiếng Anh thú vị!', 'Embark on exciting English lesson adventures with Kido!')}
              </p>
            </div>
          ) : activeTab === 'listening-speaking-img' ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
                <span>{t('Hình ảnh luyện nghe và nói', 'Image Listening and Speaking')} 🖼️ 🎙️</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Bé hãy tải ảnh sách hoặc từ vựng lên để luyện tập nghe & nói cùng Kido nhé!', 'Upload book images or vocabulary to practice listening & speaking with Kido!')}
              </p>
            </div>
          ) : activeTab === 'reading-writing-img' ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
                <span>{t('Hình ảnh luyện đọc và viết', 'Image Reading and Writing')} 🖼️ ✍️</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Cùng luyện tập kĩ năng đọc hiểu & viết từ vựng tiếng Anh qua hình ảnh sinh động!', 'Practice reading comprehension & vocabulary writing through vivid images!')}
              </p>
            </div>
          ) : activeTab === 'task-station' ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
                <span>{t('Trạm Nhiệm Vụ', 'Task Station')} 🎯 ⚡</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Hoàn thành các nhiệm vụ tư duy tuyến tính hàng ngày để nhận nhiều sao thưởng!', 'Complete daily linear thinking tasks to earn bonus stars!')}
              </p>
            </div>
          ) : activeTab === 'roadmap' ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
                <span>{t('Bản đồ lộ trình học tập', 'Learning Roadmap Map')}</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Lần theo bản đồ uốn lượn để chinh phục các Unit cùng Kido!', 'Follow the winding map to conquer Units with Kido!')}
              </p>
            </div>
          ) : activeTab === 'practice-ex' ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
                <span>{t('Bài tập ôn tập', 'Practice Exercises')} 📝</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Bé chọn lớp học và bài giảng tương ứng để bắt đầu ôn tập từ vựng bằng trò chơi nhé!', 'Choose your grade and lesson to start reviewing vocabulary with fun games!')}
              </p>
            </div>
          ) : activeTab === 'sample-exams' ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#1d50b4] tracking-tight">
                <span>{t('Đề cương & Thi mẫu Giữa Học Kỳ I 🌸', 'Outline & Sample Exams Midterm I 🌸')}</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Chương trình ôn tập toàn diện cho bé học sinh Lớp 1 - Kết Nối Tri Thức 🎒', 'Comprehensive review program for Grade 1 students - Connecting Knowledge 🎒')}
              </p>
            </div>
          ) : activeTab === 'reports' ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
                <span>{t(`Báo cáo Lộ trình học tập của ${user.name}`, `Learning Progress Report for ${user.name}`)} 🚀</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Góc đồng hành và theo dõi sự phát triển tiếng Anh của bé yêu', "Companion section to track your child's English growth")}
              </p>
            </div>
          ) : activeTab === 'vocab' ? (
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#1e1b4b] tracking-tight flex items-center gap-2">
                <span>{t('Từ vựng của Bé', "Kid's Vocabulary")}</span>
                <span className="inline-flex items-center justify-center bg-[#ff3b60] text-white font-black px-2 py-0.5 rounded-lg text-xs sm:text-sm shadow-2xs">
                  A
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Học từ mới mỗi ngày - Hiểu nghĩa, ghi nhớ dễ dàng!', 'Learn new words every day - Understand meanings, remember easily!')}
              </p>
            </div>
          ) : activeTab === 'flashcards' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center text-xl shadow-2xs shrink-0 border border-sky-200/80">
                📑
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1e293b] tracking-tight">
                  {t('Học Flash Card', 'Flashcard Learning')}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                  {t('Chọn bài học để bắt đầu ôn luyện từ vựng qua hình ảnh sinh động!', 'Choose a lesson to start practicing vocabulary with vivid images!')}
                </p>
              </div>
            </div>
          ) : activeTab === 'quiz' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center text-xl shadow-2xs shrink-0 border border-sky-200/80">
                🧩
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1e293b] tracking-tight">
                  {t('Đố vui Tiếng Anh', 'English Quiz')}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                  {t('Chọn bài học để kiểm tra kiến thức và ghi điểm cùng Kido nhé!', 'Choose a lesson to test your knowledge and score points with Kido!')}
                </p>
              </div>
            </div>
          ) : activeTab === 'listening' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center text-xl shadow-2xs shrink-0 border border-sky-200/80">
                🎧
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1e293b] tracking-tight">
                  {t('Luyện nghe tiếng Anh', 'English Listening Practice')}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                  {t('Lắng nghe Kido phát âm chuẩn Mỹ và vượt qua thử thách học tập dễ thương!', 'Listen to Kido standard American pronunciation and conquer challenges!')}
                </p>
              </div>
            </div>
          ) : (activeTab === 'speaking' || activeTab === 'shadowing') ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center text-xl shadow-2xs shrink-0 border border-sky-200/80">
                🎙️
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#0284c7] tracking-tight flex items-center gap-2">
                  <span>{t('Luyện phát âm chuẩn AI', 'AI Pronunciation Practice')}</span>
                  <Mic size={22} className="text-[#0284c7] fill-[#0284c7] inline-block" />
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                  {t('Bé nghe Dino đọc trước rồi ấn vào chiếc Micro để tự tin trổ tài nói theo nhé!', 'Listen to Dino first, then press the Microphone to confidently try speaking along!')}
                </p>
              </div>
            </div>
          ) : activeTab === 'story' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl shadow-2xs shrink-0 border border-sky-300">
                📖
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#0f172a] tracking-tight flex items-center gap-2">
                  <span>{t('Đọc Truyện Story Cùng Dino', 'Read Stories with Dino')}</span>
                  <span>📖</span>
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                  {t('Cùng Dino khám phá những câu chuyện tiếng Anh hấp dẫn và tích lũy từ vựng nhé!', 'Explore exciting English stories with Dino and build vocabulary!')}
                </p>
              </div>
            </div>
          ) : activeTab === 'reading' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl shadow-2xs shrink-0 border border-blue-300">
                📖
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1e1b4b] tracking-tight">
                  {t('Luyện đọc hiểu tiếng Anh', 'English Reading Comprehension')}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                  {t('Bấm chọn từ để nghe cách phát âm, bấm bật để dịch nghĩa cả câu bé nhé!', 'Click a word to hear pronunciation, click toggle to translate full sentence!')}
                </p>
              </div>
            </div>
          ) : activeTab === 'grammar-tenses' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl shadow-2xs shrink-0 border border-sky-300">
                📖
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1e1b4b] tracking-tight">
                  {t('Kiến Thức Các Thì Tiếng Anh', 'English Grammar Tenses')}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                  {t('Bé hãy khám phá lộ trình học các thì tiếng Anh căn bản và rèn luyện cùng Dino nhé!', 'Explore basic English tenses and practice with Dino!')}
                </p>
              </div>
            </div>
          ) : activeTab === 'daily-quotes' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8247ff] text-white flex items-center justify-center text-xl shadow-2xs shrink-0 border border-purple-300/80">
                💬
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1e1b4b] tracking-tight">
                  {t('Câu Nói Mỗi Ngày', 'Daily Quotes')}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 whitespace-normal break-words leading-snug">
                  {t('Mỗi ngày học một câu nói hay tiếng Anh giúp bé tự tin, tràn đầy năng lượng và phát âm chuẩn bản xứ nhé!', 'Learn a great English quote every day to help your child be confident, full of energy and native pronunciation!')}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#1e1b4b] tracking-tight">
                  {t('Xin chào,', 'Hello,')} <span className="text-[#2563eb]">{user.name}</span>
                </h2>
                {user.role === 'admin' ? (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100/80 text-[#1d4ed8] font-black text-[10px] sm:text-[11px] border border-blue-200 shrink-0 whitespace-nowrap inline-flex items-center gap-1">
                    <Shield size={12} className="text-[#1d4ed8]" /> Admin
                  </span>
                ) : user.role === 'parent' ? (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100/80 text-purple-900 font-black text-[10px] sm:text-[11px] border border-purple-200 shrink-0 whitespace-nowrap">
                    👨‍👩‍👧 {t('Phụ Huynh', 'Parent')}
                  </span>
                ) : null}
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 whitespace-normal break-words leading-snug">
                {t('Hôm nay bé muốn học gì nào?', 'What would you like to learn today?')}
              </p>
            </div>
          )}
        </div>

        {/* Right User Badges & Actions - Compact & Balanced with XP Progress */}
        {activeTab !== 'reading' && (() => {
          const { level, xp: currentXp, maxXp, percent: xpPercent } = getUserLevelAndXp(user.stars, user.level, user.xp);

          return (
            <div className="flex items-center flex-nowrap gap-1.5 sm:gap-2 shrink-0 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              {/* Level Badge with EXP Progress */}
              <div 
                className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-full bg-[#eef5ff] border-2 border-dashed border-[#a0c8ff] flex items-center gap-1.5 shrink-0 select-none cursor-help"
                title={t(`Điểm kinh nghiệm: ${currentXp}/${maxXp} XP (Sao). Đạt đủ ${maxXp} Sao để lên Cấp độ tiếp theo!`, `Experience Points: ${currentXp}/${maxXp} Stars. Reach ${maxXp} Stars to level up!`)}
              >
                <span className="text-base sm:text-lg shrink-0 leading-none">🏆</span>
                <div className="flex flex-col items-start justify-center leading-none gap-0.5">
                  <span className="font-black text-xs text-[#1d4ed8] leading-tight whitespace-nowrap">
                    {t(`Cấp độ ${level}`, `Level ${level}`)}
                  </span>
                  <div className="w-14 sm:w-18 h-1.5 bg-blue-100 rounded-full overflow-hidden border border-blue-200/60 relative">
                    <div 
                      className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-blue-600 font-extrabold leading-none tracking-tight">
                    {currentXp}/{maxXp} XP
                  </span>
                </div>
              </div>

              {/* Stars Badge */}
              <div className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-[#fffdf0] text-[#b45309] border-2 border-dashed border-[#fcd34d] font-black text-xs flex items-center gap-1 whitespace-nowrap shrink-0 select-none">
                <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b] shrink-0" />
                <span>{user.stars}</span>
              </div>

              {/* Streak Flame Badge */}
              <div className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-[#fdf2f8] text-[#be185d] border-2 border-dashed border-[#f472b6] font-black text-xs flex items-center gap-1 whitespace-nowrap shrink-0 select-none">
                <Flame className="w-3.5 h-3.5 text-[#f43f5e] fill-[#f43f5e] shrink-0" />
                <span>{user.streakDays} {t('ngày', 'days')}</span>
              </div>

              {/* Notification Bell Badge Button */}
              <div className="relative shrink-0 flex items-center">
                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setShowNotifModal(true);
                  }}
                  title={t('Xem lịch sử thông báo', 'View notification history')}
                  className="h-8 sm:h-9 w-8 sm:w-9 rounded-full bg-[#f0f9ff] hover:bg-[#e0f2fe] text-[#0284c7] border-2 border-dashed border-[#38bdf8] flex items-center justify-center relative cursor-pointer transition transform hover:scale-105 active:scale-95 shadow-2xs"
                >
                  <Bell className="w-4 h-4 text-[#0284c7]" />
                  {(unreadCount || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                      {(unreadCount || 0) > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Avatar */}
              <div className="relative shrink-0 flex items-center">
                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setShowProfileModal(true);
                  }}
                  title={t("Xem thông tin cá nhân của bé", "View Kid Profile")}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#2563eb] hover:border-amber-400 p-0.5 overflow-hidden shadow-2xs shrink-0 cursor-pointer transition transform hover:scale-105 active:scale-95 flex items-center justify-center bg-sky-50"
                >
                  <UserAvatar avatar={user.avatar} name={user.name} className="w-full h-full rounded-full" />
                </button>
                {user.isVip && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 bg-amber-400 text-slate-900 text-[8px] font-black px-1 rounded-full border border-white shadow-2xs select-none pointer-events-none"
                    title="Tài khoản VIP"
                  >
                    👑
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-black text-xs shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>{t('Thoát', 'Exit')}</span>
              </button>
            </div>
          );
        })()}
      </header>

      {/* Modal: Profile info */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] border-2 border-dashed border-blue-400 p-6 sm:p-7 max-w-xs sm:max-w-sm w-full text-center shadow-2xl relative animate-scaleUp font-sans select-none">
            <div className="relative mx-auto w-20 h-20 mb-3">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-400 p-1 flex items-center justify-center bg-emerald-50/50 shadow-xs">
                <UserAvatar avatar={user.avatar} name={user.name} className="w-full h-full rounded-full" />
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight mb-2">
              {t('Kido nhắn bé', 'Message from Kido')}
            </h3>

            <div className="text-xs sm:text-sm font-semibold text-slate-600 space-y-1.5 my-4 inline-block text-left w-full">
              <p className="text-slate-500 font-bold mb-1 text-center">{t('Thông tin cá nhân của Bé:', 'Kid Profile Information:')}</p>
              
              {/* Ảnh 2: VIP Badge khi là tài khoản VIP */}
              {user.isVip && (
                <div className="flex items-center justify-center my-2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs shadow-xs border border-amber-300">
                    <span className="text-sm">👑</span>
                    <span className="tracking-wider">VIP</span>
                  </div>
                </div>
              )}

              <p className="flex items-center gap-1.5"><span className="text-slate-400">-</span> <span>{t('Họ Tên:', 'Name:')} <strong className="text-slate-800">{user.name}</strong></span></p>
              <p className="flex items-center gap-1.5"><span className="text-slate-400">-</span> <span>{t('Tài khoản:', 'Username:')} <strong className="text-slate-800">{user.username || 'quocminh'}</strong></span></p>
              <p className="flex items-center gap-1.5"><span className="text-slate-400">-</span> <span>{t('Số sao tích lũy:', 'Accumulated Stars:')} <strong className="text-slate-800">{user.stars}</strong> 🌟</span></p>
              <p className="flex items-center gap-1.5"><span className="text-slate-400">-</span> <span>{t('Cấp độ hiện tại:', 'Current Level:')} <strong className="text-slate-800">{t(`Cấp độ ${user.level}`, `Level ${user.level}`)}</strong></span></p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setShowProfileModal(false);
                }}
                className="w-full sm:w-auto px-8 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-md transition transform hover:scale-105 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>{t('Đồng ý', 'OK')}</span>
                <span className="text-base font-black">➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotifModal}
        onClose={() => setShowNotifModal(false)}
        notifications={notifications}
        onMarkAllAsRead={() => onMarkAllAsRead && onMarkAllAsRead()}
        onClearAll={() => onClearAllNotifications && onClearAllNotifications()}
        onMarkAsRead={(id) => onMarkNotificationAsRead && onMarkNotificationAsRead(id)}
        onSelectActionTab={(tab) => {
          if (setActiveTab) setActiveTab(tab as ActiveTab);
        }}
      />
    </>
  );
};

