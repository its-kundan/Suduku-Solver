"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SudokuBoard } from '@/components/SudokuBoard';
import { GameControls } from '@/components/GameControls';
import { useGameStore } from '@/lib/store';
import { generateDailyPuzzle, generateDailySeed, type Grid } from '@/lib/core-sudoku';
import { getISTDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Trophy, Clock } from 'lucide-react';

export default function DailyPlayPage() {
  const [puzzle, setPuzzle] = useState<{
    puzzle: Grid;
    solution: Grid;
    difficulty: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { initializeGrid, grid, puzzleId } = useGameStore();

  useEffect(() => {
    const loadDailyPuzzle = async () => {
      try {
        // In a real app, this would fetch from the API
        // For now, we'll generate locally
        const today = getISTDate();
        const seed = generateDailySeed(today, 'medium');
        const generated = generateDailyPuzzle(seed, 'medium');
        
        setPuzzle({
          puzzle: generated.puzzle,
          solution: generated.solution,
          difficulty: generated.difficulty,
        });

        // Initialize the game store
        initializeGrid(
          generated.puzzle,
          generated.solution,
          `daily-${today}`,
          generated.difficulty
        );
      } catch (error) {
        console.error('Failed to load daily puzzle:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDailyPuzzle();
  }, [initializeGrid]);

  const handleFinish = () => {
    // TODO: Implement finish logic
    console.log('Finishing puzzle...');
  };

  const handlePause = () => {
    // TODO: Implement pause logic
    console.log('Pausing game...');
  };

  const handleResume = () => {
    // TODO: Implement resume logic
    console.log('Resuming game...');
  };

  const handleRestart = () => {
    if (puzzle) {
      initializeGrid(
        puzzle.puzzle,
        puzzle.solution,
        puzzleId || 'daily-restart',
        puzzle.difficulty
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading today's puzzle...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Daily Challenge</h1>
          <p className="text-muted-foreground text-lg">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <SudokuBoard />
          </motion.div>

          {/* Game Controls & Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Game Controls */}
            <GameControls
              onFinish={handleFinish}
              onPause={handlePause}
              onResume={handleResume}
              onRestart={handleRestart}
            />

            {/* Daily Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Today's Puzzle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-semibold capitalize">{puzzle?.difficulty}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Players Today:</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Best Time:</span>
                  <span className="font-semibold">2:34</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Streak:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Flame className="h-4 w-4 text-warning" />
                    5 days
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Puzzles:</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Time:</span>
                  <span className="font-semibold">4:23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Best Time:</span>
                  <span className="font-semibold">1:47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Level:</span>
                  <span className="font-semibold">Apprentice</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Today's Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Look for cells that have only one possible candidate. These are often the easiest to fill and can help you make progress quickly.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}