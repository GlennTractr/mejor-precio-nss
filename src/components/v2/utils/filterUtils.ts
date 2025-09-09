import { FilterState, ActiveFilter } from '../types';

// Check if any filters are currently active
export function hasActiveFilters(
  filters: FilterState,
  minPossiblePrice: number,
  maxPossiblePrice: number
): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.selectedBrands.length > 0 ||
    filters.selectedModels.length > 0 ||
    filters.selectedSpecLabels.length > 0 ||
    filters.priceRange[0] > minPossiblePrice ||
    filters.priceRange[1] < maxPossiblePrice
  );
}

// Get all active filters as an array for display
export function getActiveFilters(
  filters: FilterState,
  minPossiblePrice: number,
  maxPossiblePrice: number,
  formatPrice: (price: number) => string
): ActiveFilter[] {
  const activeFilters: ActiveFilter[] = [];

  // Search filter
  if (filters.query.trim() !== '') {
    activeFilters.push({
      id: 'search',
      type: 'search',
      label: 'Search',
      displayValue: filters.query,
    });
  }

  // Brand filters
  filters.selectedBrands.forEach(brand => {
    activeFilters.push({
      id: `brand-${brand}`,
      type: 'brand',
      label: 'Brand',
      displayValue: brand,
    });
  });

  // Model filters
  filters.selectedModels.forEach(model => {
    activeFilters.push({
      id: `model-${model}`,
      type: 'model',
      label: 'Model',
      displayValue: model,
    });
  });

  // Spec filters
  filters.selectedSpecLabels.forEach(spec => {
    activeFilters.push({
      id: `spec-${spec}`,
      type: 'spec',
      label: 'Spec',
      displayValue: spec,
    });
  });

  // Price filter
  if (filters.priceRange[0] > minPossiblePrice || filters.priceRange[1] < maxPossiblePrice) {
    activeFilters.push({
      id: 'price',
      type: 'price',
      label: 'Price',
      displayValue: `${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}`,
    });
  }

  return activeFilters;
}

// Remove a specific filter by ID
export function removeFilterById(
  filters: FilterState,
  filterId: string,
  minPossiblePrice: number,
  maxPossiblePrice: number
): Partial<FilterState> {
  const updates: Partial<FilterState> = {};

  if (filterId === 'search') {
    updates.query = '';
  } else if (filterId === 'price') {
    updates.priceRange = [minPossiblePrice, maxPossiblePrice];
  } else if (filterId.startsWith('brand-')) {
    const brand = filterId.replace('brand-', '');
    updates.selectedBrands = filters.selectedBrands.filter(b => b !== brand);
  } else if (filterId.startsWith('model-')) {
    const model = filterId.replace('model-', '');
    updates.selectedModels = filters.selectedModels.filter(m => m !== model);
  } else if (filterId.startsWith('spec-')) {
    const spec = filterId.replace('spec-', '');
    updates.selectedSpecLabels = filters.selectedSpecLabels.filter(s => s !== spec);
  }

  // Reset to first page when filters change
  updates.page = 1;

  return updates;
}

// Toggle a filter value (add/remove)
export function toggleFilterValue(currentValues: string[], value: string): string[] {
  if (currentValues.includes(value)) {
    return currentValues.filter(v => v !== value);
  }
  return [...currentValues, value];
}

// Reset all filters to default state
export function resetAllFilters(
  minPossiblePrice: number,
  maxPossiblePrice: number,
  itemsPerPage: number = 20
): FilterState {
  return {
    page: 1,
    itemsPerPage,
    query: '',
    selectedBrands: [],
    selectedModels: [],
    selectedSpecLabels: [],
    priceRange: [minPossiblePrice, maxPossiblePrice],
  };
}

// Calculate pagination info
export function calculatePaginationInfo(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return {
    totalPages,
    startItem,
    endItem,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };
}

// Generate page numbers for pagination display
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxPagesToShow: number = 5
): (number | '...')[] {
  const pages: (number | '...')[] = [];

  if (totalPages <= maxPagesToShow) {
    // Show all pages if there are few
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate start and end of page range around current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if at the beginning or end
    if (currentPage <= 2) {
      end = Math.min(totalPages - 1, 4);
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(2, totalPages - 3);
    }

    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }

  return pages;
}
