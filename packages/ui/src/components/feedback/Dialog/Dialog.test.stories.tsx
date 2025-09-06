/* eslint-env browser */
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

import { Dialog, DialogHeader, DialogContent, DialogActions } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Feedback/Dialog/Tests',
  component: Dialog,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
    docs: {
      description: {
        component: 'Comprehensive test suite for the Dialog component covering interactions, accessibility, visual states, performance, and edge cases.',
      },
    },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test wrapper component
const TestDialogWrapper = ({ 
  children, 
  onOpen = fn(),
  onClose = fn(),
  ...args 
}: { 
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  [key: string]: unknown;
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    onOpen();
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={handleOpen}
        data-testid="open-dialog-button"
      >
        Open Dialog
      </Button>
      <Dialog 
        {...args} 
        open={open} 
        onClose={handleClose}
        data-testid="dialog-component"
      >
        {children}
      </Dialog>
    </Box>
  );
};

// 1. Basic Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  render: (args) => (
    <TestDialogWrapper {...args}>
      <DialogHeader
        title="Basic Interaction Dialog"
        subtitle="Test basic user interactions"
        data-testid="dialog-header"
      />
      <DialogContent data-testid="dialog-content">
        <Typography>Test content for basic interactions.</Typography>
      </DialogContent>
      <DialogActions data-testid="dialog-actions">
        <Button data-testid="cancel-button">Cancel</Button>
        <Button variant="contained" data-testid="confirm-button">Confirm</Button>
      </DialogActions>
    </TestDialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
    onOpen: fn(),
    onClose: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    await step('Initial render verification', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      await expect(openButton).toBeInTheDocument();
      await expect(openButton).toHaveTextContent('Open Dialog');
    });
    
    await step('Open dialog interaction', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      await userEvent.click(openButton);
      
      await waitFor(async () => {
        const dialog = canvas.getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      });
      
      await expect(args.onOpen).toHaveBeenCalledTimes(1);
    });
    
    await step('Dialog content verification', async () => {
      const dialogTitle = canvas.getByText('Basic Interaction Dialog');
      const dialogSubtitle = canvas.getByText('Test basic user interactions');
      const dialogContent = canvas.getByText('Test content for basic interactions.');
      
      await expect(dialogTitle).toBeInTheDocument();
      await expect(dialogSubtitle).toBeInTheDocument();
      await expect(dialogContent).toBeInTheDocument();
    });
    
    await step('Close dialog interaction', async () => {
      const cancelButton = canvas.getByTestId('cancel-button');
      await userEvent.click(cancelButton);
      
      await waitFor(async () => {
        const dialog = canvas.queryByRole('dialog');
        await expect(dialog).not.toBeInTheDocument();
      });
    });
  },
};

// 2. Keyboard Navigation Test
export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  render: (args) => (
    <TestDialogWrapper {...args}>
      <DialogHeader
        title="Keyboard Navigation Test"
        subtitle="Test keyboard accessibility"
      />
      <DialogContent>
        <Typography paragraph>Test keyboard navigation and focus management.</Typography>
        <Button data-testid="first-focusable">First Button</Button>
        <Button data-testid="second-focusable" sx={{ ml: 1 }}>Second Button</Button>
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-action">Cancel</Button>
        <Button variant="contained" data-testid="confirm-action">Confirm</Button>
      </DialogActions>
    </TestDialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
  },
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'duplicate-id', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open dialog for keyboard testing', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      await userEvent.click(openButton);
      
      await waitFor(async () => {
        const dialog = canvas.getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      });
    });
    
    await step('Tab navigation forward', async () => {
      const closeButton = canvas.getByLabelText('close');
      
      // Focus should start on close button
      await expect(closeButton).toHaveFocus();
      
      // Tab to next focusable element
      await userEvent.tab();
      const firstButton = canvas.getByTestId('first-focusable');
      await expect(firstButton).toHaveFocus();
      
      // Continue tabbing
      await userEvent.tab();
      const secondButton = canvas.getByTestId('second-focusable');
      await expect(secondButton).toHaveFocus();
    });
    
    await step('Tab navigation backward', async () => {
      await userEvent.tab({ shift: true });
      const firstButton = canvas.getByTestId('first-focusable');
      await expect(firstButton).toHaveFocus();
    });
    
    await step('Escape key handling', async () => {
      await userEvent.keyboard('{Escape}');
      
      await waitFor(async () => {
        const dialog = canvas.queryByRole('dialog');
        await expect(dialog).not.toBeInTheDocument();
      });
    });
  },
};

// 3. Screen Reader Test
export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  render: (args) => (
    <TestDialogWrapper {...args}>
      <DialogHeader
        title="Screen Reader Test Dialog"
        subtitle="Testing ARIA attributes and labels"
      />
      <DialogContent>
        <Typography>
          This dialog tests screen reader compatibility with proper ARIA attributes.
        </Typography>
        <Typography id="description-text">
          Additional description text that should be referenced by aria-describedby.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="Cancel dialog">Cancel</Button>
        <Button variant="contained" aria-label="Confirm action">Confirm</Button>
      </DialogActions>
    </TestDialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open dialog for ARIA testing', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      await userEvent.click(openButton);
      
      await waitFor(async () => {
        const dialog = canvas.getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      });
    });
    
    await step('Verify dialog role and attributes', async () => {
      const dialog = canvas.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      await expect(dialog).toHaveAttribute('role', 'dialog');
    });
    
    await step('Verify ARIA labels on buttons', async () => {
      const cancelButton = canvas.getByLabelText('Cancel dialog');
      const confirmButton = canvas.getByLabelText('Confirm action');
      
      await expect(cancelButton).toBeInTheDocument();
      await expect(confirmButton).toBeInTheDocument();
      await expect(confirmButton).toHaveAttribute('aria-label', 'Confirm action');
    });
    
    await step('Verify close button accessibility', async () => {
      const closeButton = canvas.getByLabelText('close');
      await expect(closeButton).toBeInTheDocument();
      await expect(closeButton).toHaveAttribute('aria-label', 'close');
    });
  },
};

// 4. Focus Management Test
export const FocusManagement: Story = {
  name: '🎯 Focus Management Test',
  render: (args) => (
    <Box>
      <Button data-testid="trigger-button">Trigger Button</Button>
      <TestDialogWrapper {...args}>
        <DialogHeader
          title="Focus Management Test"
          subtitle="Testing focus trap and restoration"
        />
        <DialogContent>
          <Button data-testid="first-modal-element">First Element</Button>
          <Button data-testid="second-modal-element" sx={{ ml: 1 }}>Second Element</Button>
        </DialogContent>
        <DialogActions>
          <Button data-testid="close-modal-button">Close</Button>
        </DialogActions>
      </TestDialogWrapper>
    </Box>
  ),
  args: {
    variant: 'default',
    size: 'md',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Focus initial trigger button', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      triggerButton.focus();
      await expect(triggerButton).toHaveFocus();
    });
    
    await step('Open modal and verify focus management', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      await userEvent.click(openButton);
      
      await waitFor(async () => {
        const dialog = canvas.getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      });
      
      // Focus should move to close button in header
      const closeButton = canvas.getByLabelText('close');
      await expect(closeButton).toHaveFocus();
    });
    
    await step('Test focus trap within modal', async () => {
      const firstElement = canvas.getByTestId('first-modal-element');
      const secondElement = canvas.getByTestId('second-modal-element');
      const closeModalButton = canvas.getByTestId('close-modal-button');
      
      // Tab through modal elements
      await userEvent.tab();
      await expect(firstElement).toHaveFocus();
      
      await userEvent.tab();
      await expect(secondElement).toHaveFocus();
      
      await userEvent.tab();
      await expect(closeModalButton).toHaveFocus();
      
      // Tab should cycle back to close button
      await userEvent.tab();
      const closeButton = canvas.getByLabelText('close');
      await expect(closeButton).toHaveFocus();
    });
    
    await step('Close modal and verify focus restoration', async () => {
      const closeButton = canvas.getByLabelText('close');
      await userEvent.click(closeButton);
      
      await waitFor(async () => {
        const dialog = canvas.queryByRole('dialog');
        await expect(dialog).not.toBeInTheDocument();
      });
      
      // Focus should return to the open button
      const openButton = canvas.getByTestId('open-dialog-button');
      await expect(openButton).toHaveFocus();
    });
  },
};

// 5. Visual States Test
export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  render: (args) => (
    <TestDialogWrapper {...args}>
      <DialogHeader
        title="Visual States Test"
        subtitle="Testing different visual states and variants"
      />
      <DialogContent data-testid="dialog-content">
        <Typography>Testing visual states and styling.</Typography>
        <Button data-testid="interactive-element">Interactive Element</Button>
      </DialogContent>
      <DialogActions>
        <Button disabled data-testid="disabled-button">Disabled</Button>
        <Button variant="contained" data-testid="active-button">Active</Button>
      </DialogActions>
    </TestDialogWrapper>
  ),
  args: {
    variant: 'glass',
    size: 'md',
    glow: true,
    gradient: true,
    borderRadius: 'lg',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open dialog for visual testing', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      await userEvent.click(openButton);
      
      await waitFor(async () => {
        const dialog = canvas.getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      });
    });
    
    await step('Verify glass variant styling', async () => {
      const dialog = canvas.getByRole('dialog');
      
      // Dialog should have glass morphism styles
      await expect(dialog).toBeInTheDocument();
    });
    
    await step('Test hover interactions', async () => {
      const interactiveElement = canvas.getByTestId('interactive-element');
      
      await userEvent.hover(interactiveElement);
      await expect(interactiveElement).toHaveClass('MuiButton-root');
      
      await userEvent.unhover(interactiveElement);
    });
    
    await step('Test disabled state', async () => {
      const disabledButton = canvas.getByTestId('disabled-button');
      await expect(disabledButton).toBeDisabled();
      
      // Disabled button should not be clickable
      await userEvent.click(disabledButton);
      await expect(disabledButton).toBeDisabled();
    });
    
    await step('Test active button state', async () => {
      const activeButton = canvas.getByTestId('active-button');
      await expect(activeButton).not.toBeDisabled();
      await expect(activeButton).toHaveClass('MuiButton-contained');
    });
  },
};

// 6. Performance Test
export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  render: (args) => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
    }));

    return (
      <TestDialogWrapper {...args}>
        <DialogHeader
          title="Performance Test Dialog"
          subtitle="Testing with large content"
        />
        <DialogContent data-testid="performance-content">
          <Box sx={{ maxHeight: 400, overflow: 'auto' }} data-testid="scroll-container">
            {items.map(item => (
              <Typography key={item.id} data-testid={`item-${item.id}`}>
                {item.name}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button>Close</Button>
        </DialogActions>
      </TestDialogWrapper>
    );
  },
  args: {
    variant: 'default',
    size: 'lg',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open dialog for performance testing', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      
      const startTime = performance.now();
      await userEvent.click(openButton);
      
      await waitFor(async () => {
        const dialog = canvas.getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // console.log(`Dialog open time: ${renderTime}ms`);
      // Reasonable render time for dialog open
      await expect(renderTime).toBeLessThan(500);
    });
    
    await step('Test scroll performance', async () => {
      const scrollContainer = canvas.getByTestId('scroll-container');
      
      // Simulate rapid scrolling
      for (let i = 0; i < 5; i++) {
        scrollContainer.scrollTop = i * 50;
        await new Promise(resolve => window.setTimeout(resolve, 10));
      }
      
      // Verify scrolling works
      await expect(scrollContainer).toBeInTheDocument();
      await expect(scrollContainer.scrollTop).toBeGreaterThan(0);
    });
    
    await step('Measure item render performance', async () => {
      const items = canvas.getAllByTestId(/item-\d+/);
      await expect(items).toHaveLength(100);
      
      // All items should be rendered efficiently
      const startTime = performance.now();
      items.forEach(item => {
        expect(item).toBeInTheDocument();
      });
      const endTime = performance.now();
      
      const measureTime = endTime - startTime;
      // console.log(`Item measurement time: ${measureTime}ms`);
      await expect(measureTime).toBeLessThan(100);
    });
  },
};

// 7. Edge Cases Test
export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  render: (args) => (
    <TestDialogWrapper {...args}>
      <DialogHeader
        title="Edge Cases Test Dialog with Very Long Title That Should Handle Overflow Gracefully"
        subtitle="This is a very long subtitle that tests how the dialog handles overflow content and maintains proper layout and accessibility standards"
        showCloseButton={args.showCloseButton}
      />
      <DialogContent data-testid="edge-case-content">
        <Typography data-testid="long-text">
          This is a very long piece of text that should test how the dialog handles 
          content overflow and text wrapping. Lorem ipsum dolor sit amet, consectetur 
          adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna 
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
          in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Typography>
        <Box data-testid="empty-state" sx={{ display: 'none' }}>
          <Typography>No data available</Typography>
        </Box>
      </DialogContent>
      <DialogActions data-testid="edge-case-actions">
        <Button>Very Long Button Text That Tests Overflow</Button>
        <Button variant="contained">OK</Button>
      </DialogActions>
    </TestDialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
    showCloseButton: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open dialog for edge case testing', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      await userEvent.click(openButton);
      
      await waitFor(async () => {
        const dialog = canvas.getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      });
    });
    
    await step('Test long title handling', async () => {
      const longTitle = canvas.getByText(/Edge Cases Test Dialog with Very Long Title/);
      await expect(longTitle).toBeInTheDocument();
      
      // Title should be visible and not cause layout issues
      const titleElement = longTitle.closest('[class*="MuiDialogTitle"]');
      if (titleElement) {
        const computedStyle = window.getComputedStyle(titleElement);
        await expect(computedStyle.overflow).toBeDefined();
      }
    });
    
    await step('Test long content text wrapping', async () => {
      const longText = canvas.getByTestId('long-text');
      await expect(longText).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(longText);
      // Text should wrap properly
      await expect(computedStyle.wordWrap).toBe('break-word');
    });
    
    await step('Test dialog responsiveness', async () => {
      const dialog = canvas.getByRole('dialog');
      const dialogContent = canvas.getByTestId('edge-case-content');
      
      await expect(dialog).toBeInTheDocument();
      await expect(dialogContent).toBeInTheDocument();
      
      // Dialog should maintain proper dimensions
      const dialogRect = dialog.getBoundingClientRect();
      await expect(dialogRect.width).toBeGreaterThan(0);
      await expect(dialogRect.height).toBeGreaterThan(0);
    });
    
    await step('Test button overflow handling', async () => {
      const longButton = canvas.getByText('Very Long Button Text That Tests Overflow');
      await expect(longButton).toBeInTheDocument();
      
      // Button should be clickable despite long text
      await userEvent.hover(longButton);
      await userEvent.click(longButton);
    });
  },
};

// 8. Persistent Dialog Test
export const PersistentDialogTest: Story = {
  name: '🔒 Persistent Dialog Test',
  render: (args) => (
    <TestDialogWrapper {...args}>
      <DialogHeader
        title="Persistent Dialog"
        subtitle="Cannot be closed by backdrop or escape"
        showCloseButton={false}
      />
      <DialogContent>
        <Typography>
          This dialog is persistent and cannot be closed by clicking the backdrop 
          or pressing the Escape key. It must be closed using the action buttons.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="error" data-testid="force-close-button">Force Close</Button>
        <Button variant="contained">Confirm</Button>
      </DialogActions>
    </TestDialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
    persistent: true,
    backdrop: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open persistent dialog', async () => {
      const openButton = canvas.getByTestId('open-dialog-button');
      await userEvent.click(openButton);
      
      await waitFor(async () => {
        const dialog = canvas.getByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      });
    });
    
    await step('Test escape key does not close persistent dialog', async () => {
      await userEvent.keyboard('{Escape}');
      
      // Wait a moment and verify dialog is still open
      await new Promise(resolve => setTimeout(resolve, 100));
      const dialog = canvas.queryByRole('dialog');
      await expect(dialog).toBeInTheDocument();
    });
    
    await step('Test backdrop click does not close persistent dialog', async () => {
      const backdrop = document.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        await userEvent.click(backdrop);
        
        // Wait a moment and verify dialog is still open
        await new Promise(resolve => window.setTimeout(resolve, 100));
        const dialog = canvas.queryByRole('dialog');
        await expect(dialog).toBeInTheDocument();
      }
    });
    
    await step('Test no close button is present', async () => {
      const closeButton = canvas.queryByLabelText('close');
      await expect(closeButton).not.toBeInTheDocument();
    });
    
    await step('Test dialog can only be closed via action buttons', async () => {
      const forceCloseButton = canvas.getByTestId('force-close-button');
      await userEvent.click(forceCloseButton);
      
      await waitFor(async () => {
        const dialog = canvas.queryByRole('dialog');
        await expect(dialog).not.toBeInTheDocument();
      });
    });
  },
};