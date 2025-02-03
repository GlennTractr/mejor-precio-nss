'use client';

import { useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FilterPanel } from '@/components/filter/filter-panel';
import { ProductList } from '@/components/product/product-list';

interface FacetValue {
  value: string;
  count: number;
}

interface SpecFacet {
  type: string;
  count: number;
  labels: FacetValue[];
}

interface Facets {
  brand: FacetValue[];
  model: FacetValue[];
}

interface ProductListFilteredProps {
  products: Product[];
  totalItems: number;
  isProductsLoading: boolean;
  isFacetsLoading: boolean;
  isInitialLoad: boolean;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  selectedBrands: string[];
  selectedModels: string[];
  selectedSpecTypes: string[];
  selectedSpecLabels: string[];
  priceRange: [number, number];
  minPossiblePrice: number;
  maxPossiblePrice: number;
  initialFilters: {
    price_range: {
      min: number;
      max: number;
    };
    facets: {
      brand: FacetValue[];
      model: FacetValue[];
    };
    specs_facets: SpecFacet[];
  };
  facets: Facets;
  specFacets: SpecFacet[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (perPage: number) => void;
  onSearchQueryChange: (query: string) => void;
  onBrandSelectionChange: (brands: string[]) => void;
  onModelSelectionChange: (models: string[]) => void;
  onSpecLabelSelectionChange: (labels: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearAllFilters: () => void;
}

export function ProductListFiltered({
  products,
  totalItems,
  isProductsLoading,
  isFacetsLoading,
  isInitialLoad,
  currentPage,
  itemsPerPage,
  searchQuery,
  selectedBrands,
  selectedModels,
  selectedSpecTypes,
  selectedSpecLabels,
  priceRange,
  minPossiblePrice,
  maxPossiblePrice,
  facets,
  specFacets,
  onPageChange,
  onItemsPerPageChange,
  onSearchQueryChange,
  onBrandSelectionChange,
  onModelSelectionChange,
  onSpecLabelSelectionChange,
  onPriceRangeChange,
  onClearAllFilters,
}: ProductListFilteredProps) {
  const t = useTranslations('filters');

  // Handlers that reset pagination
  const handleSearchQueryChange = (query: string) => {
    onSearchQueryChange(query);
    onPageChange(1);
  };

  const handleBrandSelectionChange = (brands: string[]) => {
    onBrandSelectionChange(brands);
    onPageChange(1);
  };

  const handleModelSelectionChange = (models: string[]) => {
    onModelSelectionChange(models);
    onPageChange(1);
  };

  const handleSpecLabelSelectionChange = (labels: string[]) => {
    onSpecLabelSelectionChange(labels);
    onPageChange(1);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    onPriceRangeChange(range);
    onPageChange(1);
  };

  const handleClearAllFilters = () => {
    onClearAllFilters();
    onPageChange(1);
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedModels.length > 0 ||
    selectedSpecTypes.length > 0 ||
    selectedSpecLabels.length > 0 ||
    searchQuery ||
    priceRange[0] > minPossiblePrice ||
    priceRange[1] < maxPossiblePrice;

  return (
    <div className="px-4 py-8">
      <div className="flex gap-8">
        {/* Filter Panel */}
        <FilterPanel
          facets={facets}
          specFacets={specFacets}
          selectedBrands={selectedBrands}
          selectedModels={selectedModels}
          selectedSpecLabels={selectedSpecLabels}
          priceRange={priceRange}
          minPossiblePrice={minPossiblePrice}
          maxPossiblePrice={maxPossiblePrice}
          isFacetsLoading={isFacetsLoading}
          isInitialLoad={isInitialLoad}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          onBrandSelectionChange={handleBrandSelectionChange}
          onModelSelectionChange={handleModelSelectionChange}
          onSpecLabelSelectionChange={handleSpecLabelSelectionChange}
          onPriceRangeChange={handlePriceRangeChange}
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col gap-4 mb-6">
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge key="search" variant="secondary" className="flex items-center gap-1">
                  {t('search.label', { query: searchQuery })}
                  <button
                    onClick={() => handleSearchQueryChange('')}
                    className="ml-1 rounded-full hover:bg-secondary/80"
                  >
                    <Cross2Icon className="h-3 w-3" />
                    <span className="sr-only">{t('search.clearAria')}</span>
                  </button>
                </Badge>
              )}
              {selectedBrands.map(brand => (
                <Badge
                  key={`brand-${brand}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {t('badges.brand', { name: brand })}
                  <button
                    onClick={() => {
                      const newBrands = selectedBrands.filter(b => b !== brand);
                      handleBrandSelectionChange(newBrands);
                    }}
                    className="ml-1 rounded-full hover:bg-secondary/80"
                  >
                    <Cross2Icon className="h-3 w-3" />
                    <span className="sr-only">{t('badges.removeAria', { type: brand })}</span>
                  </button>
                </Badge>
              ))}
              {selectedModels.map(model => (
                <Badge
                  key={`model-${model}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {t('badges.model', { name: model })}
                  <button
                    onClick={() => {
                      const newModels = selectedModels.filter(m => m !== model);
                      handleModelSelectionChange(newModels);
                    }}
                    className="ml-1 rounded-full hover:bg-secondary/80"
                  >
                    <Cross2Icon className="h-3 w-3" />
                    <span className="sr-only">{t('badges.removeAria', { type: model })}</span>
                  </button>
                </Badge>
              ))}
              {selectedSpecLabels.map(specLabel => {
                const specType = specFacets.find(spec =>
                  spec.labels.some(l => l.value === specLabel)
                )?.type;
                return (
                  <Badge
                    key={`spec-label-${specLabel}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {t('badges.spec', { type: specType, value: specLabel })}
                    <button
                      onClick={() => {
                        const newSpecLabels = selectedSpecLabels.filter(l => l !== specLabel);
                        handleSpecLabelSelectionChange(newSpecLabels);
                      }}
                      className="ml-1 rounded-full hover:bg-secondary/80"
                    >
                      <Cross2Icon className="h-3 w-3" />
                      <span className="sr-only">{t('badges.removeAria', { type: specType })}</span>
                    </button>
                  </Badge>
                );
              })}
              {(priceRange[0] > minPossiblePrice || priceRange[1] < maxPossiblePrice) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {t('priceRange.filter', {
                    min: priceRange[0].toFixed(2),
                    max: priceRange[1].toFixed(2),
                  })}
                  <button
                    onClick={() => handlePriceRangeChange([minPossiblePrice, maxPossiblePrice])}
                    className="ml-1 rounded-full hover:bg-secondary/80"
                  >
                    <Cross2Icon className="h-3 w-3" />
                    <span className="sr-only">{t('badges.removeAria', { type: 'price' })}</span>
                  </button>
                </Badge>
              )}
              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('badges.clearAll')}
                </button>
              )}
            </div>
          </div>

          <ProductList
            products={products}
            isProductsLoading={isProductsLoading}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
}
