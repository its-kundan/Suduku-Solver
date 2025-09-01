import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { PlayStartSchema } from '@/lib/schemas';
import { checkRateLimitOrThrow, getRateLimitHeaders } from '@/lib/ratelimit';

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
    const { puzzleId } = PlayStartSchema.parse(body);
    
    // Verify puzzle exists
    const puzzle = await prisma.puzzle.findUnique({
      where: { id: puzzleId },
      select: { id: true, difficulty: true },
    });
    
    if (!puzzle) {
      return NextResponse.json(
        { error: { code: 'PUZZLE_NOT_FOUND', message: 'Puzzle not found' } },
        { status: 404 }
      );
    }
    
    // Check if play session already exists
    let play = await prisma.play.findUnique({
      where: {
        userId_puzzleId: {
          userId,
          puzzleId,
        },
      },
    });
    
    if (play) {
      // Update existing session if it was abandoned
      if (play.status === 'abandoned') {
        play = await prisma.play.update({
          where: { id: play.id },
          data: {
            status: 'in_progress',
            startedAt: new Date(),
            finishedAt: null,
            seconds: 0,
            mistakes: 0,
            hintsUsed: 0,
            score: 0,
          },
        });
      }
    } else {
      // Create new play session
      play = await prisma.play.create({
        data: {
          userId,
          puzzleId,
          status: 'in_progress',
          startedAt: new Date(),
        },
      });
    }
    
    // Return play session info
    return NextResponse.json({
      playId: play.id,
      status: play.status,
      startedAt: play.startedAt,
      puzzle: {
        id: puzzle.id,
        difficulty: puzzle.difficulty,
      },
    }, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
    
  } catch (error) {
    console.error('Error starting play session:', error);
    
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
    
    if (error instanceof Error && error.message.includes('Puzzle not found')) {
      return NextResponse.json(
        { error: { code: 'PUZZLE_NOT_FOUND', message: 'Puzzle not found' } },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to start play session' } },
      { status: 500 }
    );
  }
}