import { NextRequest } from 'next/server';
import { typesenseServerClient, getCollectionName } from '@/lib/typesense-server-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');

    const collectionName = getCollectionName();
    const searchParameters = {
      q: '*',
      query_by: 'title',
      page,
      per_page: perPage,
      sort_by: 'best_price_per_unit:asc',
    };

    const searchResults = await typesenseServerClient
      .collections(collectionName)
      .documents()
      .search(searchParameters, {});

    return Response.json(searchResults);
  } catch (error) {
    console.error('Home products search error:', error);
    return Response.json({ error: 'Failed to search home products' }, { status: 500 });
  }
}