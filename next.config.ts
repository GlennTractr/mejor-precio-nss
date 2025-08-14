import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

function getSupabaseHostFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return null;
  }
}

const supabaseHost = getSupabaseHostFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');

const nextConfig: NextConfig = {
  images: {
    domains: supabaseHost ? [supabaseHost] : [],
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
