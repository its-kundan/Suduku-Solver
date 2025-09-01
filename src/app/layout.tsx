import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Sudoku - Daily Challenges & Puzzles",
  description: "Play premium Sudoku puzzles with daily challenges, streaks, leaderboards, and beautiful UI. Join thousands of players worldwide!",
  keywords: "sudoku, puzzle, daily challenge, brain games, logic puzzle",
  authors: [{ name: "Premium Sudoku Team" }],
  openGraph: {
    title: "Premium Sudoku - Daily Challenges & Puzzles",
    description: "Play premium Sudoku puzzles with daily challenges, streaks, leaderboards, and beautiful UI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Sudoku - Daily Challenges & Puzzles",
    description: "Play premium Sudoku puzzles with daily challenges, streaks, leaderboards, and beautiful UI.",
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}