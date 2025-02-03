'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import supabaseClient from '@/lib/supabase-client';
import { Tables } from '@/types/database';
import { useTranslations } from 'next-intl';
import { ProductSellContextList } from './product-sell-context-list';
import { Skeleton } from '@/components/ui/skeleton';

type ProductSellContext = {
  price: number;
  link: string;
  Shop: {
    label: string;
    img_url: string;
  };
};

type ProductPackaging = {
  quantity: number;
  type: string;
  ProductSellContext: ProductSellContext[];
};

type ProductModel = {
  label: string;
  brand: {
    label: string;
  };
  category: {
    label: string;
  };
};

type ProductImage = {
  file_bucket: string;
  file_path: string;
};

type ProductResponse = Omit<Tables<'Product'>, 'model' | 'image'> & {
  model: ProductModel;
  image: ProductImage;
  ProductPackaging: ProductPackaging[];
  ProductSpecs?: Array<{
    type: string;
    label: string;
  }>;
};

interface ProductPageProps {
  productSlug: string;
}

interface PriceContext {
  price: number;
  pricePerUnit: number;
  shop: string;
}

function ProductPageSkeleton() {
  return (
    <div>
      <div className="bg-white border-b border-primary-light/20">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Image skeleton */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md border border-primary-light/20">
            <div className="absolute inset-0 flex items-center justify-center bg-primary-light/5">
              <div className="w-16 h-16 rounded-full bg-primary-light/20" />
            </div>
          </div>

          {/* Right column - Product details skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-9 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>

            {/* Price card skeleton */}
            <div className="border-t border-b border-primary-light/20 py-6 space-y-3 bg-white/50 rounded-lg px-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-28 rounded-md" />
              </div>
            </div>

            {/* Product list skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-primary-light/20 p-4 space-y-4">
              <Skeleton className="h-7 w-48" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-primary-light/5 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right space-y-1">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-9 w-20 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductPage({ productSlug }: ProductPageProps) {
  const t = useTranslations();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // First, search in Typesense to get the product ID
        const typesenseResponse = await fetch(
          `/api/typesense/search?q=${productSlug}&filter_by=product_slug:${productSlug}`
        );
        const typesenseData = await typesenseResponse.json();

        if (!typesenseData.hits?.length) {
          throw new Error('Product not found');
        }

        const productId = typesenseData.hits[0].document.id;

        // Then, fetch full product details from Supabase
        const { data: productData, error: supabaseError } = await supabaseClient
          .from('Product')
          .select(
            `
            *,
            model (
              label,
              brand (
                label
              ),
              category (
                label
              )
            ),
            image (
              file_bucket,
              file_path
            ),
            ProductSpecs (
              type,
              label
            ),
            ProductPackaging (
              quantity,
              type,
              ProductSellContext (
                price,
                link,
                Shop (
                  label,
                  img_url
                )
              )
            )
          `
          )
          .eq('id', productId)
          .single();

        if (supabaseError) throw supabaseError;

        const product = productData as unknown as ProductResponse;
        setProduct(product);

        // Get image URL from Supabase storage
        if (product.image) {
          const { data } = supabaseClient.storage
            .from(product.image.file_bucket)
            .getPublicUrl(product.image.file_path);
          setImageUrl(data.publicUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productSlug]);

  if (loading) return <ProductPageSkeleton />;
  if (error) return <div>{t('product.error', { message: error })}</div>;
  if (!product) return <div>{t('product.notFound')}</div>;

  // Calculate the lowest price and price per unit from ProductPackaging
  const lowestPriceContext = product.ProductPackaging?.reduce<PriceContext | null>(
    (lowest, pkg) => {
      const pkgPrices =
        pkg.ProductSellContext?.map(ctx => ({
          price: ctx.price,
          pricePerUnit: ctx.price / pkg.quantity,
          shop: ctx.Shop?.label || '',
        })) || [];

      const minPrice = Math.min(...pkgPrices.map(p => p.price));
      const minPriceContext = pkgPrices.find(p => p.price === minPrice);

      if (!lowest || (minPriceContext && minPriceContext.price < lowest.price)) {
        return minPriceContext || null;
      }
      return lowest;
    },
    null
  );

  return (
    <div>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Image */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md border border-primary-light/20">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={product?.title || ''}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>

          {/* Right column - Product details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-accent">{product.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {product.model?.category?.label && (
                  <>
                    <span>{product.model.category.label}</span>
                    <span className="text-primary-light">•</span>
                  </>
                )}
                {product.model?.brand?.label && (
                  <>
                    <span className="text-muted-foreground">{product.model.brand.label}</span>
                    <span className="text-primary-light">•</span>
                  </>
                )}
                {product.model?.label && (
                  <span className="text-muted-foreground">{product.model.label}</span>
                )}
              </div>
              {product.ProductSpecs && product.ProductSpecs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {product.ProductSpecs.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light/10 text-primary"
                    >
                      {spec.type}: {spec.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {lowestPriceContext && (
              <div className="border-t border-b border-primary-light/20 py-6 space-y-3 bg-white/50 rounded-lg px-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-accent">
                      ${lowestPriceContext.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t('product.priceAt', { shop: lowestPriceContext.shop })}
                    </span>
                  </div>
                  <a
                    href={product.ProductPackaging?.[0]?.ProductSellContext?.[0]?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-colors"
                  >
                    {t('actions.buyNow')}
                  </a>
                </div>
                <div className="text-sm text-primary-dark font-medium">
                  {t('product.pricePerUnit', { price: lowestPriceContext.pricePerUnit.toFixed(2) })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-primary-light/20 p-4">
              <ProductSellContextList productPackaging={product.ProductPackaging} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
