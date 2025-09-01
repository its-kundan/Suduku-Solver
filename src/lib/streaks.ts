import { prisma } from './db';
import { nowIST, dateKeyIST, isTodayIST } from './time';

export interface StreakUpdateResult {
  currentCount: number;
  longestCount: number;
  isNewRecord: boolean;
  streakBroken: boolean;
  message: string;
}

/**
 * Update user's streak when they complete a puzzle
 */
export async function updateStreakOnFinish(
  userId: string,
  finishedDate: Date = new Date()
): Promise<StreakUpdateResult> {
  const finishedDateIST = dateKeyIST(finishedDate);
  const todayIST = dateKeyIST(nowIST());
  
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
        lastPlayedIST: finishedDateIST,
      },
    });
    
    return {
      currentCount: 1,
      longestCount: 1,
      isNewRecord: false,
      streakBroken: false,
      message: 'Streak started! 🔥',
    };
  }
  
  const lastPlayedDate = streak.lastPlayedIST;
  let newCurrentCount = streak.currentCount;
  let newLongestCount = streak.longestCount;
  let isNewRecord = false;
  let streakBroken = false;
  let message = '';
  
  if (lastPlayedDate) {
    const lastPlayed = new Date(lastPlayedDate);
    const daysDifference = Math.floor(
      (finishedDate.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDifference === 1) {
      // Consecutive day - increment streak
      newCurrentCount++;
      message = `Streak continues! 🔥 Day ${newCurrentCount}`;
      
      // Check if this is a new longest streak
      if (newCurrentCount > streak.longestCount) {
        newLongestCount = newCurrentCount;
        isNewRecord = true;
        message = `New record! 🔥🔥🔥 ${newCurrentCount} day streak!`;
      }
    } else if (daysDifference === 0) {
      // Same day - no change to streak
      message = 'Already completed today! ✅';
    } else if (daysDifference > 1) {
      // Streak broken - reset to 1
      newCurrentCount = 1;
      streakBroken = true;
      message = 'Streak broken! Starting over... 🔥';
    }
  } else {
    // First time playing - start streak
    newCurrentCount = 1;
    message = 'Streak started! 🔥';
  }
  
  // Update streak in database
  const updatedStreak = await prisma.streak.update({
    where: { userId },
    data: {
      currentCount: newCurrentCount,
      longestCount: newLongestCount,
      lastPlayedIST: finishedDateIST,
    },
  });
  
  return {
    currentCount: updatedStreak.currentCount,
    longestCount: updatedStreak.longestCount,
    isNewRecord,
    streakBroken,
    message,
  };
}

/**
 * Get user's current streak information
 */
export async function getUserStreak(userId: string) {
  const streak = await prisma.streak.findUnique({
    where: { userId },
  });
  
  if (!streak) {
    return {
      currentCount: 0,
      longestCount: 0,
      lastPlayedIST: null,
      canPlayToday: true,
    };
  }
  
  const canPlayToday = !streak.lastPlayedIST || !isTodayIST(new Date(streak.lastPlayedIST));
  
  return {
    currentCount: streak.currentCount,
    longestCount: streak.longestCount,
    lastPlayedIST: streak.lastPlayedIST,
    canPlayToday,
  };
}

/**
 * Get streak statistics for a user
 */
export async function getStreakStats(userId: string) {
  const streak = await getUserStreak(userId);
  
  // Get recent completion dates
  const recentPlays = await prisma.play.findMany({
    where: {
      userId,
      status: 'completed',
      finishedAt: { not: null },
    },
    select: {
      finishedAt: true,
      puzzle: {
        select: {
          dateKey: true,
          difficulty: true,
        },
      },
    },
    orderBy: {
      finishedAt: 'desc',
    },
    take: 30, // Last 30 completions
  });
  
  // Calculate streak milestones
  const milestones = [1, 3, 7, 14, 30, 60, 100, 365];
  const achievedMilestones = milestones.filter(m => streak.longestCount >= m);
  const nextMilestone = milestones.find(m => m > streak.currentCount) || null;
  
  // Calculate average daily completions
  const totalCompletions = recentPlays.length;
  const daysSinceFirst = streak.lastPlayedIST 
    ? Math.ceil((Date.now() - new Date(streak.lastPlayedIST).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const averagePerDay = daysSinceFirst > 0 ? totalCompletions / daysSinceFirst : 0;
  
  return {
    ...streak,
    recentPlays,
    achievedMilestones,
    nextMilestone,
    totalCompletions,
    averagePerDay: Math.round(averagePerDay * 100) / 100,
  };
}

/**
 * Get global streak leaderboard
 */
export async function getStreakLeaderboard(limit: number = 50) {
  const topStreaks = await prisma.streak.findMany({
    select: {
      currentCount: true,
      longestCount: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [
      { currentCount: 'desc' },
      { longestCount: 'desc' },
    ],
    take: limit,
  });
  
  return topStreaks.map((streak, index) => ({
    rank: index + 1,
    userId: streak.user.id,
    username: streak.user.name || 'Anonymous',
    avatar: streak.user.image,
    currentStreak: streak.currentCount,
    longestStreak: streak.longestCount,
  }));
}

/**
 * Check if user can maintain streak today
 */
export async function canMaintainStreakToday(userId: string): Promise<boolean> {
  const streak = await getUserStreak(userId);
  return streak.canPlayToday;
}

/**
 * Get streak motivation message
 */
export function getStreakMotivation(currentStreak: number): string {
  if (currentStreak === 0) {
    return "Start your streak today! 🔥";
  } else if (currentStreak === 1) {
    return "Great start! Keep it going! 🔥";
  } else if (currentStreak < 7) {
    return `${currentStreak} days strong! You're building momentum! 🔥`;
  } else if (currentStreak < 30) {
    return `${currentStreak} days! You're on fire! 🔥🔥`;
  } else if (currentStreak < 100) {
    return `${currentStreak} days! You're unstoppable! 🔥🔥🔥`;
  } else {
    return `${currentStreak} days! You're a legend! 🔥🔥🔥🔥`;
  }
}

/**
 * Get streak achievements
 */
export function getStreakAchievements(currentStreak: number): Array<{
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress: number;
  target: number;
}> {
  const achievements = [
    { id: 'first-day', title: 'First Day', description: 'Complete your first puzzle', icon: '🔥', target: 1 },
    { id: 'three-day', title: 'Getting Started', description: 'Maintain a 3-day streak', icon: '🔥🔥', target: 3 },
    { id: 'week', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥🔥🔥', target: 7 },
    { id: 'fortnight', title: 'Fortnight Fighter', description: 'Maintain a 14-day streak', icon: '🔥🔥🔥🔥', target: 14 },
    { id: 'month', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', target: 30 },
    { id: 'quarter', title: 'Quarter Champion', description: 'Maintain a 90-day streak', icon: '👑👑', target: 90 },
    { id: 'century', title: 'Century Club', description: 'Maintain a 100-day streak', icon: '👑👑👑', target: 100 },
    { id: 'year', title: 'Year Warrior', description: 'Maintain a 365-day streak', icon: '🌟', target: 365 },
  ];
  
  return achievements.map(achievement => ({
    ...achievement,
    achieved: currentStreak >= achievement.target,
    progress: Math.min(100, (currentStreak / achievement.target) * 100),
  }));
}