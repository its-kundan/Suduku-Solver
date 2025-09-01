import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock NextAuth
vi.mock('next-auth/react', () => ({
  useSession() {
    return { data: null, status: 'unauthenticated' };
  },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { createElement } = require('react');
      return createElement('div', props, children);
    },
    button: ({ children, ...props }: any) => {
      const { createElement } = require('react');
      return createElement('button', props, children);
    },
  },
  AnimatePresence: ({ children }: any) => children,
}));