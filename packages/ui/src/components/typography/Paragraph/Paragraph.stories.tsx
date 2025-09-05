import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Paper, Box } from '@mui/material';
import React from 'react';

import { Paragraph } from './Paragraph';
import { Heading } from '../Heading';

const meta = {
  title: 'Typography/Paragraph',
  component: Paragraph,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A paragraph component optimized for readability with features like first-letter styling, drop caps, and proper spacing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'lead', 'small', 'quote'],
      description: 'Paragraph style variant',
    },
    indent: {
      control: 'boolean',
      description: 'Indent first line',
    },
    dropCap: {
      control: 'boolean',
      description: 'Large decorative first letter',
    },
    columns: {
      control: { type: 'number', min: 1, max: 4 },
      description: 'Number of text columns',
    },
    spacing: {
      control: { type: 'select' },
      options: ['tight', 'normal', 'relaxed', 'loose'],
      description: 'Line spacing',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
  },
} satisfies Meta<typeof Paragraph>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

export const Default: Story = {
  args: {
    children: sampleText,
  },
};

export const Variants: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Heading level={4}>Default Paragraph</Heading>
        <Paragraph variant="default">
          {sampleText}
        </Paragraph>
      </Box>
      
      <Box>
        <Heading level={4}>Lead Paragraph</Heading>
        <Paragraph variant="lead">
          {sampleText}
        </Paragraph>
      </Box>
      
      <Box>
        <Heading level={4}>Small Paragraph</Heading>
        <Paragraph variant="small">
          {sampleText}
        </Paragraph>
      </Box>
      
      <Box>
        <Heading level={4}>Quote Paragraph</Heading>
        <Paragraph variant="quote">
          {sampleText}
        </Paragraph>
      </Box>
    </Stack>
  ),
};

export const WithDropCap: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Paragraph dropCap>
          Once upon a time, in a land far, far away, there lived a wise old developer who knew all the secrets of creating beautiful user interfaces. This developer spent years perfecting the art of typography, understanding that good design is not just about making things look pretty, but about creating experiences that delight and inform users. The journey was long and filled with challenges, but the rewards were worth every moment of struggle.
        </Paragraph>
      </Paper>
      
      <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Paragraph dropCap>
          Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, and adjusting the space between pairs of letters.
        </Paragraph>
      </Paper>
    </Stack>
  ),
};

export const Indentation: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Heading level={4}>With Indentation</Heading>
        <Paragraph indent>
          {longText}
        </Paragraph>
      </Box>
      
      <Box>
        <Heading level={4}>Without Indentation</Heading>
        <Paragraph>
          {longText}
        </Paragraph>
      </Box>
    </Stack>
  ),
};

export const MultiColumn: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Heading level={4}>Two Columns</Heading>
        <Paragraph columns={2}>
          {longText}
        </Paragraph>
      </Box>
      
      <Box>
        <Heading level={4}>Three Columns</Heading>
        <Paragraph columns={3} variant="small">
          {longText}
        </Paragraph>
      </Box>
    </Stack>
  ),
};

export const LineSpacing: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper sx={{ p: 2 }}>
        <Heading level={5}>Tight Spacing</Heading>
        <Paragraph spacing="tight">
          {sampleText}
        </Paragraph>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Heading level={5}>Normal Spacing</Heading>
        <Paragraph spacing="normal">
          {sampleText}
        </Paragraph>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Heading level={5}>Relaxed Spacing</Heading>
        <Paragraph spacing="relaxed">
          {sampleText}
        </Paragraph>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Heading level={5}>Loose Spacing</Heading>
        <Paragraph spacing="loose">
          {sampleText}
        </Paragraph>
      </Paper>
    </Stack>
  ),
};

export const ArticleLayout: Story = {
  render: () => (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Heading level={1} decorated>
        The Art of Typography in Web Design
      </Heading>
      
      <Paragraph variant="lead" spacing="relaxed">
        Typography is more than just choosing beautiful fonts. It's about creating a reading experience that guides users through content effortlessly.
      </Paragraph>
      
      <Heading level={2}>Introduction</Heading>
      
      <Paragraph dropCap indent>
        Good typography is invisible. When done well, readers don't notice the typeface, spacing, or layout – they simply enjoy reading the content. This invisible art requires careful attention to detail and a deep understanding of how people read and process information.
      </Paragraph>
      
      <Paragraph indent>
        In the digital age, typography has evolved beyond traditional print constraints. Web designers now have access to thousands of fonts, variable spacing options, and responsive design techniques that adapt to different screen sizes and reading contexts.
      </Paragraph>
      
      <Heading level={3}>Key Principles</Heading>
      
      <Paragraph>
        There are several fundamental principles that guide good typographic design:
      </Paragraph>
      
      <Paragraph variant="small" indent>
        • Hierarchy: Creating clear visual distinctions between different levels of content
      </Paragraph>
      <Paragraph variant="small" indent>
        • Readability: Ensuring text is easy to read and understand
      </Paragraph>
      <Paragraph variant="small" indent>
        • Consistency: Maintaining uniform styles throughout the design
      </Paragraph>
      <Paragraph variant="small" indent>
        • White space: Using empty space to improve comprehension and visual appeal
      </Paragraph>
      
      <Heading level={3}>Conclusion</Heading>
      
      <Paragraph>
        Mastering typography is a journey, not a destination. As design trends evolve and new technologies emerge, the fundamental goal remains the same: to communicate ideas clearly and beautifully.
      </Paragraph>
    </Paper>
  ),
};

export const BlogPost: Story = {
  render: () => (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Paragraph variant="lead">
        In today's fast-paced digital world, the importance of good typography cannot be overstated. It's the foundation of effective communication in web design.
      </Paragraph>
      
      <Paragraph>
        When users visit a website, they're looking for information. The way that information is presented can make the difference between a positive experience and a frustrating one. Typography plays a crucial role in this presentation.
      </Paragraph>
      
      <Paragraph>
        Consider the last time you struggled to read something online. Perhaps the text was too small, the lines too long, or the contrast too low. These seemingly minor issues can significantly impact user experience and engagement.
      </Paragraph>
      
      <Paragraph variant="quote">
        "Typography is the craft of endowing human language with a durable visual form." — Robert Bringhurst
      </Paragraph>
      
      <Paragraph>
        This quote perfectly encapsulates the essence of typography. It's not just about making text visible; it's about giving it a form that enhances its meaning and makes it memorable.
      </Paragraph>
    </Box>
  ),
};

export const ResponsiveParagraphs: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paragraph
        sx={{
          fontSize: { xs: '14px', sm: '16px', md: '18px' },
          lineHeight: { xs: 1.5, md: 1.7 },
        }}
      >
        This paragraph adjusts its font size and line height based on screen size for optimal readability across devices.
      </Paragraph>
      
      <Paragraph
        columns={1}
        sx={{
          columnCount: { xs: 1, md: 2, lg: 3 },
        }}
      >
        {longText}
      </Paragraph>
    </Stack>
  ),
};