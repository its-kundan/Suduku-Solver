import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface RateLimitConfig {
  identifier: string; // IP address or user ID
  limit: number;      // Maximum requests
  window: number;     // Time window in seconds
}

class RateLimiter {
  private redis: Redis | null = null;
  private isEnabled: boolean = false;

  constructor() {
    // Initialize Redis if environment variables are set
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      this.isEnabled = true;
    }
  }

  /**
   * Check if rate limiting is enabled
   */
  isRateLimitingEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Check rate limit for an identifier
   */
  async checkLimit(config: RateLimitConfig): Promise<RateLimitResult> {
    if (!this.isEnabled || !this.redis) {
      // No-op rate limiter for development
      return {
        success: true,
        limit: config.limit,
        remaining: config.limit,
        reset: Date.now() + (config.window * 1000),
      };
    }

    const key = `ratelimit:${config.identifier}:${config.window}`;
    const now = Date.now();
    const windowStart = now - (config.window * 1000);

    try {
      // Get current requests in the window
      const requests = await this.redis.zrangebyscore(key, windowStart, '+inf');
      const currentCount = requests.length;

      if (currentCount >= config.limit) {
        // Rate limit exceeded
        const oldestRequest = await this.redis.zrange(key, 0, 0, { withScores: true });
        const resetTime = oldestRequest.length > 0 
          ? oldestRequest[0].score + (config.window * 1000)
          : now + (config.window * 1000);

        return {
          success: false,
          limit: config.limit,
          remaining: 0,
          reset: resetTime,
        };
      }

      // Add current request
      await this.redis.zadd(key, now, now.toString());
      await this.redis.expire(key, config.window);

      return {
        success: true,
        limit: config.limit,
        remaining: config.limit - currentCount - 1,
        reset: now + (config.window * 1000),
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      
      // Fallback to no-op on Redis errors
      return {
        success: true,
        limit: config.limit,
        remaining: config.limit,
        reset: now + (config.window * 1000),
      };
    }
  }

  /**
   * Get rate limit info without consuming a request
   */
  async getLimitInfo(config: RateLimitConfig): Promise<RateLimitResult> {
    if (!this.isEnabled || !this.redis) {
      return {
        success: true,
        limit: config.limit,
        remaining: config.limit,
        reset: Date.now() + (config.window * 1000),
      };
    }

    const key = `ratelimit:${config.identifier}:${config.window}`;
    const now = Date.now();
    const windowStart = now - (config.window * 1000);

    try {
      const requests = await this.redis.zrangebyscore(key, windowStart, '+inf');
      const currentCount = requests.length;
      const remaining = Math.max(0, config.limit - currentCount);

      return {
        success: remaining > 0,
        limit: config.limit,
        remaining,
        reset: now + (config.window * 1000),
      };
    } catch (error) {
      console.error('Rate limit info error:', error);
      return {
        success: true,
        limit: config.limit,
        remaining: config.limit,
        reset: now + (config.window * 1000),
      };
    }
  }

  /**
   * Reset rate limit for an identifier (admin function)
   */
  async resetLimit(identifier: string, window: number): Promise<boolean> {
    if (!this.isEnabled || !this.redis) {
      return true;
    }

    try {
      const key = `ratelimit:${identifier}:${window}`;
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Rate limit reset error:', error);
      return false;
    }
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // General API endpoints
  API: { limit: 100, window: 60 }, // 100 requests per minute
  
  // Puzzle generation (more restrictive)
  PUZZLE_GENERATION: { limit: 10, window: 60 }, // 10 puzzles per minute
  
  // Game completion (prevent spam)
  GAME_COMPLETION: { limit: 20, window: 60 }, // 20 completions per minute
  
  // Authentication attempts
  AUTH: { limit: 5, window: 300 }, // 5 attempts per 5 minutes
  
  // Leaderboard queries
  LEADERBOARD: { limit: 50, window: 60 }, // 50 queries per minute
} as const;

/**
 * Helper function to create rate limit config
 */
export function createRateLimitConfig(
  type: keyof typeof RATE_LIMITS,
  identifier: string
): RateLimitConfig {
  return {
    identifier,
    ...RATE_LIMITS[type],
  };
}

/**
 * Helper function to check rate limit and throw error if exceeded
 */
export async function checkRateLimitOrThrow(
  type: keyof typeof RATE_LIMITS,
  identifier: string
): Promise<RateLimitResult> {
  const config = createRateLimitConfig(type, identifier);
  const result = await rateLimiter.checkLimit(config);
  
  if (!result.success) {
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((result.reset - Date.now()) / 1000)} seconds.`);
  }
  
  return result;
}

/**
 * Helper function to get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}
