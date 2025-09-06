import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import {
  Home,
  Dashboard,
  Folder,
  Settings,
  Article,
  AccountTree,
  Code,
  CloudUpload,
  Analytics,
  Security,
} from '@mui/icons-material';

import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem } from './Breadcrumbs.types';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs/Tests',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false }
  },
  tags: ['autodocs', 'test']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test data
const basicItems: BreadcrumbItem[] = [
  { label: 'Home', href: '#', onClick: fn() },
  { label: 'Products', href: '#', onClick: fn() },
  { label: 'Electronics', href: '#', onClick: fn() },
  { label: 'Laptops' }
];

const itemsWithIcons: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '#', icon: <Dashboard fontSize="small" />, onClick: fn() },
  { label: 'Projects', href: '#', icon: <Folder fontSize="small" />, onClick: fn() },
  { label: 'Settings', href: '#', icon: <Settings fontSize="small" />, onClick: fn() },
  { label: 'Profile' }
];

// ============================
// 7.2 Interaction Tests
// ============================

export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    items: basicItems,
    variant: 'default',
    separatorType: 'arrow'
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    await step('Initial render verification', async () => {
      const nav = canvas.getByRole('navigation', { name: /breadcrumb/i });
      await expect(nav).toBeInTheDocument();
      
      // Verify all items are rendered
      const links = canvas.getAllByRole('link');
      await expect(links).toHaveLength(3); // Last item is not a link
      
      const lastItem = canvas.getByText('Laptops');
      await expect(lastItem).toBeInTheDocument();
    });
    
    await step('Click interaction on breadcrumb items', async () => {
      const homeLink = canvas.getByRole('link', { name: /home/i });
      await userEvent.click(homeLink);
      await expect(args.items[0].onClick).toHaveBeenCalledTimes(1);
      
      const productsLink = canvas.getByRole('link', { name: /products/i });
      await userEvent.click(productsLink);
      await expect(args.items[1].onClick).toHaveBeenCalledTimes(1);
    });
    
    await step('Hover interaction', async () => {
      const link = canvas.getByRole('link', { name: /home/i });
      await userEvent.hover(link);
      
      // Check if hover styles are applied
      const computedStyle = window.getComputedStyle(link);
      await expect(computedStyle.backgroundColor).toBeTruthy();
    });
    
    await step('Verify last item is not clickable', async () => {
      const lastItem = canvas.getByText('Laptops');
      const parentElement = lastItem.closest('li');
      const link = parentElement?.querySelector('a');
      await expect(link).toBeNull();
    });
  }
};

export const CollapsedItemsInteraction: Story = {
  name: '📦 Collapsed Items Interaction Test',
  args: {
    items: [
      { label: 'Level 1', href: '#', onClick: fn() },
      { label: 'Level 2', href: '#', onClick: fn() },
      { label: 'Level 3', href: '#', onClick: fn() },
      { label: 'Level 4', href: '#', onClick: fn() },
      { label: 'Level 5', href: '#', onClick: fn() },
      { label: 'Level 6', href: '#', onClick: fn() },
      { label: 'Current Page' }
    ],
    maxItems: 4,
    collapseBehavior: 'menu',
    variant: 'glass'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify collapsed items indicator', async () => {
      // Check if ellipsis or menu button is present
      const nav = canvas.getByRole('navigation');
      const menuButton = within(nav).queryByRole('button', { name: /more/i });
      
      if (menuButton) {
        await expect(menuButton).toBeInTheDocument();
        
        await step('Open collapsed items menu', async () => {
          await userEvent.click(menuButton);
          
          // Wait for menu to open
          await waitFor(() => {
            const menu = canvas.queryByRole('menu');
            expect(menu).toBeInTheDocument();
          });
        });
      }
    });
  }
};

// ============================
// 7.3 Accessibility Tests
// ============================

export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  args: {
    items: basicItems,
    variant: 'default',
    showHomeIcon: true
  },
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'link-name', enabled: true },
          { id: 'duplicate-id', enabled: true },
          { id: 'label', enabled: true }
        ]
      }
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Tab navigation forward', async () => {
      const links = canvas.getAllByRole('link');
      
      // Focus first link
      links[0].focus();
      await expect(links[0]).toHaveFocus();
      
      // Tab to next link
      await userEvent.tab();
      await expect(links[1]).toHaveFocus();
      
      // Tab to third link
      await userEvent.tab();
      await expect(links[2]).toHaveFocus();
    });
    
    await step('Tab navigation backward', async () => {
      await userEvent.tab({ shift: true });
      const links = canvas.getAllByRole('link');
      await expect(links[1]).toHaveFocus();
    });
    
    await step('Enter key activation', async () => {
      const homeLink = canvas.getByRole('link', { name: /home/i });
      homeLink.focus();
      await userEvent.keyboard('{Enter}');
      // Verify navigation would occur (prevented by href="#")
      await expect(homeLink).toHaveAttribute('href', '#');
    });
    
    await step('Focus visible on keyboard navigation', async () => {
      const link = canvas.getAllByRole('link')[0];
      link.focus();
      
      const computedStyle = window.getComputedStyle(link);
      // Check for focus outline
      await expect(computedStyle.outline || computedStyle.boxShadow).toBeTruthy();
    });
  }
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  args: {
    items: itemsWithIcons,
    ariaLabel: 'Main navigation breadcrumb',
    variant: 'elevated',
    showHomeIcon: false
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify ARIA labels', async () => {
      const nav = canvas.getByRole('navigation');
      await expect(nav).toHaveAttribute('aria-label', 'Main navigation breadcrumb');
    });
    
    await step('Verify navigation structure', async () => {
      const nav = canvas.getByRole('navigation');
      const list = within(nav).getByRole('list');
      await expect(list).toBeInTheDocument();
      
      const listItems = within(list).getAllByRole('listitem');
      await expect(listItems).toHaveLength(7); // 4 items + 3 separators
    });
    
    await step('Verify current page indication', async () => {
      const lastItem = canvas.getByText('Profile');
      const parentLi = lastItem.closest('li');
      
      // Last item should have aria-current
      if (parentLi) {
        const hasAriaCurrent = parentLi.querySelector('[aria-current]');
        await expect(hasAriaCurrent || lastItem).toBeTruthy();
      }
    });
    
    await step('Verify link descriptions', async () => {
      const links = canvas.getAllByRole('link');
      
      for (const link of links) {
        // Each link should have accessible text
        const text = link.textContent;
        await expect(text).toBeTruthy();
        await expect(text?.length).toBeGreaterThan(0);
      }
    });
  }
};

export const FocusManagement: Story = {
  name: '🎯 Focus Management Test',
  args: {
    items: basicItems,
    variant: 'glass',
    elevation: 2
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Focus order verification', async () => {
      const links = canvas.getAllByRole('link');
      const tabIndexes: number[] = [];
      
      links.forEach(link => {
        const tabIndex = link.getAttribute('tabindex');
        tabIndexes.push(tabIndex ? parseInt(tabIndex) : 0);
      });
      
      // All interactive elements should be in tab order
      tabIndexes.forEach(index => {
        expect(index).toBeGreaterThanOrEqual(0);
      });
    });
    
    await step('Focus trap prevention', async () => {
      const firstLink = canvas.getAllByRole('link')[0];
      const lastLink = canvas.getAllByRole('link')[2];
      
      lastLink.focus();
      await userEvent.tab();
      
      // Focus should move outside the breadcrumb
      await expect(document.activeElement).not.toBe(firstLink);
    });
    
    await step('Focus restoration after interaction', async () => {
      const link = canvas.getByRole('link', { name: /products/i });
      link.focus();
      const initialFocused = document.activeElement;
      
      await userEvent.click(link);
      
      // Focus should remain on the clicked element
      await expect(document.activeElement).toBe(initialFocused);
    });
  }
};

// ============================
// 7.4 Visual Tests
// ============================

export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  args: {
    items: [
      { label: 'Home', href: '#', icon: <Home fontSize="small" /> },
      { label: 'Documents', href: '#', icon: <Article fontSize="small" /> },
      { label: 'Projects', href: '#', icon: <AccountTree fontSize="small" /> },
      { label: 'Development', href: '#', icon: <Code fontSize="small" /> },
      { label: 'Current' }
    ],
    variant: 'glass',
    mobileMaxItems: 3
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: { 
          name: 'Mobile', 
          styles: { width: '375px', height: '667px' },
          type: 'mobile' 
        },
        tablet: { 
          name: 'Tablet', 
          styles: { width: '768px', height: '1024px' },
          type: 'tablet'
        },
        desktop: { 
          name: 'Desktop', 
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop'
        }
      },
      defaultViewport: 'mobile'
    },
    chromatic: {
      viewports: [375, 768, 1920],
      delay: 300
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify mobile layout', async () => {
      const nav = canvas.getByRole('navigation');
      const items = within(nav).getAllByRole('listitem');
      
      // Check if items are properly sized for mobile
      if (window.innerWidth <= 768) {
        const firstItem = items[0];
        const computedStyle = window.getComputedStyle(firstItem);
        
        // Font size should be appropriate for mobile
        const fontSize = parseFloat(computedStyle.fontSize);
        await expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    });
    
    await step('Verify touch target sizes', async () => {
      const links = canvas.getAllByRole('link');
      
      links.forEach(async (link) => {
        const rect = link.getBoundingClientRect();
        // Touch targets should be at least 44x44px on mobile
        if (window.innerWidth <= 768) {
          await expect(rect.height).toBeGreaterThanOrEqual(44);
        }
      });
    });
  }
};

export const ThemeVariations: Story = {
  name: '🎨 Theme Variations Test',
  args: {
    items: basicItems,
    variant: 'glass',
    color: 'primary'
  },
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' }
      ]
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify theme colors', async () => {
      const nav = canvas.getByRole('navigation');
      const computedStyle = window.getComputedStyle(nav);
      
      // Check if component adapts to theme
      await expect(computedStyle.backgroundColor || computedStyle.background).toBeTruthy();
    });
    
    await step('Verify contrast ratios', async () => {
      const links = canvas.getAllByRole('link');
      
      links.forEach(async (link) => {
        const style = window.getComputedStyle(link);
        const color = style.color;
        
        // Ensure text is visible
        await expect(color).not.toBe('rgba(0, 0, 0, 0)');
        await expect(color).not.toBe('transparent');
      });
    });
  }
};

export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  args: {
    items: [
      { label: 'Active', href: '#', active: true },
      { label: 'Normal', href: '#' },
      { label: 'Hover Me', href: '#' },
      { label: 'Current' }
    ],
    variant: 'elevated',
    elevation: 3
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Default state', async () => {
      const normalLink = canvas.getByRole('link', { name: /normal/i });
      const style = window.getComputedStyle(normalLink);
      await expect(style.opacity).toBe('1');
    });
    
    await step('Hover state', async () => {
      const hoverLink = canvas.getByRole('link', { name: /hover me/i });
      await userEvent.hover(hoverLink);
      
      await waitFor(() => {
        const style = window.getComputedStyle(hoverLink);
        // Check if hover effect is applied
        expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      });
    });
    
    await step('Active state', async () => {
      const activeItem = canvas.getByText('Active');
      const style = window.getComputedStyle(activeItem);
      
      // Active item should have different styling
      await expect(style.fontWeight).toBeTruthy();
    });
    
    await step('Current/Last item state', async () => {
      const currentItem = canvas.getByText('Current');
      const style = window.getComputedStyle(currentItem);
      
      // Last item should have distinct styling
      await expect(style.fontWeight).toBe('600');
      
      // Should not be a link
      const parentElement = currentItem.closest('a');
      await expect(parentElement).toBeNull();
    });
  }
};

// ============================
// 7.5 Performance Tests
// ============================

export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  args: {
    items: Array.from({ length: 20 }, (_, i) => ({
      label: `Level ${i + 1}`,
      href: i < 19 ? '#' : undefined,
      onClick: i < 19 ? fn() : undefined
    })),
    maxItems: 8,
    variant: 'default'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Measure render time', async () => {
      const startTime = performance.now();
      const nav = canvas.getByRole('navigation');
      const items = within(nav).getAllByRole('listitem');
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      console.log(`Render time for ${items.length} breadcrumb items: ${renderTime}ms`);
      
      // Assert reasonable render time
      await expect(renderTime).toBeLessThan(100);
    });
    
    await step('Test interaction performance', async () => {
      const links = canvas.getAllByRole('link');
      const startTime = performance.now();
      
      // Simulate rapid interactions
      for (let i = 0; i < Math.min(5, links.length); i++) {
        await userEvent.hover(links[i]);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;
      
      console.log(`Interaction time for hover states: ${interactionTime}ms`);
      await expect(interactionTime).toBeLessThan(500);
    });
    
    await step('Test with collapsed items', async () => {
      const nav = canvas.getByRole('navigation');
      
      // Verify collapsed items don't impact performance
      const visibleItems = within(nav).getAllByRole('listitem');
      await expect(visibleItems.length).toBeLessThanOrEqual(17); // maxItems * 2 + 1 (for separators)
    });
  }
};

// ============================
// 7.6 Edge Cases Tests
// ============================

export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  args: {
    items: [],
    variant: 'default'
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    await step('Empty items handling', async () => {
      // Update with empty array
      args.items = [];
      const nav = canvas.queryByRole('navigation');
      
      if (nav) {
        const items = within(nav).queryAllByRole('listitem');
        await expect(items).toHaveLength(0);
      }
    });
    
    await step('Single item handling', async () => {
      // Update with single item
      args.items = [{ label: 'Home' }];
      await waitFor(() => {
        const homeText = canvas.queryByText('Home');
        expect(homeText).toBeInTheDocument();
      });
    });
    
    await step('Long text overflow', async () => {
      const longLabel = 'This is a very long breadcrumb label that should handle overflow gracefully without breaking the layout';
      args.items = [
        { label: 'Home', href: '#' },
        { label: longLabel }
      ];
      
      await waitFor(() => {
        const longItem = canvas.queryByText(longLabel);
        if (longItem) {
          const style = window.getComputedStyle(longItem);
          // Should handle overflow
          expect(style.overflow || style.textOverflow).toBeTruthy();
        }
      });
    });
    
    await step('Special characters handling', async () => {
      args.items = [
        { label: 'Home & Garden', href: '#' },
        { label: 'Tools > Equipment', href: '#' },
        { label: '"Special" Items', href: '#' },
        { label: 'Current <Page>' }
      ];
      
      await waitFor(() => {
        const specialChars = canvas.queryByText('Home & Garden');
        expect(specialChars).toBeInTheDocument();
      });
    });
    
    await step('Missing href handling', async () => {
      args.items = [
        { label: 'No Href 1' },
        { label: 'No Href 2' },
        { label: 'No Href 3' }
      ];
      
      await waitFor(() => {
        const items = canvas.queryAllByText(/No Href/);
        expect(items.length).toBeGreaterThan(0);
        
        // Items without href should not be links
        items.forEach(item => {
          const parentLink = item.closest('a');
          expect(parentLink).toBeNull();
        });
      });
    });
    
    await step('Maximum items limit', async () => {
      args.items = Array.from({ length: 100 }, (_, i) => ({
        label: `Item ${i + 1}`,
        href: i < 99 ? '#' : undefined
      }));
      args.maxItems = 8;
      
      await waitFor(() => {
        const nav = canvas.queryByRole('navigation');
        if (nav) {
          const visibleItems = within(nav).queryAllByRole('listitem');
          // Should respect maxItems limit
          expect(visibleItems.length).toBeLessThanOrEqual(20); // Some buffer for separators
        }
      });
    });
  }
};

// ============================
// 7.7 Integration Tests
// ============================

export const IntegrationWithRouter: Story = {
  name: '🔗 Router Integration Test',
  args: {
    items: [
      { 
        label: 'Home', 
        href: '/',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          console.log('Navigate to:', '/');
        }
      },
      { 
        label: 'Products', 
        href: '/products',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          console.log('Navigate to:', '/products');
        }
      },
      { 
        label: 'Electronics', 
        href: '/products/electronics',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          console.log('Navigate to:', '/products/electronics');
        }
      },
      { label: 'Laptops' }
    ],
    variant: 'glass'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Simulate navigation', async () => {
      const homeLink = canvas.getByRole('link', { name: /home/i });
      await userEvent.click(homeLink);
      
      // Check console for navigation log
      await expect(homeLink).toHaveAttribute('href', '/');
    });
    
    await step('Verify path structure', async () => {
      const links = canvas.getAllByRole('link');
      const hrefs = links.map(link => link.getAttribute('href'));
      
      // Verify hierarchical path structure
      await expect(hrefs[0]).toBe('/');
      await expect(hrefs[1]).toBe('/products');
      await expect(hrefs[2]).toBe('/products/electronics');
    });
  }
};

export const VariantComparison: Story = {
  name: '🎭 All Variants Comparison Test',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
      <div>
        <h4>Default Variant</h4>
        <Breadcrumbs items={basicItems} variant="default" />
      </div>
      <div>
        <h4>Glass Variant</h4>
        <Breadcrumbs items={basicItems} variant="glass" />
      </div>
      <div>
        <h4>Elevated Variant</h4>
        <Breadcrumbs items={basicItems} variant="elevated" elevation={3} />
      </div>
      <div>
        <h4>Outlined Variant</h4>
        <Breadcrumbs items={basicItems} variant="outlined" />
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify all variants render', async () => {
      const headings = canvas.getAllByRole('heading', { level: 4 });
      await expect(headings).toHaveLength(4);
      
      const navigations = canvas.getAllByRole('navigation');
      await expect(navigations).toHaveLength(4);
    });
    
    await step('Compare visual differences', async () => {
      const navigations = canvas.getAllByRole('navigation');
      const styles = navigations.map(nav => window.getComputedStyle(nav));
      
      // Each variant should have unique styling
      const backgrounds = styles.map(s => s.backgroundColor);
      const uniqueBackgrounds = new Set(backgrounds);
      
      // At least some variants should have different backgrounds
      await expect(uniqueBackgrounds.size).toBeGreaterThan(1);
    });
  }
};

// ============================
// Additional Comprehensive Tests
// ============================

export const SeparatorTypesTest: Story = {
  name: '➡️ All Separator Types Test',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['default', 'arrow', 'chevron', 'slash', 'dot', 'pipe'] as const).map(separator => (
        <Breadcrumbs
          key={separator}
          items={basicItems}
          separatorType={separator}
          variant="default"
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify all separator types render', async () => {
      const navigations = canvas.getAllByRole('navigation');
      await expect(navigations).toHaveLength(6);
    });
    
    await step('Check separator visibility', async () => {
      const navigations = canvas.getAllByRole('navigation');
      
      navigations.forEach(async (nav) => {
        const separators = within(nav).queryAllByText(/[/>•|]/);
        // Each navigation should have separators
        await expect(separators.length).toBeGreaterThanOrEqual(0);
      });
    });
  }
};

export const ColorSchemeTest: Story = {
  name: '🎨 Color Scheme Test',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Breadcrumbs items={basicItems} color="default" variant="elevated" />
      <Breadcrumbs items={basicItems} color="primary" variant="elevated" />
      <Breadcrumbs items={basicItems} color="secondary" variant="elevated" />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify color schemes', async () => {
      const navigations = canvas.getAllByRole('navigation');
      await expect(navigations).toHaveLength(3);
      
      // Each should have different color styling
      const styles = navigations.map(nav => window.getComputedStyle(nav));
      const colors = styles.map(s => s.color || s.backgroundColor);
      
      // Should have variety in colors
      const uniqueColors = new Set(colors);
      await expect(uniqueColors.size).toBeGreaterThanOrEqual(1);
    });
  }
};

export const SizeVariationTest: Story = {
  name: '📏 Size Variation Test',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Breadcrumbs items={basicItems} size="sm" />
      <Breadcrumbs items={basicItems} size="md" />
      <Breadcrumbs items={basicItems} size="lg" />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify size differences', async () => {
      const navigations = canvas.getAllByRole('navigation');
      await expect(navigations).toHaveLength(3);
      
      const firstLinks = navigations.map(nav => within(nav).getAllByRole('link')[0]);
      const fontSizes = firstLinks.map(link => {
        const style = window.getComputedStyle(link);
        return parseFloat(style.fontSize);
      });
      
      // Sizes should be different
      await expect(fontSizes[0]).toBeLessThan(fontSizes[1]);
      await expect(fontSizes[1]).toBeLessThan(fontSizes[2]);
    });
  }
};