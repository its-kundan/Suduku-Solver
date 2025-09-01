export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type Grid = number[][];

export interface GeneratedPuzzle {
  puzzle: Grid;
  solution: Grid;
  givens: number;
  difficulty: Difficulty;
}

export interface ValidationResult {
  isValid: boolean;
  conflicts: Array<{ row: number; col: number }>;
}

/**
 * Check if a number can be placed at the given position
 */
export function isValid(grid: Grid, row: number, col: number, val: number): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col && grid[row][i] === val) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && grid[i][col] === val) {
      return false;
    }
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const subGridRow = startRow + i;
      const subGridCol = startCol + j;
      if ((subGridRow !== row || subGridCol !== col) && grid[subGridRow][subGridCol] === val) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Find all conflicts in the current grid
 */
export function findConflicts(grid: Grid): Array<{ row: number; col: number }> {
  const conflicts: Array<{ row: number; col: number }> = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) {
        const val = grid[row][col];
        grid[row][col] = 0; // Temporarily remove to check
        if (!isValid(grid, row, col, val)) {
          conflicts.push({ row, col });
        }
        grid[row][col] = val; // Restore
      }
    }
  }

  return conflicts;
}

/**
 * Validate the entire grid
 */
export function validateGrid(grid: Grid): ValidationResult {
  const conflicts = findConflicts(grid);
  return {
    isValid: conflicts.length === 0,
    conflicts
  };
}

/**
 * Solve Sudoku using backtracking algorithm
 */
export function solve(grid: Grid): Grid | null {
  const board = grid.map(row => [...row]);
  
  const findEmpty = (board: Grid): [number, number] | null => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) return [i, j];
      }
    }
    return null;
  };

  const backtrack = (): boolean => {
    const emptyPos = findEmpty(board);
    if (!emptyPos) return true;

    const [row, col] = emptyPos;
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        if (backtrack()) return true;
        board[row][col] = 0;
      }
    }
    return false;
  };

  return backtrack() ? board : null;
}

/**
 * Check if the puzzle has a unique solution
 */
export function ensureUniqueSolution(grid: Grid): boolean {
  const solution = solve(grid);
  if (!solution) return false;

  // Try to find a second solution by making one change
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const originalSolution = solution[row][col];
        for (let num = 1; num <= 9; num++) {
          if (num !== originalSolution && isValid(grid, row, col, num)) {
            const testGrid = grid.map(r => [...r]);
            testGrid[row][col] = num;
            const secondSolution = solve(testGrid);
            if (secondSolution) {
              return false; // Multiple solutions found
            }
          }
        }
      }
    }
  }

  return true;
}

/**
 * Rate the difficulty of a puzzle
 */
export function rateDifficulty(grid: Grid): Difficulty {
  const givens = grid.flat().filter(cell => cell !== 0).length;
  const emptyCells = 81 - givens;
  
  // Count the number of cells that have only one possible value
  let singleCandidates = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        let candidates = 0;
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            candidates++;
          }
        }
        if (candidates === 1) singleCandidates++;
      }
    }
  }

  // Difficulty rating based on givens and solving complexity
  if (givens >= 50 || (givens >= 45 && singleCandidates >= emptyCells * 0.8)) {
    return "easy";
  } else if (givens >= 35 || (givens >= 30 && singleCandidates >= emptyCells * 0.6)) {
    return "medium";
  } else if (givens >= 25 || (givens >= 20 && singleCandidates >= emptyCells * 0.4)) {
    return "hard";
  } else {
    return "expert";
  }
}

/**
 * Generate a Sudoku puzzle of specified difficulty
 */
export function generate(difficulty: Difficulty): GeneratedPuzzle {
  // Start with a solved grid
  const solvedGrid = generateSolvedGrid();
  
  // Create puzzle by removing numbers
  const puzzle = createPuzzle(solvedGrid, difficulty);
  
  return {
    puzzle,
    solution: solvedGrid,
    givens: puzzle.flat().filter(cell => cell !== 0).length,
    difficulty: rateDifficulty(puzzle)
  };
}

/**
 * Generate a solved Sudoku grid
 */
function generateSolvedGrid(): Grid {
  const grid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first (these are independent)
  for (let box = 0; box < 9; box += 4) {
    const startRow = Math.floor(box / 3) * 3;
    const startCol = (box % 3) * 3;
    fillBox(grid, startRow, startCol);
  }
  
  // Solve the rest
  solve(grid);
  
  return grid;
}

/**
 * Fill a 3x3 box with random numbers
 */
function fillBox(grid: Grid, startRow: number, startCol: number): void {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      grid[startRow + i][startCol + j] = numbers[randomIndex];
      numbers.splice(randomIndex, 1);
    }
  }
}

/**
 * Create a puzzle by removing numbers from a solved grid
 */
function createPuzzle(solvedGrid: Grid, difficulty: Difficulty): Grid {
  const puzzle = solvedGrid.map(row => [...row]);
  const targetGivens = getTargetGivens(difficulty);
  
  // Remove numbers randomly until we reach target givens
  const cells = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      cells.push([row, col]);
    }
  }
  
  // Shuffle cells
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  
  // Remove numbers
  for (let i = 0; i < cells.length && puzzle.flat().filter(cell => cell !== 0).length > targetGivens; i++) {
    const [row, col] = cells[i];
    const temp = puzzle[row][col];
    puzzle[row][col] = 0;
    
    // Check if still has unique solution
    if (!ensureUniqueSolution(puzzle)) {
      puzzle[row][col] = temp; // Restore if multiple solutions
    }
  }
  
  return puzzle;
}

/**
 * Get target number of givens for each difficulty
 */
function getTargetGivens(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy": return 45;
    case "medium": return 35;
    case "hard": return 25;
    case "expert": return 20;
  }
}

/**
 * Generate a daily puzzle using a seed
 */
export function generateDailyPuzzle(seed: string, difficulty: Difficulty): GeneratedPuzzle {
  // Use seed to ensure consistent generation for the same date
  const seedNum = hashString(seed);
  const originalRandom = Math.random;
  
  // Override Math.random with seeded random
  let seedValue = seedNum;
  Math.random = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
  
  const puzzle = generate(difficulty);
  
  // Restore original Math.random
  Math.random = originalRandom;
  
  return puzzle;
}

/**
 * Generate a daily seed string
 */
export function generateDailySeed(date: string, difficulty: string): string {
  return `SUDOKU:${date}:${difficulty}`;
}

/**
 * Simple hash function for seeding
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Check if a grid is complete and correct
 */
export function isComplete(grid: Grid): boolean {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) return false;
    }
  }
  
  // Check if valid
  return validateGrid(grid).isValid;
}