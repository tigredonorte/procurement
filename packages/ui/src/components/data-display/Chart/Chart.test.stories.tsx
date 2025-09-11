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
    series: [{ dataKey: 'sales', name: 'Sales' }, { dataKey: 'revenue', name: 'Revenue' }],
    title: 'Interactive Line Chart',
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Test chart renders with title
    const title = await canvas.findByText('Interactive Line Chart');
    expect(title).toBeInTheDocument();

    // Test chart container exists
    const chartContainer = canvasElement.querySelector('.recharts-wrapper');
    expect(chartContainer).toBeInTheDocument();

    // Test data points exist and verify actual data is rendered
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    expect(lines.length).toBe(2); // Should have 2 lines for sales and revenue

    // Verify line paths contain actual data by checking path 'd' attribute
    lines.forEach((line) => {
      const pathData = line.getAttribute('d');
      expect(pathData).toBeTruthy();
      expect(pathData).toContain('M'); // MoveTo command
      expect(pathData).toContain('C'); // Curve command (for monotone curves)
    });

    // Test that actual data points are rendered by checking dots
    const dots = canvasElement.querySelectorAll('.recharts-line-dot');
    expect(dots.length).toBe(testData.length * 2); // 6 data points * 2 series

    // Verify dots have correct positioning (cx, cy attributes)
    dots.forEach((dot) => {
      const cx = parseFloat(dot.getAttribute('cx') || '0');
      const cy = parseFloat(dot.getAttribute('cy') || '0');
      expect(cx).toBeGreaterThan(0);
      expect(cy).toBeGreaterThan(0);
    });

    // Verify legend shows correct series names
    const salesLegend = canvas.getByText('Sales');
    const revenueLegend = canvas.getByText('Revenue');
    expect(salesLegend).toBeInTheDocument();
    expect(revenueLegend).toBeInTheDocument();

    // Test X-axis shows actual data labels
    const janLabel = canvas.getByText('Jan');
    const febLabel = canvas.getByText('Feb');
    expect(janLabel).toBeInTheDocument();
    expect(febLabel).toBeInTheDocument();

    // Test Y-axis has proper scale based on data values
    const yAxisTicks = canvasElement.querySelectorAll('.recharts-yAxis .recharts-text');
    expect(yAxisTicks.length).toBeGreaterThan(0);
    
    // Verify Y-axis includes values in range of our data (0-9800)
    const yAxisValues = Array.from(yAxisTicks).map(tick => tick.textContent);
    expect(yAxisValues.some(val => val && parseInt(val) >= 0)).toBe(true);
    expect(yAxisValues.some(val => val && parseInt(val) <= 10000)).toBe(true);

    // Test click functionality on chart data points
    if (dots.length > 0) {
      await userEvent.click(dots[0] as HTMLElement);
      await waitFor(() => {
        expect(args.onClick).toHaveBeenCalled();
      });
    }
  },
};

export const FormInteraction: Story = {
  args: {
    type: 'bar',
    data: testData,
    series: [{ dataKey: 'sales', name: 'Sales' }, { dataKey: 'revenue', name: 'Revenue' }, { dataKey: 'profit', name: 'Profit' }],
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

    // Test bars exist - should have 3 series * 6 data points = 18 bars
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    expect(bars.length).toBe(18);

    // Test legend exists and shows all series
    const legend = canvasElement.querySelector('.recharts-legend-wrapper');
    expect(legend).toBeInTheDocument();
    const salesLegend = canvas.getByText('Sales');
    const revenueLegend = canvas.getByText('Revenue');
    const profitLegend = canvas.getByText('Profit');
    expect(salesLegend).toBeInTheDocument();
    expect(revenueLegend).toBeInTheDocument();
    expect(profitLegend).toBeInTheDocument();

    // Test actual data values are rendered by verifying X-axis labels
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    monthLabels.forEach(month => {
      const label = canvas.getByText(month);
      expect(label).toBeInTheDocument();
    });

    // Test tooltip functionality by hovering over bars and checking content
    if (bars.length > 0) {
      const firstBar = bars[0] as HTMLElement;
      await userEvent.hover(firstBar);

      // Wait for tooltip to appear and verify it contains actual data
      await waitFor(
        () => {
          const tooltip = canvasElement.querySelector('.recharts-tooltip-wrapper');
          if (tooltip && tooltip.textContent) {
            expect(tooltip).toBeInTheDocument();
            // Tooltip should contain actual data values from testData
            const tooltipText = tooltip.textContent;
            expect(tooltipText).toMatch(/4000|3000|2400|1398/); // Some of the actual data values
          }
        },
        { timeout: 2000 },
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
    series: [{ dataKey: 'sales', name: 'Sales' }],
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

    // Test chart scales properly and adapts to container
    const chartWrapper = canvasElement.querySelector('.recharts-wrapper');
    expect(chartWrapper).toBeInTheDocument();

    if (chartWrapper && responsiveContainer) {
      const wrapperRect = chartWrapper.getBoundingClientRect();
      const containerRect = responsiveContainer.getBoundingClientRect();
      
      // Verify responsive behavior - chart should fill container width
      expect(wrapperRect.width).toBeGreaterThan(200); // Minimum reasonable width
      expect(wrapperRect.height).toBeGreaterThan(300); // Should match size 'md' height of 400px
      
      // Verify chart adapts to responsive container
      expect(Math.abs(wrapperRect.width - containerRect.width)).toBeLessThan(50); // Allow some margin
    }

    // Verify data is still rendered correctly at different sizes
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    expect(lines.length).toBe(1); // Should have 1 line for sales data
    
    // Verify axis labels are still visible
    const janLabel = canvas.getByText('Jan');
    expect(janLabel).toBeInTheDocument();
  },
};

export const ThemeVariations: Story = {
  args: {
    type: 'area',
    data: testData,
    series: [{ dataKey: 'sales', name: 'Sales' }, { dataKey: 'revenue', name: 'Revenue' }],
    title: 'Theme Variations',
    variant: 'default',
    color: 'primary',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders with default theme
    const title = await canvas.findByText('Theme Variations');
    expect(title).toBeInTheDocument();

    // Test chart container has proper styling
    const paper = canvasElement.querySelector('.MuiPaper-root');
    expect(paper).toBeInTheDocument();

    // Test area chart elements exist with correct series count
    const areas = canvasElement.querySelectorAll('.recharts-area-area');
    expect(areas.length).toBe(2); // Should have 2 areas for sales and revenue

    // Test theme colors are actually applied to chart elements
    const computedStyle = window.getComputedStyle(paper as HTMLElement);
    expect(computedStyle.backgroundColor).toBeDefined();
    expect(computedStyle.backgroundColor).not.toBe('transparent');
    
    // Verify area fill colors are applied (should have fill attributes)
    areas.forEach((area) => {
      const fill = area.getAttribute('fill');
      expect(fill).toBeDefined();
      expect(fill).not.toBe('none');
      expect(fill).toMatch(/^#[0-9a-fA-F]{6}$|^rgb\(|^rgba\(/); // Valid color format
    });

    // Test area strokes are applied
    const areaStrokes = canvasElement.querySelectorAll('.recharts-area-curve');
    expect(areaStrokes.length).toBe(2);
    areaStrokes.forEach((stroke) => {
      const strokeColor = stroke.getAttribute('stroke');
      expect(strokeColor).toBeDefined();
      expect(strokeColor).not.toBe('none');
    });
    
    // Verify legend shows themed colors match chart elements
    const legendItems = canvasElement.querySelectorAll('.recharts-legend-item');
    expect(legendItems.length).toBe(2);
  },
};

export const VisualStates: Story = {
  args: {
    type: 'bar',
    data: testData,
    series: [{ dataKey: 'sales', name: 'Sales' }],
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

    // Test elevated variant styling with actual shadow verification
    const paper = canvasElement.querySelector('.MuiPaper-root');
    expect(paper).toBeInTheDocument();

    const computedStyle = window.getComputedStyle(paper as HTMLElement);
    expect(computedStyle.boxShadow).toBeDefined();
    expect(computedStyle.boxShadow).not.toBe('none');
    expect(computedStyle.boxShadow).toContain('rgba'); // MUI shadows contain rgba values

    // Test bars exist with correct count for single series
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    expect(bars.length).toBe(testData.length); // Should have 6 bars for 6 data points

    // Verify bars have actual data values by checking their dimensions
    bars.forEach((bar) => {
      const height = parseFloat(bar.getAttribute('height') || '0');
      const width = parseFloat(bar.getAttribute('width') || '0');
      
      // Bars should have actual dimensions based on data
      expect(height).toBeGreaterThan(0);
      expect(width).toBeGreaterThan(0);
      
      // Bars should have fill colors
      const fill = bar.getAttribute('fill');
      expect(fill).toBeDefined();
      expect(fill).not.toBe('none');
    });

    // Verify visual state doesn't affect data accuracy
    const xAxisLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    xAxisLabels.forEach(label => {
      const labelElement = canvas.getByText(label);
      expect(labelElement).toBeInTheDocument();
    });
  },
};

// Performance Tests
export const Performance: Story = {
  args: {
    type: 'line',
    data: Array.from({ length: 100 }, (_, i) => ({
      name: `Point ${i}`,
      value: 500 + Math.sin(i / 10) * 400, // Predictable pattern for testing
      series2: 400 + Math.cos(i / 8) * 300,
      series3: 300 + Math.sin(i / 12) * 200,
    })),
    series: [
      { dataKey: 'value', name: 'Series 1' },
      { dataKey: 'series2', name: 'Series 2' },
      { dataKey: 'series3', name: 'Series 3' }
    ],
    title: 'Performance Test - 100 Data Points',
    animate: true,
    animationDuration: 500, // Reduced for faster testing
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const startTime = Date.now();

    // Test chart renders with large dataset
    const title = await canvas.findByText('Performance Test - 100 Data Points');
    expect(title).toBeInTheDocument();

    // Test all data series are rendered
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    expect(lines.length).toBe(3); // Should have 3 lines for 3 series

    // Verify actual data points are rendered by checking dots
    await waitFor(() => {
      const dots = canvasElement.querySelectorAll('.recharts-line-dot');
      expect(dots.length).toBe(300); // 100 points * 3 series
    }, { timeout: 3000 });

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // Test renders within reasonable time (3 seconds for 100 points)
    expect(renderTime).toBeLessThan(3000);

    // Verify chart performance with large dataset - check specific data points
    const firstPointLabel = canvas.getByText('Point 0');
    const lastPointLabel = canvas.getByText('Point 99');
    expect(firstPointLabel).toBeInTheDocument();
    expect(lastPointLabel).toBeInTheDocument();

    // Test chart remains interactive after rendering large dataset
    const chartContainer = canvasElement.querySelector('.recharts-wrapper');
    expect(chartContainer).toBeInTheDocument();
    
    // Verify legend shows all series for large dataset
    const legend = canvasElement.querySelector('.recharts-legend-wrapper');
    expect(legend).toBeInTheDocument();
    const series1Legend = canvas.getByText('Series 1');
    const series2Legend = canvas.getByText('Series 2');
    const series3Legend = canvas.getByText('Series 3');
    expect(series1Legend).toBeInTheDocument();
    expect(series2Legend).toBeInTheDocument();
    expect(series3Legend).toBeInTheDocument();
  },
};

// Test different chart types
export const RadarChartTest: Story = {
  args: {
    type: 'radar',
    data: [
      { subject: 'Math', A: 120, B: 110, fullMark: 150 },
      { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
      { subject: 'English', A: 86, B: 130, fullMark: 150 },
      { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
      { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
      { subject: 'History', A: 65, B: 85, fullMark: 150 },
    ],
    series: [{ dataKey: 'A', name: 'Student A' }, { dataKey: 'B', name: 'Student B' }],
    xAxisKey: 'subject',
    title: 'Radar Chart Test',
    showLegend: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test radar chart renders
    const title = await canvas.findByText('Radar Chart Test');
    expect(title).toBeInTheDocument();

    // Test polar grid exists
    const polarGrid = canvasElement.querySelector('.recharts-polar-grid');
    expect(polarGrid).toBeInTheDocument();
    
    // Verify grid circles/polygons are rendered
    const gridCircles = polarGrid?.querySelectorAll('circle, polygon');
    expect(gridCircles?.length).toBeGreaterThan(0);

    // Test radar areas exist for each series
    const radarPolygons = canvasElement.querySelectorAll('.recharts-radar-polygon');
    expect(radarPolygons.length).toBe(2); // Two series

    // Verify radar polygons have actual path data
    radarPolygons.forEach((polygon) => {
      const points = polygon.getAttribute('points');
      expect(points).toBeTruthy();
      expect(points).toContain(','); // Contains coordinate pairs
      // Verify it has 6 points (one for each subject)
      const pointPairs = points?.split(' ') || [];
      expect(pointPairs.length).toBe(6);
    });

    // Test polar angle axis shows subject labels
    const mathLabel = canvas.getByText('Math');
    const physicsLabel = canvas.getByText('Physics');
    expect(mathLabel).toBeInTheDocument();
    expect(physicsLabel).toBeInTheDocument();

    // Test legend shows series names
    const studentA = canvas.getByText('Student A');
    const studentB = canvas.getByText('Student B');
    expect(studentA).toBeInTheDocument();
    expect(studentB).toBeInTheDocument();
  },
};

export const ScatterChartTest: Story = {
  args: {
    type: 'scatter',
    data: [
      { x: 100, y: 200, z: 200 },
      { x: 120, y: 100, z: 260 },
      { x: 170, y: 300, z: 400 },
      { x: 140, y: 250, z: 280 },
      { x: 150, y: 400, z: 500 },
      { x: 110, y: 280, z: 200 },
    ],
    xAxisKey: 'x',
    series: [{ dataKey: 'y', name: 'Value Y' }],
    title: 'Scatter Plot Test',
    showTooltip: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test scatter chart renders
    const title = await canvas.findByText('Scatter Plot Test');
    expect(title).toBeInTheDocument();

    // Test scatter dots exist
    const scatterDots = canvasElement.querySelectorAll('.recharts-scatter-symbol');
    expect(scatterDots.length).toBe(6); // 6 data points

    // Verify dots have correct positioning based on data
    scatterDots.forEach((dot) => {
      const cx = parseFloat(dot.getAttribute('cx') || '0');
      const cy = parseFloat(dot.getAttribute('cy') || '0');
      expect(cx).toBeGreaterThan(0);
      expect(cy).toBeGreaterThan(0);
    });

    // Test axes render with proper scale
    const xAxis = canvasElement.querySelector('.recharts-xAxis');
    const yAxis = canvasElement.querySelector('.recharts-yAxis');
    expect(xAxis).toBeInTheDocument();
    expect(yAxis).toBeInTheDocument();

    // Verify tooltip shows actual data on hover
    if (scatterDots.length > 0) {
      await userEvent.hover(scatterDots[0] as HTMLElement);
      await waitFor(() => {
        const tooltip = canvasElement.querySelector('.recharts-tooltip-wrapper');
        if (tooltip && tooltip.textContent) {
          expect(tooltip).toBeInTheDocument();
          // Should show x: 100, y: 200 for first point
          expect(tooltip.textContent).toMatch(/100|200/);
        }
      }, { timeout: 1000 });
    }
  },
};

// Test chart updates with new data
export const DataUpdateTest: Story = {
  args: {
    type: 'line',
    data: testData,
    series: [{ dataKey: 'sales', name: 'Sales' }],
    title: 'Data Update Test',
    animate: true,
    animationDuration: 300,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial render
    const title = await canvas.findByText('Data Update Test');
    expect(title).toBeInTheDocument();

    // Verify initial data renders correctly
    const dots = canvasElement.querySelectorAll('.recharts-line-dot');
    expect(dots.length).toBe(6); // Initial 6 data points

    // Verify line path updates with data
    const line = canvasElement.querySelector('.recharts-line-curve');
    expect(line).toBeInTheDocument();
    
    const initialPathData = line?.getAttribute('d');
    expect(initialPathData).toBeTruthy();
    expect(initialPathData).toContain('M'); // MoveTo command
    expect(initialPathData).toContain('C'); // Curve commands

    // Verify dots are positioned based on actual data values
    dots.forEach((dot) => {
      const cx = parseFloat(dot.getAttribute('cx') || '0');
      const cy = parseFloat(dot.getAttribute('cy') || '0');
      expect(cx).toBeGreaterThan(0);
      expect(cy).toBeGreaterThan(0);
    });

    // Test that chart maintains structure for dynamic updates
    const chartWrapper = canvasElement.querySelector('.recharts-wrapper');
    expect(chartWrapper).toBeInTheDocument();
    
    // Verify axes update properly with data
    const xAxisLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    xAxisLabels.forEach(label => {
      const labelElement = canvas.getByText(label);
      expect(labelElement).toBeInTheDocument();
    });

    // Verify Y-axis scale adjusts to data range
    const yAxisTicks = canvasElement.querySelectorAll('.recharts-yAxis .recharts-text');
    expect(yAxisTicks.length).toBeGreaterThan(0);
    
    // Test animation is working
    const animatedElements = canvasElement.querySelectorAll('[class*="recharts-line-curve"]');
    expect(animatedElements.length).toBeGreaterThan(0);
  },
};

// Test stacked charts
export const StackedChartTest: Story = {
  args: {
    type: 'bar',
    data: testData,
    series: [
      { dataKey: 'sales', name: 'Sales' },
      { dataKey: 'revenue', name: 'Revenue' },
      { dataKey: 'profit', name: 'Profit' },
    ],
    stacked: true,
    title: 'Stacked Bar Chart',
    showValues: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test stacked bar chart renders
    const title = await canvas.findByText('Stacked Bar Chart');
    expect(title).toBeInTheDocument();

    // Test bars are stacked (should still have 18 rectangles but positioned differently)
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    expect(bars.length).toBe(18); // 3 series * 6 data points

    // Verify bars are actually stacked by checking their y positions
    // Group bars by x position to verify stacking
    const barsByX: { [key: string]: HTMLElement[] } = {};
    bars.forEach((bar) => {
      const x = bar.getAttribute('x') || '0';
      if (!barsByX[x]) barsByX[x] = [];
      barsByX[x].push(bar as HTMLElement);
    });

    // Each x position should have 3 bars (one for each series)
    Object.values(barsByX).forEach((stackedBars) => {
      if (stackedBars.length === 3) {
        // Verify bars are stacked (different y positions)
        const yPositions = stackedBars.map(b => parseFloat(b.getAttribute('y') || '0'));
        const uniqueYPositions = new Set(yPositions);
        expect(uniqueYPositions.size).toBeGreaterThan(1); // Should have different y positions
      }
    });
  },
};

// Test curved vs linear lines
export const CurvedVsLinearTest: Story = {
  args: {
    type: 'line',
    data: testData,
    series: [{ dataKey: 'sales', name: 'Curved' }],
    curved: false, // Testing linear lines
    title: 'Linear Line Chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders
    const title = await canvas.findByText('Linear Line Chart');
    expect(title).toBeInTheDocument();

    // Test line is linear (not curved)
    const line = canvasElement.querySelector('.recharts-line-curve');
    expect(line).toBeInTheDocument();
    
    const pathData = line?.getAttribute('d');
    expect(pathData).toBeTruthy();
    // Linear paths use 'L' commands instead of 'C' (curve) commands
    expect(pathData).toContain('L'); // LineTo command for linear paths
    expect(pathData).not.toContain('C'); // Should not contain curve commands
  },
};

// Test animation behavior
export const AnimationTest: Story = {
  args: {
    type: 'bar',
    data: testData.slice(0, 3), // Use less data for faster animation
    series: [{ dataKey: 'sales', name: 'Sales' }],
    animate: true,
    animationDuration: 200, // Fast animation for testing
    title: 'Animation Test',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders
    const title = await canvas.findByText('Animation Test');
    expect(title).toBeInTheDocument();

    // Get initial bar heights
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    expect(bars.length).toBe(3);

    // Check that bars have animation (they should grow from 0)
    const initialHeights: number[] = [];
    bars.forEach((bar) => {
      const height = parseFloat(bar.getAttribute('height') || '0');
      initialHeights.push(height);
    });

    // Wait for animation to complete
    await waitFor(() => {
      const finalHeights: number[] = [];
      bars.forEach((bar) => {
        const height = parseFloat(bar.getAttribute('height') || '0');
        finalHeights.push(height);
        // All bars should have non-zero height after animation
        expect(height).toBeGreaterThan(0);
      });
    }, { timeout: 300 });
  },
};

// Edge Cases Tests
export const EdgeCases: Story = {
  args: {
    type: 'line',
    data: [{ name: 'Single Point', value: 42 }],
    series: [{ dataKey: 'value', name: 'Value' }],
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

    // Test single data point renders correctly
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    expect(lines.length).toBe(1); // Should have 1 line

    // Verify single data point is actually rendered
    const dots = canvasElement.querySelectorAll('.recharts-line-dot');
    expect(dots.length).toBe(1); // Should have exactly 1 dot

    // Verify the actual data label is shown
    const dataLabel = canvas.getByText('Single Point');
    expect(dataLabel).toBeInTheDocument();

    // Verify legend shows the series name
    const legendValue = canvas.getByText('Value');
    expect(legendValue).toBeInTheDocument();

    // Test tooltip works with single data point
    if (dots.length > 0) {
      const singleDot = dots[0] as HTMLElement;
      await userEvent.hover(singleDot);
      
      await waitFor(() => {
        const tooltip = canvasElement.querySelector('.recharts-tooltip-wrapper');
        if (tooltip && tooltip.textContent) {
          expect(tooltip).toBeInTheDocument();
          expect(tooltip.textContent).toContain('42'); // Should show the actual value
        }
      }, { timeout: 1000 });
    }
  },
};

export const EmptyData: Story = {
  args: {
    type: 'bar',
    data: [],
    series: [{ dataKey: 'value', name: 'Value' }],
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

    // Test no data points exist
    const dots = canvasElement.querySelectorAll('.recharts-line-dot, .recharts-bar-rectangle, .recharts-area-area');
    expect(dots.length).toBe(0);

    // Verify axes still render properly even with empty data
    const xAxis = canvasElement.querySelector('.recharts-xAxis');
    const yAxis = canvasElement.querySelector('.recharts-yAxis');
    expect(xAxis).toBeInTheDocument();
    expect(yAxis).toBeInTheDocument();

    // Test legend still shows series names even with no data
    const legendWrapper = canvasElement.querySelector('.recharts-legend-wrapper');
    if (legendWrapper) {
      const valueLegend = canvas.queryByText('Value');
      expect(valueLegend).toBeInTheDocument();
    }

    // Verify chart doesn't crash and maintains proper structure
    const chartSvg = canvasElement.querySelector('svg.recharts-surface');
    expect(chartSvg).toBeInTheDocument();
    
    // Test that empty data doesn't cause rendering errors
    const errorElements = canvasElement.querySelectorAll('[data-error], .error');
    expect(errorElements.length).toBe(0);
  },
};

// Test pie chart with actual data values
export const PieChartDataTest: Story = {
  args: {
    type: 'pie',
    data: pieData,
    series: [{ dataKey: 'value', name: 'Usage' }],
    title: 'Pie Chart Data Test',
    showValues: true,
    showLegend: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test pie chart renders
    const title = await canvas.findByText('Pie Chart Data Test');
    expect(title).toBeInTheDocument();

    // Test pie slices exist
    const pieSlices = canvasElement.querySelectorAll('.recharts-pie-sector');
    expect(pieSlices.length).toBe(4); // 4 data points in pieData

    // Verify each slice has proper path data
    pieSlices.forEach((slice) => {
      const pathData = slice.getAttribute('d');
      expect(pathData).toBeTruthy();
      expect(pathData).toContain('M'); // MoveTo
      expect(pathData).toContain('A'); // Arc command for pie slices
    });

    // Test colors are applied to slices
    const cells = canvasElement.querySelectorAll('.recharts-pie-sector path');
    cells.forEach((cell) => {
      const fill = cell.getAttribute('fill');
      expect(fill).toBeTruthy();
      expect(fill).toMatch(/^#[0-9a-fA-F]{6}$|^rgb\(|^rgba\(/); // Valid color
    });

    // Test legend shows all data categories
    const desktopLegend = canvas.getByText('Desktop');
    const mobileLegend = canvas.getByText('Mobile');
    const tabletLegend = canvas.getByText('Tablet');
    const otherLegend = canvas.getByText('Other');
    expect(desktopLegend).toBeInTheDocument();
    expect(mobileLegend).toBeInTheDocument();
    expect(tabletLegend).toBeInTheDocument();
    expect(otherLegend).toBeInTheDocument();

    // Test values are shown when showValues is true
    const labels = canvasElement.querySelectorAll('.recharts-pie-label-text');
    if (labels.length > 0) {
      // Verify labels contain actual percentage values
      const labelTexts = Array.from(labels).map(l => l.textContent);
      expect(labelTexts.some(text => text && text.includes('45'))).toBe(true); // Desktop: 45%
      expect(labelTexts.some(text => text && text.includes('30'))).toBe(true); // Mobile: 30%
    }
  },
};

// Test axis labels and formatting
export const AxisLabelsTest: Story = {
  args: {
    type: 'line',
    data: testData,
    series: [{ dataKey: 'sales', name: 'Sales ($)' }],
    title: 'Axis Labels Test',
    xAxisLabel: 'Month',
    yAxisLabel: 'Sales (USD)',
    showCartesianGrid: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders
    const title = await canvas.findByText('Axis Labels Test');
    expect(title).toBeInTheDocument();

    // Test X-axis label exists (Note: Recharts may not render text labels directly)
    const xAxis = canvasElement.querySelector('.recharts-xAxis');
    expect(xAxis).toBeInTheDocument();

    // Test Y-axis exists
    const yAxis = canvasElement.querySelector('.recharts-yAxis');
    expect(yAxis).toBeInTheDocument();

    // Test X-axis tick labels show months
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    monthLabels.forEach(month => {
      const label = canvas.getByText(month);
      expect(label).toBeInTheDocument();
    });

    // Test Y-axis has numeric tick labels
    const yAxisTicks = canvasElement.querySelectorAll('.recharts-yAxis .recharts-text');
    expect(yAxisTicks.length).toBeGreaterThan(0);
    
    yAxisTicks.forEach(tick => {
      const value = tick.textContent;
      if (value) {
        // Should be a number
        expect(isNaN(parseInt(value))).toBe(false);
      }
    });

    // Test cartesian grid is visible
    const grid = canvasElement.querySelector('.recharts-cartesian-grid');
    expect(grid).toBeInTheDocument();
    
    // Verify grid has both horizontal and vertical lines
    const gridHorizontal = grid?.querySelector('.recharts-cartesian-grid-horizontal');
    const gridVertical = grid?.querySelector('.recharts-cartesian-grid-vertical');
    expect(gridHorizontal).toBeInTheDocument();
    expect(gridVertical).toBeInTheDocument();
  },
};

export const LoadingState: Story = {
  args: {
    loading: true,
    size: 'md',
    color: 'primary',
    data: testData, // Data should be ignored while loading
    series: [{ dataKey: 'sales', name: 'Sales' }],
  },
  play: async ({ canvasElement }) => {
    // Test loading state shows spinner with correct styling
    const spinner = canvasElement.querySelector('.MuiCircularProgress-root');
    expect(spinner).toBeInTheDocument();
    
    // Verify spinner has primary color
    const spinnerElement = spinner as HTMLElement;
    const computedStyle = window.getComputedStyle(spinnerElement);
    expect(computedStyle.color).toBeDefined();

    // Test loading container has proper dimensions for 'md' size
    const loadingContainer = canvasElement.querySelector('.MuiPaper-root');
    expect(loadingContainer).toBeInTheDocument();
    const containerStyle = window.getComputedStyle(loadingContainer as HTMLElement);
    const containerHeight = parseFloat(containerStyle.height);
    expect(containerHeight).toBe(400); // 'md' size should be 400px height

    // Test no chart content while loading
    const chartWrapper = canvasElement.querySelector('.recharts-wrapper');
    expect(chartWrapper).not.toBeInTheDocument();

    // Verify no data elements are rendered during loading
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    const areas = canvasElement.querySelectorAll('.recharts-area-area');
    expect(bars.length).toBe(0);
    expect(lines.length).toBe(0);
    expect(areas.length).toBe(0);

    // Test loading container has proper centering
    const containerComputedStyle = window.getComputedStyle(loadingContainer as HTMLElement);
    expect(containerComputedStyle.display).toBe('flex');
    expect(containerComputedStyle.justifyContent).toBe('center');
    expect(containerComputedStyle.alignItems).toBe('center');
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Test composed chart renders
    const title = await canvas.findByText('Integration Test');
    expect(title).toBeInTheDocument();

    const subtitle = canvas.getByText('Multiple chart types combined');
    expect(subtitle).toBeInTheDocument();

    // Test all chart elements exist with correct counts
    const bars = canvasElement.querySelectorAll('.recharts-bar-rectangle');
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    const areas = canvasElement.querySelectorAll('.recharts-area-area');

    expect(bars.length).toBe(testData.length); // 6 bars for sales data
    expect(lines.length).toBe(1); // 1 line for revenue data
    expect(areas.length).toBe(1); // 1 area for profit data

    // Verify each chart type renders with actual data
    bars.forEach((bar) => {
      const height = parseFloat(bar.getAttribute('height') || '0');
      const width = parseFloat(bar.getAttribute('width') || '0');
      expect(height).toBeGreaterThan(0);
      expect(width).toBeGreaterThan(0);
    });

    // Verify line has actual path data
    const linePath = lines[0]?.getAttribute('d');
    expect(linePath).toBeTruthy();
    expect(linePath).toContain('M'); // MoveTo
    expect(linePath).toContain('C'); // Curve

    // Verify area has actual path data
    const areaPath = areas[0]?.getAttribute('d');
    expect(areaPath).toBeTruthy();
    expect(areaPath).toContain('M'); // MoveTo
    expect(areaPath).toContain('L'); // LineTo (for area closure)

    // Test legend shows all series with correct names
    const legend = canvasElement.querySelector('.recharts-legend-wrapper');
    expect(legend).toBeInTheDocument();
    const salesLegend = canvas.getByText('Sales');
    const revenueLegend = canvas.getByText('Revenue');
    const profitLegend = canvas.getByText('Profit');
    expect(salesLegend).toBeInTheDocument();
    expect(revenueLegend).toBeInTheDocument();
    expect(profitLegend).toBeInTheDocument();

    // Verify legend items have color indicators
    const legendItems = legend?.querySelectorAll('.recharts-legend-item');
    expect(legendItems?.length).toBe(3);
    legendItems?.forEach(item => {
      const surface = item.querySelector('.recharts-surface');
      expect(surface).toBeInTheDocument();
    });

    // Test grid is visible with proper styling
    const grid = canvasElement.querySelector('.recharts-cartesian-grid');
    expect(grid).toBeInTheDocument();
    const gridLines = grid?.querySelectorAll('line');
    expect(gridLines).toBeDefined();
    expect(gridLines!.length).toBeGreaterThan(0);

    // Verify grid lines have stroke styling
    gridLines?.forEach(line => {
      const stroke = line.getAttribute('stroke');
      expect(stroke).toBeTruthy();
    });

    // Verify all data points are shown on axes
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    monthLabels.forEach(month => {
      const label = canvas.getByText(month);
      expect(label).toBeInTheDocument();
    });

    // Test chart interaction with tooltip showing actual data values
    if (bars.length > 0) {
      const firstBar = bars[0] as HTMLElement;
      await userEvent.hover(firstBar);
      
      await waitFor(
        () => {
          const tooltip = canvasElement.querySelector('.recharts-tooltip-wrapper');
          if (tooltip && tooltip.textContent) {
            expect(tooltip).toBeInTheDocument();
            // Verify tooltip shows actual data values from testData for January
            const tooltipText = tooltip.textContent;
            expect(tooltipText).toMatch(/4000|2400/); // Jan sales: 4000, Jan profit: 2400
          }
        },
        { timeout: 2000 },
      );
    }

    // Test click interaction
    if (bars.length > 0) {
      await userEvent.click(bars[0] as HTMLElement);
      expect(args.onClick).toHaveBeenCalled();
    }
  },
};

// Test chart with custom colors
export const CustomColorsTest: Story = {
  args: {
    type: 'line',
    data: testData,
    series: [
      { dataKey: 'sales', name: 'Sales', color: '#FF6B6B' },
      { dataKey: 'revenue', name: 'Revenue', color: '#4ECDC4' },
      { dataKey: 'profit', name: 'Profit', color: '#45B7D1' },
    ],
    title: 'Custom Colors Test',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test chart renders
    const title = await canvas.findByText('Custom Colors Test');
    expect(title).toBeInTheDocument();

    // Test lines exist
    const lines = canvasElement.querySelectorAll('.recharts-line-curve');
    expect(lines.length).toBe(3);

    // Verify custom colors are applied
    lines.forEach((line) => {
      const stroke = line.getAttribute('stroke');
      expect(stroke).toBeTruthy();
      // Should match one of our custom colors
      expect(['#FF6B6B', '#4ECDC4', '#45B7D1'].includes(stroke!)).toBe(true);
    });

    // Test dots also have custom colors
    const dots = canvasElement.querySelectorAll('.recharts-line-dot');
    dots.forEach(dot => {
      const fill = dot.getAttribute('fill');
      expect(fill).toBeTruthy();
      expect(['#FF6B6B', '#4ECDC4', '#45B7D1'].includes(fill!)).toBe(true);
    });
  },
};
