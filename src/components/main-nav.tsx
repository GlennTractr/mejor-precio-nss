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
import { User2, Monitor, LogOut, Menu, Lock, LogIn, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SettingsModal } from '@/components/settings-modal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useQueryClient } from '@tanstack/react-query';
import { Logo } from '@/components/ui/logo';

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
  const [showSettings, setShowSettings] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations();

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
    <div className={cn(
      "sticky top-0 z-50 bg-white transition-shadow duration-200",
      hasScrolled && "shadow-md"
    )}>
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex items-center">
            {/* Burger Menu (Mobile) */}
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t('navigation.mobile.menu')}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* Logo */}
            <Logo 
              size="md"
              className="ml-2 md:ml-0"
            />

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
                      'flex items-center space-x-2 px-3 h-9 text-sm font-medium transition-colors hover:text-primary rounded-md',
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
                      'flex items-center space-x-2 px-3 h-9 text-sm font-medium transition-colors hover:text-primary rounded-md',
                      pathname === item.url ? 'text-primary' : 'text-muted-foreground'
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                readOnly
              />
            </div>
          </div>

          {/* Profile Menu or Sign In (moved to right side) */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 h-9 px-3 text-sm font-medium text-muted-foreground hover:text-primary"
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
              <Button variant="ghost" className="flex items-center space-x-2" asChild>
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>{t('actions.login')}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Logo 
                size="md"
              />
            </div>
            <nav className="flex-1 p-4" aria-label={t('navigation.mobile.menu')}>
              {items.map(item => (
                <Link
                  key={item.url}
                  href={item.url}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'flex items-center space-x-2 px-3 h-9 text-sm font-medium transition-colors hover:text-primary rounded-md mb-2',
                    pathname === item.url ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{t(item.titleKey)}</span>
                </Link>
              ))}
            </nav>
            <div className="border-t p-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-between h-9 px-3 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setShowSettings(true)}
                    >
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        <span>{t('navigation.settings')}</span>
                      </div>
                    </Button>
                  </div>
                  <Link
                    href="/change-password"
                    className="w-full flex items-center justify-between h-9 px-3 text-sm font-medium text-muted-foreground hover:text-primary mt-2"
                  >
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      <span>{t('navigation.changePassword')}</span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between h-9 px-3 text-sm font-medium text-muted-foreground hover:text-primary mt-2"
                    onClick={logout}
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>{t('navigation.logout')}</span>
                    </div>
                  </Button>
                </>
              ) : (
                <Button variant="ghost" className="w-full flex items-center" asChild>
                  <Link href="/auth/login">
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
