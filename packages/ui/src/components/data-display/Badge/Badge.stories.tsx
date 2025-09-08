import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Stack, IconButton, Avatar, Typography, Paper, ThemeProvider, createTheme, Button } from '@mui/material';
import { Mail, Notifications, ShoppingCart, Star, Favorite, FiberManualRecord, CheckCircle, Error as ErrorIcon, Warning, Info, NewReleases, TrendingUp, Verified, Schedule } from '@mui/icons-material';

import { Badge } from './Badge';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile badge component for displaying notifications, counts, and status indicators with various styles and animations.'
      }
    }
  },
  tags: ['autodocs', 'component:Badge'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'dot', 'count', 'gradient', 'glass', 'outline', 'secondary', 'destructive', 'success', 'warning'],
      description: 'The visual style variant of the badge',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
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
    animate: {
      control: { type: 'boolean' },
      description: 'Whether to animate the badge on mount',
    },
    shimmer: {
      control: { type: 'boolean' },
      description: 'Whether to show a shimmer effect',
    },
    bounce: {
      control: { type: 'boolean' },
      description: 'Whether to bounce on mount',
    },
    closable: {
      control: { type: 'boolean' },
      description: 'Whether the badge can be closed',
    },
    icon: {
      control: { type: 'text' },
      description: 'Icon to display in the badge',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label for screen readers',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Showcase all features
export const Playground: Story = {
  args: {
    badgeContent: 5,
    variant: 'default',
    color: 'primary',
    size: 'md',
    position: 'top-right',
    glow: false,
    pulse: false,
    animate: true,
    showZero: false,
    max: 99,
    children: <Mail />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all badge props and combinations.',
      },
    },
  },
};

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
    <Stack spacing={3}>
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
        <Box textAlign="center">
          <Badge variant="glass" badgeContent="5" color="primary">
            <Favorite />
          </Badge>
          <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Glass</div>
        </Box>
      </Stack>
      <Stack direction="row" spacing={4} alignItems="center">
        <Box textAlign="center">
          <Badge variant="outline" badgeContent="NEW" color="primary">
            <NewReleases />
          </Badge>
          <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Outline</div>
        </Box>
        <Box textAlign="center">
          <Badge variant="secondary" badgeContent="12" color="secondary">
            <TrendingUp />
          </Badge>
          <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Secondary</div>
        </Box>
        <Box textAlign="center">
          <Badge variant="destructive" badgeContent="!" color="error">
            <ErrorIcon />
          </Badge>
          <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Destructive</div>
        </Box>
        <Box textAlign="center">
          <Badge variant="success" badgeContent="✓" color="success">
            <Verified />
          </Badge>
          <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Success</div>
        </Box>
        <Box textAlign="center">
          <Badge variant="warning" badgeContent="⚠" color="warning">
            <Warning />
          </Badge>
          <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Warning</div>
        </Box>
      </Stack>
    </Stack>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <Box textAlign="center">
        <Badge size="xs" badgeContent={4}>
          <Mail />
        </Badge>
        <div style={{ marginTop: 8, fontSize: '0.875rem' }}>Extra Small</div>
      </Box>
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

// Glass morphism effect
export const GlassMorphism: Story = {
  render: () => (
    <Box
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Badge variant="glass" badgeContent="NEW" color="primary" size="lg">
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.9)' }}>
            <Typography>Feature</Typography>
          </Paper>
        </Badge>
        <Badge variant="glass" badgeContent={7} color="success">
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
            <CheckCircle />
          </IconButton>
        </Badge>
        <Badge variant="glass" badgeContent="!" color="error" glow>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
            <ErrorIcon />
          </IconButton>
        </Badge>
      </Stack>
    </Box>
  ),
};

// Theme Variations
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export const ThemeVariations: Story = {
  render: () => (
    <Stack spacing={3}>
      <ThemeProvider theme={lightTheme}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Light Theme</Typography>
          <Stack direction="row" spacing={2}>
            <Badge badgeContent={4} color="primary">
              <Mail />
            </Badge>
            <Badge badgeContent="NEW" color="success" variant="gradient">
              <Star />
            </Badge>
            <Badge variant="dot" color="error" pulse>
              <Notifications />
            </Badge>
            <Badge variant="glass" badgeContent="5" color="warning">
              <ShoppingCart />
            </Badge>
          </Stack>
        </Paper>
      </ThemeProvider>
      
      <ThemeProvider theme={darkTheme}>
        <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>Dark Theme</Typography>
          <Stack direction="row" spacing={2}>
            <Badge badgeContent={4} color="primary">
              <Mail />
            </Badge>
            <Badge badgeContent="NEW" color="success" variant="gradient">
              <Star />
            </Badge>
            <Badge variant="dot" color="error" pulse>
              <Notifications />
            </Badge>
            <Badge variant="glass" badgeContent="5" color="warning">
              <ShoppingCart />
            </Badge>
          </Stack>
        </Paper>
      </ThemeProvider>
    </Stack>
  ),
};

// Status Indicators
export const StatusIndicators: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Status Badges</Typography>
      <Stack direction="row" spacing={3} alignItems="center">
        <Box textAlign="center">
          <Badge variant="dot" color="success" pulse>
            <Avatar sx={{ bgcolor: 'grey.300' }}>
              <FiberManualRecord />
            </Avatar>
          </Badge>
          <Typography variant="caption" display="block" mt={1}>Online</Typography>
        </Box>
        <Box textAlign="center">
          <Badge variant="dot" color="warning">
            <Avatar sx={{ bgcolor: 'grey.300' }}>
              <FiberManualRecord />
            </Avatar>
          </Badge>
          <Typography variant="caption" display="block" mt={1}>Away</Typography>
        </Box>
        <Box textAlign="center">
          <Badge variant="dot" color="error">
            <Avatar sx={{ bgcolor: 'grey.300' }}>
              <FiberManualRecord />
            </Avatar>
          </Badge>
          <Typography variant="caption" display="block" mt={1}>Busy</Typography>
        </Box>
        <Box textAlign="center">
          <Badge variant="dot" color="neutral">
            <Avatar sx={{ bgcolor: 'grey.300' }}>
              <FiberManualRecord />
            </Avatar>
          </Badge>
          <Typography variant="caption" display="block" mt={1}>Offline</Typography>
        </Box>
      </Stack>
    </Stack>
  ),
};

// Animated Badges
export const AnimatedBadges: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Animated Badges</Typography>
      <Stack direction="row" spacing={3} alignItems="center">
        <Box textAlign="center">
          <Badge badgeContent="NEW" color="success" animate>
            <Paper sx={{ p: 2 }}>
              <Typography>Fade In</Typography>
            </Paper>
          </Badge>
        </Box>
        <Box textAlign="center">
          <Badge badgeContent="BOUNCE" color="primary" bounce>
            <IconButton>
              <Star />
            </IconButton>
          </Badge>
          <Typography variant="caption" display="block">Bounce</Typography>
        </Box>
        <Box textAlign="center">
          <Badge badgeContent={3} color="error" pulse>
            <IconButton>
              <Notifications />
            </IconButton>
          </Badge>
          <Typography variant="caption" display="block">Pulse</Typography>
        </Box>
        <Box textAlign="center">
          <Badge badgeContent="HOT" color="warning" glow>
            <IconButton>
              <Star />
            </IconButton>
          </Badge>
          <Typography variant="caption" display="block">Glow</Typography>
        </Box>
        <Box textAlign="center">
          <Badge badgeContent="VIP" color="secondary" shimmer variant="gradient">
            <IconButton>
              <Verified />
            </IconButton>
          </Badge>
          <Typography variant="caption" display="block">Shimmer</Typography>
        </Box>
        <Box textAlign="center">
          <Badge badgeContent="!" color="error" glow pulse>
            <IconButton>
              <Warning />
            </IconButton>
          </Badge>
          <Typography variant="caption" display="block">Glow + Pulse</Typography>
        </Box>
      </Stack>
    </Stack>
  ),
};

// New Feature: Closable Badges
export const ClosableBadges: Story = {
  render: () => {
    const ClosableExample = () => {
      const [badges, setBadges] = useState([
        { id: 1, content: 'Tag 1' },
        { id: 2, content: 'Tag 2' },
        { id: 3, content: 'Tag 3' },
      ]);

      return (
        <Stack direction="row" spacing={2} alignItems="center">
          {badges.map((badge) => (
            <Badge
              key={badge.id}
              badgeContent={badge.content}
              closable
              onClose={() => setBadges(badges.filter(b => b.id !== badge.id))}
              color="primary"
              variant="secondary"
            >
              <Box sx={{ width: 40, height: 40, bgcolor: 'grey.200', borderRadius: 1 }} />
            </Badge>
          ))}
          {badges.length === 0 && (
            <Button
              size="small"
              onClick={() => setBadges([
                { id: 1, content: 'Tag 1' },
                { id: 2, content: 'Tag 2' },
                { id: 3, content: 'Tag 3' },
              ])}
            >
              Reset Tags
            </Button>
          )}
        </Stack>
      );
    };

    return <ClosableExample />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Badges with close buttons that can be dismissed by users.',
      },
    },
  },
};

// New Feature: Badges with Icons
export const BadgesWithIcons: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Badges with Icons</Typography>
      <Stack direction="row" spacing={3} alignItems="center">
        <Badge
          icon={<CheckCircle sx={{ fontSize: 'inherit' }} />}
          badgeContent="Done"
          color="success"
          variant="success"
        >
          <Paper sx={{ p: 2 }}>Task 1</Paper>
        </Badge>
        <Badge
          icon={<Schedule sx={{ fontSize: 'inherit' }} />}
          badgeContent="Pending"
          color="warning"
          variant="warning"
        >
          <Paper sx={{ p: 2 }}>Task 2</Paper>
        </Badge>
        <Badge
          icon={<ErrorIcon sx={{ fontSize: 'inherit' }} />}
          badgeContent="Failed"
          color="error"
          variant="destructive"
        >
          <Paper sx={{ p: 2 }}>Task 3</Paper>
        </Badge>
        <Badge
          icon={<TrendingUp sx={{ fontSize: 'inherit' }} />}
          badgeContent="+25%"
          color="primary"
          variant="gradient"
          glow
        >
          <Paper sx={{ p: 2 }}>Stats</Paper>
        </Badge>
      </Stack>
    </Stack>
  ),
};

// New Feature: All Animation Combinations
export const AnimationShowcase: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Animation Showcase</Typography>
      <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
        <Badge badgeContent="Fade" animate color="primary">
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>Fade In</Box>
        </Badge>
        <Badge badgeContent="Bounce" bounce color="secondary">
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>Bounce</Box>
        </Badge>
        <Badge badgeContent="Pulse" pulse color="error">
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>Pulse</Box>
        </Badge>
        <Badge badgeContent="Glow" glow color="warning">
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>Glow</Box>
        </Badge>
        <Badge badgeContent="Shimmer" shimmer variant="gradient" color="success">
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>Shimmer</Box>
        </Badge>
        <Badge badgeContent="All" bounce glow pulse shimmer variant="gradient" color="primary">
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>All Effects</Box>
        </Badge>
      </Stack>
    </Stack>
  ),
};

// Accessibility Example
export const AccessibilityExample: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Accessible Badges</Typography>
      <Stack direction="row" spacing={3}>
        <Badge 
          badgeContent={5} 
          color="error"
          aria-label="5 new messages"
          aria-live="polite"
        >
          <IconButton aria-label="Messages">
            <Mail />
          </IconButton>
        </Badge>
        <Badge 
          variant="dot" 
          color="success"
          aria-label="User is online"
          aria-live="polite"
        >
          <Avatar aria-label="User avatar">
            U
          </Avatar>
        </Badge>
        <Badge 
          badgeContent={99} 
          max={99}
          color="warning"
          aria-label="99 items in cart"
          aria-live="polite"
        >
          <IconButton aria-label="Shopping cart">
            <ShoppingCart />
          </IconButton>
        </Badge>
      </Stack>
      <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
        <Typography variant="body2">
          <Info sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
          These badges include ARIA labels and live regions for screen reader support.
        </Typography>
      </Paper>
    </Stack>
  ),
};

// Edge Cases
export const EdgeCases: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Edge Cases</Typography>
      <Stack direction="row" spacing={3} alignItems="center">
        <Box textAlign="center">
          <Badge badgeContent="VERYLONGTEXT" color="primary" size="sm">
            <Mail />
          </Badge>
          <Typography variant="caption" display="block" mt={1}>Long Text</Typography>
        </Box>
        <Box textAlign="center">
          <Badge badgeContent={999999} max={9999} color="error">
            <Notifications />
          </Badge>
          <Typography variant="caption" display="block" mt={1}>Large Number</Typography>
        </Box>
        <Box textAlign="center">
          <Badge badgeContent="🔥" color="warning" variant="gradient">
            <Star />
          </Badge>
          <Typography variant="caption" display="block" mt={1}>Emoji</Typography>
        </Box>
        <Box textAlign="center">
          <Badge badgeContent="" color="primary">
            <ShoppingCart />
          </Badge>
          <Typography variant="caption" display="block" mt={1}>Empty Content</Typography>
        </Box>
      </Stack>
    </Stack>
  ),
};