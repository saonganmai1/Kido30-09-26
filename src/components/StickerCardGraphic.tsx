import React from 'react';

interface StickerCardGraphicProps {
  word: string;
  label?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StickerCardGraphic: React.FC<StickerCardGraphicProps> = ({
  word,
  label,
  icon,
  size = 'md',
  className = '',
}) => {
  const wLower = (word || '').toLowerCase().trim();
  const lText = label || word || '';
  const lLower = lText.toLowerCase().trim();

  // -------------------------------------------------------------
  // 1. COUNTRIES, CITIES, AND NATIONALITIES
  // -------------------------------------------------------------
  let countryCode: string | null = null;
  let countryName = lText;

  if (wLower.includes('australia') || wLower.includes('australian') || wLower === 'sydney' || icon === '🇦🇺') {
    countryCode = 'AU';
    countryName = wLower === 'sydney' ? 'Sydney' : 'Australia';
  } else if (wLower.includes('britain') || wLower.includes('england') || wLower === 'london' || (wLower.includes('english') && !wLower.includes('subject')) || icon === '🇬🇧') {
    countryCode = 'GB';
    countryName = wLower === 'london' ? 'London' : 'Britain';
  } else if (wLower.includes('japan') || wLower.includes('japanese') || wLower === 'tokyo' || icon === '🇯🇵') {
    countryCode = 'JP';
    countryName = wLower === 'tokyo' ? 'Tokyo' : 'Japan';
  } else if (wLower.includes('malaysia') || wLower.includes('malaysian') || icon === '🇲🇾') {
    countryCode = 'MY';
    countryName = 'Malaysia';
  } else if (wLower.includes('singapore') || wLower.includes('singaporean') || icon === '🇸🇬') {
    countryCode = 'SG';
    countryName = 'Singapore';
  } else if (wLower.includes('thailand') || wLower.includes('thai') || wLower === 'bangkok' || icon === '🇹🇭') {
    countryCode = 'TH';
    countryName = wLower === 'bangkok' ? 'Bangkok' : 'Thailand';
  } else if (wLower.includes('america') || wLower.includes('american') || icon === '🇺🇸') {
    countryCode = 'US';
    countryName = 'America';
  } else if (wLower.includes('viet nam') || wLower.includes('vietnam') || wLower.includes('vietnamese') || icon === '🇻🇳') {
    countryCode = 'VN';
    countryName = 'Viet Nam';
  } else if (wLower.includes('china') || wLower.includes('chinese') || icon === '🇨🇳') {
    countryCode = 'CN';
    countryName = 'China';
  } else if (wLower.includes('india') || wLower.includes('indian') || icon === '🇮🇳') {
    countryCode = 'IN';
    countryName = 'India';
  }

  // -------------------------------------------------------------
  // 2. DAYS OF THE WEEK
  // -------------------------------------------------------------
  const dayMap: Record<string, { short: string; name: string }> = {
    monday: { short: 'MON', name: 'Monday' },
    tuesday: { short: 'TUE', name: 'Tuesday' },
    wednesday: { short: 'WED', name: 'Wednesday' },
    thursday: { short: 'THU', name: 'Thursday' },
    friday: { short: 'FRI', name: 'Friday' },
    saturday: { short: 'SAT', name: 'Saturday' },
    sunday: { short: 'SUN', name: 'Sunday' },
  };

  let dayInfo: { short: string; name: string } | null = null;
  for (const dayKey of Object.keys(dayMap)) {
    if (wLower.includes(dayKey)) {
      dayInfo = dayMap[dayKey];
      break;
    }
  }

  // -------------------------------------------------------------
  // 3. MONTHS OF THE YEAR
  // -------------------------------------------------------------
  const monthMap: Record<string, { num: string; name: string; color: string }> = {
    january: { num: '01', name: 'January', color: '#3b82f6' },
    february: { num: '02', name: 'February', color: '#ec4899' },
    march: { num: '03', name: 'March', color: '#10b981' },
    april: { num: '04', name: 'April', color: '#84cc16' },
    may: { num: '05', name: 'May', color: '#eab308' },
    june: { num: '06', name: 'June', color: '#f97316' },
    july: { num: '07', name: 'July', color: '#ef4444' },
    august: { num: '08', name: 'August', color: '#06b6d4' },
    september: { num: '09', name: 'September', color: '#8b5cf6' },
    october: { num: '10', name: 'October', color: '#d97706' },
    november: { num: '11', name: 'November', color: '#059669' },
    december: { num: '12', name: 'December', color: '#0284c7' },
  };

  let monthInfo: { num: string; name: string; color: string } | null = null;
  for (const mKey of Object.keys(monthMap)) {
    if (wLower.includes(mKey)) {
      monthInfo = monthMap[mKey];
      break;
    }
  }

  // -------------------------------------------------------------
  // 4. SUBJECTS & SCHOOL
  // -------------------------------------------------------------
  const isIT = wLower === 'it' || wLower === 'information technology' || lLower === 'it';
  const isMaths = wLower.includes('math') || wLower.includes('toán');
  const isArt = wLower === 'art' || wLower.includes('mỹ thuật');
  const isMusic = wLower === 'music' || wLower.includes('âm nhạc');
  const isScience = wLower.includes('science') || wLower.includes('khoa học');

  // -------------------------------------------------------------
  // 5. TIME & CLOCK
  // -------------------------------------------------------------
  const isClock = wLower.includes("o'clock") || wLower.includes("oclock") || wLower === "clock" || wLower === "time";

  // -------------------------------------------------------------
  // 6. CATEGORY COLOR THEME DETERMINATION
  // -------------------------------------------------------------
  let bgGradient = 'from-[#e0f2fe] via-[#e0f2fe]/90 to-[#bae6fd]/70 border-sky-200/90 text-[#0284c7]';

  if (monthInfo) {
    bgGradient = 'from-[#fef3c7] via-[#fef3c7]/90 to-[#fde68a]/70 border-amber-200/90 text-[#b45309]';
  } else if (dayInfo) {
    bgGradient = 'from-[#e0e7ff] via-[#e0e7ff]/90 to-[#c7d2fe]/70 border-indigo-200/90 text-[#4338ca]';
  } else if (countryCode) {
    bgGradient = 'from-[#e0f2fe] via-[#e0f2fe]/90 to-[#bae6fd]/70 border-sky-200/90 text-[#0284c7]';
  } else if (isIT || isMaths || isScience || isArt || isMusic) {
    bgGradient = 'from-[#f3e8ff] via-[#f3e8ff]/90 to-[#e9d5ff]/70 border-purple-200/90 text-[#7e22ce]';
  } else if (isClock) {
    bgGradient = 'from-[#ffe4e6] via-[#ffe4e6]/90 to-[#fecdd3]/70 border-rose-200/90 text-[#be123c]';
  }

  // -------------------------------------------------------------
  // SIZING LOGIC
  // -------------------------------------------------------------
  let dimensionClasses = 'w-24 h-24 sm:w-28 sm:h-28';
  let fontMain = 'text-4xl sm:text-5xl';
  let pillText = 'text-[10px] sm:text-[11px]';
  let svgSize = 56;
  
  if (size === 'lg') {
    dimensionClasses = 'w-32 h-32 sm:w-40 sm:h-40';
    fontMain = 'text-5xl sm:text-6xl';
    pillText = 'text-xs sm:text-sm';
    svgSize = 80;
  } else if (size === 'sm') {
    dimensionClasses = 'w-20 h-20';
    fontMain = 'text-3xl';
    pillText = 'text-[9px]';
    svgSize = 44;
  }

  return (
    <div className={`mx-auto rounded-2xl bg-gradient-to-b ${bgGradient} border-2 p-2 flex flex-col items-center justify-center relative shadow-2xs group-hover:scale-105 group-hover:-translate-y-0.5 transition duration-200 overflow-hidden ${dimensionClasses} ${className}`}>
      {/* Subtle Dot Matrix Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:10px_10px] opacity-[0.08] pointer-events-none" />

      {/* Main Graphic Area */}
      <div className="flex flex-col items-center justify-center z-10 my-auto w-full">
        
        {/* CASE 1: COUNTRY BADGE (AU, GB, JP, MY, SG, TH, US, VN...) */}
        {countryCode ? (
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wider font-mono bg-white/90 px-2.5 py-0.5 rounded-xl border border-sky-200 shadow-2xs">
              {countryCode}
            </span>
          </div>
        )

        /* CASE 2: DAYS OF THE WEEK 2D CALENDAR */
        : dayInfo ? (
          <div className="flex flex-col items-center justify-center drop-shadow-sm">
            <svg width={svgSize} height={svgSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="12" width="48" height="44" rx="10" fill="#60A5FA" />
              <rect x="8" y="12" width="48" height="44" rx="10" fill="url(#blue_grad)" />
              <rect x="8" y="12" width="48" height="14" rx="4" fill="#3B82F6" />
              <rect x="16" y="8" width="4" height="8" rx="2" fill="#93C5FD" />
              <rect x="28" y="8" width="4" height="8" rx="2" fill="#93C5FD" />
              <rect x="40" y="8" width="4" height="8" rx="2" fill="#93C5FD" />
              <circle cx="18" cy="34" r="2.5" fill="#DBEAFE" />
              <circle cx="28" cy="34" r="2.5" fill="#DBEAFE" />
              <circle cx="38" cy="34" r="2.5" fill="#DBEAFE" />
              <circle cx="48" cy="34" r="2.5" fill="#DBEAFE" />
              <circle cx="18" cy="44" r="2.5" fill="#DBEAFE" />
              <circle cx="28" cy="44" r="2.5" fill="#DBEAFE" />
              <circle cx="38" cy="44" r="2.5" fill="#DBEAFE" />
              <circle cx="48" cy="44" r="2.5" fill="#DBEAFE" />
              <defs>
                <linearGradient id="blue_grad" x1="32" y1="12" x2="32" y2="56" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#93C5FD" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )

        /* CASE 3: MONTHS 2D CALENDAR */
        : monthInfo ? (
          <div className="flex flex-col items-center justify-center drop-shadow-sm">
            <svg width={svgSize} height={svgSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="10" width="48" height="46" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
              <path d="M8 18C8 13.5817 11.5817 10 16 10H48C52.4183 10 56 13.5817 56 18V24H8V18Z" fill={monthInfo.color} />
              <rect x="18" y="6" width="4" height="8" rx="2" fill="#64748B" />
              <rect x="42" y="6" width="4" height="8" rx="2" fill="#64748B" />
              <text x="32" y="45" textAnchor="middle" fill="#1E293B" fontSize="20" fontWeight="900" fontFamily="sans-serif">
                {monthInfo.num}
              </text>
            </svg>
          </div>
        )

        /* CASE 4: O'CLOCK 2D ALARM CLOCK */
        : isClock ? (
          <div className="flex flex-col items-center justify-center drop-shadow-sm">
            <svg width={svgSize} height={svgSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="8" fill="#F59E0B" />
              <circle cx="46" cy="18" r="8" fill="#F59E0B" />
              <rect x="16" y="48" width="6" height="8" rx="3" fill="#E2E8F0" transform="rotate(25 16 48)" />
              <rect x="42" y="48" width="6" height="8" rx="3" fill="#E2E8F0" transform="rotate(-25 42 48)" />
              <circle cx="32" cy="34" r="22" fill="#F43F5E" />
              <circle cx="32" cy="34" r="16" fill="#FFFFFF" />
              <rect x="30.5" y="22" width="3" height="13" rx="1.5" fill="#1E293B" />
              <rect x="30.5" y="32.5" width="8" height="3" rx="1.5" fill="#F43F5E" />
              <circle cx="32" cy="34" r="2.5" fill="#1E293B" />
            </svg>
          </div>
        )

        /* CASE 5: IT / COMPUTER */
        : isIT ? (
          <div className="flex flex-col items-center justify-center drop-shadow-sm">
            <svg width={svgSize} height={svgSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="26" y="42" width="12" height="8" fill="#94A3B8" />
              <rect x="20" y="48" width="24" height="4" rx="2" fill="#64748B" />
              <rect x="8" y="12" width="48" height="32" rx="4" fill="#475569" />
              <rect x="12" y="16" width="40" height="24" rx="2" fill="#38BDF8" />
              <path d="M12 16L32 16L12 36V16Z" fill="#7DD3FC" opacity="0.5" />
              <rect x="14" y="53" width="36" height="5" rx="1.5" fill="#CBD5E1" />
            </svg>
          </div>
        )

        /* CASE 6: MATHS */
        : isMaths ? (
          <div className="flex flex-col items-center justify-center drop-shadow-sm">
            <svg width={svgSize} height={svgSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="44" height="44" rx="10" fill="#10B981" />
              <rect x="16" y="16" width="32" height="12" rx="4" fill="#ECFDF5" />
              <circle cx="22" cy="36" r="3" fill="#FFFFFF" />
              <circle cx="32" cy="36" r="3" fill="#FFFFFF" />
              <circle cx="42" cy="36" r="3" fill="#FFFFFF" />
              <circle cx="22" cy="46" r="3" fill="#FFFFFF" />
              <circle cx="32" cy="46" r="3" fill="#FFFFFF" />
              <circle cx="42" cy="46" r="3" fill="#F59E0B" />
            </svg>
          </div>
        )

        /* CASE 7: ART */
        : isArt ? (
          <div className="flex flex-col items-center justify-center drop-shadow-sm">
            <svg width={svgSize} height={svgSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 10C19.85 10 10 19.85 10 32C10 44.15 19.85 54 32 54C34.5 54 36.5 52 36.5 49.5C36.5 48.3 36 47.2 35.2 46.4C34.4 45.6 34 44.5 34 43.3C34 40.9 36 38.9 38.4 38.9H44C49.5 38.9 54 34.4 54 28.9C54 18.5 44.15 10 32 10Z" fill="#F87171" />
              <circle cx="20" cy="24" r="3.5" fill="#FBBF24" />
              <circle cx="30" cy="18" r="3.5" fill="#34D399" />
              <circle cx="42" cy="22" r="3.5" fill="#60A5FA" />
              <circle cx="20" cy="36" r="3.5" fill="#A78BFA" />
              <circle cx="45" cy="45" r="4" fill="#FFFFFF" />
            </svg>
          </div>
        )

        /* CASE 8: MUSIC */
        : isMusic ? (
          <div className="flex flex-col items-center justify-center drop-shadow-sm">
            <svg width={svgSize} height={svgSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="48" height="48" rx="14" fill="#8B5CF6" />
              <circle cx="24" cy="42" r="6" fill="#F472B6" />
              <circle cx="42" cy="36" r="6" fill="#F472B6" />
              <path d="M29 42V20L47 14V36" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )

        /* DEFAULT EMOJI ICON WITH CUTE DROP SHADOW */
        : (
          <span className={`${fontMain} drop-shadow-md transition transform group-hover:scale-110`}>
            {icon || '⭐'}
          </span>
        )}
      </div>

      {/* Pill Tag Label at Bottom */}
      <span className={`bg-white/95 backdrop-blur-xs border border-sky-300/80 px-2.5 py-0.5 rounded-full font-black text-[#0284c7] shadow-2xs absolute bottom-1.5 z-20 whitespace-nowrap max-w-[90%] truncate text-center ${pillText}`}>
        {countryName || (dayInfo ? dayInfo.name : (monthInfo ? monthInfo.name : lText))}
      </span>
    </div>
  );
};
