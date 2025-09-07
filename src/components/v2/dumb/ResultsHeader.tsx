'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
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

  const itemsPerPageOptions = [20, 40, 60];

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
            <select
              value={currentSort || ''}
              onChange={e => onSortChange(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Items per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('itemsPerPage')}</span>
          <select
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ResultsHeader = memo(ResultsHeaderComponent);
ResultsHeader.displayName = 'ResultsHeader';
