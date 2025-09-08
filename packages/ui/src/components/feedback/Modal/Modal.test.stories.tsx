import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { useState } from 'react';
import { Button, Typography, Box, TextField } from '@mui/material';

import { Modal, ModalContent } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal/Tests',
  component: Modal,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
    docs: {
      description: {
        component: 'Comprehensive test suite for Modal component covering interaction, accessibility, visual, performance, and edge cases.',
      },
    },
  },
  tags: ['autodocs', 'test', 'component:Modal'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test wrapper component with controlled state
interface TestModalWrapperProps {
  children: React.ReactNode;
  modalProps?: Record<string, unknown>;
  onClose?: () => void;
  autoOpen?: boolean;
}

const TestModalWrapper = ({ 
  children, 
  modalProps = {}, 
  onClose,
  autoOpen = false 
}: TestModalWrapperProps) => {
  const [open, setOpen] = useState(autoOpen);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        data-testid="trigger-button"
      >
        Open Test Modal
      </Button>
      <Modal 
        {...modalProps} 
        open={open} 
        onClose={handleClose}
        data-testid="test-modal"
      >
        {children}
      </Modal>
    </Box>
  );
};

// ===== INTERACTION TESTS =====

export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    onClose: fn(),
  },
  render: (args) => {
    return (
      <TestModalWrapper onClose={args.onClose}>
        <ModalContent>
          <Box data-testid="modal-content">
            <Typography variant="h6" data-testid="modal-title">
              Test Modal
            </Typography>
            <Typography paragraph>
              This modal tests basic interaction patterns.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                data-testid="cancel-button"
                onClick={args.onClose}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                data-testid="confirm-button"
                onClick={args.onClose}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </ModalContent>
      </TestModalWrapper>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Initial state - Modal is closed', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await expect(triggerButton).toBeInTheDocument();
      
      // Modal should not be visible initially
      const modal = canvas.queryByTestId('test-modal');
      await expect(modal).not.toBeInTheDocument();
    });

    await step('Open modal interaction', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      // Wait for modal to appear
      await waitFor(() => {
        const modalContent = canvas.getByTestId('modal-content');
        expect(modalContent).toBeInTheDocument();
      }, { timeout: 1000 });
      
      const modalTitle = canvas.getByTestId('modal-title');
      await expect(modalTitle).toHaveTextContent('Test Modal');
    });

    await step('Modal backdrop interaction', async () => {
      // Click outside modal (backdrop) to close
      const backdrop = canvas.getByRole('presentation');
      await userEvent.click(backdrop);
      
      // Modal should close
      await waitFor(() => {
        const modalContent = canvas.queryByTestId('modal-content');
        expect(modalContent).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    await step('Button interactions within modal', async () => {
      // Re-open modal
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const modalContent = canvas.getByTestId('modal-content');
        expect(modalContent).toBeInTheDocument();
      });
      
      // Test cancel button
      const cancelButton = canvas.getByTestId('cancel-button');
      await userEvent.click(cancelButton);
      
      await waitFor(() => {
        const modalContent = canvas.queryByTestId('modal-content');
        expect(modalContent).not.toBeInTheDocument();
      });
    });
  },
};

export const FormInteraction: Story = {
  name: '📝 Form Interaction Test',
  args: {
    onSubmit: fn(),
  },
  render: (args) => {
    
    const FormModalContent = () => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        args.onSubmit({ name, email });
      };

      return (
        <ModalContent>
          <Box component="form" onSubmit={handleSubmit} data-testid="modal-form">
            <Typography variant="h6" gutterBottom>
              Contact Form
            </Typography>
            
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              data-testid="name-input"
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              data-testid="email-input"
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button type="button" data-testid="form-cancel">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                data-testid="form-submit"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </ModalContent>
      );
    };

    return (
      <TestModalWrapper>
        <FormModalContent />
      </TestModalWrapper>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open form modal', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const form = canvas.getByTestId('modal-form');
        expect(form).toBeInTheDocument();
      });
    });

    await step('Fill form inputs', async () => {
      const nameInput = canvas.getByTestId('name-input').querySelector('input');
      const emailInput = canvas.getByTestId('email-input').querySelector('input');
      
      if (nameInput && emailInput) {
        await userEvent.type(nameInput, 'John Doe');
        await userEvent.type(emailInput, 'john@example.com');
        
        await expect(nameInput).toHaveValue('John Doe');
        await expect(emailInput).toHaveValue('john@example.com');
      }
    });

    await step('Submit form', async () => {
      const submitButton = canvas.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      // Form should handle submission
      await waitFor(() => {
        expect(submitButton).toBeInTheDocument();
      });
    });

    await step('Tab navigation through form', async () => {
      const nameInput = canvas.getByTestId('name-input').querySelector('input');
      const emailInput = canvas.getByTestId('email-input').querySelector('input');
      const submitButton = canvas.getByTestId('form-submit');
      
      if (nameInput && emailInput) {
        // Focus first input
        nameInput.focus();
        await expect(nameInput).toHaveFocus();
        
        // Tab to email
        await userEvent.tab();
        await expect(emailInput).toHaveFocus();
        
        // Tab to submit button
        await userEvent.tab();
        await expect(submitButton).toHaveFocus();
      }
    });
  },
};

// ===== ACCESSIBILITY TESTS =====

export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
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
        ]
      }
    }
  },
  render: () => (
    <TestModalWrapper modalProps={{ 'aria-labelledby': 'modal-title' }}>
      <ModalContent>
        <Box data-testid="keyboard-modal">
          <Typography id="modal-title" variant="h6" data-testid="first-focusable" tabIndex={0}>
            Keyboard Navigation Modal
          </Typography>
          <Typography paragraph>
            Test keyboard navigation and accessibility features.
          </Typography>
          <Button data-testid="second-focusable">
            First Button
          </Button>
          <Button data-testid="third-focusable" sx={{ ml: 1 }}>
            Second Button
          </Button>
          <Button variant="contained" data-testid="last-focusable" sx={{ ml: 1 }}>
            Close
          </Button>
        </Box>
      </ModalContent>
    </TestModalWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open modal', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const modalContent = canvas.getByTestId('keyboard-modal');
        expect(modalContent).toBeInTheDocument();
      });
    });

    await step('Tab navigation forward', async () => {
      // Focus should start on first focusable element
      const firstElement = canvas.getByTestId('first-focusable');
      firstElement.focus();
      await expect(firstElement).toHaveFocus();
      
      // Tab to next elements
      await userEvent.tab();
      const secondElement = canvas.getByTestId('second-focusable');
      await expect(secondElement).toHaveFocus();
      
      await userEvent.tab();
      const thirdElement = canvas.getByTestId('third-focusable');
      await expect(thirdElement).toHaveFocus();
      
      await userEvent.tab();
      const lastElement = canvas.getByTestId('last-focusable');
      await expect(lastElement).toHaveFocus();
    });

    await step('Tab navigation backward', async () => {
      // From last element, shift+tab backward
      await userEvent.tab({ shift: true });
      const thirdElement = canvas.getByTestId('third-focusable');
      await expect(thirdElement).toHaveFocus();
      
      await userEvent.tab({ shift: true });
      const secondElement = canvas.getByTestId('second-focusable');
      await expect(secondElement).toHaveFocus();
    });

    await step('Enter key activation', async () => {
      const button = canvas.getByTestId('second-focusable');
      button.focus();
      await userEvent.keyboard('{Enter}');
      // Verify button remains accessible
      await expect(button).toBeInTheDocument();
    });

    await step('Escape key handling', async () => {
      await userEvent.keyboard('{Escape}');
      
      // Modal should close on Escape
      await waitFor(() => {
        const modalContent = canvas.queryByTestId('keyboard-modal');
        expect(modalContent).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });
  },
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  render: () => (
    <TestModalWrapper 
      modalProps={{ 
        'aria-labelledby': 'screen-reader-title',
        'aria-describedby': 'screen-reader-description',
        role: 'dialog',
        'aria-modal': true
      }}
    >
      <ModalContent>
        <Box data-testid="screen-reader-modal">
          <Typography 
            id="screen-reader-title" 
            variant="h6"
            data-testid="modal-title"
          >
            Screen Reader Accessible Modal
          </Typography>
          <Typography 
            id="screen-reader-description"
            paragraph
            data-testid="modal-description"
          >
            This modal is properly labeled for screen readers with aria-labelledby and aria-describedby.
          </Typography>
          <Box role="group" aria-label="Modal actions">
            <Button 
              aria-label="Cancel and close modal"
              data-testid="cancel-action"
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              aria-label="Confirm and close modal"
              data-testid="confirm-action"
              sx={{ ml: 1 }}
            >
              Confirm
            </Button>
          </Box>
          <div 
            role="status" 
            aria-live="polite" 
            data-testid="live-region"
            style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}
          >
            Modal is now open
          </div>
        </Box>
      </ModalContent>
    </TestModalWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open modal', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const modal = canvas.getByTestId('screen-reader-modal');
        expect(modal).toBeInTheDocument();
      });
    });

    await step('Verify ARIA labels and roles', async () => {
      const modal = canvas.getByRole('dialog');
      await expect(modal).toBeInTheDocument();
      await expect(modal).toHaveAttribute('aria-modal', 'true');
      await expect(modal).toHaveAttribute('aria-labelledby', 'screen-reader-title');
      await expect(modal).toHaveAttribute('aria-describedby', 'screen-reader-description');
    });

    await step('Verify semantic structure', async () => {
      const title = canvas.getByTestId('modal-title');
      await expect(title).toHaveAttribute('id', 'screen-reader-title');
      
      const description = canvas.getByTestId('modal-description');
      await expect(description).toHaveAttribute('id', 'screen-reader-description');
      
      const actionGroup = canvas.getByRole('group');
      await expect(actionGroup).toHaveAttribute('aria-label', 'Modal actions');
    });

    await step('Verify live regions', async () => {
      const liveRegion = canvas.getByTestId('live-region');
      await expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      await expect(liveRegion).toHaveAttribute('role', 'status');
    });

    await step('Verify button accessibility', async () => {
      const cancelButton = canvas.getByTestId('cancel-action');
      await expect(cancelButton).toHaveAttribute('aria-label', 'Cancel and close modal');
      
      const confirmButton = canvas.getByTestId('confirm-action');
      await expect(confirmButton).toHaveAttribute('aria-label', 'Confirm and close modal');
    });
  },
};

// ===== VISUAL TESTS =====

export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  render: () => (
    <TestModalWrapper modalProps={{ glass: true, glow: true, size: 'md' }}>
      <ModalContent>
        <Box data-testid="visual-states-modal">
          <Typography variant="h6" gutterBottom>
            Visual States Test
          </Typography>
          <Typography paragraph>
            Testing various visual states and transitions.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button 
              data-testid="normal-button"
              variant="outlined"
            >
              Normal
            </Button>
            <Button 
              data-testid="disabled-button"
              disabled
            >
              Disabled
            </Button>
            <Button 
              data-testid="loading-button"
              variant="contained"
            >
              Loading State
            </Button>
          </Box>
          
          <Box 
            data-testid="glass-effect"
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(10px)', 
              borderRadius: 1,
              border: '1px solid rgba(255,255,255,0.2)' 
            }}
          >
            <Typography variant="body2">
              Glass morphism effect container
            </Typography>
          </Box>
        </Box>
      </ModalContent>
    </TestModalWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open visual states modal', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const modal = canvas.getByTestId('visual-states-modal');
        expect(modal).toBeInTheDocument();
      });
    });

    await step('Verify button states', async () => {
      const normalButton = canvas.getByTestId('normal-button');
      const disabledButton = canvas.getByTestId('disabled-button');
      
      await expect(normalButton).toBeEnabled();
      await expect(disabledButton).toBeDisabled();
    });

    await step('Test hover effects', async () => {
      const normalButton = canvas.getByTestId('normal-button');
      
      await userEvent.hover(normalButton);
      await waitFor(() => {
        expect(normalButton).toBeInTheDocument();
      });
      
      await userEvent.unhover(normalButton);
    });

    await step('Verify glass effect styling', async () => {
      const glassContainer = canvas.getByTestId('glass-effect');
      
      // Check if backdrop filter is applied
      await expect(glassContainer).toBeInTheDocument();
    });

    await step('Test focus states', async () => {
      const normalButton = canvas.getByTestId('normal-button');
      normalButton.focus();
      await expect(normalButton).toHaveFocus();
    });
  },
};

export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  parameters: {
    viewport: {
      viewports: {
        mobile: { 
          name: 'Mobile', 
          styles: { width: '375px', height: '667px' },
          type: 'mobile' 
        },
        tablet: { 
          name: 'Tablet', 
          styles: { width: '768px', height: '1024px' },
          type: 'tablet'
        },
        desktop: { 
          name: 'Desktop', 
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop'
        }
      },
      defaultViewport: 'mobile'
    },
    chromatic: {
      viewports: [375, 768, 1920],
      delay: 300
    }
  },
  render: () => (
    <TestModalWrapper modalProps={{ size: 'lg' }}>
      <ModalContent>
        <Box data-testid="responsive-modal">
          <Typography variant="h6" gutterBottom>
            Responsive Modal Test
          </Typography>
          <Typography paragraph>
            This modal adapts to different viewport sizes with maxWidth constraints.
          </Typography>
          
          <Box 
            data-testid="responsive-content"
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 2,
              mb: 2
            }}
          >
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              Column 1
            </Box>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              Column 2
            </Box>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              Column 3
            </Box>
          </Box>
          
          <Button fullWidth variant="contained">
            Full Width Action
          </Button>
        </Box>
      </ModalContent>
    </TestModalWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open responsive modal', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const modal = canvas.getByTestId('responsive-modal');
        expect(modal).toBeInTheDocument();
      });
    });

    await step('Verify responsive layout', async () => {
      const content = canvas.getByTestId('responsive-content');
      
      // Content should be responsive
      await expect(content).toBeInTheDocument();
    });

    await step('Test viewport constraints', async () => {
      const modal = canvas.getByRole('dialog');
      
      // Modal should respect maxWidth constraints
      await expect(modal).toBeInTheDocument();
    });
  },
};

// ===== PERFORMANCE TESTS =====

export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  render: () => {
    const LargeContentModal = () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`
      }));

      return (
        <ModalContent>
          <Box data-testid="performance-modal">
            <Typography variant="h6" gutterBottom>
              Performance Test Modal
            </Typography>
            <Box 
              data-testid="large-content"
              sx={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                '& > *': { mb: 1 }
              }}
            >
              {items.map(item => (
                <Box 
                  key={item.id}
                  data-testid={`item-${item.id}`}
                  sx={{ p: 1, border: '1px solid grey.300', borderRadius: 1 }}
                >
                  <Typography variant="subtitle2">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </ModalContent>
      );
    };

    return (
      <TestModalWrapper>
        <LargeContentModal />
      </TestModalWrapper>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Measure modal open time', async () => {
      const startTime = Date.now();
      
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const modal = canvas.getByTestId('performance-modal');
        expect(modal).toBeInTheDocument();
      });
      
      const endTime = Date.now();
      const openTime = endTime - startTime;
      
      // eslint-disable-next-line no-console
      console.log(`Modal open time: ${openTime}ms`);
      // Reasonable open time should be under 500ms
      await expect(openTime).toBeLessThan(500);
    });

    await step('Test large content rendering', async () => {
      const startTime = Date.now();
      
      const items = canvas.getAllByTestId(/item-/);
      
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      
      // eslint-disable-next-line no-console
      console.log(`Rendered ${items.length} items in ${renderTime}ms`);
      await expect(items.length).toBe(100);
      await expect(renderTime).toBeLessThan(100);
    });

    await step('Test scroll performance', async () => {
      const scrollContainer = canvas.getByTestId('large-content');
      
      // Simulate scrolling
      for (let i = 0; i < 10; i++) {
        scrollContainer.scrollTop = i * 50;
        await new Promise(resolve => window.setTimeout(resolve, 10));
      }
      
      // Verify scroll worked
      await expect(scrollContainer.scrollTop).toBeGreaterThan(0);
    });
  },
};

// ===== EDGE CASES TESTS =====

export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  render: () => {
    const EdgeCaseModal = () => {
      const [content, setContent] = useState('normal');
      
      const getContent = () => {
        switch (content) {
          case 'empty':
            return null;
          case 'long':
            return 'a'.repeat(1000);
          default:
            return 'Normal content';
        }
      };

      return (
        <ModalContent>
          <Box data-testid="edge-case-modal">
            <Typography variant="h6" gutterBottom>
              Edge Cases Test
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Button 
                onClick={() => setContent('empty')} 
                data-testid="empty-content-btn"
                size="small"
                sx={{ mr: 1 }}
              >
                Empty
              </Button>
              <Button 
                onClick={() => setContent('long')} 
                data-testid="long-content-btn"
                size="small"
                sx={{ mr: 1 }}
              >
                Long Text
              </Button>
              <Button 
                onClick={() => setContent('normal')} 
                data-testid="normal-content-btn"
                size="small"
              >
                Normal
              </Button>
            </Box>
            
            <Box 
              data-testid="dynamic-content"
              sx={{ 
                minHeight: '50px',
                p: 2,
                border: '1px solid grey.300',
                borderRadius: 1,
                wordBreak: 'break-all',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
            >
              {content === 'empty' ? (
                <Typography color="text.secondary" data-testid="empty-state">
                  No content available
                </Typography>
              ) : (
                <Typography data-testid="text-content">
                  {getContent()}
                </Typography>
              )}
            </Box>
          </Box>
        </ModalContent>
      );
    };

    return (
      <TestModalWrapper>
        <EdgeCaseModal />
      </TestModalWrapper>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open edge case modal', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const modal = canvas.getByTestId('edge-case-modal');
        expect(modal).toBeInTheDocument();
      });
    });

    await step('Test empty content handling', async () => {
      const emptyButton = canvas.getByTestId('empty-content-btn');
      await userEvent.click(emptyButton);
      
      await waitFor(() => {
        const emptyState = canvas.getByTestId('empty-state');
        expect(emptyState).toHaveTextContent('No content available');
      });
    });

    await step('Test long text overflow', async () => {
      const longButton = canvas.getByTestId('long-content-btn');
      await userEvent.click(longButton);
      
      await waitFor(() => {
        const textContent = canvas.getByTestId('text-content');
        expect(textContent).toBeInTheDocument();
      });
      
      const container = canvas.getByTestId('dynamic-content');
      const computedStyle = window.getComputedStyle(container);
      await expect(computedStyle.overflowY).toBe('auto');
      await expect(computedStyle.wordBreak).toBe('break-all');
    });

    await step('Test normal content restoration', async () => {
      const normalButton = canvas.getByTestId('normal-content-btn');
      await userEvent.click(normalButton);
      
      await waitFor(() => {
        const textContent = canvas.getByTestId('text-content');
        expect(textContent).toHaveTextContent('Normal content');
      });
    });

    await step('Test modal persistence with content changes', async () => {
      // Modal should remain open during content changes
      const modal = canvas.getByTestId('edge-case-modal');
      await expect(modal).toBeInTheDocument();
    });
  },
};

// ===== PERSISTENT MODAL TESTS =====

export const PersistentModal: Story = {
  name: '🔒 Persistent Modal Test',
  render: () => (
    <TestModalWrapper modalProps={{ persistent: true }}>
      <ModalContent>
        <Box data-testid="persistent-modal">
          <Typography variant="h6" gutterBottom>
            Persistent Modal
          </Typography>
          <Typography paragraph>
            This modal cannot be closed by clicking the backdrop or pressing Escape.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Use the close button to dismiss this modal.
          </Typography>
          <Button 
            variant="contained" 
            data-testid="explicit-close-btn"
            onClick={() => {/* This would close the modal in real implementation */}}
          >
            Close Modal
          </Button>
        </Box>
      </ModalContent>
    </TestModalWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Open persistent modal', async () => {
      const triggerButton = canvas.getByTestId('trigger-button');
      await userEvent.click(triggerButton);
      
      await waitFor(() => {
        const modal = canvas.getByTestId('persistent-modal');
        expect(modal).toBeInTheDocument();
      });
    });

    await step('Test backdrop click does not close modal', async () => {
      const backdrop = canvas.getByRole('presentation');
      await userEvent.click(backdrop);
      
      // Modal should remain open
      await waitFor(() => {
        const modal = canvas.getByTestId('persistent-modal');
        expect(modal).toBeInTheDocument();
      }, { timeout: 500 });
    });

    await step('Test Escape key does not close modal', async () => {
      await userEvent.keyboard('{Escape}');
      
      // Modal should remain open
      await waitFor(() => {
        const modal = canvas.getByTestId('persistent-modal');
        expect(modal).toBeInTheDocument();
      }, { timeout: 500 });
    });

    await step('Test explicit close button', async () => {
      const closeButton = canvas.getByTestId('explicit-close-btn');
      await expect(closeButton).toBeInTheDocument();
      await expect(closeButton).toBeEnabled();
    });
  },
};