import React, { useState, useMemo } from 'react';
import { 
  Target, 
  X, 
  Sparkles, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Settings, 
  Send, 
  Users, 
  Clock, 
  Star, 
  BookOpen, 
  Bell, 
  Sliders, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { UserAccount, WeeklyGoalConfig, StudentWeeklyGoalReport } from '../types';
import { UserAvatar } from './UserAvatar';
import { audioService } from '../utils/audio';
import { 
  getWeeklyGoalConfig, 
  saveWeeklyGoalConfig, 
  scanAllStudentsWeeklyGoals, 
  evaluateStudentWeeklyGoal 
} from '../utils/weeklyGoalSystem';

interface WeeklyGoalAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  onOpenEmailModal: (student: UserAccount, report: StudentWeeklyGoalReport) => void;
  onTriggerNotification: (title: string, message: string, type?: 'default' | 'warning' | 'success' | 'email' | 'goal') => void;
}

export const WeeklyGoalAlertModal: React.FC<WeeklyGoalAlertModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onOpenEmailModal,
  onTriggerNotification,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'unmet' | 'achieved' | 'config'>('unmet');
  const [config, setConfig] = useState<WeeklyGoalConfig>(getWeeklyGoalConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { allReports, unmetReports, achievedReports } = useMemo(() => {
    return scanAllStudentsWeeklyGoals(accounts, undefined, config);
  }, [accounts, config]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    audioService.playClickSound();
    saveWeeklyGoalConfig(config);
    setSaveSuccess(true);
    onTriggerNotification(
      '🎯 Đã Cập Nhật Mục Tiêu Tuần',
      `Mục tiêu mới: ${config.targetLessons} bài học, ${config.targetStudyMinutes} phút học, ${config.targetStars} sao thưởng.`,
      'goal'
    );
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSendToastAlert = (report: StudentWeeklyGoalReport) => {
    audioService.playClickSound();
    const student = accounts.find((a) => a.id === report.studentId);
    if (!student) return;

    if (report.isGoalMet) {
      onTriggerNotification(
        `🌟 Vinh danh bé ${report.studentName}`,
        `Bé đã hoàn thành ${report.completedLessons}/${report.targetLessons} bài học và tích lũy ⭐ ${report.starsEarned} sao!`,
        'success'
      );
    } else {
      onTriggerNotification(
        `⚠️ Nhắc nhở mục tiêu: Bé ${report.studentName}`,
        `Bé còn thiếu ${report.missingLessons} bài học để hoàn thành mục tiêu tuần này (${report.completedLessons}/${report.targetLessons} bài).`,
        'warning'
      );
    }
  };

  const handleSendBulkToastAlerts = () => {
    audioService.playClickSound();
    if (unmetReports.length === 0) {
      onTriggerNotification('🎉 Tuyệt Vời!', 'Tất cả học sinh đều đã đạt mục tiêu tuần này!', 'success');
      return;
    }

    unmetReports.forEach((report, index) => {
      setTimeout(() => {
        onTriggerNotification(
          `⚠️ Cảnh Báo Mục Tiêu: ${report.studentName}`,
          `Tiến độ: ${report.completedLessons}/${report.targetLessons} bài (${report.lessonsProgressPercent}%). Đã gửi cảnh báo tới phụ huynh (${report.parentEmail}).`,
          'warning'
        );
      }, index * 400);
    });
  };

  const currentList = filterTab === 'unmet' ? unmetReports : filterTab === 'achieved' ? achievedReports : allReports;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-sans select-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-amber-700 to-indigo-800 text-white p-5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/25 shadow-inner">
              <Target size={24} className="text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base sm:text-lg text-white tracking-tight">
                  Theo Dõi Mục Tiêu Học Tập & Cảnh Báo Phụ Huynh
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-2xs">
                  {unmetReports.length} Học Sinh Chưa Đạt
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Tự động quét học sinh chưa hoàn thành chỉ tiêu tuần và gửi cảnh báo Toast hoặc Email phụ huynh
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterTab('unmet')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'unmet'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <AlertTriangle size={14} />
              <span>Chưa Đạt ({unmetReports.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('achieved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'achieved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>Đạt Xuất Sắc ({achievedReports.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Users size={14} />
              <span>Tất Cả ({allReports.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('config')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'config'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Sliders size={14} />
              <span>Cấu Hình Mục Tiêu</span>
            </button>
          </div>

          {filterTab !== 'config' && unmetReports.length > 0 && (
            <button
              type="button"
              onClick={handleSendBulkToastAlerts}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Bell size={14} />
              <span>Phát Thông Báo Tự Động Toàn Bộ ({unmetReports.length})</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-slate-800 text-xs">
          {filterTab === 'config' ? (
            /* Config Tab */
            <div className="max-w-xl mx-auto space-y-5 py-2">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3 text-indigo-950">
                <Sliders size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-xs text-indigo-900">Thiết lập mục tiêu hàng tuần áp dụng toàn hệ thống</h4>
                  <p className="text-[11px] text-indigo-700 mt-0.5 leading-relaxed">
                    Hệ thống sẽ tự động đối chiếu số bài học, thời gian và số sao của từng bé theo các mốc dưới đây. Khi chưa đạt, phụ huynh sẽ nhận được thông báo Toast hoặc Email nhắc nhở.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    📖 Số Bài Học Mục Tiêu Mỗi Tuần (Bài):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={config.targetLessons}
                    onChange={(e) => setConfig({ ...config, targetLessons: Number(e.target.value) || 1 })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Khuyến nghị: 5-8 bài / tuần cho học sinh tiểu học.</p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    ⏱️ Thời Gian Học Tập Tối Thiểu (Phút):
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={600}
                    value={config.targetStudyMinutes}
                    onChange={(e) => setConfig({ ...config, targetStudyMinutes: Number(e.target.value) || 10 })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Khuyến nghị: 45 - 90 phút / tuần.</p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    ⭐ Mục Tiêu Sao Thưởng Tích Lũy (Sao):
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={config.targetStars}
                    onChange={(e) => setConfig({ ...config, targetStars: Number(e.target.value) || 5 })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    📧 Email Phụ Huynh Mặc Định Nhận Báo Cáo:
                  </label>
                  <input
                    type="email"
                    value={config.parentEmail || ''}
                    onChange={(e) => setConfig({ ...config, parentEmail: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={15} />
                    <span>{saveSuccess ? 'Đã Lưu Thành Công!' : 'Lưu Cài Đặt Mục Tiêu'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Student List */
            <div className="space-y-3">
              {currentList.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <CheckCircle2 size={44} className="mx-auto text-emerald-400" />
                  <p className="font-extrabold text-sm text-slate-700">Không có học sinh nào trong danh sách này.</p>
                  <p className="text-xs text-slate-400">Tất cả các bé đều đang theo đúng tiến độ học tập xuất sắc!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {currentList.map((report) => {
                    const student = accounts.find((a) => a.id === report.studentId);
                    if (!student) return null;

                    return (
                      <div
                        key={report.studentId}
                        className={`p-4 rounded-2xl border-2 transition-all shadow-xs space-y-3 ${
                          report.isGoalMet
                            ? 'bg-emerald-50/40 border-emerald-300'
                            : 'bg-rose-50/40 border-rose-300'
                        }`}
                      >
                        {/* Top Student Info */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar avatar={report.avatar} name={report.studentName} className="w-10 h-10 rounded-xl" />
                            <div>
                              <h4 className="font-black text-xs text-slate-900">{report.studentName}</h4>
                              <p className="text-[10px] text-slate-500 font-bold">
                                @{report.studentUsername} • Email: {report.parentEmail}
                              </p>
                            </div>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                            report.isGoalMet ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}>
                            {report.isGoalMet ? 'ĐẠT 🌟' : 'CHƯA ĐẠT ⚠️'}
                          </span>
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                          {/* Lessons Progress */}
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                              <span>📖 Bài học: {report.completedLessons}/{report.targetLessons} bài</span>
                              <span className={report.lessonsProgressPercent >= 100 ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                                {report.lessonsProgressPercent}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${report.lessonsProgressPercent}%` }}
                                className={`h-full ${report.lessonsProgressPercent >= 100 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              />
                            </div>
                          </div>

                          {/* Minutes Progress */}
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                              <span>⏱️ Thời gian: {report.studyMinutes}/{report.targetMinutes} phút</span>
                              <span className="text-slate-700">{report.minutesProgressPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${report.minutesProgressPercent}%` }}
                                className="h-full bg-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Kido Advice Chip */}
                        <p className="text-[11px] text-slate-600 italic line-clamp-2 bg-white/70 p-2 rounded-lg border border-slate-200">
                          "{report.kidoAdvice || report.dinoAdvice}"
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSendToastAlert(report)}
                            className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 shadow-2xs transition cursor-pointer"
                          >
                            <Bell size={13} />
                            <span>Bắn Toast Cảnh Báo</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenEmailModal(student, report)}
                            className="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] flex items-center justify-center gap-1 shadow-2xs transition cursor-pointer"
                          >
                            <Mail size={13} />
                            <span>Gửi Email Phụ Huynh 📧</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
            <Sparkles size={14} className="text-amber-500 fill-amber-400" />
            <span>Hệ thống tự động kích hoạt thông báo Toast tới giao diện khi học sinh chậm tiến độ</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
