import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Modal, ModalContent } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible modal component with beautiful animations and glass morphism effects.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['center', 'top', 'bottom', 'glass'],
      description: 'Position and style variant of the modal',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the modal',
    },
    glass: {
      control: 'boolean',
      description: 'Enable glass morphism effect',
    },
    gradient: {
      control: 'boolean',
      description: 'Enable gradient background',
    },
    glow: {
      control: 'boolean',
      description: 'Enable glow effect',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalWrapper = ({ children, ...args }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal {...args} open={open} onClose={() => setOpen(false)}>
        {children}
      </Modal>
    </Box>
  );
};

export const Center: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <ModalContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Center Modal
          </Typography>
          <IconButton onClick={() => {}}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography paragraph>
          This modal appears in the center of the screen with a smooth fade animation.
          Perfect for confirmations, forms, or any content that needs focus.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button>Cancel</Button>
          <Button variant="contained">Confirm</Button>
        </Box>
      </ModalContent>
    </ModalWrapper>
  ),
  args: {
    variant: 'center',
    size: 'md',
  },
};

export const TopSlide: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <ModalContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" gutterBottom>
            Top Slide Modal
          </Typography>
          <Typography paragraph>
            This modal slides down from the top, creating an elegant entrance animation.
            Great for notifications or announcements.
          </Typography>
          <Button variant="contained">
            Got it
          </Button>
        </Box>
      </ModalContent>
    </ModalWrapper>
  ),
  args: {
    variant: 'top',
    size: 'sm',
  },
};

export const BottomSlide: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <ModalContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            Bottom Slide Modal
          </Typography>
          <Typography paragraph>
            This modal slides up from the bottom, similar to mobile app sheets.
            Ideal for mobile-first designs and quick actions.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button fullWidth>Cancel</Button>
            <Button variant="contained" fullWidth>Continue</Button>
          </Box>
        </Box>
      </ModalContent>
    </ModalWrapper>
  ),
  args: {
    variant: 'bottom',
    size: 'md',
  },
};

export const GlassEffect: Story = {
  render: (args) => (
    <Box sx={{ 
      minHeight: '400px',
      background: 'linear-gradient(45deg, #1976d2 30%, #21cbf3 90%)',
      p: 4,
      borderRadius: 2,
    }}>
      <ModalWrapper {...args}>
        <ModalContent padding={4}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Glass Morphism Modal
          </Typography>
          <Typography paragraph sx={{ opacity: 0.9 }}>
            Experience the beauty of glass morphism with backdrop blur effects
            and translucent surfaces. This creates depth and modern aesthetics.
          </Typography>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(255,255,255,0.1)', 
            borderRadius: 1, 
            backdropFilter: 'blur(10px)',
            mb: 3,
          }}>
            <Typography variant="body2">
              Even nested glass elements work perfectly with proper layering.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button sx={{ backdropFilter: 'blur(10px)', bgcolor: 'rgba(255,255,255,0.2)' }}>
              Cancel
            </Button>
            <Button variant="contained">
              Continue
            </Button>
          </Box>
        </ModalContent>
      </ModalWrapper>
    </Box>
  ),
  args: {
    variant: 'glass',
    size: 'lg',
    glow: true,
  },
};

export const GradientGlow: Story = {
  render: (args) => (
    <Box sx={{ bgcolor: 'grey.900', p: 4, borderRadius: 2 }}>
      <ModalWrapper {...args}>
        <ModalContent padding={4}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Premium Feature
          </Typography>
          <Typography paragraph>
            This modal showcases gradient backgrounds with glow effects,
            perfect for premium features, upgrades, or special announcements.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            p: 2, 
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 1,
            mb: 3,
          }}>
            <Typography variant="h6">✨</Typography>
            <Typography>
              Unlock advanced features with Pro
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button>Maybe Later</Button>
            <Button variant="contained" sx={{ 
              background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5252, #ffcc02)',
              }
            }}>
              Upgrade Now
            </Button>
          </Box>
        </ModalContent>
      </ModalWrapper>
    </Box>
  ),
  args: {
    variant: 'center',
    gradient: true,
    glow: true,
    size: 'md',
  },
};

export const ResponsiveSizes: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {sizes.map(size => (
          <Box key={size}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenStates(prev => ({ ...prev, [size]: true }))}
            >
              {size.toUpperCase()}
            </Button>
            <Modal
              open={openStates[size] || false}
              onClose={() => setOpenStates(prev => ({ ...prev, [size]: false }))}
              variant="center"
              size={size}
              glass={true}
            >
              <ModalContent>
                <Typography variant="h6" gutterBottom>
                  Size: {size.toUpperCase()}
                </Typography>
                <Typography>
                  This demonstrates the {size} size modal with responsive behavior
                  and glass morphism effects.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    onClick={() => setOpenStates(prev => ({ ...prev, [size]: false }))}
                    fullWidth
                    variant="contained"
                  >
                    Close
                  </Button>
                </Box>
              </ModalContent>
            </Modal>
          </Box>
        ))}
      </Box>
    );
  },
};