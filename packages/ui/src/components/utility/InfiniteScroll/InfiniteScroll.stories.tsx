import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import { Box, Typography, Card, CardContent, Avatar, ListItem, ListItemAvatar, ListItemText, CircularProgress, Paper } from '@mui/material';

import { InfiniteScroll } from './InfiniteScroll';

const meta: Meta<typeof InfiniteScroll> = {
  title: 'Utility/InfiniteScroll',
  component: InfiniteScroll,
  tags: ['autodocs', 'component:InfiniteScroll'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Infinite scroll component with support for vertical, reverse, and horizontal scrolling modes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfiniteScroll>;

interface Item {
  id: number;
  name: string;
  description: string;
  avatar: string;
}

const generateItems = (startIndex: number, count: number): Item[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: startIndex + i,
    name: `User ${startIndex + i + 1}`,
    description: `This is a description for user ${startIndex + i + 1}. They have been using our platform for a while.`,
    avatar: `https://i.pravatar.cc/40?img=${((startIndex + i) % 70) + 1}`,
  }));
};

const VerticalScrollComponent = () => {
const [items, setItems] = useState<Item[]>(generateItems(0, 20));
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => window.setTimeout(resolve, 1000));
      
      const newItems = generateItems(items.length, 10);
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
      
      // Stop loading after 100 items for demo
      if (items.length >= 90) {
        setHasMore(false);
      }
    }, [items.length]);

    return (
      <Paper sx={{ width: 400, height: 500, overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Infinite Scroll Demo</Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length} items loaded
          </Typography>
        </Box>
        
        <Box sx={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
          <InfiniteScroll
            hasMore={hasMore}
            loading={loading}
            loadMore={loadMore}
            threshold={100}
          >
            {items.map((item) => (
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar src={item.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={item.description}
                />
              </ListItem>
            ))}
          </InfiniteScroll>
        </Box>
      </Paper>
    );
};

export const VerticalScroll: Story = {
  render: () => <VerticalScrollComponent />,
};

const CardGridComponent = () => {
const [items, setItems] = useState<Item[]>(generateItems(0, 12));
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async () => {
      setLoading(true);
      await new Promise(resolve => window.setTimeout(resolve, 1500));
      
      const newItems = generateItems(items.length, 8);
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
      
      if (items.length >= 60) {
        setHasMore(false);
      }
    }, [items.length]);

    return (
      <Box sx={{ width: 800, height: 600, overflow: 'auto' }}>
        <Typography variant="h5" sx={{ p: 3, pb: 2 }}>
          Infinite Card Grid
        </Typography>
        
        <InfiniteScroll
          hasMore={hasMore}
          loading={loading}
          loadMore={loadMore}
          threshold={200}
          loader={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading more cards...</Typography>
            </Box>
          }
        >
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 3,
            p: 3,
          }}>
            {items.map((item) => (
              <Card 
                key={item.id}
                sx={{ 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={item.avatar} sx={{ mr: 2 }} />
                    <Typography variant="h6">
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                    ID: {item.id}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </InfiniteScroll>
      </Box>
    );
};

export const CardGrid: Story = {
  render: () => <CardGridComponent />,
};

const ReverseScrollComponent = () => {
const [messages, setMessages] = useState<Item[]>(generateItems(0, 15));
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async () => {
      setLoading(true);
      await new Promise(resolve => window.setTimeout(resolve, 800));
      
      // Add older messages at the beginning
      const olderMessages = generateItems(-messages.length - 10, 10).reverse();
      setMessages(prev => [...olderMessages, ...prev]);
      setLoading(false);
      
      if (messages.length >= 50) {
        setHasMore(false);
      }
    }, [messages.length]);

    return (
      <Paper sx={{ width: 500, height: 600 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Chat History</Typography>
          <Typography variant="body2" color="text.secondary">
            Reverse infinite scroll (loads older messages at top)
          </Typography>
        </Box>
        
        <Box sx={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
          <InfiniteScroll
            variant="reverse"
            hasMore={hasMore}
            loading={loading}
            loadMore={loadMore}
            threshold={50}
            loader={
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Loading older messages...
                </Typography>
              </Box>
            }
          >
            {messages.map((message, index) => (
              <Box
                key={message.id}
                sx={{
                  p: 2,
                  borderBottom: index < messages.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                <Avatar src={message.avatar} sx={{ width: 32, height: 32 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {message.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {message.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Message ID: {message.id}
                  </Typography>
                </Box>
              </Box>
            ))}
          </InfiniteScroll>
        </Box>
      </Paper>
    );
};

export const ReverseScroll: Story = {
  render: () => <ReverseScrollComponent />,
};

const HorizontalScrollComponent = () => {
const [items, setItems] = useState<Item[]>(generateItems(0, 10));
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async () => {
      setLoading(true);
      await new Promise(resolve => window.setTimeout(resolve, 1000));
      
      const newItems = generateItems(items.length, 5);
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
      
      if (items.length >= 40) {
        setHasMore(false);
      }
    }, [items.length]);

    return (
      <Paper sx={{ width: 600, height: 300 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Horizontal Infinite Scroll</Typography>
          <Typography variant="body2" color="text.secondary">
            Scroll horizontally to load more items
          </Typography>
        </Box>
        
        <InfiniteScroll
          variant="horizontal"
          hasMore={hasMore}
          loading={loading}
          loadMore={loadMore}
          width="100%"
          threshold={100}
          loader={
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              p: 2,
              minWidth: 120,
              height: '100%',
            }}>
              <CircularProgress size={20} />
              <Typography variant="caption" sx={{ mt: 1 }}>
                Loading...
              </Typography>
            </Box>
          }
        >
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            p: 2,
            height: '100%',
          }}>
            {items.map((item) => (
              <Card 
                key={item.id}
                sx={{ 
                  minWidth: 200,
                  maxWidth: 200,
                  height: 'fit-content',
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar 
                    src={item.avatar} 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mx: 'auto',
                      mb: 2,
                    }} 
                  />
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Item #{item.id + 1}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </InfiniteScroll>
      </Paper>
    );
};

export const HorizontalScroll: Story = {
  render: () => <HorizontalScrollComponent />,
};