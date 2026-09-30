import React, { useState, useMemo } from 'react';
import { 
  Users, 
  X, 
  Sparkles, 
  Star, 
  Zap, 
  TrendingUp, 
  Flame, 
  BookOpen, 
  Target, 
  Clock, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  ArrowLeftRight, 
  Mail, 
  Layers, 
  Check, 
  Copy,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { UserAccount } from '../types';
import { UserAvatar } from './UserAvatar';
import { audioService } from '../utils/audio';
import { getUserLevelAndXp } from '../utils/levelSystem';
import { formatAllowedGradesText } from '../utils/permissions';
import { evaluateStudentWeeklyGoal } from '../utils/weeklyGoalSystem';

interface StudentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  initialStudentIdA?: string;
  initialStudentIdB?: string;
  onAdjustStars?: (student: UserAccount, delta: number) => void;
  onOpenStudentDetails?: (student: UserAccount) => void;
  onOpenEmailModal?: (student: UserAccount) => void;
  onTriggerNotification?: (title: string, message: string, type?: 'default' | 'warning' | 'success' | 'email' | 'goal') => void;
}

export const StudentComparisonModal: React.FC<StudentComparisonModalProps> = ({
  isOpen,
  onClose,
  accounts,
  initialStudentIdA = '',
  initialStudentIdB = '',
  onAdjustStars,
  onOpenStudentDetails,
  onOpenEmailModal,
  onTriggerNotification,
}) => {
  const kidAccounts = useMemo(() => accounts.filter((a) => a.role === 'kid'), [accounts]);

  const [studentIdA, setStudentIdA] = useState<string>(
    initialStudentIdA || (kidAccounts.length > 0 ? kidAccounts[0].id : '')
  );
  const [studentIdB, setStudentIdB] = useState<string>(
    initialStudentIdB || (kidAccounts.length > 1 ? kidAccounts[1].id : (kidAccounts.length > 0 ? kidAccounts[0].id : ''))
  );
  const [filterCategory, setFilterCategory] = useState<'all' | 'scores' | 'goals' | 'permissions'>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Sync initial props
  React.useEffect(() => {
    if (initialStudentIdA) setStudentIdA(initialStudentIdA);
    if (initialStudentIdB) setStudentIdB(initialStudentIdB);
  }, [initialStudentIdA, initialStudentIdB]);

  if (!isOpen) return null;

  const studentA = accounts.find((a) => a.id === studentIdA);
  const studentB = accounts.find((a) => a.id === studentIdB);

  // Swap positions handler
  const handleSwap = () => {
    audioService.playClickSound();
    const temp = studentIdA;
    setStudentIdA(studentIdB);
    setStudentIdB(temp);
  };

  // Compute stats for Student A
  const starsA = studentA?.stars || 0;
  const levelInfoA = getUserLevelAndXp(starsA, studentA?.level, studentA?.xp);
  const streakA = studentA?.streakDays || studentA?.streak || 0;
  const lessonsA = studentA?.completedLessons || 0;
  const minutesA = studentA?.studyTimeMinutes || 0;
  const weeklyGoalA = studentA ? evaluateStudentWeeklyGoal(studentA) : null;

  // Compute stats for Student B
  const starsB = studentB?.stars || 0;
  const levelInfoB = getUserLevelAndXp(starsB, studentB?.level, studentB?.xp);
  const streakB = studentB?.streakDays || studentB?.streak || 0;
  const lessonsB = studentB?.completedLessons || 0;
  const minutesB = studentB?.studyTimeMinutes || 0;
  const weeklyGoalB = studentB ? evaluateStudentWeeklyGoal(studentB) : null;

  // Differences (Delta: A - B)
  const starDiff = starsA - starsB;
  const levelDiff = levelInfoA.level - levelInfoB.level;
  const xpDiff = levelInfoA.xp - levelInfoB.xp;
  const streakDiff = streakA - streakB;
  const lessonDiff = lessonsA - lessonsB;
  const minutesDiff = minutesA - minutesB;

  // Compute star proportion for visual meter
  const totalStarsPool = starsA + starsB;
  const percentStarA = totalStarsPool > 0 ? Math.round((starsA / totalStarsPool) * 100) : 50;
  const percentStarB = 100 - percentStarA;

  // Copy comparison summary to clipboard
  const handleCopySummary = () => {
    if (!studentA || !studentB) return;
    audioService.playClickSound();

    const summaryText = `
📊 BẢNG SO SÁNH HỌC SINH CQB: ${studentA.name} vs ${studentB.name}
----------------------------------------------------
⭐ Điểm Sao: ${studentA.name} (${starsA} ⭐) vs ${studentB.name} (${starsB} ⭐) -> Chênh lệch: ${starDiff > 0 ? `+${starDiff} sao cho ${studentA.name}` : starDiff < 0 ? `+${Math.abs(starDiff)} sao cho ${studentB.name}` : 'Bằng nhau'}
⚡ Cấp Độ: ${studentA.name} (Level ${levelInfoA.level}) vs ${studentB.name} (Level ${levelInfoB.level}) -> Chênh lệch: ${levelDiff > 0 ? `+${levelDiff} level cho ${studentA.name}` : levelDiff < 0 ? `+${Math.abs(levelDiff)} level cho ${studentB.name}` : 'Bằng nhau'}
🔥 Chuỗi Học: ${studentA.name} (${streakA} ngày) vs ${studentB.name} (${streakB} ngày)
📖 Bài Học: ${studentA.name} (${lessonsA} bài) vs ${studentB.name} (${lessonsB} bài)
🎯 Mục Tiêu Tuần: ${studentA.name} (${weeklyGoalA?.statusText}) vs ${studentB.name} (${weeklyGoalB?.statusText})
----------------------------------------------------
Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    if (onTriggerNotification) {
      onTriggerNotification('📋 Đã sao chép kết quả so sánh', 'Bản tổng hợp đối chiếu đã được lưu vào bộ nhớ tạm!', 'success');
    }
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-sans select-none">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/20 shadow-inner">
              <Users size={22} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base sm:text-lg text-white tracking-tight">
                  Bảng So Sánh & Đối Chiếu 2 Tài Khoản Học Sinh
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-2xs">
                  Trực Quan & Tức Thì ⚡
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                Nhận diện ngay sự chênh lệch về điểm số, cấp độ, chuỗi ngày học và mục tiêu tuần qua thẻ màu (Badges) & icon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs transition cursor-pointer"
              title="Sao chép báo cáo so sánh"
            >
              {copiedSummary ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              <span>{copiedSummary ? 'Đã Sao Chép!' : 'Sao Chép Báo Cáo'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
              title="Đóng modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dual Selectors Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center gap-3 shrink-0">
          {/* Select A */}
          <div className="w-full md:flex-1 bg-white p-2.5 rounded-2xl border-2 border-purple-200 shadow-2xs flex items-center gap-2.5">
            <span className="text-[11px] font-black text-purple-950 bg-purple-100 px-2.5 py-1 rounded-lg shrink-0 border border-purple-200 flex items-center gap-1">
              <span>Học sinh A:</span>
            </span>
            <select
              value={studentIdA}
              onChange={(e) => setStudentIdA(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-black text-purple-950 focus:outline-none cursor-pointer"
            >
              <option value="">-- Chọn học sinh A --</option>
              {kidAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (@{acc.username}) • Lv.{acc.level || 0} • ⭐{acc.stars || 0}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={handleSwap}
            title="Đổi vị trí 2 học sinh A ⇄ B"
            className="p-2.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-xl border border-indigo-300 font-bold transition transform hover:scale-105 active:scale-95 cursor-pointer shadow-2xs shrink-0"
          >
            <ArrowLeftRight size={16} />
          </button>

          {/* Select B */}
          <div className="w-full md:flex-1 bg-white p-2.5 rounded-2xl border-2 border-indigo-200 shadow-2xs flex items-center gap-2.5">
            <span className="text-[11px] font-black text-indigo-950 bg-indigo-100 px-2.5 py-1 rounded-lg shrink-0 border border-indigo-200 flex items-center gap-1">
              <span>Học sinh B:</span>
            </span>
            <select
              value={studentIdB}
              onChange={(e) => setStudentIdB(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-black text-indigo-950 focus:outline-none cursor-pointer"
            >
              <option value="">-- Chọn học sinh B --</option>
              {kidAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (@{acc.username}) • Lv.{acc.level || 0} • ⭐{acc.stars || 0}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {!studentA || !studentB ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Users size={54} className="mx-auto text-slate-300" />
              <p className="font-extrabold text-sm text-slate-700">Vui lòng chọn 2 tài khoản học sinh từ menu bên trên để xem đối chiếu.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Hệ thống sẽ tính toán và làm nổi bật ngay lập tức các chỉ số chênh lệch về điểm số, cấp độ và mục tiêu tuần.</p>
            </div>
          ) : studentA.id === studentB.id ? (
            <div className="py-12 text-center text-amber-700 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
              <AlertTriangle size={36} className="mx-auto text-amber-500" />
              <p className="font-extrabold text-sm">Bạn đang chọn trùng cùng 1 tài khoản học sinh ({studentA.name})!</p>
              <p className="text-xs text-amber-800 font-medium">Hãy chọn 2 học sinh khác nhau ở 2 ô phía trên để so sánh đối chiếu số liệu.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. TOP HIGHLIGHT SHOWDOWN CARDS (Visual Score & Level Differential) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Score Showdown Card */}
                <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-white p-4 rounded-2xl border-2 border-amber-300 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Star size={15} className="text-amber-500 fill-amber-400" />
                      <span>Tổng Sao Thưởng</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      starDiff > 0 ? 'bg-purple-100 text-purple-900' : starDiff < 0 ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {starDiff > 0 ? 'A Dẫn Trước' : starDiff < 0 ? 'B Dẫn Trước' : 'Cân Bằng'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] text-purple-900 font-bold truncate">{studentA.name.split(' ').slice(-1)[0]}</p>
                      <p className="text-lg font-black text-purple-950">⭐ {starsA}</p>
                    </div>
                    <div className="text-slate-300 font-bold text-sm">vs</div>
                    <div className="text-right">
                      <p className="text-[10px] text-indigo-900 font-bold truncate">{studentB.name.split(' ').slice(-1)[0]}</p>
                      <p className="text-lg font-black text-indigo-950">⭐ {starsB}</p>
                    </div>
                  </div>

                  {/* Star Differential Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div style={{ width: `${percentStarA}%` }} className="bg-purple-600 h-full transition-all duration-500" />
                    <div style={{ width: `${percentStarB}%` }} className="bg-indigo-500 h-full transition-all duration-500" />
                  </div>

                  {/* Delta Badge */}
                  <div className="pt-1">
                    {starDiff !== 0 ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black w-full justify-center shadow-2xs ${
                        starDiff > 0 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                          : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                      }`}>
                        <Award size={13} className="text-amber-300 fill-amber-300" />
                        <span>
                          {starDiff > 0 ? `Bé ${studentA.name.split(' ').slice(-1)[0]} hơn +${starDiff} sao` : `Bé ${studentB.name.split(' ').slice(-1)[0]} hơn +${Math.abs(starDiff)} sao`}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black bg-slate-100 text-slate-700 w-full justify-center">
                        <Minus size={12} />
                        <span>Hai bé bằng điểm sao nhau</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Level Showdown Card */}
                <div className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-white p-4 rounded-2xl border-2 border-purple-300 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap size={15} className="text-purple-600" />
                      <span>Cấp Độ (Level)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900">
                      Tier Rank
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] text-purple-900 font-bold truncate">{studentA.name.split(' ').slice(-1)[0]}</p>
                      <p className="text-lg font-black text-purple-950">Lv.{levelInfoA.level}</p>
                      <p className="text-[9px] text-purple-700 font-bold">{levelInfoA.xp} XP</p>
                    </div>
                    <div className="text-slate-300 font-bold text-sm">vs</div>
                    <div className="text-right">
                      <p className="text-[10px] text-indigo-900 font-bold truncate">{studentB.name.split(' ').slice(-1)[0]}</p>
                      <p className="text-lg font-black text-indigo-950">Lv.{levelInfoB.level}</p>
                      <p className="text-[9px] text-indigo-700 font-bold">{levelInfoB.xp} XP</p>
                    </div>
                  </div>

                  {/* Level Delta Badge */}
                  <div className="pt-1">
                    {levelDiff !== 0 ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black w-full justify-center shadow-2xs ${
                        levelDiff > 0 
                          ? 'bg-purple-700 text-white' 
                          : 'bg-indigo-700 text-white'
                      }`}>
                        <TrendingUp size={13} className="text-emerald-300" />
                        <span>
                          {levelDiff > 0 
                            ? `Bé ${studentA.name.split(' ').slice(-1)[0]} cao hơn +${levelDiff} level` 
                            : `Bé ${studentB.name.split(' ').slice(-1)[0]} cao hơn +${Math.abs(levelDiff)} level`}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black bg-slate-100 text-slate-700 w-full justify-center">
                        <Minus size={12} />
                        <span>Cùng đạt Level {levelInfoA.level}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Streak Showdown Card */}
                <div className="bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-white p-4 rounded-2xl border-2 border-orange-300 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame size={15} className="text-orange-500 fill-orange-400" />
                      <span>Chuỗi Ngày Học</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-900">
                      Bền Bỉ
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] text-purple-900 font-bold truncate">{studentA.name.split(' ').slice(-1)[0]}</p>
                      <p className="text-lg font-black text-orange-600">🔥 {streakA} ngày</p>
                    </div>
                    <div className="text-slate-300 font-bold text-sm">vs</div>
                    <div className="text-right">
                      <p className="text-[10px] text-indigo-900 font-bold truncate">{studentB.name.split(' ').slice(-1)[0]}</p>
                      <p className="text-lg font-black text-orange-600">🔥 {streakB} ngày</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    {streakDiff !== 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black w-full justify-center bg-orange-500 text-white shadow-2xs">
                        <Flame size={13} className="text-amber-200 fill-amber-200" />
                        <span>
                          {streakDiff > 0 
                            ? `Bé ${studentA.name.split(' ').slice(-1)[0]} bền bỉ hơn +${streakDiff} ngày` 
                            : `Bé ${studentB.name.split(' ').slice(-1)[0]} bền bỉ hơn +${Math.abs(streakDiff)} ngày`}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black bg-slate-100 text-slate-700 w-full justify-center">
                        <Minus size={12} />
                        <span>Chuỗi học bằng nhau</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Weekly Goal Progress Showdown Card */}
                <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-white p-4 rounded-2xl border-2 border-emerald-300 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Target size={15} className="text-emerald-600" />
                      <span>Mục Tiêu Tuần Này</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900">
                      Weekly Goals
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-purple-900 font-bold truncate">{studentA.name.split(' ').slice(-1)[0]}</p>
                      <span className={`px-2 py-0.5 rounded-md font-black text-[10px] inline-block ${
                        weeklyGoalA?.isGoalMet ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {weeklyGoalA?.isGoalMet ? '✅ Đạt 100%' : `⚠️ ${weeklyGoalA?.completedLessons}/${weeklyGoalA?.targetLessons} bài`}
                      </span>
                    </div>

                    <div className="text-slate-300 font-bold text-sm">vs</div>

                    <div className="space-y-0.5 text-right">
                      <p className="text-[10px] text-indigo-900 font-bold truncate">{studentB.name.split(' ').slice(-1)[0]}</p>
                      <span className={`px-2 py-0.5 rounded-md font-black text-[10px] inline-block ${
                        weeklyGoalB?.isGoalMet ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {weeklyGoalB?.isGoalMet ? '✅ Đạt 100%' : `⚠️ ${weeklyGoalB?.completedLessons}/${weeklyGoalB?.targetLessons} bài`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    {weeklyGoalA?.isGoalMet && !weeklyGoalB?.isGoalMet ? (
                      <button
                        type="button"
                        onClick={() => onOpenEmailModal && onOpenEmailModal(studentB)}
                        className="w-full py-1 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition"
                      >
                        <Mail size={12} />
                        <span>Gửi email nhắc bé {studentB.name.split(' ').slice(-1)[0]} 📧</span>
                      </button>
                    ) : !weeklyGoalA?.isGoalMet && weeklyGoalB?.isGoalMet ? (
                      <button
                        type="button"
                        onClick={() => onOpenEmailModal && onOpenEmailModal(studentA)}
                        className="w-full py-1 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition"
                      >
                        <Mail size={12} />
                        <span>Gửi email nhắc bé {studentA.name.split(' ').slice(-1)[0]} 📧</span>
                      </button>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black w-full justify-center ${
                        weeklyGoalA?.isGoalMet ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {weeklyGoalA?.isGoalMet ? '🌟 Cả hai đều đạt chỉ tiêu' : '⚠️ Cả hai cần nỗ lực thêm'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. DETAILED COMPARISON MATRIX TABLE */}
              <div className="overflow-x-auto border-2 border-slate-200 rounded-3xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                      <th className="py-3.5 px-4 w-1/4 font-black uppercase text-[11px] tracking-wider">
                        Tiêu Chí Đối Chiếu
                      </th>
                      
                      {/* Column Student A */}
                      <th className="py-3.5 px-4 w-1/3 bg-purple-50/90 border-r border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar avatar={studentA.avatar} name={studentA.name} className="w-9 h-9 shrink-0 ring-2 ring-purple-400" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded-md bg-purple-700 text-white font-black text-[9px]">A</span>
                              <p className="font-black text-sm text-purple-950 truncate">{studentA.name}</p>
                            </div>
                            <p className="text-[10px] text-purple-700 font-bold truncate">@{studentA.username}</p>
                          </div>
                        </div>
                      </th>

                      {/* Column Student B */}
                      <th className="py-3.5 px-4 w-1/3 bg-indigo-50/90 border-r border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar avatar={studentB.avatar} name={studentB.name} className="w-9 h-9 shrink-0 ring-2 ring-indigo-400" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded-md bg-indigo-700 text-white font-black text-[9px]">B</span>
                              <p className="font-black text-sm text-indigo-950 truncate">{studentB.name}</p>
                            </div>
                            <p className="text-[10px] text-indigo-700 font-bold truncate">@{studentB.username}</p>
                          </div>
                        </div>
                      </th>

                      {/* Evaluation / Delta Column */}
                      <th className="py-3.5 px-4 w-1/4 font-black uppercase text-[11px] tracking-wider text-slate-700 bg-slate-100">
                        Chênh Lệch & Đánh Giá
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {/* Row 1: Gói VIP & Quyền hạn */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-black text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-500" />
                        <span>Gói Tài Khoản & VIP</span>
                      </td>

                      <td className={`py-3.5 px-4 border-r border-slate-200 ${studentA.isVip ? 'bg-amber-50/30' : ''}`}>
                        {studentA.isVip ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-2xs">
                            <Sparkles size={13} />
                            <span>VIP PRO ({studentA.vipExpiryDate || '2027'})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                            ⚪ Gói Chuẩn (Miễn Phí)
                          </span>
                        )}
                      </td>

                      <td className={`py-3.5 px-4 border-r border-slate-200 ${studentB.isVip ? 'bg-amber-50/30' : ''}`}>
                        {studentB.isVip ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-2xs">
                            <Sparkles size={13} />
                            <span>VIP PRO ({studentB.vipExpiryDate || '2027'})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                            ⚪ Gói Chuẩn (Miễn Phí)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 bg-slate-50/30">
                        {studentA.isVip === studentB.isVip ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-black text-[11px]">
                            <CheckCircle2 size={12} /> Cùng gói {studentA.isVip ? 'VIP PRO' : 'Miễn Phí'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-black text-[11px]">
                            ⚡ {studentA.isVip ? `${studentA.name} có VIP` : `${studentB.name} có VIP`}
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Row 2: Cấp Độ & XP */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-black text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <Zap size={16} className="text-purple-600" />
                        <span>Cấp Độ & Điểm XP</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-950 font-black text-xs border border-purple-200">
                              Level {levelInfoA.level}
                            </span>
                            <span className="text-[11px] font-mono text-purple-700 font-bold">{levelInfoA.xp} / {levelInfoA.maxXp} XP</span>
                          </div>
                          <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div style={{ width: `${levelInfoA.percent}%` }} className="bg-purple-600 h-full" />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-950 font-black text-xs border border-indigo-200">
                              Level {levelInfoB.level}
                            </span>
                            <span className="text-[11px] font-mono text-indigo-700 font-bold">{levelInfoB.xp} / {levelInfoB.maxXp} XP</span>
                          </div>
                          <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div style={{ width: `${levelInfoB.percent}%` }} className="bg-indigo-600 h-full" />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 bg-slate-50/30">
                        {levelDiff > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[11px]">
                            <ArrowUpRight size={14} className="text-emerald-700 font-bold" />
                            <span>Học sinh A cao hơn +{levelDiff} Cấp độ ({xpDiff >= 0 ? `+${xpDiff} XP` : ''})</span>
                          </span>
                        ) : levelDiff < 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-300 font-black text-[11px]">
                            <ArrowUpRight size={14} className="text-indigo-700 font-bold" />
                            <span>Học sinh B cao hơn +{Math.abs(levelDiff)} Cấp độ</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-black text-[11px]">
                            <Minus size={12} /> Bằng cấp độ ({levelInfoA.level})
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Row 3: Tổng Sao Thưởng */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-black text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <Star size={16} className="text-amber-500 fill-amber-400" />
                        <span>Tổng Sao Thưởng (⭐)</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-amber-700">⭐ {starsA}</span>
                          {starDiff > 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              🥇 Dẫn đầu
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-amber-700">⭐ {starsB}</span>
                          {starDiff < 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              🥇 Dẫn đầu
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 bg-slate-50/30">
                        {starDiff > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300 font-black text-[11px]">
                            <Award size={13} className="text-emerald-700" />
                            <span>Học sinh A nhiều hơn +{starDiff} ⭐</span>
                          </span>
                        ) : starDiff < 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-900 border border-indigo-300 font-black text-[11px]">
                            <Award size={13} className="text-indigo-700" />
                            <span>Học sinh B nhiều hơn +{Math.abs(starDiff)} ⭐</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-black text-[11px]">
                            <Minus size={12} /> Bằng điểm sao ({starsA} ⭐)
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Row 4: Chuỗi Học Liên Tục */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-black text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <Flame size={16} className="text-orange-500 fill-orange-400" />
                        <span>Chuỗi Học Liên Tục</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className="text-sm font-black text-orange-600">🔥 {streakA} Ngày</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className="text-sm font-black text-orange-600">🔥 {streakB} Ngày</span>
                      </td>

                      <td className="py-3.5 px-4 bg-slate-50/30">
                        {streakDiff > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-100 text-orange-900 border border-orange-300 font-black text-[11px]">
                            <Flame size={13} className="text-orange-600" />
                            <span>Học sinh A bền bỉ hơn +{streakDiff} ngày</span>
                          </span>
                        ) : streakDiff < 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-100 text-orange-900 border border-orange-300 font-black text-[11px]">
                            <Flame size={13} className="text-orange-600" />
                            <span>Học sinh B bền bỉ hơn +{Math.abs(streakDiff)} ngày</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-black text-[11px]">
                            <Minus size={12} /> Chuỗi ngày bằng nhau ({streakA} ngày)
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Row 5: Số Bài Học Đã Hoàn Thành */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-black text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-600" />
                        <span>Tổng Bài Học Đã Làm</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className="text-xs font-black text-indigo-900">📖 {lessonsA} Bài học</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className="text-xs font-black text-indigo-900">📖 {lessonsB} Bài học</span>
                      </td>

                      <td className="py-3.5 px-4 bg-slate-50/30">
                        {lessonDiff !== 0 ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-[11px] ${
                            lessonDiff > 0 ? 'bg-teal-100 text-teal-900 border border-teal-300' : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                          }`}>
                            <TrendingUp size={13} />
                            <span>{lessonDiff > 0 ? `Học sinh A làm nhiều hơn +${lessonDiff} bài` : `Học sinh B làm nhiều hơn +${Math.abs(lessonDiff)} bài`}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-black text-[11px]">
                            <Minus size={12} /> Cùng hoàn thành {lessonsA} bài
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Row 6: Mục Tiêu Học Tập Tuần */}
                    <tr className="hover:bg-slate-50/60 transition bg-amber-50/20">
                      <td className="py-3.5 px-4 font-black text-slate-800 bg-slate-50/60 flex items-center gap-2">
                        <Target size={16} className="text-rose-600" />
                        <span>Tiến Độ Mục Tiêu Tuần</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="space-y-1">
                          <span className={`px-2.5 py-1 rounded-lg font-black text-xs inline-flex items-center gap-1 ${
                            weeklyGoalA?.isGoalMet ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {weeklyGoalA?.isGoalMet ? <CheckCircle2 size={13} className="text-emerald-700" /> : <AlertTriangle size={13} className="text-rose-700" />}
                            <span>{weeklyGoalA?.completedLessons}/{weeklyGoalA?.targetLessons} Bài ({weeklyGoalA?.lessonsProgressPercent}%)</span>
                          </span>
                          <p className="text-[10px] text-slate-500 font-bold">{weeklyGoalA?.statusText}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="space-y-1">
                          <span className={`px-2.5 py-1 rounded-lg font-black text-xs inline-flex items-center gap-1 ${
                            weeklyGoalB?.isGoalMet ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {weeklyGoalB?.isGoalMet ? <CheckCircle2 size={13} className="text-emerald-700" /> : <AlertTriangle size={13} className="text-rose-700" />}
                            <span>{weeklyGoalB?.completedLessons}/{weeklyGoalB?.targetLessons} Bài ({weeklyGoalB?.lessonsProgressPercent}%)</span>
                          </span>
                          <p className="text-[10px] text-slate-500 font-bold">{weeklyGoalB?.statusText}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 bg-slate-50/30">
                        <div className="space-y-1.5">
                          {weeklyGoalA?.isGoalMet && weeklyGoalB?.isGoalMet ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black text-[11px]">
                              🎉 Cả 2 học sinh đều hoàn thành chỉ tiêu tuần!
                            </span>
                          ) : !weeklyGoalA?.isGoalMet && !weeklyGoalB?.isGoalMet ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-100 text-rose-900 font-black text-[11px]">
                              ⚠️ Cả 2 học sinh đều chưa hoàn thành chỉ tiêu tuần
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-[11px]">
                                🎯 {weeklyGoalA?.isGoalMet ? `Bé ${studentA.name} đạt, bé ${studentB.name} chưa đạt` : `Bé ${studentB.name} đạt, bé ${studentA.name} chưa đạt`}
                              </span>
                              <button
                                type="button"
                                onClick={() => onOpenEmailModal && onOpenEmailModal(!weeklyGoalA?.isGoalMet ? studentA : studentB)}
                                className="px-2.5 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] flex items-center gap-1 cursor-pointer transition shadow-2xs"
                              >
                                <Mail size={11} /> Gửi email nhắc phụ huynh
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Row 7: Thời Gian Học Tập */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-black text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        <span>Thời Gian Học Tập</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className="text-xs font-black text-slate-800">⏱️ {minutesA} Phút (~{(minutesA / 60).toFixed(1)}h)</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className="text-xs font-black text-slate-800">⏱️ {minutesB} Phút (~{(minutesB / 60).toFixed(1)}h)</span>
                      </td>

                      <td className="py-3.5 px-4 bg-slate-50/30">
                        {minutesDiff !== 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-100 text-sky-900 font-black text-[11px]">
                            <Clock size={12} />
                            <span>{minutesDiff > 0 ? `Học sinh A học nhiều hơn +${minutesDiff} phút` : `Học sinh B học nhiều hơn +${Math.abs(minutesDiff)} phút`}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-black text-[11px]">
                            <Minus size={12} /> Bằng thời gian học ({minutesA}m)
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Row 8: Phân Quyền Khối Lớp */}
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-black text-slate-700 bg-slate-50/50 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <span>Phân Quyền Khối Lớp</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className="text-xs text-indigo-900 font-extrabold">
                          {formatAllowedGradesText(studentA.allowedGrades, studentA.role)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className="text-xs text-indigo-900 font-extrabold">
                          {formatAllowedGradesText(studentB.allowedGrades, studentB.role)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 bg-slate-50/30">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-black text-[10px]">
                          Phân quyền giáo trình tự động
                        </span>
                      </td>
                    </tr>

                    {/* Row 9: Thao Tác Nhanh */}
                    <tr className="bg-slate-100/80">
                      <td className="py-3.5 px-4 font-black text-slate-800 flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" />
                        <span>Thao Tác Nhanh</span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {onAdjustStars && (
                            <button
                              type="button"
                              onClick={() => onAdjustStars(studentA, 10)}
                              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10px] transition shadow-2xs cursor-pointer"
                            >
                              +10 Sao ⭐
                            </button>
                          )}
                          {onOpenEmailModal && (
                            <button
                              type="button"
                              onClick={() => onOpenEmailModal(studentA)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition shadow-2xs flex items-center gap-1 cursor-pointer"
                            >
                              <Mail size={11} /> Gửi Email
                            </button>
                          )}
                          {onOpenStudentDetails && (
                            <button
                              type="button"
                              onClick={() => onOpenStudentDetails(studentA)}
                              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold text-[10px] transition shadow-2xs cursor-pointer"
                            >
                              Hồ Sơ 🔍
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {onAdjustStars && (
                            <button
                              type="button"
                              onClick={() => onAdjustStars(studentB, 10)}
                              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10px] transition shadow-2xs cursor-pointer"
                            >
                              +10 Sao ⭐
                            </button>
                          )}
                          {onOpenEmailModal && (
                            <button
                              type="button"
                              onClick={() => onOpenEmailModal(studentB)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition shadow-2xs flex items-center gap-1 cursor-pointer"
                            >
                              <Mail size={11} /> Gửi Email
                            </button>
                          )}
                          {onOpenStudentDetails && (
                            <button
                              type="button"
                              onClick={() => onOpenStudentDetails(studentB)}
                              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold text-[10px] transition shadow-2xs cursor-pointer"
                            >
                              Hồ Sơ 🔍
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 bg-slate-100">
                        <span className="text-[10px] text-slate-500 font-bold">Thao tác trực tiếp thời gian thực</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <Sparkles size={14} className="text-amber-500 fill-amber-400" />
            <span className="hidden sm:inline">Dữ liệu đối chiếu cập nhật trực tiếp theo thời gian thực và đồng bộ Firebase</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="sm:hidden px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
            >
              📋 Sao Chép
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Đóng Bảng So Sánh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
