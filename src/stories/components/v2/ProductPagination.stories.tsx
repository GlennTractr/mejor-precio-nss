import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { ProductPagination } from '@/components/v2/dumb/ProductPagination';

const meta: Meta<typeof ProductPagination> = {
  title: 'V2/Dumb Components/ProductPagination',
  component: ProductPagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Pagination component for navigating through product pages with ellipsis support for many pages.',
      },
    },
  },
  argTypes: {
    currentPage: {
      description: 'Current active page number',
      control: { type: 'number', min: 1 },
    },
    totalItems: {
      description: 'Total number of items',
      control: { type: 'number', min: 0 },
    },
    itemsPerPage: {
      description: 'Number of items per page',
      control: { type: 'number', min: 1 },
    },
    maxPagesToShow: {
      description: 'Maximum number of page buttons to show',
      control: { type: 'number', min: 3, max: 10 },
    },
    onPageChange: {
      description: 'Callback when page is changed',
      action: 'page-changed',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
  args: {
    onPageChange: fn(),
    maxPagesToShow: 5,
  },
};

export default meta;
type Story = StoryObj<typeof ProductPagination>;

// No pagination (single page or no items)
export const NoItems: Story = {
  args: {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'When there are no items, pagination does not render.',
      },
    },
  },
};

// Single page
export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalItems: 15,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'When all items fit on one page, pagination does not render.',
      },
    },
  },
};

// Few pages (2-5 pages)
export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalItems: 85,
    itemsPerPage: 20, // 5 pages total
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple pagination with few pages - shows all page numbers.',
      },
    },
  },
};

// Many pages - current page at beginning
export const ManyPagesStart: Story = {
  args: {
    currentPage: 2,
    totalItems: 1000,
    itemsPerPage: 20, // 50 pages total
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with many pages, current page near the beginning.',
      },
    },
  },
};

// Many pages - current page in middle
export const ManyPagesMiddle: Story = {
  args: {
    currentPage: 25,
    totalItems: 1000,
    itemsPerPage: 20, // 50 pages total
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with many pages, current page in the middle showing ellipsis.',
      },
    },
  },
};

// Many pages - current page near end
export const ManyPagesEnd: Story = {
  args: {
    currentPage: 48,
    totalItems: 1000,
    itemsPerPage: 20, // 50 pages total
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with many pages, current page near the end.',
      },
    },
  },
};

// First page
export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalItems: 500,
    itemsPerPage: 20, // 25 pages total
  },
  parameters: {
    docs: {
      description: {
        story: 'First page - Previous button should be disabled.',
      },
    },
  },
};

// Last page
export const LastPage: Story = {
  args: {
    currentPage: 25,
    totalItems: 500,
    itemsPerPage: 20, // 25 pages total
  },
  parameters: {
    docs: {
      description: {
        story: 'Last page - Next button should be disabled.',
      },
    },
  },
};

// Custom maxPagesToShow
export const CustomMaxPages: Story = {
  args: {
    currentPage: 10,
    totalItems: 2000,
    itemsPerPage: 20, // 100 pages total
    maxPagesToShow: 7,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom maximum pages to show - displays more page numbers.',
      },
    },
  },
};

// Edge case - very few items per page
export const ManyPagesSmallPerPage: Story = {
  args: {
    currentPage: 15,
    totalItems: 200,
    itemsPerPage: 5, // 40 pages total
  },
  parameters: {
    docs: {
      description: {
        story: 'Many pages due to small items per page setting.',
      },
    },
  },
};

// Accessibility test
export const AccessibilityTest: Story = {
  args: {
    currentPage: 5,
    totalItems: 200,
    itemsPerPage: 10, // 20 pages total
  },
  parameters: {
    docs: {
      description: {
        story: 'Test accessibility features - keyboard navigation and screen reader labels.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Test keyboard navigation
    const buttons = canvasElement.querySelectorAll('button');
    buttons[0]?.focus(); // Focus first button
  },
};