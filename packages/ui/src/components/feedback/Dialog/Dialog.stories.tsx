import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { Dialog, DialogHeader, DialogContent, DialogActions } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Feedback/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile dialog component with glass morphism, gradient, and multiple variant support.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'fullscreen', 'drawer'],
      description: 'Visual style variant of the dialog',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the dialog',
    },
    borderRadius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius of the dialog',
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
type Story = StoryObj<typeof Dialog>;

const DialogWrapper = ({ children, ...args }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <Dialog {...args} open={open} onClose={() => setOpen(false)}>
        {children}
      </Dialog>
    </Box>
  );
};

export const Default: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Default Dialog"
        subtitle="A clean, minimal dialog design"
      />
      <DialogContent>
        <Typography>
          This is a default dialog with standard Material-UI styling.
          Perfect for most use cases requiring user interaction.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">Confirm</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
  },
};

export const GlassMorphism: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Glass Dialog"
        subtitle="Beautiful glass morphism effect"
      />
      <DialogContent>
        <Typography>
          Experience the modern glass morphism design with blur effects
          and translucent backgrounds. Perfect for contemporary interfaces.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">Accept</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'glass',
    size: 'md',
    glow: true,
  },
};

export const GradientGlow: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Gradient Glow Dialog"
        subtitle="Stunning gradient with glow effects"
      />
      <DialogContent>
        <Typography>
          A premium dialog with gradient backgrounds and glow effects.
          Ideal for highlighting important actions or premium features.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button>Skip</Button>
        <Button variant="contained">Upgrade Now</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'default',
    gradient: true,
    glow: true,
    size: 'lg',
    borderRadius: 'xl',
  },
};

export const Fullscreen: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Fullscreen Dialog"
        subtitle="Immersive fullscreen experience"
      />
      <DialogContent>
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Fullscreen Content
          </Typography>
          <Typography paragraph>
            This fullscreen dialog provides an immersive experience perfect for
            complex forms, detailed views, or step-by-step processes.
          </Typography>
          <Typography paragraph>
            The fullscreen variant automatically adapts to mobile devices and
            provides optimal space utilization.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">Save</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'fullscreen',
  },
};

export const DrawerStyle: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Drawer Dialog"
        subtitle="Slide-in panel design"
      />
      <DialogContent>
        <Typography paragraph>
          The drawer variant slides in from the right, perfect for forms,
          settings panels, or detailed information views.
        </Typography>
        <Typography paragraph>
          This design pattern is especially popular in modern web applications
          for secondary content and actions.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button>Close</Button>
        <Button variant="contained">Apply</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'drawer',
    size: 'sm',
  },
};

export const AllSizes: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

    const handleOpen = (size: string) => {
      setOpenStates(prev => ({ ...prev, [size]: true }));
    };

    const handleClose = (size: string) => {
      setOpenStates(prev => ({ ...prev, [size]: false }));
    };

    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {sizes.map(size => (
          <Box key={size}>
            <Button 
              variant="outlined" 
              onClick={() => handleOpen(size)}
              size="small"
            >
              {size.toUpperCase()}
            </Button>
            <Dialog
              open={openStates[size] || false}
              onClose={() => handleClose(size)}
              size={size}
              variant="glass"
            >
              <DialogHeader title={`${size.toUpperCase()} Dialog`} />
              <DialogContent>
                <Typography>
                  This is a {size} sized dialog demonstrating responsive sizing.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleClose(size)}>Close</Button>
              </DialogActions>
            </Dialog>
          </Box>
        ))}
      </Box>
    );
  },
};