'use client';

import { useQuery } from '@tanstack/react-query';
import createClient from '@/lib/supabase/client';

export interface Category {
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

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
}
