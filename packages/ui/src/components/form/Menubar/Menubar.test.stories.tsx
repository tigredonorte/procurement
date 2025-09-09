import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { Menubar } from './Menubar';
import { MenubarItem } from './Menubar.types';

const meta: Meta<typeof Menubar> = {
  title: 'Form/Menubar/Tests',
  component: Menubar,
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:Menubar'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test data
const basicMenuItems: MenubarItem[] = [
  {
    id: 'file',
    label: 'File',
    children: [
      { id: 'new', label: 'New File', shortcut: '⌘N', action: fn() },
      { id: 'open', label: 'Open...', shortcut: '⌘O', action: fn() },
      { id: 'save', label: 'Save', shortcut: '⌘S', action: fn() },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    children: [
      { id: 'undo', label: 'Undo', shortcut: '⌘Z', action: fn() },
      { id: 'redo', label: 'Redo', shortcut: '⌘⇧Z', action: fn() },
    ],
  },
];

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <HomeIcon />
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
      TestApp
    </Typography>
  </Box>
);

const EndContent = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <IconButton color="inherit" size="small" data-testid="notifications-btn">
      <NotificationsIcon />
    </IconButton>
    <IconButton color="inherit" size="small" data-testid="darkmode-btn">
      <DarkModeIcon />
    </IconButton>
    <Avatar sx={{ width: 32, height: 32 }} data-testid="avatar">
      U
    </Avatar>
  </Box>
);

// ====================================
// Interaction Tests
// ====================================

export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    items: basicMenuItems,
    logo: <Logo />,
    endContent: <EndContent />,
    'data-testid': 'menubar-basic',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const toolbar = canvas.getByRole('toolbar');
      await expect(toolbar).toBeInTheDocument();

      const fileButton = canvas.getByRole('button', { name: /file/i });
      await expect(fileButton).toBeInTheDocument();
    });

    await step('Menu item clicking', async () => {
      const fileButton = canvas.getByRole('button', { name: /file/i });
      await userEvent.click(fileButton);

      await waitFor(() => {
        const newMenuItem = canvas.getByText('New File');
        expect(newMenuItem).toBeVisible();
      });
    });

    await step('Logo and end content display', async () => {
      const logo = canvas.getByText('TestApp');
      await expect(logo).toBeInTheDocument();

      const avatar = canvas.getByTestId('avatar');
      await expect(avatar).toBeInTheDocument();
    });
  },
};

export const FormInteraction: Story = {
  name: '🧪 Form Interaction Test',
  args: {
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon fontSize="small" />,
        children: [
          { id: 'profile', label: 'Profile Settings', action: fn() },
          { id: 'preferences', label: 'Preferences', action: fn() },
        ],
      },
    ],
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Menu item with children interaction', async () => {
      const settingsButton = canvas.getByRole('button', { name: /settings/i });
      await userEvent.click(settingsButton);

      await waitFor(() => {
        const profileItem = canvas.getByText('Profile Settings');
        expect(profileItem).toBeVisible();
      });
    });

    await step('Callback verification', async () => {
      const profileItem = canvas.getByText('Profile Settings');
      await userEvent.click(profileItem);

      await waitFor(() => {
        expect(args.onClick).toHaveBeenCalled();
      });
    });
  },
};

export const KeyboardNavigation: Story = {
  name: '🧪 Keyboard Navigation Test',
  args: {
    items: basicMenuItems,
    logo: <Logo />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation', async () => {
      const fileButton = canvas.getByRole('button', { name: /file/i });
      const editButton = canvas.getByRole('button', { name: /edit/i });

      await userEvent.click(fileButton);
      await expect(fileButton).toHaveFocus();

      await userEvent.keyboard('{Tab}');
      await expect(editButton).toHaveFocus();
    });

    await step('Enter key opens menu', async () => {
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        const undoItem = canvas.getByText('Undo');
        expect(undoItem).toBeVisible();
      });
    });

    await step('Escape key closes menu', async () => {
      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        const undoItem = canvas.queryByText('Undo');
        expect(undoItem).not.toBeInTheDocument();
      });
    });
  },
};

export const ScreenReader: Story = {
  name: '🧪 Screen Reader Test',
  args: {
    items: basicMenuItems,
    logo: <Logo />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('ARIA attributes verification', async () => {
      const fileButton = canvas.getByRole('button', { name: /file/i });
      await expect(fileButton).toHaveAttribute('type', 'button');
    });

    await step('Menu ARIA structure', async () => {
      const fileButton = canvas.getByRole('button', { name: /file/i });
      await userEvent.click(fileButton);

      await waitFor(() => {
        const menu = canvas.getByRole('menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveAttribute('role', 'menu');
      });
    });

    await step('Menu items have proper roles', async () => {
      const newFileItem = canvas.getByRole('menuitem', { name: /new file/i });
      await expect(newFileItem).toBeInTheDocument();
    });
  },
};

export const FocusManagement: Story = {
  name: '🧪 Focus Management Test',
  args: {
    items: basicMenuItems,
    logo: <Logo />,
    endContent: <EndContent />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Focus on menu trigger', async () => {
      const fileButton = canvas.getByRole('button', { name: /file/i });
      await userEvent.click(fileButton);

      await waitFor(() => {
        const menu = canvas.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
    });

    await step('Focus returns after menu closes', async () => {
      const fileButton = canvas.getByRole('button', { name: /file/i });
      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(fileButton).toHaveFocus();
      });
    });

    await step('End content focus', async () => {
      const notificationBtn = canvas.getByTestId('notifications-btn');
      await userEvent.click(notificationBtn);
      await expect(notificationBtn).toHaveFocus();
    });
  },
};

export const ResponsiveDesign: Story = {
  name: '🧪 Responsive Design Test',
  args: {
    items: basicMenuItems,
    logo: <Logo />,
    endContent: <EndContent />,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Mobile rendering', async () => {
      const toolbar = canvas.getByRole('toolbar');
      await expect(toolbar).toBeInTheDocument();

      const logo = canvas.getByText('TestApp');
      await expect(logo).toBeInTheDocument();
    });

    await step('Menu interaction on mobile', async () => {
      const fileButton = canvas.getByRole('button', { name: /file/i });
      await userEvent.click(fileButton);

      await waitFor(() => {
        const newMenuItem = canvas.getByText('New File');
        expect(newMenuItem).toBeVisible();
      });
    });
  },
};

export const ThemeVariations: Story = {
  name: '🧪 Theme Variations Test',
  render: () => (
    <Box>
      {(['default', 'glass', 'gradient'] as const).map((variant) => (
        <Box key={variant} sx={{ mb: 2 }} data-testid={`variant-${variant}`}>
          <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
            Variant: {variant}
          </Typography>
          <Menubar
            items={basicMenuItems}
            variant={variant}
            color="primary"
            logo={<Logo />}
            glass={variant === 'glass'}
            gradient={variant === 'gradient'}
          />
        </Box>
      ))}
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('All variants render', async () => {
      const variants = ['default', 'glass', 'gradient'];

      for (const variant of variants) {
        const variantElement = canvas.getByTestId(`variant-${variant}`);
        await expect(variantElement).toBeInTheDocument();
      }
    });

    await step('Glass variant functionality', async () => {
      const glassVariant = canvas.getByTestId('variant-glass');
      const glassFileButton = within(glassVariant).getByRole('button', { name: /file/i });
      await userEvent.click(glassFileButton);

      await waitFor(() => {
        const newMenuItem = within(glassVariant).getByText('New File');
        expect(newMenuItem).toBeVisible();
      });
    });
  },
};

export const VisualStates: Story = {
  name: '🧪 Visual States Test',
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Loading State
      </Typography>
      <Menubar items={[]} loading logo={<Logo />} />

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Disabled State
      </Typography>
      <Menubar items={basicMenuItems} disabled logo={<Logo />} />

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Glass Effect
      </Typography>
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2 }}>
        <Menubar items={basicMenuItems} variant="glass" glass transparent logo={<Logo />} />
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Loading state displays', async () => {
      const loadingIndicator = canvas.getByRole('progressbar');
      await expect(loadingIndicator).toBeInTheDocument();
    });

    await step('Disabled state verification', async () => {
      const disabledMenus = canvas.getAllByText('File');
      const disabledFileButton = disabledMenus[1];
      await expect(disabledFileButton.closest('button')).toBeDisabled();
    });

    await step('Glass variant renders', async () => {
      const glassMenus = canvas.getAllByText('File');
      await expect(glassMenus[2]).toBeInTheDocument();
    });
  },
};

export const Performance: Story = {
  name: '🧪 Performance Test',
  args: {
    items: Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      label: `Menu Item ${i + 1}`,
      children: Array.from({ length: 5 }, (_, j) => ({
        id: `subitem-${i}-${j}`,
        label: `Submenu ${i + 1}.${j + 1}`,
        action: fn(),
      })),
    })),
    logo: <Logo />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Many items render performance', async () => {
      const startTime = Date.now();

      const firstMenuItem = canvas.getByRole('button', { name: 'Menu Item 1' });
      await expect(firstMenuItem).toBeInTheDocument();

      await userEvent.click(firstMenuItem);

      await waitFor(() => {
        const submenu = canvas.getByText('Submenu 1.1');
        expect(submenu).toBeVisible();
      });

      const endTime = Date.now();
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(1000);
    });

    await step('Menu closes quickly', async () => {
      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        const submenu = canvas.queryByText('Submenu 1.1');
        expect(submenu).not.toBeInTheDocument();
      });
    });
  },
};

export const EdgeCases: Story = {
  name: '🧪 Edge Cases Test',
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Empty Menu
      </Typography>
      <Menubar items={[]} logo={<Logo />} />

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Mixed Item Types
      </Typography>
      <Menubar
        items={[
          { id: 'normal', label: 'Normal Item', action: fn() },
          { id: 'sep1', divider: true, label: '', action: fn() },
          { id: 'disabled', label: 'Disabled Item', disabled: true, action: fn() },
        ]}
        logo={<Logo />}
      />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty menu renders', async () => {
      const emptyMenubar = canvas.getAllByRole('toolbar')[0];
      await expect(emptyMenubar).toBeInTheDocument();
    });

    await step('Mixed item types work', async () => {
      const normalItem = canvas.getByRole('button', { name: 'Normal Item' });
      const disabledItem = canvas.getByRole('button', { name: 'Disabled Item' });

      await expect(normalItem).toBeInTheDocument();
      await expect(disabledItem).toBeDisabled();
    });
  },
};

export const Integration: Story = {
  name: '🧪 Integration Test',
  render: () => (
    <Box>
      <Menubar
        items={[
          {
            id: 'actions',
            label: 'Actions',
            children: [
              { id: 'create', label: 'Create New', action: fn() },
              { id: 'import', label: 'Import Data', action: fn() },
            ],
          },
        ]}
        variant="elevated"
        color="primary"
        logo={<Logo />}
        endContent={<EndContent />}
        onFocus={fn()}
        onBlur={fn()}
        onClick={fn()}
      />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Integrated components render', async () => {
      const toolbar = canvas.getByRole('toolbar');
      await expect(toolbar).toBeInTheDocument();

      const logo = canvas.getByText('TestApp');
      await expect(logo).toBeInTheDocument();

      const avatar = canvas.getByTestId('avatar');
      await expect(avatar).toBeInTheDocument();
    });

    await step('Menu integration works', async () => {
      const actionsButton = canvas.getByRole('button', { name: /actions/i });
      await userEvent.click(actionsButton);

      await waitFor(() => {
        const createItem = canvas.getByText('Create New');
        expect(createItem).toBeVisible();
      });

      const createItem = canvas.getByText('Create New');
      await userEvent.click(createItem);
    });
  },
};
