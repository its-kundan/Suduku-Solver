import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitOrThrow } from "@/lib/ratelimit";
import { DailyQuerySchema, PuzzleResponseSchema } from "@/lib/schemas";
import { generateFromSeed } from "@/lib/sudoku";
import { dateKeyIST } from "@/lib/time";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    await checkRateLimitOrThrow("PUZZLE_GENERATION", clientIP);

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    
    const validatedQuery = DailyQuerySchema.parse(query);
    const { date } = validatedQuery;

    // Generate deterministic puzzle for the date
    const dateKey = date || dateKeyIST();
    const seed = parseInt(dateKey.replace(/-/g, ""), 10);
    
    const puzzle = generateFromSeed(seed);
    
    // Validate response
    const response = PuzzleResponseSchema.parse({
      puzzle: puzzle.puzzle,
      solution: puzzle.solution,
      difficulty: puzzle.difficulty,
      dateKey,
      seed,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Daily puzzle error:", error);
    
    if (error instanceof Error && error.message.includes("Rate limit")) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate puzzle" },
      { status: 500 }
      );
  }
}