import { PrismaClient } from '@prisma/client';
import { generateFromSeed } from '../src/lib/core-sudoku';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.userXP.deleteMany();
  await prisma.level.deleteMany();
  await prisma.leaderboardDaily.deleteMany();
  await prisma.play.deleteMany();
  await prisma.puzzle.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  // Create levels
  console.log('📊 Creating levels...');
  const levels = [
    { code: 'beginner', minXP: 0, title: 'Beginner', description: 'Just starting your Sudoku journey' },
    { code: 'novice', minXP: 100, title: 'Novice', description: 'Getting the hang of it' },
    { code: 'apprentice', minXP: 250, title: 'Apprentice', description: 'Building your skills' },
    { code: 'adept', minXP: 500, title: 'Adept', description: 'You\'re getting good at this' },
    { code: 'expert', minXP: 1000, title: 'Expert', description: 'A true Sudoku master' },
    { code: 'master', minXP: 2000, title: 'Master', description: 'Elite level player' },
    { code: 'grandmaster', minXP: 3500, title: 'Grandmaster', description: 'Legendary status' },
    { code: 'legend', minXP: 5000, title: 'Legend', description: 'The stuff of legends' },
    { code: 'mythic', minXP: 10000, title: 'Mythic', description: 'Beyond mortal comprehension' },
  ];

  for (const level of levels) {
    await prisma.level.create({
      data: level,
    });
  }

  // Create achievements
  console.log('🏆 Creating achievements...');
  const achievements = [
    {
      code: 'first-win',
      title: 'First Victory',
      description: 'Complete your first Sudoku puzzle',
      icon: '🎯',
      criteria: { type: 'puzzles_completed', count: 1 },
    },
    {
      code: 'streak-3',
      title: 'Getting Started',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      criteria: { type: 'streak', count: 3 },
    },
    {
      code: 'streak-7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥🔥',
      criteria: { type: 'streak', count: 7 },
    },
    {
      code: 'streak-30',
      title: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      criteria: { type: 'streak', count: 30 },
    },
    {
      code: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete a puzzle in under 2 minutes',
      icon: '⚡',
      criteria: { type: 'speed', seconds: 120 },
    },
    {
      code: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete a puzzle with no mistakes',
      icon: '✨',
      criteria: { type: 'mistakes', count: 0 },
    },
    {
      code: 'no-hints',
      title: 'Independent',
      description: 'Complete a puzzle without using hints',
      icon: '🧠',
      criteria: { type: 'hints_used', count: 0 },
    },
    {
      code: 'difficulty-master',
      title: 'Difficulty Master',
      description: 'Complete puzzles of all difficulty levels',
      icon: '🎭',
      criteria: { type: 'difficulties_completed', levels: ['easy', 'medium', 'hard', 'expert'] },
    },
    {
      code: 'puzzle-collector',
      title: 'Puzzle Collector',
      description: 'Complete 100 puzzles',
      icon: '📚',
      criteria: { type: 'puzzles_completed', count: 100 },
    },
    {
      code: 'xp-master',
      title: 'XP Master',
      description: 'Reach 5000 XP',
      icon: '⭐',
      criteria: { type: 'xp', amount: 5000 },
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    });
  }

  // Create sample users
  console.log('👥 Creating sample users...');
  const users = [
    {
      name: 'SudokuMaster',
      email: 'master@sudoku.app',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master',
    },
    {
      name: 'PuzzlePro',
      email: 'pro@sudoku.app',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pro',
    },
    {
      name: 'GridGuru',
      email: 'guru@sudoku.app',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guru',
    },
    {
      name: 'NumberNinja',
      email: 'ninja@sudoku.app',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja',
    },
    {
      name: 'LogicLegend',
      email: 'legend@sudoku.app',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=legend',
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    });
    createdUsers.push(user);
  }

  // Create admin user
  console.log('👑 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@sudoku.app',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
    },
  });

  // Create streaks and XP for users
  console.log('🔥 Creating streaks and XP...');
  for (const user of createdUsers) {
    const streakCount = Math.floor(Math.random() * 50) + 1;
    const xpAmount = Math.floor(Math.random() * 5000) + 100;
    
    await prisma.streak.create({
      data: {
        userId: user.id,
        currentCount: streakCount,
        longestCount: streakCount + Math.floor(Math.random() * 20),
        lastPlayedIST: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.userXP.create({
      data: {
        userId: user.id,
        xp: xpAmount,
        levelCode: getLevelCode(xpAmount),
      },
    });
  }

  // Create sample puzzles for the last 7 days
  console.log('🧩 Creating sample puzzles...');
  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    for (const difficulty of difficulties) {
      const seed = `SUDOKU:${dateKey}:${difficulty}`;
      const result = generateFromSeed(seed, difficulty);
      
      await prisma.puzzle.create({
        data: {
          dateKey,
          difficulty,
          seed,
          puzzle: result.puzzle,
          solution: result.solution,
        },
      });
    }
  }

  // Create some practice puzzles
  console.log('🎯 Creating practice puzzles...');
  for (let i = 0; i < 20; i++) {
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const seed = `PRACTICE:${Date.now()}:${i}:${difficulty}`;
    const result = generateFromSeed(seed, difficulty);
    
    await prisma.puzzle.create({
      data: {
        dateKey: null, // Practice puzzles don't have dates
        difficulty,
        seed,
        puzzle: result.puzzle,
        solution: result.solution,
      },
    });
  }

  // Create sample plays and leaderboard entries
  console.log('🎮 Creating sample plays...');
  for (const user of createdUsers) {
    // Get some puzzles to play
    const puzzles = await prisma.puzzle.findMany({
      where: { dateKey: { not: null } }, // Only daily puzzles
      take: 5,
    });

    for (const puzzle of puzzles) {
      const seconds = Math.floor(Math.random() * 1800) + 300; // 5-35 minutes
      const mistakes = Math.floor(Math.random() * 5);
      const hintsUsed = Math.floor(Math.random() * 3);
      const score = Math.max(0, 1000 - (mistakes * 100) - (hintsUsed * 50) + Math.floor(Math.random() * 200));

      // Create play record
      const play = await prisma.play.create({
        data: {
          userId: user.id,
          puzzleId: puzzle.id,
          startedAt: new Date(Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000),
          finishedAt: new Date(),
          seconds,
          mistakes,
          hintsUsed,
          status: 'completed',
          score,
        },
      });

      // Create leaderboard entry for daily puzzles
      if (puzzle.dateKey) {
        await prisma.leaderboardDaily.create({
          data: {
            dateKey: puzzle.dateKey,
            userId: user.id,
            seconds,
            mistakes,
            score,
          },
        });
      }
    }
  }

  // Award some achievements
  console.log('🏅 Awarding achievements...');
  const allAchievements = await prisma.achievement.findMany();
  const allUsers = await prisma.user.findMany();

  for (const user of allUsers) {
    // Award first win achievement
    const firstWinAchievement = allAchievements.find(a => a.code === 'first-win');
    if (firstWinAchievement) {
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: firstWinAchievement.id,
          earnedAt: new Date(),
        },
      });
    }

    // Randomly award other achievements
    const randomAchievements = allAchievements
      .filter(a => a.code !== 'first-win')
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);

    for (const achievement of randomAchievements) {
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: achievement.id,
          earnedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log('✅ Database seed completed successfully!');
  console.log(`📊 Created ${levels.length} levels`);
  console.log(`🏆 Created ${achievements.length} achievements`);
  console.log(`👥 Created ${createdUsers.length + 1} users (including admin)`);
  console.log(`🧩 Created ${7 * difficulties.length + 20} puzzles`);
  console.log(`🎮 Created sample plays and leaderboard entries`);
}

function getLevelCode(xp: number): string {
  if (xp >= 10000) return 'mythic';
  if (xp >= 5000) return 'legend';
  if (xp >= 3500) return 'grandmaster';
  if (xp >= 2000) return 'master';
  if (xp >= 1000) return 'expert';
  if (xp >= 500) return 'adept';
  if (xp >= 250) return 'apprentice';
  if (xp >= 100) return 'novice';
  return 'beginner';
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
