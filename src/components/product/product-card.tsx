'use client';

import { useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabaseClient from '@/lib/supabase-client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Bell } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('filters.products');
  const tActions = useTranslations('actions');
  const tAuth = useTranslations('auth');
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isNotified, setIsNotified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (product.main_image_bucket && product.main_image_path) {
      const { data } = supabaseClient.storage
        .from(product.main_image_bucket)
        .getPublicUrl(product.main_image_path);
      setImageUrl(data.publicUrl);
    }
  }, [product.main_image_bucket, product.main_image_path]);

  useEffect(() => {
    async function checkNotifyStatus() {
      if (!currentUser.data?.id) return;

      const { data } = await supabaseClient
        .from('product_favory')
        .select('id')
        .eq('product', product.id)
        .eq('owner', currentUser.data.id)
        .maybeSingle();

      setIsNotified(!!data);
    }

    checkNotifyStatus();
  }, [currentUser.data?.id, product.id]);

  const toggleNotify = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link navigation

    if (!currentUser.data?.id) {
      // Clear any existing pending favorites first
      localStorage.removeItem('pendingFavorite');

      // Store the product ID to add to favorites after login
      localStorage.setItem('pendingFavorite', product.id);

      // Store the current URL to redirect back after login
      const currentUrl = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentUrl);

      // Redirect to login page with next parameter
      router.push(`/auth/login?next=${encodeURIComponent('/process-favorite')}`);
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <Link
      href={`/producto/${product.product_slug}`}
      className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/20 rounded-xl motion-reduce:transition-none motion-reduce:hover:transform-none"
    >
      <Card className="border-secondary-light hover:border-secondary/40 transition-colors h-[320px] flex flex-col relative bg-white/40 hover:bg-transparent">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleNotify}
                disabled={isLoading}
                className={cn(
                  'absolute top-2 right-2 z-10 p-2 rounded-full transition-colors',
                  isNotified
                    ? 'text-primary-light bg-primary-light/50 hover:bg-primary-light/10'
                    : 'text-gray-400 hover:text-red-500 hover:bg-primary-light/50'
                )}
              >
                <Bell
                  className="h-5 w-5 text-primary"
                  fill={isNotified ? 'currentColor' : 'none'}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-secondary bg-white border border-secondary/40">
              {currentUser.data
                ? isNotified
                  ? tActions('notify.remove')
                  : tActions('notify.add')
                : tAuth('loginToFavorite')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="relative w-full h-36">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={80}
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-primary-light/5 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary-light/20" />
            </div>
          )}
        </div>
        <CardHeader className="flex-grow space-y-1 py-2 px-4 overflow-visible">
          <CardTitle className="text-sm font-medium text-accent line-clamp-2 leading-tight">
            <b>{product.title}</b>
          </CardTitle>
          <CardDescription className="text-sm line-clamp-1 overflow-visible">
            <span className="highlight-primary">{product.brand}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="py-1 px-4">
          <p className="text-base font-semibold text-accent">
            {t('fromPrice', {
              price: product.best_price_per_unit.toFixed(2),
            })}
            <small className="text-muted-foreground ml-2">
              ({product.quantity_type ? product.quantity_type : t('perUnit')})
            </small>
          </p>
        </CardContent>
        <CardFooter className="pt-0 pb-2 px-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.shop_names.length < 3
              ? t('availableAt', { shops: product.shop_names.join(', ') })
              : t('availableAtLength', { length: product.shop_names.length })}
          </p>
          <Button variant="outline-secondary" size="sm" className="w-full">
            <b>{tActions('seeOffers')}</b>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
