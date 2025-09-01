import { describe, it, expect } from 'vitest';
import {
  isValid,
  solve,
  ensureUniqueSolution,
  rateDifficulty,
  generate,
  generateFromSeed,
  isComplete,
  countMistakes,
  type Grid,
} from './index';

describe('Core Sudoku Module', () => {
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

      expect(isValid(grid, 0, 0, 1)).toBe(true);
    });

    it('should return false for invalid placement in row', () => {
      const grid: Grid = [
        [1, 2, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(isValid(grid, 0, 3, 1)).toBe(false);
    });

    it('should return false for invalid placement in column', () => {
      const grid: Grid = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(isValid(grid, 1, 0, 1)).toBe(false);
    });

    it('should return false for invalid placement in 3x3 box', () => {
      const grid: Grid = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(isValid(grid, 1, 1, 1)).toBe(false);
    });
  });

  describe('solve', () => {
    it('should solve a valid Sudoku puzzle', () => {
      const puzzle: Grid = [
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

      const solution = solve(puzzle);
      
      // Check that all cells are filled
      expect(solution.every(row => row.every(cell => cell !== 0))).toBe(true);
      
      // Check that solution is valid
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const value = solution[i][j];
          solution[i][j] = 0;
          expect(isValid(solution, i, j, value)).toBe(true);
          solution[i][j] = value;
        }
      }
    });
  });

  describe('ensureUniqueSolution', () => {
    it('should return true for puzzle with unique solution', () => {
      const puzzle: Grid = [
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

      expect(ensureUniqueSolution(puzzle)).toBe(true);
    });
  });

  describe('rateDifficulty', () => {
    it('should rate easy puzzles correctly', () => {
      const easyPuzzle: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      // Fill with 50+ givens
      for (let i = 0; i < 50; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        easyPuzzle[row][col] = (i % 9) + 1;
      }

      expect(rateDifficulty(easyPuzzle)).toBe('easy');
    });

    it('should rate expert puzzles correctly', () => {
      const expertPuzzle: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      // Fill with 20-25 givens
      for (let i = 0; i < 20; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        expertPuzzle[row][col] = (i % 9) + 1;
      }

      expect(rateDifficulty(expertPuzzle)).toBe('expert');
    });
  });

  describe('generate', () => {
    it('should generate puzzles of specified difficulty', () => {
      const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;
      
      for (const difficulty of difficulties) {
        const result = generate(difficulty);
        
        expect(result.puzzle).toHaveLength(9);
        expect(result.solution).toHaveLength(9);
        expect(result.givens).toBeGreaterThan(0);
        expect(result.givens).toBeLessThan(82);
        
        // Verify puzzle can be solved
        const solved = solve(result.puzzle);
        expect(solved.every(row => row.every(cell => cell !== 0))).toBe(true);
      }
    });
  });

  describe('generateFromSeed', () => {
    it('should generate consistent puzzles from same seed', () => {
      const seed = 'test-seed-123';
      const difficulty = 'medium';
      
      const result1 = generateFromSeed(seed, difficulty);
      const result2 = generateFromSeed(seed, difficulty);
      
      expect(result1.puzzle).toEqual(result2.puzzle);
      expect(result1.solution).toEqual(result2.solution);
      expect(result1.givens).toBe(result2.givens);
    });
  });

  describe('isComplete', () => {
    it('should return true for complete valid grid', () => {
      const completeGrid: Grid = [
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

      expect(isComplete(completeGrid)).toBe(true);
    });

    it('should return false for incomplete grid', () => {
      const incompleteGrid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      incompleteGrid[0][0] = 1;

      expect(isComplete(incompleteGrid)).toBe(false);
    });
  });

  describe('countMistakes', () => {
    it('should count mistakes correctly', () => {
      const originalPuzzle: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      originalPuzzle[0][0] = 1;
      
      const currentGrid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
      currentGrid[0][0] = 1;
      currentGrid[0][1] = 1; // Mistake: same number in row
      currentGrid[1][0] = 1; // Mistake: same number in column
      
      expect(countMistakes(currentGrid, originalPuzzle)).toBe(2);
    });
  });
});