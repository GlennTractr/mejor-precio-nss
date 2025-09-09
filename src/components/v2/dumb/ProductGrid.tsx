'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/product/product-card';
import { Loading } from '@/components/ui/loading';
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
  console.debug('🚀 [ProductGridComponent] Initializing with itemsPerPage:', itemsPerPage);
  const t = useTranslations('category');

  // Default empty state
  const defaultEmptyState = (
    <div className="text-center py-12">
      <p className="text-lg font-medium">{t('noResults')}</p>
      <p className="text-gray-500 mt-2">{t('tryDifferentFilters')}</p>
    </div>
  );

  // Loading state - always show Loading component during loading
  if (isLoading) {
    const defaultLoadingComponent = (
      <div className="min-h-[400px]">
        <Loading size="md" />
      </div>
    );

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
