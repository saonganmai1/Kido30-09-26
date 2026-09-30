import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { VocabItem } from '../types';
import { audioService } from '../utils/audio';

// Grade Vocab Lists Data
import { grade1VocabList } from '../data/grade1VocabData';
import { grade2VocabList } from '../data/grade2VocabData';
import { grade3VocabList } from '../data/grade3VocabData';
import { grade4VocabList } from '../data/grade4VocabData';
import { grade5VocabList } from '../data/grade5VocabData';

/**
 * Custom Hook: Manages sub-tab synchronization for SkillPracticeView
 */
export function useSkillPracticeSubTab(initialSubTab: string = 'vocab') {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const switchSubTab = useCallback((subTab: string) => {
    audioService.playClickSound();
    setActiveSubTab(subTab);
  }, []);

  return {
    activeSubTab,
    setActiveSubTab,
    switchSubTab,
  };
}

/**
 * Custom Hook: Scoped Vocabulary Data Fetching and Grade Filtering
 */
export function useVocabPracticeData(selectedGrade: number, activeSubTab: string) {
  const isVocabTab = activeSubTab === 'vocab' || activeSubTab === 'flashcards';

  const gradeCounts = useMemo(() => {
    if (!isVocabTab) {
      return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
    return {
      0: grade1VocabList.length + grade2VocabList.length + grade3VocabList.length + grade4VocabList.length + grade5VocabList.length,
      1: grade1VocabList.length,
      2: grade2VocabList.length,
      3: grade3VocabList.length,
      4: grade4VocabList.length,
      5: grade5VocabList.length,
    };
  }, [isVocabTab]);

  const activeGradeVocabList = useMemo(() => {
    if (!isVocabTab) return [];

    switch (selectedGrade) {
      case 2:
        return grade2VocabList;
      case 3:
        return grade3VocabList;
      case 4:
        return grade4VocabList;
      case 5:
        return grade5VocabList;
      case 0:
        return [...grade1VocabList, ...grade2VocabList, ...grade3VocabList, ...grade4VocabList, ...grade5VocabList];
      case 1:
      default:
        return grade1VocabList;
    }
  }, [selectedGrade, isVocabTab]);

  return {
    gradeCounts,
    activeGradeVocabList,
  };
}

/**
 * Custom Hook: Dictation (Nghe & Viết lại) State Scoped to Active SubTab
 */
export function useDictationPracticeState(activeSubTab: string, activeGradeVocabList: any[]) {
  const isDictationActive = activeSubTab === 'dictation' || activeSubTab === 'listening';

  const [dictationCategory, setDictationCategory] = useState<'words' | 'sentences'>('words');
  const [dictationIdx, setDictationIdx] = useState(0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationShowHint, setDictationShowHint] = useState(false);
  const [dictationShowAnswer, setDictationShowAnswer] = useState(false);
  const [dictationResult, setDictationResult] = useState<{
    submitted: boolean;
    accuracy: number;
    isExact: boolean;
    feedback: string;
  } | null>(null);

  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Reset state when leaving dictation/listening tab to prevent state bleeding
  useEffect(() => {
    if (!isDictationActive) {
      setDictationInput('');
      setDictationResult(null);
      setDictationShowHint(false);
      setDictationShowAnswer(false);
      setIsListeningMic(false);
      setMicError(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    }
  }, [isDictationActive]);

  const dictationSentences = useMemo(() => [
    { id: 's1', text: 'Hello, how are you today?', phonetic: '/həˈloʊ haʊ ɑːr juː təˈdeɪ/', meaningVi: 'Xin chào, hôm nay bạn thế nào?', icon: '👋' },
    { id: 's2', text: 'My name is Kido the dinosaur.', phonetic: '/maɪ neɪm ɪz kido ðə ˈdaɪnəsɔːr/', meaningVi: 'Tên tớ là chú khủng long Kido.', icon: '🐊' },
    { id: 's3', text: 'I love learning English every day.', phonetic: '/aɪ lʌv ˈlɜːrnɪŋ ˈɪŋɡlɪʃ ˈevri deɪ/', meaningVi: 'Tớ thích học tiếng Anh mỗi ngày.', icon: '📚' },
    { id: 's4', text: 'This is my happy family.', phonetic: '/ðɪs ɪz maɪ ˈhæpi ˈfæməli/', meaningVi: 'Đây là gia đình hạnh phúc của tớ.', icon: '🏡' },
    { id: 's5', text: 'We play games and win golden stars.', phonetic: '/wiː pleɪ ɡeɪmz ænd wɪn ˈɡoʊldən stɑːrz/', meaningVi: 'Chúng tớ chơi trò chơi và giành sao vàng.', icon: '⭐' },
    { id: 's6', text: 'Good morning my teacher and friends.', phonetic: '/ɡʊd ˈmɔːrnɪŋ maɪ ˈtiːtʃər ænd frendz/', meaningVi: 'Chào buổi sáng cô giáo và các bạn.', icon: '🏫' },
  ], []);

  const currentDictationTarget = useMemo(() => {
    if (dictationCategory === 'words') {
      const list = activeGradeVocabList;
      if (!list || list.length === 0) return { text: 'school', phonetic: '/skuːl/', meaningVi: 'Trường học', icon: '🏫' };
      const item = list[dictationIdx % list.length];
      return {
        text: item.word,
        phonetic: item.phonetic,
        meaningVi: item.meaningVi,
        icon: (item as any).icon || '📝',
      };
    } else {
      const item = dictationSentences[dictationIdx % dictationSentences.length];
      return {
        text: item.text,
        phonetic: item.phonetic,
        meaningVi: item.meaningVi,
        icon: item.icon,
      };
    }
  }, [dictationCategory, activeGradeVocabList, dictationIdx, dictationSentences]);

  return {
    dictationCategory,
    setDictationCategory,
    dictationIdx,
    setDictationIdx,
    dictationInput,
    setDictationInput,
    dictationShowHint,
    setDictationShowHint,
    dictationShowAnswer,
    setDictationShowAnswer,
    dictationResult,
    setDictationResult,
    isListeningMic,
    setIsListeningMic,
    micError,
    setMicError,
    recognitionRef,
    dictationSentences,
    currentDictationTarget,
  };
}
