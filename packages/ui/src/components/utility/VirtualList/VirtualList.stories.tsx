import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  Typography,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';

import { VirtualList, VirtualGrid } from './VirtualList';
import type { VirtualListItem } from './VirtualList.types';

const meta: Meta<typeof VirtualList> = {
  title: 'Utility/VirtualList',
  component: VirtualList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'High-performance virtual scrolling components for large datasets with fixed and variable height support.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VirtualList>;

// Generate sample data
const generateItems = (count: number): VirtualListItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    data: {
      name: `Item ${i + 1}`,
      description: `This is the description for item ${i + 1}`,
      avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
    },
  }));
};

const generateVariableItems = (count: number): VirtualListItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    height: 60 + Math.floor(Math.random() * 100), // Random heights between 60-160px
    data: {
      name: `Variable Item ${i + 1}`,
      description: `This item has a variable height. ${
        Math.random() > 0.5
          ? 'It contains additional content that makes it taller than other items in the list.'
          : 'Short description.'
      }`,
      avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
    },
  }));
};

export const FixedHeightList: Story = {
  render: () => {
    const items = generateItems(10000);

    return (
      <Paper sx={{ width: 400, height: 400 }}>
        <VirtualList
          items={items}
          variant="fixed"
          height={400}
          itemHeight={80}
          renderItem={({ item, style }) => (
            <Box key={item.id} style={style}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={item.data.avatar} />
                </ListItemAvatar>
                <ListItemText primary={item.data.name} secondary={item.data.description} />
              </ListItem>
            </Box>
          )}
        />
      </Paper>
    );
  },
};

export const VariableHeightList: Story = {
  render: () => {
    const items = generateVariableItems(5000);

    return (
      <Paper sx={{ width: 400, height: 400 }}>
        <VirtualList
          items={items}
          variant="variable"
          height={400}
          estimatedItemHeight={100}
          renderItem={({ item, style }) => (
            <Box key={item.id} style={style}>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemAvatar>
                  <Avatar src={item.data.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.data.name}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {item.data.description}
                    </Typography>
                  }
                />
              </ListItem>
            </Box>
          )}
        />
      </Paper>
    );
  },
};

export const GridLayout: Story = {
  render: () => {
    const items = generateItems(10000);

    return (
      <Paper sx={{ width: 600, height: 400 }}>
        <VirtualGrid
          items={items}
          height={400}
          width={600}
          columnCount={4}
          rowHeight={150}
          gap={8}
          renderItem={({ item, style }) => (
            <Box
              key={item.id}
              style={style}
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Avatar src={item.data.avatar} sx={{ width: 56, height: 56, mb: 1 }} />
              <Typography variant="body2" fontWeight="bold">
                {item.data.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Grid Item #{item.id + 1}
              </Typography>
            </Box>
          )}
        />
      </Paper>
    );
  },
};

export const LargeDataset: Story = {
  render: () => {
    const items = generateItems(100000); // 100k items

    return (
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Paper sx={{ width: 350, height: 500 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">100,000 Items</Typography>
            <Typography variant="body2" color="text.secondary">
              Fixed height virtual list
            </Typography>
          </Box>
          <VirtualList
            items={items}
            variant="fixed"
            height={450}
            itemHeight={60}
            renderItem={({ item, style }) => (
              <Box key={item.id} style={style}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>{item.id + 1}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Item ${item.id + 1}`}
                    secondary={`Performance test item #${item.id + 1}`}
                  />
                </ListItem>
              </Box>
            )}
          />
        </Paper>

        <Paper sx={{ width: 400, height: 500 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Grid View</Typography>
            <Typography variant="body2" color="text.secondary">
              25,000 items in grid layout
            </Typography>
          </Box>
          <VirtualGrid
            items={items.slice(0, 25000)}
            height={450}
            width={400}
            columnCount={3}
            rowHeight={120}
            gap={4}
            renderItem={({ item, style }) => (
              <Box
                key={item.id}
                style={style}
                sx={{
                  bgcolor: 'primary.light',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.contrastText',
                  fontWeight: 'bold',
                }}
              >
                #{item.id + 1}
              </Box>
            )}
          />
        </Paper>
      </Box>
    );
  },
};

export const CustomStyles: Story = {
  render: () => {
    const items = generateItems(1000);

    return (
      <Paper
        sx={{
          width: 500,
          height: 400,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <VirtualList
          items={items}
          variant="fixed"
          height={400}
          itemHeight={100}
          renderItem={({ item, index, style }) => (
            <Box
              key={item.id}
              style={style}
              sx={{
                px: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={item.data.avatar}
                  sx={{
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {item.data.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Glass morphism style • Item {index + 1}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        />
      </Paper>
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const emptyItems: VirtualListItem[] = [];

    return (
      <Paper sx={{ width: 400, height: 300, position: 'relative' }}>
        <VirtualList
          items={emptyItems}
          variant="fixed"
          height={300}
          itemHeight={60}
          renderItem={({ item, style }) => (
            <Box key={item.id} style={style}>
              <ListItem>
                <ListItemText primary="This should not render" />
              </ListItem>
            </Box>
          )}
        />
        {emptyItems.length === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" gutterBottom>
              No items to display
            </Typography>
            <Typography variant="body2">The virtual list is empty</Typography>
          </Box>
        )}
      </Paper>
    );
  },
};

export const LoadingState: Story = {
  render: () => {
    const loadingItems = Array.from({ length: 8 }, (_, i) => ({ id: i }));

    return (
      <Paper sx={{ width: 400, height: 300 }}>
        <VirtualList
          items={loadingItems}
          variant="fixed"
          height={300}
          itemHeight={60}
          renderItem={({ style }) => (
            <Box style={style} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'grey.200',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        opacity: 1,
                      },
                      '50%': {
                        opacity: 0.5,
                      },
                    },
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      height: 16,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      width: '70%',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  />
                  <Box
                    sx={{
                      height: 12,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      width: '50%',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        />
      </Paper>
    );
  },
};

export const HoverState: Story = {
  render: () => {
    const items = generateItems(100);

    return (
      <Paper sx={{ width: 400, height: 300 }}>
        <VirtualList
          items={items}
          variant="fixed"
          height={300}
          itemHeight={70}
          renderItem={({ item, style }) => (
            <Box key={item.id} style={style}>
              <ListItem
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar src={item.data.avatar} />
                </ListItemAvatar>
                <ListItemText primary={item.data.name} secondary="Hover to see effect" />
              </ListItem>
            </Box>
          )}
        />
      </Paper>
    );
  },
};

export const DisabledState: Story = {
  render: () => {
    const items = generateItems(50);

    return (
      <Paper sx={{ width: 400, height: 300, position: 'relative' }}>
        <VirtualList
          items={items}
          variant="fixed"
          height={300}
          itemHeight={60}
          renderItem={({ item, style }) => (
            <Box key={item.id} style={style}>
              <ListItem
                disabled
                sx={{
                  opacity: 0.6,
                  cursor: 'not-allowed',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={item.data.avatar}
                    sx={{
                      filter: 'grayscale(100%)',
                      opacity: 0.7,
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ color: 'text.disabled' }}>{item.data.name}</Typography>
                  }
                  secondary={<Typography sx={{ color: 'text.disabled' }}>Disabled item</Typography>}
                />
              </ListItem>
            </Box>
          )}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(1px)',
          }}
        >
          <Typography variant="h6" color="text.disabled">
            List Disabled
          </Typography>
        </Box>
      </Paper>
    );
  },
};

export const ErrorState: Story = {
  render: () => {
    return (
      <Paper sx={{ width: 400, height: 300 }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              borderRadius: '50%',
              bgcolor: 'error.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" color="error.main">
              ⚠
            </Typography>
          </Box>
          <Typography variant="h6" color="error.main" gutterBottom>
            Failed to Load Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Unable to fetch virtual list items. Please try again.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </Box>
        </Box>
      </Paper>
    );
  },
};
