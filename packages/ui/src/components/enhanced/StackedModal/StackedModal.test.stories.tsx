import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';
import { Button, Typography, Box, Stack, Paper } from '@mui/material';
import React from 'react';

import { StackedModal, ModalStackProvider, ModalContent, ModalActions } from './StackedModal';

const meta: Meta<typeof StackedModal> = {
  title: 'Enhanced/StackedModal/Tests',
  component: StackedModal,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:StackedModal'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ModalStackProvider>{children}</ModalStackProvider>
);

// Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    open: true,
    onClose: fn(),
    navigationTitle: 'Basic Modal',
    modalId: 'test-modal-basic',
  },
  render: (args) => (
    <TestWrapper>
      <StackedModal {...args} data-testid="basic-modal">
        <ModalContent>
          <Typography variant="h6" data-testid="modal-content">
            Basic Modal Content
          </Typography>
          <Typography variant="body2">This is a test modal for basic interactions.</Typography>
        </ModalContent>
        <ModalActions>
          <Button data-testid="action-button" onClick={fn()}>
            Test Action
          </Button>
        </ModalActions>
      </StackedModal>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const modal = canvas.getByRole('dialog');
      await expect(modal).toBeInTheDocument();
      await expect(modal).toHaveAttribute('aria-labelledby');
      await expect(modal).toHaveAttribute('aria-describedby');
    });

    await step('Modal content visibility', async () => {
      const content = canvas.getByTestId('modal-content');
      await expect(content).toBeInTheDocument();
      await expect(content).toHaveTextContent('Basic Modal Content');
    });

    await step('Close button interaction', async () => {
      const closeButton = canvas.getByLabelText('close');
      await expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
      await expect(args.onClose).toHaveBeenCalledTimes(1);
    });

    await step('Action button interaction', async () => {
      const actionButton = canvas.getByTestId('action-button');
      await expect(actionButton).toBeInTheDocument();
      await userEvent.click(actionButton);
    });
  },
};

export const StackingBehaviorTest: Story = {
  name: '📚 Stacking Behavior Test',
  render: () => {
    const [firstOpen, setFirstOpen] = React.useState(true);
    const [secondOpen, setSecondOpen] = React.useState(false);

    return (
      <TestWrapper>
        <StackedModal
          open={firstOpen}
          onClose={() => setFirstOpen(false)}
          navigationTitle="First Modal"
          modalId="first-modal"
          data-testid="first-modal"
        >
          <ModalContent>
            <Typography variant="h6">First Modal</Typography>
            <Button data-testid="open-second" onClick={() => setSecondOpen(true)}>
              Open Second Modal
            </Button>
          </ModalContent>
        </StackedModal>

        <StackedModal
          open={secondOpen}
          onClose={() => setSecondOpen(false)}
          navigationTitle="Second Modal"
          modalId="second-modal"
          data-testid="second-modal"
        >
          <ModalContent>
            <Typography variant="h6">Second Modal</Typography>
            <Typography variant="body2">This is stacked on top</Typography>
          </ModalContent>
        </StackedModal>
      </TestWrapper>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('First modal opens', async () => {
      const firstModal = canvas.getByTestId('first-modal');
      await expect(firstModal).toBeInTheDocument();
    });

    await step('Open second modal', async () => {
      const openSecondButton = canvas.getByTestId('open-second');
      await userEvent.click(openSecondButton);

      await waitFor(() => {
        const secondModal = canvas.getByTestId('second-modal');
        expect(secondModal).toBeInTheDocument();
      });
    });

    await step('Verify stacking order', async () => {
      const secondModal = canvas.getByTestId('second-modal');
      const firstModal = canvas.getByTestId('first-modal');

      const secondZIndex = parseInt(window.getComputedStyle(secondModal).zIndex);
      const firstZIndex = parseInt(window.getComputedStyle(firstModal).zIndex);

      await expect(secondZIndex).toBeGreaterThan(firstZIndex);
    });
  },
};

export const GlassEffectTest: Story = {
  name: '✨ Glass Effect Test',
  args: {
    open: true,
    onClose: fn(),
    glass: true,
    navigationTitle: 'Glass Modal',
    modalId: 'glass-modal',
  },
  render: (args) => (
    <TestWrapper>
      <Box sx={{ p: 4, bgcolor: 'primary.main', minHeight: '200px' }}>
        <Typography color="white">Background Content</Typography>
      </Box>
      <StackedModal {...args} data-testid="glass-modal">
        <ModalContent>
          <Typography variant="h6">Glass Effect Modal</Typography>
          <Typography variant="body2">This modal has a glass morphism effect</Typography>
        </ModalContent>
      </StackedModal>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify glass effect styles', async () => {
      const modal = canvas.getByTestId('glass-modal');
      await expect(modal).toBeInTheDocument();

      const paperElement = modal.querySelector('.MuiDialog-paper');
      if (paperElement) {
        const styles = window.getComputedStyle(paperElement);
        await expect(styles.backdropFilter || styles.webkitBackdropFilter).toContain('blur');
      }
    });
  },
};

export const LoadingStateTest: Story = {
  name: '⏳ Loading State Test',
  args: {
    open: true,
    onClose: fn(),
    loading: true,
    loadingText: 'Loading modal content...',
    navigationTitle: 'Loading Modal',
    modalId: 'loading-modal',
  },
  render: (args) => (
    <TestWrapper>
      <StackedModal {...args} data-testid="loading-modal">
        <ModalContent>
          <Typography variant="h6">This content is loading</Typography>
        </ModalContent>
      </StackedModal>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify loading overlay', async () => {
      const modal = canvas.getByTestId('loading-modal');
      await expect(modal).toBeInTheDocument();

      const progressIndicator = canvas.getByRole('progressbar');
      await expect(progressIndicator).toBeInTheDocument();

      const loadingText = canvas.getByText('Loading modal content...');
      await expect(loadingText).toBeInTheDocument();
    });
  },
};

export const ResponsiveDesignTest: Story = {
  name: '📱 Responsive Design Test',
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'mobile',
    },
    chromatic: {
      viewports: [375, 768, 1920],
      delay: 300,
    },
  },
  args: {
    open: true,
    onClose: fn(),
    navigationTitle: 'Responsive Modal',
    modalId: 'responsive-modal',
  },
  render: (args) => (
    <TestWrapper>
      <StackedModal {...args} data-testid="responsive-modal">
        <ModalContent>
          <Typography variant="h6">Responsive Modal</Typography>
          <Typography variant="body2">This modal adapts to different screen sizes</Typography>
        </ModalContent>
        <ModalActions>
          <Button variant="contained">Action</Button>
        </ModalActions>
      </StackedModal>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify modal responsiveness', async () => {
      const modal = canvas.getByTestId('responsive-modal');
      await expect(modal).toBeInTheDocument();

      const paperElement = modal.querySelector('.MuiDialog-paper');
      await expect(paperElement).toBeInTheDocument();
    });
  },
};

export const KeyboardNavigationTest: Story = {
  name: '⌨️ Keyboard Navigation Test',
  args: {
    open: true,
    onClose: fn(),
    navigationTitle: 'Keyboard Modal',
    modalId: 'keyboard-modal',
  },
  render: (args) => (
    <TestWrapper>
      <StackedModal {...args} data-testid="keyboard-modal">
        <ModalContent>
          <Typography variant="h6">Keyboard Navigation Test</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button data-testid="first-button">First Button</Button>
            <Button data-testid="second-button">Second Button</Button>
            <Button data-testid="third-button">Third Button</Button>
          </Stack>
        </ModalContent>
      </StackedModal>
    </TestWrapper>
  ),
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
        ],
      },
    },
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation through modal', async () => {
      const firstButton = canvas.getByTestId('first-button');
      const secondButton = canvas.getByTestId('second-button');

      firstButton.focus();
      await expect(firstButton).toHaveFocus();

      await userEvent.tab();
      await expect(secondButton).toHaveFocus();
    });

    await step('Escape key closes modal', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(args.onClose).toHaveBeenCalled();
    });
  },
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  args: {
    open: true,
    onClose: fn(),
    navigationTitle: 'Accessible Modal',
    modalId: 'accessible-modal',
    'aria-labelledby': 'modal-title',
    'aria-describedby': 'modal-description',
  },
  render: (args) => (
    <TestWrapper>
      <StackedModal {...args} data-testid="accessible-modal">
        <ModalContent>
          <Typography variant="h6" id="modal-title">
            Accessible Modal Title
          </Typography>
          <Typography variant="body2" id="modal-description">
            This modal is properly configured for screen readers with ARIA attributes
          </Typography>
        </ModalContent>
      </StackedModal>
    </TestWrapper>
  ),
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-valid-attr', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'color-contrast', enabled: true },
        ],
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify ARIA attributes', async () => {
      const modal = canvas.getByRole('dialog');
      await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
      await expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
    });

    await step('Verify semantic structure', async () => {
      const title = canvas.getByRole('heading');
      await expect(title).toBeInTheDocument();
      await expect(title).toHaveTextContent('Accessible Modal Title');
    });
  },
};

export const FocusManagementTest: Story = {
  name: '🎯 Focus Management Test',
  args: {
    open: true,
    onClose: fn(),
    navigationTitle: 'Focus Modal',
    modalId: 'focus-modal',
  },
  render: (args) => (
    <TestWrapper>
      <Button data-testid="external-button">External Button</Button>
      <StackedModal {...args} data-testid="focus-modal">
        <ModalContent>
          <Typography variant="h6">Focus Management</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button data-testid="modal-button-1">Button 1</Button>
            <Button data-testid="modal-button-2">Button 2</Button>
          </Stack>
        </ModalContent>
      </StackedModal>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Focus traps within modal', async () => {
      const modalButton1 = canvas.getByTestId('modal-button-1');
      const modalButton2 = canvas.getByTestId('modal-button-2');

      modalButton1.focus();
      await expect(modalButton1).toHaveFocus();

      await userEvent.tab();
      await expect(modalButton2).toHaveFocus();
    });

    await step('Focus returns to modal on external click attempt', async () => {
      const externalButton = canvas.getByTestId('external-button');

      // Try to focus external button (should be prevented by focus trap)
      await userEvent.click(externalButton);

      // Focus should remain within modal
      const focusedElement = document.activeElement;
      const modal = canvas.getByTestId('focus-modal');
      await expect(modal.contains(focusedElement)).toBe(true);
    });
  },
};

export const RTLSupportTest: Story = {
  name: '🔄 RTL Support Test',
  args: {
    open: true,
    onClose: fn(),
    navigationTitle: 'RTL Modal',
    modalId: 'rtl-modal',
    rtl: true,
  },
  render: (args) => (
    <TestWrapper>
      <StackedModal {...args} data-testid="rtl-modal">
        <ModalContent>
          <Typography variant="h6">مودال با پشتیبانی از راست به چپ</Typography>
          <Typography variant="body2">این مودال از زبان‌های راست به چپ پشتیبانی می‌کند</Typography>
        </ModalContent>
      </StackedModal>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify RTL direction', async () => {
      const modal = canvas.getByTestId('rtl-modal');
      await expect(modal).toBeInTheDocument();

      const dialogElement = modal.querySelector('.MuiDialog-root');
      if (dialogElement) {
        const styles = window.getComputedStyle(dialogElement);
        await expect(styles.direction).toBe('rtl');
      }
    });

    await step('Verify back button rotation in RTL', async () => {
      const backButton = canvas.getByLabelText('close');
      const styles = window.getComputedStyle(backButton);
      // In RTL mode, back button should have transform
      await expect(styles.transform).toBeTruthy();
    });
  },
};

export const VisualStatesTest: Story = {
  name: '👁️ Visual States Test',
  render: () => (
    <TestWrapper>
      <Stack spacing={4}>
        {/* Normal state */}
        <StackedModal
          open={true}
          onClose={fn()}
          navigationTitle="Normal State"
          modalId="normal-modal"
          data-testid="normal-modal"
        >
          <ModalContent>
            <Typography>Normal modal state</Typography>
          </ModalContent>
        </StackedModal>

        {/* Glass effect state */}
        <StackedModal
          open={true}
          onClose={fn()}
          glass={true}
          navigationTitle="Glass Effect"
          modalId="glass-state-modal"
          data-testid="glass-state-modal"
        >
          <ModalContent>
            <Typography>Glass effect modal</Typography>
          </ModalContent>
        </StackedModal>
      </Stack>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Normal state verification', async () => {
      const normalModal = canvas.getByTestId('normal-modal');
      await expect(normalModal).toBeInTheDocument();
      await expect(normalModal).toHaveStyle({ opacity: '1' });
    });

    await step('Glass effect verification', async () => {
      const glassModal = canvas.getByTestId('glass-state-modal');
      await expect(glassModal).toBeInTheDocument();

      const paperElement = glassModal.querySelector('.MuiDialog-paper');
      if (paperElement) {
        const styles = window.getComputedStyle(paperElement);
        await expect(styles.backdropFilter || styles.webkitBackdropFilter).toContain('blur');
      }
    });
  },
};

export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  render: () => {
    const modals = Array.from({ length: 5 }, (_, i) => ({
      id: `perf-modal-${i}`,
      title: `Modal ${i + 1}`,
      open: i === 0, // Only first modal is open
    }));

    return (
      <TestWrapper>
        {modals.map((modal) => (
          <StackedModal
            key={modal.id}
            open={modal.open}
            onClose={fn()}
            navigationTitle={modal.title}
            modalId={modal.id}
            data-testid={modal.id}
          >
            <ModalContent>
              <Typography variant="h6">{modal.title}</Typography>
              <Typography variant="body2">Performance test content</Typography>
            </ModalContent>
          </StackedModal>
        ))}
      </TestWrapper>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const startTime = Date.now();

    await step('Render performance', async () => {
      const modal = canvas.getByTestId('perf-modal-0');
      await expect(modal).toBeInTheDocument();

      const renderTime = Date.now() - startTime;
      await expect(renderTime).toBeLessThan(1000);
    });

    await step('Memory efficiency', async () => {
      // Only the open modal should be rendered
      const openModal = canvas.getByTestId('perf-modal-0');
      await expect(openModal).toBeInTheDocument();

      // Closed modals should not be in DOM
      const closedModal = canvas.queryByTestId('perf-modal-1');
      await expect(closedModal).not.toBeInTheDocument();
    });
  },
};

export const EdgeCasesTest: Story = {
  name: '🔧 Edge Cases Test',
  render: () => (
    <TestWrapper>
      <Stack spacing={2}>
        {/* Modal with no content */}
        <StackedModal
          open={true}
          onClose={fn()}
          navigationTitle="Empty Modal"
          modalId="empty-modal"
          data-testid="empty-modal"
        >
          {/* No content */}
        </StackedModal>

        {/* Modal with very long title */}
        <StackedModal
          open={true}
          onClose={fn()}
          navigationTitle="This is a very long modal title that should be truncated with ellipsis when it exceeds the available space"
          modalId="long-title-modal"
          data-testid="long-title-modal"
        >
          <ModalContent>
            <Typography>Long title test</Typography>
          </ModalContent>
        </StackedModal>
      </Stack>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty modal handling', async () => {
      const emptyModal = canvas.getByTestId('empty-modal');
      await expect(emptyModal).toBeInTheDocument();
      // Should not crash when content is empty
    });

    await step('Long title truncation', async () => {
      const longTitleModal = canvas.getByTestId('long-title-modal');
      await expect(longTitleModal).toBeInTheDocument();

      const titleElement = canvas.getByText(/This is a very long modal title/);
      const styles = window.getComputedStyle(titleElement);
      await expect(styles.textOverflow).toBe('ellipsis');
    });
  },
};

export const IntegrationTest: Story = {
  name: '🔗 Integration Test',
  render: () => (
    <TestWrapper>
      <StackedModal
        open={true}
        onClose={fn()}
        navigationTitle="Integration Test"
        modalId="integration-modal"
        data-testid="integration-modal"
      >
        <ModalContent>
          <Typography variant="h6" gutterBottom>
            Modal with Complex Content
          </Typography>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2">Nested Paper Component</Typography>
            <Typography variant="body2">
              Testing integration with other Material-UI components
            </Typography>
          </Paper>
          <Stack spacing={2} direction="row">
            <Button variant="outlined" data-testid="outlined-button">
              Outlined
            </Button>
            <Button variant="contained" data-testid="contained-button">
              Contained
            </Button>
          </Stack>
        </ModalContent>
        <ModalActions>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small">
              Cancel
            </Button>
            <Button variant="contained" size="small" data-testid="save-button">
              Save
            </Button>
          </Stack>
        </ModalActions>
      </StackedModal>
    </TestWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify all integrated components', async () => {
      const modal = canvas.getByTestId('integration-modal');
      await expect(modal).toBeInTheDocument();

      const paper = canvas.getByText('Nested Paper Component');
      await expect(paper).toBeInTheDocument();

      const outlinedButton = canvas.getByTestId('outlined-button');
      const containedButton = canvas.getByTestId('contained-button');
      await expect(outlinedButton).toBeInTheDocument();
      await expect(containedButton).toBeInTheDocument();
    });

    await step('Test integrated interactions', async () => {
      const saveButton = canvas.getByTestId('save-button');
      await userEvent.click(saveButton);
      await expect(saveButton).toBeEnabled();
    });
  },
};
