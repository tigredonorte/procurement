import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Paper, Box, Divider } from '@mui/material';
import React from 'react';

import { Heading } from './Heading';

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A heading component with multiple levels, styles, and decorative options for creating clear visual hierarchy.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
      description: 'Heading level (h1-h6)',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'display', 'gradient', 'outlined'],
      description: 'Visual style variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'textPrimary', 'textSecondary', 'inherit'],
      description: 'Heading color',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Text alignment',
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'regular', 'medium', 'semibold', 'bold', 'black'],
      description: 'Font weight',
    },
    transform: {
      control: { type: 'select' },
      options: ['none', 'uppercase', 'lowercase', 'capitalize'],
      description: 'Text transformation',
    },
    decorated: {
      control: 'boolean',
      description: 'Add decorative elements',
    },
    underlined: {
      control: 'boolean',
      description: 'Add underline decoration',
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Heading',
    level: 1,
  },
};

export const HeadingLevels: Story = {
  render: () => (
    <Stack spacing={2}>
      <Heading level={1}>Heading Level 1 - Page Title</Heading>
      <Heading level={2}>Heading Level 2 - Section Title</Heading>
      <Heading level={3}>Heading Level 3 - Subsection</Heading>
      <Heading level={4}>Heading Level 4 - Sub-subsection</Heading>
      <Heading level={5}>Heading Level 5 - Minor Heading</Heading>
      <Heading level={6}>Heading Level 6 - Smallest Heading</Heading>
    </Stack>
  ),
};

export const DisplayVariants: Story = {
  render: () => (
    <Stack spacing={3}>
      <Heading level={1} variant="default">
        Default Heading Style
      </Heading>
      <Heading level={1} variant="display">
        Display Heading Style
      </Heading>
      <Heading level={1} variant="gradient">
        Gradient Heading Style
      </Heading>
      <Heading level={1} variant="outlined">
        Outlined Heading Style
      </Heading>
    </Stack>
  ),
};

export const ColoredHeadings: Story = {
  render: () => (
    <Stack spacing={2}>
      <Heading level={2} color="primary">Primary Color Heading</Heading>
      <Heading level={2} color="secondary">Secondary Color Heading</Heading>
      <Heading level={2} color="textPrimary">Text Primary Color</Heading>
      <Heading level={2} color="textSecondary">Text Secondary Color</Heading>
      <Box sx={{ bgcolor: 'primary.main', p: 2 }}>
        <Heading level={2} color="inherit" sx={{ color: 'white' }}>
          Inherited Color Heading
        </Heading>
      </Box>
    </Stack>
  ),
};

export const DecoratedHeadings: Story = {
  render: () => (
    <Stack spacing={4}>
      <Heading level={2} decorated>
        Heading with Decorative Elements
      </Heading>
      
      <Heading level={2} underlined>
        Underlined Heading
      </Heading>
      
      <Heading level={2} decorated underlined color="primary">
        Decorated and Underlined
      </Heading>
      
      <Heading level={1} variant="gradient" decorated>
        Gradient with Decoration
      </Heading>
    </Stack>
  ),
};

export const AlignmentOptions: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Heading level={3} align="left">
          Left Aligned Heading
        </Heading>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Heading level={3} align="center">
          Center Aligned Heading
        </Heading>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Heading level={3} align="right">
          Right Aligned Heading
        </Heading>
      </Paper>
    </Stack>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <Stack spacing={2}>
      <Heading level={3} weight="light">Light Weight Heading</Heading>
      <Heading level={3} weight="regular">Regular Weight Heading</Heading>
      <Heading level={3} weight="medium">Medium Weight Heading</Heading>
      <Heading level={3} weight="semibold">Semibold Weight Heading</Heading>
      <Heading level={3} weight="bold">Bold Weight Heading</Heading>
      <Heading level={3} weight="black">Black Weight Heading</Heading>
    </Stack>
  ),
};

export const PageHierarchy: Story = {
  render: () => (
    <Stack spacing={3}>
      <Heading level={1} variant="display" decorated>
        Main Page Title
      </Heading>
      
      <Divider />
      
      <Heading level={2} color="primary">
        Section 1: Introduction
      </Heading>
      <Box sx={{ pl: 2 }}>
        <Heading level={3}>1.1 Overview</Heading>
        <Box sx={{ pl: 2 }}>
          <Heading level={4} color="textSecondary">
            1.1.1 Background
          </Heading>
          <Heading level={4} color="textSecondary">
            1.1.2 Objectives
          </Heading>
        </Box>
        <Heading level={3}>1.2 Scope</Heading>
      </Box>
      
      <Heading level={2} color="primary">
        Section 2: Implementation
      </Heading>
      <Box sx={{ pl: 2 }}>
        <Heading level={3}>2.1 Technical Details</Heading>
        <Heading level={3}>2.2 Timeline</Heading>
      </Box>
    </Stack>
  ),
};

export const MarketingHeaders: Story = {
  render: () => (
    <Stack spacing={4} alignItems="center">
      <Heading 
        level={1} 
        variant="gradient"
        align="center"
        weight="bold"
        sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
      >
        Welcome to the Future
      </Heading>
      
      <Heading 
        level={2} 
        align="center"
        color="textSecondary"
        weight="light"
      >
        Innovate • Create • Transform
      </Heading>
      
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600 }}>
        <Heading level={3} variant="display" decorated>
          🚀 Launch Your Ideas
        </Heading>
        <Heading level={4} color="textSecondary" weight="regular">
          Start building amazing products today
        </Heading>
      </Paper>
    </Stack>
  ),
};

export const BlogPostHeader: Story = {
  render: () => (
    <Stack spacing={2}>
      <Heading level={6} color="primary" transform="uppercase">
        Technology
      </Heading>
      <Heading level={1} weight="bold">
        The Rise of Artificial Intelligence in Modern Web Development
      </Heading>
      <Heading level={4} color="textSecondary" weight="regular">
        How AI is transforming the way we build and deploy applications
      </Heading>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Heading level={6} color="textSecondary">By Jane Doe</Heading>
        <Heading level={6} color="textSecondary">•</Heading>
        <Heading level={6} color="textSecondary">5 min read</Heading>
      </Box>
    </Stack>
  ),
};

export const ResponsiveHeadings: Story = {
  render: () => (
    <Stack spacing={3}>
      <Heading
        level={1}
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
        }}
      >
        Responsive Heading Size
      </Heading>
      
      <Heading
        level={2}
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
      >
        Desktop Only Heading
      </Heading>
      
      <Heading
        level={2}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        Mobile Only Heading
      </Heading>
      
      <Heading
        level={3}
        sx={{
          textAlign: { xs: 'center', md: 'left' },
          color: { xs: 'primary.main', md: 'text.primary' },
        }}
      >
        Adaptive Alignment and Color
      </Heading>
    </Stack>
  ),
};