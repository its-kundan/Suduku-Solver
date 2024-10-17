import React from 'react';
import Head from 'next/head';

const HowToPlaySudoku = () => {
  return (
    <>
      <Head>
        <title>How to Play Sudoku</title>
      </Head>
      <div className="bg-gray-100 p-5 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold text-center mb-4">How to Play Sudoku</h1>
          <p className="text-gray-700">
            Sudoku is a logic-based, combinatorial number-placement puzzle. The objective is to fill a 9X9 grid with digits so that each column, each row, and each of the nine 3X3 subgrids that compose the grid (also called &quote;boxes&quote;, &quote;blocks&quote;, or &quote;regions&quote;) contains all of the digits from 1 to 9. The puzzle starts with a partially completed grid, which typically has a unique solution.
          </p>
          <h2 className="text-xl font-semibold mt-5">Rules</h2>
          <ul className="list-disc list-inside">
            <li>Each row must contain the numbers 1 to 9, without repetitions.</li>
            <li>Each column must also contain the numbers 1 to 9, without repetitions.</li>
            <li>The digits can only occur once per 3×3 subgrid.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Begin by placing numbers that are already defined in other rows or columns, and use process of elimination to figure out where the other numbers should go. Keep in mind that there should be no guesswork in Sudoku; every placement should be logically deducible.
          </p>
          <h2 className="text-xl font-semibold mt-5">Tips and Strategies</h2>
          <ul className="list-disc list-inside">
            <li>Start from numbers that appear frequently across different rows, columns, and blocks.</li>
            <li>Use pencil marks to note potential numbers for each cell if playing on paper.</li>
            <li>Focus on one number at a time when trying to place digits in the grid.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default HowToPlaySudoku;
