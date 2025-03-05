import { useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('filters.products');
  const tActions = useTranslations('actions');
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
        .single();

      setIsNotified(!!data);
    }

    checkNotifyStatus();
  }, [currentUser.data?.id, product.id]);

  const toggleNotify = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link navigation
    if (!currentUser.data?.id) return;

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
      className="block transition-transform hover:scale-105"
    >
      <Card className="border-primary-light/20 hover:border-primary-light transition-colors h-[320px] flex flex-col relative">
        {currentUser.data && (
          <button
            onClick={toggleNotify}
            disabled={isLoading}
            className={cn(
              'absolute top-2 right-2 z-10 p-2 rounded-full transition-colors',
              isNotified ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'
            )}
          >
            <Bell className="h-5 w-5" />
          </button>
        )}
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
        <CardHeader className="flex-grow space-y-1 py-2 px-4">
          <CardTitle className="text-sm font-medium text-accent line-clamp-2 leading-tight">
            {product.title}
          </CardTitle>
          <CardDescription className="text-xs text-primary line-clamp-1">
            {product.brand}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-1 px-4">
          <p className="text-base font-semibold text-accent">
            {t('rangePrice', {
              min: product.best_price_per_unit.toFixed(2),
              max: product.max_price_per_unit.toFixed(2),
            })}
          </p>
        </CardContent>
        <CardFooter className="pt-0 pb-2 px-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground line-clamp-1">
            {t('availableAt', { shops: product.shop_names.join(', ') })}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-primary-light/5 hover:bg-primary-light/10 border-primary-light/20 text-primary hover:text-primary-dark"
          >
            {tActions('seeOffers')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
