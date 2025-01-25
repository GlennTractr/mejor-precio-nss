'use client';

import { useEffect, useState } from 'react';
import { ProductList } from '@/components/product/product-list';

interface CategoryPageProps {
  categorySlug: string;
  initialPage: number;
  initialItemsPerPage: number;
}

export function CategoryPage({
  categorySlug,
  initialPage,
  initialItemsPerPage,
}: CategoryPageProps) {
  const [maxPossiblePrice, setMaxPossiblePrice] = useState<number | null>(null);
  const [minPossiblePrice, setMinPossiblePrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPriceRange() {
      try {
        // Fetch max price
        const maxResponse = await fetch(
          `/api/typesense/search?per_page=1&q=&filter_by=${encodeURIComponent(
            `category_slug:=${categorySlug}`
          )}&sort_by=best_price_per_unit:desc`
        );
        const maxData = await maxResponse.json();

        // Fetch min price
        const minResponse = await fetch(
          `/api/typesense/search?per_page=1&q=&filter_by=${encodeURIComponent(
            `category_slug:=${categorySlug}`
          )}&sort_by=best_price_per_unit:asc`
        );
        const minData = await minResponse.json();

        if (!maxResponse.ok || !minResponse.ok) {
          throw new Error('Failed to fetch price range');
        }

        if (maxData.hits?.[0]?.document && minData.hits?.[0]?.document) {
          const maxPrice = maxData.hits[0].document.best_price_per_unit;
          const minPrice = minData.hits[0].document.best_price_per_unit;
          const roundedMin = Math.floor(minPrice);
          const roundedMax = Math.ceil(maxPrice);
          setMaxPossiblePrice(roundedMax);
          setMinPossiblePrice(roundedMin);
        }
      } catch (error) {
        console.error('Failed to fetch price range:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPriceRange();
  }, [categorySlug]);

  if (isLoading || minPossiblePrice === null || maxPossiblePrice === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-48 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProductList
      categorySlug={categorySlug}
      initialPage={initialPage}
      initialItemsPerPage={initialItemsPerPage}
      minPossiblePrice={minPossiblePrice}
      maxPossiblePrice={maxPossiblePrice}
    />
  );
}
