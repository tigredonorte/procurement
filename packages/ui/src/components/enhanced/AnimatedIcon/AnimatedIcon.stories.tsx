import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Stack, Typography, Grid } from '@mui/material';

import { AnimatedIcon } from './AnimatedIcon';

const meta = {
  title: 'Enhanced/AnimatedIcon',
  component: AnimatedIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['processing', 'success', 'error', 'loading', 'pulse'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'color',
    },
    duration: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.5 },
    },
  },
} satisfies Meta<typeof AnimatedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'loading',
    size: 'md',
    duration: 2,
  },
};

export const Processing: Story = {
  args: {
    variant: 'processing',
    size: 'lg',
    duration: 2,
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    size: 'lg',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    variant: 'loading',
    size: 'lg',
    duration: 1.5,
  },
};

export const Pulse: Story = {
  args: {
    variant: 'pulse',
    size: 'lg',
    duration: 1.5,
  },
};

export const AllVariants: Story = {
  render: () => (
    <Grid container spacing={4}>
      {(['processing', 'success', 'error', 'loading', 'pulse'] as const).map((variant) => (
        <Grid item xs={12} sm={6} md={4} key={variant}>
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
            <AnimatedIcon variant={variant} size="lg" />
            <Typography variant="h6" sx={{ mt: 2, textTransform: 'capitalize' }}>
              {variant}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {variant === 'processing' && 'Rotating gear for processing states'}
              {variant === 'success' && 'Check mark with bounce effect'}
              {variant === 'error' && 'X mark with shake animation'}
              {variant === 'loading' && 'Smooth circular loading spinner'}
              {variant === 'pulse' && 'Pulsing glow effect'}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  ),
};

export const AllSizes: Story = {
  render: () => (
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
              {(['processing', 'success', 'error', 'loading', 'pulse'] as const).map((variant) => (
                <AnimatedIcon key={variant} variant={variant} size={size} />
              ))}
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <AnimatedIcon variant="loading" size="lg" color="#FF6B6B" />
          <AnimatedIcon variant="processing" size="lg" color="#4ECDC4" />
          <AnimatedIcon variant="pulse" size="lg" color="#95E1D3" />
          <AnimatedIcon variant="success" size="lg" color="#FFA502" />
          <AnimatedIcon variant="error" size="lg" color="#786FA6" />
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