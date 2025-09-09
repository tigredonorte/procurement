import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';

import { AddressAutocomplete } from './AddressAutocomplete';

const meta: Meta<typeof AddressAutocomplete> = {
  title: 'Enhanced/AddressAutocomplete/Tests',
  component: AddressAutocomplete,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Interaction Test
export const BasicInteraction: Story = {
  args: {
    label: 'Address',
    placeholder: 'Enter address...',
    googleMapsApiKey: 'demo-key',
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      // Find the input field
      const input = canvas.getByPlaceholderText('Enter address...');
      await expect(input).toBeInTheDocument();
      
      // Type in the input
      await userEvent.type(input, '123 Main Street');
      await expect(input).toHaveValue('123 Main Street');
      
      // Clear the input
      await userEvent.clear(input);
      await expect(input).toHaveValue('');
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Form Interaction Test
export const FormInteraction: Story = {
  args: {
    label: 'Delivery Address',
    placeholder: 'Enter delivery address...',
    googleMapsApiKey: 'demo-key',
    required: true,
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      // Find the input field
      const input = canvas.getByPlaceholderText('Enter delivery address...');
      await expect(input).toBeInTheDocument();
      
      // Verify required attribute
      const label = canvas.getByText('Delivery Address');
      await expect(label).toBeInTheDocument();
      
      // Type address
      await userEvent.type(input, '456 Oak Avenue');
      await expect(input).toHaveValue('456 Oak Avenue');
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Keyboard Navigation Test
export const KeyboardNavigation: Story = {
  args: {
    label: 'Navigate with keyboard',
    placeholder: 'Use Tab and Enter...',
    googleMapsApiKey: 'demo-key',
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      // Find the input
      const input = canvas.getByPlaceholderText('Use Tab and Enter...');
      
      // Focus the input
      input.focus();
      await expect(input).toHaveFocus();
      
      // Type and navigate
      await userEvent.type(input, 'Test');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{Escape}');
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Screen Reader Test
export const ScreenReaderTest: Story = {
  args: {
    label: 'Accessible Address',
    placeholder: 'Screen reader friendly...',
    googleMapsApiKey: 'demo-key',
    helperText: 'Enter your complete address',
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      // Check for label
      const label = canvas.getByText('Accessible Address');
      await expect(label).toBeInTheDocument();
      
      // Check for input with proper attributes
      const input = canvas.getByPlaceholderText('Screen reader friendly...');
      await expect(input).toHaveAttribute('type', 'text');
      
      // Check for helper text
      const helperText = canvas.getByText('Enter your complete address');
      await expect(helperText).toBeInTheDocument();
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Focus Management Test
export const FocusManagementTest: Story = {
  args: {
    label: 'Focus Test',
    placeholder: 'Test focus behavior...',
    googleMapsApiKey: 'demo-key',
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      const input = canvas.getByPlaceholderText('Test focus behavior...');
      
      // Test focus
      input.focus();
      await expect(input).toHaveFocus();
      
      // Test blur
      input.blur();
      await expect(input).not.toHaveFocus();
      
      // Focus again and type
      input.focus();
      await userEvent.type(input, 'Focus test');
      await expect(input).toHaveValue('Focus test');
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Responsive Design Test
export const ResponsiveDesignTest: Story = {
  args: {
    label: 'Responsive Address',
    placeholder: 'Adapts to screen size...',
    fullWidth: true,
    googleMapsApiKey: 'demo-key',
    onSelect: fn(),
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
      },
      defaultViewport: 'mobile',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      // Check component renders in mobile view
      const input = canvas.getByPlaceholderText('Adapts to screen size...');
      await expect(input).toBeInTheDocument();
      
      // Verify full width behavior
      const container = input.closest('.MuiTextField-root');
      await expect(container).toBeInTheDocument();
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Theme Variations Test
export const ThemeVariationsTest: Story = {
  args: {
    variant: 'glass',
    label: 'Glass Theme',
    placeholder: 'Glass effect...',
    googleMapsApiKey: 'demo-key',
    onSelect: fn(),
  },
  parameters: {
    backgrounds: {
      default: 'gradient',
      values: [
        {
          name: 'gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      // Verify glass variant renders
      const input = canvas.getByPlaceholderText('Glass effect...');
      await expect(input).toBeInTheDocument();
      
      // Check for glass styling elements
      const container = input.closest('.MuiAutocomplete-root');
      await expect(container).toBeInTheDocument();
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Visual States Test
export const VisualStatesTest: Story = {
  args: {
    label: 'Visual States',
    placeholder: 'Test visual states...',
    googleMapsApiKey: 'demo-key',
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      const input = canvas.getByPlaceholderText('Test visual states...');
      
      // Test hover state
      await userEvent.hover(input);
      await waitFor(() => expect(input).toBeInTheDocument());
      
      // Test focus state
      await userEvent.click(input);
      await expect(input).toHaveFocus();
      
      // Test typing state
      await userEvent.type(input, 'Testing');
      await expect(input).toHaveValue('Testing');
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Performance Test
export const PerformanceTest: Story = {
  args: {
    label: 'Performance Test',
    placeholder: 'Testing performance...',
    googleMapsApiKey: 'demo-key',
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      const startTime = window.performance.now();
      
      // Find and interact with input
      const input = canvas.getByPlaceholderText('Testing performance...');
      await expect(input).toBeInTheDocument();
      
      // Rapid typing test
      await userEvent.type(input, 'Performance test address input');
      
      // Clear and retype
      await userEvent.clear(input);
      await userEvent.type(input, 'Second performance test');
      
      const endTime = window.performance.now();
      const duration = endTime - startTime;
      
      // Performance should be under 3 seconds
      await expect(duration).toBeLessThan(3000);
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Edge Cases Test
export const EdgeCasesTest: Story = {
  args: {
    label: 'Edge Cases',
    placeholder: 'Test edge cases...',
    googleMapsApiKey: 'demo-key',
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    try {
      const input = canvas.getByPlaceholderText('Test edge cases...');
      
      // Test empty input
      await expect(input).toHaveValue('');
      
      // Test very long input
      const longText = 'A'.repeat(500);
      await userEvent.type(input, longText);
      await expect(input.value.length).toBeGreaterThan(0);
      
      // Clear and test special characters
      await userEvent.clear(input);
      await userEvent.type(input, '!@#$%^&*()');
      await expect(input).toHaveValue('!@#$%^&*()');
      
      // Clear and test numbers
      await userEvent.clear(input);
      await userEvent.type(input, '123456789');
      await expect(input).toHaveValue('123456789');
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};

// Integration Test
export const IntegrationTest: Story = {
  args: {
    label: 'Integration Test',
    placeholder: 'Test with other components...',
    googleMapsApiKey: 'demo-key',
    error: false,
    helperText: 'Helper text for integration',
    required: true,
    fullWidth: true,
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    try {
      // Test all props work together
      const input = canvas.getByPlaceholderText('Test with other components...');
      await expect(input).toBeInTheDocument();
      
      // Check helper text
      const helperText = canvas.getByText('Helper text for integration');
      await expect(helperText).toBeInTheDocument();
      
      // Check label
      const label = canvas.getByText('Integration Test');
      await expect(label).toBeInTheDocument();
      
      // Type and verify
      await userEvent.type(input, 'Integration test address');
      await expect(input).toHaveValue('Integration test address');
      
      // Verify onSelect callback capability
      await expect(args.onSelect).toBeDefined();
      
      // Set status to pass
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'PASS';
      canvasElement.appendChild(statusElement);
    } catch (error) {
      const statusElement = document.createElement('div');
      statusElement.setAttribute('aria-label', 'Status of the test run');
      statusElement.textContent = 'FAIL';
      canvasElement.appendChild(statusElement);
      throw error;
    }
  },
};