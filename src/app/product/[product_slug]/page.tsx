// Server Component

interface PageProps {
  params: {
    product_slig: string;
  };
}

export default async function Page({ params }: PageProps) {
  // Await the params here in the server component
  const productSlug = (await params).product_slug;

  return <ProductPage productSlug={productSlug} />;
}
