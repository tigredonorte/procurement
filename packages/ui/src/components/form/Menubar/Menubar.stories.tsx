import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { MenubarItem } from './Menubar.types';
import { Menubar } from './Menubar';

const meta: Meta<typeof Menubar> = {
  title: 'Form/Menubar',
  component: Menubar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'component:Menubar'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'gradient', 'elevated', 'minimal', 'bordered'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'default'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menubar>;

const sampleMenuItems: MenubarItem[] = [
  {
    id: 'file',
    label: 'File',
    children: [{ id: 'new', label: 'New', shortcut: '⌘N', action: () => {} }],
  },
];

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <HomeIcon />
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
      AppName
    </Typography>
  </Box>
);

const EndContent = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <IconButton color="inherit" size="small">
      <NotificationsIcon />
    </IconButton>
    <IconButton color="inherit" size="small">
      <DarkModeIcon />
    </IconButton>
    <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
  </Box>
);

export const Default: Story = {
  args: {
    items: sampleMenuItems,
    variant: 'default',
    size: 'md',
  },
};

export const WithLogo: Story = {
  args: {
    items: sampleMenuItems,
    logo: <Logo />,
    variant: 'default',
  },
};

export const WithEndContent: Story = {
  args: {
    items: sampleMenuItems,
    logo: <Logo />,
    endContent: <EndContent />,
    variant: 'elevated',
  },
};

export const Glass: Story = {
  args: {
    items: sampleMenuItems,
    variant: 'glass',
    glass: true,
    glow: true,
    logo: <Logo />,
    endContent: <EndContent />,
  },
};

export const Gradient: Story = {
  args: {
    items: sampleMenuItems,
    variant: 'gradient',
    gradient: true,
    color: 'primary',
    logo: <Logo />,
  },
};

export const Elevated: Story = {
  args: {
    items: sampleMenuItems,
    variant: 'elevated',
    elevation: 8,
    logo: <Logo />,
    endContent: <EndContent />,
  },
};

export const Minimal: Story = {
  args: {
    items: sampleMenuItems,
    variant: 'minimal',
    logo: <Logo />,
  },
};

export const Bordered: Story = {
  args: {
    items: sampleMenuItems,
    variant: 'bordered',
    color: 'primary',
    logo: <Logo />,
  },
};

export const Sizes: Story = {
  render: () => (
    <Box>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Box key={size} sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
            Size: {size}
          </Typography>
          <Menubar items={sampleMenuItems} size={size} variant="bordered" logo={<Logo />} />
        </Box>
      ))}
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box>
      {(['default', 'primary', 'secondary', 'success', 'error', 'warning', 'info'] as const).map(
        (color) => (
          <Box key={color} sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
              Color: {color}
            </Typography>
            <Menubar items={sampleMenuItems} color={color} variant="elevated" logo={<Logo />} />
          </Box>
        ),
      )}
    </Box>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider' }}>
        <Menubar items={sampleMenuItems} orientation="vertical" variant="minimal" logo={<Logo />} />
      </Box>
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h6">Content Area</Typography>
        <Typography variant="body2" color="text.secondary">
          Vertical menubar displayed on the left
        </Typography>
      </Box>
    </Box>
  ),
};

export const Sticky: Story = {
  render: () => (
    <Box>
      <Menubar
        items={sampleMenuItems}
        sticky
        variant="glass"
        glass
        blur
        logo={<Logo />}
        endContent={<EndContent />}
      />
      <Box sx={{ p: 3, height: '150vh' }}>
        <Typography variant="h4" gutterBottom>
          Scroll to see sticky behavior
        </Typography>
        <Typography variant="body1" paragraph>
          The menubar will stick to the top as you scroll down.
        </Typography>
        {[...Array(20)].map((_, i) => (
          <Typography key={i} variant="body2" paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </Typography>
        ))}
      </Box>
    </Box>
  ),
};

export const Transparent: Story = {
  render: () => (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
      }}
    >
      <Menubar
        items={sampleMenuItems}
        transparent
        variant="glass"
        glass
        blur
        logo={<Logo />}
        endContent={<EndContent />}
      />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          Transparent Menubar
        </Typography>
      </Box>
    </Box>
  ),
};

export const WithEffects: Story = {
  args: {
    items: sampleMenuItems,
    variant: 'glass',
    glow: true,
    pulse: true,
    glass: true,
    blur: true,
    color: 'primary',
    logo: <Logo />,
    endContent: <EndContent />,
  },
};

export const Loading: Story = {
  args: {
    items: [],
    loading: true,
    logo: <Logo />,
  },
};

export const Disabled: Story = {
  args: {
    items: sampleMenuItems,
    disabled: true,
    logo: <Logo />,
  },
};

export const CustomContent: Story = {
  render: () => {
    const customItems: MenubarItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <HomeIcon fontSize="small" />,
        action: () => {},
      },
    ];

    return (
      <Menubar
        items={customItems}
        variant="gradient"
        gradient
        color="secondary"
        logo={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 40, height: 40 }}>A</Avatar>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                Admin Panel
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                v2.0.0
              </Typography>
            </Box>
          </Box>
        }
        endContent={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">John Doe</Typography>
            <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
          </Box>
        }
      />
    );
  },
};
