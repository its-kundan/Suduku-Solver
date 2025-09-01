"use client";

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { Grid } from '@/lib/core-sudoku';
import { cn } from '@/lib/utils';

interface SudokuBoardProps {
  className?: string;
  onComplete?: () => void;
}

export function SudokuBoard({ className, onComplete }: SudokuBoardProps) {
  const {
    grid,
    originalGrid,
    candidates,
    selectedCell,
    noteMode,
    setSelectedCell,
    placeNumber,
    toggleCandidate,
    clearCell,
  } = useGameStore();

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
      setSelectedCell([row, col + 1]);
    }
  }, [selectedCell, noteMode, placeNumber, toggleCandidate, clearCell, setSelectedCell]);

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
    if (value === 0) return false;
    
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
        const r = boxRow + i;
        const c = boxCol + j;
        if ((r !== row || c !== col) && grid[r][c] === value) return true;
      }
    }
    
    return false;
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="grid grid-cols-9 grid-rows-9 gap-0.5 bg-white/10 rounded-2xl p-2 backdrop-blur-sm border border-white/20">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const value = cell;
            const cellCandidates = candidates[rowIndex][colIndex];
            const isOriginalCell = isOriginal(rowIndex, colIndex);
            const isSelectedCell = isSelected(rowIndex, colIndex);
            const isHighlighted = isInSameRow(rowIndex) || isInSameCol(colIndex) || isInSameBox(rowIndex, colIndex);
            const hasConflictValue = hasConflict(rowIndex, colIndex, value);
            
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "relative w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200",
                  "border border-white/10",
                  // Border styling for 3x3 boxes
                  rowIndex % 3 === 0 && "border-t-2 border-t-white/30",
                  colIndex % 3 === 0 && "border-l-2 border-l-white/30",
                  (rowIndex + 1) % 3 === 0 && "border-b-2 border-b-white/30",
                  (colIndex + 1) % 3 === 0 && "border-r-2 border-r-white/30",
                  // Selection and highlighting
                  isSelectedCell && "bg-blue-500/30 border-blue-400/50 shadow-lg",
                  isHighlighted && !isSelectedCell && "bg-white/5",
                  // Original vs filled cells
                  isOriginalCell ? "bg-white/10" : "bg-transparent",
                  // Conflict styling
                  hasConflictValue && "bg-red-500/20 border-red-400/50",
                  // Hover effects
                  !isOriginalCell && "hover:bg-white/10"
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {value !== 0 ? (
                  <motion.span
                    className={cn(
                      "text-lg font-bold select-none",
                      isOriginalCell ? "text-white" : "text-blue-300",
                      hasConflictValue && "text-red-400"
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {value}
                  </motion.span>
                ) : (
                  <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <div
                        key={num}
                        className={cn(
                          "text-xs text-white/60 flex items-center justify-center",
                          cellCandidates.includes(num) && "text-white/90 font-medium"
                        )}
                      >
                        {cellCandidates.includes(num) ? num : ""}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
      
      {/* Note mode indicator */}
      <div className="flex items-center gap-2 text-sm text-white/70">
        <div className={cn(
          "w-3 h-3 rounded-full transition-colors",
          noteMode ? "bg-blue-400" : "bg-white/30"
        )} />
        <span>Note Mode: {noteMode ? "ON" : "OFF"}</span>
      </div>
    </div>
  );
}