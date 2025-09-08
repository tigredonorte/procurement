import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Stack, Typography, Grid } from '@mui/material';
import { 
  Settings, 
  Favorite, 
  Star, 
  Home, 
  Search, 
  AccountCircle,
  Refresh,
  Download,
  Upload,
  Notifications,
  Edit,
  Delete
} from '@mui/icons-material';

import { AnimatedIcon } from './AnimatedIcon';

const meta = {
  title: 'Enhanced/AnimatedIcon',
  component: AnimatedIcon,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Animated icon wrapper that can animate any icon/SVG with various effects like rotate, pulse, translate, glow, and glass morphism.' } },
  },
  tags: ['autodocs', 'component:AnimatedIcon'],
  argTypes: {
    children: {
      control: false,
      description: 'Icon element to animate - can be any React node (MUI icon, SVG, etc.)',
    },
    variant: {
      control: 'select',
      options: ['rotate', 'pulse', 'translate', 'none'],
      description: 'Animation variant to apply',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the animated icon container',
    },
    color: {
      control: 'color',
      description: 'Custom color override for the icon',
    },
    duration: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.5 },
      description: 'Animation duration in seconds',
    },
    delay: {
      control: { type: 'range', min: 0, max: 3, step: 0.5 },
      description: 'Animation delay in seconds',
    },
    loop: {
      control: 'boolean',
      description: 'Whether the animation should loop infinitely',
    },
    glow: {
      control: 'boolean',
      description: 'Enable glow effect around the icon',
    },
    glass: {
      control: 'boolean',
      description: 'Enable glass morphism effect',
    },
    glowColor: {
      control: 'color',
      description: 'Glow color (only used when glow is true)',
    },
  },
} satisfies Meta<typeof AnimatedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Settings />,
    variant: 'rotate',
    size: 'md',
    duration: 2,
  },
};

export const Rotate: Story = {
  args: {
    children: <Refresh />,
    variant: 'rotate',
    size: 'lg',
    duration: 2,
  },
};

export const Pulse: Story = {
  args: {
    children: <Favorite />,
    variant: 'pulse',
    size: 'lg',
    duration: 1.5,
  },
};

export const Translate: Story = {
  args: {
    children: <Star />,
    variant: 'translate',
    size: 'lg',
    duration: 2,
  },
};

export const WithGlow: Story = {
  args: {
    children: <Notifications />,
    variant: 'pulse',
    size: 'lg',
    duration: 1.5,
    glow: true,
    glowColor: '#FFD700',
  },
};

export const WithGlass: Story = {
  args: {
    children: <Home />,
    variant: 'rotate',
    size: 'lg',
    duration: 3,
    glass: true,
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants = [
      { variant: 'rotate', icon: <Refresh />, description: 'Continuous rotation animation' },
      { variant: 'pulse', icon: <Favorite />, description: 'Scale pulsing effect' },
      { variant: 'translate', icon: <Star />, description: 'Vertical translation movement' },
      { variant: 'none', icon: <Home />, description: 'No animation, static display' },
    ] as const;

    return (
      <Grid container spacing={4}>
        {variants.map(({ variant, icon, description }) => (
          <Grid item xs={12} sm={6} md={3} key={variant}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <AnimatedIcon variant={variant} size="lg">
                {icon}
              </AnimatedIcon>
              <Typography variant="h6" sx={{ mt: 2, textTransform: 'capitalize' }}>
                {variant}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const icons = [Settings, Favorite, Star, Search, AccountCircle];
    const variants = ['rotate', 'pulse', 'translate', 'none', 'rotate'] as const;

    return (
      <Stack spacing={4}>
        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Paper
            key={size}
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={4} alignItems="center">
              <Box sx={{ minWidth: 80 }}>
                <Typography variant="body1" fontWeight="medium">
                  {size.toUpperCase()}
                </Typography>
              </Box>
              <Stack direction="row" spacing={3} flex={1}>
                {icons.map((IconComponent, index) => (
                  <AnimatedIcon 
                    key={index} 
                    variant={variants[index]} 
                    size={size}
                  >
                    <IconComponent />
                  </AnimatedIcon>
                ))}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  },
};

export const CustomColors: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <AnimatedIcon variant="rotate" size="lg" color="#FF6B6B">
            <Refresh />
          </AnimatedIcon>
          <AnimatedIcon variant="pulse" size="lg" color="#4ECDC4">
            <Favorite />
          </AnimatedIcon>
          <AnimatedIcon variant="translate" size="lg" color="#95E1D3">
            <Star />
          </AnimatedIcon>
          <AnimatedIcon variant="rotate" size="lg" color="#FFA502">
            <Settings />
          </AnimatedIcon>
          <AnimatedIcon variant="pulse" size="lg" color="#786FA6">
            <Notifications />
          </AnimatedIcon>
        </Stack>
      </Paper>
    </Stack>
  ),
};

export const DifferentDurations: Story = {
  render: () => (
    <Stack spacing={3}>
      {[0.5, 1, 1.5, 2, 3, 4].map((duration) => (
        <Paper key={duration} sx={{ p: 3 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="body1">
                Duration: {duration}s
              </Typography>
            </Box>
            <AnimatedIcon variant="loading" size="md" duration={duration} />
            <AnimatedIcon variant="processing" size="md" duration={duration} />
            <AnimatedIcon variant="pulse" size="md" duration={duration} />
          </Stack>
        </Paper>
      ))}
    </Stack>
  ),
};

export const InContext: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <AnimatedIcon variant="processing" size="md" color="white" />
          <Box>
            <Typography variant="h6">Processing your request</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              This may take a few moments...
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
          color: 'white',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <AnimatedIcon variant="success" size="md" color="white" />
          <Box>
            <Typography variant="h6">Success!</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your operation completed successfully
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <AnimatedIcon variant="error" size="md" color="white" />
          <Box>
            <Typography variant="h6">Error occurred</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Something went wrong. Please try again.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h6">All Animation States</Typography>
      <Stack direction="row" spacing={3}>
        <Box textAlign="center">
          <AnimatedIcon variant="processing" size="lg" />
          <Typography variant="caption" display="block">Processing</Typography>
        </Box>
        <Box textAlign="center">
          <AnimatedIcon variant="success" size="lg" />
          <Typography variant="caption" display="block">Success</Typography>
        </Box>
        <Box textAlign="center">
          <AnimatedIcon variant="error" size="lg" />
          <Typography variant="caption" display="block">Error</Typography>
        </Box>
        <Box textAlign="center">
          <AnimatedIcon variant="loading" size="lg" />
          <Typography variant="caption" display="block">Loading</Typography>
        </Box>
        <Box textAlign="center">
          <AnimatedIcon variant="pulse" size="lg" />
          <Typography variant="caption" display="block">Pulse</Typography>
        </Box>
      </Stack>
    </Stack>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <Stack spacing={4}>
      <Typography variant="h6">Interactive Animation States</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AnimatedIcon variant="loading" size="lg" duration={1} />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Fast Loading</Typography>
            <Typography variant="body2" color="text.secondary">Duration: 1s</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AnimatedIcon variant="processing" size="lg" duration={3} />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Slow Processing</Typography>
            <Typography variant="body2" color="text.secondary">Duration: 3s</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AnimatedIcon variant="pulse" size="lg" duration={0.8} />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Quick Pulse</Typography>
            <Typography variant="body2" color="text.secondary">Duration: 0.8s</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AnimatedIcon variant="success" size="lg" />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Success Bounce</Typography>
            <Typography variant="body2" color="text.secondary">One-time animation</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Responsive Design</Typography>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>Mobile (Small)</Typography>
          <Paper sx={{ p: 2, maxWidth: 320, mx: 'auto' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <AnimatedIcon variant="loading" size="sm" />
              <Typography variant="body2">Loading...</Typography>
            </Stack>
          </Paper>
        </Box>
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>Tablet (Medium)</Typography>
          <Paper sx={{ p: 3, maxWidth: 768, mx: 'auto' }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <AnimatedIcon variant="processing" size="md" />
              <Box>
                <Typography variant="h6">Processing Request</Typography>
                <Typography variant="body2" color="text.secondary">Please wait...</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>Desktop (Large)</Typography>
          <Paper sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Stack direction="row" spacing={4} alignItems="center">
              <AnimatedIcon variant="success" size="lg" />
              <Box>
                <Typography variant="h4">Operation Complete</Typography>
                <Typography variant="body1" color="text.secondary">
                  Your request has been processed successfully.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Stack>
  ),
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1200px', height: '800px' },
        },
      },
      defaultViewport: 'desktop',
    },
  },
};