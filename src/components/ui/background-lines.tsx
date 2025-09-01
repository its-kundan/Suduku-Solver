"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundLinesProps {
  className?: string;
}

export function BackgroundLines({ className }: BackgroundLinesProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated lines */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                top: `${(i * 5) % 100}%`,
                left: '0',
                right: '0',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '3s',
                animationIterationCount: 'infinite',
                animationName: 'fadeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}