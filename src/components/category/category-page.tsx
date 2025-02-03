'use client';

import { CategoryProductList } from '@/components/category/category-product-list';
import type { FacetValue, SpecFacet } from '@/types/product';
import { useTranslations } from 'next-intl';

interface CategoryPageProps {
  categorySlug: string;
  categoryName: string;
  initialPage: number;
  initialItemsPerPage: number;
  minPossiblePrice: number;
  maxPossiblePrice: number;
  initialFilters: {
    price_range: {
      min: number;
      max: number;
    };
    facets: {
      brand: FacetValue[];
      model: FacetValue[];
    };
    specs_facets: SpecFacet[];
  };
}

export function CategoryPage({
  categorySlug,
  initialPage,
  initialItemsPerPage,
  initialFilters,
  minPossiblePrice,
  maxPossiblePrice,
}: CategoryPageProps) {
  const t = useTranslations('category');

  return (
    <div className="space-y-4">
      <div className="border-b border-primary-light/20 pb-2">
        <h1 className="text-lg font-medium text-accent">
          {t('title', { category: categorySlug })}
        </h1>
      </div>
      <CategoryProductList
        categorySlug={categorySlug}
        initialPage={initialPage}
        initialItemsPerPage={initialItemsPerPage}
        initialFilters={initialFilters}
        minPossiblePrice={minPossiblePrice}
        maxPossiblePrice={maxPossiblePrice}
      />
    </div>
  );
}
