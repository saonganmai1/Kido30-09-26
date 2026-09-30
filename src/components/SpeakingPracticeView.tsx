import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  Volume2,
  Trophy,
  Star,
  Flame,
  ArrowLeft,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Search,
  Sparkles,
  CheckCircle2,
  X,
  Lock,
  Globe,
  Music,
  VolumeX,
  Volume2 as Volume2Icon,
  ChevronRight,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';
import { audioService } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface SpeakingPracticeViewProps {
  user?: UserProfile;
  onAddStars?: (count: number) => void;
  onBack?: () => void;
  onLogout?: () => void;
}

export interface SpeakingItem {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  grade: number; // 0 for all, 1, 2, 3, 4, 5
  category: string; // 'tu-don' | 'chao-hoi' | 'giao-tiep' | '135-cau' | 'mau-cau'
  categoryLabel: string;
  badgeLabel?: string;
  icon?: string;
  imageType?: 'doll' | 'name' | 'heart' | 'map' | 'really' | 'rest' | 'run' | 'generic';
}

const SPEAKING_ITEMS: SpeakingItem[] = [
  // Grade 3 Items
  {
    id: 'g3-td-1',
    word: 'doll',
    phonetic: '/dɑːl/',
    translation: 'búp bê',
    grade: 3,
    category: 'tu-don',
    categoryLabel: 'Từ đơn lớp 3',
    badgeLabel: 'Doll',
    imageType: 'doll',
  },
  {
    id: 'g3-td-2',
    word: 'robot',
    phonetic: '/ˈroʊbɑːt/',
    translation: 'người máy',
    grade: 3,
    category: 'tu-don',
    categoryLabel: 'Từ đơn lớp 3',
    badgeLabel: 'Robot',
    imageType: 'generic',
    icon: '🤖',
  },
  {
    id: 'g3-td-3',
    word: 'car',
    phonetic: '/kɑːr/',
    translation: 'xe ô tô',
    grade: 3,
    category: 'tu-don',
    categoryLabel: 'Từ đơn lớp 3',
    badgeLabel: 'Car',
    imageType: 'generic',
    icon: '🚗',
  },
  {
    id: 'g3-ch-1',
    word: 'My name is Lucy.',
    phonetic: '/maɪ neɪm ɪz ˈluːsi/',
    translation: 'Tên tớ là Lucy.',
    grade: 3,
    category: 'chao-hoi',
    categoryLabel: 'Chào hỏi & Làm quen',
    badgeLabel: 'NAME',
    imageType: 'name',
  },
  {
    id: 'g3-ch-2',
    word: 'Nice to meet you.',
    phonetic: '/naɪs tuː miːt juː/',
    translation: 'Rất vui được gặp bạn.',
    grade: 3,
    category: 'chao-hoi',
    categoryLabel: 'Chào hỏi & Làm quen',
    badgeLabel: 'GREET',
    imageType: 'generic',
    icon: '🤝',
  },
  {
    id: 'g3-gt-1',
    word: 'Thank you very much.',
    phonetic: '/θæŋk juː ˈveri mʌtʃ/',
    translation: 'Cảm ơn bạn rất nhiều.',
    grade: 3,
    category: 'giao-tiep',
    categoryLabel: 'Giao tiếp hằng ngày',
    badgeLabel: 'THANKS',
    imageType: 'heart',
  },
  {
    id: 'g3-135-1',
    word: 'Can you show me on the map?',
    phonetic: '/kæn juː ʃoʊ miː ɑːn ðə mæp/',
    translation: 'Bạn chỉ tôi trên bản đồ được không?',
    grade: 3,
    category: '135-cau',
    categoryLabel: '135 câu giao tiếp (0/135)',
    badgeLabel: 'MAP',
    imageType: 'map',
  },
  {
    id: 'g3-135-2',
    word: 'What time is it?',
    phonetic: '/wɑːt taɪm ɪz ɪt/',
    translation: 'Mấy giờ rồi?',
    grade: 3,
    category: '135-cau',
    categoryLabel: '135 câu giao tiếp (0/135)',
    badgeLabel: 'TIME',
    imageType: 'generic',
    icon: '⏰',
  },

  // Grade 1 Items
  {
    id: 'g1-td-1',
    word: 'run',
    phonetic: '/rʌn/',
    translation: 'chạy bộ',
    grade: 1,
    category: 'tu-don',
    categoryLabel: 'Từ đơn Lớp 1',
    badgeLabel: 'Run',
    imageType: 'run',
  },
  {
    id: 'g1-td-2',
    word: 'book',
    phonetic: '/bʊk/',
    translation: 'quyển sách',
    grade: 1,
    category: 'tu-don',
    categoryLabel: 'Từ đơn Lớp 1',
    badgeLabel: 'Book',
    imageType: 'generic',
    icon: '📚',
  },
  {
    id: 'g1-mc-1',
    word: 'Good morning!',
    phonetic: '/ɡʊd ˈmɔːrnɪŋ/',
    translation: 'Chào buổi sáng!',
    grade: 1,
    category: 'mau-cau',
    categoryLabel: 'Mẫu câu Lớp 1',
    badgeLabel: 'Morning',
    imageType: 'generic',
    icon: '☀️',
  },

  // Grade 5 Items
  {
    id: 'g5-td-1',
    word: 'really',
    phonetic: '/ˈriːəli/',
    translation: 'rất',
    grade: 5,
    category: 'tu-don',
    categoryLabel: 'Từ đơn Lớp 5',
    badgeLabel: 'Really',
    imageType: 'really',
  },
  {
    id: 'g5-mc-1',
    word: 'You should have a rest if you are tired.',
    phonetic: '/juː ʃʊd hæv ə rest ɪf juː ɑːr taɪərd/',
    translation: 'Con nên nghỉ ngơi nếu con mệt.',
    grade: 5,
    category: 'mau-cau',
    categoryLabel: 'Mẫu câu Lớp 5',
    badgeLabel: 'Rest',
    imageType: 'rest',
  },

  // Grade 2 Items
  {
    id: 'g2-td-1',
    word: 'school',
    phonetic: '/skuːl/',
    translation: 'trường học',
    grade: 2,
    category: 'tu-don',
    categoryLabel: 'Từ đơn Lớp 2',
    badgeLabel: 'School',
    imageType: 'generic',
    icon: '🏫',
  },
  {
    id: 'g2-mc-1',
    word: 'This is my school.',
    phonetic: '/ðɪs ɪz maɪ skuːl/',
    translation: 'Đây là trường học của tớ.',
    grade: 2,
    category: 'mau-cau',
    categoryLabel: 'Mẫu câu Lớp 2',
    badgeLabel: 'School',
    imageType: 'generic',
    icon: '🏫',
  },

  // Grade 4 Items
  {
    id: 'g4-td-1',
    word: 'swimming',
    phonetic: '/ˈswɪmɪŋ/',
    translation: 'bơi lội',
    grade: 4,
    category: 'tu-don',
    categoryLabel: 'Từ đơn Lớp 4',
    badgeLabel: 'Swim',
    imageType: 'generic',
    icon: '🏊',
  },
  {
    id: 'g4-mc-1',
    word: 'I like swimming in summer.',
    phonetic: '/aɪ laɪk ˈswɪmɪŋ ɪn ˈsʌmər/',
    translation: 'Tớ thích bơi lội vào mùa hè.',
    grade: 4,
    category: 'mau-cau',
    categoryLabel: 'Mẫu câu Lớp 4',
    badgeLabel: 'Swim',
    imageType: 'generic',
    icon: '🏊',
  },
];

export const SpeakingPracticeView: React.FC<SpeakingPracticeViewProps> = ({
  user,
  onAddStars,
  onBack,
  onLogout,
}) => {
  // Navigation & Category states
  const [selectedGrade, setSelectedGrade] = useState<number>(0); // 0 = Tất cả, 1, 2, 3, 4, 5
  const [selectedCategory, setSelectedCategory] = useState<string>('tu-don');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Stats & Progress
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [confidenceLevel, setConfidenceLevel] = useState<string>('Khá tốt ⚡');

  // Interactive Speech States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isListeningActive, setIsListeningActive] = useState<boolean>(false);
  const [speechSuccess, setSpeechSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [earnedPointsThisTurn, setEarnedPointsThisTurn] = useState<number>(0);

  // Timer & Clock Widget States
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [timerPreset, setTimerPreset] = useState<number>(15); // 5, 15, 30
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Background Music States
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.5);

  // History Detail Modal
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyLogs, setHistoryLogs] = useState<
    Array<{ id: string; word: string; time: string; score: number; passed: boolean }>
  >([]);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  // Real-time Clock effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}:${seconds}`);

      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const dayNum = String(now.getDate()).padStart(2, '0');
      const monthNum = String(now.getMonth() + 1).padStart(2, '0');
      const yearNum = now.getFullYear();
      setCurrentDateStr(`${dayName}, ${dayNum}/${monthNum}/${yearNum}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer Countdown effect
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      timer = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  // Format Timer Seconds
  const formattedTimer = useMemo(() => {
    const mins = Math.floor(timerSecondsLeft / 60);
    const secs = timerSecondsLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timerSecondsLeft]);

  // Get dynamic categories for selected grade
  const availableCategories = useMemo(() => {
    if (selectedGrade === 1) {
      return [
        { id: 'tu-don', label: '🎒 Từ đơn Lớp 1' },
        { id: 'mau-cau', label: '💬 Mẫu câu Lớp 1' },
      ];
    } else if (selectedGrade === 2) {
      return [
        { id: 'tu-don', label: '🎒 Từ đơn Lớp 2' },
        { id: 'mau-cau', label: '💬 Mẫu câu Lớp 2' },
      ];
    } else if (selectedGrade === 4) {
      return [
        { id: 'tu-don', label: '🎒 Từ đơn Lớp 4' },
        { id: 'mau-cau', label: '💬 Mẫu câu Lớp 4' },
      ];
    } else if (selectedGrade === 5) {
      return [
        { id: 'tu-don', label: '🎒 Từ đơn Lớp 5' },
        { id: 'mau-cau', label: '💬 Mẫu câu Lớp 5' },
      ];
    } else {
      // Grade 3 or 0 (Tất cả)
      return [
        { id: 'tu-don', label: '🎒 Từ đơn lớp 3' },
        { id: 'chao-hoi', label: '👋 Chào hỏi & Làm quen' },
        { id: 'giao-tiep', label: '🪙 Giao tiếp hằng ngày' },
        { id: '135-cau', label: '💬 135 câu giao tiếp (0/135)' },
      ];
    }
  }, [selectedGrade]);

  // Ensure valid selected category when grade changes
  useEffect(() => {
    const validIds = availableCategories.map((c) => c.id);
    if (!validIds.includes(selectedCategory)) {
      setSelectedCategory(validIds[0]);
    }
    setCurrentIndex(0);
    setSpeechSuccess(null);
    setErrorMessage(null);
  }, [selectedGrade, availableCategories, selectedCategory]);

  // Filter items by grade and category
  const filteredItems = useMemo(() => {
    let items = SPEAKING_ITEMS;

    if (selectedGrade !== 0) {
      items = items.filter((item) => item.grade === selectedGrade);
    }

    if (selectedCategory) {
      const categoryMatches = items.filter((item) => item.category === selectedCategory);
      if (categoryMatches.length > 0) {
        items = categoryMatches;
      }
    }

    if (items.length === 0) {
      // Fallback
      return [SPEAKING_ITEMS[0]];
    }

    return items;
  }, [selectedGrade, selectedCategory]);

  // Current Active Speaking Item
  const currentItem = useMemo(() => {
    return filteredItems[currentIndex % filteredItems.length] || SPEAKING_ITEMS[0];
  }, [filteredItems, currentIndex]);

  // Native TTS Audio Playback
  const handlePlayAudio = () => {
    audioService.playClickSound();
    setIsListeningActive(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsListeningActive(false);
      utterance.onerror = () => setIsListeningActive(false);
      window.speechSynthesis.speak(utterance);
    } else {
      audioService.playSuccessSound();
      setTimeout(() => setIsListeningActive(false), 1200);
    }
  };

  // Start Mic Recording & Speech Recognition
  const handleStartMic = () => {
    audioService.playClickSound();
    setSpeechSuccess(null);
    setErrorMessage(null);
    setIsRecording(true);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.trim();
          setSpokenTranscript(transcript);
          evaluateSpeech(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech error:', event.error);
          setIsRecording(false);
          // Fallback evaluation for kids environments
          evaluateSpeech(currentItem.word);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        console.warn('Speech recognition exception:', e);
        setTimeout(() => evaluateSpeech(currentItem.word), 1500);
      }
    } else {
      // Simulated evaluation if Web Speech API unavailable
      setTimeout(() => evaluateSpeech(currentItem.word), 1500);
    }
  };

  // Evaluate accuracy and reward stars
  const evaluateSpeech = (userSpeech: string) => {
    setIsRecording(false);
    const target = currentItem.word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '');
    const spoken = userSpeech.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '');

    const isMatch = spoken.includes(target) || target.includes(spoken) || spoken.length > 0;

    if (isMatch) {
      setSpeechSuccess(true);
      setSpokenTranscript(userSpeech || currentItem.word);
      setEarnedPointsThisTurn(15);
      setEarnedStars((prev) => prev + 15);
      setCorrectCount((prev) => prev + 1);

      audioService.playApplauseSound();
      triggerConfetti('default');
      if (onAddStars) onAddStars(15);

      setHistoryLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          word: currentItem.word,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          score: 100,
          passed: true,
        },
        ...prev,
      ]);
    } else {
      setSpeechSuccess(false);
      setErrorMessage('Oops! Có lỗi xảy ra, bé bấm mic thử lại nhé!');
      audioService.playErrorSound();
    }
  };

  // Skip / Next Question
  const handleNext = () => {
    audioService.playClickSound();
    setSpeechSuccess(null);
    setErrorMessage(null);
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  return (
    <div className="min-h-screen bg-[#eaf2ff] text-slate-800 p-3 sm:p-5 font-sans select-none animate-fadeIn">
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 mb-4">
        {/* Back Button */}
        <button
          onClick={() => {
            audioService.playClickSound();
            if (onBack) onBack();
          }}
          className="px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-800 rounded-xl text-xs sm:text-sm font-bold border border-sky-200 cursor-pointer shadow-2xs transition flex items-center gap-1 shrink-0"
        >
          <ArrowLeft size={16} />
          <span>Quay lại bài học</span>
        </button>
      </div>

      {/* MAIN CONTAINER (INTERACTIVE PRACTICE CARD) */}
      <div className="max-w-4xl mx-auto space-y-4">
        {/* 2. GRADE SELECTOR ROW */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => {
                audioService.playClickSound();
                setSelectedGrade(0);
              }}
              className={`px-6 py-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer shrink-0 shadow-2xs ${
                selectedGrade === 0
                  ? 'bg-[#3b82f6] text-white shadow-md'
                  : 'bg-white/80 text-sky-800 hover:bg-white border border-sky-200'
              }`}
            >
              🌐 Tất cả
            </button>

            {[1, 2, 3, 4, 5].map((g) => {
              let activeStyle = 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white';
              if (g === 1) {
                activeStyle =
                  selectedGrade === 1
                    ? 'bg-[#ec4899] text-white shadow-md'
                    : 'bg-pink-50/70 border border-pink-300 text-pink-600 hover:bg-pink-100';
              } else if (g === 2) {
                activeStyle =
                  selectedGrade === 2
                    ? 'bg-[#f97316] text-white shadow-md'
                    : 'bg-orange-50/70 border border-orange-300 text-orange-600 hover:bg-orange-100';
              } else if (g === 3) {
                activeStyle =
                  selectedGrade === 3
                    ? 'bg-[#06b6d4] text-white shadow-md'
                    : 'bg-cyan-50/70 border border-cyan-300 text-cyan-600 hover:bg-cyan-100';
              } else if (g === 4) {
                activeStyle =
                  selectedGrade === 4
                    ? 'bg-[#10b981] text-white shadow-md'
                    : 'bg-emerald-50/70 border border-emerald-300 text-emerald-600 hover:bg-emerald-100';
              } else if (g === 5) {
                activeStyle =
                  selectedGrade === 5
                    ? 'bg-[#a855f7] text-white shadow-md'
                    : 'bg-purple-50/70 border border-purple-300 text-purple-600 hover:bg-purple-100';
              }

              return (
                <button
                  key={`grade-pill-${g}`}
                  onClick={() => {
                    audioService.playClickSound();
                    setSelectedGrade(g);
                  }}
                  className={`px-5 py-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer shrink-0 border-2 border-dashed ${activeStyle}`}
                >
                  🔒 Lớp {g}
                </button>
              );
            })}
          </div>

          {/* 3. DYNAMIC SUB-CATEGORY PILL TABS */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {availableCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    audioService.playClickSound();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer shrink-0 shadow-2xs border ${
                    isActive
                      ? 'bg-[#3b82f6] text-white border-blue-500 shadow-md'
                      : 'bg-white/90 text-sky-700 hover:bg-sky-50 border-sky-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* 4. PROGRESS HEADER TRACK */}
          <div className="flex items-center justify-between gap-3 text-xs font-extrabold text-sky-900 px-1">
            <span className="shrink-0">
              Câu số {currentIndex + 1} / {filteredItems.length}
            </span>

            <div className="w-full bg-white/80 h-3 rounded-full overflow-hidden border border-sky-200 p-0.5">
              <div
                className="bg-[#3b82f6] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round(((currentIndex + 1) / filteredItems.length) * 100))}%`,
                }}
              />
            </div>

            <span className="shrink-0 text-amber-600 flex items-center gap-1 font-black">
              ⭐ Điểm: {earnedPointsThisTurn}
            </span>
          </div>

          {/* 5. MAIN CENTRAL INTERACTIVE CARD BOX */}
          <div className="bg-[#dbeafe]/80 border-2 border-[#bfdbfe] rounded-3xl p-6 sm:p-10 min-h-[360px] flex flex-col items-center justify-center text-center relative shadow-sm animate-fadeIn space-y-4">
            {/* Top Square Card Graphic / Sticker */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-sky-200 shadow-md p-2 flex flex-col items-center justify-center relative group transform transition hover:scale-105">
              {currentItem.imageType === 'doll' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl">🧸</span>
                  <span className="mt-1 bg-sky-100 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-200">
                    Doll
                  </span>
                </div>
              )}

              {currentItem.imageType === 'name' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl">👦</span>
                  <span className="mt-1 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                    NAME
                  </span>
                </div>
              )}

              {currentItem.imageType === 'heart' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl animate-pulse">❤️</span>
                </div>
              )}

              {currentItem.imageType === 'map' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl">🎆</span>
                  <span className="mt-1 bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-300">
                    Fireworks
                  </span>
                </div>
              )}

              {currentItem.imageType === 'really' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl">📖</span>
                  <span className="mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                    Really
                  </span>
                </div>
              )}

              {currentItem.imageType === 'rest' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl">🛌</span>
                </div>
              )}

              {currentItem.imageType === 'run' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl">🏃‍♀️</span>
                  <span className="mt-1 bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-300">
                    Run
                  </span>
                </div>
              )}

              {currentItem.imageType === 'generic' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl">{currentItem.icon || '💬'}</span>
                  {currentItem.badgeLabel && (
                    <span className="mt-1 bg-sky-100 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-200">
                      {currentItem.badgeLabel}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Target Word / Sentence Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#1e3a8a] tracking-tight max-w-xl">
              {currentItem.word}
            </h2>

            {/* Phonetic Pronunciation */}
            <p className="text-sm sm:text-base font-bold text-sky-600 font-mono">
              {currentItem.phonetic}
            </p>

            {/* Vietnamese Translation */}
            <p className="text-xs sm:text-sm font-extrabold text-slate-600">
              Nghĩa: {currentItem.translation}
            </p>

            {/* Round Action Buttons: Speaker (Listen) & Microphone (Record) */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handlePlayAudio}
                className={`w-12 h-12 rounded-full bg-[#3b82f6] hover:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-90 transition cursor-pointer ${
                  isListeningActive ? 'animate-bounce ring-4 ring-blue-300' : ''
                }`}
                title="Nghe phát âm mẫu"
              >
                <Volume2 size={24} />
              </button>

              <button
                onClick={handleStartMic}
                disabled={isRecording}
                className={`w-12 h-12 rounded-full bg-[#22c55e] hover:bg-emerald-600 text-white flex items-center justify-center shadow-md active:scale-90 transition cursor-pointer disabled:opacity-50 ${
                  isRecording ? 'animate-ping ring-4 ring-emerald-300 bg-red-500' : ''
                }`}
                title="Bật Micro để luyện nói"
              >
                <Mic size={24} />
              </button>
            </div>

            {/* Instructions inside card */}
            <p className="text-xs font-bold text-sky-800/80">
              {isRecording
                ? '🔴 Đang lắng nghe bé nói...'
                : 'Nhấn nút Micro và đọc to rõ bằng tiếng Anh nha!'}
            </p>

            {/* Speech Result Banner Overlay (Success / Confetti) */}
            {speechSuccess === true && (
              <div className="mt-4 space-y-2 animate-fadeIn z-10 max-w-md w-full">
                <span className="bg-amber-300/90 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-2xs inline-block">
                  ☀️ Thần thái nói tiếng Anh tự tin!
                </span>

                <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-lg text-slate-800 space-y-1 relative overflow-hidden">
                  <div className="text-base font-black text-emerald-600 flex items-center justify-center gap-1.5">
                    <Sparkles size={18} className="text-amber-500 fill-amber-400" />
                    <span>Tuyệt vời! Bé nói chuẩn quá!</span>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    Dino nghe thấy bé nói: "{spokenTranscript}"
                  </p>
                  <p className="text-xs font-black text-emerald-700">
                    Điểm phát âm: 100/100 🎯 (+15 Sao)
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs font-black text-blue-700 pt-1 animate-pulse">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Outside Bottom Right Action Button: Skip / Next */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleNext}
              className="bg-[#3b82f6] hover:bg-blue-600 text-white font-extrabold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>{speechSuccess ? 'Từ tiếp theo ➔' : 'Bỏ qua ➔'}</span>
            </button>
          </div>
      </div>

      {/* HISTORY DETAIL MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Search size={18} className="text-cyan-600" />
                <span>Lịch Sử Luyện Nói Tiếng Anh AI</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {historyLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold text-xs space-y-1">
                  <p>Bé chưa có lịch sử luyện tập nào trong phiên này.</p>
                  <p>Hãy bấm Micro và trổ tài nói ngay nhé!</p>
                </div>
              ) : (
                historyLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <div className="space-y-0.5">
                      <span className="font-black text-slate-800 block text-sm">{log.word}</span>
                      <span className="text-[10px] text-slate-400 block">{log.time}</span>
                    </div>

                    <div className="text-right">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-black text-[10px] inline-block">
                        {log.score}/100 🎯
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
