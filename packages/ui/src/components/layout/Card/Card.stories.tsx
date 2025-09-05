import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardContent, CardActions, CardMedia } from './Card';
import { Button, Typography, Avatar, IconButton, Chip, Stack, Box, Grid } from '@mui/material';
import { 
  Favorite, 
  Share, 
  MoreVert, 
  ShoppingCart, 
  Star,
  LocationOn,
  Phone,
  Email,
  Edit,
  Delete
} from '@mui/icons-material';

const meta = {
  title: 'Layout/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elevated', 'outlined', 'glass', 'gradient', 'neumorphic'],
    },
    borderRadius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    interactive: {
      control: { type: 'boolean' },
    },
    glow: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'elevated',
    interactive: false,
    glow: false,
    borderRadius: 'md',
  },
  render: (args) => (
    <Card {...args} sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Default Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a basic card with default styling. It can contain any content
          and serves as a container for related information.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="elevated" sx={{ height: '100%' }}>
          <CardHeader title="Elevated Card" />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Classic elevated card with shadow depth for visual hierarchy.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardHeader title="Outlined Card" />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Clean outlined card with subtle borders for minimal design.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card variant="glass" sx={{ height: '100%' }}>
          <CardHeader title="Glass Card" />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Modern glass morphism effect with backdrop blur and transparency.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card variant="gradient" sx={{ height: '100%' }}>
          <CardHeader title="Gradient Card" />
          <CardContent>
            <Typography variant="body2">
              Eye-catching gradient background with beautiful color transitions.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card variant="neumorphic" sx={{ height: '100%' }}>
          <CardHeader title="Neumorphic Card" />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Soft neumorphic design with subtle shadows and highlights.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ),
};

export const InteractiveCards: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="elevated" interactive>
          <CardContent>
            <Typography variant="h6" gutterBottom>Interactive Card</Typography>
            <Typography variant="body2" color="text.secondary">
              Hover over this card to see the interactive effects.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card variant="glass" interactive glow>
          <CardContent>
            <Typography variant="h6" gutterBottom>Glowing Glass Card</Typography>
            <Typography variant="body2" color="text.secondary">
              This card combines glass effect with glow and interactivity.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card variant="neumorphic" interactive>
          <CardContent>
            <Typography variant="h6" gutterBottom>Interactive Neumorphic</Typography>
            <Typography variant="body2" color="text.secondary">
              Neumorphic design that responds to hover interactions.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ),
};

export const BorderRadiusVariations: Story = {
  render: () => (
    <Grid container spacing={2}>
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((radius) => (
        <Grid item xs={6} sm={4} md={2.4} key={radius}>
          <Card variant="outlined" borderRadius={radius}>
            <CardContent>
              <Typography variant="subtitle2" align="center">
                {radius.toUpperCase()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card variant="elevated" interactive sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="200"
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop"
        title="Product Image"
      />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="div">
            Premium Headphones
          </Typography>
          <Chip label="New" color="primary" size="small" />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Star sx={{ color: 'orange', fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary">
            4.8 (324 reviews)
          </Typography>
        </Stack>
        <Typography variant="h5" color="primary" fontWeight="bold" mb={1}>
          $199.99
        </Typography>
        <Typography variant="body2" color="text.secondary">
          High-quality wireless headphones with noise cancellation and premium sound quality.
        </Typography>
      </CardContent>
      <CardActions alignment="space-between">
        <Stack direction="row" spacing={1}>
          <IconButton size="small">
            <Favorite />
          </IconButton>
          <IconButton size="small">
            <Share />
          </IconButton>
        </Stack>
        <Button variant="contained" startIcon={<ShoppingCart />} size="small">
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  ),
};

export const ProfileCard: Story = {
  render: () => (
    <Card variant="glass" sx={{ maxWidth: 400 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
            JS
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title="John Smith"
        subtitle="Senior Software Engineer"
      />
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">San Francisco, CA</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Email fontSize="small" color="action" />
            <Typography variant="body2">john.smith@example.com</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Phone fontSize="small" color="action" />
            <Typography variant="body2">+1 (555) 123-4567</Typography>
          </Box>
          <Stack direction="row" spacing={1} mt={2}>
            <Chip label="React" size="small" variant="outlined" />
            <Chip label="TypeScript" size="small" variant="outlined" />
            <Chip label="Node.js" size="small" variant="outlined" />
          </Stack>
        </Stack>
      </CardContent>
      <CardActions alignment="space-between">
        <Button variant="outlined" startIcon={<Edit />}>
          Edit
        </Button>
        <Button variant="contained">
          Contact
        </Button>
      </CardActions>
    </Card>
  ),
};

export const DashboardCard: Story = {
  render: () => (
    <Card variant="neumorphic" sx={{ minWidth: 300 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Revenue</Typography>
          <Chip label="+12%" color="success" size="small" />
        </Stack>
        <Typography variant="h3" color="primary" fontWeight="bold" mb={1}>
          $24,596
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Total revenue this month
        </Typography>
        <Box sx={{ 
          height: 4, 
          backgroundColor: 'grey.200', 
          borderRadius: 2,
          position: 'relative'
        }}>
          <Box sx={{
            width: '68%',
            height: '100%',
            backgroundColor: 'primary.main',
            borderRadius: 2
          }} />
        </Box>
        <Typography variant="caption" color="text.secondary" mt={1}>
          68% of monthly goal
        </Typography>
      </CardContent>
    </Card>
  ),
};

export const ComplexLayoutCard: Story = {
  render: () => (
    <Card variant="elevated" sx={{ maxWidth: 500 }}>
      <CardMedia
        component="img"
        height="160"
        image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=160&fit=crop"
        title="Event Location"
      />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Tech Conference 2024
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              March 15-17, 2024
            </Typography>
          </Box>
          <Chip label="Premium Event" color="primary" />
        </Stack>
        
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2">
            Convention Center, San Francisco
          </Typography>
        </Stack>

        <Typography variant="body1" mb={2}>
          Join industry leaders for three days of cutting-edge technology discussions, 
          networking opportunities, and hands-on workshops.
        </Typography>

        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2} mb={2}>
          <Box textAlign="center">
            <Typography variant="h6" color="primary">50+</Typography>
            <Typography variant="caption">Speakers</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" color="primary">200+</Typography>
            <Typography variant="caption">Attendees</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" color="primary">3</Typography>
            <Typography variant="caption">Days</Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip label="AI/ML" size="small" />
          <Chip label="Web3" size="small" />
          <Chip label="Cloud" size="small" />
          <Chip label="DevOps" size="small" />
        </Stack>
      </CardContent>
      <CardActions alignment="space-between">
        <Stack direction="row" spacing={1}>
          <Typography variant="h6" color="primary">$299</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
            $399
          </Typography>
        </Stack>
        <Button variant="contained" size="large">
          Register Now
        </Button>
      </CardActions>
    </Card>
  ),
};