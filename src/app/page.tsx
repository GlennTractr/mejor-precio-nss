'use server';

import { Suspense } from 'react';
import { CategoryCarousel } from '@/components/category/category-carousel';
import { HomeProductList } from '@/components/product/home-product-list';
import { FavoritesList } from '@/components/product/favorites-list';
import { getTranslations } from 'next-intl/server';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { HeroBanner } from '@/components/ui/hero-banner';

interface SearchParams {
  page?: string;
  per_page?: string;
}

async function getProducts(page: number, perPage: number) {
  const { apiFetch } = await import('@/lib/api/fetch-helper');
  const response = await apiFetch(`/api/typesense/home/products?page=${page}&per_page=${perPage}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const searchParamsAwaited = await searchParams;
  const t = await getTranslations('home');
  const currentPage = parseInt(searchParamsAwaited.page || '1');
  const itemsPerPage = parseInt(searchParamsAwaited.per_page || '20');

  // Prefetch the data on the server
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['all-products', currentPage, itemsPerPage],
    queryFn: () => getProducts(currentPage, itemsPerPage),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="space-y-0">
      <HeroBanner className="w-full" />

      <section className="mx-auto w-full max-w-4xl px-4 md:px-6">
        {/* Favorites Section - FavoritesList component handles hiding for non-authenticated users */}
        <FavoritesList />
      </section>

      <section id="categories-section" className="bg-secondary-light z-1 my-0">
        <div className="py-8 md:py-[75px] mx-auto w-full max-w-4xl px-4 md:px-6 text-center">
          <h2 className="text-2xl text-accent mb-6 highlight-sand">{t('categories')}</h2>
          <Suspense fallback={<CategoryCarouselSkeleton />}>
            <CategoryCarousel />
          </Suspense>
        </div>
      </section>

      <section className="mt-6 mx-auto w-full max-w-4xl py-8 md:py-[75px] px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-2xl text-accent mb-6 highlight-primary">{t('allProducts')}</h2>
          <p className="text-secondary mb-6 max-w-md mx-auto text-md">
            {t('allProductsDescription')}
          </p>
        </div>
        <HydrationBoundary state={dehydratedState}>
          <HomeProductList currentPage={currentPage} itemsPerPage={itemsPerPage} />
        </HydrationBoundary>
      </section>
    </div>
  );
}

function CategoryCarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-[180px] h-[180px] bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
