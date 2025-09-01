import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { finishPlaySchema } from '@/lib/validation';
import { calculateScore } from '@/lib/scoring';
import { updateStreak } from '@/lib/streaks';
import { isComplete } from '@/lib/core-sudoku';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { playId, seconds, mistakes, hintsUsed, finalGrid } = finishPlaySchema.parse(body);
    
    // Get play and puzzle
    const play = await prisma.play.findUnique({
      where: { id: playId },
      include: { puzzle: true },
    });
    
    if (!play) {
      return NextResponse.json(
        { error: 'Play not found' },
        { status: 404 }
      );
    }
    
    if (play.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (play.status === 'completed') {
      return NextResponse.json(
        { error: 'Play already completed' },
        { status: 400 }
      );
    }
    
    // Verify solution
    const puzzle = play.puzzle;
    const solution = puzzle.solution as number[][];
    
    if (!isComplete(finalGrid) || JSON.stringify(finalGrid) !== JSON.stringify(solution)) {
      return NextResponse.json(
        { error: 'Invalid solution' },
        { status: 400 }
      );
    }
    
    // Calculate score
    const scoreResult = calculateScore(
      puzzle.difficulty as any,
      seconds,
      mistakes,
      hintsUsed
    );
    
    // Update play
    const updatedPlay = await prisma.play.update({
      where: { id: playId },
      data: {
        finishedAt: new Date(),
        seconds,
        mistakes,
        hintsUsed,
        status: 'completed',
        score: scoreResult.score,
      },
    });
    
    // Update user XP and level
    const userXP = await prisma.userXP.upsert({
      where: { userId: session.user.id },
      update: {
        xp: { increment: scoreResult.xp },
      },
      create: {
        userId: session.user.id,
        xp: scoreResult.xp,
      },
    });
    
    // Update streak if this is a daily puzzle
    let streakUpdate = null;
    if (puzzle.dateKey) {
      streakUpdate = await updateStreak(session.user.id, new Date());
    }
    
    // Update leaderboard for daily puzzles
    if (puzzle.dateKey) {
      await prisma.leaderboardDaily.upsert({
        where: {
          userId_dateKey: {
            userId: session.user.id,
            dateKey: puzzle.dateKey,
          },
        },
        update: {
          seconds: Math.min(seconds, updatedPlay.seconds),
          mistakes: Math.min(mistakes, updatedPlay.mistakes),
          score: Math.max(scoreResult.score, updatedPlay.score),
        },
        create: {
          userId: session.user.id,
          dateKey: puzzle.dateKey,
          seconds,
          mistakes,
          score: scoreResult.score,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      score: scoreResult.score,
      xp: scoreResult.xp,
      streak: streakUpdate,
      totalXP: userXP.xp,
    });
  } catch (error) {
    console.error('Error finishing play:', error);
    return NextResponse.json(
      { error: 'Failed to finish play' },
      { status: 500 }
    );
  }
}