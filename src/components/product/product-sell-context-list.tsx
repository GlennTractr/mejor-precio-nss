'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductSellContextListProps {
  productPackaging: {
    quantity: number;
    type: string;
    ProductSellContext: {
      price: number;
      Shop: {
        label: string;
      };
    }[];
  }[];
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

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">{t('product.availableFrom')}</h2>

      {/* Quantity Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setSelectedQuantity(null)}
            className={cn(
              'inline-block p-4 rounded-t-lg text-sm font-medium',
              'hover:text-gray-600 hover:border-gray-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              selectedQuantity === null
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 border-b-2 border-transparent'
            )}
          >
            {t('product.showAll')}
          </button>
          {quantities.map(qty => (
            <button
              key={qty}
              onClick={() => setSelectedQuantity(qty)}
              className={cn(
                'inline-block p-4 rounded-t-lg text-sm font-medium',
                'hover:text-gray-600 hover:border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                selectedQuantity === qty
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 border-b-2 border-transparent'
              )}
            >
              {qty}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredPackaging.map((pkg, index) =>
          pkg.ProductSellContext?.map((ctx, ctxIndex) => (
            <div
              key={`${index}-${ctxIndex}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium">{ctx.Shop?.label}</div>
                <div className="text-sm text-gray-600">
                  {pkg.quantity} {pkg.type}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">${ctx.price.toFixed(2)}</div>
                <div className="text-sm text-gray-600">
                  {t('product.pricePerUnit', {
                    price: (ctx.price / pkg.quantity).toFixed(2),
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
