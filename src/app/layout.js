import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Social from "@/components/Social";
import Chatbot from "@/components/Chatbot";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Sudoku-Solver",
  description: "Created By Kundan Kumar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <FloatingNav/> */}
      <Navbar />
      <Social />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Chatbot />
        <BackgroundBeams />

      </body>
    </html>
  );
}
