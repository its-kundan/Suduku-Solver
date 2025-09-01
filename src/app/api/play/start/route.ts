import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { startPlaySchema } from '@/lib/validation';

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
    const { puzzleId } = startPlaySchema.parse(body);
    
    // Verify puzzle exists
    const puzzle = await prisma.puzzle.findUnique({
      where: { id: puzzleId },
    });
    
    if (!puzzle) {
      return NextResponse.json(
        { error: 'Puzzle not found' },
        { status: 404 }
      );
    }
    
    // Check if user already has an active play for this puzzle
    const existingPlay = await prisma.play.findFirst({
      where: {
        userId: session.user.id,
        puzzleId,
        status: 'in_progress',
      },
    });
    
    if (existingPlay) {
      return NextResponse.json({
        playId: existingPlay.id,
        message: 'Resumed existing play',
      });
    }
    
    // Create new play
    const play = await prisma.play.create({
      data: {
        userId: session.user.id,
        puzzleId,
        startedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      playId: play.id,
      message: 'Started new play',
    });
  } catch (error) {
    console.error('Error starting play:', error);
    return NextResponse.json(
      { error: 'Failed to start play' },
      { status: 500 }
    );
  }
}