"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Leaderboard } from '@/components/Leaderboard';
import { BackgroundLines } from '@/components/ui/background-lines';
import { ArrowLeft, Trophy, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
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
                <Trophy className="w-8 h-8 text-yellow-500" />
                Global Rankings
              </h1>
              <p className="text-white/70 mt-2">Compete with players worldwide</p>
            </motion.div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
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
              Rise to the Top of the
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Sudoku Elite
              </span>
            </h2>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Every day brings new challenges and opportunities to climb the leaderboard. 
              Show your skills, build your streak, and earn your place among the best.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <p className="text-white font-semibold">Daily Challenges</p>
                  <p className="text-white/60 text-sm">New puzzles every day</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <div className="text-left">
                  <p className="text-white font-semibold">Streak System</p>
                  <p className="text-white/60 text-sm">Build your momentum</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Star className="w-6 h-6 text-blue-400" />
                <div className="text-left">
                  <p className="text-white font-semibold">Achievements</p>
                  <p className="text-white/60 text-sm">Unlock rewards</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Leaderboard Section */}
        <section className="container mx-auto px-4 py-12">
          <Leaderboard className="max-w-6xl mx-auto" />
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-8">How the Ranking System Works</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Complete Puzzles</h4>
                <p className="text-white/70">
                  Solve daily challenges and practice puzzles to earn points and improve your skills.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">2</span>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Earn Points</h4>
                <p className="text-white/70">
                  Score points based on speed, accuracy, and difficulty level. Fewer mistakes mean higher scores.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Climb Rankings</h4>
                <p className="text-white/70">
                  Compare your performance with players worldwide and climb the leaderboard rankings.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Join the Competition?
            </h3>
            <p className="text-xl text-white/70 mb-8">
              Start playing today and see where you rank among the world&apos;s best Sudoku players.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/play/daily">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Daily Challenge
                </motion.button>
              </Link>
              <Link href="/play/levels">
                <motion.button
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Practice Levels
                </motion.button>
              </Link>
            </div>
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
