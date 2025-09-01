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
- **Global Leaderboards**: Daily, weekly, and all-time rankings
- **Streak System**: Build momentum with daily puzzle completion
- **XP & Leveling**: Progress through 9 levels from Beginner to Mythic
- **Achievements**: Unlock badges for various accomplishments
- **Anti-Cheat**: Server-side validation and time thresholds
- **Real-time Updates**: Live leaderboard updates via WebSockets

### 🔐 Authentication & Security
- **Google OAuth**: Quick sign-in with Google accounts
- **Email Magic Links**: Passwordless authentication
- **Rate Limiting**: Protection against abuse and spam
- **Input Validation**: Zod schemas for all API endpoints
- **Session Management**: Secure JWT-based authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud)
- pnpm (recommended) or npm

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd sudoku-premium
pnpm install
```

### 2. Environment Setup
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

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Rate Limiting (optional)
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Real-time Updates (optional)
REALTIME_PROVIDER="pusher" # or "ably" or "none"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
```

### 3. Database Setup
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Or create and run migrations (production)
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### 4. Start Development
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🗄️ Database Schema

The application uses Prisma with PostgreSQL and includes:

- **Users**: Authentication and profile data
- **Puzzles**: Daily and practice puzzles with solutions
- **Plays**: Game session tracking and completion data
- **Leaderboards**: Daily rankings and statistics
- **Streaks**: User streak tracking with IST timezone
- **Achievements**: Unlockable badges and rewards
- **XP System**: Level progression from Beginner to Mythic

## 🔌 API Endpoints

### Public Endpoints
- `GET /api/daily` - Fetch daily puzzle
- `GET /api/levels` - Get difficulty level information

### Authenticated Endpoints
- `POST /api/play/start` - Start a new game session
- `POST /api/play/finish` - Complete a puzzle and get score
- `GET /api/leaderboard` - Fetch leaderboard data
- `GET /api/profile` - Get user profile and stats
- `POST /api/levels` - Generate practice puzzle

### Admin Endpoints
- `POST /api/admin/reseed` - Regenerate daily puzzles
- `GET /api/admin/reseed` - View puzzle statistics

## 🛠️ Development

### Available Scripts
```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:migrate       # Create and run migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm e2e              # Run end-to-end tests

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler
```

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   ├── play/              # Game pages
│   ├── leaderboard/       # Leaderboard page
│   └── profile/           # User profile page
├── components/             # React components
├── lib/                    # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Prisma client
│   ├── scoring.ts         # Game scoring logic
│   ├── streaks.ts         # Streak management
│   ├── time.ts            # IST timezone utilities
│   └── schemas.ts         # Zod validation schemas
└── prisma/                 # Database schema and migrations
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
DATABASE_URL="your-production-postgres-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
```

### Database Migration
```bash
# On production
pnpm db:deploy
```

## 🧪 Testing

### Unit Tests
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Generate coverage report
```

### End-to-End Tests
```bash
pnpm e2e               # Run Playwright tests
pnpm e2e:ui           # Open Playwright UI
pnpm e2e:headed       # Run tests with browser visible
```

## 🔒 Security Features

- **Input Validation**: All API inputs validated with Zod
- **Rate Limiting**: Configurable rate limits per endpoint
- **Authentication**: JWT-based sessions with NextAuth
- **Anti-Cheat**: Server-side solution validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CORS Protection**: Configured for production domains

## 🌍 Internationalization

- **IST Timezone**: All daily challenges use Asia/Kolkata timezone
- **Daily Rollover**: New puzzles available at 00:00 IST
- **Streak Calculation**: Based on IST calendar days

## 📱 PWA Features

- **Offline Support**: Cache last opened puzzle
- **Installable**: Add to home screen
- **Service Worker**: Background sync for completed puzzles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/sudoku-premium/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sudoku-premium/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/sudoku-premium/wiki)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://prisma.io/)
- Authentication via [NextAuth.js](https://next-auth.js.org/)
- UI components with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

**Happy Sudoku Solving! 🧩✨**
