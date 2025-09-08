import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Dashboard,
  Folder,
  Settings,
  Article,
  AccountTree,
  Code,
  CloudUpload,
  Analytics,
  Security,
  Category,
  Storage,
  Home,
} from '@mui/icons-material';
import { Box, Paper, ThemeProvider, createTheme, CssBaseline, Stack } from '@mui/material';
import { Button, Typography } from '@mui/material';

import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem } from './Breadcrumbs.types';

const meta = {
  title: 'Navigation/Breadcrumbs 🥇',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A sophisticated breadcrumb navigation component with glass morphism effects, smooth animations, and comprehensive accessibility features.

## Features
- **Glass Morphism**: Beautiful frosted glass effect with backdrop blur
- **Multiple Variants**: Default, glass, elevated, and outlined styles
- **Separator Types**: Arrow, chevron, slash, dot, and pipe separators
- **Responsive Design**: Intelligent collapsing on mobile devices
- **Dark Mode Support**: Seamless adaptation to light and dark themes
- **Accessibility**: WCAG 2.1 AA compliant with ARIA labels and keyboard navigation
- **Smooth Animations**: Elegant hover and transition effects
- **Mobile Optimized**: Touch-friendly with collapsible menu options
        `,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      ],
    },
  },
  tags: ['autodocs', 'component:Breadcrumbs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'elevated', 'outlined'],
      description: 'Visual style of the breadcrumb container',
      table: {
        category: 'Appearance',
      },
    },
    separatorType: {
      control: 'select',
      options: ['default', 'slash', 'arrow', 'chevron', 'dot', 'pipe'],
      description: 'Type of separator between breadcrumb items',
      table: {
        category: 'Appearance',
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the breadcrumb text and icons',
      table: {
        category: 'Appearance',
      },
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Color scheme for separators and accents',
      table: {
        category: 'Appearance',
      },
    },
    elevation: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: 'Shadow elevation for glass and elevated variants',
      table: {
        category: 'Appearance',
      },
    },
    showHomeIcon: {
      control: 'boolean',
      description: 'Whether to show a home icon for the first item',
      table: {
        category: 'Behavior',
      },
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of items to display before collapsing',
      table: {
        category: 'Behavior',
      },
    },
    mobileMaxItems: {
      control: 'number',
      description: 'Maximum number of items to display on mobile',
      table: {
        category: 'Behavior',
      },
    },
    collapseBehavior: {
      control: 'select',
      options: ['menu', 'ellipsis'],
      description: 'How to handle collapsed items',
      table: {
        category: 'Behavior',
      },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ minWidth: 400, p: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Electronics', href: '#' },
  { label: 'Laptops' },
];

const itemsWithIcons = [
  { label: 'Dashboard', href: '#', icon: <Dashboard fontSize="small" /> },
  { label: 'Projects', href: '#', icon: <Folder fontSize="small" /> },
  { label: 'Settings', href: '#', icon: <Settings fontSize="small" /> },
  { label: 'Profile' },
];

// Default variant showcase
export const Default: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    separatorType: 'default',
    size: 'md',
  },
};

// Glass morphism showcase - the star of the show
export const GlassMorphism: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'glass',
    separatorType: 'chevron',
    size: 'md',
    elevation: 2,
  },
  parameters: {
    backgrounds: { default: 'gradient' },
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 4,
        }}
      >
        <Story />
      </Box>
    ),
  ],
};

// Elevated card-like appearance
export const Elevated: Story = {
  args: {
    items: basicItems,
    variant: 'elevated',
    separatorType: 'arrow',
    size: 'md',
    elevation: 3,
  },
};

// Outlined variant
export const Outlined: Story = {
  args: {
    items: basicItems,
    variant: 'outlined',
    separatorType: 'slash',
    size: 'md',
  },
};

// Separator types showcase
export const SeparatorTypes: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Arrow Separator
        </Typography>
        <Breadcrumbs items={basicItems} separatorType="arrow" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Chevron Separator
        </Typography>
        <Breadcrumbs items={basicItems} separatorType="chevron" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Slash Separator
        </Typography>
        <Breadcrumbs items={basicItems} separatorType="slash" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Dot Separator
        </Typography>
        <Breadcrumbs items={basicItems} separatorType="dot" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Pipe Separator
        </Typography>
        <Breadcrumbs items={basicItems} separatorType="pipe" />
      </Box>
    </Stack>
  ),
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Small Size
        </Typography>
        <Breadcrumbs items={basicItems} size="sm" variant="glass" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Medium Size (Default)
        </Typography>
        <Breadcrumbs items={basicItems} size="md" variant="glass" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Large Size
        </Typography>
        <Breadcrumbs items={basicItems} size="lg" variant="glass" />
      </Box>
    </Stack>
  ),
};

// Color variations
export const ColorVariations: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Default Color
        </Typography>
        <Breadcrumbs items={basicItems} color="default" variant="elevated" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Primary Color
        </Typography>
        <Breadcrumbs items={basicItems} color="primary" variant="elevated" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Secondary Color
        </Typography>
        <Breadcrumbs items={basicItems} color="secondary" variant="elevated" />
      </Box>
    </Stack>
  ),
};

// Import needed for the interactive example

// Interactive example with click handlers
export const Interactive: Story = {
  render: () => {
    const InteractiveBreadcrumbs = () => {
      const [path, setPath] = useState(['Home', 'Products', 'Electronics', 'Laptops']);

      const items: BreadcrumbItem[] = path.map((label, index) => ({
        label,
        href: '#',
        onClick: (e) => {
          e.preventDefault();
          if (index < path.length - 1) {
            setPath(path.slice(0, index + 1));
          }
        },
        tooltip: index < path.length - 1 ? `Navigate to ${label}` : undefined,
      }));

      return (
        <Stack spacing={3}>
          <Breadcrumbs items={items} variant="glass" separatorType="chevron" showHomeIcon />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setPath([...path, 'Gaming'])}
              disabled={path.length >= 6}
            >
              Add Level
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setPath(path.slice(0, -1))}
              disabled={path.length <= 1}
            >
              Remove Level
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setPath(['Home', 'Products', 'Electronics', 'Laptops'])}
            >
              Reset
            </Button>
          </Box>
        </Stack>
      );
    };

    return <InteractiveBreadcrumbs />;
  },
};

// Dark mode showcase
export const DarkMode: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'glass',
    separatorType: 'arrow',
    size: 'md',
    elevation: 2,
  },
  decorators: [
    (Story) => {
      const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

      return (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: 150 }}>
            <Story />
          </Box>
        </ThemeProvider>
      );
    },
  ],
};

// Mobile responsive behavior
export const MobileResponsive: Story = {
  args: {
    items: [
      { label: 'Home', href: '#', icon: <Home fontSize="small" /> },
      { label: 'Documents', href: '#', icon: <Article fontSize="small" /> },
      { label: 'Projects', href: '#', icon: <AccountTree fontSize="small" /> },
      { label: 'Development', href: '#', icon: <Code fontSize="small" /> },
      { label: 'Cloud', href: '#', icon: <CloudUpload fontSize="small" /> },
      { label: 'Analytics', href: '#', icon: <Analytics fontSize="small" /> },
      { label: 'Security', href: '#', icon: <Security fontSize="small" /> },
      { label: 'Current Page' },
    ],
    variant: 'glass',
    separatorType: 'chevron',
    mobileMaxItems: 3,
    collapseBehavior: 'menu',
    elevation: 2,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Accessibility showcase
export const Accessibility: Story = {
  args: {
    items: basicItems.map((item, index) => ({
      ...item,
      ariaLabel: `Navigate to ${item.label}`,
      tooltip:
        index < basicItems.length - 1
          ? `Go to ${item.label} section`
          : `Currently viewing ${item.label}`,
    })),
    variant: 'elevated',
    separatorType: 'arrow',
    size: 'lg',
    ariaLabel: 'Main navigation breadcrumb',
  },
};

// Complex navigation path
export const ComplexPath: Story = {
  args: {
    items: [
      { label: 'Organization', href: '#', icon: <Storage fontSize="small" /> },
      { label: 'Departments', href: '#', icon: <Category fontSize="small" /> },
      { label: 'Engineering', href: '#', icon: <Code fontSize="small" /> },
      { label: 'Frontend', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Navigation', href: '#' },
      { label: 'Breadcrumbs', href: '#' },
      { label: 'Documentation' },
    ],
    variant: 'glass',
    separatorType: 'chevron',
    maxItems: 5,
    collapseBehavior: 'menu',
    elevation: 2,
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Default Variant
        </Typography>
        <Breadcrumbs items={basicItems} variant="default" />
      </Paper>

      <Paper
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
          Glass Morphism Variant
        </Typography>
        <Breadcrumbs items={itemsWithIcons} variant="glass" elevation={2} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Elevated Variant
        </Typography>
        <Breadcrumbs items={basicItems} variant="elevated" elevation={3} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Outlined Variant
        </Typography>
        <Breadcrumbs items={basicItems} variant="outlined" />
      </Paper>
    </Stack>
  ),
};

// Performance test with many items
export const StressTest: Story = {
  args: {
    items: Array.from({ length: 20 }, (_, i) => ({
      label: `Level ${i + 1}`,
      href: '#',
      tooltip: `This is level ${i + 1} of the navigation`,
    })),
    variant: 'glass',
    separatorType: 'chevron',
    maxItems: 5,
    collapseBehavior: 'menu',
    elevation: 2,
  },
};
