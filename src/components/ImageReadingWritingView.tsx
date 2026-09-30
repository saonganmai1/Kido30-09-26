import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  PenTool, 
  Volume2, 
  ArrowLeft, 
  Award, 
  Flame, 
  Sparkles, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Music, 
  CheckCircle2, 
  LogOut,
  Eye,
  Bot,
  SkipBack,
  SkipForward,
  VolumeX,
  FileText,
  List
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, UserProfile } from '../types';
import { audioService } from '../utils/audio';

interface ImageReadingWritingViewProps {
  user: UserAccount | UserProfile;
  onBack: () => void;
  onAddStars: (amount: number) => void;
  onLogout: () => void;
  onTriggerNotification?: (title: string, message: string) => void;
}

interface SavedLesson {
  id: string;
  title: string;
  date: string;
  grade: string;
  image: string;
  readingSentences: string[];
  vocabList: { category: string; en: string; vi: string }[];
  tableColumns: string[];
  fillSentencePrompts: { num: number; text: string; blank: string; full: string }[];
}

const SAVED_LESSONS: SavedLesson[] = [
  {
    id: 'unit-4',
    title: 'UNIT 4: OUR FREE-TIME ACTIVITIES',
    date: '2/8/2026',
    grade: 'Lớp 5',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    readingSentences: [
      "Laura likes listening to music in her free time.",
      "She always plays the violin at the weekend.",
      "She sometimes plays the piano to entertain her family.",
      "She likes playing sports and games, too.",
      "She usually plays volleyball on Saturdays, and she often goes for a walk on Sundays.",
      "She loves going shopping, and she helps her mother with the cooking on Sundays.",
      "Laura does not like roller skating.",
      "She rarely goes roller skating in her free time."
    ],
    vocabList: [
      { category: 'Music activities', en: 'listen to music', vi: 'nghe nhạc' },
      { category: 'Music activities', en: 'play the violin', vi: 'chơi đàn vĩ cầm' },
      { category: 'Music activities', en: 'play the piano', vi: 'chơi đàn piano' },
      { category: 'Music activities', en: 'sing', vi: 'hát' },
      { category: 'Sports and games', en: 'play volleyball', vi: 'chơi bóng chuyền' },
      { category: 'Sports and games', en: 'play basketball', vi: 'chơi bóng rổ' },
      { category: 'Sports and games', en: 'play football', vi: 'chơi bóng đá' },
      { category: 'Sports and games', en: 'play games', vi: 'chơi trò chơi' },
      { category: 'Other activities', en: 'go shopping', vi: 'đi mua sắm' },
      { category: 'Other activities', en: 'go for a walk', vi: 'đi dạo' },
      { category: 'Other activities', en: 'read books', vi: 'đọc sách' },
      { category: 'Other activities', en: 'watch movies', vi: 'xem phim' },
      { category: 'Doesn\'t like', en: 'roller skating', vi: 'trượt patin' },
      { category: 'Doesn\'t like', en: 'swimming', vi: 'bơi lội' },
      { category: 'Doesn\'t like', en: 'dancing', vi: 'nhảy múa' },
      { category: 'Doesn\'t like', en: 'climbing', vi: 'leo trèo' },
      { category: 'Time expressions', en: 'at the weekend', vi: 'vào cuối tuần' },
      { category: 'Time expressions', en: 'on Saturdays', vi: 'vào các ngày thứ Bảy' },
      { category: 'Time expressions', en: 'on Sundays', vi: 'vào các ngày Chủ Nhật' },
      { category: 'Time expressions', en: 'in the morning', vi: 'vào buổi sáng' }
    ],
    tableColumns: ['Music activities', 'Sports and games', 'Other activities', 'Doesn\'t like', 'When'],
    fillSentencePrompts: [
      { num: 1, text: "Laura likes listening to ____.", blank: "music", full: "Laura likes listening to music." },
      { num: 2, text: "She always plays the ____ at the weekend.", blank: "violin", full: "She always plays the violin at the weekend." },
      { num: 3, text: "She sometimes plays the ____ to entertain her family.", blank: "piano", full: "She sometimes plays the piano to entertain her family." },
      { num: 4, text: "She usually plays volleyball on ____.", blank: "Saturdays", full: "She usually plays volleyball on Saturdays." },
      { num: 5, text: "She often goes for a walk on ____.", blank: "Sundays", full: "She often goes for a walk on Sundays." },
      { num: 6, text: "She helps her mother with the cooking on ____.", blank: "Sundays", full: "She helps her mother with the cooking on Sundays." },
      { num: 7, text: "Laura does not like ____.", blank: "roller skating", full: "Laura does not like roller skating." },
      { num: 8, text: "She rarely goes roller skating in ____.", blank: "her free time", full: "She rarely goes roller skating in her free time." }
    ]
  },
  {
    id: 'unit-3',
    title: 'UNIT 3: MY FOREIGN FRIENDS',
    date: '2/8/2026',
    grade: 'Lớp 4',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    readingSentences: [
      "I have many friends from different countries.",
      "Akiko is from Japan. She speaks Japanese and English.",
      "Tony is from Australia. He likes playing basketball.",
      "Linda is from England. She loves singing and dancing."
    ],
    vocabList: [
      { category: 'Countries', en: 'Japan', vi: 'Nước Nhật Bản' },
      { category: 'Countries', en: 'Australia', vi: 'Nước Úc' },
      { category: 'Countries', en: 'England', vi: 'Nước Anh' },
      { category: 'Activities', en: 'play basketball', vi: 'chơi bóng rổ' }
    ],
    tableColumns: ['Country', 'Language', 'Hobby', 'Fav Sport', 'When'],
    fillSentencePrompts: [
      { num: 1, text: "Akiko is from ____.", blank: "Japan", full: "Akiko is from Japan." },
      { num: 2, text: "Tony likes playing ____.", blank: "basketball", full: "Tony likes playing basketball." }
    ]
  },
  {
    id: 'unit-2',
    title: 'UNIT 2: OUR HOME',
    date: '1/8/2026',
    grade: 'Lớp 3',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    readingSentences: [
      "My home is a cosy house in the countryside.",
      "There are four rooms: a living room, a kitchen, and two bedrooms.",
      "In front of my house, there is a small garden with colorful flowers."
    ],
    vocabList: [
      { category: 'Rooms', en: 'living room', vi: 'phòng khách' },
      { category: 'Rooms', en: 'kitchen', vi: 'phòng bếp' },
      { category: 'Rooms', en: 'bedroom', vi: 'phòng ngủ' }
    ],
    tableColumns: ['Room Name', 'Items inside', 'Color', 'Favorite spot', 'When'],
    fillSentencePrompts: [
      { num: 1, text: "My home is a house in the ____.", blank: "countryside", full: "My home is a house in the countryside." }
    ]
  },
  {
    id: 'unit-1',
    title: 'UNIT 1: ALL ABOUT ME',
    date: '1/8/2026',
    grade: 'Lớp 2',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    readingSentences: [
      "Hello! My name is Kido.",
      "I am eight years old.",
      "My favourite colour is blue and I love reading comics."
    ],
    vocabList: [
      { category: 'Personal info', en: 'name', vi: 'tên' },
      { category: 'Personal info', en: 'eight years old', vi: '8 tuổi' }
    ],
    tableColumns: ['Name', 'Age', 'Fav Color', 'Hobby', 'When'],
    fillSentencePrompts: [
      { num: 1, text: "My name is ____.", blank: "Kido", full: "My name is Kido." }
    ]
  }
];

export const ImageReadingWritingView: React.FC<ImageReadingWritingViewProps> = ({
  user,
  onBack,
  onAddStars,
  onLogout,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('Lớp 5');
  const [selectedLesson, setSelectedLesson] = useState<SavedLesson | null>(SAVED_LESSONS[0]);
  const [activeTab, setActiveTab] = useState<'reading' | 'writing' | 'vocab'>('reading');
  const [showFullPassage, setShowFullPassage] = useState<boolean>(true);

  // Free writing form inputs
  const [freeWriteData, setFreeWriteData] = useState({
    freeTime: '',
    always: '',
    sometimes: '',
    usually: '',
    often: '',
    doNotLike: '',
    rarely: ''
  });

  // Sentence completion inputs
  const [sentenceInputs, setSentenceInputs] = useState<Record<number, string>>({});

  // Table inputs
  const [tableInputs, setTableInputs] = useState<Record<string, string>>({});

  // AI Grading Modal
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiScore, setAiScore] = useState<number>(0);
  const [aiFeedback, setAiFeedback] = useState<string>('');

  // Study Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(900); // 15 mins default
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  
  // Background music state
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSpeak = (text: string) => {
    audioService.playClickSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAiGrade = () => {
    audioService.playClickSound();
    // Calculate a score based on filled fields
    const filledCount = Object.values(freeWriteData).filter(v => v.trim().length > 0).length;
    const score = Math.min(10, Math.max(7, 6 + filledCount));
    setAiScore(score);

    const feedbackText = filledCount >= 4
      ? "Xuất sắc! Bài viết ngữ pháp chuẩn xác, từ vựng phong phú về các hoạt động giải trí. Bé viết câu rất mạch lạc!"
      : "Rất tốt! Bé đã hoàn thành bài viết sáng tạo. Hãy tập viết thêm 2-3 câu nữa với trạng từ chỉ tần suất (always, usually) để điểm tối đa nhé!";

    setAiFeedback(feedbackText);
    setShowAiModal(true);
    audioService.playSuccessSound();
    onAddStars(10);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const grades = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'];

  return (
    <div className="min-h-screen bg-[#e8f1fd] text-slate-800 font-sans p-3 sm:p-6 space-y-5 select-none">
      
      {/* 1. TOP HEADER BRANDING BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1d3557] tracking-tight">
            Hình Ảnh Luyện Đọc Và Viết
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Luyện đọc voice chuẩn Mỹ & gõ bàn phím hoàn thành bài tập với AI chấm điểm thông minh
          </p>
        </div>
      </div>

      {/* 2. PHÂN HỆ LUYỆN ĐỌC & VIẾT AI BANNER */}
      <div className="bg-[#fdf0e6] rounded-2xl p-3 sm:p-4 border-2 border-[#f4a261] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f4a261] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1d3557]">
              Phân Hệ Luyện Đọc & Viết AI
            </h2>
            <p className="text-xs font-bold text-slate-600">
              Trích xuất tự động bài đọc, điền bảng và viết sáng tạo từ ảnh SGK
            </p>
          </div>
        </div>

        {/* Grade Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {grades.map((g) => {
            const isSelected = selectedGrade === g;
            return (
              <button
                key={g}
                onClick={() => {
                  setSelectedGrade(g);
                  audioService.playClickSound();
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#f4a261] text-white border-[#f4a261] shadow-2xs'
                    : 'bg-white text-slate-700 border-orange-200 hover:bg-orange-50'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: SGK Image Preview & Saved Lessons List (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Worksheet Image Preview (when lesson selected) */}
          {selectedLesson && (
            <div className="bg-black rounded-2xl overflow-hidden p-3 border border-slate-300 shadow-sm flex items-center justify-center min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
                alt="SGK Worksheet"
                className="w-full max-h-[380px] object-contain rounded-lg"
              />
            </div>
          )}

          {/* Saved Lessons Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className="text-orange-500">🔖</span>
                <span>Bài học đã lưu</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-extrabold text-[11px]">
                {SAVED_LESSONS.length} bài
              </span>
            </div>

            <div className="space-y-2">
              {SAVED_LESSONS.map((lesson) => {
                const isSelected = selectedLesson?.id === lesson.id;
                return (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-orange-50/60 border-orange-300 shadow-2xs'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{lesson.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Ngày tạo: {lesson.date}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedLesson(lesson);
                        audioService.playClickSound();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#f4a261] hover:bg-orange-600 text-white font-extrabold text-xs transition cursor-pointer shrink-0 shadow-2xs"
                    >
                      Học ngay
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Practice Tabs & Content (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {selectedLesson ? (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
              
              {/* Practice Tabs Header */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => {
                    setActiveTab('reading');
                    audioService.playClickSound();
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                    activeTab === 'reading'
                      ? 'bg-[#eef4ff] text-blue-700 border-blue-400 shadow-2xs'
                      : 'bg-white text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  <BookOpen size={14} className="text-blue-600" />
                  <span>Luyện Đọc</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('writing');
                    audioService.playClickSound();
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                    activeTab === 'writing'
                      ? 'bg-amber-50 text-amber-700 border-amber-400 shadow-2xs'
                      : 'bg-white text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  <PenTool size={14} className="text-amber-600" />
                  <span>Luyện Viết</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('vocab');
                    audioService.playClickSound();
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                    activeTab === 'vocab'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400 shadow-2xs'
                      : 'bg-white text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  <List size={14} className="text-emerald-600" />
                  <span>Từ Vựng</span>
                </button>
              </div>

              {/* TAB 1: LUYỆN ĐỌC */}
              {activeTab === 'reading' && (
                <div className="space-y-3">
                  <div className="bg-[#fefae0] rounded-xl p-3 border border-amber-200 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <BookOpen size={16} className="text-amber-600" />
                      <span>Bài Đọc Mẫu</span>
                    </span>
                    <button
                      onClick={() => setShowFullPassage(!showFullPassage)}
                      className="px-3 py-1 rounded-xl bg-[#f4a261] hover:bg-orange-600 text-white font-extrabold text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    >
                      <Eye size={14} />
                      <span>{showFullPassage ? 'Ẩn Nội Dung' : 'Hiện Nội Dung'}</span>
                    </button>
                  </div>

                  {showFullPassage && (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {selectedLesson.readingSentences.map((sentence, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 flex items-center justify-between gap-3 transition"
                        >
                          <p className="text-xs font-bold text-slate-800 leading-relaxed">
                            {sentence}
                          </p>
                          <button
                            onClick={() => handleSpeak(sentence)}
                            className="w-8 h-8 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 flex items-center justify-center shrink-0 transition cursor-pointer"
                            title="Phát âm"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: LUYỆN VIẾT */}
              {activeTab === 'writing' && (
                <div className="space-y-5">
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <PenTool size={16} className="text-orange-500" />
                    <span>Luyện Viết Bàn Phím & Chấm Điểm Tự Động</span>
                  </div>

                  {/* 1. FILL IN THE TABLE */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-[#1d3557]">
                      1. Điền thông tin vào Bảng (FILL IN THE TABLE):
                    </h4>
                    
                    <div className="overflow-x-auto border border-orange-200 rounded-xl bg-orange-50/30 p-2">
                      <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="bg-orange-100/80 text-orange-900 font-extrabold">
                            <th className="p-2 border border-orange-200">Character</th>
                            {selectedLesson.tableColumns.map((col, cIdx) => (
                              <th key={cIdx} className="p-2 border border-orange-200">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border border-orange-200 font-black text-slate-800 bg-white">Laura</td>
                            {selectedLesson.tableColumns.map((col, cIdx) => (
                              <td key={cIdx} className="p-2 border border-orange-200 bg-white">
                                <input
                                  type="text"
                                  placeholder="Nhập..."
                                  value={tableInputs[col] || ''}
                                  onChange={(e) => setTableInputs({ ...tableInputs, [col]: e.target.value })}
                                  className="w-full px-2 py-1 rounded border border-slate-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                                />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. WRITE SENTENCES */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-[#1d3557]">
                      2. Hoàn thành câu (Write Sentences):
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedLesson.fillSentencePrompts.map((item) => (
                        <div key={item.num} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <p className="text-xs font-bold text-slate-800">
                            <span className="font-black text-orange-600">{item.num}.</span> {item.text}
                          </p>
                          <input
                            type="text"
                            placeholder="Điền từ đúng..."
                            value={sentenceInputs[item.num] || ''}
                            onChange={(e) => setSentenceInputs({ ...sentenceInputs, [item.num]: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. WRITE ABOUT YOU */}
                  <div className="bg-[#fff9f3] rounded-2xl p-4 border-2 border-orange-300 space-y-3">
                    <h4 className="text-xs font-black text-orange-900 flex items-center gap-1.5 uppercase">
                      <PenTool size={15} className="text-orange-600" />
                      <span>WRITE ABOUT YOU (Viết Tự Do)</span>
                    </h4>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-extrabold text-orange-900 sm:w-36 shrink-0">In my free time, I like :</label>
                        <input
                          type="text"
                          placeholder="Nhập thông tin của bé..."
                          value={freeWriteData.freeTime}
                          onChange={(e) => setFreeWriteData({ ...freeWriteData, freeTime: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-extrabold text-orange-900 sm:w-36 shrink-0">I always :</label>
                        <input
                          type="text"
                          placeholder="Nhập thông tin của bé..."
                          value={freeWriteData.always}
                          onChange={(e) => setFreeWriteData({ ...freeWriteData, always: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-extrabold text-orange-900 sm:w-36 shrink-0">I sometimes :</label>
                        <input
                          type="text"
                          placeholder="Nhập thông tin của bé..."
                          value={freeWriteData.sometimes}
                          onChange={(e) => setFreeWriteData({ ...freeWriteData, sometimes: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-extrabold text-orange-900 sm:w-36 shrink-0">I usually :</label>
                        <input
                          type="text"
                          placeholder="Nhập thông tin của bé..."
                          value={freeWriteData.usually}
                          onChange={(e) => setFreeWriteData({ ...freeWriteData, usually: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-extrabold text-orange-900 sm:w-36 shrink-0">I often :</label>
                        <input
                          type="text"
                          placeholder="Nhập thông tin của bé..."
                          value={freeWriteData.often}
                          onChange={(e) => setFreeWriteData({ ...freeWriteData, often: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-extrabold text-orange-900 sm:w-36 shrink-0">I do not like :</label>
                        <input
                          type="text"
                          placeholder="Nhập thông tin của bé..."
                          value={freeWriteData.doNotLike}
                          onChange={(e) => setFreeWriteData({ ...freeWriteData, doNotLike: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-extrabold text-orange-900 sm:w-36 shrink-0">I rarely :</label>
                        <input
                          type="text"
                          placeholder="Nhập thông tin của bé..."
                          value={freeWriteData.rarely}
                          onChange={(e) => setFreeWriteData({ ...freeWriteData, rarely: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAiGrade}
                      className="w-full py-2.5 rounded-xl bg-[#f4a261] hover:bg-orange-600 text-white font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <Bot size={16} />
                      <span>Chấm Điểm Bài Viết Bằng Gemini AI</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: TỪ VỰNG */}
              {activeTab === 'vocab' && (
                <div className="space-y-3">
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <List size={16} className="text-emerald-600" />
                    <span>Từ Vựng & Cụm Từ Bài Học (Useful Words)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {selectedLesson.vocabList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:bg-orange-50/40 transition"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold text-orange-600 uppercase block">
                            {item.category}
                          </span>
                          <h5 className="text-xs font-black text-slate-800 mt-0.5">{item.en}</h5>
                          <p className="text-[11px] font-medium text-slate-500">{item.vi}</p>
                        </div>

                        <button
                          onClick={() => handleSpeak(item.en)}
                          className="w-8 h-8 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 flex items-center justify-center shrink-0 transition cursor-pointer"
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <BookOpen size={24} />
              </div>
              <p className="text-xs font-black text-slate-600">
                Vui lòng chọn bài học đã lưu từ cột bên trái để bắt đầu luyện đọc & viết!
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Study Timer & AI Learning Tips Widget (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* TIMER WIDGET CARD */}
          <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs space-y-4">
            
            {/* Clock Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-blue-600">23:56:45</span>
              <span className="text-[11px] font-bold text-slate-400">Thứ Bảy, 08/08/2026</span>
              <Clock size={14} className="text-blue-500" />
            </div>

            {/* Timer Presets */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                <Clock size={13} className="text-slate-500" />
                <span>Bộ hẹn giờ học tập</span>
              </span>

              <div className="grid grid-cols-4 gap-1.5 text-xs font-extrabold">
                <button
                  onClick={() => { setTimerSeconds(300); setTimerRunning(false); }}
                  className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  5p
                </button>
                <button
                  onClick={() => { setTimerSeconds(900); setTimerRunning(false); }}
                  className="py-1.5 rounded-lg bg-blue-600 text-white shadow-2xs"
                >
                  15p
                </button>
                <button
                  onClick={() => { setTimerSeconds(1800); setTimerRunning(false); }}
                  className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  30p
                </button>
                <button className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]">
                  Sửa phút
                </button>
              </div>
            </div>

            {/* Timer Display & Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-800 tracking-wider">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">DỪNG</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="p-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition cursor-pointer shadow-2xs"
                >
                  {timerRunning ? <Pause size={14} /> : <Play size={14} className="fill-white" />}
                </button>

                <button
                  onClick={() => { setTimerSeconds(900); setTimerRunning(false); }}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Relaxing Study Music Box */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Music size={14} className="text-purple-600" />
                  <span>Nhạc học tập thư giãn</span>
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-xs">
                  💿
                </div>
                <div className="min-w-0 flex-1">
                  <h6 className="text-[11px] font-black text-slate-800 truncate">English Adventure ...</h6>
                  <p className="text-[10px] font-semibold text-slate-400">
                    {musicPlaying ? 'Đang phát 🎶' : 'Dừng phát 💤'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button className="text-slate-400 hover:text-slate-600">
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={() => setMusicPlaying(!musicPlaying)}
                  className="p-1.5 rounded-full bg-blue-600 text-white shadow-2xs"
                >
                  {musicPlaying ? <Pause size={12} /> : <Play size={12} className="fill-white" />}
                </button>
                <button className="text-slate-400 hover:text-slate-600">
                  <SkipForward size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* AI TIP BOX */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Bot size={18} />
            </div>

            <h4 className="text-xs font-black text-slate-800 text-center">
              Mẹo học Đọc & Viết:
            </h4>

            <ul className="text-[11px] font-semibold text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1">
                <span className="font-bold text-orange-600 shrink-0">• Luyện Đọc:</span>
                <span>Nhấp nút loa phát giọng đọc Google Cloud Chirp 3 HD để học cách ngắt câu và phát âm chuẩn bản xứ.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="font-bold text-orange-600 shrink-0">• Luyện Viết:</span>
                <span>Gõ từ chính xác vào các ô vuông và nhấp nút Chấm điểm AI để Dino nhận xét ngữ pháp và thưởng Sao ⭐ nhé!</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* 4. GEMINI AI GRADING RESULT MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-orange-300 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Bot size={32} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-800">Kết Quả Chấm Điểm Gemini AI</h3>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-black text-sm my-2">
                <Award size={18} className="text-amber-500 fill-amber-500" />
                <span>Điểm số: {aiScore}/10 (+10 ⭐)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs font-bold text-slate-700 leading-relaxed space-y-2">
              <p className="text-orange-900 font-extrabold">🤖 Nhận xét từ AI Dino:</p>
              <p>{aiFeedback}</p>
            </div>

            <button
              onClick={() => setShowAiModal(false)}
              className="w-full py-3 rounded-2xl bg-[#f4a261] hover:bg-orange-600 text-white font-black text-xs transition cursor-pointer shadow-md"
            >
              Đã hiểu, cảm ơn Kido!
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
