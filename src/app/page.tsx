"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Trophy, 
  Flame, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6">
              Premium Sudoku
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Challenge your mind with beautifully crafted puzzles. 
              Daily challenges, streaks, leaderboards, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/play/daily">
                <Button size="lg" variant="premium" className="text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                  Play Daily Challenge
                </Button>
              </Link>
              <Link href="/play/levels">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  <Trophy className="mr-2 h-5 w-5" />
                  Choose Difficulty
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Daily Challenges</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  New puzzle every day with consistent difficulty and global leaderboards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mb-4">
                  <Flame className="h-6 w-6 text-warning" />
                </div>
                <CardTitle>Streak System</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Build your streak by completing daily puzzles and track your progress.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <CardTitle>XP & Levels</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Earn XP, unlock achievements, and climb the ranks from Beginner to Legend.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Global Leaderboards</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Compete with players worldwide and see how you rank on daily and all-time boards.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Daily Challenge Preview */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Today's Challenge
            </h2>
            <p className="text-muted-foreground text-lg">
              Can you solve today's puzzle and claim your spot on the leaderboard?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="glass-card p-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-warning" />
                    Daily Puzzle - Medium
                  </CardTitle>
                  <CardDescription>
                    Complete this puzzle to maintain your streak and earn XP
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className="font-semibold text-warning">Medium</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Players Today:</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Best Time:</span>
                      <span className="font-semibold">2:34</span>
                    </div>
                  </div>
                  
                  <Link href="/play/daily">
                    <Button variant="premium" className="w-full mt-6">
                      Play Today's Challenge
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Top Players Today
                </h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "PuzzleMaster", time: "2:34", streak: 15 },
                    { rank: 2, name: "SudokuPro", time: "2:47", streak: 8 },
                    { rank: 3, name: "LogicLover", time: "3:12", streak: 22 },
                  ].map((player, index) => (
                    <div key={player.rank} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                          {player.rank}
                        </div>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{player.time}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Flame className="h-3 w-3 text-warning" />
                          {player.streak} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full mt-4">
                    View Full Leaderboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Challenge Your Mind?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of players worldwide and start your Sudoku journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/play/daily">
                <Button size="lg" variant="premium" className="text-lg px-8 py-4">
                  Start Playing Now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}