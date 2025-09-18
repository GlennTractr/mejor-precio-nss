/**
 * Helper to construct URLs for API calls that work in both client and server environments
 */
function getBaseUrl(): string {
  // For server-side rendering, we need the full URL
  if (typeof window === 'undefined') {
    // In server environment, use the environment variable or localhost as fallback
    return process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
  }
  
  // For client-side, we can use relative paths
  return '';
}

export function createApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

/**
 * Enhanced fetch wrapper that handles URL construction for both client and server
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = createApiUrl(path);
  return fetch(url, options);
}