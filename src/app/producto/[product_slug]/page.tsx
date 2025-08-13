// Server Component

import { ProductPage } from '@/components/product/product-page';
import type { Metadata } from 'next';
import createServerClient from '@/lib/supabase/server';
import { env } from '@/lib/env';

interface PageProps {
  params: Promise<{
    product_slug: string;
  }>;
}

async function fetchProductForSEO(productSlug: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('product_view')
    .select(
      'title, brand, model, category, product_slug, main_image_bucket, main_image_path, best_price_per_unit'
    )
    .eq('product_slug', productSlug)
    .single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const productSlug = (await params).product_slug;
  const product = await fetchProductForSEO(productSlug);

  const siteUrl = env().NEXT_PUBLIC_SITE_URL;
  const url = `${siteUrl}/producto/${productSlug}`;
  const image =
    product?.main_image_bucket && product?.main_image_path
      ? `${env().NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${product.main_image_bucket}/${
          product.main_image_path
        }`
      : `${siteUrl}/images/logo.svg`;

  const titleBase = product?.title || productSlug.replace(/-/g, ' ');
  const title = `${titleBase} – mejor precio por unidad`;
  const description = product
    ? `Compara precios de ${product.title} (${product.brand} ${product.model}) en ${product.category}. Encuentra el mejor precio por unidad.`
    : `Compara precios y ahorra. Consulta el mejor precio por unidad.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { title, description, images: [image], card: 'summary_large_image' },
  };
}

export default async function Page({ params }: PageProps) {
  const productSlug = (await params).product_slug;
  const product = await fetchProductForSEO(productSlug);
  const image =
    product?.main_image_bucket && product?.main_image_path
      ? `${env().NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${product.main_image_bucket}/${
          product.main_image_path
        }`
      : undefined;

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              brand: product.brand,
              category: product.category,
              image: image ? [image] : undefined,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'MXN',
                price: product.best_price_per_unit,
                url: `${env().NEXT_PUBLIC_SITE_URL}/producto/${product.product_slug}`,
                availability: 'https://schema.org/InStock',
              },
            }),
          }}
        />
      )}
      <ProductPage productSlug={productSlug} />
    </>
  );
}
