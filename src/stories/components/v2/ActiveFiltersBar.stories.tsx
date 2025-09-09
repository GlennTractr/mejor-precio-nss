import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { ActiveFiltersBar } from '@/components/v2/dumb/ActiveFiltersBar';
import { FilterType } from '@/components/v2/types';

// Mock formatters
const mockFormatters = {
  price: (price: number) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price),
  filterLabel: (type: FilterType, value: string) => {
    const typeLabels: Record<string, string> = {
      search: 'Search',
      brand: 'Brand',
      model: 'Model',
      spec: 'Spec',
      price: 'Price',
    };
    return type === 'spec' ? value : `${typeLabels[type] || type}: ${value}`;
  },
};

const meta: Meta<typeof ActiveFiltersBar> = {
  title: 'V2/Dumb Components/ActiveFiltersBar',
  component: ActiveFiltersBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays currently active filters as removable badges with a clear all option.',
      },
    },
  },
  argTypes: {
    activeFilters: {
      description: 'Array of active filters to display',
      control: false,
    },
    onRemoveFilter: {
      description: 'Callback when a filter is removed',
      action: 'removed-filter',
    },
    onClearAll: {
      description: 'Callback when clear all is clicked',
      action: 'cleared-all',
    },
    formatters: {
      description: 'Formatting functions for display',
      control: false,
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
  args: {
    onRemoveFilter: fn(),
    onClearAll: fn(),
    formatters: mockFormatters,
  },
};

export default meta;
type Story = StoryObj<typeof ActiveFiltersBar>;

// No filters (should not render)
export const NoFilters: Story = {
  args: {
    activeFilters: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'When no filters are active, the component does not render anything.',
      },
    },
  },
};

// Single filter
export const SingleFilter: Story = {
  args: {
    activeFilters: [
      {
        id: 'search',
        type: 'search',
        label: 'Search',
        displayValue: 'samsung',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Display with a single active filter.',
      },
    },
  },
};

// Multiple filters
export const MultipleFilters: Story = {
  args: {
    activeFilters: [
      {
        id: 'search',
        type: 'search',
        label: 'Search',
        displayValue: 'smartphone',
      },
      {
        id: 'brand-samsung',
        type: 'brand',
        label: 'Brand',
        displayValue: 'Samsung',
      },
      {
        id: 'model-galaxy-s24',
        type: 'model',
        label: 'Model',
        displayValue: 'Galaxy S24',
      },
      {
        id: 'price',
        type: 'price',
        label: 'Price',
        displayValue: '€500.00 - €1,200.00',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Display with multiple active filters of different types.',
      },
    },
  },
};

// Many filters (overflow test)
export const ManyFilters: Story = {
  args: {
    activeFilters: [
      {
        id: 'search',
        type: 'search',
        label: 'Search',
        displayValue: 'smartphone with great camera',
      },
      { id: 'brand-samsung', type: 'brand', label: 'Brand', displayValue: 'Samsung' },
      { id: 'brand-apple', type: 'brand', label: 'Brand', displayValue: 'Apple' },
      { id: 'brand-google', type: 'brand', label: 'Brand', displayValue: 'Google' },
      { id: 'model-galaxy-s24', type: 'model', label: 'Model', displayValue: 'Galaxy S24 Ultra' },
      { id: 'model-iphone-15', type: 'model', label: 'Model', displayValue: 'iPhone 15 Pro Max' },
      { id: 'spec-5g', type: 'spec', label: 'Spec', displayValue: '5G Compatible' },
      { id: 'spec-128gb', type: 'spec', label: 'Spec', displayValue: '128GB Storage' },
      { id: 'spec-256gb', type: 'spec', label: 'Spec', displayValue: '256GB Storage' },
      { id: 'price', type: 'price', label: 'Price', displayValue: '€800.00 - €1,500.00' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests wrapping behavior with many active filters.',
      },
    },
  },
};

// Long filter values
export const LongFilterValues: Story = {
  args: {
    activeFilters: [
      {
        id: 'search',
        type: 'search',
        label: 'Search',
        displayValue: 'very long search query that might need truncation',
      },
      {
        id: 'brand-very-long',
        type: 'brand',
        label: 'Brand',
        displayValue: 'Very Long Brand Name That Might Overflow',
      },
      {
        id: 'spec-long',
        type: 'spec',
        label: 'Spec',
        displayValue: 'Very detailed specification with lots of text that could be problematic',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests truncation and overflow handling for long filter values.',
      },
    },
  },
};

// Spec filters only (no prefix)
export const SpecFiltersOnly: Story = {
  args: {
    activeFilters: [
      { id: 'spec-5g', type: 'spec', label: 'Spec', displayValue: '5G Compatible' },
      { id: 'spec-wireless', type: 'spec', label: 'Spec', displayValue: 'Wireless Charging' },
      { id: 'spec-waterproof', type: 'spec', label: 'Spec', displayValue: 'IP68 Waterproof' },
      { id: 'spec-camera', type: 'spec', label: 'Spec', displayValue: '108MP Camera' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Spec filters are displayed without a type prefix.',
      },
    },
  },
};

// Price filter only
export const PriceFilterOnly: Story = {
  args: {
    activeFilters: [
      {
        id: 'price',
        type: 'price',
        label: 'Price',
        displayValue: '€299.99 - €899.99',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Display with only a price range filter active.',
      },
    },
  },
};
