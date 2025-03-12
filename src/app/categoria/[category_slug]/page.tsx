// Server Component
import { CategoryPage } from '@/components/category/category-page';
import { createClient } from '@supabase/supabase-js';
import { typesenseClient } from '@/lib/typesense-client';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

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
    const facetsResponse = await typesenseClient
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
    <CategoryPage
      categorySlug={categorySlug}
      categoryName={categoryName}
      initialPage={currentPage}
      initialItemsPerPage={itemsPerPage}
      initialFilters={initialFilters}
      minPossiblePrice={initialFilters.price_range.min}
      maxPossiblePrice={initialFilters.price_range.max}
    />
  );
}
