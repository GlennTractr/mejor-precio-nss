'use client';

import { ProductListFiltered } from '@/components/product/product-list-filtered';
import type { CategoryFilters } from '@/lib/api/category-queries';
import useCategoryData from '@/hooks/use-category-data';

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
  const {
    products,
    totalItems,
    filters,
    isLoading,
    currentPage,
    itemsPerPage,
    searchQuery,
    selectedBrands,
    selectedModels,
    selectedSpecLabels,
    currentPriceRange,
    setPage,
    setItemsPerPage,
    setSearchQuery,
    toggleBrand,
    toggleModel,
    toggleSpecLabel,
    setPriceRange,
    resetFilters,
  } = useCategoryData({
    categorySlug,
    initialPage,
    initialItemsPerPage,
    initialFilters,
    minPossiblePrice,
    maxPossiblePrice,
  });

  const displayName = categoryName || filters.category_name;

  return (
    <div className="mx-auto w-full max-w-7xl pb-6">
      <div className="space-y-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl highlight-primary">{displayName}</h1>
        </div>
        <ProductListFiltered
          products={products}
          totalItems={totalItems}
          isLoading={isLoading}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          searchQuery={searchQuery}
          selectedBrands={selectedBrands}
          selectedModels={selectedModels}
          selectedSpecLabels={selectedSpecLabels}
          priceRange={currentPriceRange}
          minPossiblePrice={minPossiblePrice}
          maxPossiblePrice={maxPossiblePrice}
          brandFacets={filters.facets.brand}
          modelFacets={filters.facets.model}
          specFacets={filters.specs_facets}
          onPageChange={setPage}
          onItemsPerPageChange={setItemsPerPage}
          onSearchChange={setSearchQuery}
          onBrandToggle={toggleBrand}
          onModelToggle={toggleModel}
          onSpecLabelToggle={toggleSpecLabel}
          onPriceRangeChange={setPriceRange}
          onResetFilters={resetFilters}
        />
      </div>
    </div>
  );
}
