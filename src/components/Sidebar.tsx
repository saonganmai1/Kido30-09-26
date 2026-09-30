import React, { useState } from 'react';
import { 
  Home, 
  GraduationCap, 
  Zap, 
  Grid2X2, 
  Lightbulb, 
  Wrench, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Map, 
  Headphones, 
  Pencil, 
  FileSpreadsheet, 
  BarChart2, 
  Languages, 
  Layers, 
  Puzzle, 
  Mic, 
  BookOpen, 
  MessageCircle, 
  BookMarked, 
  Brain, 
  Video, 
  Gamepad2, 
  Trophy, 
  Target,
  ShieldCheck, 
  Calendar, 
  Palette, 
  Settings,
  PenTool,
  Menu,
  X,
  Shield,
  Lock,
  Wifi,
  FileImage,
  RefreshCw
} from 'lucide-react';
import { ActiveTab, Language, UserRole } from '../types';
import { audioService } from '../utils/audio';
import { hasGradeAccess } from '../utils/permissions';
import { useLanguage } from '../context/LanguageContext';
import { subscribeSyncStatus } from '../lib/firebaseSync';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang?: Language;
  trialTimeSeconds: number;
  userRole?: UserRole;
  isVip?: boolean;
  vipExpiryDate?: string;
  allowedGrades?: string[];
  userName?: string;
  isOnline?: boolean;
  onToggleOnline?: () => void;
  onTriggerNotification?: (title: string, message: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  trialTimeSeconds,
  userRole = 'kid',
  isVip,
  vipExpiryDate,
  allowedGrades,
  userName,
  isOnline = true,
  onToggleOnline,
  onTriggerNotification,
}) => {
  const { lang, t } = useLanguage();

  // Determine initial open menu based strictly on current activeTab (only 1 menu open at a time)
  const isRoadmapTab = (activeTab ? activeTab.startsWith('grade-') : false) || ['roadmap', 'listening-speaking-img', 'reading-writing-img', 'speaking-topic-ai', 'writing-topic-ai', 'practice-ex', 'sample-exams', 'reports'].includes(activeTab);
  const isSkillsTab = ['vocab', 'flashcards', 'quiz', 'listening', 'speaking', 'story', 'reading', 'daily-quotes', 'grammar-tenses'].includes(activeTab);
  const isLinearTab = ['mind-thinking', 'shadowing', 'storyboard-shadowing', 'dictation', 'task-station', 'video-lectures'].includes(activeTab);
  const isFunTab = ['games', 'rewards'].includes(activeTab);
  const isManageTab = ['parent-corner', 'journal', 'theme-settings', 'settings', 'admin-panel'].includes(activeTab);

  // Accordion state management - strictly max 1 top-level menu open at a time
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    const isRoadmap = (activeTab ? activeTab.startsWith('grade-') : false) || ['roadmap', 'listening-speaking-img', 'reading-writing-img', 'speaking-topic-ai', 'writing-topic-ai', 'practice-ex', 'sample-exams', 'reports'].includes(activeTab);
    const isSkills = ['vocab', 'flashcards', 'quiz', 'listening', 'speaking', 'story', 'reading', 'daily-quotes', 'grammar-tenses'].includes(activeTab);
    const isLinear = ['mind-thinking', 'shadowing', 'storyboard-shadowing', 'dictation', 'task-station', 'video-lectures'].includes(activeTab);
    const isFun = ['games', 'rewards'].includes(activeTab);
    const isManage = ['parent-corner', 'journal', 'theme-settings', 'settings', 'admin-panel'].includes(activeTab);
    return {
      roadmap: isRoadmap,
      grades: true,
      skills: isSkills,
      linear: isLinear,
      fun: isFun,
      manage: isManage,
    };
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Subscribe to real-time Firebase sync status for active write updates
  React.useEffect(() => {
    const unsub = subscribeSyncStatus((syncing) => setIsSyncing(syncing));
    return () => unsub();
  }, []);

  // Sync accordion state whenever activeTab or isDesktopCollapsed changes to prevent unwanted submenu expansion
  React.useEffect(() => {
    if (!isDesktopCollapsed) {
      const isRoadmap = (activeTab ? activeTab.startsWith('grade-') : false) || ['roadmap', 'listening-speaking-img', 'reading-writing-img', 'speaking-topic-ai', 'writing-topic-ai', 'practice-ex', 'sample-exams', 'reports'].includes(activeTab);
      const isSkills = ['vocab', 'flashcards', 'quiz', 'listening', 'speaking', 'story', 'reading', 'daily-quotes', 'grammar-tenses'].includes(activeTab);
      const isLinear = ['mind-thinking', 'shadowing', 'storyboard-shadowing', 'dictation', 'task-station', 'video-lectures'].includes(activeTab);
      const isFun = ['games', 'rewards'].includes(activeTab);
      const isManage = ['parent-corner', 'journal', 'theme-settings', 'settings', 'admin-panel'].includes(activeTab);

      setExpandedMenus((prev) => ({
        roadmap: isRoadmap,
        grades: prev.grades ?? true,
        skills: isSkills,
        linear: isLinear,
        fun: isFun,
        manage: isManage,
      }));
    }
  }, [activeTab, isDesktopCollapsed]);

  const toggleAccordion = (key: string) => {
    audioService.playClickSound();
    if (isDesktopCollapsed) {
      setIsDesktopCollapsed(false);
    }
    setExpandedMenus((prev) => {
      const isCurrentlyExpanded = !!prev[key];
      const topLevelKeys = ['roadmap', 'skills', 'linear', 'fun', 'manage'];

      if (topLevelKeys.includes(key)) {
        if (!isCurrentlyExpanded) {
          return {
            roadmap: false,
            skills: false,
            linear: false,
            fun: false,
            manage: false,
            [key]: true,
            grades: prev.grades ?? true,
          };
        } else {
          return {
            ...prev,
            [key]: false,
          };
        }
      }

      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleTabClick = (tab: ActiveTab) => {
    if (tab === 'admin-panel' && userRole !== 'admin') {
      return;
    }
    if (tab === 'parent-corner' && userRole === 'kid') {
      return;
    }
    audioService.playClickSound();
    setActiveTab(tab);
    setMobileOpen(false);

    if (tab === 'home') {
      setExpandedMenus({
        roadmap: false,
        grades: true,
        skills: false,
        linear: false,
        fun: false,
        manage: false,
      });
    }
  };

  const formatTrialTime = (secs: number) => {
    if (secs <= 0) return t('Hết hạn', 'Expired');
    if (secs >= 86400 * 365) {
      const years = (secs / (86400 * 365)).toFixed(1);
      return `${years} ${t('Năm VIP', 'VIP Yrs')}`;
    }
    if (secs >= 86400 * 30) {
      const months = Math.floor(secs / (86400 * 30));
      const days = Math.floor((secs % (86400 * 30)) / 86400);
      return `${months}${t('Tháng', 'M')} ${days}${t('N', 'd')}`;
    }
    if (secs >= 86400) {
      const days = Math.floor(secs / 86400);
      const hours = Math.floor((secs % 86400) / 3600);
      return `${days}${t('N', 'd')} ${hours}h`;
    }
    if (secs >= 3600) {
      const hours = Math.floor(secs / 3600);
      const mins = Math.floor((secs % 3600) / 60);
      return `${hours}h ${mins}m`;
    }
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const isHomeActive = activeTab === 'home';

  return (
    <>
      {/* Mobile menu toggle button */}
      {!mobileOpen && (
        <button 
          onClick={() => {
            audioService.playClickSound();
            setMobileOpen(true);
          }}
          className="lg:hidden fixed top-3 left-3 z-40 bg-gradient-to-r from-[#1d50b4] to-blue-700 text-white px-3 py-2.5 rounded-2xl shadow-xl hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-white/30 backdrop-blur-md"
          aria-label={t("Mở danh mục menu", "Open navigation drawer")}
        >
          <Menu size={20} className="stroke-[2.5]" />
          <span className="text-xs font-black tracking-wide pr-0.5">{t("Menu", "Menu")}</span>
        </button>
      )}

      {/* Overlay backdrop for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => {
            audioService.playClickSound();
            setMobileOpen(false);
          }}
          className="lg:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-xs transition-opacity animate-fadeIn"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 lg:top-2 left-0 z-50 shrink-0 self-start
        h-[100dvh] lg:h-[calc(100vh-16px)] lg:my-2 lg:ml-2
        bg-gradient-to-b from-[#1d50b4] via-[#1a44a0] to-[#123380] text-white flex flex-col justify-between p-3.5 select-none overflow-hidden
        transition-all duration-300 ease-in-out
        ${isDesktopCollapsed ? 'lg:w-[76px]' : 'lg:w-[270px]'} w-[280px] sm:w-[300px]
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl lg:shadow-xl border-r border-blue-400/20 rounded-r-3xl lg:rounded-[28px]
      `}>
        {/* Top Logo Header */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Mobile Drawer Header */}
          <div className="lg:hidden flex items-center justify-between gap-2 px-1 py-1.5 mb-2 shrink-0 border-b border-white/10 pb-2">
            <div 
              className="flex items-center gap-2.5 cursor-pointer overflow-hidden min-w-0" 
              onClick={() => handleTabClick('home')}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-300 p-0.5 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                <div className="w-full h-full rounded-full bg-[#12398b] flex items-center justify-center text-lg font-bold">
                  🦖
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base font-black tracking-tight leading-tight text-white flex items-center gap-1 truncate">
                  KIDOEnglish
                  {isVip && <span className="text-amber-300 text-xs">👑</span>}
                </h1>
                <p className="text-[9px] font-bold tracking-widest text-sky-200 uppercase flex items-center gap-1 truncate">
                  <span>LEARN • PLAY • GROW</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                audioService.playClickSound();
                setMobileOpen(false);
              }}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            {isDesktopCollapsed ? (
              <div className="flex flex-col items-center gap-2.5 py-1 mb-2 shrink-0">
                <div 
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-300 p-0.5 shadow-md flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition"
                  onClick={() => {
                    audioService.playClickSound();
                    setIsDesktopCollapsed(false);
                  }}
                  title={t("Click để mở rộng menu", "Click to expand menu")}
                >
                  <div className="w-full h-full rounded-full bg-[#12398b] flex items-center justify-center text-xl font-bold">
                    🦖
                  </div>
                </div>

                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setIsDesktopCollapsed(false);
                  }}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-900 font-black shadow-lg hover:scale-110 active:scale-95 flex items-center justify-center transition shrink-0 cursor-pointer border-2 border-white/80 ring-2 ring-amber-400/50"
                  aria-label={t("Mở rộng menu", "Expand menu")}
                >
                  <ChevronRight size={22} className="stroke-[3]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 px-1 py-1.5 mb-2 shrink-0">
                <div 
                  className="flex items-center gap-2.5 cursor-pointer overflow-hidden min-w-0" 
                  onClick={() => handleTabClick('home')}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-300 p-0.5 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    <div className="w-full h-full rounded-full bg-[#12398b] flex items-center justify-center text-lg font-bold">
                      🦖
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h1 className="text-base font-black tracking-tight leading-tight text-white flex items-center gap-1 truncate">
                        KIDOEnglish
                        {isVip && <span className="text-amber-300 text-xs">👑</span>}
                      </h1>
                      {isSyncing && (
                        <span className="flex items-center gap-1 text-[9px] font-black text-amber-300 bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.5 rounded-full animate-pulse shrink-0">
                          <RefreshCw size={9} className="animate-spin text-amber-300" />
                          <span>Syncing...</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] font-bold tracking-widest text-sky-200 uppercase flex items-center gap-1 truncate">
                      <span>LEARN • PLAY • GROW</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setIsDesktopCollapsed(true);
                  }}
                  className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition shrink-0 cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                  aria-label={t("Thu nhỏ menu", "Collapse menu")}
                >
                  <ChevronLeft size={20} className="stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links List */}
          <nav className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-1 font-medium text-xs pr-1 pb-8">
            {/* 1. Trang chủ (Home) */}
            <button
              onClick={() => handleTabClick('home')}
              title={isDesktopCollapsed ? t("Trang chủ", "Home") : undefined}
              className={`w-full flex items-center ${
                isDesktopCollapsed ? 'justify-between px-3 lg:justify-center lg:px-0' : 'gap-2.5 px-3'
              } py-2 rounded-xl font-bold transition-all ${
                isHomeActive 
                  ? 'bg-white text-[#1d50b4] shadow-md scale-[1.01]' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home size={18} className={isHomeActive ? 'text-amber-500' : 'text-amber-300'} />
                <span className={`text-xs font-black ${isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}`}>
                  {t('Trang chủ', 'Home')}
                </span>
              </div>
            </button>

            {/* 2. Lộ trình học (Accordion) */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('roadmap')}
                title={isDesktopCollapsed ? t("Lộ trình học", "Learning Roadmap") : undefined}
                className={`w-full flex items-center ${
                  isDesktopCollapsed ? 'justify-between px-3 lg:justify-center lg:px-0' : 'justify-between px-3'
                } py-2 rounded-xl font-bold transition ${
                  expandedMenus['roadmap'] ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={18} className="text-yellow-300" />
                  <span className={`text-xs font-black ${isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}`}>
                    {t('Lộ trình học', 'Learning Roadmap')}
                  </span>
                </div>
                <span className={isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}>
                  {expandedMenus['roadmap'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </button>

              {expandedMenus['roadmap'] && (
                <div className={`pl-2 pr-1 py-1 space-y-1 border-l-2 border-white/20 ml-3 my-0.5 text-xs font-semibold ${
                  isDesktopCollapsed ? 'block lg:hidden' : 'block'
                }`}>
                  {/* Sub Header: Khối lớp học Pill Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAccordion('grades');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 my-1 rounded-full bg-gradient-to-r from-[#ff7a32] to-[#ff5919] text-white font-black text-xs shadow-xs cursor-pointer hover:brightness-110 active:scale-[0.98] transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <Grid2X2 size={15} className="text-white shrink-0 stroke-[2.5]" />
                      <span className="tracking-wide">{t('Khối lớp học', 'Grade Levels')}</span>
                    </div>
                    <span className="text-[9px] text-white font-black">
                      {expandedMenus['grades'] !== false ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Grade Cards List */}
                  {expandedMenus['grades'] !== false && (
                    <div className="space-y-1.5 my-1.5">
                      {[
                        { 
                          key: 'grade-1', 
                          gradeName: t('Lớp 1', 'Grade 1'),
                          publisher: t('Kết Nối Tri Thức', 'Knowledge Connection'),
                          activeBg: 'bg-[#e11d48] text-white border-white shadow-md', 
                          inactiveBg: 'bg-[#fdeef3] text-[#881337] border-[#f43f5e] hover:bg-white hover:text-[#e11d48]', 
                          iconColorInactive: 'text-[#e11d48]' 
                        },
                        { 
                          key: 'grade-2', 
                          gradeName: t('Lớp 2', 'Grade 2'),
                          publisher: t('Kết Nối Tri Thức', 'Knowledge Connection'),
                          activeBg: 'bg-[#ea580c] text-white border-white shadow-md', 
                          inactiveBg: 'bg-[#fff1e6] text-[#7c2d12] border-[#f97316] hover:bg-white hover:text-[#ea580c]', 
                          iconColorInactive: 'text-[#ea580c]' 
                        },
                        { 
                          key: 'grade-3', 
                          gradeName: t('Lớp 3', 'Grade 3'),
                          publisher: t('Kết Nối Tri Thức', 'Knowledge Connection'),
                          activeBg: 'bg-[#0284c7] text-white border-white shadow-md', 
                          inactiveBg: 'bg-[#e0f8ff] text-[#0c4a6e] border-[#06b6d4] hover:bg-white hover:text-[#0284c7]', 
                          iconColorInactive: 'text-[#0284c7]' 
                        },
                        { 
                          key: 'grade-4', 
                          gradeName: t('Lớp 4', 'Grade 4'),
                          publisher: t('Kết Nối Tri Thức', 'Knowledge Connection'),
                          activeBg: 'bg-[#16a34a] text-white border-white shadow-md', 
                          inactiveBg: 'bg-[#e8f8ed] text-[#14532d] border-[#22c55e] hover:bg-white hover:text-[#16a34a]', 
                          iconColorInactive: 'text-[#16a34a]' 
                        },
                        { 
                          key: 'grade-5', 
                          gradeName: t('Lớp 5', 'Grade 5'),
                          publisher: t('Kết Nối Tri Thức', 'Knowledge Connection'),
                          activeBg: 'bg-[#8b5cf6] text-white border-white shadow-md', 
                          inactiveBg: 'bg-[#ede9fe] text-[#4c1d95] border-[#8b5cf6] hover:bg-white hover:text-[#8b5cf6]', 
                          iconColorInactive: 'text-[#8b5cf6]' 
                        },
                      ].map((g) => {
                        const isAllowed = hasGradeAccess(allowedGrades, g.key, userRole);
                        const isActive = activeTab === g.key;
                        return (
                          <button
                            key={g.key}
                            onClick={() => {
                              if (!isAllowed) {
                                audioService.playClickSound();
                                if (onTriggerNotification) {
                                  onTriggerNotification(
                                    t('🔒 Lớp Học Khóa', '🔒 Grade Locked'),
                                    t(
                                      `Tài khoản ${userName || 'bé'} chưa được mở ${g.gradeName}. Vui lòng liên hệ Admin để cấp quyền!`,
                                      `Account ${userName || 'user'} does not have access to ${g.gradeName}. Please contact Admin!`
                                    )
                                  );
                                }
                                return;
                              }
                              handleTabClick(g.key as ActiveTab);
                            }}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-[18px] text-left transition-all duration-200 border-2 border-dashed ${
                              isActive 
                                ? `${g.activeBg} border-dashed` 
                                : `${g.inactiveBg}`
                            } ${!isAllowed ? 'opacity-80' : 'cursor-pointer hover:scale-[1.01]'}`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <GraduationCap 
                                size={20} 
                                className={`shrink-0 stroke-[2.2] ${isActive ? 'text-white' : g.iconColorInactive}`} 
                              />
                              <div className="flex items-center min-w-0 flex-1 overflow-hidden">
                                <span className="text-[10.5px] sm:text-[11px] font-black tracking-tight whitespace-nowrap truncate">
                                  {g.gradeName} - {g.publisher}
                                </span>
                              </div>
                            </div>
                            {!isAllowed && (
                              <span className="shrink-0 bg-slate-900/50 text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                                <Lock size={10} />
                                <span>{t('Khóa', 'Lock')}</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Sub roadmap options */}
                  <button
                    onClick={() => handleTabClick('roadmap')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                      activeTab === 'roadmap' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Map size={14} className="text-sky-300" />
                    <span>{t('Roadmap học tập', 'Learning Roadmap')}</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('listening-speaking-img')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                      activeTab === 'listening-speaking-img' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <FileImage size={14} className="text-emerald-300 shrink-0" />
                    <span>{t('Hình ảnh luyện nghe và nói', 'Image Listening & Speaking')}</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('reading-writing-img')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                      activeTab === 'reading-writing-img' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <BookOpen size={14} className="text-orange-400 shrink-0" />
                    <span>{t('Hình ảnh luyện đọc và viết', 'Image Reading & Writing')}</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('speaking-topic-ai')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                      activeTab === 'speaking-topic-ai' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Mic size={14} className="text-cyan-300 shrink-0" />
                    <span>{t('Luyện Speaking Theo Chủ Đề (AI)', 'Speaking Practice By Topic (AI)')}</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('writing-topic-ai')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                      activeTab === 'writing-topic-ai' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <PenTool size={14} className="text-purple-300 shrink-0" />
                    <span>{t('Luyện Writing Theo Chủ Đề (AI)', 'Writing Practice By Topic (AI)')}</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('practice-ex')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                      activeTab === 'practice-ex' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Pencil size={14} className="text-pink-300" />
                    <span>{t('Bài tập ôn', 'Practice Exercises')}</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('sample-exams')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                      activeTab === 'sample-exams' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <FileSpreadsheet size={14} className="text-cyan-300" />
                    <span>{t('Đề cương - Thi mẫu', 'Sample Exams & Outline')}</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('reports')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                      activeTab === 'reports' ? 'bg-white/20 text-white font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <BarChart2 size={14} className="text-amber-300" />
                    <span>{t('Báo cáo', 'Learning Reports')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Luyện kỹ năng (Skills Accordion) */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('skills')}
                title={isDesktopCollapsed ? t("Luyện kỹ năng", "Skill Practice") : undefined}
                className={`w-full flex items-center ${
                  isDesktopCollapsed ? 'justify-between px-3 lg:justify-center lg:px-0' : 'justify-between px-3'
                } py-2 rounded-xl font-bold transition ${
                  expandedMenus['skills'] ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap size={18} className="text-pink-400" />
                  <span className={`text-xs font-black ${isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}`}>
                    {t('Luyện kỹ năng', 'Skill Practice')}
                  </span>
                </div>
                <span className={isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}>
                  {expandedMenus['skills'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </button>

              {expandedMenus['skills'] && (
                <div className={`pl-2 pr-1 py-1 space-y-0.5 border-l-2 border-white/20 ml-3 my-0.5 text-xs font-semibold ${
                  isDesktopCollapsed ? 'block lg:hidden' : 'block'
                }`}>
                  <button onClick={() => handleTabClick('vocab')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'vocab' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Languages size={14} className="text-emerald-300" />
                    <span>{t('Từ vựng', 'Vocabulary')}</span>
                  </button>
                  <button onClick={() => handleTabClick('flashcards')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'flashcards' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Layers size={14} className="text-purple-300" />
                    <span>{t('Thẻ ghi nhớ', 'Flashcards')}</span>
                  </button>
                  <button onClick={() => handleTabClick('quiz')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'quiz' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Puzzle size={14} className="text-amber-300" />
                    <span>{t('Đố vui (Quiz)', 'Quiz Challenge')}</span>
                  </button>
                  <button onClick={() => handleTabClick('listening')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'listening' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Headphones size={14} className="text-sky-300" />
                    <span>{t('Luyện nghe', 'Listening Practice')}</span>
                  </button>
                  <button onClick={() => handleTabClick('speaking')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'speaking' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Mic size={14} className="text-orange-400" />
                    <span>{t('Luyện nói', 'Speaking Practice')}</span>
                  </button>
                  <button onClick={() => handleTabClick('story')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'story' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <BookOpen size={14} className="text-pink-400" />
                    <span>{t('Đọc Truyện Story', 'Story Reading')}</span>
                  </button>
                  <button onClick={() => handleTabClick('reading')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'reading' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <BookOpen size={14} className="text-emerald-400" />
                    <span>{t('Đọc hiểu', 'Reading Comprehension')}</span>
                  </button>
                  <button onClick={() => handleTabClick('daily-quotes')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'daily-quotes' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <MessageCircle size={14} className="text-purple-300" />
                    <span>{t('Câu nói mỗi ngày', 'Daily Quotes')}</span>
                  </button>
                  <button onClick={() => handleTabClick('grammar-tenses')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'grammar-tenses' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <BookMarked size={14} className="text-cyan-300" />
                    <span>{t('Kiến Thức Các Thì', 'Grammar Tenses')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Trạm Tư Duy Linear (Accordion) */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('linear')}
                title={isDesktopCollapsed ? t("Trạm Tư Duy Linear", "Linear Mindmap") : undefined}
                className={`w-full flex items-center ${
                  isDesktopCollapsed ? 'justify-between px-3 lg:justify-center lg:px-0' : 'justify-between px-3'
                } py-2 rounded-xl font-bold transition ${
                  expandedMenus['linear'] ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Grid2X2 size={18} className="text-emerald-400" />
                  <span className={`text-xs font-black ${isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}`}>
                    {t('Trạm Tư Duy Linear', 'Linear Mindmap Station')}
                  </span>
                </div>
                <span className={isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}>
                  {expandedMenus['linear'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </button>

              {expandedMenus['linear'] && (
                <div className={`pl-2 pr-1 py-1 space-y-0.5 border-l-2 border-white/20 ml-3 my-0.5 text-xs font-semibold ${
                  isDesktopCollapsed ? 'block lg:hidden' : 'block'
                }`}>
                  <button onClick={() => handleTabClick('mind-thinking')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'mind-thinking' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Brain size={14} className="text-purple-300" />
                    <span>{t('Tư Duy Thinking', 'Mindmap Thinking')}</span>
                  </button>
                  <button onClick={() => handleTabClick('shadowing')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'shadowing' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Video size={14} className="text-sky-300" />
                    <span>{t('Luyện Shadowing', 'Shadowing Practice')}</span>
                  </button>
                  <button onClick={() => handleTabClick('dictation')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'dictation' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Headphones size={14} className="text-emerald-300" />
                    <span>{t('Luyện Nghe (Nhớ-Viết Lại)', 'Dictation Practice')}</span>
                  </button>
                  <button onClick={() => handleTabClick('storyboard-shadowing')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'storyboard-shadowing' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <BookOpen size={14} className="text-cyan-300 shrink-0" />
                    <span>{t('Truyện StoryBoard - Shadowing', 'StoryBoard - Shadowing')}</span>
                  </button>
                  <button onClick={() => handleTabClick('task-station')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'task-station' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Target size={14} className="text-amber-400 shrink-0" />
                    <span>{t('Trạm Nhiệm Vụ', 'Task Station')}</span>
                  </button>
                  <button onClick={() => handleTabClick('video-lectures')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'video-lectures' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Video size={14} className="text-orange-300" />
                    <span>{t('Video bài giảng', 'Video Lectures')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Trò Chơi - Relax (Accordion redesigned to match sample image 3) */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('fun')}
                title={isDesktopCollapsed ? t("Trò Chơi - Relax", "Games & Relax") : undefined}
                className={`w-full flex items-center ${
                  isDesktopCollapsed ? 'justify-between px-3 lg:justify-center lg:px-0' : 'justify-between px-3'
                } py-2 rounded-xl font-bold transition ${
                  expandedMenus['fun'] ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Gamepad2 size={18} className="text-purple-400" />
                  <span className={`text-xs font-black ${isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}`}>
                    {t('Trò Chơi - Relax', 'Games & Relax')}
                  </span>
                </div>
                <span className={isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}>
                  {expandedMenus['fun'] ? (
                    <span className="text-[10px] text-white/90">▲</span>
                  ) : (
                    <span className="text-[10px] text-white/90">▼</span>
                  )}
                </span>
              </button>

              {expandedMenus['fun'] && (
                <div className={`pl-2 pr-1 py-1 space-y-0.5 border-l-2 border-white/20 ml-3 my-0.5 text-xs font-semibold ${
                  isDesktopCollapsed ? 'block lg:hidden' : 'block'
                }`}>
                  <button onClick={() => handleTabClick('games')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'games' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Gamepad2 size={14} className="text-pink-400 shrink-0" />
                    <span>{t('Trò Chơi - Relax', 'Games & Relax')}</span>
                  </button>
                  <button onClick={() => handleTabClick('rewards')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'rewards' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Trophy size={14} className="text-yellow-400 shrink-0" />
                    <span>{t('Phần thưởng', 'Rewards')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 6. Góc Quản lý (Accordion) */}
            <div className="rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('manage')}
                title={isDesktopCollapsed ? t("Góc Quản lý", "Management Corner") : undefined}
                className={`w-full flex items-center ${
                  isDesktopCollapsed ? 'justify-between px-3 lg:justify-center lg:px-0' : 'justify-between px-3'
                } py-2 rounded-xl font-bold transition ${
                  expandedMenus['manage'] ? 'bg-white/15 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wrench size={18} className="text-cyan-300" />
                  <span className={`text-xs font-black ${isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}`}>
                    {t('Góc Quản lý', 'Management Corner')}
                  </span>
                </div>
                <span className={isDesktopCollapsed ? 'inline lg:hidden' : 'inline'}>
                  {expandedMenus['manage'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </button>

              {expandedMenus['manage'] && (
                <div className={`pl-2 pr-1 py-1 space-y-0.5 border-l-2 border-white/20 ml-3 my-0.5 text-xs font-semibold ${
                  isDesktopCollapsed ? 'block lg:hidden' : 'block'
                }`}>
                  {userRole === 'parent' && (
                    <button onClick={() => handleTabClick('parent-corner')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'parent-corner' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                      <ShieldCheck size={14} className="text-sky-300" />
                      <span>{t('Góc Phụ Huynh', 'Parent Corner')}</span>
                    </button>
                  )}
                  {userRole === 'admin' && (
                    <button onClick={() => handleTabClick('admin-panel')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-300/30 text-amber-200 ${activeTab === 'admin-panel' ? 'bg-amber-400 text-amber-950 font-black' : 'hover:bg-amber-400/30'}`}>
                      <Shield size={14} className="text-amber-300 shrink-0" />
                      <span>{t('Trang Quản Trị Admin', 'Admin Panel')}</span>
                    </button>
                  )}
                  <button onClick={() => handleTabClick('journal')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'journal' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Calendar size={14} className="text-emerald-300" />
                    <span>{t('Nhật ký & Notes', 'Journal & Notes')}</span>
                  </button>
                  <button onClick={() => handleTabClick('theme-settings')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'theme-settings' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Palette size={14} className="text-pink-300" />
                    <span>{t('Chủ đề hiển thị', 'Theme Settings')}</span>
                  </button>
                  <button onClick={() => handleTabClick('settings')} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${activeTab === 'settings' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                    <Settings size={14} className="text-gray-200" />
                    <span>{t('Cài đặt', 'Settings')}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom Widgets */}
        <div className="mt-2 pt-2 border-t border-white/15 space-y-2 shrink-0">
          <div className={isDesktopCollapsed ? 'block lg:hidden' : 'block'}>
            {(() => {
              const isUrgent = !isVip && trialTimeSeconds <= 60;
              return (
                <div className={`rounded-2xl p-2.5 shadow-md border transition-all duration-300 ${
                  isUrgent 
                    ? 'bg-rose-50/90 border-rose-300 text-rose-900 ring-2 ring-rose-400/50 animate-pulse' 
                    : 'bg-white border-slate-100 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{isUrgent ? '⚠️' : '⏳'}</span>
                      <div className="text-[10px] font-extrabold leading-tight">
                        <span className={isUrgent ? 'text-rose-800 font-black' : 'text-slate-700'}>
                          {isVip ? t('Thời hạn VIP', 'VIP Time') : isUrgent ? t('⚠️ SẮP HẾT GIỜ!', '⚠️ TIME ALMOST UP!') : t('Dùng thử còn lại:', 'Trial Left:')}
                        </span>
                      </div>
                    </div>
                    <span className={`text-sm font-black tracking-tight ${
                      isUrgent ? 'text-rose-600 animate-bounce' : 'text-sky-600'
                    }`}>
                      {formatTrialTime(trialTimeSeconds)}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${
                    isUrgent ? 'bg-rose-200' : 'bg-sky-100'
                  }`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isUrgent 
                          ? 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse' 
                          : 'bg-sky-500'
                      }`}
                      style={{ width: `${Math.min(100, isVip ? 100 : Math.max(0, (trialTimeSeconds / 300) * 100))}%` }} 
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          <div className={isDesktopCollapsed ? `hidden lg:flex flex-col items-center justify-center rounded-xl p-2 font-black text-xs shadow-md transition-all ${
            !isVip && trialTimeSeconds <= 60
              ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
              : 'bg-white text-sky-600'
          }` : 'hidden'}>
            <span>{!isVip && trialTimeSeconds <= 60 ? '⚠️' : '⏳'}</span>
            <span className="text-[9px] mt-0.5">{formatTrialTime(trialTimeSeconds)}</span>
          </div>

          <div className={isDesktopCollapsed ? 'block lg:hidden' : 'block'}>
            <div className="bg-white/10 rounded-2xl p-2.5 border border-white/20 border-dashed flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-300 p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full bg-[#12398b] flex items-center justify-center text-lg">
                  🦖
                </div>
              </div>
              <div>
                <p className="font-extrabold text-amber-300 text-[11px]">{t('Kido khuyên bé:', 'Kido says:')}</p>
                <p className="text-[11px] font-medium text-white leading-snug">
                  {t('Cố lên! Học mỗi ngày, tiến bộ mỗi ngày! 🌟', 'Keep it up! Learn every day, improve every day! 🌟')}
                </p>
              </div>
            </div>

            {/* Ảnh 3: Realtime Badge - xuất hiện bên dưới bảng Kido khuyên bé */}
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  if (onToggleOnline) {
                    audioService.playClickSound();
                    onToggleOnline();
                  }
                }}
                title={isOnline ? t("Đã đồng bộ thời gian thực", "Realtime Synced") : t("Chế độ ngoại tuyến", "Offline Mode")}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-black flex items-center justify-center gap-2 border-2 border-dashed transition cursor-pointer shadow-xs active:scale-95 ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Wifi size={14} className={isOnline ? 'text-emerald-600' : 'text-amber-600 animate-pulse'} />
                <span className="tracking-wide">{isOnline ? 'Realtime' : 'Offline 🎒'}</span>
              </button>

              {isSyncing && (
                <div 
                  className="py-1 px-2.5 rounded-full text-[10px] font-black bg-amber-400/25 text-amber-200 border border-amber-300/50 flex items-center gap-1.5 animate-pulse shrink-0 shadow-xs"
                  title={t("Đang lưu thay đổi vào Firebase...", "Syncing updates to Firebase...")}
                >
                  <RefreshCw size={11} className="animate-spin text-amber-300" />
                  <span>Syncing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

