import React, { useState, useRef } from 'react';
import { 
  Trophy, 
  Star, 
  Flame, 
  Clock, 
  Languages, 
  Headphones, 
  Mic, 
  BookOpen, 
  ChevronUp, 
  ChevronDown, 
  LogOut,
  Map,
  Users,
  Handshake,
  Lightbulb,
  ArrowRight,
  BarChart2,
  Compass,
  FileText,
  Lock,
  CheckCircle2,
  HelpCircle,
  School,
  Wrench,
  Check,
  Award,
  Share2
} from 'lucide-react';
import { UserProfile } from '../types';
import { audioService } from '../utils/audio';
import { getUserLevelAndXp } from '../utils/levelSystem';
import { UserAvatar } from './UserAvatar';
import { AchievementCardModal } from './AchievementCardModal';
import { 
  gradeUnitsData, 
  parentGuideUnitsData, 
  parentChecklistTasksByGrade 
} from '../data/gradeUnitsData';

interface ReportViewProps {
  user?: UserProfile;
  setActiveTab: (tab: string) => void;
  reportSubTab: 'overview' | 'map' | 'parent' | 'tips';
  setReportSubTab: (tab: 'overview' | 'map' | 'parent' | 'tips') => void;
  onLogout?: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  user,
  setActiveTab,
  reportSubTab,
  setReportSubTab,
  onLogout,
}) => {
  const [showAchievementModal, setShowAchievementModal] = useState<boolean>(false);
  const [selectedGradeMap, setSelectedGradeMap] = useState<number>(5);
  const [selectedGradeParent, setSelectedGradeParent] = useState<number>(5);
  const [parentMode, setParentMode] = useState<'curriculum' | 'checklist' | 'tips'>('curriculum');
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const [checkedList, setCheckedList] = useState<Record<number, boolean>>({});

  const studentName = user?.name || 'Cao Quốc Minh';
  const studentStars = user?.stars ?? 0;
  const studentLevel = user?.level ?? 0;
  const studentStreak = user?.streakDays ?? 0;
  const studyMinutes = user?.studyTimeMinutes ?? 0;
  const studyHours = (studyMinutes / 60).toFixed(1);
  const learnedVocab = user?.learnedVocabCount ?? 0;
  const totalVocab = user?.totalVocabCount || 100;
  const vocabPercent = Math.min(100, Math.round((learnedVocab / totalVocab) * 100));
  const completedLessons = user?.completedLessonsCount ?? 0;
  const totalLessons = user?.totalLessonsCount || 36;
  const overallProgressPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));
  const { level: activeLevel, xp: userXp, maxXp } = getUserLevelAndXp(studentStars, studentLevel, user?.xp);

  const listeningSkillPercent = Math.min(100, Math.round((completedLessons * 15) + (studyMinutes > 0 ? 5 : 0)));
  const speakingSkillPercent = Math.min(100, Math.round((completedLessons * 12) + (studyMinutes > 0 ? 5 : 0)));
  const readingSkillPercent = Math.min(100, Math.round(completedLessons * 10));

  const toggleCheck = (id: number) => {
    audioService.playClickSound();
    setCheckedList(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Roadmap units per grade derived from shared curriculum
  const roadmapUnits = (gradeUnitsData[selectedGradeMap] || gradeUnitsData[5]).map((u, index) => ({
    id: u.id,
    title: u.title,
    isUnlocked: u.isUnlocked || index === 0 || completedLessons >= index * 2,
    stars: completedLessons > index * 2 ? 3 : (u.isCompleted ? 3 : 0)
  }));

  // Parent Guide units per grade
  const parentUnits = parentGuideUnitsData[selectedGradeParent] || parentGuideUnitsData[5];

  // Checklist tasks per grade
  const currentGradeChecklist = parentChecklistTasksByGrade[selectedGradeParent] || parentChecklistTasksByGrade[5];
  const checklistTasks = [
    ...currentGradeChecklist.map(t => `${t.title}: ${t.subtitle}`),
    'Cùng con đọc ít nhất một câu chuyện trong tab Đọc hiểu trước khi đi ngủ.',
    'Lắng nghe con phát âm và khen ngợi đập tay khích lệ sự nỗ lực của con.'
  ];

  const gradeProgressMap: Record<number, number> = {
    1: Math.min(100, completedLessons > 0 ? Math.round(completedLessons * 10) : 0),
    2: Math.min(100, completedLessons > 3 ? Math.round((completedLessons - 3) * 10) : 0),
    3: Math.min(100, completedLessons > 6 ? Math.round((completedLessons - 6) * 10) : 0),
    4: Math.min(100, completedLessons > 10 ? Math.round((completedLessons - 10) * 10) : 0),
    5: overallProgressPercent
  };

  const totalChecked = Object.values(checkedList).filter(Boolean).length;

  const schoolTopicsRef = useRef<HTMLDivElement>(null);

  const handleTopicsScrollUp = () => {
    audioService.playClickSound();
    schoolTopicsRef.current?.scrollBy({ top: -110, behavior: 'smooth' });
  };

  const handleTopicsScrollDown = () => {
    audioService.playClickSound();
    schoolTopicsRef.current?.scrollBy({ top: 110, behavior: 'smooth' });
  };

  const schoolTopics = (gradeUnitsData[5] || []).map((u, i) => {
    const isTopicDone = completedLessons >= (i + 1) * 2;
    const topicProgress = isTopicDone ? 100 : (completedLessons === i * 2 + 1 ? 50 : (i === 0 && completedLessons > 0 ? 25 : 0));
    return {
      id: u.id,
      title: u.title,
      rating: topicProgress === 100 ? 5 : (topicProgress > 0 ? 4 : 3),
      progress: topicProgress,
      isActive: i === 0 || topicProgress > 0
    };
  });

  const currentUnitDetail = parentUnits.find(u => u.id === selectedUnitId) || parentUnits[0];

  return (
    <div className="space-y-5 font-sans select-none text-slate-800">
      {/* Sub-navigation Tabs Row - Pixel-Perfect 1:1 Match with Sample Image 1 */}
      <div className="bg-[#ebf3ff]/90 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#b0cbfa] flex flex-wrap items-center gap-2 sm:gap-3.5 shadow-2xs">
        <button
          onClick={() => {
            audioService.playClickSound();
            setReportSubTab('overview');
          }}
          className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            reportSubTab === 'overview'
              ? 'bg-gradient-to-r from-[#ff7a38] to-[#ff5d24] text-white shadow-md shadow-orange-500/25 border border-transparent scale-[1.02]'
              : 'bg-[#fff5f0] text-[#ea580c] border border-dashed border-[#ffb396] hover:bg-[#ffece3]'
          }`}
        >
          <BarChart2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
          <span>Tổng quan học tập</span>
        </button>

        <button
          onClick={() => {
            audioService.playClickSound();
            setReportSubTab('map');
          }}
          className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            reportSubTab === 'map'
              ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/25 border border-transparent scale-[1.02]'
              : 'bg-[#eef5ff] text-[#1e3a8a] border border-dashed border-[#93c5fd] hover:bg-[#e0edff]'
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-[#1d4ed8]" />
          <span>Bản đồ lộ trình lớp</span>
        </button>

        <button
          onClick={() => {
            audioService.playClickSound();
            setReportSubTab('parent');
          }}
          className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            reportSubTab === 'parent'
              ? 'bg-[#00a896] text-white shadow-md shadow-teal-500/25 border border-transparent scale-[1.02]'
              : 'bg-[#e6fbf9] text-[#0f766e] border border-dashed border-[#a5f3fc] hover:bg-[#ccfbf1]'
          }`}
        >
          <Handshake className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-[#0d9488]" />
          <span>Đồng hành cùng con</span>
        </button>

        <button
          onClick={() => {
            audioService.playClickSound();
            setReportSubTab('tips');
          }}
          className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            reportSubTab === 'tips'
              ? 'bg-[#7209b7] text-white shadow-md shadow-purple-500/25 border border-transparent scale-[1.02]'
              : 'bg-[#f5eefc] text-[#581c87] border border-dashed border-[#e9d5ff] hover:bg-[#f3e8ff]'
          }`}
        >
          <Lightbulb className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-[#7e22ce]" />
          <span>Bí quyết học sâu</span>
        </button>

        {/* Achievement Card Generator Button */}
        <button
          onClick={() => {
            audioService.playSuccessSound();
            setShowAchievementModal(true);
          }}
          className="ml-auto px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-amber-950 hover:from-amber-500 hover:to-yellow-600 shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer border border-amber-300 scale-100 hover:scale-[1.03]"
        >
          <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-amber-950" />
          <span>Tạo Thẻ Thành Tích 🏆</span>
        </button>
      </div>

      {/* Achievement Card Modal */}
      <AchievementCardModal
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
        user={user}
      />

      {/* ==================== TAB 1: TỔNG QUAN HỌC TẬP (IMAGES 1, 2, 3) ==================== */}
      {reportSubTab === 'overview' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Top 4 Stat Cards with Custom Colored Borders matching Image 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: CẤP ĐỘ (Orange Border) */}
            <div className="bg-white rounded-3xl p-5 border-2 border-[#f97316] shadow-xs space-y-3 relative overflow-hidden transition transform hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-[#f97316]">
                <span className="text-xl shrink-0">🏆</span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">CẤP ĐỘ</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                LEVEL {studentLevel !== undefined ? studentLevel : 1}
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#f97316] rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, Math.max(5, Math.round((userXp / maxXp) * 100)))}%` }}
                />
              </div>
              <div className="text-xs font-bold text-slate-500 pt-0.5">
                Tích lũy: {studentStars !== undefined ? studentStars : 0}
              </div>
            </div>

            {/* Card 2: CHUỖI NGÀY (Pink Border) */}
            <div className="bg-white rounded-3xl p-5 border-2 border-[#ec4899] shadow-xs space-y-3 relative overflow-hidden transition transform hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-[#ec4899]">
                <span className="text-xl shrink-0">🔥</span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">CHUỖI NGÀY</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {studentStreak !== undefined ? studentStreak : 0} Ngày
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 flex-1 rounded-full ${
                      i < Math.min(7, studentStreak || 4) ? 'bg-[#ec4899]' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-slate-500 pt-0.5">
                {studentStreak > 0 ? 'Hôm nay đã duy trì' : 'Hôm nay chưa điểm danh'}
              </div>
            </div>

            {/* Card 3: THỜI GIAN HỌC (Cyan Border) */}
            <div className="bg-white rounded-3xl p-5 border-2 border-[#06b6d4] shadow-xs space-y-3 relative overflow-hidden transition transform hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-[#06b6d4]">
                <span className="text-xl shrink-0">⏱️</span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">THỜI GIAN HỌC</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {studyHours || '0.1'} Giờ
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#06b6d4] rounded-full transition-all duration-300" 
                  style={{ width: `${Math.max(8, Math.min(100, Math.round((studyMinutes / 120) * 100)))}%` }}
                />
              </div>
              <div className="text-xs font-bold text-slate-500 pt-0.5">
                ~{studyMinutes || 7} phút luyện tập
              </div>
            </div>

            {/* Card 4: TỪ VỰNG ĐÃ HỌC (Purple Border) */}
            <div className="bg-white rounded-3xl p-5 border-2 border-[#a855f7] shadow-xs space-y-3 relative overflow-hidden transition transform hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-[#a855f7]">
                <span className="text-xl font-bold shrink-0">文A</span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">TỪ VỰNG ĐÃ HỌC</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {learnedVocab || 3} Từ
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#a855f7] rounded-full transition-all duration-300" 
                  style={{ width: `${Math.max(5, vocabPercent)}%` }}
                />
              </div>
              <div className="text-xs font-bold text-slate-500 pt-0.5">
                Hoàn thành {vocabPercent}%
              </div>
            </div>
          </div>

          {/* Middle Grid (Image 1 Middle Section) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Box: Sự phát triển 4 kỹ năng */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <span className="text-amber-500 text-lg">⚡</span>
                <span>Sự phát triển 4 kỹ năng</span>
              </h3>

              <div className="space-y-4 pt-1 text-xs sm:text-sm font-extrabold">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <Headphones size={17} className="text-sky-500" />
                      Listening (Nghe hiểu)
                    </span>
                    <span className="text-sky-600 font-black">{listeningSkillPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sky-400 rounded-full transition-all duration-500" 
                      style={{ width: `${listeningSkillPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <Mic size={17} className="text-orange-500" />
                      Speaking (Nói & Phát âm)
                    </span>
                    <span className="text-orange-500 font-black">{speakingSkillPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-400 rounded-full transition-all duration-500" 
                      style={{ width: `${speakingSkillPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <BookOpen size={17} className="text-emerald-500" />
                      Reading (Đọc hiểu truyện)
                    </span>
                    <span className="text-emerald-600 font-black">{readingSkillPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                      style={{ width: `${readingSkillPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <Languages size={17} className="text-purple-500" />
                      Vocabulary (Từ vựng ghi nhớ)
                    </span>
                    <span className="text-purple-600 font-black">{vocabPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-400 rounded-full transition-all duration-500" 
                      style={{ width: `${vocabPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: School Topics (Chủ đề học tập đã hoàn thành) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <span className="text-sky-600 text-lg">📚</span>
                  <span>School Topics (Chủ đề học tập đã hoàn thành)</span>
                </h3>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handleTopicsScrollUp}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center text-slate-600 cursor-pointer transition shadow-2xs"
                    title="Cuộn lên"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button 
                    onClick={handleTopicsScrollDown}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center text-slate-600 cursor-pointer transition shadow-2xs"
                    title="Cuộn xuống"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              <div 
                ref={schoolTopicsRef}
                className="max-h-[230px] overflow-y-auto pr-2 space-y-2.5 pt-1 text-xs sm:text-sm font-semibold scroll-smooth"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f1f5f9'
                }}
              >
                {[
                  { id: 1, title: 'Unit 1: Thông tin cá nhân và sở thích', rating: 3, progress: 13, isActive: true },
                  { id: 2, title: 'Unit 2: Nơi ở và địa chỉ', rating: 0, progress: 0, isActive: false },
                  { id: 3, title: 'Unit 3: Quốc tịch và tính cách', rating: 0, progress: 0, isActive: false },
                  { id: 4, title: 'Unit 4: Hoạt động trong thời gian rảnh', rating: 0, progress: 0, isActive: false },
                  { id: 5, title: 'Unit 5: Nghề nghiệp tương lai', rating: 0, progress: 0, isActive: false },
                  { id: 6, title: 'Unit 6: Các phòng học và vị trí', rating: 0, progress: 0, isActive: false },
                ].map((topic) => (
                  <div
                    key={topic.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition ${
                      topic.isActive 
                        ? 'bg-sky-50/70 border-sky-300 shadow-2xs' 
                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-cyan-500 shrink-0 text-base">🔖</span>
                      <span className="font-extrabold text-slate-800 truncate">{topic.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center text-slate-300 text-xs tracking-tighter">
                        {[...Array(5)].map((_, starI) => (
                          <span key={starI} className={starI < topic.rating ? "text-amber-400" : "text-slate-200"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={`font-black text-xs sm:text-sm ${topic.progress > 0 ? 'text-sky-600' : 'text-slate-400'}`}>
                        {topic.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Grid (Image 2 Section) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Phân bổ thời gian theo Cấp độ (Level) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <span className="text-cyan-600 text-lg">📊</span>
                <span>Phân bổ thời gian theo Cấp độ (Level)</span>
              </h3>

              <div className="space-y-3 pt-1 text-xs sm:text-sm font-extrabold">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const isCurrent = (studentLevel || 5) === lvl;
                  const timeForLvl = isCurrent ? `${studyHours || '0.1'}h (${studyMinutes || 5} phút)` : '0.0h (0 phút)';
                  return (
                    <div key={lvl} className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-2">
                        <span className="text-amber-500">🏆</span> Level {lvl}
                        {isCurrent && (
                          <span className="bg-sky-100 text-sky-600 font-black text-[10px] px-2 py-0.5 rounded-full border border-sky-200">
                            Hiện tại
                          </span>
                        )}
                      </span>
                      <span className={isCurrent ? 'text-slate-800 font-extrabold' : 'text-slate-500'}>
                        {timeForLvl}
                      </span>
                    </div>
                  );
                })}

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Clock size={16} className="text-sky-600" />
                    Tổng thời gian học
                  </span>
                  <span className="text-[#2563eb] font-black text-sm sm:text-base">
                    {studyHours || '0.1'} Giờ (~{studyMinutes || 7} phút)
                  </span>
                </div>
              </div>
            </div>

            {/* Phân bổ thời gian theo Nội dung */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <span className="text-blue-600 text-lg">🧭</span>
                <span>Phân bổ thời gian theo Nội dung</span>
              </h3>

              <div className="space-y-3 pt-1 text-xs sm:text-sm font-extrabold">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <Languages size={15} className="text-purple-600" />
                      Từ vựng ghi nhớ
                    </span>
                    <span className="text-slate-600 font-bold">0.0h (0m) <span className="text-purple-600 font-extrabold">1%</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '1%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <Headphones size={15} className="text-sky-600" />
                      Luyện nghe hiểu
                    </span>
                    <span className="text-slate-600 font-bold">0.0h (0m) <span className="text-sky-600 font-extrabold">2%</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: '2%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <Mic size={15} className="text-orange-500" />
                      Luyện nói & Phát âm
                    </span>
                    <span className="text-slate-600 font-bold">0.0h (0m) <span className="text-orange-500 font-extrabold">6%</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '6%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <BookOpen size={15} className="text-emerald-600" />
                      Luyện đọc truyện
                    </span>
                    <span className="text-slate-600 font-bold">0.0h (0m) <span className="text-emerald-600 font-extrabold">2%</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '2%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <FileText size={15} className="text-pink-600" />
                      Ôn tập & Ngữ pháp
                    </span>
                    <span className="text-slate-600 font-bold">0.1h (4m) <span className="text-pink-600 font-extrabold">50%</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <Compass size={15} className="text-amber-500" />
                      Trò chơi & Đổi quà
                    </span>
                    <span className="text-slate-600 font-bold">0.0h (0m) <span className="text-amber-500 font-extrabold">0%</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: Sự tiến hóa của bạn đồng hành (Image 2 Bottom) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <span className="text-blue-500 text-lg">💧</span>
              <span>Sự tiến hóa của bạn đồng hành</span>
            </h3>

            <div className="p-4 sm:p-5 bg-sky-50/60 rounded-2xl border-2 border-blue-400 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-blue-200 flex items-center justify-center text-4xl shrink-0 shadow-xs">
                🦖
              </div>

              <div className="space-y-1 min-w-0">
                <h4 className="text-sm sm:text-base font-black text-[#2563eb]">
                  Khủng Long Kido đang lớn!
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                  Giai đoạn hiện tại: <strong className="text-slate-900 font-black">Little Pet (Bé nhỏ)</strong>. Bé hãy học chăm chỉ để giúp Pet tiến hóa lên dạng mới nhé!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: BẢN ĐỒ LỘ TRÌNH LỚP (IMAGE 2) ==================== */}
      {reportSubTab === 'map' && (() => {
        const selectedUnits = gradeUnitsData[selectedGradeMap] || gradeUnitsData[5];
        const stepX = 185;
        const startX = 100;
        const centerY = 210;
        const amplitude = 65;
        const totalCanvasWidth = startX + (selectedUnits.length - 1) * stepX + 160;

        // Compute exact coordinates for nodes and curve
        const nodeCoords = selectedUnits.map((u, i) => {
          const x = startX + i * stepX;
          const y = i % 2 === 0 ? centerY - amplitude : centerY + amplitude;
          return {
            ...u,
            x,
            y,
            isTop: i % 2 === 0
          };
        });

        // Build SVG path string with cubic bezier segments
        let pathD = '';
        if (nodeCoords.length > 0) {
          pathD = `M ${nodeCoords[0].x} ${nodeCoords[0].y}`;
          for (let i = 0; i < nodeCoords.length - 1; i++) {
            const curr = nodeCoords[i];
            const next = nodeCoords[i + 1];
            const controlOffset = stepX * 0.48;
            pathD += ` C ${curr.x + controlOffset} ${curr.y}, ${next.x - controlOffset} ${next.y}, ${next.x} ${next.y}`;
          }
        }

        const gradePills = [
          { g: 1, label: 'Lớp 1 - KNTT', activeBg: 'bg-[#7209b7] text-white', inactiveBg: 'bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100' },
          { g: 2, label: 'Lớp 2 - KNTT', activeBg: 'bg-[#7209b7] text-white', inactiveBg: 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100' },
          { g: 3, label: 'Lớp 3 - KNTT', activeBg: 'bg-[#7209b7] text-white', inactiveBg: 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100' },
          { g: 4, label: 'Lớp 4 - KNTT', activeBg: 'bg-[#7209b7] text-white', inactiveBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' },
          { g: 5, label: 'Lớp 5 - KNTT', activeBg: 'bg-[#7209b7] text-white', inactiveBg: 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100' },
        ];

        return (
          <div className="bg-white rounded-3xl p-5 border border-purple-200/80 shadow-2xs space-y-5 animate-fadeIn">
            {/* Header Note */}
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                <Map size={18} className="text-purple-600" />
                <span>Bản đồ lộ trình học tập qua các lớp</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Bé có thể học song hành, tự do khám phá bài giảng của bất kỳ khối lớp nào. Bản đồ dưới đây hiển thị tiến độ và từng bài học lớn.
              </p>
            </div>

            {/* Grade Pills Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {gradePills.map((pill) => {
                const isSelected = selectedGradeMap === pill.g;
                return (
                  <button
                    key={pill.g}
                    onClick={() => {
                      audioService.playClickSound();
                      setSelectedGradeMap(pill.g);
                    }}
                    className={`px-3.5 py-2 rounded-2xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      isSelected ? pill.activeBg + ' scale-105 shadow-md' : pill.inactiveBg
                    }`}
                  >
                    {!isSelected && <Lock size={12} className="opacity-70" />}
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200/80 flex items-center justify-between gap-4 text-xs font-black">
              <span className="text-sky-800">Tiến độ hoàn thành lớp {selectedGradeMap}:</span>
              <div className="flex-1 max-w-md h-2.5 bg-slate-200/90 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${gradeProgressMap[selectedGradeMap] || 1}%` }}
                />
              </div>
              <span className="text-slate-700">{gradeProgressMap[selectedGradeMap] || 1}%</span>
            </div>

            {/* Visual Roadmap Canvas Container */}
            <div className="border border-slate-200/90 rounded-3xl bg-slate-50/40 relative overflow-x-auto h-[420px]">
              <div
                className="relative h-full"
                style={{ width: `${totalCanvasWidth}px` }}
              >
                {/* Winding Blue Dotted Trail SVG */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  style={{ width: `${totalCanvasWidth}px`, height: '420px' }}
                >
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    className="opacity-80"
                  />
                </svg>

                {/* Unit Nodes */}
                {nodeCoords.map((u) => {
                  return (
                    <div
                      key={u.id}
                      className="absolute z-10 flex flex-col items-center group cursor-pointer transition transform hover:scale-105"
                      style={{
                        left: `${u.x}px`,
                        top: `${u.y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Top Node Title Box */}
                      {u.isTop && (
                        <div
                          className={`absolute bottom-[100%] mb-3 left-1/2 -translate-x-1/2 bg-white border ${
                            u.isUnlocked
                              ? 'border-2 border-amber-400 bg-amber-50/30'
                              : 'border-slate-200/90'
                          } shadow-2xs rounded-2xl p-2.5 text-center w-[155px] shrink-0`}
                        >
                          <span className="text-[11px] font-black text-slate-800 leading-snug block">
                            {u.title}
                          </span>
                        </div>
                      )}

                      {/* Node Badge Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition shrink-0 ${
                          u.isUnlocked
                            ? 'bg-amber-400 border-amber-300 text-white shadow-amber-200/60 shadow-md animate-bounce-slow'
                            : 'bg-slate-100 border-slate-300 text-slate-400 shadow-2xs'
                        }`}
                      >
                        {u.isUnlocked ? (
                          <Star size={22} className="fill-white text-white" />
                        ) : (
                          <Lock size={18} />
                        )}
                      </div>

                      {/* Bottom Node Title Box */}
                      {!u.isTop && (
                        <div
                          className={`absolute top-[100%] mt-3 left-1/2 -translate-x-1/2 bg-white border ${
                            u.isUnlocked
                              ? 'border-2 border-amber-400 bg-amber-50/30'
                              : 'border-slate-200/90'
                          } shadow-2xs rounded-2xl p-2.5 text-center w-[155px] shrink-0`}
                        >
                          <span className="text-[11px] font-black text-slate-800 leading-snug block">
                            {u.title}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==================== TAB 3: ĐỒNG HÀNH CÙNG CON (IMAGES 3, 4, 5) ==================== */}
      {reportSubTab === 'parent' && (
        <div className="bg-white rounded-3xl p-5 border border-teal-200/80 shadow-2xs space-y-5 animate-fadeIn">
          {/* Header Note */}
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-teal-600" />
              <span>Cẩm nang Đồng hành cùng con</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Cẩm nang tương tác hướng dẫn ba mẹ cách đồng hành cùng con thực hành từ vựng, mẫu câu và chơi các trò chơi offline tại nhà.
            </p>
          </div>

          {/* Grade Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => {
                  audioService.playClickSound();
                  setSelectedGradeParent(g);
                  setSelectedUnitId(1);
                }}
                className={`px-3.5 py-2 rounded-2xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                  selectedGradeParent === g
                    ? 'bg-[#7209b7] text-white shadow-xs scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {selectedGradeParent !== g && <Lock size={12} className="opacity-70" />}
                <span>Lớp {g} - KNTT</span>
              </button>
            ))}
          </div>

          {/* 3 Secondary Mode Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => {
                audioService.playClickSound();
                setParentMode('curriculum');
              }}
              className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                parentMode === 'curriculum'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white text-sky-700 border border-sky-200 hover:bg-sky-50'
              }`}
            >
              <BookOpen size={14} />
              <span>Lộ trình bài học</span>
            </button>

            <button
              onClick={() => {
                audioService.playClickSound();
                setParentMode('checklist');
              }}
              className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                parentMode === 'checklist'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>Checklist Đồng hành</span>
            </button>

            <button
              onClick={() => {
                audioService.playClickSound();
                setParentMode('tips');
              }}
              className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                parentMode === 'tips'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              <Lightbulb size={14} />
              <span>Mẹo & Phương pháp học</span>
            </button>
          </div>

          {/* MODE 1: LỘ TRÌNH BÀI HỌC (IMAGE 3) */}
          {parentMode === 'curriculum' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              {/* Left Units List */}
              <div className="lg:col-span-1 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {parentUnits.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      audioService.playClickSound();
                      setSelectedUnitId(u.id);
                    }}
                    className={`w-full p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col gap-0.5 ${
                      selectedUnitId === u.id
                        ? 'bg-sky-50 border-sky-400 shadow-2xs text-sky-900'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="font-extrabold text-xs">{u.title}</span>
                    <span className="text-[11px] font-semibold text-slate-500 truncate">{u.topic}</span>
                  </button>
                ))}
              </div>

              {/* Right Detail Panel */}
              <div className="lg:col-span-2 space-y-3">
                {/* 🎯 Mục tiêu của con */}
                <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-200 space-y-2">
                  <h4 className="text-xs font-black text-sky-800 flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>Mục tiêu của con</span>
                  </h4>
                  <div className="text-xs font-semibold text-slate-700 space-y-1">
                    <p><strong className="text-slate-800">Từ vựng trọng tâm:</strong> {currentUnitDetail.topic}</p>
                    <p><strong className="text-slate-800">Mẫu câu thực hành cùng con:</strong> {currentUnitDetail.grammar}</p>
                  </div>
                </div>

                {/* 🎮 Trò chơi ngoại tuyến (Offline Game) tại nhà */}
                <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-2">
                  <h4 className="text-xs font-black text-[#2563eb] flex items-center gap-1.5">
                    <span>🎮</span>
                    <span>Trò chơi ngoại tuyến (Offline Game) tại nhà</span>
                  </h4>
                  <div className="text-xs font-semibold text-slate-700 space-y-1">
                    <p className="font-extrabold text-slate-800">{currentUnitDetail.game}</p>
                    <p className="leading-relaxed text-slate-600">{currentUnitDetail.gameDesc}</p>
                  </div>
                </div>

                {/* 💡 Lời khuyên đồng hành của Kido */}
                <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 space-y-1.5">
                  <h4 className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Lời khuyên đồng hành của Kido</span>
                  </h4>
                  <p className="text-xs font-semibold italic text-amber-900/80 leading-relaxed">
                    "Trẻ học ngôn ngữ tốt nhất qua các hoạt động vận động và trực quan. Hãy kiên nhẫn khi con phát âm chưa chuẩn xác."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: CHECKLIST ĐỒNG HÀNH (IMAGES 4, 5) */}
          {parentMode === 'checklist' && (
            <div className="space-y-4 pt-2">
              {/* Progress Bar */}
              <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 flex items-center justify-between gap-4 text-xs font-black">
                <span className="text-sky-800">Tiến độ hoàn thành checklist đồng hành:</span>
                <span className="text-slate-600">{totalChecked}/{checklistTasks.length} nhiệm vụ ({Math.round((totalChecked / Math.max(1, checklistTasks.length)) * 100)}%)</span>
              </div>

              {/* List of 22 Tasks */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {checklistTasks.map((taskText, idx) => {
                  const isChecked = !!checkedList[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check size={14} className="stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold leading-relaxed truncate">{taskText}</span>
                      </div>

                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-xl shrink-0 ${
                        isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isChecked ? 'Đã hoàn thành' : 'Chưa thực hiện'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 3: MẸO & PHƯƠNG PHÁP HỌC (IMAGE 5) */}
          {parentMode === 'tips' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-sky-900 flex items-center gap-2">
                  <span>🤝</span>
                  <span>Hãy làm bạn đồng hành cùng bé, không phải giám sát viên!</span>
                </h4>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  Khi bé học tiếng Anh, sự khích lệ và bầu không khí vui nhộn tại nhà quan trọng gấp 10 lần việc học thuộc từ vựng. Đừng quá chú trọng vào việc con phát âm sai hay đúng, hãy tập trung vào việc con có dám mở miệng nói tiếng Anh hay không. Bố hãy tích cực tham gia đóng vai, làm điệu bộ ngộ nghĩnh cùng con nhé!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-emerald-900 flex items-center gap-2">
                  <span>💡</span>
                  <span>Khen ngợi nỗ lực (Effort Praise) thay vì khen thông minh!</span>
                </h4>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  Thay vì nói "Con thông minh thế!", ba mẹ hãy khen ngợi quá trình và sự chăm chỉ của con: "Bố thấy con đã rất cố gắng tự luyện phát âm từ này tới 3 lần liền, con thật kiên nhẫn!". Lời khen nỗ lực sẽ nuôi dưỡng tư duy phát triển (Growth Mindset), giúp con không sợ thất bại khi học cái mới.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: BÍ QUYẾT HỌC SÂU (IMAGE 6) ==================== */}
      {reportSubTab === 'tips' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-200/80 shadow-2xs space-y-6 animate-fadeIn">
          {/* Top Notice */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <span className="text-rose-500">🎯</span>
              <span>Bạn đang học để nhớ, hay chỉ học để... qua bài kiểm tra?</span>
            </h3>

            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs sm:text-sm font-semibold italic text-slate-700 leading-relaxed">
              "Có bao giờ bạn từng rơi vào cảnh này chưa? Học miệt mài cả tuần, đêm trước kiểm tra vẫn cắm cúi "nhồi" kiến thức. Sáng hôm sau làm bài... cũng tạm ổn. Rồi một tuần sau, bạn nhận ra - chẳng nhớ nổi mình đã học gì."
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              Nếu điều đó quen thuộc, thì xin chúc mừng - bạn đang học theo cách của... <span className="text-rose-600 font-black">90% học sinh hiện nay</span>. Học để qua bài kiểm tra, chứ không phải để thật sự hiểu.
            </p>
          </div>

          {/* Pyramid Chart Container matching Image 6 */}
          <div className="border border-sky-200 rounded-3xl p-5 bg-sky-50/30 space-y-4">
            <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
              <span>📊</span>
              <span>Tháp hiệu quả Ghi nhớ của não bộ:</span>
            </h4>

            <div className="space-y-2 max-w-lg mx-auto text-xs font-black">
              {/* 5% */}
              <div className="flex items-center gap-3">
                <span className="w-20 text-rose-500 shrink-0">Chỉ nhớ 5%:</span>
                <div className="flex-1 p-2.5 rounded-xl bg-rose-100 text-rose-900 border border-rose-200">
                  Khi NGHE giảng bài
                </div>
              </div>

              {/* 10% */}
              <div className="flex items-center gap-3">
                <span className="w-20 text-amber-500 shrink-0">Chỉ nhớ 10%:</span>
                <div className="flex-1 p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
                  Khi ĐỌC sách giáo khoa
                </div>
              </div>

              {/* 75-90% */}
              <div className="flex items-center gap-3">
                <span className="w-20 text-emerald-600 shrink-0">Nhớ 75-90%:</span>
                <div className="flex-1 p-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-black">
                  Khi THỰC HÀNH, thảo luận, và DẠY LẠI người khác!
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
            Sự thật là: <strong className="text-sky-600 font-black">Bé không học dốt</strong>, chỉ là bé đang học sai cách. Muốn nhớ lâu, đừng chỉ "nghe và ghi". Hãy định hình phương pháp cùng Kido:
          </p>

          {/* 3 Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-sky-600 font-black text-xs sm:text-sm">
                <HelpCircle size={16} />
                <span>Hỏi "Vì sao"</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Luôn đặt câu hỏi tìm hiểu sâu nguồn gốc của bài học.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xs sm:text-sm">
                <School size={16} />
                <span>Làm "Thầy giáo nhỏ"</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Giải thích, kể lại bài học bằng tiếng Anh cho ba mẹ nghe.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-orange-600 font-black text-xs sm:text-sm">
                <Wrench size={16} />
                <span>Tự làm - Tự sửa</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Tự giải game của Pet, tự sai rồi tự nhìn ra chỗ sửa.
              </p>
            </div>
          </div>

          {/* Bottom Callout Quote */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs sm:text-sm font-bold text-purple-900 leading-relaxed text-center">
            Ngày mai, trước khi mở sách học từ vựng, bé hãy tự hỏi: <span className="text-rose-600 font-black">"Cái mình sắp học - mình định hiểu nó, hay chỉ để qua nó?"</span>. Câu trả lời của bé hôm nay sẽ quyết định bé là người học thuộc lòng máy móc, hay người thật sự làm chủ tri thức tự tin!
          </div>
        </div>
      )}
    </div>
  );
};
