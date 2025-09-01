import { prisma } from './db';

// IST timezone offset (UTC+5:30)
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

export function getISTDate(date: Date = new Date()): Date {
  return new Date(date.getTime() + IST_OFFSET);
}

export function getISTDateString(date: Date = new Date()): string {
  const istDate = getISTDate(date);
  return istDate.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function isSameISTDay(date1: Date, date2: Date): boolean {
  const istDate1 = getISTDateString(date1);
  const istDate2 = getISTDateString(date2);
  return istDate1 === istDate2;
}

export function isYesterdayIST(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameISTDay(date, yesterday);
}

export async function updateStreak(userId: string, completedAt: Date): Promise<{
  currentCount: number;
  longestCount: number;
  isNewRecord: boolean;
}> {
  const istCompletedAt = getISTDate(completedAt);
  const todayIST = getISTDateString();
  
  // Get current streak
  let streak = await prisma.streak.findUnique({
    where: { userId },
  });
  
  if (!streak) {
    // Create new streak
    streak = await prisma.streak.create({
      data: {
        userId,
        currentCount: 1,
        longestCount: 1,
        lastPlayedIST: istCompletedAt,
      },
    });
    return {
      currentCount: 1,
      longestCount: 1,
      isNewRecord: false,
    };
  }
  
  const lastPlayedIST = streak.lastPlayedIST ? getISTDate(streak.lastPlayedIST) : null;
  
  if (!lastPlayedIST) {
    // First completion
    const updatedStreak = await prisma.streak.update({
      where: { userId },
      data: {
        currentCount: 1,
        longestCount: Math.max(1, streak.longestCount),
        lastPlayedIST: istCompletedAt,
      },
    });
    return {
      currentCount: 1,
      longestCount: updatedStreak.longestCount,
      isNewRecord: updatedStreak.longestCount > streak.longestCount,
    };
  }
  
  const lastPlayedDate = getISTDateString(lastPlayedIST);
  
  if (lastPlayedDate === todayIST) {
    // Already completed today, don't update streak
    return {
      currentCount: streak.currentCount,
      longestCount: streak.longestCount,
      isNewRecord: false,
    };
  }
  
  if (isYesterdayIST(lastPlayedIST)) {
    // Consecutive day - increment streak
    const newCurrentCount = streak.currentCount + 1;
    const newLongestCount = Math.max(newCurrentCount, streak.longestCount);
    
    const updatedStreak = await prisma.streak.update({
      where: { userId },
      data: {
        currentCount: newCurrentCount,
        longestCount: newLongestCount,
        lastPlayedIST: istCompletedAt,
      },
    });
    
    return {
      currentCount: newCurrentCount,
      longestCount: newLongestCount,
      isNewRecord: newLongestCount > streak.longestCount,
    };
  } else {
    // Streak broken - reset to 1
    const updatedStreak = await prisma.streak.update({
      where: { userId },
      data: {
        currentCount: 1,
        longestCount: Math.max(1, streak.longestCount),
        lastPlayedIST: istCompletedAt,
      },
    });
    
    return {
      currentCount: 1,
      longestCount: updatedStreak.longestCount,
      isNewRecord: false,
    };
  }
}

export async function getStreakInfo(userId: string): Promise<{
  currentCount: number;
  longestCount: number;
  lastPlayedDate: string | null;
}> {
  const streak = await prisma.streak.findUnique({
    where: { userId },
  });
  
  if (!streak) {
    return {
      currentCount: 0,
      longestCount: 0,
      lastPlayedDate: null,
    };
  }
  
  return {
    currentCount: streak.currentCount,
    longestCount: streak.longestCount,
    lastPlayedDate: streak.lastPlayedIST ? getISTDateString(streak.lastPlayedIST) : null,
  };
}

export function getStreakEmoji(count: number): string {
  if (count === 0) return '🔥';
  if (count < 3) return '🔥';
  if (count < 7) return '🔥🔥';
  if (count < 14) return '🔥🔥🔥';
  if (count < 30) return '🔥🔥🔥🔥';
  return '🔥🔥🔥🔥🔥';
}

export function getStreakMessage(count: number): string {
  if (count === 0) return 'Start your streak today!';
  if (count === 1) return 'Great start! Keep it going!';
  if (count < 3) return `${count} day streak!`;
  if (count < 7) return `${count} day streak! You\'re on fire!`;
  if (count < 14) return `${count} day streak! Unstoppable!`;
  if (count < 30) return `${count} day streak! Legendary!`;
  return `${count} day streak! You\'re a Sudoku master!`;
}