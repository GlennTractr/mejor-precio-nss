import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ReactQueryProvider } from '@/components/react-query-provider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';
import { env } from '@/lib/env';

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
  title: env().NEXT_PUBLIC_SITE_TITLE,
  description: 'Find the best prices for your favorite products',
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
            <MainNav />
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <main className="flex-1 py-6">
                <div className="container mx-auto px-4">{children}</div>
              </main>
            </ThemeProvider>
            <Footer />
          </NextIntlClientProvider>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
