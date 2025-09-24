'use client';

import { ProductVariantCard, ProductVariantCardSkeleton } from './product-variant-card';

interface ProductVariant {
  id: string;
  title: string;
  specValue: string;
  specLabel: string;
  imageUrl: string;
  productSlug: string;
}

interface VariantGroupProps {
  specType: string;
  specTypeLabel: string;
  currentValue: string;
  currentProduct?: {
    id: string;
    title: string;
    imageUrl: string;
    productSlug: string;
  };
  variants: ProductVariant[];
  isLoading?: boolean;
}

export function VariantGroup({
  specTypeLabel,
  currentValue,
  currentProduct,
  variants,
  isLoading = false,
}: VariantGroupProps) {

  // Don't render if no variants and not loading
  if (!isLoading && variants.length === 0) {
    return null;
  }

  // Create combined list with current product first, then variants
  const allVariants = [];

  // Add current product as selected variant
  if (currentProduct) {
    allVariants.push({
      ...currentProduct,
      specValue: currentValue,
      specLabel: currentValue,
      allSpecs: [],
      isSelected: true,
    });
  }

  // Add other variants
  allVariants.push(...variants.map(variant => ({ ...variant, isSelected: false })));

  return (
    <div className="space-y-2">
      {/* Group Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-accent">{specTypeLabel}</h3>
      </div>

      {/* Responsive Variants Grid */}
      <div className="flex flex-wrap gap-2">
        {isLoading
          ? // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <ProductVariantCardSkeleton />
              </div>
            ))
          : // All variants (including current as selected)
            allVariants.map(variant => (
              <div key={variant.id} className="flex-shrink-0">
                <ProductVariantCard
                  title={variant.title}
                  specLabel={variant.specLabel}
                  imageUrl={variant.imageUrl}
                  productSlug={variant.productSlug}
                  isSelected={variant.isSelected}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

