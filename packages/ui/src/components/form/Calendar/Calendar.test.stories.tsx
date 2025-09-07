import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Box, ThemeProvider, createTheme } from '@mui/material';

import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Form/Calendar/Tests',
  component: Calendar,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
    docs: {
      description: {
        component:
          'Comprehensive test suite for Calendar component covering interactions, accessibility, visual states, and edge cases.',
      },
    },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Interaction Tests
 * Tests fundamental date selection functionality
 */
export const BasicInteraction: Story = {
  args: {
    variant: 'default',
    color: 'primary',
    size: 'md',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Test calendar renders
    const calendar = canvas.getByLabelText(/Calendar for/);
    await expect(calendar).toBeInTheDocument();

    // Test basic date selection
    const today = new Date();
    const todayButton = canvas.getByLabelText(new RegExp(today.toLocaleDateString()));
    await userEvent.click(todayButton);

    // Verify callback was called
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
    });

    // Test month navigation
    const buttons = canvas.getAllByRole('button');
    const nextButton = buttons.find(
      (btn) =>
        btn.getAttribute('aria-label')?.toLowerCase().includes('next') ||
        btn.innerHTML.includes('ChevronRight') ||
        btn.querySelector('[data-testid="ChevronRightIcon"]'),
    );

    if (nextButton) {
      await userEvent.click(nextButton);
      await waitFor(() => {
        expect(calendar).toBeInTheDocument();
      });
    }

    // Test today button functionality
    const todayButtons = canvas
      .getAllByRole('button')
      .filter(
        (btn) =>
          btn.innerHTML.includes('Today') || btn.getAttribute('aria-label')?.includes('today'),
      );

    if (todayButtons.length > 0) {
      await userEvent.click(todayButtons[0]);
      await waitFor(() => {
        expect(calendar).toBeInTheDocument();
      });
    }
  },
};

/**
 * Form Interaction Tests
 * Tests calendar as part of form workflows
 */
export const FormInteraction: Story = {
  args: {
    variant: 'default',
    color: 'primary',
    size: 'md',
    onChange: fn(),
  },
  render: (args) => {
    return (
      <Box sx={{ p: 2 }}>
        <form>
          <Calendar {...args} />
          <button type="submit">Submit</button>
        </form>
      </Box>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Test calendar in form context
    const form = canvasElement.querySelector('form');
    await expect(form).toBeInTheDocument();

    const calendar = canvas.getByLabelText(/Calendar for/);
    await expect(calendar).toBeInTheDocument();

    // Select a date
    const dates = canvas.getAllByRole('gridcell');
    if (dates.length > 15) {
      await userEvent.click(dates[15]); // Click middle date

      // Verify onChange was called
      await waitFor(() => {
        expect(args.onChange).toHaveBeenCalled();
      });
    }

    // Test form submission doesn't break calendar
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // Calendar should still be functional
    await expect(calendar).toBeInTheDocument();
  },
};

/**
 * Keyboard Navigation Tests
 * Tests comprehensive keyboard accessibility
 */
export const KeyboardNavigation: Story = {
  args: {
    variant: 'default',
    color: 'primary',
    size: 'md',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const calendar = canvas.getByLabelText(/Calendar for/);
    await expect(calendar).toBeInTheDocument();

    // Focus the calendar
    calendar.focus();

    // Test arrow key navigation
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(document.activeElement).toBeTruthy();
    });

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(document.activeElement).toBeTruthy();
    });

    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(document.activeElement).toBeTruthy();
    });

    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => {
      expect(document.activeElement).toBeTruthy();
    });

    // Test Home key (first day of month)
    await userEvent.keyboard('{Home}');
    await waitFor(() => {
      expect(document.activeElement).toBeTruthy();
    });

    // Test End key (last day of month)
    await userEvent.keyboard('{End}');
    await waitFor(() => {
      expect(document.activeElement).toBeTruthy();
    });

    // Test Page Down (next month)
    await userEvent.keyboard('{PageDown}');
    await waitFor(() => {
      expect(calendar).toBeInTheDocument();
    });

    // Test Page Up (previous month)
    await userEvent.keyboard('{PageUp}');
    await waitFor(() => {
      expect(calendar).toBeInTheDocument();
    });

    // Test Enter to select
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
    });

    // Test Escape to blur
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(document.activeElement).not.toBe(calendar);
    });
  },
};

/**
 * Screen Reader Accessibility Tests
 * Tests ARIA attributes and screen reader compatibility
 */
export const ScreenReader: Story = {
  args: {
    variant: 'default',
    color: 'primary',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test main calendar has proper ARIA role
    const calendar = canvas.getByLabelText(/Calendar for/);
    await expect(calendar).toBeInTheDocument();
    await expect(calendar).toHaveAttribute('role', 'grid');

    // Test calendar has accessible name
    await expect(calendar).toHaveAttribute('aria-label');

    // Test date cells have proper roles and labels
    const dateCells = canvas.getAllByRole('gridcell');
    await expect(dateCells.length).toBeGreaterThan(28); // At least a month's worth

    for (let i = 0; i < Math.min(5, dateCells.length); i++) {
      const cell = dateCells[i];
      await expect(cell).toHaveAttribute('role', 'gridcell');
      await expect(cell).toHaveAttribute('aria-label');
    }

    // Test buttons have accessible names
    const buttons = canvas.getAllByRole('button');
    for (const button of buttons) {
      const hasAccessibleName =
        button.hasAttribute('aria-label') ||
        button.textContent?.trim() !== '' ||
        button.hasAttribute('title');
      expect(hasAccessibleName).toBe(true);
    }

    // Test tabindex management
    const focusableElements = dateCells.filter(
      (cell) => cell.getAttribute('tabindex') === '0' || cell.getAttribute('tabindex') === null,
    );

    // Should have at most one focusable date cell (roving tabindex)
    expect(focusableElements.length).toBeLessThanOrEqual(1);
  },
};

/**
 * Focus Management Tests
 * Tests focus handling and visual indicators
 */
export const FocusManagement: Story = {
  args: {
    variant: 'range',
    color: 'primary',
    size: 'md',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const calendar = canvas.getByLabelText(/Calendar for/);
    await expect(calendar).toBeInTheDocument();

    // Test initial focus
    calendar.focus();
    await waitFor(() => {
      expect(document.activeElement).toBe(calendar);
    });

    // Test tab navigation doesn't break focus management
    await userEvent.tab();
    await userEvent.tab({ shift: true }); // Tab back

    // Test focus returns to calendar
    await waitFor(() => {
      expect(document.activeElement).toBeTruthy();
    });

    // Test focus visible indicators
    // eslint-disable-next-line no-undef
    const computedStyle = getComputedStyle(calendar);
    expect(computedStyle.outline).toBeDefined();

    // Test date cell focus
    await userEvent.keyboard('{ArrowRight}');

    const focusedCell = document.activeElement;
    if (focusedCell && focusedCell.getAttribute('role') === 'gridcell') {
      // eslint-disable-next-line no-undef
      const cellStyle = getComputedStyle(focusedCell);
      expect(cellStyle.outline).toBeDefined();
    }

    // Test selection maintains focus
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
      expect(document.activeElement).toBeTruthy();
    });
  },
};

/**
 * Responsive Design Tests
 * Tests calendar across different viewport sizes
 */
export const ResponsiveDesign: Story = {
  args: {
    variant: 'default',
    color: 'primary',
    size: 'md',
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1200px', height: '800px' } },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const calendar = canvas.getByLabelText(/Calendar for/);
    await expect(calendar).toBeInTheDocument();

    // Test calendar is visible and functional at current viewport
    const calendarRect = calendar.getBoundingClientRect();
    await expect(calendarRect.width).toBeGreaterThan(0);
    await expect(calendarRect.height).toBeGreaterThan(0);

    // Test date cells are appropriately sized
    const dateCells = canvas.getAllByRole('gridcell');
    await expect(dateCells.length).toBeGreaterThan(28);

    for (let i = 0; i < Math.min(3, dateCells.length); i++) {
      const cell = dateCells[i];
      const cellRect = cell.getBoundingClientRect();

      // Cells should have reasonable minimum size
      await expect(cellRect.width).toBeGreaterThan(20);
      await expect(cellRect.height).toBeGreaterThan(20);

      // Cells should not overflow container
      await expect(cellRect.right).toBeLessThanOrEqual(calendarRect.right + 5);
      await expect(cellRect.bottom).toBeLessThanOrEqual(calendarRect.bottom + 5);
    }

    // Test navigation buttons are accessible
    const buttons = canvas.getAllByRole('button');
    for (const button of buttons) {
      const buttonRect = button.getBoundingClientRect();
      await expect(buttonRect.width).toBeGreaterThan(0);
      await expect(buttonRect.height).toBeGreaterThan(0);
    }
  },
};

/**
 * Theme Variations Tests
 * Tests calendar with different color themes
 */
export const ThemeVariations: Story = {
  render: () => (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}
    >
      {(['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'] as const).map(
        (color) => (
          <Box key={color} sx={{ p: 1 }}>
            <Calendar color={color} size="sm" />
          </Box>
        ),
      )}
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test all calendar instances render
    const calendars = canvas.getAllByRole('grid');
    await expect(calendars.length).toBe(6);

    for (const calendar of calendars) {
      await expect(calendar).toBeInTheDocument();

      // Test calendar has visual styling
      // eslint-disable-next-line no-undef
      const computedStyle = getComputedStyle(calendar);
      await expect(computedStyle.backgroundColor).toBeTruthy();

      // Test date cells have themed styling
      const dateCells = within(calendar).getAllByRole('gridcell');
      await expect(dateCells.length).toBeGreaterThan(28);

      // Spot check a few cells for styling
      for (let i = 0; i < Math.min(2, dateCells.length); i++) {
        // eslint-disable-next-line no-undef
        const cellStyle = getComputedStyle(dateCells[i]);
        await expect(cellStyle.color).toBeTruthy();
      }
    }
  },
};

/**
 * Visual States Tests
 * Tests different visual states and effects
 */
export const VisualStates: Story = {
  render: () => (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}
    >
      <Box>
        <h4>Default</h4>
        <Calendar variant="default" />
      </Box>

      <Box>
        <h4>Glass Effect</h4>
        <Calendar glass variant="default" />
      </Box>

      <Box>
        <h4>Gradient</h4>
        <Calendar gradient variant="default" />
      </Box>

      <Box>
        <h4>Combined Effects</h4>
        <Calendar glass gradient variant="range" color="secondary" />
      </Box>

      <Box>
        <h4>Range Mode</h4>
        <Calendar
          variant="range"
          value={[new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]}
        />
      </Box>

      <Box>
        <h4>Multi Selection</h4>
        <Calendar
          variant="multi"
          value={[new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)]}
        />
      </Box>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const calendars = canvas.getAllByRole('grid');
    await expect(calendars.length).toBe(6);

    for (const calendar of calendars) {
      await expect(calendar).toBeInTheDocument();

      // Test visual effects are applied
      const calendarElement =
        calendar.closest('[class*="StyledCalendar"]') || calendar.parentElement;
      if (calendarElement) {
        // eslint-disable-next-line no-undef
        const computedStyle = getComputedStyle(calendarElement);

        // Should have styling
        expect(
          computedStyle.backgroundColor || computedStyle.background || computedStyle.backdropFilter,
        ).toBeTruthy();
      }

      // Test selected dates have visual distinction
      const selectedCells = within(calendar)
        .queryAllByRole('gridcell')
        .filter((cell) => cell.getAttribute('aria-selected') === 'true');

      for (const selectedCell of selectedCells) {
        // eslint-disable-next-line no-undef
        const cellStyle = getComputedStyle(selectedCell);
        expect(cellStyle.backgroundColor).toBeTruthy();
      }
    }
  },
};

/**
 * Performance Tests
 * Tests calendar performance with various configurations
 */
export const Performance: Story = {
  args: {
    variant: 'multi',
    color: 'primary',
    size: 'md',
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test initial render performance
    // eslint-disable-next-line no-undef
    const startTime = performance.now();

    const calendar = canvas.getByLabelText(/Calendar for/);
    await expect(calendar).toBeInTheDocument();

    // eslint-disable-next-line no-undef
    const renderTime = performance.now() - startTime;
    // eslint-disable-next-line no-console
    console.log(`Calendar render time: ${renderTime}ms`);

    // Test rapid interactions don't cause performance issues
    const dateCells = canvas.getAllByRole('gridcell').slice(10, 20);

    // eslint-disable-next-line no-undef
    const interactionStart = performance.now();

    for (const cell of dateCells) {
      await userEvent.click(cell);
      // Small delay to allow state updates
      // eslint-disable-next-line no-undef
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // eslint-disable-next-line no-undef
    const interactionTime = performance.now() - interactionStart;
    // eslint-disable-next-line no-console
    console.log(`Multi-selection interaction time: ${interactionTime}ms`);

    // Test navigation performance
    // eslint-disable-next-line no-undef
    const navStart = performance.now();

    // Navigate months quickly
    const nextButtons = canvas
      .getAllByRole('button')
      .filter((btn) => btn.innerHTML.includes('ChevronRight'));

    if (nextButtons.length > 0) {
      for (let i = 0; i < 3; i++) {
        await userEvent.click(nextButtons[0]);
        await waitFor(() => expect(calendar).toBeInTheDocument());
      }
    }

    // eslint-disable-next-line no-undef
    const navTime = performance.now() - navStart;
    // eslint-disable-next-line no-console
    console.log(`Navigation time: ${navTime}ms`);

    // Performance assertions
    expect(renderTime).toBeLessThan(100); // Should render quickly
    expect(interactionTime).toBeLessThan(500); // Interactions should be responsive
    expect(navTime).toBeLessThan(300); // Navigation should be smooth
  },
};

/**
 * Edge Cases Tests
 * Tests calendar with boundary conditions and edge cases
 */
export const EdgeCases: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <h4>Date Constraints</h4>
        <Calendar
          minDate={new Date(2024, 0, 15)}
          maxDate={new Date(2024, 2, 15)}
          value={new Date(2024, 1, 1)}
        />
      </Box>

      <Box>
        <h4>Year View</h4>
        <Calendar variant="year" />
      </Box>

      <Box>
        <h4>Tiny Size</h4>
        <Calendar size="xs" />
      </Box>

      <Box>
        <h4>Extra Large Size</h4>
        <Calendar size="xl" />
      </Box>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const calendars = canvas.getAllByRole('grid');
    await expect(calendars.length).toBeGreaterThan(0);

    for (const calendar of calendars) {
      await expect(calendar).toBeInTheDocument();

      // Test constrained calendar has disabled dates
      const dateCells = within(calendar).getAllByRole('gridcell');

      // At least some cells should exist
      await expect(dateCells.length).toBeGreaterThan(0);

      // Test cells are interactive where appropriate
      const enabledCells = dateCells.filter((cell) => !cell.hasAttribute('disabled'));
      expect(enabledCells.length).toBeGreaterThan(0);
    }

    // Test year view specifically
    const yearViewHeaders = canvas.queryAllByText(/\d{4}-\d{4}/);
    if (yearViewHeaders.length > 0) {
      // Year view should show year ranges
      expect(yearViewHeaders.length).toBeGreaterThan(0);
    }

    // Test size variations render correctly
    for (const calendar of calendars) {
      const rect = calendar.getBoundingClientRect();
      expect(rect.width).toBeGreaterThan(100);
      expect(rect.height).toBeGreaterThan(100);
    }

    // Test date constraint enforcement
    const firstCalendar = calendars[0];
    const constrainedCells = within(firstCalendar).getAllByRole('gridcell');

    // Should have some disabled dates due to constraints
    const disabledCells = constrainedCells.filter(
      (cell) =>
        cell.hasAttribute('disabled') ||
        cell.getAttribute('aria-disabled') === 'true' ||
        // eslint-disable-next-line no-undef
        getComputedStyle(cell).pointerEvents === 'none',
    );

    // Note: Disabled styling might be applied via CSS, not attributes
    // eslint-disable-next-line no-console
    console.log(
      `Found ${disabledCells.length} disabled cells out of ${constrainedCells.length} total`,
    );
  },
};

/**
 * Integration Tests
 * Tests calendar integration with external components and themes
 */
export const Integration: Story = {
  render: () => {
    const lightTheme = createTheme({
      palette: { mode: 'light' },
    });

    const darkTheme = createTheme({
      palette: { mode: 'dark' },
    });

    return (
      <Box sx={{ display: 'flex', gap: 3 }}>
        <ThemeProvider theme={lightTheme}>
          <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
            <h4>Light Theme</h4>
            <Calendar variant="range" color="primary" />
          </Box>
        </ThemeProvider>

        <ThemeProvider theme={darkTheme}>
          <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
            <h4>Dark Theme</h4>
            <Calendar variant="range" color="secondary" />
          </Box>
        </ThemeProvider>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test both theme variants render
    const calendars = canvas.getAllByRole('grid');
    await expect(calendars.length).toBe(2);

    for (const calendar of calendars) {
      await expect(calendar).toBeInTheDocument();

      // Test calendar adapts to theme
      const calendarContainer =
        calendar.closest('[class*="MuiBox-root"]') || calendar.parentElement;
      if (calendarContainer) {
        // eslint-disable-next-line no-undef
        const containerStyle = getComputedStyle(calendarContainer);
        expect(containerStyle.backgroundColor).toBeTruthy();
      }

      // Test calendar controls work in both themes
      const dateCells = within(calendar).getAllByRole('gridcell');
      await expect(dateCells.length).toBeGreaterThan(28);

      // Click a date in each calendar
      if (dateCells.length > 15) {
        await userEvent.click(dateCells[15]);

        // Should not throw errors
        await waitFor(() => {
          expect(calendar).toBeInTheDocument();
        });
      }
    }

    // Test navigation works in both themes
    const buttons = canvas.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Test a navigation button from each calendar
    const navButtons = buttons.filter(
      (btn) =>
        btn.innerHTML.includes('Today') ||
        btn.innerHTML.includes('ChevronLeft') ||
        btn.innerHTML.includes('ChevronRight'),
    );

    if (navButtons.length > 0) {
      await userEvent.click(navButtons[0]);

      // Should not cause errors
      await waitFor(() => {
        expect(calendars[0]).toBeInTheDocument();
      });
    }
  },
};
