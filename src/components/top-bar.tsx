'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function TopBar() {
  const t = useTranslations('filters');

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-6">
        <div className="mr-8 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">MejorPrecio</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4 px-4">
          <div className="w-full max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search.placeholder')}
                className="pl-10 pr-4 h-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
