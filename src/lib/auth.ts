import { NextAuthOptions, getServerSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Email provider (magic link) - only if EMAIL_SERVER is configured
    ...(process.env.EMAIL_SERVER ? [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM || 'noreply@sudoku.app',
      })
    ] : []),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow all sign-ins for now
      // You can add custom logic here (e.g., domain restrictions)
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async createUser({ user }) {
      // Create initial user records when they first sign up
      await Promise.all([
        // Create streak record
        prisma.streak.create({
          data: {
            userId: user.id,
            currentCount: 0,
            longestCount: 0,
          },
        }),
        // Create XP record
        prisma.userXP.create({
          data: {
            userId: user.id,
            xp: 0,
            levelCode: 'beginner',
          },
        }),
      ]);
    },
  },
};

/**
 * Get server-side session
 */
export function getSession() {
  return getServerSession(authOptions);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id || null;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session?.user?.id) return false;
  
  const admin = await prisma.admin.findUnique({
    where: { userId: session.user.id },
  });
  
  return !!admin;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<{ user: any; userId: string }> {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Authentication required');
  }
  
  return {
    user: session.user,
    userId: session.user.id,
  };
}

/**
 * Require admin access - throws error if not admin
 */
export async function requireAdmin(): Promise<{ user: any; userId: string }> {
  const { user, userId } = await requireAuth();
  
  const admin = await prisma.admin.findUnique({
    where: { userId },
  });
  
  if (!admin) {
    throw new Error('Admin access required');
  }
  
  return { user, userId };
}

/**
 * Get user profile with all related data
 */
export async function getUserProfile(userId: string) {
  const [user, streak, userXP, achievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    }),
    prisma.streak.findUnique({
      where: { userId },
    }),
    prisma.userXP.findUnique({
      where: { userId },
      include: {
        level: true,
      },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
      take: 10,
    }),
  ]);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Get recent plays
  const recentPlays = await prisma.play.findMany({
    where: {
      userId,
      status: 'completed',
      finishedAt: { not: null },
    },
    select: {
      id: true,
      puzzleId: true,
      score: true,
      seconds: true,
      finishedAt: true,
      puzzle: {
        select: {
          difficulty: true,
        },
      },
    },
    orderBy: { finishedAt: 'desc' },
    take: 10,
  });
  
  // Calculate level info
  const currentXP = userXP?.xp || 0;
  const levelInfo = getLevelInfo(currentXP);
  
  return {
    ...user,
    streak: {
      currentCount: streak?.currentCount || 0,
      longestCount: streak?.longestCount || 0,
      lastPlayedIST: streak?.lastPlayedIST || null,
      canPlayToday: true, // This will be calculated separately if needed
    },
    xp: {
      current: currentXP,
      level: levelInfo.level,
      title: levelInfo.title,
      progress: levelInfo.progress,
      nextLevelXP: levelInfo.nextLevelXP,
    },
    achievements: achievements.map(ua => ({
      id: ua.id,
      title: ua.achievement.title,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      earnedAt: ua.earnedAt,
    })),
    recentPlays: recentPlays.map(play => ({
      id: play.id,
      puzzleId: play.puzzleId,
      difficulty: play.puzzle.difficulty,
      score: play.score,
      seconds: play.seconds,
      finishedAt: play.finishedAt!,
    })),
  };
}

/**
 * Helper function to get level info (moved from scoring.ts to avoid circular imports)
 */
function getLevelInfo(xp: number) {
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