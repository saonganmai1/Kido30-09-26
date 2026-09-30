import React, { useState, useEffect } from 'react';
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  Moon, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  X, 
  Zap, 
  BookOpen, 
  Gamepad2, 
  Award, 
  Signal, 
  Globe 
} from 'lucide-react';
import { audioService } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface OfflineNoticeBannerProps {
  isOnline: boolean;
  onToggleOfflineSimulation?: () => void;
}

export const OfflineNoticeBanner: React.FC<OfflineNoticeBannerProps> = ({
  isOnline,
  onToggleOfflineSimulation,
}) => {
  const { lang, t } = useLanguage();
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mascotMood, setMascotMood] = useState<'sleep' | 'jump' | 'happy'>('sleep');

  // Trigger modal popup automatically when offline status detected
  useEffect(() => {
    if (!isOnline) {
      setShowModal(true);
      setMascotMood('sleep');
    } else {
      setShowModal(false);
    }
  }, [isOnline]);

  // Handle reconnecting progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnecting) {
      setMascotMood('jump');
      setProgress(5);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const increment = Math.floor(Math.random() * 18) + 12;
          return Math.min(100, prev + increment);
        });
      }, 220);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isConnecting]);

  // Complete reconnection sequence
  useEffect(() => {
    if (progress === 100 && isConnecting) {
      const timer = setTimeout(() => {
        setIsConnecting(false);
        setMascotMood('happy');
        audioService.playSuccessSound();
        if (onToggleOfflineSimulation) {
          onToggleOfflineSimulation();
        }
        setShowModal(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, isConnecting, onToggleOfflineSimulation]);

  if (isOnline) return null;

  const handleStartReconnect = () => {
    audioService.playClickSound();
    setIsConnecting(true);
  };

  const getStatusText = () => {
    if (progress < 30) {
      return t("📡 Đang dò tìm tín hiệu sóng Wi-Fi / 4G...", "📡 Searching for Wi-Fi / 4G signal...");
    }
    if (progress < 70) {
      return t("⚡ Đang kết nối thử nghiệm máy chủ KidoServer...", "⚡ Testing connection to KidoServer...");
    }
    if (progress < 100) {
      return t("🦖 Chú khủng long Kido đang nhảy vọt kiểm tra tốc độ...", "🦖 Kido mascot is jumping to check network speed...");
    }
    return t("✅ Khôi phục kết nối thành công! Đã kết nối lại.", "✅ Reconnection successful! Online again.");
  };

  return (
    <>
      {/* 1. COMPACT TOP BANNER ALERT (Always visible when offline) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-[22px] shadow-lg border-2 border-amber-400/50 mb-3 animate-fadeIn select-none relative overflow-hidden">
        {/* Background ambient decorative glowing shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            {/* Animated Pet Mascot Icon */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-md flex-shrink-0 cursor-pointer hover:scale-105 transition"
                 onClick={() => setShowModal(true)}>
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl relative overflow-hidden">
                <span className={isConnecting ? "animate-kido-jump inline-block" : "animate-kido-dance inline-block"}>
                  🦖
                </span>
                <span className="absolute -top-1 -right-1 text-[10px] bg-rose-500 text-white font-black px-1 rounded-full border border-white">
                  OFF
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-amber-300 tracking-tight flex items-center gap-1.5">
                  <span>{t("Mất kết nối Wi-Fi / 4G (Chế độ Ngoại Tuyến)", "Wi-Fi / 4G Lost (Offline Mode)")}</span>
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/90 text-white font-extrabold text-[10px] rounded-full border border-rose-300/40">
                  <WifiOff size={10} />
                  <span>{t("Ngoại tuyến", "Offline")}</span>
                </span>
              </div>
              <p className="text-xs text-indigo-100/90 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">
                {t(
                  "Bé vẫn có thể tiếp tục học bài, luyện từ vựng & chơi game bình thường!",
                  "You can still continue learning lessons, vocabulary & playing games!"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowModal(true);
              }}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap size={14} className="text-slate-950 fill-slate-950" />
              <span>{t("Xem Chi Tiết & Kiểm Tra", "View Details & Test")}</span>
            </button>

            <button
              onClick={handleStartReconnect}
              disabled={isConnecting}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-400/40"
            >
              <RefreshCw size={14} className={isConnecting ? "animate-spin text-amber-300" : "text-amber-300"} />
              <span>{isConnecting ? t("Đang thử...", "Testing...") : t("Thử Kết Nối Lại", "Reconnect")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. RICH LIVELY POPUP MODAL FOR OFFLINE MODE */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn select-none overflow-y-auto">
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[32px] max-w-lg w-full p-5 sm:p-7 shadow-2xl border-4 border-amber-400/80 relative overflow-hidden my-auto space-y-5">
            {/* Background Decorative Ambient Stars & Rays */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowModal(false);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-600/50 cursor-pointer z-20"
              title={t("Đóng popup", "Close popup")}
            >
              <X size={18} />
            </button>

            {/* HEADER AREA WITH ANIMATED PET MASCOT STICKER */}
            <div className="text-center relative z-10 pt-1">
              {/* Animated Jumping Pet Sticker Canvas */}
              <div className="relative inline-block mx-auto mb-2">
                {/* Floating sparkle icons around pet */}
                <span className="absolute -top-3 -left-4 text-2xl animate-float-sparkle pointer-events-none">✨</span>
                <span className="absolute -top-4 -right-3 text-2xl animate-bounce pointer-events-none">⭐</span>
                <span className="absolute -bottom-1 -left-5 text-xl animate-pulse pointer-events-none">🎶</span>
                <span className="absolute -bottom-2 -right-4 text-xl animate-float-sparkle pointer-events-none">⚡</span>

                {/* Soft glowing aura ring behind mascot */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 blur-xl opacity-40 animate-pulse-glow" />

                {/* Big Vibrant Sticker Card Box */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-amber-300 via-emerald-400 to-teal-500 rounded-3xl p-1 shadow-2xl border-4 border-white transform hover:scale-105 transition">
                  <div className="w-full h-full bg-slate-950 rounded-[20px] flex flex-col items-center justify-center relative overflow-hidden border border-amber-300/30">
                    
                    {/* The Lively Pet Mascot Sticker Graphic */}
                    <div className="relative z-10 flex flex-col items-center">
                      <span className={`text-6xl sm:text-7xl filter drop-shadow-lg ${
                        isConnecting ? 'animate-kido-jump' : 'animate-kido-dance'
                      }`}>
                        🦖
                      </span>

                      {/* Small badge overlay on mascot */}
                      <span className="mt-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                        {isConnecting ? (
                          <>
                            <Sparkles size={10} className="animate-spin" />
                            <span>{t("Đang Nhảy!", "Jumping!")}</span>
                          </>
                        ) : (
                          <>
                            <Moon size={10} />
                            <span>Kido Offline</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Background pattern inside sticker card */}
                    <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:10px_10px] opacity-20 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Title & Status Subtitle */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-black uppercase tracking-wider mb-1">
                  <WifiOff size={12} />
                  <span>{t("Mất Kết Nối Wi-Fi / 4G", "Wi-Fi / 4G Disconnected")}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight leading-snug">
                  {t("Bé Ơi! Đã Chuyển Sang Chế Độ Ngoại Tuyến 🎒", "Offline Mode Activated! 🎒")}
                </h2>

                <p className="text-xs sm:text-sm text-indigo-100 font-medium max-w-md mx-auto leading-relaxed">
                  {t(
                    "Đừng lo lắng nhé! Toàn bộ bài học, từ vựng, flashcard & trò chơi thú vị đã được lưu sẵn trong ứng dụng.",
                    "Don't worry! All lessons, vocabulary, flashcards & fun games are saved offline for you."
                  )}
                </p>
              </div>
            </div>

            {/* HIGHLIGHTED OFFLINE CAPABILITIES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative z-10">
              <div className="bg-slate-800/80 border border-amber-400/30 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner hover:border-amber-400 transition">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-1.5">
                  <BookOpen size={16} />
                </div>
                <h4 className="text-xs font-extrabold text-amber-200">
                  {t("Học Bài Đã Lưu", "Offline Lessons")}
                </h4>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5 leading-tight">
                  {t("Luyện từ vựng, flashcard & bài tập", "Practice vocab, flashcards & exercises")}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-emerald-400/30 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner hover:border-emerald-400 transition">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center mb-1.5">
                  <Gamepad2 size={16} />
                </div>
                <h4 className="text-xs font-extrabold text-emerald-200">
                  {t("Chơi Trò Chơi", "Play Offline Games")}
                </h4>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5 leading-tight">
                  {t("Chơi game ôn tập không tốn dung lượng", "Enjoy games without using data")}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-purple-400/30 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner hover:border-purple-400 transition">
                <div className="w-8 h-8 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center mb-1.5">
                  <Award size={16} />
                </div>
                <h4 className="text-xs font-extrabold text-purple-200">
                  {t("Tự Đồng Bộ Sao", "Auto Star Sync")}
                </h4>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5 leading-tight">
                  {t("Tự động lưu sao khi online lại", "Automatically sync stars when online")}
                </p>
              </div>
            </div>

            {/* DYNAMIC RECONNECT LOADING SECTION WITH JUMPING PET STICKER */}
            <div className="bg-slate-950/80 border-2 border-indigo-400/40 p-4 rounded-2xl space-y-3 relative z-10 shadow-inner">
              {!isConnecting ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-indigo-200 font-semibold">
                    <Signal size={16} className="text-amber-400 shrink-0" />
                    <span>{t("Bé muốn thử kết nối lại mạng không?", "Want to test reconnecting now?")}</span>
                  </div>

                  <button
                    onClick={handleStartReconnect}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-amber-200 whitespace-nowrap"
                  >
                    <RefreshCw size={15} className="text-slate-950 shrink-0" />
                    <span>{t("Thử Kết Nối Lại 4G / Wi-Fi", "Test Reconnect 4G / Wi-Fi")}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 animate-fadeIn">
                  {/* Loading Header with Animated Mascot Indicator */}
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-amber-300 flex items-center gap-2">
                      <span className="animate-kido-jump inline-block text-lg">🦖</span>
                      <Loader2 size={14} className="animate-spin text-amber-400" />
                      <span>{t("Khủng long Kido đang dò tín hiệu...", "Kido mascot checking signal...")}</span>
                    </span>
                    <span className="text-emerald-400 font-mono text-sm">{progress}%</span>
                  </div>

                  {/* Progress Bar with Rainbow Gradient */}
                  <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-indigo-400/50 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 rounded-full transition-all duration-200 ease-out shadow-md"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Status update description */}
                  <div className="bg-slate-900/90 rounded-xl p-2.5 border border-indigo-500/30 text-center">
                    <p className="text-xs font-bold text-amber-200 animate-pulse">
                      {getStatusText()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
                💡 {t("Mẹo: Mọi tiến trình học offline đều được giữ an toàn!", "Tip: All offline learning progress is safely kept!")}
              </p>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  setShowModal(false);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition border border-slate-600/60 cursor-pointer shadow-sm text-center whitespace-nowrap shrink-0"
              >
                {t("Tiếp Tục Học Ngoại Tuyến", "Continue Learning Offline")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
