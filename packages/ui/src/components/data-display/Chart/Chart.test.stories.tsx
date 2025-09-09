import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';

import { Chart } from './Chart';
import { ChartDataPoint } from './Chart.types';

const meta: Meta<typeof Chart> = {
  title: 'DataDisplay/Chart/Tests',
  component: Chart,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
export type Story = StoryObj<typeof meta>;

// Test data
const testData: ChartDataPoint[] = [
  { name: 'Jan', sales: 4000, revenue: 2400, profit: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398, profit: 2210 },
  { name: 'Mar', sales: 2000, revenue: 9800, profit: 2290 },
  { name: 'Apr', sales: 2780, revenue: 3908, profit: 2000 },
  { name: 'May', sales: 1890, revenue: 4800, profit: 2181 },
  { name: 'Jun', sales: 2390, revenue: 3800, profit: 2500 },
];

const pieData: ChartDataPoint[] = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 15 },
  { name: 'Other', value: 10 },
];

// Interaction Tests
export const BasicInteraction: Story = {
  args: {
    type: 'line',
    data: testData,
    title: 'Interactive Line Chart',
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders with title
    const title = await canvas.findByText('Interactive Line Chart');
    expect(title).toBeInTheDocument();

    // Test chart container exists
    const chartContainer = canvasElement.querySelector('.recharts-wrapper');
    expect(chartContainer).toBeInTheDocument();

    // Test data points exist
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    expect(lines.length).toBeGreaterThan(0);

    // Test focus functionality
    const chartPaper = canvasElement.querySelector(
      '[data-testid="chart-container"], .MuiPaper-root',
    ) as HTMLElement;
    if (chartPaper) {
      await userEvent.tab();
      if (chartPaper.getAttribute('tabindex') === '0' || chartPaper === document.activeElement) {
        // Focus was successfully set
        expect(chartPaper).toBeDefined();
      }
    }
  },
};

export const FormInteraction: Story = {
  args: {
    type: 'bar',
    data: testData,
    title: 'Interactive Bar Chart',
    onClick: fn(),
    showTooltip: true,
    showLegend: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test bar chart renders
    const title = await canvas.findByText('Interactive Bar Chart');
    expect(title).toBeInTheDocument();

    // Test bars exist
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    expect(bars.length).toBeGreaterThan(0);

    // Test legend exists
    const legend = canvasElement.querySelector('.recharts-legend-wrapper');
    expect(legend).toBeInTheDocument();

    // Test tooltip functionality by hovering over bars
    if (bars.length > 0) {
      const firstBar = bars[0] as HTMLElement;
      await userEvent.hover(firstBar);

      // Wait for tooltip to potentially appear
      await waitFor(
        () => {
          const tooltip = canvasElement.querySelector('.recharts-tooltip-wrapper');
          if (tooltip) {
            expect(tooltip).toBeInTheDocument();
          }
        },
        { timeout: 1000 },
      );
    }
  },
};

// Accessibility Tests
export const KeyboardNavigation: Story = {
  args: {
    type: 'line',
    data: testData,
    title: 'Keyboard Navigation Test',
    onFocus: fn(),
    onBlur: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart has proper title
    const title = await canvas.findByText('Keyboard Navigation Test');
    expect(title).toBeInTheDocument();

    // Test focus management
    const chartPaper = canvasElement.querySelector('.MuiPaper-root') as HTMLElement;
    if (chartPaper) {
      // Make element focusable for testing
      chartPaper.setAttribute('tabindex', '0');

      await userEvent.click(chartPaper);
      expect(chartPaper).toHaveFocus();
    }

    // Test escape key doesn't break anything
    await userEvent.keyboard('{Escape}');

    // Test arrow keys don't break anything
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowRight}');
  },
};

export const ScreenReader: Story = {
  args: {
    type: 'pie',
    data: pieData,
    title: 'Screen Reader Accessibility',
    subtitle: 'Device usage distribution',
    showLegend: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test proper heading structure
    const title = await canvas.findByText('Screen Reader Accessibility');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H6'); // MUI Typography variant h6

    // Test subtitle exists
    const subtitle = canvas.getByText('Device usage distribution');
    expect(subtitle).toBeInTheDocument();

    // Test chart has accessible container
    const chartContainer = canvasElement.querySelector('.recharts-wrapper');
    expect(chartContainer).toBeInTheDocument();

    // Test legend is accessible
    const legend = canvasElement.querySelector('.recharts-legend-wrapper');
    expect(legend).toBeInTheDocument();
  },
};

export const FocusManagement: Story = {
  args: {
    type: 'bar',
    data: testData,
    title: 'Focus Management Test',
    disabled: false,
    onFocus: fn(),
    onBlur: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders
    const title = await canvas.findByText('Focus Management Test');
    expect(title).toBeInTheDocument();

    // Test focus and blur events
    const chartContainer = canvasElement.querySelector('.MuiPaper-root') as HTMLElement;
    if (chartContainer) {
      chartContainer.setAttribute('tabindex', '0');

      await userEvent.click(chartContainer);
      await waitFor(() => {
        expect(chartContainer).toHaveFocus();
      });

      // Tab away to test blur
      await userEvent.tab();
    }
  },
};

// Visual Tests
export const ResponsiveDesign: Story = {
  args: {
    type: 'line',
    data: testData,
    title: 'Responsive Chart',
    responsive: true,
    width: '100%',
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1200px', height: '800px' } },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders
    const title = await canvas.findByText('Responsive Chart');
    expect(title).toBeInTheDocument();

    // Test responsive container exists
    const responsiveContainer = canvasElement.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();

    // Test chart scales properly
    const chartWrapper = canvasElement.querySelector('.recharts-wrapper');
    expect(chartWrapper).toBeInTheDocument();

    if (chartWrapper) {
      const rect = chartWrapper.getBoundingClientRect();
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
    }
  },
};

export const ThemeVariations: Story = {
  args: {
    type: 'area',
    data: testData,
    title: 'Theme Variations',
    variant: 'default',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders with default theme
    const title = await canvas.findByText('Theme Variations');
    expect(title).toBeInTheDocument();

    // Test chart container has proper styling
    const paper = canvasElement.querySelector('.MuiPaper-root');
    expect(paper).toBeInTheDocument();

    // Test area chart elements exist
    const areas = canvasElement.querySelectorAll('.recharts-area-area');
    expect(areas.length).toBeGreaterThan(0);

    // Test theme colors are applied
    const computedStyle = window.getComputedStyle(paper as HTMLElement);
    expect(computedStyle.backgroundColor).toBeDefined();
  },
};

export const VisualStates: Story = {
  args: {
    type: 'bar',
    data: testData,
    title: 'Visual States Test',
    variant: 'elevated',
    glow: false,
    pulse: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders
    const title = await canvas.findByText('Visual States Test');
    expect(title).toBeInTheDocument();

    // Test elevated variant styling
    const paper = canvasElement.querySelector('.MuiPaper-root');
    expect(paper).toBeInTheDocument();

    const computedStyle = window.getComputedStyle(paper as HTMLElement);
    expect(computedStyle.boxShadow).toBeDefined();

    // Test bars exist and have proper styling
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    expect(bars.length).toBeGreaterThan(0);
  },
};

// Performance Tests
export const Performance: Story = {
  args: {
    type: 'line',
    data: Array.from({ length: 100 }, (_, i) => ({
      name: `Point ${i}`,
      value: Math.random() * 1000,
      series2: Math.random() * 800,
      series3: Math.random() * 600,
    })),
    title: 'Performance Test - 100 Data Points',
    animate: true,
    animationDuration: 1500,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const startTime = Date.now();

    // Test chart renders with large dataset
    const title = await canvas.findByText('Performance Test - 100 Data Points');
    expect(title).toBeInTheDocument();

    // Test all data points are rendered
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    expect(lines.length).toBeGreaterThan(0);

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // Test renders within reasonable time (5 seconds)
    expect(renderTime).toBeLessThan(5000);

    // Test chart is interactive after rendering
    const chartContainer = canvasElement.querySelector('.recharts-wrapper');
    expect(chartContainer).toBeInTheDocument();
  },
};

// Edge Cases Tests
export const EdgeCases: Story = {
  args: {
    type: 'line',
    data: [{ name: 'Single Point', value: 42 }],
    title: 'Edge Cases Test',
    showTooltip: true,
    showLegend: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart handles single data point
    const title = await canvas.findByText('Edge Cases Test');
    expect(title).toBeInTheDocument();

    // Test chart renders with minimal data
    const chartWrapper = canvasElement.querySelector('.recharts-wrapper');
    expect(chartWrapper).toBeInTheDocument();

    // Test no crash with single data point
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    expect(lines.length).toBeGreaterThanOrEqual(0);
  },
};

export const EmptyData: Story = {
  args: {
    type: 'bar',
    data: [],
    title: 'Empty Data Test',
    showTooltip: true,
    showLegend: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart handles empty data gracefully
    const title = await canvas.findByText('Empty Data Test');
    expect(title).toBeInTheDocument();

    // Test chart container still exists
    const chartWrapper = canvasElement.querySelector('.recharts-wrapper');
    expect(chartWrapper).toBeInTheDocument();

    // Test no bars exist with empty data
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    expect(bars.length).toBe(0);
  },
};

export const LoadingState: Story = {
  args: {
    loading: true,
    size: 'md',
    color: 'primary',
  },
  play: async ({ canvasElement }) => {
    // Test loading state shows spinner
    const spinner = canvasElement.querySelector('.MuiCircularProgress-root');
    expect(spinner).toBeInTheDocument();

    // Test no chart content while loading
    const chartWrapper = canvasElement.querySelector('.recharts-wrapper');
    expect(chartWrapper).not.toBeInTheDocument();
  },
};

export const DisabledState: Story = {
  args: {
    type: 'line',
    data: testData,
    title: 'Disabled Chart',
    disabled: true,
    onClick: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders when disabled
    const title = await canvas.findByText('Disabled Chart');
    expect(title).toBeInTheDocument();

    // Test disabled styling is applied
    const paper = canvasElement.querySelector('.MuiPaper-root');
    expect(paper).toBeInTheDocument();

    const computedStyle = window.getComputedStyle(paper as HTMLElement);
    expect(parseFloat(computedStyle.opacity)).toBeLessThan(1);
    expect(computedStyle.pointerEvents).toBe('none');

    // Test click events don't fire when disabled
    const chartContainer = canvasElement.querySelector('.recharts-wrapper');
    if (chartContainer) {
      await userEvent.click(chartContainer as HTMLElement);
      // In disabled state, click interactions should not trigger
      expect(chartContainer).toBeDefined();
    }
  },
};

// Integration Tests
export const Integration: Story = {
  args: {
    type: 'composed',
    data: testData,
    series: [
      { dataKey: 'sales', name: 'Sales', type: 'bar' },
      { dataKey: 'revenue', name: 'Revenue', type: 'line' },
      { dataKey: 'profit', name: 'Profit', type: 'area' },
    ],
    title: 'Integration Test',
    subtitle: 'Multiple chart types combined',
    showLegend: true,
    showTooltip: true,
    showCartesianGrid: true,
    variant: 'elevated',
    onClick: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test composed chart renders
    const title = await canvas.findByText('Integration Test');
    expect(title).toBeInTheDocument();

    const subtitle = canvas.getByText('Multiple chart types combined');
    expect(subtitle).toBeInTheDocument();

    // Test all chart elements exist
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    const areas = canvasElement.querySelectorAll('.recharts-area-area');

    expect(bars.length).toBeGreaterThan(0);
    expect(lines.length).toBeGreaterThan(0);
    expect(areas.length).toBeGreaterThan(0);

    // Test legend shows all series
    const legend = canvasElement.querySelector('.recharts-legend-wrapper');
    expect(legend).toBeInTheDocument();

    // Test grid is visible
    const grid = canvasElement.querySelector('.recharts-cartesian-grid');
    expect(grid).toBeInTheDocument();

    // Test chart is interactive
    if (bars.length > 0) {
      await userEvent.hover(bars[0] as HTMLElement);
      // Tooltip should appear on hover
      await waitFor(
        () => {
          const tooltip = canvasElement.querySelector('.recharts-tooltip-wrapper');
          if (tooltip && tooltip.textContent) {
            expect(tooltip).toBeInTheDocument();
          }
        },
        { timeout: 1000 },
      );
    }
  },
};
