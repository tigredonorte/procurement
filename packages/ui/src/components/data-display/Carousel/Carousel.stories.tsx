import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

import { Carousel } from './Carousel';
import { CarouselItem } from './Carousel.types';

const meta: Meta<typeof Carousel> = {
  title: 'Data Display/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'gradient', 'elevated', 'minimal', 'cards'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info'],
    },
    animation: {
      control: 'select',
      options: ['slide', 'fade', 'zoom', 'flip'],
    },
    indicatorPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    arrowPosition: {
      control: 'select',
      options: ['inside', 'outside', 'overlay'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const imageItems: CarouselItem[] = [
  {
    id: '1',
    title: 'Beautiful Landscape',
    description: 'Stunning mountain views at sunset',
    image: 'https://picsum.photos/800/400?random=1',
    content: null,
  },
  {
    id: '2',
    title: 'Urban Architecture',
    description: 'Modern city skyline',
    image: 'https://picsum.photos/800/400?random=2',
    content: null,
  },
  {
    id: '3',
    title: 'Nature Photography',
    description: 'Peaceful forest scene',
    image: 'https://picsum.photos/800/400?random=3',
    content: null,
  },
  {
    id: '4',
    title: 'Ocean Views',
    description: 'Crystal clear waters',
    image: 'https://picsum.photos/800/400?random=4',
    content: null,
  },
];

const contentItems: CarouselItem[] = [
  {
    id: '1',
    content: (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Our Platform
        </Typography>
        <Typography variant="body1" paragraph>
          Discover amazing features and capabilities
        </Typography>
        <Button variant="contained" color="primary">
          Get Started
        </Button>
      </Box>
    ),
  },
  {
    id: '2',
    content: (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Advanced Features
        </Typography>
        <Typography variant="body1" paragraph>
          Unlock powerful tools for your workflow
        </Typography>
        <Button variant="outlined" color="secondary">
          Learn More
        </Button>
      </Box>
    ),
  },
  {
    id: '3',
    content: (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Join Our Community
        </Typography>
        <Typography variant="body1" paragraph>
          Connect with thousands of users worldwide
        </Typography>
        <Button variant="contained" color="success">
          Sign Up Now
        </Button>
      </Box>
    ),
  },
];

const cardItems: CarouselItem[] = [
  {
    id: '1',
    content: (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Premium Plan
          </Typography>
          <Typography variant="h3" color="primary" gutterBottom>
            $29/mo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Unlimited projects
            • Priority support
            • Advanced analytics
            • Custom integrations
          </Typography>
        </CardContent>
      </Card>
    ),
  },
  {
    id: '2',
    content: (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Business Plan
          </Typography>
          <Typography variant="h3" color="secondary" gutterBottom>
            $99/mo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Everything in Premium
            • Team collaboration
            • API access
            • White-label options
          </Typography>
        </CardContent>
      </Card>
    ),
  },
  {
    id: '3',
    content: (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Enterprise
          </Typography>
          <Typography variant="h3" color="success" gutterBottom>
            Custom
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Custom solutions
            • Dedicated support
            • SLA guarantee
            • On-premise deployment
          </Typography>
        </CardContent>
      </Card>
    ),
  },
];

export const Default: Story = {
  args: {
    items: imageItems,
    height: 400,
    showIndicators: true,
    showArrows: true,
  },
};

export const AutoPlay: Story = {
  args: {
    items: imageItems,
    autoPlay: true,
    autoPlayInterval: 3000,
    pauseOnHover: true,
    loop: true,
  },
};

export const Glass: Story = {
  args: {
    items: contentItems,
    variant: 'glass',
    glass: true,
    glow: true,
    height: 300,
  },
};

export const Gradient: Story = {
  args: {
    items: contentItems,
    variant: 'gradient',
    gradient: true,
    color: 'primary',
    height: 350,
  },
};

export const Cards: Story = {
  args: {
    items: cardItems,
    variant: 'cards',
    height: 300,
    showArrows: true,
    showIndicators: true,
  },
};

export const WithThumbnails: Story = {
  args: {
    items: imageItems,
    showThumbnails: true,
    height: 400,
    showIndicators: false,
  },
};

export const Animations: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" gutterBottom>Slide Animation</Typography>
        <Carousel items={imageItems} animation="slide" height={250} />
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>Fade Animation</Typography>
        <Carousel items={imageItems} animation="fade" height={250} />
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>Zoom Animation</Typography>
        <Carousel items={imageItems} animation="zoom" height={250} />
      </Box>
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Box key={size}>
          <Typography variant="h6" gutterBottom>
            Size: {size.toUpperCase()}
          </Typography>
          <Carousel items={imageItems} size={size} />
        </Box>
      ))}
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(['primary', 'secondary', 'success', 'error', 'warning', 'info'] as const).map((color) => (
        <Box key={color}>
          <Typography variant="h6" gutterBottom>
            Color: {color}
          </Typography>
          <Carousel
            items={contentItems}
            color={color}
            variant="gradient"
            gradient
            height={200}
          />
        </Box>
      ))}
    </Box>
  ),
};

export const IndicatorPositions: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((position) => (
        <Box key={position}>
          <Typography variant="h6" gutterBottom>
            Indicator Position: {position}
          </Typography>
          <Carousel
            items={imageItems}
            indicatorPosition={position}
            height={300}
            showArrows={false}
          />
        </Box>
      ))}
    </Box>
  ),
};

export const ArrowPositions: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(['inside', 'outside', 'overlay'] as const).map((position) => (
        <Box key={position} sx={{ px: position === 'outside' ? 6 : 0 }}>
          <Typography variant="h6" gutterBottom>
            Arrow Position: {position}
          </Typography>
          <Carousel
            items={imageItems}
            arrowPosition={position}
            height={300}
            showIndicators={false}
          />
        </Box>
      ))}
    </Box>
  ),
};

export const WithEffects: Story = {
  args: {
    items: imageItems,
    variant: 'glass',
    glow: true,
    pulse: true,
    glass: true,
    color: 'primary',
    height: 400,
  },
};

const InteractiveComponent = () => {
const [clickedItem, setClickedItem] = React.useState<string>('');
    
    return (
      <Box>
        <Carousel
          items={imageItems}
          onClick={(item, index) => {
            setClickedItem(`Clicked: ${item.title} (index: ${index})`);
          }}
          height={400}
        />
        {clickedItem && (
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            {clickedItem}
          </Typography>
        )}
      </Box>
    );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
};

export const Loading: Story = {
  args: {
    items: [],
    loading: true,
    height: 400,
  },
};

export const Disabled: Story = {
  args: {
    items: imageItems,
    disabled: true,
    height: 400,
  },
};

export const NoLoop: Story = {
  args: {
    items: imageItems,
    loop: false,
    height: 400,
    showArrows: true,
    showIndicators: true,
  },
};

export const CustomContent: Story = {
  render: () => {
    const testimonials: CarouselItem[] = [
      {
        id: '1',
        content: (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              &ldquo;Amazing product!&rdquo;
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This has completely transformed how we work. The features are intuitive and powerful.
            </Typography>
            <Typography variant="subtitle2">
              - John Doe, CEO
            </Typography>
          </Box>
        ),
      },
      {
        id: '2',
        content: (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              &ldquo;Excellent support&rdquo;
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The team is responsive and helpful. They go above and beyond to ensure success.
            </Typography>
            <Typography variant="subtitle2">
              - Jane Smith, CTO
            </Typography>
          </Box>
        ),
      },
    ];

    return (
      <Carousel
        items={testimonials}
        variant="elevated"
        autoPlay
        autoPlayInterval={5000}
        height={250}
        animation="fade"
      />
    );
  },
};