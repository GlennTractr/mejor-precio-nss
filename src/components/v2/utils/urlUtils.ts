import { FilterState } from '../types';

// Parse URL search params into filter state
export function parseUrlToFilters(
  searchParams: URLSearchParams,
  defaultItemsPerPage: number = 20,
  minPossiblePrice: number = 0,
  maxPossiblePrice: number = 1000
): FilterState {
  const rawMinPrice = searchParams.get('min_price');
  const rawMaxPrice = searchParams.get('max_price');

  // Round to 2 decimal places to prevent floating point precision issues
  const minPrice = rawMinPrice ? Math.round(parseFloat(rawMinPrice) * 100) / 100 : minPossiblePrice;
  const maxPrice = rawMaxPrice ? Math.round(parseFloat(rawMaxPrice) * 100) / 100 : maxPossiblePrice;

  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    itemsPerPage: parseInt(searchParams.get('per_page') || String(defaultItemsPerPage), 10),
    query: searchParams.get('q') || '',
    selectedBrands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    selectedModels: searchParams.get('models')?.split(',').filter(Boolean) || [],
    selectedSpecLabels: searchParams.get('specs')?.split(',').filter(Boolean) || [],
    priceRange: [minPrice, maxPrice],
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
  if (filters.priceRange[0] !== minPossiblePrice || filters.priceRange[1] !== maxPossiblePrice) {
    // Round prices to 2 decimal places to prevent floating point precision issues
    const roundedMinPrice = Math.round(filters.priceRange[0] * 100) / 100;
    const roundedMaxPrice = Math.round(filters.priceRange[1] * 100) / 100;

    params.set('min_price', String(roundedMinPrice));
    params.set('max_price', String(roundedMaxPrice));
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
  const pageEqual = filters1.page === filters2.page;
  const itemsPerPageEqual = filters1.itemsPerPage === filters2.itemsPerPage;
  const queryEqual = filters1.query === filters2.query;

  // Use tolerance-based comparison for floating-point prices
  const PRICE_TOLERANCE = 0.005; // 0.5 cent tolerance
  const priceRange0Equal =
    Math.abs(filters1.priceRange[0] - filters2.priceRange[0]) < PRICE_TOLERANCE;
  const priceRange1Equal =
    Math.abs(filters1.priceRange[1] - filters2.priceRange[1]) < PRICE_TOLERANCE;

  const brandsEqual = arraysEqual(filters1.selectedBrands, filters2.selectedBrands);
  const modelsEqual = arraysEqual(filters1.selectedModels, filters2.selectedModels);
  const specsEqual = arraysEqual(filters1.selectedSpecLabels, filters2.selectedSpecLabels);

  const result =
    pageEqual &&
    itemsPerPageEqual &&
    queryEqual &&
    priceRange0Equal &&
    priceRange1Equal &&
    brandsEqual &&
    modelsEqual &&
    specsEqual;

  return result;
}

// Helper function to compare arrays
function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, index) => val === sorted2[index]);
}
