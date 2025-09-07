import { FacetValue, SpecFacet, Product } from '@/types/product';
import { ReactNode } from 'react';

// Core filter types
export interface FilterState {
  page: number;
  itemsPerPage: number;
  query: string;
  selectedBrands: string[];
  selectedModels: string[];
  selectedSpecLabels: string[];
  priceRange: [number, number];
}

export interface FilterFacets {
  brands: FacetValue[];
  models: FacetValue[];
  specs: SpecFacet[];
  minPossiblePrice: number;
  maxPossiblePrice: number;
}

export interface ActiveFilter {
  id: string;
  type: 'search' | 'brand' | 'model' | 'spec' | 'price';
  label: string;
  displayValue: string;
}

export type FilterType = 'search' | 'brand' | 'model' | 'spec' | 'price';

// Filter section types for reusable components
export interface FilterSection {
  items: FilterItem[];
  selectedItems: string[];
}

export interface FilterItem {
  value: string;
  count: number;
  disabled?: boolean;
}

export interface SpecFilterSection {
  type: string;
  labels: FilterItem[];
  selectedItems: string[];
}

// Filter formatters
export interface FilterFormatters {
  price: (price: number) => string;
  filterLabel: (type: FilterType, value: string) => string;
}

// Sort options (for future extension)
export interface SortOption {
  value: string;
  label: string;
}