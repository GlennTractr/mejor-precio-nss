import { NextResponse } from 'next/server';
import { typesenseClient } from '@/lib/typesense-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');

    const searchParameters = {
      q: '*',
      query_by: 'title',
      page,
      per_page: perPage,
      sort_by: 'best_price_per_unit:asc',
    };

    const searchResults = await typesenseClient
      .collections('product')
      .documents()
      .search(searchParameters);

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
