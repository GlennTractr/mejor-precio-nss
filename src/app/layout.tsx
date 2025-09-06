import { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { MainNav } from '@/components/main-nav';
import { Toaster } from '@/components/ui/toaster';
import { ReactQueryProvider } from '@/components/react-query-provider';
import { GoogleAnalyticsScript } from '@/components/google-analytics';
import localFont from 'next/font/local';
import { Footer } from '@/components/footer';
import { env } from '@/lib/env';
import './globals.css';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  metadataBase: new URL(env().NEXT_PUBLIC_SITE_URL),
  title: {
    default: env().NEXT_PUBLIC_SITE_TITLE,
    template: `%s | ${env().NEXT_PUBLIC_SITE_TITLE}`,
  },
  description: 'Encuentra los mejores precios para tus productos favoritos',
  openGraph: {
    type: 'website',
    siteName: env().NEXT_PUBLIC_SITE_TITLE,
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-layout-background`}
      >
        <ReactQueryProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <MainNav />
              <main>
                <div>{children}</div>
              </main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </ReactQueryProvider>
        <GoogleAnalyticsScript gaId={env().NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
