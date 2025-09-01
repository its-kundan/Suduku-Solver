import { Difficulty } from './core-sudoku';

export interface ScoreResult {
  score: number;
  xp: number;
  timeBonus: number;
  mistakePenalty: number;
  hintPenalty: number;
}

// Base XP for completing puzzles by difficulty
const BASE_XP: Record<Difficulty, number> = {
  easy: 100,
  medium: 200,
  hard: 350,
  expert: 500,
};

// Time bonus thresholds (seconds)
const TIME_BONUS_THRESHOLDS: Record<Difficulty, { fast: number; good: number; ok: number }> = {
  easy: { fast: 300, good: 600, ok: 900 }, // 5, 10, 15 minutes
  medium: { fast: 600, good: 1200, ok: 1800 }, // 10, 20, 30 minutes
  hard: { fast: 900, good: 1800, ok: 2700 }, // 15, 30, 45 minutes
  expert: { fast: 1200, good: 2400, ok: 3600 }, // 20, 40, 60 minutes
};

// XP multipliers for time performance
const TIME_MULTIPLIERS = {
  fast: 1.5,
  good: 1.2,
  ok: 1.0,
  slow: 0.8,
};

// Penalties
const MISTAKE_PENALTY = 10; // XP per mistake
const HINT_PENALTY = 25; // XP per hint used

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { code: 'beginner', minXP: 0 },
  { code: 'novice', minXP: 500 },
  { code: 'apprentice', minXP: 1000 },
  { code: 'intermediate', minXP: 2000 },
  { code: 'advanced', minXP: 4000 },
  { code: 'expert', minXP: 8000 },
  { code: 'master', minXP: 15000 },
  { code: 'grandmaster', minXP: 25000 },
  { code: 'legend', minXP: 40000 },
];

export function calculateScore(
  difficulty: Difficulty,
  seconds: number,
  mistakes: number,
  hintsUsed: number
): ScoreResult {
  const baseXP = BASE_XP[difficulty];
  const thresholds = TIME_BONUS_THRESHOLDS[difficulty];
  
  // Calculate time bonus
  let timeMultiplier = TIME_MULTIPLIERS.slow;
  if (seconds <= thresholds.fast) {
    timeMultiplier = TIME_MULTIPLIERS.fast;
  } else if (seconds <= thresholds.good) {
    timeMultiplier = TIME_MULTIPLIERS.good;
  } else if (seconds <= thresholds.ok) {
    timeMultiplier = TIME_MULTIPLIERS.ok;
  }
  
  const timeBonus = Math.floor(baseXP * (timeMultiplier - 1));
  
  // Calculate penalties
  const mistakePenalty = mistakes * MISTAKE_PENALTY;
  const hintPenalty = hintsUsed * HINT_PENALTY;
  
  // Calculate final XP
  const xp = Math.max(0, baseXP + timeBonus - mistakePenalty - hintPenalty);
  
  // Calculate score (0-1000 scale)
  const maxPossibleXP = baseXP * TIME_MULTIPLIERS.fast;
  const score = Math.floor((xp / maxPossibleXP) * 1000);
  
  return {
    score,
    xp,
    timeBonus,
    mistakePenalty,
    hintPenalty,
  };
}

export function getLevelFromXP(xp: number): string {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXP) {
      return LEVEL_THRESHOLDS[i].code;
    }
  }
  return 'beginner';
}

export function getXPToNextLevel(xp: number): { nextLevel: string; xpNeeded: number } {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(level => level.code === currentLevel);
  
  if (currentLevelIndex === LEVEL_THRESHOLDS.length - 1) {
    return { nextLevel: 'max', xpNeeded: 0 };
  }
  
  const nextLevel = LEVEL_THRESHOLDS[currentLevelIndex + 1];
  const xpNeeded = nextLevel.minXP - xp;
  
  return { nextLevel: nextLevel.code, xpNeeded };
}

export function getLevelProgress(xp: number): { current: number; next: number; percentage: number } {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(level => level.code === currentLevel);
  
  if (currentLevelIndex === LEVEL_THRESHOLDS.length - 1) {
    return { current: xp, next: xp, percentage: 100 };
  }
  
  const currentThreshold = LEVEL_THRESHOLDS[currentLevelIndex];
  const nextThreshold = LEVEL_THRESHOLDS[currentLevelIndex + 1];
  
  const current = xp - currentThreshold.minXP;
  const next = nextThreshold.minXP - currentThreshold.minXP;
  const percentage = Math.floor((current / next) * 100);
  
  return { current, next, percentage };
}