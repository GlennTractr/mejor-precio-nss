'use server';

import { Suspense } from 'react';
import { CategoryCarousel } from '@/components/category/category-carousel';
import { HomeProductList } from '@/components/product/home-product-list';
import { typesenseClient } from '@/lib/typesense-client';
import { getTranslations } from 'next-intl/server';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

interface SearchParams {
  page?: string;
  per_page?: string;
}

async function getProducts(page: number, perPage: number) {
  const searchParameters = {
    q: '*',
    query_by: 'title',
    page,
    per_page: perPage,
    sort_by: 'best_price_per_unit:asc',
  };

  return typesenseClient.collections('product').documents().search(searchParameters, {});
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
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
      <section className="relative overflow-hidden bg-primary p-12 rounded-xl shadow-md">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/80 via-primary to-primary-dark/90" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <span>🎯</span>
            <span>Comparador de precios para productos de bebé</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">{t('heroTitle')}</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-accent mb-6">{t('categories')}</h2>
        <Suspense fallback={<CategoryCarouselSkeleton />}>
          <CategoryCarousel />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-accent mb-6">{t('allProducts')}</h2>
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
