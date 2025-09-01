import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { FinishPlaySchema } from '@/lib/schemas';
import { checkRateLimitOrThrow, getRateLimitHeaders } from '@/lib/ratelimit';
import { computeScore, calculateXP } from '@/lib/scoring';
import { updateStreakOnFinish } from '@/lib/streaks';
import { dateKeyIST, isTodayIST } from '@/lib/time';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = await checkRateLimitOrThrow('GAME_COMPLETION', clientIP);
    
    // Authentication required
    const { userId } = await requireAuth();
    
    // Parse and validate request body
    const body = await request.json();
    const { playId, seconds, mistakes, hintsUsed, finalGrid } = FinishPlaySchema.parse(body);
    
    // Get play session and verify ownership
    const play = await prisma.play.findUnique({
      where: { id: playId },
      include: {
        puzzle: true,
      },
    });
    
    if (!play) {
      return NextResponse.json(
        { error: { code: 'PLAY_NOT_FOUND', message: 'Play session not found' } },
        { status: 404 }
      );
    }
    
    if (play.userId !== userId) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 }
      );
    }
    
    if (play.status === 'completed') {
      return NextResponse.json(
        { error: { code: 'ALREADY_COMPLETED', message: 'Puzzle already completed' } },
        { status: 400 }
      );
    }
    
    // Verify solution is correct
    const puzzle = play.puzzle;
    if (!puzzle.solution || !Array.isArray(puzzle.solution)) {
      return NextResponse.json(
        { error: { code: 'INVALID_PUZZLE', message: 'Invalid puzzle data' } },
        { status: 500 }
      );
    }
    
    // Check if final grid matches solution
    const solution = puzzle.solution as number[][];
    const isCorrect = finalGrid.every((row, rowIndex) =>
      row.every((cell, colIndex) => cell === solution[rowIndex][colIndex])
    );
    
    if (!isCorrect) {
      return NextResponse.json(
        { error: { code: 'INCORRECT_SOLUTION', message: 'Solution is incorrect' } },
        { status: 400 }
      );
    }
    
    // Calculate score
    const scoreResult = computeScore({
      difficulty: puzzle.difficulty as any,
      seconds,
      mistakes,
      hintsUsed,
    });
    
    // Calculate XP
    const xpEarned = calculateXP(scoreResult.score, puzzle.difficulty as any);
    
    // Update play session
    const updatedPlay = await prisma.play.update({
      where: { id: playId },
      data: {
        status: 'completed',
        finishedAt: new Date(),
        seconds,
        mistakes,
        hintsUsed,
        score: scoreResult.score,
      },
    });
    
    // Update user XP
    await prisma.userXP.upsert({
      where: { userId },
      update: {
        xp: {
          increment: xpEarned,
        },
      },
      create: {
        userId,
        xp: xpEarned,
        levelCode: 'beginner',
      },
    });
    
    // Update streak if this is a daily puzzle completed today
    let streakUpdate = null;
    if (puzzle.dateKey && isTodayIST(new Date())) {
      streakUpdate = await updateStreakOnFinish(userId);
    }
    
    // Update leaderboard if this is a daily puzzle
    let leaderboardEntry = null;
    if (puzzle.dateKey) {
      leaderboardEntry = await prisma.leaderboardDaily.upsert({
        where: {
          userId_dateKey: {
            userId,
            dateKey: puzzle.dateKey,
          },
        },
        update: {
          seconds: Math.min(seconds, leaderboardEntry?.seconds || seconds),
          mistakes: Math.min(mistakes, leaderboardEntry?.mistakes || mistakes),
          score: Math.max(scoreResult.score, leaderboardEntry?.score || 0),
        },
        create: {
          userId,
          dateKey: puzzle.dateKey,
          seconds,
          mistakes,
          score: scoreResult.score,
        },
      });
    }
    
    // Return completion result
    return NextResponse.json({
      playId: updatedPlay.id,
      score: scoreResult.score,
      xpEarned,
      scoreBreakdown: {
        baseScore: scoreResult.baseScore,
        timeBonus: scoreResult.timeBonus,
        mistakePenalty: scoreResult.mistakePenalty,
        hintPenalty: scoreResult.hintPenalty,
      },
      streak: streakUpdate,
      leaderboard: leaderboardEntry ? {
        rank: 0, // Will be calculated separately
        score: leaderboardEntry.score,
        time: leaderboardEntry.seconds,
        mistakes: leaderboardEntry.mistakes,
      } : null,
    }, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
    
  } catch (error) {
    console.error('Error finishing play:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: error.message } },
        { status: 429 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Completion time too fast')) {
      return NextResponse.json(
        { error: { code: 'ANTI_CHEAT', message: error.message } },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Play session not found')) {
      return NextResponse.json(
        { error: { code: 'PLAY_NOT_FOUND', message: 'Play session not found' } },
        { status: 404 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Puzzle already completed')) {
      return NextResponse.json(
        { error: { code: 'ALREADY_COMPLETED', message: 'Puzzle already completed' } },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Solution is incorrect')) {
      return NextResponse.json(
        { error: { code: 'INCORRECT_SOLUTION', message: 'Solution is incorrect' } },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to finish play' } },
      { status: 500 }
    );
  }
}