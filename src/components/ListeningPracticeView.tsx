import React, { useState } from 'react';
import { Volume2, RotateCcw, ArrowLeft, LogOut, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, UserProfile } from '../types';
import { audioService } from '../utils/audio';
import {
  VocabQuizQuestion,
  SentenceArrangeQuestion,
  DialogueQuizQuestion,
  getVocabQuestions,
  getSentenceQuestions,
  getDialogueQuestions,
} from '../data/listeningData';

interface ListeningPracticeViewProps {
  user?: UserAccount | UserProfile;
  onBack: () => void;
  onAddStars: (amount: number) => void;
  onLogout?: () => void;
  setActiveTab?: (tab: any) => void;
}

export const ListeningPracticeView: React.FC<ListeningPracticeViewProps> = ({
  user,
  onBack,
  onAddStars,
  onLogout,
  setActiveTab,
}) => {
  // Navigation / Tabs
  const [selectedGrade, setSelectedGrade] = useState<number>(0); // 0: Tất cả, 1..5: Lớp 1..5
  const [subTab, setSubTab] = useState<'vocab-quiz' | 'sentence-arrange' | 'dialogue-quiz'>('vocab-quiz');

  // Modals
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showEmptyWarningModal, setShowEmptyWarningModal] = useState<boolean>(false);

  // Common Progress
  const [stars, setStars] = useState<number>(0);

  // Active question lists based on selectedGrade
  const activeVocabList = getVocabQuestions(selectedGrade);
  const activeSentenceList = getSentenceQuestions(selectedGrade);
  const activeDialogueList = getDialogueQuestions(selectedGrade);

  // --- Mode 1: Vocab Quiz State ---
  const [vocabIdx, setVocabIdx] = useState<number>(0);
  const [selectedVocabOpt, setSelectedVocabOpt] = useState<number | null>(null);
  const [vocabChecked, setVocabChecked] = useState<boolean>(false);

  // --- Mode 2: Sentence Arrange State ---
  const [sentenceIdx, setSentenceIdx] = useState<number>(0);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [unplacedPool, setUnplacedPool] = useState<string[]>(activeSentenceList[0]?.initialPool || []);
  const [sentenceChecked, setSentenceChecked] = useState<boolean>(false);
  const [isSentenceCorrect, setIsSentenceCorrect] = useState<boolean | null>(null);

  // --- Mode 3: Dialogue Quiz State ---
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);
  const [selectedDialogueOpt, setSelectedDialogueOpt] = useState<number | null>(null);
  const [dialogueChecked, setDialogueChecked] = useState<boolean>(false);
  const [isDialogueCorrect, setIsDialogueCorrect] = useState<boolean | null>(null);

  // Current Question Getters
  const currentVocabQ = activeVocabList[vocabIdx % activeVocabList.length];
  const currentSentenceQ = activeSentenceList[sentenceIdx % activeSentenceList.length];
  const currentDialogueQ = activeDialogueList[dialogueIdx % activeDialogueList.length];

  // Speak Handler
  const handleSpeakText = (text: string) => {
    audioService.speakEnglish(text);
  };

  // Grade Change Handler
  const handleGradeChange = (gradeId: number) => {
    audioService.playClickSound();
    setSelectedGrade(gradeId);
    setVocabIdx(0);
    setSelectedVocabOpt(null);
    setVocabChecked(false);

    setSentenceIdx(0);
    setPlacedWords([]);
    const targetSentences = getSentenceQuestions(gradeId);
    setUnplacedPool(targetSentences[0]?.initialPool || []);
    setSentenceChecked(false);
    setIsSentenceCorrect(null);

    setDialogueIdx(0);
    setSelectedDialogueOpt(null);
    setDialogueChecked(false);
    setIsDialogueCorrect(null);
  };

  // Switch Sub-Tab Handler
  const handleSubTabChange = (tab: 'vocab-quiz' | 'sentence-arrange' | 'dialogue-quiz') => {
    audioService.playClickSound();
    setSubTab(tab);
    setShowHintModal(false);
    setShowEmptyWarningModal(false);
  };

  // --- Mode 1 Handlers ---
  const handleSelectVocabOption = (optId: number) => {
    if (vocabChecked) return;
    audioService.playClickSound();
    setSelectedVocabOpt(optId);
    setVocabChecked(true);

    if (optId === currentVocabQ.correctOptionId) {
      audioService.playSuccessSound();
      setStars((prev) => prev + 5);
      onAddStars(5);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleNextVocab = () => {
    audioService.playClickSound();
    setSelectedVocabOpt(null);
    setVocabChecked(false);
    setVocabIdx((prev) => (prev + 1) % activeVocabList.length);
  };

  // --- Mode 2 Handlers ---
  const handleAddWordToSentence = (word: string, poolIdx: number) => {
    if (sentenceChecked) return;
    audioService.playClickSound();
    setPlacedWords((prev) => [...prev, word]);
    setUnplacedPool((prev) => prev.filter((_, idx) => idx !== poolIdx));
  };

  const handleRemoveWordFromSentence = (word: string, placedIdx: number) => {
    if (sentenceChecked) return;
    audioService.playClickSound();
    setPlacedWords((prev) => prev.filter((_, idx) => idx !== placedIdx));
    setUnplacedPool((prev) => [...prev, word]);
  };

  const handleResetSentence = () => {
    audioService.playClickSound();
    setPlacedWords([]);
    setUnplacedPool(currentSentenceQ.initialPool);
    setSentenceChecked(false);
    setIsSentenceCorrect(null);
  };

  const handleCheckSentence = () => {
    if (placedWords.length === 0) {
      // Show warning modal if no words are placed!
      audioService.playClickSound();
      setShowEmptyWarningModal(true);
      return;
    }

    audioService.playClickSound();
    const joinedUser = placedWords.join(' ');
    const isCorrect = joinedUser === currentSentenceQ.sentenceEn;
    setSentenceChecked(true);
    setIsSentenceCorrect(isCorrect);

    if (isCorrect) {
      audioService.playSuccessSound();
      setStars((prev) => prev + 10);
      onAddStars(10);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } else {
      audioService.playClickSound();
    }
  };

  const handleNextSentence = () => {
    audioService.playClickSound();
    const nextIdx = (sentenceIdx + 1) % activeSentenceList.length;
    setSentenceIdx(nextIdx);
    setPlacedWords([]);
    setUnplacedPool(activeSentenceList[nextIdx].initialPool);
    setSentenceChecked(false);
    setIsSentenceCorrect(null);
  };

  // --- Mode 3 Handlers ---
  const handleSelectDialogueOption = (optId: number) => {
    if (dialogueChecked) return;
    audioService.playClickSound();
    setSelectedDialogueOpt(optId);
    const isCorrect = optId === currentDialogueQ.correctOptionId;
    setDialogueChecked(true);
    setIsDialogueCorrect(isCorrect);

    if (isCorrect) {
      audioService.playSuccessSound();
      setStars((prev) => prev + 10);
      onAddStars(10);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } else {
      audioService.playClickSound();
    }
  };

  const handleNextDialogue = () => {
    audioService.playClickSound();
    const nextIdx = (dialogueIdx + 1) % activeDialogueList.length;
    setDialogueIdx(nextIdx);
    setSelectedDialogueOpt(null);
    setDialogueChecked(false);
    setIsDialogueCorrect(null);
  };

  return (
    <div className="w-full max-w-full space-y-4 font-sans select-none animate-fadeIn pb-12">
      {/* GRADE LEVEL SELECTOR BAR (Dashed Pills) & Back Button */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => {
            audioService.playClickSound();
            onBack();
          }}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black flex items-center gap-1 transition cursor-pointer border border-slate-200 shadow-2xs shrink-0"
        >
          <ArrowLeft size={14} />
          <span>Quay lại bài học</span>
        </button>

        {[
          { id: 0, label: '🌐 Tất cả', activeColor: 'bg-sky-500 text-white' },
          { id: 1, label: '📕 Lớp 1', borderColor: 'border-pink-300 text-pink-700 bg-pink-50/50' },
          { id: 2, label: '📙 Lớp 2', borderColor: 'border-amber-300 text-amber-700 bg-amber-50/50' },
          { id: 3, label: '📘 Lớp 3', borderColor: 'border-cyan-300 text-cyan-700 bg-cyan-50/50' },
          { id: 4, label: '📗 Lớp 4', borderColor: 'border-emerald-300 text-emerald-700 bg-emerald-50/50' },
          { id: 5, label: '📓 Lớp 5', borderColor: 'border-purple-300 text-purple-700 bg-purple-50/50' },
        ].map((grade) => (
          <button
            key={grade.id}
            onClick={() => handleGradeChange(grade.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition cursor-pointer border-2 border-dashed whitespace-nowrap shrink-0 ${
              selectedGrade === grade.id
                ? 'bg-sky-500 text-white border-sky-500 shadow-2xs'
                : `${grade.borderColor || 'border-slate-300 text-slate-700 bg-white'}`
            }`}
          >
            {grade.label}
          </button>
        ))}
      </div>

      {/* 3. MODE SWITCHER SUB-TABS */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => handleSubTabChange('vocab-quiz')}
          className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            subTab === 'vocab-quiz'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">A</span>
          <span>Trắc nghiệm Từ vựng</span>
        </button>

        <button
          onClick={() => handleSubTabChange('sentence-arrange')}
          className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
            subTab === 'sentence-arrange'
              ? 'bg-sky-500 text-white shadow-md border-sky-500'
              : 'bg-white hover:bg-sky-50 text-slate-700 border-slate-200'
          }`}
        >
          <span>🧩</span>
          <span>Ghép câu tiếng Anh</span>
        </button>

        <button
          onClick={() => handleSubTabChange('dialogue-quiz')}
          className={`px-4 py-2 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
            subTab === 'dialogue-quiz'
              ? 'bg-sky-500 text-white shadow-md border-sky-500'
              : 'bg-white hover:bg-sky-50 text-slate-700 border-slate-200'
          }`}
        >
          <span>💬</span>
          <span>Hội thoại của Kido</span>
        </button>
      </div>

      {/* 4. PROGRESS BAR */}
      <div className="flex items-center justify-between gap-3 bg-white px-4 py-2 rounded-2xl border border-sky-100 shadow-2xs text-xs font-black text-sky-700">
        <span>
          Câu {subTab === 'vocab-quiz' ? vocabIdx + 1 : subTab === 'sentence-arrange' ? sentenceIdx + 1 : dialogueIdx + 1} /{' '}
          {subTab === 'vocab-quiz' ? activeVocabList.length : subTab === 'sentence-arrange' ? activeSentenceList.length : activeDialogueList.length}
        </span>
        <div className="flex-1 max-w-md mx-3 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-300 rounded-full"
            style={{
              width: `${
                subTab === 'vocab-quiz'
                  ? ((vocabIdx + 1) / activeVocabList.length) * 100
                  : subTab === 'sentence-arrange'
                  ? ((sentenceIdx + 1) / activeSentenceList.length) * 100
                  : ((dialogueIdx + 1) / activeDialogueList.length) * 100
              }%`,
            }}
          />
        </div>
        <span className="text-amber-600">⭐ Sao: {stars}</span>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: TRẮC NGHIỆM TỪ VỰNG (Image 1 & 2)                                 */}
      {/* ========================================================================= */}
      {subTab === 'vocab-quiz' && (
        <div className="space-y-4">
          {/* Main Audio Box (Pink Gradient Background) */}
          <div className="bg-pink-100/80 border border-pink-200 rounded-3xl p-6 text-center space-y-3 shadow-xs">
            <button
              onClick={() => handleSpeakText(currentVocabQ.wordEn)}
              className="w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Volume2 size={30} />
            </button>
            <h3 className="text-base sm:text-lg font-black text-pink-900">
              Nghe xem Kido đọc từ gì nào!
            </h3>
            <p className="text-xs font-bold text-pink-600">
              (Bấm loa hồng để nghe lại nha bé)
            </p>
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowHintModal(true);
              }}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md transition cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>💡</span>
              <span>Gợi ý cho bé</span>
            </button>
          </div>

          {/* Option Cards Grid (4 options) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentVocabQ.options.map((opt) => {
              const isSelected = selectedVocabOpt === opt.id;
              const isCorrect = opt.id === currentVocabQ.correctOptionId;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectVocabOption(opt.id)}
                  className={`relative p-4 rounded-3xl border-2 transition cursor-pointer text-center space-y-2 bg-white hover:shadow-md ${
                    vocabChecked && isSelected
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-300'
                        : 'border-pink-500 bg-pink-50/80'
                      : 'border-slate-200 hover:border-sky-300'
                  }`}
                >
                  {/* Option Badge Number */}
                  <div className="absolute top-2.5 left-3 w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-black flex items-center justify-center">
                    {opt.id}
                  </div>

                  {/* Graphic or Emoji */}
                  <div className="h-20 flex items-center justify-center pt-2">
                    {opt.image ? (
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="h-full object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-4xl">{opt.emoji || '❓'}</span>
                    )}
                  </div>

                  {/* Vietnamese Label */}
                  <p className="text-xs font-black text-slate-800">{opt.label}</p>
                </div>
              );
            })}
          </div>

          {/* Next Button after answering */}
          {vocabChecked && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextVocab}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Tiếp tục</span>
                <span>➔</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: GHÉP CÂU TIẾNG ANH (Images 3, 4, 5, 6, 7)                         */}
      {/* ========================================================================= */}
      {subTab === 'sentence-arrange' && (
        <div className="space-y-4">
          {/* Audio Box (Light Blue Background) */}
          <div className="bg-sky-100/90 border border-sky-200 rounded-3xl p-6 text-center space-y-3 shadow-xs">
            <button
              onClick={() => handleSpeakText(currentSentenceQ.sentenceEn)}
              className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Volume2 size={30} />
            </button>
            <h3 className="text-base sm:text-lg font-black text-sky-900">
              Nghe đoạn âm thanh rồi xếp câu nhé!
            </h3>
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowHintModal(true);
              }}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md transition cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>💡</span>
              <span>Gợi ý cho bé</span>
            </button>
          </div>

          {/* Sentence Assembly Box (Dashed Blue Border Area) */}
          <div className="border-2 border-dashed border-sky-400 bg-white/80 rounded-2xl min-h-[90px] p-4 flex flex-wrap items-center justify-center gap-2.5 transition">
            {placedWords.length === 0 ? (
              <span className="text-xs font-bold text-slate-400 italic">
                Các từ bé ghép sẽ hiện ở đây...
              </span>
            ) : (
              placedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWordFromSentence(word, idx)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-extrabold shadow-2xs hover:bg-blue-700 flex items-center gap-1 transition cursor-pointer active:scale-95"
                >
                  <span>{word}</span>
                  <span className="text-[10px] opacity-70">×</span>
                </button>
              ))
            )}
          </div>

          {/* Unplaced Words Pool */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 py-2">
            {unplacedPool.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleAddWordToSentence(word, idx)}
                className="px-5 py-2.5 rounded-2xl bg-white border-2 border-blue-400 text-blue-800 text-xs font-black shadow-xs hover:bg-blue-50 transition cursor-pointer active:scale-95"
              >
                {word}
              </button>
            ))}
          </div>

          {/* RESULT STATE BANNERS (Image 6: Incorrect, Image 7: Correct) */}
          {sentenceChecked && isSentenceCorrect === false && (
            <div className="border-2 border-dashed border-pink-400 bg-pink-50/90 p-4 rounded-2xl text-left space-y-1 font-sans text-xs animate-fadeIn">
              <p className="font-black text-pink-700 text-sm flex items-center gap-1.5">
                <span>😳</span>
                <span>Bé ghép chưa chính xác rồi!</span>
              </p>
              <p className="font-bold text-slate-700">
                Câu bé đã ghép: &quot;{placedWords.join(' ')}&quot;.
              </p>
              <p className="font-bold text-slate-700">
                Câu mẫu chuẩn của Kido: &quot;{currentSentenceQ.sentenceEn}&quot;.
              </p>
              <p className="font-bold text-slate-600 italic">
                Nghĩa: &quot;{currentSentenceQ.sentenceVi}&quot;
              </p>
            </div>
          )}

          {sentenceChecked && isSentenceCorrect === true && (
            <div className="border-2 border-dashed border-emerald-500 bg-emerald-50/90 p-4 rounded-2xl text-left space-y-1 font-sans text-xs animate-fadeIn">
              <p className="font-black text-emerald-700 text-sm flex items-center gap-1.5">
                <span>🎉</span>
                <span>Bé xếp hoàn hảo 100%! Rất giỏi!</span>
              </p>
              <p className="font-bold text-slate-800">
                Câu đúng: &quot;{currentSentenceQ.sentenceEn}&quot;.
              </p>
              <p className="font-bold text-slate-600 italic">
                Nghĩa là: &quot;{currentSentenceQ.sentenceVi}&quot; (+10 Sao)
              </p>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handleResetSentence}
              className="px-4 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw size={14} />
              <span>Xóa làm lại</span>
            </button>

            {!sentenceChecked ? (
              <button
                onClick={handleCheckSentence}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span>✨</span>
                <span>Kiểm tra</span>
                <span>➔</span>
              </button>
            ) : (
              <button
                onClick={handleNextSentence}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Tiếp tục</span>
                <span>➔</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: HỘI THOẠI CỦA KIDO (Images 8, 9, 10, 11)                           */}
      {/* ========================================================================= */}
      {subTab === 'dialogue-quiz' && (
        <div className="space-y-4">
          {/* Main Audio Box (Purple Background) */}
          <div className="bg-purple-100/90 border border-purple-200 rounded-3xl p-6 text-center space-y-3 shadow-xs">
            <button
              onClick={() => handleSpeakText(currentDialogueQ.dialogueAudioText)}
              className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Volume2 size={30} />
            </button>
            <h3 className="text-base sm:text-lg font-black text-purple-900">
              Bấm loa nghe cuộc hội thoại nhỏ nhé!
            </h3>
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowHintModal(true);
              }}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md transition cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>💡</span>
              <span>Gợi ý cho bé</span>
            </button>
          </div>

          {/* Dialogue Text Transcript Box */}
          <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-purple-300 text-xs font-bold italic text-purple-900 shadow-2xs">
            💬 {currentDialogueQ.dialogueTranscript}
          </div>

          {/* Comprehension Question Box */}
          <div className="bg-pink-50/60 border border-pink-200 rounded-3xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-pink-900 flex items-center gap-1.5">
              <span>❓</span>
              <span>Câu hỏi nghe hiểu: {currentDialogueQ.questionEn}</span>
            </h4>

            {/* Options List */}
            <div className="space-y-2">
              {currentDialogueQ.options.map((opt) => {
                const isSelected = selectedDialogueOpt === opt.id;
                const isCorrect = opt.id === currentDialogueQ.correctOptionId;

                let cardStyle =
                  'bg-white hover:bg-purple-50 border-2 border-slate-200 hover:border-purple-300 text-slate-800';

                if (dialogueChecked) {
                  if (isSelected && !isCorrect) {
                    // Wrong selection -> Magenta Pink (Image 10)
                    cardStyle = 'bg-[#ec4899] text-white font-black border-2 border-[#db2777] shadow-md';
                  } else if (isCorrect) {
                    // Correct answer -> Emerald Green (Image 10 & 11)
                    cardStyle = 'bg-[#10b981] text-white font-black border-2 border-[#059669] shadow-md';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectDialogueOption(opt.id)}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs font-extrabold transition cursor-pointer shadow-2xs ${cardStyle}`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {/* FEEDBACK BANNERS (Image 10: Wrong, Image 11: Correct) */}
            {dialogueChecked && isDialogueCorrect === false && (
              <div className="bg-white/90 p-3.5 rounded-2xl border border-pink-200 text-left space-y-1 font-sans text-xs animate-fadeIn">
                <p className="font-black text-pink-700 flex items-center gap-1">
                  <span>😳</span>
                  <span>Bé chọn chưa đúng rồi!</span>
                </p>
                <p className="font-bold text-slate-600">
                  Lời khuyên Kido: {currentDialogueQ.explanation}
                </p>
              </div>
            )}

            {dialogueChecked && isDialogueCorrect === true && (
              <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-200 text-left space-y-1 font-sans text-xs animate-fadeIn">
                <p className="font-black text-emerald-700 flex items-center gap-1">
                  <span>🎉</span>
                  <span>Đúng rồi bé ơi! (+10 Sao)</span>
                </p>
                <p className="font-bold text-slate-600">
                  Lời khuyên Kido: {currentDialogueQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {dialogueChecked && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextDialogue}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Tiếp tục</span>
                <span>➔</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: KIDO GỢI Ý CHO BÉ (Images 2, 4, 9)                                */}
      {/* ========================================================================= */}
      {showHintModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-400 shadow-2xl text-center space-y-4">
            <div className="text-4xl animate-bounce">💡</div>
            <h3 className="text-xl font-black text-amber-900">Kido Gợi Ý Cho Bé</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 leading-relaxed">
              {subTab === 'vocab-quiz'
                ? currentVocabQ.hint
                : subTab === 'sentence-arrange'
                ? currentSentenceQ.hintVi
                : currentDialogueQ.hintText}
            </p>
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowHintModal(false);
              }}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm sm:text-base shadow-md transition cursor-pointer active:scale-98"
            >
              Đã hiểu rồi Kido ơi! 👍
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: KIDO NHẮN BÉ (Image 5: Empty warning modal for sentence arrange)  */}
      {/* ========================================================================= */}
      {showEmptyWarningModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border-4 border-dashed border-sky-400 shadow-2xl text-center space-y-4">
            {/* Kido mascot image/avatar in dashed ring */}
            <div className="w-16 h-16 rounded-full bg-sky-100 border-2 border-dashed border-sky-400 flex items-center justify-center mx-auto text-3xl">
              🦖
            </div>
            <h3 className="text-lg font-black text-slate-800">Kido nhắn bé</h3>
            <p className="text-xs font-bold text-slate-600">
              Bé ơi, hãy xếp các bong bóng từ thành câu trước nha!
            </p>
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowEmptyWarningModal(false);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs shadow-md transition cursor-pointer active:scale-98"
            >
              Đồng ý ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
