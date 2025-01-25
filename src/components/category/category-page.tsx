'use client';

import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';

const PER_PAGE_OPTIONS = [10, 20, 50];
const MAX_VISIBLE_PAGES = 5;

interface CategoryPageProps {
  categoryId: string;
  initialPage: number;
  initialItemsPerPage: number;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

export function CategoryPage({ categoryId, initialPage, initialItemsPerPage }: CategoryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const currentPage = parseInt(searchParams?.get('page') || String(initialPage));
  const itemsPerPage = parseInt(searchParams?.get('per_page') || String(initialItemsPerPage));
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  const updateUrlParams = (page: number, perPage: number, query?: string) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('per_page', String(perPage));
    if (query) params.set('q', query);
    router.push(`/category/${categoryId}?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await fetch(
          `/api/typesense/search?category_id=${categoryId}&page=${currentPage}&per_page=${itemsPerPage}&q=${debouncedSearch}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const fetchedProducts = data.hits?.map((hit: any) => hit.document as Product) || [];
        setProducts(fetchedProducts);
        setTotalItems(data.found || 0);

        if (currentPage === 1 && data.found === 0) {
          notFound();
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId, currentPage, itemsPerPage, debouncedSearch]);

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">Category: {categoryId}</h1>
        {!isLoading && (
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? 'product' : 'products'} found
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search products..."
          className="max-w-sm"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            updateUrlParams(1, itemsPerPage, e.target.value);
          }}
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <Select
            defaultValue={String(itemsPerPage)}
            onValueChange={value => {
              updateUrlParams(1, parseInt(value));
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

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg p-4 shadow">
                <h2 className="font-semibold">{product.title}</h2>
                <p className="text-gray-600">{product.brand}</p>
                <p className="text-lg font-bold mt-2">
                  Best Price: €{product.best_price_per_unit.toFixed(2)}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  Available at: {product.shop_names.join(', ')}
                </div>
              </div>
            ))}
          </div>

          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => updateUrlParams(Math.max(1, currentPage - 1), itemsPerPage)}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {visiblePages[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href={`/category/${categoryId}?page=1&per_page=${itemsPerPage}`}
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
                    href={`/category/${categoryId}?page=${page}&per_page=${itemsPerPage}`}
                    isActive={currentPage === page}
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
                      href={`/category/${categoryId}?page=${totalPages}&per_page=${itemsPerPage}`}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    updateUrlParams(Math.min(totalPages, currentPage + 1), itemsPerPage)
                  }
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
