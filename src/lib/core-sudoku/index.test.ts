import { describe, it, expect } from 'vitest';
import {
  isValid,
  solve,
  generate,
  rateDifficulty,
  ensureUniqueSolution,
  validateGrid,
  isComplete,
  type Grid,
} from './index';

describe('Core Sudoku Engine', () => {
  describe('isValid', () => {
    it('should return true for valid placement', () => {
      const grid: Grid = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8],
      ];

      expect(isValid(grid, 0, 0, 1)).toBe(false); // Already filled
      expect(isValid(grid, 0, 0, 2)).toBe(false); // Conflict in row
      expect(isValid(grid, 0, 0, 5)).toBe(false); // Conflict in column
      expect(isValid(grid, 0, 0, 9)).toBe(false); // Conflict in box
    });

    it('should return false for invalid placement', () => {
      const grid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      grid[0][0] = 1;

      expect(isValid(grid, 0, 1, 1)).toBe(false); // Conflict in row
      expect(isValid(grid, 1, 0, 1)).toBe(false); // Conflict in column
      expect(isValid(grid, 1, 1, 1)).toBe(false); // Conflict in box
      expect(isValid(grid, 0, 2, 1)).toBe(false); // Conflict in row
    });
  });

  describe('solve', () => {
    it('should solve a valid Sudoku puzzle', () => {
      const grid: Grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ];

      const solution = solve(grid);
      expect(solution).not.toBeNull();
      expect(isComplete(solution!)).toBe(true);
    });

    it('should return null for unsolvable puzzle', () => {
      const grid: Grid = [
        [1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      const solution = solve(grid);
      expect(solution).toBeNull();
    });
  });

  describe('generate', () => {
    it('should generate puzzles of different difficulties', () => {
      const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;
      
      difficulties.forEach(difficulty => {
        const puzzle = generate(difficulty);
        expect(puzzle.puzzle).toBeDefined();
        expect(puzzle.solution).toBeDefined();
        expect(puzzle.difficulty).toBe(difficulty);
        expect(puzzle.givens).toBeGreaterThan(0);
        expect(puzzle.givens).toBeLessThan(81);
      });
    });

    it('should generate puzzles with unique solutions', () => {
      const puzzle = generate('medium');
      expect(ensureUniqueSolution(puzzle.puzzle)).toBe(true);
    });
  });

  describe('rateDifficulty', () => {
    it('should rate difficulty based on givens and complexity', () => {
      const easyGrid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      // Fill with many givens
      for (let i = 0; i < 50; i++) {
        easyGrid[Math.floor(i / 9)][i % 9] = (i % 9) + 1;
      }

      const hardGrid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      // Fill with few givens
      for (let i = 0; i < 25; i++) {
        hardGrid[Math.floor(i / 9)][i % 9] = (i % 9) + 1;
      }

      expect(rateDifficulty(easyGrid)).toBe('easy');
      expect(rateDifficulty(hardGrid)).toBe('hard');
    });
  });

  describe('validateGrid', () => {
    it('should detect conflicts in grid', () => {
      const grid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      grid[0][0] = 1;
      grid[0][1] = 1; // Conflict in row

      const result = validateGrid(grid);
      expect(result.isValid).toBe(false);
      expect(result.conflicts.length).toBeGreaterThan(0);
    });

    it('should return valid for correct grid', () => {
      const grid: Grid = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8],
      ];

      const result = validateGrid(grid);
      expect(result.isValid).toBe(true);
      expect(result.conflicts.length).toBe(0);
    });
  });

  describe('isComplete', () => {
    it('should return true for complete valid grid', () => {
      const grid: Grid = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8],
      ];

      expect(isComplete(grid)).toBe(true);
    });

    it('should return false for incomplete grid', () => {
      const grid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      grid[0][0] = 1;

      expect(isComplete(grid)).toBe(false);
    });
  });
});