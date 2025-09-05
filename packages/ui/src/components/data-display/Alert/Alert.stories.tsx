import type { Meta, StoryObj } from '@storybook/react';
import { Star, Warning as MuiWarning } from '@mui/icons-material';
import { Stack } from '@mui/material';

import { Alert } from './Alert';

const meta = {
  title: 'Data Display/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'danger', 'glass'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    glow: {
      control: { type: 'boolean' },
    },
    pulse: {
      control: { type: 'boolean' },
    },
    showIcon: {
      control: { type: 'boolean' },
    },
    closable: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    children: 'This is a default alert message.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an info alert with useful information.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success! Your action was completed successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning! Please check your input and try again.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Error! Something went wrong. Please try again.',
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: 'This is a glass-morphism alert with a blurred background.',
  },
};

// With title and description
export const WithTitle: Story = {
  args: {
    variant: 'success',
    title: 'Payment Successful',
    description: 'Your payment has been processed successfully. You will receive a confirmation email shortly.',
  },
};

// With custom icon
export const WithCustomIcon: Story = {
  args: {
    variant: 'info',
    icon: <Star />,
    title: 'Pro Tip',
    children: 'You can customize the alert icon to match your content.',
  },
};

// Without icon
export const WithoutIcon: Story = {
  args: {
    variant: 'warning',
    showIcon: false,
    children: 'This alert does not display an icon.',
  },
};

// Closable alert
export const Closable: Story = {
  args: {
    variant: 'info',
    closable: true,
    title: 'Notification',
    children: 'This alert can be closed by clicking the X button.',
  },
};

// With effects
export const WithGlow: Story = {
  args: {
    variant: 'success',
    glow: true,
    title: 'Success with Glow',
    children: 'This alert has a glowing effect around it.',
  },
};

export const WithPulse: Story = {
  args: {
    variant: 'warning',
    pulse: true,
    title: 'Attention Required',
    children: 'This alert has a pulsing animation to grab attention.',
  },
};

export const WithGlowAndPulse: Story = {
  args: {
    variant: 'danger',
    glow: true,
    pulse: true,
    title: 'Critical Alert',
    children: 'This alert combines both glow and pulse effects.',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Stack spacing={2}>
      <Alert variant="info" title="Information" closable>
        This is an informational message with important details.
      </Alert>
      <Alert variant="success" title="Success" closable>
        Your action was completed successfully!
      </Alert>
      <Alert variant="warning" title="Warning" closable>
        Please review your settings before continuing.
      </Alert>
      <Alert variant="danger" title="Error" closable>
        An error occurred while processing your request.
      </Alert>
      <Alert variant="glass" title="Glass Effect" closable>
        This alert uses glassmorphism design with backdrop blur.
      </Alert>
    </Stack>
  ),
};

// Interactive examples
export const Interactive: Story = {
  render: () => (
    <Stack spacing={2}>
      <Alert
        variant="success"
        title="Interactive Demo"
        glow
        closable
        onClose={() => { /** do nothing */}}
      >
        Click the close button to dismiss this alert.
      </Alert>
      <Alert
        variant="warning"
        pulse
        icon={<MuiWarning />}
        title="Attention"
      >
        This alert pulses to grab your attention.
      </Alert>
      <Alert
        variant="glass"
        glow
        pulse
        title="Combined Effects"
        closable
      >
        Glass morphism with glow and pulse effects combined.
      </Alert>
    </Stack>
  ),
};