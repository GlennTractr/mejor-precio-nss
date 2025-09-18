import { typesenseServerClient, getCollectionName } from '@/lib/typesense-server-client';
import type { SearchResponse } from '@/types/product';

export async function GET() {
  try {
    // Get global counts from Typesense (all categories)
    const collectionName = getCollectionName();
    const facetsResponse = (await typesenseServerClient
      .collections(collectionName)
      .documents()
      .search(
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

    return Response.json({
      price_range: priceRange,
      facets: {
        brand: brandFacets,
        model: modelFacets,
      },
      specs_facets: [], // No specs for global search
    });
  } catch (error) {
    console.error('Global filters error:', error);
    return Response.json({ error: 'Failed to fetch global filters' }, { status: 500 });
  }
}