'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import supabaseClient from '@/lib/supabase-client';
import { Tables } from '@/types/database';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { SimilarProductsCarousel } from './similar-products-carousel';

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
  const tActions = useTranslations('actions');
  const tAuth = useTranslations('auth');
  const router = useRouter();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isNotified, setIsNotified] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [showAllProviders, setShowAllProviders] = useState(false);
  const currentUser = useCurrentUser();

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

  // Check if the product is in favorites
  useEffect(() => {
    async function checkNotifyStatus() {
      if (!currentUser.data?.id || !product?.id) return;

      try {
        const { data } = await supabaseClient
          .from('product_favory')
          .select('id')
          .eq('product', product.id)
          .eq('owner', currentUser.data.id)
          .single();

        setIsNotified(!!data);
      } catch {
        // If no favorite found, data will be null and error will be thrown
        setIsNotified(false);
      }
    }

    checkNotifyStatus();
  }, [currentUser.data?.id, product?.id]);

  const toggleNotify = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior

    if (!currentUser.data?.id) {
      // Clear any existing pending favorites first
      localStorage.removeItem('pendingFavorite');

      // Store the product ID to add to favorites after login
      if (product?.id) {
        localStorage.setItem('pendingFavorite', product.id);
      }

      // Store the current URL to redirect back after login
      const currentUrl = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentUrl);

      // Redirect to login page with next parameter
      router.push(`/auth/login?next=${encodeURIComponent('/process-favorite')}`);
      return;
    }

    if (!product?.id) return;

    setIsFavoriteLoading(true);
    try {
      if (isNotified) {
        await supabaseClient
          .from('product_favory')
          .delete()
          .eq('product', product.id)
          .eq('owner', currentUser.data.id);
      } else {
        await supabaseClient.from('product_favory').insert({
          product: product.id,
          owner: currentUser.data.id,
        });
      }
      setIsNotified(!isNotified);
    } catch (error) {
      console.error('Error toggling notify status:', error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (loading) return <ProductPageSkeleton />;
  if (error) return <div>{t('product.error', { message: error })}</div>;
  if (!product) return <div>{t('product.notFound')}</div>;

  // Calculate price range and best price per unit
  const pricePerUnitData =
    product.ProductPackaging?.flatMap(
      pkg =>
        pkg.ProductSellContext?.map(ctx => ({
          price: ctx.price,
          pricePerUnit: ctx.price / pkg.quantity,
          shop: ctx.Shop?.label || '',
          shopImg: ctx.Shop?.img_url || '',
          quantity: pkg.quantity,
          link: ctx.link,
        })) || []
    ) || [];

  // Sort by price per unit to find the best deal
  const sortedPricePerUnit = [...pricePerUnitData].sort((a, b) => a.pricePerUnit - b.pricePerUnit);

  // Calculate price range
  const minPricePerUnit = Math.min(...pricePerUnitData.map(p => p.pricePerUnit));
  const maxPricePerUnit = Math.max(...pricePerUnitData.map(p => p.pricePerUnit));

  // Get unique providers
  const uniqueProviders = Array.from(new Set(pricePerUnitData.map(p => p.shop)));

  // Limit displayed providers based on state
  const displayedProviders = showAllProviders ? sortedPricePerUnit : sortedPricePerUnit.slice(0, 5);
  const hasMoreProviders = sortedPricePerUnit.length > 5;

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
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-accent">{product.title}</h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleNotify}
                        disabled={isFavoriteLoading}
                        className={cn(
                          'p-2 rounded-full transition-colors',
                          isNotified
                            ? 'text-red-500 bg-red-50 hover:bg-red-100'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        )}
                      >
                        <Bell className="h-6 w-6" fill={isNotified ? 'currentColor' : 'none'} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentUser.data
                        ? isNotified
                          ? tActions('notify.remove')
                          : tActions('notify.add')
                        : tAuth('loginToFavorite')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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

            {/* Integrated Provider List with Price Range Header */}
            <div className="bg-white rounded-lg shadow-sm border border-primary-light/20 p-4">
              {pricePerUnitData.length > 0 && (
                <div className="mb-6 pb-4 border-b border-primary-light/20">
                  <h2 className="text-lg font-medium text-accent mb-2">
                    {t('product.priceRange')}
                  </h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-accent">
                      ${minPricePerUnit.toFixed(2)} - ${maxPricePerUnit.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">{t('product.perUnit')}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {uniqueProviders.map((provider, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light/10 text-primary"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-lg font-medium text-accent mb-4">{t('product.availableFrom')}</h2>
              <div className="space-y-3">
                {displayedProviders.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-primary-light/20 hover:border-primary-light/50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {/* Shop Logo */}
                      <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg p-1 border border-primary-light/10">
                        <Image
                          src={item.shopImg}
                          alt={item.shop}
                          fill
                          className="object-contain"
                          sizes="48px"
                        />
                      </div>
                      {/* Shop Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-accent">{item.shop}</span>
                          {index === 0 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white shadow-sm">
                              {t('product.ourRecommendation')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} {t('product.units.unit', { count: item.quantity })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {/* Price Info */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-accent">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-primary-dark">
                          {t('product.pricePerUnit', {
                            price: item.pricePerUnit.toFixed(2),
                          })}
                        </div>
                      </div>
                      {/* Buy Button */}
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                      >
                        {t('actions.buy')}
                      </a>
                    </div>
                  </div>
                ))}

                {hasMoreProviders && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setShowAllProviders(!showAllProviders)}
                      className="text-sm font-medium text-primary hover:text-primary-dark focus:outline-none focus:underline transition-colors"
                    >
                      {showAllProviders ? t('product.showLess') : t('product.showMore')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Carousel */}
        {product && (
          <SimilarProductsCarousel
            title={t('product.similarProducts')}
            query={product.model?.category?.label || ''}
            productId={product.id}
            categorySlug={product.model?.category?.label?.toLowerCase().replace(/\s+/g, '-')}
            specs={product.ProductSpecs}
            perPage={10}
          />
        )}
      </div>
    </div>
  );
}
