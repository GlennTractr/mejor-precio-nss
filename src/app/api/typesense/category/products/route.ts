import { NextRequest } from 'next/server';
import { typesenseServerClient, getCollectionName } from '@/lib/typesense-server-client';
import { env } from '@/lib/env';
import type { SearchResponse } from '@/types/product';

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

// Build filter string for Typesense query
function buildFilterString(
  categorySlug: string,
  brands?: string[],
  models?: string[],
  minPrice?: number,
  maxPrice?: number,
  specLabels?: string[]
): string {
  const countryCode = env().NEXT_PUBLIC_COUNTRY_CODE;
  const filters = [`category_slug:=${categorySlug}`, `country:=${countryCode}`];

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

export async function POST(request: NextRequest) {
  try {
    const { categorySlug, filterParams } = await request.json() as {
      categorySlug: string;
      filterParams: FilterParams;
    };

    if (!categorySlug) {
      return Response.json({ error: 'Category slug is required' }, { status: 400 });
    }

    if (!filterParams) {
      return Response.json({ error: 'Filter parameters are required' }, { status: 400 });
    }

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
    console.error('Category products error:', error);
    return Response.json({ error: 'Failed to fetch category products' }, { status: 500 });
  }
}