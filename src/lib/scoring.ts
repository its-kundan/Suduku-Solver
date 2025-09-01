export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface ScoreParams {
  difficulty: Difficulty;
  seconds: number;
  mistakes: number;
  hintsUsed: number;
}

export interface ScoreResult {
  score: number;
  timeBonus: number;
  mistakePenalty: number;
  hintPenalty: number;
  baseScore: number;
}

// Base scores for each difficulty level
const BASE_SCORES: Record<Difficulty, number> = {
  easy: 1000,
  medium: 2000,
  hard: 3500,
  expert: 5000,
};

// Time thresholds for each difficulty (in seconds)
const TIME_THRESHOLDS: Record<Difficulty, number> = {
  easy: 300,    // 5 minutes
  medium: 600,  // 10 minutes
  hard: 1200,   // 20 minutes
  expert: 2400, // 40 minutes
};

// Penalty multipliers
const MISTAKE_PENALTY = 100;
const HINT_PENALTY = 50;

// Anti-cheat thresholds (minimum time for human completion)
const HUMAN_THRESHOLDS: Record<Difficulty, number> = {
  easy: 40,     // 40 seconds minimum
  medium: 60,   // 1 minute minimum
  hard: 90,     // 1.5 minutes minimum
  expert: 120,  // 2 minutes minimum
};

/**
 * Calculate score for a completed puzzle
 */
export function computeScore(params: ScoreParams): ScoreResult {
  const { difficulty, seconds, mistakes, hintPenalty, hintsUsed } = params;
  
  // Anti-cheat check
  if (seconds < HUMAN_THRESHOLDS[difficulty]) {
    throw new Error(`Completion time too fast for ${difficulty} difficulty`);
  }
  
  const baseScore = BASE_SCORES[difficulty];
  
  // Time bonus calculation
  const timeThreshold = TIME_THRESHOLDS[difficulty];
  let timeBonus = 0;
  
  if (seconds <= timeThreshold) {
    // Bonus for completing under threshold
    const timeRatio = seconds / timeThreshold;
    timeBonus = Math.round(baseScore * 0.5 * (1 - timeRatio));
  }
  
  // Penalties
  const mistakePenalty = mistakes * MISTAKE_PENALTY;
  const hintPenalty = hintsUsed * HINT_PENALTY;
  
  // Calculate final score
  const score = Math.max(0, baseScore + timeBonus - mistakePenalty - hintPenalty);
  
  return {
    score,
    timeBonus,
    mistakePenalty,
    hintPenalty,
    baseScore,
  };
}

/**
 * Get score breakdown for display
 */
export function getScoreBreakdown(params: ScoreParams): {
  difficulty: Difficulty;
  baseScore: number;
  timeBonus: number;
  mistakePenalty: number;
  hintPenalty: number;
  finalScore: number;
  grade: string;
} {
  const result = computeScore(params);
  const { difficulty, score } = result;
  
  // Grade calculation
  let grade: string;
  const percentage = score / BASE_SCORES[difficulty];
  
  if (percentage >= 0.9) grade = 'S';
  else if (percentage >= 0.8) grade = 'A';
  else if (percentage >= 0.7) grade = 'B';
  else if (percentage >= 0.6) grade = 'C';
  else if (percentage >= 0.5) grade = 'D';
  else grade = 'F';
  
  return {
    difficulty,
    baseScore: result.baseScore,
    timeBonus: result.timeBonus,
    mistakePenalty: result.mistakePenalty,
    hintPenalty: result.hintPenalty,
    finalScore: score,
    grade,
  };
}

/**
 * Calculate XP based on score and difficulty
 */
export function calculateXP(score: number, difficulty: Difficulty): number {
  const baseXP = Math.floor(score / 100);
  
  // Difficulty multiplier
  const difficultyMultiplier: Record<Difficulty, number> = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 3,
  };
  
  return Math.floor(baseXP * difficultyMultiplier[difficulty]);
}

/**
 * Get level information based on XP
 */
export function getLevelInfo(xp: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  title: string;
} {
  const levels = [
    { level: 1, minXP: 0, title: 'Beginner' },
    { level: 2, minXP: 100, title: 'Novice' },
    { level: 3, minXP: 250, title: 'Apprentice' },
    { level: 4, minXP: 500, title: 'Adept' },
    { level: 5, minXP: 1000, title: 'Expert' },
    { level: 6, minXP: 2000, title: 'Master' },
    { level: 7, minXP: 3500, title: 'Grandmaster' },
    { level: 8, minXP: 5000, title: 'Legend' },
    { level: 9, minXP: 10000, title: 'Mythic' },
  ];
  
  // Find current level
  let currentLevel = levels[0];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) {
      currentLevel = levels[i];
      break;
    }
  }
  
  // Find next level
  const nextLevel = levels.find(l => l.level === currentLevel.level + 1);
  const nextLevelXP = nextLevel?.minXP || currentLevel.minXP;
  
  // Calculate progress to next level
  const levelRange = nextLevelXP - currentLevel.minXP;
  const progressInLevel = xp - currentLevel.minXP;
  const progress = levelRange > 0 ? (progressInLevel / levelRange) * 100 : 100;
  
  return {
    level: currentLevel.level,
    currentLevelXP: currentLevel.minXP,
    nextLevelXP: nextLevelXP,
    progress: Math.min(100, Math.max(0, progress)),
    title: currentLevel.title,
  };
}

/**
 * Check if a score qualifies for a new record
 */
export function isNewRecord(
  currentScore: number,
  previousBest: number | null,
  difficulty: Difficulty
): boolean {
  if (!previousBest) return true;
  
  // For daily puzzles, higher score is better
  if (currentScore > previousBest) return true;
  
  // For practice puzzles, also consider time if scores are equal
  return currentScore === previousBest;
}