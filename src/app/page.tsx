'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const t = useTranslations('home');

  // Define a static list of categories
  const categories = ['Technology', 'Health', 'Finance', 'Education', 'Entertainment'];

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col gap-1">
        <h1 className="relative text-3xl font-bold tracking-tighter sm:text-4xl">
          <span className={userLoading ? 'opacity-0' : 'opacity-100'}>
            {t('welcome', {
              email: currentUser?.email || 'john.doe@example.com',
            })}
          </span>
          {userLoading && <Skeleton className="absolute inset-0" />}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      {/* New section for category cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <Link key={category} href={`/products/${category.toLowerCase()}`}>
            <Card className="hover:bg-gray-100">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{category}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
