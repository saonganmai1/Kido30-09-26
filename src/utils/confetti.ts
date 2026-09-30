import confetti from 'canvas-confetti';

export type ConfettiType = 'default' | 'levelUp' | 'lessonComplete' | 'starsAwarded';

/**
 * Triggers a canvas-based confetti animation effect.
 * @param type 'default' | 'levelUp' | 'lessonComplete' | 'starsAwarded'
 */
export const triggerConfetti = (type: ConfettiType = 'default') => {
  if (typeof window === 'undefined') return;

  try {
    if (type === 'levelUp') {
      // High energy multi-stage celebratory fireworks & cannons for level up
      const duration = 2500;
      const animationEnd = Date.now() + duration;

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          zIndex: 9999,
          colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#10b981', '#ec4899'],
        });
      }, 250);
    } else if (type === 'lessonComplete') {
      // Side cannon bursts from left and right
      const count = 100;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#38bdf8', '#3b82f6', '#f59e0b', '#10b981'],
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } else if (type === 'starsAwarded') {
      // Star shower burst
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 9999,
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#38bdf8'],
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
    } else {
      // Default burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    }
  } catch (err) {
    console.warn('Failed to launch confetti:', err);
  }
};
