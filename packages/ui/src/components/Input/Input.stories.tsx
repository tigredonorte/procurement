import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

const meta = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['outlined', 'filled', 'glass', 'underline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="outlined" label="Outlined" placeholder="Outlined input" />
      <Input variant="filled" label="Filled" placeholder="Filled input" />
      <Input variant="glass" label="Glass" placeholder="Glass morphism input" />
      <Input variant="underline" label="Underline" placeholder="Underline input" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input 
        label="Search" 
        placeholder="Search..." 
        startAdornment={<Search />}
      />
      <Input 
        label="Email" 
        type="email" 
        placeholder="john@example.com" 
        startAdornment={<Email />}
      />
      <PasswordInput />
    </div>
  ),
};

// Password input with visibility toggle
function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <Input
      label="Password"
      type={showPassword ? 'text' : 'password'}
      placeholder="Enter password"
      startAdornment={<Lock />}
      endAdornment={
        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      }
    />
  );
}

export const FloatingLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input floating label="Floating Label" placeholder="Type here..." />
      <Input floating variant="glass" label="Glass with Float" />
      <Input floating variant="filled" label="Filled with Float" />
    </div>
  ),
};

export const ErrorStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input 
        label="Email" 
        error 
        helperText="Please enter a valid email address"
        defaultValue="invalid-email"
      />
      <Input 
        variant="glass" 
        label="Required Field" 
        error 
        helperText="This field is required"
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'outlined',
    size: 'md',
    label: 'Playground Input',
    placeholder: 'Type something...',
    fullWidth: true,
    floating: false,
    error: false,
    helperText: 'This is helper text',
  },
};