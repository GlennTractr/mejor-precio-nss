import { typesenseClient } from '@/lib/typesense-client';
import createClient from '@/lib/supabase/client';
import type { SearchResponse, SpecFacet, FacetValue, Product, FacetCount } from '@/types/product';

interface SpecsGroupedByType {
  [key: string]: string[];
}

interface FilterParams {
  page: number;
  perPage: number;
  query?: string;
  brands?: string[];
  models?: string[];
  minPrice?: number;
  maxPrice?: number;
  specTypes?: string[];
  specLabels?: string[];
}

export interface CategoryFilters {
  price_range: {
    min: number;
    max: number;
  };
  facets: {
    brand: FacetValue[];
    model: FacetValue[];
  };
  specs_facets: SpecFacet[];
  category_name: string;
}

export interface CategoryData {
  products: Product[];
  totalItems: number;
  filters: CategoryFilters;
}

// Get category name from slug
export async function getCategoryName(categorySlug: string): Promise<string> {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('ProductCategory')
    .select('label')
    .eq('slug', categorySlug)
    .single();

  if (!category) {
    throw new Error('Category not found');
  }

  return category.label;
}

// Get initial filters for a category
export async function getInitialFilters(categorySlug: string): Promise<CategoryFilters> {
  try {
    const supabase = await createClient();
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
      category_name: category.label,
    };
  } catch (error) {
    console.error('Failed to fetch initial filters:', error);
    throw error;
  }
}

// Build filter string for Typesense query
export function buildFilterString(
  categorySlug: string,
  brands?: string[],
  models?: string[],
  minPrice?: number,
  maxPrice?: number,
  specLabels?: string[]
): string {
  const filters = [`category_slug:=${categorySlug}`];

  if (brands && brands.length > 0) {
    filters.push(`brand:=[${brands.map(b => `'${b}'`).join(',')}]`);
  }

  if (models && models.length > 0) {
    filters.push(`model:=[${models.map(m => `'${m}'`).join(',')}]`);
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    filters.push(`best_price_per_unit:>=${minPrice} && best_price_per_unit:<=${maxPrice}`);
  }

  if (specLabels && specLabels.length > 0) {
    filters.push(`specs.label:=[${specLabels.map(s => `'${s}'`).join(',')}]`);
  }

  return filters.join(' && ');
}

// Get products with filters
export async function getFilteredProducts(
  categorySlug: string,
  filterParams: FilterParams
): Promise<{
  products: Product[];
  totalItems: number;
  facetCounts: FacetCount[];
}> {
  const { page, perPage, query, brands, models, minPrice, maxPrice, specLabels } = filterParams;

  const filterString = buildFilterString(
    categorySlug,
    brands,
    models,
    minPrice,
    maxPrice,
    specLabels
  );

  const searchParams = {
    q: query || '*',
    query_by: 'title,brand,model',
    filter_by: filterString,
    facet_by: 'brand,model,specs.type,specs.label,best_price_per_unit',
    max_facet_values: 100,
    page,
    per_page: perPage,
    sort_by: 'best_price_per_unit:asc',
  };

  try {
    const response = (await typesenseClient
      .collections('product')
      .documents()
      .search(searchParams, {})) as SearchResponse;

    return {
      products: response.hits.map(hit => hit.document),
      totalItems: response.found,
      facetCounts: response.facet_counts || [],
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

// Get category data with merged filters and products
export async function getCategoryData(
  categorySlug: string,
  filterParams: FilterParams
): Promise<CategoryData> {
  // Get initial filters (this will not change with filter updates)
  const initialFilters = await getInitialFilters(categorySlug);

  // Get filtered products with counts
  const { products, totalItems, facetCounts } = await getFilteredProducts(
    categorySlug,
    filterParams
  );

  // Update filter counts based on current filter selection
  const updatedFilters = {
    ...initialFilters,
    facets: {
      brand: updateFacetCounts(
        initialFilters.facets.brand,
        facetCounts.find(f => f.field_name === 'brand')?.counts || []
      ),
      model: updateFacetCounts(
        initialFilters.facets.model,
        facetCounts.find(f => f.field_name === 'model')?.counts || []
      ),
    },
    specs_facets: updateSpecFacetCounts(
      initialFilters.specs_facets,
      facetCounts.find(f => f.field_name === 'specs.label')?.counts || []
    ),
  };

  return {
    products,
    totalItems,
    filters: updatedFilters,
  };
}

// Helper function to update facet counts
function updateFacetCounts(
  prevFacets: FacetValue[],
  newCounts: { value: string; count: number; highlighted?: string }[]
): FacetValue[] {
  return prevFacets.map(facet => ({
    ...facet,
    count: newCounts.find(c => c.value === facet.value)?.count || 0,
  }));
}

// Helper function to update spec facet counts
function updateSpecFacetCounts(
  prevSpecs: SpecFacet[],
  newCounts: { value: string; count: number; highlighted?: string }[]
): SpecFacet[] {
  return prevSpecs.map(spec => ({
    ...spec,
    labels: spec.labels.map(label => ({
      ...label,
      count: newCounts.find(c => c.value === label.value)?.count || 0,
    })),
  }));
}
