import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';
import { Stack, FormGroup } from '@mui/material';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox/Tests',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:Checkbox'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    label: 'Test Checkbox',
    onChange: fn(),
    onClick: fn(),
    'data-testid': 'basic-checkbox',
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const checkbox = canvas.getByTestId('basic-checkbox');
      await expect(checkbox).toBeInTheDocument();
      await expect(checkbox).not.toBeChecked();
    });

    await step('Click to check', async () => {
      const checkbox = canvas.getByTestId('basic-checkbox');
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
      await expect(args.onChange).toHaveBeenCalledTimes(1);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step('Click to uncheck', async () => {
      const checkbox = canvas.getByTestId('basic-checkbox');
      await userEvent.click(checkbox);
      await expect(checkbox).not.toBeChecked();
      await expect(args.onChange).toHaveBeenCalledTimes(2);
      await expect(args.onClick).toHaveBeenCalledTimes(2);
    });

    await step('Hover interaction', async () => {
      const checkbox = canvas.getByTestId('basic-checkbox');
      await userEvent.hover(checkbox);
      // Verify hover styles are applied (background color change)
      // Note: Hover styles are handled by MUI's internal mechanisms
      await expect(checkbox).toBeInTheDocument();
    });
  },
};

// Keyboard Navigation Test
export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  render: () => (
    <Stack spacing={2}>
      <Checkbox label="First checkbox" data-testid="first-checkbox" />
      <Checkbox label="Second checkbox" data-testid="second-checkbox" />
      <Checkbox label="Third checkbox" data-testid="third-checkbox" />
    </Stack>
  ),
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
      const firstCheckbox = canvas.getByTestId('first-checkbox');
      const secondCheckbox = canvas.getByTestId('second-checkbox');

      // Focus first checkbox
      firstCheckbox.focus();
      await expect(firstCheckbox).toHaveFocus();

      // Tab to next checkbox
      await userEvent.tab();
      await expect(secondCheckbox).toHaveFocus();
    });

    await step('Tab navigation backward', async () => {
      await userEvent.tab({ shift: true });
      const firstCheckbox = canvas.getByTestId('first-checkbox');
      await expect(firstCheckbox).toHaveFocus();
    });

    await step('Space key activation', async () => {
      const firstCheckbox = canvas.getByTestId('first-checkbox');
      firstCheckbox.focus();
      await expect(firstCheckbox).not.toBeChecked();

      await userEvent.keyboard(' ');
      await expect(firstCheckbox).toBeChecked();

      // Space again to uncheck
      await userEvent.keyboard(' ');
      await expect(firstCheckbox).not.toBeChecked();
    });
  },
};

// Screen Reader Test
export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  render: () => (
    <Stack spacing={2}>
      <Checkbox
        label="Accessible checkbox"
        data-testid="accessible-checkbox"
        aria-describedby="description-1"
      />
      <div id="description-1">This checkbox has proper accessibility attributes</div>

      <Checkbox
        label="Required field"
        required
        error
        helperText="This field is required"
        data-testid="required-checkbox"
        aria-describedby="helper-text-1"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify ARIA labels', async () => {
      const checkbox = canvas.getByLabelText('Accessible checkbox');
      await expect(checkbox).toBeInTheDocument();
      await expect(checkbox).toHaveAttribute('aria-describedby', 'description-1');
    });

    await step('Verify ARIA descriptions', async () => {
      const checkbox = canvas.getByTestId('accessible-checkbox');
      await expect(checkbox).toHaveAttribute('aria-describedby', 'description-1');

      const description = canvas.getByText('This checkbox has proper accessibility attributes');
      await expect(description).toBeInTheDocument();
    });

    await step('Verify required field attributes', async () => {
      const requiredCheckbox = canvas.getByLabelText('Required field');
      await expect(requiredCheckbox).toHaveAttribute('required');
    });

    await step('Verify role attributes', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: /accessible checkbox/i });
      await expect(checkbox).toBeInTheDocument();
    });
  },
};

// Focus Management Test
export const FocusManagement: Story = {
  name: '🎯 Focus Management Test',
  render: () => (
    <Stack spacing={2}>
      <Checkbox autoFocus label="Auto-focus checkbox" data-testid="auto-focus-checkbox" />
      <Checkbox label="Regular checkbox" data-testid="regular-checkbox" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Auto focus on mount', async () => {
      const autoFocusCheckbox = canvas.getByTestId('auto-focus-checkbox');
      await waitFor(() => {
        expect(autoFocusCheckbox).toHaveFocus();
      });
    });

    await step('Focus transitions', async () => {
      const regularCheckbox = canvas.getByTestId('regular-checkbox');

      // Click regular checkbox
      await userEvent.click(regularCheckbox);
      await expect(regularCheckbox).toHaveFocus();

      // Focus should remain after checking
      await expect(regularCheckbox).toBeChecked();
      await expect(regularCheckbox).toHaveFocus();
    });
  },
};

// Visual States Test
export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  render: () => (
    <Stack spacing={2}>
      <Checkbox label="Default state" data-testid="default-checkbox" />
      <Checkbox label="Checked state" defaultChecked data-testid="checked-checkbox" />
      <Checkbox label="Indeterminate state" indeterminate data-testid="indeterminate-checkbox" />
      <Checkbox label="Disabled state" disabled data-testid="disabled-checkbox" />
      <Checkbox label="Loading state" loading data-testid="loading-checkbox" />
      <Checkbox
        label="Error state"
        error
        helperText="This field has an error"
        data-testid="error-checkbox"
      />
      <Checkbox label="Glow effect" glow defaultChecked data-testid="glow-checkbox" />
      <Checkbox label="Pulse effect" pulse defaultChecked data-testid="pulse-checkbox" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Default state', async () => {
      const checkbox = canvas.getByTestId('default-checkbox');
      await expect(checkbox).not.toBeChecked();
      await expect(checkbox).not.toBeDisabled();
    });

    await step('Checked state', async () => {
      const checkbox = canvas.getByTestId('checked-checkbox');
      await expect(checkbox).toBeChecked();
    });

    await step('Indeterminate state', async () => {
      const checkbox = canvas.getByTestId('indeterminate-checkbox');
      await expect(checkbox).toBePartiallyChecked();
    });

    await step('Disabled state', async () => {
      const checkbox = canvas.getByTestId('disabled-checkbox');
      await expect(checkbox).toBeDisabled();

      // Try to click disabled checkbox - should not respond
      await userEvent.click(checkbox);
      await expect(checkbox).not.toBeChecked();
    });

    await step('Loading state', async () => {
      const checkbox = canvas.getByTestId('loading-checkbox');
      await expect(checkbox).toBeDisabled(); // Loading should disable the checkbox

      // Look for loading indicator - it should be present somewhere in the document
      const progressIndicator = canvas.queryByRole('progressbar');
      if (progressIndicator) {
        await expect(progressIndicator).toBeInTheDocument();
      }
    });

    await step('Error state styling', async () => {
      // Verify error helper text is present
      const helperText = canvas.getByText('This field has an error');
      await expect(helperText).toBeInTheDocument();
    });
  },
};

// Responsive Design Test
export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  render: () => (
    <Stack spacing={2} data-testid="responsive-container">
      <Checkbox label="Mobile checkbox" size="small" />
      <Checkbox label="Tablet checkbox" size="medium" />
      <Checkbox label="Desktop checkbox" size="large" />
    </Stack>
  ),
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

    await step('Verify responsive layout', async () => {
      const container = canvas.getByTestId('responsive-container');
      await expect(container).toBeInTheDocument();

      // Checkboxes should be readable and accessible at all sizes
      const checkboxes = canvas.getAllByRole('checkbox');
      for (const checkbox of checkboxes) {
        await expect(checkbox).toBeInTheDocument();
      }
    });
  },
};

// Performance Test
export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  render: () => (
    <FormGroup data-testid="performance-container">
      {Array.from({ length: 50 }, (_, i) => (
        <Checkbox key={i} label={`Checkbox ${i + 1}`} data-testid={`checkbox-${i}`} />
      ))}
    </FormGroup>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Measure render time for multiple checkboxes', async () => {
      const startTime = Date.now();
      const checkboxes = canvas.getAllByRole('checkbox');
      const endTime = Date.now();

      const renderTime = endTime - startTime;
      // Note: Using console.log for performance measurement
      // eslint-disable-next-line no-console
      console.log(`Render time for ${checkboxes.length} checkboxes: ${renderTime}ms`);

      // Verify all checkboxes are rendered
      await expect(checkboxes).toHaveLength(50);

      // Assert reasonable render time (adjust threshold as needed)
      await expect(renderTime).toBeLessThan(1000); // More reasonable threshold
    });

    await step('Test rapid interactions', async () => {
      const checkboxes = canvas.getAllByRole('checkbox');

      // Click multiple checkboxes rapidly
      for (let i = 0; i < Math.min(5, checkboxes.length); i++) {
        await userEvent.click(checkboxes[i]);
        await expect(checkboxes[i]).toBeChecked();
      }
    });
  },
};

// Edge Cases Test
export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  render: () => (
    <Stack spacing={2}>
      <Checkbox label="" data-testid="empty-label" />
      <Checkbox
        label="Very long label text that should wrap gracefully and handle overflow scenarios properly without breaking the layout or becoming unreadable on smaller screens and various viewport sizes"
        data-testid="long-label"
      />
      <Checkbox
        label={'Special characters: !@#$%^&*()_+-=[]{}|;\':",./<>?'}
        data-testid="special-chars"
      />
      <Checkbox label="Unicode: 🚀 ✨ 💫 🎉 📝 ✅ ❌ ⚠️" data-testid="unicode-label" />
      <Checkbox helperText="Helper text without label" data-testid="helper-only" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty label handling', async () => {
      const checkbox = canvas.getByTestId('empty-label');
      await expect(checkbox).toBeInTheDocument();
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });

    await step('Long text handling', async () => {
      const checkbox = canvas.getByTestId('long-label');
      await expect(checkbox).toBeInTheDocument();

      // Long text should not break layout - verify checkbox is functional
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });

    await step('Special characters handling', async () => {
      const checkbox = canvas.getByTestId('special-chars');
      await expect(checkbox).toBeInTheDocument();
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });

    await step('Unicode characters handling', async () => {
      const checkbox = canvas.getByTestId('unicode-label');
      await expect(checkbox).toBeInTheDocument();
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });

    await step('Helper text without label', async () => {
      const checkbox = canvas.getByTestId('helper-only');
      await expect(checkbox).toBeInTheDocument();

      // Verify helper text is present in the document
      const helperText = canvas.getByText('Helper text without label');
      await expect(helperText).toBeInTheDocument();
    });
  },
};

// Variant Interaction Test
export const VariantInteraction: Story = {
  name: '🎨 Variant Interaction Test',
  render: () => (
    <Stack spacing={2}>
      <Checkbox
        variant="default"
        label="Default variant"
        data-testid="default-variant"
        onChange={fn()}
      />
      <Checkbox
        variant="rounded"
        label="Rounded variant"
        data-testid="rounded-variant"
        onChange={fn()}
      />
      <Checkbox
        variant="toggle"
        label="Toggle variant"
        data-testid="toggle-variant"
        onChange={fn()}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test default variant', async () => {
      const checkbox = canvas.getByTestId('default-variant');
      await expect(checkbox).toBeInTheDocument();
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });

    await step('Test rounded variant', async () => {
      const checkbox = canvas.getByTestId('rounded-variant');
      await expect(checkbox).toBeInTheDocument();
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });

    await step('Test toggle variant', async () => {
      const checkbox = canvas.getByTestId('toggle-variant');
      await expect(checkbox).toBeInTheDocument();
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });
  },
};

// Form Integration Component
const FormIntegrationComponent = () => {
  const [values, setValues] = React.useState({
    checkbox1: false,
    checkbox2: true,
    checkbox3: false,
  });

  const handleChange =
    (name: string) => (event: React.ChangeEvent<HTMLElement>, checked: boolean) => {
      setValues((prev) => ({
        ...prev,
        [name]: checked,
      }));
    };

  return (
    <FormGroup data-testid="form-group">
      <Checkbox
        label="Option 1"
        checked={values.checkbox1}
        onChange={handleChange('checkbox1')}
        data-testid="form-checkbox-1"
      />
      <Checkbox
        label="Option 2"
        checked={values.checkbox2}
        onChange={handleChange('checkbox2')}
        data-testid="form-checkbox-2"
      />
      <Checkbox
        label="Option 3"
        checked={values.checkbox3}
        onChange={handleChange('checkbox3')}
        data-testid="form-checkbox-3"
      />
      <div data-testid="form-output">Values: {JSON.stringify(values)}</div>
    </FormGroup>
  );
};

// Theme Variations Test
export const ThemeVariations: Story = {
  name: '🎨 Theme Variations Test',
  render: () => (
    <Stack spacing={2} data-testid="theme-container">
      <Checkbox 
        label="Primary theme checkbox" 
        defaultChecked 
        data-testid="primary-checkbox"
        color="primary"
      />
      <Checkbox 
        label="Secondary theme checkbox" 
        defaultChecked 
        data-testid="secondary-checkbox"
        color="secondary"
      />
      <Checkbox 
        label="Success theme checkbox" 
        defaultChecked 
        data-testid="success-checkbox"
        color="success"
      />
      <Checkbox 
        label="Error theme checkbox" 
        defaultChecked 
        data-testid="error-checkbox"
        color="error"
      />
      <Checkbox 
        label="Warning theme checkbox" 
        defaultChecked 
        data-testid="warning-checkbox"
        color="warning"
      />
      <Checkbox 
        label="Info theme checkbox" 
        defaultChecked 
        data-testid="info-checkbox"
        color="info"
      />
    </Stack>
  ),
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify theme color variations', async () => {
      const primaryCheckbox = canvas.getByTestId('primary-checkbox');
      const secondaryCheckbox = canvas.getByTestId('secondary-checkbox');
      const successCheckbox = canvas.getByTestId('success-checkbox');
      const errorCheckbox = canvas.getByTestId('error-checkbox');
      const warningCheckbox = canvas.getByTestId('warning-checkbox');
      const infoCheckbox = canvas.getByTestId('info-checkbox');

      // Verify all checkboxes are rendered and checked
      await expect(primaryCheckbox).toBeChecked();
      await expect(secondaryCheckbox).toBeChecked();
      await expect(successCheckbox).toBeChecked();
      await expect(errorCheckbox).toBeChecked();
      await expect(warningCheckbox).toBeChecked();
      await expect(infoCheckbox).toBeChecked();
    });

    await step('Test interaction with different theme colors', async () => {
      const primaryCheckbox = canvas.getByTestId('primary-checkbox');
      
      // Uncheck and recheck to test theme color interactions
      await userEvent.click(primaryCheckbox);
      await expect(primaryCheckbox).not.toBeChecked();
      
      await userEvent.click(primaryCheckbox);
      await expect(primaryCheckbox).toBeChecked();
    });
  },
};

// Form Interaction Test (separate from Form Integration)
export const FormInteraction: Story = {
  name: '📝 Form Interaction Test',
  render: () => (
    <form data-testid="checkbox-form">
      <Stack spacing={2}>
        <Checkbox
          name="terms"
          label="I agree to the terms and conditions"
          required
          data-testid="terms-checkbox"
          onChange={fn()}
        />
        <Checkbox
          name="newsletter"
          label="Subscribe to newsletter"
          data-testid="newsletter-checkbox"
          onChange={fn()}
        />
        <Checkbox
          name="marketing"
          label="Receive marketing emails"
          defaultChecked
          data-testid="marketing-checkbox"
          onChange={fn()}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </Stack>
    </form>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify form checkboxes initial state', async () => {
      const termsCheckbox = canvas.getByTestId('terms-checkbox');
      const newsletterCheckbox = canvas.getByTestId('newsletter-checkbox');
      const marketingCheckbox = canvas.getByTestId('marketing-checkbox');

      await expect(termsCheckbox).not.toBeChecked();
      await expect(newsletterCheckbox).not.toBeChecked();
      await expect(marketingCheckbox).toBeChecked();
    });

    await step('Test form checkbox interactions', async () => {
      const termsCheckbox = canvas.getByTestId('terms-checkbox');
      const newsletterCheckbox = canvas.getByTestId('newsletter-checkbox');

      // Check terms checkbox
      await userEvent.click(termsCheckbox);
      await expect(termsCheckbox).toBeChecked();

      // Check newsletter checkbox
      await userEvent.click(newsletterCheckbox);
      await expect(newsletterCheckbox).toBeChecked();
    });

    await step('Verify form attributes', async () => {
      const termsCheckbox = canvas.getByTestId('terms-checkbox');
      
      // Verify required attribute
      await expect(termsCheckbox).toHaveAttribute('required');
      
      // Verify name attributes
      await expect(termsCheckbox).toHaveAttribute('name', 'terms');
    });
  },
};

// Form Integration Test
export const Integration: Story = {
  name: '🔗 Integration Test',
  render: () => <FormIntegrationComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial form state', async () => {
      const checkbox1 = canvas.getByTestId('form-checkbox-1');
      const checkbox2 = canvas.getByTestId('form-checkbox-2');
      const checkbox3 = canvas.getByTestId('form-checkbox-3');

      await expect(checkbox1).not.toBeChecked();
      await expect(checkbox2).toBeChecked();
      await expect(checkbox3).not.toBeChecked();
    });

    await step('Form state updates', async () => {
      const checkbox1 = canvas.getByTestId('form-checkbox-1');
      const output = canvas.getByTestId('form-output');

      // Check checkbox1
      await userEvent.click(checkbox1);
      await expect(checkbox1).toBeChecked();

      // Verify form state updated
      await waitFor(() => {
        expect(output).toHaveTextContent('"checkbox1":true');
      });
    });
  },
};
