'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { env } from '@/lib/env';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'h-7 w-auto', // ~28px for mobile
  md: 'h-9 w-auto', // ~36px for desktop
  lg: 'h-12 w-auto', // ~48px for larger contexts
};

export function Logo({ size = 'md', className, showText = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 hover:opacity-80 transition-all',
        className
      )}
      aria-label="Mejor Precio NSS - Home"
    >
      <Image
        src="/images/logo.png"
        alt="Mejor Precio NSS Logo"
        width={120}
        height={32}
        className={cn(sizeClasses[size])}
        priority
        onError={(e) => {
          // Fallback to text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const textElement = target.nextElementSibling as HTMLElement;
          if (textElement) {
            textElement.style.display = 'block';
          }
        }}
      />
      <span 
        className={cn(
          'font-bold text-primary',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl',
          !showText && 'hidden'
        )}
        style={{ display: showText ? 'block' : 'none' }}
      >
        {env().NEXT_PUBLIC_SITE_TITLE}
      </span>
    </Link>
  );
}