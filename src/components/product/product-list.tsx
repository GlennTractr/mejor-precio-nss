'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import { ProductCard } from './product-card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MAX_VISIBLE_PAGES = 5;
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

function getVisiblePages(currentPage: number, totalPages: number) {
  const startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePages = getVisiblePages(currentPage, totalPages);

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
            <SelectTrigger className="w-[100px] border-primary-light focus:ring-primary">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isProductsLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => <ProductSkeleton key={index} />)
          : products.map(product => <ProductCard key={product.id} product={product} />)}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={`hover:bg-primary-light/10 ${
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }`}
            />
          </PaginationItem>

          {visiblePages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="hover:bg-primary-light/10"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {visiblePages[0] > 2 && <PaginationEllipsis />}
            </>
          )}

          {visiblePages.map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className={
                  currentPage === page
                    ? 'bg-primary text-primary-foreground hover:bg-primary-dark'
                    : 'hover:bg-primary-light/10'
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className="hover:bg-primary-light/10"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={`hover:bg-primary-light/10 ${
                currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export const ProductList = memo(ProductListComponent);
