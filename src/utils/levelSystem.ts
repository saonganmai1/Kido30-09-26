/**
 * Level & Experience System Utility
 * 
 * Rules:
 * - Stars (sao) act as experience points (XP).
 * - Level 0 -> Level 1: Requires 100 stars.
 * - Level 1 -> Level 2: Requires 150 stars.
 * - Level 2 -> Level 3: Requires 200 stars.
 * ...
 * - Level L -> Level L + 1: Requires 100 + L * 50 stars.
 */

/**
 * Returns stars required to level up from level L to level L + 1.
 */
export function getStarsRequiredForLevel(level: number): number {
  const lvl = Math.max(0, Math.floor(level));
  return 100 + lvl * 50;
}

/**
 * Calculates level, current level XP progress, and maxXp required for next level
 * based on total accumulated stars.
 */
export function calculateLevelAndXpFromStars(totalStars: number) {
  let starsRemaining = Math.max(0, Math.floor(totalStars || 0));
  let currentLevel = 0;

  while (true) {
    const requiredForNext = getStarsRequiredForLevel(currentLevel);
    if (starsRemaining >= requiredForNext) {
      starsRemaining -= requiredForNext;
      currentLevel += 1;
    } else {
      break;
    }
  }

  const maxXp = getStarsRequiredForLevel(currentLevel);
  const xp = starsRemaining;

  return {
    level: currentLevel,
    xp,
    maxXp,
    percent: Math.min(100, Math.max(0, Math.round((xp / maxXp) * 100))),
  };
}

/**
 * Calculates total cumulative stars needed to reach a target level from level 0.
 */
export function getTotalStarsNeededForLevel(targetLevel: number): number {
  let total = 0;
  for (let l = 0; l < Math.max(0, targetLevel); l++) {
    total += getStarsRequiredForLevel(l);
  }
  return total;
}

/**
 * Calculates level and bounded XP progress.
 * Guarantees xp <= maxXp so XP overflow (e.g. 1150/250 XP) never occurs.
 */
export function getUserLevelAndXp(userStars: number, userLevel?: number, userXp?: number) {
  const level = userLevel !== undefined && userLevel >= 0 ? Math.max(0, Math.floor(userLevel)) : 0;
  const maxXp = getStarsRequiredForLevel(level);

  let xp: number;
  if (userXp !== undefined && userXp >= 0) {
    xp = Math.min(maxXp, userXp);
  } else {
    const starsNeededForCurrentLevel = getTotalStarsNeededForLevel(level);
    const xpInCurrentLevel = Math.max(0, Math.floor(userStars || 0) - starsNeededForCurrentLevel);
    xp = Math.min(maxXp, xpInCurrentLevel);
  }

  const percent = Math.min(100, Math.max(0, Math.round((xp / maxXp) * 100)));

  return {
    level,
    xp,
    maxXp,
    percent,
  };
}

