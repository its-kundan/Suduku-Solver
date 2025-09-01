import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminReseedSchema } from '@/lib/schemas';
import { checkRateLimitOrThrow, getRateLimitHeaders } from '@/lib/ratelimit';
import { generateFromSeed } from '@/lib/core-sudoku';
import { dateKeyIST } from '@/lib/time';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = await checkRateLimitOrThrow('PUZZLE_GENERATION', clientIP);
    
    // Admin access required
    const { userId } = await requireAdmin();
    
    // Parse and validate request body
    const body = await request.json();
    const { date, difficulty, force } = AdminReseedSchema.parse(body);
    
    // Validate date format
    const dateKey = date || dateKeyIST();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid date format' } },
        { status: 400 }
      );
    }
    
    // Check if puzzles already exist for this date
    const existingPuzzles = await prisma.puzzle.findMany({
      where: {
        dateKey,
        ...(difficulty && { difficulty }),
      },
    });
    
    if (existingPuzzles.length > 0 && !force) {
      return NextResponse.json(
        { 
          error: { 
            code: 'PUZZLES_EXIST', 
            message: `Puzzles already exist for ${dateKey}${difficulty ? ` (${difficulty})` : ''}. Use force=true to overwrite.` 
          } 
        },
        { status: 409 }
      );
    }
    
    // Delete existing puzzles if force=true
    if (existingPuzzles.length > 0 && force) {
      await prisma.puzzle.deleteMany({
        where: {
          dateKey,
          ...(difficulty && { difficulty }),
        },
      });
    }
    
    // Generate new puzzles
    const difficulties = difficulty ? [difficulty] : ['easy', 'medium', 'hard', 'expert'];
    const generatedPuzzles = [];
    
    for (const diff of difficulties) {
      const seed = `SUDOKU:${dateKey}:${diff}`;
      const result = generateFromSeed(seed, diff);
      
      // Ensure the puzzle has a valid solution
      if (!result.solution || !Array.isArray(result.solution)) {
        throw new Error(`Failed to generate valid puzzle for ${diff} difficulty`);
      }
      
      const puzzle = await prisma.puzzle.create({
        data: {
          dateKey,
          difficulty: diff,
          seed,
          puzzle: result.puzzle,
          solution: result.solution,
        },
      });
      
      generatedPuzzles.push({
        id: puzzle.id,
        difficulty: puzzle.difficulty,
        seed: puzzle.seed,
      });
    }
    
    // Log admin action
    console.log(`Admin ${userId} reseeded puzzles for ${dateKey}${difficulty ? ` (${difficulty})` : ''}`);
    
    // Return response with rate limit headers
    return NextResponse.json({
      success: true,
      message: `Successfully generated ${generatedPuzzles.length} puzzle(s) for ${dateKey}`,
      puzzles: generatedPuzzles,
      date: dateKey,
      difficulty: difficulty || 'all',
      force,
    }, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
    
  } catch (error) {
    console.error('Error reseeding puzzles:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: error.message } },
        { status: 429 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Invalid date format')) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid date format' } },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Failed to generate valid puzzle')) {
      return NextResponse.json(
        { error: { code: 'PUZZLE_GENERATION_FAILED', message: error.message } },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to reseed puzzles' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin access required
    await requireAdmin();
    
    // Get puzzle statistics
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    let whereClause: any = {};
    if (date) {
      whereClause.dateKey = date;
    }
    
    const puzzleStats = await prisma.puzzle.groupBy({
      by: ['dateKey', 'difficulty'],
      where: whereClause,
      _count: {
        id: true,
      },
      orderBy: [
        { dateKey: 'desc' },
        { difficulty: 'asc' },
      ],
      take: 100,
    });
    
    // Group by date for better organization
    const statsByDate = puzzleStats.reduce((acc, stat) => {
      const dateKey = stat.dateKey || 'practice';
      if (!acc[dateKey]) {
        acc[dateKey] = {};
      }
      acc[dateKey][stat.difficulty] = stat._count.id;
      return acc;
    }, {} as Record<string, Record<string, number>>);
    
    return NextResponse.json({
      stats: statsByDate,
      totalPuzzles: puzzleStats.reduce((sum, stat) => sum + stat._count.id, 0),
      dateRange: date ? [date] : Object.keys(statsByDate).slice(0, 10),
    });
    
  } catch (error) {
    console.error('Error fetching puzzle statistics:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch puzzle statistics' } },
      { status: 500 }
    );
  }
}
