'use client';

import { useQuery } from '@tanstack/react-query';
import createClient from '@/lib/supabase/client';
import { useCountry } from './use-country';

export interface Category {
  id: string;
  label: string;
  slug?: string;
  image_url?: string;
}

async function getCategories(countryId: string): Promise<Category[]> {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from('ProductCategory')
    .select('*')
    .eq('country', countryId)
    .order('label');

  console.log('categories', countryId, categories);

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
  const { data: country, isLoading: countryLoading } = useCountry();

  return useQuery({
    queryKey: ['categories', country?.id],
    queryFn: () => {
      if (!country?.id) {
        throw new Error('Country not available');
      }
      return getCategories(country.id);
    },
    enabled: !!country?.id && !countryLoading,
  });
}
