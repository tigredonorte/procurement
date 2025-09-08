import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';

import { ScrollArea } from './ScrollArea';

const meta: Meta<typeof ScrollArea> = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A custom scrollable area component with styled scrollbars and smooth scrolling behavior.',
      },
    },
  },
  tags: ['autodocs', 'component:ScrollArea'],
  argTypes: {
    width: {
      control: 'text',
      description: 'Width of the scroll area container',
    },
    height: {
      control: 'text',
      description: 'Height of the scroll area container',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height before scrolling is enabled',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Scroll orientation',
    },
    scrollbarSize: {
      control: 'select',
      options: ['thin', 'medium', 'thick'],
      description: 'Size of the scrollbar',
    },
    autoHide: {
      control: 'boolean',
      description: 'Whether scrollbars auto-hide when not in use',
    },
    smoothScroll: {
      control: 'boolean',
      description: 'Enable smooth scrolling behavior',
    },
    variant: {
      control: 'select',
      options: ['default', 'overlay', 'glass'],
      description: 'Visual variant of the scroll area',
    },
    scrollToTopButton: {
      control: 'boolean',
      description: 'Show scroll-to-top button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable scrolling',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to generate scrollable content
const ScrollableContent = ({ lines = 30 }: { lines?: number }) => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: lines }, (_, i) => (
      <Typography key={i} paragraph>
        Line {i + 1}: This is a sample text line to demonstrate scrolling functionality. Lorem ipsum
        dolor sit amet, consectetur adipiscing elit.
      </Typography>
    ))}
  </Box>
);

// Helper component for list content
const ListContent = ({ items = 50 }: { items?: number }) => (
  <List>
    {Array.from({ length: items }, (_, i) => (
      <ListItem key={i} divider>
        <ListItemText primary={`Item ${i + 1}`} secondary={`Description for item ${i + 1}`} />
      </ListItem>
    ))}
  </List>
);

export const Default: Story = {
  args: {
    width: 400,
    height: 300,
    children: <ScrollableContent />,
  },
};

export const VerticalScroll: Story = {
  args: {
    width: 400,
    height: 300,
    orientation: 'vertical',
    children: <ScrollableContent lines={50} />,
  },
};

export const HorizontalScroll: Story = {
  args: {
    width: 400,
    height: 200,
    orientation: 'horizontal',
    children: (
      <Box sx={{ display: 'flex', gap: 2, p: 2, width: 'max-content' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <Paper key={i} sx={{ p: 2, minWidth: 150 }}>
            <Typography>Card {i + 1}</Typography>
          </Paper>
        ))}
      </Box>
    ),
  },
};

export const BothDirections: Story = {
  args: {
    width: 400,
    height: 300,
    orientation: 'both',
    children: (
      <Box sx={{ width: 800, p: 2 }}>
        <ScrollableContent lines={50} />
      </Box>
    ),
  },
};

export const ThinScrollbar: Story = {
  args: {
    width: 400,
    height: 300,
    scrollbarSize: 'thin',
    children: <ScrollableContent />,
  },
};

export const ThickScrollbar: Story = {
  args: {
    width: 400,
    height: 300,
    scrollbarSize: 'thick',
    children: <ScrollableContent />,
  },
};

export const AutoHideDisabled: Story = {
  args: {
    width: 400,
    height: 300,
    autoHide: false,
    alwaysShowScrollbar: true,
    children: <ScrollableContent />,
  },
};

export const SmoothScrollDisabled: Story = {
  args: {
    width: 400,
    height: 300,
    smoothScroll: false,
    children: <ScrollableContent />,
  },
};

export const OverlayVariant: Story = {
  args: {
    width: 400,
    height: 300,
    variant: 'overlay',
    children: <ScrollableContent />,
  },
};

export const GlassVariant: Story = {
  args: {
    width: 400,
    height: 300,
    variant: 'glass',
    children: <ScrollableContent />,
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 4,
          borderRadius: 2,
        }}
      >
        <Story />
      </Box>
    ),
  ],
};

export const WithScrollToTop: Story = {
  args: {
    width: 400,
    height: 300,
    scrollToTopButton: true,
    scrollToTopThreshold: 50,
    children: <ScrollableContent lines={100} />,
  },
};

export const CustomColors: Story = {
  args: {
    width: 400,
    height: 300,
    scrollbarColor: '#ff6b6b',
    scrollbarTrackColor: '#ffe0e0',
    children: <ScrollableContent />,
  },
};

export const WithPadding: Story = {
  args: {
    width: 400,
    height: 300,
    contentPadding: 3,
    children: <ScrollableContent />,
  },
};

export const MaxHeightExample: Story = {
  args: {
    width: 400,
    maxHeight: 300,
    children: <ScrollableContent lines={5} />,
  },
};

export const DisabledState: Story = {
  args: {
    width: 400,
    height: 300,
    disabled: true,
    children: <ScrollableContent />,
  },
};

export const LoadingState: Story = {
  args: {
    width: 400,
    height: 300,
    loading: true,
    children: <ScrollableContent />,
  },
};

export const EmptyState: Story = {
  args: {
    width: 400,
    height: 300,
    emptyContent: (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No content available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          There is no data to display
        </Typography>
      </Box>
    ),
  },
};

export const WithListContent: Story = {
  args: {
    width: 400,
    height: 400,
    scrollToTopButton: true,
    children: <ListContent />,
  },
};

export const ResponsiveWidth: Story = {
  args: {
    width: '100%',
    maxWidth: 600,
    height: 300,
    children: <ScrollableContent />,
  },
};

export const NestedScrollAreas: Story = {
  args: {
    width: 600,
    height: 400,
    children: (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Parent Scroll Area
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Paper sx={{ flex: 1 }}>
            <ScrollArea height={200} variant="overlay">
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Nested Area 1
                </Typography>
                <ScrollableContent lines={20} />
              </Box>
            </ScrollArea>
          </Paper>
          <Paper sx={{ flex: 1 }}>
            <ScrollArea height={200} variant="overlay">
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Nested Area 2
                </Typography>
                <ScrollableContent lines={20} />
              </Box>
            </ScrollArea>
          </Paper>
        </Box>
        <Box sx={{ mt: 2 }}>
          <ScrollableContent lines={10} />
        </Box>
      </Box>
    ),
  },
};

export const WithChips: Story = {
  args: {
    width: 400,
    height: 100,
    orientation: 'horizontal',
    scrollbarSize: 'thin',
    children: (
      <Box sx={{ display: 'flex', gap: 1, p: 2, width: 'max-content' }}>
        {Array.from({ length: 30 }, (_, i) => (
          <Chip key={i} label={`Tag ${i + 1}`} color="primary" variant="outlined" />
        ))}
      </Box>
    ),
  },
};
