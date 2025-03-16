import { NextRequest } from 'next/server';
import { typesenseClient } from '@/lib/typesense-client';
import type { SearchResponse } from '@/types/product';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '*';
  const perPage = parseInt(searchParams.get('per_page') || '10');
  const filterBy = searchParams.get('filter_by') || '';
  const excludeId = searchParams.get('exclude_id') || '';
  const categorySlug = searchParams.get('category_slug') || '';
  const specs = searchParams.get('specs') || '';

  try {
    // Build filter string
    const filters: string[] = [];

    // Add category filter if provided
    if (categorySlug) {
      filters.push(`category_slug:=${categorySlug}`);
    }

    // Add specs filters if provided
    if (specs) {
      // Parse the specs JSON string
      try {
        const specsArray = JSON.parse(specs);
        specsArray.forEach((spec: { type: string; label: string }) => {
          if (spec.type && spec.label) {
            // Add each spec as a filter
            filters.push(`specs.type:=${spec.type} && specs.label:=${spec.label}`);
          }
        });
      } catch (e) {
        console.error('Error parsing specs JSON:', e);
      }
    }

    // Add any additional filters
    if (filterBy) {
      filters.push(filterBy);
    }

    // Always exclude the current product if an ID is provided
    if (excludeId) {
      filters.push(`id:!=${excludeId}`);
    }

    // Combine all filters with AND operator
    const finalFilter = filters.join(' && ');

    // Get similar products based on the query and filters
    const searchResults = (await typesenseClient.collections('product').documents().search(
      {
        q: query,
        query_by: 'title,brand,model,category',
        filter_by: finalFilter,
        per_page: perPage,
        sort_by: 'best_price_per_unit:asc',
        prefix: true,
      },
      {}
    )) as SearchResponse;

    return Response.json({
      hits: searchResults.hits,
      found: searchResults.found,
    });
  } catch (error) {
    console.error('Similar products search error:', error);
    return Response.json({ error: 'Search failed' }, { status: 500 });
  }
}
