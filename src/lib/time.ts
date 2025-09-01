import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const IST_TZ = process.env.IST_TZ || 'Asia/Kolkata';

/**
 * Get current time in IST
 */
export function nowIST(): Date {
  return dayjs().tz(IST_TZ).toDate();
}

/**
 * Get date key in IST (YYYY-MM-DD format)
 */
export function dateKeyIST(date: Date = new Date()): string {
  return dayjs(date).tz(IST_TZ).format('YYYY-MM-DD');
}

/**
 * Get today's difficulty pattern
 * Rotates through difficulties in a predictable pattern
 */
export function todayDifficultyPattern(): 'easy' | 'medium' | 'hard' | 'expert' {
  const today = dayjs().tz(IST_TZ);
  const dayOfYear = today.date();
  
  // Pattern: easy -> medium -> hard -> expert -> repeat
  const difficulties: Array<'easy' | 'medium' | 'hard' | 'expert'> = ['easy', 'medium', 'hard', 'expert'];
  return difficulties[dayOfYear % 4];
}

/**
 * Check if a date is today in IST
 */
export function isTodayIST(date: Date): boolean {
  const today = dayjs().tz(IST_TZ).format('YYYY-MM-DD');
  const checkDate = dayjs(date).tz(IST_TZ).format('YYYY-MM-DD');
  return today === checkDate;
}

/**
 * Get start of day in IST
 */
export function startOfDayIST(date: Date = new Date()): Date {
  return dayjs(date).tz(IST_TZ).startOf('day').toDate();
}

/**
 * Get end of day in IST
 */
export function endOfDayIST(date: Date = new Date()): Date {
  return dayjs(date).tz(IST_TZ).endOf('day').toDate();
}

/**
 * Get start of week in IST (Monday)
 */
export function startOfWeekIST(date: Date = new Date()): Date {
  return dayjs(date).tz(IST_TZ).startOf('week').toDate();
}

/**
 * Get end of week in IST (Sunday)
 */
export function endOfWeekIST(date: Date = new Date()): Date {
  return dayjs(date).tz(IST_TZ).endOf('week').toDate();
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse time from MM:SS format
 */
export function parseTime(timeString: string): number {
  const [mins, secs] = timeString.split(':').map(Number);
  return (mins * 60) + (secs || 0);
}

/**
 * Get human-readable time ago
 */
export function timeAgo(date: Date): string {
  const now = nowIST();
  const diff = dayjs(now).diff(dayjs(date), 'minute');
  
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff} minute${diff === 1 ? '' : 's'} ago`;
  
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}
