import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { Box, Typography, Paper } from '@mui/material';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive container component that constrains content width and provides consistent padding. This is an additional utility component that complements the Layout Components.',
      },
    },
  },
  tags: ['autodocs'],
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