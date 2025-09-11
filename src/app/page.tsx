'use server';

import { Suspense } from 'react';
import { CategoryCarousel } from '@/components/category/category-carousel';
import { HomeProductList } from '@/components/product/home-product-list';
import { FavoritesList } from '@/components/product/favorites-list';
import { typesenseClient } from '@/lib/typesense-client';
import { getTranslations } from 'next-intl/server';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { Banner } from '@/components/ui/banner';

interface SearchParams {
  page?: string;
  per_page?: string;
}

async function getProducts(page: number, perPage: number) {
  const collectionName = process.env.TYPESENSE_COLLECTION_NAME || 'product';
  const searchParameters = {
    q: '*',
    query_by: 'title',
    page,
    per_page: perPage,
    sort_by: 'best_price_per_unit:asc',
  };

  return typesenseClient.collections(collectionName).documents().search(searchParameters, {});
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const searchParamsAwaited = await searchParams;
  const t = await getTranslations('home');
  const currentPage = parseInt(searchParamsAwaited.page || '1');
  const itemsPerPage = parseInt(searchParamsAwaited.per_page || '10');

  // Prefetch the data on the server
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['all-products', currentPage, itemsPerPage],
    queryFn: () => getProducts(currentPage, itemsPerPage),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="space-y-8">
      <Banner className="w-full" />

      <div className="pb-[75px] my-6 mx-auto w-full max-w-4xl">
        {/* Favorites Section - FavoritesList component handles hiding for non-authenticated users */}

        <FavoritesList />

        <section className="mt-6">
          <h2 className="text-2xl text-accent mb-6 highlight-secondary">{t('categories')}</h2>
          <Suspense fallback={<CategoryCarouselSkeleton />}>
            <CategoryCarousel />
          </Suspense>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl text-accent mb-6 highlight-primary">{t('allProducts')}</h2>
          <HydrationBoundary state={dehydratedState}>
            <HomeProductList currentPage={currentPage} itemsPerPage={itemsPerPage} />
          </HydrationBoundary>
        </section>
      </div>
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
