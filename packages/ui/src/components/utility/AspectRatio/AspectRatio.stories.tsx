import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';

import { AspectRatio } from './AspectRatio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Utility/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A utility component that maintains consistent aspect ratios for content, perfect for images, videos, and responsive layouts.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['16:9', '4:3', '1:1', '3:2', '21:9', 'custom'],
      description: 'Predefined aspect ratio variants',
    },
    ratio: {
      control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
      description: 'Custom aspect ratio (width/height) when variant is "custom"',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

const DemoContent = ({ title, color }: { title: string; color: string }) => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      bgcolor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      textAlign: 'center',
    }}
  >
    {title}
  </Box>
);

export const Standard16x9: Story = {
  args: {
    variant: '16:9',
    maxWidth: 400,
  },
  render: (args) => (
    <AspectRatio {...args}>
      <DemoContent title="16:9 Aspect Ratio" color="#1976d2" />
    </AspectRatio>
  ),
};

export const Square1x1: Story = {
  args: {
    variant: '1:1',
    maxWidth: 300,
  },
  render: (args) => (
    <AspectRatio {...args}>
      <DemoContent title="1:1 Square" color="#388e3c" />
    </AspectRatio>
  ),
};

export const Classic4x3: Story = {
  args: {
    variant: '4:3',
    maxWidth: 400,
  },
  render: (args) => (
    <AspectRatio {...args}>
      <DemoContent title="4:3 Classic" color="#f57c00" />
    </AspectRatio>
  ),
};

export const Ultrawide21x9: Story = {
  args: {
    variant: '21:9',
    maxWidth: 500,
  },
  render: (args) => (
    <AspectRatio {...args}>
      <DemoContent title="21:9 Ultrawide" color="#7b1fa2" />
    </AspectRatio>
  ),
};

export const CustomRatio: Story = {
  args: {
    variant: 'custom',
    ratio: 2.5,
    maxWidth: 400,
  },
  render: (args) => (
    <AspectRatio {...args}>
      <DemoContent title={`Custom ${args.ratio}:1`} color="#d32f2f" />
    </AspectRatio>
  ),
};

export const AllVariants: Story = {
  render: () => {
    const variants: Array<{ variant: any; title: string; color: string }> = [
      { variant: '16:9', title: '16:9 Video', color: '#1976d2' },
      { variant: '4:3', title: '4:3 Classic', color: '#388e3c' },
      { variant: '1:1', title: '1:1 Square', color: '#f57c00' },
      { variant: '3:2', title: '3:2 Photo', color: '#7b1fa2' },
      { variant: '21:9', title: '21:9 Cinema', color: '#d32f2f' },
    ];

    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 3,
        width: '100%',
        maxWidth: 1000,
      }}>
        {variants.map(({ variant, title, color }) => (
          <Box key={variant}>
            <Typography variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <AspectRatio variant={variant}>
              <DemoContent title={title} color={color} />
            </AspectRatio>
          </Box>
        ))}
      </Box>
    );
  },
};

export const WithImages: Story = {
  render: () => (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 3,
      maxWidth: 900,
    }}>
      <Card>
        <AspectRatio variant="16:9">
          <CardMedia
            component="img"
            image="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=225&fit=crop"
            alt="Breakfast"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AspectRatio>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            16:9 Image
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Perfect for video thumbnails and hero images.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <AspectRatio variant="1:1">
          <CardMedia
            component="img"
            image="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&h=300&fit=crop"
            alt="Burger"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AspectRatio>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            1:1 Square
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ideal for profile pictures and Instagram-style content.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  ),
};

export const ResponsiveGallery: Story = {
  render: () => {
    const images = [
      { src: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=300', alt: 'Food 1' },
      { src: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300', alt: 'Food 2' },
      { src: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=400&h=300', alt: 'Food 3' },
      { src: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=400&h=300', alt: 'Food 4' },
      { src: 'https://images.unsplash.com/photo-1533725602536-5d0c7ff2f42b?w=400&h=300', alt: 'Food 5' },
      { src: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300', alt: 'Food 6' },
    ];

    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 2,
        maxWidth: 800,
      }}>
        {images.map((image, index) => (
          <AspectRatio key={index} variant="4:3">
            <Box
              component="img"
              src={image.src}
              alt={image.alt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 1,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </AspectRatio>
        ))}
      </Box>
    );
  },
};