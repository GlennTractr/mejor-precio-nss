'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BannerProps {
  className?: string;
  children?: ReactNode;
  overlay?: boolean;
  overlayOpacity?: 'light' | 'medium' | 'dark';
}

const overlayClasses = {
  light: 'bg-black/20',
  medium: 'bg-black/40',
  dark: 'bg-black/60',
};

export function Banner({ 
  className, 
  children, 
  overlay = false,
  overlayOpacity = 'medium'
}: BannerProps) {
  return (
    <section className={cn(
      'relative overflow-hidden w-full',
      className
    )}>
      <div className="relative w-full">
        <Image
          src="/images/banner.png"
          alt="Mejor Precio NSS - Comparador de precios para productos de bebé"
          width={1200}
          height={400}
          className="w-full h-auto object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
        />
        
        {overlay && (
          <div className={cn(
            'absolute inset-0',
            overlayClasses[overlayOpacity]
          )} />
        )}
        
        {children && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative max-w-4xl mx-auto text-center px-6">
              {children}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}