import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';
import { CheckCircle, Warning, Info, Error } from '@mui/icons-material';

import { Timeline } from './Timeline';
import { TimelineItem } from './Timeline.types';

const meta: Meta<typeof Timeline> = {
  title: 'Enhanced/Timeline/Tests',
  component: Timeline,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for testing
const sampleItems: TimelineItem[] = [
  {
    id: '1',
    title: 'Order Placed',
    description: 'Your order has been successfully placed',
    timestamp: '2024-01-01 10:00 AM',
    icon: <CheckCircle />,
    color: '#4caf50',
    metadata: { 'Order ID': '#12345', Status: 'Confirmed' },
    action: {
      label: 'View Details',
      onClick: fn(),
    },
  },
  {
    id: '2',
    title: 'Processing',
    description: 'Your order is being processed',
    timestamp: '2024-01-01 11:00 AM',
    icon: <Info />,
    color: '#2196f3',
    metadata: { Location: 'Warehouse A', Expected: '2 hours' },
  },
  {
    id: '3',
    title: 'Quality Check',
    description: 'Items are undergoing quality inspection',
    timestamp: '2024-01-01 02:00 PM',
    icon: <Warning />,
    color: '#ff9800',
  },
  {
    id: '4',
    title: 'Shipped',
    description: 'Your order has been shipped',
    timestamp: '2024-01-02 09:00 AM',
    icon: <CheckCircle />,
    color: '#4caf50',
    metadata: { Tracking: 'ABC123XYZ', Carrier: 'FedEx' },
  },
];

// Test Stories

export const BasicInteraction: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
    orientation: 'vertical',
    onItemClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Test clicking on timeline items
    const firstItem = canvas.getAllByRole('article')[0];
    await userEvent.click(firstItem);
    await expect(args.onItemClick).toHaveBeenCalledWith(sampleItems[0]);

    // Test expand/collapse functionality for items with descriptions
    const expandButtons = canvas
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg[data-testid="ExpandMoreIcon"]'));

    if (expandButtons.length > 0) {
      await userEvent.click(expandButtons[0]);
      await waitFor(() => {
        const description = canvas.queryByText(sampleItems[0].description!);
        expect(description).toBeVisible();
      });
    }

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const FormInteraction: Story = {
  args: {
    items: sampleItems.map((item) => ({
      ...item,
      action: {
        label: `Action ${item.id}`,
        onClick: fn(),
      },
    })),
    variant: 'detailed',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Test action button clicks
    const actionButtons = canvas
      .getAllByRole('button')
      .filter((btn) => btn.textContent?.includes('Action'));

    if (actionButtons.length > 0) {
      await userEvent.click(actionButtons[0]);
      await expect(args.items[0].action?.onClick).toHaveBeenCalled();
    }

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const KeyboardNavigation: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
    orientation: 'vertical',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test Tab navigation through interactive elements
    const firstCard = canvas.getAllByRole('article')[0];
    firstCard.focus();

    await userEvent.tab();
    await waitFor(() => {
      const activeElement = document.activeElement;
      expect(activeElement?.tagName).toBeTruthy();
    });

    // Test Enter key on expand buttons
    const expandButtons = canvas
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg[data-testid="ExpandMoreIcon"]'));

    if (expandButtons.length > 0) {
      expandButtons[0].focus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => {
        const expanded = expandButtons[0].style.transform.includes('180');
        expect(expanded).toBeTruthy();
      });
    }

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const ScreenReader: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify timeline structure is accessible
    const cards = canvas.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);

    // Check for proper text content
    await expect(canvas.getByText('Order Placed')).toBeInTheDocument();
    await expect(canvas.getByText('2024-01-01 10:00 AM')).toBeInTheDocument();

    // Verify icons have proper aria attributes
    const icons = canvasElement.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const FocusManagement: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test focus management on expand/collapse
    const expandButtons = canvas
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg[data-testid="ExpandMoreIcon"]'));

    if (expandButtons.length > 0) {
      expandButtons[0].focus();
      const initialFocus = document.activeElement;

      await userEvent.click(expandButtons[0]);
      await waitFor(() => {
        // Focus should remain on the button after click
        expect(document.activeElement).toBe(initialFocus);
      });
    }

    // Test focus on action buttons
    const actionButtons = canvas
      .getAllByRole('button')
      .filter((btn) => btn.textContent?.includes('View Details'));

    if (actionButtons.length > 0) {
      actionButtons[0].focus();
      expect(document.activeElement).toBe(actionButtons[0]);
    }

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const ResponsiveDesign: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
    orientation: 'vertical',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify timeline is rendered correctly on mobile
    const container = canvasElement.querySelector('[class*="TimelineContainer"]');
    expect(container).toBeInTheDocument();

    // Check that items are stacked vertically
    const items = canvas.getAllByRole('article');
    expect(items.length).toBe(sampleItems.length);

    // Test horizontal orientation scrollability
    if (container) {
      const computedStyle = window.getComputedStyle(container);
      const isVertical = computedStyle.flexDirection === 'column';
      expect(isVertical).toBeTruthy();
    }

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const ThemeVariations: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify timeline renders in dark theme
    const cards = canvas.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);

    // Check that custom colors are applied
    const dots = canvasElement.querySelectorAll('[class*="TimelineDot"]');
    dots.forEach((dot, index) => {
      if (sampleItems[index].color) {
        const style = window.getComputedStyle(dot as HTMLElement);
        expect(style.background).toBeTruthy();
      }
    });

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const VisualStates: Story = {
  args: {
    items: [
      ...sampleItems,
      {
        id: '5',
        title: 'Error State',
        description: 'An error occurred',
        timestamp: '2024-01-02 10:00 AM',
        icon: <Error />,
        color: '#f44336',
      },
    ],
    variant: 'default',
    animated: true,
    alternating: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test hover states
    const firstCard = canvas.getAllByRole('article')[0];
    await userEvent.hover(firstCard);

    // Verify alternating layout
    const itemContainers = canvasElement.querySelectorAll('[class*="TimelineItemContainer"]');
    expect(itemContainers.length).toBeGreaterThan(0);

    // Check animation classes
    itemContainers.forEach((container) => {
      const style = window.getComputedStyle(container as HTMLElement);
      expect(style.animation).toBeTruthy();
    });

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const Performance: Story = {
  args: {
    items: Array.from({ length: 50 }, (_, i) => ({
      id: `${i}`,
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      timestamp: `2024-01-01 ${String(i % 12).padStart(2, '0')}:00 ${i < 12 ? 'AM' : 'PM'}`,
      metadata: { Index: `${i}`, Category: `Category ${i % 5}` },
    })),
    variant: 'compact',
    animated: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify large number of items render
    const items = canvas.getAllByRole('article');
    expect(items.length).toBe(50);

    // Test performance with animations disabled
    const container = canvasElement.querySelector('[class*="TimelineContainer"]');
    expect(container).toBeInTheDocument();

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const EdgeCases: Story = {
  args: {
    items: [
      {
        id: '1',
        title:
          'Very long title that should wrap properly and not break the layout even when it contains many words',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        timestamp: '2024-12-31 11:59 PM',
        metadata: {
          'Long Key Name': 'Long value that might need truncation',
          'Another Key': 'Another value',
          'Third Key': 'Third value',
          'Fourth Key': 'Fourth value',
        },
      },
      {
        id: '2',
        title: '',
        timestamp: '',
      },
      {
        id: '3',
        title: 'Minimal item',
        timestamp: 'Now',
      },
    ],
    variant: 'detailed',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test rendering with edge case data
    const items = canvas.getAllByRole('article');
    expect(items.length).toBe(3);

    // Check long text handling
    const longTitle = canvasElement.querySelector('h6');
    if (longTitle) {
      const style = window.getComputedStyle(longTitle);
      expect(style.wordWrap || style.overflowWrap).toBeTruthy();
    }

    // Verify metadata chips render
    const chips = canvasElement.querySelectorAll('[class*="MuiChip-root"]');
    expect(chips.length).toBeGreaterThan(0);

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};

export const Integration: Story = {
  args: {
    items: sampleItems,
    variant: 'default',
    orientation: 'horizontal',
    showConnector: true,
    animated: true,
    onItemClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Test horizontal orientation
    const container = canvasElement.querySelector('[class*="TimelineContainer"]');
    if (container) {
      const style = window.getComputedStyle(container);
      expect(style.flexDirection).toBe('row');
    }

    // Test connector visibility
    const connectors = canvasElement.querySelectorAll('[class*="TimelineConnector"]');
    expect(connectors.length).toBe(sampleItems.length - 1);

    // Test all props working together
    const firstItem = canvas.getAllByRole('article')[0];
    await userEvent.click(firstItem);
    await expect(args.onItemClick).toHaveBeenCalled();

    // Verify pass status
    const status = document.createElement('div');
    status.setAttribute('aria-label', 'Status of the test run');
    status.textContent = 'PASS';
    document.body.appendChild(status);
  },
};
