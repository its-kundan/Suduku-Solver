import { z } from 'zod';

// Grid validation schema (9x9 Sudoku grid)
export const GridSchema = z.array(
  z.array(z.number().min(0).max(9)).length(9)
).length(9);

// Difficulty levels
export const DifficultySchema = z.enum(['easy', 'medium', 'hard', 'expert']);

// Date format validation (YYYY-MM-DD)
export const DateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// API Request Schemas

export const DailyQuerySchema = z.object({
  date: DateKeySchema.optional(),
  difficulty: DifficultySchema.optional(),
});

export const LevelsCreateSchema = z.object({
  difficulty: DifficultySchema,
});

export const PlayStartSchema = z.object({
  puzzleId: z.string().cuid(),
});

export const FinishPlaySchema = z.object({
  playId: z.string().cuid(),
  seconds: z.number().int().min(0).max(86400), // Max 24 hours
  mistakes: z.number().int().min(0).max(100),
  hintsUsed: z.number().int().min(0).max(10),
  finalGrid: GridSchema,
});

export const LeaderboardQuerySchema = z.object({
  scope: z.enum(['daily', 'weekly', 'all']).default('daily'),
  date: DateKeySchema.optional(),
  difficulty: DifficultySchema.optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
});

// Response Schemas

export const PuzzleResponseSchema = z.object({
  puzzleId: z.string(),
  puzzle: GridSchema,
  difficulty: DifficultySchema,
  dateKey: z.string().nullable(),
});

export const PlayResponseSchema = z.object({
  playId: z.string(),
  userId: z.string(),
  puzzleId: z.string(),
  startedAt: z.date(),
  finishedAt: z.date().nullable(),
  seconds: z.number(),
  mistakes: z.number(),
  hintsUsed: z.number(),
  status: z.string(),
  score: z.number(),
});

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  userId: z.string(),
  username: z.string(),
  avatar: z.string().nullable(),
  score: z.number(),
  time: z.number(),
  mistakes: z.number(),
  hintsUsed: z.number(),
  streak: z.number(),
  isCurrentUser: z.boolean().optional(),
});

export const LeaderboardResponseSchema = z.object({
  entries: z.array(LeaderboardEntrySchema),
  total: z.number(),
  userRank: z.number().nullable(),
  scope: z.string(),
  date: z.string().optional(),
  difficulty: z.string().optional(),
});

export const StreakResponseSchema = z.object({
  currentCount: z.number(),
  longestCount: z.number(),
  lastPlayedIST: z.string().nullable(),
  canPlayToday: z.boolean(),
  message: z.string().optional(),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  image: z.string().nullable(),
  createdAt: z.date(),
  streak: StreakResponseSchema,
  xp: z.object({
    current: z.number(),
    level: z.number(),
    title: z.string(),
    progress: z.number(),
    nextLevelXP: z.number(),
  }),
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    earnedAt: z.date(),
  })),
  recentPlays: z.array(z.object({
    id: z.string(),
    puzzleId: z.string(),
    difficulty: DifficultySchema,
    score: z.number(),
    seconds: z.number(),
    finishedAt: z.date(),
  })),
});

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

// Achievement Schemas

export const AchievementSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  criteria: z.record(z.any()),
  createdAt: z.date(),
});

export const UserAchievementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  achievementId: z.string(),
  earnedAt: z.date(),
  achievement: AchievementSchema,
});

// Level Schemas

export const LevelSchema = z.object({
  code: z.string(),
  minXP: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
});

export const UserXPSchema = z.object({
  id: z.string(),
  userId: z.string(),
  xp: z.number(),
  levelCode: z.string().nullable(),
  level: LevelSchema.nullable(),
});

// Admin Schemas

export const AdminReseedSchema = z.object({
  date: DateKeySchema,
  difficulty: DifficultySchema.optional(),
  force: z.boolean().default(false),
});

export const AdminUserSchema = z.object({
  userId: z.string().cuid(),
  action: z.enum(['promote', 'demote', 'ban', 'unban']),
});

// Rate Limiting Schemas

export const RateLimitSchema = z.object({
  remaining: z.number(),
  reset: z.number(),
  limit: z.number(),
});

// Real-time Event Schemas

export const LeaderboardUpdateEventSchema = z.object({
  type: z.literal('leaderboard:update'),
  dateKey: z.string(),
  difficulty: DifficultySchema,
  userId: z.string(),
  score: z.number(),
  rank: z.number(),
});

export const StreakUpdateEventSchema = z.object({
  type: z.literal('streak:update'),
  userId: z.string(),
  currentCount: z.number(),
  longestCount: z.number(),
  isNewRecord: z.boolean(),
});

// Type exports
export type DailyQuery = z.infer<typeof DailyQuerySchema>;
export type LevelsCreate = z.infer<typeof LevelsCreateSchema>;
export type PlayStart = z.infer<typeof PlayStartSchema>;
export type FinishPlay = z.infer<typeof FinishPlaySchema>;
export type LeaderboardQuery = z.infer<typeof LeaderboardQuerySchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
export type PuzzleResponse = z.infer<typeof PuzzleResponseSchema>;
export type PlayResponse = z.infer<typeof PlayResponseSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;
export type StreakResponse = z.infer<typeof StreakResponseSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type UserAchievement = z.infer<typeof UserAchievementSchema>;
export type Level = z.infer<typeof LevelSchema>;
export type UserXP = z.infer<typeof UserXPSchema>;
export type AdminReseed = z.infer<typeof AdminReseedSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type RateLimit = z.infer<typeof RateLimitSchema>;
export type LeaderboardUpdateEvent = z.infer<typeof LeaderboardUpdateEventSchema>;
export type StreakUpdateEvent = z.infer<typeof StreakUpdateEventSchema>;
