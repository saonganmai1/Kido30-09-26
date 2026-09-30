import React, { useState } from 'react';

interface UserAvatarProps {
  avatar?: string;
  name?: string;
  className?: string;
  fallbackUrl?: string;
}

export const isImageUrl = (avatarUrl?: string): boolean => {
  if (!avatarUrl || typeof avatarUrl !== 'string') return false;
  const trimmed = avatarUrl.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image')
  );
};

export const DEFAULT_STUDENT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name = 'User',
  className = 'w-8 h-8 rounded-full',
}) => {
  const [hasImageError, setHasImageError] = useState<boolean>(false);

  const cleanAvatar = typeof avatar === 'string' ? avatar.trim() : '';

  // Determine scaled text size based on container dimensions in className
  let scaledTextSize = 'text-xs sm:text-sm';
  if (className.includes('w-20') || className.includes('h-20') || className.includes('w-24') || className.includes('h-24')) {
    scaledTextSize = 'text-3xl sm:text-4xl';
  } else if (className.includes('w-16') || className.includes('h-16') || className.includes('w-14') || className.includes('h-14')) {
    scaledTextSize = 'text-2xl sm:text-3xl';
  } else if (className.includes('w-12') || className.includes('h-12') || className.includes('w-10') || className.includes('h-10')) {
    scaledTextSize = 'text-base sm:text-lg';
  } else if (className.includes('w-4') || className.includes('h-4') || className.includes('w-5') || className.includes('h-5')) {
    scaledTextSize = 'text-[10px]';
  }

  // 1. If avatar is a non-image string (like an emoji '🦖', '👾', '🐱', '🐶', '🦁', '🤖', '🛡️', '👨‍👩‍👧', '🎒')
  if (cleanAvatar && !isImageUrl(cleanAvatar)) {
    return (
      <div
        className={`flex items-center justify-center select-none shrink-0 bg-amber-100 text-amber-900 border border-amber-200/80 rounded-full ${className}`}
        title={name}
      >
        <span className={`leading-none flex items-center justify-center ${scaledTextSize}`}>{cleanAvatar}</span>
      </div>
    );
  }

  // 2. If avatar is a valid Image URL or Data URL and hasn't errored
  if (cleanAvatar && isImageUrl(cleanAvatar) && !hasImageError) {
    return (
      <img
        src={cleanAvatar}
        alt={name}
        className={`object-cover shrink-0 ${className}`}
        onError={() => setHasImageError(true)}
      />
    );
  }

  // 3. Fallback: If image failed to load or no avatar provided, render a clean letter badge
  const initial = (name || 'U').trim().charAt(0).toUpperCase() || 'U';
  return (
    <div
      className={`flex items-center justify-center select-none shrink-0 font-black bg-gradient-to-br from-sky-400 to-indigo-500 text-white rounded-full shadow-2xs ${className}`}
      title={name}
    >
      <span className={`leading-none flex items-center justify-center ${scaledTextSize}`}>{initial}</span>
    </div>
  );
};

