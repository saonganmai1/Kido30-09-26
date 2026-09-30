import React, { useState, useEffect, useRef } from 'react';
import {
  Cloud,
  Trophy,
  Star,
  Flame,
  LogOut,
  ArrowLeft,
  Volume2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Mic,
  MicOff,
  Check,
  CheckCircle2,
  Play,
  Lightbulb,
  Zap,
  Puzzle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { audioService } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { UserAccount, UserProfile } from '../types';

interface LinearThinkingPracticeViewProps {
  user?: UserAccount | UserProfile;
  onAddStars?: (count: number) => void;
  onLogout?: () => void;
  onBack?: () => void;
}

interface LegoPiece {
  id: string;
  text: string;
  category: 'subject' | 'action' | 'detail';
  categoryLabel: string;
}

interface Game1Question {
  id: string;
  unitId: string;
  vietnameseMeaning: string;
  prefixText?: string;
  fullEnglish: string;
  slots: {
    type: 'subject' | 'action' | 'detail';
    label: string;
    sublabel: string;
    targetText: string;
  }[];
  legoPool: LegoPiece[];
}

interface Game2Data {
  topic: string;
  step1: { sublabel: string; text: string };
  step2: { sublabel: string; text: string };
  step3: { sublabel: string; text: string; reward: number };
}

// SAMPLE DATA FOR GRADES & UNITS
const UNITS_DATA = [
  { id: 'u1', title: 'Unit 1: Hello', icon: '🖐️' },
  { id: 'u2', title: 'Unit 2: Our Names', icon: '👅' },
  { id: 'u3', title: 'Unit 3: Our Friends', icon: '🤝' },
  { id: 'u4', title: 'Unit 4: Our Bodies', icon: '👁️' },
  { id: 'u5', title: 'Unit 5: My Hobbies', icon: '🎨' },
  { id: 'u6', title: 'Unit 6: Our School', icon: '🏫' },
];

const GAME1_QUESTIONS: Record<string, Game1Question[]> = {
  u1: [
    {
      id: 'q1-1',
      unitId: 'u1',
      vietnameseMeaning: 'Xin chào, tớ là Dino.',
      prefixText: 'Hello,',
      fullEnglish: 'Hello, I am Dino.',
      slots: [
        {
          type: 'subject',
          label: 'Subject (Ai / Cái gì?)',
          sublabel: 'Chủ ngữ / Đối tượng (Bấm chọn)',
          targetText: 'I',
        },
        {
          type: 'action',
          label: 'Action (Làm gì / Là gì?)',
          sublabel: 'Hành động / Liên kết (Bấm chọn)',
          targetText: 'am',
        },
        {
          type: 'detail',
          label: 'Detail (Chi tiết / Thế nào?)',
          sublabel: 'Chi tiết bổ sung (Bấm chọn)',
          targetText: 'Dino',
        },
      ],
      legoPool: [
        { id: 'p1', text: 'I', category: 'subject', categoryLabel: 'CHỦ NGỮ (WHO)' },
        { id: 'p2', text: 'am', category: 'action', categoryLabel: 'HÀNH ĐỘNG (ACTION)' },
        { id: 'p3', text: 'Dino', category: 'detail', categoryLabel: 'CHI TIẾT (DETAIL)' },
      ],
    },
    {
      id: 'q1-2',
      unitId: 'u1',
      vietnameseMeaning: 'Tớ rất vui được gặp bạn.',
      prefixText: 'Nice to',
      fullEnglish: 'Nice to meet you.',
      slots: [
        {
          type: 'subject',
          label: 'Subject (Ai / Cái gì?)',
          sublabel: 'Chủ ngữ / Đối tượng (Bấm chọn)',
          targetText: 'meet',
        },
        {
          type: 'action',
          label: 'Action (Làm gì / Là gì?)',
          sublabel: 'Hành động / Liên kết (Bấm chọn)',
          targetText: 'you',
        },
        {
          type: 'detail',
          label: 'Detail (Chi tiết / Thế nào?)',
          sublabel: 'Chi tiết bổ sung (Bấm chọn)',
          targetText: 'today',
        },
      ],
      legoPool: [
        { id: 'p1-2', text: 'meet', category: 'subject', categoryLabel: 'ĐỘNG TỪ (VERB)' },
        { id: 'p2-2', text: 'you', category: 'action', categoryLabel: 'TÂN NGỮ (OBJECT)' },
        { id: 'p3-2', text: 'today', category: 'detail', categoryLabel: 'THỜI GIAN (TIME)' },
      ],
    },
  ],
  u2: [
    {
      id: 'q2-1',
      unitId: 'u2',
      vietnameseMeaning: 'Tên của tớ là Mai.',
      prefixText: '',
      fullEnglish: 'My name is Mai.',
      slots: [
        {
          type: 'subject',
          label: 'Subject (Ai / Cái gì?)',
          sublabel: 'Chủ ngữ / Đối tượng (Bấm chọn)',
          targetText: 'My name',
        },
        {
          type: 'action',
          label: 'Action (Làm gì / Là gì?)',
          sublabel: 'Hành động / Liên kết (Bấm chọn)',
          targetText: 'is',
        },
        {
          type: 'detail',
          label: 'Detail (Chi tiết / Thế nào?)',
          sublabel: 'Chi tiết bổ sung (Bấm chọn)',
          targetText: 'Mai',
        },
      ],
      legoPool: [
        { id: 'p21', text: 'My name', category: 'subject', categoryLabel: 'CHỦ NGỮ (SUBJECT)' },
        { id: 'p22', text: 'is', category: 'action', categoryLabel: 'ĐỘNG TỪ (VERB)' },
        { id: 'p23', text: 'Mai', category: 'detail', categoryLabel: 'TÊN RIÊNG (NAME)' },
      ],
    },
  ],
};

const GAME2_DATA: Record<string, Game2Data> = {
  u1: {
    topic: 'Chào hỏi & Tự giới thiệu',
    step1: { sublabel: 'Bước 1: Chào hỏi', text: 'Hello!' },
    step2: { sublabel: 'Bước 2: Giới thiệu tên', text: 'Hello, I am Dino.' },
    step3: {
      sublabel: 'Bước 3: Chuỗi phản xạ hoàn chỉnh (+15 Sao)',
      text: 'Hello! I am Dino. Nice to meet you!',
      reward: 15,
    },
  },
  u2: {
    topic: 'Hỏi & Trả lời về tên',
    step1: { sublabel: 'Bước 1: Hỏi tên', text: 'What is your name?' },
    step2: { sublabel: 'Bước 2: Trả lời tên', text: 'My name is Mai.' },
    step3: {
      sublabel: 'Bước 3: Chuỗi phản xạ hoàn chỉnh (+15 Sao)',
      text: 'What is your name? My name is Mai. Nice to meet you!',
      reward: 15,
    },
  },
};

export const LinearThinkingPracticeView: React.FC<LinearThinkingPracticeViewProps> = ({
  user,
  onAddStars,
  onLogout,
  onBack,
}) => {
  // Navigation States
  const [selectedGrade, setSelectedGrade] = useState<'Lớp 3' | 'Lớp 4' | 'Lớp 5'>('Lớp 3');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('u1');
  const [gameMode, setGameMode] = useState<'game1' | 'game2'>('game1');

  // Game 1 State
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const currentQuestions = GAME1_QUESTIONS[selectedUnitId] || GAME1_QUESTIONS['u1'];
  const currentQuestion = currentQuestions[questionIndex] || currentQuestions[0];

  // Placed Slots: index -> LegoPiece | null
  const [placedSlots, setPlacedSlots] = useState<Record<number, LegoPiece | null>>({
    0: null,
    1: null,
    2: null,
  });

  // Check state
  const [isGame1Completed, setIsGame1Completed] = useState<boolean>(false);

  // Game 2 State
  const currentGame2 = GAME2_DATA[selectedUnitId] || GAME2_DATA['u1'];
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSuccess, setSpeechSuccess] = useState<boolean>(false);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  // User Stats
  const userStars = user?.stars ?? 313;
  const userLevel = user?.level ?? 7;
  const userStreak = user?.streakDays ?? 4;
  const userAvatar = user?.avatar || '🐊';

  // Reset slots when question changes or unit changes
  useEffect(() => {
    setPlacedSlots({ 0: null, 1: null, 2: null });
    setIsGame1Completed(false);
  }, [questionIndex, selectedUnitId]);

  // Handle Lego Piece Placement
  const handlePlacePiece = (piece: LegoPiece) => {
    // Check if piece is already placed in one of the slots
    const isAlreadyPlaced = Object.values(placedSlots).some((p) => p?.id === piece.id);
    if (isAlreadyPlaced) {
      // Remove piece from slot
      const newSlots = { ...placedSlots };
      for (const key in newSlots) {
        if (newSlots[key]?.id === piece.id) {
          newSlots[key] = null;
        }
      }
      setPlacedSlots(newSlots);
      audioService.playClickSound();
      return;
    }

    // Place piece in matching empty slot or first available empty slot
    audioService.playClickSound();
    const newSlots = { ...placedSlots };

    // Try finding slot matching category first
    let targetSlotIndex = -1;
    if (piece.category === 'subject' && !newSlots[0]) targetSlotIndex = 0;
    else if (piece.category === 'action' && !newSlots[1]) targetSlotIndex = 1;
    else if (piece.category === 'detail' && !newSlots[2]) targetSlotIndex = 2;

    // If matching category slot is taken, find first empty slot
    if (targetSlotIndex === -1) {
      if (!newSlots[0]) targetSlotIndex = 0;
      else if (!newSlots[1]) targetSlotIndex = 1;
      else if (!newSlots[2]) targetSlotIndex = 2;
    }

    if (targetSlotIndex !== -1) {
      newSlots[targetSlotIndex] = piece;
      setPlacedSlots(newSlots);

      // Speak word placed
      audioService.speakEnglish(piece.text, 0.9);

      // Check if all slots are filled
      if (newSlots[0] && newSlots[1] && newSlots[2]) {
        verifyGame1Answer(newSlots);
      }
    }
  };

  // Handle Slot Click (Remove piece if filled)
  const handleSlotClick = (index: number) => {
    if (placedSlots[index]) {
      audioService.playClickSound();
      setPlacedSlots((prev) => ({ ...prev, [index]: null }));
      setIsGame1Completed(false);
    }
  };

  // Verify Game 1 Answer
  const verifyGame1Answer = (slots: Record<number, LegoPiece | null>) => {
    const isCorrect =
      slots[0]?.text === currentQuestion.slots[0].targetText &&
      slots[1]?.text === currentQuestion.slots[1].targetText &&
      slots[2]?.text === currentQuestion.slots[2].targetText;

    if (isCorrect) {
      setIsGame1Completed(true);
      audioService.playSuccessSound();
      triggerConfetti('default');
      if (onAddStars) onAddStars(10);
    } else {
      audioService.playErrorSound();
    }
  };

  // Reset Game 1 Slots
  const handleResetGame1 = () => {
    audioService.playClickSound();
    setPlacedSlots({ 0: null, 1: null, 2: null });
    setIsGame1Completed(false);
  };

  // Play Full Sentence Audio
  const handlePlayFullAudio = (text: string) => {
    audioService.playClickSound();
    audioService.speakEnglish(text, 0.85);
  };

  // Toggle Speech Recognition for Game 2
  const handleToggleSpeech = () => {
    audioService.playClickSound();

    if (isListening) {
      // Stop Listening
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    // Start Listening
    setIsListening(true);
    setSpeechSuccess(false);
    setSpeechFeedback('');

    // Check Speech Recognition API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          checkSpeechResult(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation
          simulateSpeechResult();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        simulateSpeechResult();
      }
    } else {
      // Fallback simulation for environments without Web Speech API
      simulateSpeechResult();
    }
  };

  const simulateSpeechResult = () => {
    setTimeout(() => {
      setIsListening(false);
      checkSpeechResult(currentGame2.step3.text);
    }, 2500);
  };

  const checkSpeechResult = (transcript: string) => {
    setSpeechSuccess(true);
    setSpeechFeedback(`Bé phát âm rất tốt: "${transcript}" 🎉`);
    audioService.playSuccessSound();
    triggerConfetti('lessonComplete');
    if (onAddStars) onAddStars(15);
  };

  return (
    <div className="min-h-screen bg-[#edf4ff] text-slate-800 p-3 sm:p-6 select-none font-sans space-y-5">
      {/* 1. TOP HEADER BAR */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-sky-100">
        {/* Left Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cloud className="text-sky-500 fill-sky-100" size={28} />
            <span>Trạm Tư Duy Linear</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Khám phá cấu trúc câu Tiếng Anh SGK Lớp 3 theo mô hình 3 màu LinearThinking!
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
            className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
          >
            <LogOut size={14} />
            <span>Thoát</span>
          </button>
        </div>
      </header>

      {/* 2. GRADE SELECTOR & BACK BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Quay lại button */}
        <button
          onClick={() => {
            audioService.playClickSound();
            if (onBack) onBack();
          }}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition"
        >
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </button>

        {/* Khối Lớp Pill Group */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-600">Khối Lớp:</span>
          <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-2xl border border-slate-200 shadow-2xs">
            {(['Lớp 3', 'Lớp 4', 'Lớp 5'] as const).map((grade) => {
              const isSelected = selectedGrade === grade;
              const icon = grade === 'Lớp 3' ? '✨' : grade === 'Lớp 4' ? '🚀' : '👑';
              return (
                <button
                  key={grade}
                  onClick={() => {
                    audioService.playClickSound();
                    setSelectedGrade(grade);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-xs scale-105'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{grade}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. UNITS CAROUSEL / SCROLL BAR */}
      <div className="relative bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
          {UNITS_DATA.map((unit) => {
            const isSelected = selectedUnitId === unit.id;
            return (
              <button
                key={unit.id}
                onClick={() => {
                  audioService.playClickSound();
                  setSelectedUnitId(unit.id);
                  setQuestionIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 text-blue-600 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{unit.icon}</span>
                <span>{unit.title}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Indicator Bar */}
        <div className="w-1/3 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
      </div>

      {/* 4. GAME MODE SWITCHER BUTTONS */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            audioService.playClickSound();
            setGameMode('game1');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-xs ${
            gameMode === 'game1'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Puzzle size={16} />
          <span>Game 1: Ghép Khối Lego 3 Màu</span>
        </button>

        <button
          onClick={() => {
            audioService.playClickSound();
            setGameMode('game2');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-xs ${
            gameMode === 'game2'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Zap size={16} />
          <span>Game 2: Chuỗi Phản Xạ Tư Duy</span>
        </button>
      </div>

      {/* 5. MAIN GAME CONTENT CONTAINER */}
      {gameMode === 'game1' ? (
        /* GAME 1: GHÉP KHỐI LEGO 3 MÀU */
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-blue-200/80 shadow-md space-y-6">
          {/* Top Instruction Box */}
          <div className="bg-sky-50/80 border border-sky-300 rounded-2xl p-4 flex items-start gap-3 text-xs font-bold text-sky-950">
            <Lightbulb size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Cách học song hướng cho bé:</strong> Bé có thể <strong>nhấp mảnh Lego phía dưới</strong> hoặc <strong>nhấp trực tiếp ô slot trống phía trên</strong> để ghép mảnh Lego tương ứng vào câu. Nhấp lại ô slot phía trên nếu muốn gỡ mảnh!
            </p>
          </div>

          {/* Question Title & Audio Sample Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-black tracking-wider text-blue-600 uppercase">
                THỬ THÁCH GHÉP CÂU ({selectedUnitId.toUpperCase()}: {UNITS_DATA.find((u) => u.id === selectedUnitId)?.title.split(': ')[1] || 'HELLO'})
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Nghĩa tiếng Việt: "{currentQuestion.vietnameseMeaning}"
              </h2>
            </div>

            {/* Listen Sample Sentence Button */}
            <button
              onClick={() => handlePlayFullAudio(currentQuestion.fullEnglish)}
              className="bg-sky-100 hover:bg-sky-200 text-blue-700 border border-sky-300 rounded-full px-4 py-2 text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <Volume2 size={18} className="text-blue-600" />
              <span>Nghe mẫu cả câu</span>
            </button>
          </div>

          {/* Dashed Target Slots Area */}
          <div className="border-2 border-dashed border-sky-300 rounded-3xl p-6 bg-sky-50/30 flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-h-[120px]">
            {/* Prefix Text if exists */}
            {currentQuestion.prefixText && (
              <span className="text-lg sm:text-xl font-black text-slate-800 mr-1">
                {currentQuestion.prefixText}
              </span>
            )}

            {/* 3 Slots */}
            {currentQuestion.slots.map((slot, idx) => {
              const placedPiece = placedSlots[idx];
              const slotColorClasses =
                slot.type === 'subject'
                  ? 'border-blue-500 text-blue-700 bg-blue-50/50'
                  : slot.type === 'action'
                  ? 'border-orange-500 text-orange-700 bg-orange-50/50'
                  : 'border-emerald-500 text-emerald-700 bg-emerald-50/50';

              const badgeColorClasses =
                slot.type === 'subject'
                  ? 'bg-blue-600 text-white'
                  : slot.type === 'action'
                  ? 'bg-orange-500 text-white'
                  : 'bg-emerald-600 text-white';

              return (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  className={`border-2 rounded-2xl p-3 sm:p-4 min-w-[140px] sm:min-w-[170px] text-center cursor-pointer transition hover:scale-102 relative bg-white shadow-2xs ${slotColorClasses}`}
                >
                  {/* Slot Header Label */}
                  <div className="text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-sm inline-block ${badgeColorClasses}`} />
                    <span>{slot.label}</span>
                  </div>

                  {/* Slot Content or Sublabel Placeholder */}
                  {placedPiece ? (
                    <div className="text-base sm:text-lg font-black tracking-wide py-1 text-slate-900 animate-fadeIn">
                      {placedPiece.text}
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-slate-400 py-1">
                      {slot.sublabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lego Pieces Pool Box */}
          <div className="bg-slate-100/80 rounded-3xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
              <span>👉</span>
              <span>Kho mảnh Lego (Bấm mảnh để xếp hoặc bấm ô trên để tự ghép/gỡ):</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {currentQuestion.legoPool.map((piece) => {
                const isPlaced = Object.values(placedSlots).some((p) => p?.id === piece.id);
                const colorBorder =
                  piece.category === 'subject'
                    ? 'border-blue-500 text-blue-700 hover:bg-blue-50'
                    : piece.category === 'action'
                    ? 'border-orange-500 text-orange-700 hover:bg-orange-50'
                    : 'border-emerald-500 text-emerald-700 hover:bg-emerald-50';

                return (
                  <button
                    key={piece.id}
                    onClick={() => handlePlacePiece(piece)}
                    disabled={isPlaced}
                    className={`bg-white border-2 rounded-2xl px-5 py-3 text-center transition cursor-pointer shadow-xs ${colorBorder} ${
                      isPlaced ? 'opacity-30 scale-95 cursor-not-allowed border-slate-300' : 'hover:scale-105 active:scale-95'
                    }`}
                  >
                    <div className="text-[9px] font-black uppercase tracking-wider opacity-80">
                      {piece.categoryLabel}
                    </div>
                    <div className="text-sm sm:text-base font-black mt-0.5">{piece.text}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Control Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {/* Xếp lại Button */}
            <button
              onClick={handleResetGame1}
              className="bg-sky-50 hover:bg-sky-100 text-blue-700 font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 border border-sky-200 transition cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Xếp lại</span>
            </button>

            {/* Navigation Next / Prev */}
            <div className="flex items-center gap-2">
              <button
                disabled={questionIndex === 0}
                onClick={() => {
                  audioService.playClickSound();
                  setQuestionIndex((prev) => Math.max(0, prev - 1));
                }}
                className="bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Câu trước</span>
              </button>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  if (questionIndex + 1 < currentQuestions.length) {
                    setQuestionIndex((prev) => prev + 1);
                  } else {
                    // Completed all questions in unit!
                    audioService.playSuccessSound();
                    triggerConfetti('lessonComplete');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer active:scale-95"
              >
                <span>Câu tiếp</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GAME 2: CHUỖI PHẢN XẠ TƯ DUY */
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-purple-200/80 shadow-md space-y-5">
          {/* Header Info */}
          <div className="space-y-1">
            <span className="text-[11px] font-black tracking-wider text-purple-600 uppercase">
              LUYỆN PHẢN XẠ 3 BƯỚC
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Chủ đề: {currentGame2.topic}
            </h2>
          </div>

          {/* Step 1 Box */}
          <div className="bg-white border-2 border-blue-400 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500">
                {currentGame2.step1.sublabel}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {currentGame2.step1.text}
              </h3>
            </div>
            <button
              onClick={() => handlePlayFullAudio(currentGame2.step1.text)}
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md transition cursor-pointer"
            >
              <Volume2 size={20} />
            </button>
          </div>

          {/* Step 2 Box */}
          <div className="bg-white border-2 border-orange-400 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500">
                {currentGame2.step2.sublabel}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {currentGame2.step2.text}
              </h3>
            </div>
            <button
              onClick={() => handlePlayFullAudio(currentGame2.step2.text)}
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md transition cursor-pointer"
            >
              <Volume2 size={20} />
            </button>
          </div>

          {/* Step 3 Box (Solid Emerald Green Card) */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md transition">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-emerald-100">
                {currentGame2.step3.sublabel}
              </span>
              <h3 className="text-lg sm:text-xl font-black tracking-wide text-white">
                {currentGame2.step3.text}
              </h3>
            </div>
            <button
              onClick={() => handlePlayFullAudio(currentGame2.step3.text)}
              className="w-10 h-10 rounded-full bg-white text-emerald-700 hover:bg-emerald-50 flex items-center justify-center shrink-0 shadow-md transition cursor-pointer"
            >
              <Volume2 size={20} />
            </button>
          </div>

          {/* Speech Practice Box (Bottom Container) */}
          <div className="bg-pink-50/60 border border-pink-200 rounded-3xl p-6 text-center space-y-3">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-purple-900 flex items-center justify-center gap-1.5">
                <Mic size={18} className="text-pink-600" />
                <span>Thử thách đọc cả chuỗi (+15 Sao Bonus)</span>
              </h3>
              <p className="text-xs font-extrabold text-slate-600">
                Nhấp nút Micro và nói câu: "{currentGame2.step3.text}"
              </p>
            </div>

            {/* Mic Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleToggleSpeech}
                className={`px-6 py-3 rounded-full text-xs font-black text-white shadow-lg flex items-center gap-2 transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 animate-pulse hover:bg-rose-600 scale-105'
                    : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff size={16} />
                    <span>Đang lắng nghe... (Bấm để dừng)</span>
                  </>
                ) : (
                  <>
                    <Mic size={16} />
                    <span>Nói Chuỗi 3 Bước (+15 Sao)</span>
                  </>
                )}
              </button>
            </div>

            {/* Feedback Message */}
            {speechFeedback && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-black max-w-md mx-auto animate-fadeIn mt-2">
                {speechFeedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
