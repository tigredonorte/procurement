import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import React, { useState } from 'react';

import { Resizable } from './Resizable';

const meta: Meta<typeof Resizable> = {
  title: 'Layout/Resizable',
  component: Resizable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A resizable container component that allows users to adjust dimensions by dragging handles. Supports horizontal, vertical, and both-direction resizing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'both'],
    },
    width: {
      control: { type: 'number' },
    },
    height: {
      control: { type: 'number' },
    },
    minWidth: {
      control: { type: 'number' },
    },
    maxWidth: {
      control: { type: 'number' },
    },
    minHeight: {
      control: { type: 'number' },
    },
    maxHeight: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ContentBox = () => (
  <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Typography variant="h6" gutterBottom>Resizable Content</Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
      Drag the handles to resize this container. The content will adapt to the new dimensions.
    </Typography>
    <Box sx={{ flex: 1, bgcolor: 'grey.100', borderRadius: 1, p: 1 }}>
      <Typography variant="caption">Content Area</Typography>
    </Box>
  </Box>
);

export const Default: Story = {
  args: {
    width: 300,
    height: 200,
    children: <ContentBox />,
  },
};

export const HorizontalOnly: Story = {
  args: {
    variant: 'horizontal',
    width: 250,
    height: 150,
    children: (
      <Box sx={{ p: 2, bgcolor: 'primary.50', height: '100%' }}>
        <Typography variant="body1">Horizontal Resize Only</Typography>
        <Typography variant="caption" color="text.secondary">
          Drag the right edge to resize width
        </Typography>
      </Box>
    ),
  },
};

export const VerticalOnly: Story = {
  args: {
    variant: 'vertical',
    width: 300,
    height: 120,
    children: (
      <Box sx={{ p: 2, bgcolor: 'secondary.50', height: '100%' }}>
        <Typography variant="body1">Vertical Resize Only</Typography>
        <Typography variant="caption" color="text.secondary">
          Drag the bottom edge to resize height
        </Typography>
      </Box>
    ),
  },
};

export const BothDirections: Story = {
  args: {
    variant: 'both',
    width: 280,
    height: 180,
    children: (
      <Box sx={{ p: 2, bgcolor: 'info.50', height: '100%' }}>
        <Typography variant="body1">Both Directions</Typography>
        <Typography variant="caption" color="text.secondary">
          Drag edges or corner to resize
        </Typography>
      </Box>
    ),
  },
};

export const WithConstraints: Story = {
  args: {
    variant: 'both',
    width: 200,
    height: 150,
    minWidth: 150,
    maxWidth: 400,
    minHeight: 100,
    maxHeight: 300,
    children: (
      <Box sx={{ p: 2, bgcolor: 'warning.50', height: '100%' }}>
        <Typography variant="body2" gutterBottom>Constrained Resizing</Typography>
        <Typography variant="caption">
          Min: 150x100<br/>
          Max: 400x300
        </Typography>
      </Box>
    ),
  },
};

export const WithCallback: Story = {
  render: () => {
    const [dimensions, setDimensions] = useState({ width: 250, height: 150 });
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
          <Typography variant="body2">
            Current size: {dimensions.width}px × {dimensions.height}px
          </Typography>
        </Box>
        
        <Resizable
          variant="both"
          width={250}
          height={150}
          onResize={(width, height) => setDimensions({ width, height })}
        >
          <Box sx={{ p: 2, bgcolor: 'success.50', height: '100%' }}>
            <Typography variant="body1">Resize Tracking</Typography>
            <Typography variant="caption">Size updates in real-time</Typography>
          </Box>
        </Resizable>
      </Box>
    );
  },
};

export const DisabledState: Story = {
  args: {
    variant: 'both',
    width: 250,
    height: 150,
    disabled: true,
    children: (
      <Box sx={{ p: 2, bgcolor: 'grey.200', height: '100%' }}>
        <Typography variant="body1" color="text.disabled">Disabled Resizing</Typography>
        <Typography variant="caption" color="text.disabled">
          Resizing is disabled for this container
        </Typography>
      </Box>
    ),
  },
};

export const SidePanel: Story = {
  render: () => (
    <Box sx={{ display: 'flex', height: 400, border: 1, borderColor: 'divider' }}>
      <Resizable variant="horizontal" width={200} minWidth={150} maxWidth={350}>
        <Box sx={{ bgcolor: 'primary.50', height: '100%', p: 2 }}>
          <Typography variant="h6" gutterBottom>Sidebar</Typography>
          <List dense>
            <ListItem><ListItemText primary="Item 1" /></ListItem>
            <ListItem><ListItemText primary="Item 2" /></ListItem>
            <ListItem><ListItemText primary="Item 3" /></ListItem>
          </List>
        </Box>
      </Resizable>
      
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>Main Content</Typography>
        <Typography variant="body1" color="text.secondary">
          The sidebar on the left is resizable. Drag its right edge to adjust the width.
        </Typography>
      </Box>
    </Box>
  ),
};

export const TextEditor: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 500, border: 1, borderColor: 'divider' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Typography variant="h6">Code Editor</Typography>
      </Box>
      
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, p: 2, bgcolor: 'grey.900', color: 'common.white' }}>
          <Typography variant="body2" fontFamily="monospace">
            // Main editor content<br/>
            function example() {"{"}<br/>
            {"  "}return "Hello World";<br/>
            {"}"}
          </Typography>
        </Box>
        
        <Resizable variant="vertical" width={300} height={200} minHeight={100}>
          <Box sx={{ bgcolor: 'grey.100', height: '100%', p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Console Output</Typography>
            <Typography variant="body2" fontFamily="monospace" color="success.main">
              &gt; Hello World
            </Typography>
          </Box>
        </Resizable>
      </Box>
    </Box>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 2, bgcolor: 'grey.50' }}>
      <Resizable variant="both" width={250} height={150}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6">Widget 1</Typography>
          <Typography variant="caption">Resizable widget</Typography>
        </Paper>
      </Resizable>
      
      <Resizable variant="both" width={250} height={150}>
        <Paper sx={{ p: 2, height: '100%', bgcolor: 'primary.50' }}>
          <Typography variant="h6">Widget 2</Typography>
          <Typography variant="caption">Another resizable widget</Typography>
        </Paper>
      </Resizable>
      
      <Resizable variant="both" width={250} height={150}>
        <Paper sx={{ p: 2, height: '100%', bgcolor: 'secondary.50' }}>
          <Typography variant="h6">Widget 3</Typography>
          <Typography variant="caption">Dashboard component</Typography>
        </Paper>
      </Resizable>
      
      <Resizable variant="both" width={250} height={150}>
        <Paper sx={{ p: 2, height: '100%', bgcolor: 'info.50' }}>
          <Typography variant="h6">Widget 4</Typography>
          <Typography variant="caption">Flexible layout</Typography>
        </Paper>
      </Resizable>
    </Box>
  ),
};