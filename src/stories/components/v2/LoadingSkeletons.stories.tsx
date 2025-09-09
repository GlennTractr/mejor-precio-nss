import type { Meta, StoryObj } from '@storybook/nextjs';
import { LoadingSkeletons } from '@/components/v2/dumb/LoadingSkeletons';

const meta: Meta<typeof LoadingSkeletons> = {
  title: 'V2/Dumb Components/LoadingSkeletons',
  component: LoadingSkeletons,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Flexible skeleton loading components for different content types with customizable count.',
      },
    },
  },
  argTypes: {
    count: {
      description: 'Number of skeleton items to display',
      control: { type: 'number', min: 1, max: 20 },
    },
    type: {
      description: 'Type of skeleton to display',
      control: { type: 'select' },
      options: ['product', 'filter', 'header'],
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSkeletons>;

// Product skeletons (grid layout)
export const ProductSkeletons: Story = {
  args: {
    count: 6,
    type: 'product',
  },
  parameters: {
    docs: {
      description: {
        story: 'Product card skeletons arranged in a responsive grid.',
      },
    },
  },
};

// Filter skeletons (vertical stack)
export const FilterSkeletons: Story = {
  args: {
    count: 4,
    type: 'filter',
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter section skeletons for sidebar loading.',
      },
    },
  },
};

// Header skeleton
export const HeaderSkeleton: Story = {
  args: {
    count: 1,
    type: 'header',
  },
  parameters: {
    docs: {
      description: {
        story: 'Results header skeleton for page controls.',
      },
    },
  },
};

// Many product skeletons
export const ManyProductSkeletons: Story = {
  args: {
    count: 18,
    type: 'product',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large number of product skeletons for full page loading.',
      },
    },
  },
};

// Few product skeletons
export const FewProductSkeletons: Story = {
  args: {
    count: 3,
    type: 'product',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small number of product skeletons.',
      },
    },
  },
};

// Single filter skeleton
export const SingleFilterSkeleton: Story = {
  args: {
    count: 1,
    type: 'filter',
  },
  parameters: {
    docs: {
      description: {
        story: 'Single filter section skeleton.',
      },
    },
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    count: 4,
    type: 'product',
    className: 'opacity-50',
  },
  parameters: {
    docs: {
      description: {
        story: 'Product skeletons with custom opacity styling.',
      },
    },
  },
};
