"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, Users, Crown } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar?: string;
  score: number;
  time: number;
  mistakes: number;
  hintsUsed: number;
  streak: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  dateKey?: string;
  difficulty?: string;
  className?: string;
}

export function Leaderboard({ dateKey, difficulty = 'medium', className }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);

  // Mock data for demonstration
  useEffect(() => {
    const mockEntries: LeaderboardEntry[] = [
      {
        id: '1',
        rank: 1,
        username: 'SudokuMaster',
        score: 9500,
        time: 324,
        mistakes: 0,
        hintsUsed: 0,
        streak: 45,
        isCurrentUser: false,
      },
      {
        id: '2',
        rank: 2,
        username: 'PuzzlePro',
        score: 9200,
        time: 356,
        mistakes: 1,
        hintsUsed: 0,
        streak: 32,
        isCurrentUser: false,
      },
      {
        id: '3',
        rank: 3,
        username: 'GridGuru',
        score: 8900,
        time: 412,
        mistakes: 2,
        hintsUsed: 1,
        streak: 28,
        isCurrentUser: false,
      },
      {
        id: '4',
        rank: 4,
        username: 'NumberNinja',
        score: 8500,
        time: 445,
        mistakes: 3,
        hintsUsed: 1,
        streak: 21,
        isCurrentUser: false,
      },
      {
        id: '5',
        rank: 5,
        username: 'LogicLegend',
        score: 8200,
        time: 478,
        mistakes: 4,
        hintsUsed: 2,
        streak: 18,
        isCurrentUser: false,
      },
      {
        id: '6',
        rank: 6,
        username: 'You',
        score: 7800,
        time: 512,
        mistakes: 5,
        hintsUsed: 2,
        streak: 15,
        isCurrentUser: true,
      },
    ];

    setEntries(mockEntries);
    setLoading(false);
  }, [timeframe, selectedDifficulty]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-400">{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700';
    return 'bg-gray-600';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2"
        >
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboard
        </motion.h2>
        <p className="text-white/70">Compete with players worldwide</p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
          {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                timeframe === tf
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white"
              )}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
          {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-all",
                selectedDifficulty === diff
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white"
              )}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white/70 text-sm">Total Players</p>
              <p className="text-white text-xl font-bold">1,247</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white/70 text-sm">Your Rank</p>
              <p className="text-white text-xl font-bold">#6</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-white/70 text-sm">Your Score</p>
              <p className="text-white text-xl font-bold">7,800</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Rankings - {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
          </h3>
        </div>

        <div className="divide-y divide-white/10">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 flex items-center gap-4 transition-all hover:bg-white/5",
                  entry.isCurrentUser && "bg-blue-500/20 border-l-4 border-blue-400"
                )}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    getRankBadge(entry.rank)
                  )}>
                    {getRankIcon(entry.rank)}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {entry.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className={cn(
                        "font-semibold truncate",
                        entry.isCurrentUser ? "text-blue-300" : "text-white"
                      )}>
                        {entry.username}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>🔥 {entry.streak} day streak</span>
                        {entry.isCurrentUser && <span className="text-blue-400">• You</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-white/70">Score</p>
                    <p className="text-white font-semibold">{formatScore(entry.score)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70">Time</p>
                    <p className="text-white font-semibold">{formatTime(entry.time)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70">Mistakes</p>
                    <p className="text-white font-semibold">{entry.mistakes}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Achievement Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium">First Win</p>
              <p className="text-white/60 text-sm">Complete your first puzzle</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Streak Master</p>
              <p className="text-white/60 text-sm">Maintain a 7-day streak</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
