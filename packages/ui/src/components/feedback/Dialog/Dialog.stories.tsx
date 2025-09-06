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

const DialogWrapper = ({ children, ...args }: { children: React.ReactNode; [key: string]: unknown }) => {
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

const AllSizesComponent = () => {
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
};

export const AllSizes: Story = {
  render: () => <AllSizesComponent />,
};

// Additional comprehensive stories
export const WithCustomActions: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Custom Actions Dialog"
        subtitle="Dialog with custom action alignment and spacing"
      />
      <DialogContent>
        <Typography paragraph>
          This dialog demonstrates custom action alignment and spacing options.
          You can align actions to left, center, right, or space-between.
        </Typography>
      </DialogContent>
      <DialogActions alignment="space-between" spacing={2}>
        <Button variant="outlined" color="error">Delete</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </Box>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
    borderRadius: 'lg',
  },
};

export const WithDividers: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Dialog with Dividers"
        subtitle="Content sections with visual separators"
      />
      <DialogContent dividers>
        <Typography paragraph>
          This content section has dividers above and below to create clear
          visual separation from the header and actions.
        </Typography>
        <Typography paragraph>
          This is useful for dialogs with a lot of content or when you need
          to clearly separate different sections of the dialog.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">Continue</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'lg',
  },
};

export const DenseContent: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Dense Content Dialog"
        subtitle="Compact spacing for information-heavy dialogs"
      />
      <DialogContent dense dividers>
        <Typography variant="body2" paragraph>
          Dense content reduces padding to fit more information in a smaller space.
          This is useful for data tables, forms, or content-heavy dialogs.
        </Typography>
        <Typography variant="body2" paragraph>
          The dense prop reduces internal padding while maintaining readability.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button size="small">Cancel</Button>
        <Button variant="contained" size="small">OK</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'sm',
  },
};

export const NoCloseButton: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Persistent Dialog"
        subtitle="No close button - must use action buttons"
        showCloseButton={false}
      />
      <DialogContent>
        <Typography>
          This dialog has no close button and is persistent, meaning it cannot
          be closed by clicking the backdrop or pressing Escape.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="error">Cancel</Button>
        <Button variant="contained">Confirm</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
    persistent: true,
  },
};

export const PulseEffect: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogHeader
        title="Pulse Effect Dialog"
        subtitle="Attention-grabbing pulse animation"
      />
      <DialogContent>
        <Typography>
          This dialog has a pulse effect to draw attention. The pulse animation
          creates a subtle highlighting effect around the dialog.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button>Dismiss</Button>
        <Button variant="contained">Take Action</Button>
      </DialogActions>
    </DialogWrapper>
  ),
  args: {
    variant: 'default',
    size: 'md',
    pulse: true,
    glow: true,
  },
};

const BorderRadiusVariationsComponent = () => {
  const radiusOptions = ['none', 'sm', 'md', 'lg', 'xl'] as const;
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

    const handleOpen = (radius: string) => {
      setOpenStates(prev => ({ ...prev, [radius]: true }));
    };

    const handleClose = (radius: string) => {
      setOpenStates(prev => ({ ...prev, [radius]: false }));
    };

    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {radiusOptions.map(radius => (
          <Box key={radius}>
            <Button 
              variant="outlined" 
              onClick={() => handleOpen(radius)}
              size="small"
            >
              {radius.toUpperCase()}
            </Button>
            <Dialog
              open={openStates[radius] || false}
              onClose={() => handleClose(radius)}
              borderRadius={radius}
              variant="glass"
            >
              <DialogHeader title={`${radius.toUpperCase()} Border Radius`} />
              <DialogContent>
                <Typography>
                  This dialog demonstrates the {radius} border radius option.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleClose(radius)}>Close</Button>
              </DialogActions>
            </Dialog>
          </Box>
        ))}
      </Box>
    );
};

export const BorderRadiusVariations: Story = {
  render: () => <BorderRadiusVariationsComponent />,
};