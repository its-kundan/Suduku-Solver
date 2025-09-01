import { prisma } from './db';
import { generateFromSeed } from './core-sudoku';
import { getISTDateString } from './streaks';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create levels
  console.log('Creating levels...');
  const levels = [
    { code: 'beginner', minXP: 0 },
    { code: 'novice', minXP: 500 },
    { code: 'apprentice', minXP: 1000 },
    { code: 'intermediate', minXP: 2000 },
    { code: 'advanced', minXP: 4000 },
    { code: 'expert', minXP: 8000 },
    { code: 'master', minXP: 15000 },
    { code: 'grandmaster', minXP: 25000 },
    { code: 'legend', minXP: 40000 },
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
      code: 'first_complete',
      title: 'First Steps',
      desc: 'Complete your first puzzle',
      icon: '🎯',
    },
    {
      code: 'streak_3',
      title: 'Getting Started',
      desc: 'Maintain a 3-day streak',
      icon: '🔥',
    },
    {
      code: 'streak_7',
      title: 'Week Warrior',
      desc: 'Maintain a 7-day streak',
      icon: '🔥🔥',
    },
    {
      code: 'streak_30',
      title: 'Streak Master',
      desc: 'Maintain a 30-day streak',
      icon: '🔥🔥🔥',
    },
    {
      code: 'perfect_score',
      title: 'Perfect Score',
      desc: 'Complete a puzzle with no mistakes',
      icon: '⭐',
    },
    {
      code: 'speed_demon',
      title: 'Speed Demon',
      desc: 'Complete a puzzle in under 5 minutes',
      icon: '⚡',
    },
    {
      code: 'level_5',
      title: 'Rising Star',
      desc: 'Reach level 5',
      icon: '🌟',
    },
    {
      code: 'level_10',
      title: 'Sudoku Expert',
      desc: 'Reach level 10',
      icon: '🏆',
    },
    {
      code: 'all_difficulties',
      title: 'Versatile Player',
      desc: 'Complete puzzles of all difficulties',
      icon: '🎨',
    },
    {
      code: 'hint_free',
      title: 'Independent',
      desc: 'Complete 10 puzzles without using hints',
      icon: '💪',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    });
  }

  // Create sample daily puzzles for the past week
  console.log('Creating sample daily puzzles...');
  const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = getISTDateString(date);
    
    for (const difficulty of difficulties) {
      const seed = `SUDOKU:${dateKey}:${difficulty}`;
      const result = generateFromSeed(seed, difficulty);
      
      await prisma.puzzle.upsert({
        where: { 
          dateKey_difficulty: {
            dateKey,
            difficulty,
          }
        },
        update: {
          seed,
          puzzle: result.puzzle,
          solution: result.solution,
        },
        create: {
          dateKey,
          difficulty,
          seed,
          puzzle: result.puzzle,
          solution: result.solution,
        },
      });
    }
  }

  // Create sample users (for development)
  console.log('Creating sample users...');
  const sampleUsers = [
    {
      id: 'user_1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      provider: 'google',
    },
    {
      id: 'user_2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      provider: 'google',
    },
    {
      id: 'user_3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      provider: 'email',
    },
  ];

  for (const user of sampleUsers) {
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
        levelCode: 'intermediate',
      },
    });

    // Create streaks
    await prisma.streak.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        currentCount: Math.floor(Math.random() * 15),
        longestCount: Math.floor(Math.random() * 30),
        lastPlayedIST: new Date(),
      },
    });
  }

  // Create sample plays
  console.log('Creating sample plays...');
  const puzzles = await prisma.puzzle.findMany({ take: 10 });
  
  for (const puzzle of puzzles) {
    for (const user of sampleUsers) {
      const isCompleted = Math.random() > 0.3;
      const seconds = Math.floor(Math.random() * 1800) + 300; // 5-35 minutes
      const mistakes = Math.floor(Math.random() * 5);
      const hintsUsed = Math.floor(Math.random() * 3);
      
      await prisma.play.create({
        data: {
          userId: user.id,
          puzzleId: puzzle.id,
          startedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          finishedAt: isCompleted ? new Date() : null,
          seconds: isCompleted ? seconds : 0,
          mistakes: isCompleted ? mistakes : 0,
          hintsUsed: isCompleted ? hintsUsed : 0,
          status: isCompleted ? 'completed' : 'in_progress',
          score: isCompleted ? Math.floor(Math.random() * 1000) : 0,
        },
      });
    }
  }

  // Create sample leaderboard entries
  console.log('Creating sample leaderboard entries...');
  const today = getISTDateString();
  const yesterday = getISTDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
  
  for (const user of sampleUsers) {
    // Today's entry
    await prisma.leaderboardDaily.upsert({
      where: {
        userId_dateKey: {
          userId: user.id,
          dateKey: today,
        },
      },
      update: {},
      create: {
        userId: user.id,
        dateKey: today,
        seconds: Math.floor(Math.random() * 1200) + 300,
        mistakes: Math.floor(Math.random() * 3),
        score: Math.floor(Math.random() * 1000),
      },
    });

    // Yesterday's entry
    await prisma.leaderboardDaily.upsert({
      where: {
        userId_dateKey: {
          userId: user.id,
          dateKey: yesterday,
        },
      },
      update: {},
      create: {
        userId: user.id,
        dateKey: yesterday,
        seconds: Math.floor(Math.random() * 1200) + 300,
        mistakes: Math.floor(Math.random() * 3),
        score: Math.floor(Math.random() * 1000),
      },
    });
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