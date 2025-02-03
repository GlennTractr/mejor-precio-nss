import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

const typesenseAdapter = new TypesenseInstantsearchAdapter({
  server: {
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_ADMIN_API_KEY!,
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
        port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '443'),
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'https',
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'title,brand,model',
  },
});

export const typesenseClient = typesenseAdapter.typesenseClient;
