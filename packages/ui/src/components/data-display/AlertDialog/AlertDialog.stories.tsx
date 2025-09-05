import type { Meta, StoryObj } from '@storybook/react';
import { Button, Stack } from '@mui/material';
import { Delete, Warning, Logout } from '@mui/icons-material';
import React from 'react';

import { AlertDialog } from './AlertDialog';

const meta = {
  title: 'Data Display/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'glass'],
    },
    glow: {
      control: { type: 'boolean' },
    },
    pulse: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    confirmDisabled: {
      control: { type: 'boolean' },
    },
    showCancel: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to manage dialog state
const DialogWrapper = ({ children, ...props }: any) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <AlertDialog
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          console.log('Confirmed');
          setOpen(false);
        }}
      >
        {children}
      </AlertDialog>
    </>
  );
};

// Basic variants
export const Default: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    title: 'Confirm Action',
    description: 'Are you sure you want to perform this action? This cannot be undone.',
  },
};

export const Destructive: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    variant: 'destructive',
    title: 'Delete Account',
    description: 'This action cannot be undone. This will permanently delete your account and remove all associated data.',
    confirmText: 'Delete Account',
    cancelText: 'Cancel',
  },
};

export const Glass: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    variant: 'glass',
    title: 'Glass Effect Dialog',
    description: 'This dialog uses glassmorphism design with backdrop blur effects.',
    confirmText: 'Confirm',
  },
};

// With custom icons
export const WithCustomIcon: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    variant: 'destructive',
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    icon: <Delete color="error" />,
    confirmText: 'Delete',
  },
};

export const LogoutConfirmation: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    title: 'Sign Out',
    description: 'Are you sure you want to sign out of your account?',
    icon: <Logout color="primary" />,
    confirmText: 'Sign Out',
    cancelText: 'Stay Signed In',
  },
};

// Without cancel button
export const WithoutCancel: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    title: 'Information',
    description: 'This is an informational dialog that only has a confirm button.',
    showCancel: false,
    confirmText: 'Got It',
  },
};

// Loading state
export const Loading: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    title: 'Processing Request',
    description: 'Please wait while we process your request...',
    loading: true,
    confirmText: 'Processing...',
  },
};

// With effects
export const WithGlow: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    variant: 'default',
    glow: true,
    title: 'Important Notice',
    description: 'This dialog has a glowing effect to grab attention.',
    confirmText: 'Understood',
  },
};

export const WithPulse: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    variant: 'destructive',
    pulse: true,
    title: 'Critical Action',
    description: 'This dialog pulses to indicate a critical action.',
    icon: <Warning color="error" />,
    confirmText: 'Proceed',
  },
};

export const WithGlowAndPulse: Story = {
  render: (args) => (
    <DialogWrapper {...args} />
  ),
  args: {
    variant: 'glass',
    glow: true,
    pulse: true,
    title: 'Premium Feature',
    description: 'This dialog combines glow and pulse effects with glass morphism.',
    confirmText: 'Upgrade',
    cancelText: 'Maybe Later',
  },
};

// Interactive examples
export const AllVariants: Story = {
  render: () => (
    <Stack spacing={2} direction="row">
      <DialogWrapper
        variant="default"
        title="Default Dialog"
        description="This is a default confirmation dialog."
        confirmText="Confirm"
      />
      <DialogWrapper
        variant="destructive"
        title="Delete Confirmation"
        description="This action will permanently delete the item."
        confirmText="Delete"
        icon={<Delete />}
      />
      <DialogWrapper
        variant="glass"
        title="Glass Dialog"
        description="This dialog uses glassmorphism effects."
        confirmText="Continue"
      />
    </Stack>
  ),
};

// Complex content example
export const WithCustomContent: Story = {
  render: (args) => (
    <DialogWrapper {...args}>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <div>
          <strong>Additional Information:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>All data will be permanently deleted</li>
          <li>This action cannot be reversed</li>
          <li>You will receive a confirmation email</li>
        </ul>
      </Stack>
    </DialogWrapper>
  ),
  args: {
    variant: 'destructive',
    title: 'Delete Account',
    description: 'Please review the following before proceeding:',
    confirmText: 'I Understand, Delete Account',
    cancelText: 'Cancel',
  },
};