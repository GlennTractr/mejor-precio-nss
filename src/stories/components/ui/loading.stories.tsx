import type { Meta, StoryObj } from '@storybook/nextjs';
import { Loading } from '@/components/ui/loading';

const meta: Meta<typeof Loading> = {
  title: 'UI/Loading',
  component: Loading,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A loading component that displays an animated logo with fade in/out effect. Perfect for showing loading states across your application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the logo in the loading animation',
    },
    duration: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.1 },
      description: 'Animation duration in seconds',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    size: 'lg',
    duration: 2,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default loading
export const Default: Story = {
  args: {
    size: 'lg',
    duration: 2,
  },
};

// Small size
export const Small: Story = {
  args: {
    size: 'sm',
    duration: 2,
  },
};

// Medium size
export const Medium: Story = {
  args: {
    size: 'md',
    duration: 2,
  },
};

// Large size
export const Large: Story = {
  args: {
    size: 'lg',
    duration: 2,
  },
};

// Fast animation
export const FastAnimation: Story = {
  args: {
    size: 'md',
    duration: 0.8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading animation with faster duration (0.8 seconds)',
      },
    },
  },
};

// Slow animation
export const SlowAnimation: Story = {
  args: {
    size: 'md',
    duration: 3.5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading animation with slower duration (3.5 seconds)',
      },
    },
  },
};

// Custom container
export const CustomContainer: Story = {
  args: {
    size: 'md',
    duration: 2,
    className: 'h-64 border-2 border-dashed border-primary/30 rounded-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading component in a custom container with specific height and styling',
      },
    },
  },
};

// Multiple sizes comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-gray-900">Small</h3>
        <div className="h-32 border border-gray-200 rounded-lg">
          <Loading size="sm" duration={2} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-gray-900">Medium</h3>
        <div className="h-32 border border-gray-200 rounded-lg">
          <Loading size="md" duration={2} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-gray-900">Large</h3>
        <div className="h-32 border border-gray-200 rounded-lg">
          <Loading size="lg" duration={2} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all available loading sizes',
      },
    },
  },
};

// Different animation speeds
export const AnimationSpeeds: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-gray-900">Fast (1s)</h3>
        <div className="h-32 border border-gray-200 rounded-lg">
          <Loading size="md" duration={1} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-gray-900">Normal (2s)</h3>
        <div className="h-32 border border-gray-200 rounded-lg">
          <Loading size="md" duration={2} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-gray-900">Slow (4s)</h3>
        <div className="h-32 border border-gray-200 rounded-lg">
          <Loading size="md" duration={4} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different animation speeds to help choose the right timing for your use case',
      },
    },
  },
};

// Full page loading
export const FullPage: Story = {
  args: {
    size: 'lg',
    duration: 2,
    className: 'min-h-screen',
  },
  parameters: {
    docs: {
      description: {
        story: 'Full page loading state, perfect for initial app loading or major page transitions',
      },
    },
  },
};