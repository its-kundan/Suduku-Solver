# Premium Sudoku 🧩

A beautifully crafted, premium Sudoku game built with Next.js 15, TypeScript, and modern web technologies. Features daily challenges, streaks, leaderboards, XP system, and a stunning glassmorphism UI.

![Premium Sudoku](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma)

## ✨ Features

### 🎮 Core Gameplay
- **Premium Sudoku Board**: Beautiful, responsive grid with glassmorphism styling
- **Keyboard Navigation**: Full keyboard support with arrow keys and number input
- **Note Mode**: Toggle between number placement and candidate notes
- **Real-time Validation**: Instant conflict detection and highlighting
- **Undo/Redo**: Complete history management with keyboard shortcuts
- **Timer & Stats**: Track time, mistakes, and hints used

### 🌟 Premium Features
- **Daily Challenges**: New puzzle every day with consistent difficulty
- **Streak System**: Build and maintain daily solving streaks
- **XP & Levels**: Progress from Beginner to Legend with 8 levels
- **Achievements**: Unlock badges for various accomplishments
- **Global Leaderboards**: Compete with players worldwide
- **PWA Support**: Install as a native app with offline functionality

### 🎨 Design & UX
- **Dark-First Design**: Premium dark theme with glassmorphism effects
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **High Contrast Mode**: Alternative theme for better visibility

### 🔧 Technical Features
- **Next.js 15 App Router**: Latest React framework with App Router
- **TypeScript**: Full type safety with strict configuration
- **Prisma + PostgreSQL**: Robust database with type-safe queries
- **NextAuth v5**: Google OAuth and email magic link authentication
- **Zustand**: Lightweight state management for game state
- **TanStack Query**: Server state management and caching
- **shadcn/ui**: Beautiful, accessible UI components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/premium_sudoku"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # Marketing pages (home, about)
│   ├── play/              # Game pages (daily, levels)
│   ├── leaderboard/       # Leaderboard pages
│   ├── profile/           # User profile pages
│   ├── auth/              # Authentication pages
│   └── api/               # API route handlers
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── SudokuBoard.tsx   # Main game board
│   ├── GameControls.tsx  # Game controls and stats
│   └── Providers.tsx     # App providers
├── lib/                  # Utility libraries
│   ├── core-sudoku/      # Sudoku logic engine
│   ├── db.ts            # Prisma client
│   ├── auth.ts          # NextAuth configuration
│   ├── store.ts         # Zustand game store
│   └── utils.ts         # Utility functions
└── styles/              # Global styles
```

## 🎯 Core Sudoku Engine

The `src/lib/core-sudoku/` module provides:

- **Puzzle Generation**: Create puzzles of varying difficulty
- **Solver Algorithm**: Backtracking solver with unique solution validation
- **Difficulty Rating**: Intelligent difficulty assessment
- **Daily Seeds**: Consistent puzzle generation for daily challenges
- **Validation**: Real-time grid validation and conflict detection

### Key Functions
```typescript
// Generate a puzzle
const puzzle = generate('medium');

// Solve a grid
const solution = solve(grid);

// Validate a move
const isValid = isValid(grid, row, col, value);

// Check for conflicts
const conflicts = findConflicts(grid);
```

## 🗄️ Database Schema

The app uses PostgreSQL with Prisma ORM:

- **Users**: Authentication and profile data
- **Puzzles**: Daily and custom puzzles
- **Plays**: Game session data and statistics
- **Streaks**: User streak tracking
- **Leaderboards**: Daily and all-time rankings
- **Achievements**: Unlockable badges
- **Levels**: XP-based progression system

## 🎮 Game Features

### Daily Challenges
- New puzzle every day at midnight IST
- Consistent difficulty with seeded generation
- Global leaderboards for each day
- Streak maintenance tracking

### XP System
- **Base XP**: Earned for completing puzzles
- **Time Bonus**: Faster completion = more XP
- **Penalties**: Mistakes and hints reduce XP
- **Levels**: 8 progression levels from Beginner to Legend

### Achievements
- **First Steps**: Complete your first puzzle
- **Week Warrior**: 7-day streak
- **Speed Demon**: Complete under 2 minutes
- **Perfect Solve**: No mistakes
- **Century Club**: 100 puzzles completed

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### Testing
```bash
# Unit tests with Vitest
npm run test

# E2E tests with Playwright
npm run test:e2e

# Test with UI
npm run test:ui
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🎨 Customization

### Themes
The app uses CSS custom properties for theming. Modify `src/app/globals.css` to customize colors:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --accent: 210 40% 96%;
  --background: 0 0% 100%;
  /* ... more variables */
}
```

### Styling
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built components
- **Glassmorphism**: Custom glass card effects
- **Framer Motion**: Smooth animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel**: For hosting and deployment
- **shadcn/ui**: For beautiful UI components
- **Prisma**: For the excellent ORM
- **Framer Motion**: For smooth animations

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@premiumsudoku.com

---

Made with ❤️ by the Premium Sudoku Team
