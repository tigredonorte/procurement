import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper } from '@mui/material';

import { Spacer } from './Spacer';

const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible spacing component for creating consistent gaps between elements. Supports fixed sizes from xs to xl and custom dimensions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Predefined spacing size',
    },
    direction: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'both'],
      description: 'Direction of spacing',
    },
    flex: {
      control: { type: 'boolean' },
      description: 'Whether the spacer should flex to fill available space',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DemoBox = ({ children }: { children: React.ReactNode }) => (
  <Paper sx={{ p: 2, bgcolor: 'primary.100', textAlign: 'center' }}>
    <Typography variant="body2">{children}</Typography>
  </Paper>
);

export const Default: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <DemoBox>Element 1</DemoBox>
      <Spacer />
      <DemoBox>Element 2</DemoBox>
    </Box>
  ),
};

export const SizeVariations: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Spacer Sizes</Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DemoBox>XS</DemoBox>
        <Spacer size="xs" />
        <DemoBox>Extra Small</DemoBox>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DemoBox>SM</DemoBox>
        <Spacer size="sm" />
        <DemoBox>Small</DemoBox>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DemoBox>MD</DemoBox>
        <Spacer size="md" />
        <DemoBox>Medium (Default)</DemoBox>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DemoBox>LG</DemoBox>
        <Spacer size="lg" />
        <DemoBox>Large</DemoBox>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DemoBox>XL</DemoBox>
        <Spacer size="xl" />
        <DemoBox>Extra Large</DemoBox>
      </Box>
    </Box>
  ),
};

export const DirectionalSpacing: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" gutterBottom>Horizontal Spacing</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', p: 2 }}>
          <DemoBox>Left</DemoBox>
          <Spacer size="lg" direction="horizontal" />
          <DemoBox>Right</DemoBox>
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Vertical Spacing</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'grey.100', p: 2 }}>
          <DemoBox>Top</DemoBox>
          <Spacer size="lg" direction="vertical" />
          <DemoBox>Bottom</DemoBox>
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Both Directions (Default)</Typography>
        <Box sx={{ display: 'inline-block', bgcolor: 'grey.100', p: 2 }}>
          <DemoBox>Element</DemoBox>
          <Spacer size="lg" direction="both" />
          <Typography variant="caption">(Creates space in both directions)</Typography>
        </Box>
      </Box>
    </Box>
  ),
};

export const FlexibleSpacer: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom>Fixed Spacer</Typography>
        <Box sx={{ display: 'flex', bgcolor: 'grey.100', p: 2, width: 400 }}>
          <DemoBox>Start</DemoBox>
          <Spacer size="md" />
          <DemoBox>End</DemoBox>
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Flexible Spacer (fills available space)</Typography>
        <Box sx={{ display: 'flex', bgcolor: 'grey.100', p: 2, width: 400 }}>
          <DemoBox>Start</DemoBox>
          <Spacer flex />
          <DemoBox>End</DemoBox>
        </Box>
      </Box>
    </Box>
  ),
};

export const CustomDimensions: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom>Custom Width</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', p: 2 }}>
          <DemoBox>Left</DemoBox>
          <Spacer width={100} />
          <DemoBox>100px apart</DemoBox>
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Custom Height</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'grey.100', p: 2 }}>
          <DemoBox>Top</DemoBox>
          <Spacer height={50} />
          <DemoBox>50px apart</DemoBox>
        </Box>
      </Box>
    </Box>
  ),
};

export const PracticalExample: Story = {
  render: () => (
    <Paper sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h5">Form Layout</Typography>
      <Spacer size="md" />
      
      <Typography variant="body2" color="text.secondary">Name</Typography>
      <Box sx={{ border: 1, borderColor: 'grey.300', p: 1, borderRadius: 1 }}>
        <Typography variant="body1">John Doe</Typography>
      </Box>
      
      <Spacer size="sm" />
      
      <Typography variant="body2" color="text.secondary">Email</Typography>
      <Box sx={{ border: 1, borderColor: 'grey.300', p: 1, borderRadius: 1 }}>
        <Typography variant="body1">john@example.com</Typography>
      </Box>
      
      <Spacer size="lg" />
      
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ bgcolor: 'grey.300', px: 2, py: 1, borderRadius: 1 }}>
          <Typography>Cancel</Typography>
        </Box>
        <Spacer size="sm" direction="horizontal" />
        <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 2, py: 1, borderRadius: 1 }}>
          <Typography>Save</Typography>
        </Box>
      </Box>
    </Paper>
  ),
};

export const InLayoutComposition: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 600 }}>
      <Typography variant="h4">Navigation Bar</Typography>
      <Spacer size="md" />
      
      <Box sx={{ display: 'flex', width: '100%', bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 1 }}>
        <Typography variant="h6">Logo</Typography>
        <Spacer flex />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography>Home</Typography>
          <Typography>About</Typography>
          <Typography>Contact</Typography>
        </Box>
      </Box>
      
      <Spacer size="xl" />
      
      <Typography variant="body1" paragraph align="center">
        The Spacer component is essential for creating consistent spacing in layouts.
        It can be used with fixed sizes or flex to fill available space.
      </Typography>
    </Box>
  ),
};