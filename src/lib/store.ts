import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Grid } from './core-sudoku';

export interface Cell {
  value: number;
  given: boolean;
  candidates: Set<number>;
  conflict: boolean;
}

export interface GameState {
  grid: Cell[][];
  selectedCell: { row: number; col: number } | null;
  noteMode: boolean;
  mistakes: number;
  hintsUsed: number;
  startTime: number | null;
  elapsedTime: number;
  isPaused: boolean;
  history: Array<{
    grid: Cell[][];
    selectedCell: { row: number; col: number } | null;
    timestamp: number;
  }>;
  historyIndex: number;
  puzzleId: string | null;
  difficulty: string | null;
}

export interface GameActions {
  // Grid management
  initializeGrid: (puzzle: Grid, solution: Grid, puzzleId: string, difficulty: string) => void;
  setCellValue: (row: number, col: number, value: number) => void;
  clearCell: (row: number, col: number) => void;
  toggleCandidate: (row: number, col: number, value: number) => void;
  
  // Selection
  selectCell: (row: number, col: number) => void;
  clearSelection: () => void;
  
  // Game state
  toggleNoteMode: () => void;
  incrementMistakes: () => void;
  incrementHints: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  updateElapsedTime: (time: number) => void;
  
  // History
  saveState: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Reset
  resetGame: () => void;
  
  // Validation
  checkConflicts: () => void;
  clearConflicts: () => void;
}

const createEmptyGrid = (): Cell[][] => {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
      value: 0,
      given: false,
      candidates: new Set(),
      conflict: false,
    }))
  );
};

const createCellFromValue = (value: number, given: boolean): Cell => ({
  value,
  given,
  candidates: new Set(),
  conflict: false,
});

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      // Initial state
      grid: createEmptyGrid(),
      selectedCell: null,
      noteMode: false,
      mistakes: 0,
      hintsUsed: 0,
      startTime: null,
      elapsedTime: 0,
      isPaused: false,
      history: [],
      historyIndex: -1,
      puzzleId: null,
      difficulty: null,

      // Grid management
      initializeGrid: (puzzle: Grid, solution: Grid, puzzleId: string, difficulty: string) => {
        const grid = puzzle.map((row, rowIndex) =>
          row.map((value, colIndex) =>
            createCellFromValue(value, value !== 0)
          )
        );

        set({
          grid,
          selectedCell: null,
          noteMode: false,
          mistakes: 0,
          hintsUsed: 0,
          startTime: Date.now(),
          elapsedTime: 0,
          isPaused: false,
          history: [],
          historyIndex: -1,
          puzzleId,
          difficulty,
        });
      },

      setCellValue: (row: number, col: number, value: number) => {
        const { grid, noteMode, selectedCell } = get();
        
        if (grid[row][col].given) return;

        const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
        
        if (noteMode) {
          // Toggle candidate
          const cell = newGrid[row][col];
          if (cell.candidates.has(value)) {
            cell.candidates.delete(value);
          } else {
            cell.candidates.add(value);
          }
        } else {
          // Set value
          newGrid[row][col] = {
            ...newGrid[row][col],
            value,
            candidates: new Set(),
            conflict: false,
          };
        }

        set({ grid: newGrid });
        get().saveState();
        get().checkConflicts();
      },

      clearCell: (row: number, col: number) => {
        const { grid } = get();
        
        if (grid[row][col].given) return;

        const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
        newGrid[row][col] = {
          ...newGrid[row][col],
          value: 0,
          candidates: new Set(),
          conflict: false,
        };

        set({ grid: newGrid });
        get().saveState();
        get().checkConflicts();
      },

      toggleCandidate: (row: number, col: number, value: number) => {
        const { grid } = get();
        
        if (grid[row][col].given) return;

        const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
        const cell = newGrid[row][col];
        
        if (cell.candidates.has(value)) {
          cell.candidates.delete(value);
        } else {
          cell.candidates.add(value);
        }

        set({ grid: newGrid });
        get().saveState();
      },

      // Selection
      selectCell: (row: number, col: number) => {
        set({ selectedCell: { row, col } });
      },

      clearSelection: () => {
        set({ selectedCell: null });
      },

      // Game state
      toggleNoteMode: () => {
        set(state => ({ noteMode: !state.noteMode }));
      },

      incrementMistakes: () => {
        set(state => ({ mistakes: state.mistakes + 1 }));
      },

      incrementHints: () => {
        set(state => ({ hintsUsed: state.hintsUsed + 1 }));
      },

      startTimer: () => {
        set({ startTime: Date.now(), isPaused: false });
      },

      pauseTimer: () => {
        set({ isPaused: true });
      },

      resumeTimer: () => {
        set({ isPaused: false });
      },

      updateElapsedTime: (time: number) => {
        set({ elapsedTime: time });
      },

      // History
      saveState: () => {
        const { grid, selectedCell, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        
        newHistory.push({
          grid: grid.map(row => row.map(cell => ({
            ...cell,
            candidates: new Set(cell.candidates),
          }))),
          selectedCell,
          timestamp: Date.now(),
        });

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const previousState = history[historyIndex - 1];
          set({
            grid: previousState.grid,
            selectedCell: previousState.selectedCell,
            historyIndex: historyIndex - 1,
          });
          get().checkConflicts();
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          set({
            grid: nextState.grid,
            selectedCell: nextState.selectedCell,
            historyIndex: historyIndex + 1,
          });
          get().checkConflicts();
        }
      },

      canUndo: () => {
        return get().historyIndex > 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      // Reset
      resetGame: () => {
        set({
          grid: createEmptyGrid(),
          selectedCell: null,
          noteMode: false,
          mistakes: 0,
          hintsUsed: 0,
          startTime: null,
          elapsedTime: 0,
          isPaused: false,
          history: [],
          historyIndex: -1,
          puzzleId: null,
          difficulty: null,
        });
      },

      // Validation
      checkConflicts: () => {
        const { grid } = get();
        const newGrid = grid.map(row => row.map(cell => ({ ...cell, conflict: false })));

        // Check for conflicts
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (newGrid[row][col].value !== 0) {
              const value = newGrid[row][col].value;
              
              // Check row
              for (let c = 0; c < 9; c++) {
                if (c !== col && newGrid[row][c].value === value) {
                  newGrid[row][col].conflict = true;
                  newGrid[row][c].conflict = true;
                }
              }

              // Check column
              for (let r = 0; r < 9; r++) {
                if (r !== row && newGrid[r][col].value === value) {
                  newGrid[row][col].conflict = true;
                  newGrid[r][col].conflict = true;
                }
              }

              // Check 3x3 box
              const boxRow = Math.floor(row / 3) * 3;
              const boxCol = Math.floor(col / 3) * 3;
              for (let r = boxRow; r < boxRow + 3; r++) {
                for (let c = boxCol; c < boxCol + 3; c++) {
                  if ((r !== row || c !== col) && newGrid[r][c].value === value) {
                    newGrid[row][col].conflict = true;
                    newGrid[r][c].conflict = true;
                  }
                }
              }
            }
          }
        }

        set({ grid: newGrid });
      },

      clearConflicts: () => {
        const { grid } = get();
        const newGrid = grid.map(row => row.map(cell => ({ ...cell, conflict: false })));
        set({ grid: newGrid });
      },
    }),
    {
      name: 'sudoku-game-state',
      partialize: (state) => ({
        grid: state.grid,
        selectedCell: state.selectedCell,
        noteMode: state.noteMode,
        mistakes: state.mistakes,
        hintsUsed: state.hintsUsed,
        elapsedTime: state.elapsedTime,
        puzzleId: state.puzzleId,
        difficulty: state.difficulty,
      }),
    }
  )
);