import { NextRequest } from 'next/server';
import { typesenseClient } from '@/lib/typesense-client';

interface FacetStats {
  min: number;
  max: number;
}

interface FacetCount {
  field_name: string;
  counts: Array<{
    value: string;
    count: number;
  }>;
}

interface SearchResponseWithStats {
  facet_stats?: {
    [key: string]: FacetStats;
  };
  facet_counts?: FacetCount[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '*';
  const filterBy = searchParams.get('filter_by') || '';

  try {
    console.log('filterBy', filterBy);
    // Get all basic facets and price range in one query
    const basicFacetsResponse = (await typesenseClient.collections('product').documents().search(
      {
        q: query,
        query_by: 'title,brand,model',
        filter_by: filterBy,
        facet_by: 'brand,model,specs.type,best_price_per_unit',
        max_facet_values: 100,
        page: 1,
        per_page: 0,
        facet_query: 'best_price_per_unit:*',
      },
      {}
    )) as SearchResponseWithStats;
    console.log('basicFacetsResponse', basicFacetsResponse);

    // Get price range from facet stats
    const priceStats = basicFacetsResponse.facet_stats?.best_price_per_unit;
    const priceRange = {
      min: priceStats?.min || 0,
      max: priceStats?.max || 0,
    };

    // Extract brand and model facets
    const facetCounts = basicFacetsResponse.facet_counts || [];
    const brandFacets = facetCounts.find((f: FacetCount) => f.field_name === 'brand')?.counts || [];
    const modelFacets = facetCounts.find((f: FacetCount) => f.field_name === 'model')?.counts || [];

    // Then, for each spec type, get the label counts
    const specTypePromises =
      facetCounts
        .find((f: FacetCount) => f.field_name === 'specs.type')
        ?.counts.map(async specType => {
          const labelResponse = await typesenseClient
            .collections('product')
            .documents()
            .search(
              {
                q: query,
                query_by: 'title,brand,model',
                filter_by: `${filterBy} && specs.type:=${specType.value}`,
                facet_by: 'specs.label',
                max_facet_values: 100,
                page: 1,
                per_page: 0,
              },
              {}
            );

          return {
            type: specType.value,
            count: specType.count,
            labels:
              labelResponse.facet_counts?.find((f: FacetCount) => f.field_name === 'specs.label')
                ?.counts || [],
          };
        }) || [];

    const specTypesWithLabels = await Promise.all(specTypePromises);

    return Response.json({
      price_range: priceRange,
      facets: {
        brand: brandFacets,
        model: modelFacets,
      },
      specs_facets: specTypesWithLabels,
    });
  } catch (error) {
    console.error('Filters error:', error);
    return Response.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}
