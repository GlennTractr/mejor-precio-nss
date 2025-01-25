import { NextRequest } from 'next/server';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

const typesenseAdapter = new TypesenseInstantsearchAdapter({
  server: {
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY!,
    nodes: [
      {
        host: process.env.TYPESENSE_HOST!,
        port: parseInt(process.env.TYPESENSE_PORT || '443'),
        protocol: process.env.TYPESENSE_PROTOCOL || 'https',
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'title,brand,model',
  },
});

const typesenseClient = typesenseAdapter.typesenseClient;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('category_id');
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('per_page') || '20');

  try {
    const searchResults = await typesenseClient
      .collections('product')
      .documents()
      .search(
        {
          q: '*',
          filter_by: `category_slug:=${categoryId}`,
          page,
          per_page: perPage,
          sort_by: 'best_price_per_unit:asc',
          prefix: true,
        },
        {}
      );

    return Response.json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Search failed' }, { status: 500 });
  }
}
