import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { StudentErrorBoundary } from './components/StudentErrorBoundary.tsx';
import './index.css';

// Register Service Worker for PWA Native Experience
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('DinoEnglish PWA Service Worker Registered:', reg.scope);
    }).catch((err) => {
      console.warn('DinoEnglish PWA Service Worker registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudentErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StudentErrorBoundary>
  </StrictMode>,
);
