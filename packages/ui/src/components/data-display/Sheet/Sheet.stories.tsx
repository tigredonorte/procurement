import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sheet, SheetHeader, SheetContent, SheetFooter, SheetOverlay } from './Sheet';
import { SheetProps } from './Sheet.types';
import {
  Box,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

const meta: Meta<typeof Sheet> = {
  title: 'Data Display/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'gradient', 'elevated', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

const SheetWrapper: React.FC<SheetProps & { buttonText?: string }> = ({
  buttonText = 'Open Sheet',
  ...props
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        {buttonText}
      </Button>
      <Sheet
        {...props}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => (
    <SheetWrapper {...args}>
      <Typography variant="h6" gutterBottom>
        Default Sheet Content
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This is a basic sheet component that slides in from the bottom.
      </Typography>
    </SheetWrapper>
  ),
  args: {
    title: 'Sheet Title',
    description: 'This is a sheet description',
    position: 'bottom',
  },
};

export const Positions: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((position) => (
        <SheetWrapper
          key={position}
          position={position}
          title={`${position} Sheet`}
          buttonText={`Open ${position}`}
        >
          <Typography>
            This sheet slides in from the {position}
          </Typography>
        </SheetWrapper>
      ))}
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
        <SheetWrapper
          key={size}
          size={size}
          title={`Size: ${size.toUpperCase()}`}
          buttonText={`Size ${size}`}
        >
          <Typography>
            This is a {size} sized sheet
          </Typography>
        </SheetWrapper>
      ))}
    </Box>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {(['default', 'glass', 'gradient', 'elevated', 'minimal'] as const).map((variant) => (
        <SheetWrapper
          key={variant}
          variant={variant}
          title={`${variant} Variant`}
          buttonText={variant}
          glow={variant === 'glass'}
          glass={variant === 'glass'}
          gradient={variant === 'gradient'}
        >
          <Typography>
            This is a {variant} variant sheet
          </Typography>
        </SheetWrapper>
      ))}
    </Box>
  ),
};

export const WithForm: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      title="User Settings"
      description="Update your profile information"
      footer={
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      }
    >
      <Stack spacing={3}>
        <TextField
          label="Full Name"
          fullWidth
          defaultValue="John Doe"
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          defaultValue="john.doe@example.com"
        />
        <TextField
          label="Bio"
          multiline
          rows={4}
          fullWidth
          placeholder="Tell us about yourself..."
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Email notifications"
        />
        <FormControlLabel
          control={<Switch />}
          label="Make profile public"
        />
      </Stack>
    </SheetWrapper>
  ),
  args: {
    position: 'right',
    size: 'md',
  },
};

export const WithList: Story = {
  render: (args) => {
    const items = [
      { id: 1, name: 'John Doe', role: 'Admin', status: 'active' },
      { id: 2, name: 'Jane Smith', role: 'User', status: 'active' },
      { id: 3, name: 'Bob Johnson', role: 'Moderator', status: 'inactive' },
      { id: 4, name: 'Alice Brown', role: 'User', status: 'active' },
    ];

    return (
      <SheetWrapper
        {...args}
        title="Team Members"
        description="Manage your team"
      >
        <List>
          {items.map((item) => (
            <ListItem key={item.id}>
              <Avatar sx={{ mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <ListItemText
                primary={item.name}
                secondary={item.role}
              />
              <Chip
                label={item.status}
                color={item.status === 'active' ? 'success' : 'default'}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </SheetWrapper>
    );
  },
  args: {
    position: 'left',
    size: 'sm',
  },
};

export const Glass: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      variant="glass"
      glass
      glow
      title="Glass Effect"
      description="Beautiful glassmorphism design"
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Modern Glass Design
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This sheet features a glass morphism effect with backdrop blur and transparency.
        </Typography>
        <Button variant="contained" fullWidth>
          Action Button
        </Button>
      </Box>
    </SheetWrapper>
  ),
};

export const Gradient: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      variant="gradient"
      gradient
      color="primary"
      title="Gradient Background"
    >
      <Typography variant="h6" gutterBottom>
        Beautiful Gradient
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This sheet has a subtle gradient background effect.
      </Typography>
    </SheetWrapper>
  ),
};

export const WithEffects: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      variant="glass"
      glow
      pulse
      glass
      title="Enhanced Effects"
      description="Multiple visual effects combined"
    >
      <Typography>
        This sheet combines glow and pulse effects with glass morphism.
      </Typography>
    </SheetWrapper>
  ),
};

export const Swipeable: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      swipeable
      title="Swipeable Sheet"
      description="Swipe down to close"
      buttonText="Open Swipeable"
    >
      <Typography variant="body1" paragraph>
        This sheet can be swiped to close on mobile devices.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Try swiping down from the handle to dismiss.
      </Typography>
    </SheetWrapper>
  ),
  args: {
    position: 'bottom',
    showHandle: true,
  },
};

export const Persistent: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      persistent
      closeOnOverlayClick={false}
      closeOnEscape={false}
      showCloseButton={false}
      title="Persistent Sheet"
      description="Cannot be closed by user"
      footer={
        <Button variant="contained" color="error" fullWidth>
          Force Close (Only way to close)
        </Button>
      }
    >
      <Typography variant="body1" paragraph>
        This sheet is persistent and cannot be closed by:
      </Typography>
      <List>
        <ListItem>• Clicking the overlay</ListItem>
        <ListItem>• Pressing Escape key</ListItem>
        <ListItem>• Close button (hidden)</ListItem>
      </List>
    </SheetWrapper>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      loading
      title="Loading Content"
      description="Please wait..."
    />
  ),
};

export const NoOverlay: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      showOverlay={false}
      title="No Overlay"
      description="Sheet without backdrop overlay"
    >
      <Typography>
        This sheet appears without a backdrop overlay.
      </Typography>
    </SheetWrapper>
  ),
};

export const CustomHeader: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      header={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Avatar>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">John Doe</Typography>
            <Typography variant="caption" color="text.secondary">
              john.doe@example.com
            </Typography>
          </Box>
        </Box>
      }
    >
      <Typography>
        Sheet with custom header content
      </Typography>
    </SheetWrapper>
  ),
};

export const FullHeight: Story = {
  render: (args) => (
    <SheetWrapper
      {...args}
      fullHeight
      title="Full Height Sheet"
      position="right"
      size="md"
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Full Height Content
        </Typography>
        <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            This content area expands to fill the full height
          </Typography>
        </Box>
      </Box>
    </SheetWrapper>
  ),
};

export const Settings: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);

    return (
      <>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={() => setOpen(true)}
        >
          Open Settings
        </Button>
        <Sheet
          open={open}
          onOpenChange={setOpen}
          title="Application Settings"
          position="right"
          size="md"
          variant="elevated"
          footer={
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => setOpen(false)} fullWidth>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={() => setOpen(false)} fullWidth>
                Save
              </Button>
            </Box>
          }
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Appearance
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                }
                label="Dark Mode"
              />
            </Box>
            
            <Divider />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                }
                label="Enable Notifications"
              />
            </Box>
            
            <Divider />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Data & Storage
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />
                }
                label="Auto-save"
              />
            </Box>
          </Stack>
        </Sheet>
      </>
    );
  },
};