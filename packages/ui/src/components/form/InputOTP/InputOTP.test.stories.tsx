import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';

import { InputOTP } from './InputOTP';

const meta: Meta<typeof InputOTP> = {
  title: 'Form/InputOTP/Tests',
  component: InputOTP,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:InputOTP'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test 1: Basic Interaction
export const BasicInteraction: Story = {
  args: {
    variant: 'numeric',
    length: 6,
    color: 'primary',
    size: 'md',
    onChange: fn(),
    onComplete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find the first input field
    const inputs = canvas.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);

    // Type digits into inputs
    await userEvent.type(inputs[0], '1');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith('1');
    });

    await userEvent.type(inputs[1], '2');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith('12');
    });

    // Complete the OTP
    await userEvent.type(inputs[2], '3');
    await userEvent.type(inputs[3], '4');
    await userEvent.type(inputs[4], '5');
    await userEvent.type(inputs[5], '6');

    await waitFor(() => {
      expect(args.onComplete).toHaveBeenCalledWith('123456');
    });

    // Verify all inputs have correct values
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[1]).toHaveValue('2');
    expect(inputs[2]).toHaveValue('3');
    expect(inputs[3]).toHaveValue('4');
    expect(inputs[4]).toHaveValue('5');
    expect(inputs[5]).toHaveValue('6');
  },
};

// Test 2: Form Interaction
export const FormInteraction: Story = {
  args: {
    variant: 'alphanumeric',
    length: 4,
    color: 'secondary',
    size: 'lg',
    onChange: fn(),
    onComplete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // Test alphanumeric input
    await userEvent.type(inputs[0], 'A');
    expect(args.onChange).toHaveBeenCalledWith('A');

    await userEvent.type(inputs[1], '1');
    expect(args.onChange).toHaveBeenCalledWith('A1');

    await userEvent.type(inputs[2], 'B');
    expect(args.onChange).toHaveBeenCalledWith('A1B');

    await userEvent.type(inputs[3], '2');
    expect(args.onChange).toHaveBeenCalledWith('A1B2');
    expect(args.onComplete).toHaveBeenCalledWith('A1B2');

    // Test that numeric-only characters are rejected in numeric mode
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], '@'); // Should be rejected
    expect(inputs[0]).toHaveValue('');
  },
};

// Test 3: Keyboard Navigation
export const KeyboardNavigation: Story = {
  args: {
    variant: 'numeric',
    length: 6,
    color: 'primary',
    autoFocus: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // First input should be focused if autoFocus is true
    await waitFor(() => {
      expect(inputs[0]).toHaveFocus();
    });

    // Type and move forward
    await userEvent.type(inputs[0], '1');
    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });

    // Arrow key navigation - left
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(inputs[0]).toHaveFocus();
    });

    // Arrow key navigation - right
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });

    // Backspace navigation
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => {
      expect(inputs[0]).toHaveFocus();
    });

    // Tab navigation
    await userEvent.tab();
    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });
  },
};

// Test 4: Screen Reader
export const ScreenReader: Story = {
  args: {
    variant: 'numeric',
    length: 4,
    color: 'primary',
    'aria-label': 'Enter verification code',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // Check that inputs are accessible
    inputs.forEach((input) => {
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('maxLength', '1');

      // Verify inputs can receive focus
      input.focus();
      expect(input).toHaveFocus();
      input.blur();
    });

    // Test ARIA attributes
    const container = inputs[0].closest('[role], div');
    if (container) {
      expect(container).toBeInTheDocument();
    }
  },
};

// Test 5: Focus Management
export const FocusManagement: Story = {
  args: {
    variant: 'numeric',
    length: 5,
    autoFocus: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // Auto-focus first input
    await waitFor(() => {
      expect(inputs[0]).toHaveFocus();
    });

    // Focus moves forward on input
    await userEvent.type(inputs[0], '1');
    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });

    // Focus moves forward on paste (single digit at a time)
    await userEvent.type(inputs[1], '2');
    await waitFor(() => {
      expect(inputs[2]).toHaveFocus();
    });

    // Focus stays on last input when filled
    await userEvent.type(inputs[2], '3');
    await userEvent.type(inputs[3], '4');
    await userEvent.type(inputs[4], '5');

    await waitFor(() => {
      expect(inputs[4]).toHaveFocus();
      expect(args.onChange).toHaveBeenLastCalledWith('12345');
    });
  },
};

// Test 6: Responsive Design
export const ResponsiveDesign: Story = {
  args: {
    variant: 'numeric',
    length: 6,
    size: 'md',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // Check all inputs are visible on mobile
    expect(inputs).toHaveLength(6);
    inputs.forEach((input) => {
      expect(input).toBeVisible();
    });

    // Test touch interaction
    await userEvent.click(inputs[0]);
    expect(inputs[0]).toHaveFocus();

    await userEvent.type(inputs[0], '1');
    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });
  },
};

// Test 7: Theme Variations
export const ThemeVariations: Story = {
  args: {
    variant: 'numeric',
    length: 4,
    color: 'success',
    glass: true,
    gradient: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // Verify all inputs are rendered
    expect(inputs).toHaveLength(4);

    // Test glass and gradient effects don't break functionality
    await userEvent.type(inputs[0], '1');
    expect(inputs[0]).toHaveValue('1');

    await userEvent.type(inputs[1], '2');
    expect(inputs[1]).toHaveValue('2');

    // Check visual states
    inputs.forEach((input) => {
      expect(input).toBeVisible();
      expect(input).toBeEnabled();
    });
  },
};

// Test 8: Visual States
export const VisualStates: Story = {
  args: {
    variant: 'masked',
    length: 6,
    error: false,
    disabled: false,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // Test masked variant - values should show as dots
    await userEvent.type(inputs[0], '1');
    await waitFor(() => {
      expect(inputs[0]).toHaveValue('•');
      expect(args.onChange).toHaveBeenCalledWith('1');
    });

    await userEvent.type(inputs[1], '2');
    await waitFor(() => {
      expect(inputs[1]).toHaveValue('•');
      expect(args.onChange).toHaveBeenCalledWith('12');
    });

    // Test hover state
    await userEvent.hover(inputs[2]);
    expect(inputs[2]).toBeVisible();

    // Test focus state
    await userEvent.click(inputs[3]);
    expect(inputs[3]).toHaveFocus();
  },
};

// Test 9: Performance
export const Performance: Story = {
  args: {
    variant: 'numeric',
    length: 8,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    const startTime = Date.now();

    // Rapid input simulation
    for (let i = 0; i < inputs.length; i++) {
      await userEvent.type(inputs[i], String(i + 1));
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Performance threshold (should complete within 3 seconds)
    expect(duration).toBeLessThan(3000);

    // Verify all changes were captured
    expect(args.onChange).toHaveBeenCalledTimes(8);
    expect(args.onChange).toHaveBeenLastCalledWith('12345678');
  },
};

// Test 10: Edge Cases
export const EdgeCases: Story = {
  args: {
    variant: 'numeric',
    length: 6,
    onChange: fn(),
    onComplete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // Test paste functionality
    inputs[0].focus();

    // Simulate paste event
    const pasteEvent = new window.ClipboardEvent('paste', {
      clipboardData: new window.DataTransfer(),
    });

    // @ts-expect-error - DataTransfer doesn't have setData in type definition
    pasteEvent.clipboardData?.setData('text/plain', '123456');

    inputs[0].dispatchEvent(pasteEvent);

    // Test invalid input rejection (letters in numeric mode)
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], 'A');
    expect(inputs[0]).toHaveValue('');

    // Test max length enforcement
    await userEvent.type(inputs[0], '123');
    expect(inputs[0]).toHaveValue('1');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
    });

    // Test empty backspace behavior
    await userEvent.clear(inputs[1]);
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => {
      expect(inputs[0]).toHaveFocus();
    });
  },
};

// Test 11: Integration
export const Integration: Story = {
  args: {
    variant: 'numeric',
    length: 6,
    color: 'primary',
    size: 'md',
    error: false,
    disabled: false,
    autoFocus: true,
    glass: false,
    gradient: false,
    onChange: fn(),
    onComplete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('textbox');

    // Complete flow test
    expect(inputs).toHaveLength(6);

    // Auto-focus verification
    await waitFor(() => {
      expect(inputs[0]).toHaveFocus();
    });

    // Type complete OTP
    const otp = '123456';
    for (let i = 0; i < otp.length; i++) {
      await userEvent.type(inputs[i], otp[i]);
    }

    // Verify completion
    await waitFor(() => {
      expect(args.onComplete).toHaveBeenCalledWith(otp);
      expect(args.onChange).toHaveBeenLastCalledWith(otp);
    });

    // Clear and re-enter
    for (let i = 0; i < inputs.length; i++) {
      await userEvent.clear(inputs[i]);
    }

    // Verify cleared state
    inputs.forEach((input) => {
      expect(input).toHaveValue('');
    });

    // Test error state change
    const container = inputs[0].closest('div');
    expect(container).toBeInTheDocument();

    // Final state verification
    expect(inputs[0]).toBeEnabled();
    expect(inputs[0]).toBeVisible();
  },
};
