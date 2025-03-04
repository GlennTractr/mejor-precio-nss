'use client';

import { Input } from '@/components/ui/input';
import { Search, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { supabaseClient } from '@/lib/supabase/client';
import { Button } from './ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function TopBar() {
  const t = useTranslations('filters');
  const currentUser = useCurrentUser();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Update authentication state when currentUser changes
  useEffect(() => {
    setIsAuthenticated(!!currentUser.data);
  }, [currentUser.data, currentUser.status]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Invalidate and refetch currentUser query when auth state changes
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        setIsAuthenticated(!!session);
      }
    });

    // Initial auth check
    const checkInitialAuth = async () => {
      const { data } = await supabaseClient.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkInitialAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [queryClient]);

  const logout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        alert(error.message);
        return;
      }

      // Invalidate the currentUser query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setIsAuthenticated(false);
      router.refresh();
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-primary shadow-sm">
      <div className="container flex h-16 items-center px-6">
        <div className="mr-8 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-foreground">MejorPrecio</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4 px-4">
          <div className="w-full max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search.placeholder')}
                className="pl-10 pr-4 h-10 bg-white/90 border-primary-light focus:border-primary-dark focus:ring-primary-dark"
              />
            </div>
          </div>
        </div>
        {isAuthenticated ? (
          <Button variant="link" className="text-primary-foreground" onClick={logout}>
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        ) : (
          <Button variant="link" className="text-primary-foreground" asChild>
            <Link href="/auth/login">
              <LogIn className="mr-1 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
