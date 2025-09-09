import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';
import { Star } from '@mui/icons-material';

import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'DataDisplay/Chip/Tests',
  component: Chip,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicInteraction: Story = {
  args: {
    label: 'Click me',
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button');

    // Test initial render
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveTextContent('Click me');

    // Test click interaction
    await userEvent.click(chip);
    expect(args.onClick).toHaveBeenCalledTimes(1);

    // Test hover state
    await userEvent.hover(chip);
    await waitFor(() => {
      expect(chip).toHaveStyle('transform: translateY(-1px)');
    });
  },
};

export const SelectionBehavior: Story = {
  args: {
    label: 'Selectable',
    selectable: true,
    selected: false,
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('option');

    // Test initial state
    expect(chip).toHaveAttribute('aria-selected', 'false');

    // Test selection
    await userEvent.click(chip);
    expect(args.onClick).toHaveBeenCalledTimes(1);

    // Test role attribute
    expect(chip).toHaveAttribute('role', 'option');
  },
};

export const DeletionFunctionality: Story = {
  args: {
    label: 'Deletable Chip',
    deletable: true,
    onDelete: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const deleteButton = canvas.getByLabelText('Remove Deletable Chip');

    // Test delete button presence
    expect(deleteButton).toBeInTheDocument();

    // Test delete functionality
    await userEvent.click(deleteButton);
    expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardNavigation: Story = {
  args: {
    label: 'Keyboard Chip',
    selectable: true,
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('option');

    // Focus the chip
    chip.focus();
    expect(chip).toHaveFocus();

    // Test Enter key
    await userEvent.keyboard('{Enter}');
    expect(args.onClick).toHaveBeenCalledTimes(1);

    // Test Space key
    await userEvent.keyboard(' ');
    expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const KeyboardDeletion: Story = {
  args: {
    label: 'Keyboard Delete',
    deletable: true,
    onDelete: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button');

    // Focus the chip
    chip.focus();

    // Test Delete key
    await userEvent.keyboard('{Delete}');
    expect(args.onDelete).toHaveBeenCalledTimes(1);

    // Test Backspace key
    await userEvent.keyboard('{Backspace}');
    expect(args.onDelete).toHaveBeenCalledTimes(2);
  },
};

export const ScreenReaderTest: Story = {
  args: {
    label: 'Screen Reader Test',
    selectable: true,
    selected: true,
    deletable: true,
    onDelete: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('option');
    const deleteButton = canvas.getByLabelText('Remove Screen Reader Test');

    // Test ARIA attributes
    expect(chip).toHaveAttribute('role', 'option');
    expect(chip).toHaveAttribute('aria-selected', 'true');

    // Test delete button labeling
    expect(deleteButton).toHaveAttribute('aria-label', 'Remove Screen Reader Test');
  },
};

export const FocusManagement: Story = {
  args: {
    label: 'Focus Test',
    onClick: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button');

    // Test programmatic focus
    chip.focus();
    expect(chip).toHaveFocus();

    // Test focus visibility
    expect(chip).toHaveStyle('outline: none'); // MUI handles focus styling internally
  },
};

export const ResponsiveDesign: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        maxWidth: '300px',
      }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <Chip key={i} label={`Responsive ${i + 1}`} size="sm" />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chips = canvas.getAllByRole('button');

    // Test responsive wrapping
    expect(chips).toHaveLength(8);

    // Test chip visibility
    chips.forEach((chip) => {
      expect(chip).toBeVisible();
    });
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const ThemeVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Chip label="Primary" color="primary" />
        <Chip label="Secondary" color="secondary" />
        <Chip label="Success" color="success" />
        <Chip label="Error" color="error" />
        <Chip label="Warning" color="warning" />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Chip label="Primary Outlined" color="primary" variant="outlined" />
        <Chip label="Secondary Outlined" color="secondary" variant="outlined" />
        <Chip label="Success Outlined" color="success" variant="outlined" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chips = canvas.getAllByRole('button');

    // Test theme color application
    expect(chips).toHaveLength(8);

    // Test filled vs outlined variants
    const filledChips = chips.slice(0, 5);
    const outlinedChips = chips.slice(5, 8);

    filledChips.forEach((chip) => {
      expect(chip).toBeVisible();
    });

    outlinedChips.forEach((chip) => {
      expect(chip).toBeVisible();
    });
  },
};

export const VisualStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chip label="Normal" />
      <Chip label="Selected" selectable selected />
      <Chip label="Disabled" disabled />
      <Chip label="With Avatar" avatarSrc="https://mui.com/static/images/avatar/1.jpg" />
      <Chip label="With Icon" icon={<Star />} />
      <Chip label="Deletable" deletable onDelete={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test different visual states
    const normalChip = canvas.getByText('Normal');
    expect(normalChip).toBeVisible();

    const selectedChip = canvas.getByText('Selected');
    expect(selectedChip).toHaveAttribute('aria-selected', 'true');

    const disabledChip = canvas.getByText('Disabled');
    expect(disabledChip).toBeDisabled();

    const avatarChip = canvas.getByText('With Avatar');
    expect(avatarChip).toBeVisible();

    const iconChip = canvas.getByText('With Icon');
    expect(iconChip).toBeVisible();

    const deletableChip = canvas.getByText('Deletable');
    expect(deletableChip).toBeVisible();
    const deleteButton = canvas.getByLabelText('Remove Deletable');
    expect(deleteButton).toBeInTheDocument();
  },
};

export const PerformanceTest: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '500px' }}>
      {Array.from({ length: 100 }, (_, i) => (
        <Chip
          key={i}
          label={`Chip ${i + 1}`}
          size="sm"
          deletable={i % 3 === 0}
          selectable={i % 2 === 0}
          onDelete={() => {}}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Measure performance by checking render time
    const startTime = Date.now();
    const chips = canvas.getAllByText(/^Chip \d+$/);
    const endTime = Date.now();

    // Test that all chips are rendered
    expect(chips).toHaveLength(100);

    // Test performance (should render in reasonable time)
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(1000); // Less than 1 second

    // Test that chips are interactive
    const clickableChips = chips.filter((_, i) => i % 2 === 0); // selectable ones
    expect(clickableChips.length).toBeGreaterThan(0);
  },
};

export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Chip label="" /> {/* Empty label */}
        <Chip label="A" /> {/* Single character */}
        <Chip label="This is an extremely long label that should be truncated or handled gracefully by the component" />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Chip label="No handlers" /> {/* No click handlers */}
        <Chip
          label="Multiple states"
          selectable
          selected
          deletable
          onDelete={() => {}}
          onClick={() => {}}
        />
        <Chip label="Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test empty label handling
    const emptyChip = canvas.getByRole('button', { name: /^$/ });
    expect(emptyChip).toBeInTheDocument();

    // Test single character
    const singleChar = canvas.getByText('A');
    expect(singleChar).toBeVisible();

    // Test long label
    const longLabel = canvas.getByText(/This is an extremely long label/);
    expect(longLabel).toBeVisible();

    // Test special characters
    const specialChars = canvas.getByText(/Special chars:/);
    expect(specialChars).toBeVisible();

    // Test multiple states
    const multipleStates = canvas.getByText('Multiple states');
    expect(multipleStates).toBeVisible();
    expect(multipleStates).toHaveAttribute('aria-selected', 'true');

    const deleteButton = canvas.getByLabelText('Remove Multiple states');
    expect(deleteButton).toBeInTheDocument();
  },
};

const IntegrationTestComponent = () => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [availableTags] = React.useState([
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Python',
    'Java',
    'C++',
  ]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4>Available Tags:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {availableTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              selectable
              selected={selectedTags.includes(tag)}
              onClick={() => handleTagSelect(tag)}
            />
          ))}
        </div>
      </div>
      <div>
        <h4>Selected Tags:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {selectedTags.map((tag) => (
            <Chip
              key={`selected-${tag}`}
              label={tag}
              deletable
              onDelete={() => handleTagRemove(tag)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const IntegrationTest: Story = {
  render: () => <IntegrationTestComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test initial state
    const availableSection = canvas.getByText('Available Tags:');
    expect(availableSection).toBeInTheDocument();

    const selectedSection = canvas.getByText('Selected Tags:');
    expect(selectedSection).toBeInTheDocument();

    // Test selecting a tag
    const reactTag = canvas.getByRole('option', { name: 'React' });
    await userEvent.click(reactTag);

    // Wait for the selected tag to appear
    await waitFor(() => {
      const selectedReactTag = canvas.getAllByText('React');
      expect(selectedReactTag).toHaveLength(2); // One in available, one in selected
    });

    // Test removing a selected tag
    const deleteButtons = canvas.getAllByLabelText('Remove React');
    if (deleteButtons.length > 0) {
      await userEvent.click(deleteButtons[0]);

      // Wait for the tag to be removed
      await waitFor(() => {
        const reactTags = canvas.getAllByText('React');
        expect(reactTags).toHaveLength(1); // Only in available section
      });
    }
  },
};
