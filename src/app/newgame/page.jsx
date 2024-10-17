"use client";
import React, { useState } from 'react';
import {Cover} from '@/components/ui/cover';

const SudokuSolver = () => {
  // Initialize a 9x9 grid with empty values and invalid cells tracking
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [invalidCells, setInvalidCells] = useState(Array(9).fill().map(() => Array(9).fill(false)));
  const [difficulty, setDifficulty] = useState('easy');

  const fetchSudoku = async (level) => {
    const url = `https://sudoku-api.deta.dev/sudoku?difficulty=${level}`;
    const response = await fetch(url);
    const data = await response.json();
    setGrid(data.sudoku);
    setInvalidCells(Array(9).fill().map(() => Array(9).fill(false))); // Reset invalid cells
  };

  // Function to check if a number already exists in the row, column, or 3x3 subgrid
  const checkForDuplicates = (row, col, value) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === value) {
        return true;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === value) {
        return true;
      }
    }

    // Check 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const subGridRow = startRow + i;
        const subGridCol = startCol + j;
        if ((subGridRow !== row || subGridCol !== col) && grid[subGridRow][subGridCol] === value) {
          return true;
        }
      }
    }

    return false;
  };

  // Function to handle user input in the grid
  const handleInputChange = (row, col, value) => {
    const newGrid = [...grid];
    const newInvalidCells = [...invalidCells];

    // Check if the input is valid (1-9 or empty)
    if (value === '' || /^[1-9]$/.test(value)) {
      newGrid[row][col] = value;
      newInvalidCells[row][col] = false; // Reset invalid state for this cell

      // Check for duplicates in row, column, and 3x3 subgrid
      if (value !== '' && checkForDuplicates(row, col, value)) {
        alert('Duplicate number found! Same number exists in the row, column, or subgrid.');
        newInvalidCells[row][col] = true; // Mark the cell as invalid
      }
    } else {
      alert('Invalid input! Only numbers between 1 and 9 are allowed.');
      newInvalidCells[row][col] = true; // Mark as invalid for wrong input
    }

    setGrid(newGrid);
    setInvalidCells(newInvalidCells);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-none dark:bg-none">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        <Cover> Sudoku Solver </Cover>
      </h1>
      <div className="flex justify-center mb-4">
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="border border-gray-300 rounded px-4 py-2">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
        <button onClick={() => fetchSudoku(difficulty)} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700">
          New Game
        </button>
      </div>
      <div className="grid grid-cols-9 grid-rows-9 gap-1 border-4 border-black dark:border-gray-500">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength="1"
              value={cell}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              onKeyPress={(e) => {
                if (!/[1-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`w-10 h-10 text-center border border-gray-500 dark:border-gray-400 text-lg font-bold
                ${rowIndex % 3 === 0 && 'border-t-2'}
                ${colIndex % 3 === 0 && 'border-l-2'}
                ${(rowIndex + 1) % 3 === 0 && 'border-b-2'}
                ${(colIndex + 1) % 3 === 0 && 'border-r-2'}
                bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none
                ${invalidCells[rowIndex][colIndex] ? 'bg-red-200 dark:bg-red-400' : ''}`} // Highlight invalid cells
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SudokuSolver;
