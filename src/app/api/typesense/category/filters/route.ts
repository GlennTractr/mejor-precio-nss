import { NextRequest } from 'next/server';
import { typesenseServerClient, getCollectionName } from '@/lib/typesense-server-client';
import createClient from '@/lib/supabase/client';
import { env } from '@/lib/env';
import type { SearchResponse } from '@/types/product';

interface SpecsGroupedByType {
  [key: string]: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { categorySlug } = await request.json();

    if (!categorySlug) {
      return Response.json({ error: 'Category slug is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Get category ID and name from slug, filtered by country
    const { data: category } = await supabase
      .from('ProductCategory')
      .select('id, label')
      .eq('slug', categorySlug)
      .single();

    if (!category) {
      return Response.json({ error: `Category "${categorySlug}" not found` }, { status: 404 });
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
    const countryCode = env().NEXT_PUBLIC_COUNTRY_CODE;
    const collectionName = getCollectionName();
    const facetsResponse = (await typesenseServerClient
      .collections(collectionName)
      .documents()
      .search(
        {
          q: '*',
          query_by: 'title',
          filter_by: `category_slug:=${categorySlug} && country:=${countryCode}`,
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

    return Response.json({
      price_range: priceRange,
      facets: {
        brand: brandFacets,
        model: modelFacets,
      },
      specs_facets: specTypesWithLabels,
      category_name: category.label,
    });
  } catch (error) {
    console.error('Category filters error:', error);
    return Response.json({ error: 'Failed to fetch category filters' }, { status: 500 });
  }
}