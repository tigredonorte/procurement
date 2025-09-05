import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Paper, Box } from '@mui/material';
import React from 'react';

import { Blockquote } from './Blockquote';

const meta = {
  title: 'Typography/Blockquote',
  component: Blockquote,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A stylish blockquote component for highlighting quotes, testimonials, and important excerpts with various decorative styles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'bordered', 'background', 'modern', 'minimal'],
      description: 'Visual style variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'info', 'warning', 'success', 'neutral'],
      description: 'Accent color',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Quote size',
    },
    cite: {
      control: 'text',
      description: 'Citation/author name',
    },
    source: {
      control: 'text',
      description: 'Source of the quote',
    },
    icon: {
      control: 'boolean',
      description: 'Show quote icon',
    },
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'The only way to do great work is to love what you do.',
    cite: 'Steve Jobs',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={3}>
      <Blockquote variant="default" cite="Author Name">
        Default blockquote style with clean, classic appearance.
      </Blockquote>
      
      <Blockquote variant="bordered" cite="Author Name">
        Bordered blockquote with a prominent left border accent.
      </Blockquote>
      
      <Blockquote variant="background" cite="Author Name">
        Background blockquote with subtle background color.
      </Blockquote>
      
      <Blockquote variant="modern" cite="Author Name">
        Modern blockquote with contemporary styling and effects.
      </Blockquote>
      
      <Blockquote variant="minimal" cite="Author Name">
        Minimal blockquote with understated elegance.
      </Blockquote>
    </Stack>
  ),
};

export const ColorVariations: Story = {
  render: () => (
    <Stack spacing={3}>
      <Blockquote color="primary" variant="bordered" cite="Primary Quote">
        Innovation distinguishes between a leader and a follower.
      </Blockquote>
      
      <Blockquote color="secondary" variant="bordered" cite="Secondary Quote">
        Design is not just what it looks like. Design is how it works.
      </Blockquote>
      
      <Blockquote color="info" variant="bordered" cite="Info Quote">
        The best time to plant a tree was 20 years ago. The second best time is now.
      </Blockquote>
      
      <Blockquote color="warning" variant="bordered" cite="Warning Quote">
        A ship in harbor is safe, but that is not what ships are built for.
      </Blockquote>
      
      <Blockquote color="success" variant="bordered" cite="Success Quote">
        Success is not final, failure is not fatal: it is the courage to continue that counts.
      </Blockquote>
    </Stack>
  ),
};

export const SizeVariations: Story = {
  render: () => (
    <Stack spacing={3}>
      <Blockquote size="small" cite="Small Quote">
        Small blockquote for subtle emphasis.
      </Blockquote>
      
      <Blockquote size="medium" cite="Medium Quote">
        Medium blockquote for standard content.
      </Blockquote>
      
      <Blockquote size="large" cite="Large Quote">
        Large blockquote for maximum impact.
      </Blockquote>
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Stack spacing={3}>
      <Blockquote icon cite="With Icon">
        Blockquotes with decorative quote icons add visual interest and clearly indicate quoted content.
      </Blockquote>
      
      <Blockquote icon variant="modern" color="primary" cite="Modern Icon">
        The modern variant with icon creates a sophisticated look perfect for testimonials.
      </Blockquote>
      
      <Blockquote icon variant="background" color="secondary" size="large" cite="Large Icon">
        Large quotes with icons make powerful statements.
      </Blockquote>
    </Stack>
  ),
};

export const Testimonials: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Blockquote 
          variant="modern" 
          color="primary"
          icon
          cite="Sarah Johnson"
          source="CEO, TechCorp"
        >
          This product has completely transformed our workflow. The intuitive design and powerful features have increased our productivity by 200%.
        </Blockquote>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Blockquote 
          variant="background" 
          color="success"
          icon
          cite="Michael Chen"
          source="Product Manager"
        >
          Best investment we've made this year. The ROI was evident within the first month.
        </Blockquote>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Blockquote 
          variant="bordered" 
          color="info"
          cite="Emily Davis"
          source="Designer"
        >
          The attention to detail and user experience is unmatched. It's rare to find a tool that developers and designers both love.
        </Blockquote>
      </Paper>
    </Stack>
  ),
};

export const FamousQuotes: Story = {
  render: () => (
    <Stack spacing={4}>
      <Blockquote 
        variant="modern" 
        size="large"
        color="primary"
        icon
        cite="Albert Einstein"
      >
        Imagination is more important than knowledge. Knowledge is limited. Imagination embraces the entire world.
      </Blockquote>
      
      <Blockquote 
        variant="bordered" 
        color="secondary"
        cite="Maya Angelou"
      >
        I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.
      </Blockquote>
      
      <Blockquote 
        variant="minimal"
        cite="Mahatma Gandhi"
      >
        Be the change you wish to see in the world.
      </Blockquote>
      
      <Blockquote 
        variant="background"
        color="info"
        icon
        cite="Nelson Mandela"
      >
        Education is the most powerful weapon which you can use to change the world.
      </Blockquote>
    </Stack>
  ),
};

export const ArticleQuotes: Story = {
  render: () => (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Stack spacing={3}>
        <p>
          In the world of design, certain principles stand the test of time. As designers, 
          we often look to the wisdom of those who came before us.
        </p>
        
        <Blockquote 
          variant="bordered"
          color="primary"
          cite="Dieter Rams"
          source="Ten Principles of Good Design"
        >
          Good design is as little design as possible. Less, but better – because it concentrates 
          on the essential aspects, and the products are not burdened with non-essentials.
        </Blockquote>
        
        <p>
          This principle has influenced countless designers and continues to shape modern 
          minimalist design philosophy. Another influential voice in design history noted:
        </p>
        
        <Blockquote 
          variant="background"
          cite="Paul Rand"
        >
          Design is the silent ambassador of your brand.
        </Blockquote>
        
        <p>
          These timeless insights remind us that good design is not just about aesthetics, 
          but about creating meaningful connections between products and people.
        </p>
      </Stack>
    </Box>
  ),
};

export const SocialProof: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <h2>What Our Customers Say</h2>
      </Box>
      
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
        <Blockquote 
          variant="modern"
          color="primary"
          icon
          cite="Alex Thompson"
          source="★★★★★"
        >
          Exceptional service and outstanding results. Highly recommended!
        </Blockquote>
        
        <Blockquote 
          variant="modern"
          color="primary"
          icon
          cite="Lisa Wong"
          source="★★★★★"
        >
          The team went above and beyond our expectations. Truly professional.
        </Blockquote>
        
        <Blockquote 
          variant="modern"
          color="primary"
          icon
          cite="Robert Martinez"
          source="★★★★★"
        >
          Best decision we made for our business. The results speak for themselves.
        </Blockquote>
        
        <Blockquote 
          variant="modern"
          color="primary"
          icon
          cite="Jennifer Kim"
          source="★★★★★"
        >
          Innovative solutions and excellent support. A game-changer for our team.
        </Blockquote>
      </Box>
    </Stack>
  ),
};

export const PullQuotes: Story = {
  render: () => (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua.
      </p>
      
      <Blockquote 
        variant="minimal"
        size="large"
        sx={{ my: 4, textAlign: 'center' }}
      >
        "This is a pull quote that highlights a key point from the article"
      </Blockquote>
      
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
      </p>
      
      <Blockquote 
        variant="bordered"
        color="secondary"
        sx={{ float: 'right', width: '40%', ml: 3, my: 2 }}
      >
        A floating pull quote that wraps with the text
      </Blockquote>
      
      <p>
        In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim 
        id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </Box>
  ),
};