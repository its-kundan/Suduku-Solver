"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { SudokuBoard } from '@/components/SudokuBoard';
import { GameControls } from '@/components/GameControls';
import { isComplete } from '@/lib/core-sudoku';
import { formatTime } from '@/lib/utils';
import { Trophy, Share2, Home } from 'lucide-react';
import Link from 'next/link';

interface DailyPuzzle {
  puzzleId: string;
  puzzle: number[][];
  difficulty: string;
  dateKey: string;
}

export default function DailyPlayPage() {
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [playId, setPlayId] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [completionScore, setCompletionScore] = useState(0);

  const {
    grid,
    originalGrid,
    mistakes,
    hintsUsed,
    startTime,
    setGrid,
    setOriginalGrid,
    startGame,
    resetGame,
  } = useGameStore();

  // Fetch daily puzzle
  useEffect(() => {
    const fetchDailyPuzzle = async () => {
      try {
        const response = await fetch('/api/daily');
        if (response.ok) {
          const data = await response.json();
          setPuzzle(data);
          setGrid(data.puzzle);
          setOriginalGrid(data.puzzle);
        }
      } catch (error) {
        console.error('Error fetching daily puzzle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyPuzzle();
  }, [setGrid, setOriginalGrid]);

  // Start play session
  useEffect(() => {
    if (puzzle && !playId) {
      const startPlay = async () => {
        try {
          const response = await fetch('/api/play/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ puzzleId: puzzle.puzzleId }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setPlayId(data.playId);
            startGame();
          }
        } catch (error) {
          console.error('Error starting play:', error);
        }
      };

      startPlay();
    }
  }, [puzzle, playId, startGame]);

  // Check for completion
  useEffect(() => {
    if (isComplete(grid) && !showComplete && startTime) {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      setCompletionTime(timeElapsed);
      setShowComplete(true);
      
      // Submit completion
      if (playId) {
        submitCompletion(timeElapsed);
      }
    }
  }, [grid, showComplete, startTime, playId]);

  const submitCompletion = async (timeElapsed: number) => {
    try {
      const response = await fetch('/api/play/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playId,
          seconds: timeElapsed,
          mistakes,
          hintsUsed,
          finalGrid: grid,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCompletionScore(data.score);
      }
    } catch (error) {
      console.error('Error submitting completion:', error);
    }
  };

  const handleHint = () => {
    // TODO: Implement hint logic
    console.log('Hint requested');
  };

  const handleReset = () => {
    resetGame();
    setShowComplete(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Sudoku Complete!',
          text: `I completed today's ${puzzle?.difficulty} Sudoku in ${formatTime(completionTime)} with ${mistakes} mistakes!`,
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `I completed today's ${puzzle?.difficulty} Sudoku in ${formatTime(completionTime)} with ${mistakes} mistakes!`;
      await navigator.clipboard.writeText(text);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md w-full"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto"
            >
              <Trophy className="w-10 h-10 text-yellow-400" />
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Puzzle Complete!</h1>
                              <p className="text-white/70">Congratulations on completing today&apos;s puzzle!</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Time:</span>
                <span className="text-white font-mono">{formatTime(completionTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Mistakes:</span>
                <span className="text-white">{mistakes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Hints Used:</span>
                <span className="text-white">{hintsUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Score:</span>
                <span className="text-white font-bold">{completionScore}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
              
              <Link href="/">
                <motion.button
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="w-4 h-4" />
                  Home
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Daily Sudoku</h1>
          <p className="text-white/70">
            {puzzle?.difficulty} • {puzzle?.dateKey}
          </p>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Sudoku Board */}
          <div className="lg:col-span-2 flex justify-center">
            <SudokuBoard />
          </div>

          {/* Game Controls */}
          <div className="lg:col-span-1">
            <GameControls
              onHint={handleHint}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}