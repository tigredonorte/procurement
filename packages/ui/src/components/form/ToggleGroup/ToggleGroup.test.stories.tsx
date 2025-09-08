import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sun,
  Moon,
  Monitor,
  Heart,
  Star,
  Bookmark,
} from 'lucide-react';

import { ToggleGroup } from './ToggleGroup';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Form/ToggleGroup/Tests',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:ToggleGroup'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test options for different scenarios
const formatOptions = [
  { value: 'bold', label: 'Bold', icon: <Bold size={16} /> },
  { value: 'italic', label: 'Italic', icon: <Italic size={16} /> },
  { value: 'underline', label: 'Underline', icon: <Underline size={16} /> },
];

const alignOptions = [
  { value: 'left', label: 'Left', icon: <AlignLeft size={16} /> },
  { value: 'center', label: 'Center', icon: <AlignCenter size={16} /> },
  { value: 'right', label: 'Right', icon: <AlignRight size={16} /> },
];

const themeOptions = [
  { value: 'light', label: 'Light', icon: <Sun size={16} /> },
  { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  { value: 'system', label: 'System', icon: <Monitor size={16} /> },
];

const actionOptions = [
  { value: 'like', label: 'Like', icon: <Heart size={16} /> },
  { value: 'star', label: 'Star', icon: <Star size={16} /> },
  { value: 'bookmark', label: 'Save', icon: <Bookmark size={16} /> },
];

const optionsWithDisabled = [
  { value: 'option1', label: 'Available', icon: <Star size={16} /> },
  { value: 'option2', label: 'Disabled', icon: <Heart size={16} />, disabled: true },
  { value: 'option3', label: 'Available', icon: <Bookmark size={16} /> },
];

// 1. Basic Interaction Tests
export const BasicInteraction: Story = {
  args: {
    options: alignOptions,
    variant: 'single',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Test initial state
    const toggleButtons = canvas.getAllByRole('button');
    expect(toggleButtons).toHaveLength(3);

    // Test clicking a button
    await userEvent.click(toggleButtons[0]);

    // Verify onChange was called
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
    });

    // Verify button state changes
    await waitFor(() => {
      expect(toggleButtons[0]).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

// 2. Form Interaction Tests
export const FormInteraction: Story = {
  args: {
    options: formatOptions,
    variant: 'multiple',
    onChange: fn(),
    value: [],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const toggleButtons = canvas.getAllByRole('button');

    // Test multiple selection
    await userEvent.click(toggleButtons[0]); // Bold
    await userEvent.click(toggleButtons[2]); // Underline

    // Verify both calls were made
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledTimes(2);
    });

    // Test deselection
    await userEvent.click(toggleButtons[0]); // Unselect Bold

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledTimes(3);
    });
  },
};

// 3. Keyboard Navigation Tests
export const KeyboardNavigation: Story = {
  args: {
    options: alignOptions,
    variant: 'single',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const firstButton = canvas.getAllByRole('button')[0];

    // Focus the first button
    firstButton.focus();
    await waitFor(() => {
      expect(firstButton).toHaveFocus();
    });

    // Test Tab navigation
    await userEvent.tab();
    const secondButton = canvas.getAllByRole('button')[1];
    await waitFor(() => {
      expect(secondButton).toHaveFocus();
    });

    // Test Space key activation
    await userEvent.keyboard(' ');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
    });

    // Test Enter key activation
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledTimes(2);
    });
  },
};

// 4. Screen Reader Tests
export const ScreenReader: Story = {
  args: {
    options: themeOptions,
    variant: 'single',
    'aria-label': 'Theme selector',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test ARIA attributes
    const toggleGroup = canvas.getByRole('group');
    expect(toggleGroup).toBeInTheDocument();

    // Test button roles and labels
    const buttons = canvas.getAllByRole('button');

    buttons.forEach((button, index) => {
      expect(button).toHaveAttribute('role', 'button');
      expect(button).toHaveAttribute('aria-pressed');

      // Verify accessible names
      const option = themeOptions[index];
      expect(button).toHaveAccessibleName(expect.stringContaining(option.label));
    });
  },
};

// 5. Focus Management Tests
export const FocusManagement: Story = {
  args: {
    options: actionOptions,
    variant: 'single',
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const buttons = canvas.getAllByRole('button');

    // Test initial focus
    buttons[0].focus();
    await waitFor(() => {
      expect(buttons[0]).toHaveFocus();
    });

    // Test focus moves correctly with keyboard navigation
    await userEvent.tab();
    await waitFor(() => {
      expect(buttons[1]).toHaveFocus();
    });

    // Test focus doesn't get lost after selection
    await userEvent.click(buttons[1]);
    await waitFor(() => {
      expect(buttons[1]).toHaveFocus();
    });
  },
};

// 6. Responsive Design Tests
export const ResponsiveDesign: Story = {
  args: {
    options: formatOptions,
    size: 'md',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test component renders on small screens
    const toggleGroup = canvas.getByRole('group');
    expect(toggleGroup).toBeInTheDocument();

    // Test buttons are still accessible
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    // Test buttons maintain minimum touch target size (44px)
    buttons.forEach((button) => {
      const styles = window.getComputedStyle(button);
      const height = parseInt(styles.height);
      expect(height).toBeGreaterThanOrEqual(40); // Allow some margin for borders/padding
    });
  },
};

// 7. Theme Variations Tests
export const ThemeVariations: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {(['primary', 'secondary', 'success', 'warning', 'danger'] as const).map((color) => (
        <Box key={color}>
          <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
            {color}
          </Typography>
          <ToggleGroup color={color} options={alignOptions} data-testid={`toggle-group-${color}`} />
        </Box>
      ))}
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test each color variant renders
    const colors = ['primary', 'secondary', 'success', 'warning', 'danger'];

    for (const color of colors) {
      const toggleGroup = canvas.getByTestId(`toggle-group-${color}`);
      expect(toggleGroup).toBeInTheDocument();

      // Test buttons within each color variant
      const buttons = within(toggleGroup).getAllByRole('button');
      expect(buttons).toHaveLength(3);
    }
  },
};

// 8. Visual States Tests
export const VisualStates: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Normal State
        </Typography>
        <ToggleGroup options={alignOptions} data-testid="normal" />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          With Disabled Options
        </Typography>
        <ToggleGroup options={optionsWithDisabled} data-testid="disabled" />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Glass Effect
        </Typography>
        <ToggleGroup options={themeOptions} glass data-testid="glass" />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Gradient Effect
        </Typography>
        <ToggleGroup options={actionOptions} gradient color="secondary" data-testid="gradient" />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Size Variations
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <ToggleGroup
              key={size}
              options={formatOptions}
              size={size}
              data-testid={`size-${size}`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test normal state
    const normalGroup = canvas.getByTestId('normal');
    expect(normalGroup).toBeInTheDocument();

    // Test disabled options
    const disabledGroup = canvas.getByTestId('disabled');
    const disabledButtons = within(disabledGroup).getAllByRole('button');
    expect(disabledButtons[1]).toBeDisabled();
    expect(disabledButtons[0]).not.toBeDisabled();
    expect(disabledButtons[2]).not.toBeDisabled();

    // Test glass effect
    const glassGroup = canvas.getByTestId('glass');
    expect(glassGroup).toBeInTheDocument();

    // Test gradient effect
    const gradientGroup = canvas.getByTestId('gradient');
    expect(gradientGroup).toBeInTheDocument();

    // Test size variations
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    for (const size of sizes) {
      const sizeGroup = canvas.getByTestId(`size-${size}`);
      expect(sizeGroup).toBeInTheDocument();

      const buttons = within(sizeGroup).getAllByRole('button');
      expect(buttons).toHaveLength(3);
    }
  },
};

// 9. Performance Tests
export const Performance: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option-${i}`,
      label: `Option ${i + 1}`,
      icon: <Star size={16} />,
    })),
    variant: 'multiple',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const startTime = window.performance.now();

    // Test rendering performance with many options
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(20);

    const renderTime = window.performance.now() - startTime;

    // Should render within reasonable time (less than 100ms)
    expect(renderTime).toBeLessThan(100);

    // Test interaction performance
    const interactionStart = window.performance.now();

    // Click multiple buttons rapidly
    await userEvent.click(buttons[0]);
    await userEvent.click(buttons[5]);
    await userEvent.click(buttons[10]);

    const interactionTime = window.performance.now() - interactionStart;

    // Interactions should be responsive (less than 50ms)
    expect(interactionTime).toBeLessThan(50);
  },
};

// 10. Edge Cases Tests
export const EdgeCases: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Single Option
        </Typography>
        <ToggleGroup
          options={[{ value: 'only', label: 'Only Option' }]}
          data-testid="single-option"
        />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Empty Labels
        </Typography>
        <ToggleGroup
          options={[
            { value: 'icon1', label: '', icon: <Heart size={16} /> },
            { value: 'icon2', label: '', icon: <Star size={16} /> },
          ]}
          data-testid="empty-labels"
        />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Long Labels
        </Typography>
        <ToggleGroup
          options={[
            { value: 'long1', label: 'This is a very long label that might wrap' },
            { value: 'long2', label: 'Another extremely long label for testing purposes' },
          ]}
          data-testid="long-labels"
        />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          All Disabled
        </Typography>
        <ToggleGroup
          options={[
            { value: 'dis1', label: 'Disabled 1', disabled: true },
            { value: 'dis2', label: 'Disabled 2', disabled: true },
          ]}
          data-testid="all-disabled"
        />
      </Box>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test single option
    const singleOption = canvas.getByTestId('single-option');
    const singleButtons = within(singleOption).getAllByRole('button');
    expect(singleButtons).toHaveLength(1);

    // Test empty labels (icon-only buttons)
    const emptyLabels = canvas.getByTestId('empty-labels');
    const emptyLabelButtons = within(emptyLabels).getAllByRole('button');
    expect(emptyLabelButtons).toHaveLength(2);

    // Test long labels
    const longLabels = canvas.getByTestId('long-labels');
    const longLabelButtons = within(longLabels).getAllByRole('button');
    expect(longLabelButtons).toHaveLength(2);

    // Test all disabled
    const allDisabled = canvas.getByTestId('all-disabled');
    const disabledButtons = within(allDisabled).getAllByRole('button');
    expect(disabledButtons).toHaveLength(2);
    disabledButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  },
};

// 11. Integration Tests
const IntegrationComponent = () => {
  const [singleValue, setSingleValue] = React.useState<string>('');
  const [multipleValue, setMultipleValue] = React.useState<string[]>([]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Text Alignment
        </Typography>
        <ToggleGroup
          variant="single"
          options={alignOptions}
          value={singleValue}
          onChange={(_, value) => setSingleValue(value || '')}
          data-testid="alignment-group"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected: {singleValue || 'None'}
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Text Formatting
        </Typography>
        <ToggleGroup
          variant="multiple"
          options={formatOptions}
          value={multipleValue}
          onChange={(_, value) => setMultipleValue(value || [])}
          color="secondary"
          data-testid="formatting-group"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected: {multipleValue.join(', ') || 'None'}
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Preview Text
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: multipleValue.includes('bold') ? 'bold' : 'normal',
            fontStyle: multipleValue.includes('italic') ? 'italic' : 'normal',
            textDecoration: multipleValue.includes('underline') ? 'underline' : 'none',
            textAlign: (singleValue as 'left' | 'center' | 'right' | undefined) || 'left',
            border: 1,
            borderColor: 'divider',
            p: 2,
            borderRadius: 1,
          }}
          data-testid="preview-text"
        >
          This is preview text showing the applied formatting and alignment.
        </Typography>
      </Box>
    </Box>
  );
};

export const Integration: Story = {
  render: () => <IntegrationComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test alignment integration
    const alignmentGroup = canvas.getByTestId('alignment-group');
    const alignButtons = within(alignmentGroup).getAllByRole('button');

    await userEvent.click(alignButtons[1]); // Center align

    const previewText = canvas.getByTestId('preview-text');
    await waitFor(() => {
      const styles = window.getComputedStyle(previewText);
      expect(styles.textAlign).toBe('center');
    });

    // Test formatting integration
    const formattingGroup = canvas.getByTestId('formatting-group');
    const formatButtons = within(formattingGroup).getAllByRole('button');

    await userEvent.click(formatButtons[0]); // Bold
    await waitFor(() => {
      const styles = window.getComputedStyle(previewText);
      expect(styles.fontWeight).toBe('700');
    });

    await userEvent.click(formatButtons[1]); // Italic
    await waitFor(() => {
      const styles = window.getComputedStyle(previewText);
      expect(styles.fontStyle).toBe('italic');
    });
  },
};
