import React, { useState } from 'react';
import {
  Video,
  Trophy,
  Star,
  Flame,
  LogOut,
  Play,
  Eye,
  ExternalLink,
  X,
  Volume2,
  Settings,
  Maximize2,
  FolderOpen,
  Sparkles,
  Pause
} from 'lucide-react';
import { audioService } from '../utils/audio';
import { UserAccount, UserProfile } from '../types';

interface VideoLectureViewProps {
  user?: UserAccount | UserProfile;
  onLogout?: () => void;
  onBack?: () => void;
}

interface VideoItem {
  id: string;
  grade: 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5';
  title: string;
  subtitle: string;
  duration: string;
  views: number;
  youtubeUrl: string;
  thumbnailBg: string; // CSS style or gradient for realistic thumbnail
  unitTag: string;
  pageRange: string;
  teacherImage?: string;
}

const VIDEOS_DATA: Record<string, VideoItem[]> = {
  grade1: [
    {
      id: 'v1-1',
      grade: 'grade1',
      title: 'Tiếng Anh Lớp 1 (Global Success) : Unit 1 (Trang 6-8)',
      subtitle: 'Tiếng Anh Lớp 1 (Global Success) : Unit 1 (Trang 6-8)',
      duration: '3:00',
      views: 0,
      youtubeUrl: 'https://www.youtube.com/results?search_query=Tieng+Anh+Lop+1+Global+Success+Unit+1',
      thumbnailBg: 'from-sky-200 via-blue-100 to-amber-100',
      unitTag: 'UNIT 1',
      pageRange: 'Trang 6 - 8',
    },
    {
      id: 'v1-2',
      grade: 'grade1',
      title: 'Tiếng Anh Lớp 1 (Global Success) : Unit 2 (Trang 9-11)',
      subtitle: 'Tiếng Anh Lớp 1 (Global Success) : Unit 2 (Trang 9-11)',
      duration: '3:00',
      views: 0,
      youtubeUrl: 'https://www.youtube.com/results?search_query=Tieng+Anh+Lop+1+Global+Success+Unit+2',
      thumbnailBg: 'from-sky-200 via-indigo-100 to-rose-100',
      unitTag: 'UNIT 2',
      pageRange: 'Trang 9 - 11',
    },
    {
      id: 'v1-3',
      grade: 'grade1',
      title: 'Tiếng Anh Lớp 1 (Global Success) : Fun Time 1 (Trang 12-13)',
      subtitle: 'Tiếng Anh Lớp 1 (Global Success) : Fun Time 1 (Trang 12-13)',
      duration: '3:00',
      views: 0,
      youtubeUrl: 'https://www.youtube.com/results?search_query=Tieng+Anh+Lop+1+Global+Success+Fun+Time+1',
      thumbnailBg: 'from-blue-200 via-sky-100 to-emerald-100',
      unitTag: 'FUN TIME 1',
      pageRange: 'Trang 12 - 13',
    },
    {
      id: 'v1-4',
      grade: 'grade1',
      title: 'Tiếng Anh Lớp 1 (Global Success) : Unit 3 (Trang 14-16)',
      subtitle: 'Tiếng Anh Lớp 1 (Global Success) : Unit 3 (Trang 14-16)',
      duration: '3:00',
      views: 0,
      youtubeUrl: 'https://www.youtube.com/results?search_query=Tieng+Anh+Lop+1+Global+Success+Unit+3',
      thumbnailBg: 'from-sky-200 via-amber-100 to-pink-100',
      unitTag: 'UNIT 3',
      pageRange: 'Trang 14 - 16',
    },
    {
      id: 'v1-5',
      grade: 'grade1',
      title: 'Tiếng Anh Lớp 1 (Global Success) : Unit 4 (Trang 17-19)',
      subtitle: 'Tiếng Anh Lớp 1 (Global Success) : Unit 4 (Trang 17-19)',
      duration: '3:00',
      views: 0,
      youtubeUrl: 'https://www.youtube.com/results?search_query=Tieng+Anh+Lop+1+Global+Success+Unit+4',
      thumbnailBg: 'from-purple-200 via-sky-100 to-amber-100',
      unitTag: 'UNIT 4',
      pageRange: 'Trang 17 - 19',
    },
  ],
  grade2: [
    {
      id: 'v2-1',
      grade: 'grade2',
      title: '3 Global Success Unit 1 Hello Lesson 1 | Viral English',
      subtitle: 'Tiếng Anh Lớp 3 Global Success Unit 1 Hello Lesson 1 | Viral English',
      duration: '3:00',
      views: 0,
      youtubeUrl: 'https://www.youtube.com/results?search_query=Tieng+Anh+Lop+3+Global+Success+Unit+1+Hello',
      thumbnailBg: 'from-amber-200 via-orange-100 to-sky-100',
      unitTag: 'Unit 1 Lesson 1',
      pageRange: 'Hello',
    },
    {
      id: 'v2-2',
      grade: 'grade2',
      title: "Carl's Car Wash ABCs | A Super Simple Storybook",
      subtitle: "Carl's Car Wash ABCs | A Super Simple Storybook",
      duration: '3:00',
      views: 0,
      youtubeUrl: 'https://www.youtube.com/results?search_query=Carl+Car+Wash+ABCs+Super+Simple+Storybook',
      thumbnailBg: 'from-yellow-200 via-sky-200 to-amber-100',
      unitTag: 'ABCs',
      pageRange: 'Storybook',
    },
    {
      id: 'v2-3',
      grade: 'grade2',
      title: 'Tiếng Anh 2 Unit 1 Global Success',
      subtitle: 'Tiếng Anh 2 Unit 1 Global Success',
      duration: '3:00',
      views: 0,
      youtubeUrl: 'https://www.youtube.com/results?search_query=Tieng+Anh+2+Unit+1+Global+Success',
      thumbnailBg: 'from-orange-200 via-pink-100 to-sky-100',
      unitTag: 'Unit 1',
      pageRange: 'At my birthday party',
    },
  ],
  grade3: [], // Empty state as shown in image 3
  grade4: [],
  grade5: [],
};

export const VideoLectureView: React.FC<VideoLectureViewProps> = ({
  user,
  onLogout,
  onBack,
}) => {
  const [activeGrade, setActiveGrade] = useState<'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5'>('grade1');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // User Stats
  const userStars = user?.stars ?? 313;
  const userLevel = user?.level ?? 7;
  const userStreak = user?.streakDays ?? 4;
  const userAvatar = user?.avatar || '🐊';

  const currentVideos = VIDEOS_DATA[activeGrade] || [];

  const handleOpenVideo = (video: VideoItem) => {
    audioService.playClickSound();
    setSelectedVideo(video);
    setIsPlaying(true);
    setViewCounts((prev) => ({
      ...prev,
      [video.id]: (prev[video.id] || video.views) + 1,
    }));
  };

  const handleCloseModal = () => {
    audioService.playClickSound();
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-[#edf4ff] text-slate-800 p-3 sm:p-6 select-none font-sans space-y-5">
      {/* 1. TOP HEADER BAR */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-sky-100">
        {/* Left Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Video Bài Học Tiếng Anh</span>
            <Video className="text-slate-800 fill-slate-800" size={24} />
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Bé hãy chọn khối lớp để xem các video bài học sinh động bám sát chương trình nhé!
          </p>
        </div>

        {/* Right Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Level Badge */}
          <div className="bg-sky-50/90 border border-dashed border-sky-300 rounded-2xl px-3 py-1.5 flex items-center gap-2 text-sky-800 font-extrabold text-xs shadow-2xs">
            <Trophy size={16} className="text-amber-500 shrink-0" />
            <div className="flex flex-col">
              <span>Cấp độ {userLevel}</span>
              <div className="w-10 h-1 bg-sky-200 rounded-full overflow-hidden mt-0.5">
                <div className="bg-sky-500 h-full w-3/4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Stars Badge */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-1.5 flex items-center gap-1.5 text-amber-900 font-black text-xs shadow-2xs">
            <Star size={16} className="text-amber-500 fill-amber-400 shrink-0" />
            <span>{userStars}</span>
          </div>

          {/* Streak Badge */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl px-3.5 py-1.5 flex items-center gap-1.5 text-rose-900 font-black text-xs shadow-2xs">
            <Flame size={16} className="text-rose-500 fill-rose-500 shrink-0" />
            <span>{userStreak} ngày</span>
          </div>

          {/* Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-xs flex items-center justify-center text-lg shrink-0">
            {userAvatar}
          </div>

          {/* Exit / Logout Button */}
          <button
            onClick={() => {
              audioService.playClickSound();
              if (onLogout) onLogout();
              else if (onBack) onBack();
            }}
            className="bg-[#ef4444] hover:bg-red-600 active:scale-95 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
          >
            <LogOut size={14} />
            <span>Thoát</span>
          </button>
        </div>
      </header>

      {/* 2. GRADE TABS (LỚP 1 -> LỚP 5) */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
        {/* Lớp 1 Tab */}
        <button
          onClick={() => {
            audioService.playClickSound();
            setActiveGrade('grade1');
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition cursor-pointer shrink-0 ${
            activeGrade === 'grade1'
              ? 'bg-[#e85382] text-white shadow-md'
              : 'border-2 border-dashed border-pink-400 text-pink-600 bg-white hover:bg-pink-50'
          }`}
        >
          Lớp 1 - Kết Nối Tri Thức
        </button>

        {/* Lớp 2 Tab */}
        <button
          onClick={() => {
            audioService.playClickSound();
            setActiveGrade('grade2');
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition cursor-pointer shrink-0 ${
            activeGrade === 'grade2'
              ? 'bg-[#ff7a29] text-white shadow-md'
              : 'border-2 border-dashed border-orange-400 text-orange-600 bg-white hover:bg-orange-50'
          }`}
        >
          Lớp 2 - Kết Nối Tri Thức
        </button>

        {/* Lớp 3 Tab */}
        <button
          onClick={() => {
            audioService.playClickSound();
            setActiveGrade('grade3');
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition cursor-pointer shrink-0 ${
            activeGrade === 'grade3'
              ? 'bg-[#00b4d8] text-white shadow-md'
              : 'border-2 border-dashed border-cyan-400 text-cyan-600 bg-white hover:bg-cyan-50'
          }`}
        >
          Lớp 3 - Kết Nối Tri Thức
        </button>

        {/* Lớp 4 Tab */}
        <button
          onClick={() => {
            audioService.playClickSound();
            setActiveGrade('grade4');
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition cursor-pointer shrink-0 ${
            activeGrade === 'grade4'
              ? 'bg-[#10b981] text-white shadow-md'
              : 'border-2 border-dashed border-emerald-400 text-emerald-600 bg-white hover:bg-emerald-50'
          }`}
        >
          Lớp 4 - Kết Nối Tri Thức
        </button>

        {/* Lớp 5 Tab */}
        <button
          onClick={() => {
            audioService.playClickSound();
            setActiveGrade('grade5');
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition cursor-pointer shrink-0 ${
            activeGrade === 'grade5'
              ? 'bg-[#8b5cf6] text-white shadow-md'
              : 'border-2 border-dashed border-purple-400 text-purple-600 bg-white hover:bg-purple-50'
          }`}
        >
          Lớp 5 - Kết Nối Tri Thức
        </button>
      </div>

      {/* 3. VIDEO CARDS GRID OR EMPTY STATE */}
      {currentVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {currentVideos.map((item) => {
            const count = viewCounts[item.id] || item.views;
            const themeColorClass =
              activeGrade === 'grade1'
                ? 'text-pink-600 bg-pink-50/60'
                : 'text-orange-600 bg-orange-50/60';

            const buttonTextColor =
              activeGrade === 'grade1' ? 'text-pink-500' : 'text-orange-500';

            return (
              <div
                key={item.id}
                onClick={() => handleOpenVideo(item)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                {/* Thumbnail Header */}
                <div className={`relative h-44 bg-gradient-to-br ${item.thumbnailBg} p-3 flex flex-col justify-between overflow-hidden`}>
                  {/* Banner Overlay Graphics */}
                  <div className="flex items-center justify-between text-[10px] font-black tracking-wider text-blue-900 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-md self-start border border-white/50">
                    <span>SERIES / TIẾNG ANH 1</span>
                  </div>

                  {/* Center Play Circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play size={20} className="fill-slate-800 ml-0.5" />
                    </div>
                  </div>

                  {/* Center Content Title Graphics */}
                  <div className="text-center z-0 pointer-events-none mt-2">
                    <span className="text-xl font-black text-blue-900 tracking-tight drop-shadow-xs block">
                      {item.unitTag}
                    </span>
                    <span className="text-xs font-bold text-slate-700 block">
                      {item.pageRange}
                    </span>
                  </div>

                  {/* Teacher Illustration Right */}
                  <div className="absolute bottom-0 right-2 text-4xl pointer-events-none select-none">
                    👩‍🏫
                  </div>

                  {/* Bottom Right Duration Badge */}
                  <div className="self-end bg-black/80 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                    {item.duration}
                  </div>
                </div>

                {/* Card Body */}
                <div className={`p-3.5 space-y-2 flex-1 flex flex-col justify-between ${themeColorClass}`}>
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className={`text-[11px] font-bold ${buttonTextColor} line-clamp-1`}>
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-extrabold text-[11px] flex items-center gap-1">
                      <Eye size={13} className="text-slate-400" />
                      <span>{count} lượt xem</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenVideo(item);
                      }}
                      className={`bg-white px-3 py-1 rounded-full text-xs font-black shadow-2xs hover:shadow-xs transition ${buttonTextColor}`}
                    >
                      Xem ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE (As seen in image 3) */
        <div className="min-h-[320px] flex flex-col items-center justify-center space-y-3 bg-white/40 rounded-3xl p-8 border border-slate-200/50">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
            <FolderOpen size={32} className="text-slate-400" />
          </div>
          <p className="text-sm font-black text-slate-600 text-center">
            Chưa có video nào trong danh mục này nha bé!
          </p>
        </div>
      )}

      {/* 4. VIDEO PLAYER MODAL (Matching Image 4 100%) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          {/* Dashed Outer Border Card */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 border-2 border-dashed border-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Embedded Video Area */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex flex-col justify-between shadow-lg group">
              {/* Top Video Overlay Bar */}
              <div className="p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-xs font-black shrink-0">
                    VE
                  </div>
                  <span className="text-xs font-bold line-clamp-1 max-w-[280px]">
                    {selectedVideo.title}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-white/80">
                  <Volume2 size={16} className="hover:text-white cursor-pointer" />
                  <span className="text-[10px] font-black border border-white/60 px-1 rounded">CC</span>
                  <Settings size={16} className="hover:text-white cursor-pointer" />
                  <button
                    onClick={handleCloseModal}
                    className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Center Simulated Player Screen */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-sky-900 via-slate-900 to-indigo-950 text-white p-6">
                <div className="space-y-3 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 backdrop-blur-md flex items-center justify-center mx-auto shadow-2xl">
                    <Pause size={28} className="fill-white text-white ml-0.5" />
                  </div>
                  <div className="text-sm font-extrabold text-sky-200">
                    Unit 1: Hello - Lesson 1
                  </div>
                </div>

                {/* Floating "Video khác" overlay on bottom right */}
                <div className="absolute bottom-12 right-4 bg-slate-800/90 border border-slate-700 p-1.5 rounded-xl flex items-center gap-2 text-[10px] text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-black">
                    Unit 2
                  </div>
                  <span>Video khác</span>
                </div>
              </div>

              {/* Bottom Player Timeline Overlay */}
              <div className="p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white z-10 text-xs">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                  <span>0:00 / 16:31</span>
                  <span className="text-slate-400 text-[10px]">Giới thiệu</span>
                </div>

                <div className="flex items-center gap-3">
                  <Maximize2 size={16} className="hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Modal Bottom Text & Actions */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {selectedVideo.title}
                </h3>
                <p className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <Sparkles size={14} />
                  <span>Bé hãy xem video và học tập vui vẻ nhé</span>
                </p>
              </div>

              {/* Red YouTube Button */}
              <a
                href={selectedVideo.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#ef4444] hover:bg-red-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                <Play size={15} className="fill-white" />
                <span>Mở Xem Trên YouTube ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
