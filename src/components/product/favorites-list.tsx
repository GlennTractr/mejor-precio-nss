'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCurrentUser } from '@/hooks/use-current-user';
import supabaseClient from '@/lib/supabase-client';
import { Product } from '@/types/product';
import { ProductCard } from './product-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ChevronRight, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function FavoritesList() {
  const tHome = useTranslations('home');
  const currentUser = useCurrentUser();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchFavorites() {
      if (!currentUser.data?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // First get the favorite product IDs
        const { data: favorites, error: favoritesError } = await supabaseClient
          .from('product_favory')
          .select('product')
          .eq('owner', currentUser.data.id)
          .limit(10);

        if (favoritesError) throw favoritesError;
        if (!favorites || favorites.length === 0) {
          setFavoriteProducts([]);
          setIsLoading(false);
          return;
        }

        // Get the product details for each favorite
        const productIds = favorites.map(fav => fav.product);

        // Fetch products from the database
        const { data: products, error: productsError } = await supabaseClient
          .from('product_view')
          .select('*')
          .in('id', productIds);

        if (productsError) throw productsError;
        if (!products || products.length === 0) {
          setFavoriteProducts([]);
          setIsLoading(false);
          return;
        }

        // Transform the data to match the Product type
        const transformedProducts: Product[] = products
          .filter(
            product =>
              product.id &&
              product.title &&
              product.product_slug &&
              product.best_price_per_unit !== null &&
              product.max_price_per_unit !== null
          )
          .map(product => ({
            id: product.id!,
            title: product.title!,
            brand: product.brand || '',
            model: product.model || '',
            category: product.category || '',
            category_slug: product.category_slug || '',
            best_price_per_unit: product.best_price_per_unit!,
            max_price_per_unit: product.max_price_per_unit!,
            shop_names: Array.isArray(product.shop_names) ? product.shop_names : [],
            price_list: Array.isArray(product.price_list) ? product.price_list : [],
            product_slug: product.product_slug!,
            main_image_bucket: product.main_image_bucket || '',
            main_image_path: product.main_image_path || '',
          }));

        setFavoriteProducts(transformedProducts);
        // Auto-open if we have favorites
        if (transformedProducts.length > 0) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavorites();
  }, [currentUser.data?.id]);

  if (!currentUser.data) {
    return null; // Don't show anything if user is not logged in
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-8 border border-primary-light/20 rounded-lg p-4 bg-white/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
          <h2 className="text-xl font-bold text-accent">{tHome('favorites')}</h2>
          {!isLoading && favoriteProducts.length > 0 && (
            <span className="text-sm text-muted-foreground">({favoriteProducts.length})</span>
          )}
        </div>
        <CollapsibleTrigger asChild>
          <button className="rounded-full p-1 hover:bg-primary-light/10">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-primary" />
            ) : (
              <ChevronRight className="h-5 w-5 text-primary" />
            )}
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="mt-4">
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="animate-pulse h-[320px] min-w-[220px] flex-shrink-0">
                <CardContent className="p-0">
                  <div className="h-36 bg-primary-light/10"></div>
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-5 w-1/3 mt-4" />
                    <Skeleton className="h-3 w-2/3 mt-2" />
                    <Skeleton className="h-8 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-8 bg-primary-light/5 rounded-lg border border-primary-light/20">
            <Heart className="h-12 w-12 text-primary-light/40 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">{tHome('noFavorites')}</p>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-4 py-2">
              {favoriteProducts.map(product => (
                <div key={product.id} className="min-w-[220px] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
