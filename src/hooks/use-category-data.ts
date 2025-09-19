'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCategoryData,
  getInitialFilters,
  type CategoryData,
  type CategoryFilters,
} from '@/lib/api/category-queries';

interface UseCategoryDataProps {
  categorySlug: string;
  initialPage: number;
  initialItemsPerPage: number;
  initialFilters: CategoryFilters;
  minPossiblePrice: number;
  maxPossiblePrice: number;
}

function useCategoryData({
  categorySlug,
  initialPage,
  initialItemsPerPage,
  initialFilters,
  minPossiblePrice,
  maxPossiblePrice,
}: UseCategoryDataProps) {
  const router = useRouter();
  const pathname = usePathname() || ''; // Ensure pathname is never null
  const searchParams = useSearchParams();

  // Parse URL search params
  const page = parseInt(searchParams?.get('page') || String(initialPage));
  const perPage = parseInt(searchParams?.get('per_page') || String(initialItemsPerPage));
  const searchQuery = searchParams?.get('q') || '';
  const selectedBrands = searchParams?.get('brands')?.split(',').filter(Boolean) || [];
  const selectedModels = searchParams?.get('models')?.split(',').filter(Boolean) || [];
  const selectedSpecTypes = searchParams?.get('spec_types')?.split(',').filter(Boolean) || [];
  const selectedSpecLabels = searchParams?.get('spec_labels')?.split(',').filter(Boolean) || [];
  const minPrice = parseFloat(
    searchParams?.get('min_price') || String(initialFilters.price_range.min)
  );
  const maxPrice = parseFloat(
    searchParams?.get('max_price') || String(initialFilters.price_range.max)
  );

  // Local state for filters
  const [currentPage, setCurrentPage] = useState(page);
  const [query, setQuery] = useState(searchQuery);
  const [brands, setBrands] = useState<string[]>(selectedBrands);
  const [models, setModels] = useState<string[]>(selectedModels);
  const [specTypes, setSpecTypes] = useState<string[]>(selectedSpecTypes);
  const [specLabels, setSpecLabels] = useState<string[]>(selectedSpecLabels);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  // Query for initial filters (doesn't change with filter updates)
  const { data: filtersData } = useQuery({
    queryKey: ['categoryFilters', categorySlug],
    queryFn: () => getInitialFilters(categorySlug),
    initialData: initialFilters,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query for products with current filters
  const { data: categoryData, isLoading } = useQuery<CategoryData>({
    queryKey: [
      'categoryProducts',
      categorySlug,
      currentPage,
      perPage,
      query,
      brands,
      models,
      priceRange,
      specLabels,
    ],
    queryFn: () =>
      getCategoryData(categorySlug, {
        page: currentPage,
        perPage,
        query,
        brands,
        models,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        specTypes,
        specLabels,
      }),
    staleTime: 1000 * 60, // 1 minute
  });

  // Update URL with current filters without page reload
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    // Only add params that are different from defaults
    if (currentPage !== initialPage) {
      params.set('page', String(currentPage));
    }

    if (perPage !== initialItemsPerPage) {
      params.set('per_page', String(perPage));
    }

    if (query) {
      params.set('q', query);
    }

    if (brands.length > 0) {
      params.set('brands', brands.join(','));
    }

    if (models.length > 0) {
      params.set('models', models.join(','));
    }

    if (priceRange[0] !== minPossiblePrice) {
      params.set('min_price', String(priceRange[0]));
    }

    if (priceRange[1] !== maxPossiblePrice) {
      params.set('max_price', String(priceRange[1]));
    }

    if (specTypes.length > 0) {
      params.set('spec_types', specTypes.join(','));
    }

    if (specLabels.length > 0) {
      params.set('spec_labels', specLabels.join(','));
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url, { scroll: false });
  }, [
    currentPage,
    perPage,
    query,
    brands,
    models,
    priceRange,
    specTypes,
    specLabels,
    router,
    pathname,
    initialPage,
    initialItemsPerPage,
    minPossiblePrice,
    maxPossiblePrice,
  ]);

  // Update URL when filters change
  useEffect(() => {
    updateUrl();
  }, [currentPage, query, brands, models, priceRange, specTypes, specLabels, updateUrl]);

  // Filter actions
  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const setItemsPerPage = (perPage: number) => {
    setCurrentPage(1); // Reset to first page when changing items per page
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('per_page', String(perPage));
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const setSearchQuery = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1); // Reset to first page when changing search query
  };

  const toggleBrand = (brand: string) => {
    setBrands(prev => (prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]));
    setCurrentPage(1);
  };

  const toggleModel = (model: string) => {
    setModels(prev => (prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]));
    setCurrentPage(1);
  };

  const toggleSpecLabel = (label: string) => {
    setSpecLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
    setCurrentPage(1);
  };

  const toggleSpecType = (type: string) => {
    setSpecTypes(prev => (prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]));
    setCurrentPage(1);
  };

  const setPriceRangeValues = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setQuery('');
    setBrands([]);
    setModels([]);
    setSpecTypes([]);
    setSpecLabels([]);
    setPriceRange([minPossiblePrice, maxPossiblePrice]);
    setCurrentPage(1);
  };

  return {
    // Data
    products: categoryData?.products || [],
    totalItems: categoryData?.totalItems || 0,
    filters: categoryData?.filters || filtersData,

    // State
    isLoading,
    currentPage,
    itemsPerPage: perPage,
    searchQuery: query,
    selectedBrands: brands,
    selectedModels: models,
    selectedSpecTypes: specTypes,
    selectedSpecLabels: specLabels,
    currentPriceRange: priceRange,

    // Actions
    setPage,
    setItemsPerPage,
    setSearchQuery,
    toggleBrand,
    toggleModel,
    toggleSpecLabel,
    toggleSpecType,
    setPriceRange: setPriceRangeValues,
    resetFilters,
  };
}

export default useCategoryData;
