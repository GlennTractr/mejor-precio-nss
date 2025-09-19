'use client';

import { useEffect } from 'react';
import { GlobalSearchContainer } from '@/components/search/global-search-container';
import type { GlobalSearchFilters } from '@/lib/api/global-search-queries';

interface SearchPageProps {
  query: string;
  initialPage: number;
  initialItemsPerPage: number;
  minPossiblePrice: number;
  maxPossiblePrice: number;
  initialFilters: GlobalSearchFilters;
  initialBrands?: string[];
  initialModels?: string[];
  initialMinPrice?: number;
  initialMaxPrice?: number;
}

export function SearchPage({
  query,
  initialPage,
  initialItemsPerPage,
  initialFilters,
  minPossiblePrice,
  maxPossiblePrice,
  initialBrands,
  initialModels,
  initialMinPrice,
  initialMaxPrice,
}: SearchPageProps) {
  const displayTitle = query ? `Resultados de búsqueda: "${query}"` : 'Buscar productos';

  const displayDescription = query
    ? 'Encuentra los mejores productos al mejor precio comparando entre todas las categorías'
    : 'Busca productos en todas las categorías y compara precios por unidad para encontrar las mejores ofertas';

  // Track search in Google Analytics
  useEffect(() => {
    if (query && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query
      });
    }
  }, [query]);

  return (
    <>
      <div className="bg-secondary-light">
        <div className="mx-auto w-full max-w-7xl py-6 md:py-[25px] px-4 md:px-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl highlight-sand mb-4">{displayTitle}</h1>
            <p className="text-secondary mb-6 max-w-2xl mx-auto text-sm font-bold">
              {displayDescription}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl pt-6 md:pt-[25px] pb-8 md:pb-[75px] px-4 md:px-6">
        <div className="space-y-6">
          <GlobalSearchContainer
            query={query}
            initialFilters={initialFilters}
            minPossiblePrice={minPossiblePrice}
            maxPossiblePrice={maxPossiblePrice}
            initialPage={initialPage}
            initialItemsPerPage={initialItemsPerPage}
            initialBrands={initialBrands}
            initialModels={initialModels}
            initialMinPrice={initialMinPrice}
            initialMaxPrice={initialMaxPrice}
          />
        </div>
      </div>
    </>
  );
}
