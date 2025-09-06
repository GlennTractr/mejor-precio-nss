'use client';

import { useState } from 'react';
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
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { FacetValue, SpecFacet } from '@/types/product';
import { Card } from '@/components/ui/card';

export interface ProductFiltersProps {
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
  onSearchChange: (query: string) => void;
  onBrandToggle: (brand: string) => void;
  onModelToggle: (model: string) => void;
  onSpecLabelToggle: (label: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onResetFilters: () => void;
}

export function ProductFilters({
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
  onSearchChange,
  onBrandToggle,
  onModelToggle,
  onSpecLabelToggle,
  onPriceRangeChange,
  onResetFilters,
}: ProductFiltersProps) {
  const t = useTranslations('category');
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  // Check if any filters are applied
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedBrands.length > 0 ||
    selectedModels.length > 0 ||
    selectedSpecLabels.length > 0 ||
    priceRange[0] > minPossiblePrice ||
    priceRange[1] < maxPossiblePrice;

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

  return (
    <Card variant="interactive" className="space-y-6 p-4">
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

      {hasActiveFilters && (
        <Button onClick={onResetFilters} variant="outline" className="w-full">
          {t('filters.resetFilters')}
        </Button>
      )}
    </Card>
  );
}
