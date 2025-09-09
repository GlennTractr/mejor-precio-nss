'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { env } from '@/lib/env';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  inverted?: boolean;
  clickable?: boolean;
}

const sizeClasses = {
  sm: 'h-7 w-auto', // ~28px for mobile
  md: 'h-9 w-auto', // ~36px for desktop
  lg: 'h-12 w-auto', // ~48px for larger contexts
};

export function Logo({
  size = 'md',
  className,
  showText = false,
  inverted = false,
  clickable = true,
}: LogoProps) {
  const logo = (
    <>
      <Image
        src={inverted ? '/images/logo-melon-inverted.svg' : '/images/logo.svg'}
        alt="Save On Baby Logo"
        width={200}
        height={64}
        className={cn(sizeClasses[size])}
        priority
        onError={e => {
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
    </>
  );

  return clickable ? (
    <Link
      href="/"
      className={cn('flex items-center gap-2 hover:opacity-80 transition-all', className)}
      aria-label="Save On Baby - Home"
    >
      {logo}
    </Link>
  ) : (
    logo
  );
}
