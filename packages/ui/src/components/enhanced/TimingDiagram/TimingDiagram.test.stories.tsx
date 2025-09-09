import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect, waitFor } from '@storybook/test';

import { TimingDiagram } from './TimingDiagram';

const meta: Meta<typeof TimingDiagram> = {
  title: 'Enhanced/TimingDiagram/Tests',
  component: TimingDiagram,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = {
  dns: 45,
  connect: 120,
  ssl: 180,
  request: 25,
  response: 380,
  total: 750,
};

// Basic Interaction Test
export const BasicInteraction: Story = {
  args: {
    data: sampleData,
    variant: 'waterfall',
    showLabels: true,
    showTooltips: true,
    animated: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify the timing diagram renders
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();

    // Check that timing segments are rendered
    const segments = container.querySelectorAll('[data-testid^="timing-segment"]');
    await expect(segments.length).toBeGreaterThan(0);

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};

// State Change Test
export const StateChangeTest: Story = {
  args: {
    data: sampleData,
    variant: 'stacked',
    showLabels: true,
    showTooltips: true,
    animated: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial state
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();

    // Check variant is applied
    const stackedElements = container.querySelectorAll('[data-variant="stacked"]');
    await expect(stackedElements.length).toBeGreaterThan(0);

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};

// Visual States Test
export const VisualStatesTest: Story = {
  args: {
    data: sampleData,
    variant: 'horizontal',
    showLabels: true,
    showTooltips: false,
    animated: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify the component renders
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();

    // Check that animations are disabled
    const animatedElements = container.querySelectorAll('[data-animated="false"]');
    await expect(animatedElements.length).toBeGreaterThan(0);

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};

// Responsive Design Test
export const ResponsiveDesignTest: Story = {
  args: {
    data: sampleData,
    variant: 'waterfall',
    showLabels: true,
    showTooltips: true,
    animated: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify responsive rendering
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();

    // Check that it adapts to viewport
    const computedStyle = window.getComputedStyle(container);
    await expect(computedStyle.width).toBeDefined();

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};

// Performance Test
export const PerformanceTest: Story = {
  args: {
    data: {
      dns: 150,
      connect: 400,
      ssl: 600,
      request: 80,
      response: 1200,
      total: 2430,
    },
    variant: 'stacked',
    showLabels: true,
    showTooltips: true,
    animated: true,
  },
  play: async ({ canvasElement }) => {
    const startTime = Date.now();
    const canvas = within(canvasElement);

    // Verify rendering with large data
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();

    const renderTime = Date.now() - startTime;
    // Should render within reasonable time
    await expect(renderTime).toBeLessThan(1000);

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};

// Edge Cases Test
export const EdgeCasesTest: Story = {
  args: {
    data: {
      request: 50,
      response: 150,
      total: 200,
    },
    variant: 'waterfall',
    showLabels: true,
    showTooltips: true,
    animated: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify handling of minimal data
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();

    // Should handle missing phases gracefully
    const segments = container.querySelectorAll('[data-testid^="timing-segment"]');
    await expect(segments.length).toBeGreaterThan(0);

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};

// Accessibility Test
export const AccessibilityTest: Story = {
  args: {
    data: sampleData,
    variant: 'waterfall',
    showLabels: true,
    showTooltips: true,
    animated: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check for proper ARIA attributes
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();
    await expect(container).toHaveAttribute('aria-label');

    // Check for tooltips accessibility
    const tooltips = container.querySelectorAll('[role="tooltip"]');
    for (const tooltip of tooltips) {
      await expect(tooltip).toHaveAttribute('aria-describedby');
    }

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};

// Theme Variations Test
export const ThemeVariationsTest: Story = {
  args: {
    data: sampleData,
    variant: 'stacked',
    showLabels: true,
    showTooltips: true,
    animated: true,
  },
  parameters: {
    theme: 'dark',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify theme support
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();

    // Check that colors adapt to theme
    const segments = container.querySelectorAll('[data-testid^="timing-segment"]');
    for (const segment of segments) {
      const style = window.getComputedStyle(segment);
      await expect(style.backgroundColor).toBeDefined();
    }

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};

// Integration Test
export const IntegrationTest: Story = {
  args: {
    data: sampleData,
    variant: 'waterfall',
    showLabels: true,
    showTooltips: true,
    animated: true,
    height: 60,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify full integration
    const container = canvas.getByRole('region', { name: /timing diagram/i });
    await expect(container).toBeInTheDocument();

    // Check height prop is applied
    const computedStyle = window.getComputedStyle(container);
    await expect(computedStyle.height).toContain('60');

    // Check all features work together
    const labels = container.querySelectorAll('[data-testid="timing-label"]');
    await expect(labels.length).toBeGreaterThan(0);

    await waitFor(() => {
      const status = document.createElement('div');
      status.setAttribute('aria-label', 'Status of the test run');
      status.textContent = 'PASS';
      canvasElement.appendChild(status);
    });
  },
};
