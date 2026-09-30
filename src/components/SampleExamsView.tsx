import React, { useState } from 'react';
import { 
  Volume2, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Mic, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Check, 
  X, 
  RotateCcw,
  Send,
  MessageCircle,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio';
import { unitOutlinesByGradeSemester, getSampleExamData } from '../data/sampleExamsData';

interface SampleExamsViewProps {
  onAddStars: (amount: number) => void;
  onTriggerNotification?: (title: string, body: string) => void;
}

export const SampleExamsView: React.FC<SampleExamsViewProps> = ({
  onAddStars,
  onTriggerNotification
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<'midterm-1' | 'final-1' | 'midterm-2' | 'final-2'>('midterm-1');
  const [activeTabMode, setActiveTabMode] = useState<'outline' | 'exam'>('outline');
  const [selectedExamNum, setSelectedExamNum] = useState<number>(1);
  const [selectedUnitId, setSelectedUnitId] = useState<number | 'all'>('all');

  // Accordion state for outlines
  const [expandedUnitId, setExpandedUnitId] = useState<number | null>(1);

  // Exam answers & state
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [userExamScore, setUserExamScore] = useState<number>(0);
  
  // Interactive exam selections
  const [partAAnswers, setPartAAnswers] = useState<Record<string, string>>({});
  const [partBAnswers, setPartBAnswers] = useState<Record<string, string>>({});
  const [partCAnswers, setPartCAnswers] = useState<Record<string, string>>({});
  const [partDSpeakingIdx, setPartDSpeakingIdx] = useState<number>(1);
  const [isSpeakingActive, setIsSpeakingActive] = useState<boolean>(false);
  const [showHintAnswer, setShowHintAnswer] = useState<boolean>(false);

  const getSemesterName = () => {
    switch (selectedSemester) {
      case 'midterm-1': return 'Giữa Học Kỳ I 🌸';
      case 'final-1': return 'Học Kỳ I 🏆';
      case 'midterm-2': return 'Giữa Học Kỳ II 🌸';
      case 'final-2': return 'Học Kỳ II 🏆';
    }
  };

  const handleSpeak = (text: string) => {
    audioService.speakEnglish(text);
  };

  const handleBilingualSpeak = (en: string, vi: string) => {
    audioService.speakEnglish(en);
    setTimeout(() => {
      audioService.speakVietnamese(vi);
    }, 1800);
  };

  const toggleUnitAccordion = (id: number) => {
    audioService.playClickSound();
    setExpandedUnitId((prev) => (prev === id ? null : id));
  };

  const handleSubmitExam = () => {
    audioService.playSuccessSound();
    setExamSubmitted(true);
    setUserExamScore(9.5);
    onAddStars(5);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    if (onTriggerNotification) {
      onTriggerNotification('🏆 Nộp bài thi mẫu thành công!', 'Bé đạt 9.5 điểm và nhận ngay +5 Sao Vàng ⭐️ và +10 Kim Cương 💎!');
    }
  };

  const currentOutlinesKey = `${selectedGrade}-${selectedSemester}`;
  const currentOutlines = unitOutlinesByGradeSemester[currentOutlinesKey] || unitOutlinesByGradeSemester['1-midterm-1'];
  const currentExam = getSampleExamData(selectedGrade, selectedSemester, selectedExamNum, selectedUnitId);

  return (
    <div className="space-y-5 select-none font-sans w-full pb-10">
      {/* Grade Selector Tabs */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center text-xs font-black">
        {[1, 2, 3, 4, 5].map((grade) => {
          const isSelected = selectedGrade === grade;
          let activeBg = 'bg-[#e83e8c] text-white shadow-md scale-102';
          if (grade === 2) activeBg = 'bg-amber-500 text-white shadow-md scale-102';
          if (grade === 3) activeBg = 'bg-cyan-500 text-white shadow-md scale-102';
          if (grade === 4) activeBg = 'bg-emerald-500 text-white shadow-md scale-102';
          if (grade === 5) activeBg = 'bg-purple-500 text-white shadow-md scale-102';

          return (
            <button
              key={grade}
              onClick={() => {
                audioService.playClickSound();
                setSelectedGrade(grade);
                setSelectedUnitId('all');
                setExpandedUnitId(1);
                setExamSubmitted(false);
                setPartAAnswers({});
                setPartBAnswers({});
                setPartCAnswers({});
              }}
              className={`py-3 px-2 rounded-2xl border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                isSelected 
                  ? activeBg 
                  : 'bg-white hover:bg-pink-50/50 border-pink-100 text-slate-700 shadow-2xs'
              }`}
            >
              <span>{grade === 1 ? '🌸' : grade === 5 ? '🌸' : '🎒'}</span>
              <span>Lớp {grade}</span>
            </button>
          );
        })}
      </div>

      {/* Semester Selection Bar */}
      <div className="bg-white rounded-3xl p-4 border border-sky-100 shadow-xs space-y-3">
        <div className="text-xs font-black text-slate-700 flex items-center gap-1.5">
          <span>🏅</span>
          <span>Chọn Kỳ thi của bé:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-black">
          <button
            onClick={() => {
              audioService.playClickSound();
              setSelectedSemester('midterm-1');
              setSelectedUnitId('all');
              setExamSubmitted(false);
            }}
            className={`px-4 py-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-1.5 ${
              selectedSemester === 'midterm-1'
                ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                : 'bg-slate-50 hover:bg-pink-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>🌸</span>
            <span>Giữa học kỳ I</span>
          </button>

          <button
            onClick={() => {
              audioService.playClickSound();
              setSelectedSemester('final-1');
              setSelectedUnitId('all');
              setExamSubmitted(false);
            }}
            className={`px-4 py-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-1.5 ${
              selectedSemester === 'final-1'
                ? 'bg-[#1d50b4] text-white border-blue-700 shadow-xs'
                : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>🏆</span>
            <span>Cuối học kỳ I</span>
          </button>

          <button
            onClick={() => {
              audioService.playClickSound();
              setSelectedSemester('midterm-2');
              setSelectedUnitId('all');
              setExamSubmitted(false);
            }}
            className={`px-4 py-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-1.5 ${
              selectedSemester === 'midterm-2'
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>🌸</span>
            <span>Giữa học kỳ II</span>
          </button>

          <button
            onClick={() => {
              audioService.playClickSound();
              setSelectedSemester('final-2');
              setSelectedUnitId('all');
              setExamSubmitted(false);
            }}
            className={`px-4 py-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-1.5 ${
              selectedSemester === 'final-2'
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                : 'bg-slate-50 hover:bg-purple-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>🏆</span>
            <span>Cuối học kỳ II</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher: 1. Đề cương ôn tập VS 2. Đề thi mẫu */}
      <div className="flex items-center gap-3 text-xs font-black">
        <button
          onClick={() => {
            audioService.playClickSound();
            setActiveTabMode('outline');
          }}
          className={`px-5 py-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-2 ${
            activeTabMode === 'outline'
              ? 'bg-[#1d50b4] text-white border-blue-700 shadow-sm'
              : 'bg-white hover:bg-sky-50 text-slate-600 border-slate-200'
          }`}
        >
          <BookOpen size={16} />
          <span>📖 1. Đề cương ôn tập Lớp {selectedGrade}</span>
        </button>

        <button
          onClick={() => {
            audioService.playClickSound();
            setActiveTabMode('exam');
          }}
          className={`px-5 py-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-2 ${
            activeTabMode === 'exam'
              ? 'bg-[#1d50b4] text-white border-blue-700 shadow-sm'
              : 'bg-white hover:bg-sky-50 text-slate-600 border-slate-200'
          }`}
        >
          <FileText size={16} />
          <span>📰 2. Đề thi mẫu Lớp {selectedGrade}</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* MODE 1: OUTLINES (ĐỀ CƯƠNG ÔN TẬP) */}
      {/* ==================================================== */}
      {activeTabMode === 'outline' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-800">
              Đề cương ôn tập Lớp {selectedGrade} - {getSemesterName()} (Unit {currentOutlines[0]?.id || 1} - {currentOutlines[currentOutlines.length - 1]?.id || 10}):
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Bé bấm vào từng bài học để xem chi tiết từ vựng, mẫu câu giao tiếp và ngữ pháp trọng tâm nhé!
            </p>
          </div>

          <div className="space-y-3">
            {currentOutlines.map((unit) => {
              const isExpanded = expandedUnitId === unit.id;

              let headerBg = 'bg-emerald-100/80 border-emerald-300 text-emerald-950';
              let bodyBg = 'bg-emerald-50/40 border-emerald-200';
              if (unit.themeColor === 'purple') {
                headerBg = 'bg-purple-100/80 border-purple-300 text-purple-950';
                bodyBg = 'bg-purple-50/40 border-purple-200';
              } else if (unit.themeColor === 'orange') {
                headerBg = 'bg-amber-100/80 border-amber-300 text-amber-950';
                bodyBg = 'bg-amber-50/40 border-amber-200';
              } else if (unit.themeColor === 'cyan') {
                headerBg = 'bg-cyan-100/80 border-cyan-300 text-cyan-950';
                bodyBg = 'bg-cyan-50/40 border-cyan-200';
              } else if (unit.themeColor === 'pink') {
                headerBg = 'bg-pink-100/80 border-pink-300 text-pink-950';
                bodyBg = 'bg-pink-50/40 border-pink-200';
              }

              return (
                <div key={unit.id} className="rounded-3xl overflow-hidden border shadow-2xs transition">
                  {/* Accordion Header Bar */}
                  <button
                    onClick={() => toggleUnitAccordion(unit.id)}
                    className={`w-full p-4 flex items-center justify-between text-left font-black text-xs sm:text-sm cursor-pointer transition ${headerBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-current shrink-0" />
                      <span>{unit.title}</span>
                    </div>
                    <span className="text-xs font-bold flex items-center gap-1 shrink-0">
                      {isExpanded ? (
                        <span>▲ Thu gọn</span>
                      ) : (
                        <span>▼ Chi tiết</span>
                      )}
                    </span>
                  </button>

                  {/* Accordion Content when expanded */}
                  {isExpanded && (
                    <div className={`p-4 sm:p-5 space-y-4 bg-white border-t ${bodyBg}`}>
                      
                      {/* 1. Từ vựng quan trọng */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span>📌</span>
                          <span>Từ vựng quan trọng:</span>
                        </h5>
                        <div className="flex flex-wrap items-center gap-2">
                          {unit.vocab.map((v, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSpeak(v.word)}
                              className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                            >
                              <span>{v.word}</span>
                              <Volume2 size={13} className="text-emerald-700" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Mẫu câu giao tiếp */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span>💬</span>
                          <span>Mẫu câu giao tiếp:</span>
                        </h5>
                        <div className="space-y-2">
                          {unit.sentences.map((s, idx) => (
                            <div 
                              key={idx}
                              className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{s.en}</span>
                                  <button onClick={() => handleSpeak(s.en)} className="text-sky-600 hover:text-sky-800 cursor-pointer">
                                    <Volume2 size={14} />
                                  </button>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 italic">{s.vi}</p>
                              </div>

                              <button
                                onClick={() => handleBilingualSpeak(s.en, s.vi)}
                                className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#1d50b4] font-black text-xs border border-sky-200 flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                              >
                                <Volume2 size={13} />
                                <span>Song ngữ</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Ngữ pháp & Hội thoại Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1 text-xs">
                          <h6 className="font-black text-purple-900 flex items-center gap-1">
                            <span>📖</span>
                            <span>Ngữ pháp trọng tâm</span>
                          </h6>
                          <p className="text-slate-600 font-medium leading-relaxed">
                            {unit.grammar}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1.5 text-xs">
                          <h6 className="font-black text-sky-900 flex items-center gap-1">
                            <span>🗣️</span>
                            <span>Hội thoại vui</span>
                          </h6>
                          <p className="text-slate-700 font-bold">
                            <strong className="text-emerald-700">Kido 🦕:</strong> {unit.dialogue.kido || unit.dialogue.dino}
                          </p>
                          <p className="text-slate-700 font-bold">
                            <strong className="text-amber-700">Bé 👦:</strong> {unit.dialogue.child}
                          </p>
                        </div>
                      </div>

                      {/* 4. Mẹo của Kido */}
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-extrabold text-amber-900 flex items-center gap-2">
                        <span>💡</span>
                        <span><strong>Mẹo của Kido:</strong> {unit.tip}</span>
                      </div>

                      {/* 5. Luyện tập nhanh */}
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2 text-xs">
                        <h6 className="font-black text-emerald-900 flex items-center gap-1">
                          <span>✏️</span>
                          <span>Luyện tập nhanh:</span>
                        </h6>
                        <p className="font-extrabold text-slate-800">{unit.quiz.question}</p>
                        <div className="space-y-1.5">
                          {unit.quiz.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => {
                                audioService.playClickSound();
                                if (opt.isCorrect) {
                                  audioService.playSuccessSound();
                                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                                }
                              }}
                              className="w-full p-2.5 rounded-xl bg-white hover:bg-emerald-100/50 border border-emerald-200 text-left font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 2: SAMPLE EXAMS (ĐỀ THI MẪU) */}
      {/* ==================================================== */}
      {activeTabMode === 'exam' && (
        <div className="space-y-5">
          
          {/* Exam & Unit Selection Bar */}
          <div className="bg-white rounded-3xl p-4 border border-sky-100 shadow-xs space-y-3">
            {/* Exam Number Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-black">
              <span className="text-slate-600 flex items-center gap-1">
                <span>📝</span>
                <span>Chọn Đề thi mẫu Lớp {selectedGrade}:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      audioService.playClickSound();
                      setSelectedExamNum(num);
                      setExamSubmitted(false);
                      setPartAAnswers({});
                      setPartBAnswers({});
                      setPartCAnswers({});
                    }}
                    className={`px-3.5 py-1.5 rounded-xl border transition cursor-pointer ${
                      selectedExamNum === num
                        ? 'bg-[#1d50b4] text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Đề {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Unit / Bài Selector Pills */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-black">
              <span className="text-slate-600 flex items-center gap-1 mr-1">
                <span>📖</span>
                <span>Bài học:</span>
              </span>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  setSelectedUnitId('all');
                  setExamSubmitted(false);
                  setPartAAnswers({});
                  setPartBAnswers({});
                  setPartCAnswers({});
                }}
                className={`px-3 py-1 rounded-xl border transition cursor-pointer ${
                  selectedUnitId === 'all'
                    ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-pink-50 text-slate-700 border-slate-200'
                }`}
              >
                Tất cả bài học (Đề tổng hợp)
              </button>

              {currentOutlines.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    audioService.playClickSound();
                    setSelectedUnitId(u.id);
                    setExamSubmitted(false);
                    setPartAAnswers({});
                    setPartBAnswers({});
                    setPartCAnswers({});
                  }}
                  className={`px-3 py-1 rounded-xl border transition cursor-pointer ${
                    selectedUnitId === u.id
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Unit {u.id}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Header Banner */}
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center flex-wrap gap-2">
              <span>Đề thi mẫu số {selectedExamNum}: {getSemesterName()} - Tiếng Anh Lớp {selectedGrade}</span>
              {selectedUnitId !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold">
                  {currentOutlines.find(u => u.id === selectedUnitId)?.title}
                </span>
              )}
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Bé hãy đọc kỹ và hoàn thành các câu hỏi dưới đây để Kido chấm điểm nhé! 🦕
            </p>
          </div>

          {/* Main Exam Card Container */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-sky-100 shadow-xs space-y-8">
            
            {/* PART A: LISTENING */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-[#1d50b4] font-black text-xs border border-sky-200 shadow-2xs">
                <span>PART A: LISTENING (Nghe - 4.0 điểm)</span>
              </div>

              {/* Question 1 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs">
                    Câu 1: {currentExam.partA.q1.text}
                  </span>
                  <button 
                    onClick={() => handleSpeak(currentExam.partA.q1.audioText)}
                    className="px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-[#1d50b4] text-xs font-extrabold border border-sky-200 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Volume2 size={13} />
                    <span>Nghe phát âm</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentExam.partA.q1.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        audioService.playClickSound();
                        setPartAAnswers((prev) => ({ ...prev, q1: opt.label }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-center text-xs font-extrabold transition cursor-pointer ${
                        partAAnswers.q1 === opt.label
                          ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      {opt.label}. {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs">
                    Câu 2: {currentExam.partA.q2.text}
                  </span>
                  <button 
                    onClick={() => handleSpeak(currentExam.partA.q2.audioText)}
                    className="px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-[#1d50b4] text-xs font-extrabold border border-sky-200 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Volume2 size={13} />
                    <span>Nghe phát âm</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentExam.partA.q2.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        audioService.playClickSound();
                        setPartAAnswers((prev) => ({ ...prev, q2: opt.label }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-center text-xs font-extrabold transition cursor-pointer ${
                        partAAnswers.q2 === opt.label
                          ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      {opt.label}. {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs">
                    Câu 3: {currentExam.partA.q3.text}
                  </span>
                  <button 
                    onClick={() => handleSpeak(currentExam.partA.q3.audioText)}
                    className="px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-[#1d50b4] text-xs font-extrabold border border-sky-200 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Volume2 size={13} />
                    <span>Nghe phát âm</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {currentExam.partA.q3.items.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        audioService.playClickSound();
                        setPartAAnswers((prev) => ({ ...prev, q3: item.key }));
                      }}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-extrabold transition cursor-pointer ${
                        partAAnswers.q3 === item.key
                          ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs">
                    Câu 4: {currentExam.partA.q4.text}
                  </span>
                  <button 
                    onClick={() => handleSpeak(currentExam.partA.q4.audioText)}
                    className="px-3 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-[#1d50b4] text-xs font-extrabold border border-sky-200 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Volume2 size={13} />
                    <span>Nghe phát âm</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {currentExam.partA.q4.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        audioService.playClickSound();
                        setPartAAnswers((prev) => ({ ...prev, q4: item.key }));
                      }}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-extrabold transition cursor-pointer ${
                        partAAnswers.q4 === item.key
                          ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PART B: READING */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-200 shadow-2xs">
                <span>PART B: READING (Đọc - 2.0 điểm)</span>
              </div>

              {/* Question 1 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <span className="font-extrabold text-slate-800 text-xs">
                  Câu 1: {currentExam.partB.q1.text}
                </span>
                
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                  <span className="text-3xl">{currentExam.partB.q1.icon}</span>
                  <span className="font-black text-sky-700 italic text-sm">"{currentExam.partB.q1.statement}"</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      audioService.playClickSound();
                      setPartBAnswers((prev) => ({ ...prev, q1: 'true' }));
                    }}
                    className={`p-3 rounded-2xl border-2 text-center text-xs font-extrabold transition cursor-pointer ${
                      partBAnswers.q1 === 'true'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    ✓ (Đúng)
                  </button>
                  <button
                    onClick={() => {
                      audioService.playClickSound();
                      setPartBAnswers((prev) => ({ ...prev, q1: 'false' }));
                    }}
                    className={`p-3 rounded-2xl border-2 text-center text-xs font-extrabold transition cursor-pointer ${
                      partBAnswers.q1 === 'false'
                        ? 'bg-red-50 border-red-500 text-red-900'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    ✗ (Sai)
                  </button>
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <span className="font-extrabold text-slate-800 text-xs">
                  Câu 2: {currentExam.partB.q2.text}
                </span>
                
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                  <span className="text-3xl">{currentExam.partB.q2.icon}</span>
                  <span className="font-black text-sky-700 italic text-sm">"{currentExam.partB.q2.statement}"</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      audioService.playClickSound();
                      setPartBAnswers((prev) => ({ ...prev, q2: 'true' }));
                    }}
                    className={`p-3 rounded-2xl border-2 text-center text-xs font-extrabold transition cursor-pointer ${
                      partBAnswers.q2 === 'true'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    ✓ (Đúng)
                  </button>
                  <button
                    onClick={() => {
                      audioService.playClickSound();
                      setPartBAnswers((prev) => ({ ...prev, q2: 'false' }));
                    }}
                    className={`p-3 rounded-2xl border-2 text-center text-xs font-extrabold transition cursor-pointer ${
                      partBAnswers.q2 === 'false'
                        ? 'bg-red-50 border-red-500 text-red-900'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    ✗ (Sai)
                  </button>
                </div>
              </div>

              {/* Question 3 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <span className="font-extrabold text-slate-800 text-xs">
                  Câu 3: {currentExam.partB.q3.text}
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {currentExam.partB.q3.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        audioService.playClickSound();
                        setPartBAnswers((prev) => ({ ...prev, q3: opt.text }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-left text-xs font-extrabold transition cursor-pointer ${
                        partBAnswers.q3 === opt.text
                          ? 'bg-amber-50 border-amber-500 text-amber-950'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <span className="font-extrabold text-slate-800 text-xs">
                  Câu 4: {currentExam.partB.q4.text}
                </span>

                <div className="p-3 bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-2xl flex flex-wrap items-center justify-center gap-2">
                  {currentExam.partB.q4.wordBank.map((word, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-xs font-extrabold text-amber-900 shadow-2xs">
                      {word}
                    </span>
                  ))}
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 leading-loose text-xs font-bold text-slate-700">
                  {currentExam.partB.q4.passageTemplate.map((item) => (
                    <React.Fragment key={item.id}>
                      {item.prefix}
                      <span className="underline font-black text-sky-600 px-1">({item.id}) {item.answer}</span>
                      {item.suffix}{' '}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* PART C: WRITING */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 font-black text-xs border border-amber-200 shadow-2xs">
                <span>PART C: WRITING (Viết - 2.0 điểm)</span>
              </div>

              {/* Question 1 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <span className="font-extrabold text-slate-800 text-xs">
                  Câu 1: {currentExam.partC.q1.text}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentExam.partC.q1.icon}</span>
                  <div className="flex items-baseline gap-2 text-xs font-extrabold text-slate-800">
                    <span>{currentExam.partC.q1.prefix}</span>
                    <input
                      type="text"
                      placeholder="từ còn thiếu..."
                      value={partCAnswers.q1 || ''}
                      onChange={(e) => setPartCAnswers({ ...partCAnswers, q1: e.target.value })}
                      className="p-1.5 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-sky-800 w-36 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <span>{currentExam.partC.q1.suffix}</span>
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <span className="font-extrabold text-slate-800 text-xs">
                  Câu 2: {currentExam.partC.q2.text}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentExam.partC.q2.icon}</span>
                  <div className="flex items-baseline gap-2 text-xs font-extrabold text-slate-800">
                    <span>{currentExam.partC.q2.prefix}</span>
                    <input
                      type="text"
                      placeholder="từ còn thiếu..."
                      value={partCAnswers.q2 || ''}
                      onChange={(e) => setPartCAnswers({ ...partCAnswers, q2: e.target.value })}
                      className="p-1.5 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-sky-800 w-36 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <span>{currentExam.partC.q2.suffix}</span>
                  </div>
                </div>
              </div>

              {/* Question 3 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <span className="font-extrabold text-slate-800 text-xs">
                  Câu 3: {currentExam.partC.q3.text}
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {currentExam.partC.q3.scrambled.map((w, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold">
                      {w}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Viết cả câu hoàn chỉnh..."
                  value={partCAnswers.q3 || ''}
                  onChange={(e) => setPartCAnswers({ ...partCAnswers, q3: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Question 4 */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <span className="font-extrabold text-slate-800 text-xs">
                  Câu 4: {currentExam.partC.q4.text}
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {currentExam.partC.q4.scrambled.map((w, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold">
                      {w}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Viết cả câu hoàn chỉnh..."
                  value={partCAnswers.q4 || ''}
                  onChange={(e) => setPartCAnswers({ ...partCAnswers, q4: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* PART D: SPEAKING */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-900 font-black text-xs border border-pink-200 shadow-2xs">
                <span>PART D: SPEAKING (Nói - 2.0 điểm)</span>
              </div>

              <div className="p-5 rounded-3xl bg-sky-50/80 border-2 border-dashed border-sky-200 space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl shadow-sm">
                  🦖
                </div>

                <div>
                  <h4 className="text-sm font-black text-[#1d50b4]">{currentExam.partD.title}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {currentExam.partD.subtitle}
                  </p>
                </div>

                {/* Question Index selector */}
                <div className="flex items-center justify-center gap-2">
                  {currentExam.partD.questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setPartDSpeakingIdx(idx + 1)}
                      className={`w-7 h-7 rounded-full text-xs font-black transition cursor-pointer ${
                        partDSpeakingIdx === (idx + 1)
                          ? 'bg-blue-600 text-white shadow-xs scale-105'
                          : 'bg-sky-200 text-sky-800 hover:bg-sky-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Question Box */}
                {(() => {
                  const activeQ = currentExam.partD.questions[partDSpeakingIdx - 1] || currentExam.partD.questions[0];
                  return (
                    <div className="max-w-md mx-auto p-4 bg-white rounded-2xl border border-sky-100 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#1d50b4]">
                          Kido Hỏi Câu {partDSpeakingIdx}:
                        </span>
                        <button
                          onClick={() => handleSpeak(activeQ.questionText)}
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 text-xs font-black shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Volume2 size={13} />
                          <span>Hỏi câu này</span>
                        </button>
                      </div>

                      <h3 className="text-lg font-black text-slate-800">
                        "{activeQ.questionText}"
                      </h3>

                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
                        💡 {activeQ.tip}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setIsSpeakingActive(true);
                            audioService.playClickSound();
                            setTimeout(() => {
                              setIsSpeakingActive(false);
                              audioService.playSuccessSound();
                            }, 1800);
                          }}
                          className={`px-5 py-2.5 rounded-full text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer ${
                            isSpeakingActive ? 'bg-red-500 animate-pulse' : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          <Mic size={16} />
                          <span>{isSpeakingActive ? 'Đang thu âm...' : '🔴 🎤 Click để trả lời'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setShowHintAnswer(!showHintAnswer)}
                        className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs rounded-xl border border-amber-300 transition cursor-pointer"
                      >
                        {showHintAnswer ? 'Ẩn đáp án gợi ý' : 'Xem đáp án gợi ý của Kido'}
                      </button>

                      {showHintAnswer && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 animate-fadeIn">
                          Đáp án gợi ý: "{activeQ.suggestedAnswer}"
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Bottom Submit Bar */}
            <div className="pt-6 border-t border-slate-100 text-center space-y-3">
              {!examSubmitted ? (
                <button
                  onClick={handleSubmitExam}
                  className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-lg transition transform hover:scale-102 active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>🟩</span>
                  <span>📝 Nộp bài thi & Xem điểm</span>
                </button>
              ) : (
                <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-300 space-y-3 max-w-md mx-auto animate-fadeIn">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-2xl font-black shadow-2xs">
                    🏆
                  </div>
                  <h4 className="text-xl font-black text-emerald-950">Chúc mừng bé hoàn thành bài thi!</h4>
                  <p className="text-sm font-bold text-emerald-800">
                    Điểm số của bé: <span className="text-2xl font-black text-amber-600">9.5 / 10</span> 🌟
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    Bé nhận được +5 Sao Vàng ⭐️ và +10 Kim Cương 💎!
                  </p>
                  <button
                    onClick={() => {
                      setExamSubmitted(false);
                      setPartAAnswers({});
                      setPartBAnswers({});
                      setPartCAnswers({});
                    }}
                    className="px-5 py-2 bg-[#1d50b4] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} />
                    <span>Làm lại bài thi</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
