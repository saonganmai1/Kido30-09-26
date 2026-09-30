import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Flame, 
  LogOut, 
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  Volume2
} from 'lucide-react';
import { UserProfile, ActiveTab } from '../types';
import { audioService } from '../utils/audio';
import { gradeUnitsData, GradeUnit } from '../data/gradeUnitsData';
import { getUnitVocabList } from '../data/unitVocabMapper';
import { triggerConfetti } from '../utils/confetti';
import { VocabIllustrationGraphic } from './VocabIllustrationGraphic';

interface QuizViewProps {
  user: UserProfile;
  setActiveTab?: (tab: ActiveTab) => void;
  onAddStars?: (amount: number) => void;
  onLogout?: () => void;
  onQuizProgressChange?: (progress: { current: number; total: number; difficulty: string; isPlaying?: boolean }) => void;
}

interface QuestionItem {
  id: number;
  question: string;
  questionType?: 'image' | 'text';
  audioText?: string;
  targetWord: string;
  phonetic: string;
  vietnameseMeaning: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Dino mascot badge for feedback bar
const MascotBadge: React.FC<{ type: 'correct' | 'wrong' }> = ({ type }) => (
  <div className={`w-12 h-12 rounded-full bg-sky-100 p-0.5 border-2 ${type === 'correct' ? 'border-emerald-300' : 'border-rose-300'} shrink-0 flex items-center justify-center shadow-2xs overflow-hidden relative`}>
    <div className="w-full h-full bg-gradient-to-b from-sky-200 to-sky-300 rounded-full flex flex-col items-center justify-center relative">
      <span className="text-xl sm:text-2xl leading-none">🦖</span>
      <span className="absolute bottom-0 text-[8px] leading-none">🧱</span>
    </div>
  </div>
);

// Kido mascot graphic for game over & victory screens (Matching Images 5 & 6)
const KidoResultMascot: React.FC = () => (
  <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 border-4 border-sky-300/80 shadow-md flex items-center justify-center relative overflow-hidden my-2">
    <div className="flex flex-col items-center justify-center relative z-10 scale-125">
      <span className="text-5xl sm:text-6xl leading-none">🦖</span>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[10px]">⭐</span>
        <span className="text-[10px]">🧸</span>
        <span className="text-[10px]">⚽</span>
      </div>
    </div>
  </div>
);

// Generate unique quiz questions per grade and unit
const generateUnitQuizQuestions = (unit: GradeUnit, grade: number): QuestionItem[] => {
  const vocabList = getUnitVocabList(grade, unit.unitNumber);
  if (!vocabList || vocabList.length === 0) return [];

  return vocabList.map((item, idx) => {
    const distractors = vocabList
      .filter((v) => v.word !== item.word)
      .map((v) => v.word);
    
    const optionsSet = new Set<string>([item.word, ...distractors]);
    if (optionsSet.size < 4) {
      optionsSet.add('classroom');
      optionsSet.add('playground');
      optionsSet.add('best friend');
      optionsSet.add('teacher');
    }
    const options = Array.from(optionsSet).slice(0, 4);
    const correctIndex = idx % 4;
    const targetIdx = options.indexOf(item.word);
    if (targetIdx !== -1 && targetIdx !== correctIndex) {
      const temp = options[correctIndex];
      options[correctIndex] = item.word;
      options[targetIdx] = temp;
    }

    const questionPrompts = [
      'Bé ơi, hình này thể hiện từ gì thế nhỉ? 🔍',
      'Từ này tiếng Việt nghĩa là gì bé nhỉ? ❓',
      'Bé hãy nhìn hình và chọn từ tiếng Anh đúng nhé! 🔍',
      'Bé hãy chọn từ tương ứng với nghĩa tiếng Việt này nhé! 🔍',
      'Đâu là từ đúng trong bài học này? 🌟'
    ];

    return {
      id: idx + 1,
      question: questionPrompts[idx % questionPrompts.length],
      questionType: idx % 2 === 0 ? 'image' : 'text',
      targetWord: item.word,
      phonetic: item.phonetic,
      vietnameseMeaning: item.meaningVi,
      audioText: item.word,
      options,
      correctIndex,
      explanation: `Chính xác! "${item.word}" (${item.phonetic}) nghĩa là: ${item.meaningVi}`,
    };
  });
};

export const QuizView: React.FC<QuizViewProps> = ({
  user,
  setActiveTab,
  onAddStars,
  onLogout,
  onQuizProgressChange,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<GradeUnit | null>(null);

  // Quiz play state inside a selected unit
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>('Dễ thương 🧸');

  const currentUnits = gradeUnitsData[selectedGrade] || gradeUnitsData[1];

  const handleStartQuiz = (unit: GradeUnit) => {
    audioService.playClickSound();
    setSelectedUnit(unit);
    const generated = generateUnitQuizQuestions(unit, selectedGrade);
    setQuestions(generated);
    setCurrentQIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setMistakes(0);
    setHasFailed(false);
    setIsFinished(false);
  };

  const handleBackToUnits = () => {
    audioService.playClickSound();
    setSelectedUnit(null);
  };

  const handleSelectOption = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQIdx].correctIndex;
    
    if (isCorrect) {
      audioService.playSuccessSound();
      setScore((prev) => prev + 1);
      triggerConfetti('default');
      if (onAddStars) onAddStars(5);
    } else {
      audioService.playClickSound();
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      if (nextMistakes >= 3) {
        setHasFailed(true);
      }
    }
  };

  const handleNextQuestion = () => {
    audioService.playClickSound();
    if (hasFailed || mistakes >= 3) {
      setIsFinished(true);
      return;
    }

    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
      audioService.playSuccessSound();
      triggerConfetti('lessonComplete');
      if (onAddStars) onAddStars(5); // Life bonus
    }
  };

  const handleRestartQuiz = () => {
    if (selectedUnit) {
      handleStartQuiz(selectedUnit);
    }
  };

  useEffect(() => {
    if (onQuizProgressChange) {
      onQuizProgressChange({
        current: currentQIdx + 1,
        total: questions.length || 8,
        difficulty,
        isPlaying: !!selectedUnit,
      });
    }
  }, [currentQIdx, questions.length, difficulty, selectedUnit, onQuizProgressChange]);

  const currentQ = questions[currentQIdx];

  return (
    <div className="space-y-4 select-none font-sans animate-fadeIn">
      {/* Navigation Sub-bar */}
      <div className="flex items-center justify-between gap-3">
        <button 
          onClick={() => {
            audioService.playClickSound();
            if (selectedUnit) {
              setSelectedUnit(null);
            } else if (setActiveTab) {
              setActiveTab('home');
            }
          }}
          className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-[#1d50b4] rounded-2xl text-xs sm:text-sm font-extrabold border border-sky-200 cursor-pointer transition flex items-center gap-1.5 shadow-2xs active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>{selectedUnit ? 'Quay Lại bài học' : 'Quay lại trang chủ'}</span>
        </button>
      </div>

      {!selectedUnit ? (
        /* Unit Selection View */
        <div className="space-y-4">
          {/* Grade Selector Tabs */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            <button
              onClick={() => {
                audioService.playClickSound();
                setSelectedGrade(1);
                setSelectedUnit(null);
              }}
              className={`py-2.5 sm:py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer text-center border ${
                selectedGrade === 1
                  ? 'bg-[#ec4899] text-white border-[#ec4899] shadow-sm'
                  : 'bg-[#fdf2f8] text-[#ec4899] border-[#fbcfe8] hover:bg-pink-100'
              }`}
            >
              Lớp 1
            </button>

            <button
              onClick={() => {
                audioService.playClickSound();
                setSelectedGrade(2);
                setSelectedUnit(null);
              }}
              className={`py-2.5 sm:py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer text-center border ${
                selectedGrade === 2
                  ? 'bg-[#f97316] text-white border-[#f97316] shadow-sm'
                  : 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5] hover:bg-orange-100'
              }`}
            >
              Lớp 2
            </button>

            <button
              onClick={() => {
                audioService.playClickSound();
                setSelectedGrade(3);
                setSelectedUnit(null);
              }}
              className={`py-2.5 sm:py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer text-center border ${
                selectedGrade === 3
                  ? 'bg-[#00b4d8] text-white border-[#00b4d8] shadow-sm'
                  : 'bg-[#ecfeff] text-[#0284c7] border-[#cffaff] hover:bg-cyan-100'
              }`}
            >
              Lớp 3
            </button>

            <button
              onClick={() => {
                audioService.playClickSound();
                setSelectedGrade(4);
                setSelectedUnit(null);
              }}
              className={`py-2.5 sm:py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer text-center border ${
                selectedGrade === 4
                  ? 'bg-[#10b981] text-white border-[#10b981] shadow-sm'
                  : 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0] hover:bg-emerald-100'
              }`}
            >
              Lớp 4
            </button>

            <button
              onClick={() => {
                audioService.playClickSound();
                setSelectedGrade(5);
                setSelectedUnit(null);
              }}
              className={`py-2.5 sm:py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer text-center border ${
                selectedGrade === 5
                  ? 'bg-[#9333ea] text-white border-[#9333ea] shadow-sm'
                  : 'bg-[#faf5ff] text-[#9333ea] border-[#f3e8ff] hover:bg-purple-100'
              }`}
            >
              Lớp 5
            </button>
          </div>

          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 pt-1">
            Chọn chủ đề thử thách Đố Vui (Lớp {selectedGrade}):
          </h2>

          {/* Unit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {currentUnits.map((unit) => {
              let iconBg = 'bg-pink-100 text-pink-600';
              if (unit.colorType === 'yellow') iconBg = 'bg-amber-100 text-amber-600';
              else if (unit.colorType === 'green') iconBg = 'bg-emerald-100 text-emerald-600';
              else if (unit.colorType === 'blue') iconBg = 'bg-sky-100 text-sky-600';
              else if (unit.colorType === 'purple') iconBg = 'bg-purple-100 text-purple-600';
              else if (unit.colorType === 'cyan') iconBg = 'bg-cyan-100 text-cyan-600';

              return (
                <div
                  key={`quiz-unit-g${selectedGrade}-${unit.id}`}
                  className="bg-white rounded-2xl p-3 border border-sky-100 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${iconBg}`}>
                      {unit.icon || '🎒'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-[13px] font-extrabold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#10b981] transition">
                        {unit.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                        {unit.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(unit)}
                    className="w-full py-2 px-3 bg-[#10b981] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Chơi Đố Vui</span>
                    <span className="text-xs">🧩</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Interactive Quiz Play Screen (Matching Images 1, 2, 3, 5, and 6 100%) */
        <div className="max-w-2xl mx-auto space-y-4 pt-1">
          {/* Top Bar above Question Box */}
          <div className="relative flex items-center justify-between min-h-[44px] px-1">
            {/* Top Left Hearts display (3 Hearts max, lost when wrong) */}
            <div className="flex items-center gap-1 text-slate-400 p-1">
              {Array.from({ length: 3 }).map((_, i) => {
                const isLost = i >= 3 - mistakes;
                return (
                  <span key={i} className={`text-xl sm:text-2xl leading-none transition ${isLost ? 'text-slate-300' : 'text-rose-500'}`}>
                    {isLost ? '♡' : '❤️'}
                  </span>
                );
              })}
            </div>

            {/* Top Center "Quay lại bài học" Button (Matching Images 1, 2, 3, 5, and 6) */}
            <button
              onClick={() => {
                audioService.playClickSound();
                setSelectedUnit(null);
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-[#1e293b] font-black text-xs sm:text-sm rounded-2xl border border-slate-200/80 shadow-2xs cursor-pointer transition flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>Quay lại bài học</span>
            </button>

            {/* Top Right Star Score Badge (Matching Images 1, 2, 3, 5, and 6) */}
            <div className="px-4 py-1.5 rounded-full bg-white text-[#78350f] border-2 border-[#facc15] font-black text-xs sm:text-sm shadow-2xs flex items-center gap-1">
              <span>{score * 5} sao</span>
            </div>
          </div>

          {/* Full-width Thin Progress Bar */}
          <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#3b82f6] rounded-full transition-all duration-300"
              style={{ width: `${isFinished ? 100 : Math.min(100, ((currentQIdx + 1) / questions.length) * 100)}%` }}
            />
          </div>

          {!isFinished && currentQ ? (
            <div className="space-y-4">
              {/* Central Question Box with Yellow Dashed Border (Matching Image 3) */}
              <div className="border-2 sm:border-3 border-dashed border-[#facc15] bg-[#fffef2]/95 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-2xs relative space-y-3">
                {/* Question Prompt */}
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
                    {currentQ.question}
                  </h3>
                  {currentQ.audioText && (
                    <button
                      onClick={() => audioService.speakEnglish(currentQ.audioText!)}
                      className="w-7 h-7 rounded-full bg-[#10b981] hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 transition shadow-2xs cursor-pointer active:scale-90"
                      title="Phát âm"
                    >
                      <Volume2 size={15} />
                    </button>
                  )}
                </div>

                {/* Question Graphic or Text Display */}
                {currentQ.questionType === 'image' ? (
                  <VocabIllustrationGraphic word={currentQ.targetWord} size="sm" />
                ) : (
                  <div className="py-2 space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#3b82f6] tracking-tight">
                      {currentQ.targetWord}
                    </h2>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-400">
                      {currentQ.phonetic}
                    </p>
                  </div>
                )}
              </div>

              {/* 4 Option Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-white border-2 border-sky-100 hover:border-sky-300 hover:bg-sky-50/50 text-[#1e293b] font-black';

                  if (selectedAnswer !== null) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'bg-[#ecfdf5] border-2 border-[#34d399] text-[#047857] font-black shadow-2xs';
                    } else if (selectedAnswer === idx) {
                      btnStyle = 'bg-[#fef2f2] border-2 border-[#f87171] text-[#b91c1c] font-black shadow-2xs';
                    } else {
                      btnStyle = 'bg-white border-2 border-sky-100 text-[#0284c7] opacity-80 font-extrabold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full py-3.5 px-5 rounded-2xl text-left text-sm sm:text-base shadow-2xs transition-all duration-150 cursor-pointer active:scale-98 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Feedback Banner */}
              {selectedAnswer !== null && (
                <div className="pt-2 animate-fadeIn">
                  {selectedAnswer === currentQ.correctIndex ? (
                    /* Correct Answer Banner */
                    <div className="bg-[#dcfce7] border border-[#bbf7d0] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <MascotBadge type="correct" />
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-black text-[#047857] flex items-center gap-1.5">
                            <span>Đúng chuẩn luôn!</span>
                            <span className="text-rose-500">❤️</span>
                          </h4>
                          <p className="text-xs sm:text-sm font-extrabold text-slate-600 mt-0.5 truncate">
                            Từ gốc: <span className="font-black text-slate-800">{currentQ.targetWord}</span> ({currentQ.phonetic}) nghĩa là: {currentQ.vietnameseMeaning}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleNextQuestion}
                        className="bg-[#3b82f6] hover:bg-blue-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-md transition cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <span>Tiếp tục</span>
                        <span>➔</span>
                      </button>
                    </div>
                  ) : (
                    /* Wrong Answer Banner */
                    <div className="bg-[#fee2e2] border border-[#fecdd3] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <MascotBadge type="wrong" />
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-black text-[#b91c1c] flex items-center gap-1.5">
                            <span>Cố lên nhé bé yêu!</span>
                            <span className="text-amber-500">💪</span>
                          </h4>
                          <p className="text-xs sm:text-sm font-extrabold text-slate-600 mt-0.5 truncate">
                            Mất 1 tim! (Còn {Math.max(0, 3 - mistakes)}/3 tim)
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleNextQuestion}
                        className="bg-[#3b82f6] hover:bg-blue-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-md transition cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <span>Tiếp tục</span>
                        <span>➔</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : hasFailed || mistakes >= 3 ? (
            /* Game Over View (Matching Sample Image 5 100%) */
            <div className="border-2 sm:border-3 border-dashed border-[#ff8c42] bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm text-center relative max-w-lg mx-auto animate-fadeIn">
              {/* Heading in Red */}
              <h2 className="text-2xl sm:text-3xl font-black text-[#ef4444] tracking-tight flex items-center justify-center gap-2">
                <span>Cố gắng lên nhé!</span>
                <span>🥰</span>
              </h2>

              {/* Kido Mascot Illustration */}
              <KidoResultMascot />

              {/* Description */}
              <p className="text-xs sm:text-sm font-extrabold text-[#1e293b] leading-relaxed max-w-sm mx-auto">
                Dù chưa qua màn, bé đã xuất sắc tích lũy được <strong className="text-amber-600">{score * 5} Sao Vàng</strong>! Hãy thử ôn tập lại bằng Flashcards rồi chinh phục lại game nha!
              </p>

              {/* 3 Broken Hearts */}
              <div className="flex items-center justify-center gap-3 text-2xl py-1 text-slate-400">
                <span>💔</span>
                <span>💔</span>
                <span>💔</span>
              </div>

              {/* Bottom 2 Action Buttons (Matching Image 5) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="w-full py-3.5 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white font-black text-sm rounded-2xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🔄</span>
                  <span>Chơi lại</span>
                </button>

                <button
                  onClick={handleBackToUnits}
                  className="w-full py-3.5 px-4 bg-[#f59e0b] hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Tiếp theo</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          ) : (
            /* Victory Completion Screen (Matching Sample Image 6 100%) */
            <div className="border-2 sm:border-3 border-dashed border-[#ff8c42] bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm text-center relative max-w-lg mx-auto animate-fadeIn">
              {/* Heading in Green */}
              <h2 className="text-2xl sm:text-3xl font-black text-[#10b981] tracking-tight flex items-center justify-center gap-2">
                <span>CHIẾN THẮNG RỰC RỠ!</span>
                <span>🎉</span>
              </h2>

              {/* Kido Mascot Illustration */}
              <KidoResultMascot />

              {/* Description */}
              <div className="space-y-1 text-xs sm:text-sm font-extrabold text-[#1e293b] leading-relaxed">
                <p>Bé đã hoàn thành xuất sắc thử thách đố vui!</p>
                <p>Điểm đạt được: <strong className="text-slate-800">{score * 5} sao</strong></p>
                <p>Thưởng tim mạng sống: <strong className="text-amber-600">+5 sao vàng</strong></p>
                <p className="text-base sm:text-lg font-black text-[#d97706] pt-1">
                  Tổng số nhận được: {(score * 5) + 5} Sao Vàng! 🌟
                </p>
              </div>

              {/* Bottom 2 Action Buttons (Matching Image 6) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="w-full py-3.5 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white font-black text-sm rounded-2xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🔄</span>
                  <span>Chơi lại</span>
                </button>

                <button
                  onClick={handleBackToUnits}
                  className="w-full py-3.5 px-4 bg-[#f59e0b] hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Tiếp theo</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

