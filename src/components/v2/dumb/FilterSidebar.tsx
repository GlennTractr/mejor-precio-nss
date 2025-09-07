'use client';

import { memo, useState } from 'react';
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
}: FilterSidebarProps) {
  const t = useTranslations('category');
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  // Debounced search handler
  const debouncedSearchChange = debounce((value: string) => {
    onSearchChange(value);
  }, 300);

  // Handle search input changes
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSearchChange(value);
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
            className="pr-10 border-secondary/50 hover:border-secondary/80 focus:border-secondary transition-all duration-300 focus:ring-secondary/50"
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
      <Accordion type="multiple" defaultValue={['brands', 'models', 'specs']}>
        {/* Brand Filters */}
        {brandFilters.items.length > 0 && (
          <FilterAccordionSection
            title={t('filters.brands')}
            items={brandFilters.items}
            selectedItems={brandFilters.selectedItems}
            onToggle={handleBrandToggle}
            sortBy="count"
          />
        )}

        {/* Model Filters */}
        {modelFilters.items.length > 0 && (
          <FilterAccordionSection
            title={t('filters.models')}
            items={modelFilters.items}
            selectedItems={modelFilters.selectedItems}
            onToggle={handleModelToggle}
            sortBy="count"
            variant="secondary"
          />
        )}

        {/* Spec Filters with Alternating Variants */}
        <AlternatingFilterSections
          specFilters={specFilters}
          onToggle={handleSpecToggle}
          maxHeight={160}
          startVariant="primary"
        />
      </Accordion>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <Button onClick={onResetFilters} variant="outline" className="w-full">
          {t('filters.resetFilters')}
        </Button>
      )}
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const FilterSidebar = memo(FilterSidebarComponent);
FilterSidebar.displayName = 'FilterSidebar';
