import React, { useState } from 'react';
import { Mail, Send, X, CheckCircle2, Clock, AlertTriangle, Sparkles, User, BookOpen, Star, Calendar, FileText, Check } from 'lucide-react';
import { StudentWeeklyGoalReport, ParentEmailRecord } from '../types';
import { generateParentEmailTemplate } from '../utils/weeklyGoalSystem';
import { audioService } from '../utils/audio';
import { UserAvatar } from './UserAvatar';

interface ParentEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: StudentWeeklyGoalReport | null;
  onSendEmail: (report: StudentWeeklyGoalReport, customSubject: string, customNote: string, targetEmail: string) => void;
  history?: ParentEmailRecord[];
}

export const ParentEmailModal: React.FC<ParentEmailModalProps> = ({
  isOpen,
  onClose,
  report,
  onSendEmail,
  history = [],
}) => {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [targetEmail, setTargetEmail] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Initialize form fields when report changes
  React.useEffect(() => {
    if (report) {
      setTargetEmail(report.parentEmail || 'caoquocbaozx4@gmail.com');
      const generated = generateParentEmailTemplate(report, report.parentName);
      setCustomSubject(generated.subject);
      setCustomNote('');
      setSentSuccess(false);
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const generated = generateParentEmailTemplate(report, report.parentName);
  const studentHistory = history.filter((h) => h.studentId === report.studentId);

  const handleSend = () => {
    if (!targetEmail.trim()) return;
    setIsSending(true);
    audioService.playClickSound();

    setTimeout(() => {
      onSendEmail(report, customSubject || generated.subject, customNote, targetEmail);
      setIsSending(false);
      setSentSuccess(true);
      audioService.playSuccessSound();

      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1400);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-sans select-none">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-700 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
              <Mail size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">Gửi Email Báo Cáo & Nhắc Nhở Phụ Huynh</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                  Tự Động & Thủ Công
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Gửi thông báo tiến độ học tập hàng tuần của bé <strong className="text-white">{report.studentName}</strong> tới Phụ huynh
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

        {/* Sub-tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('compose')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compose'
                  ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail size={14} />
              <span>Soạn & Gửi Email</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={14} />
              <span>Lịch Sử Gửi ({studentHistory.length})</span>
            </button>
          </div>

          {/* Student Chip */}
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 text-xs">
            <UserAvatar avatar={report.avatar} name={report.studentName} className="w-5 h-5 rounded-full" />
            <span className="font-extrabold text-slate-800">{report.studentName}</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
              report.isGoalMet ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {report.completedLessons}/{report.targetLessons} Bài ({report.lessonsProgressPercent}%)
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
          {activeTab === 'compose' ? (
            <div className="space-y-4">
              {/* Recipient & Subject Input Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    📧 Email Phụ Huynh Nhận Báo Cáo:
                  </label>
                  <input
                    type="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="Nhập email phụ huynh..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    📝 Tiêu Đề Email:
                  </label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Tiêu đề email gửi phụ huynh..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Status Alert Summary */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                report.isGoalMet 
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-300 text-rose-950'
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  report.isGoalMet ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                }`}>
                  {report.isGoalMet ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                      report.isGoalMet ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {report.isGoalMet ? 'ĐẠT MỤC TIÊU' : 'CHƯA HOÀN THÀNH MỤC TIÊU TUẦN'}
                    </span>
                    <span className="font-extrabold text-xs">{report.statusText}</span>
                  </div>
                  <p className="mt-1 text-slate-700 text-xs font-medium leading-relaxed">
                    {report.isGoalMet
                      ? `Bé đã hoàn thành đầy đủ ${report.completedLessons}/${report.targetLessons} bài học tuần này. Hệ thống sẽ gửi thư chúc mừng và vinh danh đến phụ huynh!`
                      : `Bé mới hoàn thành ${report.completedLessons}/${report.targetLessons} bài học (thiếu ${report.missingLessons} bài) và dành ${report.studyMinutes}/${report.targetMinutes} phút học. Email sẽ gợi ý phụ huynh đồng hành khích lệ bé.`}
                  </p>
                </div>
              </div>

              {/* Custom Note input */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 mb-1 flex items-center justify-between">
                  <span>💬 Lời Nhắn Thêm Từ Giáo Viên / Quản Trị Viên (Tùy Chọn):</span>
                  <span className="text-slate-400 font-normal text-[10px]">Sẽ hiển thị nổi bật trong thư gửi phụ huynh</span>
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Ví dụ: Bé Minh tuần này tiếp thu từ vựng rất nhanh, chỉ cần hoàn thành thêm bài ôn tập Unit 2 là đạt trọn vẹn điểm thưởng!"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Email Live Preview */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 mb-1.5 flex items-center gap-1">
                  <FileText size={13} className="text-indigo-600" />
                  <span>Xem Trước Nội Dung Thư Gửi (Email Live Preview):</span>
                </label>

                <div className="bg-slate-50 rounded-2xl border border-slate-300 p-4 space-y-3 font-sans shadow-inner">
                  {/* Email Header Preview */}
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-3.5 rounded-xl text-center shadow-xs">
                    <h4 className="font-extrabold text-sm flex items-center justify-center gap-1.5">
                      <span>🦖</span>
                      <span>KidoEnglish - Báo Cáo Học Tập Tuần</span>
                    </h4>
                    <p className="text-[10px] text-blue-100 mt-0.5">Người gửi: Hệ Thống KidoEnglish AI • Tới: {targetEmail}</p>
                  </div>

                  {/* Email Content Box */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <p className="font-bold text-slate-800">
                      Kính gửi <strong>{report.parentName || 'Quý Phụ Huynh'}</strong>,
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      KidoEnglish xin gửi bảng tổng hợp tiến độ học tập hàng tuần của bé <strong>{report.studentName}</strong> (Tài khoản: <code>@{report.studentUsername}</code>):
                    </p>

                    {/* Key Stats Grid in Email */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                        <span className="text-[10px] text-blue-700 font-bold block">Bài học</span>
                        <strong className="text-sm text-blue-950 font-black">
                          {report.completedLessons}/{report.targetLessons}
                        </strong>
                        <span className="text-[9px] text-blue-600 font-extrabold block">({report.lessonsProgressPercent}%)</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                        <span className="text-[10px] text-purple-700 font-bold block">Thời gian học</span>
                        <strong className="text-sm text-purple-950 font-black">
                          {report.studyMinutes}/{report.targetMinutes}m
                        </strong>
                        <span className="text-[9px] text-purple-600 font-extrabold block">({report.minutesProgressPercent}%)</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="text-[10px] text-amber-700 font-bold block">Sao thưởng</span>
                        <strong className="text-sm text-amber-950 font-black">
                          ⭐ {report.starsEarned}
                        </strong>
                        <span className="text-[9px] text-amber-600 font-extrabold block">({report.starsProgressPercent}%)</span>
                      </div>
                    </div>

                    {customNote && (
                      <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl text-amber-900 font-semibold">
                        <span className="font-black block text-[11px]">💬 Lời nhắn từ Thầy/Cô:</span>
                        <p className="mt-0.5 text-xs">{customNote}</p>
                      </div>
                    )}

                    {/* Kido Advice in Preview */}
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-950">
                      <p className="font-extrabold text-[11px] text-sky-800 flex items-center gap-1">
                        <span>🦖</span> Lời Nhắn Từ Khủng Long Kido:
                      </p>
                      <p className="text-xs italic text-sky-900 mt-1 font-medium">"{report.kidoAdvice || report.dinoAdvice}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-3">
              {studentHistory.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Mail size={40} className="mx-auto text-slate-300" />
                  <p className="font-extrabold text-sm text-slate-600">Chưa có lịch sử gửi email cho học sinh này.</p>
                  <p className="text-xs text-slate-400">Khi bạn hoặc hệ thống tự động gửi email, các bản ghi sẽ lưu tại đây.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {studentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-black text-xs text-slate-800">{item.subject}</h5>
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-100 text-emerald-800">
                              Đã gửi thành công ✅
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-1">
                            Người nhận: <strong className="text-indigo-700">{item.parentEmail}</strong> • Lúc: {item.sentAt}
                          </p>
                          <div className="mt-1.5 p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono line-clamp-2">
                            {item.content.substring(0, 180)}...
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500 fill-amber-400" />
            <span>Hệ thống tự động kích hoạt thông báo Toast & lưu trữ lịch sử báo cáo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>

            {activeTab === 'compose' && (
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || sentSuccess || !targetEmail.trim()}
                className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer ${
                  sentSuccess
                    ? 'bg-emerald-600 text-white'
                    : isSending
                    ? 'bg-indigo-400 text-white cursor-wait'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white active:scale-95'
                }`}
              >
                {sentSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Đã Gửi Thành Công!</span>
                  </>
                ) : isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang Gửi Email...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Gửi Email Cho Phụ Huynh Ngay 🚀</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
