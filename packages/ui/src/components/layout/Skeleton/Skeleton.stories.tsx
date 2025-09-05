import type { Meta, StoryObj } from '@storybook/react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  Typography, 
  Stack, 
  Box, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid
} from '@mui/material';

import { Skeleton } from './Skeleton';

const meta = {
  title: 'Layout/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'circular', 'rectangular', 'wave'],
    },
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', false],
    },
    width: {
      control: { type: 'text' },
    },
    height: {
      control: { type: 'number' },
    },
    count: {
      control: { type: 'number' },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'text',
    animation: 'pulse',
    width: '100%',
    count: 1,
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Text Skeleton</Typography>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Circular Skeleton</Typography>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="circular" width={80} height={80} />
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Rectangular Skeleton</Typography>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" width="75%" height={40} />
          <Skeleton variant="rectangular" width="50%" height={80} />
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Wave Animation</Typography>
        <Skeleton variant="wave" height={60} />
        <Skeleton variant="wave" width="80%" height={40} />
      </Box>
    </Stack>
  ),
};

export const AnimationTypes: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Typography variant="h6" gutterBottom>Pulse Animation</Typography>
        <Skeleton animation="pulse" height={60} />
        <Skeleton animation="pulse" width="80%" />
        <Skeleton animation="pulse" width="60%" />
      </Grid>

      <Grid item xs={4}>
        <Typography variant="h6" gutterBottom>Wave Animation</Typography>
        <Skeleton animation="wave" height={60} />
        <Skeleton animation="wave" width="80%" />
        <Skeleton animation="wave" width="60%" />
      </Grid>

      <Grid item xs={4}>
        <Typography variant="h6" gutterBottom>No Animation</Typography>
        <Skeleton animation={false} height={60} />
        <Skeleton animation={false} width="80%" />
        <Skeleton animation={false} width="60%" />
      </Grid>
    </Grid>
  ),
};

export const MultipleSkeleton: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Multiple Text Lines</Typography>
        <Skeleton variant="text" count={5} />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Multiple Rectangles</Typography>
        <Skeleton variant="rectangular" height={40} count={3} spacing={2} />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Custom Spacing</Typography>
        <Skeleton variant="text" count={4} spacing={3} />
      </Box>
    </Stack>
  ),
};

export const ProfileCardSkeleton: Story = {
  render: () => (
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" width="60%" />}
        subheader={<Skeleton variant="text" width="40%" />}
      />
      <CardContent>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </CardContent>
    </Card>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <List sx={{ width: '100%', maxWidth: 360 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant="text" width="70%" />}
            secondary={<Skeleton variant="text" width="40%" />}
          />
        </ListItem>
      ))}
    </List>
  ),
};

export const DashboardSkeleton: Story = {
  render: () => (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="30%" height={40} />
        <Skeleton variant="text" width="60%" />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" height={32} />
                  <Skeleton variant="rectangular" height={20} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={<Skeleton variant="text" width="40%" />}
              action={<Skeleton variant="circular" width={32} height={32} />}
            />
            <CardContent>
              <Skeleton variant="rectangular" height={300} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={<Skeleton variant="text" width="60%" />}
            />
            <CardContent>
              <Stack spacing={2}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <Box>
      {/* Table Header */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr 1fr', 
        gap: 2, 
        p: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
      </Box>

      {/* Table Rows */}
      {Array.from({ length: 8 }).map((_, index) => (
        <Box key={index} sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1fr', 
          gap: 2, 
          p: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="rectangular" width={80} height={20} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      ))}
    </Box>
  ),
};