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
  description?: string;
}

export function CategoryPage({
  categorySlug,
  categoryName,
  description,
  initialPage,
  initialItemsPerPage,
  initialFilters,
  minPossiblePrice,
  maxPossiblePrice,
}: CategoryPageProps) {
  const displayName = categoryName || initialFilters.category_name;

  return (
    <>
      <div className="bg-secondary-light">
        <div className="mx-auto w-full max-w-7xl py-[25px]">
          <div className="mb-6 text-center">
            <h1 className="text-2xl highlight-sand mb-4">{displayName}</h1>
            {description && (
              <p className="text-secondary mb-6 max-w-2xl mx-auto text-sm font-bold">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl pt-[25px] pb-[75px]">
        <div className="space-y-6">
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
    </>
  );
}
