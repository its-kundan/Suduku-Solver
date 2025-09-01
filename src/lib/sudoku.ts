export interface SudokuPuzzle {
  puzzle: number[][];
  solution: number[][];
  difficulty: string;
}

export type Difficulty = "easy" | "medium" | "hard" | "expert";

// Simple Sudoku generator using seed
export function generateFromSeed(seed: number, difficulty: Difficulty = "medium"): SudokuPuzzle {
  // Use seed to generate a deterministic puzzle
  const random = seededRandom(seed);
  
  // Generate a solved Sudoku grid
  const solution = generateSolvedGrid(random);
  
  // Remove numbers to create puzzle based on difficulty
  const puzzle = createPuzzle(solution, random, difficulty);
  
  return {
    puzzle,
    solution,
    difficulty,
  };
}

function seededRandom(seed: number) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function generateSolvedGrid(random: () => number): number[][] {
  const grid = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first (these can be filled independently)
  for (let box = 0; box < 9; box += 4) {
    fillBox(grid, box, random);
  }
  
  // Solve the rest using backtracking
  solveSudoku(grid);
  
  return grid;
}

function fillBox(grid: number[][], box: number, random: () => number) {
  const startRow = Math.floor(box / 3) * 3;
  const startCol = (box % 3) * 3;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Shuffle numbers
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  // Fill the box
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[startRow + i][startCol + j] = numbers[i * 3 + j];
    }
  }
}

function solveSudoku(grid: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
}

function createPuzzle(solution: number[][], random: () => number, difficulty: Difficulty): number[][] {
  const puzzle = solution.map(row => [...row]);
  
  // Determine cells to remove based on difficulty
  let cellsToRemove: number;
  switch (difficulty) {
    case "easy":
      cellsToRemove = 30 + Math.floor(random() * 10); // 30-39 cells
      break;
    case "medium":
      cellsToRemove = 40 + Math.floor(random() * 10); // 40-49 cells
      break;
    case "hard":
      cellsToRemove = 50 + Math.floor(random() * 10); // 50-59 cells
      break;
    case "expert":
      cellsToRemove = 60 + Math.floor(random() * 10); // 60-69 cells
      break;
    default:
      cellsToRemove = 45; // Default to medium
  }
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(random() * 9);
    const col = Math.floor(random() * 9);
    
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return puzzle;
}
