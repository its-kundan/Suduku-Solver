"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  XCircle, 
  Lightbulb, 
  Undo2, 
  Redo2, 
  Pause, 
  Play,
  RotateCcw
} from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameControlsProps {
  onFinish?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onRestart?: () => void;
}

export function GameControls({ 
  onFinish, 
  onPause, 
  onResume, 
  onRestart 
}: GameControlsProps) {
  const {
    mistakes,
    hintsUsed,
    elapsedTime,
    isPaused,
    startTime,
    canUndo,
    canRedo,
    undo,
    redo,
    incrementHints,
    pauseTimer,
    resumeTimer,
  } = useGameStore();

  const [currentTime, setCurrentTime] = useState(elapsedTime);

  useEffect(() => {
    if (!startTime || isPaused) return;

    const interval = setInterval(() => {
      const newTime = Math.floor((Date.now() - startTime) / 1000);
      setCurrentTime(newTime);
      useGameStore.getState().updateElapsedTime(newTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused]);

  const handleHint = () => {
    incrementHints();
    // TODO: Implement hint logic
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeTimer();
      onResume?.();
    } else {
      pauseTimer();
      onPause?.();
    }
  };

  return (
    <Card className="glass-card p-4">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Timer */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Clock className="h-5 w-5 text-primary" />
            <div className="text-lg font-mono font-semibold">
              {formatTime(currentTime)}
            </div>
          </motion.div>

          {/* Mistakes */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <XCircle className="h-5 w-5 text-destructive" />
            <div className="text-lg font-semibold">
              {mistakes}
            </div>
          </motion.div>

          {/* Hints Used */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Lightbulb className="h-5 w-5 text-warning" />
            <div className="text-lg font-semibold">
              {hintsUsed}
            </div>
          </motion.div>

          {/* Pause/Resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handlePauseResume}
              className="w-full"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo()}
            className="flex items-center space-x-1"
          >
            <Undo2 className="h-4 w-4" />
            <span className="hidden sm:inline">Undo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo()}
            className="flex items-center space-x-1"
          >
            <Redo2 className="h-4 w-4" />
            <span className="hidden sm:inline">Redo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleHint}
            className="flex items-center space-x-1"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Hint</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="flex items-center space-x-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Restart</span>
          </Button>
        </div>

        {/* Finish Button */}
        <div className="mt-4">
          <Button
            variant="premium"
            size="lg"
            onClick={onFinish}
            className="w-full"
          >
            Finish Puzzle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}