export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Grid = number[][];

export interface PuzzleData {
  puzzle: Grid;
  solution: Grid;
  givens: number;
  difficulty: Difficulty;
}

export interface GenerationResult {
  puzzle: Grid;
  solution: Grid;
  givens: number;
}

// Check if a number is valid in a specific position
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

// Find empty cell in the grid
function findEmpty(grid: Grid): [number, number] | null {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

// Solve Sudoku using backtracking
export function solve(grid: Grid): Grid {
  const solution = grid.map(row => [...row]);
  
  function backtrack(): boolean {
    const empty = findEmpty(solution);
    if (!empty) return true;

    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
      if (isValid(solution, row, col, num)) {
        solution[row][col] = num;
        if (backtrack()) return true;
        solution[row][col] = 0;
      }
    }
    return false;
  }

  backtrack();
  return solution;
}

// Check if puzzle has unique solution
export function ensureUniqueSolution(grid: Grid): boolean {
  const solution = solve(grid);
  if (!solution) return false;

  // Try to find another solution by starting with different numbers
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (num !== solution[row][col] && isValid(grid, row, col, num)) {
            const testGrid = grid.map(r => [...r]);
            testGrid[row][col] = num;
            const testSolution = solve(testGrid);
            if (testSolution && JSON.stringify(testSolution) !== JSON.stringify(solution)) {
              return false; // Multiple solutions found
            }
          }
        }
      }
    }
  }
  return true;
}

// Rate difficulty based on solving techniques required
export function rateDifficulty(grid: Grid): Difficulty {
  const givens = grid.flat().filter(cell => cell !== 0).length;
  
  if (givens >= 50) return 'easy';
  if (givens >= 35) return 'medium';
  if (givens >= 25) return 'hard';
  return 'expert';
}

// Generate a complete Sudoku solution
function generateSolution(): Grid {
  const grid: Grid = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first (these are independent)
  for (let box = 0; box < 9; box += 4) {
    const startRow = Math.floor(box / 3) * 3;
    const startCol = (box % 3) * 3;
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        grid[startRow + i][startCol + j] = numbers.splice(randomIndex, 1)[0];
      }
    }
  }
  
  // Solve the rest
  return solve(grid);
}

// Remove numbers to create puzzle
function createPuzzle(solution: Grid, targetGivens: number): Grid {
  const puzzle = solution.map(row => [...row]);
  const cells = [];
  
  // Create list of all cell positions
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push([i, j]);
    }
  }
  
  // Randomly remove cells until we reach target givens
  while (cells.length > targetGivens) {
    const randomIndex = Math.floor(Math.random() * cells.length);
    const [row, col] = cells.splice(randomIndex, 1)[0];
    puzzle[row][col] = 0;
  }
  
  return puzzle;
}

// Generate puzzle with specified difficulty
export function generate(difficulty: Difficulty): GenerationResult {
  const difficultySettings = {
    easy: { minGivens: 45, maxGivens: 55 },
    medium: { minGivens: 35, maxGivens: 45 },
    hard: { minGivens: 25, maxGivens: 35 },
    expert: { minGivens: 20, maxGivens: 25 }
  };
  
  const settings = difficultySettings[difficulty];
  const targetGivens = Math.floor(Math.random() * (settings.maxGivens - settings.minGivens + 1)) + settings.minGivens;
  
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    const solution = generateSolution();
    const puzzle = createPuzzle(solution, targetGivens);
    
    if (ensureUniqueSolution(puzzle)) {
      return {
        puzzle,
        solution,
        givens: targetGivens
      };
    }
    
    attempts++;
  }
  
  // Fallback: return a valid puzzle even if not optimal
  const solution = generateSolution();
  const puzzle = createPuzzle(solution, targetGivens);
  
  return {
    puzzle,
    solution,
    givens: targetGivens
  };
}

// Generate puzzle from seed
export function generateFromSeed(seed: string, difficulty: Difficulty): GenerationResult {
  // Use seed to ensure consistent generation
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Set random seed
  const originalRandom = Math.random;
  let seedValue = Math.abs(hash);
  
  Math.random = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
  
  try {
    return generate(difficulty);
  } finally {
    Math.random = originalRandom;
  }
}

// Check if grid is complete and valid
export function isComplete(grid: Grid): boolean {
  // Check if all cells are filled
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) return false;
    }
  }
  
  // Check if solution is valid
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = grid[i][j];
      grid[i][j] = 0;
      if (!isValid(grid, i, j, val)) {
        grid[i][j] = val;
        return false;
      }
      grid[i][j] = val;
    }
  }
  
  return true;
}

// Count mistakes in current grid
export function countMistakes(grid: Grid, originalPuzzle: Grid): number {
  let mistakes = 0;
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (originalPuzzle[i][j] === 0 && grid[i][j] !== 0) {
        const val = grid[i][j];
        grid[i][j] = 0;
        if (!isValid(grid, i, j, val)) {
          mistakes++;
        }
        grid[i][j] = val;
      }
    }
  }
  
  return mistakes;
}