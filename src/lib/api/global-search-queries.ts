import type { FacetValue, Product, FacetCount } from '@/types/product';
import { apiFetch } from '@/lib/api/fetch-helper';

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
    const response = await apiFetch('/api/typesense/global/filters', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch global filters: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


// Get products with filters for global search
export async function getGlobalFilteredProducts(filterParams: FilterParams): Promise<{
  products: Product[];
  totalItems: number;
  facetCounts: FacetCount[];
}> {
  try {
    const response = await apiFetch('/api/typesense/global/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filterParams }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch global products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
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
