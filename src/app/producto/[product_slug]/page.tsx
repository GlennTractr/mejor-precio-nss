// Server Component

import { ProductPage } from '@/components/product/product-page';

interface PageProps {
  params: Promise<{
    product_slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const productSlug = (await params).product_slug;
  return <ProductPage productSlug={productSlug} />;
}
