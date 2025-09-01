import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';
import { LeaderboardQuerySchema, LeaderboardResponseSchema } from '@/lib/schemas';
import { checkRateLimitOrThrow, getRateLimitHeaders } from '@/lib/ratelimit';
import { dateKeyIST, startOfWeekIST, endOfWeekIST } from '@/lib/time';

export const dynamic = 'force-dynamic';
export const revalidate = 15; // Cache for 15 seconds

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = await checkRateLimitOrThrow('LEADERBOARD', clientIP);
    
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const query = {
      scope: searchParams.get('scope') || 'daily',
      date: searchParams.get('date'),
      difficulty: searchParams.get('difficulty'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };
    
    const validatedQuery = LeaderboardQuerySchema.parse(query);
    const { scope, date, difficulty, limit } = validatedQuery;
    
    // Get current user ID for pinning
    const currentUserId = await getCurrentUserId();
    
    let entries: any[] = [];
    let total = 0;
    let userRank: number | null = null;
    
    if (scope === 'daily') {
      // Daily leaderboard
      const dateKey = date || dateKeyIST();
      
      const whereClause: any = { dateKey };
      if (difficulty) {
        whereClause.puzzle = { difficulty };
      }
      
      // Get daily entries
      const dailyEntries = await prisma.leaderboardDaily.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: [
          { score: 'desc' },
          { seconds: 'asc' },
          { mistakes: 'asc' },
        ],
        take: limit,
      });
      
      // Get user's streak for each entry
      const userIds = dailyEntries.map(entry => entry.userId);
      const streaks = await prisma.streak.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, currentCount: true },
      });
      
      const streakMap = new Map(streaks.map(s => [s.userId, s.currentCount]));
      
      entries = dailyEntries.map((entry, index) => ({
        rank: index + 1,
        userId: entry.user.id,
        username: entry.user.name || 'Anonymous',
        avatar: entry.user.image,
        score: entry.score,
        time: entry.seconds,
        mistakes: entry.mistakes,
        hintsUsed: 0, // Not stored in daily leaderboard
        streak: streakMap.get(entry.userId) || 0,
        isCurrentUser: entry.userId === currentUserId,
      }));
      
      total = await prisma.leaderboardDaily.count({ where: whereClause });
      
      // Find user's rank if they're not in top entries
      if (currentUserId && !entries.find(e => e.userId === currentUserId)) {
        const userEntry = await prisma.leaderboardDaily.findFirst({
          where: { userId: currentUserId, ...whereClause },
        });
        
        if (userEntry) {
          const userRankCount = await prisma.leaderboardDaily.count({
            where: {
              ...whereClause,
              OR: [
                { score: { gt: userEntry.score } },
                {
                  score: userEntry.score,
                  seconds: { lt: userEntry.seconds },
                },
                {
                  score: userEntry.score,
                  seconds: userEntry.seconds,
                  mistakes: { lt: userEntry.mistakes },
                },
              ],
            },
          });
          userRank = userRankCount + 1;
        }
      }
      
    } else if (scope === 'weekly') {
      // Weekly leaderboard (last 7 days)
      const weekStart = startOfWeekIST();
      const weekEnd = endOfWeekIST();
      
      const whereClause: any = {
        dateKey: {
          gte: dateKeyIST(weekStart),
          lte: dateKeyIST(weekEnd),
        },
      };
      if (difficulty) {
        whereClause.puzzle = { difficulty };
      }
      
      // Get best daily score per user for the week
      const weeklyEntries = await prisma.leaderboardDaily.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: [
          { score: 'desc' },
          { seconds: 'asc' },
          { mistakes: 'asc' },
        ],
        take: limit,
      });
      
      // Get user streaks
      const userIds = weeklyEntries.map(entry => entry.userId);
      const streaks = await prisma.streak.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, currentCount: true },
      });
      
      const streakMap = new Map(streaks.map(s => [s.userId, s.currentCount]));
      
      entries = weeklyEntries.map((entry, index) => ({
        rank: index + 1,
        userId: entry.user.id,
        username: entry.user.name || 'Anonymous',
        avatar: entry.user.image,
        score: entry.score,
        time: entry.seconds,
        mistakes: entry.mistakes,
        hintsUsed: 0,
        streak: streakMap.get(entry.userId) || 0,
        isCurrentUser: entry.userId === currentUserId,
      }));
      
      total = await prisma.leaderboardDaily.count({ where: whereClause });
      
    } else if (scope === 'all') {
      // All-time leaderboard
      const whereClause: any = {};
      if (difficulty) {
        whereClause.puzzle = { difficulty };
      }
      
      // Get best scores per user
      const allTimeEntries = await prisma.play.findMany({
        where: {
          ...whereClause,
          status: 'completed',
          finishedAt: { not: null },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          puzzle: {
            select: {
              difficulty: true,
            },
          },
        },
        orderBy: [
          { score: 'desc' },
          { seconds: 'asc' },
          { mistakes: 'asc' },
        ],
        take: limit,
      });
      
      // Get user streaks
      const userIds = allTimeEntries.map(entry => entry.user.id);
      const streaks = await prisma.streak.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, currentCount: true },
      });
      
      const streakMap = new Map(streaks.map(s => [s.userId, s.currentCount]));
      
      entries = allTimeEntries.map((entry, index) => ({
        rank: index + 1,
        userId: entry.user.id,
        username: entry.user.name || 'Anonymous',
        avatar: entry.user.image,
        score: entry.score,
        time: entry.seconds,
        mistakes: entry.mistakes,
        hintsUsed: entry.hintsUsed,
        streak: streakMap.get(entry.userId) || 0,
        isCurrentUser: entry.userId === currentUserId,
      }));
      
      total = await prisma.play.count({
        where: {
          ...whereClause,
          status: 'completed',
          finishedAt: { not: null },
        },
      });
    }
    
    // Pin current user's entry if they're not in top entries
    if (currentUserId && !entries.find(e => e.userId === currentUserId)) {
      // Get user's best entry for this scope
      let userBestEntry: any = null;
      
      if (scope === 'daily') {
        const dateKey = date || dateKeyIST();
        userBestEntry = await prisma.leaderboardDaily.findFirst({
          where: {
            userId: currentUserId,
            dateKey,
            ...(difficulty && { puzzle: { difficulty } }),
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });
      } else if (scope === 'weekly') {
        const weekStart = startOfWeekIST();
        const weekEnd = endOfWeekIST();
        userBestEntry = await prisma.leaderboardDaily.findFirst({
          where: {
            userId: currentUserId,
            dateKey: {
              gte: dateKeyIST(weekStart),
              lte: dateKeyIST(weekEnd),
            },
            ...(difficulty && { puzzle: { difficulty } }),
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });
      } else if (scope === 'all') {
        userBestEntry = await prisma.play.findFirst({
          where: {
            userId: currentUserId,
            status: 'completed',
            finishedAt: { not: null },
            ...(difficulty && { puzzle: { difficulty } }),
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            puzzle: {
              select: {
                difficulty: true,
              },
            },
          },
          orderBy: [
            { score: 'desc' },
            { seconds: 'asc' },
            { mistakes: 'asc' },
          ],
        });
      }
      
      if (userBestEntry) {
        const userStreak = await prisma.streak.findUnique({
          where: { userId: currentUserId },
          select: { currentCount: true },
        });
        
        const userEntry = {
          rank: userRank || 0,
          userId: userBestEntry.user.id,
          username: userBestEntry.user.name || 'Anonymous',
          avatar: userBestEntry.user.image,
          score: userBestEntry.score,
          time: userBestEntry.seconds,
          mistakes: userBestEntry.mistakes,
          hintsUsed: userBestEntry.hintsUsed || 0,
          streak: userStreak?.currentCount || 0,
          isCurrentUser: true,
        };
        
        entries.push(userEntry);
      }
    }
    
    // Validate response with Zod
    const response = {
      entries,
      total,
      userRank,
      scope,
      date: date || undefined,
      difficulty: difficulty || undefined,
    };
    
    const validatedResponse = LeaderboardResponseSchema.parse(response);
    
    // Return response with rate limit headers
    return NextResponse.json(validatedResponse, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: error.message } },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch leaderboard' } },
      { status: 500 }
    );
  }
}
