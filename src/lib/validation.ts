import { z } from 'zod';

export const finishPlaySchema = z.object({
  playId: z.string().cuid(),
  seconds: z.number().int().min(0),
  mistakes: z.number().int().min(0),
  hintsUsed: z.number().int().min(0),
  finalGrid: z.array(z.array(z.number().int().min(0).max(9))).length(9),
});

export const startPlaySchema = z.object({
  puzzleId: z.string().cuid(),
});

export const dailyPuzzleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const leaderboardSchema = z.object({
  scope: z.enum(['daily', 'weekly', 'all']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']).optional(),
});

export const gridSchema = z.array(z.array(z.number().int().min(0).max(9))).length(9);

export const cellInputSchema = z.object({
  row: z.number().int().min(0).max(8),
  col: z.number().int().min(0).max(8),
  value: z.number().int().min(0).max(9),
});

export const candidateSchema = z.object({
  row: z.number().int().min(0).max(8),
  col: z.number().int().min(0).max(8),
  candidates: z.array(z.number().int().min(1).max(9)),
});

export type FinishPlayInput = z.infer<typeof finishPlaySchema>;
export type StartPlayInput = z.infer<typeof startPlaySchema>;
export type DailyPuzzleInput = z.infer<typeof dailyPuzzleSchema>;
export type LeaderboardInput = z.infer<typeof leaderboardSchema>;
export type GridInput = z.infer<typeof gridSchema>;
export type CellInput = z.infer<typeof cellInputSchema>;
export type CandidateInput = z.infer<typeof candidateSchema>;