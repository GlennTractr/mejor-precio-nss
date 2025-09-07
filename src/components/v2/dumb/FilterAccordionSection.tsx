import { memo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

  return (
    <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')} className={className}>
      <AccordionTrigger className="text-sm font-medium">
        {title}
        {selectedItems.length > 0 && (
          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {selectedItems.length}
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div
          className="space-y-2 overflow-y-auto"
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