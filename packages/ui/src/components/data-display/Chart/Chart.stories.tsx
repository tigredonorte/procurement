import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography } from '@mui/material';

import { Chart } from './Chart';
import { ChartDataPoint, ChartSeries } from './Chart.types';

const meta: Meta<typeof Chart> = {
  title: 'Data Display/Chart',
  component: Chart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'bar', 'area', 'pie', 'radar', 'scatter', 'composed'],
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'gradient', 'elevated', 'minimal', 'neon'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chart>;

const lineData: ChartDataPoint[] = [
  { name: 'Jan', sales: 4000, revenue: 2400, profit: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398, profit: 2210 },
  { name: 'Mar', sales: 2000, revenue: 9800, profit: 2290 },
  { name: 'Apr', sales: 2780, revenue: 3908, profit: 2000 },
  { name: 'May', sales: 1890, revenue: 4800, profit: 2181 },
  { name: 'Jun', sales: 2390, revenue: 3800, profit: 2500 },
  { name: 'Jul', sales: 3490, revenue: 4300, profit: 2100 },
];

const barData: ChartDataPoint[] = [
  { category: 'Product A', q1: 120, q2: 150, q3: 180, q4: 200 },
  { category: 'Product B', q1: 90, q2: 110, q3: 125, q4: 145 },
  { category: 'Product C', q1: 200, q2: 180, q3: 220, q4: 250 },
  { category: 'Product D', q1: 150, q2: 160, q3: 170, q4: 180 },
];

const pieData: ChartDataPoint[] = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 15 },
  { name: 'Other', value: 10 },
];

const radarData: ChartDataPoint[] = [
  { skill: 'JavaScript', level: 90, target: 100 },
  { skill: 'React', level: 85, target: 90 },
  { skill: 'Node.js', level: 75, target: 85 },
  { skill: 'Python', level: 70, target: 80 },
  { skill: 'Database', level: 80, target: 85 },
  { skill: 'DevOps', level: 65, target: 75 },
];

const scatterData: ChartDataPoint[] = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

export const LineChart: Story = {
  args: {
    type: 'line',
    data: lineData,
    title: 'Sales Overview',
    subtitle: 'Monthly performance metrics',
    showGrid: true,
    showLegend: true,
    curved: true,
  },
};

export const BarChart: Story = {
  args: {
    type: 'bar',
    data: barData,
    xAxisKey: 'category',
    title: 'Quarterly Sales',
    subtitle: 'Product performance by quarter',
    showGrid: true,
    showLegend: true,
  },
};

export const StackedBar: Story = {
  args: {
    type: 'bar',
    data: barData,
    xAxisKey: 'category',
    title: 'Stacked Sales Data',
    stacked: true,
    showGrid: true,
    showLegend: true,
  },
};

export const AreaChart: Story = {
  args: {
    type: 'area',
    data: lineData,
    title: 'Revenue Trends',
    subtitle: 'Area chart with gradient fill',
    curved: true,
    showGrid: true,
    showLegend: true,
  },
};

export const PieChart: Story = {
  args: {
    type: 'pie',
    data: pieData,
    title: 'Device Usage',
    subtitle: 'Traffic distribution by device type',
    showLegend: true,
    showValues: true,
  },
};

export const RadarChart: Story = {
  args: {
    type: 'radar',
    data: radarData,
    xAxisKey: 'skill',
    title: 'Skills Assessment',
    subtitle: 'Current level vs target',
    showLegend: true,
  },
};

export const ScatterChart: Story = {
  args: {
    type: 'scatter',
    data: scatterData,
    xAxisKey: 'x',
    series: [{ dataKey: 'y', name: 'Values' }],
    title: 'Data Distribution',
    subtitle: 'Scatter plot analysis',
    showGrid: true,
  },
};

export const ComposedChart: Story = {
  args: {
    type: 'composed',
    data: lineData,
    series: [
      { dataKey: 'sales', name: 'Sales', type: 'bar' },
      { dataKey: 'revenue', name: 'Revenue', type: 'line' },
      { dataKey: 'profit', name: 'Profit', type: 'area' },
    ],
    title: 'Combined Metrics',
    subtitle: 'Multiple chart types in one',
    showGrid: true,
    showLegend: true,
  },
};

export const Glass: Story = {
  args: {
    type: 'line',
    data: lineData,
    variant: 'glass',
    glass: true,
    glow: true,
    title: 'Glass Effect Chart',
    curved: true,
  },
};

export const Gradient: Story = {
  args: {
    type: 'area',
    data: lineData,
    variant: 'gradient',
    gradient: true,
    color: 'primary',
    title: 'Gradient Background',
    curved: true,
  },
};

export const Neon: Story = {
  args: {
    type: 'line',
    data: lineData,
    variant: 'neon',
    title: 'Neon Style',
    subtitle: 'Cyberpunk themed chart',
    curved: true,
    glow: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Box key={size}>
          <Typography variant="h6" gutterBottom>
            Size: {size.toUpperCase()}
          </Typography>
          <Chart
            type="line"
            data={lineData}
            size={size}
            title={`Chart Size: ${size}`}
          />
        </Box>
      ))}
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
      {(['primary', 'secondary', 'success', 'error', 'warning', 'info'] as const).map((color) => (
        <Chart
          key={color}
          type="bar"
          data={pieData}
          color={color}
          variant="elevated"
          title={`Color: ${color}`}
          height={250}
        />
      ))}
    </Box>
  ),
};

export const WithEffects: Story = {
  args: {
    type: 'area',
    data: lineData,
    variant: 'glass',
    glow: true,
    pulse: true,
    glass: true,
    title: 'Enhanced Effects',
    subtitle: 'Glow and pulse animations',
    curved: true,
  },
};

const InteractiveComponent = () => {
const [clickedData, setClickedData] = React.useState<string>('');
    
    return (
      <Box>
        <Chart
          type="bar"
          data={barData}
          xAxisKey="category"
          title="Interactive Chart"
          subtitle="Click on bars to see data"
          onClick={(data) => {
            setClickedData(JSON.stringify(data, null, 2));
          }}
        />
        {clickedData && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" component="pre">
              {clickedData}
            </Typography>
          </Box>
        )}
      </Box>
    );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
};

export const Loading: Story = {
  args: {
    loading: true,
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    type: 'line',
    data: lineData,
    disabled: true,
    title: 'Disabled Chart',
    subtitle: 'Interaction disabled',
  },
};

export const CustomColors: Story = {
  args: {
    type: 'line',
    data: lineData,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    title: 'Custom Color Palette',
    curved: true,
    showLegend: true,
  },
};

export const NoAnimation: Story = {
  args: {
    type: 'bar',
    data: barData,
    xAxisKey: 'category',
    animate: false,
    title: 'No Animation',
    subtitle: 'Instant render without animations',
  },
};

const RealTimeDataComponent = () => {
const [data, setData] = React.useState<ChartDataPoint[]>([
      { time: '00:00', cpu: 45, memory: 60 },
    ]);

    React.useEffect(() => {
      const interval = window.setInterval(() => {
        setData((prev) => {
          const newData = [...prev];
          const time = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          });
          
          newData.push({
            time,
            cpu: Math.floor(Math.random() * 40) + 30,
            memory: Math.floor(Math.random() * 30) + 50,
          });
          
          if (newData.length > 10) {
            newData.shift();
          }
          
          return newData;
        });
      }, 2000);

      return () => window.clearInterval(interval);
    }, []);

    return (
      <Chart
        type="line"
        data={data}
        xAxisKey="time"
        title="Real-Time Monitoring"
        subtitle="CPU and Memory usage"
        variant="neon"
        curved
        animate
        animationDuration={500}
      />
    );
};

export const RealTimeData: Story = {
  render: () => <RealTimeDataComponent />,
};

export const Dashboard: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
      <Chart
        type="line"
        data={lineData}
        variant="elevated"
        title="Revenue Trend"
        size="sm"
        curved
      />
      <Chart
        type="pie"
        data={pieData}
        variant="elevated"
        title="Market Share"
        size="sm"
        showValues
      />
      <Chart
        type="bar"
        data={barData}
        xAxisKey="category"
        variant="elevated"
        title="Product Sales"
        size="sm"
        stacked
      />
      <Chart
        type="radar"
        data={radarData}
        xAxisKey="skill"
        variant="elevated"
        title="Team Skills"
        size="sm"
      />
    </Box>
  ),
};