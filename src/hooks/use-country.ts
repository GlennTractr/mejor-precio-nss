'use client';

import { useQuery } from '@tanstack/react-query';
import createClient from '@/lib/supabase/client';
import { env } from '@/lib/env';

export interface Country {
  id: string;
  label: string;
  language: string;
}

async function getCountryByCode(countryCode: string): Promise<Country> {
  const supabase = createClient();

  const { data: country, error } = await supabase
    .from('Country')
    .select('id, label, language')
    .eq('label', countryCode)
    .single();

  if (error) {
    throw new Error(`Country with code "${countryCode}" not found: ${error.message}`);
  }

  if (!country) {
    throw new Error(`Country with code "${countryCode}" not found`);
  }

  return {
    id: country.id,
    label: country.label,
    language: country.language,
  };
}

export function useCountry() {
  const countryCode = env().NEXT_PUBLIC_COUNTRY_CODE;

  return useQuery({
    queryKey: ['country', countryCode],
    queryFn: () => getCountryByCode(countryCode),
    staleTime: Infinity, // Country data rarely changes
    gcTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
