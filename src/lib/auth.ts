import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./db";
import { updateStreakOnFinish } from "./streaks";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...(process.env.EMAIL_SERVER && process.env.EMAIL_FROM
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    createUser: async ({ user }) => {
      // Initialize user data
      await Promise.all([
        prisma.streak.create({
          data: {
            userId: user.id,
            currentCount: 0,
            longestCount: 0,
            lastPlayedIST: null,
          },
        }),
        prisma.userXP.create({
          data: {
            userId: user.id,
            xp: 0,
            levelCode: "BEGINNER",
          },
        }),
      ]);
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};

// Helper functions for authentication checks
export const isAuthenticated = async (session: any) => {
  return !!session?.user?.id;
};

export const getCurrentUserId = async (session: any) => {
  return session?.user?.id;
};

export const requireAuth = async (session: any) => {
  const userId = await getCurrentUserId(session);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
};

export const isAdmin = async (userId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { userId },
  });
  return !!admin;
};

export const requireAdmin = async (userId: string) => {
  const isUserAdmin = await isAdmin(userId);
  if (!isUserAdmin) {
    throw new Error("Admin access required");
  }
  return true;
};

export const getUserProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      streak: true,
      xp: true,
      plays: {
        include: {
          puzzle: true,
        },
        orderBy: {
          finishedAt: "desc",
        },
        take: 10,
      },
      achievements: {
        include: {
          achievement: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
      },
    },
  });
};

// Helper function to get session from request
export async function getSession(req: any) {
  // This is a simplified version for NextAuth v4
  // In a real implementation, you'd use the proper session handling
  return null;
}

// Simple session helper for API routes (placeholder)
export async function getServerSession() {
  // Placeholder - in real implementation, this would get the session
  return null;
}