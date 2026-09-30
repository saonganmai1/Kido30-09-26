import React from 'react';

interface VocabIllustrationGraphicProps {
  word: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VocabIllustrationGraphic: React.FC<VocabIllustrationGraphicProps> = ({
  word,
  size = 'md',
  className = '',
}) => {
  const w = (word || '').toLowerCase().trim();

  // Determine dimension classes - compact & balanced (Sample 3)
  let dimClass = 'w-32 sm:w-36 h-22 sm:h-26';
  if (size === 'sm') dimClass = 'w-28 sm:w-32 h-18 sm:h-22';
  if (size === 'lg') dimClass = 'w-40 sm:w-44 h-28 sm:h-30';

  // THEATRE / THEATER (Matching Sample Image 1)
  if (w.includes('theatre') || w.includes('theater')) {
    return (
      <div className={`mx-auto bg-[#fef3c7] rounded-xl border-2 border-amber-300 shadow-sm flex flex-col items-center justify-between p-1.5 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="w-full h-full bg-[#fffef0] rounded-lg border border-amber-200 p-1 flex flex-col items-center justify-between">
          <div className="my-auto flex flex-col items-center">
            <span className="text-3xl sm:text-4xl drop-shadow-xs">🏛️</span>
            <span className="text-[11px] font-black text-amber-900 tracking-wider uppercase mt-0.5">THEATRE</span>
          </div>
          <div className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200/80">
            theatre (nhà hát)
          </div>
        </div>
      </div>
    );
  }

  // FOX (Matching Sample Image 1)
  if (w.includes('fox')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#ffedd5] to-[#fed7aa] rounded-xl border-2 border-orange-300 shadow-sm flex flex-col items-center justify-between p-2 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="my-auto text-4xl sm:text-5xl drop-shadow-xs">🦊</div>
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[10px] sm:text-[11px] px-3 py-0.5 rounded-full shadow-2xs tracking-widest uppercase border border-orange-200">
          FOX
        </div>
      </div>
    );
  }

  // LISTEN TO MUSIC / MUSIC (Matching Sample Image 2)
  if (w.includes('listen') || w.includes('music')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#e0f2fe] to-[#bae6fd] rounded-xl border-2 border-sky-300 shadow-sm flex flex-col items-center justify-between p-2 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="my-auto flex items-center justify-center gap-1 text-3xl sm:text-4xl drop-shadow-xs">
          🎧 🎶
        </div>
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[10px] sm:text-[11px] px-3 py-0.5 rounded-full shadow-2xs tracking-widest uppercase border border-sky-200">
          LISTEN TO MUSIC
        </div>
      </div>
    );
  }

  // 1. DOLPHIN (Matching Image 1 100%)
  if (w.includes('dolphin')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#7dd3fc] via-[#38bdf8] to-[#0284c7] rounded-2xl border-2 border-sky-300 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
        {/* Clouds top */}
        <div className="absolute top-1 left-2 flex gap-1 opacity-80">
          <span className="text-white text-xs">☁️</span>
          <span className="text-white text-[10px]">☁️</span>
        </div>
        <div className="absolute top-1 right-3 text-amber-200 text-xs opacity-90">☀️</div>

        {/* Ocean Waves SVG Background */}
        <div className="absolute bottom-6 w-full h-12 opacity-40 pointer-events-none">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full fill-white">
            <path d="M0,15 C15,25 35,5 50,15 C65,25 85,5 100,15 L100,30 L0,30 Z" />
          </svg>
        </div>

        {/* Coral Reef at Bottom */}
        <div className="absolute bottom-6 left-2 flex gap-1 text-sm z-10 opacity-90">
          <span>🪸</span>
          <span>🐚</span>
        </div>
        <div className="absolute bottom-6 right-2 flex gap-1 text-sm z-10 opacity-90">
          <span>🐠</span>
          <span>🪸</span>
        </div>

        {/* Dolphin Center Illustration */}
        <div className="my-auto flex flex-col items-center justify-center z-10 drop-shadow-lg animate-pulse">
          <span className="text-5xl sm:text-6xl transform -rotate-12 hover:scale-110 transition duration-300">
            🐬
          </span>
          {/* Water Splash */}
          <span className="text-xs text-sky-100 -mt-2 font-black tracking-widest">💦 💦</span>
        </div>

        {/* DOLPHIN Banner Label at Bottom (Matching Image 1) */}
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-sky-200">
          DOLPHIN
        </div>
      </div>
    );
  }

  // 2. BEST FRIEND / FRIEND (Matching Image 2 100%)
  if (w.includes('best friend') || w.includes('friend')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#e0f2fe] via-[#fce7f3] to-[#dcfce7] rounded-2xl border-2 border-pink-200 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
        {/* Rainbow background arc */}
        <div className="absolute top-1 w-44 sm:w-52 h-24 border-[6px] border-t-rose-400 border-r-amber-300 border-b-emerald-300 border-l-sky-400 rounded-full opacity-60 pointer-events-none" />

        {/* Flowers and grass bottom */}
        <div className="absolute bottom-6 w-full flex justify-between px-3 text-xs opacity-80 z-0">
          <span>🌸</span>
          <span>🌿</span>
          <span>🌼</span>
          <span>🌿</span>
          <span>🌺</span>
        </div>

        {/* Cute kids high-fiving / holding hands */}
        <div className="my-auto flex items-center justify-center gap-3 z-10">
          {/* Kid 1 (Boy) */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-xs">
              👦
            </div>
            <div className="w-9 h-7 rounded-t-xl bg-sky-500 -mt-1 shadow-2xs" />
          </div>

          {/* Heart Center */}
          <div className="text-rose-500 text-xl animate-bounce z-10">
            💖
          </div>

          {/* Kid 2 (Girl) */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-xs">
              👧
            </div>
            <div className="w-9 h-7 rounded-t-xl bg-pink-500 -mt-1 shadow-2xs" />
          </div>
        </div>

        {/* BEST FRIEND Banner Label at Bottom (Matching Image 2) */}
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-pink-200">
          BEST FRIEND
        </div>
      </div>
    );
  }

  // 3. PLANT TREES / TREE
  if (w.includes('plant') || w.includes('tree')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#dcfce7] via-[#bbf7d0] to-[#86efac] rounded-2xl border-2 border-emerald-300 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="absolute top-2 left-3 text-amber-300 text-sm">☀️</div>
        <div className="my-auto flex items-center justify-center gap-2 z-10">
          <span className="text-4xl">🪴</span>
          <span className="text-5xl">🌳</span>
          <span className="text-3xl">🌱</span>
        </div>
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-emerald-300">
          PLANT TREES
        </div>
      </div>
    );
  }

  // 4. WANT
  if (w.includes('want')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#f59e0b]/40 rounded-2xl border-2 border-amber-300 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="my-auto flex items-center justify-center gap-2 z-10">
          <span className="text-4xl">💭</span>
          <span className="text-5xl">🎁</span>
          <span className="text-3xl">⭐</span>
        </div>
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-amber-300">
          WANT
        </div>
      </div>
    );
  }

  // 5. LAST / FINISH
  if (w.includes('last')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#f3e8ff] via-[#e9d5ff] to-[#c084fc]/40 rounded-2xl border-2 border-purple-300 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="my-auto flex items-center justify-center gap-2 z-10">
          <span className="text-5xl">🏆</span>
          <span className="text-4xl">🏁</span>
        </div>
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-purple-300">
          LAST
        </div>
      </div>
    );
  }

  // 6. PLAYGROUND / PARK
  if (w.includes('playground') || w.includes('park')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#e0f2fe] to-[#dcfce7] rounded-2xl border-2 border-sky-300 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="my-auto flex items-center justify-center gap-3 z-10 text-4xl">
          <span>🛝</span>
          <span>🎪</span>
          <span>🎡</span>
        </div>
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-sky-300">
          PLAYGROUND
        </div>
      </div>
    );
  }

  // 7. SCHOOL / CLASSROOM
  if (w.includes('school') || w.includes('classroom')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#dbeafe] to-[#bfdbfe] rounded-2xl border-2 border-blue-300 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="my-auto flex items-center justify-center gap-3 z-10 text-4xl">
          <span>🏫</span>
          <span>🎒</span>
          <span>📚</span>
        </div>
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-blue-300">
          SCHOOL
        </div>
      </div>
    );
  }

  // 8. APPLE
  if (w.includes('apple')) {
    return (
      <div className={`mx-auto bg-gradient-to-b from-[#ffe4e6] to-[#fecdd3] rounded-2xl border-2 border-rose-300 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
        <div className="my-auto text-5xl z-10 drop-shadow-md">
          🍎
        </div>
        <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-rose-300">
          APPLE
        </div>
      </div>
    );
  }

  // Default fallback visual card
  return (
    <div className={`mx-auto bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] rounded-2xl border-2 border-sky-300 shadow-md flex flex-col items-center justify-between p-2.5 relative overflow-hidden ${dimClass} ${className}`}>
      <div className="my-auto text-5xl z-10 drop-shadow-md">
        🌟
      </div>
      <div className="z-20 bg-white/95 text-slate-900 font-black text-[11px] sm:text-xs px-4 py-0.5 rounded-full shadow-sm tracking-widest uppercase border border-sky-300">
        {word.toUpperCase()}
      </div>
    </div>
  );
};
