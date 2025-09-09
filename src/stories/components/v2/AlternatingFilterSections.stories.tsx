import type { Meta, StoryObj } from '@storybook/nextjs';
import { AlternatingFilterSections } from '../../../components/v2/dumb/AlternatingFilterSections';
import { Accordion } from '@/components/ui/accordion';

const meta = {
  title: 'Components/v2/AlternatingFilterSections',
  component: AlternatingFilterSections,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    startVariant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
    maxHeight: {
      control: { type: 'number' },
    },
  },
} satisfies Meta<typeof AlternatingFilterSections>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSpecFilters = [
  {
    type: 'Screen Size',
    labels: [
      { value: '13"', label: '13 inch', count: 45 },
      { value: '15"', label: '15 inch', count: 32 },
      { value: '17"', label: '17 inch', count: 18 },
    ],
    selectedItems: ['15"'],
  },
  {
    type: 'Storage',
    labels: [
      { value: '256GB', label: '256GB SSD', count: 67 },
      { value: '512GB', label: '512GB SSD', count: 89 },
      { value: '1TB', label: '1TB SSD', count: 23 },
      { value: '2TB', label: '2TB SSD', count: 12 },
    ],
    selectedItems: ['512GB'],
  },
  {
    type: 'Memory',
    labels: [
      { value: '8GB', label: '8GB RAM', count: 34 },
      { value: '16GB', label: '16GB RAM', count: 78 },
      { value: '32GB', label: '32GB RAM', count: 45 },
      { value: '64GB', label: '64GB RAM', count: 12 },
    ],
    selectedItems: [],
  },
  {
    type: 'Processor',
    labels: [
      { value: 'intel-i5', label: 'Intel Core i5', count: 56 },
      { value: 'intel-i7', label: 'Intel Core i7', count: 78 },
      { value: 'amd-ryzen5', label: 'AMD Ryzen 5', count: 34 },
      { value: 'amd-ryzen7', label: 'AMD Ryzen 7', count: 23 },
    ],
    selectedItems: ['intel-i7'],
  },
  {
    type: 'Graphics',
    labels: [
      { value: 'integrated', label: 'Integrated Graphics', count: 89 },
      { value: 'nvidia-rtx', label: 'NVIDIA RTX', count: 45 },
      { value: 'amd-radeon', label: 'AMD Radeon', count: 23 },
    ],
    selectedItems: [],
  },
];

export const Default: Story = {
  args: {
    specFilters: mockSpecFilters,
    onToggle: (spec: string) => console.log('Toggled spec:', spec),
    maxHeight: 160,
    startVariant: 'primary',
  },
  decorators: [
    Story => (
      <div className="w-80 max-w-sm">
        <Accordion type="multiple" defaultValue={mockSpecFilters.map(f => f.type)}>
          <Story />
        </Accordion>
      </div>
    ),
  ],
};

export const StartingWithSecondary: Story = {
  args: {
    ...Default.args,
    startVariant: 'secondary',
  },
  decorators: Default.decorators,
};

export const FewerFilters: Story = {
  args: {
    ...Default.args,
    specFilters: mockSpecFilters.slice(0, 3),
  },
  decorators: Default.decorators,
};

export const ManyFilters: Story = {
  args: {
    ...Default.args,
    specFilters: [
      ...mockSpecFilters,
      {
        type: 'Operating System',
        labels: [
          { value: 'windows11', label: 'Windows 11', count: 123 },
          { value: 'macos', label: 'macOS', count: 45 },
          { value: 'linux', label: 'Linux', count: 12 },
        ],
        selectedItems: ['windows11'],
      },
      {
        type: 'Color',
        labels: [
          { value: 'silver', label: 'Silver', count: 78 },
          { value: 'black', label: 'Black', count: 67 },
          { value: 'white', label: 'White', count: 34 },
          { value: 'blue', label: 'Blue', count: 23 },
        ],
        selectedItems: [],
      },
    ],
  },
  decorators: Default.decorators,
};
