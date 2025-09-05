import type { Meta, StoryObj } from '@storybook/react';
import {
  ContentCopy,
  ContentPaste,
  ContentCut,
  Delete,
  Edit,
  Share,
  Download,
  Archive,
  Folder,
  Image,
  Print,
  Refresh,
  Settings,
  Star,
  BookmarkBorder,
  MoreVert,
} from '@mui/icons-material';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';

import { ContextMenu } from './ContextMenu';

const meta = {
  title: 'Navigation/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A right-click context menu component with multiple variants and customization options. Right-click on the trigger elements to see the menu.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'dark'],
      description: 'The visual variant of the context menu',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the menu items',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the context menu is disabled',
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicMenuItems = [
  {
    id: 'copy',
    label: 'Copy',
    icon: <ContentCopy />,
    shortcut: 'Ctrl+C',
    action: () => { /** do nothing */}
  },
];

const advancedMenuItems = [
  {
    id: 'header1',
    type: 'header' as const,
    label: 'Edit Actions',
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit />,
    shortcut: 'F2',
    color: 'primary' as const,
    action: () => { /** do nothing */}
  },
];

const fileMenuItems = [
  {
    id: 'open',
    label: 'Open',
    icon: <Folder />,
    shortcut: 'Enter',
    action: () => { /** do nothing */}
  },
];

export const Default: Story = {
  args: {
    items: basicMenuItems,
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <Box
      sx={{
        width: 300,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <ContextMenu {...args}>
        <Typography variant="body2" color="text.secondary">
          Right-click here to open context menu
        </Typography>
      </ContextMenu>
    </Box>
  ),
};

export const GlassVariant: Story = {
  args: {
    items: basicMenuItems,
    variant: 'glass',
    size: 'md',
  },
  render: (args) => (
    <Box
      sx={{
        width: 300,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <ContextMenu {...args}>
        <Typography variant="body2" color="white" textAlign="center">
          Right-click for glassmorphism menu
        </Typography>
      </ContextMenu>
    </Box>
  ),
};

export const DarkVariant: Story = {
  args: {
    items: basicMenuItems,
    variant: 'dark',
    size: 'md',
  },
  render: (args) => (
    <Box
      sx={{
        width: 300,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <ContextMenu {...args}>
        <Typography variant="body2" color="text.secondary">
          Right-click for dark theme menu
        </Typography>
      </ContextMenu>
    </Box>
  ),
};

export const SmallSize: Story = {
  args: {
    items: basicMenuItems,
    variant: 'default',
    size: 'sm',
  },
  render: (args) => (
    <Box
      sx={{
        width: 250,
        height: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.paper',
      }}
    >
      <ContextMenu {...args}>
        <Typography variant="caption" color="text.secondary">
          Small context menu
        </Typography>
      </ContextMenu>
    </Box>
  ),
};

export const LargeSize: Story = {
  args: {
    items: basicMenuItems,
    variant: 'default',
    size: 'lg',
  },
  render: (args) => (
    <Box
      sx={{
        width: 350,
        height: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <ContextMenu {...args}>
        <Typography variant="h6" color="primary">
          Large context menu
        </Typography>
      </ContextMenu>
    </Box>
  ),
};

export const AdvancedMenu: Story = {
  args: {
    items: advancedMenuItems,
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <Paper
      elevation={2}
      sx={{
        width: 300,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <ContextMenu {...args}>
        <Typography variant="body1" color="text.primary" textAlign="center">
          Advanced menu with headers,
          <br />
          colored items, and sections
        </Typography>
      </ContextMenu>
    </Paper>
  ),
};

export const FileContextMenu: Story = {
  args: {
    items: fileMenuItems,
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} sx={{ width: 120, height: 140 }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              height: '100%',
            }}
          >
            <ContextMenu {...args}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'context-menu',
                  width: '100%',
                  height: '100%',
                  padding: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Folder sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="caption" textAlign="center">
                  File {item}
                </Typography>
              </Box>
            </ContextMenu>
          </CardContent>
        </Card>
      ))}
    </Box>
  ),
};

export const WithCustomTrigger: Story = {
  args: {
    items: [
      {
        id: 'star',
        label: 'Add to favorites',
        icon: <Star />,
        color: 'warning' as const,
        action: () => { /** do nothing */}
      }
    ],
  },
};

export const DisabledMenu: Story = {
  args: {
    items: basicMenuItems,
    variant: 'default',
    size: 'md',
    disabled: true,
  },
  render: (args) => (
    <Box
      sx={{
        width: 300,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: 'action.disabled',
        borderRadius: 2,
        backgroundColor: 'action.disabledBackground',
        opacity: 0.6,
      }}
    >
      <ContextMenu {...args}>
        <Typography variant="body2" color="text.disabled">
          Context menu disabled
        </Typography>
      </ContextMenu>
    </Box>
  ),
};

export const MultipleMenus: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <ContextMenu items={basicMenuItems} variant="default" size="sm">
          <Paper
            elevation={1}
            sx={{
              width: 150,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'context-menu',
            }}
          >
            <Typography variant="caption">Default Menu</Typography>
          </Paper>
        </ContextMenu>

        <ContextMenu items={advancedMenuItems} variant="glass" size="md">
          <Paper
            elevation={1}
            sx={{
              width: 150,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'context-menu',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Typography variant="caption">Glass Menu</Typography>
          </Paper>
        </ContextMenu>

        <ContextMenu items={fileMenuItems} variant="dark" size="lg">
          <Paper
            elevation={1}
            sx={{
              width: 150,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'context-menu',
              backgroundColor: 'grey.100',
            }}
          >
            <Typography variant="caption">Dark Menu</Typography>
          </Paper>
        </ContextMenu>
      </Box>
      <Typography variant="caption" color="text.secondary" textAlign="center">
        Right-click on any of the above cards to see different menu variants
      </Typography>
    </Box>
  ),
};