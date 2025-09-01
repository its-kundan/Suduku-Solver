import { PrismaClient } from '@prisma/client';
import { generateDailyPuzzle, generateDailySeed } from '../src/lib/core-sudoku';
import { getISTDate } from '../src/lib/utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create levels
  console.log('Creating levels...');
  const levels = [
    { code: 'beginner', minXP: 0 },
    { code: 'novice', minXP: 500 },
    { code: 'apprentice', minXP: 1000 },
    { code: 'skilled', minXP: 2000 },
    { code: 'expert', minXP: 4000 },
    { code: 'master', minXP: 8000 },
    { code: 'grandmaster', minXP: 15000 },
    { code: 'legend', minXP: 25000 },
  ];

  for (const level of levels) {
    await prisma.level.upsert({
      where: { code: level.code },
      update: level,
      create: level,
    });
  }

  // Create achievements
  console.log('Creating achievements...');
  const achievements = [
    {
      code: 'first_puzzle',
      title: 'First Steps',
      desc: 'Complete your first Sudoku puzzle',
      icon: '🎯',
    },
    {
      code: 'streak_7',
      title: 'Week Warrior',
      desc: 'Maintain a 7-day streak',
      icon: '🔥',
    },
    {
      code: 'streak_30',
      title: 'Monthly Master',
      desc: 'Maintain a 30-day streak',
      icon: '🏆',
    },
    {
      code: 'speed_demon',
      title: 'Speed Demon',
      desc: 'Complete a puzzle in under 2 minutes',
      icon: '⚡',
    },
    {
      code: 'perfect_solve',
      title: 'Perfect Solve',
      desc: 'Complete a puzzle without any mistakes',
      icon: '✨',
    },
    {
      code: 'level_10',
      title: 'Rising Star',
      desc: 'Reach level 10',
      icon: '⭐',
    },
    {
      code: 'puzzle_100',
      title: 'Century Club',
      desc: 'Complete 100 puzzles',
      icon: '💯',
    },
    {
      code: 'all_difficulties',
      title: 'Versatile Solver',
      desc: 'Complete puzzles of all difficulty levels',
      icon: '🎨',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    });
  }

  // Create sample users
  console.log('Creating sample users...');
  const users = [
    {
      id: 'user_1',
      name: 'PuzzleMaster',
      email: 'puzzle@example.com',
      provider: 'google',
    },
    {
      id: 'user_2',
      name: 'SudokuPro',
      email: 'sudoku@example.com',
      provider: 'google',
    },
    {
      id: 'user_3',
      name: 'LogicLover',
      email: 'logic@example.com',
      provider: 'google',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });

    // Create user XP
    await prisma.userXP.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        xp: Math.floor(Math.random() * 5000),
        levelCode: 'apprentice',
      },
    });

    // Create streaks
    await prisma.streak.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        currentCount: Math.floor(Math.random() * 30),
        longestCount: Math.floor(Math.random() * 50) + 10,
        lastPlayedIST: new Date(),
      },
    });
  }

  // Create daily puzzles for the past week
  console.log('Creating daily puzzles...');
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    const seed = generateDailySeed(dateKey, 'medium');
    const puzzle = generateDailyPuzzle(seed, 'medium');

    await prisma.puzzle.upsert({
      where: { dateKey },
      update: {},
      create: {
        dateKey,
        difficulty: puzzle.difficulty,
        seed,
        puzzle: puzzle.puzzle,
        solution: puzzle.solution,
      },
    });
  }

  // Create sample plays
  console.log('Creating sample plays...');
  const puzzles = await prisma.puzzle.findMany();
  const difficulties = ['easy', 'medium', 'hard', 'expert'];

  for (const user of users) {
    for (let i = 0; i < 10; i++) {
      const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      await prisma.play.create({
        data: {
          userId: user.id,
          puzzleId: puzzle.id,
          startedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          finishedAt: new Date(),
          seconds: Math.floor(Math.random() * 600) + 60, // 1-10 minutes
          mistakes: Math.floor(Math.random() * 5),
          hintsUsed: Math.floor(Math.random() * 3),
          status: 'completed',
          score: Math.floor(Math.random() * 500) + 100,
        },
      });
    }
  }

  // Create leaderboard entries
  console.log('Creating leaderboard entries...');
  const plays = await prisma.play.findMany({
    where: { status: 'completed' },
    include: { puzzle: true, user: true },
  });

  for (const play of plays) {
    if (play.puzzle.dateKey) {
      await prisma.leaderboardDaily.upsert({
        where: {
          userId_dateKey: {
            userId: play.userId,
            dateKey: play.puzzle.dateKey,
          },
        },
        update: {
          seconds: play.seconds,
          mistakes: play.mistakes,
          score: play.score,
        },
        create: {
          dateKey: play.puzzle.dateKey,
          userId: play.userId,
          seconds: play.seconds,
          mistakes: play.mistakes,
          score: play.score,
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });