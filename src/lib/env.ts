const envRef = {
  current: {
    NEXT_PUBLIC_SUPABASE_URL: '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    NEXT_PUBLIC_SUPABASE_BASE_KEY: '',
    NEXT_PUBLIC_DEFAULT_LOCALE: '',
    NEXT_PUBLIC_ACCEPTED_LOCALES: '',
    NEXT_PUBLIC_SITE_TITLE: '',
    NEXT_PUBLIC_GA_MEASUREMENT_ID: '',
  },
};

export const reloadEnv = () => {
  envRef.current = {
    NEXT_PUBLIC_SUPABASE_URL: String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    NEXT_PUBLIC_SUPABASE_BASE_KEY: String(
      process.env.NEXT_PUBLIC_SUPABASE_BASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    NEXT_PUBLIC_DEFAULT_LOCALE: String(process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'es'),
    NEXT_PUBLIC_ACCEPTED_LOCALES: String(process.env.NEXT_PUBLIC_ACCEPTED_LOCALES || 'es,en,fr'),
    NEXT_PUBLIC_SITE_TITLE: String(process.env.NEXT_PUBLIC_SITE_TITLE || 'PapásListos'),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: String(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''),
  };
};

reloadEnv();

export const env = () => envRef.current;

// Helper function to get accepted locales as an array
export const getAcceptedLocales = (): string[] => {
  return env()
    .NEXT_PUBLIC_ACCEPTED_LOCALES.split(',')
    .map(locale => locale.trim());
};
