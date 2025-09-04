import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { Stack } from '@mui/material';

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'searchable', 'multi', 'creatable'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
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

export const Playground: Story = {
  args: {
    options: countryOptions,
    label: 'Playground Select',
    placeholder: 'Choose an option',
    size: 'medium',
    fullWidth: true,
    error: false,
    helperText: 'This is a playground select component',
  },
};