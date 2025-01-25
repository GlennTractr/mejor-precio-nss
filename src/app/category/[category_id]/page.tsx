'use client';

import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const PER_PAGE_OPTIONS = [10, 20, 50];
const DEFAULT_PER_PAGE = 20;
const MAX_VISIBLE_PAGES = 5;

function getVisiblePages(currentPage: number, totalPages: number) {
  const startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

export default function CategoryPage({ params }: { params: { category_id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const categoryId = params.category_id;
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('per_page') || String(DEFAULT_PER_PAGE));
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  const updateUrlParams = (page: number, perPage: number) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('per_page', String(perPage));
    router.push(`/category/${categoryId}?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?category_id=${categoryId}&page=${currentPage}&per_page=${itemsPerPage}`
        );
        const data = await response.json();
        setProducts(data.hits?.map((hit: any) => hit.document as Product) || []);
        setTotalItems(data.found || 0);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId, currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Category: {categoryId}</h1>

      <div className="mb-6 flex items-center gap-2">
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
