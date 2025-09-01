import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimitOrThrow } from "@/lib/ratelimit";
import { PlayStartSchema } from "@/lib/schemas";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    await checkRateLimitOrThrow("GAME_COMPLETION", clientIP);

    // Get session (placeholder for now)
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = PlayStartSchema.parse(body);
    const { puzzleId, difficulty } = validatedData;

    // Check if user already has an active play session for this puzzle
    let play = await prisma.play.findFirst({
      where: {
        userId,
        puzzleId,
        status: "in_progress",
      },
    });

    if (play) {
      // Resume existing session
      return NextResponse.json({
        playId: play.id,
        status: "resumed",
        startedAt: play.startedAt,
      });
    }

    // Create new play session
    play = await prisma.play.create({
      data: {
        userId,
        puzzleId,
        difficulty,
        status: "in_progress",
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      playId: play.id,
      status: "started",
      startedAt: play.startedAt,
    });
  } catch (error) {
    console.error("Play start error:", error);
    
    if (error instanceof Error && error.message.includes("Rate limit")) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    if (error instanceof Error && error.message.includes("Authentication required")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to start play session" },
      { status: 500 }
    );
  }
}