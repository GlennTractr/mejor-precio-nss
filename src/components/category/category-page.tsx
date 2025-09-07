'use client';

import { CategoryProductListContainer } from '@/components/v2/smart/CategoryProductListContainer';
import type { CategoryFilters } from '@/lib/api/category-queries';

interface CategoryPageProps {
  categorySlug: string;
  categoryName: string;
  initialPage: number;
  initialItemsPerPage: number;
  minPossiblePrice: number;
  maxPossiblePrice: number;
  initialFilters: CategoryFilters;
}

export function CategoryPage({
  categorySlug,
  categoryName,
  initialPage,
  initialItemsPerPage,
  initialFilters,
  minPossiblePrice,
  maxPossiblePrice,
}: CategoryPageProps) {
  const displayName = categoryName || initialFilters.category_name;

  return (
    <div className="mx-auto w-full max-w-7xl pb-6">
      <div className="space-y-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl highlight-primary">{displayName}</h1>
        </div>
        <CategoryProductListContainer
          categorySlug={categorySlug}
          categoryName={categoryName}
          initialFilters={initialFilters}
          minPossiblePrice={minPossiblePrice}
          maxPossiblePrice={maxPossiblePrice}
          initialPage={initialPage}
          initialItemsPerPage={initialItemsPerPage}
        />
      </div>
    </div>
  );
}
