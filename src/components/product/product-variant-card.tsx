'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface ProductVariantCardProps {
  title: string;
  specLabel: string;
  imageUrl: string;
  productSlug: string;
  isSelected?: boolean;
}

export function ProductVariantCard({
  specLabel,
  productSlug,
  isSelected = false,
}: ProductVariantCardProps) {
  if (isSelected) {
    return (
      <div className="block">
        <Card className="group relative overflow-hidden border transition-all duration-200 ease-in-out cursor-pointer border-primary bg-primary/5 ring-2 ring-primary/20">
          <div className="flex flex-col">
            {/* Spec label */}
            <div className="flex-grow flex items-center justify-center p-1 text-xs text-center">
              {specLabel}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Link href={`/producto/${productSlug}`} className="block">
      <Card className="group relative overflow-hidden border transition-all duration-200 ease-in-out cursor-pointer border-secondary/20 bg-white hover:border-secondary/40 hover:shadow-md hover:scale-[1.02]">
        <div className="flex flex-col">
          {/* Spec label */}
          <div className="flex-grow flex items-center justify-center p-1 text-xs text-center">
            {specLabel}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </Card>
    </Link>
  );
}

// Skeleton component for loading state
export function ProductVariantCardSkeleton() {
  return (
    <div className="animate-pulse border border-primary-light/20 rounded-lg overflow-hidden">
      <div className="flex flex-col">
        {/* Spec label skeleton */}
        <div className="flex-grow flex items-center justify-center p-1">
          <div className="h-4 bg-primary-light/20 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}
