'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProductSellContextListProps {
  productPackaging: {
    quantity: number;
    type: string;
    ProductSellContext: {
      price: number;
      link: string;
      Shop: {
        label: string;
        img_url: string;
      };
    }[];
  }[];
}

interface SortedPackage {
  quantity: number;
  type: string;
  ProductSellContext: Array<{
    price: number;
    link: string;
    Shop: {
      label: string;
      img_url: string;
    };
  }>;
}

export function ProductSellContextList({ productPackaging }: ProductSellContextListProps) {
  const t = useTranslations();
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);

  if (!productPackaging || productPackaging.length === 0) {
    return null;
  }

  // Get unique quantities
  const quantities = Array.from(new Set(productPackaging.map(pkg => pkg.quantity))).sort(
    (a, b) => a - b
  );

  // Filter packages by selected quantity
  const filteredPackaging = selectedQuantity
    ? productPackaging.filter(pkg => pkg.quantity === selectedQuantity)
    : productPackaging;

  // If showing a specific quantity, sort within that quantity group
  if (selectedQuantity) {
    const sortedPackaging = [...filteredPackaging].sort((a, b) => {
      const aMinPricePerUnit = Math.min(...a.ProductSellContext.map(ctx => ctx.price / a.quantity));
      const bMinPricePerUnit = Math.min(...b.ProductSellContext.map(ctx => ctx.price / b.quantity));
      return aMinPricePerUnit - bMinPricePerUnit;
    });

    const sortedPackagingWithSortedContexts = sortedPackaging.map(pkg => ({
      ...pkg,
      ProductSellContext: [...pkg.ProductSellContext].sort(
        (a, b) => a.price / pkg.quantity - b.price / pkg.quantity
      ),
    }));

    return renderContent(sortedPackagingWithSortedContexts);
  }

  // If showing all quantities, flatten and sort all contexts by price per unit
  const allContexts = filteredPackaging
    .flatMap(pkg =>
      pkg.ProductSellContext.map(ctx => ({
        ...ctx,
        quantity: pkg.quantity,
        pricePerUnit: ctx.price / pkg.quantity,
      }))
    )
    .sort((a, b) => a.pricePerUnit - b.pricePerUnit);

  // Group the sorted contexts by quantity for rendering
  const sortedByPricePerUnit = allContexts.map(ctx => ({
    quantity: ctx.quantity,
    type: 'unit',
    ProductSellContext: [
      {
        price: ctx.price,
        link: ctx.link,
        Shop: ctx.Shop,
      },
    ],
  }));

  function renderContent(packagesToRender: SortedPackage[]) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-accent">{t('product.availableFrom')}</h2>

        {/* Quantity Tabs */}
        <div className="border-b border-primary-light/20">
          <div className="flex flex-wrap -mb-px">
            <button
              onClick={() => setSelectedQuantity(null)}
              className={cn(
                'inline-block px-4 py-2 text-sm font-medium rounded-t-lg',
                'hover:text-primary hover:border-primary-light/50',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                selectedQuantity === null
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground border-b-2 border-transparent'
              )}
            >
              {t('product.showAll')}
            </button>
            {quantities.map(qty => (
              <button
                key={qty}
                onClick={() => setSelectedQuantity(qty)}
                className={cn(
                  'inline-block px-4 py-2 text-sm font-medium rounded-t-lg',
                  'hover:text-primary hover:border-primary-light/50',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  selectedQuantity === qty
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground border-b-2 border-transparent'
                )}
              >
                {qty}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-3">
          {packagesToRender.map((pkg, index) =>
            pkg.ProductSellContext?.map((ctx, ctxIndex) => (
              <div
                key={`${index}-${ctxIndex}`}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-primary-light/20 hover:border-primary-light/50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Shop Logo */}
                  <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg p-1 border border-primary-light/10">
                    <Image
                      src={ctx.Shop.img_url}
                      alt={ctx.Shop.label}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                  {/* Shop Info */}
                  <div>
                    <div className="font-medium text-accent">{ctx.Shop.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {pkg.quantity} {t('product.units.unit', { count: pkg.quantity })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {/* Price Info */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-accent">${ctx.price.toFixed(2)}</div>
                    <div className="text-sm text-primary-dark">
                      {t('product.pricePerUnit', {
                        price: (ctx.price / pkg.quantity).toFixed(2),
                      })}
                    </div>
                  </div>
                  {/* Buy Button */}
                  <a
                    href={ctx.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  >
                    {t('actions.buy')}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return renderContent(sortedByPricePerUnit);
}
