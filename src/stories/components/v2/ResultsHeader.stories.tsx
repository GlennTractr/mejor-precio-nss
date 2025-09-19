import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { ResultsHeader } from '@/components/ui/results-header';

const meta: Meta<typeof ResultsHeader> = {
  title: 'V2/Dumb Components/ResultsHeader',
  component: ResultsHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Header component showing results count and pagination controls with optional sorting.',
      },
    },
  },
  argTypes: {
    totalItems: {
      description: 'Total number of items found',
      control: { type: 'number', min: 0 },
    },
    itemsPerPage: {
      description: 'Number of items per page',
      control: { type: 'number', min: 10, max: 100, step: 10 },
    },
    onItemsPerPageChange: {
      description: 'Callback when items per page changes',
      action: 'items-per-page-changed',
    },
    sortOptions: {
      description: 'Available sort options',
      control: false,
    },
    currentSort: {
      description: 'Currently selected sort option',
      control: 'text',
    },
    onSortChange: {
      description: 'Callback when sort option changes',
      action: 'sort-changed',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
  args: {
    onItemsPerPageChange: fn(),
    onSortChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ResultsHeader>;

// Standard results header
export const Standard: Story = {
  args: {
    totalItems: 156,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard results header without sorting options.',
      },
    },
  },
};

// No results
export const NoResults: Story = {
  args: {
    totalItems: 0,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header when no results are found.',
      },
    },
  },
};

// Single result
export const SingleResult: Story = {
  args: {
    totalItems: 1,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with exactly one result.',
      },
    },
  },
};

// Many results
export const ManyResults: Story = {
  args: {
    totalItems: 12847,
    itemsPerPage: 40,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with many results showing number formatting.',
      },
    },
  },
};

// With sort options
export const WithSortOptions: Story = {
  args: {
    totalItems: 245,
    itemsPerPage: 20,
    sortOptions: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
      { value: 'newest', label: 'Newest First' },
    ],
    currentSort: 'price_asc',
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with sorting options dropdown.',
      },
    },
  },
};

// Different items per page
export const DifferentItemsPerPage: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 60,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with 60 items per page selected.',
      },
    },
  },
};

// With sort and custom items per page
export const FullFeatures: Story = {
  args: {
    totalItems: 500,
    itemsPerPage: 40,
    sortOptions: [
      { value: 'relevance', label: 'Most Relevant' },
      { value: 'price_asc', label: 'Price ↑' },
      { value: 'price_desc', label: 'Price ↓' },
      { value: 'rating', label: 'Best Rated' },
      { value: 'newest', label: 'Latest' },
    ],
    currentSort: 'rating',
  },
  parameters: {
    docs: {
      description: {
        story: 'Full-featured header with sorting and custom items per page.',
      },
    },
  },
};

// Very large numbers
export const VeryLargeNumbers: Story = {
  args: {
    totalItems: 1234567,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with very large result count to test number formatting.',
      },
    },
  },
};

// Edge case - exactly items per page
export const ExactMatch: Story = {
  args: {
    totalItems: 40,
    itemsPerPage: 40,
  },
  parameters: {
    docs: {
      description: {
        story: 'When total items exactly matches items per page.',
      },
    },
  },
};
