'use client';

import { CategoryProductList } from '@/components/category/category-product-list';
import type { FacetValue, SpecFacet } from '@/types/product';

interface CategoryPageProps {
  categorySlug: string;
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
  return (
    <CategoryProductList
      categorySlug={categorySlug}
      initialPage={initialPage}
      initialItemsPerPage={initialItemsPerPage}
      initialFilters={initialFilters}
      minPossiblePrice={minPossiblePrice}
      maxPossiblePrice={maxPossiblePrice}
    />
  );
}
