import { GameOutcome } from '../types/game';

export const BEST_SCORE_STORAGE_KEY = 'plantStructureMatchingGame.bestScore';

/**
 * Safely reads and validates the best score from localStorage.
 * Returns null if missing, corrupted, negative, non-finite, or if storage access is restricted.
 */
export function getBestScore(): number | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    if (raw === null || raw === undefined || raw === '') {
      return null;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || isNaN(parsed) || parsed < 0) {
      return null;
    }
    return Math.floor(parsed);
  } catch {
    // Graceful fallback if localStorage is disabled in iframe / private mode
    return null;
  }
}

/**
 * Safely saves the new best score into localStorage.
 */
export function saveBestScore(score: number): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    if (!Number.isFinite(score) || score < 0) {
      return false;
    }
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, Math.floor(score).toString());
    return true;
  } catch {
    return false;
  }
}

/**
 * Evaluates whether the completed game final score qualifies as a new Best Score.
 * Rule: Only legitimately COMPLETED rounds are eligible. TIME_UP rounds cannot update Best Score.
 */
export function recordCompletedScore(
  finalScore: number,
  outcome: GameOutcome
): { isNewBest: boolean; currentBest: number } {
  const existingBest = getBestScore();

  if (outcome !== 'COMPLETED') {
    return {
      isNewBest: false,
      currentBest: existingBest ?? 0,
    };
  }

  const safeScore = Math.max(0, Math.floor(finalScore));

  if (existingBest === null || safeScore > existingBest) {
    saveBestScore(safeScore);
    return {
      isNewBest: true,
      currentBest: safeScore,
    };
  }

  return {
    isNewBest: false,
    currentBest: existingBest,
  };
}
