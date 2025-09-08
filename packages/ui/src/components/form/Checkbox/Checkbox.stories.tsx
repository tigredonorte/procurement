import type { Meta, StoryObj } from '@storybook/react';
import { Stack, FormGroup } from '@mui/material';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'component:Checkbox'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'rounded', 'toggle'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    ripple: {
      control: { type: 'boolean' },
    },
    glow: {
      control: { type: 'boolean' },
    },
    pulse: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default checkbox',
  },
};

export const Variants: Story = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox variant="default" label="Default checkbox" defaultChecked />
      <Checkbox variant="rounded" label="Rounded checkbox" defaultChecked />
      <Checkbox variant="toggle" label="Toggle-style checkbox" defaultChecked />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled & Checked" disabled checked />
    </Stack>
  ),
};

export const Colors: Story = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox label="Primary" color="primary" defaultChecked />
      <Checkbox label="Secondary" color="secondary" defaultChecked />
      <Checkbox label="Success" color="success" defaultChecked />
      <Checkbox label="Warning" color="warning" defaultChecked />
      <Checkbox label="Error" color="error" defaultChecked />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox label="Small" size="small" defaultChecked />
      <Checkbox label="Medium" size="medium" defaultChecked />
      <Checkbox label="Large" size="large" defaultChecked />
    </Stack>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox 
        label="Terms and Conditions" 
        helperText="Please read and accept our terms and conditions"
      />
      <Checkbox 
        label="Newsletter" 
        helperText="Subscribe to our weekly newsletter"
        defaultChecked
      />
      <Checkbox 
        label="Required Field" 
        helperText="This field is required"
        error
      />
    </Stack>
  ),
};

export const CheckboxGroup: Story = {
  render: () => (
    <FormGroup>
      <Checkbox label="Option 1" defaultChecked />
      <Checkbox label="Option 2" />
      <Checkbox label="Option 3" defaultChecked />
      <Checkbox label="Option 4 (Disabled)" disabled />
    </FormGroup>
  ),
};

export const ErrorState: Story = {
  args: {
    label: 'I accept the terms',
    error: true,
    helperText: 'You must accept the terms to continue',
  },
};

export const LoadingState: Story = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox label="Loading checkbox" loading />
      <Checkbox label="Loading with text" loading defaultChecked />
      <Checkbox loading /> {/* Without label */}
    </Stack>
  ),
};

export const AnimationEffects: Story = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox label="Glow effect" glow defaultChecked />
      <Checkbox label="Pulse effect" pulse defaultChecked />
      <Checkbox label="No ripple effect" ripple={false} />
      <Checkbox label="All effects" glow pulse defaultChecked />
    </Stack>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <Stack spacing={2}>
      <Checkbox 
        label="Accessible checkbox"
        data-testid="accessible-checkbox"
        aria-describedby="checkbox-description"
      />
      <div id="checkbox-description">This checkbox has proper accessibility attributes</div>
      <Checkbox 
        label="Required field"
        required
        error
        helperText="This field is required"
        data-testid="required-checkbox"
      />
    </Stack>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    label: 'Playground Checkbox',
    color: 'primary',
    size: 'medium',
    checked: false,
    disabled: false,
    indeterminate: false,
    error: false,
    helperText: '',
    loading: false,
    ripple: true,
    glow: false,
    pulse: false,
  },
};