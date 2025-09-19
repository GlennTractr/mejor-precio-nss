import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProductGrid } from '@/components/product/product-grid';
import { Product } from '@/types/product';

// Mock product data
const mockProduct: Product = {
  id: '1',
  title: 'Samsung Galaxy S24 Ultra 256GB Titanium Black',
  brand: 'Samsung',
  model: 'Galaxy S24 Ultra',
  product_slug: 'samsung-galaxy-s24-ultra-256gb',
  category: 'Smartphones',
  category_slug: 'smartphones',
  best_price_per_unit: 1199.99,
  max_price_per_unit: 1399.99,
  shop_names: ['MediaMarkt', 'El Corte Inglés', 'Amazon'],
  price_list: [1199.99, 1299.99, 1399.99],
  main_image_bucket: 'products',
  main_image_path: 'samsung/galaxy-s24-ultra.jpg',
  specs: [
    { label: '256GB', type: 'Storage' },
    { label: '5G Compatible', type: 'Connectivity' },
  ],
};

const createMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockProduct,
    id: String(i + 1),
    title: `Product ${i + 1} - ${mockProduct.title}`,
    best_price_per_unit: mockProduct.best_price_per_unit + i * 50,
    max_price_per_unit: mockProduct.max_price_per_unit + i * 100,
  }));
};

const meta: Meta<typeof ProductGrid> = {
  title: 'V2/Dumb Components/ProductGrid',
  component: ProductGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A pure presentation component that displays a grid of products with loading and empty states.',
      },
    },
  },
  argTypes: {
    products: {
      description: 'Array of products to display',
      control: false,
    },
    isLoading: {
      description: 'Whether the grid is in a loading state',
      control: 'boolean',
    },
    itemsPerPage: {
      description: 'Number of items per page (affects skeleton count)',
      control: { type: 'number', min: 6, max: 60, step: 6 },
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductGrid>;

// Standard grid with products
export const Default: Story = {
  args: {
    products: createMockProducts(9),
    isLoading: false,
    itemsPerPage: 20,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    products: [],
    isLoading: true,
    itemsPerPage: 12,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows skeleton loading components while products are being fetched.',
      },
    },
  },
};

// Empty state
export const Empty: Story = {
  args: {
    products: [],
    isLoading: false,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays when no products match the current filters.',
      },
    },
  },
};

// Few products (1-3 items)
export const FewProducts: Story = {
  args: {
    products: createMockProducts(3),
    isLoading: false,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid layout with only a few products.',
      },
    },
  },
};

// Many products (full grid)
export const ManyProducts: Story = {
  args: {
    products: createMockProducts(18),
    isLoading: false,
    itemsPerPage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid layout with many products showing responsive behavior.',
      },
    },
  },
};

// Custom empty state
export const CustomEmptyState: Story = {
  args: {
    products: [],
    isLoading: false,
    itemsPerPage: 20,
    emptyState: (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Clear Filters</button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a custom empty state component.',
      },
    },
  },
};

// Custom loading component
export const CustomLoading: Story = {
  args: {
    products: [],
    isLoading: true,
    itemsPerPage: 6,
    loadingComponent: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
          </div>
        ))}
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a custom loading component with gradient skeletons.',
      },
    },
  },
};
