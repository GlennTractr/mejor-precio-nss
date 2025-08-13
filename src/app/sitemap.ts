import type { MetadataRoute } from 'next';
import createServerClient from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const supabase = await createServerClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
  ];

  // Categories
  const { data: categories } = await supabase
    .from('ProductCategory')
    .select('slug, created_at')
    .order('created_at', { ascending: false })
    .limit(5000);

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map(c => ({
    url: `${base}/categoria/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
    lastModified: c.created_at ? new Date(c.created_at as unknown as string) : undefined,
  }));

  // Products via Typesense index exposed through product_view in Supabase for slugs
  const { data: products } = await supabase
    .from('product_view')
    .select('product_slug, id')
    .limit(10000);

  const productRoutes: MetadataRoute.Sitemap = (products || []).map(p => ({
    url: `${base}/producto/${p.product_slug}`,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
