import type { Meta, StoryObj } from '@storybook/react';
import {
  Dashboard,
  ShoppingCart,
  People,
  Settings,
  Analytics,
  Inventory,
  LocalShipping,
  Receipt,
  AccountBalance,
  Help,
  Notifications,
  Home,
  Business,
  Category,
  Report,
} from '@mui/icons-material';
import { Box, Typography, Avatar } from '@mui/material';

import { NavigationMenu } from './NavigationMenu';

const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A flexible navigation menu component supporting horizontal, vertical, and mega menu layouts with nested items and customization options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['horizontal', 'vertical', 'mega'],
      description: 'Layout variant of the navigation menu',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the menu items',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Color scheme for the menu',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the vertical menu can be collapsed',
    },
    collapsed: {
      control: 'boolean',
      description: 'Whether the vertical menu is collapsed',
    },
    showDividers: {
      control: 'boolean',
      description: 'Whether to show dividers between menu sections',
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicVerticalItems = [
  {
    id: '1',
    label: 'Dashboard',
    icon: <Dashboard />,
    href: '#',
    active: true,
  },
  {
    id: '2',
    label: 'Orders',
    icon: <ShoppingCart />,
    href: '#',
    badge: 5,
  },
  {
    id: '3',
    label: 'Customers',
    icon: <People />,
    href: '#',
  },
  {
    id: '4',
    label: 'Inventory',
    icon: <Inventory />,
    href: '#',
    children: [
      { id: '4-1', label: 'All Items', href: '#' },
      { id: '4-2', label: 'Categories', href: '#' },
      { id: '4-3', label: 'Suppliers', href: '#' },
    ],
  },
  {
    id: '5',
    label: 'Reports',
    icon: <Analytics />,
    href: '#',
  },
  {
    id: '6',
    label: 'Settings',
    icon: <Settings />,
    href: '#',
  },
];

const horizontalItems = [
  { id: '1', label: 'Home', href: '#', active: true },
  { id: '2', label: 'Products', href: '#' },
  { id: '3', label: 'Services', href: '#' },
  { id: '4', label: 'About', href: '#' },
  { id: '5', label: 'Contact', href: '#' },
];

const megaMenuItems = [
  {
    id: 'operations',
    label: 'Operations',
    children: [
      { id: 'dashboard', label: 'Dashboard', icon: <Dashboard />, href: '#' },
      { id: 'orders', label: 'Orders', icon: <ShoppingCart />, href: '#' },
      { id: 'shipping', label: 'Shipping', icon: <LocalShipping />, href: '#' },
      { id: 'invoices', label: 'Invoices', icon: <Receipt />, href: '#' },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    children: [
      { id: 'inventory', label: 'Inventory', icon: <Inventory />, href: '#' },
      { id: 'customers', label: 'Customers', icon: <People />, href: '#' },
      { id: 'suppliers', label: 'Suppliers', icon: <Business />, href: '#' },
      { id: 'categories', label: 'Categories', icon: <Category />, href: '#' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    children: [
      { id: 'analytics', label: 'Analytics', icon: <Analytics />, href: '#' },
      { id: 'reports', label: 'Reports', icon: <Report />, href: '#' },
      { id: 'finance', label: 'Finance', icon: <AccountBalance />, href: '#' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    children: [
      { id: 'settings', label: 'Settings', icon: <Settings />, href: '#' },
      { id: 'help', label: 'Help & Support', icon: <Help />, href: '#' },
      { id: 'notifications', label: 'Notifications', icon: <Notifications />, href: '#' },
    ],
  },
];

const logo = (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Home color="primary" />
    <Typography variant="h6" fontWeight="bold">
      Procurement
    </Typography>
  </Box>
);

const userProfile = (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
    <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
    <Box>
      <Typography variant="body2" fontWeight="medium">
        John Doe
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Admin
      </Typography>
    </Box>
  </Box>
);

export const VerticalDefault: Story = {
  args: {
    variant: 'vertical',
    items: basicVerticalItems,
    size: 'md',
    logo,
    endContent: userProfile,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4">Main Content Area</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This is the main content area. The navigation menu is on the left.
          </Typography>
        </Box>
      </Box>
    ),
  ],
};

export const VerticalCollapsible: Story = {
  args: {
    variant: 'vertical',
    items: basicVerticalItems,
    size: 'md',
    collapsible: true,
    logo,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4">Collapsible Menu</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Click the menu icon to collapse/expand the navigation.
          </Typography>
        </Box>
      </Box>
    ),
  ],
};

export const VerticalCollapsed: Story = {
  args: {
    variant: 'vertical',
    items: basicVerticalItems,
    size: 'md',
    collapsible: true,
    collapsed: true,
    logo,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4">Collapsed Menu</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            The navigation is collapsed, showing only icons.
          </Typography>
        </Box>
      </Box>
    ),
  ],
};

export const VerticalWithDividers: Story = {
  args: {
    variant: 'vertical',
    items: [...basicVerticalItems.slice(0, 3), ...basicVerticalItems.slice(3)],
    size: 'md',
    showDividers: true,
    logo,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4">With Dividers</Typography>
        </Box>
      </Box>
    ),
  ],
};

export const HorizontalDefault: Story = {
  args: {
    variant: 'horizontal',
    items: horizontalItems,
    size: 'md',
  },
  decorators: [
    (Story) => (
      <Box>
        <Story />
        <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '400px' }}>
          <Typography variant="h4">Page Content</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This is the main page content below the horizontal navigation.
          </Typography>
        </Box>
      </Box>
    ),
  ],
};

export const MegaMenu: Story = {
  args: {
    variant: 'mega',
    items: megaMenuItems,
    size: 'md',
    logo,
  },
  decorators: [
    (Story) => (
      <Box>
        <Story />
        <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '300px' }}>
          <Typography variant="h4">Content Below Mega Menu</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            The mega menu organizes navigation items into logical sections.
          </Typography>
        </Box>
      </Box>
    ),
  ],
};

export const SmallSize: Story = {
  args: {
    variant: 'vertical',
    items: basicVerticalItems,
    size: 'sm',
    logo,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '500px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h5">Small Size Menu</Typography>
        </Box>
      </Box>
    ),
  ],
};

export const LargeSize: Story = {
  args: {
    variant: 'vertical',
    items: basicVerticalItems,
    size: 'lg',
    logo,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4">Large Size Menu</Typography>
        </Box>
      </Box>
    ),
  ],
};

export const WithBadgesAndDescriptions: Story = {
  args: {
    variant: 'vertical',
    items: [
      {
        id: '1',
        label: 'Dashboard',
        description: 'Overview of your business',
        icon: <Dashboard />,
        href: '#',
        active: true,
      },
      {
        id: '2',
        label: 'Orders',
        description: 'Manage customer orders',
        icon: <ShoppingCart />,
        href: '#',
        badge: 5,
      },
      {
        id: '3',
        label: 'Messages',
        description: 'Customer communications',
        icon: <Notifications />,
        href: '#',
        badge: '12',
      },
      {
        id: '4',
        label: 'Reports',
        description: 'Business analytics',
        icon: <Analytics />,
        href: '#',
      },
    ],
    size: 'md',
    logo,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4">With Badges & Descriptions</Typography>
        </Box>
      </Box>
    ),
  ],
};

export const DeepNesting: Story = {
  args: {
    variant: 'vertical',
    items: [
      {
        id: '1',
        label: 'Dashboard',
        icon: <Dashboard />,
        href: '#',
        active: true,
      },
      {
        id: '2',
        label: 'E-commerce',
        icon: <ShoppingCart />,
        children: [
          {
            id: '2-1',
            label: 'Products',
            children: [
              { id: '2-1-1', label: 'All Products', href: '#' },
              { id: '2-1-2', label: 'Categories', href: '#' },
              { id: '2-1-3', label: 'Brands', href: '#' },
            ],
          },
          {
            id: '2-2',
            label: 'Orders',
            children: [
              { id: '2-2-1', label: 'All Orders', href: '#' },
              { id: '2-2-2', label: 'Pending', href: '#', badge: 3 },
              { id: '2-2-3', label: 'Completed', href: '#' },
            ],
          },
          { id: '2-3', label: 'Customers', href: '#' },
        ],
      },
      {
        id: '3',
        label: 'Analytics',
        icon: <Analytics />,
        children: [
          { id: '3-1', label: 'Overview', href: '#' },
          { id: '3-2', label: 'Sales Report', href: '#' },
          { id: '3-3', label: 'Traffic', href: '#' },
        ],
      },
    ],
    size: 'md',
    logo,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4">Deep Nesting Example</Typography>
        </Box>
      </Box>
    ),
  ],
};
