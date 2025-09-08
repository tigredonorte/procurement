import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Inbox as InboxIcon,
  Star as StarIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import React, { useState } from 'react';

import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A navigation sidebar component with multiple variants including fixed, collapsible, floating, and glass styles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['fixed', 'collapsible', 'floating', 'glass'],
    },
    open: {
      control: { type: 'boolean' },
    },
    width: {
      control: { type: 'number' },
    },
    collapsedWidth: {
      control: { type: 'number' },
    },
    position: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const navigationItems = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <DashboardIcon />, label: 'Dashboard' },
  { icon: <InboxIcon />, label: 'Inbox' },
  { icon: <StarIcon />, label: 'Favorites' },
  { icon: <SendIcon />, label: 'Sent' },
];

const SidebarDemo = ({
  variant = 'fixed',
  showToggle = false,
}: {
  variant?: 'fixed' | 'collapsible' | 'floating' | 'glass';
  showToggle?: boolean;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '500px', bgcolor: 'grey.50', position: 'relative' }}>
      <Sidebar variant={variant} open={open} onToggle={() => setOpen(!open)}>
        <SidebarHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ display: open ? 'block' : 'none' }}>
              My App
            </Typography>
            {showToggle && (
              <IconButton onClick={() => setOpen(!open)} size="small">
                {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            )}
          </Box>
        </SidebarHeader>

        <SidebarContent>
          <List>
            {navigationItems.map((item, index) => (
              <ListItem button key={index}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} sx={{ display: open ? 'block' : 'none' }} />
              </ListItem>
            ))}
          </List>
        </SidebarContent>

        <SidebarFooter>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
            <Box sx={{ display: open ? 'block' : 'none' }}>
              <Typography variant="body2">User Name</Typography>
              <Typography variant="caption" color="text.secondary">
                user@example.com
              </Typography>
            </Box>
          </Box>
        </SidebarFooter>
      </Sidebar>

      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Main Content Area
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is the main content area next to the sidebar. The sidebar can have different variants
          and behaviors.
        </Typography>
      </Box>
    </Box>
  );
};

export const Fixed: Story = {
  render: () => <SidebarDemo variant="fixed" />,
};

export const Collapsible: Story = {
  render: () => <SidebarDemo variant="collapsible" showToggle />,
};

export const Floating: Story = {
  render: () => (
    <Box sx={{ height: '500px', bgcolor: 'grey.100', position: 'relative' }}>
      <SidebarDemo variant="floating" />
    </Box>
  ),
};

export const Glass: Story = {
  render: () => (
    <Box
      sx={{
        height: '500px',
        position: 'relative',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Sidebar variant="glass" open={true}>
          <SidebarHeader>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Glass Sidebar
            </Typography>
          </SidebarHeader>

          <SidebarContent>
            <List>
              {navigationItems.map((item, index) => (
                <ListItem button key={index} sx={{ color: 'white' }}>
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </SidebarContent>

          <SidebarFooter>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>G</Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Glass User
                </Typography>
              </Box>
            </Box>
          </SidebarFooter>
        </Sidebar>

        <Box sx={{ flex: 1, p: 3, color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Glass Morphism Effect
          </Typography>
          <Typography variant="body1">
            The glass variant creates a beautiful translucent effect with backdrop blur.
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
};

export const RightPositioned: Story = {
  render: () => (
    <Box
      sx={{
        display: 'flex',
        height: '500px',
        bgcolor: 'grey.50',
        position: 'relative',
        flexDirection: 'row-reverse',
      }}
    >
      <Sidebar variant="fixed" open={true} position="right">
        <SidebarHeader>
          <Typography variant="h6" align="center">
            Right Sidebar
          </Typography>
        </SidebarHeader>

        <SidebarContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </SidebarContent>
      </Sidebar>

      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Right-Positioned Sidebar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The sidebar can also be positioned on the right side of the layout.
        </Typography>
      </Box>
    </Box>
  ),
};

const MiniDrawerComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '500px', bgcolor: 'grey.50' }}>
      <Sidebar variant="collapsible" open={open} width={240} collapsedWidth={56}>
        <Box sx={{ p: 1, display: 'flex', justifyContent: open ? 'flex-end' : 'center' }}>
          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <List>
          {navigationItems.map((item, index) => (
            <ListItem button key={index}>
              <ListItemIcon sx={{ minWidth: open ? 56 : 40, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItem>
          ))}
        </List>
      </Sidebar>

      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mini Drawer Variant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Click the menu icon to expand/collapse the sidebar. When collapsed, only icons are
          visible.
        </Typography>
      </Box>
    </Box>
  );
};

export const MiniDrawer: Story = {
  render: () => <MiniDrawerComponent />,
};
