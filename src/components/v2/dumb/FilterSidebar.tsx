'use client';

import { memo, useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { FilterSidebarProps } from '../types';
import { FilterAccordionSection } from './FilterAccordionSection';
import { AlternatingFilterSections } from './AlternatingFilterSections';
import { formatPrice, debounce } from '../utils';

function FilterSidebarComponent({
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  minPossiblePrice,
  maxPossiblePrice,
  brandFilters,
  modelFilters,
  specFilters,
  onFilterToggle,
  onResetFilters,
  hasActiveFilters,
  className,
  hideSpecFilters = false,
  context = 'category',
}: FilterSidebarProps) {
  const t = useTranslations('category');
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  // Synchronize local search input with external searchQuery changes
  // Only when search is deleted (empty), not on every change
  useEffect(() => {
    if (searchQuery === '' && searchInputValue !== '') {
      setSearchInputValue(searchQuery);
    }
  }, [searchQuery, searchInputValue]);

  // Synchronize local price range with external priceRange changes
  // This ensures the price slider resets when price filter is removed from ActiveFiltersBar
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  // Debounced search handler - only for sending to filter system
  const debouncedSearchChange = useMemo(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    return (value: string) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        console.log('debouncedSearchChange', value);
        onSearchChange(value);
      }, 500);
    };
  }, [onSearchChange]);

  // Handle search input changes - immediate UI update, debounced filter update
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value); // Immediate UI update
    debouncedSearchChange(value); // Debounced filter update
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInputValue);
  };

  // Handle price range changes
  const handlePriceRangeChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  const handlePriceRangeCommit = () => {
    onPriceRangeChange(localPriceRange);
  };

  // Handle filter toggles
  const handleBrandToggle = (brand: string) => {
    onFilterToggle('brand', brand);
  };

  const handleModelToggle = (model: string) => {
    onFilterToggle('model', model);
  };

  const handleSpecToggle = (spec: string) => {
    onFilterToggle('spec', spec);
  };

  return (
    <Card variant="interactive" className={cn('space-y-6 p-4 bg-transparent', className)}>
      {/* Search Section */}
      <div>
        <h2 className="mb-4 font-medium highlight-secondary text-sm">{t('filters.search')}</h2>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            type="text"
            value={searchInputValue}
            onChange={handleSearchInput}
            placeholder={t('filters.searchPlaceholder')}
            className="pr-10 shadow-none border-secondary/50 hover:border-secondary/80 focus:border-secondary transition-all duration-300 focus:ring-secondary/50 focus-visible:ring-secondary/10"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost-secondary"
            className="absolute right-0 top-0 h-full px-3"
            aria-label={t('filters.searchButton')}
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Price Range Section */}
      <div>
        <h2 className="mb-4 font-medium highlight-primary text-sm">{t('filters.price')}</h2>
        <div className="space-y-4">
          <Slider
            min={minPossiblePrice}
            max={maxPossiblePrice}
            step={1}
            value={[localPriceRange[0], localPriceRange[1]]}
            onValueChange={handlePriceRangeChange}
            onValueCommit={handlePriceRangeCommit}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>{formatPrice(localPriceRange[0])}</span>
            <span>{formatPrice(localPriceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Filter Accordion Sections */}
      <Accordion type="multiple" defaultValue={['brands', 'models']}>
        {/* Brand Filters */}
        {brandFilters.items.length > 0 && (
          <FilterAccordionSection
            title={t('filters.brands')}
            internalId="brands"
            items={brandFilters.items}
            selectedItems={brandFilters.selectedItems}
            onToggle={handleBrandToggle}
            sortBy="count"
            variant="secondary"
          />
        )}

        {/* Model Filters */}
        {modelFilters.items.length > 0 && (
          <FilterAccordionSection
            title={t('filters.models')}
            internalId="models"
            items={modelFilters.items}
            selectedItems={modelFilters.selectedItems}
            onToggle={handleModelToggle}
            sortBy="count"
            variant="primary"
          />
        )}

        {/* Spec Filters with Alternating Variants - Hidden for global search */}
        {!hideSpecFilters && specFilters.length > 0 && (
          <AlternatingFilterSections
            specFilters={specFilters}
            onToggle={handleSpecToggle}
            maxHeight={160}
            startVariant="secondary"
          />
        )}
      </Accordion>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <Button onClick={onResetFilters} variant="outline-secondary" className="w-full">
          {t('filters.resetFilters')}
        </Button>
      )}
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const FilterSidebar = memo(FilterSidebarComponent);
FilterSidebar.displayName = 'FilterSidebar';
