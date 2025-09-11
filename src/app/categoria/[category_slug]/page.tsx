// Server Component
import { CategoryPage } from '@/components/category/category-page';
import { createClient } from '@supabase/supabase-js';
import { typesenseClient } from '@/lib/typesense-client';
import type { Metadata } from 'next';
import createServerClient from '@/lib/supabase/server';
import { env } from '@/lib/env';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{
    category_slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    per_page?: string;
  }>;
}

interface SpecsGroupedByType {
  [key: string]: string[];
}

async function getInitialFiltersAndName(categorySlug: string) {
  try {
    // 1. Get category ID and name from slug
    const { data: category } = await supabase
      .from('ProductCategory')
      .select('id, label')
      .eq('slug', categorySlug)
      .single();

    if (!category) {
      throw new Error('Category not found');
    }

    // 2. Get specs structure from Supabase
    const { data: specs } = await supabase
      .from('ProductSpecs')
      .select('type, label')
      .eq('category', category.id);

    // Group specs by type
    const specsGroupedByType = (specs || []).reduce(
      (acc: SpecsGroupedByType, spec: { type: string; label: string }) => {
        if (!acc[spec.type]) {
          acc[spec.type] = [];
        }
        acc[spec.type].push(spec.label);
        return acc;
      },
      {} as SpecsGroupedByType
    );

    // 3. Get counts from Typesense
    const collectionName = process.env.TYPESENSE_COLLECTION_NAME || 'product';
    const facetsResponse = await typesenseClient
      .collections(collectionName)
      .documents()
      .search(
        {
          q: '*',
          query_by: 'title',
          filter_by: `category_slug:=${categorySlug}`,
          facet_by: 'brand,model,specs.type,specs.label,best_price_per_unit',
          max_facet_values: 100,
          page: 1,
          per_page: 0,
        },
        {}
      );

    const facetCounts = facetsResponse.facet_counts || [];

    // Get price range
    const priceStats = facetCounts.find(f => f.field_name === 'best_price_per_unit')?.stats;
    const priceRange = {
      min: priceStats?.min || 0,
      max: priceStats?.max || 0,
    };

    // Get brand and model facets
    const brandFacets = facetCounts.find(f => f.field_name === 'brand')?.counts || [];
    const modelFacets = facetCounts.find(f => f.field_name === 'model')?.counts || [];

    // Get all specs label counts
    const specLabelCounts = facetCounts.find(f => f.field_name === 'specs.label')?.counts || [];

    // Create specs facets using Supabase structure and Typesense counts
    const specTypesWithLabels = Object.entries(specsGroupedByType).map(
      ([type, labels]: [string, string[]]) => ({
        type,
        count: labels.length,
        labels: labels.map(label => ({
          value: label,
          count: specLabelCounts.find(c => c.value === label)?.count || 0,
        })),
      })
    );

    return {
      initialFilters: {
        price_range: priceRange,
        facets: {
          brand: brandFacets,
          model: modelFacets,
        },
        specs_facets: specTypesWithLabels,
        category_name: category.label,
      },
      categoryName: category.label,
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
  const { initialFilters, categoryName } = await getInitialFiltersAndName(categorySlug);

  return (
    <div className="py-6 my-6">
      <CategoryPage
        categorySlug={categorySlug}
        categoryName={categoryName}
        initialPage={currentPage}
        initialItemsPerPage={itemsPerPage}
        initialFilters={initialFilters}
        minPossiblePrice={initialFilters.price_range.min}
        maxPossiblePrice={initialFilters.price_range.max}
      />
    </div>
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
