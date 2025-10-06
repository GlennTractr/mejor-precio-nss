'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import supabaseClient from '@/lib/supabase-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User2, LogOut, Menu, Lock, LogIn, Search, Grid3X3, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SettingsModal } from '@/components/settings-modal';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { useQueryClient } from '@tanstack/react-query';
import { Logo } from '@/components/ui/logo';
import { useCategories } from '@/hooks/use-categories';
import { SheetClose } from '@/components/ui/sheet';
import { X } from 'lucide-react';

const items: {
  titleKey: string;
  url: string;
  icon: React.ElementType;
  external: boolean;
}[] = [
  // {
  //   titleKey: 'navigation.home',
  //   url: '/',
  //   icon: LayoutDashboard,
  //   external: false,
  // },
];

export function MainNav() {
  const currentUser = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const t = useTranslations();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Update authentication state when currentUser changes
  useEffect(() => {
    setIsAuthenticated(!!currentUser.data);
  }, [currentUser.data, currentUser.status]);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHasScrolled(scrollTop > 0);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // Handle search functionality
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // Close categories sheet if search is performed from there
      setOpenCategories(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as React.FormEvent);
    }
  };

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

      // Force reload the page to reset all application state
      window.location.reload();
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };

  return (
    <div
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        hasScrolled && 'shadow-md'
      )}
    >
      <Sheet open={openCategories} onOpenChange={setOpenCategories}>
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex items-center">
            {/* Burger Menu Button - works for both mobile and desktop */}
            <SheetTrigger asChild>
              <Button
                variant="ghost-secondary"
                size="icon"
                className="flex items-center justify-center"
                aria-label="Categorías"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* Logo */}
            <Logo size="lg" className="ml-2" />

            {/* Main Menu (Desktop only) */}
            <nav
              className="hidden md:flex items-center ml-6 space-x-2"
              aria-label={t('navigation.mainMenu')}
            >
              {items.map(item =>
                item.external ? (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center space-x-2 px-3 h-9 text-sm font-medium transition-colors hover:text-secondary rounded-md',
                      'text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{t(item.titleKey)}</span>
                  </a>
                ) : (
                  <Link
                    key={item.url}
                    href={item.url}
                    className={cn(
                      'flex items-center space-x-2 px-3 h-9 text-sm font-medium transition-colors hover:text-secondary rounded-md',
                      pathname === item.url ? 'text-secondary' : 'text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{t(item.titleKey)}</span>
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Search Bar (centered middle) */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-12 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Profile Menu or Sign In (moved to right side) */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost-secondary"
                    className="flex items-center space-x-2 h-9 px-3 text-sm font-medium"
                  >
                    <User2 className="h-4 w-4" />
                    <span>{currentUser?.data?.email || t('navigation.profile')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/change-password">
                      <Lock className="mr-2 h-4 w-4" />
                      <span>{t('navigation.changePassword')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('navigation.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost-secondary" className="flex items-center space-x-2" asChild>
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>{t('actions.login')}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Categories Sheet - unified for both mobile and desktop */}
        <SheetContent
          side="left"
          className="w-full md:w-[320px] p-0 bg-secondary border-0 [&>button:first-child]:hidden"
        >
          {/* Custom close button with white text */}
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-white hover:text-white z-10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b border-secondary-foreground/10">
              <SheetTitle className="flex items-center space-x-2 text-lg font-semibold text-primary">
                <Grid3X3 className="h-5 w-5 text-primary" />
                <span>Categorías</span>
              </SheetTitle>
            </SheetHeader>
            
            {/* Search Bar in Sheet */}
            <div className="p-4 border-b border-secondary-foreground/10">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-12 py-2 bg-white/80 border border-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-secondary placeholder:text-secondary/60"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-secondary/60 hover:text-secondary"
                  aria-label="Buscar"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      setOpenCategories(false);
                    }
                  }}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <nav className="flex-1 p-4" aria-label="Categorías">
              {categoriesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-9 bg-primary/10 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {categories?.map(category => (
                    category.coming_soon ? (
                      <div
                        key={category.id}
                        className="flex items-center justify-between px-3 h-9 text-sm font-medium rounded-md opacity-60 cursor-not-allowed"
                        aria-disabled="true"
                      >
                        <span className="text-primary/60">{category.label}</span>
                        <span className="text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
                          {t('category.comingSoon')}
                        </span>
                      </div>
                    ) : (
                      <Link
                        key={category.id}
                        href={`/categoria/${category.slug}`}
                        className="flex items-center justify-between px-3 h-9 text-sm font-medium transition-colors hover:text-primary hover:bg-primary/10 rounded-md"
                        onClick={() => setOpenCategories(false)}
                      >
                        <span className="text-primary/80">{category.label}</span>
                        <ChevronRight className="h-4 w-4 text-primary/60" />
                      </Link>
                    )
                  ))}
                </div>
              )}
            </nav>

            {/* Login/Logout Section */}
            <div className="border-t border-primary/20 p-4">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center border-primary/30 text-primary hover:bg-primary hover:text-secondary"
                  onClick={() => {
                    logout();
                    setOpenCategories(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>{t('navigation.logout')}</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center border-primary/30 text-primary hover:bg-primary hover:text-secondary"
                  asChild
                >
                  <Link href="/auth/login" onClick={() => setOpenCategories(false)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    <span>{t('actions.login')}</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
}
