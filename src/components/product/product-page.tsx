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
import { notFound, useRouter } from 'next/navigation';
import { SimilarProductsCarousel } from './similar-products-carousel';
import { ProductVariants } from './product-variants';
import { Button } from '../ui/button';
import { PriceComparisonModal } from './price-comparison-modal';

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
    slug: string;
    quantity_type?: {
      label: string;
      unit_label: string;
    };
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
      <div className="container mx-auto py-4 px-4 md:py-8 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Left column - Image skeleton */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden hover:border hover:border-secondary/50">
            <div className="absolute inset-0 flex items-center justify-center bg-primary-light/5">
              <div className="w-16 h-16 rounded-full bg-primary-light/20" />
            </div>
          </div>

          {/* Right column - Product details skeleton */}
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-80" />
                {/* Notification bell button skeleton */}
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>

            {/* Compare prices title skeleton */}
            <Skeleton className="h-6 w-32 highlight-secondary" />

            {/* Price comparison table skeleton */}
            <table className="w-full border-collapse table-fixed">
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr
                    key={i}
                    className="border border-secondary/20 hover:border-secondary/50 hover:scale-[1.02] transition-all duration-200 ease-in-out shadow-sm hover:shadow-md text-white mb-1 block"
                    style={{ marginBottom: '4px' }}
                  >
                    <td className="w-1/3 py-1 px-2 inline-block align-middle">
                      <div className="flex items-center gap-4 h-16">
                        {/* Shop Logo - bigger height */}
                        <Skeleton className="relative w-16 h-20 flex-shrink-0 rounded-lg" />
                        {/* Shop Info */}
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </td>

                    <td className="w-1/4 py-1 px-2 inline-block align-middle">
                      <div className="flex flex-col items-center gap-1 h-16 justify-center">
                        <Skeleton className="h-4 w-16" />
                        {i === 1 && <Skeleton className="h-5 w-24 rounded-full" />}
                      </div>
                    </td>

                    <td className="w-1/4 py-1 px-2 inline-block align-middle">
                      <div className="flex items-center justify-center h-16">
                        <div className="text-right space-y-1">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>

                    <td className="w-1/6 py-1 px-2 inline-block align-middle">
                      <div className="flex items-center justify-center h-16">
                        <Skeleton className="h-8 w-full rounded-md" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Show more/less button skeleton */}
            <div className="flex justify-center pt-2">
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>

        {/* Similar Products Carousel skeleton */}
        <div className="mt-12">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex-shrink-0 w-64">
                <div className="animate-pulse h-[320px] flex flex-col border rounded-lg border-primary-light/20">
                  <div className="relative w-full h-36 bg-primary-light/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary-light/30" />
                    </div>
                  </div>
                  <div className="flex-grow space-y-1 py-2 px-4">
                    <div className="h-3 bg-primary-light/20 rounded w-3/4"></div>
                    <div className="h-3 bg-primary-light/20 rounded w-1/2 mt-1"></div>
                  </div>
                  <div className="py-1 px-4">
                    <div className="h-4 bg-primary-light/20 rounded w-1/3"></div>
                  </div>
                  <div className="pt-0 pb-2 px-4">
                    <div className="h-3 bg-primary-light/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
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
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
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
                label,
                slug,
                quantity_type (
                  label,
                  unit_label
                )
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

        // Track product view in Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          const priceData =
            product.ProductPackaging?.flatMap(
              pkg =>
                pkg.ProductSellContext?.map(ctx => ({
                  pricePerUnit: ctx.price / pkg.quantity,
                  shop: ctx.Shop?.label || 'Unknown',
                })) || []
            ) || [];

          const bestPriceData = priceData.reduce(
            (best, current) => (current.pricePerUnit < best.pricePerUnit ? current : best),
            priceData[0] || { pricePerUnit: 0, shop: 'Unknown' }
          );

          window.gtag('event', 'view_item', {
            currency: 'MXN',
            value: bestPriceData.pricePerUnit || 0,
            items: [
              {
                item_id: product.id,
                item_name: product.title,
                item_category: product.model?.category?.label || 'Unknown',
                item_brand: product.model?.brand?.label || 'Unknown',
                price: bestPriceData.pricePerUnit || 0,
                quantity: 1,
                affiliation: bestPriceData.shop, // Best price shop
              },
            ],
          });
        }

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
  if (error) return notFound();
  if (!product) return notFound();

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

  // Limit displayed providers based on state
  const displayedProviders = showAllProviders ? sortedPricePerUnit : sortedPricePerUnit.slice(0, 5);
  const hasMoreProviders = sortedPricePerUnit.length > 5;

  return (
    <div>
      <div className="container mx-auto py-4 px-4 md:py-8 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Left column - Image */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden hover:border hover:border-secondary/50">
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
          <div className="space-y-4 md:space-y-6">
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
            </div>

            {/* Product Variants */}
            {product && (
              <ProductVariants
                productId={product.id}
                categorySlug={product.model?.category?.slug || ''}
                brand={product.model?.brand?.label || ''}
                model={product.model?.label || ''}
                currentSpecs={product.ProductSpecs}
                currentProduct={{
                  title: product.title,
                  imageUrl: imageUrl || '',
                  productSlug: productSlug,
                }}
              />
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-accent highlight-secondary">
                {t('product.comparePrices')}
              </h2>
              <Button
                variant="link-secondary"
                size="sm"
                onClick={() => setIsCompareModalOpen(true)}
                className="text-xs"
              >
                {t('product.compare')}
              </Button>
            </div>
            <table className="w-full border-collapse">
              <tbody>
                {displayedProviders.map((item, index) => (
                  <tr
                    key={index}
                    className="border border-secondary/20 hover:border-secondary/50 hover:scale-[1.02] transition-all duration-200 ease-in-out shadow-sm hover:shadow-md text-white mb-1 block"
                    style={{ marginBottom: '4px' }}
                  >
                    {/* Shop Logo Cell */}
                    <td className="w-[60px] sm:w-1/4 py-2 px-2 sm:py-1 sm:px-2 inline-block align-middle">
                      <div className="flex items-center justify-center h-12 sm:h-16">
                        <div className="relative w-12 h-16 sm:w-16 sm:h-20 flex-shrink-0 rounded-lg p-1">
                          <Image
                            src={item.shopImg}
                            alt={item.shop}
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Quantity Cell */}
                    <td className="w-[90px] sm:w-1/4 py-2 px-1 sm:py-1 sm:px-2 inline-block align-middle">
                      <div className="flex flex-col items-center gap-1 h-12 sm:h-16 justify-center">
                        <span className="font-bold text-accent text-xs sm:text-sm text-center">
                          {item.quantity} {product.model?.category?.quantity_type?.label || 'unidades'}
                        </span>
                        {index === 0 && (
                          <div className="bg-primary text-secondary text-[10px] sm:text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
                            {t('product.ourRecommendation')}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Price Cell */}
                    <td className="w-[100px] sm:w-1/4 py-2 px-1 sm:py-1 sm:px-2 inline-block align-middle">
                      <div className="flex items-center justify-center h-12 sm:h-16">
                        <div className="text-center">
                          <div className="text-sm sm:text-lg font-bold text-accent">
                            ${item.price.toFixed(2)}
                          </div>
                          <div className="text-[10px] sm:text-xs text-primary-dark">
                            ${item.pricePerUnit.toFixed(2)}{' '}
                            {product.model?.category?.quantity_type?.unit_label || 'por unidad'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Buy Button Cell */}
                    <td className="w-[calc(100%-250px)] sm:w-1/4 py-2 px-1 sm:py-1 sm:px-2 inline-block align-middle">
                      <div className="flex items-center justify-center h-12 sm:h-16">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="w-full text-xs sm:text-sm px-2 sm:px-3"
                          onClick={() => {
                            // Track purchase intent
                            if (typeof window !== 'undefined' && window.gtag) {
                              window.gtag('event', 'purchase_intent', {
                                currency: 'MXN',
                                value: item.price,
                                items: [
                                  {
                                    item_id: product.id,
                                    item_name: product.title,
                                    item_category: product.model?.category?.label || 'Unknown',
                                    item_brand: product.model?.brand?.label || 'Unknown',
                                    price: item.price,
                                    quantity: 1,
                                    affiliation: item.shop, // Shop name
                                  },
                                ],
                              });
                            }
                            window.open(item.link, '_blank');
                          }}
                        >
                          {t('actions.buy')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {hasMoreProviders && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost-secondary"
                  onClick={() => setShowAllProviders(!showAllProviders)}
                  className="text-sm font-medium hover:font-bold hover:underline focus:outline-none focus:underline transition-colors"
                >
                  {showAllProviders ? t('product.showLess') : t('product.showMore')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Carousel */}
        {product && (
          <SimilarProductsCarousel
            title={t('product.similarProducts')}
            query={product.model?.category?.label || ''}
            productId={product.id}
            categorySlug={product.model?.category?.slug}
            specs={product.ProductSpecs}
            perPage={10}
          />
        )}

        {/* Price Comparison Modal */}
        {product && sortedPricePerUnit.length > 0 && (
          <PriceComparisonModal
            isOpen={isCompareModalOpen}
            onOpenChange={setIsCompareModalOpen}
            bestPricePerUnit={sortedPricePerUnit[0].pricePerUnit}
            quantityType={product.ProductPackaging?.[0]?.type || ''}
            productTitle={product.title}
            bestOfferLink={sortedPricePerUnit[0].link}
            bestOfferShop={sortedPricePerUnit[0].shop}
          />
        )}
      </div>
    </div>
  );
}
