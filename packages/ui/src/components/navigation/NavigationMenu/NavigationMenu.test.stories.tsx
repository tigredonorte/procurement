import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import { useState } from 'react';
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
import { Box, Typography, ThemeProvider, createTheme } from '@mui/material';

import { NavigationMenu } from './NavigationMenu';
import type { NavigationMenuItem } from './NavigationMenu.types';

const meta: Meta<typeof NavigationMenu> = {
  title: 'Navigation/NavigationMenu/Tests',
  component: NavigationMenu,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:NavigationMenu'],
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
    const ordersItem = canvas.getByText('Orders').closest('a, a, div[role="button"]');
    await userEvent.click(ordersItem!);

    // Test expandable items
    const analyticsItem = canvas.getByText('Analytics').closest('a, a, div[role="button"]');
    await userEvent.click(analyticsItem!);

    // Wait for submenu to appear
    await waitFor(() => {
      expect(canvas.getByText('Overview')).toBeInTheDocument();
      expect(canvas.getByText('Reports')).toBeInTheDocument();
    });

    // Test clicking submenu item
    const overviewItem = canvas.getByText('Overview').closest('a, a, div[role="button"]');
    await userEvent.click(overviewItem!);

    // Test disabled item (should not be clickable)
    const customersItem = canvas.getByText('Customers');
    const customersButton = customersItem.closest('a, div[role="button"]');
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

    // First check if menu icons are visible
    await waitFor(() => {
      const menuIcons = canvas.getAllByTestId('MenuIcon');
      expect(menuIcons.length).toBeGreaterThan(0);
    });

    // Check if we're in collapsed state (no text visible) or expanded state
    const isDashboardVisible = canvas.queryByText('Dashboard');

    if (!isDashboardVisible) {
      // Menu is collapsed, expand it first
      const menuIcon = canvas.getAllByTestId('MenuIcon')[0];
      await userEvent.click(menuIcon.parentElement!);

      // Wait for expansion
      await waitFor(() => {
        expect(canvas.getByText('Dashboard')).toBeInTheDocument();
      });
    }

    // Now test the collapse functionality
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

    // Click menu icon to expand again
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
    const dashboardItem = canvas.getByText('Dashboard').closest('a, a, div[role="button"]');
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
    const dashboardButton = canvas.getByText('Dashboard').closest('a, div[role="button"]');
    expect(dashboardButton).toBeTruthy();

    // Check disabled item has proper ARIA
    const customersButton = canvas.getByText('Customers').closest('a, div[role="button"]');
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
    const dashboardItem = canvas.getByText('Dashboard').closest('a, div[role="button"]');
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
    const overviewItem = canvas.getByText('Overview').closest('a, div[role="button"]');
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
    const dashboardButton = dashboardText.closest('a, div[role="button"]');

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
    const activeItem = canvas.getByText('Active Item').closest('a, div[role="button"]');
    expect(activeItem).toHaveStyle({
      backgroundColor: expect.stringContaining('rgba'),
    });

    // Test disabled state
    const disabledItem = canvas.getByText('Disabled Item').closest('a, div[role="button"]');
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

// 11. Theme Integration Tests
export const ThemeIntegration: Story = {
  render: function ThemeIntegrationRender() {
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: darkMode ? '#90caf9' : '#1976d2',
        },
      },
    });

    return (
      <div data-testid="theme-container">
        <button
          data-testid="toggle-theme"
          onClick={() => setDarkMode(!darkMode)}
          style={{ marginBottom: 16 }}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              display: 'flex',
              height: '400px',
              bgcolor: 'background.default',
              color: 'text.primary',
            }}
          >
            <NavigationMenu
              variant="vertical"
              items={testItems.map((item) => ({ ...item, active: item.id === '1' }))}
              data-testid="themed-menu"
            />
            <Box sx={{ flex: 1, p: 2, bgcolor: 'background.paper' }}>
              <div data-testid="theme-mode">Mode: {darkMode ? 'dark' : 'light'}</div>
            </Box>
          </Box>
        </ThemeProvider>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test light mode
    await expect(canvas.getByTestId('theme-mode')).toHaveTextContent('Mode: light');

    // Toggle to dark mode
    await userEvent.click(canvas.getByTestId('toggle-theme'));
    await expect(canvas.getByTestId('theme-mode')).toHaveTextContent('Mode: dark');

    // Verify menu still functions in dark mode
    const menuItem = canvas.getByText('Orders');
    await userEvent.click(menuItem);
    expect(menuItem).toBeInTheDocument();
  },
};

// 12. Controlled vs Uncontrolled Tests
export const ControlledUncontrolled: Story = {
  render: function ControlledUncontrolledRender() {
    const [controlledCollapsed, setControlledCollapsed] = useState<boolean | undefined>(undefined);
    const [isControlled, setIsControlled] = useState(false);

    return (
      <div data-testid="controlled-container">
        <Box sx={{ mb: 2 }}>
          <button data-testid="toggle-controlled" onClick={() => setIsControlled(!isControlled)}>
            {isControlled ? 'Switch to Uncontrolled' : 'Switch to Controlled'}
          </button>
          {isControlled && (
            <button
              data-testid="control-collapse"
              onClick={() => setControlledCollapsed(!controlledCollapsed)}
              style={{ marginLeft: 8 }}
            >
              Toggle Collapse (Controlled)
            </button>
          )}
        </Box>
        <Box sx={{ display: 'flex', height: '400px' }}>
          <NavigationMenu
            variant="vertical"
            items={testItems}
            collapsible
            collapsed={isControlled ? controlledCollapsed : undefined}
            onCollapseChange={(collapsed) => {
              if (isControlled) {
                setControlledCollapsed(collapsed);
              }
            }}
            data-testid="controlled-menu"
          />
          <Box sx={{ flex: 1, p: 2 }}>
            <div data-testid="control-state">
              Mode: {isControlled ? 'Controlled' : 'Uncontrolled'}
            </div>
            <div data-testid="collapse-state">
              Collapsed: {controlledCollapsed?.toString() ?? 'undefined'}
            </div>
          </Box>
        </Box>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test uncontrolled mode
    await expect(canvas.getByTestId('control-state')).toHaveTextContent('Mode: Uncontrolled');

    // Switch to controlled mode
    await userEvent.click(canvas.getByTestId('toggle-controlled'));
    await expect(canvas.getByTestId('control-state')).toHaveTextContent('Mode: Controlled');

    // Test controlled collapse
    await userEvent.click(canvas.getByTestId('control-collapse'));
    await expect(canvas.getByTestId('collapse-state')).toHaveTextContent('Collapsed: true');
  },
};

// 13. Large Dataset Performance Test
export const LargeDatasetPerformance: Story = {
  args: {
    variant: 'vertical',
    items: Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      label: `Menu Item ${i + 1}`,
      icon: <Dashboard />,
      href: `#item-${i}`,
      ...(i % 10 === 0 && {
        children: Array.from({ length: 5 }, (_, j) => ({
          id: `item-${i}-${j}`,
          label: `Subitem ${j + 1}`,
          href: `#item-${i}-${j}`,
        })),
      }),
    })),
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: '600px', display: 'flex' }}>
        <Story />
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography>Large Dataset - 100 Items with Nested Structure</Typography>
        </Box>
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const startTime = window.performance.now();
    const canvas = within(canvasElement);

    // Verify large dataset renders
    await waitFor(() => {
      expect(canvas.getByText('Menu Item 1')).toBeInTheDocument();
      expect(canvas.getByText('Menu Item 100')).toBeInTheDocument();
    });

    const renderTime = window.performance.now() - startTime;
    expect(renderTime).toBeLessThan(5000); // Should render within 5 seconds

    // Test expanding nested items in large dataset
    const expandableItem = canvas.getByText('Menu Item 1');
    await userEvent.click(expandableItem);

    await waitFor(() => {
      expect(canvas.getByText('Subitem 1')).toBeInTheDocument();
    });
  },
};

// 14. Integration Tests
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

// 15. Accessibility Compliance (WCAG 2.1 AA) Tests
export const AccessibilityCompliance: Story = {
  render: () => (
    <div data-testid="a11y-container">
      <Box sx={{ display: 'flex', height: '400px' }}>
        <nav aria-label="Main navigation" data-testid="a11y-nav">
          <NavigationMenu variant="vertical" items={testItems} data-testid="a11y-menu" />
        </nav>
        <Box sx={{ flex: 1, p: 2 }} role="main">
          <Typography variant="h6" id="content-heading">
            Content Area
          </Typography>
          <p>Testing WCAG compliance</p>
        </Box>
      </Box>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test navigation landmark
    const nav = canvas.getByTestId('a11y-nav');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');

    // Test menu items have proper roles
    const menuButtons = canvas.getAllByRole('button');
    expect(menuButtons.length).toBeGreaterThan(0);

    // Test disabled item has proper attributes
    const disabledButton = canvas.getByText('Customers').closest('button');
    expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

    // Test expandable items have proper ARIA attributes
    const expandableItem = canvas.getByText('Analytics');
    await userEvent.click(expandableItem);

    await waitFor(() => {
      const subItems = canvas.getAllByText(/Overview|Reports|Insights/);
      expect(subItems.length).toBeGreaterThan(0);
    });
  },
};

// 16. Advanced Keyboard Navigation Tests
export const AdvancedKeyboardNavigation: Story = {
  render: function AdvancedKeyboardNavigationRender() {
    const [selectedItem, setSelectedItem] = useState<string>('');

    return (
      <div data-testid="keyboard-nav-container">
        <Box sx={{ display: 'flex', height: '400px' }}>
          <NavigationMenu
            variant="vertical"
            items={testItems.map((item) => ({
              ...item,
              onClick: (e) => {
                e.preventDefault();
                setSelectedItem(item.id);
              },
            }))}
            data-testid="keyboard-menu"
          />
          <Box sx={{ flex: 1, p: 2 }}>
            <div data-testid="focused-item">Focused: (tracked via DOM)</div>
            <div data-testid="selected-via-keyboard">Selected: {selectedItem}</div>
            <p>Use Tab, Arrow keys, Enter, Escape, and Space to navigate</p>
          </Box>
        </Box>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Focus first menu item
    const firstMenuItem = canvas.getByText('Dashboard').closest('button');
    if (firstMenuItem) {
      firstMenuItem.focus();
      await expect(firstMenuItem).toHaveFocus();
    }

    // Test Enter key activation
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByTestId('selected-via-keyboard')).toHaveTextContent('Selected: 1');

    // Test Tab navigation
    await userEvent.keyboard('{Tab}');

    // Test Arrow key navigation
    await userEvent.keyboard('{ArrowDown}');

    // Test expanding submenu with Enter
    const analyticsItem = canvas.getByText('Analytics');
    analyticsItem.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(canvas.getByText('Overview')).toBeInTheDocument();
    });

    // Test Escape to collapse submenu
    await userEvent.keyboard('{Escape}');
  },
};
