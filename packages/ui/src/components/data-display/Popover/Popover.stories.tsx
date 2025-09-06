import type { Meta, StoryObj } from '@storybook/react';
import { Button, Typography, Stack, List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

import { Popover } from './Popover';

const meta = {
  title: 'Data Display/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper for interactive stories
const PopoverDemo = ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        {...props}
      >
        {children}
      </Popover>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <PopoverDemo>
      <Typography sx={{ p: 2 }}>This is a basic popover content.</Typography>
    </PopoverDemo>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <PopoverDemo variant="default">
        <Typography sx={{ p: 2 }}>Default variant</Typography>
      </PopoverDemo>
      <PopoverDemo variant="glass">
        <Typography sx={{ p: 2 }}>Glass variant</Typography>
      </PopoverDemo>
      <PopoverDemo variant="arrow">
        <Typography sx={{ p: 2 }}>Arrow variant</Typography>
      </PopoverDemo>
    </Stack>
  ),
};

export const WithEffects: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <PopoverDemo glow>
        <Typography sx={{ p: 2 }}>Glow effect</Typography>
      </PopoverDemo>
      <PopoverDemo pulse>
        <Typography sx={{ p: 2 }}>Pulse effect</Typography>
      </PopoverDemo>
    </Stack>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <PopoverDemo variant="glass" maxWidth={300}>
      <div style={{ padding: 16 }}>
        <Typography variant="h6" gutterBottom>Menu Options</Typography>
        <List dense>
          <ListItem button>
            <ListItemText primary="Profile Settings" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Account Security" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </div>
    </PopoverDemo>
  ),
};