import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Stack } from '@mui/material';

import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Form/Select/Tests',
  component: Select,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
];

const manyOptions = Array.from({ length: 50 }, (_, i) => ({
  value: `option${i + 1}`,
  label: `Option ${i + 1}`,
}));

// ==================== INTERACTION TESTS ====================

export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    options: defaultOptions,
    label: 'Test Select',
    placeholder: 'Select an option',
    onChange: fn(),
    'data-testid': 'test-select',
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const selectComponent = canvas.getByTestId('test-select');
      await expect(selectComponent).toBeInTheDocument();

      const selectElement = canvas.getByTestId('test-select-select');
      await expect(selectElement).toBeInTheDocument();
    });

    await step('Open select dropdown', async () => {
      const selectElement = canvas.getByTestId('test-select-select');
      await userEvent.click(selectElement);

      // Wait for dropdown to open (options render in portal, not in canvas)
      await waitFor(async () => {
        const option1 = document.querySelector('[data-testid="test-select-option-option1"]');
        await expect(option1).toBeInTheDocument();
      });
    });

    await step('Select an option', async () => {
      const option2 = document.querySelector(
        '[data-testid="test-select-option-option2"]',
      ) as HTMLElement;
      await userEvent.click(option2);

      await expect(args.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'option2',
          }),
        }),
        expect.any(Object),
      );
    });

    await step('Verify disabled option cannot be selected', async () => {
      const selectElement = canvas.getByTestId('test-select-select');
      await userEvent.click(selectElement);

      const disabledOption = document.querySelector('[data-testid="test-select-option-option4"]');
      await expect(disabledOption).toBeInTheDocument();
      await expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });
  },
};

export const FormInteraction: Story = {
  name: '📝 Form Interaction Test',
  args: {
    options: defaultOptions,
    label: 'Form Select',
    helperText: 'Select a value',
    onChange: fn(),
    'data-testid': 'form-select',
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step('Verify label association', async () => {
      const label = canvas.getByRole('label', { name: 'Form Select' });
      await expect(label).toBeInTheDocument();

      const selectElement = canvas.getByTestId('form-select-select');
      await expect(selectElement).toHaveAttribute('aria-labelledby');
    });

    await step('Verify helper text association', async () => {
      const helperText = canvas.getByText('Select a value');
      await expect(helperText).toBeInTheDocument();

      const selectElement = canvas.getByTestId('form-select-select');
      await expect(selectElement).toHaveAttribute('aria-describedby');
    });

    await step('Select multiple options in sequence', async () => {
      const selectElement = canvas.getByTestId('form-select-select');

      // Select first option
      await userEvent.click(selectElement);
      const option1 = document.querySelector(
        '[data-testid="form-select-option-option1"]',
      ) as HTMLElement;
      await userEvent.click(option1);
      await expect(args.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'option1',
          }),
        }),
        expect.any(Object),
      );

      // Select second option
      await userEvent.click(selectElement);
      const option2 = document.querySelector(
        '[data-testid="form-select-option-option2"]',
      ) as HTMLElement;
      await userEvent.click(option2);
      await expect(args.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'option2',
          }),
        }),
        expect.any(Object),
      );
    });
  },
};

const StateChangeTestComponent = () => {
  const [value, setValue] = React.useState<string>('');
  const [error, setError] = React.useState(false);

  return (
    <Stack spacing={2}>
      <Select
        options={defaultOptions}
        label="Stateful Select"
        value={value}
        error={error}
        helperText={error ? 'Please select an option' : 'Choose your preference'}
        onChange={(event) => {
          setValue(event.target.value as string);
          setError(false);
        }}
        data-testid="stateful-select"
      />
      <button onClick={() => setError(true)} data-testid="trigger-error">
        Trigger Error
      </button>
      <button onClick={() => setValue('')} data-testid="clear-value">
        Clear Value
      </button>
    </Stack>
  );
};

export const StateChangeTest: Story = {
  name: '🔄 State Change Test',
  render: () => <StateChangeTestComponent />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state', async () => {
      const selectElement = canvas.getByTestId('stateful-select-select');
      await expect(selectElement).toHaveAttribute('aria-expanded', 'false');
      // Check placeholder or empty state
      await expect(selectElement.querySelector('.MuiSelect-select')).toHaveTextContent('');

      const helperText = canvas.getByText('Choose your preference');
      await expect(helperText).toBeInTheDocument();
    });

    await step('Select option and verify state change', async () => {
      const selectElement = canvas.getByTestId('stateful-select-select');
      await userEvent.click(selectElement);

      const option1 = document.querySelector(
        '[data-testid="stateful-select-option-option1"]',
      ) as HTMLElement;
      await userEvent.click(option1);

      await waitFor(async () => {
        // Check the selected text content in the select element
        await expect(selectElement.querySelector('.MuiSelect-select')).toHaveTextContent(
          'Option 1',
        );
      });
    });

    await step('Trigger error state', async () => {
      const errorButton = canvas.getByTestId('trigger-error');
      await userEvent.click(errorButton);

      await waitFor(async () => {
        const helperText = canvas.getByText('Please select an option');
        await expect(helperText).toBeInTheDocument();
      });
    });

    await step('Clear value', async () => {
      const clearButton = canvas.getByTestId('clear-value');
      await userEvent.click(clearButton);

      await waitFor(async () => {
        const selectElement = canvas.getByTestId('stateful-select-select');
        // Check that the select is empty again
        await expect(selectElement.querySelector('.MuiSelect-select')).toHaveTextContent('');
      });
    });
  },
};

// ==================== ACCESSIBILITY TESTS ====================

export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  args: {
    options: defaultOptions,
    label: 'Keyboard Select',
    placeholder: 'Use keyboard to navigate',
    'data-testid': 'keyboard-select',
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

    await step('Focus select with tab', async () => {
      const selectElement = canvas.getByTestId('keyboard-select-select');
      const selectInput = selectElement.querySelector('.MuiSelect-select') as HTMLElement;
      selectInput.focus();
      await expect(selectInput).toHaveFocus();
    });

    await step('Open dropdown with Enter key', async () => {
      const selectElement = canvas.getByTestId('keyboard-select-select');
      const selectInput = selectElement.querySelector('.MuiSelect-select') as HTMLElement;
      selectInput.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(async () => {
        const option1 = document.querySelector('[data-testid="keyboard-select-option-option1"]');
        await expect(option1).toBeInTheDocument();
      });
    });

    await step('Navigate options with arrow keys', async () => {
      // Arrow down to next option
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');

      // Select with Enter
      await userEvent.keyboard('{Enter}');

      const selectElement = canvas.getByTestId('keyboard-select-select');
      await waitFor(async () => {
        // Check the selected text content
        await expect(selectElement.querySelector('.MuiSelect-select')).toHaveTextContent(
          'Option 2',
        );
      });
    });

    await step('Close dropdown with Escape', async () => {
      const selectElement = canvas.getByTestId('keyboard-select-select');
      await userEvent.click(selectElement);

      await userEvent.keyboard('{Escape}');

      // Verify dropdown is closed by checking if options are not visible
      await waitFor(async () => {
        const options = document.querySelectorAll('[data-testid^="keyboard-select-option-"]');
        expect(options.length).toBe(0);
      });
    });
  },
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  args: {
    options: defaultOptions,
    label: 'Accessible Select',
    helperText: 'This select has proper ARIA attributes',
    'aria-required': true,
    'data-testid': 'accessible-select',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify ARIA labels and roles', async () => {
      const selectElement = canvas.getByTestId('accessible-select-select');
      await expect(selectElement).toBeInTheDocument();
      await expect(selectElement).toHaveAttribute('role', 'combobox');
      await expect(selectElement).toHaveAttribute('aria-expanded', 'false');
    });

    await step('Verify label association', async () => {
      const label = canvas.getByText('Accessible Select');
      await expect(label).toBeInTheDocument();

      const selectElement = canvas.getByTestId('accessible-select-select');
      const labelId = selectElement.getAttribute('aria-labelledby');
      await expect(labelId).toBeTruthy();
    });

    await step('Verify helper text association', async () => {
      const helperText = canvas.getByText('This select has proper ARIA attributes');
      await expect(helperText).toBeInTheDocument();

      const selectElement = canvas.getByTestId('accessible-select-select');
      const describedBy = selectElement.getAttribute('aria-describedby');
      await expect(describedBy).toBeTruthy();
    });

    await step('Verify dropdown ARIA states', async () => {
      const selectElement = canvas.getByTestId('accessible-select-select');

      // Open dropdown
      await userEvent.click(selectElement);

      await waitFor(async () => {
        await expect(selectElement).toHaveAttribute('aria-expanded', 'true');
      });
    });
  },
};

export const FocusManagement: Story = {
  name: '🎯 Focus Management Test',
  render: () => (
    <Stack spacing={2}>
      <button data-testid="before-select">Before Select</button>
      <Select
        options={defaultOptions}
        label="Focus Test Select"
        placeholder="Test focus management"
        data-testid="focus-select"
      />
      <button data-testid="after-select">After Select</button>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation forward', async () => {
      const beforeButton = canvas.getByTestId('before-select');
      beforeButton.focus();
      await expect(beforeButton).toHaveFocus();

      await userEvent.tab();
      const selectElement = canvas.getByTestId('focus-select-select');
      await expect(selectElement).toHaveFocus();

      await userEvent.tab();
      const afterButton = canvas.getByTestId('after-select');
      await expect(afterButton).toHaveFocus();
    });

    await step('Tab navigation backward', async () => {
      await userEvent.tab({ shift: true });
      const selectElement = canvas.getByTestId('focus-select-select');
      await expect(selectElement).toHaveFocus();

      await userEvent.tab({ shift: true });
      const beforeButton = canvas.getByTestId('before-select');
      await expect(beforeButton).toHaveFocus();
    });

    await step('Focus returns to select after dropdown interaction', async () => {
      const selectElement = canvas.getByTestId('focus-select-select');
      selectElement.focus();

      // Open dropdown and select option
      await userEvent.keyboard('{Enter}');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      // Focus should return to select
      await waitFor(async () => {
        await expect(selectElement).toHaveFocus();
      });
    });
  },
};

// ==================== VISUAL TESTS ====================

export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  args: {
    options: defaultOptions,
    label: 'Responsive Select',
    helperText: 'This select adapts to different screen sizes',
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

    await step('Verify select renders on different viewports', async () => {
      const selectComponent = canvas.getByRole('combobox');
      await expect(selectComponent).toBeInTheDocument();
      await expect(selectComponent).toBeVisible();

      const computedStyle = window.getComputedStyle(selectComponent);
      await expect(computedStyle.display).not.toBe('none');
    });
  },
};

export const ThemeVariations: Story = {
  name: '🎨 Theme Variations Test',
  render: () => (
    <Stack spacing={3}>
      <Select
        options={defaultOptions}
        label="Default Theme"
        variant="default"
        data-testid="default-theme"
      />
      <Select
        options={defaultOptions}
        label="Glass Theme"
        variant="glass"
        data-testid="glass-theme"
      />
      <Select
        options={defaultOptions}
        label="Gradient Theme"
        variant="gradient"
        data-testid="gradient-theme"
      />
    </Stack>
  ),
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify all variants render correctly', async () => {
      const defaultSelect = canvas.getByTestId('default-theme-select');
      const glassSelect = canvas.getByTestId('glass-theme-select');
      const gradientSelect = canvas.getByTestId('gradient-theme-select');

      await expect(defaultSelect).toBeInTheDocument();
      await expect(glassSelect).toBeInTheDocument();
      await expect(gradientSelect).toBeInTheDocument();
    });

    await step('Verify theme-specific styling', async () => {
      const glassSelect = canvas.getByTestId('glass-theme-select');
      const computedStyle = window.getComputedStyle(glassSelect.closest('.MuiFormControl-root')!);

      // Glass variant should have backdrop filter
      await expect(computedStyle.backdropFilter || computedStyle.webkitBackdropFilter).toBeTruthy();
    });
  },
};

export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  render: () => (
    <Stack spacing={3}>
      <Select
        options={defaultOptions}
        label="Default State"
        placeholder="Default appearance"
        data-testid="default-state"
      />
      <Select
        options={defaultOptions}
        label="Error State"
        placeholder="Error appearance"
        error
        helperText="This field has an error"
        data-testid="error-state"
      />
      <Select
        options={defaultOptions}
        label="Disabled State"
        placeholder="Disabled appearance"
        disabled
        data-testid="disabled-state"
      />
      <Select
        options={defaultOptions}
        label="Glow Effect"
        placeholder="Glow appearance"
        glow
        data-testid="glow-state"
      />
      <Select
        options={defaultOptions}
        label="Pulse Effect"
        placeholder="Pulse appearance"
        pulse
        data-testid="pulse-state"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify default state', async () => {
      const defaultSelect = canvas.getByTestId('default-state-select');
      await expect(defaultSelect).toBeInTheDocument();
      await expect(defaultSelect).not.toBeDisabled();
    });

    await step('Verify error state styling', async () => {
      const errorSelect = canvas.getByTestId('error-state-select');
      await expect(errorSelect).toBeInTheDocument();

      const helperText = canvas.getByText('This field has an error');
      await expect(helperText).toBeInTheDocument();

      // Check if error styling is applied
      const formControl = errorSelect.closest('.MuiFormControl-root');
      await expect(formControl).toHaveClass('Mui-error');
    });

    await step('Verify disabled state', async () => {
      const disabledSelect = canvas.getByTestId('disabled-state-select');
      await expect(disabledSelect).toBeDisabled();

      const computedStyle = window.getComputedStyle(disabledSelect);
      await expect(parseFloat(computedStyle.opacity)).toBeLessThan(1);
    });

    await step('Verify visual effects', async () => {
      const glowSelect = canvas.getByTestId('glow-state');
      const pulseSelect = canvas.getByTestId('pulse-state');

      await expect(glowSelect).toBeInTheDocument();
      await expect(pulseSelect).toBeInTheDocument();
    });

    await step('Test hover interactions', async () => {
      const defaultSelect = canvas.getByTestId('default-state-select');
      await userEvent.hover(defaultSelect);

      // Verify the select can receive hover events
      await expect(defaultSelect).toBeInTheDocument();
    });
  },
};

// ==================== PERFORMANCE TESTS ====================

export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  args: {
    options: manyOptions,
    label: 'Performance Test Select',
    placeholder: 'Select from many options',
    'data-testid': 'performance-select',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Measure render time with many options', async () => {
      const startTime = Date.now();
      const selectElement = canvas.getByTestId('performance-select-select');
      await userEvent.click(selectElement);

      await waitFor(async () => {
        const options = document.querySelectorAll('[data-testid^="performance-select-option-"]');
        expect(options.length).toBeGreaterThan(0);
      });

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      // Log render time for debugging (allow console in tests)
      // eslint-disable-next-line no-console
      console.log(`Render time for ${manyOptions.length} options: ${renderTime}ms`);

      // Assert reasonable render time
      await expect(renderTime).toBeLessThan(2000);
    });

    await step('Test scroll performance in dropdown', async () => {
      const selectElement = canvas.getByTestId('performance-select-select');
      if (selectElement.getAttribute('aria-expanded') !== 'true') {
        await userEvent.click(selectElement);
      }

      // Wait for dropdown to be fully rendered
      await waitFor(async () => {
        const firstOption = document.querySelector(
          '[data-testid="performance-select-option-option1"]',
        );
        await expect(firstOption).toBeInTheDocument();
      });

      // Test selecting an option from the middle of the list
      const middleOption = document.querySelector(
        '[data-testid="performance-select-option-option25"]',
      ) as HTMLElement;
      await userEvent.click(middleOption);

      await waitFor(async () => {
        await expect(selectElement).toHaveDisplayValue('Option 25');
      });
    });
  },
};

// ==================== EDGE CASES TESTS ====================

export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  render: () => (
    <Stack spacing={3}>
      <Select
        options={[]}
        label="Empty Options"
        placeholder="No options available"
        data-testid="empty-options"
      />
      <Select
        options={[
          {
            value: 'very-long-option-value-that-might-cause-overflow-issues',
            label:
              'Very Long Option Label That Might Cause Layout Issues and Should Be Handled Gracefully by the Component Without Breaking the UI',
          },
          { value: 'short', label: 'Short' },
        ]}
        label="Long Text Test"
        placeholder="Test long text handling"
        data-testid="long-text"
      />
      <Select
        options={[
          { value: '', label: 'Empty Value Option' },
          { value: '0', label: 'Zero Value' },
          { value: 'false', label: 'False Value' },
          { value: 'null', label: 'Null String' },
        ]}
        label="Edge Values"
        placeholder="Test edge case values"
        data-testid="edge-values"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Handle empty options gracefully', async () => {
      const emptySelect = canvas.getByTestId('empty-options-select');
      await expect(emptySelect).toBeInTheDocument();

      // Should be able to click without errors
      await userEvent.click(emptySelect);

      // No options should be available
      const options = canvas.queryAllByTestId(/empty-options-option-/);
      expect(options.length).toBe(0);
    });

    await step('Handle long text gracefully', async () => {
      const longTextSelect = canvas.getByTestId('long-text-select');
      await userEvent.click(longTextSelect);

      const longOption = canvas.getByTestId(
        'long-text-option-very-long-option-value-that-might-cause-overflow-issues',
      );
      await expect(longOption).toBeInTheDocument();

      // Should be able to select the long option
      await userEvent.click(longOption);

      await waitFor(async () => {
        // The display value might be truncated, but should contain part of the text
        const displayValue = longTextSelect.getAttribute('value') || '';
        expect(displayValue).toBe('very-long-option-value-that-might-cause-overflow-issues');
      });
    });

    await step('Handle edge case values', async () => {
      const edgeValuesSelect = canvas.getByTestId('edge-values-select');
      await userEvent.click(edgeValuesSelect);

      // Test empty value option
      const emptyValueOption = document.querySelector(
        '[data-testid="edge-values-option-"]',
      ) as HTMLElement;
      await userEvent.click(emptyValueOption);

      await waitFor(async () => {
        await expect(edgeValuesSelect).toHaveDisplayValue('Empty Value Option');
      });

      // Test zero value option
      await userEvent.click(edgeValuesSelect);
      const zeroValueOption = document.querySelector(
        '[data-testid="edge-values-option-0"]',
      ) as HTMLElement;
      await userEvent.click(zeroValueOption);

      await waitFor(async () => {
        await expect(edgeValuesSelect).toHaveDisplayValue('Zero Value');
      });
    });

    await step('Verify component stability under stress', async () => {
      // Rapidly open and close select multiple times
      const longTextSelect = canvas.getByTestId('long-text-select');

      for (let i = 0; i < 5; i++) {
        await userEvent.click(longTextSelect);
        await userEvent.keyboard('{Escape}');
        await waitFor(() => {
          expect(longTextSelect).toHaveAttribute('aria-expanded', 'false');
        });
      }

      // Select should still be functional
      await expect(longTextSelect).toBeInTheDocument();
      await expect(longTextSelect).not.toBeDisabled();
    });
  },
};

// ==================== INTEGRATION TESTS ====================

const IntegrationTestComponent = () => {
  const [selectValue, setSelectValue] = React.useState('');
  const [relatedData, setRelatedData] = React.useState('');

  React.useEffect(() => {
    if (selectValue) {
      setRelatedData(`Related data for ${selectValue}`);
    } else {
      setRelatedData('');
    }
  }, [selectValue]);

  return (
    <Stack spacing={2}>
      <Select
        options={defaultOptions}
        label="Trigger Select"
        value={selectValue}
        onChange={(event) => setSelectValue(event.target.value as string)}
        data-testid="trigger-select"
      />
      <div data-testid="related-component">{relatedData || 'No data selected'}</div>
      <button onClick={() => setSelectValue('option1')} data-testid="external-trigger">
        Set Option 1 Externally
      </button>
    </Stack>
  );
};

export const IntegrationTest: Story = {
  name: '🔗 Integration Test',
  render: () => <IntegrationTestComponent />,

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial integration state', async () => {
      const relatedComponent = canvas.getByTestId('related-component');
      await expect(relatedComponent).toHaveTextContent('No data selected');
    });

    await step('Test select affecting related component', async () => {
      const selectElement = canvas.getByTestId('trigger-select-select');
      await userEvent.click(selectElement);

      const option2 = document.querySelector(
        '[data-testid="trigger-select-option-option2"]',
      ) as HTMLElement;
      await userEvent.click(option2);

      await waitFor(async () => {
        const relatedComponent = canvas.getByTestId('related-component');
        await expect(relatedComponent).toHaveTextContent('Related data for option2');
      });
    });

    await step('Test external control of select', async () => {
      const externalTrigger = canvas.getByTestId('external-trigger');
      await userEvent.click(externalTrigger);

      await waitFor(async () => {
        const selectElement = canvas.getByTestId('trigger-select-select');
        await expect(selectElement).toHaveDisplayValue('Option 1');

        const relatedComponent = canvas.getByTestId('related-component');
        await expect(relatedComponent).toHaveTextContent('Related data for option1');
      });
    });
  },
};
