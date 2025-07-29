import type { NextConfig } from 'next';
import { env } from './src/lib/env';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  env: env(),
  images: {
    domains: [env().NEXT_PUBLIC_SUPABASE_URL.replace('https://', '')],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
