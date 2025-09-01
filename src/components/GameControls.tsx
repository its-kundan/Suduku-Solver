"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Undo2, 
  Redo2, 
  Lightbulb, 
  Edit3, 
  Clock, 
  XCircle,
  RotateCcw
} from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';

interface GameControlsProps {
  className?: string;
  onHint?: () => void;
  onReset?: () => void;
}

export function GameControls({ className, onHint, onReset }: GameControlsProps) {
  const {
    noteMode,
    mistakes,
    hintsUsed,
    startTime,
    isComplete,
    toggleNoteMode,
    undo,
    redo,
    history,
    historyIndex,
  } = useGameStore();

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime || isComplete) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Timer and Stats */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-white/70" />
          <span className="text-lg font-mono text-white">
            {formatTime(elapsedTime)}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-white font-medium">{mistakes}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">{hintsUsed}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Note Mode Toggle */}
        <motion.button
          onClick={toggleNoteMode}
          className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
            noteMode 
              ? "bg-blue-500/20 border-blue-400/50 text-blue-300" 
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Edit3 className="w-5 h-5" />
          <span className="text-sm font-medium">Notes</span>
        </motion.button>

        {/* Hint Button */}
        <motion.button
          onClick={onHint}
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/30 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-medium">Hint</span>
        </motion.button>

        {/* Undo Button */}
        <motion.button
          onClick={undo}
          disabled={!canUndo}
          className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
            canUndo
              ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              : "bg-white/5 border-white/5 text-white/30 cursor-not-allowed"
          )}
          whileHover={canUndo ? { scale: 1.02 } : {}}
          whileTap={canUndo ? { scale: 0.98 } : {}}
        >
          <Undo2 className="w-5 h-5" />
          <span className="text-sm font-medium">Undo</span>
        </motion.button>

        {/* Redo Button */}
        <motion.button
          onClick={redo}
          disabled={!canRedo}
          className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200",
            canRedo
              ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              : "bg-white/5 border-white/5 text-white/30 cursor-not-allowed"
          )}
          whileHover={canRedo ? { scale: 1.02 } : {}}
          whileTap={canRedo ? { scale: 0.98 } : {}}
        >
          <Redo2 className="w-5 h-5" />
          <span className="text-sm font-medium">Redo</span>
        </motion.button>
      </div>

      {/* Reset Button */}
      <motion.button
        onClick={onReset}
        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RotateCcw className="w-5 h-5" />
        <span className="text-sm font-medium">Reset Game</span>
      </motion.button>
    </div>
  );
}