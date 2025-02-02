'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
      </CardHeader>
      <CardContent>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </CardContent>
      <CardFooter>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        <p className="text-gray-600">{t('found', { count: totalItems })}</p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{t('perPage')}</span>
          <Select
            defaultValue={String(itemsPerPage)}
            onValueChange={value => {
              onItemsPerPageChange(parseInt(value));
            }}
          >
            <SelectTrigger className="w-[100px]">
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
          : products.map(product => (
              <Link
                key={product.id}
                href={`/product/${product.product_slug}`}
                className="block transition-transform hover:scale-105"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>{product.brand}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold">
                      {t('bestPrice', { price: product.best_price_per_unit.toFixed(2) })}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      {t('availableAt', { shops: product.shop_names.join(', ') })}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {visiblePages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {visiblePages[0] > 2 && <PaginationEllipsis />}
            </>
          )}

          {visiblePages.map(page => (
            <PaginationItem key={page}>
              <PaginationLink onClick={() => onPageChange(page)} isActive={currentPage === page}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export const ProductList = memo(ProductListComponent);
