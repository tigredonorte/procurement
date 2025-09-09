import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';

import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'DataDisplay/Banner/Tests',
  component: Banner,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
export type Story = StoryObj<typeof meta>;

// Basic Interaction Tests
export const BasicInteraction: Story = {
  args: {
    variant: 'info',
    title: 'Test Banner',
    description: 'Testing basic interaction functionality',
    dismissible: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify banner is visible
    const banner = canvas.getByRole('status');
    expect(banner).toBeInTheDocument();
    expect(banner).toBeVisible();

    // Verify content
    expect(canvas.getByText('Test Banner')).toBeInTheDocument();
    expect(canvas.getByText('Testing basic interaction functionality')).toBeInTheDocument();

    // Verify dismiss button functionality
    const dismissButton = canvas.getByRole('button', { name: /dismiss banner/i });
    expect(dismissButton).toBeInTheDocument();

    // Test dismiss functionality
    await userEvent.click(dismissButton);
    await waitFor(() => {
      expect(banner).not.toBeInTheDocument();
    });
  },
};

// State Change Tests
export const StateChange: Story = {
  args: {
    variant: 'warning',
    title: 'State Change Test',
    description: 'Testing state changes and updates',
    actions: [
      { label: 'Primary Action', onClick: fn(), variant: 'primary' },
      { label: 'Secondary Action', onClick: fn(), variant: 'secondary' },
    ],
    dismissible: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Verify initial state
    const banner = canvas.getByRole('alert');
    expect(banner).toBeVisible();

    // Test action button clicks
    const primaryButton = canvas.getByRole('button', { name: 'Primary Action' });
    const secondaryButton = canvas.getByRole('button', { name: 'Secondary Action' });

    await userEvent.click(primaryButton);
    expect(args.actions![0].onClick).toHaveBeenCalledTimes(1);

    await userEvent.click(secondaryButton);
    expect(args.actions![1].onClick).toHaveBeenCalledTimes(1);
  },
};

// Keyboard Navigation Tests
export const KeyboardNavigation: Story = {
  args: {
    variant: 'success',
    title: 'Keyboard Navigation Test',
    description: 'Testing keyboard accessibility',
    actions: [
      { label: 'Action 1', onClick: fn(), variant: 'primary' },
      { label: 'Action 2', onClick: fn(), variant: 'secondary' },
    ],
    dismissible: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Focus the banner
    const banner = canvas.getByRole('status');
    banner.focus();
    expect(banner).toHaveFocus();

    // Tab to first action button
    await userEvent.tab();
    const action1 = canvas.getByRole('button', { name: 'Action 1' });
    expect(action1).toHaveFocus();

    // Tab to second action button
    await userEvent.tab();
    const action2 = canvas.getByRole('button', { name: 'Action 2' });
    expect(action2).toHaveFocus();

    // Tab to dismiss button
    await userEvent.tab();
    const dismissButton = canvas.getByRole('button', { name: /dismiss banner/i });
    expect(dismissButton).toHaveFocus();

    // Test Enter key on action button
    action1.focus();
    await userEvent.keyboard('{Enter}');
    expect(args.actions![0].onClick).toHaveBeenCalledTimes(1);

    // Test Space key on dismiss button
    dismissButton.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => {
      expect(banner).not.toBeInTheDocument();
    });
  },
};

// Screen Reader Tests
export const ScreenReader: Story = {
  args: {
    variant: 'critical',
    title: 'Screen Reader Test',
    description: 'Testing screen reader accessibility',
    dismissible: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify ARIA attributes for critical variant
    const banner = canvas.getByRole('alert');
    expect(banner).toHaveAttribute('aria-live', 'assertive');
    expect(banner).toHaveAttribute('aria-atomic', 'true');

    // Verify dismiss button accessibility
    const dismissButton = canvas.getByRole('button', { name: /dismiss banner/i });
    expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss banner');

    // Verify content structure for screen readers
    expect(canvas.getByText('Screen Reader Test')).toBeInTheDocument();
    expect(canvas.getByText('Testing screen reader accessibility')).toBeInTheDocument();
  },
};

// Focus Management Tests
export const FocusManagement: Story = {
  args: {
    variant: 'info',
    title: 'Focus Management Test',
    description: 'Testing focus management and keyboard navigation',
    actions: [{ label: 'Focus Test', onClick: fn(), variant: 'primary' }],
    dismissible: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test initial focus state
    const banner = canvas.getByRole('status');
    expect(banner).toHaveAttribute('tabIndex', '0');

    // Test focus visibility
    banner.focus();
    expect(banner).toHaveFocus();

    // Test that focus moves properly through interactive elements
    await userEvent.tab();
    const actionButton = canvas.getByRole('button', { name: 'Focus Test' });
    expect(actionButton).toHaveFocus();

    await userEvent.tab();
    const dismissButton = canvas.getByRole('button', { name: /dismiss banner/i });
    expect(dismissButton).toHaveFocus();
  },
};

// Responsive Design Tests
export const ResponsiveDesign: Story = {
  args: {
    variant: 'warning',
    title: 'Responsive Design Test',
    description: 'Testing responsive layout behavior',
    actions: [
      { label: 'Action 1', onClick: fn(), variant: 'primary' },
      { label: 'Action 2', onClick: fn(), variant: 'secondary' },
    ],
    dismissible: true,
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify banner renders correctly
    const banner = canvas.getByRole('alert');
    expect(banner).toBeVisible();

    // Verify all elements are present
    expect(canvas.getByText('Responsive Design Test')).toBeInTheDocument();
    expect(canvas.getByText('Testing responsive layout behavior')).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /dismiss banner/i })).toBeInTheDocument();

    // Verify layout adaptation (elements should be accessible regardless of viewport)
    const actionsContainer = banner.querySelector('.banner-actions');
    expect(actionsContainer).toBeInTheDocument();
  },
};

// Theme Variations Tests
export const ThemeVariations: Story = {
  args: {
    variant: 'success',
    title: 'Theme Variations Test',
    description: 'Testing different theme variations',
    dismissible: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify banner has appropriate styling for success variant
    const banner = canvas.getByRole('status');
    expect(banner).toBeVisible();

    // Verify icon is present (success variant should have CheckCircle icon)
    const icon = banner.querySelector('.banner-icon');
    expect(icon).toBeInTheDocument();

    // Verify color scheme is applied
    const computedStyle = window.getComputedStyle(banner);
    expect(computedStyle.backgroundColor).toBeTruthy();
    expect(computedStyle.borderColor).toBeTruthy();
  },
};

// Visual States Tests
export const VisualStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <Banner variant="info" title="Info State" description="Information banner state" />
      <Banner variant="success" title="Success State" description="Success banner state" />
      <Banner variant="warning" title="Warning State" description="Warning banner state" />
      <Banner variant="critical" title="Critical State" description="Critical error banner state" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all variants are rendered
    const banners = canvas.getAllByRole(/status|alert/);
    expect(banners).toHaveLength(4);

    // Verify each variant has appropriate styling
    banners.forEach((banner) => {
      expect(banner).toBeVisible();
      const computedStyle = window.getComputedStyle(banner);
      expect(computedStyle.backgroundColor).toBeTruthy();
      expect(computedStyle.borderColor).toBeTruthy();
    });
  },
};

// Performance Tests
export const Performance: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Banner
          key={i}
          variant={(['info', 'success', 'warning', 'critical'] as const)[i % 4]}
          title={`Performance Test Banner ${i + 1}`}
          description={`Testing performance with multiple banners - Instance ${i + 1}`}
          dismissible={i % 2 === 0}
          actions={
            i % 3 === 0 ? [{ label: 'Action', onClick: fn(), variant: 'primary' }] : undefined
          }
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startTime = window.performance.now();

    // Verify all banners are rendered
    const banners = canvas.getAllByRole(/status|alert/);
    expect(banners).toHaveLength(10);

    // Verify performance is acceptable
    const endTime = window.performance.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(100); // Should render in less than 100ms

    // Test interaction performance
    const dismissibleBanners = banners.filter((banner, i) => i % 2 === 0);
    for (const banner of dismissibleBanners.slice(0, 3)) {
      const dismissButton = within(banner).getByRole('button', { name: /dismiss banner/i });
      await userEvent.click(dismissButton);
    }
  },
};

// Edge Cases Tests
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <Banner variant="info" title="" description="" />
      <Banner variant="success" title="Only Title" />
      <Banner variant="warning" description="Only description provided" />
      <Banner
        variant="critical"
        title="Very Long Title That Should Handle Overflow Gracefully Without Breaking Layout"
        description="This is a very long description that tests how the banner handles overflow content and ensures that the layout remains stable even with extensive text content that might wrap to multiple lines."
      />
      <Banner
        variant="info"
        title="Many Actions Test"
        actions={[
          { label: 'Action 1', onClick: fn(), variant: 'primary' },
          { label: 'Action 2', onClick: fn(), variant: 'secondary' },
          { label: 'Action 3', onClick: fn(), variant: 'primary' },
          { label: 'Action 4', onClick: fn(), variant: 'secondary' },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all edge case banners render
    const banners = canvas.getAllByRole(/status|alert/);
    expect(banners).toHaveLength(5);

    // Verify empty content banner
    const emptyBanner = banners[0];
    expect(emptyBanner).toBeVisible();

    // Verify title-only banner
    expect(canvas.getByText('Only Title')).toBeInTheDocument();

    // Verify description-only banner
    expect(canvas.getByText('Only description provided')).toBeInTheDocument();

    // Verify long content banner
    expect(canvas.getByText(/Very Long Title/)).toBeInTheDocument();

    // Verify many actions banner
    const manyActionsBanner = banners[4];
    const actionButtons = within(manyActionsBanner).getAllByRole('button');
    expect(actionButtons).toHaveLength(4);
  },
};

// Integration Tests
export const Integration: Story = {
  render: () => (
    <div>
      <Banner
        variant="info"
        title="Cookie Notice"
        description="We use cookies to enhance your experience"
        actions={[
          { label: 'Accept All', onClick: fn(), variant: 'primary' },
          { label: 'Manage Preferences', onClick: fn(), variant: 'secondary' },
        ]}
        dismissible
      />
      <div style={{ padding: '16px' }}>
        <p>Page content below the banner</p>
        <button>Page button</button>
      </div>
      <Banner
        variant="warning"
        title="Maintenance Notice"
        description="Scheduled maintenance tonight from 2-4 AM"
        sticky
        fullWidth
        dismissible
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify both banners are present
    const banners = canvas.getAllByRole(/status|alert/);
    expect(banners).toHaveLength(2);

    // Test integration with page content
    expect(canvas.getByText('Page content below the banner')).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Page button' })).toBeInTheDocument();

    // Test banner interactions don't interfere with page
    const acceptButton = canvas.getByRole('button', { name: 'Accept All' });
    await userEvent.click(acceptButton);

    // Verify page content is still accessible
    const pageButton = canvas.getByRole('button', { name: 'Page button' });
    await userEvent.click(pageButton);

    // Test sticky banner functionality
    const stickyBanner = banners[1];
    expect(stickyBanner).toBeVisible();
  },
};
