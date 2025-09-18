import createClient from '@/lib/supabase/client';
import type { SpecFacet, FacetValue, Product, FacetCount } from '@/types/product';
import { apiFetch } from '@/lib/api/fetch-helper';


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

// Get category name from slug, ensuring it belongs to current country
export async function getCategoryName(categorySlug: string): Promise<string> {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('ProductCategory')
    .select('label')
    .eq('slug', categorySlug)
    .single();

  if (!category) {
    throw new Error(`Category "${categorySlug}" not found`);
  }

  return category.label;
}

// Get initial filters for a category, ensuring it belongs to current country
export async function getInitialFilters(categorySlug: string): Promise<CategoryFilters> {
  try {
    const response = await apiFetch('/api/typesense/category/filters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categorySlug }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category filters: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
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
  try {
    const response = await apiFetch('/api/typesense/category/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categorySlug, filterParams }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
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
