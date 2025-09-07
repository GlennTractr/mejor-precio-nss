'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ProductGridProps } from '../types';

function ProductGridComponent({
  products,
  isLoading,
  itemsPerPage,
  emptyState,
  loadingComponent,
  className,
}: ProductGridProps) {
  const t = useTranslations('category');

  // Default loading component
  const defaultLoadingComponent = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      ))}
    </div>
  );

  // Default empty state
  const defaultEmptyState = (
    <div className="text-center py-12">
      <p className="text-lg font-medium">{t('noResults')}</p>
      <p className="text-gray-500 mt-2">{t('tryDifferentFilters')}</p>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>{loadingComponent || defaultLoadingComponent}</div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return <div className={cn('w-full', className)}>{emptyState || defaultEmptyState}</div>;
  }

  // Products grid
  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = 'ProductGrid';
