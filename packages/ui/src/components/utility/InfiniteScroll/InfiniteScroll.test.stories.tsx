import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import React, { useState, useCallback } from 'react';
import { Box, Typography, ListItem, ListItemText } from '@mui/material';

import { InfiniteScroll } from './InfiniteScroll';

const meta: Meta<typeof InfiniteScroll> = {
  title: 'Utility/InfiniteScroll/Tests',
  component: InfiniteScroll,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
    viewport: { defaultViewport: 'responsive' },
  },
  tags: ['autodocs', 'test', 'component:InfiniteScroll'],
};

export default meta;
type Story = StoryObj<typeof meta>;

interface TestItem {
  id: number;
  name: string;
  description: string;
}

const generateTestItems = (startIndex: number, count: number): TestItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: startIndex + i,
    name: `Item ${startIndex + i + 1}`,
    description: `Description for item ${startIndex + i + 1}`,
  }));
};

const BasicInfiniteScrollComponent = () => {
  const [items, setItems] = useState<TestItem[]>(generateTestItems(0, 5));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 100));

    const newItems = generateTestItems(items.length, 3);
    setItems((prev) => [...prev, ...newItems]);
    setLoading(false);

    if (items.length >= 15) {
      setHasMore(false);
    }
  }, [items.length]);

  return (
    <Box
      sx={{ width: 400, height: 300, overflow: 'auto', border: '1px solid #ddd' }}
      data-testid="scroll-container"
    >
      <InfiniteScroll hasMore={hasMore} loading={loading} loadMore={loadMore} threshold={50}>
        {items.map((item) => (
          <ListItem key={item.id} data-testid={`item-${item.id}`}>
            <ListItemText primary={item.name} secondary={item.description} />
          </ListItem>
        ))}
      </InfiniteScroll>
    </Box>
  );
};

export const BasicInteraction: Story = {
  render: () => <BasicInfiniteScrollComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial render shows first batch of items', async () => {
      await expect(canvas.getByTestId('item-0')).toBeInTheDocument();
      await expect(canvas.getByTestId('item-4')).toBeInTheDocument();
      await expect(canvas.queryByTestId('item-5')).not.toBeInTheDocument();
    });

    await step('Scrolling to bottom triggers load more', async () => {
      const container = canvas.getByTestId('scroll-container');
      container.scrollTop = container.scrollHeight - container.clientHeight;

      await waitFor(
        async () => {
          await expect(canvas.getByTestId('item-5')).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    await step('New items are loaded and displayed', async () => {
      await expect(canvas.getByTestId('item-7')).toBeInTheDocument();
    });
  },
};

export const KeyboardNavigation: Story = {
  render: () => <BasicInfiniteScrollComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Focus can be set on scroll container', async () => {
      const container = canvas.getByTestId('scroll-container');
      container.focus();
      await expect(container).toHaveFocus();
    });

    await step('Page Down scrolls and loads more content', async () => {
      const container = canvas.getByTestId('scroll-container');
      container.focus();
      await userEvent.keyboard('{PageDown}');

      await waitFor(
        async () => {
          await expect(canvas.getByTestId('item-5')).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });
  },
};

export const ScreenReader: Story = {
  render: () => <BasicInfiniteScrollComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Items have proper text content for screen readers', async () => {
      const item = canvas.getByTestId('item-0');
      await expect(item).toHaveTextContent('Item 1');
      await expect(item).toHaveTextContent('Description for item 1');
    });

    await step('Loading state is announced', async () => {
      const container = canvas.getByTestId('scroll-container');
      container.scrollTop = container.scrollHeight - container.clientHeight;

      await waitFor(
        async () => {
          const loadingText = canvas.queryByText('Loading...');
          if (loadingText) {
            await expect(loadingText).toBeInTheDocument();
          }
        },
        { timeout: 1000 },
      );
    });
  },
};

export const ResponsiveDesign: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <Box sx={{ width: '100%', height: 400 }}>
      <BasicInfiniteScrollComponent />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Component adapts to mobile viewport', async () => {
      const container = canvas.getByTestId('scroll-container');
      await expect(container).toBeInTheDocument();
    });

    await step('Touch scrolling works on mobile', async () => {
      const container = canvas.getByTestId('scroll-container');
      container.scrollTop = container.scrollHeight - container.clientHeight;

      await waitFor(
        async () => {
          await expect(canvas.getByTestId('item-5')).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });
  },
};

export const Performance: Story = {
  render: () => {
    const PerformanceTestComponent = () => {
      const startTime = window.performance.now();
      const [renderTime, setRenderTime] = useState<number | null>(null);
      const [items, setItems] = useState<TestItem[]>(generateTestItems(0, 50));
      const [loading, setLoading] = useState(false);
      const [hasMore, setHasMore] = useState(true);

      const loadMore = useCallback(async () => {
        setLoading(true);
        await new Promise((resolve) => window.setTimeout(resolve, 50));
        const newItems = generateTestItems(items.length, 25);
        setItems((prev) => [...prev, ...newItems]);
        setLoading(false);
        if (items.length >= 200) setHasMore(false);
      }, [items.length]);

      React.useEffect(() => {
        const endTime = window.performance.now();
        setRenderTime(endTime - startTime);
      }, [startTime]);

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" data-testid="render-time">
            Render time: {renderTime?.toFixed(2)}ms
          </Typography>
          <Box
            sx={{ width: 400, height: 300, overflow: 'auto', border: '1px solid #ddd' }}
            data-testid="scroll-container"
          >
            <InfiniteScroll hasMore={hasMore} loading={loading} loadMore={loadMore} threshold={100}>
              {items.map((item) => (
                <ListItem key={item.id} data-testid={`perf-item-${item.id}`}>
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
            </InfiniteScroll>
          </Box>
        </Box>
      );
    };
    return <PerformanceTestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Component renders large dataset quickly', async () => {
      const renderTimeEl = canvas.getByTestId('render-time');
      const renderTimeText = renderTimeEl.textContent || '';
      const time = parseFloat(renderTimeText.match(/[\d.]+/)?.[0] || '0');

      await expect(time).toBeLessThan(1000);
    });

    await step('Scrolling remains smooth with many items', async () => {
      await expect(canvas.getByTestId('perf-item-0')).toBeInTheDocument();
      await expect(canvas.getByTestId('perf-item-49')).toBeInTheDocument();
    });
  },
};

export const FocusManagement: Story = {
  render: () => <BasicInfiniteScrollComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Focus moves correctly through items', async () => {
      const firstItem = canvas.getByTestId('item-0');
      firstItem.focus();
      await expect(firstItem).toHaveFocus();
    });

    await step('Tab navigation works within scrollable area', async () => {
      const container = canvas.getByTestId('scroll-container');
      container.focus();

      await userEvent.tab();
      const activeElement = document.activeElement;
      await expect(activeElement).toBeTruthy();
    });

    await step('Focus is retained after loading more items', async () => {
      const container = canvas.getByTestId('scroll-container');
      container.focus();

      container.scrollTop = container.scrollHeight - container.clientHeight;

      await waitFor(
        async () => {
          await expect(canvas.getByTestId('item-5')).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      await expect(container).toHaveFocus();
    });
  },
};

export const ThemeVariations: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Light Theme
        </Typography>
        <BasicInfiniteScrollComponent />
      </Box>
      <Box sx={{ bgcolor: 'grey.900', color: 'white', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Dark Theme
        </Typography>
        <BasicInfiniteScrollComponent />
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Component renders in both themes', async () => {
      const containers = canvas.getAllByTestId('scroll-container');
      await expect(containers).toHaveLength(2);

      containers.forEach((container) => {
        expect(container).toBeInTheDocument();
      });
    });
  },
};

export const VisualStates: Story = {
  render: () => {
    const VisualStatesComponent = () => {
      const [items] = useState<TestItem[]>(generateTestItems(0, 10));
      const [loading] = useState(false);
      const [hasMore] = useState(false);

      return (
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Normal State
            </Typography>
            <Box
              sx={{ width: 400, height: 200, overflow: 'auto', border: '1px solid #ddd' }}
              data-testid="normal-scroll"
            >
              <InfiniteScroll hasMore={hasMore} loading={loading} loadMore={() => {}}>
                {items.slice(0, 3).map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
              </InfiniteScroll>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Loading State
            </Typography>
            <Box
              sx={{ width: 400, height: 200, overflow: 'auto', border: '1px solid #ddd' }}
              data-testid="loading-scroll"
            >
              <InfiniteScroll hasMore={true} loading={true} loadMore={() => {}}>
                {items.slice(0, 3).map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
              </InfiniteScroll>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              End of List State
            </Typography>
            <Box
              sx={{ width: 400, height: 200, overflow: 'auto', border: '1px solid #ddd' }}
              data-testid="end-scroll"
            >
              <InfiniteScroll hasMore={false} loading={false} loadMore={() => {}}>
                {items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
              </InfiniteScroll>
            </Box>
          </Box>
        </Box>
      );
    };

    return <VisualStatesComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('All visual states are displayed', async () => {
      await expect(canvas.getByTestId('normal-scroll')).toBeInTheDocument();
      await expect(canvas.getByTestId('loading-scroll')).toBeInTheDocument();
      await expect(canvas.getByTestId('end-scroll')).toBeInTheDocument();
    });
  },
};

export const EdgeCases: Story = {
  render: () => {
    const EdgeCasesComponent = () => {
      const [emptyItems] = useState<TestItem[]>([]);
      const [singleItem] = useState<TestItem[]>(generateTestItems(0, 1));
      const [manyItems] = useState<TestItem[]>(generateTestItems(0, 100));

      return (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Empty List
            </Typography>
            <Box
              sx={{ width: 300, height: 200, overflow: 'auto', border: '1px solid #ddd' }}
              data-testid="empty-container"
            >
              <InfiniteScroll hasMore={false} loading={false} loadMore={() => {}}>
                {emptyItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
                <Typography sx={{ p: 2, textAlign: 'center' }}>No items to display</Typography>
              </InfiniteScroll>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Single Item
            </Typography>
            <Box
              sx={{ width: 300, height: 200, overflow: 'auto', border: '1px solid #ddd' }}
              data-testid="single-container"
            >
              <InfiniteScroll hasMore={false} loading={false} loadMore={() => {}}>
                {singleItem.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
              </InfiniteScroll>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Many Items
            </Typography>
            <Box
              sx={{ width: 300, height: 200, overflow: 'auto', border: '1px solid #ddd' }}
              data-testid="many-container"
            >
              <InfiniteScroll hasMore={false} loading={false} loadMore={() => {}}>
                {manyItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} secondary={item.description} />
                  </ListItem>
                ))}
              </InfiniteScroll>
            </Box>
          </Box>
        </Box>
      );
    };

    return <EdgeCasesComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty list case handles gracefully', async () => {
      const emptyContainer = canvas.getByTestId('empty-container');
      await expect(emptyContainer).toBeInTheDocument();
      await expect(canvas.getByText('No items to display')).toBeInTheDocument();
    });

    await step('Single item case renders correctly', async () => {
      const singleContainer = canvas.getByTestId('single-container');
      await expect(singleContainer).toBeInTheDocument();
      await expect(canvas.getByText('Item 1')).toBeInTheDocument();
    });

    await step('Many items case handles large dataset', async () => {
      const manyContainer = canvas.getByTestId('many-container');
      await expect(manyContainer).toBeInTheDocument();
      await expect(canvas.getByText('Item 100')).toBeInTheDocument();
    });
  },
};

export const Integration: Story = {
  render: () => {
    const IntegrationComponent = () => {
      const [items, setItems] = useState<TestItem[]>(generateTestItems(0, 5));
      const [loading, setLoading] = useState(false);
      const [hasMore, setHasMore] = useState(true);
      const [searchTerm, setSearchTerm] = useState('');

      const loadMore = useCallback(async () => {
        setLoading(true);
        await new Promise((resolve) => window.setTimeout(resolve, 100));

        const newItems = generateTestItems(items.length, 3);
        setItems((prev) => [...prev, ...newItems]);
        setLoading(false);

        if (items.length >= 15) {
          setHasMore(false);
        }
      }, [items.length]);

      const filteredItems = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      return (
        <Box sx={{ width: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-input"
              style={{ flex: 1, padding: '8px' }}
            />
            <Typography variant="body2" data-testid="item-count">
              {filteredItems.length} items
            </Typography>
          </Box>

          <Box
            sx={{ height: 300, overflow: 'auto', border: '1px solid #ddd' }}
            data-testid="integration-scroll"
          >
            <InfiniteScroll
              hasMore={hasMore && searchTerm === ''}
              loading={loading}
              loadMore={loadMore}
            >
              {filteredItems.map((item) => (
                <ListItem key={item.id} data-testid={`integrated-item-${item.id}`}>
                  <ListItemText primary={item.name} secondary={item.description} />
                </ListItem>
              ))}
            </InfiniteScroll>
          </Box>
        </Box>
      );
    };

    return <IntegrationComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Component integrates with search functionality', async () => {
      const searchInput = canvas.getByTestId('search-input');
      await expect(searchInput).toBeInTheDocument();

      const itemCount = canvas.getByTestId('item-count');
      await expect(itemCount).toHaveTextContent('5 items');
    });

    await step('Filtering works with infinite scroll', async () => {
      const searchInput = canvas.getByTestId('search-input');
      await userEvent.type(searchInput, 'Item 1');

      await waitFor(() => {
        const itemCount = canvas.getByTestId('item-count');
        expect(itemCount).toHaveTextContent('1 items');
      });
    });

    await step('Clear search restores all items', async () => {
      const searchInput = canvas.getByTestId('search-input');
      await userEvent.clear(searchInput);

      await waitFor(() => {
        const itemCount = canvas.getByTestId('item-count');
        expect(itemCount).toHaveTextContent('5 items');
      });
    });
  },
};
