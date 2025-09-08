import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@mui/material';

import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'component:Select'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'glass', 'gradient'],
      description: 'Visual variant of the select component',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
      description: 'Size of the select component',
    },
    glow: {
      control: 'boolean',
      description: 'Whether to show a glow effect',
    },
    pulse: {
      control: 'boolean', 
      description: 'Whether to show a pulse animation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
];

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    label: 'Select Option',
    placeholder: 'Choose an option',
  },
};

export const WithLabel: Story = {
  args: {
    options: countryOptions,
    label: 'Country',
    placeholder: 'Select your country',
    helperText: 'Choose your country of residence',
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <Select 
        options={defaultOptions}
        label="Small Select"
        size="small"
        placeholder="Small size"
      />
      <Select 
        options={defaultOptions}
        label="Medium Select"
        size="medium"
        placeholder="Medium size"
      />
    </Stack>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    options: countryOptions,
    label: 'Country',
    defaultValue: 'us',
    helperText: 'Default value is pre-selected',
  },
};

export const ErrorState: Story = {
  args: {
    options: defaultOptions,
    label: 'Required Field',
    placeholder: 'Please select an option',
    error: true,
    helperText: 'This field is required',
  },
};

export const WithManyOptions: Story = {
  args: {
    options: [
      { value: 'afghanistan', label: 'Afghanistan' },
      { value: 'albania', label: 'Albania' },
      { value: 'algeria', label: 'Algeria' },
      { value: 'argentina', label: 'Argentina' },
      { value: 'australia', label: 'Australia' },
      { value: 'austria', label: 'Austria' },
      { value: 'bangladesh', label: 'Bangladesh' },
      { value: 'belgium', label: 'Belgium' },
      { value: 'brazil', label: 'Brazil' },
      { value: 'canada', label: 'Canada' },
      { value: 'china', label: 'China' },
      { value: 'denmark', label: 'Denmark' },
      { value: 'egypt', label: 'Egypt' },
      { value: 'france', label: 'France' },
      { value: 'germany', label: 'Germany' },
      { value: 'india', label: 'India' },
      { value: 'indonesia', label: 'Indonesia' },
      { value: 'italy', label: 'Italy' },
      { value: 'japan', label: 'Japan' },
      { value: 'mexico', label: 'Mexico' },
      { value: 'netherlands', label: 'Netherlands' },
      { value: 'norway', label: 'Norway' },
      { value: 'poland', label: 'Poland' },
      { value: 'russia', label: 'Russia' },
      { value: 'spain', label: 'Spain' },
      { value: 'sweden', label: 'Sweden' },
      { value: 'switzerland', label: 'Switzerland' },
      { value: 'turkey', label: 'Turkey' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'us', label: 'United States' },
    ],
    label: 'Country',
    placeholder: 'Select a country',
    helperText: 'Scroll to see all options',
  },
};

export const NoFullWidth: Story = {
  args: {
    options: defaultOptions,
    label: 'Compact Select',
    fullWidth: false,
    style: { width: '200px' },
  },
};

export const GlassVariant: Story = {
  args: {
    options: countryOptions,
    label: 'Glass Select',
    variant: 'glass',
    placeholder: 'Choose an option',
    helperText: 'Glass variant with blur effect',
  },
};

export const GradientVariant: Story = {
  args: {
    options: defaultOptions,
    label: 'Gradient Select',
    variant: 'gradient', 
    placeholder: 'Choose an option',
    helperText: 'Gradient variant with colorful border',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={3} sx={{ width: 400 }}>
      <Select
        options={defaultOptions}
        label="Default Variant"
        variant="default"
        placeholder="Default style"
        helperText="Standard Material-UI select"
      />
      <Select
        options={defaultOptions}
        label="Glass Variant"
        variant="glass"
        placeholder="Glass style"
        helperText="Glassmorphism effect with blur"
      />
      <Select
        options={defaultOptions}
        label="Gradient Variant"
        variant="gradient"
        placeholder="Gradient style"
        helperText="Gradient border effect"
      />
    </Stack>
  ),
};

export const WithGlowEffect: Story = {
  args: {
    options: countryOptions,
    label: 'Glow Select',
    placeholder: 'Choose with glow',
    glow: true,
    helperText: 'Select with glow effect',
  },
};

export const WithPulseAnimation: Story = {
  args: {
    options: defaultOptions,
    label: 'Pulse Select',
    placeholder: 'Choose with pulse',
    pulse: true,
    helperText: 'Select with pulse animation',
  },
};

export const CombinedEffects: Story = {
  render: () => (
    <Stack spacing={3} sx={{ width: 400 }}>
      <Select
        options={defaultOptions}
        label="Glass + Glow"
        variant="glass"
        glow={true}
        placeholder="Glass with glow"
        helperText="Glass variant with glow effect"
      />
      <Select
        options={defaultOptions}
        label="Gradient + Pulse"
        variant="gradient"
        pulse={true}
        placeholder="Gradient with pulse"
        helperText="Gradient variant with pulse animation"
      />
      <Select
        options={countryOptions}
        label="All Effects"
        variant="glass"
        glow={true}
        pulse={true}
        placeholder="All effects combined"
        helperText="Glass with glow and pulse effects"
      />
    </Stack>
  ),
};

export const DisabledState: Story = {
  args: {
    options: defaultOptions,
    label: 'Disabled Select',
    placeholder: 'Cannot interact',
    disabled: true,
    helperText: 'This select is disabled',
  },
};

export const Playground: Story = {
  args: {
    options: countryOptions,
    label: 'Playground Select',
    placeholder: 'Choose an option',
    variant: 'default',
    size: 'medium',
    fullWidth: true,
    error: false,
    glow: false,
    pulse: false,
    helperText: 'This is a playground select component',
  },
};