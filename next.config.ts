import type { NextConfig } from 'next';
import { env } from './src/lib/env';
import createNextIntlPlugin from 'next-intl/plugin';

console.log('ENV', env());
const nextConfig: NextConfig = {
  env: env(),
  images: {
    domains: [
      env().NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').replace('http://', ''),
      '127.0.0.1',
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
