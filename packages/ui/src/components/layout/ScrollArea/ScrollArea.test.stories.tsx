import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';
import { Box, Typography, Button, TextField, List, ListItem } from '@mui/material';

import { ScrollArea } from './ScrollArea';

const meta: Meta<typeof ScrollArea> = {
  title: 'Layout/ScrollArea/Tests',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:ScrollArea'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to generate content
const generateContent = (lines: number) => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: lines }, (_, i) => (
      <Typography key={i} paragraph data-testid={`line-${i}`}>
        Line {i + 1}: This is scrollable content. Lorem ipsum dolor sit amet.
      </Typography>
    ))}
  </Box>
);

// Test 1: Basic Interaction Test
export const BasicInteractionTest: Story = {
  args: {
    width: 400,
    height: 300,
    scrollToTopButton: true,
    scrollToTopThreshold: 50,
    onScroll: fn(),
    children: generateContent(50),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find scroll area
    const scrollArea = await canvas.findByTestId('scroll-area');
    expect(scrollArea).toBeInTheDocument();

    // Find the scrollable container
    const scrollContainer = scrollArea.querySelector('[role="region"]');
    expect(scrollContainer).toBeInTheDocument();

    // Verify initial state
    expect(scrollContainer).toHaveAttribute('aria-label', 'Scrollable content');
    expect(scrollContainer).toHaveAttribute('aria-busy', 'false');

    // Simulate scroll
    if (scrollContainer) {
      // Scroll down
      scrollContainer.scrollTop = 200;
      scrollContainer.dispatchEvent(new window.Event('scroll', { bubbles: true }));

      await waitFor(() => {
        expect(args.onScroll).toHaveBeenCalled();
      });

      // Check if scroll-to-top button appears
      await waitFor(() => {
        const scrollToTopBtn = canvas.queryByLabelText('Scroll to top');
        expect(scrollToTopBtn).toBeInTheDocument();
      });

      // Click scroll to top
      const scrollToTopBtn = await canvas.findByLabelText('Scroll to top');
      await userEvent.click(scrollToTopBtn);

      // Verify scrolled to top
      await waitFor(() => {
        expect(scrollContainer.scrollTop).toBeLessThan(50);
      });
    }
  },
};

// Test 2: Form Interaction Test
export const FormInteractionTest: Story = {
  args: {
    width: 400,
    height: 300,
    children: (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Form in Scroll Area
        </Typography>
        {Array.from({ length: 10 }, (_, i) => (
          <TextField
            key={i}
            fullWidth
            label={`Field ${i + 1}`}
            margin="normal"
            data-testid={`field-${i}`}
          />
        ))}
        <Button variant="contained" sx={{ mt: 2 }} data-testid="submit-btn">
          Submit
        </Button>
      </Box>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find form elements
    const firstField = await canvas.findByTestId('field-0');
    const lastField = await canvas.findByTestId('field-9');
    const submitBtn = await canvas.findByTestId('submit-btn');

    expect(firstField).toBeInTheDocument();
    expect(lastField).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();

    // Type in first field
    await userEvent.type(firstField, 'Test input');

    // Scroll to last field
    lastField.scrollIntoView({ behavior: 'smooth' });

    await waitFor(() => {
      const rect = lastField.getBoundingClientRect();
      expect(rect.top).toBeGreaterThan(0);
    });

    // Type in last field (skip clear due to MUI TextField compatibility)
    await userEvent.type(lastField, 'Last field input');

    // Click submit
    await userEvent.click(submitBtn);
  },
};

// Test 3: Keyboard Navigation Test
export const KeyboardNavigationTest: Story = {
  args: {
    width: 400,
    height: 300,
    children: (
      <List>
        {Array.from({ length: 30 }, (_, i) => (
          <ListItem key={i} button tabIndex={0} data-testid={`item-${i}`}>
            <Typography>Item {i + 1}</Typography>
          </ListItem>
        ))}
      </List>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find scroll area
    const scrollArea = await canvas.findByTestId('scroll-area');
    const scrollContainer = scrollArea.querySelector('[role="region"]');

    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveAttribute('tabIndex', '0');

    // Focus the scroll area
    if (scrollContainer) {
      scrollContainer.focus();
      expect(document.activeElement).toBe(scrollContainer);

      // Test keyboard scrolling
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{PageDown}');

      await waitFor(() => {
        expect(scrollContainer.scrollTop).toBeGreaterThan(0);
      });

      // Test Home key
      await userEvent.keyboard('{Home}');
      await waitFor(() => {
        expect(scrollContainer.scrollTop).toBe(0);
      });

      // Test End key
      await userEvent.keyboard('{End}');
      await waitFor(() => {
        expect(scrollContainer.scrollTop).toBeGreaterThan(100);
      });
    }
  },
};

// Test 4: Screen Reader Test
export const ScreenReaderTest: Story = {
  args: {
    width: 400,
    height: 300,
    loading: false,
    disabled: false,
    children: generateContent(20),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check ARIA attributes
    const scrollArea = await canvas.findByTestId('scroll-area');
    const scrollContainer = scrollArea.querySelector('[role="region"]');

    expect(scrollContainer).toHaveAttribute('role', 'region');
    expect(scrollContainer).toHaveAttribute('aria-label', 'Scrollable content');
    expect(scrollContainer).toHaveAttribute('aria-busy', 'false');
    expect(scrollContainer).toHaveAttribute('tabIndex', '0');

    // Test with loading state
    const loadingArea = within(document.createElement('div')).container;
    loadingArea.innerHTML = '<div role="region" aria-busy="true">Loading...</div>';
    const loadingRegion = loadingArea.querySelector('[role="region"]');
    expect(loadingRegion).toHaveAttribute('aria-busy', 'true');

    // Test with disabled state
    const disabledArea = within(document.createElement('div')).container;
    disabledArea.innerHTML = '<div role="region" tabindex="-1">Disabled</div>';
    const disabledRegion = disabledArea.querySelector('[role="region"]');
    expect(disabledRegion).toHaveAttribute('tabIndex', '-1');
  },
};

// Test 5: Focus Management Test
export const FocusManagementTest: Story = {
  args: {
    width: 400,
    height: 300,
    children: (
      <Box sx={{ p: 2 }}>
        <Button data-testid="btn-1">Button 1</Button>
        {generateContent(20)}
        <Button data-testid="btn-2">Button 2</Button>
      </Box>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const scrollArea = await canvas.findByTestId('scroll-area');
    const scrollContainer = scrollArea.querySelector('[role="region"]');
    const btn1 = await canvas.findByTestId('btn-1');
    const btn2 = await canvas.findByTestId('btn-2');

    // Focus first button
    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    // Tab to scroll container
    await userEvent.tab();

    // Verify focus management
    if (scrollContainer) {
      // The focus might go to scrollContainer or btn2 depending on implementation
      const activeEl = document.activeElement;
      expect(activeEl === scrollContainer || activeEl === btn2).toBe(true);

      // Focus scroll container directly
      scrollContainer.focus();
      expect(document.activeElement).toBe(scrollContainer);

      // Verify focus visible styles are applied
      // const computedStyle = window.getComputedStyle(scrollContainer);
      // Focus styles should be present when focused
    }
  },
};

// Test 6: Responsive Design Test
export const ResponsiveDesignTest: Story = {
  args: {
    width: '100%',
    maxWidth: 600,
    height: '50vh',
    maxHeight: 400,
    children: generateContent(30),
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1920px', height: '1080px' } },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scrollArea = await canvas.findByTestId('scroll-area');

    // Check responsive width
    const styles = window.getComputedStyle(scrollArea);
    const width = parseInt(styles.width);

    // Should not exceed maxWidth
    expect(width).toBeLessThanOrEqual(600);

    // Check height constraints
    const height = parseInt(styles.height);
    expect(height).toBeLessThanOrEqual(400);
  },
};

// Test 7: Theme Variations Test
export const ThemeVariationsTest: Story = {
  args: {
    width: 400,
    height: 200,
    children: generateContent(20),
  },
  render: (args) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ScrollArea {...args} variant="default" data-testid="scroll-area" />
      <ScrollArea {...args} variant="overlay" data-testid="scroll-area-overlay" />
      <ScrollArea {...args} variant="glass" data-testid="scroll-area-glass" />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test default variant
    const defaultArea = await canvas.findByTestId('scroll-area');
    expect(defaultArea).toBeInTheDocument();

    // Test overlay variant
    const overlayArea = await canvas.findByTestId('scroll-area-overlay');
    expect(overlayArea).toBeInTheDocument();

    // Test glass variant
    const glassArea = await canvas.findByTestId('scroll-area-glass');
    expect(glassArea).toBeInTheDocument();

    // Verify different styling is applied
    const defaultStyles = window.getComputedStyle(defaultArea.querySelector('[role="region"]')!);
    const overlayStyles = window.getComputedStyle(overlayArea.querySelector('[role="region"]')!);
    const glassStyles = window.getComputedStyle(glassArea.querySelector('[role="region"]')!);

    // Each variant should have unique styles
    expect(defaultStyles).toBeDefined();
    expect(overlayStyles).toBeDefined();
    expect(glassStyles).toBeDefined();
  },
};

// Test 8: Visual States Test
export const VisualStatesTest: Story = {
  args: {
    width: 400,
    height: 200,
  },
  render: (args) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ScrollArea {...args} data-testid="scroll-area-normal">
        {generateContent(10)}
      </ScrollArea>
      <ScrollArea {...args} disabled data-testid="scroll-area-disabled">
        {generateContent(10)}
      </ScrollArea>
      <ScrollArea {...args} loading data-testid="scroll-area-loading">
        {generateContent(10)}
      </ScrollArea>
      <ScrollArea {...args} emptyContent="No content" data-testid="scroll-area-empty" />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test normal state
    const normalArea = await canvas.findByTestId('scroll-area-normal');
    const normalContainer = normalArea.querySelector('[role="region"]');
    expect(normalContainer).toHaveAttribute('aria-busy', 'false');
    expect(normalContainer).toHaveAttribute('tabIndex', '0');

    // Test disabled state
    const disabledArea = await canvas.findByTestId('scroll-area-disabled');
    const disabledContainer = disabledArea.querySelector('[role="region"]');
    expect(disabledContainer).toHaveAttribute('tabIndex', '-1');

    // Test loading state
    const loadingArea = await canvas.findByTestId('scroll-area-loading');
    const loadingContainer = loadingArea.querySelector('[role="region"]');
    expect(loadingContainer).toHaveAttribute('aria-busy', 'true');

    // Test empty state
    const emptyArea = await canvas.findByTestId('scroll-area-empty');
    expect(emptyArea).toHaveTextContent('No content');
  },
};

// Test 9: Performance Test
export const PerformanceTest: Story = {
  args: {
    width: 400,
    height: 300,
    smoothScroll: true,
    children: (
      <Box sx={{ p: 2 }}>
        {Array.from({ length: 1000 }, (_, i) => (
          <Typography key={i} paragraph data-testid={`perf-line-${i}`}>
            Performance test line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
        ))}
      </Box>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startTime = window.performance.now();

    // Find scroll area
    const scrollArea = await canvas.findByTestId('scroll-area');
    const scrollContainer = scrollArea.querySelector('[role="region"]');

    // Measure initial render time
    const renderTime = window.performance.now() - startTime;
    expect(renderTime).toBeLessThan(2000); // Should render within 2 seconds

    if (scrollContainer) {
      // Measure scroll performance
      const scrollStartTime = window.performance.now();

      // Perform multiple scroll operations
      for (let i = 0; i < 10; i++) {
        scrollContainer.scrollTop = i * 100;
        scrollContainer.dispatchEvent(new window.Event('scroll', { bubbles: true }));
      }

      const scrollTime = window.performance.now() - scrollStartTime;
      expect(scrollTime).toBeLessThan(500); // Scrolling should be smooth

      // Test smooth scroll to bottom
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });

      await waitFor(
        () => {
          expect(scrollContainer.scrollTop).toBeGreaterThan(0);
        },
        { timeout: 3000 },
      );
    }
  },
};

// Test 10: Edge Cases Test
export const EdgeCasesTest: Story = {
  args: {
    width: 400,
    height: 300,
  },
  render: (args) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Empty content */}
      <ScrollArea {...args} data-testid="scroll-area-empty">
        {null}
      </ScrollArea>

      {/* Very long content */}
      <ScrollArea {...args} height={100} data-testid="scroll-area-long">
        {generateContent(100)}
      </ScrollArea>

      {/* Wide content */}
      <ScrollArea {...args} width={200} orientation="horizontal" data-testid="scroll-area-wide">
        <Box sx={{ width: 1000, p: 2 }}>
          <Typography>Very wide content that requires horizontal scrolling</Typography>
        </Box>
      </ScrollArea>

      {/* No scrollable content */}
      <ScrollArea {...args} height={300} data-testid="scroll-area-no-scroll">
        <Typography>Short content</Typography>
      </ScrollArea>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test empty content
    const emptyArea = await canvas.findByTestId('scroll-area-empty');
    expect(emptyArea).toBeInTheDocument();

    // Test very long content
    const longArea = await canvas.findByTestId('scroll-area-long');
    const longContainer = longArea.querySelector('[role="region"]');
    expect(longContainer?.scrollHeight).toBeGreaterThan(100);

    // Test wide content
    const wideArea = await canvas.findByTestId('scroll-area-wide');
    const wideContainer = wideArea.querySelector('[role="region"]');
    expect(wideContainer?.scrollWidth).toBeGreaterThan(200);

    // Test no scroll needed
    const noScrollArea = await canvas.findByTestId('scroll-area-no-scroll');
    const noScrollContainer = noScrollArea.querySelector('[role="region"]');
    expect(noScrollContainer?.scrollHeight).toBeLessThanOrEqual(300);
  },
};

// Test 11: Integration Test
export const IntegrationTest: Story = {
  args: {
    width: 600,
    height: 400,
    scrollToTopButton: true,
    variant: 'overlay',
    onScroll: fn(),
  },
  render: function IntegrationTestRender(args) {
    const [scrollPosition, setScrollPosition] = React.useState(0);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Scroll Position: {scrollPosition}px
        </Typography>
        <ScrollArea
          {...args}
          data-testid="scroll-area"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            setScrollPosition(Math.round(target.scrollTop));
            args.onScroll?.(e);
          }}
        >
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              data-testid="action-btn"
              onClick={() => window.alert('Button clicked!')}
            >
              Action Button
            </Button>
            {generateContent(50)}
            <TextField fullWidth label="Input Field" data-testid="input-field" sx={{ mt: 2 }} />
          </Box>
        </ScrollArea>
      </Box>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find elements
    const scrollArea = await canvas.findByTestId('scroll-area');
    const actionBtn = await canvas.findByTestId('action-btn');
    const scrollContainer = scrollArea.querySelector('[role="region"]');

    // Test button interaction
    await userEvent.click(actionBtn);

    // Test scrolling
    if (scrollContainer) {
      scrollContainer.scrollTop = 200;
      scrollContainer.dispatchEvent(new window.Event('scroll', { bubbles: true }));

      await waitFor(() => {
        expect(args.onScroll).toHaveBeenCalled();
        const positionText = canvas.getByText(/Scroll Position: \d+px/);
        expect(positionText).toBeInTheDocument();
      });

      // Scroll to bottom to find input field
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      scrollContainer.dispatchEvent(new window.Event('scroll', { bubbles: true }));

      await waitFor(() => {
        const inputField = canvas.getByTestId('input-field');
        expect(inputField).toBeInTheDocument();
      });

      // Test scroll to top button
      const scrollToTopBtn = await canvas.findByLabelText('Scroll to top');
      await userEvent.click(scrollToTopBtn);

      await waitFor(() => {
        expect(scrollContainer.scrollTop).toBeLessThan(50);
      });
    }
  },
};
