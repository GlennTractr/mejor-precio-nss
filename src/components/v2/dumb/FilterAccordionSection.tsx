import { memo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { FilterAccordionSectionProps } from '../types';
import { FilterItem } from '../types/filters';

function FilterAccordionSectionComponent({
  title,
  items,
  selectedItems,
  onToggle,
  maxHeight = 240, // 60 * 4 = 240px default
  sortBy = 'count',
  variant = 'primary',
  className,
}: FilterAccordionSectionProps) {
  // Sort items based on sortBy prop
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'count') {
      return b.count - a.count;
    } else if (sortBy === 'alphabetical') {
      return a.value.localeCompare(b.value);
    }
    return 0;
  });

  // Don't render if no items
  if (items.length === 0) {
    return null;
  }

  // Define variant-specific styles
  const getVariantStyles = () => {
    if (variant === 'secondary') {
      return {
        trigger: 'text-sm font-medium flex bg-gray-50/50',
        title: 'highlight-secondary hover:bg-transparent text-gray-700',
        badge: 'ml-2 text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full',
        content: 'text-gray-600',
      };
    }
    // Primary variant (default)
    return {
      trigger: 'text-sm font-medium flex bg-white/50',
      title: 'highlight-primary hover:bg-transparent',
      badge: 'ml-2 text-xs text-secondary px-2 py-1',
      content: '',
    };
  };

  const styles = getVariantStyles();

  return (
    <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')} className={className}>
      <AccordionTrigger className={cn(styles.trigger, 'hover:no-underline')}>
        <div className="flex-0">
          <div className={styles.title}>{title}</div>
          {selectedItems.length > 0 && (
            <span
              className={cn(styles.badge, 'hover:no-underline')}
              style={{ textDecoration: 'none' }}
            >
              ({selectedItems.length})
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div
          className={cn('space-y-2 overflow-y-auto', styles.content)}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {sortedItems.map((item: FilterItem) => (
            <div key={item.value} className="flex items-center gap-2">
              <Checkbox
                id={`filter-${title}-${item.value}`}
                checked={selectedItems.includes(item.value)}
                onCheckedChange={() => onToggle(item.value)}
                disabled={item.disabled || item.count === 0}
              />
              <label
                htmlFor={`filter-${title}-${item.value}`}
                className={cn(
                  'text-sm flex-1 cursor-pointer',
                  variant === 'secondary' ? 'text-gray-600' : '',
                  (item.disabled || item.count === 0) && 'text-gray-400 cursor-not-allowed'
                )}
              >
                {item.value} ({item.count})
              </label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const FilterAccordionSection = memo(FilterAccordionSectionComponent);
FilterAccordionSection.displayName = 'FilterAccordionSection';
