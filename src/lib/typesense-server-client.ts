import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

const getServerTypesenseConfig = () => {
  // Only use server-side environment variables (no NEXT_PUBLIC_ prefix)
  const apiKey = process.env.TYPESENSE_ADMIN_API_KEY;
  const host = process.env.TYPESENSE_HOST;
  const port = process.env.TYPESENSE_PORT;
  const protocol = process.env.TYPESENSE_PROTOCOL;

  if (!apiKey) {
    throw new Error(
      'Typesense admin API key is not configured. Please set TYPESENSE_ADMIN_API_KEY environment variable'
    );
  }

  if (!host) {
    throw new Error(
      'Typesense host is not configured. Please set TYPESENSE_HOST environment variable'
    );
  }

  return {
    apiKey,
    host,
    port: parseInt(port || '443'),
    protocol: protocol || 'https',
  };
};

const config = getServerTypesenseConfig();

const typesenseServerAdapter = new TypesenseInstantsearchAdapter({
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

// Server-only Typesense client - NEVER expose to frontend
export const typesenseServerClient = typesenseServerAdapter.typesenseClient;

// Helper function to get collection name
export function getCollectionName(): string {
  return process.env.TYPESENSE_COLLECTION_NAME || 'product';
}