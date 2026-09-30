import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Flame, Sparkles, RefreshCw, X } from 'lucide-react';
import { audioService } from '../utils/audio';

interface StreakLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCheckIn?: () => void;
  previousStreak?: number;
}

export const StreakLostModal: React.FC<StreakLostModalProps> = ({
  isOpen,
  onClose,
  onStartCheckIn,
  previousStreak = 3,
}) => {
  useEffect(() => {
    if (isOpen) {
      audioService.playErrorSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayStreak = previousStreak > 0 ? previousStreak : 3;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none"
      onClick={() => {
        audioService.playClickSound();
        onClose();
      }}
    >
      <div 
        className="bg-white rounded-[32px] sm:rounded-[40px] border-[3.5px] border-dashed border-[#f97316] p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative z-10 overflow-hidden font-sans space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Background Radial Glows */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />

        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={() => {
            audioService.playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#94a3b8] hover:text-[#475569] flex items-center justify-center transition active:scale-95 cursor-pointer z-20"
          title="Đóng thông báo"
        >
          <X size={18} className="stroke-[2.5]" />
        </button>

        {/* Top Graphic Illustration Area */}
        <div className="relative pt-1 flex flex-col items-center justify-center">
          {/* Sparkles Sticker (Top Left) */}
          <div className="absolute top-2 left-10 sm:left-14 text-[#fbbf24] animate-pulse pointer-events-none">
            <Sparkles size={22} className="stroke-[2.2] fill-[#fef08a]" />
          </div>

          {/* Small Flame Sticker (Bottom Right) */}
          <div className="absolute bottom-1 right-10 sm:right-14 text-[#f97316] pointer-events-none opacity-90">
            <Flame size={18} className="stroke-[2] fill-[#ffedd5]" />
          </div>

          {/* Main Dashed Circle Frame */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[3px] border-dashed border-[#f97316] bg-gradient-to-b from-[#fffdfa] via-[#fff7ed] to-[#ffedd5]/50 flex items-center justify-center relative shadow-inner my-1">
            {/* Center Flame Icon & Smoke Cloud Puffs */}
            <div className="relative flex items-center justify-center">
              <Flame size={54} className="text-[#f97316] stroke-[2.2] fill-[#ffedd5]/70" />

              {/* Animated Smoke Puffs */}
              <span className="absolute -top-1 -right-3 text-lg opacity-85 select-none animate-bounce">💨</span>
              <span className="absolute bottom-0 -left-4 text-base opacity-80 select-none">💨</span>
            </div>

            {/* Red '0 Ngày' Pill Badge at Bottom Center of Circle */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#ef4444] text-white font-extrabold text-xs sm:text-sm px-3.5 py-0.5 rounded-full shadow-md border-2 border-white whitespace-nowrap">
              0 Ngày
            </div>
          </div>
        </div>

        {/* Red Pill Badge Header */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-1.5 bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs">
            <span>💔 MẤT CHUỖI HỌC TẬP</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-1.5">
          <h3 className="text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight leading-tight">
            Ôi không! Lỡ mất chuỗi <br /> rồi! 😭
          </h3>
          
          <p className="text-xs sm:text-sm font-bold text-[#475569] leading-relaxed px-1">
            Hôm qua bé lỡ quên điểm danh, nên chuỗi <span className="text-[#f97316] font-black">{displayStreak} ngày</span> học tập chăm chỉ đã bị gián đoạn.
          </p>
        </div>

        {/* Yellow Callout Card */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm font-extrabold text-[#78350f] leading-relaxed text-center shadow-2xs mt-2">
          ☀️ Đừng nản lòng nhé! Hãy điểm danh ngay hôm nay để thắp sáng <span className="text-[#ea580c] font-black">Chuỗi Rực Rỡ</span> mới và nhận <span className="text-[#16a34a] font-black">+5 Sao Vàng</span> nào!
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              audioService.playClickSound();
              onClose();
              if (onStartCheckIn) onStartCheckIn();
            }}
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#ff6b00] via-[#ff7700] to-[#f97316] hover:from-[#ea580c] hover:to-[#ea580c] active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/30 transition duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <RefreshCw size={19} className="stroke-[2.8]" />
            <span>Bắt đầu chuỗi mới!</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playClickSound();
              onClose();
            }}
            className="py-3.5 px-5 bg-[#f1f5f9] hover:bg-[#e2e8f0] active:scale-95 text-[#64748b] font-black text-xs sm:text-sm rounded-2xl transition cursor-pointer whitespace-nowrap"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};



