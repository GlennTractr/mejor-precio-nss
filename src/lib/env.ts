import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_BASE_KEY: z.string().min(1),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('es'),
  NEXT_PUBLIC_ACCEPTED_LOCALES: z.string().default('es,en,fr'),
  NEXT_PUBLIC_SITE_TITLE: z.string().default('PapásListos'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().default(''),
});

let cached: z.infer<typeof EnvSchema> | null = null;

export const reloadEnv = () => {
  cached = null;
};

export const env = () => {
  if (!cached) {
    const raw = { ...process.env } as Record<string, string | undefined>;
    if (!raw.NEXT_PUBLIC_SUPABASE_BASE_KEY && raw.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      raw.NEXT_PUBLIC_SUPABASE_BASE_KEY = raw.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }
    cached = EnvSchema.parse(raw);
  }
  return cached;
};

export const getAcceptedLocales = (): string[] => {
  return env()
    .NEXT_PUBLIC_ACCEPTED_LOCALES.split(',')
    .map(locale => locale.trim());
};
