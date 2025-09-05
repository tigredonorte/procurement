import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Box, Stack, IconButton, Avatar } from '@mui/material';
import { Mail, Notifications, ShoppingCart, Star, Favorite } from '@mui/icons-material';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'dot', 'count', 'gradient'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'neutral'],
    },
    position: {
      control: { type: 'select' },
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
    glow: {
      control: { type: 'boolean' },
    },
    pulse: {
      control: { type: 'boolean' },
    },
    showZero: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    badgeContent: 4,
    children: <Mail />,
  },
};

export const WithIcon: Story = {
  args: {
    badgeContent: 12,
    color: 'error',
    children: <Notifications />,
  },
};

export const WithText: Story = {
  args: {
    badgeContent: 'NEW',
    color: 'success',
    size: 'lg',
    children: <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>Product</Box>,
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <Box textAlign="center">
        <Badge variant="default" badgeContent={4}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Default</div>
      </Box>
      <Box textAlign="center">
        <Badge variant="dot" color="success">
          <Notifications />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Dot</div>
      </Box>
      <Box textAlign="center">
        <Badge variant="count" badgeContent={99} color="error">
          <ShoppingCart />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Count</div>
      </Box>
      <Box textAlign="center">
        <Badge variant="gradient" badgeContent="PRO" color="warning">
          <Star />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Gradient</div>
      </Box>
    </Stack>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <Box textAlign="center">
        <Badge size="sm" badgeContent={4}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Small</div>
      </Box>
      <Box textAlign="center">
        <Badge size="md" badgeContent={4}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Medium</div>
      </Box>
      <Box textAlign="center">
        <Badge size="lg" badgeContent={4}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Large</div>
      </Box>
    </Stack>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={3} alignItems="center">
      <Badge color="primary" badgeContent={4}><Mail /></Badge>
      <Badge color="secondary" badgeContent={4}><Mail /></Badge>
      <Badge color="success" badgeContent={4}><Mail /></Badge>
      <Badge color="warning" badgeContent={4}><Mail /></Badge>
      <Badge color="error" badgeContent={4}><Mail /></Badge>
      <Badge color="neutral" badgeContent={4}><Mail /></Badge>
    </Stack>
  ),
};

// Positions
export const Positions: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <Box textAlign="center">
        <Badge position="top-right" badgeContent={1}>
          <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Top Right</div>
      </Box>
      <Box textAlign="center">
        <Badge position="top-left" badgeContent={2}>
          <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Top Left</div>
      </Box>
      <Box textAlign="center">
        <Badge position="bottom-right" badgeContent={3}>
          <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Bottom Right</div>
      </Box>
      <Box textAlign="center">
        <Badge position="bottom-left" badgeContent={4}>
          <Box sx={{ width: 40, height: 40, bgcolor: 'grey.300', borderRadius: 1 }} />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Bottom Left</div>
      </Box>
    </Stack>
  ),
};

// Count formatting
export const CountFormatting: Story = {
  render: () => (
    <Stack direction="row" spacing={3} alignItems="center">
      <Box textAlign="center">
        <Badge variant="count" badgeContent={5}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>5</div>
      </Box>
      <Box textAlign="center">
        <Badge variant="count" badgeContent={99}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>99</div>
      </Box>
      <Box textAlign="center">
        <Badge variant="count" badgeContent={100} max={99}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>99+</div>
      </Box>
      <Box textAlign="center">
        <Badge variant="count" badgeContent={1000} max={999}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>999+</div>
      </Box>
    </Stack>
  ),
};

// With effects
export const WithGlow: Story = {
  args: {
    glow: true,
    badgeContent: 'HOT',
    color: 'error',
    size: 'lg',
    children: <Favorite />,
  },
};

export const WithPulse: Story = {
  args: {
    pulse: true,
    variant: 'dot',
    color: 'success',
    children: <Notifications />,
  },
};

export const WithGlowAndPulse: Story = {
  args: {
    glow: true,
    pulse: true,
    badgeContent: '!',
    color: 'warning',
    children: <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>Alert</Box>,
  },
};

// Real-world examples
export const NotificationBadges: Story = {
  render: () => (
    <Stack direction="row" spacing={3} alignItems="center">
      <IconButton>
        <Badge badgeContent={4} color="error">
          <Mail />
        </Badge>
      </IconButton>
      <IconButton>
        <Badge variant="dot" color="success">
          <Notifications />
        </Badge>
      </IconButton>
      <IconButton>
        <Badge badgeContent={12} color="warning">
          <ShoppingCart />
        </Badge>
      </IconButton>
    </Stack>
  ),
};

export const UserProfileWithBadge: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Badge variant="dot" color="success" position="bottom-right">
        <Avatar 
          src="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face"
          alt="User"
          sx={{ width: 56, height: 56 }}
        />
      </Badge>
      <Box>
        <div style={{ fontWeight: 600 }}>Sarah Johnson</div>
        <div style={{ color: '#666', fontSize: '0.875rem' }}>Online</div>
      </Box>
    </Stack>
  ),
};

export const ProductBadges: Story = {
  render: () => (
    <Stack direction="row" spacing={3}>
      <Box sx={{ position: 'relative', p: 2, border: 1, borderColor: 'divider', borderRadius: 2, width: 120, textAlign: 'center' }}>
        <Badge badgeContent="NEW" color="success" size="sm" position="top-left">
          <Box sx={{ width: '100%', height: 80, bgcolor: 'grey.100', borderRadius: 1, mb: 1 }} />
        </Badge>
        <div style={{ fontSize: '0.875rem' }}>Product A</div>
      </Box>
      <Box sx={{ position: 'relative', p: 2, border: 1, borderColor: 'divider', borderRadius: 2, width: 120, textAlign: 'center' }}>
        <Badge badgeContent="50%" color="error" variant="gradient" position="top-right">
          <Box sx={{ width: '100%', height: 80, bgcolor: 'grey.100', borderRadius: 1, mb: 1 }} />
        </Badge>
        <div style={{ fontSize: '0.875rem' }}>Product B</div>
      </Box>
      <Box sx={{ position: 'relative', p: 2, border: 1, borderColor: 'divider', borderRadius: 2, width: 120, textAlign: 'center' }}>
        <Badge variant="dot" color="warning" pulse position="top-left">
          <Box sx={{ width: '100%', height: 80, bgcolor: 'grey.100', borderRadius: 1, mb: 1 }} />
        </Badge>
        <div style={{ fontSize: '0.875rem' }}>Product C</div>
      </Box>
    </Stack>
  ),
};

// Zero handling
export const ZeroHandling: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <Box textAlign="center">
        <Badge badgeContent={0} showZero={false}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Hidden Zero</div>
      </Box>
      <Box textAlign="center">
        <Badge badgeContent={0} showZero={true}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Show Zero</div>
      </Box>
    </Stack>
  ),
};