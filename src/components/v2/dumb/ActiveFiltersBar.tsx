'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { ActiveFiltersBarProps } from '../types';

function ActiveFiltersBarComponent({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  formatters,
  className,
}: ActiveFiltersBarProps) {
  const t = useTranslations('category');

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2 items-center', className)}>
      <span className="text-sm font-medium">{t('activeFilters')}:</span>

      {activeFilters.map(filter => (
        <Badge key={filter.id} variant="secondary" className="flex items-center gap-1 max-w-xs">
          <span className="truncate">
            {formatters.filterLabel
              ? formatters.filterLabel(filter.type, filter.displayValue)
              : `${filter.label}: ${filter.displayValue}`}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 ml-1 hover:bg-destructive/10"
            onClick={() => onRemoveFilter(filter.id)}
            aria-label={t('removeFilter')}
          >
            <Cross2Icon className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      <Button
        variant="link"
        size="sm"
        className="text-primary font-medium h-auto p-0"
        onClick={onClearAll}
      >
        {t('clearAll')}
      </Button>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ActiveFiltersBar = memo(ActiveFiltersBarComponent);
ActiveFiltersBar.displayName = 'ActiveFiltersBar';
