'use client';

import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';

export interface FilterOption {
  value: string;
  count: number;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (newValues: string[]) => void;
  isLoading?: boolean;
  isInitialLoad?: boolean;
}

export function FilterGroup({
  title,
  options,
  selectedValues,
  onSelectionChange,
  isLoading = false,
  isInitialLoad = false,
}: FilterGroupProps) {
  const t = useTranslations('filters');

  // Sort options into three tiers:
  // 1. Count > 0: ordered by label
  // 2. Count = 0 AND selected: ordered by label
  // 3. Count = 0 AND not selected: ordered by label
  const sortedOptions = [...options].sort((a, b) => {
    const aSelected = selectedValues.includes(a.value);
    const bSelected = selectedValues.includes(b.value);

    // If one has count > 0 and the other doesn't
    if (a.count > 0 !== b.count > 0) {
      return a.count > 0 ? -1 : 1;
    }

    // If both have count = 0, check if they're selected
    if (a.count === 0 && b.count === 0) {
      if (aSelected !== bSelected) {
        return aSelected ? -1 : 1;
      }
    }

    // Within each tier, sort by label
    return a.value.localeCompare(b.value);
  });

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-accent capitalize">{t(title.toLowerCase())}</h3>
      {isInitialLoad ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded bg-primary-light/20 animate-pulse" />
              <div className="h-4 w-24 rounded bg-primary-light/20 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedOptions.map(option => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${title}-${option.value}`}
                  checked={isSelected}
                  disabled={isLoading || (option.count === 0 && !isSelected)}
                  onCheckedChange={checked => {
                    const newValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value);
                    onSelectionChange(newValues);
                  }}
                  className="border-primary-light data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={`${title}-${option.value}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
                    ${
                      option.count === 0 && !isSelected
                        ? 'text-muted-foreground/50'
                        : 'text-muted-foreground'
                    } 
                    ${isLoading ? 'opacity-50' : ''} 
                    ${isSelected ? 'text-primary' : ''}`}
                >
                  {option.value} ({option.count})
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
