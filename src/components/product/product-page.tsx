'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import supabaseClient from '@/lib/supabase-client';
import { Tables } from '@/types/database';
import { useTranslations } from 'next-intl';

type ProductSellContext = {
  price: number;
  Shop: {
    label: string;
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
};

interface ProductPageProps {
  productSlug: string;
}

interface PriceContext {
  price: number;
  pricePerUnit: number;
  shop: string;
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
            ProductPackaging (
              quantity,
              type,
              ProductSellContext (
                price,
                Shop (
                  label
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

  if (loading) return <div>{t('product.loading')}</div>;
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
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Image */}
        <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={product?.title || ''}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </div>

        {/* Right column - Product details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {product.model?.category?.label && (
                <>
                  <span>{product.model.category.label}</span>
                  <span>•</span>
                </>
              )}
              {product.model?.brand?.label && (
                <>
                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    {product.model.brand.label}
                  </span>
                  <span>•</span>
                </>
              )}
              {product.model?.label && <span>{product.model.label}</span>}
            </div>
          </div>

          {lowestPriceContext && (
            <div className="border-t border-b py-4 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${lowestPriceContext.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  {t('product.priceAt', { shop: lowestPriceContext.shop })}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {t('product.pricePerUnit', { price: lowestPriceContext.pricePerUnit.toFixed(2) })}
              </div>
            </div>
          )}

          {product.ProductPackaging && product.ProductPackaging.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">{t('product.availableFrom')}</h2>
              <div className="space-y-3">
                {product.ProductPackaging.map((pkg, index) =>
                  pkg.ProductSellContext?.map((ctx, ctxIndex) => (
                    <div
                      key={`${index}-${ctxIndex}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{ctx.Shop?.label}</div>
                        <div className="text-sm text-gray-600">
                          {pkg.quantity} {pkg.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${ctx.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">
                          {t('product.pricePerUnit', {
                            price: (ctx.price / pkg.quantity).toFixed(2),
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
