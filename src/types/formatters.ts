import { FilterType } from './filters';

// Price formatting options
export interface PriceFormatterOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

// Filter display formatting functions
export interface FilterDisplayFormatters {
  price: (price: number, options?: PriceFormatterOptions) => string;
  filterLabel: (type: FilterType, value: string) => string;
  resultCount: (count: number) => string;
  pageInfo: (current: number, total: number) => string;
}

// URL formatting functions
export interface UrlFormatters {
  buildFilterParams: (filters: Record<string, unknown>) => URLSearchParams;
  parseFilterParams: (params: URLSearchParams) => Record<string, unknown>;
}

// Combined formatter interface
export interface AllFormatters extends FilterDisplayFormatters, UrlFormatters {}
