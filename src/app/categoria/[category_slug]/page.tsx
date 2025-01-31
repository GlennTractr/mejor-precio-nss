// Server Component
import { CategoryPage } from '@/components/category/category-page';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import type { SearchResponse } from '@/types/product';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

const typesenseAdapter = new TypesenseInstantsearchAdapter({
  server: {
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY!,
    nodes: [
      {
        host: process.env.TYPESENSE_HOST!,
        port: parseInt(process.env.TYPESENSE_PORT || '443'),
        protocol: process.env.TYPESENSE_PROTOCOL || 'https',
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'title,brand,model',
  },
});

const typesenseClient = typesenseAdapter.typesenseClient;

interface PageProps {
  params: {
    category_slug: string;
  };
  searchParams: {
    page?: string;
    per_page?: string;
  };
}

interface SpecsGroupedByType {
  [key: string]: string[];
}

async function getInitialFilters(categorySlug: string) {
  try {
    // 1. Get category ID from slug
    const { data: category } = await supabase
      .from('ProductCategory')
      .select('id')
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
    const facetsResponse = (await typesenseClient
      .collections('product')
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
      )) as SearchResponse;

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
      price_range: priceRange,
      facets: {
        brand: brandFacets,
        model: modelFacets,
      },
      specs_facets: specTypesWithLabels,
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

  // Get initial filters
  const initialFilters = await getInitialFilters(categorySlug);

  return (
    <CategoryPage
      categorySlug={categorySlug}
      initialPage={currentPage}
      initialItemsPerPage={itemsPerPage}
      initialFilters={initialFilters}
      minPossiblePrice={initialFilters.price_range.min}
      maxPossiblePrice={initialFilters.price_range.max}
    />
  );
}
