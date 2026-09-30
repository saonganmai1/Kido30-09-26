import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Crown, ArrowRight, X, Gift, CheckCircle2, Zap } from 'lucide-react';
import { VipPromotionConfig } from '../types';

interface VipPromotionBannerProps {
  promotion: VipPromotionConfig | null;
  isVip?: boolean;
  onOpenUpgradeModal: () => void;
}

export const VipPromotionBanner: React.FC<VipPromotionBannerProps> = ({
  promotion,
  isVip = false,
  onOpenUpgradeModal
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!promotion || !promotion.isEnabled || !promotion.endDate) return;

    const calculateTimeLeft = () => {
      const endMs = new Date(`${promotion.endDate}T23:59:59`).getTime();
      const nowMs = Date.now();
      const diffMs = endMs - nowMs;

      if (diffMs <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [promotion]);

  // Don't render banner if user is already VIP, or promo is disabled, or dismissed
  if (isVip || !promotion || !promotion.isEnabled || isDismissed) {
    return null;
  }

  // Check if target audience matches
  if (promotion.targetAudience === 'non_vip' && isVip) {
    return null;
  }

  const gradientClass = promotion.bgGradient || 'from-amber-500 via-rose-500 to-indigo-700';

  return (
    <div className="relative w-full overflow-hidden shadow-lg transition-all animate-fadeIn">
      {/* Top Banner Gradient Box */}
      <div className={`bg-gradient-to-r ${gradientClass} text-white px-3.5 sm:px-6 py-2.5 sm:py-3.5 relative flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4`}>
        {/* Decorative background glow */}
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

        {/* Left Info Section */}
        <div className="flex items-center gap-3 z-10 text-center sm:text-left">
          <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center text-amber-300 border border-white/20 shadow-xs animate-bounce">
            <Crown size={22} className="drop-shadow-xs" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Zap size={11} fill="currentColor" /> GIẢM {promotion.discountPercent || 50}%
              </span>

              {timeLeft && (
                <span className="px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-amber-200 font-bold text-[11px] flex items-center gap-1 border border-white/10">
                  <Clock size={11} />
                  <span>
                    Còn {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-black text-white tracking-tight line-clamp-1 leading-snug">
              {promotion.bannerText || promotion.title}
            </h4>

            <p className="text-[11px] text-amber-100/90 font-medium hidden md:block">
              {promotion.description}
            </p>
          </div>
        </div>

        {/* Right Price & CTA Section */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="text-right hidden xs:block">
            <span className="text-[10px] text-amber-200/80 font-bold line-through block leading-tight">
              {promotion.originalPrice}
            </span>
            <span className="text-sm sm:text-base font-black text-amber-300 leading-tight flex items-center gap-1">
              {promotion.discountedPrice} <span className="text-[10px] font-bold text-white/80">/năm</span>
            </span>
          </div>

          <button
            onClick={onOpenUpgradeModal}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-amber-200"
          >
            <Sparkles size={14} className="animate-spin text-amber-900" style={{ animationDuration: '4s' }} />
            <span>{promotion.ctaText || 'Nâng Cấp VIP Ngay'}</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition cursor-pointer"
            title="Ẩn thông báo"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
