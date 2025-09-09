'use client';

import { memo } from 'react';
import { FilterAccordionSection } from './FilterAccordionSection';
import { FilterItem } from '../types';

interface SpecFilter {
  type: string;
  labels: FilterItem[];
  selectedItems: string[];
}

interface AlternatingFilterSectionsProps {
  /**
   * Array of spec filters to render with alternating variants
   */
  specFilters: SpecFilter[];
  /**
   * Handler for toggling filter selections
   */
  onToggle: (spec: string) => void;
  /**
   * Maximum height for each section
   */
  maxHeight?: number;
  /**
   * Starting variant - 'primary' starts with primary, 'secondary' starts with secondary
   */
  startVariant?: 'primary' | 'secondary';
  /**
   * Custom class name
   */
  className?: string;
}

function AlternatingFilterSectionsComponent({
  specFilters,
  onToggle,
  maxHeight = 160,
  startVariant = 'primary',
  className,
}: AlternatingFilterSectionsProps) {
  return (
    <div className={className}>
      {specFilters.map((specFilter, index) => {
        // Alternate variants based on index and starting variant
        const isEven = index % 2 === 0;
        const variant =
          startVariant === 'primary'
            ? isEven
              ? 'primary'
              : 'secondary'
            : isEven
              ? 'secondary'
              : 'primary';

        return (
          <FilterAccordionSection
            key={specFilter.type}
            title={specFilter.type}
            internalId={`spec-${specFilter.type}`}
            items={specFilter.labels}
            selectedItems={specFilter.selectedItems}
            onToggle={onToggle}
            sortBy="count"
            maxHeight={maxHeight}
            variant={variant}
          />
        );
      })}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const AlternatingFilterSections = memo(AlternatingFilterSectionsComponent);
AlternatingFilterSections.displayName = 'AlternatingFilterSections';
