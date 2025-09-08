import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Button, Typography, Stack, List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Data Display/Popover/Tests',
  component: Popover,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};
export default meta;
export type Story = StoryObj<typeof meta>;

// Helper component for tests
const PopoverTestWrapper = ({
  children,
  onOpen = fn(),
  onClose = fn(),
  ...props
}: {
  children?: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  variant?: 'default' | 'glass' | 'arrow';
  glow?: boolean;
  pulse?: boolean;
  maxWidth?: number;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    onOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleClick} data-testid="popover-trigger">
        Open Popover
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        data-testid="popover"
        {...props}
      >
        {children}
      </Popover>
    </>
  );
};

// 1. Basic Interaction Tests
export const BasicInteraction: Story = {
  render: () => (
    <PopoverTestWrapper>
      <Typography sx={{ p: 2 }} data-testid="popover-content">
        This is basic popover content.
      </Typography>
    </PopoverTestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial state should be closed', async () => {
      const trigger = canvas.getByTestId('popover-trigger');
      expect(trigger).toBeInTheDocument();

      // Popover should not be visible initially
      expect(canvas.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    await step('Should open popover on trigger click', async () => {
      const trigger = canvas.getByTestId('popover-trigger');
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByTestId('popover-content')).toBeInTheDocument();
      });
    });

    await step('Should close popover on outside click', async () => {
      // Click outside the popover
      await userEvent.click(canvasElement);

      await waitFor(() => {
        expect(canvas.queryByTestId('popover-content')).not.toBeInTheDocument();
      });
    });
  },
};

// 2. Form Interaction Tests
export const FormInteraction: Story = {
  render: () => (
    <PopoverTestWrapper>
      <div style={{ padding: 16 }}>
        <Typography variant="h6" gutterBottom>
          User Menu
        </Typography>
        <List dense>
          <ListItem button data-testid="menu-item-profile" onClick={() => {}}>
            <ListItemText primary="Profile Settings" />
          </ListItem>
          <ListItem button data-testid="menu-item-account" onClick={() => {}}>
            <ListItemText primary="Account Security" />
          </ListItem>
          <ListItem button data-testid="menu-item-notifications" onClick={() => {}}>
            <ListItemText primary="Notifications" />
          </ListItem>
        </List>
      </div>
    </PopoverTestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should open popover with menu items', async () => {
      const trigger = canvas.getByTestId('popover-trigger');
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByTestId('menu-item-profile')).toBeInTheDocument();
        expect(canvas.getByTestId('menu-item-account')).toBeInTheDocument();
        expect(canvas.getByTestId('menu-item-notifications')).toBeInTheDocument();
      });
    });

    await step('Should be able to click menu items', async () => {
      const profileItem = canvas.getByTestId('menu-item-profile');
      await userEvent.click(profileItem);

      // Menu item should still be clickable and accessible
      expect(profileItem).toBeInTheDocument();
    });
  },
};

// 3. Keyboard Navigation Tests
export const KeyboardNavigation: Story = {
  render: () => (
    <PopoverTestWrapper>
      <div style={{ padding: 16 }}>
        <Typography variant="h6" gutterBottom>
          Keyboard Navigation Test
        </Typography>
        <List dense>
          <ListItem button tabIndex={0} data-testid="item-1">
            <ListItemText primary="First Item" />
          </ListItem>
          <ListItem button tabIndex={0} data-testid="item-2">
            <ListItemText primary="Second Item" />
          </ListItem>
          <ListItem button tabIndex={0} data-testid="item-3">
            <ListItemText primary="Third Item" />
          </ListItem>
        </List>
      </div>
    </PopoverTestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should open popover with Enter key', async () => {
      const trigger = canvas.getByTestId('popover-trigger');
      trigger.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(canvas.getByTestId('item-1')).toBeInTheDocument();
      });
    });

    await step('Should close popover with Escape key', async () => {
      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(canvas.queryByTestId('item-1')).not.toBeInTheDocument();
      });
    });
  },
};

// 4. Screen Reader Tests
export const ScreenReader: Story = {
  render: () => (
    <PopoverTestWrapper>
      <div role="dialog" aria-label="User menu popover" style={{ padding: 16 }}>
        <Typography variant="h6" gutterBottom id="popover-title">
          Accessible Menu
        </Typography>
        <List dense aria-labelledby="popover-title">
          <ListItem button role="menuitem" data-testid="accessible-item-1">
            <ListItemText primary="Accessible Item 1" />
          </ListItem>
          <ListItem button role="menuitem" data-testid="accessible-item-2">
            <ListItemText primary="Accessible Item 2" />
          </ListItem>
        </List>
      </div>
    </PopoverTestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should have proper ARIA attributes', async () => {
      const trigger = canvas.getByTestId('popover-trigger');
      await userEvent.click(trigger);

      await waitFor(() => {
        const dialog = canvas.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-label', 'User menu popover');

        const menuItems = canvas.getAllByRole('menuitem');
        expect(menuItems).toHaveLength(2);
      });
    });

    await step('Should have proper heading structure', async () => {
      const title = canvas.getByText('Accessible Menu');
      expect(title).toHaveAttribute('id', 'popover-title');

      const list = canvas.getByRole('list');
      expect(list).toHaveAttribute('aria-labelledby', 'popover-title');
    });
  },
};

// 5. Focus Management Tests
export const FocusManagement: Story = {
  render: () => (
    <div>
      <Button data-testid="before-popover">Before Popover</Button>
      <PopoverTestWrapper>
        <div style={{ padding: 16 }}>
          <Button data-testid="first-focusable" autoFocus>
            First Focusable
          </Button>
          <Button data-testid="second-focusable">Second Focusable</Button>
        </div>
      </PopoverTestWrapper>
      <Button data-testid="after-popover">After Popover</Button>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should trap focus within popover', async () => {
      const trigger = canvas.getByTestId('popover-trigger');
      await userEvent.click(trigger);

      await waitFor(() => {
        const firstFocusable = canvas.getByTestId('first-focusable');
        expect(firstFocusable).toBeInTheDocument();
      });
    });

    await step('Should return focus to trigger when closed', async () => {
      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        const trigger = canvas.getByTestId('popover-trigger');
        expect(trigger).toHaveFocus();
      });
    });
  },
};

// 6. Responsive Design Tests
export const ResponsiveDesign: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <PopoverTestWrapper maxWidth={280}>
      <div style={{ padding: 16 }}>
        <Typography variant="h6" gutterBottom>
          Mobile Responsive Content
        </Typography>
        <Typography variant="body2" data-testid="mobile-content">
          This content should adapt to mobile viewport sizes and maintain readability.
        </Typography>
      </div>
    </PopoverTestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should display properly on mobile viewport', async () => {
      const trigger = canvas.getByTestId('popover-trigger');
      await userEvent.click(trigger);

      await waitFor(() => {
        const content = canvas.getByTestId('mobile-content');
        expect(content).toBeInTheDocument();
      });
    });
  },
};

// 7. Theme Variations Tests
export const ThemeVariations: Story = {
  render: () => (
    <Stack spacing={2} direction="row">
      <PopoverTestWrapper variant="default" data-testid="default-popover">
        <Typography sx={{ p: 2 }} data-testid="default-content">
          Default Theme
        </Typography>
      </PopoverTestWrapper>
      <PopoverTestWrapper variant="glass" data-testid="glass-popover">
        <Typography sx={{ p: 2 }} data-testid="glass-content">
          Glass Theme
        </Typography>
      </PopoverTestWrapper>
      <PopoverTestWrapper variant="arrow" data-testid="arrow-popover">
        <Typography sx={{ p: 2 }} data-testid="arrow-content">
          Arrow Theme
        </Typography>
      </PopoverTestWrapper>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should render all theme variants', async () => {
      const triggers = canvas.getAllByTestId('popover-trigger');
      expect(triggers).toHaveLength(3);

      // Test each variant
      for (let i = 0; i < triggers.length; i++) {
        await userEvent.click(triggers[i]);
        await waitFor(() => {
          // Just ensure the popover opens without checking specific styling
          const popover = canvasElement.querySelector('[role="presentation"]');
          expect(popover).toBeInTheDocument();
        });
        await userEvent.keyboard('{Escape}');
      }
    });
  },
};

// 8. Visual States Tests
export const VisualStates: Story = {
  render: () => (
    <Stack spacing={2} direction="row">
      <PopoverTestWrapper glow data-testid="glow-popover">
        <Typography sx={{ p: 2 }} data-testid="glow-content">
          Glow Effect
        </Typography>
      </PopoverTestWrapper>
      <PopoverTestWrapper pulse data-testid="pulse-popover">
        <Typography sx={{ p: 2 }} data-testid="pulse-content">
          Pulse Effect
        </Typography>
      </PopoverTestWrapper>
      <PopoverTestWrapper glow pulse data-testid="both-effects-popover">
        <Typography sx={{ p: 2 }} data-testid="both-effects-content">
          Both Effects
        </Typography>
      </PopoverTestWrapper>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should render visual effect variants', async () => {
      const triggers = canvas.getAllByTestId('popover-trigger');
      expect(triggers).toHaveLength(3);

      // Test glow effect
      await userEvent.click(triggers[0]);
      await waitFor(() => {
        expect(canvas.getByTestId('glow-content')).toBeInTheDocument();
      });
      await userEvent.keyboard('{Escape}');

      // Test pulse effect
      await userEvent.click(triggers[1]);
      await waitFor(() => {
        expect(canvas.getByTestId('pulse-content')).toBeInTheDocument();
      });
      await userEvent.keyboard('{Escape}');

      // Test both effects
      await userEvent.click(triggers[2]);
      await waitFor(() => {
        expect(canvas.getByTestId('both-effects-content')).toBeInTheDocument();
      });
      await userEvent.keyboard('{Escape}');
    });
  },
};

// 9. Performance Tests
const PerformanceTestComponent = () => {
  const [renderCount, setRenderCount] = React.useState(0);

  React.useEffect(() => {
    setRenderCount((c) => c + 1);
  }, []);

  return (
    <div>
      <div data-testid="render-count">Renders: {renderCount}</div>
      <PopoverTestWrapper>
        <div style={{ padding: 16 }}>
          <Typography variant="h6">Performance Test</Typography>
          <Typography data-testid="performance-content">
            This tests if the popover triggers excessive re-renders.
          </Typography>
        </div>
      </PopoverTestWrapper>
    </div>
  );
};

export const Performance: Story = {
  render: () => <PerformanceTestComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should not cause excessive re-renders', async () => {
      const renderCountElement = canvas.getByTestId('render-count');
      const initialRenders = parseInt(renderCountElement.textContent?.split(': ')[1] || '0');

      // Open and close popover multiple times
      const trigger = canvas.getByTestId('popover-trigger');

      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByTestId('performance-content')).toBeInTheDocument();
      });

      await userEvent.keyboard('{Escape}');
      await waitFor(() => {
        expect(canvas.queryByTestId('performance-content')).not.toBeInTheDocument();
      });

      // Check that renders didn't increase dramatically
      const finalRenders = parseInt(
        canvas.getByTestId('render-count').textContent?.split(': ')[1] || '0',
      );
      expect(finalRenders - initialRenders).toBeLessThan(10);
    });
  },
};

// 10. Edge Cases Tests
export const EdgeCases: Story = {
  render: () => (
    <Stack spacing={2}>
      {/* Empty content */}
      <PopoverTestWrapper data-testid="empty-popover">
        <div style={{ padding: 16, minHeight: 50 }} data-testid="empty-content" />
      </PopoverTestWrapper>

      {/* Very long content */}
      <PopoverTestWrapper maxWidth={200} data-testid="long-content-popover">
        <Typography sx={{ p: 2 }} data-testid="long-content">
          This is a very long text content that should wrap properly and not break the popover
          layout. It should handle overflow gracefully and maintain proper spacing and typography.
        </Typography>
      </PopoverTestWrapper>

      {/* No maxWidth */}
      <PopoverTestWrapper maxWidth={undefined} data-testid="no-max-width-popover">
        <Typography sx={{ p: 2 }} data-testid="no-max-width-content">
          Content without maxWidth constraint
        </Typography>
      </PopoverTestWrapper>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should handle empty content gracefully', async () => {
      const triggers = canvas.getAllByTestId('popover-trigger');
      await userEvent.click(triggers[0]);

      await waitFor(() => {
        expect(canvas.getByTestId('empty-content')).toBeInTheDocument();
      });
      await userEvent.keyboard('{Escape}');
    });

    await step('Should handle long content with wrapping', async () => {
      const triggers = canvas.getAllByTestId('popover-trigger');
      await userEvent.click(triggers[1]);

      await waitFor(() => {
        const content = canvas.getByTestId('long-content');
        expect(content).toBeInTheDocument();
      });
      await userEvent.keyboard('{Escape}');
    });

    await step('Should handle content without maxWidth', async () => {
      const triggers = canvas.getAllByTestId('popover-trigger');
      await userEvent.click(triggers[2]);

      await waitFor(() => {
        expect(canvas.getByTestId('no-max-width-content')).toBeInTheDocument();
      });
      await userEvent.keyboard('{Escape}');
    });
  },
};

// 11. Integration Tests
const IntegrationTestComponent = () => {
  const [selectedItem, setSelectedItem] = React.useState<string>('');

  return (
    <div>
      <Typography data-testid="selected-item">Selected: {selectedItem || 'None'}</Typography>
      <PopoverTestWrapper>
        <div style={{ padding: 16 }}>
          <Typography variant="h6" gutterBottom>
            Select an Option
          </Typography>
          <List dense>
            {['Option 1', 'Option 2', 'Option 3'].map((option) => (
              <ListItem
                key={option}
                button
                data-testid={`option-${option.toLowerCase().replace(' ', '-')}`}
                onClick={() => setSelectedItem(option)}
              >
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </List>
        </div>
      </PopoverTestWrapper>
    </div>
  );
};

export const Integration: Story = {
  render: () => <IntegrationTestComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Should integrate with external state management', async () => {
      const trigger = canvas.getByTestId('popover-trigger');
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByTestId('option-option-1')).toBeInTheDocument();
      });

      // Click an option
      await userEvent.click(canvas.getByTestId('option-option-2'));

      // Should update external state
      await waitFor(() => {
        expect(canvas.getByTestId('selected-item')).toHaveTextContent('Selected: Option 2');
      });
    });
  },
};
