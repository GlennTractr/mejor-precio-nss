'use client';

import { Logo } from './logo';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  duration?: number; // Animation duration in seconds
}

export function Loading({ className, size = 'lg', duration = 2 }: LoadingProps) {
  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center bg-layout-background',
        className
      )}
    >
      <div
        style={{
          animation: `fadeInOut ${duration}s ease-in-out infinite`,
        }}
      >
        <Logo size={size} />
      </div>
    </div>
  );
}
