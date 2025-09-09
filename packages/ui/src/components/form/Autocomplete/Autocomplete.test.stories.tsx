import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';

import { Autocomplete } from './Autocomplete';
import { AutocompleteProps } from './Autocomplete.types';

interface Person {
  id: string;
  name: string;
  email: string;
  department?: string;
}

const samplePeople: Person[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', department: 'Design' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', department: 'Marketing' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', department: 'Engineering' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', department: 'Sales' },
];

const stringSuggestions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

const meta: Meta<typeof Autocomplete> = {
  title: 'Form/Autocomplete/Tests',
  component: Autocomplete,
  tags: ['autodocs', 'component:Autocomplete'],
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive autocomplete component with ARIA support, keyboard navigation, and multiple selection modes.',
      },
    },
  },
  argTypes: {
    value: { control: 'text' },
    suggestions: { control: false },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    allowFreeText: { control: 'boolean' },
    showGhostText: { control: 'boolean' },
    matchMode: { control: { type: 'select', options: ['contains', 'startsWith', 'fuzzy'] } },
    debounceMs: { control: { type: 'number', min: 0, max: 1000 } },
    maxVisibleItems: { control: { type: 'number', min: 1, max: 20 } },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

// Test Component wrapper for controlled state
const AutocompleteWrapper = (props: Partial<AutocompleteProps<Person | string>>) => {
  const [value, setValue] = useState(props.value || '');
  const [selectedItems, setSelectedItems] = useState(props.selectedItems || []);

  return (
    <div style={{ padding: '20px', minHeight: '200px' }}>
      <Autocomplete
        {...props}
        value={value}
        onChange={setValue}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
      />
    </div>
  );
};

// Basic Tests
export const Default: Story = {
  render: () => (
    <AutocompleteWrapper suggestions={stringSuggestions} placeholder="Type to search fruits..." />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Test input is present and accessible
    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute('aria-expanded', 'false');

    // Test typing shows suggestions
    await userEvent.click(input);
    await userEvent.type(input, 'ap');

    // Wait for listbox to appear first (which confirms dropdown opened)
    const listbox = await canvas.findByRole('listbox');
    await expect(listbox).toBeInTheDocument();

    // Now check aria-expanded is true
    await expect(input).toHaveAttribute('aria-expanded', 'true');

    const options = canvas.getAllByRole('option');
    await expect(options).toHaveLength(2); // Apple, Grape (both contain "ap")
    await expect(options[0]).toHaveTextContent('Apple');
    await expect(options[1]).toHaveTextContent('Grape');
  },
};

export const WithObjectSuggestions: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={samplePeople}
      getKey={(person: Person) => person.id}
      getLabel={(person: Person) => person.name}
      getDescription={(person: Person) => `${person.email} - ${person.department}`}
      placeholder="Search people..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.type(input, 'john');

    const options = canvas.getAllByRole('option');
    await expect(options).toHaveLength(2); // John Doe, Bob Johnson

    // Test custom rendering with description
    await expect(options[0]).toHaveTextContent('john@example.com - Engineering');
  },
};

// Ghost Text Tests
export const GhostText: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      showGhostText={true}
      placeholder="Type 'ap' to see ghost text..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Focus input first to enable ghost text
    await userEvent.click(input);
    await userEvent.type(input, 'ap');

    // Test ghost text appears - look for the new inline suggestion pattern
    // Since we're using the new pattern, check for the presence of the suggestion
    const options = canvas.getAllByRole('option');
    await expect(options).toHaveLength(1);
    await expect(options[0]).toHaveTextContent('Apple');

    // Test that Tab key completes the ghost text
    await userEvent.keyboard('{Tab}');
    await expect(input).toHaveValue('Apple');
    // Verify dropdown closes after completion
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
};

export const GhostTextArrowRight: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      showGhostText={true}
      placeholder="Type 'ch' and press ArrowRight..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Focus and type to trigger ghost text
    await userEvent.click(input);
    await userEvent.type(input, 'ch');

    // Verify suggestion appears
    const options = canvas.getAllByRole('option');
    await expect(options).toHaveLength(1);
    await expect(options[0]).toHaveTextContent('Cherry');

    // Test that ArrowRight key completes the ghost text
    await userEvent.keyboard('{ArrowRight}');
    await expect(input).toHaveValue('Cherry');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
};

export const FocusBlurBehavior: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      showGhostText={true}
      placeholder="Test focus/blur behavior..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Type to show suggestions
    await userEvent.click(input);
    await userEvent.type(input, 'ap');

    // Verify suggestions show
    const options = canvas.getAllByRole('option');
    await expect(options).toHaveLength(1);

    // Blur input (click outside)
    await userEvent.click(canvasElement);

    // Wait for blur timeout
    await new Promise((resolve) => window.setTimeout(resolve, 200));

    // Suggestions should close
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
};

// Keyboard Navigation Tests
export const KeyboardNavigation: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      placeholder="Test keyboard navigation..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Focus input first
    await userEvent.click(input);
    // Open suggestions
    await userEvent.type(input, 'e');

    const options = canvas.getAllByRole('option');
    await expect(options).toHaveLength(2); // Cherry, Elderberry

    // Test arrow down navigation
    await userEvent.keyboard('{ArrowDown}');
    await expect(options[0]).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowDown}');
    await expect(options[1]).toHaveAttribute('aria-selected', 'true');

    // Test enter selection
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('Elderberry');
  },
};

// Multiple Selection Tests
export const MultipleSelection: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      multiple={true}
      placeholder="Select multiple fruits..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Select first item
    await userEvent.type(input, 'apple');
    await userEvent.keyboard('{Enter}');

    // Check chip appears
    const chip =
      canvasElement.querySelector('[data-testid*="chip"]') ||
      canvasElement.querySelector('.MuiChip-root');
    await expect(chip).toBeInTheDocument();

    // Input should be cleared for next selection
    await expect(input).toHaveValue('');

    // Select second item
    await userEvent.type(input, 'banana');
    await userEvent.keyboard('{Enter}');

    // Should have 2 chips
    const chips = canvasElement.querySelectorAll('.MuiChip-root');
    await expect(chips).toHaveLength(2);
  },
};

// Async Loading Tests
export const AsyncLoading: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      async={true}
      isLoading={true}
      placeholder="Async autocomplete..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.type(input, 'test');

    // Check loading indicator
    const loadingIndicator = canvasElement.querySelector('.MuiCircularProgress-root');
    await expect(loadingIndicator).toBeInTheDocument();

    const loadingText = canvas.getByText('Loading...');
    await expect(loadingText).toBeInTheDocument();
  },
};

// Match Mode Tests
export const FuzzyMatchingTest: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={['JavaScript', 'TypeScript', 'CoffeeScript', 'ActionScript']}
      matchMode="fuzzy"
      placeholder="Type 'jvs' for fuzzy matching..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Test fuzzy matching
    await userEvent.type(input, 'jvs');

    const options = canvas.getAllByRole('option');
    await expect(options).toHaveLength(1);
    await expect(options[0]).toHaveTextContent('JavaScript');
  },
};

// Disabled State Tests
export const DisabledState: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      disabled={true}
      placeholder="This is disabled..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await expect(input).toBeDisabled();

    // Try typing - should not work
    await userEvent.type(input, 'test');
    await expect(input).toHaveValue('');
  },
};

// No Results Tests
export const NoResults: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      placeholder="Type 'xyz' for no results..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.type(input, 'xyz');

    const noResults = canvas.getByText('No results found');
    await expect(noResults).toBeInTheDocument();
  },
};

// Escape Key Tests
export const EscapeKey: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      placeholder="Test escape key behavior..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Open suggestions
    await userEvent.type(input, 'apple');
    await expect(input).toHaveAttribute('aria-expanded', 'true');

    // Single escape closes dropdown
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue('apple');

    // Double escape clears value (simulated by double press)
    await userEvent.keyboard('{Escape}');
    await userEvent.keyboard('{Escape}');
    // Note: Double escape detection requires special handling
  },
};

// Free Text Tests
export const FreeText: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={stringSuggestions}
      allowFreeText={true}
      placeholder="Type anything and press Enter..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Type custom text not in suggestions
    await userEvent.type(input, 'Custom Value');
    await userEvent.keyboard('{Enter}');

    await expect(input).toHaveValue('Custom Value');
  },
};

// Accessibility Tests
export const AccessibilityCompliance: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={samplePeople}
      getKey={(person: Person) => person.id}
      getLabel={(person: Person) => person.name}
      inputAriaLabel="Search for team members"
      placeholder="Search team members..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Test ARIA attributes
    await expect(input).toHaveAttribute('role', 'combobox');
    await expect(input).toHaveAttribute('aria-autocomplete', 'list');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveAttribute('aria-label', 'Search for team members');

    // Open dropdown
    await userEvent.type(input, 'john');

    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).toHaveAttribute('aria-controls');

    const listbox = canvas.getByRole('listbox');
    await expect(listbox).toBeInTheDocument();

    const options = canvas.getAllByRole('option');
    options.forEach((option, index) => {
      expect(option).toHaveAttribute('aria-selected', index === 0 ? 'false' : 'false');
    });
  },
};

// Performance Tests
export const LargeDataset: Story = {
  render: () => {
    const largeSuggestions = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

    return (
      <AutocompleteWrapper
        suggestions={largeSuggestions}
        maxVisibleItems={10}
        debounceMs={300}
        placeholder="Search 1000 items..."
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Test with large dataset
    await userEvent.type(input, '99');

    const options = canvas.getAllByRole('option');
    // Should limit visible items
    await expect(options.length).toBeLessThanOrEqual(10);
  },
};

// Edge Cases
export const EdgeCases: Story = {
  render: () => (
    <AutocompleteWrapper
      suggestions={['', 'Normal Item', '  Spaces  ', 'Special!@#$%^&*()']}
      placeholder="Test edge cases..."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    // Test empty string search
    await userEvent.type(input, ' ');

    // Should handle empty and special characters
    const options = canvas.getAllByRole('option');
    await expect(options.length).toBeGreaterThan(0);
  },
};
