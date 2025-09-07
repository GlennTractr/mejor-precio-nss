import { ReactNode } from 'react';
import { Product } from '@/types/product';
import {
  FilterSection,
  SpecFilterSection,
  ActiveFilter,
  FilterFormatters,
  FilterType,
  SortOption,
  FilterItem,
} from './filters';

// ProductGrid component props
export interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  itemsPerPage: number;
  emptyState?: ReactNode;
  loadingComponent?: ReactNode;
  className?: string;
}

// FilterSidebar component props
export interface FilterSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPossiblePrice: number;
  maxPossiblePrice: number;
  brandFilters: FilterSection;
  modelFilters: FilterSection;
  specFilters: SpecFilterSection[];
  onFilterToggle: (type: FilterType, value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

// ActiveFiltersBar component props
export interface ActiveFiltersBarProps {
  activeFilters: ActiveFilter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
  formatters: FilterFormatters;
  className?: string;
}

// ResultsHeader component props
export interface ResultsHeaderProps {
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange: (perPage: number) => void;
  sortOptions?: SortOption[];
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  className?: string;
}

// ProductPagination component props
export interface ProductPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxPagesToShow?: number;
  className?: string;
}

// FilterAccordionSection component props
export interface FilterAccordionSectionProps {
  title: string;
  items: FilterItem[];
  selectedItems: string[];
  onToggle: (value: string) => void;
  maxHeight?: number;
  sortBy?: 'count' | 'alphabetical';
  variant?: 'primary' | 'secondary';
  className?: string;
}

// FilterItem is imported above and used in FilterAccordionSectionProps

// LoadingSkeletons component props
export interface LoadingSkeletonsProps {
  count: number;
  type: 'product' | 'filter' | 'header';
  className?: string;
}