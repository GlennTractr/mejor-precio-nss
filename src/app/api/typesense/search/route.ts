import { NextRequest } from 'next/server';
import type { SearchResponse, FacetCount } from '@/types/product';
import { typesenseClient } from '@/lib/typesense-client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('per_page') || '20');
  const query = searchParams.get('q') || '*';
  const filterBy = searchParams.get('filter_by') || '';
  const sortBy = searchParams.get('sort_by') || 'best_price_per_unit:asc';

  try {
    // Get collection name from environment or fallback to 'product'
    const collectionName = process.env.TYPESENSE_COLLECTION_NAME || 'product';
    
    // Get search results with facet counts for updating filter counts
    const searchResults = (await typesenseClient.collections(collectionName).documents().search(
      {
        q: query,
        query_by: 'title,brand,model',
        filter_by: filterBy,
        page,
        per_page: perPage,
        sort_by: sortBy,
        prefix: true,
        facet_by: 'brand,model,specs.type,specs.label',
        max_facet_values: 100,
        facet_query: 'specs.type:*',
        facet_query_num_typos: 0,
      },
      {}
    )) as SearchResponse;

    // Get facets with all possible values (without filters)
    const facetsResponse = await typesenseClient
      .collections(collectionName)
      .documents()
      .search(
        {
          q: '*',
          query_by: 'title',
          filter_by: filterBy.includes('category_slug')
            ? `category_slug:=${filterBy.split('&&')[0].trim().split(':=')[1].replace(/['"]/g, '')}`
            : '', // No filter if not filtering by category
          facet_by: 'brand,model,specs.type,specs.label',
          max_facet_values: 100,
          per_page: 0,
        },
        {}
      );

    // Get filtered facet counts
    const filteredFacetsResponse = await typesenseClient.collections(collectionName).documents().search(
      {
        q: query,
        query_by: 'title',
        filter_by: filterBy,
        facet_by: 'brand,model,specs.type,specs.label',
        max_facet_values: 100,
        per_page: 0,
      },
      {}
    );

    // Extract facet counts
    const allFacetCounts = facetsResponse.facet_counts || [];
    const filteredFacetCounts = filteredFacetsResponse.facet_counts || [];

    // Get brand and model facets with counts
    const allBrands =
      allFacetCounts.find((f: FacetCount) => f.field_name === 'brand')?.counts || [];
    const allModels =
      allFacetCounts.find((f: FacetCount) => f.field_name === 'model')?.counts || [];
    const filteredBrandCounts =
      filteredFacetCounts.find((f: FacetCount) => f.field_name === 'brand')?.counts || [];
    const filteredModelCounts =
      filteredFacetCounts.find((f: FacetCount) => f.field_name === 'model')?.counts || [];

    // Merge counts
    const brandFacets = allBrands.map(brand => ({
      value: brand.value,
      count: filteredBrandCounts.find(b => b.value === brand.value)?.count || 0,
    }));

    const modelFacets = allModels.map(model => ({
      value: model.value,
      count: filteredModelCounts.find(m => m.value === model.value)?.count || 0,
    }));

    // Get specs facets
    const specTypes =
      allFacetCounts.find((f: FacetCount) => f.field_name === 'specs.type')?.counts || [];

    // For each spec type, get its label counts
    const specTypesWithLabels = await Promise.all(
      specTypes.map(async specType => {
        // Get all possible labels for this type
        const allLabelsResponse = await typesenseClient
          .collections(collectionName)
          .documents()
          .search(
            {
              q: '*',
              query_by: 'title',
              filter_by: filterBy.includes('category_slug')
                ? `category_slug:=${filterBy
                    .split('&&')[0]
                    .trim()
                    .split(':=')[1]
                    .replace(/['"]/g, '')} && specs.type:=${specType.value}`
                : `specs.type:=${specType.value}`,
              facet_by: 'specs.label',
              max_facet_values: 100,
              per_page: 0,
            },
            {}
          );

        // Get filtered label counts
        const filteredLabelsResponse = await typesenseClient
          .collections(collectionName)
          .documents()
          .search(
            {
              q: query,
              query_by: 'title',
              filter_by: `${filterBy} && specs.type:=${specType.value}`,
              facet_by: 'specs.label',
              max_facet_values: 100,
              per_page: 0,
            },
            {}
          );

        const allLabels =
          allLabelsResponse.facet_counts?.find(f => f.field_name === 'specs.label')?.counts || [];
        const filteredLabels =
          filteredLabelsResponse.facet_counts?.find(f => f.field_name === 'specs.label')?.counts ||
          [];

        // Merge counts
        const labels = allLabels.map(label => ({
          value: label.value,
          count: filteredLabels.find(l => l.value === label.value)?.count || 0,
        }));

        return {
          type: specType.value,
          count: filteredLabels.reduce((sum, label) => sum + label.count, 0),
          labels,
        };
      })
    );

    return Response.json({
      hits: searchResults.hits,
      found: searchResults.found,
      facet_counts: {
        brand: brandFacets,
        model: modelFacets,
      },
      specs_facets: specTypesWithLabels,
    });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Search failed' }, { status: 500 });
  }
}
