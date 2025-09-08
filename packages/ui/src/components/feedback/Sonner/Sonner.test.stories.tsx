import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { Button, Stack, TextField, Box } from '@mui/material';

import { SonnerProvider, useSonner } from './Sonner';

const meta = {
  title: 'Feedback/Sonner/Tests',
  component: SonnerProvider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive test stories for Sonner toast component',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SonnerProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test wrapper component with toast functionality
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SonnerProvider>{children}</SonnerProvider>
);

// Basic interaction test component
const BasicInteractionTest: React.FC = () => {
  const { toast, success, error, warning, info, loading, dismiss } = useSonner();

  return (
    <Stack spacing={2} data-testid="basic-interaction">
      <Button data-testid="basic-toast-btn" onClick={() => toast('Basic toast message')}>
        Basic Toast
      </Button>
      <Button data-testid="success-toast-btn" onClick={() => success('Success message')}>
        Success Toast
      </Button>
      <Button data-testid="error-toast-btn" onClick={() => error('Error message')}>
        Error Toast
      </Button>
      <Button data-testid="warning-toast-btn" onClick={() => warning('Warning message')}>
        Warning Toast
      </Button>
      <Button data-testid="info-toast-btn" onClick={() => info('Info message')}>
        Info Toast
      </Button>
      <Button data-testid="loading-toast-btn" onClick={() => loading('Loading...')}>
        Loading Toast
      </Button>
      <Button data-testid="dismiss-all-btn" onClick={() => dismiss()}>
        Dismiss All
      </Button>
    </Stack>
  );
};

// Form interaction test component
const FormInteractionTest: React.FC = () => {
  const { success, error } = useSonner();
  const [value, setValue] = React.useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      success('Form submitted successfully!');
      setValue('');
    } else {
      error('Please enter a value');
    }
  };

  return (
    <Box data-testid="form-interaction">
      <Stack spacing={2}>
        <TextField
          data-testid="form-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter some text"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button data-testid="submit-btn" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

// Keyboard navigation test component
const KeyboardNavigationTest: React.FC = () => {
  const { toast, dismiss } = useSonner();

  React.useEffect(() => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 't' && e.ctrlKey) {
        e.preventDefault();
        toast('Triggered by Ctrl+T');
      }
      if (e.key === 'Escape') {
        dismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toast, dismiss]);

  return (
    <Box data-testid="keyboard-navigation">
      <Stack spacing={2}>
        <Button data-testid="show-toast-btn" onClick={() => toast('Toast for keyboard test')}>
          Show Toast
        </Button>
        <p>Press Ctrl+T to show toast, Esc to dismiss</p>
      </Stack>
    </Box>
  );
};

// Screen reader test component
const ScreenReaderTest: React.FC = () => {
  const { toast } = useSonner();

  return (
    <Box data-testid="screen-reader">
      <Button
        data-testid="accessible-toast-btn"
        onClick={() => toast('Screen reader accessible toast')}
        aria-label="Show accessible toast notification"
      >
        Accessible Toast
      </Button>
    </Box>
  );
};

// Focus management test component
const FocusManagementTest: React.FC = () => {
  const { toast } = useSonner();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleToast = () => {
    toast('Focus management test', {
      action: {
        label: 'Focus Button',
        onClick: () => {
          buttonRef.current?.focus();
        },
      },
    });
  };

  return (
    <Box data-testid="focus-management">
      <Stack spacing={2}>
        <Button data-testid="focus-toast-btn" onClick={handleToast}>
          Show Toast with Action
        </Button>
        <Button ref={buttonRef} data-testid="focus-target-btn">
          Focus Target
        </Button>
      </Stack>
    </Box>
  );
};

// Responsive design test component
const ResponsiveDesignTest: React.FC = () => {
  const { toast } = useSonner();

  return (
    <Box data-testid="responsive-design">
      <Button
        data-testid="responsive-toast-btn"
        onClick={() => toast('Responsive design test message that is quite long to test wrapping')}
      >
        Test Responsive Toast
      </Button>
    </Box>
  );
};

// Theme variations test component
const ThemeVariationsTest: React.FC = () => {
  const { toast } = useSonner();

  return (
    <Box data-testid="theme-variations">
      <Stack spacing={2}>
        <Button
          data-testid="default-theme-btn"
          onClick={() => toast('Default theme toast', { variant: 'default' })}
        >
          Default Theme
        </Button>
        <Button
          data-testid="glass-theme-btn"
          onClick={() => toast('Glass theme toast', { variant: 'glass' })}
        >
          Glass Theme
        </Button>
        <Button
          data-testid="minimal-theme-btn"
          onClick={() => toast('Minimal theme toast', { variant: 'minimal' })}
        >
          Minimal Theme
        </Button>
      </Stack>
    </Box>
  );
};

// Visual states test component
const VisualStatesTest: React.FC = () => {
  const { toast, success, error } = useSonner();

  return (
    <Box data-testid="visual-states">
      <Stack spacing={2}>
        <Button
          data-testid="persistent-toast-btn"
          onClick={() => toast('Persistent toast', { persistent: true })}
        >
          Persistent Toast
        </Button>
        <Button
          data-testid="important-toast-btn"
          onClick={() => success('Important success', { important: true })}
        >
          Important Success
        </Button>
        <Button
          data-testid="with-description-btn"
          onClick={() =>
            error('Error with description', {
              description: 'This is a detailed description of the error',
            })
          }
        >
          With Description
        </Button>
      </Stack>
    </Box>
  );
};

// Performance test component
const PerformanceTest: React.FC = () => {
  const { toast, dismiss } = useSonner();

  const handleManyToasts = () => {
    const startTime = Date.now();
    for (let i = 0; i < 10; i++) {
      toast(`Toast ${i + 1}`);
    }
    const endTime = Date.now();
    window.window.setTimeout(() => {
      toast(`Created 10 toasts in ${endTime - startTime}ms`);
    }, 100);
  };

  return (
    <Box data-testid="performance">
      <Stack spacing={2}>
        <Button data-testid="many-toasts-btn" onClick={handleManyToasts}>
          Create Many Toasts
        </Button>
        <Button data-testid="clear-toasts-btn" onClick={() => dismiss()}>
          Clear All
        </Button>
      </Stack>
    </Box>
  );
};

// Edge cases test component
const EdgeCasesTest: React.FC = () => {
  const { toast, promise } = useSonner();

  const handleEmptyToast = () => {
    toast('');
  };

  const handleLongToast = () => {
    toast(
      'This is a very long toast message that should test how the component handles extensive text content that might overflow or wrap to multiple lines in the toast notification container',
    );
  };

  const handlePromiseToast = () => {
    const testPromise = new Promise((resolve) => {
      window.setTimeout(() => resolve('Success!'), 2000);
    });

    promise(testPromise, {
      loading: 'Processing...',
      success: 'Promise resolved!',
      error: 'Promise failed!',
    });
  };

  return (
    <Box data-testid="edge-cases">
      <Stack spacing={2}>
        <Button data-testid="empty-toast-btn" onClick={handleEmptyToast}>
          Empty Toast
        </Button>
        <Button data-testid="long-toast-btn" onClick={handleLongToast}>
          Long Message
        </Button>
        <Button data-testid="promise-toast-btn" onClick={handlePromiseToast}>
          Promise Toast
        </Button>
      </Stack>
    </Box>
  );
};

// Integration test component
const IntegrationTest: React.FC = () => {
  const { toast, success, error, dismiss } = useSonner();
  const [step, setStep] = React.useState(0);

  const runIntegrationTest = async () => {
    setStep(1);
    toast('Step 1: Starting integration test');

    window.window.setTimeout(() => {
      setStep(2);
      success('Step 2: First action completed');
    }, 1000);

    window.window.setTimeout(() => {
      setStep(3);
      error('Step 3: Simulated error occurred');
    }, 2000);

    window.window.setTimeout(() => {
      setStep(4);
      dismiss();
      success('Step 4: Integration test completed');
      setStep(0);
    }, 3000);
  };

  return (
    <Box data-testid="integration">
      <Stack spacing={2}>
        <Button data-testid="integration-test-btn" onClick={runIntegrationTest} disabled={step > 0}>
          Run Integration Test {step > 0 && `(Step ${step}/4)`}
        </Button>
      </Stack>
    </Box>
  );
};

// Test stories
export const BasicInteraction: Story = {
  render: () => (
    <TestWrapper>
      <BasicInteractionTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test basic toast
    const basicBtn = canvas.getByTestId('basic-toast-btn');
    await userEvent.click(basicBtn);

    // Test success toast
    const successBtn = canvas.getByTestId('success-toast-btn');
    await userEvent.click(successBtn);

    await waitFor(() => {
      expect(canvas.getByTestId('basic-interaction')).toBeInTheDocument();
    });
  },
};

export const FormInteraction: Story = {
  render: () => (
    <TestWrapper>
      <FormInteractionTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByTestId('form-input');
    const submitBtn = canvas.getByTestId('submit-btn');

    // Test empty submission
    await userEvent.click(submitBtn);

    // Test valid submission
    await userEvent.type(input, 'Test input');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <TestWrapper>
      <KeyboardNavigationTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const showBtn = canvas.getByTestId('show-toast-btn');
    await userEvent.click(showBtn);

    // Test Escape key
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(canvas.getByTestId('keyboard-navigation')).toBeInTheDocument();
    });
  },
};

export const ScreenReader: Story = {
  render: () => (
    <TestWrapper>
      <ScreenReaderTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const accessibleBtn = canvas.getByTestId('accessible-toast-btn');
    expect(accessibleBtn).toHaveAttribute('aria-label');

    await userEvent.click(accessibleBtn);

    await waitFor(() => {
      expect(canvas.getByTestId('screen-reader')).toBeInTheDocument();
    });
  },
};

export const FocusManagement: Story = {
  render: () => (
    <TestWrapper>
      <FocusManagementTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const focusBtn = canvas.getByTestId('focus-toast-btn');
    await userEvent.click(focusBtn);

    await waitFor(() => {
      expect(canvas.getByTestId('focus-management')).toBeInTheDocument();
    });
  },
};

export const ResponsiveDesign: Story = {
  render: () => (
    <TestWrapper>
      <ResponsiveDesignTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const responsiveBtn = canvas.getByTestId('responsive-toast-btn');
    await userEvent.click(responsiveBtn);

    await waitFor(() => {
      expect(canvas.getByTestId('responsive-design')).toBeInTheDocument();
    });
  },
};

export const ThemeVariations: Story = {
  render: () => (
    <TestWrapper>
      <ThemeVariationsTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const defaultBtn = canvas.getByTestId('default-theme-btn');
    const glassBtn = canvas.getByTestId('glass-theme-btn');
    const minimalBtn = canvas.getByTestId('minimal-theme-btn');

    await userEvent.click(defaultBtn);
    await userEvent.click(glassBtn);
    await userEvent.click(minimalBtn);

    await waitFor(() => {
      expect(canvas.getByTestId('theme-variations')).toBeInTheDocument();
    });
  },
};

export const VisualStates: Story = {
  render: () => (
    <TestWrapper>
      <VisualStatesTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const persistentBtn = canvas.getByTestId('persistent-toast-btn');
    const importantBtn = canvas.getByTestId('important-toast-btn');
    const descriptionBtn = canvas.getByTestId('with-description-btn');

    await userEvent.click(persistentBtn);
    await userEvent.click(importantBtn);
    await userEvent.click(descriptionBtn);

    await waitFor(() => {
      expect(canvas.getByTestId('visual-states')).toBeInTheDocument();
    });
  },
};

export const Performance: Story = {
  render: () => (
    <TestWrapper>
      <PerformanceTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const manyToastsBtn = canvas.getByTestId('many-toasts-btn');
    await userEvent.click(manyToastsBtn);

    // Wait a bit then clear
    window.setTimeout(async () => {
      const clearBtn = canvas.getByTestId('clear-toasts-btn');
      await userEvent.click(clearBtn);
    }, 1000);

    await waitFor(() => {
      expect(canvas.getByTestId('performance')).toBeInTheDocument();
    });
  },
};

export const EdgeCases: Story = {
  render: () => (
    <TestWrapper>
      <EdgeCasesTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emptyBtn = canvas.getByTestId('empty-toast-btn');
    const longBtn = canvas.getByTestId('long-toast-btn');
    const promiseBtn = canvas.getByTestId('promise-toast-btn');

    await userEvent.click(emptyBtn);
    await userEvent.click(longBtn);
    await userEvent.click(promiseBtn);

    await waitFor(() => {
      expect(canvas.getByTestId('edge-cases')).toBeInTheDocument();
    });
  },
};

export const Integration: Story = {
  render: () => (
    <TestWrapper>
      <IntegrationTest />
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const integrationBtn = canvas.getByTestId('integration-test-btn');
    await userEvent.click(integrationBtn);

    await waitFor(
      () => {
        expect(canvas.getByTestId('integration')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  },
};
