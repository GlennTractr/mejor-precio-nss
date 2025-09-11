'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductList } from './product-list';
import { useRouter, usePathname } from 'next/navigation';
import type { Product, SearchResponse } from '@/types/product';

interface HomeProductListProps {
  currentPage: number;
  itemsPerPage: number;
}

async function getProducts(page: number, perPage: number): Promise<SearchResponse> {
  const response = await fetch(`/api/typesense/all-products?page=${page}&per_page=${perPage}`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export function HomeProductList({ currentPage, itemsPerPage }: HomeProductListProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['all-products', currentPage, itemsPerPage],
    queryFn: () => getProducts(currentPage, itemsPerPage),
  });

  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    searchParams.set('per_page', itemsPerPage.toString());
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set('page', '1');
    searchParams.set('per_page', perPage.toString());
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <ProductList
      products={productsData?.hits?.map(hit => hit.document as Product) || []}
      isProductsLoading={isLoading}
      totalItems={productsData?.found || 0}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
    />
  );
}
