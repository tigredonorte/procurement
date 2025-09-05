import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Button, Box, Typography, ButtonGroup } from '@mui/material';
import { Toast, ToastProvider, useToast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible toast notification system with multiple variants and promise support.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

const ToastDemo = () => {
  const { addToast, promise } = useToast();

  const showDefault = () => {
    addToast({
      message: 'Default toast notification',
      variant: 'default',
    });
  };

  const showSuccess = () => {
    addToast({
      message: 'Success! Your action was completed.',
      variant: 'success',
      duration: 4000,
    });
  };

  const showError = () => {
    addToast({
      message: 'Error: Something went wrong.',
      variant: 'error',
      duration: 6000,
    });
  };

  const showWarning = () => {
    addToast({
      message: 'Warning: Please review your input.',
      variant: 'warning',
    });
  };

  const showInfo = () => {
    addToast({
      message: 'Info: Here\'s some helpful information.',
      variant: 'info',
    });
  };

  const showWithAction = () => {
    addToast({
      message: 'Your file has been saved.',
      variant: 'success',
      action: {
        label: 'View',
        onClick: () => {
          addToast({
            message: 'Opening file...',
            variant: 'info',
          });
        },
      },
    });
  };

  const showPersistent = () => {
    addToast({
      message: 'This toast stays until you dismiss it.',
      variant: 'info',
      persistent: true,
    });
  };

  const showGlass = () => {
    addToast({
      message: 'Beautiful glass morphism effect',
      variant: 'default',
      glass: true,
      duration: 6000,
    });
  };

  const showPromise = async () => {
    const mockPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject(new Error('Failed!'));
      }, 2000);
    });

    try {
      await promise(mockPromise, {
        loading: 'Processing your request...',
        success: 'Request completed successfully!',
        error: 'Request failed. Please try again.',
      });
    } catch (error) {
      // Error is already handled by the promise function
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Toast Notifications Demo
      </Typography>
      
      <ButtonGroup orientation="vertical" variant="outlined" fullWidth>
        <Button onClick={showDefault}>Default Toast</Button>
        <Button onClick={showSuccess} color="success">Success Toast</Button>
        <Button onClick={showError} color="error">Error Toast</Button>
        <Button onClick={showWarning} color="warning">Warning Toast</Button>
        <Button onClick={showInfo} color="info">Info Toast</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical" variant="contained" fullWidth>
        <Button onClick={showWithAction}>Toast with Action</Button>
        <Button onClick={showPersistent}>Persistent Toast</Button>
        <Button onClick={showGlass}>Glass Effect</Button>
        <Button onClick={showPromise}>Promise Toast</Button>
      </ButtonGroup>
    </Box>
  );
};

export const Interactive: Story = {
  render: () => <ToastDemo />,
};

export const BasicTypes: Story = {
  render: () => {
    const [showToasts, setShowToasts] = useState(false);
    
    useEffect(() => {
      if (!showToasts) return;
      
      const { addToast } = useToast();
      
      // Show different types with delays
      setTimeout(() => addToast({ message: 'Default notification', variant: 'default' }), 100);
      setTimeout(() => addToast({ message: 'Success! Task completed.', variant: 'success' }), 600);
      setTimeout(() => addToast({ message: 'Error: Something went wrong.', variant: 'error' }), 1100);
      setTimeout(() => addToast({ message: 'Warning: Please check this.', variant: 'warning' }), 1600);
      setTimeout(() => addToast({ message: 'Info: Helpful information.', variant: 'info' }), 2100);
      
      setShowToasts(false);
    }, [showToasts]);

    return (
      <Button variant="contained" onClick={() => setShowToasts(true)}>
        Show All Toast Types
      </Button>
    );
  },
};

export const GlassMorphism: Story = {
  render: () => {
    const { addToast } = useToast();

    return (
      <Box sx={{ 
        minHeight: '300px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 4,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Button 
          variant="contained" 
          onClick={() => addToast({
            message: 'Glass morphism toast with blur effects',
            variant: 'success',
            glass: true,
            duration: 8000,
          })}
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)',
            }
          }}
        >
          Show Glass Toast
        </Button>
      </Box>
    );
  },
};

export const PromiseHandling: Story = {
  render: () => {
    const { promise } = useToast();

    const handleQuickPromise = () => {
      const quickPromise = new Promise(resolve => {
        setTimeout(() => resolve('Quick success!'), 1000);
      });

      promise(quickPromise, {
        loading: 'Quick loading...',
        success: 'Done in 1 second!',
        error: 'Quick failed',
      });
    };

    const handleSlowPromise = () => {
      const slowPromise = new Promise(resolve => {
        setTimeout(() => resolve('Slow success!'), 3000);
      });

      promise(slowPromise, {
        loading: 'This will take 3 seconds...',
        success: (data) => `Completed: ${data}`,
        error: 'Slow operation failed',
      });
    };

    const handleFailingPromise = () => {
      const failingPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Simulated failure')), 1500);
      });

      promise(failingPromise, {
        loading: 'Processing (will fail)...',
        success: 'This won\'t show',
        error: (error) => `Error: ${error.message}`,
      });
    };

    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={handleQuickPromise}>
          Quick Promise (1s)
        </Button>
        <Button variant="contained" onClick={handleSlowPromise}>
          Slow Promise (3s)
        </Button>
        <Button variant="outlined" color="error" onClick={handleFailingPromise}>
          Failing Promise
        </Button>
      </Box>
    );
  },
};