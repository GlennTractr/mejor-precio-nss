'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import { ProductCard } from './product-card';
import { SharedPagination } from '@/components/ui/shared-pagination';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PER_PAGE_OPTIONS = [10, 20, 50];

interface ProductListProps {
  products: Product[];
  isProductsLoading: boolean;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

function ProductSkeleton() {
  return (
    <Card className="animate-pulse h-[320px] flex flex-col">
      <div className="relative w-full h-36 bg-primary-light/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary-light/30" />
        </div>
      </div>
      <CardHeader className="flex-grow space-y-1 py-2 px-4">
        <div className="h-3 bg-primary-light/20 rounded w-3/4"></div>
        <div className="h-3 bg-primary-light/20 rounded w-1/2 mt-1"></div>
      </CardHeader>
      <CardContent className="py-1 px-4">
        <div className="h-4 bg-primary-light/20 rounded w-1/3"></div>
      </CardContent>
      <CardFooter className="pt-0 pb-2 px-4">
        <div className="h-3 bg-primary-light/20 rounded w-2/3"></div>
      </CardFooter>
    </Card>
  );
}

function ProductListComponent({
  products,
  isProductsLoading,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: ProductListProps) {
  const t = useTranslations('filters.products');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">{t('found', { count: totalItems })}</p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('perPage')}</span>
          <Select
            defaultValue={String(itemsPerPage)}
            onValueChange={value => {
              onItemsPerPageChange(parseInt(value));
            }}
          >
            <SelectTrigger className="w-[100px] border-secondary-200 focus:ring-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map(option => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isProductsLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => <ProductSkeleton key={index} />)
          : products.map(product => <ProductCard key={product.id} product={product} />)}
      </div>

      <SharedPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        maxPagesToShow={5}
      />
    </div>
  );
}

export const ProductList = memo(ProductListComponent);
