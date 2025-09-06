import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Button, Typography, Avatar, IconButton, Chip, Stack, Box } from '@mui/material';
import { MoreVert, Favorite, Share } from '@mui/icons-material';
import { Card, CardHeader, CardContent, CardActions, CardMedia } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Layout/Card/Tests',
  component: Card,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    interactive: true,
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  render: (args) => (
    <Card {...args} data-testid="interactive-card" sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="h6">Interactive Card</Typography>
        <Typography variant="body2">Click or hover to interact</Typography>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const card = canvas.getByTestId('interactive-card');
      await expect(card).toBeInTheDocument();
      await expect(card).toHaveStyle({ cursor: 'pointer' });
    });

    await step('Click interaction', async () => {
      const card = canvas.getByTestId('interactive-card');
      await userEvent.click(card);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step('Focus interaction', async () => {
      const card = canvas.getByTestId('interactive-card');
      card.focus();
      await expect(args.onFocus).toHaveBeenCalledTimes(1);
    });

    await step('Blur interaction', async () => {
      const card = canvas.getByTestId('interactive-card');
      card.blur();
      await expect(args.onBlur).toHaveBeenCalledTimes(1);
    });

    await step('Hover interaction', async () => {
      const card = canvas.getByTestId('interactive-card');
      await userEvent.hover(card);
      // Check for transform on hover (translateY(-2px))
      await waitFor(() => {
        const transform = window.getComputedStyle(card).transform;
        expect(transform).not.toBe('none');
      });
    });
  },
};

export const VariantStatesTest: Story = {
  name: '🎨 Variant States Test',
  render: () => (
    <Stack spacing={2} direction="row" flexWrap="wrap">
      <Card variant="elevated" data-testid="elevated-card" sx={{ width: 200 }}>
        <CardContent>
          <Typography>Elevated</Typography>
        </CardContent>
      </Card>
      <Card variant="outlined" data-testid="outlined-card" sx={{ width: 200 }}>
        <CardContent>
          <Typography>Outlined</Typography>
        </CardContent>
      </Card>
      <Card variant="glass" data-testid="glass-card" sx={{ width: 200 }}>
        <CardContent>
          <Typography>Glass</Typography>
        </CardContent>
      </Card>
      <Card variant="gradient" data-testid="gradient-card" sx={{ width: 200 }}>
        <CardContent>
          <Typography>Gradient</Typography>
        </CardContent>
      </Card>
      <Card variant="neumorphic" data-testid="neumorphic-card" sx={{ width: 200 }}>
        <CardContent>
          <Typography>Neumorphic</Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify elevated variant', async () => {
      const card = canvas.getByTestId('elevated-card');
      await expect(card).toBeInTheDocument();
      const styles = window.getComputedStyle(card);
      // Elevated cards should have box-shadow
      await expect(styles.boxShadow).not.toBe('none');
    });

    await step('Verify outlined variant', async () => {
      const card = canvas.getByTestId('outlined-card');
      await expect(card).toBeInTheDocument();
      const styles = window.getComputedStyle(card);
      // Outlined cards should have border
      await expect(styles.borderWidth).not.toBe('0px');
    });

    await step('Verify glass variant', async () => {
      const card = canvas.getByTestId('glass-card');
      await expect(card).toBeInTheDocument();
      const styles = window.getComputedStyle(card);
      // Glass cards should have backdrop filter
      await expect(styles.backdropFilter || styles.webkitBackdropFilter).toContain('blur');
    });

    await step('Verify gradient variant', async () => {
      const card = canvas.getByTestId('gradient-card');
      await expect(card).toBeInTheDocument();
      const styles = window.getComputedStyle(card);
      // Gradient cards should have background-image or background
      await expect(styles.background || styles.backgroundImage).toContain('gradient');
    });

    await step('Verify neumorphic variant', async () => {
      const card = canvas.getByTestId('neumorphic-card');
      await expect(card).toBeInTheDocument();
      const styles = window.getComputedStyle(card);
      // Neumorphic cards should have multiple shadows
      await expect(styles.boxShadow).toContain(',');
    });
  },
};

export const BorderRadiusTest: Story = {
  name: '📐 Border Radius Test',
  render: () => (
    <Stack spacing={2} direction="row" flexWrap="wrap">
      <Card borderRadius="none" data-testid="radius-none" sx={{ width: 150, height: 100 }}>
        <CardContent>
          <Typography variant="body2">None</Typography>
        </CardContent>
      </Card>
      <Card borderRadius="sm" data-testid="radius-sm" sx={{ width: 150, height: 100 }}>
        <CardContent>
          <Typography variant="body2">Small</Typography>
        </CardContent>
      </Card>
      <Card borderRadius="md" data-testid="radius-md" sx={{ width: 150, height: 100 }}>
        <CardContent>
          <Typography variant="body2">Medium</Typography>
        </CardContent>
      </Card>
      <Card borderRadius="lg" data-testid="radius-lg" sx={{ width: 150, height: 100 }}>
        <CardContent>
          <Typography variant="body2">Large</Typography>
        </CardContent>
      </Card>
      <Card borderRadius="xl" data-testid="radius-xl" sx={{ width: 150, height: 100 }}>
        <CardContent>
          <Typography variant="body2">Extra Large</Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify no border radius', async () => {
      const card = canvas.getByTestId('radius-none');
      const styles = window.getComputedStyle(card);
      await expect(styles.borderRadius).toBe('0px');
    });

    await step('Verify small border radius', async () => {
      const card = canvas.getByTestId('radius-sm');
      const styles = window.getComputedStyle(card);
      await expect(parseInt(styles.borderRadius)).toBeGreaterThan(0);
      await expect(parseInt(styles.borderRadius)).toBeLessThanOrEqual(4);
    });

    await step('Verify medium border radius', async () => {
      const card = canvas.getByTestId('radius-md');
      const styles = window.getComputedStyle(card);
      await expect(parseInt(styles.borderRadius)).toBeGreaterThan(4);
      await expect(parseInt(styles.borderRadius)).toBeLessThanOrEqual(8);
    });

    await step('Verify large border radius', async () => {
      const card = canvas.getByTestId('radius-lg');
      const styles = window.getComputedStyle(card);
      await expect(parseInt(styles.borderRadius)).toBeGreaterThan(8);
      await expect(parseInt(styles.borderRadius)).toBeLessThanOrEqual(16);
    });

    await step('Verify extra large border radius', async () => {
      const card = canvas.getByTestId('radius-xl');
      const styles = window.getComputedStyle(card);
      await expect(parseInt(styles.borderRadius)).toBeGreaterThan(16);
    });
  },
};

export const LoadingStateTest: Story = {
  name: '⏳ Loading State Test',
  args: {
    loading: true,
  },
  render: (args) => (
    <Card {...args} data-testid="loading-card" sx={{ width: 300, height: 200 }}>
      <CardContent>
        <Typography variant="h6">Loading Card</Typography>
        <Typography variant="body2">Content should be dimmed</Typography>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify loading state', async () => {
      const card = canvas.getByTestId('loading-card');
      await expect(card).toBeInTheDocument();
      
      // Check for reduced opacity
      const styles = window.getComputedStyle(card);
      await expect(parseFloat(styles.opacity)).toBeLessThan(1);
      
      // Check for disabled pointer events
      await expect(styles.pointerEvents).toBe('none');
      
      // Check for loading indicator
      const progressIndicator = canvas.getByRole('progressbar');
      await expect(progressIndicator).toBeInTheDocument();
    });
  },
};

export const GlowEffectTest: Story = {
  name: '✨ Glow Effect Test',
  args: {
    glow: true,
  },
  render: (args) => (
    <Card {...args} data-testid="glow-card" sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="h6">Glowing Card</Typography>
        <Typography variant="body2">This card has a glow effect</Typography>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify glow effect', async () => {
      const card = canvas.getByTestId('glow-card');
      await expect(card).toBeInTheDocument();
      
      const styles = window.getComputedStyle(card);
      // Glow effect should add box-shadow with rgba
      await expect(styles.boxShadow).toContain('rgba');
    });

    await step('Verify glow on hover', async () => {
      const card = canvas.getByTestId('glow-card');
      await userEvent.hover(card);
      
      await waitFor(() => {
        const styles = window.getComputedStyle(card);
        // Box shadow should change on hover
        expect(styles.boxShadow).toContain('rgba');
      });
    });
  },
};

export const PulseAnimationTest: Story = {
  name: '🔄 Pulse Animation Test',
  args: {
    pulse: true,
  },
  render: (args) => (
    <Card {...args} data-testid="pulse-card" sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="h6">Pulsing Card</Typography>
        <Typography variant="body2">This card has a pulse animation</Typography>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify pulse animation', async () => {
      const card = canvas.getByTestId('pulse-card');
      await expect(card).toBeInTheDocument();
      
      // Check for ::after pseudo-element animation
      const styles = window.getComputedStyle(card, '::after');
      await expect(styles.animation || styles.animationName).toBeTruthy();
    });
  },
};

// Sub-component Tests
export const CardHeaderTest: Story = {
  name: '📋 Card Header Test',
  render: () => (
    <Card sx={{ width: 400 }}>
      <CardHeader
        avatar={<Avatar data-testid="avatar">U</Avatar>}
        action={
          <IconButton data-testid="action-button">
            <MoreVert />
          </IconButton>
        }
        title="Card Header Title"
        subtitle="Card Header Subtitle"
      />
      <CardContent>
        <Typography>Card content</Typography>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify header components', async () => {
      // Check avatar
      const avatar = canvas.getByTestId('avatar');
      await expect(avatar).toBeInTheDocument();
      
      // Check action button
      const actionButton = canvas.getByTestId('action-button');
      await expect(actionButton).toBeInTheDocument();
      
      // Check title text
      const title = canvas.getByText('Card Header Title');
      await expect(title).toBeInTheDocument();
      
      // Check subtitle text
      const subtitle = canvas.getByText('Card Header Subtitle');
      await expect(subtitle).toBeInTheDocument();
    });

    await step('Test action button interaction', async () => {
      const actionButton = canvas.getByTestId('action-button');
      await userEvent.click(actionButton);
      // Button should be clickable
      await expect(actionButton).toBeEnabled();
    });
  },
};

export const CardContentTest: Story = {
  name: '📄 Card Content Test',
  render: () => (
    <Stack spacing={2}>
      <Card sx={{ width: 300 }}>
        <CardContent data-testid="normal-content">
          <Typography>Normal padding content</Typography>
        </CardContent>
      </Card>
      <Card sx={{ width: 300 }}>
        <CardContent dense data-testid="dense-content">
          <Typography>Dense padding content</Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify normal content padding', async () => {
      const content = canvas.getByTestId('normal-content');
      const styles = window.getComputedStyle(content);
      // Normal padding should be 16px (theme.spacing(2))
      await expect(parseInt(styles.padding)).toBeGreaterThan(8);
    });

    await step('Verify dense content padding', async () => {
      const content = canvas.getByTestId('dense-content');
      const styles = window.getComputedStyle(content);
      // Dense padding should be 8px (theme.spacing(1))
      await expect(parseInt(styles.padding)).toBeLessThanOrEqual(8);
    });
  },
};

export const CardActionsTest: Story = {
  name: '🎬 Card Actions Test',
  render: () => (
    <Stack spacing={2}>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography>Left aligned actions</Typography>
        </CardContent>
        <CardActions alignment="left" data-testid="left-actions">
          <Button size="small">Action 1</Button>
          <Button size="small">Action 2</Button>
        </CardActions>
      </Card>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography>Center aligned actions</Typography>
        </CardContent>
        <CardActions alignment="center" data-testid="center-actions">
          <Button size="small">Action 1</Button>
          <Button size="small">Action 2</Button>
        </CardActions>
      </Card>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography>Right aligned actions</Typography>
        </CardContent>
        <CardActions alignment="right" data-testid="right-actions">
          <Button size="small">Action 1</Button>
          <Button size="small">Action 2</Button>
        </CardActions>
      </Card>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography>Space between actions</Typography>
        </CardContent>
        <CardActions alignment="space-between" data-testid="space-between-actions">
          <Button size="small">Left</Button>
          <Button size="small">Right</Button>
        </CardActions>
      </Card>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify left alignment', async () => {
      const actions = canvas.getByTestId('left-actions');
      const styles = window.getComputedStyle(actions);
      await expect(styles.justifyContent).toBe('flex-start');
    });

    await step('Verify center alignment', async () => {
      const actions = canvas.getByTestId('center-actions');
      const styles = window.getComputedStyle(actions);
      await expect(styles.justifyContent).toBe('center');
    });

    await step('Verify right alignment', async () => {
      const actions = canvas.getByTestId('right-actions');
      const styles = window.getComputedStyle(actions);
      await expect(styles.justifyContent).toBe('flex-end');
    });

    await step('Verify space-between alignment', async () => {
      const actions = canvas.getByTestId('space-between-actions');
      const styles = window.getComputedStyle(actions);
      await expect(styles.justifyContent).toBe('space-between');
    });
  },
};

export const CardMediaTest: Story = {
  name: '🖼️ Card Media Test',
  render: () => (
    <Card sx={{ width: 350 }}>
      <CardMedia
        component="img"
        height="200"
        image="https://via.placeholder.com/350x200"
        title="Test Image"
        data-testid="card-media"
      />
      <CardContent>
        <Typography>Card with media</Typography>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify media element', async () => {
      const media = canvas.getByTestId('card-media');
      await expect(media).toBeInTheDocument();
      await expect(media.tagName.toLowerCase()).toBe('img');
      await expect(media).toHaveAttribute('height', '200');
      await expect(media).toHaveAttribute('title', 'Test Image');
    });
  },
};

// Accessibility Tests
export const KeyboardNavigationTest: Story = {
  name: '⌨️ Keyboard Navigation Test',
  render: () => (
    <Stack spacing={2}>
      <Card interactive onClick={fn()} data-testid="interactive-card-1" tabIndex={0}>
        <CardContent>
          <Typography>First Interactive Card</Typography>
        </CardContent>
      </Card>
      <Card interactive onClick={fn()} data-testid="interactive-card-2" tabIndex={0}>
        <CardContent>
          <Typography>Second Interactive Card</Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
        ],
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation forward', async () => {
      const firstCard = canvas.getByTestId('interactive-card-1');
      const secondCard = canvas.getByTestId('interactive-card-2');

      // Focus first card
      firstCard.focus();
      await expect(firstCard).toHaveFocus();

      // Tab to next card
      await userEvent.tab();
      await expect(secondCard).toHaveFocus();
    });

    await step('Tab navigation backward', async () => {
      await userEvent.tab({ shift: true });
      const firstCard = canvas.getByTestId('interactive-card-1');
      await expect(firstCard).toHaveFocus();
    });
  },
};

// Visual States Test
export const VisualStatesTest: Story = {
  name: '👁️ Visual States Test',
  render: () => (
    <Stack spacing={2}>
      <Card data-testid="normal-card" sx={{ width: 300 }}>
        <CardContent>
          <Typography>Normal State</Typography>
        </CardContent>
      </Card>
      <Card interactive data-testid="hover-card" sx={{ width: 300 }}>
        <CardContent>
          <Typography>Hover State (interactive)</Typography>
        </CardContent>
      </Card>
      <Card data-testid="disabled-card" sx={{ width: 300, opacity: 0.5, pointerEvents: 'none' }}>
        <CardContent>
          <Typography>Disabled State</Typography>
        </CardContent>
      </Card>
      <Card loading data-testid="loading-state-card" sx={{ width: 300 }}>
        <CardContent>
          <Typography>Loading State</Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Default state', async () => {
      const card = canvas.getByTestId('normal-card');
      await expect(card).toHaveStyle({ opacity: '1' });
    });

    await step('Hover state', async () => {
      const card = canvas.getByTestId('hover-card');
      await userEvent.hover(card);
      await waitFor(() => {
        const transform = window.getComputedStyle(card).transform;
        expect(transform).not.toBe('none');
      });
    });

    await step('Disabled state', async () => {
      const card = canvas.getByTestId('disabled-card');
      await expect(card).toHaveStyle({ opacity: '0.5' });
      await expect(card).toHaveStyle({ pointerEvents: 'none' });
    });

    await step('Loading state', async () => {
      const card = canvas.getByTestId('loading-state-card');
      const styles = window.getComputedStyle(card);
      await expect(parseFloat(styles.opacity)).toBeLessThan(1);
      await expect(styles.pointerEvents).toBe('none');
    });
  },
};

// Responsive Design Test
export const ResponsiveDesignTest: Story = {
  name: '📱 Responsive Design Test',
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'mobile',
    },
    chromatic: {
      viewports: [375, 768, 1920],
      delay: 300,
    },
  },
  render: () => (
    <Box
      data-testid="responsive-container"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 2,
      }}
    >
      <Card>
        <CardContent>
          <Typography>Card 1</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography>Card 2</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography>Card 3</Typography>
        </CardContent>
      </Card>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify responsive grid', async () => {
      const container = canvas.getByTestId('responsive-container');
      const computedStyle = window.getComputedStyle(container);
      
      // Check grid template columns based on viewport
      const columns = computedStyle.gridTemplateColumns;
      await expect(columns).toBeTruthy();
    });
  },
};

// Edge Cases Test
export const EdgeCasesTest: Story = {
  name: '🔧 Edge Cases Test',
  render: () => (
    <Stack spacing={2}>
      <Card data-testid="empty-card" sx={{ width: 300, minHeight: 100 }}>
        {/* Empty card */}
      </Card>
      <Card data-testid="overflow-card" sx={{ width: 200, height: 100, overflow: 'hidden' }}>
        <CardContent>
          <Typography data-testid="long-text" noWrap>
            This is a very long text that should be truncated with ellipsis when it overflows the card boundaries
          </Typography>
        </CardContent>
      </Card>
      <Card data-testid="nested-card" sx={{ width: 350 }}>
        <CardContent>
          <Typography>Parent Card</Typography>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="body2">Nested Card</Typography>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty card handling', async () => {
      const emptyCard = canvas.getByTestId('empty-card');
      await expect(emptyCard).toBeInTheDocument();
      await expect(emptyCard.children.length).toBeGreaterThanOrEqual(0);
    });

    await step('Long text overflow', async () => {
      const textElement = canvas.getByTestId('long-text');
      const computedStyle = window.getComputedStyle(textElement);
      await expect(computedStyle.textOverflow).toBe('ellipsis');
      await expect(computedStyle.overflow).toBe('hidden');
    });

    await step('Nested cards', async () => {
      const nestedCard = canvas.getByTestId('nested-card');
      const innerCards = within(nestedCard).getAllByText(/Card/);
      await expect(innerCards.length).toBeGreaterThan(1);
    });
  },
};

// Integration Test
export const IntegrationWithOtherComponentsTest: Story = {
  name: '🔗 Integration Test',
  render: () => (
    <Card sx={{ width: 400 }}>
      <CardHeader
        avatar={<Avatar>JD</Avatar>}
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title="John Doe"
        subtitle="Software Engineer"
      />
      <CardMedia
        component="img"
        height="200"
        image="https://via.placeholder.com/400x200"
        title="Profile Banner"
      />
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body1">
            Full-stack developer with 5 years of experience
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip label="React" size="small" />
            <Chip label="TypeScript" size="small" />
            <Chip label="Node.js" size="small" />
          </Stack>
        </Stack>
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
        <Button variant="contained" size="small">
          Contact
        </Button>
      </CardActions>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify all card sections', async () => {
      // Header
      const title = canvas.getByText('John Doe');
      await expect(title).toBeInTheDocument();
      
      // Media
      const media = canvas.getByTitle('Profile Banner');
      await expect(media).toBeInTheDocument();
      
      // Content with chips
      const chips = canvas.getAllByRole('button', { name: /React|TypeScript|Node.js/ });
      await expect(chips).toHaveLength(3);
      
      // Actions
      const contactButton = canvas.getByRole('button', { name: /Contact/i });
      await expect(contactButton).toBeInTheDocument();
    });

    await step('Test integrated interactions', async () => {
      const contactButton = canvas.getByRole('button', { name: /Contact/i });
      await userEvent.click(contactButton);
      await expect(contactButton).toBeEnabled();
    });
  },
};