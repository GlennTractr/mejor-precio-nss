import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { FilterSidebar } from '@/components/v2/dumb/FilterSidebar';
import { FilterSection, SpecFilterSection } from '@/components/v2/types';

// Mock filter data
const mockBrandFilters: FilterSection = {
  items: [
    { value: 'Samsung', count: 45, disabled: false },
    { value: 'Apple', count: 32, disabled: false },
    { value: 'Google', count: 18, disabled: false },
    { value: 'Xiaomi', count: 12, disabled: false },
    { value: 'OnePlus', count: 8, disabled: false },
    { value: 'Sony', count: 5, disabled: false },
    { value: 'Nokia', count: 0, disabled: true },
  ],
  selectedItems: ['Samsung', 'Apple'],
};

const mockModelFilters: FilterSection = {
  items: [
    { value: 'Galaxy S24', count: 25 },
    { value: 'iPhone 15', count: 20 },
    { value: 'Pixel 8', count: 15 },
    { value: 'Galaxy S23', count: 12 },
    { value: 'iPhone 14', count: 10 },
    { value: 'Pixel 7', count: 8 },
  ],
  selectedItems: ['Galaxy S24'],
};

const mockSpecFilters: SpecFilterSection[] = [
  {
    type: 'Storage',
    labels: [
      { value: '128GB', count: 35 },
      { value: '256GB', count: 28 },
      { value: '512GB', count: 15 },
      { value: '1TB', count: 8 },
    ],
    selectedItems: ['256GB'],
  },
  {
    type: 'Features',
    labels: [
      { value: '5G Compatible', count: 42 },
      { value: 'Wireless Charging', count: 38 },
      { value: 'IP68 Waterproof', count: 35 },
      { value: 'Face Recognition', count: 30 },
      { value: 'Dual SIM', count: 25 },
    ],
    selectedItems: ['5G Compatible', 'Wireless Charging'],
  },
];

const meta: Meta<typeof FilterSidebar> = {
  title: 'V2/Dumb Components/FilterSidebar',
  component: FilterSidebar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Complete filter sidebar with search, price range, and accordion sections for different filter types.',
      },
    },
  },
  argTypes: {
    searchQuery: {
      description: 'Current search query',
      control: 'text',
    },
    onSearchChange: {
      description: 'Callback when search query changes',
      action: 'search-changed',
    },
    priceRange: {
      description: 'Current price range [min, max]',
      control: false,
    },
    onPriceRangeChange: {
      description: 'Callback when price range changes',
      action: 'price-range-changed',
    },
    minPossiblePrice: {
      description: 'Minimum possible price',
      control: { type: 'number', min: 0 },
    },
    maxPossiblePrice: {
      description: 'Maximum possible price',
      control: { type: 'number', min: 100 },
    },
    brandFilters: {
      description: 'Brand filter section data',
      control: false,
    },
    modelFilters: {
      description: 'Model filter section data',
      control: false,
    },
    specFilters: {
      description: 'Specification filter sections data',
      control: false,
    },
    onFilterToggle: {
      description: 'Callback when any filter is toggled',
      action: 'filter-toggled',
    },
    onResetFilters: {
      description: 'Callback when reset filters is clicked',
      action: 'filters-reset',
    },
    hasActiveFilters: {
      description: 'Whether any filters are currently active',
      control: 'boolean',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
  args: {
    onSearchChange: fn(),
    onPriceRangeChange: fn(),
    onFilterToggle: fn(),
    onResetFilters: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FilterSidebar>;

// Full sidebar with all filters
export const FullSidebar: Story = {
  args: {
    searchQuery: '',
    priceRange: [100, 800],
    minPossiblePrice: 50,
    maxPossiblePrice: 1200,
    brandFilters: mockBrandFilters,
    modelFilters: mockModelFilters,
    specFilters: mockSpecFilters,
    hasActiveFilters: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete filter sidebar with all sections populated and some filters active.',
      },
    },
  },
};

// With search query
export const WithSearch: Story = {
  args: {
    searchQuery: 'smartphone',
    priceRange: [0, 1200],
    minPossiblePrice: 0,
    maxPossiblePrice: 1200,
    brandFilters: mockBrandFilters,
    modelFilters: mockModelFilters,
    specFilters: mockSpecFilters,
    hasActiveFilters: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter sidebar with active search query.',
      },
    },
  },
};

// No filters active
export const NoActiveFilters: Story = {
  args: {
    searchQuery: '',
    priceRange: [0, 1200],
    minPossiblePrice: 0,
    maxPossiblePrice: 1200,
    brandFilters: {
      items: mockBrandFilters.items,
      selectedItems: [],
    },
    modelFilters: {
      items: mockModelFilters.items,
      selectedItems: [],
    },
    specFilters: mockSpecFilters.map(spec => ({
      ...spec,
      selectedItems: [],
    })),
    hasActiveFilters: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter sidebar with no active filters - reset button should be hidden.',
      },
    },
  },
};

// Limited filters available
export const LimitedFilters: Story = {
  args: {
    searchQuery: '',
    priceRange: [200, 600],
    minPossiblePrice: 100,
    maxPossiblePrice: 800,
    brandFilters: {
      items: mockBrandFilters.items.slice(0, 3),
      selectedItems: ['Samsung'],
    },
    modelFilters: {
      items: [],
      selectedItems: [],
    },
    specFilters: [mockSpecFilters[0]], // Only storage options
    hasActiveFilters: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter sidebar with limited filter options available.',
      },
    },
  },
};

// All filters disabled
export const AllFiltersDisabled: Story = {
  args: {
    searchQuery: 'rare product',
    priceRange: [500, 600],
    minPossiblePrice: 0,
    maxPossiblePrice: 1200,
    brandFilters: {
      items: mockBrandFilters.items.map(item => ({
        ...item,
        count: 0,
        disabled: true,
      })),
      selectedItems: [],
    },
    modelFilters: {
      items: mockModelFilters.items.map(item => ({
        ...item,
        count: 0,
        disabled: true,
      })),
      selectedItems: [],
    },
    specFilters: mockSpecFilters.map(spec => ({
      ...spec,
      labels: spec.labels.map(label => ({
        ...label,
        count: 0,
        disabled: true,
      })),
      selectedItems: [],
    })),
    hasActiveFilters: true, // Search and price are still active
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter sidebar when search results in no available filter options.',
      },
    },
  },
};

// Price range at extremes
export const PriceRangeExtremes: Story = {
  args: {
    searchQuery: '',
    priceRange: [50, 1200], // Full range
    minPossiblePrice: 50,
    maxPossiblePrice: 1200,
    brandFilters: mockBrandFilters,
    modelFilters: mockModelFilters,
    specFilters: mockSpecFilters,
    hasActiveFilters: false, // Price is at full range so not considered active
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter sidebar with price range set to full available range.',
      },
    },
  },
};

// Many spec filters (scrolling test)
export const ManySpecFilters: Story = {
  args: {
    searchQuery: '',
    priceRange: [100, 800],
    minPossiblePrice: 0,
    maxPossiblePrice: 1200,
    brandFilters: mockBrandFilters,
    modelFilters: mockModelFilters,
    specFilters: [
      ...mockSpecFilters,
      {
        type: 'Camera',
        labels: [
          { value: '12MP', count: 25 },
          { value: '48MP', count: 20 },
          { value: '108MP', count: 15 },
          { value: 'Ultra-wide', count: 30 },
          { value: 'Telephoto', count: 18 },
          { value: 'Night Mode', count: 35 },
        ],
        selectedItems: ['48MP', 'Ultra-wide'],
      },
      {
        type: 'Display',
        labels: [
          { value: '6.1 inch', count: 15 },
          { value: '6.4 inch', count: 20 },
          { value: '6.7 inch', count: 18 },
          { value: 'OLED', count: 35 },
          { value: '120Hz', count: 25 },
          { value: 'HDR', count: 30 },
        ],
        selectedItems: ['OLED'],
      },
    ],
    hasActiveFilters: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter sidebar with many specification sections to test scrolling behavior.',
      },
    },
  },
};

// Mobile layout test
export const MobileLayout: Story = {
  args: {
    searchQuery: 'mobile test',
    priceRange: [200, 800],
    minPossiblePrice: 0,
    maxPossiblePrice: 1200,
    brandFilters: mockBrandFilters,
    modelFilters: mockModelFilters,
    specFilters: mockSpecFilters,
    hasActiveFilters: true,
    className: 'max-w-sm', // Simulate mobile width
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter sidebar in mobile/narrow layout.',
      },
    },
  },
};