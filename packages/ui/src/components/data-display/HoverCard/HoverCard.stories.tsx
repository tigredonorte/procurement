import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';
import { Button, Typography, Avatar, Chip, Stack, Box } from '@mui/material';
import { Person, Star, Verified } from '@mui/icons-material';

const meta = {
  title: 'Data Display/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'glass', 'detailed'],
    },
    glow: {
      control: { type: 'boolean' },
    },
    pulse: {
      control: { type: 'boolean' },
    },
    enterDelay: {
      control: { type: 'number' },
    },
    exitDelay: {
      control: { type: 'number' },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    title: 'Hover Card',
    description: 'This is a hover card with some information.',
    children: <Button variant="outlined">Hover me</Button>,
  },
};

export const WithCustomTrigger: Story = {
  args: {
    title: 'User Information',
    description: 'Additional details about this user.',
    trigger: <Button variant="contained" startIcon={<Person />}>User Profile</Button>,
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={3}>
      <HoverCard
        variant="default"
        title="Default Card"
        description="This is a default hover card with standard styling."
      >
        <Button variant="outlined">Default</Button>
      </HoverCard>
      <HoverCard
        variant="glass"
        title="Glass Card"
        description="This card uses glassmorphism effects."
      >
        <Button variant="outlined">Glass</Button>
      </HoverCard>
      <HoverCard
        variant="detailed"
        title="Detailed Card"
        description="This card has enhanced styling for detailed content."
        avatar="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face"
      >
        <Button variant="outlined">Detailed</Button>
      </HoverCard>
    </Stack>
  ),
};

// User profile examples
export const UserProfile: Story = {
  render: () => (
    <HoverCard
      variant="detailed"
      title="Sarah Johnson"
      description="Senior Product Manager at TechCorp"
      avatar="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face"
      maxWidth={300}
    >
      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
        @sarah_johnson
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1}>
          <Chip icon={<Verified />} label="Verified" size="small" color="primary" />
          <Chip icon={<Star />} label="Pro" size="small" color="warning" />
        </Stack>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Building amazing products and leading great teams. 
          Passionate about user experience and innovation.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Typography variant="caption">
            <strong>1.2K</strong> followers
          </Typography>
          <Typography variant="caption">
            <strong>340</strong> following
          </Typography>
        </Box>
      </Box>
    </HoverCard>
  ),
};

// Product information
export const ProductInfo: Story = {
  render: () => (
    <HoverCard
      variant="default"
      title="Premium Subscription"
      description="Unlock all features with our premium plan"
    >
      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, cursor: 'pointer' }}>
        <Typography variant="h6">Pro Plan</Typography>
        <Typography variant="body2" color="text.secondary">$29/month</Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>Features included:</Typography>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.875rem' }}>
          <li>Unlimited projects</li>
          <li>Advanced analytics</li>
          <li>Priority support</li>
          <li>Team collaboration</li>
        </ul>
      </Box>
    </HoverCard>
  ),
};

// With effects
export const WithGlow: Story = {
  args: {
    variant: 'glass',
    glow: true,
    title: 'Glowing Card',
    description: 'This card has a beautiful glow effect.',
    children: <Button variant="contained" color="primary">Glow Effect</Button>,
  },
};

export const WithPulse: Story = {
  args: {
    variant: 'default',
    pulse: true,
    title: 'Pulsing Card',
    description: 'This card pulses to grab attention.',
    children: <Button variant="contained" color="warning">Pulse Effect</Button>,
  },
};

export const WithGlowAndPulse: Story = {
  args: {
    variant: 'detailed',
    glow: true,
    pulse: true,
    title: 'Premium Feature',
    description: 'This card combines both glow and pulse effects.',
    children: <Button variant="contained" color="secondary">Combined Effects</Button>,
  },
};

// Different delays
export const CustomDelays: Story = {
  render: () => (
    <Stack direction="row" spacing={3}>
      <HoverCard
        title="Fast Hover"
        description="Shows quickly (100ms delay)"
        enterDelay={100}
        exitDelay={0}
      >
        <Button variant="outlined">Fast</Button>
      </HoverCard>
      <HoverCard
        title="Normal Hover"
        description="Shows after 700ms (default)"
        enterDelay={700}
        exitDelay={0}
      >
        <Button variant="outlined">Normal</Button>
      </HoverCard>
      <HoverCard
        title="Slow Hover"
        description="Shows after 1.5 seconds"
        enterDelay={1500}
        exitDelay={200}
      >
        <Button variant="outlined">Slow</Button>
      </HoverCard>
    </Stack>
  ),
};

// Complex content
export const ComplexContent: Story = {
  render: () => (
    <HoverCard
      variant="detailed"
      maxWidth={350}
    >
      <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
        View Analytics Dashboard
      </Typography>
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Monthly Stats</Typography>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Total Views:</Typography>
            <Typography variant="body2" fontWeight={600}>12,345</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Unique Visitors:</Typography>
            <Typography variant="body2" fontWeight={600}>8,901</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Conversion Rate:</Typography>
            <Typography variant="body2" fontWeight={600} color="success.main">4.2%</Typography>
          </Box>
        </Stack>
        <Button fullWidth variant="outlined" size="small" sx={{ mt: 2 }}>
          View Details
        </Button>
      </Box>
    </HoverCard>
  ),
};

// Inline text hover
export const InlineText: Story = {
  render: () => (
    <Typography variant="body1">
      You can hover over{' '}
      <HoverCard
        title="Hover Definition"
        description="A hover card is a UI element that appears when you hover over a trigger element."
        variant="glass"
      >
        <Typography
          component="span"
          color="primary"
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          hover cards
        </Typography>
      </HoverCard>
      {' '}to see additional information without navigating away from the current page.
    </Typography>
  ),
};