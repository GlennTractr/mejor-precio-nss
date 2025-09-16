'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import createClient from '@/lib/supabase/client';

interface Category {
  id: string;
  label: string;
  slug?: string;
  image_url?: string;
}

async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from('ProductCategory')
    .select('*')
    .order('label');

  if (error) {
    throw error;
  }

  return await Promise.all(
    categories.map(
      async category =>
        ({
          id: category.id,
          label: category.label,
          slug: category.slug,
          image_url:
            category.image_bucket && category.image_path
              ? await supabase.storage.from(category.image_bucket).getPublicUrl(category.image_path)
                  ?.data?.publicUrl
              : undefined,
        }) as Category
    )
  );
}

function CategorySkeleton() {
  return (
    <Card variant="interactive" className="w-[180px] h-[180px] flex-shrink-0">
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[120px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function CategoryCarousel() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-2">
      {categories?.map(category => (
        <Link
          key={category.id}
          href={`/categoria/${category.slug}`}
          className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light/20 rounded-xl motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <Card variant="interactive" className="w-[180px] h-[180px] flex-shrink-0">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-md text-center font-medium truncate text-secondary">
                <b>{category.label}</b>
              </h3>
              <div className="relative h-[120px] w-full">
                <Image
                  src={category.image_url || '/images/placeholder.jpg'}
                  alt={category.label}
                  fill
                  className="object-cover rounded-lg"
                  sizes="180px"
                  priority={false}
                  quality={80}
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
