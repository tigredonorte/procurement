import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Save, Delete, Add, ArrowForward } from '@mui/icons-material';
import { Stack } from '@mui/material';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'ghost', 'glass', 'gradient'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    glow: {
      control: { type: 'boolean' },
    },
    pulse: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'solid',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={2} direction="row">
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="glass">Glass</Button>
      <Button variant="gradient">Gradient</Button>
    </Stack>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <Stack spacing={2} direction="row" alignItems="center">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </Stack>
  ),
};

export const AllColors: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="danger">Danger</Button>
        <Button color="neutral">Neutral</Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="outline" color="primary">Primary</Button>
        <Button variant="outline" color="secondary">Secondary</Button>
        <Button variant="outline" color="success">Success</Button>
        <Button variant="outline" color="warning">Warning</Button>
        <Button variant="outline" color="danger">Danger</Button>
        <Button variant="outline" color="neutral">Neutral</Button>
      </Stack>
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Stack spacing={2} direction="row">
      <Button icon={<Save />}>Save</Button>
      <Button variant="outline" icon={<Add />} color="success">Add Item</Button>
      <Button variant="ghost" icon={<Delete />} color="danger">Delete</Button>
      <Button variant="gradient" icon={<ArrowForward />}>Continue</Button>
    </Stack>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <Stack spacing={2} direction="row">
      <Button loading>Loading</Button>
      <Button variant="outline" loading color="secondary">Processing</Button>
      <Button variant="glass" loading>Please Wait</Button>
      <Button variant="gradient" loading>Submitting</Button>
    </Stack>
  ),
};

export const SpecialEffects: Story = {
  render: () => (
    <Stack spacing={2} direction="row">
      <Button glow>Glow Effect</Button>
      <Button pulse color="secondary">Pulse Animation</Button>
      <Button glow pulse variant="gradient">Both Effects</Button>
      <Button variant="glass" glow>Glass with Glow</Button>
    </Stack>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <Stack spacing={2} direction="row">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>Disabled Outline</Button>
      <Button variant="ghost" disabled>Disabled Ghost</Button>
      <Button variant="glass" disabled>Disabled Glass</Button>
      <Button variant="gradient" disabled>Disabled Gradient</Button>
    </Stack>
  ),
};

export const ComplexExample: Story = {
  render: () => (
    <Stack spacing={3}>
      <Stack spacing={2} direction="row">
        <Button variant="gradient" size="lg" glow icon={<Save />}>
          Save Changes
        </Button>
        <Button variant="glass" size="lg" icon={<ArrowForward />}>
          Continue
        </Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="outline" color="danger" icon={<Delete />}>
          Delete Account
        </Button>
        <Button variant="ghost" color="neutral">
          Cancel
        </Button>
      </Stack>
    </Stack>
  ),
};