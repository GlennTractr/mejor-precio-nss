'use client';

import { ProductListFiltered } from '@/components/product/product-list-filtered';
import type { CategoryFilters } from '@/lib/api/category-queries';
import useCategoryData from '@/hooks/use-category-data';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('category');

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

  return (
    <div className="space-y-4">
      <div className="border-b border-primary-light/20 pb-2">
        <h1 className="text-lg font-medium text-accent">
          {t('title', { category: categoryName || filters.category_name })}
        </h1>
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
  );
}
