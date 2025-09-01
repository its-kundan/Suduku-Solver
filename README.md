# 🧩 Sudoku Premium - Advanced Sudoku Gaming Platform

A modern, feature-rich Sudoku application built with Next.js 15, TypeScript, and premium gaming features. Challenge yourself with daily puzzles, compete on leaderboards, and track your progress across multiple difficulty levels.

## ✨ Features

### 🎮 Core Gameplay
- **Daily Challenges**: New puzzles every day with consistent difficulty
- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert
- **Practice Mode**: Unlimited practice puzzles at your own pace
- **Smart Validation**: Real-time conflict detection and error highlighting
- **Notes System**: Use candidate notes to plan your moves
- **Undo/Redo**: Full history tracking for mistake recovery

### 🏆 Premium Features
- **Global Leaderboards**: Compete with players worldwide
- **Streak System**: Build daily streaks and maintain momentum
- **Achievement System**: Unlock rewards and track milestones
- **Progress Tracking**: Monitor your improvement over time
- **XP & Leveling**: Earn experience points and level up
- **Performance Analytics**: Detailed stats and best times

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Framer Motion powered interactions
- **Beautiful Graphics**: Modern gradient backgrounds and visual effects
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/its-kundan/Suduku-Solver.git
   cd Suduku-Solver
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/sudoku_premium"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # OAuth Providers (optional)
   GITHUB_ID=""
   GITHUB_SECRET=""
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Push schema to database
   pnpm db:push
   
   # Seed initial data (optional)
   pnpm db:seed
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   │   ├── daily/         # Daily puzzle endpoints
│   │   ├── play/          # Game session endpoints
│   │   └── auth/          # Authentication endpoints
│   ├── play/              # Game pages
│   │   ├── daily/         # Daily challenge
│   │   └── levels/        # Practice levels
│   ├── leaderboard/       # Leaderboard page
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── EnhancedSudokuBoard.tsx  # Main game board
│   ├── Leaderboard.tsx          # Leaderboard component
│   └── ui/                # UI components
├── lib/                   # Utility libraries
│   ├── store.ts           # Zustand game state
│   ├── db.ts              # Database connection
│   └── core-sudoku.ts     # Core game logic
└── prisma/                # Database schema
    └── schema.prisma      # Prisma schema
```

## 🎯 Game Modes

### Daily Challenge
- New puzzle every day
- Global leaderboards
- Streak tracking
- Performance scoring

### Practice Levels
- **Easy**: Perfect for beginners (5-10 min)
- **Medium**: Moderate complexity (10-20 min)
- **Hard**: Advanced techniques (20-40 min)
- **Expert**: Master level (40+ min)

### Leaderboards
- Daily, weekly, and monthly rankings
- Difficulty-based competition
- Achievement showcase
- Progress tracking

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm e2e              # Run end-to-end tests

# Linting
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript check
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🌟 Key Features Explained

### Smart Game Logic
The game includes advanced Sudoku solving algorithms with:
- Real-time validation
- Conflict detection
- Candidate notes system
- Undo/redo functionality

### Performance Tracking
Track your improvement with:
- Completion times
- Mistake counts
- Hint usage
- Streak maintenance
- XP progression

### Social Features
- Global leaderboards
- Achievement sharing
- Progress comparison
- Community challenges

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Self-Hosted
1. Build the application: `pnpm build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Run with: `pnpm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and modern web technologies
- Inspired by classic Sudoku puzzles
- Community-driven development approach

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/its-kundan/Suduku-Solver/issues)
- **Discussions**: [GitHub Discussions](https://github.com/its-kundan/Suduku-Solver/discussions)
- **Email**: [Your Email]

---

**Happy Sudoku Solving! 🧩✨**
