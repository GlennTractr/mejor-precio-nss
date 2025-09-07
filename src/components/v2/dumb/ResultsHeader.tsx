'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ResultsHeaderProps } from '../types';

function ResultsHeaderComponent({
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  sortOptions,
  currentSort,
  onSortChange,
  className,
}: ResultsHeaderProps) {
  const t = useTranslations('category');

  const itemsPerPageOptions = [10, 20, 50];

  return (
    <div className={cn('flex justify-between items-center', className)}>
      {/* Results count */}
      <div className="text-sm text-muted-foreground">{t('results', { count: totalItems })}</div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Sort options (if provided) */}
        {sortOptions && sortOptions.length > 0 && onSortChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('sortBy')}</span>
            <Select
              value={currentSort || ''}
              onValueChange={onSortChange}
            >
              <SelectTrigger className="w-[160px] border-secondary-200 focus:ring-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Items per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('itemsPerPage')}</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={value => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[100px] border-secondary-200 focus:ring-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map(option => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ResultsHeader = memo(ResultsHeaderComponent);
ResultsHeader.displayName = 'ResultsHeader';
