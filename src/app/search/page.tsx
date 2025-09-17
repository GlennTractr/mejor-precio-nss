// Server Component for Global Search
import type { Metadata } from 'next';
import { getGlobalInitialFilters } from '@/lib/api/global-search-queries';
import { env } from '@/lib/env';
import { SearchPage } from '@/components/search/search-page';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    per_page?: string;
    brands?: string;
    models?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  // Await the search params
  const searchParamsAwaited = (await searchParams) || {};
  const query = searchParamsAwaited.q || '';
  const currentPage = parseInt(searchParamsAwaited.page || '1');
  const itemsPerPage = parseInt(searchParamsAwaited.per_page || '20');
  
  // Parse filter parameters
  const brands = searchParamsAwaited.brands ? searchParamsAwaited.brands.split(',') : undefined;
  const models = searchParamsAwaited.models ? searchParamsAwaited.models.split(',') : undefined;
  const minPrice = searchParamsAwaited.min_price ? parseFloat(searchParamsAwaited.min_price) : undefined;
  const maxPrice = searchParamsAwaited.max_price ? parseFloat(searchParamsAwaited.max_price) : undefined;

  // Get initial global filters (cross-category)
  const initialFilters = await getGlobalInitialFilters();

  return (
    <SearchPage
      query={query}
      initialPage={currentPage}
      initialItemsPerPage={itemsPerPage}
      initialFilters={initialFilters}
      minPossiblePrice={initialFilters.price_range.min}
      maxPossiblePrice={initialFilters.price_range.max}
      initialBrands={brands}
      initialModels={models}
      initialMinPrice={minPrice}
      initialMaxPrice={maxPrice}
    />
  );
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const query = sp?.q || '';
  const page = sp?.page ? parseInt(sp.page) : 1;
  
  const title = query 
    ? `Buscar "${query}" – compara precios y ahorra`
    : 'Buscar productos – compara precios y ahorra';
  
  const description = query
    ? `Resultados de búsqueda para "${query}": compara precios por unidad y encuentra las mejores ofertas.`
    : 'Busca productos en todas las categorías: compara precios por unidad y encuentra las mejores ofertas.';
  
  const baseUrl = `${env().NEXT_PUBLIC_SITE_URL}/search`;
  let url = baseUrl;
  
  // Build canonical URL with parameters
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (page && page > 1) params.append('page', page.toString());
  
  if (params.toString()) {
    url = `${baseUrl}?${params.toString()}`;
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: page && page > 1 ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title, description, url },
    twitter: { title, description, card: 'summary_large_image' },
  };
}