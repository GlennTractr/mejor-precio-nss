// Server Component
import { CategoryPage } from '@/components/category/category-page';
import type { Metadata } from 'next';
import createServerClient from '@/lib/supabase/server';
import { getInitialFilters } from '@/lib/api/category-queries';
import { env } from '@/lib/env';


interface PageProps {
  params: Promise<{
    category_slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    per_page?: string;
  }>;
}


async function getInitialFiltersAndName(categorySlug: string) {
  try {
    // Get category information from Supabase
    const supabase = await createServerClient();
    const { data: category } = await supabase
      .from('ProductCategory')
      .select('label, description')
      .eq('slug', categorySlug)
      .single();

    if (!category) {
      throw new Error('Category not found');
    }

    // Get initial filters from the API
    const initialFilters = await getInitialFilters(categorySlug);

    return {
      initialFilters,
      categoryName: category.label,
      categoryDescription: category.description,
    };
  } catch (error) {
    console.error('Failed to fetch initial filters:', error);
    throw error;
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  // Await the params here in the server component
  const categorySlug = (await params).category_slug;
  const searchParamsAwaited = (await searchParams) || {};
  const currentPage = parseInt(searchParamsAwaited.page || '1');
  const itemsPerPage = parseInt(searchParamsAwaited.per_page || '20');

  // Get initial filters and category name
  const { initialFilters, categoryName, categoryDescription } =
    await getInitialFiltersAndName(categorySlug);

  return (
    <CategoryPage
      categorySlug={categorySlug}
      categoryName={categoryName}
      initialPage={currentPage}
      initialItemsPerPage={itemsPerPage}
      initialFilters={initialFilters}
      minPossiblePrice={initialFilters.price_range.min}
      maxPossiblePrice={initialFilters.price_range.max}
      description={categoryDescription}
    />
  );
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const categorySlug = (await params).category_slug;
  const sp = await searchParams;
  const supabase = await createServerClient();
  const { data: category } = await supabase
    .from('ProductCategory')
    .select('label')
    .eq('slug', categorySlug)
    .single();

  const categoryName = category?.label || categorySlug.replace(/-/g, ' ');
  const title = `${categoryName} – compara precios y ahorra`;
  const description = `Explora ${categoryName}: compara precios por unidad y encuentra las mejores ofertas.`;
  const baseUrl = `${env().NEXT_PUBLIC_SITE_URL}/categoria/${categorySlug}`;
  const page = sp?.page ? parseInt(sp.page) : 1;
  const url = page && page > 1 ? `${baseUrl}?page=${page}` : baseUrl;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: page && page > 1 ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title, description, url },
    twitter: { title, description, card: 'summary_large_image' },
  };
}
