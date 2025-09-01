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

export function formatScore(score: number): string {
  return score.toString().padStart(3, '0');
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-green-500';
    case 'medium': return 'text-yellow-500';
    case 'hard': return 'text-orange-500';
    case 'expert': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

export function getDifficultyBgColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'bg-green-500/10 border-green-500/20';
    case 'medium': return 'bg-yellow-500/10 border-yellow-500/20';
    case 'hard': return 'bg-orange-500/10 border-orange-500/20';
    case 'expert': return 'bg-red-500/10 border-red-500/20';
    default: return 'bg-gray-500/10 border-gray-500/20';
  }
}

export function getLevelColor(level: string): string {
  switch (level) {
    case 'beginner': return 'text-gray-400';
    case 'novice': return 'text-green-400';
    case 'apprentice': return 'text-blue-400';
    case 'intermediate': return 'text-purple-400';
    case 'advanced': return 'text-orange-400';
    case 'expert': return 'text-red-400';
    case 'master': return 'text-pink-400';
    case 'grandmaster': return 'text-yellow-400';
    case 'legend': return 'text-cyan-400';
    default: return 'text-gray-400';
  }
}