import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';

import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Form/Calendar',
  component: Calendar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'range', 'multi', 'year'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    color: 'primary',
  },
};

const VariantsComponent = () => {
const [values, setValues] = useState({
      default: null,
      range: null,
      multi: null,
      year: null,
    });

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Default</Typography>
          <Calendar
            variant="default"
            value={values.default}
            onChange={(value) => setValues(prev => ({ ...prev, default: value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Range Selection</Typography>
          <Calendar
            variant="range"
            color="secondary"
            value={values.range}
            onChange={(value) => setValues(prev => ({ ...prev, range: value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Multi Selection</Typography>
          <Calendar
            variant="multi"
            color="success"
            value={values.multi}
            onChange={(value) => setValues(prev => ({ ...prev, multi: value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Year View</Typography>
          <Calendar
            variant="year"
            color="warning"
            value={values.year}
            onChange={(value) => setValues(prev => ({ ...prev, year: value }))}
          />
        </Box>
      </Box>
    );
};

export const Variants: Story = {
  render: () => <VariantsComponent />,
};

export const Colors: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
      {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map((color) => (
        <Box key={color}>
          <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
            {color}
          </Typography>
          <Calendar
            color={color as any}
            size="sm"
          />
        </Box>
      ))}
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
        <Box key={size}>
          <Typography variant="h6" gutterBottom>
            Size: {size.toUpperCase()}
          </Typography>
          <Calendar
            size={size as any}
            color="primary"
          />
        </Box>
      ))}
    </Box>
  ),
};

const SpecialEffectsComponent = () => {
const [values, setValues] = useState({
      glass: null,
      gradient: null,
      combined: null,
    });

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Glass Morphism</Typography>
          <Calendar
            glass
            color="primary"
            value={values.glass}
            onChange={(value) => setValues(prev => ({ ...prev, glass: value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Gradient</Typography>
          <Calendar
            gradient
            color="secondary"
            value={values.gradient}
            onChange={(value) => setValues(prev => ({ ...prev, gradient: value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Combined Effects</Typography>
          <Calendar
            glass
            gradient
            color="success"
            variant="range"
            value={values.combined}
            onChange={(value) => setValues(prev => ({ ...prev, combined: value }))}
          />
        </Box>
      </Box>
    );
};

export const SpecialEffects: Story = {
  render: () => <SpecialEffectsComponent />,
};

const WithDateLimitsComponent = () => {
const [value, setValue] = useState<Date | null>(null);
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Date Range Limits (Last Month to Next Month)
        </Typography>
        <Calendar
          value={value}
          onChange={setValue}
          minDate={lastMonth}
          maxDate={nextMonth}
          color="warning"
        />
      </Box>
    );
};

export const WithDateLimits: Story = {
  render: () => <WithDateLimitsComponent />,
};

export const Playground: Story = {
  args: {
    variant: 'default',
    color: 'primary',
    size: 'md',
    glass: false,
    gradient: false,
  },
};