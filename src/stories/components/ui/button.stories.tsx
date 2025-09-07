import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/components/ui/button';
import { Download, Heart, Search, Settings } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants using your brand colors (Melon primary and Green secondary). Supports different sizes and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'outline',
        'outline-secondary',
        'ghost',
        'ghost-secondary',
        'destructive',
        'link',
        'link-secondary',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child element (Slot)',
    },
    children: {
      control: 'text',
      description: 'Button content/text',
    },
  },
  args: {
    children: 'Button',
    disabled: false,
    asChild: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story (now uses primary)
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default Button',
  },
};

// Primary variant (Melon) - same as default
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// Secondary variant (Green)
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// Outline variants
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Primary Outlined',
  },
};

export const OutlineSecondary: Story = {
  args: {
    variant: 'outline-secondary',
    children: 'Secondary Outlined',
  },
};

// Ghost variants
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const GhostSecondary: Story = {
  args: {
    variant: 'ghost-secondary',
    children: 'Ghost Secondary',
  },
};

// Destructive variant
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Item',
  },
};

// Link variants
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

export const LinkSecondary: Story = {
  args: {
    variant: 'link-secondary',
    children: 'Link Secondary',
  },
};

// Size variations
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

// Icon buttons
export const IconButton: Story = {
  args: {
    variant: 'primary',
    size: 'icon',
    children: <Settings className="h-4 w-4" />,
  },
};

export const IconButtonOutline: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Heart className="h-4 w-4" />,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};

// With icons and text
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <Download className="h-4 w-4" />
        Download
      </>
    ),
  },
};

export const WithIconSecondary: Story = {
  args: {
    variant: 'secondary',
    children: (
      <>
        <Search className="h-4 w-4" />
        Search Products
      </>
    ),
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Filled Buttons</h3>
        <div className="flex gap-2 flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Outlined Buttons</h3>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline">Primary Outline</Button>
          <Button variant="outline-secondary">Secondary Outline</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Text Buttons</h3>
        <div className="flex gap-2 flex-wrap">
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost-secondary">Ghost Secondary</Button>
          <Button variant="link">Link</Button>
          <Button variant="link-secondary">Link Secondary</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Sizes</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="default">
            Default
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
          <Button variant="primary" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">States</h3>
        <div className="flex gap-2 flex-wrap">
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive showcase of all button variants, sizes, and states available with your brand colors.',
      },
    },
  },
};
