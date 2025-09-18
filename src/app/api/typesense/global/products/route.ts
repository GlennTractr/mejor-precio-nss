import { NextRequest } from 'next/server';
import { typesenseServerClient, getCollectionName } from '@/lib/typesense-server-client';
import type { SearchResponse } from '@/types/product';

interface FilterParams {
  page: number;
  perPage: number;
  query?: string;
  brands?: string[];
  models?: string[];
  minPrice?: number;
  maxPrice?: number;
}

// Build filter string for global search (no category constraint)
function buildGlobalFilterString(
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

export async function POST(request: NextRequest) {
  try {
    const { filterParams } = await request.json() as {
      filterParams: FilterParams;
    };

    if (!filterParams) {
      return Response.json({ error: 'Filter parameters are required' }, { status: 400 });
    }

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

    const collectionName = getCollectionName();
    const response = (await typesenseServerClient
      .collections(collectionName)
      .documents()
      .search(searchParams, {})) as SearchResponse;

    return Response.json({
      products: response.hits.map(hit => hit.document),
      totalItems: response.found,
      facetCounts: response.facet_counts || [],
    });
  } catch (error) {
    console.error('Global products error:', error);
    return Response.json({ error: 'Failed to fetch global products' }, { status: 500 });
  }
}