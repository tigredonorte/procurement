import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';

import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Form/Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs', 'component:Slider'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'range', 'marks', 'gradient'],
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
    min: 0,
    max: 100,
    defaultValue: 30,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Volume',
    showValue: true,
    unit: '%',
    defaultValue: 50,
  },
};

const VariantsComponent = () => {
const [values, setValues] = useState({
      default: 30,
      range: [20, 70],
      marks: 50,
      gradient: 80,
    });

    const marks = [
      { value: 0, label: '0°C' },
      { value: 20, label: '20°C' },
      { value: 37, label: '37°C' },
      { value: 100, label: '100°C' },
    ];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, px: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Default</Typography>
          <Slider
            variant="default"
            label="Temperature"
            showValue
            unit="°C"
            value={values.default}
            onChange={(e, newValue) => setValues(prev => ({ ...prev, default: newValue }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Range</Typography>
          <Slider
            variant="range"
            label="Price Range"
            showValue
            unit="$"
            value={values.range}
            onChange={(e, newValue) => setValues(prev => ({ ...prev, range: newValue }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>With Marks</Typography>
          <Slider
            variant="marks"
            label="Temperature Scale"
            showValue
            customMarks={marks}
            value={values.marks}
            onChange={(e, newValue) => setValues(prev => ({ ...prev, marks: newValue }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Gradient</Typography>
          <Slider
            variant="gradient"
            gradient
            label="Intensity"
            showValue
            unit="%"
            color="secondary"
            value={values.gradient}
            onChange={(e, newValue) => setValues(prev => ({ ...prev, gradient: newValue }))}
          />
        </Box>
      </Box>
    );
};

export const Variants: Story = {
  render: () => <VariantsComponent />,
};

const ColorsComponent = () => {
const [value, setValue] = useState(50);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 2 }}>
        {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map((color) => (
          <Box key={color}>
            <Slider
              color={color}
              label={`${color.charAt(0).toUpperCase() + color.slice(1)} Slider`}
              showValue
              unit="%"
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
            />
          </Box>
        ))}
      </Box>
    );
};

export const Colors: Story = {
  render: () => <ColorsComponent />,
};

const SizesComponent = () => {
const [value, setValue] = useState(50);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 2 }}>
        {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
          <Box key={size}>
            <Slider
              size={size}
              label={`Size: ${size.toUpperCase()}`}
              showValue
              unit="%"
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
            />
          </Box>
        ))}
      </Box>
    );
};

export const Sizes: Story = {
  render: () => <SizesComponent />,
};

const SpecialEffectsComponent = () => {
const [values, setValues] = useState({
      glass: 60,
      gradient: 75,
      glow: 40,
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, px: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Glass Morphism</Typography>
          <Slider
            glass
            label="Glass Effect"
            showValue
            unit="%"
            value={values.glass}
            onChange={(e, newValue) => setValues(prev => ({ ...prev, glass: newValue }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Gradient</Typography>
          <Slider
            gradient
            color="secondary"
            label="Gradient Colors"
            showValue
            unit="%"
            value={values.gradient}
            onChange={(e, newValue) => setValues(prev => ({ ...prev, gradient: newValue }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Glow Effect</Typography>
          <Slider
            glow
            color="success"
            label="Glowing Slider"
            showValue
            unit="%"
            value={values.glow}
            onChange={(e, newValue) => setValues(prev => ({ ...prev, glow: newValue }))}
          />
        </Box>
      </Box>
    );
};

export const SpecialEffects: Story = {
  render: () => <SpecialEffectsComponent />,
};

export const Playground: Story = {
  args: {
    label: 'Playground Slider',
    showValue: true,
    unit: '%',
    variant: 'default',
    color: 'primary',
    size: 'md',
    min: 0,
    max: 100,
    defaultValue: 50,
    glass: false,
    gradient: false,
    glow: false,
  },
};