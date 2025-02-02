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

export function ProductSellContextList({ productPackaging }: ProductSellContextListProps) {
  const t = useTranslations();
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  console.log('y11111', productPackaging);
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
              <div className="flex items-center gap-4">
                {/* Shop Logo */}
                <div className="relative w-12 h-12 flex-shrink-0">
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
                  <div className="font-medium">{ctx.Shop.label}</div>
                  <div className="text-sm text-gray-600">
                    {pkg.quantity} {pkg.type}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Price Info */}
                <div className="text-right">
                  <div className="font-bold">${ctx.price.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">
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
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
