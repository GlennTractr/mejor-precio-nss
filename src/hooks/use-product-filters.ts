import { useCallback, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '@/types/v2';
import {
  parseUrlToFilters,
  filtersToUrlParams,
  areFiltersEqual,
  validateFilterState,
} from '@/lib/v2';

interface UseProductFiltersProps {
  initialPage?: number;
  initialItemsPerPage?: number;
  minPossiblePrice: number;
  maxPossiblePrice: number;
  onFiltersChange?: (filters: FilterState) => void;
}

export function useProductFilters({
  initialPage = 1,
  initialItemsPerPage = 20,
  minPossiblePrice,
  maxPossiblePrice,
  onFiltersChange,
}: UseProductFiltersProps) {
  console.debug('🚀 [useProductFilters] Initializing with initialPage:', initialPage);
  const router = useRouter();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const initialFilters = parseUrlToFilters(
    searchParams || new URLSearchParams(),
    initialItemsPerPage,
    minPossiblePrice,
    maxPossiblePrice
  );

  // Validate and set initial filters
  const [filters, setFilters] = useState<FilterState>(() =>
    validateFilterState(initialFilters, minPossiblePrice, maxPossiblePrice)
  );

  // Update filters function with validation
  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters(prevFilters => {
        const updatedFilters = { ...prevFilters, ...newFilters };
        const validatedFilters = validateFilterState(
          updatedFilters,
          minPossiblePrice,
          maxPossiblePrice
        );

        return validatedFilters;
      });
    },
    [minPossiblePrice, maxPossiblePrice]
  );

  // Individual filter update functions
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      // Reset to page 1 for most filter changes
      const updates: Partial<FilterState> = { [key]: value };
      if (key !== 'page') {
        updates.page = 1;
      }
      updateFilters(updates);
    },
    [updateFilters]
  );

  const toggleFilterValue = useCallback(
    (type: 'selectedBrands' | 'selectedModels' | 'selectedSpecLabels', value: string) => {
      const currentValues = filters[type];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      updateFilter(type, newValues);
    },
    [filters, updateFilter]
  );

  const resetAllFilters = useCallback(() => {
    const resetFilters: FilterState = {
      page: 1,
      itemsPerPage: filters.itemsPerPage,
      query: '',
      selectedBrands: [],
      selectedModels: [],
      selectedSpecLabels: [],
      priceRange: [minPossiblePrice, maxPossiblePrice],
    };
    setFilters(resetFilters);
  }, [filters.itemsPerPage, minPossiblePrice, maxPossiblePrice]);

  // Update URL when filters change
  useEffect(() => {
    const params = filtersToUrlParams(
      filters,
      minPossiblePrice,
      maxPossiblePrice,
      initialItemsPerPage
    );

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    const currentUrl = `${pathname}?${searchParams?.toString() || ''}`;

    // Normalize URLs by removing trailing empty params for comparison
    const normalizeUrl = (url: string) => url.replace(/\?$/, '');
    const normalizedNewUrl = normalizeUrl(url);
    const normalizedCurrentUrl = normalizeUrl(currentUrl);

    // Only push if URL would actually change
    if (normalizedNewUrl !== normalizedCurrentUrl) {
      router.push(url, { scroll: false });
    }
  }, [filters, pathname, router, minPossiblePrice, maxPossiblePrice, initialItemsPerPage]); // Removed searchParams to prevent circular updates

  // Notify parent component of filter changes
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  // Sync with URL params when they change externally
  useEffect(() => {
    const urlFilters = parseUrlToFilters(
      searchParams || new URLSearchParams(),
      initialItemsPerPage,
      minPossiblePrice,
      maxPossiblePrice
    );

    const validatedUrlFilters = validateFilterState(urlFilters, minPossiblePrice, maxPossiblePrice);

    if (!areFiltersEqual(filters, validatedUrlFilters)) {
      setFilters(validatedUrlFilters);
    }
  }, [searchParams, initialItemsPerPage, minPossiblePrice, maxPossiblePrice]); // Removed 'filters' to prevent circular dependency

  return {
    filters,
    updateFilter,
    updateFilters,
    toggleFilterValue,
    resetAllFilters,

    // Convenience methods for specific filter types
    toggleBrand: (brand: string) => toggleFilterValue('selectedBrands', brand),
    toggleModel: (model: string) => toggleFilterValue('selectedModels', model),
    toggleSpec: (spec: string) => toggleFilterValue('selectedSpecLabels', spec),

    setPage: (page: number) => updateFilter('page', page),
    setItemsPerPage: (perPage: number) => updateFilters({ itemsPerPage: perPage, page: 1 }),
    setQuery: (query: string) => updateFilters({ query, page: 1 }),
    setPriceRange: (range: [number, number]) => updateFilters({ priceRange: range, page: 1 }),
  };
}
