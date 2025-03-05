import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { LANGUAGE_COOKIE } from '@/lib/cookies';
import { env, getAcceptedLocales } from '@/lib/env';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const defaultLocale = env().NEXT_PUBLIC_DEFAULT_LOCALE || 'es';
  const acceptedLocales = getAcceptedLocales();
  console.log('defaultLocale', defaultLocale);
  console.log('acceptedLocales', acceptedLocales);

  // First check cookie, then accept-language header
  let locale =
    cookieStore.get(LANGUAGE_COOKIE)?.value || acceptLanguage?.split('-')[0] || defaultLocale;

  // Ensure the locale is in the accepted locales list
  if (!acceptedLocales.includes(locale)) {
    locale = defaultLocale;
  }

  const localePath = path.join(process.cwd(), `src/i18n/messages/${locale}.json`);
  if (
    !(await fs
      .access(localePath)
      .then(() => true)
      .catch(() => false))
  ) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
