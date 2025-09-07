import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Stack,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Settings,
  Person,
  Help,
  Notifications,
  Dashboard,
  Analytics,
} from '@mui/icons-material';

import { Drawer, DrawerHeader, DrawerContent } from './Drawer';

const meta = {
  title: 'Layout/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['left', 'right', 'top', 'bottom', 'glass'],
    },
    width: {
      control: { type: 'number' },
    },
    height: {
      control: { type: 'number' },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultComponent = (args: { open: boolean; variant: string; width: number }) => {
  const [open, setOpen] = useState(args.open);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Button
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300 }}
      >
        Open Drawer
      </Button>
      <Drawer {...args} open={open} onClose={() => setOpen(false)}>
        <DrawerHeader onClose={() => setOpen(false)}>
          <Typography variant="h6">Navigation</Typography>
        </DrawerHeader>
        <DrawerContent>
          <List>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Analytics />
              </ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </List>
        </DrawerContent>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography>Main content area</Typography>
      </Box>
    </Box>
  );
};

export const Default: Story = {
  args: {
    open: true,
    variant: 'left',
    width: 280,
  },
  render: (args) => <DefaultComponent {...args} />,
};

const AllVariantsComponent = () => {
  const [openDrawers, setOpenDrawers] = useState({
    left: false,
    right: false,
    top: false,
    bottom: false,
    glass: false,
  });

  const toggleDrawer = (variant: keyof typeof openDrawers) => {
    setOpenDrawers((prev) => ({
      ...prev,
      [variant]: !prev[variant],
    }));
  };

  const DrawerButton = ({
    variant,
    label,
  }: {
    variant: keyof typeof openDrawers;
    label: string;
  }) => (
    <Button variant="outlined" onClick={() => toggleDrawer(variant)} sx={{ m: 1 }}>
      {label}
    </Button>
  );

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <DrawerButton variant="left" label="Left Drawer" />
        <DrawerButton variant="right" label="Right Drawer" />
        <DrawerButton variant="top" label="Top Drawer" />
        <DrawerButton variant="bottom" label="Bottom Drawer" />
        <DrawerButton variant="glass" label="Glass Drawer" />
      </Stack>

      {/* Left Drawer */}
      <Drawer open={openDrawers.left} onClose={() => toggleDrawer('left')} variant="left">
        <DrawerHeader onClose={() => toggleDrawer('left')}>Left Navigation</DrawerHeader>
        <DrawerContent>
          <List>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </List>
        </DrawerContent>
      </Drawer>

      {/* Right Drawer */}
      <Drawer open={openDrawers.right} onClose={() => toggleDrawer('right')} variant="right">
        <DrawerHeader onClose={() => toggleDrawer('right')}>Right Panel</DrawerHeader>
        <DrawerContent>
          <List>
            <ListItemButton>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Help />
              </ListItemIcon>
              <ListItemText primary="Help" />
            </ListItemButton>
          </List>
        </DrawerContent>
      </Drawer>

      {/* Top Drawer */}
      <Drawer open={openDrawers.top} onClose={() => toggleDrawer('top')} variant="top" height={200}>
        <DrawerHeader onClose={() => toggleDrawer('top')}>Top Panel</DrawerHeader>
        <DrawerContent>
          <Typography variant="body2">
            This is a top drawer that slides down from the top of the screen.
          </Typography>
        </DrawerContent>
      </Drawer>

      {/* Bottom Drawer */}
      <Drawer
        open={openDrawers.bottom}
        onClose={() => toggleDrawer('bottom')}
        variant="bottom"
        height={200}
      >
        <DrawerHeader onClose={() => toggleDrawer('bottom')}>Bottom Panel</DrawerHeader>
        <DrawerContent>
          <Typography variant="body2">
            This is a bottom drawer that slides up from the bottom of the screen.
          </Typography>
        </DrawerContent>
      </Drawer>

      {/* Glass Drawer */}
      <Drawer open={openDrawers.glass} onClose={() => toggleDrawer('glass')} variant="glass">
        <DrawerHeader onClose={() => toggleDrawer('glass')}>Glass Panel</DrawerHeader>
        <DrawerContent>
          <Typography variant="body2" sx={{ p: 2 }}>
            This drawer uses a glass morphism effect with backdrop blur.
          </Typography>
          <List>
            <ListItemButton>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </List>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ p: 4, pt: 10 }}>
        <Typography variant="h4" gutterBottom>
          Drawer Variants Demo
        </Typography>
        <Typography variant="body1">
          Click the buttons above to open different drawer variants. Each variant demonstrates
          different positioning and styling options.
        </Typography>
      </Box>
    </Box>
  );
};

export const AllVariants: Story = {
  render: () => <AllVariantsComponent />,
};

const NavigationDrawerComponent = () => {
  const [open, setOpen] = useState(false);
  const [persistent, setPersistent] = useState(false);
  const [selectedItem, setSelectedItem] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'analytics', label: 'Analytics', icon: <Analytics /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
    { id: 'profile', label: 'Profile', icon: <Person /> },
    { id: 'help', label: 'Help', icon: <Help /> },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer open={open} onClose={() => setOpen(false)} persistent={persistent}>
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              P
            </Box>
            <Typography variant="h6">Procurement</Typography>
          </Box>
        </DrawerHeader>
        <DrawerContent>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.id}
                selected={selectedItem === item.id}
                onClick={() => setSelectedItem(item.id)}
              >
                <ListItemIcon
                  sx={{
                    color: selectedItem === item.id ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" sx={{ px: 2, color: 'text.secondary' }}>
            Version 1.0.0
          </Typography>
        </DrawerContent>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            {navItems.find((item) => item.id === selectedItem)?.label}
          </Typography>
          <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant={persistent ? 'contained' : 'outlined'}
              onClick={() => setPersistent(!persistent)}
            >
              {persistent ? 'Persistent' : 'Temporary'}
            </Button>
          </Box>
        </Box>
        <Box sx={{ p: 3, flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {navItems.find((item) => item.id === selectedItem)?.label} Page
          </Typography>
          <Typography variant="body1">
            This is the content for the{' '}
            {navItems.find((item) => item.id === selectedItem)?.label.toLowerCase()} section. The
            drawer can be toggled using the menu button in the header.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const NavigationDrawer: Story = {
  render: () => <NavigationDrawerComponent />,
};
