'use client';

import { useState } from 'react';
import { Product, FacetValue, SpecFacet } from '@/types/product';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

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
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInputValue);
  };

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  const handlePriceRangeCommit = () => {
    onPriceRangeChange(localPriceRange);
  };

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
      <div className="space-y-6 rounded-lg border p-4">
        <div>
          <h2 className="mb-2 font-medium">{t('filters.search')}</h2>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="text"
              value={searchInputValue}
              onChange={handleSearchInput}
              placeholder={t('filters.searchPlaceholder')}
              className="pr-10"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3"
              aria-label={t('filters.searchButton')}
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div>
          <h2 className="mb-2 font-medium">{t('filters.price')}</h2>
          <div className="space-y-4">
            <Slider
              min={minPossiblePrice}
              max={maxPossiblePrice}
              step={1}
              value={[localPriceRange[0], localPriceRange[1]]}
              onValueChange={handlePriceRangeChange}
              onValueCommit={handlePriceRangeCommit}
            />
            <div className="flex justify-between text-sm">
              <span>{formatPrice(localPriceRange[0])}</span>
              <span>{formatPrice(localPriceRange[1])}</span>
            </div>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={['brands', 'models', 'specs']}>
          {/* Brands filter */}
          {brandFacets.length > 0 && (
            <AccordionItem value="brands">
              <AccordionTrigger>{t('filters.brands')}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {brandFacets
                    .sort((a, b) => b.count - a.count)
                    .map(brand => (
                      <div key={brand.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`brand-${brand.value}`}
                          checked={selectedBrands.includes(brand.value)}
                          onCheckedChange={() => onBrandToggle(brand.value)}
                          disabled={brand.count === 0}
                        />
                        <label
                          htmlFor={`brand-${brand.value}`}
                          className={`text-sm flex-1 cursor-pointer ${
                            brand.count === 0 ? 'text-gray-400' : ''
                          }`}
                        >
                          {brand.value} ({brand.count})
                        </label>
                      </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Models filter */}
          {modelFacets.length > 0 && (
            <AccordionItem value="models">
              <AccordionTrigger>{t('filters.models')}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {modelFacets
                    .sort((a, b) => b.count - a.count)
                    .map(model => (
                      <div key={model.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`model-${model.value}`}
                          checked={selectedModels.includes(model.value)}
                          onCheckedChange={() => onModelToggle(model.value)}
                          disabled={model.count === 0}
                        />
                        <label
                          htmlFor={`model-${model.value}`}
                          className={`text-sm flex-1 cursor-pointer ${
                            model.count === 0 ? 'text-gray-400' : ''
                          }`}
                        >
                          {model.value} ({model.count})
                        </label>
                      </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Specs filters */}
          {specFacets.length > 0 && (
            <AccordionItem value="specs">
              <AccordionTrigger>{t('filters.specs')}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {specFacets.map(specType => (
                    <div key={specType.type}>
                      <h3 className="text-sm font-medium mb-2">{specType.type}</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {specType.labels
                          .sort((a, b) => b.count - a.count)
                          .map(label => (
                            <div key={label.value} className="flex items-center gap-2">
                              <Checkbox
                                id={`spec-${label.value}`}
                                checked={selectedSpecLabels.includes(label.value)}
                                onCheckedChange={() => onSpecLabelToggle(label.value)}
                                disabled={label.count === 0}
                              />
                              <label
                                htmlFor={`spec-${label.value}`}
                                className={`text-sm flex-1 cursor-pointer ${
                                  label.count === 0 ? 'text-gray-400' : ''
                                }`}
                              >
                                {label.value} ({label.count})
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        <Button onClick={onResetFilters} variant="outline" className="w-full">
          {t('filters.resetFilters')}
        </Button>
      </div>

      {/* Products grid */}
      <div className="md:col-span-3 space-y-6">
        <div className="flex justify-between items-center">
          <div>{t('results', { count: totalItems })}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{t('itemsPerPage')}</span>
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
