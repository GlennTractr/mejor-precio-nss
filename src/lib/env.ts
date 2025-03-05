const envRef = {
  current: {
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    SUPABASE_BASE_KEY: '',
    NEXT_PUBLIC_DEFAULT_LOCALE: '',
    NEXT_PUBLIC_ACCEPTED_LOCALES: '',
    NEXT_PUBLIC_SITE_TITLE: '',
  },
};

export const reloadEnv = () => {
  envRef.current = {
    SUPABASE_URL: String(process.env.SUPABASE_URL),
    SUPABASE_ANON_KEY: String(process.env.SUPABASE_ANON_KEY),
    SUPABASE_BASE_KEY: String(process.env.SUPABASE_BASE_KEY || process.env.SUPABASE_ANON_KEY),
    NEXT_PUBLIC_DEFAULT_LOCALE: String(process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'es'),
    NEXT_PUBLIC_ACCEPTED_LOCALES: String(process.env.NEXT_PUBLIC_ACCEPTED_LOCALES || 'es,en,fr'),
    NEXT_PUBLIC_SITE_TITLE: String(process.env.NEXT_PUBLIC_SITE_TITLE || 'PapásListos'),
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
