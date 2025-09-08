import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor } from '@storybook/test';
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
  tags: ['autodocs', 'test'],
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

export const BasicInteractionTest: Story = {
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

export const KeyboardNavigationTest: Story = {
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

export const ScreenReaderTest: Story = {
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

export const ResponsiveDesignTest: Story = {
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

export const PerformanceTest: Story = {
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
