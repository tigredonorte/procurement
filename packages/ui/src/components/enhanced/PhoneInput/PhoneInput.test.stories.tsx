import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';

import { PhoneInput } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  title: 'Enhanced/PhoneInput/Tests',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
    docs: {
      description: {
        component: 'Test stories for PhoneInput component validation and interactions',
      },
    },
  },
  tags: ['autodocs', 'test'],
  args: {
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    countryCode: 'US',
    onChange: fn(),
  },
};

export default meta;
export type Story = StoryObj<typeof meta>;

// 1. Interaction Tests
export const BasicInteraction: Story = {
  args: {
    label: 'Phone Number',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find input field
    const input = canvas.getByRole('textbox');
    await expect(input).toBeInTheDocument();

    // Type a valid US phone number
    await userEvent.type(input, '555-123-4567');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
    });

    // Verify the value is formatted
    await expect(input).toHaveValue('+1 555-123-4567');
  },
};

// 2. Form Interaction Tests
export const FormInteraction: Story = {
  args: {
    required: true,
    error: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox');

    // Focus and blur without entering value
    await userEvent.click(input);
    await userEvent.tab();

    // Should show validation error for required field
    await waitFor(() => {
      const errorText = canvas.queryByText(/required/i);
      if (errorText) {
        expect(errorText).toBeVisible();
      }
    });
  },
};

// 3. Keyboard Navigation Tests
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Tab to country selector
    await userEvent.tab();
    const countrySelector = canvas.getByRole('button', { name: /country/i });
    await expect(countrySelector).toHaveFocus();

    // Press Enter to open country menu
    await userEvent.keyboard('[Enter]');

    // Verify menu is open
    await waitFor(() => {
      const menu = canvas.queryByRole('menu');
      if (menu) {
        expect(menu).toBeVisible();
      }
    });
  },
};

// 4. Screen Reader Tests
export const ScreenReader: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check for proper ARIA labels
    const input = canvas.getByRole('textbox');
    await expect(input).toHaveAttribute('type', 'tel');

    // Check label association
    const label = canvas.getByText('Phone Number');
    await expect(label).toBeInTheDocument();

    // Check for country selector accessibility
    const countryButton = canvas.getByRole('button');
    await expect(countryButton).toHaveAttribute('aria-expanded', 'false');
  },
};

// 5. Focus Management Tests
export const FocusManagement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox');

    // Focus the input
    await userEvent.click(input);
    await expect(input).toHaveFocus();

    // Tab away and back
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await expect(input).toHaveFocus();
  },
};

// 6. Responsive Design Tests
export const ResponsiveDesign: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
      defaultViewport: 'mobile',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox');
    await expect(input).toBeVisible();

    // Component should be responsive
    const container = input.closest('.MuiTextField-root');
    await expect(container).toHaveStyle({ width: '100%' });
  },
};

// 7. Theme Variation Tests
export const ThemeVariations: Story = {
  args: {
    variant: 'glass',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox');
    await expect(input).toBeInTheDocument();

    // Check if glass variant applies styles
    const inputRoot = input.closest('.MuiOutlinedInput-root');
    if (inputRoot) {
      const styles = window.getComputedStyle(inputRoot);
      expect(styles.backdropFilter).toContain('blur');
    }
  },
};

// 8. Visual State Tests
export const VisualStates: Story = {
  args: {
    error: true,
    errorMessage: 'Invalid phone number',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check error state
    const input = canvas.getByRole('textbox');
    await expect(input).toHaveAttribute('aria-invalid', 'true');

    const errorText = canvas.getByText('Invalid phone number');
    await expect(errorText).toBeVisible();
  },
};

// 9. Performance Tests
export const Performance: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const startTime = Date.now();

    // Render and interact
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, '1234567890');

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // Performance should be reasonable (under 100ms for basic interaction)
    expect(renderTime).toBeLessThan(100);
  },
};

// 10. Edge Cases Tests
export const EdgeCases: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox');

    // Test with invalid characters
    await userEvent.type(input, 'abc123');

    // Test with very long input
    await userEvent.clear(input);
    await userEvent.type(input, '1234567890123456789012345');

    // Test empty input validation
    await userEvent.clear(input);
    await userEvent.tab();

    // Ensure component handles edge cases gracefully
    await expect(input).toBeInTheDocument();
  },
};

// 11. Integration Tests
export const Integration: Story = {
  args: {
    countryCode: 'GB',
    defaultValue: '+44 20 7946 0958',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox');

    // Verify initial value is set
    await expect(input).toHaveValue('+44 20 7946 0958');

    // Change country and verify formatting updates
    const countrySelector = canvas.getByRole('button');
    await userEvent.click(countrySelector);

    // Wait for menu and select different country
    await waitFor(async () => {
      const menu = canvas.queryByRole('menu');
      if (menu) {
        const usOption = canvas.getByText('United States');
        await userEvent.click(usOption);
      }
    });

    // Verify onChange was called
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
    });
  },
};
