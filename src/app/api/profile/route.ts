import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getUserProfile } from '@/lib/auth';
import { checkRateLimitOrThrow, getRateLimitHeaders } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';
export const revalidate = 30; // Cache for 30 seconds

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = await checkRateLimitOrThrow('API', clientIP);
    
    // Authentication required
    const { userId } = await requireAuth();
    
    // Get user profile
    const profile = await getUserProfile(userId);
    
    // Return profile with rate limit headers
    return NextResponse.json(profile, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    
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
    
    if (error instanceof Error && error.message.includes('User not found')) {
      return NextResponse.json(
        { error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch profile' } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || 'unknown';
    const rateLimitResult = await checkRateLimitOrThrow('API', clientIP);
    
    // Authentication required
    const { userId } = await requireAuth();
    
    // Parse request body
    const body = await request.json();
    const { name, email } = body;
    
    // Validate input
    if (name && (typeof name !== 'string' || name.length > 50)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid name' } },
        { status: 400 }
      );
    }
    
    if (email && (typeof email !== 'string' || !email.includes('@'))) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid email' } },
        { status: 400 }
      );
    }
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
    
    // Return updated profile with rate limit headers
    return NextResponse.json(updatedUser, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    
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
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update profile' } },
      { status: 500 }
    );
  }
}
