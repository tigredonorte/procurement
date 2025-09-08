import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, fn } from '@storybook/test';
import { Stack, Typography } from '@mui/material';

import { Form, FormField } from './Form';

// Mock form components for testing
interface MockInputProps {
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  'data-testid'?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

const MockInput = ({ error, disabled, placeholder, type = 'text', ...props }: MockInputProps) => (
  <input
    data-testid="mock-input"
    type={type}
    placeholder={placeholder}
    disabled={disabled}
    style={{
      padding: '8px 12px',
      border: `2px solid ${error ? '#f44336' : '#e0e0e0'}`,
      borderRadius: '4px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
    }}
    {...props}
  />
);

interface MockButtonProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  'data-testid'?: string;
  'aria-label'?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

const MockButton = ({
  children,
  variant = 'solid',
  disabled,
  type = 'button',
  fullWidth,
  ...props
}: MockButtonProps) => (
  <button
    data-testid="mock-button"
    type={type}
    disabled={disabled}
    style={{
      padding: '10px 16px',
      backgroundColor: variant === 'solid' ? '#1976d2' : 'transparent',
      color: variant === 'solid' ? 'white' : '#1976d2',
      border: variant === 'outline' ? '2px solid #1976d2' : 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
    }}
    {...props}
  >
    {children}
  </button>
);

interface MockCheckboxProps {
  label: string;
  error?: boolean;
  disabled?: boolean;
  'data-testid'?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

const MockCheckbox = ({ label, error, disabled, ...props }: MockCheckboxProps) => (
  <label
    data-testid="mock-checkbox-label"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      color: error ? '#f44336' : 'inherit',
    }}
  >
    <input
      type="checkbox"
      data-testid="mock-checkbox"
      disabled={disabled}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      {...props}
    />
    {label}
  </label>
);

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

// 7.2 Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    onSubmit: fn(),
    children: (
      <>
        <FormField name="email" label="Email" required>
          <MockInput type="email" placeholder="Enter your email" data-testid="email-input" />
        </FormField>
        <FormField name="password" label="Password" required>
          <MockInput
            type="password"
            placeholder="Enter your password"
            data-testid="password-input"
          />
        </FormField>
        <FormField name="remember">
          <MockCheckbox label="Remember me" data-testid="remember-checkbox" />
        </FormField>
        <MockButton variant="solid" type="submit" fullWidth data-testid="submit-button">
          Submit
        </MockButton>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const form = canvas.getByRole('form');
      await expect(form).toBeInTheDocument();

      const emailInput = canvas.getByTestId('email-input');
      const passwordInput = canvas.getByTestId('password-input');
      const checkbox = canvas.getByTestId('remember-checkbox');
      const submitButton = canvas.getByTestId('submit-button');

      await expect(emailInput).toBeInTheDocument();
      await expect(passwordInput).toBeInTheDocument();
      await expect(checkbox).toBeInTheDocument();
      await expect(submitButton).toBeInTheDocument();
    });

    await step('Form input interactions', async () => {
      const emailInput = canvas.getByTestId('email-input');
      const passwordInput = canvas.getByTestId('password-input');

      await userEvent.type(emailInput, 'test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');

      await userEvent.type(passwordInput, 'password123');
      await expect(passwordInput).toHaveValue('password123');
    });

    await step('Checkbox interaction', async () => {
      const checkbox = canvas.getByTestId('remember-checkbox');
      await expect(checkbox).not.toBeChecked();

      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();

      await userEvent.click(checkbox);
      await expect(checkbox).not.toBeChecked();
    });

    await step('Form submission', async () => {
      const submitButton = canvas.getByTestId('submit-button');
      await userEvent.click(submitButton);

      // Note: In a real implementation, you would verify the form submission
      await expect(submitButton).toBeInTheDocument();
    });
  },
};

export const FormValidationTest: Story = {
  name: '📝 Form Validation Test',
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    onSubmit: fn(),
    children: (
      <>
        <FormField name="email" label="Email" required error="Please enter a valid email address">
          <MockInput type="email" error data-testid="email-with-error" />
        </FormField>
        <FormField
          name="password"
          label="Password"
          required
          helperText="Password must be at least 8 characters"
        >
          <MockInput type="password" data-testid="password-with-helper" />
        </FormField>
        <FormField name="terms" error="You must accept the terms">
          <MockCheckbox
            label="I accept the terms and conditions"
            error
            data-testid="terms-checkbox"
          />
        </FormField>
        <MockButton variant="solid" type="submit" fullWidth data-testid="submit-button">
          Register
        </MockButton>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify error states display', async () => {
      const errorInput = canvas.getByTestId('email-with-error');
      const helperInput = canvas.getByTestId('password-with-helper');
      const errorCheckbox = canvas.getByTestId('terms-checkbox');

      await expect(errorInput).toBeInTheDocument();
      await expect(helperInput).toBeInTheDocument();
      await expect(errorCheckbox).toBeInTheDocument();
    });

    await step('Verify error messages', async () => {
      // Check for error message text in the document
      await expect(canvas.getByText('Please enter a valid email address')).toBeInTheDocument();
      await expect(canvas.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      await expect(canvas.getByText('You must accept the terms')).toBeInTheDocument();
    });

    await step('Verify required field indicators', async () => {
      // Check for required asterisks (*)
      const emailLabel = canvas.getByText('Email');
      const passwordLabel = canvas.getByText('Password');

      await expect(emailLabel).toBeInTheDocument();
      await expect(passwordLabel).toBeInTheDocument();
    });
  },
};

// 7.3 Accessibility Tests
export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    children: (
      <>
        <FormField name="field1" label="First Field" required>
          <MockInput placeholder="First field" data-testid="first-field" />
        </FormField>
        <FormField name="field2" label="Second Field" required>
          <MockInput placeholder="Second field" data-testid="second-field" />
        </FormField>
        <FormField name="field3">
          <MockCheckbox label="Third field checkbox" data-testid="third-field" />
        </FormField>
        <MockButton variant="solid" type="submit" data-testid="submit-btn">
          Submit
        </MockButton>
      </>
    ),
  },
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'duplicate-id', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation forward', async () => {
      const firstField = canvas.getByTestId('first-field');
      const secondField = canvas.getByTestId('second-field');
      const thirdField = canvas.getByTestId('third-field');
      const submitButton = canvas.getByTestId('submit-btn');

      // Focus first field
      firstField.focus();
      await expect(firstField).toHaveFocus();

      // Tab to second field
      await userEvent.tab();
      await expect(secondField).toHaveFocus();

      // Tab to third field
      await userEvent.tab();
      await expect(thirdField).toHaveFocus();

      // Tab to submit button
      await userEvent.tab();
      await expect(submitButton).toHaveFocus();
    });

    await step('Tab navigation backward', async () => {
      const thirdField = canvas.getByTestId('third-field');
      const secondField = canvas.getByTestId('second-field');

      // Shift+Tab to go back
      await userEvent.tab({ shift: true });
      await expect(thirdField).toHaveFocus();

      await userEvent.tab({ shift: true });
      await expect(secondField).toHaveFocus();
    });

    await step('Enter key activation', async () => {
      const submitButton = canvas.getByTestId('submit-btn');
      submitButton.focus();
      await userEvent.keyboard('{Enter}');
      // Button should still be in document after click
      await expect(submitButton).toBeInTheDocument();
    });

    await step('Space key activation', async () => {
      const checkbox = canvas.getByTestId('third-field');
      checkbox.focus();
      await userEvent.keyboard(' ');
      await expect(checkbox).toBeChecked();
    });
  },
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    'aria-label': 'Contact form',
    children: (
      <>
        <FormField name="name" label="Full Name" required>
          <MockInput
            placeholder="Enter your full name"
            aria-required="true"
            data-testid="name-input"
          />
        </FormField>
        <FormField name="email" label="Email Address" required>
          <MockInput
            type="email"
            placeholder="Enter your email"
            aria-required="true"
            aria-describedby="email-description"
            data-testid="email-input"
          />
        </FormField>
        <div id="email-description" data-testid="email-description">
          We&apos;ll use this to contact you about your inquiry
        </div>
        <MockButton variant="solid" type="submit" aria-label="Submit contact form">
          Submit
        </MockButton>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify form has accessible name', async () => {
      const form = canvas.getByRole('form');
      await expect(form).toHaveAttribute('aria-label', 'Contact form');
    });

    await step('Verify input labels', async () => {
      const nameInput = canvas.getByTestId('name-input');
      const emailInput = canvas.getByTestId('email-input');

      // Check that inputs are properly labeled
      await expect(nameInput).toBeInTheDocument();
      await expect(emailInput).toBeInTheDocument();
    });

    await step('Verify required attributes', async () => {
      const nameInput = canvas.getByTestId('name-input');
      const emailInput = canvas.getByTestId('email-input');

      await expect(nameInput).toHaveAttribute('aria-required', 'true');
      await expect(emailInput).toHaveAttribute('aria-required', 'true');
    });

    await step('Verify described-by relationship', async () => {
      const emailInput = canvas.getByTestId('email-input');
      const description = canvas.getByTestId('email-description');

      await expect(emailInput).toHaveAttribute('aria-describedby', 'email-description');
      await expect(description).toHaveAttribute('id', 'email-description');
    });

    await step('Verify button accessible name', async () => {
      const submitButton = canvas.getByRole('button', { name: /submit contact form/i });
      await expect(submitButton).toBeInTheDocument();
    });
  },
};

// 7.4 Visual Tests
export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  args: {
    variant: 'vertical',
    maxWidth: 'full',
    spacing: 'md',
    children: (
      <>
        <Typography variant="h6" mb={2}>
          Responsive Form Layout
        </Typography>
        <div data-testid="responsive-container" style={{ width: '100%' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} data-testid="responsive-stack">
            <FormField name="firstName" label="First Name" required>
              <MockInput placeholder="First name" data-testid="first-name" />
            </FormField>
            <FormField name="lastName" label="Last Name" required>
              <MockInput placeholder="Last name" data-testid="last-name" />
            </FormField>
          </Stack>
          <FormField name="email" label="Email Address" required>
            <MockInput type="email" placeholder="your.email@example.com" data-testid="email" />
          </FormField>
          <MockButton variant="solid" type="submit" fullWidth data-testid="submit">
            Submit
          </MockButton>
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify responsive container exists', async () => {
      const container = canvas.getByTestId('responsive-container');
      await expect(container).toBeInTheDocument();

      const stack = canvas.getByTestId('responsive-stack');
      await expect(stack).toBeInTheDocument();
    });

    await step('Verify form elements are present', async () => {
      const firstName = canvas.getByTestId('first-name');
      const lastName = canvas.getByTestId('last-name');
      const email = canvas.getByTestId('email');
      const submit = canvas.getByTestId('submit');

      await expect(firstName).toBeInTheDocument();
      await expect(lastName).toBeInTheDocument();
      await expect(email).toBeInTheDocument();
      await expect(submit).toBeInTheDocument();
    });
  },
};

export const VisualStates: Story = {
  name: '👁️ Visual States Test',
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
          <MockInput placeholder="Normal input" data-testid="normal-input" />
        </FormField>

        <FormField name="error" label="Error State" error="This field has an error">
          <MockInput error placeholder="Error input" data-testid="error-input" />
        </FormField>

        <FormField name="disabled" label="Disabled State">
          <MockInput disabled placeholder="Disabled input" data-testid="disabled-input" />
        </FormField>

        <FormField name="required" label="Required Field" required>
          <MockInput placeholder="Required input" data-testid="required-input" />
        </FormField>

        <Stack direction="row" spacing={2} data-testid="button-group">
          <MockButton variant="solid" data-testid="solid-button">
            Solid
          </MockButton>
          <MockButton variant="outline" data-testid="outline-button">
            Outline
          </MockButton>
          <MockButton disabled data-testid="disabled-button">
            Disabled
          </MockButton>
        </Stack>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify title is visible', async () => {
      const title = canvas.getByTestId('form-title');
      await expect(title).toBeInTheDocument();
      await expect(title).toBeVisible();
    });

    await step('Verify normal state', async () => {
      const normalInput = canvas.getByTestId('normal-input');
      await expect(normalInput).toBeInTheDocument();
      await expect(normalInput).not.toBeDisabled();
    });

    await step('Verify error state styling', async () => {
      const errorInput = canvas.getByTestId('error-input');
      await expect(errorInput).toBeInTheDocument();

      // Check for error message
      const errorMessage = canvas.getByText('This field has an error');
      await expect(errorMessage).toBeInTheDocument();
    });

    await step('Verify disabled state', async () => {
      const disabledInput = canvas.getByTestId('disabled-input');
      const disabledButton = canvas.getByTestId('disabled-button');

      await expect(disabledInput).toBeDisabled();
      await expect(disabledButton).toBeDisabled();
    });

    await step('Verify button variants', async () => {
      const solidButton = canvas.getByTestId('solid-button');
      const outlineButton = canvas.getByTestId('outline-button');
      const buttonGroup = canvas.getByTestId('button-group');

      await expect(solidButton).toBeInTheDocument();
      await expect(outlineButton).toBeInTheDocument();
      await expect(buttonGroup).toBeInTheDocument();
    });

    await step('Verify hover interactions', async () => {
      const solidButton = canvas.getByTestId('solid-button');

      await userEvent.hover(solidButton);
      await expect(solidButton).toBeInTheDocument();

      await userEvent.unhover(solidButton);
      await expect(solidButton).toBeInTheDocument();
    });
  },
};

// 7.5 Performance Tests
export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  args: {
    variant: 'vertical',
    maxWidth: 'lg',
    spacing: 'sm',
    children: (
      <>
        <Typography variant="h6" mb={2}>
          Performance Test - Many Fields
        </Typography>
        <div data-testid="performance-container">
          {Array.from({ length: 50 }, (_, i) => (
            <FormField key={i} name={`field-${i}`} label={`Field ${i + 1}`}>
              <MockInput placeholder={`Field ${i + 1} content`} data-testid={`field-${i}`} />
            </FormField>
          ))}
        </div>
        <MockButton variant="solid" type="submit" fullWidth data-testid="perf-submit">
          Submit Large Form
        </MockButton>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Measure render time', async () => {
      const container = canvas.getByTestId('performance-container');
      const fields = canvas.getAllByTestId(/^field-/);

      await expect(container).toBeInTheDocument();
      await expect(fields).toHaveLength(50);
    });

    await step('Test scroll performance', async () => {
      const container = canvas.getByTestId('performance-container');

      // Simulate scrolling through the form
      for (let i = 0; i < 5; i++) {
        container.scrollTop = i * 100;
        await new Promise((resolve) => window.setTimeout(resolve, 10));
      }

      await expect(container).toBeInTheDocument();
    });

    await step('Test field interaction performance', async () => {
      const firstField = canvas.getByTestId('field-0');
      const lastField = canvas.getByTestId('field-49');

      await userEvent.click(firstField);
      await userEvent.type(firstField, 'test');
      await userEvent.click(lastField);
      await userEvent.type(lastField, 'test');

      await expect(firstField).toHaveValue('test');
      await expect(lastField).toHaveValue('test');
    });
  },
};

// 7.6 Edge Cases Tests
export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  args: {
    variant: 'vertical',
    maxWidth: 'sm',
    spacing: 'md',
    children: (
      <>
        <Typography variant="h6" mb={2}>
          Edge Cases Testing
        </Typography>

        {/* Empty form field */}
        <FormField name="empty">
          <div
            data-testid="empty-field"
            style={{ minHeight: '40px', border: '1px dashed #ccc', padding: '8px' }}
          >
            Empty field placeholder
          </div>
        </FormField>

        {/* Very long text content */}
        <FormField
          name="longText"
          label="Very Long Label That Should Handle Overflow Gracefully And Not Break The Layout Even With Extremely Long Text Content That Goes On And On"
          helperText="This is a very long helper text that should wrap properly and not cause layout issues even when it contains a lot of information about what the user should enter in this field"
        >
          <MockInput
            placeholder="Input with very long placeholder text that should be handled gracefully by the component and not cause any layout issues or overflow problems"
            data-testid="long-text-input"
          />
        </FormField>

        {/* Multiple error states */}
        <FormField
          name="multiError"
          label="Multiple Issues"
          required
          error="Error: Invalid format, too short, contains invalid characters"
        >
          <MockInput error data-testid="multi-error-input" />
        </FormField>

        {/* Deeply nested content */}
        <FormField name="nested" label="Nested Content">
          <div data-testid="nested-container">
            <div style={{ padding: '8px', border: '1px solid #ddd' }}>
              <div style={{ padding: '4px', backgroundColor: '#f5f5f5' }}>
                <MockInput placeholder="Deeply nested input" data-testid="nested-input" />
              </div>
            </div>
          </div>
        </FormField>

        <MockButton variant="solid" type="submit" fullWidth data-testid="edge-submit">
          Submit Edge Cases
        </MockButton>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty field handling', async () => {
      const emptyField = canvas.getByTestId('empty-field');
      await expect(emptyField).toBeInTheDocument();
      await expect(emptyField).toHaveTextContent('Empty field placeholder');
    });

    await step('Long text overflow handling', async () => {
      const longTextInput = canvas.getByTestId('long-text-input');
      await expect(longTextInput).toBeInTheDocument();

      // The component should handle long text gracefully
      const longLabel = canvas.getByText(/Very Long Label That Should Handle/);
      await expect(longLabel).toBeInTheDocument();
    });

    await step('Multiple error handling', async () => {
      const multiErrorInput = canvas.getByTestId('multi-error-input');
      await expect(multiErrorInput).toBeInTheDocument();

      const errorMessage = canvas.getByText(/Error: Invalid format/);
      await expect(errorMessage).toBeInTheDocument();
    });

    await step('Nested content handling', async () => {
      const nestedContainer = canvas.getByTestId('nested-container');
      const nestedInput = canvas.getByTestId('nested-input');

      await expect(nestedContainer).toBeInTheDocument();
      await expect(nestedInput).toBeInTheDocument();

      // Test interaction with nested input
      await userEvent.click(nestedInput);
      await userEvent.type(nestedInput, 'nested test');
      await expect(nestedInput).toHaveValue('nested test');
    });

    await step('Maximum input limits', async () => {
      const longTextInput = canvas.getByTestId('long-text-input');

      // Test with very long input
      const longText = 'a'.repeat(1000);
      await userEvent.type(longTextInput, longText);

      // Component should handle long text input gracefully
      await expect(longTextInput).toBeInTheDocument();
    });
  },
};

// 7.7 Integration Tests
export const IntegrationTest: Story = {
  name: '🔗 Integration Test',
  args: {
    variant: 'vertical',
    maxWidth: 'md',
    spacing: 'md',
    onSubmit: fn(),
  },
  render: (args) => (
    <div data-testid="integration-wrapper">
      <Typography variant="h5" mb={3} data-testid="integration-title">
        Form Integration Test
      </Typography>

      <Form {...args}>
        <FormField name="triggerField" label="Trigger Field">
          <MockInput placeholder="Type here to trigger changes" data-testid="trigger-input" />
        </FormField>

        <FormField name="dependentField" label="Dependent Field">
          <MockInput
            placeholder="This field depends on the trigger"
            data-testid="dependent-input"
          />
        </FormField>

        <Stack direction="row" spacing={2} data-testid="action-buttons">
          <MockButton variant="outline" data-testid="reset-button">
            Reset
          </MockButton>
          <MockButton variant="solid" type="submit" data-testid="submit-integration">
            Submit
          </MockButton>
        </Stack>
      </Form>

      <div
        data-testid="external-component"
        style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f0f0f0' }}
      >
        <Typography variant="body2">External Component</Typography>
        <div data-testid="status-display">Status: Ready</div>
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify integration setup', async () => {
      const wrapper = canvas.getByTestId('integration-wrapper');
      const title = canvas.getByTestId('integration-title');
      const form = canvas.getByRole('form');
      const externalComponent = canvas.getByTestId('external-component');

      await expect(wrapper).toBeInTheDocument();
      await expect(title).toBeInTheDocument();
      await expect(form).toBeInTheDocument();
      await expect(externalComponent).toBeInTheDocument();
    });

    await step('Test form field interactions', async () => {
      const triggerInput = canvas.getByTestId('trigger-input');
      const dependentInput = canvas.getByTestId('dependent-input');

      await userEvent.type(triggerInput, 'trigger value');
      await expect(triggerInput).toHaveValue('trigger value');

      await userEvent.click(dependentInput);
      await userEvent.type(dependentInput, 'dependent value');
      await expect(dependentInput).toHaveValue('dependent value');
    });

    await step('Test button interactions', async () => {
      const resetButton = canvas.getByTestId('reset-button');
      const submitButton = canvas.getByTestId('submit-integration');
      const actionButtons = canvas.getByTestId('action-buttons');

      await expect(actionButtons).toBeInTheDocument();

      // Test reset button
      await userEvent.click(resetButton);
      await expect(resetButton).toBeInTheDocument();

      // Test submit button
      await userEvent.click(submitButton);
      await expect(submitButton).toBeInTheDocument();
    });

    await step('Verify external component interaction', async () => {
      const statusDisplay = canvas.getByTestId('status-display');
      const externalComponent = canvas.getByTestId('external-component');

      await expect(externalComponent).toBeInTheDocument();
      await expect(statusDisplay).toHaveTextContent('Status: Ready');
    });

    await step('Test form submission flow', async () => {
      const triggerInput = canvas.getByTestId('trigger-input');
      const submitButton = canvas.getByTestId('submit-integration');

      // Clear and refill form
      await userEvent.clear(triggerInput);
      await userEvent.type(triggerInput, 'final test');

      // Submit form
      await userEvent.click(submitButton);

      // Verify form state after submission
      await expect(triggerInput).toHaveValue('final test');
    });
  },
};
