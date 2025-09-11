import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, fn } from '@storybook/test';
import { Star } from '@mui/icons-material';

import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'DataDisplay/Chip/Tests',
  component: Chip,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:Chip'],
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
        <Chip key={i} label={`Responsive ${i + 1}`} size="small" />
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
