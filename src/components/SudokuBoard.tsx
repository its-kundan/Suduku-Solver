"use client";

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface SudokuBoardProps {
  className?: string;
}

export function SudokuBoard({ className }: SudokuBoardProps) {
  const {
    grid,
    selectedCell,
    selectCell,
    setCellValue,
    clearCell,
    toggleCandidate,
    noteMode,
  } = useGameStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const cell = grid[row][col];

    if (cell.given) return;

    if (event.key >= '1' && event.key <= '9') {
      const value = parseInt(event.key);
      if (noteMode) {
        toggleCandidate(row, col, value);
      } else {
        setCellValue(row, col, value);
      }
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      clearCell(row, col);
    } else if (event.key === 'ArrowUp' && row > 0) {
      selectCell(row - 1, col);
    } else if (event.key === 'ArrowDown' && row < 8) {
      selectCell(row + 1, col);
    } else if (event.key === 'ArrowLeft' && col > 0) {
      selectCell(row, col - 1);
    } else if (event.key === 'ArrowRight' && col < 8) {
      selectCell(row, col + 1);
    }
  }, [selectedCell, grid, noteMode, selectCell, setCellValue, clearCell, toggleCandidate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCellClick = (row: number, col: number) => {
    selectCell(row, col);
  };

  const handleNumberClick = (value: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const cell = grid[row][col];
    
    if (cell.given) return;

    if (noteMode) {
      toggleCandidate(row, col, value);
    } else {
      setCellValue(row, col, value);
    }
  };

  const renderCell = (row: number, col: number) => {
    const cell = grid[row][col];
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isInSameRow = selectedCell?.row === row;
    const isInSameCol = selectedCell?.col === col;
    const isInSameBox = 
      Math.floor(row / 3) === Math.floor(selectedCell?.row! / 3) &&
      Math.floor(col / 3) === Math.floor(selectedCell?.col! / 3);

    const cellClasses = cn(
      'sudoku-cell relative cursor-pointer transition-all duration-200',
      {
        'given': cell.given,
        'selected': isSelected,
        'bg-primary/10': isSelected,
        'bg-muted/30': (isInSameRow || isInSameCol || isInSameBox) && !isSelected,
        'conflict': cell.conflict,
        'ring-2 ring-primary': isSelected,
        'ring-1 ring-primary/50': (isInSameRow || isInSameCol || isInSameBox) && !isSelected,
      }
    );

    return (
      <motion.div
        key={`${row}-${col}`}
        className={cellClasses}
        onClick={() => handleCellClick(row, col)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        {cell.value !== 0 ? (
          <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
            {cell.value}
          </span>
        ) : cell.candidates.size > 0 ? (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-xs text-muted-foreground p-1">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
              <div
                key={num}
                className="flex items-center justify-center"
              >
                {cell.candidates.has(num) && num}
              </div>
            ))}
          </div>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* Sudoku Grid */}
      <div className="relative">
        <div className="grid grid-cols-9 grid-rows-9 gap-0.5 bg-border rounded-lg p-2">
          {grid.map((row, rowIndex) =>
            row.map((_, colIndex) => renderCell(rowIndex, colIndex))
          )}
        </div>
        
        {/* Box borders */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 w-full h-0.5 bg-border" />
          <div className="absolute top-2/3 left-0 w-full h-0.5 bg-border" />
          <div className="absolute top-0 left-1/3 w-0.5 h-full bg-border" />
          <div className="absolute top-0 left-2/3 w-0.5 h-full bg-border" />
        </div>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-9 gap-2">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <motion.button
            key={num}
            className={cn(
              "sudoku-cell bg-background border border-border hover:bg-accent hover:text-accent-foreground",
              "transition-colors duration-200"
            )}
            onClick={() => handleNumberClick(num)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {num}
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            noteMode 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
          onClick={() => useGameStore.getState().toggleNoteMode()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {noteMode ? "Note Mode: ON" : "Note Mode: OFF"}
        </motion.button>
        
        <motion.button
          className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          onClick={() => {
            if (selectedCell) {
              clearCell(selectedCell.row, selectedCell.col);
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear
        </motion.button>
      </div>
    </div>
  );
}