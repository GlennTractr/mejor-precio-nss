'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'hero';
  size?: 'sm' | 'md' | 'lg';
  onSearchSubmit?: (query: string) => void;
}

export function SearchBar({
  className,
  placeholder = 'Buscar productos...',
  variant = 'default',
  size = 'md',
  onSearchSubmit,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as React.FormEvent);
    }
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: 'w-full',
          input: 'w-full pl-12 pr-14 py-3 bg-white/95 backdrop-blur-sm border-2 border-primary/20 rounded-full text-base placeholder:text-secondary/60 text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-lg',
          searchIcon: 'absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary/60',
          button: 'absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md',
          buttonIcon: 'h-4 w-4',
        };
      default:
        return {
          container: 'w-full',
          input: cn(
            'w-full pl-10 pr-12 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            size === 'sm' && 'py-1.5',
            size === 'md' && 'py-2',
            size === 'lg' && 'py-2.5'
          ),
          searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground',
          button: 'absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary',
          buttonIcon: 'h-4 w-4',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn(styles.container, className)}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className={styles.searchIcon} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder={placeholder}
          className={styles.input}
        />
        <Button
          type="submit"
          size="icon"
          variant={variant === 'hero' ? 'default' : 'ghost'}
          className={styles.button}
          aria-label="Buscar"
        >
          <Search className={styles.buttonIcon} />
        </Button>
      </form>
    </div>
  );
}