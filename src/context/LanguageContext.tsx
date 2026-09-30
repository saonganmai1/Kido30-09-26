import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (vi: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'vi',
  setLang: () => {},
  toggleLang: () => {},
  t: (vi: string) => vi,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('KIDO_APP_LANG') || localStorage.getItem('DINO_APP_LANG');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch (e) {
      console.warn('Language state read error', e);
    }
    return 'vi';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('KIDO_APP_LANG', newLang);
    } catch (e) {
      console.warn('Language state save error', e);
    }
  };

  const toggleLang = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  const t = (vi: string, en: string) => (lang === 'vi' ? vi : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
