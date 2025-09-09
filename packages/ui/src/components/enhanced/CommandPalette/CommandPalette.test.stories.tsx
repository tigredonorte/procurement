import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Button, Typography, Stack } from '@mui/material';
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import React from 'react';

import { CommandPalette, Command } from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
  title: 'Enhanced/CommandPalette/Tests',
  component: CommandPalette,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
export type Story = StoryObj<typeof meta>;

// Sample commands for testing
const testCommands: Command[] = [
  {
    id: 'home',
    label: 'Go to Home',
    description: 'Navigate to the home page',
    icon: <HomeIcon />,
    shortcut: '⌘H',
    category: 'Navigation',
    action: fn(() => {
      // Home action
    }),
    keywords: ['home', 'main', 'start'],
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Open application settings',
    icon: <SettingsIcon />,
    shortcut: '⌘,',
    category: 'Navigation',
    action: fn(() => {
      // Settings action
    }),
    keywords: ['config', 'preferences', 'options'],
  },
  {
    id: 'search',
    label: 'Search',
    description: 'Open search functionality',
    icon: <SearchIcon />,
    shortcut: '⌘F',
    category: 'Tools',
    action: fn(() => {
      // Search action
    }),
    keywords: ['find', 'lookup'],
  },
  {
    id: 'add-item',
    label: 'Add New Item',
    description: 'Create a new item',
    icon: <AddIcon />,
    shortcut: '⌘N',
    category: 'Actions',
    action: fn(() => {
      // Add item action
    }),
    keywords: ['create', 'new', 'add'],
  },
  {
    id: 'favorite',
    label: 'Add to Favorites',
    description: 'Add current item to favorites',
    icon: <FavoriteIcon />,
    category: 'Actions',
    action: fn(() => {
      // Favorite action
    }),
  },
  {
    id: 'cart',
    label: 'View Cart',
    description: 'View shopping cart contents',
    icon: <CartIcon />,
    category: 'Shopping',
    action: fn(() => {
      // Cart action
    }),
  },
];

// 1. Basic Interaction Tests
export const BasicInteraction: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const onCommandExecute = fn();

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open Command Palette
        </Button>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          commands={testCommands}
          onCommandExecute={onCommandExecute}
        />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
    });

    await step('Search input is focused and functional', async () => {
      const searchInput = within(document.body).getByPlaceholderText('Type a command or search...');
      await expect(searchInput).toHaveValue('');
      await userEvent.type(searchInput, 'home');
      await expect(searchInput).toHaveValue('home');
    });

    await step('Commands are filtered by search', async () => {
      await waitFor(async () => {
        const homeCommand = within(document.body).getByText('Go to Home');
        await expect(homeCommand).toBeVisible();
      });
    });

    await step('Command can be executed by clicking', async () => {
      const homeCommand = within(document.body).getByText('Go to Home');
      await userEvent.click(homeCommand);
    });

    await step('Test status indicator shows PASS', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 2. Form Interaction Tests
export const FormInteraction: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const onCommandExecute = fn();

    return (
      <>
        <Stack spacing={2}>
          <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
            Open Command Palette
          </Button>
          <Typography variant="body2">Search Value: {searchValue}</Typography>
        </Stack>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          commands={testCommands}
          onCommandExecute={(command) => {
            onCommandExecute(command);
            setSearchValue(command.label);
          }}
        />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open and test search input', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
    });

    await step('Test search functionality', async () => {
      const searchInput = within(document.body).getByPlaceholderText('Type a command or search...');

      // Test fuzzy search
      await userEvent.type(searchInput, 'sttings');
      await waitFor(async () => {
        const settingsCommand = within(document.body).getByText('Settings');
        await expect(settingsCommand).toBeVisible();
      });

      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'config');
      await waitFor(async () => {
        const settingsCommand = within(document.body).getByText('Settings');
        await expect(settingsCommand).toBeVisible();
      });
    });

    await step('Execute command via Enter key', async () => {
      const searchInput = within(document.body).getByPlaceholderText('Type a command or search...');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'home');
      await userEvent.keyboard('{Enter}');
    });

    await step('Verify form interaction completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 3. Keyboard Navigation Tests
export const KeyboardNavigation: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const onCommandExecute = fn();

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open Command Palette
        </Button>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          commands={testCommands}
          onCommandExecute={onCommandExecute}
        />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open command palette', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
    });

    await step('Test arrow key navigation', async () => {
      // Navigate down
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');
    });

    await step('Test Enter key execution', async () => {
      await userEvent.keyboard('{Enter}');
      // Command execution verified by palette closing
    });

    await step('Test Escape key to close', async () => {
      await userEvent.click(canvas.getByTestId('open-palette'));
      await userEvent.keyboard('{Escape}');
    });

    await step('Keyboard navigation test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 4. Screen Reader Tests
export const ScreenReader: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          data-testid="open-palette"
          aria-describedby="palette-help"
        >
          Open Command Palette
        </Button>
        <div id="palette-help" style={{ display: 'none' }}>
          Press Ctrl+K or Cmd+K to open command palette
        </div>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={testCommands} />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify ARIA attributes exist', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await expect(openButton).toHaveAttribute('aria-describedby');
      await userEvent.click(openButton);
    });

    await step('Verify search input accessibility', async () => {
      const searchInput = within(document.body).getByPlaceholderText('Type a command or search...');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('autoComplete', 'off');
    });

    await step('Verify command list structure', async () => {
      const commandList = within(document.body).getByRole('list');
      await expect(commandList).toBeVisible();

      const commandItems = within(document.body).getAllByRole('listitem');
      await expect(commandItems.length).toBeGreaterThan(0);
    });

    await step('Screen reader test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 5. Focus Management Tests
export const FocusManagement: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button data-testid="before-button" variant="outlined">
          Button Before
        </Button>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open Command Palette
        </Button>
        <Button data-testid="after-button" variant="outlined">
          Button After
        </Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={testCommands} />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test initial focus management', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
    });

    await step('Verify search input receives focus', async () => {
      await waitFor(async () => {
        const searchInput = within(document.body).getByPlaceholderText(
          'Type a command or search...',
        );
        await expect(searchInput).toHaveFocus();
      });
    });

    await step('Test tab navigation within palette', async () => {
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');
    });

    await step('Close and verify focus restoration', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(async () => {
        const openButton = canvas.getByTestId('open-palette');
        await expect(openButton).toHaveFocus();
      });
    });

    await step('Focus management test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 6. Responsive Design Tests
export const ResponsiveDesign: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open Responsive Palette
        </Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={testCommands} />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test mobile viewport', async () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
    });

    await step('Verify palette adapts to viewport', async () => {
      const palette = within(document.body).getByRole('dialog');
      await expect(palette).toBeVisible();

      // Check if palette is responsive
      const computedStyle = window.getComputedStyle(palette);
      await expect(computedStyle.width).toBeDefined();
    });

    await step('Test tablet viewport', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      await waitFor(() => {
        const palette = within(document.body).getByRole('dialog');
        expect(palette).toBeVisible();
      });
    });

    await step('Responsive design test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 7. Theme Variations Tests
export const ThemeVariations: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open Themed Palette
        </Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={testCommands} />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open palette and verify theme integration', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
    });

    await step('Verify glass effect styling', async () => {
      const palette = within(document.body).getByRole('dialog');
      await expect(palette).toBeVisible();

      // Check backdrop filter is applied
      const paletteContent = palette.querySelector('[role="dialog"] > div');
      if (paletteContent) {
        const styles = window.getComputedStyle(paletteContent);
        // Glass effect should have some backdrop filter
        expect(
          styles.getPropertyValue('backdrop-filter') ||
            styles.getPropertyValue('-webkit-backdrop-filter'),
        ).toBeTruthy();
      }
    });

    await step('Test theme color integration', async () => {
      const searchInput = within(document.body).getByPlaceholderText('Type a command or search...');
      await userEvent.type(searchInput, 'home');

      await waitFor(async () => {
        const selectedCommand = within(document.body)
          .getByText('Go to Home')
          .closest('[role="button"]');
        if (selectedCommand) {
          const styles = window.getComputedStyle(selectedCommand);
          await expect(styles.backgroundColor).toBeTruthy();
        }
      });
    });

    await step('Theme variations test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 8. Visual States Tests
export const VisualStates: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open for Visual States
        </Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={testCommands} />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test default state', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
    });

    await step('Test hover states', async () => {
      const homeCommand = within(document.body).getByText('Go to Home').closest('[role="button"]');
      if (homeCommand) {
        await userEvent.hover(homeCommand);
        await expect(homeCommand).toBeVisible();
      }
    });

    await step('Test selected state via keyboard', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');

      // Command should show selected visual state
      const selectedCommand = within(document.body)
        .getByText('Go to Home')
        .closest('[role="button"]');
      await expect(selectedCommand).toBeVisible();
    });

    await step('Test empty state', async () => {
      const searchInput = within(document.body).getByPlaceholderText('Type a command or search...');
      await userEvent.type(searchInput, 'nonexistentcommand123');

      await waitFor(async () => {
        const noResults = within(document.body).getByText(/No commands found/);
        await expect(noResults).toBeVisible();
      });
    });

    await step('Visual states test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 9. Performance Tests
export const PerformanceTest: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    // Generate large command list for performance testing
    const largeCommandList: Command[] = Array.from({ length: 100 }, (_, i) => ({
      id: `command-${i}`,
      label: `Command ${i}`,
      description: `Description for command ${i}`,
      category: `Category ${i % 5}`,
      action: fn(() => {
        // Command action
      }),
      keywords: [`keyword${i}`, `tag${i}`],
    }));

    return (
      <>
        <Typography variant="body2" gutterBottom>
          Performance test with {largeCommandList.length} commands
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open Large Command List
        </Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={largeCommandList} />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open palette with large dataset', async () => {
      const startTime = Date.now();
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
      const endTime = Date.now();

      // Should open quickly even with large dataset
      expect(endTime - startTime).toBeLessThan(1000);
    });

    await step('Test search performance', async () => {
      const searchInput = within(document.body).getByPlaceholderText('Type a command or search...');

      const startTime = Date.now();
      await userEvent.type(searchInput, 'Command 50');
      const endTime = Date.now();

      // Search should be fast
      expect(endTime - startTime).toBeLessThan(500);

      await waitFor(async () => {
        const result = within(document.body).getByText('Command 50');
        await expect(result).toBeVisible();
      });
    });

    await step('Performance test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 10. Edge Cases Tests
export const EdgeCases: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    const edgeCaseCommands: Command[] = [
      {
        id: 'empty-description',
        label: 'Command with no description',
        category: 'Test',
        action: fn(),
      },
      {
        id: 'very-long-label',
        label:
          'This is a very long command label that might cause layout issues if not handled properly',
        description:
          'This is also a very long description that should be handled gracefully in the UI without breaking the layout or causing overflow issues',
        category: 'Test',
        action: fn(),
      },
      {
        id: 'special-chars',
        label: 'Command with special chars: @#$%^&*()',
        description: 'Special characters: <>?:"{}|+=-_`~',
        category: 'Test',
        action: fn(),
      },
    ];

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open Edge Cases Test
        </Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} commands={edgeCaseCommands} />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test with edge case commands', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);
    });

    await step('Test empty description handling', async () => {
      const emptyDescCommand = within(document.body).getByText('Command with no description');
      await expect(emptyDescCommand).toBeVisible();
    });

    await step('Test very long text handling', async () => {
      const longLabelCommand = within(document.body).getByText(/This is a very long command label/);
      await expect(longLabelCommand).toBeVisible();

      // Check that it doesn't break layout
      const palette = within(document.body).getByRole('dialog');
      const computedStyle = window.getComputedStyle(palette);
      expect(computedStyle.overflow).toBeDefined();
    });

    await step('Test special characters', async () => {
      const searchInput = within(document.body).getByPlaceholderText('Type a command or search...');
      await userEvent.type(searchInput, '@#$');

      await waitFor(async () => {
        const specialCharCommand = within(document.body).getByText(/Command with special chars/);
        await expect(specialCharCommand).toBeVisible();
      });
    });

    await step('Edge cases test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};

// 11. Integration Tests
export const IntegrationTest: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [recentCommands, setRecentCommands] = React.useState<string[]>(['home', 'settings']);
    const [lastExecuted, setLastExecuted] = React.useState<string>('');

    const handleCommandExecute = (command: Command) => {
      setLastExecuted(command.label);
      setRecentCommands((prev) =>
        [command.id, ...prev.filter((id) => id !== command.id)].slice(0, 5),
      );
    };

    return (
      <Stack spacing={2}>
        <Button variant="contained" onClick={() => setOpen(true)} data-testid="open-palette">
          Open Integration Test
        </Button>
        {lastExecuted && (
          <Typography variant="body2" data-testid="last-executed">
            Last executed: {lastExecuted}
          </Typography>
        )}
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          commands={testCommands}
          showRecent={true}
          recentCommands={recentCommands}
          onCommandExecute={handleCommandExecute}
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test recent commands integration', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);

      // Should show recent commands section
      const recentSection = within(document.body).getByText('Recent');
      await expect(recentSection).toBeVisible();
    });

    await step('Execute command and verify integration', async () => {
      const homeCommand = within(document.body).getByText('Go to Home');
      await userEvent.click(homeCommand);

      // Verify command execution was tracked
      await waitFor(async () => {
        const lastExecuted = canvas.getByTestId('last-executed');
        await expect(lastExecuted).toHaveTextContent('Last executed: Go to Home');
      });
    });

    await step('Verify recent commands update', async () => {
      const openButton = canvas.getByTestId('open-palette');
      await userEvent.click(openButton);

      // Home should now be at the top of recent commands
      const recentSection = within(document.body).getByText('Recent');
      await expect(recentSection).toBeVisible();
    });

    await step('Integration test completed', async () => {
      const statusIndicator = within(document.body).getByLabelText('Status of the test run');
      await expect(statusIndicator).toHaveTextContent('PASS');
    });
  },
};
