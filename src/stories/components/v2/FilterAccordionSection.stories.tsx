import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { Accordion } from '@/components/ui/accordion';
import { FilterAccordionSection } from '@/components/v2/dumb/FilterAccordionSection';
import { FilterItem } from '@/components/v2/types';

// Mock filter items
const mockBrandItems: FilterItem[] = [
  { value: 'Samsung', count: 25, disabled: false },
  { value: 'Apple', count: 18, disabled: false },
  { value: 'Google', count: 12, disabled: false },
  { value: 'Xiaomi', count: 8, disabled: false },
  { value: 'OnePlus', count: 5, disabled: false },
  { value: 'Sony', count: 3, disabled: false },
  { value: 'Nokia', count: 0, disabled: true },
];

const mockSpecItems: FilterItem[] = [
  { value: '5G Compatible', count: 45 },
  { value: 'Wireless Charging', count: 38 },
  { value: 'IP68 Waterproof', count: 32 },
  { value: '128GB Storage', count: 28 },
  { value: '256GB Storage', count: 22 },
  { value: '512GB Storage', count: 15 },
  { value: 'Dual SIM', count: 42 },
  { value: 'Face Recognition', count: 35 },
  { value: 'Fingerprint Scanner', count: 48 },
];

const manyItems: FilterItem[] = Array.from({ length: 50 }, (_, i) => ({
  value: `Item ${i + 1}`,
  count: Math.floor(Math.random() * 100),
  disabled: Math.random() < 0.1, // 10% chance of being disabled
}));

const meta: Meta<typeof FilterAccordionSection> = {
  title: 'V2/Dumb Components/FilterAccordionSection',
  component: FilterAccordionSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Reusable accordion section for filter categories with sorting and scroll support.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Accordion type="multiple" defaultValue={['test']}>
          <Story />
        </Accordion>
      </div>
    ),
  ],
  argTypes: {
    title: {
      description: 'Section title displayed in accordion trigger',
      control: 'text',
    },
    items: {
      description: 'Array of filter items to display',
      control: false,
    },
    selectedItems: {
      description: 'Array of selected item values',
      control: false,
    },
    onToggle: {
      description: 'Callback when an item is toggled',
      action: 'item-toggled',
    },
    maxHeight: {
      description: 'Maximum height in pixels for scrollable area',
      control: { type: 'number', min: 100, max: 500 },
    },
    sortBy: {
      description: 'Sort items by count or alphabetically',
      control: { type: 'select' },
      options: ['count', 'alphabetical'],
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
  args: {
    onToggle: fn(),
    maxHeight: 240,
    sortBy: 'count',
  },
};

export default meta;
type Story = StoryObj<typeof FilterAccordionSection>;

// Standard brand filter
export const BrandFilter: Story = {
  args: {
    title: 'Brands',
    items: mockBrandItems,
    selectedItems: ['Samsung', 'Apple'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Typical brand filter with some items selected and one disabled item with 0 count.',
      },
    },
  },
};

// Spec filter with no selections
export const SpecFilter: Story = {
  args: {
    title: 'Specifications',
    items: mockSpecItems,
    selectedItems: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Specification filter with no items selected.',
      },
    },
  },
};

// Alphabetical sorting
export const AlphabeticalSort: Story = {
  args: {
    title: 'Brands (A-Z)',
    items: mockBrandItems,
    selectedItems: ['Google'],
    sortBy: 'alphabetical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter items sorted alphabetically instead of by count.',
      },
    },
  },
};

// Empty filter section
export const EmptySection: Story = {
  args: {
    title: 'Empty Category',
    items: [],
    selectedItems: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty filter section - should not render anything.',
      },
    },
  },
};

// Many items with scrolling
export const ManyItemsScrolling: Story = {
  args: {
    title: 'Many Items',
    items: manyItems,
    selectedItems: ['Item 5', 'Item 12', 'Item 28'],
    maxHeight: 200,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter section with many items requiring scrolling.',
      },
    },
  },
};

// All items selected
export const AllSelected: Story = {
  args: {
    title: 'All Selected',
    items: mockBrandItems.slice(0, 5), // First 5 items
    selectedItems: mockBrandItems.slice(0, 5).map(item => item.value),
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter section with all available items selected.',
      },
    },
  },
};

// All items disabled
export const AllDisabled: Story = {
  args: {
    title: 'All Disabled',
    items: mockBrandItems.map(item => ({ ...item, count: 0, disabled: true })),
    selectedItems: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter section with all items disabled (zero count).',
      },
    },
  },
};

// Single item
export const SingleItem: Story = {
  args: {
    title: 'Single Item',
    items: [{ value: 'Samsung Galaxy', count: 15 }],
    selectedItems: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter section with only one item.',
      },
    },
  },
};

// Custom height
export const CustomHeight: Story = {
  args: {
    title: 'Custom Height',
    items: mockSpecItems,
    selectedItems: ['5G Compatible'],
    maxHeight: 150,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter section with custom maximum height.',
      },
    },
  },
};

// Long item names
export const LongItemNames: Story = {
  args: {
    title: 'Long Names',
    items: [
      { value: 'Very Long Product Name That Might Need Truncation', count: 25 },
      { value: 'Another Extremely Long Product Name With Technical Specifications', count: 18 },
      { value: 'Short Name', count: 12 },
      { value: 'Medium Length Product Name', count: 8 },
    ],
    selectedItems: ['Short Name'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter section with long item names to test text overflow handling.',
      },
    },
  },
};