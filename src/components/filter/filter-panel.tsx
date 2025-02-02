'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Slider } from '@/components/ui/slider';
import { FilterGroup } from '@/components/filter/filter-group';
import type { FacetValue, SpecFacet } from '@/types/product';

interface FilterPanelProps {
  facets: {
    brand: FacetValue[];
    model: FacetValue[];
  };
  specFacets: SpecFacet[];
  selectedBrands: string[];
  selectedModels: string[];
  selectedSpecLabels: string[];
  priceRange: [number, number];
  minPossiblePrice: number;
  maxPossiblePrice: number;
  isFacetsLoading: boolean;
  isInitialLoad: boolean;
  onBrandSelectionChange: (newBrands: string[]) => void;
  onModelSelectionChange: (newModels: string[]) => void;
  onSpecLabelSelectionChange: (newLabels: string[]) => void;
  onPriceRangeChange: (newRange: [number, number]) => void;
}

function FilterPanelComponent({
  facets,
  specFacets,
  selectedBrands,
  selectedModels,
  selectedSpecLabels,
  priceRange,
  minPossiblePrice,
  maxPossiblePrice,
  isFacetsLoading,
  isInitialLoad,
  onBrandSelectionChange,
  onModelSelectionChange,
  onSpecLabelSelectionChange,
  onPriceRangeChange,
}: FilterPanelProps) {
  const t = useTranslations('filters');

  return (
    <div className="w-64 flex-shrink-0 space-y-6">
      {/* Brands Filter */}
      <FilterGroup
        title="brands"
        options={facets.brand}
        selectedValues={selectedBrands}
        onSelectionChange={onBrandSelectionChange}
        isLoading={isFacetsLoading}
        isInitialLoad={isInitialLoad}
      />

      {/* Models Filter */}
      <FilterGroup
        title="models"
        options={facets.model}
        selectedValues={selectedModels}
        onSelectionChange={onModelSelectionChange}
        isLoading={isFacetsLoading}
        isInitialLoad={isInitialLoad}
      />

      {/* Specs Filters */}
      {specFacets.map(specType => (
        <FilterGroup
          key={specType.type}
          title={specType.type}
          options={specType.labels}
          selectedValues={selectedSpecLabels.filter(label =>
            specType.labels.some(l => l.value === label)
          )}
          onSelectionChange={onSpecLabelSelectionChange}
          isLoading={isFacetsLoading}
          isInitialLoad={isInitialLoad}
        />
      ))}

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold">{t('priceRange.title')}</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            min={minPossiblePrice}
            max={maxPossiblePrice}
            step={0.01}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={(value: [number, number]) => {
              onPriceRangeChange(value);
            }}
            className="my-6"
            minStepsBetweenThumbs={0.01}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {t('priceRange.unit', { value: priceRange[0].toFixed(2) })}
            </span>
            <span className="text-sm">
              {t('priceRange.unit', { value: priceRange[1].toFixed(2) })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const FilterPanel = memo(FilterPanelComponent);
