import React, { useState, useMemo } from 'react';
import { 
  Video, 
  Search, 
  Grid, 
  List, 
  Plus, 
  Trash2, 
  Edit3, 
  Play, 
  ArrowLeft, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  Clock, 
  Award, 
  Flame, 
  LogOut, 
  Film,
  ExternalLink,
  Check,
  Trophy,
  Star,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio';

export interface ShadowingSentence {
  timestamp: string;
  seconds: number;
  englishText: string;
  keywords: string[];
  vietnameseText: string;
  vocabChips: { word: string; ipa: string }[];
}

export interface ShadowingVideoItem {
  id: string;
  title: string;
  levelBadge: string;
  topic: string;
  desc: string;
  sentenceCount: number;
  thumbnailUrl: string;
  youtubeVideoId: string;
  sentences: ShadowingSentence[];
}

interface VideoShadowingLibraryViewProps {
  onBack?: () => void;
  onAddStars?: (amount: number) => void;
  onLogout?: () => void;
  userStars?: number;
}

const DEFAULT_VIDEOS: ShadowingVideoItem[] = [
  {
    id: 'v1',
    title: "Bluey, I'm just going to go for a walk along",
    levelBadge: 'A1 (Tự chọn)',
    topic: 'Bluey',
    desc: 'Bài học Shadowing (21 câu phụ đề mốc thời gian chuẩn).',
    sentenceCount: 21,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    youtubeVideoId: '_3-M8I3gWQE',
    sentences: [
      {
        timestamp: '0:05',
        seconds: 5,
        englishText: "Bluey, I'm just going to go for a walk along the beach .",
        keywords: ['walk along', 'beach'],
        vietnameseText: 'Dịch: Bluey ơi, mẹ chỉ đi dạo một lát dọc bờ biển thôi nhé.',
        vocabChips: [
          { word: 'walk along', ipa: '/wɔːk əˈlɒŋ/' },
          { word: 'beach', ipa: '/biːtʃ/' }
        ]
      },
      {
        timestamp: '0:11',
        seconds: 11,
        englishText: 'Why do you like walking by yourself ?',
        keywords: ['walking', 'by yourself'],
        vietnameseText: 'Dịch: Sao mẹ lại thích đi bộ một mình thế ạ?',
        vocabChips: [
          { word: 'walking', ipa: "/'wɔ:kiŋ/" },
          { word: 'by yourself', ipa: "/baɪ jɔː'self/" }
        ]
      },
      {
        timestamp: '0:15',
        seconds: 15,
        englishText: 'Not sure, actually. I just do. See you soon , little mermaid .',
        keywords: ['See you soon', 'little mermaid'],
        vietnameseText: 'Dịch: Mẹ cũng không rõ nữa, tự nhiên thích thôi. Hẹn gặp lại con nhé, nàng tiên cá nhỏ!',
        vocabChips: [
          { word: 'See you soon', ipa: '/siː juː suːn/' },
          { word: 'little mermaid', ipa: "/'lɪtl 'mɜ:meɪd/" }
        ]
      }
    ]
  },
  {
    id: 'v2',
    title: 'Playing with Turtleboy! 🐢 💙 | Best Bluey Adventures Clip Compilation ⭐️ | 30 MINUTES | Bluey',
    levelBadge: 'A1 (Tự chọn)',
    topic: 'Bluey',
    desc: 'Bài học Shadowing (35 câu phụ đề mốc thời gian chuẩn).',
    sentenceCount: 35,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    youtubeVideoId: '_3-M8I3gWQE',
    sentences: [
      {
        timestamp: '0:02',
        seconds: 2,
        englishText: 'Look! It is Turtleboy in the playground .',
        keywords: ['Turtleboy', 'playground'],
        vietnameseText: 'Dịch: Nhìn kìa! Đó là Chú Rùa Con ở sân chơi.',
        vocabChips: [
          { word: 'Turtleboy', ipa: '/ˈtɜːrtlbɔɪ/' },
          { word: 'playground', ipa: '/ˈpleɪɡraʊnd/' }
        ]
      }
    ]
  },
  {
    id: 'v3',
    title: 'Blue. Everyone, the queen is coming in.',
    levelBadge: 'A1 (Tự chọn)',
    topic: 'Bluey',
    desc: 'Bài học Shadowing (14 câu phụ đề mốc thời gian chuẩn).',
    sentenceCount: 14,
    thumbnailUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
    youtubeVideoId: '_3-M8I3gWQE',
    sentences: [
      {
        timestamp: '0:03',
        seconds: 3,
        englishText: 'Everyone, the queen is coming in right now!',
        keywords: ['queen', 'coming in'],
        vietnameseText: 'Dịch: Mọi người ơi, Nữ hoàng đang đi vào đấy!',
        vocabChips: [
          { word: 'queen', ipa: '/kwiːn/' },
          { word: 'coming in', ipa: '/ˈkʌmɪŋ ɪn/' }
        ]
      }
    ]
  },
  {
    id: 'v4',
    title: '(bright music) - Super Simple.',
    levelBadge: 'A1 (Tự chọn)',
    topic: 'Early Learning',
    desc: 'Bài học Shadowing (20 câu phụ đề mốc thời gian chuẩn).',
    sentenceCount: 20,
    thumbnailUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop&q=80',
    youtubeVideoId: '_3-M8I3gWQE',
    sentences: [
      {
        timestamp: '0:04',
        seconds: 4,
        englishText: 'Let us sing a happy song together!',
        keywords: ['sing', 'happy song'],
        vietnameseText: 'Dịch: Chúng mình cùng hát một bài hát vui vẻ nhé!',
        vocabChips: [
          { word: 'happy song', ipa: '/ˈhæpi sɔːŋ/' },
          { word: 'sing', ipa: '/sɪŋ/' }
        ]
      }
    ]
  },
  {
    id: 'v5',
    title: "If You're Happy And You Know It | Kids Songs | Super Simple Songs 👏",
    levelBadge: 'A1 (Tự chọn)',
    topic: 'Early Learning',
    desc: 'Bài học Shadowing (9 câu phụ đề mốc thời gian chuẩn).',
    sentenceCount: 9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    youtubeVideoId: '_3-M8I3gWQE',
    sentences: [
      {
        timestamp: '0:05',
        seconds: 5,
        englishText: "If you're happy and you know it, clap your hands !",
        keywords: ['happy', 'clap your hands'],
        vietnameseText: 'Dịch: Nếu bạn vui vẻ và nhận ra điều đó, hãy vỗ tay nhé!',
        vocabChips: [
          { word: 'happy', ipa: '/ˈhæpi/' },
          { word: 'clap hands', ipa: '/klæp hændz/' }
        ]
      }
    ]
  }
];

export const VideoShadowingLibraryView: React.FC<VideoShadowingLibraryViewProps> = ({
  onBack,
  onAddStars,
  onLogout,
  userStars = 313
}) => {
  // Video collection state
  const [videos, setVideos] = useState<ShadowingVideoItem[]>(DEFAULT_VIDEOS);

  // Topics
  const [topics, setTopics] = useState<string[]>([
    'Tất cả',
    'Bluey',
    'Little Fox',
    'The Fable Cottage',
    'Early Learning',
    'Vooks'
  ]);
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');

  // Search & View Mode
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active Video for Detail Shadowing Practice
  const [activeVideo, setActiveVideo] = useState<ShadowingVideoItem | null>(null);

  // Detail view controls
  const [videoSize, setVideoSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showBilingual, setShowBilingual] = useState<boolean>(true);
  const [autoMove, setAutoMove] = useState<boolean>(true);
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(true);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number>(0);

  // Modal: Add Topic
  const [showAddTopicModal, setShowAddTopicModal] = useState<boolean>(false);
  const [newTopicInput, setNewTopicInput] = useState<string>('');

  // Modal: Add Video / Edit Video
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] = useState<ShadowingVideoItem | null>(null);
  const [videoFormTitle, setVideoFormTitle] = useState<string>('');
  const [videoFormTopic, setVideoFormTopic] = useState<string>('Bluey');
  const [videoFormUrl, setVideoFormUrl] = useState<string>('');

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchTopic = selectedTopic === 'Tất cả' || v.topic === selectedTopic;
      const matchSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTopic && matchSearch;
    });
  }, [videos, selectedTopic, searchQuery]);

  // Handle Add Topic
  const handleConfirmAddTopic = () => {
    audioService.playClickSound();
    if (newTopicInput.trim()) {
      const trimmed = newTopicInput.trim();
      if (!topics.includes(trimmed)) {
        setTopics((prev) => [...prev, trimmed]);
      }
      setSelectedTopic(trimmed);
      setNewTopicInput('');
    }
    setShowAddTopicModal(false);
  };

  // Handle Delete Video
  const handleDeleteVideo = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioService.playClickSound();
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (activeVideo && activeVideo.id === id) {
      setActiveVideo(null);
    }
  };

  // Handle Select Video to Practice
  const handleStartPractice = (v: ShadowingVideoItem) => {
    audioService.playClickSound();
    setActiveVideo(v);
    setSelectedSentenceIndex(0);
    if (onAddStars) onAddStars(5);
  };

  // Speak sentence
  const handleSpeakSentence = (sentence: ShadowingSentence, index: number) => {
    setSelectedSentenceIndex(index);
    audioService.speakEnglish(sentence.englishText, 0.9);
  };

  // Render sentence with keywords as inline pills (Matching Image 2, 3, 4 100%)
  const renderSentenceWithKeywords = (
    text: string,
    keywords: string[],
    vocabChips?: { word: string; ipa: string }[]
  ) => {
    if (!highlightKeywords || !keywords || keywords.length === 0) {
      return <span>{text}</span>;
    }

    // Combine keywords and vocabChips words
    const allWords = Array.from(
      new Set([
        ...keywords,
        ...(vocabChips ? vocabChips.map((c) => c.word) : [])
      ])
    ).sort((a, b) => b.length - a.length);

    const escaped = allWords.map((k) => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(regex);

    const styles = [
      'bg-[#fef08a] border-[#fde047] text-[#854d0e]', // amber/yellow
      'bg-[#bbf7d0] border-[#86efac] text-[#166534]', // emerald/green
      'bg-[#bae6fd] border-[#7dd3fc] text-[#075985]', // sky/blue
      'bg-[#fed7aa] border-[#fdba74] text-[#9a3412]'  // orange
    ];

    return (
      <span className="leading-relaxed">
        {parts.map((part, i) => {
          const matchIdx = allWords.findIndex(
            (w) => w.toLowerCase() === part.toLowerCase()
          );

          if (matchIdx !== -1) {
            const style = styles[matchIdx % styles.length];
            return (
              <span
                key={`kw-${i}`}
                onClick={(e) => {
                  e.stopPropagation();
                  audioService.speakEnglish(part);
                }}
                className={`inline-block mx-0.5 px-2 py-0.5 rounded-lg border font-black cursor-pointer hover:scale-105 transition shadow-2xs ${style}`}
              >
                {part}
              </span>
            );
          }

          return <span key={`txt-${i}`}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#edf4ff] text-slate-800 font-sans p-3 sm:p-5 select-none space-y-4">
      {/* TOP HEADER BAR (Exact 100% to Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-sky-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="text-2xl sm:text-3xl shrink-0">
            🎬
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1e3a8a] tracking-tight uppercase flex items-center gap-2">
              <span>THƯ VIỆN VIDEO SHADOWING</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-bold">
              Chọn bài học bé muốn luyện nói nhại theo hoặc thêm video YouTube mới vào thư viện!
            </p>
          </div>
        </div>

        {/* STATS BADGES RIGHT */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Level Badge */}
          <div className="bg-sky-50/90 border border-dashed border-sky-300 rounded-2xl px-3 py-1.5 flex items-center gap-2 text-sky-800 font-extrabold text-xs shadow-2xs">
            <Trophy size={16} className="text-amber-500 shrink-0" />
            <div className="flex flex-col">
              <span>Cấp độ 7</span>
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
            <span>4 ngày</span>
          </div>

          {/* Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-xs flex items-center justify-center text-lg shrink-0">
            🐊
          </div>

          {/* Exit / Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="bg-[#ef4444] hover:bg-red-600 active:scale-95 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
            >
              <LogOut size={14} />
              <span>Thoát</span>
            </button>
          )}
        </div>
      </div>

      {/* DETAIL PRACTICE VIEW (WHEN ACTIVE VIDEO IS SELECTED - Image 2, 3, 4 100%) */}
      {activeVideo ? (
        <div className="space-y-4 animate-fadeIn">
          {/* HEADER BAR FOR DETAIL VIEW */}
          <div className="bg-white rounded-2xl border border-blue-100 p-2.5 sm:p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            {/* Quay Lại Button */}
            <button
              onClick={() => {
                audioService.playClickSound();
                setActiveVideo(null);
              }}
              className="bg-[#e0edff] hover:bg-blue-100 text-[#1d50b4] border border-[#a0c4ff] px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </button>

            {/* Video Title Center */}
            <h2 className="text-xs sm:text-sm font-black text-slate-800 truncate max-w-xs sm:max-w-md">
              {activeVideo.title}
            </h2>

            {/* Right Controls: Video Size Toggle & Delete Button */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-2xl text-[11px] font-extrabold">
                <span className="text-slate-500 px-1.5">Kích thước Video:</span>
                {(['small', 'medium', 'large'] as const).map((sz) => {
                  const label = sz === 'small' ? 'Nhỏ' : sz === 'medium' ? 'Vừa' : 'Lớn';
                  const isSelected = videoSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setVideoSize(sz)}
                      className={`px-3 py-1 rounded-xl transition cursor-pointer font-black ${
                        isSelected
                          ? 'bg-[#2563eb] text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Delete Video Button */}
              <button
                onClick={(e) => handleDeleteVideo(activeVideo.id, e)}
                className="bg-[#ffe5e5] hover:bg-red-100 text-[#ef4444] border border-[#fca5a5] font-black text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer shadow-2xs"
              >
                <Trash2 size={14} />
                <span>Xóa Video</span>
              </button>
            </div>
          </div>

          {/* MAIN PLAYER & TRANSCRIPT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT PLAYER COLUMN */}
            <div
              className={`${
                videoSize === 'small'
                  ? 'lg:col-span-5'
                  : videoSize === 'medium'
                  ? 'lg:col-span-7'
                  : 'lg:col-span-9'
              } space-y-3 transition-all duration-300`}
            >
              {/* VIDEO CONTAINER */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md relative aspect-video group">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeVideoId}?autoplay=0&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Bottom Left Link & Bottom Right YouTube Badge */}
                <div className="absolute bottom-3 left-3 z-10">
                  <button
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${activeVideo.youtubeVideoId}`, '_blank')}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center cursor-pointer transition shadow-lg"
                  >
                    <ExternalLink size={15} />
                  </button>
                </div>

                <div className="absolute bottom-3 right-3 z-10">
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black/70 hover:bg-black/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition"
                  >
                    <span>Xem trên</span>
                    <span className="text-red-500 font-black">YouTube ▶</span>
                  </a>
                </div>
              </div>

              {/* HINT BANNER BELOW VIDEO */}
              <div className="bg-[#e8f2ff] border border-[#b6d5ff] rounded-2xl p-3 text-xs font-bold text-[#1d50b4] flex items-center gap-2 shadow-2xs">
                <span>💡</span>
                <span>Nhấp vào câu thoại bất kỳ bên dưới để video tự động tua đúng vị trí nhé!</span>
              </div>
            </div>

            {/* RIGHT TRANSCRIPT COLUMN */}
            <div
              className={`${
                videoSize === 'small'
                  ? 'lg:col-span-7'
                  : videoSize === 'medium'
                  ? 'lg:col-span-5'
                  : 'lg:col-span-3'
              } bg-white rounded-3xl border border-[#cce0ff] p-4 shadow-2xs space-y-3.5 flex flex-col justify-between transition-all duration-300`}
            >
              {/* TRANSCRIPT HEADER & TOGGLES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-black text-xs text-[#1e3a8a] flex items-center gap-1.5 tracking-wide">
                    <span>💬</span>
                    <span>CÂU THOẠI ({activeVideo.sentences.length} câu)</span>
                  </h3>
                </div>

                {/* TOGGLES BAR (Exact pills matching screenshot) */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-black">
                  {/* Song Ngữ Toggle */}
                  <button
                    onClick={() => setShowBilingual(!showBilingual)}
                    className={`px-3 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1 shadow-2xs ${
                      showBilingual
                        ? 'bg-[#dcfce7] border-[#86efac] text-[#15803d]'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>🔤 Song ngữ:</span>
                    <span className="font-black">{showBilingual ? 'BẬT' : 'TẮT'}</span>
                  </button>

                  {/* Tự di chuyển Toggle */}
                  <button
                    onClick={() => setAutoMove(!autoMove)}
                    className={`px-3 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1 shadow-2xs ${
                      autoMove
                        ? 'bg-[#dbeafe] border-[#93c5fd] text-[#1e40af]'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>🔄 Tự di chuyển:</span>
                    <span className="font-black">{autoMove ? 'BẬT' : 'TẮT'}</span>
                  </button>

                  {/* Từ trọng tâm Toggle */}
                  <button
                    onClick={() => setHighlightKeywords(!highlightKeywords)}
                    className={`px-3 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1 shadow-2xs ${
                      highlightKeywords
                        ? 'bg-[#fef3c7] border-[#fde047] text-[#b45309]'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>✨ Từ trọng tâm:</span>
                    <span className="font-black">{highlightKeywords ? 'BẬT' : 'TẮT'}</span>
                  </button>
                </div>

                {/* SENTENCE CARDS LIST */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {activeVideo.sentences.map((st, idx) => {
                    const isSelected = selectedSentenceIndex === idx;

                    return (
                      <div
                        key={`st-${idx}`}
                        onClick={() => handleSpeakSentence(st, idx)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-[#f0fdf4] border-2 border-[#22c55e] shadow-2xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        {/* TIMESTAMP & SENTENCE NUMBER */}
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400">
                          <span className="bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                            ⏱️ {st.timestamp}
                          </span>
                          <span>Câu {idx + 1}</span>
                        </div>

                        {/* ENGLISH SENTENCE WITH INLINE KEYWORD PILLS */}
                        <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                          {renderSentenceWithKeywords(
                            st.englishText,
                            st.keywords,
                            st.vocabChips
                          )}
                        </p>

                        {/* VIETNAMESE TRANSLATION */}
                        {showBilingual && (
                          <p className="text-xs font-bold text-[#15803d] leading-snug">
                            {st.vietnameseText}
                          </p>
                        )}

                        {/* VOCABULARY AUDIO SOUND PILLS */}
                        {highlightKeywords && st.vocabChips && st.vocabChips.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {st.vocabChips.map((chip, cIdx) => {
                              const isYellow = cIdx % 2 === 0;
                              return (
                                <button
                                  key={`chip-${cIdx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    audioService.speakEnglish(chip.word);
                                  }}
                                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 border transition cursor-pointer shadow-2xs ${
                                    isYellow
                                      ? 'bg-[#fef9c3] hover:bg-[#fef08a] border-[#fef08a] text-[#854d0e]'
                                      : 'bg-[#dcfce7] hover:bg-[#bbf7d0] border-[#bbf7d0] text-[#166534]'
                                  }`}
                                >
                                  <Volume2 size={12} className="shrink-0" />
                                  <span>{chip.word}</span>
                                  <span className="opacity-80 text-[10px] font-normal">{chip.ipa}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN LIBRARY LIST / GRID VIEW (Exact 100% to Image 1) */
        <div className="space-y-4">
          {/* BANNER BLUE BOX */}
          <div className="bg-[#dbeafe]/80 border-2 border-[#93c5fd] rounded-3xl p-4 shadow-2xs space-y-1">
            <h2 className="text-sm font-black text-[#1e3a8a] flex items-center gap-2 tracking-wide">
              <span>🎬</span>
              <span>THƯ VIỆN VIDEO SHADOWING CỦA BÉ</span>
            </h2>
            <p className="text-xs text-[#1d4ed8] font-bold">
              Nhấp vào bất kỳ Thumbnail Video nào bên dưới để bắt đầu luyện phát âm nhại theo nhé! 🦖 ✨
            </p>
          </div>

          {/* SEARCH & VIEW MODE ROW */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm video theo tên, chủ đề..."
                className="w-full bg-white border border-slate-200 text-xs font-semibold py-2.5 pl-9 pr-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs"
              />
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setViewMode('grid');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-[#2563eb] text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Grid size={14} />
                <span>Grid View</span>
              </button>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  setViewMode('list');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-[#2563eb] text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <List size={14} />
                <span>Grid List</span>
              </button>
            </div>
          </div>

          {/* TOPIC FILTER PILLS BAR */}
          <div className="flex flex-wrap items-center gap-2.5">
            {topics.map((t) => {
              const isActive = selectedTopic === t;
              return (
                <button
                  key={`topic-${t}`}
                  onClick={() => {
                    audioService.playClickSound();
                    setSelectedTopic(t);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition cursor-pointer ${
                    isActive
                      ? 'bg-[#7eb110] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {t}
                </button>
              );
            })}

            {/* + THÊM CHỦ ĐỀ BUTTON */}
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowAddTopicModal(true);
              }}
              className="px-4 py-1.5 rounded-full text-xs font-black bg-white hover:bg-blue-50 text-[#2563eb] border-2 border-dashed border-[#60a5fa] transition cursor-pointer flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Thêm chủ đề</span>
            </button>
          </div>

          {/* VIDEO CARDS DISPLAY */}
          {filteredVideos.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-3 shadow-2xs">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl mx-auto flex items-center justify-center">
                <Film size={28} />
              </div>
              <h3 className="text-base font-black text-slate-800">Không tìm thấy video phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                Bé hoặc Ba Mẹ hãy thử tìm với từ khóa khác hoặc bấm "Thêm chủ đề" nhé!
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {filteredVideos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => handleStartPractice(v)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  {/* THUMBNAIL TOP */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* TOP-LEFT LEVEL BADGE */}
                    <span className="absolute top-2.5 left-2.5 bg-[#1d50b4] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                      {v.levelBadge}
                    </span>

                    {/* TOP-RIGHT EDIT & DELETE BUTTONS */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          audioService.playClickSound();
                          setEditingVideo(v);
                          setVideoFormTitle(v.title);
                          setVideoFormTopic(v.topic);
                          setVideoFormUrl(`https://www.youtube.com/watch?v=${v.youtubeVideoId}`);
                          setShowVideoModal(true);
                        }}
                        className="w-7 h-7 rounded-xl bg-white/90 hover:bg-white text-blue-600 flex items-center justify-center shadow-2xs transition cursor-pointer"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteVideo(v.id, e)}
                        className="w-7 h-7 rounded-xl bg-white/90 hover:bg-white text-rose-600 flex items-center justify-center shadow-2xs transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* CENTER PLAY BUTTON */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition">
                      <div className="w-11 h-11 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play size={20} className="fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* BODY INFORMATION */}
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug">
                          {v.title}
                        </h3>
                      </div>
                      <span className="inline-block bg-lime-100 text-lime-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-lime-200">
                        {v.topic}
                      </span>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {v.desc}
                      </p>
                    </div>

                    {/* FOOTER BAR */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-[#15803d] bg-[#dcfce7] border border-[#86efac] px-2.5 py-1 rounded-lg flex items-center gap-1">
                        💬 {v.sentenceCount} câu song ngữ
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartPractice(v);
                        }}
                        className="bg-[#2563eb] hover:bg-blue-700 text-white font-black text-xs px-4 py-1.5 rounded-2xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Play size={13} className="fill-white" />
                        <span>Luyện Ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-3">
              {filteredVideos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => handleStartPractice(v)}
                  className="bg-white rounded-3xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    {/* THUMBNAIL */}
                    <div className="relative w-32 h-20 sm:w-40 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                      <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 bg-[#1d50b4] text-white text-[9px] font-black px-2 py-0.2 rounded-full">
                        {v.levelBadge}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md">
                          <Play size={16} className="fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">
                          {v.title}
                        </h3>
                        <span className="bg-lime-100 text-lime-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-lime-200">
                          {v.topic}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{v.desc}</p>
                      <span className="inline-block text-[10px] font-extrabold text-[#15803d] bg-[#dcfce7] border border-[#86efac] px-2.5 py-0.5 rounded-md">
                        💬 {v.sentenceCount} câu song ngữ
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioService.playClickSound();
                        setEditingVideo(v);
                        setVideoFormTitle(v.title);
                        setVideoFormTopic(v.topic);
                        setVideoFormUrl(`https://www.youtube.com/watch?v=${v.youtubeVideoId}`);
                        setShowVideoModal(true);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-600 transition cursor-pointer"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={(e) => handleDeleteVideo(v.id, e)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartPractice(v);
                      }}
                      className="bg-[#2563eb] hover:bg-blue-700 text-white font-black text-xs px-4 py-2 rounded-2xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 ml-1"
                    >
                      <Play size={13} className="fill-white" />
                      <span>Luyện Ngay</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD TOPIC MODAL ("Dino hỏi bé") */}
      {showAddTopicModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-dashed border-blue-400 p-6 max-w-sm w-full space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto border border-sky-300">
              <Clock size={24} />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-800">Dino hỏi bé</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Nhập tên chủ đề/kênh video mới (Ví dụ: Peppa Pig):
              </p>
            </div>

            <input
              type="text"
              value={newTopicInput}
              onChange={(e) => setNewTopicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmAddTopic();
              }}
              placeholder="Peppa Pig"
              className="w-full border border-blue-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowAddTopicModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                onClick={handleConfirmAddTopic}
                className="flex-1 bg-[#16a34a] hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
              >
                <span>Đồng ý</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
