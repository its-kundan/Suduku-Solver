import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateFromSeed, Difficulty } from '@/lib/core-sudoku';
import { getISTDateString } from '@/lib/streaks';
import { z } from 'zod';

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']).default('medium'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      date: searchParams.get('date'),
      difficulty: searchParams.get('difficulty') || 'medium',
    });
    
    const dateKey = query.date || getISTDateString();
    const difficulty = query.difficulty as Difficulty;
    
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
    
    return NextResponse.json({
      puzzleId: puzzle.id,
      puzzle: puzzle.puzzle,
      difficulty: puzzle.difficulty,
      dateKey: puzzle.dateKey,
    });
  } catch (error) {
    console.error('Error fetching daily puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily puzzle' },
      { status: 500 }
    );
  }
}