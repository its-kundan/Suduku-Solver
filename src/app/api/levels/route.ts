import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { LevelsCreateSchema, PuzzleResponseSchema } from '@/lib/schemas';
import { checkRateLimitOrThrow, getRateLimitHeaders } from '@/lib/ratelimit';
import { generateFromSeed } from '@/lib/core-sudoku';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (more restrictive for puzzle generation)
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = await checkRateLimitOrThrow('PUZZLE_GENERATION', clientIP);
    
    // Authentication required
    const { userId } = await requireAuth();
    
    // Parse and validate request body
    const body = await request.json();
    const { difficulty } = LevelsCreateSchema.parse(body);
    
    // Generate unique seed for this puzzle
    const timestamp = Date.now();
    const randomSeed = Math.random().toString(36).substring(2);
    const seed = `PRACTICE:${userId}:${timestamp}:${randomSeed}`;
    
    // Generate puzzle
    const result = generateFromSeed(seed, difficulty);
    
    // Ensure the puzzle has a valid solution
    if (!result.solution || !Array.isArray(result.solution)) {
      throw new Error('Failed to generate valid puzzle');
    }
    
    // Create puzzle record (no dateKey for practice puzzles)
    const puzzle = await prisma.puzzle.create({
      data: {
        dateKey: null, // Practice puzzles don't have a date
        difficulty,
        seed,
        puzzle: result.puzzle,
        solution: result.solution,
      },
    });
    
    // Validate response with Zod
    const response = {
      puzzleId: puzzle.id,
      puzzle: puzzle.puzzle,
      difficulty: puzzle.difficulty,
      dateKey: puzzle.dateKey,
    };
    
    const validatedResponse = PuzzleResponseSchema.parse(response);
    
    // Return response with rate limit headers
    return NextResponse.json(validatedResponse, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
    
  } catch (error) {
    console.error('Error creating practice puzzle:', error);
    
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
    
    if (error instanceof Error && error.message.includes('Failed to generate valid puzzle')) {
      return NextResponse.json(
        { error: { code: 'PUZZLE_GENERATION_FAILED', message: 'Failed to generate puzzle' } },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create practice puzzle' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = await checkRateLimitOrThrow('API', clientIP);
    
    // Get available difficulty levels
    const difficulties = ['easy', 'medium', 'hard', 'expert'];
    
    // Get user's stats for each difficulty
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let userStats = null;
    if (userId) {
      userStats = await prisma.play.groupBy({
        by: ['puzzleId'],
        where: {
          userId,
          status: 'completed',
          finishedAt: { not: null },
        },
        _count: {
          id: true,
        },
        _min: {
          seconds: true,
        },
        _max: {
          score: true,
        },
      });
    }
    
    // Get puzzle counts by difficulty
    const puzzleCounts = await prisma.puzzle.groupBy({
      by: ['difficulty'],
      where: {
        dateKey: null, // Only practice puzzles
      },
      _count: {
        id: true,
      },
    });
    
    const difficultyStats = difficulties.map(difficulty => {
      const count = puzzleCounts.find(c => c.difficulty === difficulty)?._count.id || 0;
      return {
        difficulty,
        availablePuzzles: count,
        estimatedTime: getEstimatedTime(difficulty),
        description: getDifficultyDescription(difficulty),
      };
    });
    
    // Return response with rate limit headers
    return NextResponse.json({
      difficulties: difficultyStats,
      userStats: userStats ? {
        totalCompleted: userStats.length,
        averageTime: userStats.reduce((acc, stat) => acc + (stat._min.seconds || 0), 0) / userStats.length,
        bestScore: Math.max(...userStats.map(stat => stat._max.score || 0)),
      } : null,
    }, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
    
  } catch (error) {
    console.error('Error fetching difficulty levels:', error);
    
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: error.message } },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch difficulty levels' } },
      { status: 500 }
    );
  }
}

function getEstimatedTime(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '5-10 min';
    case 'medium': return '10-20 min';
    case 'hard': return '20-40 min';
    case 'expert': return '40+ min';
    default: return 'Unknown';
  }
}

function getDifficultyDescription(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'Perfect for beginners. Learn the basics of Sudoku with simple patterns.';
    case 'medium':
      return 'Challenge yourself with moderate complexity. Good for regular practice.';
    case 'hard':
      return 'Advanced techniques required. Test your logical thinking skills.';
    case 'expert':
      return 'Master level puzzles. Only for the most skilled players.';
    default:
      return 'Unknown difficulty level.';
  }
}
