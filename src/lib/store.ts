import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Grid } from './core-sudoku';

interface GameState {
  // Grid state
  grid: Grid;
  originalGrid: Grid;
  candidates: number[][][]; // 3D array: [row][col][candidates]
  
  // Game state
  selectedCell: [number, number] | null;
  noteMode: boolean;
  mistakes: number;
  hintsUsed: number;
  startTime: number | null;
  isComplete: boolean;
  
  // History for undo/redo
  history: {
    grid: Grid;
    candidates: number[][][];
    timestamp: number;
  }[];
  historyIndex: number;
  
  // Actions
  setGrid: (grid: Grid) => void;
  setOriginalGrid: (grid: Grid) => void;
  placeNumber: (row: number, col: number, value: number) => void;
  toggleCandidate: (row: number, col: number, value: number) => void;
  clearCell: (row: number, col: number) => void;
  setSelectedCell: (cell: [number, number] | null) => void;
  toggleNoteMode: () => void;
  incrementMistakes: () => void;
  incrementHints: () => void;
  startGame: () => void;
  completeGame: () => void;
  undo: () => void;
  redo: () => void;
  resetGame: () => void;
  saveToHistory: () => void;
}

const createEmptyGrid = (): Grid => Array(9).fill(0).map(() => Array(9).fill(0));
const createEmptyCandidates = (): number[][][] => 
  Array(9).fill(0).map(() => Array(9).fill(0).map(() => []));

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      grid: createEmptyGrid(),
      originalGrid: createEmptyGrid(),
      candidates: createEmptyCandidates(),
      selectedCell: null,
      noteMode: false,
      mistakes: 0,
      hintsUsed: 0,
      startTime: null,
      isComplete: false,
      history: [],
      historyIndex: -1,
      
      // Actions
      setGrid: (grid) => set({ grid }),
      
      setOriginalGrid: (grid) => set({ originalGrid: grid }),
      
      placeNumber: (row, col, value) => {
        const { grid, originalGrid, noteMode, candidates } = get();
        
        // Don't allow editing original numbers
        if (originalGrid[row][col] !== 0) return;
        
        const newGrid = grid.map(r => [...r]);
        const newCandidates = candidates.map(r => r.map(c => [...c]));
        
        if (noteMode) {
          // Toggle candidate
          const cellCandidates = newCandidates[row][col];
          const index = cellCandidates.indexOf(value);
          if (index > -1) {
            cellCandidates.splice(index, 1);
          } else {
            cellCandidates.push(value);
            cellCandidates.sort();
          }
          // Clear the cell if placing candidate
          newGrid[row][col] = 0;
        } else {
          // Place number
          newGrid[row][col] = value;
          // Clear candidates for this cell
          newCandidates[row][col] = [];
        }
        
        set({ grid: newGrid, candidates: newCandidates });
        get().saveToHistory();
      },
      
      toggleCandidate: (row, col, value) => {
        const { candidates, originalGrid } = get();
        
        // Don't allow editing original numbers
        if (originalGrid[row][col] !== 0) return;
        
        const newCandidates = candidates.map(r => r.map(c => [...c]));
        const cellCandidates = newCandidates[row][col];
        const index = cellCandidates.indexOf(value);
        
        if (index > -1) {
          cellCandidates.splice(index, 1);
        } else {
          cellCandidates.push(value);
          cellCandidates.sort();
        }
        
        set({ candidates: newCandidates });
        get().saveToHistory();
      },
      
      clearCell: (row, col) => {
        const { grid, originalGrid, candidates } = get();
        
        // Don't allow editing original numbers
        if (originalGrid[row][col] !== 0) return;
        
        const newGrid = grid.map(r => [...r]);
        const newCandidates = candidates.map(r => r.map(c => [...c]));
        
        newGrid[row][col] = 0;
        newCandidates[row][col] = [];
        
        set({ grid: newGrid, candidates: newCandidates });
        get().saveToHistory();
      },
      
      setSelectedCell: (cell) => set({ selectedCell: cell }),
      
      toggleNoteMode: () => set((state) => ({ noteMode: !state.noteMode })),
      
      incrementMistakes: () => set((state) => ({ mistakes: state.mistakes + 1 })),
      
      incrementHints: () => set((state) => ({ hintsUsed: state.hintsUsed + 1 })),
      
      startGame: () => set({ startTime: Date.now() }),
      
      completeGame: () => set({ isComplete: true }),
      
      saveToHistory: () => {
        const { grid, candidates, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        
        newHistory.push({
          grid: grid.map(r => [...r]),
          candidates: candidates.map(r => r.map(c => [...c])),
          timestamp: Date.now(),
        });
        
        // Keep only last 50 moves
        if (newHistory.length > 50) {
          newHistory.shift();
        }
        
        set({ 
          history: newHistory, 
          historyIndex: newHistory.length - 1 
        });
      },
      
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const previousState = history[historyIndex - 1];
          set({
            grid: previousState.grid.map(r => [...r]),
            candidates: previousState.candidates.map(r => r.map(c => [...c])),
            historyIndex: historyIndex - 1,
          });
        }
      },
      
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          set({
            grid: nextState.grid.map(r => [...r]),
            candidates: nextState.candidates.map(r => r.map(c => [...c])),
            historyIndex: historyIndex + 1,
          });
        }
      },
      
      resetGame: () => {
        const { originalGrid } = get();
        set({
          grid: originalGrid.map(r => [...r]),
          candidates: createEmptyCandidates(),
          selectedCell: null,
          noteMode: false,
          mistakes: 0,
          hintsUsed: 0,
          startTime: null,
          isComplete: false,
          history: [],
          historyIndex: -1,
        });
      },
    }),
    {
      name: 'sudoku-game-state',
      partialize: (state) => ({
        grid: state.grid,
        originalGrid: state.originalGrid,
        candidates: state.candidates,
        noteMode: state.noteMode,
        mistakes: state.mistakes,
        hintsUsed: state.hintsUsed,
        startTime: state.startTime,
        isComplete: state.isComplete,
      }),
    }
  )
);