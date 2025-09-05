import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper, Button, Card, CardContent } from '@mui/material';

import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive container component that constrains content width and provides consistent padding. Built on MUI Container with enhanced variants and responsive behavior.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxWidth: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', false],
      description: 'Maximum width of the container',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'fluid', 'centered', 'padded'],
      description: 'Container variant for different layouts',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Padding size for the container',
    },
    responsive: {
      control: 'boolean',
      description: 'Enable responsive padding behavior',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DemoContent = () => (
  <Paper elevation={1} sx={{ p: 3, bgcolor: 'primary.50' }}>
    <Typography variant="h5" gutterBottom>
      Container Content
    </Typography>
    <Typography variant="body1" paragraph>
      This is a demo content inside the container. The container helps to center content and limit its maximum width for better readability on larger screens.
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </Typography>
  </Paper>
);

export const Default: Story = {
  args: {
    children: <DemoContent />,
  },
};

export const FluidContainer: Story = {
  args: {
    variant: 'fluid',
    children: (
      <Paper sx={{ p: 3, bgcolor: 'info.50' }}>
        <Typography variant="h6">Fluid Container</Typography>
        <Typography>This container expands to fill the full width of its parent.</Typography>
      </Paper>
    ),
  },
};

export const CenteredContainer: Story = {
  args: {
    variant: 'centered',
    children: (
      <Paper sx={{ p: 4, maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom align="center">
          Centered Content
        </Typography>
        <Typography align="center">
          This container centers its content both horizontally and vertically in the viewport.
        </Typography>
      </Paper>
    ),
  },
};

export const PaddedContainer: Story = {
  args: {
    variant: 'padded',
    children: (
      <Box>
        <Typography variant="h4" gutterBottom>
          Padded Container
        </Typography>
        <Typography paragraph>
          This container variant adds extra vertical padding, useful for main content areas.
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography>Additional content with standard spacing</Typography>
        </Paper>
      </Box>
    ),
  },
};

// Size Variations
export const ExtraSmallContainer: Story = {
  name: 'Extra Small (xs)',
  args: {
    maxWidth: 'xs',
    children: (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>XS Container</Typography>
          <Typography variant="body2">Maximum width: 444px</Typography>
        </CardContent>
      </Card>
    ),
  },
};

export const SmallContainer: Story = {
  name: 'Small (sm)',
  args: {
    maxWidth: 'sm',
    children: (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>SM Container</Typography>
          <Typography variant="body2">Maximum width: 600px</Typography>
        </CardContent>
      </Card>
    ),
  },
};

export const MediumContainer: Story = {
  name: 'Medium (md)',
  args: {
    maxWidth: 'md',
    children: (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>MD Container</Typography>
          <Typography variant="body2">Maximum width: 900px</Typography>
        </CardContent>
      </Card>
    ),
  },
};

export const LargeContainer: Story = {
  name: 'Large (lg)',
  args: {
    maxWidth: 'lg',
    children: (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>LG Container</Typography>
          <Typography variant="body2">Maximum width: 1200px</Typography>
        </CardContent>
      </Card>
    ),
  },
};

export const ExtraLargeContainer: Story = {
  name: 'Extra Large (xl)',
  args: {
    maxWidth: 'xl',
    children: (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>XL Container</Typography>
          <Typography variant="body2">Maximum width: 1536px</Typography>
        </CardContent>
      </Card>
    ),
  },
};

// Padding Variations
export const NoPadding: Story = {
  name: 'No Padding',
  args: {
    padding: 'none',
    children: (
      <Paper sx={{ p: 2, bgcolor: 'warning.50', border: '2px dashed', borderColor: 'warning.main' }}>
        <Typography>Content with no container padding</Typography>
      </Paper>
    ),
  },
};

export const ExtraSmallPadding: Story = {
  name: 'Extra Small Padding',
  args: {
    padding: 'xs',
    children: (
      <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
        <Typography>Content with XS padding</Typography>
      </Paper>
    ),
  },
};

export const SmallPadding: Story = {
  name: 'Small Padding',
  args: {
    padding: 'sm',
    children: (
      <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
        <Typography>Content with SM padding</Typography>
      </Paper>
    ),
  },
};

export const LargePadding: Story = {
  name: 'Large Padding',
  args: {
    padding: 'lg',
    children: (
      <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
        <Typography>Content with LG padding</Typography>
      </Paper>
    ),
  },
};

export const ExtraLargePadding: Story = {
  name: 'Extra Large Padding',
  args: {
    padding: 'xl',
    children: (
      <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
        <Typography>Content with XL padding</Typography>
      </Paper>
    ),
  },
};

// Content Variations
export const EmptyContainer: Story = {
  name: 'Empty Container',
  args: {
    children: null,
    sx: { minHeight: 200, border: '2px dashed #ccc' },
  },
};

export const MinimalContent: Story = {
  name: 'Minimal Content',
  args: {
    children: <Typography>Short text</Typography>,
  },
};

export const RichContent: Story = {
  name: 'Rich Content',
  args: {
    children: (
      <Box>
        <Typography variant="h3" gutterBottom>
          Rich Content Container
        </Typography>
        <Typography variant="subtitle1" paragraph>
          This container demonstrates how it handles various types of rich content including multiple paragraphs, buttons, and cards.
        </Typography>
        
        {[1, 2, 3].map((num) => (
          <Paper key={num} sx={{ p: 3, mb: 2, bgcolor: `primary.${50 + num * 50}` }}>
            <Typography variant="h6" gutterBottom>
              Section {num}
            </Typography>
            <Typography paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris.
            </Typography>
            <Button variant="outlined" size="small">
              Action {num}
            </Button>
          </Paper>
        ))}
      </Box>
    ),
  },
};

// Edge Cases
export const LongTextOverflow: Story = {
  name: 'Long Text Handling',
  args: {
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Long Text Overflow Test
        </Typography>
        <Typography paragraph sx={{ wordBreak: 'break-all' }}>
          ThisIsAVeryLongWordThatShouldTestHowTheContainerHandlesOverflowingContentAndWordBreaking
        </Typography>
        <Typography paragraph>
          {"Very ".repeat(100)}long repeated text to test how the container handles extremely long content that might cause layout issues.
        </Typography>
      </Box>
    ),
  },
};

// Responsive Behavior
export const NonResponsive: Story = {
  name: 'Non-Responsive',
  args: {
    responsive: false,
    padding: 'lg',
    children: (
      <Paper sx={{ p: 3, bgcolor: 'error.50' }}>
        <Typography variant="h6" gutterBottom>
          Non-Responsive Container
        </Typography>
        <Typography>
          This container maintains the same padding across all screen sizes.
        </Typography>
      </Paper>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Custom Styling
export const CustomStyling: Story = {
  name: 'Custom Styling',
  args: {
    sx: {
      backgroundColor: 'secondary.light',
      borderRadius: 4,
      border: '2px solid',
      borderColor: 'secondary.main',
      '&:hover': {
        backgroundColor: 'secondary.main',
        '& .MuiTypography-root': {
          color: 'secondary.contrastText',
        },
      },
    },
    children: (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Custom Styled Container
        </Typography>
        <Typography>
          Hover to see the styling change
        </Typography>
      </Box>
    ),
  },
};