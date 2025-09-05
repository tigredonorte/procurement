import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FolderIcon from '@mui/icons-material/Folder';

import { CommandProps, CommandItem } from './Command.types';
import { Command, CommandInput, CommandList, CommandGroup, CommandEmpty, CommandLoading, CommandSeparator } from './Command';

const meta: Meta<typeof Command> = {
  title: 'Form/Command',
  component: Command,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'gradient', 'minimal', 'elevated'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Command>;

const sampleItems: CommandItem[] = [
  // Navigation
  { id: '1', label: 'Home', icon: <HomeIcon />, shortcut: '⌘H', category: 'Navigation', action: () => console.log('Home clicked') },
];

const CommandWrapper: React.FC<CommandProps> = (props) => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Command Palette
      </Button>
      <Command
        {...props}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <CommandWrapper {...args} items={sampleItems} />,
  args: {
    placeholder: 'Type a command or search...',
    showCategories: true,
    showShortcuts: true,
    showDescriptions: true,
  },
};

export const Glass: Story = {
  render: (args) => <CommandWrapper {...args} items={sampleItems} />,
  args: {
    variant: 'glass',
    glow: true,
    placeholder: 'Type a command...',
    showCategories: true,
    showShortcuts: true,
  },
};

export const Gradient: Story = {
  render: (args) => <CommandWrapper {...args} items={sampleItems} />,
  args: {
    variant: 'gradient',
    color: 'primary',
    placeholder: 'Search commands...',
    showCategories: true,
  },
};

export const WithPulse: Story = {
  render: (args) => <CommandWrapper {...args} items={sampleItems} />,
  args: {
    variant: 'elevated',
    pulse: true,
    glow: true,
    color: 'secondary',
  },
};

export const Minimal: Story = {
  render: (args) => <CommandWrapper {...args} items={sampleItems} />,
  args: {
    variant: 'minimal',
    showCategories: false,
    showShortcuts: false,
    showDescriptions: false,
  },
};

export const Loading: Story = {
  render: (args) => <CommandWrapper {...args} />,
  args: {
    loading: true,
    placeholder: 'Loading commands...',
  },
};

export const Empty: Story = {
  render: (args) => <CommandWrapper {...args} />,
  args: {
    items: [],
    emptyMessage: 'No commands available',
  },
};

const SizesComponent = () => {
const [openSize, setOpenSize] = useState<string | null>(null);
    
    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <React.Fragment key={size}>
            <Button
              variant="outlined"
              onClick={() => setOpenSize(size)}
            >
              Size: {size.toUpperCase()}
            </Button>
            <Command
              open={openSize === size}
              onOpenChange={(open) => !open && setOpenSize(null)}
              items={sampleItems}
              size={size}
              placeholder={`Command palette (${size})`}
            />
          </React.Fragment>
        ))}
      </Box>
    );
};

export const Sizes: Story = {
  render: () => <SizesComponent />,
};

const ColorsComponent = () => {
const [openColor, setOpenColor] = useState<string | null>(null);
    const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'] as const;
    
    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {colors.map((color) => (
          <React.Fragment key={color}>
            <Button
              variant="contained"
              color={color}
              onClick={() => setOpenColor(color)}
            >
              {color}
            </Button>
            <Command
              open={openColor === color}
              onOpenChange={(open) => !open && setOpenColor(null)}
              items={sampleItems}
              color={color}
              variant="glass"
              glow
            />
          </React.Fragment>
        ))}
      </Box>
    );
};

export const Colors: Story = {
  render: () => <ColorsComponent />,
};

export const CustomFilter: Story = {
  render: (args) => <CommandWrapper {...args} />,
  args: {
    items: sampleItems,
    customFilter: (item, search) => {
      // Custom filter that also searches shortcuts
      const searchLower = search.toLowerCase();
      return (
        item.label.toLowerCase().includes(searchLower) ||
        item.shortcut?.toLowerCase().includes(searchLower) ||
        false
      );
    },
    placeholder: 'Search by name or shortcut...',
  },
};

export const WithKeywords: Story = {
  render: (args) => {
    const itemsWithKeywords: CommandItem[] = sampleItems.map(item => ({
      ...item,
      keywords: item.category ? [item.category.toLowerCase(), 'command'] : ['command'],
    }));
    
    return <CommandWrapper {...args} items={itemsWithKeywords} />;
  },
  args: {
    placeholder: 'Search with keywords...',
  },
};

const InteractiveComponent = () => {
const [open, setOpen] = useState(false);
    const [lastAction, setLastAction] = useState<string>('');
    
    const interactiveItems: CommandItem[] = sampleItems.map(item => ({
      ...item,
      action: () => {
        setLastAction(`Executed: ${item.label}`);
      }
    }));
    
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Interactive Command
        </Button>
        {lastAction && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Last action: {lastAction}
          </Typography>
        )}
        <Command
          open={open}
          onOpenChange={setOpen}
          items={interactiveItems}
          onSelect={(item) => {
            if (item.action) {
              item.action();
            }
            setOpen(false);
          }}
        />
      </Box>
    );
  };

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
};