import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography, Stack, Box, Card, CardContent } from '@mui/material';

import { Separator } from './Separator';

const meta = {
  title: 'Layout/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs', 'component:Separator'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted', 'gradient'],
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: { type: 'color' },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'solid',
    orientation: 'horizontal',
    size: 'md',
  },
  render: (args) => (
    <Box sx={{ width: '100%' }}>
      <Typography>Content above separator</Typography>
      <Separator {...args} />
      <Typography>Content below separator</Typography>
    </Box>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Solid Separator</Typography>
        <Typography>Content before</Typography>
        <Separator variant="solid" />
        <Typography>Content after</Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Dashed Separator</Typography>
        <Typography>Content before</Typography>
        <Separator variant="dashed" />
        <Typography>Content after</Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Dotted Separator</Typography>
        <Typography>Content before</Typography>
        <Separator variant="dotted" />
        <Typography>Content after</Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Gradient Separator</Typography>
        <Typography>Content before</Typography>
        <Separator variant="gradient" />
        <Typography>Content after</Typography>
      </Box>
    </Stack>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <Stack spacing={4}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Box key={size}>
          <Typography variant="h6" gutterBottom>{size.toUpperCase()} Size</Typography>
          <Typography>Content before</Typography>
          <Separator size={size} />
          <Typography>Content after</Typography>
        </Box>
      ))}
    </Stack>
  ),
};

export const VerticalSeparators: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Vertical Separators</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 100 }}>
          <Typography>Left</Typography>
          <Separator orientation="vertical" />
          <Typography>Middle</Typography>
          <Separator orientation="vertical" variant="dashed" />
          <Typography>Right</Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Different Vertical Sizes</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 80 }}>
          <Typography>XS</Typography>
          <Separator orientation="vertical" size="xs" />
          <Typography>SM</Typography>
          <Separator orientation="vertical" size="sm" />
          <Typography>MD</Typography>
          <Separator orientation="vertical" size="md" />
          <Typography>LG</Typography>
          <Separator orientation="vertical" size="lg" />
          <Typography>XL</Typography>
          <Separator orientation="vertical" size="xl" />
          <Typography>End</Typography>
        </Box>
      </Box>
    </Stack>
  ),
};

export const WithText: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Horizontal Separator with Text</Typography>
        <Typography>Before separator</Typography>
        <Separator>OR</Separator>
        <Typography>After separator</Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Different Variants with Text</Typography>
        <Typography>Section 1</Typography>
        <Separator variant="dashed">Section Break</Separator>
        <Typography>Section 2</Typography>
        <Separator variant="gradient">Gradient Divider</Separator>
        <Typography>Section 3</Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Vertical Separator with Text</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 120 }}>
          <Typography>Left Content</Typography>
          <Separator orientation="vertical">OR</Separator>
          <Typography>Right Content</Typography>
        </Box>
      </Box>
    </Stack>
  ),
};

export const CardExample: Story = {
  render: () => (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Basic information about the user account and preferences.
        </Typography>
        
        <Separator margin={16}>Account Details</Separator>
        
        <Typography variant="body2" paragraph>
          Name: John Doe<br />
          Email: john.doe@example.com<br />
          Role: Administrator
        </Typography>
        
        <Separator variant="dashed" margin={16}>Settings</Separator>
        
        <Typography variant="body2" paragraph>
          Theme: Dark Mode<br />
          Language: English<br />
          Timezone: UTC-5
        </Typography>
        
        <Separator variant="gradient" margin={16} />
        
        <Typography variant="caption" color="text.secondary">
          Last updated: March 15, 2024
        </Typography>
      </CardContent>
    </Card>
  ),
};

export const FormExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Contact Form
      </Typography>
      
      <Typography variant="body1" paragraph>
        Please fill out the form below and we&apos;ll get back to you.
      </Typography>
      
      <Separator>Personal Information</Separator>
      
      <Box sx={{ my: 3 }}>
        <Typography variant="body2" gutterBottom>
          This section contains fields for your personal details.
        </Typography>
      </Box>
      
      <Separator variant="dashed">Contact Details</Separator>
      
      <Box sx={{ my: 3 }}>
        <Typography variant="body2" gutterBottom>
          Please provide your contact information.
        </Typography>
      </Box>
      
      <Separator variant="gradient">Message</Separator>
      
      <Box sx={{ my: 3 }}>
        <Typography variant="body2" gutterBottom>
          Tell us how we can help you.
        </Typography>
      </Box>
    </Box>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Custom Colors</Typography>
        <Typography>Primary color</Typography>
        <Separator color="#1976d2" />
        <Typography>Secondary color</Typography>
        <Separator color="#dc004e" />
        <Typography>Success color</Typography>
        <Separator color="#2e7d32" variant="dashed" />
        <Typography>Warning color</Typography>
        <Separator color="#ed6c02" variant="dotted" />
      </Box>
    </Stack>
  ),
};

export const CustomLengthAndMargin: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Custom Length</Typography>
        <Typography>50% width separator</Typography>
        <Separator length="50%" />
        <Typography>200px width separator</Typography>
        <Separator length="200px" />
        <Typography>Full width (default)</Typography>
        <Separator />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Custom Margin</Typography>
        <Typography>No margin</Typography>
        <Separator margin={0} />
        <Typography>Large margin (32px)</Typography>
        <Separator margin="32px" />
        <Typography>Small margin (4px)</Typography>
        <Separator margin="4px" />
      </Box>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Long Text Content</Typography>
        <Typography>Before separator</Typography>
        <Separator>This is a very long text that should be handled gracefully by the separator component</Separator>
        <Typography>After separator</Typography>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Empty Text Content</Typography>
        <Typography>Before separator</Typography>
        <Separator>{''}</Separator>
        <Typography>After separator</Typography>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Nested Content</Typography>
        <Typography>Complex content</Typography>
        <Separator>
          <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Formatted Text
          </Box>
        </Separator>
        <Typography>More content</Typography>
      </Box>
    </Stack>
  ),
};