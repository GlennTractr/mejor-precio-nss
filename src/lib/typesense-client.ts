import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

const getTypesenseConfig = () => {
  // Try client-side (NEXT_PUBLIC_) first, then server-side
  const apiKey =
    process.env.NEXT_PUBLIC_TYPESENSE_ADMIN_API_KEY || process.env.TYPESENSE_ADMIN_API_KEY;
  const host = process.env.NEXT_PUBLIC_TYPESENSE_HOST || process.env.TYPESENSE_HOST;
  const port = process.env.NEXT_PUBLIC_TYPESENSE_PORT || process.env.TYPESENSE_PORT;
  const protocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || process.env.TYPESENSE_PROTOCOL;

  if (!apiKey) {
    throw new Error(
      'Typesense API key is not configured. Please set NEXT_PUBLIC_TYPESENSE_ADMIN_API_KEY or TYPESENSE_ADMIN_API_KEY'
    );
  }

  return {
    apiKey,
    host: host || 'localhost',
    port: parseInt(port || '443'),
    protocol: protocol || 'https',
  };
};

const config = getTypesenseConfig();

const typesenseAdapter = new TypesenseInstantsearchAdapter({
  server: {
    apiKey: config.apiKey,
    nodes: [
      {
        host: config.host,
        port: config.port,
        protocol: config.protocol,
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'title,brand,model',
  },
});

export const typesenseClient = typesenseAdapter.typesenseClient;
