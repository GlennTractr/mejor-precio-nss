import { FilterState } from '../types';

// Parse URL search params into filter state
export function parseUrlToFilters(
  searchParams: URLSearchParams,
  defaultItemsPerPage: number = 20,
  minPossiblePrice: number = 0,
  maxPossiblePrice: number = 1000
): FilterState {
  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    itemsPerPage: parseInt(searchParams.get('per_page') || String(defaultItemsPerPage), 10),
    query: searchParams.get('q') || '',
    selectedBrands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    selectedModels: searchParams.get('models')?.split(',').filter(Boolean) || [],
    selectedSpecLabels: searchParams.get('specs')?.split(',').filter(Boolean) || [],
    priceRange: [
      parseInt(searchParams.get('min_price') || String(minPossiblePrice), 10),
      parseInt(searchParams.get('max_price') || String(maxPossiblePrice), 10),
    ],
  };
}

// Convert filter state to URL search params
export function filtersToUrlParams(
  filters: FilterState,
  minPossiblePrice: number = 0,
  maxPossiblePrice: number = 1000,
  defaultItemsPerPage: number = 20
): URLSearchParams {
  const params = new URLSearchParams();

  // Only add parameters that differ from defaults to keep URLs clean
  if (filters.page !== 1) {
    params.set('page', String(filters.page));
  }

  if (filters.itemsPerPage !== defaultItemsPerPage) {
    params.set('per_page', String(filters.itemsPerPage));
  }

  if (filters.query.trim()) {
    params.set('q', filters.query.trim());
  }

  if (filters.selectedBrands.length > 0) {
    params.set('brands', filters.selectedBrands.join(','));
  }

  if (filters.selectedModels.length > 0) {
    params.set('models', filters.selectedModels.join(','));
  }

  if (filters.selectedSpecLabels.length > 0) {
    params.set('specs', filters.selectedSpecLabels.join(','));
  }

  // Only add price range if it's not the full range
  if (
    filters.priceRange[0] !== minPossiblePrice ||
    filters.priceRange[1] !== maxPossiblePrice
  ) {
    params.set('min_price', String(filters.priceRange[0]));
    params.set('max_price', String(filters.priceRange[1]));
  }

  return params;
}

// Build full URL with current pathname and new params
export function buildUrlWithFilters(
  pathname: string,
  filters: FilterState,
  minPossiblePrice: number = 0,
  maxPossiblePrice: number = 1000,
  defaultItemsPerPage: number = 20
): string {
  const params = filtersToUrlParams(
    filters,
    minPossiblePrice,
    maxPossiblePrice,
    defaultItemsPerPage
  );
  
  const paramString = params.toString();
  return paramString ? `${pathname}?${paramString}` : pathname;
}

// Validate filter values from URL to ensure they're safe
export function validateFilterState(
  filters: FilterState,
  minPossiblePrice: number,
  maxPossiblePrice: number,
  maxItemsPerPage: number = 100
): FilterState {
  return {
    ...filters,
    page: Math.max(1, filters.page),
    itemsPerPage: Math.min(Math.max(10, filters.itemsPerPage), maxItemsPerPage),
    query: filters.query.substring(0, 100), // Limit query length
    selectedBrands: filters.selectedBrands.slice(0, 20), // Limit selections
    selectedModels: filters.selectedModels.slice(0, 20),
    selectedSpecLabels: filters.selectedSpecLabels.slice(0, 20),
    priceRange: [
      Math.max(minPossiblePrice, Math.min(filters.priceRange[0], maxPossiblePrice)),
      Math.min(maxPossiblePrice, Math.max(filters.priceRange[1], minPossiblePrice)),
    ],
  };
}

// Check if two filter states are equal (for preventing unnecessary updates)
export function areFiltersEqual(filters1: FilterState, filters2: FilterState): boolean {
  return (
    filters1.page === filters2.page &&
    filters1.itemsPerPage === filters2.itemsPerPage &&
    filters1.query === filters2.query &&
    filters1.priceRange[0] === filters2.priceRange[0] &&
    filters1.priceRange[1] === filters2.priceRange[1] &&
    arraysEqual(filters1.selectedBrands, filters2.selectedBrands) &&
    arraysEqual(filters1.selectedModels, filters2.selectedModels) &&
    arraysEqual(filters1.selectedSpecLabels, filters2.selectedSpecLabels)
  );
}

// Helper function to compare arrays
function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, index) => val === sorted2[index]);
}