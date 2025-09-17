import { typesenseClient } from '@/lib/typesense-client';
import type { SearchResponse, FacetValue, Product, FacetCount } from '@/types/product';

interface FilterParams {
  page: number;
  perPage: number;
  query?: string;
  brands?: string[];
  models?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface GlobalSearchFilters {
  price_range: {
    min: number;
    max: number;
  };
  facets: {
    brand: FacetValue[];
    model: FacetValue[];
  };
  specs_facets: []; // Always empty for global search - category-specific filters hidden
}

export interface GlobalSearchData {
  products: Product[];
  totalItems: number;
  filters: GlobalSearchFilters;
}

// Get initial filters for global search (cross-category)
export async function getGlobalInitialFilters(): Promise<GlobalSearchFilters> {
  try {
    // Get global counts from Typesense (all categories)
    const collectionName = process.env.TYPESENSE_COLLECTION_NAME || 'product';
    const facetsResponse = (await typesenseClient.collections(collectionName).documents().search(
      {
        q: '*',
        query_by: 'title',
        filter_by: '', // No category filter - global search
        facet_by: 'brand,model,best_price_per_unit',
        max_facet_values: 100,
        page: 1,
        per_page: 0,
      },
      {}
    )) as SearchResponse;

    const facetCounts = facetsResponse.facet_counts || [];

    // Get global price range
    const priceStats = facetCounts.find(f => f.field_name === 'best_price_per_unit')?.stats;
    const priceRange = {
      min: priceStats?.min || 0,
      max: priceStats?.max || 0,
    };

    // Get brand and model facets
    const brandFacets = facetCounts.find(f => f.field_name === 'brand')?.counts || [];
    const modelFacets = facetCounts.find(f => f.field_name === 'model')?.counts || [];

    return {
      price_range: priceRange,
      facets: {
        brand: brandFacets,
        model: modelFacets,
      },
      specs_facets: [], // No specs for global search
    };
  } catch (error) {
    throw error;
  }
}

// Build filter string for global search (no category constraint)
export function buildGlobalFilterString(
  brands?: string[],
  models?: string[],
  minPrice?: number,
  maxPrice?: number
): string {
  const filters: string[] = [];

  if (brands && brands.length > 0) {
    filters.push(`brand:=[${brands.map(b => `'${b}'`).join(',')}]`);
  }

  if (models && models.length > 0) {
    filters.push(`model:=[${models.map(m => `'${m}'`).join(',')}]`);
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    filters.push(`best_price_per_unit:>=${minPrice} && best_price_per_unit:<=${maxPrice}`);
  }

  return filters.join(' && ');
}

// Get products with filters for global search
export async function getGlobalFilteredProducts(filterParams: FilterParams): Promise<{
  products: Product[];
  totalItems: number;
  facetCounts: FacetCount[];
}> {
  const { page, perPage, query, brands, models, minPrice, maxPrice } = filterParams;

  const filterString = buildGlobalFilterString(brands, models, minPrice, maxPrice);

  const searchParams = {
    q: query || '*',
    query_by: 'title,brand,model',
    filter_by: filterString,
    facet_by: 'brand,model,best_price_per_unit',
    max_facet_values: 100,
    page,
    per_page: perPage,
    sort_by: 'best_price_per_unit:asc',
  };

  try {
    const collectionName = process.env.TYPESENSE_COLLECTION_NAME || 'product';
    const response = (await typesenseClient
      .collections(collectionName)
      .documents()
      .search(searchParams, {})) as SearchResponse;

    return {
      products: response.hits.map(hit => hit.document),
      totalItems: response.found,
      facetCounts: response.facet_counts || [],
    };
  } catch (error) {
    throw error;
  }
}

// Get global search data with merged filters and products
export async function getGlobalSearchData(filterParams: FilterParams): Promise<GlobalSearchData> {
  // Get initial filters (this will not change with filter updates)
  const initialFilters = await getGlobalInitialFilters();

  // Get filtered products with counts
  const { products, totalItems, facetCounts } = await getGlobalFilteredProducts(filterParams);

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
    specs_facets: [] as [], // Always empty for global search
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
