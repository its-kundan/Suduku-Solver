"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedSudokuBoard } from '@/components/EnhancedSudokuBoard';
import { BackgroundLines } from '@/components/ui/background-lines';
import { ArrowLeft, Brain, Clock, Target, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';

interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  estimatedTime: string;
  puzzlesCompleted: number;
  bestTime: string;
  isUnlocked: boolean;
}

const difficultyLevels: DifficultyLevel[] = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'Perfect for beginners. Learn the basics of Sudoku with simple patterns.',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-green-400 to-green-600',
    estimatedTime: '5-10 min',
    puzzlesCompleted: 12,
    bestTime: '4:32',
    isUnlocked: true,
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Challenge yourself with moderate complexity. Good for regular practice.',
    icon: <Target className="w-6 h-6" />,
    color: 'from-yellow-400 to-yellow-600',
    estimatedTime: '10-20 min',
    puzzlesCompleted: 8,
    bestTime: '12:45',
    isUnlocked: true,
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Advanced techniques required. Test your logical thinking skills.',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-orange-400 to-orange-600',
    estimatedTime: '20-40 min',
    puzzlesCompleted: 5,
    bestTime: '28:12',
    isUnlocked: true,
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Master level puzzles. Only for the most skilled players.',
    icon: <Trophy className="w-6 h-6" />,
    color: 'from-red-400 to-red-600',
    estimatedTime: '40+ min',
    puzzlesCompleted: 2,
    bestTime: '52:18',
    isUnlocked: true,
  },
];

export default function PracticeLevelsPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showGame, setShowGame] = useState(false);
  const { resetGame } = useGameStore();

  const handleStartGame = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setShowGame(true);
    resetGame();
  };

  const handleBackToLevels = () => {
    setShowGame(false);
    setSelectedDifficulty(null);
  };

  if (showGame && selectedDifficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <BackgroundLines className="absolute inset-0 z-0" />
        
        <div className="relative z-10">
          {/* Game Header */}
          <header className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToLevels}
                className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Levels
              </button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">
                  Practice Mode - {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                </h1>
                <p className="text-white/70">Take your time and practice your skills</p>
              </div>
              
              <div className="w-32"></div> {/* Spacer */}
            </div>
          </header>

          {/* Game Board */}
          <div className="container mx-auto px-4 py-8">
            <EnhancedSudokuBoard 
              className="max-w-4xl mx-auto"
              showHints={true}
              showNotes={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <BackgroundLines className="absolute inset-0 z-0" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </motion.button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                <Target className="w-8 h-8 text-blue-400" />
                Practice Levels
              </h1>
              <p className="text-white/70 mt-2">Choose your challenge level</p>
            </motion.div>
            
            <div className="w-32"></div> {/* Spacer */}
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Master Sudoku at Your Own
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Pace
              </span>
            </h2>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Practice makes perfect! Choose from four difficulty levels and improve your skills 
              with unlimited practice puzzles. Track your progress and beat your best times.
            </p>
          </motion.div>
        </section>

        {/* Difficulty Levels */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {difficultyLevels.map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={cn(
                    "bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all cursor-pointer",
                    !level.isUnlocked && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => level.isUnlocked && handleStartGame(level.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn(
                      "w-16 h-16 rounded-xl flex items-center justify-center text-white",
                      `bg-gradient-to-r ${level.color}`
                    )}>
                      {level.icon}
                    </div>
                    
                    {!level.isUnlocked && (
                      <div className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-sm">
                        Locked
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">{level.name}</h3>
                    <p className="text-white/70 leading-relaxed">{level.description}</p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-white/60 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Est. Time</span>
                        </div>
                        <p className="text-white font-semibold">{level.estimatedTime}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-white/60 mb-1">
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm">Completed</span>
                        </div>
                        <p className="text-white font-semibold">{level.puzzlesCompleted}</p>
                      </div>
                    </div>

                    {/* Best Time */}
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Best Time</span>
                        <span className="text-white font-semibold">{level.bestTime}</span>
                      </div>
                    </div>

                    {/* Start Button */}
                    {level.isUnlocked && (
                      <motion.button
                        className={cn(
                          "w-full py-3 px-6 rounded-xl font-semibold text-white transition-all",
                          `bg-gradient-to-r ${level.color} hover:shadow-lg`
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Start Practice
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-8">Track Your Progress</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Total Puzzles</h4>
                <p className="text-white/70">27 puzzles completed</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Average Time</h4>
                <p className="text-white/70">18 minutes per puzzle</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Best Time</h4>
                <p className="text-white/70">4:32 (Easy)</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Challenge Yourself?
            </h3>
            <p className="text-xl text-white/70 mb-8">
              Start with easy puzzles and work your way up to expert level. 
              Every puzzle solved makes you a better player.
            </p>
            <Link href="/play/daily">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Daily Challenge
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-white/10">
          <div className="text-center text-white/50">
            <p>&copy; 2024 Sudoku Premium. Built with Next.js and ❤️</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
