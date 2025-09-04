import type { Meta, StoryObj } from '@storybook/react';
import {
  Dashboard,
  Folder,
  Settings,
  Person,
  ShoppingCart,
} from '@mui/icons-material';

import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A breadcrumb navigation component with multiple separator variants and customization options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'slash', 'arrow', 'chevron'],
      description: 'The separator style between breadcrumb items',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the breadcrumb text and icons',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Color scheme for the breadcrumbs',
    },
    showHomeIcon: {
      control: 'boolean',
      description: 'Whether to show a home icon for the first item',
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of items to display before collapsing',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Electronics', href: '#' },
  { label: 'Laptops' },
];

const itemsWithIcons = [
  { label: 'Dashboard', href: '#', icon: <Dashboard fontSize="small" /> },
  { label: 'Projects', href: '#', icon: <Folder fontSize="small" /> },
  { label: 'Settings', href: '#', icon: <Settings fontSize="small" /> },
  { label: 'Profile' },
];

export const Default: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    size: 'md',
  },
};

export const SlashSeparator: Story = {
  args: {
    items: basicItems,
    variant: 'slash',
    size: 'md',
  },
};

export const ArrowSeparator: Story = {
  args: {
    items: basicItems,
    variant: 'arrow',
    size: 'md',
  },
};

export const ChevronSeparator: Story = {
  args: {
    items: basicItems,
    variant: 'chevron',
    size: 'md',
  },
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'arrow',
    showHomeIcon: false,
    size: 'md',
  },
};

export const SmallSize: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    size: 'lg',
  },
};

export const PrimaryColor: Story = {
  args: {
    items: basicItems,
    variant: 'arrow',
    color: 'primary',
    size: 'md',
  },
};

export const SecondaryColor: Story = {
  args: {
    items: basicItems,
    variant: 'chevron',
    color: 'secondary',
    size: 'md',
  },
};

export const WithHomeIcon: Story = {
  args: {
    items: basicItems,
    variant: 'arrow',
    showHomeIcon: true,
    size: 'md',
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Categories', href: '#' },
      { label: 'Electronics', href: '#' },
      { label: 'Computers', href: '#' },
      { label: 'Laptops', href: '#' },
      { label: 'Gaming Laptops', href: '#' },
      { label: 'High Performance' },
    ],
    variant: 'default',
    maxItems: 4,
    size: 'md',
  },
};

export const EcommercePath: Story = {
  args: {
    items: [
      { label: 'Store', href: '#', icon: <ShoppingCart fontSize="small" /> },
      { label: 'Men', href: '#' },
      { label: 'Clothing', href: '#' },
      { label: 'Shirts', href: '#' },
      { label: 'Casual Shirts' },
    ],
    variant: 'chevron',
    showHomeIcon: false,
    size: 'md',
  },
};

export const UserProfilePath: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '#', icon: <Dashboard fontSize="small" /> },
      { label: 'Users', href: '#', icon: <Person fontSize="small" /> },
      { label: 'John Doe', href: '#' },
      { label: 'Settings', icon: <Settings fontSize="small" /> },
    ],
    variant: 'arrow',
    showHomeIcon: false,
    color: 'primary',
    size: 'md',
  },
};

export const WithClickHandler: Story = {
  args: {
    items: basicItems.map((item, index) => ({
      ...item,
      onClick: index < basicItems.length - 1
        ? (e) => {
            e.preventDefault();
            console.log(`Clicked on: ${item.label}`);
          }
        : undefined,
    })),
    variant: 'default',
    size: 'md',
  },
};