'use client';

import { useEffect, useState } from 'react';
import { VariantGroup } from './variant-group';
import { apiFetch } from '@/lib/api/fetch-helper';

interface ProductVariant {
  id: string;
  title: string;
  specValue: string;
  specLabel: string;
  imageUrl: string;
  productSlug: string;
  allSpecs: Array<{ type: string; label: string }>;
}

interface VariantGroup {
  specType: string;
  specTypeLabel: string;
  currentValue: string;
  variants: ProductVariant[];
}

interface ProductVariantsResponse {
  variantGroups: VariantGroup[];
}

interface ProductVariantsProps {
  productId: string;
  categorySlug: string;
  brand: string;
  model: string;
  currentSpecs?: Array<{ type: string; label: string }>;
  currentProduct?: {
    title: string;
    imageUrl: string;
    productSlug: string;
  };
}

export function ProductVariants({
  productId,
  categorySlug,
  brand,
  model,
  currentSpecs = [],
  currentProduct,
}: ProductVariantsProps) {
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVariants() {
      // Only fetch if we have required data and specs
      if (!productId || !categorySlug || !brand || !model || currentSpecs.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          product_id: productId,
          category_slug: categorySlug,
          brand,
          model,
          current_specs: JSON.stringify(currentSpecs),
        });

        const response = await apiFetch(`/api/typesense/product-variants?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProductVariantsResponse = await response.json();

        if (data.variantGroups) {
          setVariantGroups(data.variantGroups);
        } else {
          setVariantGroups([]);
        }
      } catch (error) {
        console.error('Error fetching product variants:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch variants');
        setVariantGroups([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVariants();
  }, [productId, categorySlug, brand, model, currentSpecs]);

  // Don't render anything if loading without data, or if no variants and no error
  if (isLoading && variantGroups.length === 0) {
    return (
      <div className="space-y-4 py-4">
        <div className="space-y-3">
          {/* Skeleton for variant groups */}
          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {/* Group header skeleton */}
              <div className="h-4 bg-primary-light/20 rounded w-16"></div>
              {/* Variant cards skeleton */}
              <VariantGroup
                specType="loading"
                specTypeLabel="Loading"
                currentValue="loading"
                variants={[]}
                isLoading={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no variants available and not loading
  if (!isLoading && variantGroups.length === 0 && !error) {
    return null;
  }

  // Show error state
  if (error && variantGroups.length === 0) {
    return null; // Fail silently - variants are not critical functionality
  }

  return (
    <div className="space-y-3">
      {/* Variant Groups */}
      <div className="space-y-4">
        {variantGroups.map(group => (
          <VariantGroup
            key={group.specType}
            specType={group.specType}
            specTypeLabel={group.specTypeLabel}
            currentValue={group.currentValue}
            currentProduct={
              currentProduct
                ? {
                    id: productId,
                    title: currentProduct.title,
                    imageUrl: currentProduct.imageUrl,
                    productSlug: currentProduct.productSlug,
                  }
                : undefined
            }
            variants={group.variants}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
