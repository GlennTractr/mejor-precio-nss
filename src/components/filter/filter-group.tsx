'use client';

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
}

export function FilterGroup({
  title,
  options,
  selectedValues,
  onSelectionChange,
  isLoading = false,
}: FilterGroupProps) {
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
      <h3 className="font-semibold capitalize">{title}</h3>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
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
                  disabled={option.count === 0 && !isSelected}
                  onCheckedChange={checked => {
                    const newValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value);
                    onSelectionChange(newValues);
                  }}
                />
                <label
                  htmlFor={`${title}-${option.value}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    option.count === 0 && !isSelected ? 'text-gray-400' : ''
                  }`}
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
