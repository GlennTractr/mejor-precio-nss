'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, notFound } from 'next/navigation';
import { ProductListFiltered } from '@/components/product/product-list-filtered';
import type { FacetValue, SpecFacet, Product } from '@/types/product';
import useDebounce from '@/hooks/use-debounce';

interface SearchResponse {
  hits: Array<{ document: Product }>;
  found: number;
  facet_counts?: {
    brand: FacetValue[];
    model: FacetValue[];
  };
  specs_facets?: SpecFacet[];
  price_range?: {
    min: number;
    max: number;
  };
}

interface CategoryProductListProps {
  categorySlug: string;
  initialPage: number;
  initialItemsPerPage: number;
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
}

export function CategoryProductList({
  categorySlug,
  initialPage,
  initialItemsPerPage,
  minPossiblePrice,
  maxPossiblePrice,
  initialFilters,
}: CategoryProductListProps) {
  const searchParams = useSearchParams();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isFacetsLoading, setIsFacetsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPageState, setCurrentPageState] = useState(
    parseInt(searchParams?.get('page') || String(initialPage))
  );
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams?.get('brands')?.split(',').filter(Boolean) || []
  );
  const [selectedModels, setSelectedModels] = useState<string[]>(
    searchParams?.get('models')?.split(',').filter(Boolean) || []
  );
  const [selectedSpecTypes, setSelectedSpecTypes] = useState<string[]>(
    searchParams?.get('spec_types')?.split(',').filter(Boolean) || []
  );
  const [selectedSpecLabels, setSelectedSpecLabels] = useState<string[]>(
    searchParams?.get('spec_labels')?.split(',').filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseFloat(searchParams?.get('min_price') || String(initialFilters.price_range.min)),
    parseFloat(searchParams?.get('max_price') || String(initialFilters.price_range.max)),
  ]);
  const [facets, setFacets] = useState<{
    brand: FacetValue[];
    model: FacetValue[];
  }>(initialFilters.facets);
  const [specFacets, setSpecFacets] = useState<SpecFacet[]>(initialFilters.specs_facets);

  const itemsPerPage = parseInt(searchParams?.get('per_page') || String(initialItemsPerPage));
  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedPriceRange = useDebounce(priceRange, 300);

  // URL management
  const updateUrlParams = (
    page: number,
    perPage: number,
    query?: string,
    brands?: string[],
    models?: string[],
    minPrice?: number,
    maxPrice?: number,
    specTypes?: string[],
    specLabels?: string[]
  ) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', String(page));
    params.set('per_page', String(perPage));
    if (query !== undefined) params.set('q', query);
    if (brands !== undefined) {
      if (brands.length > 0) {
        params.set('brands', brands.join(','));
      } else {
        params.delete('brands');
      }
    }
    if (models !== undefined) {
      if (models.length > 0) {
        params.set('models', models.join(','));
      } else {
        params.delete('models');
      }
    }
    if (specTypes !== undefined) {
      if (specTypes.length > 0) {
        params.set('spec_types', specTypes.join(','));
      } else {
        params.delete('spec_types');
      }
    }
    if (specLabels !== undefined) {
      if (specLabels.length > 0) {
        params.set('spec_labels', specLabels.join(','));
      } else {
        params.delete('spec_labels');
      }
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      if (minPrice > minPossiblePrice || maxPrice < maxPossiblePrice) {
        params.set('min_price', String(minPrice));
        params.set('max_price', String(maxPrice));
      } else {
        params.delete('min_price');
        params.delete('max_price');
      }
    }

    // Replace the URL without navigation
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  };

  // Helper functions for facet updates
  function updateFacetCounts(prevFacets: FacetValue[], newCounts: FacetValue[]): FacetValue[] {
    // Create a map of new counts for quick lookup
    const newCountsMap = new Map(newCounts.map(facet => [facet.value, facet.count]));

    // Update only the count property, preserve everything else
    return prevFacets.map(facet => {
      const newCount = newCountsMap.get(facet.value);
      if (newCount === undefined) {
        return { ...facet, count: 0 };
      }
      // Only update the count, keep the original object if count hasn't changed
      return facet.count === newCount ? facet : { ...facet, count: newCount };
    });
  }

  function updateSpecFacetCounts(prevSpecs: SpecFacet[], newSpecs: SpecFacet[]): SpecFacet[] {
    // Create maps for quick lookup of new counts
    const newSpecsMap = new Map(
      newSpecs.map(spec => [
        spec.type,
        {
          count: spec.count,
          labels: new Map(spec.labels.map(label => [label.value, label.count])),
        },
      ])
    );

    // Update only count properties, preserve everything else
    return prevSpecs.map(spec => {
      const newSpec = newSpecsMap.get(spec.type);
      if (!newSpec) {
        return spec.count === 0
          ? spec
          : {
              ...spec,
              count: 0,
              labels: spec.labels.map(label =>
                label.count === 0 ? label : { ...label, count: 0 }
              ),
            };
      }

      // Only create new objects if counts have changed
      const updatedLabels = spec.labels.map(label => {
        const newCount = newSpec.labels.get(label.value) ?? 0;
        return label.count === newCount ? label : { ...label, count: newCount };
      });

      // Only create new spec object if count or any label counts changed
      const labelsChanged = updatedLabels.some((label, i) => label !== spec.labels[i]);
      if (spec.count === newSpec.count && !labelsChanged) {
        return spec;
      }

      return {
        ...spec,
        count: newSpec.count,
        labels: labelsChanged ? updatedLabels : spec.labels,
      };
    });
  }

  // Build filter string for Typesense
  const buildFilterString = () => {
    let filterBy = `category_slug:=${categorySlug}`;
    if (selectedBrands.length > 0) {
      filterBy += ` && brand:=[${selectedBrands.map(b => `'${b}'`).join(',')}]`;
    }
    if (selectedModels.length > 0) {
      filterBy += ` && model:=[${selectedModels.map(m => `'${m}'`).join(',')}]`;
    }
    if (selectedSpecLabels.length > 0) {
      // Group spec labels by their type
      const specLabelsByType = selectedSpecLabels.reduce((acc, label) => {
        const specType = specFacets.find(spec => spec.labels.some(l => l.value === label))?.type;
        if (specType) {
          if (!acc[specType]) {
            acc[specType] = [];
          }
          acc[specType].push(label);
        }
        return acc;
      }, {} as Record<string, string[]>);

      // Create filter conditions for each spec type
      const specFilters = Object.entries(specLabelsByType)
        .map(
          ([type, labels]) =>
            `(specs.type:=${type} && specs.label:=[${labels.map(l => `'${l}'`).join(',')}])`
        )
        .join(' || ');

      if (specFilters) {
        filterBy += ` && (${specFilters})`;
      }
    }
    if (debouncedPriceRange[0] > minPossiblePrice || debouncedPriceRange[1] < maxPossiblePrice) {
      filterBy += ` && best_price_per_unit:>=${debouncedPriceRange[0]} && best_price_per_unit:<=${debouncedPriceRange[1]}`;
    }
    return filterBy;
  };

  // Fetch both products and facets when filters change
  useEffect(() => {
    async function fetchData() {
      setIsProductsLoading(true);
      setIsFacetsLoading(true);
      try {
        const filterBy = buildFilterString();

        // Then fetch data
        const productsResponse = await fetch(
          `/api/typesense/search?page=${currentPageState}&per_page=${itemsPerPage}&q=${debouncedSearch}&filter_by=${encodeURIComponent(
            filterBy
          )}`
        );
        const productsData: SearchResponse = await productsResponse.json();

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const fetchedProducts = productsData.hits.map(hit => hit.document);
        setProducts(fetchedProducts);
        setTotalItems(productsData.found || 0);

        // Update facets from the same response
        if (productsData.facet_counts) {
          setFacets(prevFacets => ({
            brand: updateFacetCounts(prevFacets.brand, productsData.facet_counts?.brand || []),
            model: updateFacetCounts(prevFacets.model, productsData.facet_counts?.model || []),
          }));
        }

        if (productsData.specs_facets) {
          setSpecFacets(prevSpecFacets =>
            updateSpecFacetCounts(prevSpecFacets, productsData.specs_facets || [])
          );
        }

        if (currentPageState === 1 && productsData.found === 0) {
          notFound();
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_NOT_FOUND') {
          throw error;
        }
        console.error('Failed to fetch data:', error);
      } finally {
        setIsProductsLoading(false);
        setIsFacetsLoading(false);
        setIsInitialLoad(false);
      }
    }

    fetchData();
  }, [
    categorySlug,
    currentPageState,
    itemsPerPage,
    debouncedSearch,
    selectedBrands,
    selectedModels,
    selectedSpecLabels,
    debouncedPriceRange,
    minPossiblePrice,
    maxPossiblePrice,
  ]);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">Category: {categorySlug}</h1>
      </div>

      <ProductListFiltered
        products={products}
        totalItems={totalItems}
        isProductsLoading={isProductsLoading}
        isFacetsLoading={isFacetsLoading}
        isInitialLoad={isInitialLoad}
        currentPage={currentPageState}
        itemsPerPage={itemsPerPage}
        searchQuery={searchQuery}
        selectedBrands={selectedBrands}
        selectedModels={selectedModels}
        selectedSpecTypes={selectedSpecTypes}
        selectedSpecLabels={selectedSpecLabels}
        priceRange={priceRange}
        minPossiblePrice={minPossiblePrice}
        maxPossiblePrice={maxPossiblePrice}
        initialFilters={initialFilters}
        facets={facets}
        specFacets={specFacets}
        onPageChange={page => {
          setCurrentPageState(page);
          updateUrlParams(
            page,
            itemsPerPage,
            searchQuery,
            selectedBrands,
            selectedModels,
            priceRange[0],
            priceRange[1],
            selectedSpecTypes,
            selectedSpecLabels
          );
        }}
        onItemsPerPageChange={perPage => {
          setCurrentPageState(1);
          updateUrlParams(
            1,
            perPage,
            searchQuery,
            selectedBrands,
            selectedModels,
            priceRange[0],
            priceRange[1],
            selectedSpecTypes,
            selectedSpecLabels
          );
        }}
        onSearchQueryChange={query => {
          setSearchQuery(query);
          setCurrentPageState(1);
          updateUrlParams(
            1,
            itemsPerPage,
            query,
            selectedBrands,
            selectedModels,
            priceRange[0],
            priceRange[1],
            selectedSpecTypes,
            selectedSpecLabels
          );
        }}
        onBrandSelectionChange={brands => {
          setSelectedBrands(brands);
          setCurrentPageState(1);
          updateUrlParams(
            1,
            itemsPerPage,
            searchQuery,
            brands,
            selectedModels,
            priceRange[0],
            priceRange[1],
            selectedSpecTypes,
            selectedSpecLabels
          );
        }}
        onModelSelectionChange={models => {
          setSelectedModels(models);
          setCurrentPageState(1);
          updateUrlParams(
            1,
            itemsPerPage,
            searchQuery,
            selectedBrands,
            models,
            priceRange[0],
            priceRange[1],
            selectedSpecTypes,
            selectedSpecLabels
          );
        }}
        onSpecLabelSelectionChange={labels => {
          setSelectedSpecLabels(labels);
          setCurrentPageState(1);
          updateUrlParams(
            1,
            itemsPerPage,
            searchQuery,
            selectedBrands,
            selectedModels,
            priceRange[0],
            priceRange[1],
            selectedSpecTypes,
            labels
          );
        }}
        onPriceRangeChange={range => {
          setPriceRange(range);
          setCurrentPageState(1);
          updateUrlParams(
            1,
            itemsPerPage,
            searchQuery,
            selectedBrands,
            selectedModels,
            range[0],
            range[1],
            selectedSpecTypes,
            selectedSpecLabels
          );
        }}
        onClearAllFilters={() => {
          setSelectedBrands([]);
          setSelectedModels([]);
          setSelectedSpecTypes([]);
          setSelectedSpecLabels([]);
          setSearchQuery('');
          setPriceRange([minPossiblePrice, maxPossiblePrice]);
          setCurrentPageState(1);
          updateUrlParams(1, itemsPerPage, '', [], [], minPossiblePrice, maxPossiblePrice, [], []);
        }}
      />
    </div>
  );
}
