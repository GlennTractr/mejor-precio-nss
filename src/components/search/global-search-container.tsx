'use client';

import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGlobalSearchData, getGlobalInitialFilters } from '@/lib/api/global-search-queries';
import type { GlobalSearchFilters } from '@/lib/api/global-search-queries';
import { ProductGrid } from '@/components/product/product-grid';
import {
  FilterSidebar,
  ActiveFiltersBar,
  ResultsHeader,
  ProductPagination,
} from '@/components/ui';
import { useProductFilters } from '@/hooks/use-product-filters';
import {
  getActiveFilters,
  hasActiveFilters,
  createDefaultFormatters,
  removeFilterById,
} from '@/lib/v2';
import { FilterType } from '@/types/v2';

interface GlobalSearchContainerProps {
  query: string;
  initialFilters: GlobalSearchFilters;
  minPossiblePrice: number;
  maxPossiblePrice: number;
  initialPage?: number;
  initialItemsPerPage?: number;
  initialBrands?: string[];
  initialModels?: string[];
  initialMinPrice?: number;
  initialMaxPrice?: number;
}

export function GlobalSearchContainer({
  initialFilters,
  minPossiblePrice,
  maxPossiblePrice,
  initialPage = 1,
  initialItemsPerPage = 20,
}: GlobalSearchContainerProps) {
  // Filter state management - parameters are read from URL automatically
  const {
    filters,
    toggleBrand,
    toggleModel,
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
    queryKey: ['globalFilters'],
    queryFn: () => getGlobalInitialFilters(),
    initialData: initialFilters,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query for products with current filters
  const { data: searchData, isLoading } = useQuery({
    queryKey: [
      'globalSearchProducts',
      filters.page,
      filters.itemsPerPage,
      filters.query,
      filters.selectedBrands,
      filters.selectedModels,
      filters.priceRange,
    ],
    queryFn: () =>
      getGlobalSearchData({
        page: filters.page,
        perPage: filters.itemsPerPage,
        query: filters.query,
        brands: filters.selectedBrands,
        models: filters.selectedModels,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
      }),
    staleTime: 1000 * 60, // 1 minute
  });

  // Transform data for V2 components
  const transformedData = useMemo(() => {
    const currentFilters = searchData?.filters || filtersData;

    return {
      products: searchData?.products || [],
      totalItems: searchData?.totalItems || 0,
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
      specFilters: [], // No specs for global search - category-specific filters hidden
    };
  }, [searchData, filtersData, filters]);

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
          // Specs not available for global search - do nothing
          break;
        default:
          // Handle other filter types if needed
          break;
      }
    },
    [toggleBrand, toggleModel]
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
          specFilters={transformedData.specFilters} // Empty array - specs hidden
          onFilterToggle={handleFilterToggle}
          onResetFilters={resetAllFilters}
          hasActiveFilters={hasActiveFiltersFlag}
          hideSpecFilters={true} // Explicitly hide spec filters for global search
          context="global" // Context for FilterSidebar to know it's global search
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
