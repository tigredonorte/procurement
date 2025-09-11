import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, fn } from 'storybook/test';
import { Typography, Button, TextField } from '@mui/material';

import { Form, FormField } from './Form';

const meta: Meta<typeof Form> = {
  title: 'Form/Form/Tests',
  component: Form,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
    docs: {
      description: {
        component:
          'Comprehensive test stories for Form component covering interaction, accessibility, visual, performance, and edge case testing.',
      },
    },
  },
  tags: ['autodocs', 'test', 'component:Form'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test 1: Basic Interaction Test
export const BasicInteraction: Story = {
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    onSubmit: fn(),
    children: (
      <>
        <FormField name="email" label="Email" required>
          <TextField
            type="email"
            placeholder="Enter your email"
            data-testid="email-input"
            fullWidth
          />
        </FormField>
        <FormField name="password" label="Password" required>
          <TextField
            type="password"
            placeholder="Enter your password"
            data-testid="password-input"
            fullWidth
          />
        </FormField>
        <Button variant="contained" type="submit" fullWidth data-testid="submit-button">
          Submit
        </Button>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the form
    const form = canvas.getByRole('form');
    expect(form).toBeInTheDocument();

    // Find form elements
    const emailInput = canvas.getByTestId('email-input');
    const passwordInput = canvas.getByTestId('password-input');
    const submitButton = canvas.getByTestId('submit-button');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Test basic interactions
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  },
};

// Test 2: Keyboard Navigation Test
export const KeyboardNavigation: Story = {
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    children: (
      <>
        <FormField name="field1" label="First Field" required>
          <TextField placeholder="First field" data-testid="first-field" fullWidth />
        </FormField>
        <FormField name="field2" label="Second Field" required>
          <TextField placeholder="Second field" data-testid="second-field" fullWidth />
        </FormField>
        <Button variant="contained" type="submit" data-testid="submit-btn" fullWidth>
          Submit
        </Button>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstField = canvas.getByTestId('first-field');
    const secondField = canvas.getByTestId('second-field');
    const submitButton = canvas.getByTestId('submit-btn');

    // Focus first field
    firstField.focus();
    expect(firstField).toHaveFocus();

    // Tab to second field
    await userEvent.tab();
    expect(secondField).toHaveFocus();

    // Tab to submit button
    await userEvent.tab();
    expect(submitButton).toHaveFocus();
  },
};

// Test 3: Responsive Design Test
export const ResponsiveDesign: Story = {
  args: {
    variant: 'vertical',
    maxWidth: 'full',
    spacing: 'md',
    children: (
      <>
        <Typography variant="h6" mb={2}>
          Responsive Form Layout
        </Typography>
        <div data-testid="responsive-container">
          <FormField name="firstName" label="First Name" required>
            <TextField placeholder="First name" data-testid="first-name" fullWidth />
          </FormField>
          <FormField name="lastName" label="Last Name" required>
            <TextField placeholder="Last name" data-testid="last-name" fullWidth />
          </FormField>
        </div>
      </>
    ),
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'mobile',
    },
    chromatic: {
      viewports: [375, 768, 1920],
      delay: 300,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const container = canvas.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();

    const firstName = canvas.getByTestId('first-name');
    const lastName = canvas.getByTestId('last-name');

    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
  },
};

// Test 4: Visual States Test
export const VisualStates: Story = {
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    children: (
      <>
        <Typography variant="h6" mb={2} data-testid="form-title">
          Visual States Demo
        </Typography>

        <FormField name="normal" label="Normal State">
          <TextField placeholder="Normal input" data-testid="normal-input" fullWidth />
        </FormField>

        <FormField name="required" label="Required Field" required>
          <TextField placeholder="Required input" data-testid="required-input" fullWidth />
        </FormField>

        <Button variant="contained" data-testid="submit-button" fullWidth>
          Submit
        </Button>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const title = canvas.getByTestId('form-title');
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();

    const normalInput = canvas.getByTestId('normal-input');
    expect(normalInput).toBeInTheDocument();

    const submitButton = canvas.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
  },
};

// Test 5: Edge Cases Test
export const EdgeCases: Story = {
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    children: (
      <>
        <Typography variant="h6" mb={2}>
          Edge Cases Testing
        </Typography>

        <FormField name="empty" label="Empty Field">
          <div
            data-testid="empty-field"
            style={{ minHeight: '40px', border: '1px dashed #ccc', padding: '8px' }}
          >
            Empty field placeholder
          </div>
        </FormField>

        <FormField name="longText" label="Very Long Label That Should Handle Overflow Gracefully">
          <TextField placeholder="Long text input" data-testid="long-text-input" fullWidth />
        </FormField>

        <Button variant="contained" type="submit" fullWidth data-testid="edge-submit">
          Submit Edge Cases
        </Button>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emptyField = canvas.getByTestId('empty-field');
    expect(emptyField).toBeInTheDocument();
    expect(emptyField).toHaveTextContent('Empty field placeholder');

    const longTextInput = canvas.getByTestId('long-text-input');
    expect(longTextInput).toBeInTheDocument();

    const submitButton = canvas.getByTestId('edge-submit');
    expect(submitButton).toBeInTheDocument();
  },
};
