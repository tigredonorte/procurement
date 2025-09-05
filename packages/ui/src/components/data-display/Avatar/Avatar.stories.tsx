import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Box } from '@mui/material';
import { Settings } from '@mui/icons-material';

import { Avatar } from './Avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['circle', 'square', 'rounded', 'status'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'neutral'],
    },
    status: {
      control: { type: 'select' },
      options: ['online', 'offline', 'away', 'busy'],
    },
    glow: {
      control: { type: 'boolean' },
    },
    pulse: {
      control: { type: 'boolean' },
    },
    bordered: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    fallback: 'JD',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'John Doe',
  },
};

export const WithInitials: Story = {
  args: {
    fallback: 'AB',
    color: 'secondary',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Settings />,
    color: 'success',
  },
};

// Size variations
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar size="xs" fallback="XS" />
      <Avatar size="sm" fallback="SM" />
      <Avatar size="md" fallback="MD" />
      <Avatar size="lg" fallback="LG" />
      <Avatar size="xl" fallback="XL" />
      <Avatar size="xxl" fallback="XXL" />
    </Stack>
  ),
};

// Variant styles
export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar variant="circle" fallback="CI" />
      <Avatar variant="square" fallback="SQ" />
      <Avatar variant="rounded" fallback="RD" />
      <Avatar variant="status" fallback="ST" status="online" />
    </Stack>
  ),
};

// Color variations
export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar color="primary" fallback="PR" />
      <Avatar color="secondary" fallback="SC" />
      <Avatar color="success" fallback="SU" />
      <Avatar color="warning" fallback="WA" />
      <Avatar color="error" fallback="ER" />
      <Avatar color="neutral" fallback="NT" />
    </Stack>
  ),
};

// Status indicators
export const StatusIndicators: Story = {
  render: () => (
    <Stack direction="row" spacing={3} alignItems="center">
      <Box textAlign="center">
        <Avatar variant="status" status="online" fallback="ON" size="lg" />
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Online</div>
      </Box>
      <Box textAlign="center">
        <Avatar variant="status" status="offline" fallback="OF" size="lg" />
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Offline</div>
      </Box>
      <Box textAlign="center">
        <Avatar variant="status" status="away" fallback="AW" size="lg" />
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Away</div>
      </Box>
      <Box textAlign="center">
        <Avatar variant="status" status="busy" fallback="BS" size="lg" />
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Busy</div>
      </Box>
    </Stack>
  ),
};

// With borders
export const Bordered: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar bordered fallback="B1" />
      <Avatar bordered variant="square" fallback="B2" color="secondary" />
      <Avatar bordered variant="rounded" fallback="B3" color="success" />
      <Avatar bordered variant="status" status="online" fallback="B4" color="warning" />
    </Stack>
  ),
};

// With effects
export const WithGlow: Story = {
  args: {
    glow: true,
    fallback: 'GW',
    color: 'primary',
    size: 'lg',
  },
};

export const WithPulse: Story = {
  args: {
    pulse: true,
    fallback: 'PL',
    color: 'success',
    size: 'lg',
  },
};

export const WithGlowAndPulse: Story = {
  args: {
    glow: true,
    pulse: true,
    fallback: 'GP',
    color: 'warning',
    size: 'lg',
  },
};

// Real world examples
export const UserProfile: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        src="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face"
        alt="Sarah Johnson"
        size="xl"
        variant="status"
        status="online"
        bordered
      />
      <Box>
        <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>Sarah Johnson</div>
        <div style={{ color: '#666', fontSize: '0.875rem' }}>Product Manager</div>
        <div style={{ color: '#4caf50', fontSize: '0.75rem', marginTop: 4 }}>● Online</div>
      </Box>
    </Stack>
  ),
};

export const TeamAvatars: Story = {
  render: () => (
    <Stack spacing={3}>
      <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>Team Members</div>
      <Stack direction="row" spacing={-1}>
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="John"
          size="md"
          bordered
        />
        <Avatar
          src="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face"
          alt="Sarah"
          size="md"
          bordered
        />
        <Avatar
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          alt="Mike"
          size="md"
          bordered
        />
        <Avatar fallback="+5" size="md" color="neutral" bordered />
      </Stack>
    </Stack>
  ),
};

// Interactive examples
export const AllSizesWithEffects: Story = {
  render: () => (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <div style={{ width: 60, fontSize: '0.875rem' }}>Normal:</div>
        <Avatar size="xs" fallback="XS" />
        <Avatar size="sm" fallback="SM" />
        <Avatar size="md" fallback="MD" />
        <Avatar size="lg" fallback="LG" />
        <Avatar size="xl" fallback="XL" />
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <div style={{ width: 60, fontSize: '0.875rem' }}>Glow:</div>
        <Avatar size="xs" fallback="XS" glow color="primary" />
        <Avatar size="sm" fallback="SM" glow color="secondary" />
        <Avatar size="md" fallback="MD" glow color="success" />
        <Avatar size="lg" fallback="LG" glow color="warning" />
        <Avatar size="xl" fallback="XL" glow color="error" />
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <div style={{ width: 60, fontSize: '0.875rem' }}>Pulse:</div>
        <Avatar size="xs" fallback="XS" pulse color="primary" />
        <Avatar size="sm" fallback="SM" pulse color="secondary" />
        <Avatar size="md" fallback="MD" pulse color="success" />
        <Avatar size="lg" fallback="LG" pulse color="warning" />
        <Avatar size="xl" fallback="XL" pulse color="error" />
      </Stack>
    </Stack>
  ),
};