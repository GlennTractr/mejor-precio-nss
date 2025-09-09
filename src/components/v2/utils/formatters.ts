/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterType, PriceFormatterOptions } from '../types';

// Default price formatter (matches existing implementation)
export function formatPrice(price: number, options: PriceFormatterOptions = {}): string {
  const {
    locale = 'es-ES',
    currency = 'EUR',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);
}

// Format filter labels for display
export function formatFilterLabel(type: FilterType, value: string): string {
  switch (type) {
    case 'brand':
      return `Brand: ${value}`;
    case 'model':
      return `Model: ${value}`;
    case 'spec':
      return value; // Specs are displayed as-is
    default:
      return value;
  }
}

// Format result count for display
export function formatResultCount(count: number): string {
  if (count === 0) return 'No results found';
  if (count === 1) return '1 result';
  return `${count.toLocaleString()} results`;
}

// Format pagination info
export function formatPageInfo(currentPage: number, totalPages: number): string {
  return `Page ${currentPage} of ${totalPages}`;
}

// Format items per page display
export function formatItemsPerPage(itemsPerPage: number): string {
  return `${itemsPerPage} per page`;
}

// Format price range for display
export function formatPriceRange(
  min: number,
  max: number,
  options: PriceFormatterOptions = {}
): string {
  const formattedMin = formatPrice(min, options);
  const formattedMax = formatPrice(max, options);
  return `${formattedMin} - ${formattedMax}`;
}

// Format filter count badge
export function formatFilterCount(count: number): string {
  if (count === 0) return '';
  if (count > 999) return '999+';
  return String(count);
}

// Format search query for display (truncate if too long)
export function formatSearchQuery(query: string, maxLength: number = 30): string {
  if (query.length <= maxLength) return query;
  return `${query.substring(0, maxLength - 3)}...`;
}

// Debounce function for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Create default formatters object for components
export function createDefaultFormatters(options: PriceFormatterOptions = {}) {
  return {
    price: (price: number) => formatPrice(price, options),
    filterLabel: formatFilterLabel,
  };
}

// Utility to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

// Utility to capitalize first letter
export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
