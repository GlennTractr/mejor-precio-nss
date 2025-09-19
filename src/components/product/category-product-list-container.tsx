'use client';

import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategoryData, getInitialFilters } from '@/lib/api/category-queries';
import type { CategoryFilters } from '@/lib/api/category-queries';
import { ProductGrid } from '@/components/product/product-grid';
import { FilterSidebar, ActiveFiltersBar, ResultsHeader, ProductPagination } from '@/components/ui';
import { useProductFilters } from '@/hooks/use-product-filters';
import {
  getActiveFilters,
  hasActiveFilters,
  createDefaultFormatters,
  removeFilterById,
} from '@/lib';
import { FilterType } from '@/types/filters';

interface CategoryProductListContainerProps {
  categorySlug: string;
  categoryName?: string;
  initialFilters: CategoryFilters;
  minPossiblePrice: number;
  maxPossiblePrice: number;
  initialPage?: number;
  initialItemsPerPage?: number;
}

export function CategoryProductListContainer({
  categorySlug,
  categoryName,
  initialFilters,
  minPossiblePrice,
  maxPossiblePrice,
  initialPage = 1,
  initialItemsPerPage = 20,
}: CategoryProductListContainerProps) {
  console.debug(categoryName);
  // Filter state management
  const {
    filters,
    toggleBrand,
    toggleModel,
    toggleSpec,
    setPage,
    setItemsPerPage,
    setQuery,
    setPriceRange,
    resetAllFilters,
  } = useProductFilters({
    initialPage,
    initialItemsPerPage,
    minPossiblePrice,
    maxPossiblePrice,
  });

  // Query for initial filters (doesn't change with filter updates)
  const { data: filtersData } = useQuery({
    queryKey: ['categoryFilters', categorySlug],
    queryFn: () => getInitialFilters(categorySlug),
    initialData: initialFilters,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query for products with current filters
  const { data: categoryData, isLoading } = useQuery({
    queryKey: [
      'categoryProducts',
      categorySlug,
      filters.page,
      filters.itemsPerPage,
      filters.query,
      filters.selectedBrands,
      filters.selectedModels,
      filters.priceRange,
      filters.selectedSpecLabels,
    ],
    queryFn: () =>
      getCategoryData(categorySlug, {
        page: filters.page,
        perPage: filters.itemsPerPage,
        query: filters.query,
        brands: filters.selectedBrands,
        models: filters.selectedModels,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        specTypes: [], // Not needed for v2
        specLabels: filters.selectedSpecLabels,
      }),
    staleTime: 1000 * 60, // 1 minute
  });

  // Transform data for V2 components
  const transformedData = useMemo(() => {
    const currentFilters = categoryData?.filters || filtersData;

    return {
      products: categoryData?.products || [],
      totalItems: categoryData?.totalItems || 0,
      brandFilters: {
        items: currentFilters.facets.brand.map(facet => ({
          value: facet.value,
          count: facet.count,
          disabled: facet.count === 0,
        })),
        selectedItems: filters.selectedBrands,
      },
      modelFilters: {
        items: currentFilters.facets.model.map(facet => ({
          value: facet.value,
          count: facet.count,
          disabled: facet.count === 0,
        })),
        selectedItems: filters.selectedModels,
      },
      specFilters: currentFilters.specs_facets.map(specFacet => ({
        type: specFacet.type,
        labels: specFacet.labels.map(label => ({
          value: label.value,
          count: label.count,
          disabled: label.count === 0,
        })),
        selectedItems: filters.selectedSpecLabels.filter((selectedSpec: string) =>
          specFacet.labels.some(label => label.value === selectedSpec)
        ),
      })),
    };
  }, [categoryData, filtersData, filters]);

  // Create formatters
  const formatters = useMemo(() => createDefaultFormatters(), []);

  // Active filters logic
  const activeFilters = useMemo(
    () => getActiveFilters(filters, minPossiblePrice, maxPossiblePrice, formatters.price),
    [filters, minPossiblePrice, maxPossiblePrice, formatters.price]
  );

  const hasActiveFiltersFlag = useMemo(
    () => hasActiveFilters(filters, minPossiblePrice, maxPossiblePrice),
    [filters, minPossiblePrice, maxPossiblePrice]
  );

  // Handle active filter removal
  const handleRemoveFilter = useCallback(
    (filterId: string) => {
      const updates = removeFilterById(filters, filterId, minPossiblePrice, maxPossiblePrice);

      // Apply the updates using individual setters
      Object.entries(updates).forEach(([key, value]) => {
        switch (key) {
          case 'query':
            setQuery(value as string);
            break;
          case 'selectedBrands':
            // This is more complex, we need to set the entire array
            // We'll handle this case by case
            if (filterId.startsWith('brand-')) {
              const brandToRemove = filterId.replace('brand-', '');
              toggleBrand(brandToRemove);
            }
            break;
          case 'selectedModels':
            if (filterId.startsWith('model-')) {
              const modelToRemove = filterId.replace('model-', '');
              toggleModel(modelToRemove);
            }
            break;
          case 'selectedSpecLabels':
            if (filterId.startsWith('spec-')) {
              const specToRemove = filterId.replace('spec-', '');
              toggleSpec(specToRemove);
            }
            break;
          case 'priceRange':
            setPriceRange(value as [number, number]);
            break;
          case 'page':
            setPage(value as number);
            break;
        }
      });
    },
    [
      filters,
      minPossiblePrice,
      maxPossiblePrice,
      setQuery,
      toggleBrand,
      toggleModel,
      toggleSpec,
      setPriceRange,
      setPage,
    ]
  );

  // Handle filter toggle for different types
  const handleFilterToggle = useCallback(
    (type: FilterType, value: string) => {
      switch (type) {
        case 'brand':
          toggleBrand(value);
          break;
        case 'model':
          toggleModel(value);
          break;
        case 'spec':
          toggleSpec(value);
          break;
        default:
          // Handle other filter types if needed
          break;
      }
    },
    [toggleBrand, toggleModel, toggleSpec]
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {/* Filter Sidebar */}
      <div className="md:col-span-1">
        <FilterSidebar
          searchQuery={filters.query}
          onSearchChange={setQuery}
          priceRange={filters.priceRange}
          onPriceRangeChange={setPriceRange}
          minPossiblePrice={minPossiblePrice}
          maxPossiblePrice={maxPossiblePrice}
          brandFilters={transformedData.brandFilters}
          modelFilters={transformedData.modelFilters}
          specFilters={transformedData.specFilters}
          onFilterToggle={handleFilterToggle}
          onResetFilters={resetAllFilters}
          hasActiveFilters={hasActiveFiltersFlag}
        />
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-3 space-y-6">
        {/* Active Filters Bar */}
        <ActiveFiltersBar
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={resetAllFilters}
          formatters={formatters}
        />

        {/* Results Header */}
        <ResultsHeader
          totalItems={transformedData.totalItems}
          itemsPerPage={filters.itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        {/* Products Grid */}
        <ProductGrid
          products={transformedData.products}
          isLoading={isLoading}
          itemsPerPage={filters.itemsPerPage}
        />

        {/* Pagination */}
        <ProductPagination
          currentPage={filters.page}
          totalItems={transformedData.totalItems}
          itemsPerPage={filters.itemsPerPage}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
