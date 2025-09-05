import type { Meta, StoryObj } from '@storybook/react';
import { Form, FormField } from './Form';
import { Input } from '../Input';
import { Checkbox } from '../Checkbox';
import { Select } from '../Select';
import { Button } from '../Button';
import { Stack } from '@mui/material';

const meta = {
  title: 'Form/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal', 'inline', 'stepped'],
    },
    maxWidth: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    spacing: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'vertical',
    maxWidth: 'md',
    spacing: 'md',
    children: (
      <>
        <FormField name="email" label="Email" required>
          <Input type="email" placeholder="Enter your email" />
        </FormField>
        <FormField name="password" label="Password" required>
          <Input type="password" placeholder="Enter your password" />
        </FormField>
        <FormField name="remember">
          <Checkbox label="Remember me" />
        </FormField>
        <Button variant="solid" type="submit" fullWidth>
          Submit
        </Button>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'lg',
    children: (
      <>
        <FormField name="name" label="Full Name" required>
          <Input placeholder="John Doe" />
        </FormField>
        <FormField name="email" label="Email Address" required>
          <Input type="email" placeholder="john@example.com" />
        </FormField>
        <FormField name="role" label="Role" required>
          <Select
            options={[
              { value: 'admin', label: 'Administrator' },
              { value: 'user', label: 'User' },
              { value: 'guest', label: 'Guest' },
            ]}
            placeholder="Select a role"
          />
        </FormField>
        <FormField name="notifications">
          <Checkbox label="Send me notifications" />
        </FormField>
        <Stack direction="row" spacing={2}>
          <Button variant="outline" fullWidth>
            Cancel
          </Button>
          <Button variant="solid" type="submit" fullWidth>
            Save
          </Button>
        </Stack>
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
    maxWidth: 'lg',
    spacing: 'md',
    children: (
      <>
        <FormField name="firstName" label="First Name" required>
          <Input placeholder="Enter first name" />
        </FormField>
        <FormField name="lastName" label="Last Name" required>
          <Input placeholder="Enter last name" />
        </FormField>
        <FormField name="department" label="Department">
          <Select
            options={[
              { value: 'engineering', label: 'Engineering' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'sales', label: 'Sales' },
              { value: 'hr', label: 'Human Resources' },
            ]}
          />
        </FormField>
        <Button variant="gradient" type="submit">
          Submit Form
        </Button>
      </>
    ),
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
    children: (
      <>
        <Input placeholder="Search..." style={{ flex: 1 }} />
        <Select
          options={[
            { value: 'all', label: 'All Categories' },
            { value: 'products', label: 'Products' },
            { value: 'services', label: 'Services' },
          ]}
          style={{ minWidth: 150 }}
        />
        <Button variant="solid">Search</Button>
      </>
    ),
  },
};

export const WithValidation: Story = {
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    children: (
      <>
        <FormField 
          name="email" 
          label="Email" 
          required 
          error="Please enter a valid email address"
        >
          <Input type="email" error />
        </FormField>
        <FormField 
          name="password" 
          label="Password" 
          required
          helperText="Password must be at least 8 characters"
        >
          <Input type="password" />
        </FormField>
        <FormField name="terms" error="You must accept the terms">
          <Checkbox label="I accept the terms and conditions" error />
        </FormField>
        <Button variant="solid" type="submit" fullWidth>
          Register
        </Button>
      </>
    ),
  },
};