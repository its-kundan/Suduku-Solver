"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Play, 
  Trophy, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Zap
} from 'lucide-react';
import { BackgroundLines } from '@/components/ui/background-lines';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <BackgroundLines className="absolute inset-0 z-0" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white"
            >
              Sudoku Premium
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link href="/play/daily">
                <motion.button
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Play
                </motion.button>
              </Link>
              <Link href="/leaderboard">
                <motion.button
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Leaderboard
                </motion.button>
              </Link>
              <Link href="/auth/signin">
                <motion.button
                  className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Master the Art of
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Sudoku
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Challenge your mind with daily puzzles, compete on leaderboards, and build your streak. 
              Join thousands of players in the ultimate Sudoku experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/play/daily">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Play Daily Challenge
                  <ArrowRight className="w-5 h-5" />
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

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Daily Challenges */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Daily Challenges</h3>
              <p className="text-white/70">
                New puzzles every day with consistent difficulty and global leaderboards.
              </p>
            </motion.div>

            {/* Streak System */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Streak System</h3>
              <p className="text-white/70">
                Build your daily streak and compete with players worldwide.
              </p>
            </motion.div>

            {/* Multiple Difficulties */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multiple Levels</h3>
              <p className="text-white/70">
                From beginner to expert, find the perfect challenge for your skill level.
              </p>
            </motion.div>

            {/* Smart Features */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Features</h3>
              <p className="text-white/70">
                Notes, hints, undo/redo, and conflict detection to enhance your experience.
              </p>
            </motion.div>

            {/* Progress Tracking */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Progress Tracking</h3>
              <p className="text-white/70">
                Track your XP, level up, and unlock achievements as you improve.
              </p>
            </motion.div>

            {/* Community */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community</h3>
              <p className="text-white/70">
                Join a community of Sudoku enthusiasts and share your achievements.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of players and become a Sudoku master today.
            </p>
            <Link href="/play/daily">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Playing Now
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