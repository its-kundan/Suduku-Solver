import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateFromSeed, Difficulty } from '@/lib/core-sudoku';
import { dateKeyIST, todayDifficultyPattern } from '@/lib/time';
import { DailyQuerySchema, PuzzleResponseSchema } from '@/lib/schemas';
import { checkRateLimitOrThrow, getRateLimitHeaders } from '@/lib/ratelimit';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = await checkRateLimitOrThrow('API', clientIP);
    
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const query = {
      date: searchParams.get('date'),
      difficulty: searchParams.get('difficulty'),
    };
    
    const validatedQuery = DailyQuerySchema.parse(query);
    const dateKey = validatedQuery.date || dateKeyIST();
    const difficulty = validatedQuery.difficulty || todayDifficultyPattern();
    
    // Try to find existing puzzle
    let puzzle = await prisma.puzzle.findFirst({
      where: {
        dateKey,
        difficulty,
      },
    });
    
    // Generate new puzzle if not found
    if (!puzzle) {
      const seed = `SUDOKU:${dateKey}:${difficulty}`;
      const result = generateFromSeed(seed, difficulty);
      
      // Ensure the puzzle has a unique solution
      if (!result.solution || !Array.isArray(result.solution)) {
        throw new Error('Failed to generate valid puzzle');
      }
      
      puzzle = await prisma.puzzle.create({
        data: {
          dateKey,
          difficulty,
          seed,
          puzzle: result.puzzle,
          solution: result.solution,
        },
      });
    }
    
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
    console.error('Error fetching daily puzzle:', error);
    
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
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch daily puzzle' } },
      { status: 500 }
    );
  }
}