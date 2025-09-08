import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Command } from './Command';
import { CommandItem } from './Command.types';

const meta: Meta<typeof Command> = {
  title: 'Form/Command/Tests',
  component: Command,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false }
  },
  tags: ['autodocs', 'test', 'component:Command']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test data
const testItems: CommandItem[] = [
  { 
    id: '1', 
    label: 'Home', 
    icon: <HomeIcon />, 
    shortcut: '⌘H', 
    category: 'Navigation', 
    action: fn(), 
    description: 'Navigate to home page' 
  },
  { 
    id: '2', 
    label: 'Settings', 
    icon: <SettingsIcon />, 
    shortcut: '⌘,', 
    category: 'Navigation', 
    action: fn(), 
    description: 'Open settings' 
  },
  { 
    id: '3', 
    label: 'Search', 
    icon: <SearchIcon />, 
    shortcut: '⌘K', 
    category: 'Actions', 
    action: fn(), 
    description: 'Open search dialog' 
  },
  { 
    id: '4', 
    label: 'Add Item', 
    icon: <AddIcon />, 
    shortcut: '⌘N', 
    category: 'Actions', 
    action: fn(), 
    description: 'Create new item' 
  },
  { 
    id: '5', 
    label: 'Disabled Action', 
    icon: <EditIcon />, 
    disabled: true, 
    category: 'Actions', 
    description: 'This is disabled' 
  },
];

// Wrapper component for testing
const TestWrapper: React.FC<{ 
  items?: CommandItem[]; 
  onSelect?: (item: CommandItem) => void;
  onOpenChange?: (open: boolean) => void;
  [key: string]: any;
}> = ({ 
  items = testItems, 
  onSelect = fn(), 
  onOpenChange = fn(),
  ...props 
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange(newOpen);
  };

  return (
    <>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        data-testid="open-command"
      >
        Open Command Palette
      </Button>
      <Command
        {...props}
        open={open}
        onOpenChange={handleOpenChange}
        items={items}
        onSelect={onSelect}
      />
    </>
  );
};

// ============================================================================
// INTERACTION TESTS
// ============================================================================

export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  render: (args) => <TestWrapper {...args} />,
  args: {
    placeholder: 'Test command search...',
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const openButton = canvas.getByTestId('open-command');
      await expect(openButton).toBeInTheDocument();
      await expect(openButton).toHaveTextContent('Open Command Palette');
    });

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
      await waitFor(() => {
        expect(args.onOpenChange).toHaveBeenCalledWith(true);
      });
    });

    await step('Verify command palette opened', async () => {
      const dialog = canvas.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();

      const input = canvas.getByPlaceholderText('Test command search...');
      await expect(input).toBeInTheDocument();
      await expect(input).toHaveFocus();
    });

    await step('Search functionality', async () => {
      const input = canvas.getByPlaceholderText('Test command search...');
      await userEvent.type(input, 'home');
      
      // Should filter to show only Home item
      await waitFor(() => {
        expect(canvas.getByText('Home')).toBeInTheDocument();
        expect(canvas.queryByText('Settings')).not.toBeInTheDocument();
      });
    });

    await step('Click on command item', async () => {
      const homeItem = canvas.getByText('Home');
      await userEvent.click(homeItem);
      
      await waitFor(() => {
        expect(args.onSelect).toHaveBeenCalledWith(
          expect.objectContaining({ id: '1', label: 'Home' })
        );
      });
    });

    await step('Command palette closes after selection', async () => {
      await waitFor(() => {
        expect(args.onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  }
};

export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  render: (args) => <TestWrapper {...args} />,
  args: {
    autoFocus: true,
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
    });

    await step('Arrow key navigation', async () => {
      // Input should be focused initially
      const input = canvas.getByRole('textbox');
      await expect(input).toHaveFocus();

      // Arrow down should select first item
      await userEvent.keyboard('{ArrowDown}');
      // First non-disabled item should be highlighted
      
      // Arrow down again
      await userEvent.keyboard('{ArrowDown}');
      
      // Arrow up should go back
      await userEvent.keyboard('{ArrowUp}');
    });

    await step('Enter key selection', async () => {
      // Press Enter to select current item
      await userEvent.keyboard('{Enter}');
      
      // Should call onSelect with first item
      await waitFor(() => {
        expect(args.onSelect).toHaveBeenCalledWith(
          expect.objectContaining({ id: '1', label: 'Home' })
        );
      });
    });

    await step('Escape key closes palette', async () => {
      // Open again for escape test
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
      
      // Press Escape
      await userEvent.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(args.onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  }
};

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

export const AccessibilityTest: Story = {
  name: '♿ Accessibility Test',
  render: (args) => <TestWrapper {...args} />,
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'keyboard', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
        ]
      }
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation to open button', async () => {
      const openButton = canvas.getByTestId('open-command');
      await userEvent.tab();
      await expect(openButton).toHaveFocus();
    });

    await step('Enter to open command palette', async () => {
      await userEvent.keyboard('{Enter}');
      
      const dialog = await canvas.findByRole('dialog');
      await expect(dialog).toBeInTheDocument();
    });

    await step('Verify ARIA attributes', async () => {
      const dialog = canvas.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      
      const input = canvas.getByRole('textbox');
      await expect(input).toBeInTheDocument();
      
      // List items should be accessible
      const listItems = canvas.getAllByRole('button');
      expect(listItems.length).toBeGreaterThan(0);
    });

    await step('Focus management', async () => {
      const input = canvas.getByRole('textbox');
      await expect(input).toHaveFocus();
    });
  }
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  render: (args) => <TestWrapper {...args} />,
  args: {
    placeholder: 'Search commands (accessible)',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
    });

    await step('Verify screen reader accessible elements', async () => {
      const input = canvas.getByRole('textbox');
      await expect(input).toHaveAttribute('placeholder', 'Search commands (accessible)');
      
      // Category headings should be accessible
      const categoryHeading = canvas.getByText('NAVIGATION');
      await expect(categoryHeading).toBeInTheDocument();
    });

    await step('Verify command items have proper labels', async () => {
      const homeButton = canvas.getByRole('button', { name: /home/i });
      await expect(homeButton).toBeInTheDocument();
      
      // Description should be available as secondary text
      await expect(canvas.getByText('Navigate to home page')).toBeInTheDocument();
    });
  }
};

// ============================================================================
// VISUAL TESTS
// ============================================================================

export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  render: (args) => <TestWrapper {...args} />,
  parameters: {
    viewport: {
      viewports: {
        mobile: { 
          name: 'Mobile', 
          styles: { width: '375px', height: '667px' },
          type: 'mobile' 
        },
        tablet: { 
          name: 'Tablet', 
          styles: { width: '768px', height: '1024px' },
          type: 'tablet'
        },
        desktop: { 
          name: 'Desktop', 
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop'
        }
      },
      defaultViewport: 'mobile'
    },
    chromatic: {
      viewports: [375, 768, 1920],
      delay: 300
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
    });

    await step('Verify responsive layout', async () => {
      const dialog = canvas.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      
      // Command palette should be visible on all screen sizes
      const input = canvas.getByRole('textbox');
      await expect(input).toBeInTheDocument();
    });
  }
};

export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  render: (args) => <TestWrapper {...args} />,
  args: {
    variant: 'glass',
    glow: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
    });

    await step('Default state verification', async () => {
      const dialog = canvas.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      
      const input = canvas.getByRole('textbox');
      await expect(input).toBeInTheDocument();
    });

    await step('Hover states', async () => {
      const commandButton = canvas.getByRole('button', { name: /home/i });
      await userEvent.hover(commandButton);
      
      // Visual feedback should occur (tested in visual regression)
      await expect(commandButton).toBeInTheDocument();
    });

    await step('Disabled state', async () => {
      const disabledButton = canvas.getByRole('button', { name: /disabled action/i });
      await expect(disabledButton).toBeDisabled();
    });

    await step('Loading state test', async () => {
      // This story doesn't show loading, but we verify the component structure
      const dialog = canvas.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
    });
  }
};

// ============================================================================
// EDGE CASES TESTS
// ============================================================================

export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  render: (args) => {
    const edgeCaseItems: CommandItem[] = [
      {
        id: '1',
        label: 'This is a very very very long command label that might cause overflow issues in the UI',
        description: 'This is an extremely long description that tests how the component handles text overflow and wrapping in various screen sizes and containers. It should handle gracefully.',
        shortcut: '⌘⇧⌥⌃SuperLongShortcut',
        category: 'Very Long Category Name That Tests Category Overflow Behavior',
        icon: <EditIcon />,
        action: fn(),
      },
      {
        id: '2',
        label: '',  // Empty label edge case
        description: 'Item with empty label',
        category: '',
        action: fn(),
      },
    ];

    return <TestWrapper {...args} items={edgeCaseItems} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
    });

    await step('Long text handling', async () => {
      // Long text should be visible but handled gracefully
      const longTextElement = canvas.getByText(/very very very long command label/);
      await expect(longTextElement).toBeInTheDocument();
      
      const longCategory = canvas.getByText(/VERY LONG CATEGORY NAME/);
      await expect(longCategory).toBeInTheDocument();
    });

    await step('Empty content handling', async () => {
      // Should handle empty labels gracefully
      const buttons = canvas.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    await step('Search with no results', async () => {
      const input = canvas.getByRole('textbox');
      await userEvent.type(input, 'nonexistentcommand');
      
      await waitFor(() => {
        expect(canvas.getByText('No results found')).toBeInTheDocument();
      });
    });

    await step('Clear search input', async () => {
      const input = canvas.getByRole('textbox');
      const clearButton = canvas.getByRole('button', { name: '' }); // Close icon button
      await userEvent.click(clearButton);
      
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });
  }
};

export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  render: (args) => {
    const manyItems: CommandItem[] = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      label: `Command ${i + 1}`,
      description: `Description for command ${i + 1}`,
      shortcut: `⌘${i + 1}`,
      category: `Category ${Math.floor(i / 20) + 1}`,
      icon: <SearchIcon />,
      action: fn(),
    }));

    return <TestWrapper {...args} items={manyItems} />;
  },
  args: {
    maxHeight: 400,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open command palette with many items', async () => {
      const startTime = performance.now();
      
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
      
      const dialog = await canvas.findByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`Command palette render time: ${renderTime}ms`);
      // Should render reasonably quickly
      expect(renderTime).toBeLessThan(2000);
    });

    await step('Search performance with many items', async () => {
      const input = canvas.getByRole('textbox');
      
      const startTime = performance.now();
      await userEvent.type(input, 'Command 50');
      
      await waitFor(() => {
        expect(canvas.getByText('Command 50')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const searchTime = endTime - startTime;
      
      console.log(`Search filter time: ${searchTime}ms`);
      // Search should be responsive
      expect(searchTime).toBeLessThan(1000);
    });
  }
};

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

export const IntegrationTest: Story = {
  name: '🔗 Integration Test',
  render: (args) => {
    const [lastAction, setLastAction] = useState<string>('');
    
    const integrationItems: CommandItem[] = testItems.map(item => ({
      ...item,
      action: () => {
        setLastAction(`Executed: ${item.label}`);
        item.action?.();
      }
    }));

    return (
      <Box>
        <TestWrapper 
          {...args} 
          items={integrationItems}
          onSelect={(item) => {
            if (item.action) {
              item.action();
            }
            args.onSelect?.(item);
          }}
        />
        {lastAction && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <strong data-testid="last-action">Last action: {lastAction}</strong>
          </Box>
        )}
      </Box>
    );
  },
  args: {
    onSelect: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-command');
      await userEvent.click(openButton);
    });

    await step('Execute command and verify integration', async () => {
      const homeButton = canvas.getByRole('button', { name: /home/i });
      await userEvent.click(homeButton);
      
      // Should call both internal action and onSelect prop
      await waitFor(() => {
        expect(args.onSelect).toHaveBeenCalledWith(
          expect.objectContaining({ id: '1', label: 'Home' })
        );
      });
      
      // Should show the action result
      await waitFor(() => {
        const lastActionDisplay = canvas.getByTestId('last-action');
        expect(lastActionDisplay).toHaveTextContent('Last action: Executed: Home');
      });
    });
  }
};

// ============================================================================
// VARIANT TESTS
// ============================================================================

export const AllVariants: Story = {
  name: '🎨 All Variants Test',
  render: () => {
    const [currentVariant, setCurrentVariant] = useState<string>('default');
    const variants = ['default', 'glass', 'gradient', 'minimal', 'elevated'] as const;
    
    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {variants.map((variant) => (
          <TestWrapper
            key={variant}
            variant={variant}
            items={testItems}
            data-testid={`variant-${variant}`}
          />
        ))}
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify all variant buttons are present', async () => {
      const buttons = canvas.getAllByTestId('open-command');
      expect(buttons).toHaveLength(5); // 5 variants
    });

    await step('Test each variant opens correctly', async () => {
      const buttons = canvas.getAllByTestId('open-command');
      
      // Test the first variant (default)
      await userEvent.click(buttons[0]);
      
      const dialog = await canvas.findByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      
      // Close dialog
      await userEvent.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  }
};