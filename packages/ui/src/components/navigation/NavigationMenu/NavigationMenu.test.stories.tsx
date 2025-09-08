import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor } from '@storybook/test';
import {
  Dashboard,
  ShoppingCart,
  People,
  Settings,
  Analytics,
  Inventory,
  Notifications,
  Home,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { NavigationMenu } from './NavigationMenu';
import type { NavigationMenuItem } from './NavigationMenu.types';

const meta: Meta<typeof NavigationMenu> = {
  title: 'Navigation/NavigationMenu/Tests',
  component: NavigationMenu,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test data
const testItems: NavigationMenuItem[] = [
  {
    id: '1',
    label: 'Dashboard',
    icon: <Dashboard />,
    href: '#dashboard',
    active: true,
  },
  {
    id: '2',
    label: 'Orders',
    icon: <ShoppingCart />,
    href: '#orders',
    badge: 5,
  },
  {
    id: '3',
    label: 'Customers',
    icon: <People />,
    href: '#customers',
    disabled: true,
  },
  {
    id: '4',
    label: 'Analytics',
    icon: <Analytics />,
    children: [
      { id: '4-1', label: 'Overview', href: '#overview' },
      { id: '4-2', label: 'Reports', href: '#reports' },
      { id: '4-3', label: 'Insights', href: '#insights' },
    ],
  },
  {
    id: '5',
    label: 'Settings',
    icon: <Settings />,
    href: '#settings',
  },
];

const nestedItems: NavigationMenuItem[] = [
  {
    id: '1',
    label: 'Products',
    icon: <Inventory />,
    children: [
      {
        id: '1-1',
        label: 'Categories',
        children: [
          { id: '1-1-1', label: 'Electronics', href: '#electronics' },
          { id: '1-1-2', label: 'Clothing', href: '#clothing' },
        ],
      },
      { id: '1-2', label: 'Brands', href: '#brands' },
    ],
  },
];

// 1. Basic Interaction Tests
export const BasicInteraction: Story = {
  args: {
    variant: 'vertical',
    items: testItems,
    size: 'md',
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Content Area</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test clicking on menu items
    const ordersItem = canvas.getByText('Orders');
    await userEvent.click(ordersItem);

    // Test expandable items
    const analyticsItem = canvas.getByText('Analytics');
    await userEvent.click(analyticsItem);

    // Wait for submenu to appear
    await waitFor(() => {
      expect(canvas.getByText('Overview')).toBeInTheDocument();
      expect(canvas.getByText('Reports')).toBeInTheDocument();
    });

    // Test clicking submenu item
    const overviewItem = canvas.getByText('Overview');
    await userEvent.click(overviewItem);

    // Test disabled item (should not be clickable)
    const customersItem = canvas.getByText('Customers');
    const customersButton = customersItem.closest('div[role="button"]');
    expect(customersButton).toHaveAttribute('aria-disabled', 'true');

    // Test badge display
    const badge = canvas.getByText('5');
    expect(badge).toBeInTheDocument();
  },
};

// 2. Collapsible Menu Interaction
export const CollapsibleMenuInteraction: Story = {
  args: {
    variant: 'vertical',
    items: testItems,
    collapsible: true,
    logo: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Home />
        <Typography>Logo</Typography>
      </Box>
    ),
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Content Area</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click collapse button
    const collapseButton = canvas.getByText('Collapse');
    await userEvent.click(collapseButton);

    // Wait for animation
    await waitFor(
      () => {
        // When collapsed, text should not be visible
        expect(canvas.queryByText('Dashboard')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    // Click collapse button again to expand
    const menuIcon = canvas.getAllByTestId('MenuIcon')[0];
    await userEvent.click(menuIcon.parentElement!);

    // Wait for expansion
    await waitFor(() => {
      expect(canvas.getByText('Dashboard')).toBeInTheDocument();
    });
  },
};

// 3. Keyboard Navigation Tests
export const KeyboardNavigation: Story = {
  args: {
    variant: 'vertical',
    items: testItems,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Content Area</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Focus first item
    const dashboardItem = canvas.getByText('Dashboard').closest('div[role="button"]');
    dashboardItem?.focus();

    // Navigate with Tab key
    await userEvent.tab();
    const activeElement = document.activeElement;
    expect(activeElement?.textContent).toContain('Orders');

    // Press Enter to activate
    await userEvent.keyboard('{Enter}');

    // Navigate to expandable item
    await userEvent.tab();
    await userEvent.tab();

    // Expand with Enter
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(canvas.getByText('Overview')).toBeInTheDocument();
    });

    // Navigate through submenu
    await userEvent.tab();
    const subMenuItem = document.activeElement;
    expect(subMenuItem?.textContent).toContain('Overview');
  },
};

// 4. Screen Reader Accessibility Tests
export const ScreenReaderAccessibility: Story = {
  args: {
    variant: 'vertical',
    items: testItems,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Content Area</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check ARIA attributes
    const dashboardButton = canvas.getByText('Dashboard').closest('div[role="button"]');
    expect(dashboardButton).toHaveAttribute('role', 'button');

    // Check disabled item has proper ARIA
    const customersButton = canvas.getByText('Customers').closest('div[role="button"]');
    expect(customersButton).toHaveAttribute('aria-disabled', 'true');

    // Check list structure
    const list = canvas.getByRole('list');
    expect(list).toBeInTheDocument();

    // Check badge accessibility
    const badge = canvas.getByText('5');
    expect(badge.parentElement).toHaveClass('MuiBadge-badge');
  },
};

// 5. Focus Management Tests
export const FocusManagement: Story = {
  args: {
    variant: 'vertical',
    items: testItems,
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Content Area</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test focus ring visibility
    const dashboardItem = canvas.getByText('Dashboard').closest('div[role="button"]');
    dashboardItem?.focus();

    // Check focus is visible
    expect(dashboardItem).toHaveFocus();

    // Test focus trap in expanded menu
    const analyticsItem = canvas.getByText('Analytics');
    await userEvent.click(analyticsItem);

    await waitFor(() => {
      expect(canvas.getByText('Overview')).toBeInTheDocument();
    });

    // Focus should move to submenu items
    const overviewItem = canvas.getByText('Overview').closest('div[role="button"]');
    overviewItem?.focus();
    expect(overviewItem).toHaveFocus();
  },
};

// 6. Responsive Design Tests
export const ResponsiveDesign: Story = {
  args: {
    variant: 'horizontal',
    items: testItems.slice(0, 5),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <Box>
        <Story />
        <Box sx={{ p: 3 }}>
          <Typography>Mobile View Content</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check horizontal layout renders properly
    const nav = canvas.getByRole('list');
    expect(nav).toBeInTheDocument();

    // Check items are visible
    expect(canvas.getByText('Dashboard')).toBeInTheDocument();
    expect(canvas.getByText('Orders')).toBeInTheDocument();
  },
};

// 7. Theme Variations Tests
export const ThemeVariations: Story = {
  args: {
    variant: 'vertical',
    items: testItems,
    color: 'primary',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Large Size Theme</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check size variations are applied
    const dashboardText = canvas.getByText('Dashboard');
    const dashboardButton = dashboardText.closest('div[role="button"]');

    // Large size should have more padding
    const styles = window.getComputedStyle(dashboardButton!);
    expect(parseInt(styles.padding)).toBeGreaterThan(8);

    // Check active state styling
    expect(dashboardButton).toHaveStyle({
      color: expect.stringContaining('rgb'),
    });
  },
};

// 8. Visual States Tests
export const VisualStates: Story = {
  args: {
    variant: 'vertical',
    items: [
      { id: '1', label: 'Active Item', icon: <Dashboard />, active: true, href: '#' },
      { id: '2', label: 'Hover Item', icon: <ShoppingCart />, href: '#' },
      { id: '3', label: 'Disabled Item', icon: <People />, disabled: true, href: '#' },
      { id: '4', label: 'With Badge', icon: <Notifications />, badge: '99+', href: '#' },
    ],
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '400px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Visual States Demo</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test hover state
    const hoverItem = canvas.getByText('Hover Item');
    await userEvent.hover(hoverItem);

    // Test active state is visible
    const activeItem = canvas.getByText('Active Item').closest('div[role="button"]');
    expect(activeItem).toHaveStyle({
      backgroundColor: expect.stringContaining('rgba'),
    });

    // Test disabled state
    const disabledItem = canvas.getByText('Disabled Item').closest('div[role="button"]');
    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

    // Test badge display
    const badge = canvas.getByText('99+');
    expect(badge).toBeInTheDocument();
  },
};

// 9. Performance Tests
export const PerformanceTest: Story = {
  args: {
    variant: 'vertical',
    items: Array.from({ length: 50 }, (_, i) => ({
      id: `item-${i}`,
      label: `Menu Item ${i + 1}`,
      icon: i % 3 === 0 ? <Dashboard /> : i % 3 === 1 ? <ShoppingCart /> : <People />,
      href: `#item-${i}`,
      badge: i % 5 === 0 ? i : undefined,
    })),
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Performance Test - 50 Items</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const startTime = window.performance.now();
    const canvas = within(canvasElement);

    // Check all items render
    await waitFor(() => {
      expect(canvas.getByText('Menu Item 1')).toBeInTheDocument();
      expect(canvas.getByText('Menu Item 50')).toBeInTheDocument();
    });

    const endTime = window.performance.now();
    const renderTime = endTime - startTime;

    // Should render within reasonable time (3 seconds)
    expect(renderTime).toBeLessThan(3000);

    // Test scrolling performance
    const list = canvas.getByRole('list');
    list.scrollTop = 500;

    await waitFor(() => {
      expect(list.scrollTop).toBe(500);
    });
  },
};

// 10. Edge Cases Tests
export const EdgeCases: Story = {
  args: {
    variant: 'vertical',
    items: [
      {
        id: '1',
        label: 'Very Long Menu Item Label That Should Wrap or Truncate Properly',
        icon: <Dashboard />,
        href: '#',
      },
      {
        id: '2',
        label: 'Item with Very Long Description',
        description:
          'This is a very long description that should be handled properly without breaking the layout',
        icon: <ShoppingCart />,
        href: '#',
      },
      {
        id: '3',
        label: 'Deep Nesting',
        icon: <Inventory />,
        children: nestedItems,
      },
      {
        id: '4',
        label: '', // Empty label
        icon: <Settings />,
        href: '#',
      },
      {
        id: '5',
        label: 'No Icon Item',
        href: '#',
      },
    ],
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Edge Cases Test</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test long text handling
    const longLabel = canvas.getByText(/Very Long Menu Item Label/);
    expect(longLabel).toBeInTheDocument();

    // Test description rendering
    const description = canvas.getByText(/This is a very long description/);
    expect(description).toBeInTheDocument();

    // Test deep nesting
    const deepNestingItem = canvas.getByText('Deep Nesting');
    await userEvent.click(deepNestingItem);

    await waitFor(() => {
      expect(canvas.getByText('Products')).toBeInTheDocument();
    });

    const productsItem = canvas.getByText('Products');
    await userEvent.click(productsItem);

    await waitFor(() => {
      expect(canvas.getByText('Categories')).toBeInTheDocument();
    });

    // Test item without icon
    const noIconItem = canvas.getByText('No Icon Item');
    expect(noIconItem).toBeInTheDocument();
  },
};

// 11. Integration Tests
export const IntegrationTest: Story = {
  args: {
    variant: 'mega',
    items: [
      {
        id: 'section1',
        label: 'Products',
        children: [
          { id: 's1-1', label: 'All Products', icon: <Inventory />, href: '#' },
          { id: 's1-2', label: 'Categories', icon: <Dashboard />, href: '#' },
        ],
      },
      {
        id: 'section2',
        label: 'Analytics',
        children: [
          { id: 's2-1', label: 'Reports', icon: <Analytics />, href: '#' },
          { id: 's2-2', label: 'Insights', icon: <Settings />, href: '#' },
        ],
      },
    ],
    logo: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Home />
        <Typography variant="h6">MegaMenu</Typography>
      </Box>
    ),
  },
  decorators: [
    (Story) => (
      <Box>
        <Story />
        <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '400px' }}>
          <Typography variant="h4">Integration Test - Mega Menu</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test mega menu sections render
    expect(canvas.getByText('Products')).toBeInTheDocument();
    expect(canvas.getByText('Analytics')).toBeInTheDocument();

    // Test logo renders
    expect(canvas.getByText('MegaMenu')).toBeInTheDocument();

    // Test section items
    expect(canvas.getByText('All Products')).toBeInTheDocument();
    expect(canvas.getByText('Reports')).toBeInTheDocument();

    // Test clicking items in mega menu
    const allProductsItem = canvas.getByText('All Products');
    await userEvent.click(allProductsItem);

    // Check grid layout
    const sections = canvas.getAllByRole('heading', { level: 6 });
    expect(sections).toHaveLength(2);
  },
};
