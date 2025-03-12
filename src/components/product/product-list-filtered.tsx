'use client';

import { Product, FacetValue, SpecFacet } from '@/types/product';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductFilters } from '@/components/product/product-filters';
import { Badge } from '@/components/ui/badge';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

export interface ProductListFilteredProps {
  products: Product[];
  totalItems: number;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  selectedBrands: string[];
  selectedModels: string[];
  selectedSpecLabels: string[];
  priceRange: [number, number];
  minPossiblePrice: number;
  maxPossiblePrice: number;
  brandFacets: FacetValue[];
  modelFacets: FacetValue[];
  specFacets: SpecFacet[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (perPage: number) => void;
  onSearchChange: (query: string) => void;
  onBrandToggle: (brand: string) => void;
  onModelToggle: (model: string) => void;
  onSpecLabelToggle: (label: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onResetFilters: () => void;
}

export function ProductListFiltered({
  products,
  totalItems,
  isLoading,
  currentPage,
  itemsPerPage,
  searchQuery,
  selectedBrands,
  selectedModels,
  selectedSpecLabels,
  priceRange,
  minPossiblePrice,
  maxPossiblePrice,
  brandFacets,
  modelFacets,
  specFacets,
  onPageChange,
  onItemsPerPageChange,
  onSearchChange,
  onBrandToggle,
  onModelToggle,
  onSpecLabelToggle,
  onPriceRangeChange,
  onResetFilters,
}: ProductListFilteredProps) {
  const t = useTranslations('category');

  // Check if any filters are applied
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedBrands.length > 0 ||
    selectedModels.length > 0 ||
    selectedSpecLabels.length > 0 ||
    priceRange[0] > minPossiblePrice ||
    priceRange[1] < maxPossiblePrice;

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Simple pagination component
  function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
  }: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  }) {
    const totalPages = Math.ceil(totalItems / pageSize);

    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;

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
        pages.push(totalPages);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            &lt;
          </button>

          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...' || page === currentPage}
              className={`px-3 py-1 rounded border ${
                page === currentPage ? 'bg-primary text-white' : ''
              } ${page === '...' ? 'cursor-default' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {/* Filters sidebar */}
      <ProductFilters
        searchQuery={searchQuery}
        selectedBrands={selectedBrands}
        selectedModels={selectedModels}
        selectedSpecLabels={selectedSpecLabels}
        priceRange={priceRange}
        minPossiblePrice={minPossiblePrice}
        maxPossiblePrice={maxPossiblePrice}
        brandFacets={brandFacets}
        modelFacets={modelFacets}
        specFacets={specFacets}
        onSearchChange={onSearchChange}
        onBrandToggle={onBrandToggle}
        onModelToggle={onModelToggle}
        onSpecLabelToggle={onSpecLabelToggle}
        onPriceRangeChange={onPriceRangeChange}
        onResetFilters={onResetFilters}
      />

      {/* Products grid */}
      <div className="md:col-span-3 space-y-6">
        {/* Active filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">{t('activeFilters')}:</span>

            {searchQuery.trim() !== '' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('filters.search')}: {searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => onSearchChange('')}
                >
                  <Cross2Icon className="h-3 w-3" />
                  <span className="sr-only">{t('removeFilter')}</span>
                </Button>
              </Badge>
            )}

            {selectedBrands.map(brand => (
              <Badge key={`brand-${brand}`} variant="secondary" className="flex items-center gap-1">
                {t('filters.brand')}: {brand}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => onBrandToggle(brand)}
                >
                  <Cross2Icon className="h-3 w-3" />
                  <span className="sr-only">{t('removeFilter')}</span>
                </Button>
              </Badge>
            ))}

            {selectedModels.map(model => (
              <Badge key={`model-${model}`} variant="secondary" className="flex items-center gap-1">
                {t('filters.model')}: {model}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => onModelToggle(model)}
                >
                  <Cross2Icon className="h-3 w-3" />
                  <span className="sr-only">{t('removeFilter')}</span>
                </Button>
              </Badge>
            ))}

            {selectedSpecLabels.map(spec => (
              <Badge key={`spec-${spec}`} variant="secondary" className="flex items-center gap-1">
                {spec}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => onSpecLabelToggle(spec)}
                >
                  <Cross2Icon className="h-3 w-3" />
                  <span className="sr-only">{t('removeFilter')}</span>
                </Button>
              </Badge>
            ))}

            {(priceRange[0] > minPossiblePrice || priceRange[1] < maxPossiblePrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('filters.price')}: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => onPriceRangeChange([minPossiblePrice, maxPossiblePrice])}
                >
                  <Cross2Icon className="h-3 w-3" />
                  <span className="sr-only">{t('removeFilter')}</span>
                </Button>
              </Badge>
            )}

            <Button
              variant="link"
              size="sm"
              className="text-primary font-medium"
              onClick={onResetFilters}
            >
              {t('clearAll')}
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">{t('results', { count: totalItems })}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('itemsPerPage')}</span>
            <select
              value={itemsPerPage}
              onChange={e => onItemsPerPageChange(Number(e.target.value))}
              className="border rounded p-1 text-sm"
            >
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium">{t('noResults')}</p>
            <p className="text-gray-500 mt-2">{t('tryDifferentFilters')}</p>
          </div>
        )}

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={itemsPerPage}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}
