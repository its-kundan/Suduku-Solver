"use client";

import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { Grid } from '@/lib/core-sudoku';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  RotateCcw, 
  RotateCw, 
  BookOpen, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface EnhancedSudokuBoardProps {
  className?: string;
  onComplete?: () => void;
  showHints?: boolean;
  showNotes?: boolean;
}

export function EnhancedSudokuBoard({ 
  className, 
  onComplete, 
  showHints = true,
  showNotes = true 
}: EnhancedSudokuBoardProps) {
  const {
    grid,
    originalGrid,
    candidates,
    selectedCell,
    noteMode,
    mistakes,
    hintsUsed,
    setSelectedCell,
    placeNumber,
    toggleCandidate,
    clearCell,
    toggleNoteMode,
    incrementHints,
    undo,
    redo,
  } = useGameStore();

  const [showConflicts, setShowConflicts] = useState(true);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell([row, col]);
  }, [setSelectedCell]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;
    const key = event.key;

    if (key >= '1' && key <= '9') {
      const value = parseInt(key);
      if (noteMode) {
        toggleCandidate(row, col, value);
      } else {
        placeNumber(row, col, value);
      }
    } else if (key === '0' || key === 'Backspace' || key === 'Delete') {
      clearCell(row, col);
    } else if (key === 'ArrowUp' && row > 0) {
      setSelectedCell([row - 1, col]);
    } else if (key === 'ArrowDown' && row < 8) {
      setSelectedCell([row + 1, col]);
    } else if (key === 'ArrowLeft' && col > 0) {
      setSelectedCell([row, col - 1]);
    } else if (key === 'ArrowRight' && col < 8) {
      setSelectedCell([row, col - 1]);
    } else if (key === 'n' || key === 'N') {
      toggleNoteMode();
    }
  }, [selectedCell, noteMode, placeNumber, toggleCandidate, clearCell, setSelectedCell, toggleNoteMode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const isSelected = (row: number, col: number) => {
    return selectedCell?.[0] === row && selectedCell?.[1] === col;
  };

  const isInSameRow = (row: number) => {
    return selectedCell?.[0] === row;
  };

  const isInSameCol = (col: number) => {
    return selectedCell?.[1] === col;
  };

  const isInSameBox = (row: number, col: number) => {
    if (!selectedCell) return false;
    const [selectedRow, selectedCol] = selectedCell;
    const boxRow = Math.floor(selectedRow / 3);
    const boxCol = Math.floor(selectedCol / 3);
    return Math.floor(row / 3) === boxRow && Math.floor(col / 3) === boxCol;
  };

  const isOriginal = (row: number, col: number) => {
    return originalGrid[row][col] !== 0;
  };

  const hasConflict = (row: number, col: number, value: number) => {
    if (value === 0 || !showConflicts) return false;
    
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === value) return true;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === value) return true;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const checkRow = boxRow + i;
        const checkCol = boxCol + j;
        if ((checkRow !== row || checkCol !== col) && grid[checkRow][checkCol] === value) {
          return true;
        }
      }
    }
    
    return false;
  };

  const getCellBackground = (row: number, col: number) => {
    if (isSelected(row, col)) {
      return 'bg-blue-100 dark:bg-blue-900';
    }
    if (isInSameRow(row) || isInSameCol(col) || isInSameBox(row, col)) {
      return 'bg-blue-50 dark:bg-blue-950';
    }
    if (hasConflict(row, col, grid[row][col])) {
      return 'bg-red-100 dark:bg-red-900';
    }
    if (isOriginal(row, col)) {
      return 'bg-gray-100 dark:bg-gray-800';
    }
    return 'bg-white dark:bg-gray-900';
  };

  const getCellTextColor = (row: number, col: number) => {
    if (isOriginal(row, col)) {
      return 'text-gray-900 dark:text-gray-100 font-bold';
    }
    if (hasConflict(row, col, grid[row][col])) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-700 dark:text-gray-300';
  };

  const handleHint = () => {
    if (selectedCell) {
      incrementHints();
      // Logic to provide hint would go here
    }
  };

  const handleNumberClick = (number: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (noteMode) {
        toggleCandidate(row, col, number);
      } else {
        placeNumber(row, col, number);
      }
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* Game Controls */}
      <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <button
          onClick={toggleNoteMode}
          className={cn(
            "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
            noteMode 
              ? "bg-blue-500 text-white" 
              : "bg-white/20 text-white hover:bg-white/30"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Notes
        </button>
        
        {showHints && (
          <button
            onClick={handleHint}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Hint ({3 - hintsUsed} left)
          </button>
        )}
        
        <button
          onClick={undo}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Undo
        </button>
        
        <button
          onClick={redo}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Redo
        </button>
        
        <button
          onClick={() => setShowConflicts(!showConflicts)}
          className={cn(
            "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
            showConflicts 
              ? "bg-orange-500 text-white" 
              : "bg-white/20 text-white hover:bg-white/30"
          )}
        >
          <AlertCircle className="w-4 h-4" />
          Conflicts
        </button>
      </div>

      {/* Sudoku Grid */}
      <div className="grid grid-cols-9 grid-rows-9 gap-0.5 border-4 border-gray-800 dark:border-gray-200 rounded-lg overflow-hidden shadow-2xl">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-12 h-12 flex items-center justify-center relative cursor-pointer transition-all duration-200",
                getCellBackground(rowIndex, colIndex),
                (rowIndex % 3 === 0 && 'border-t-2') || '',
                (colIndex % 3 === 0 && 'border-l-2') || '',
                (rowIndex + 1) % 3 === 0 && 'border-b-2',
                (colIndex + 1) % 3 === 0 && 'border-r-2',
                'border-gray-300 dark:border-gray-600'
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cell !== 0 ? (
                <motion.span
                  key={cell}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn("text-lg font-semibold", getCellTextColor(rowIndex, colIndex))}
                >
                  {cell}
                </motion.span>
              ) : (
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
                  {candidates[rowIndex][colIndex].map((candidate) => (
                    <span
                      key={candidate}
                      className="text-xs text-gray-500 dark:text-gray-400 text-center leading-none"
                    >
                      {candidate}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Conflict indicator */}
              {hasConflict(rowIndex, colIndex, cell) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <XCircle className="w-2 h-2 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <motion.button
            key={number}
            onClick={() => handleNumberClick(number)}
            className={cn(
              "w-12 h-12 rounded-lg font-semibold text-lg transition-all",
              highlightedNumber === number
                ? "bg-blue-500 text-white scale-110"
                : "bg-white/20 text-white hover:bg-white/30 hover:scale-105"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onHoverStart={() => setHighlightedNumber(number)}
            onHoverEnd={() => setHighlightedNumber(null)}
          >
            {number}
          </motion.button>
        ))}
      </div>

      {/* Game Stats */}
      <div className="flex items-center gap-6 text-white/80">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400" />
          <span>Mistakes: {mistakes}</span>
        </div>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span>Hints: {hintsUsed}</span>
        </div>
      </div>
    </div>
  );
}
