import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getISTDate(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function calculateXP(
  difficulty: string,
  seconds: number,
  mistakes: number,
  hintsUsed: number
): number {
  const baseXP = {
    easy: 100,
    medium: 200,
    hard: 350,
    expert: 500
  }[difficulty] || 100;

  const timeBonus = Math.max(0, 300 - seconds) * 2; // Bonus for fast completion
  const mistakePenalty = mistakes * 10;
  const hintPenalty = hintsUsed * 20;

  return Math.max(0, baseXP + timeBonus - mistakePenalty - hintPenalty);
}

export function getLevelFromXP(xp: number): { level: string; progress: number } {
  const levels = [
    { code: 'beginner', minXP: 0 },
    { code: 'novice', minXP: 500 },
    { code: 'apprentice', minXP: 1000 },
    { code: 'skilled', minXP: 2000 },
    { code: 'expert', minXP: 4000 },
    { code: 'master', minXP: 8000 },
    { code: 'grandmaster', minXP: 15000 },
    { code: 'legend', minXP: 25000 }
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = 0; i < levels.length - 1; i++) {
    if (xp >= levels[i].minXP && xp < levels[i + 1].minXP) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1];
      break;
    }
  }

  if (xp >= levels[levels.length - 1].minXP) {
    currentLevel = levels[levels.length - 1];
    nextLevel = levels[levels.length - 1];
  }

  const progress = nextLevel.minXP > currentLevel.minXP 
    ? ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 100;

  return {
    level: currentLevel.code,
    progress: Math.min(100, Math.max(0, progress))
  };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateDailySeed(date: string, difficulty: string): string {
  return `SUDOKU:${date}:${difficulty}`;
}