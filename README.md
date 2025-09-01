# Sudoku Premium 🧩

A premium Sudoku game built with Next.js 15, featuring daily challenges, leaderboards, streaks, and a beautiful dark-first UI with glassmorphism effects.

## ✨ Features

- **Daily Challenges** - New puzzles every day with consistent difficulty
- **Streak System** - Build and maintain your daily solving streak
- **Multiple Difficulties** - Easy, Medium, Hard, and Expert levels
- **Leaderboards** - Compete with players worldwide
- **Progress Tracking** - XP system, levels, and achievements
- **Smart Features** - Notes, hints, undo/redo, conflict detection
- **Premium UI** - Dark theme with glassmorphism and smooth animations
- **PWA Support** - Install as a native app
- **Authentication** - Google OAuth and Email magic links
- **Responsive Design** - Works perfectly on all devices

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: Prisma + PostgreSQL
- **Authentication**: NextAuth v5 (Auth.js)
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React
- **Validation**: Zod

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd premium-sudoku
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/premium_sudoku"
   
   # NextAuth
   AUTH_SECRET="your-auth-secret-here"
   AUTH_URL="http://localhost:3000"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Email (Resend)
   RESEND_API_KEY="your-resend-api-key"
   FROM_EMAIL="noreply@yoursudokuapp.com"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL locally or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=premium_sudoku -p 5432:5432 -d postgres
```

### Option 2: Neon (Recommended for production)
1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local`

## 🔐 Authentication Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to your `.env.local`

### Email Authentication (Resend)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to your `.env.local`

## 📱 PWA Features

The app includes PWA support with:
- Offline functionality for current puzzle
- Install prompt
- App-like experience
- Service worker for caching

## 🎮 Game Features

### Core Sudoku Engine
- **Solver**: Backtracking algorithm
- **Generator**: Creates unique puzzles with specified difficulty
- **Validation**: Real-time conflict detection
- **Difficulty Rating**: Automatic difficulty assessment

### Game Mechanics
- **Timer**: Tracks solving time
- **Mistake Counter**: Counts invalid moves
- **Hint System**: Provides assistance when needed
- **Note Mode**: Toggle for pencil marks
- **Undo/Redo**: Full move history

### Scoring System
- **Base XP**: Varies by difficulty
- **Time Bonus**: Faster completion = more XP
- **Penalties**: Mistakes and hints reduce score
- **Level Progression**: 9 levels from Beginner to Legend

## 🏆 Leaderboards

- **Daily**: Today's best times per difficulty
- **Weekly**: Weekly aggregated scores
- **All-time**: Historical best performances
- **Streak Rankings**: Longest active streaks

## 🎯 Achievements

Unlock achievements for:
- First puzzle completion
- Streak milestones (3, 7, 30 days)
- Perfect scores (no mistakes)
- Speed records
- Level progression
- Difficulty mastery

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
AUTH_SECRET="your-production-auth-secret"
AUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run e2e

# Run type checking
npm run type-check
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── play/              # Game pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── SudokuBoard.tsx   # Main game board
│   └── GameControls.tsx  # Game controls
├── lib/                  # Utility libraries
│   ├── core-sudoku/      # Sudoku engine
│   ├── db.ts            # Database client
│   ├── auth.ts          # Authentication
│   ├── store.ts         # Zustand store
│   └── utils.ts         # Utility functions
└── styles/              # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Animations with [Framer Motion](https://www.framer.com/motion/)

---

**Happy Sudoku Solving! 🧩✨**
