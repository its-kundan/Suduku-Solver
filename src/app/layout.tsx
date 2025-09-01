import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sudoku Premium - Master the Art of Sudoku',
  description: 'Challenge your mind with daily puzzles, compete on leaderboards, and build your streak. Join thousands of players in the ultimate Sudoku experience.',
  keywords: 'sudoku, puzzle, game, daily challenge, brain training, logic',
  authors: [{ name: 'Sudoku Premium Team' }],
  openGraph: {
    title: 'Sudoku Premium - Master the Art of Sudoku',
    description: 'Challenge your mind with daily puzzles, compete on leaderboards, and build your streak.',
    type: 'website',
    url: 'https://sudoku-premium.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sudoku Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sudoku Premium - Master the Art of Sudoku',
    description: 'Challenge your mind with daily puzzles, compete on leaderboards, and build your streak.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  themeColor: '#1e293b',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}