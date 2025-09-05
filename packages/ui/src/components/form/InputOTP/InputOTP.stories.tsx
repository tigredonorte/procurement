import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';

import { InputOTP } from './InputOTP';

const meta: Meta<typeof InputOTP> = {
  title: 'Form/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['numeric', 'alphanumeric', 'masked'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    length: {
      control: { type: 'number', min: 3, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'numeric',
    size: 'md',
    color: 'primary',
    length: 6,
    autoFocus: true,
  },
};

export const Variants: Story = {
  render: () => {
    const [values, setValues] = useState({
      numeric: '',
      alphanumeric: '',
      masked: '',
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Numeric (6 digits)</Typography>
          <InputOTP
            variant="numeric"
            length={6}
            value={values.numeric}
            onChange={(value) => setValues(prev => ({ ...prev, numeric: value }))}
            onComplete={(value) => console.log('Numeric OTP completed:', value)}
          />
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Alphanumeric (4 characters)</Typography>
          <InputOTP
            variant="alphanumeric"
            length={4}
            color="secondary"
            value={values.alphanumeric}
            onChange={(value) => setValues(prev => ({ ...prev, alphanumeric: value }))}
            onComplete={(value) => console.log('Alphanumeric OTP completed:', value)}
          />
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Masked (6 characters)</Typography>
          <InputOTP
            variant="masked"
            length={6}
            color="success"
            value={values.masked}
            onChange={(value) => setValues(prev => ({ ...prev, masked: value }))}
            onComplete={(value) => console.log('Masked OTP completed:', value)}
          />
        </Box>
      </Box>
    );
  },
};

export const Colors: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map((color) => (
          <Box key={color} sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'capitalize' }}>
              {color}
            </Typography>
            <InputOTP
              color={color}
              length={4}
              value={value}
              onChange={setValue}
            />
          </Box>
        ))}
      </Box>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
          <Box key={size} sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Size: {size.toUpperCase()}
            </Typography>
            <InputOTP
              size={size}
              length={4}
              value={value}
              onChange={setValue}
            />
          </Box>
        ))}
      </Box>
    );
  },
};

export const SpecialEffects: Story = {
  render: () => {
    const [values, setValues] = useState({
      glass: '',
      gradient: '',
      combined: '',
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Glass Morphism</Typography>
          <InputOTP
            glass
            length={6}
            value={values.glass}
            onChange={(value) => setValues(prev => ({ ...prev, glass: value }))}
          />
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Gradient</Typography>
          <InputOTP
            gradient
            color="secondary"
            length={6}
            value={values.gradient}
            onChange={(value) => setValues(prev => ({ ...prev, gradient: value }))}
          />
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Combined Effects</Typography>
          <InputOTP
            glass
            gradient
            color="success"
            size="lg"
            length={4}
            value={values.combined}
            onChange={(value) => setValues(prev => ({ ...prev, combined: value }))}
          />
        </Box>
      </Box>
    );
  },
};

export const ErrorState: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Error State</Typography>
        <InputOTP
          error
          length={6}
          value={value}
          onChange={setValue}
        />
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
          Invalid verification code
        </Typography>
      </Box>
    );
  },
};

export const DifferentLengths: Story = {
  render: () => {
    const [values, setValues] = useState({
      short: '',
      medium: '',
      long: '',
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>4 Digits (SMS Code)</Typography>
          <InputOTP
            length={4}
            color="primary"
            value={values.short}
            onChange={(value) => setValues(prev => ({ ...prev, short: value }))}
          />
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>6 Digits (Authenticator)</Typography>
          <InputOTP
            length={6}
            color="secondary"
            value={values.medium}
            onChange={(value) => setValues(prev => ({ ...prev, medium: value }))}
          />
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>8 Characters (Custom)</Typography>
          <InputOTP
            variant="alphanumeric"
            length={8}
            color="success"
            size="sm"
            value={values.long}
            onChange={(value) => setValues(prev => ({ ...prev, long: value }))}
          />
        </Box>
      </Box>
    );
  },
};

export const Playground: Story = {
  args: {
    variant: 'numeric',
    color: 'primary',
    size: 'md',
    length: 6,
    autoFocus: true,
    glass: false,
    gradient: false,
    error: false,
    disabled: false,
  },
};