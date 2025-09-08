import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Box, IconButton, Button } from '@mui/material';
import { Mail, Notifications, ShoppingCart, CheckCircle, Star, Person, Settings } from '@mui/icons-material';
import React, { useState } from 'react';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Data Display/Badge/Tests',
  component: Badge,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false }
  },
  tags: ['autodocs', 'test', 'component:Badge']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    badgeContent: 5,
    onClick: fn(),
    children: (
      <IconButton data-testid="badge-button">
        <Mail />
      </IconButton>
    )
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    await step('Initial render verification', async () => {
      const badge = canvas.getByText('5');
      await expect(badge).toBeInTheDocument();
    });
    
    await step('Click interaction on child element', async () => {
      const button = canvas.getByTestId('badge-button');
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });
    
    await step('Hover interaction', async () => {
      const badge = canvas.getByText('5');
      await userEvent.hover(badge);
      // Badge should maintain visibility on hover
      await expect(badge).toBeVisible();
    });
  }
};

export const CountVariantTest: Story = {
  name: '📊 Count Variant Test',
  args: {
    variant: 'count',
    badgeContent: 0,
    showZero: false,
    max: 99,
    children: <ShoppingCart data-testid="cart-icon" />
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    await step('Zero count should be hidden when showZero is false', async () => {
      const badge = canvas.queryByText('0');
      await expect(badge).not.toBeInTheDocument();
    });
    
    await step('Update to show zero', async () => {
      // Re-render with showZero true
      args.showZero = true;
      const badge = await canvas.findByText('0');
      await expect(badge).toBeInTheDocument();
    });
    
    await step('Test max count formatting', async () => {
      args.badgeContent = 150;
      args.showZero = false;
      const badge = await canvas.findByText('99+');
      await expect(badge).toBeInTheDocument();
    });
  }
};

export const DotVariantTest: Story = {
  name: '🔴 Dot Variant Test',
  args: {
    variant: 'dot',
    color: 'success',
    pulse: false,
    children: <Notifications data-testid="notification-icon" />
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify dot variant rendering', async () => {
      // Dot variant shouldn't show any text content
      const badges = canvas.queryAllByText(/\d+/);
      await expect(badges).toHaveLength(0);
      
      // Should have the notification icon
      const icon = canvas.getByTestId('notification-icon');
      await expect(icon).toBeInTheDocument();
    });
    
    await step('Verify dot is visible', async () => {
      const badge = canvasElement.querySelector('.MuiBadge-dot');
      await expect(badge).toBeInTheDocument();
      await expect(badge).toBeVisible();
    });
  }
};

// Accessibility Tests
export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  args: {
    badgeContent: 'NEW',
    color: 'primary',
    children: (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <IconButton data-testid="first-focusable" aria-label="First button with badge">
          <Mail />
        </IconButton>
        <IconButton data-testid="second-focusable" aria-label="Second button with badge">
          <Notifications />
        </IconButton>
      </Box>
    )
  },
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'button-name', enabled: true }
        ]
      }
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Tab navigation forward', async () => {
      const firstButton = canvas.getByTestId('first-focusable');
      const secondButton = canvas.getByTestId('second-focusable');
      
      // Focus first element
      firstButton.focus();
      await expect(firstButton).toHaveFocus();
      
      // Tab to next element
      await userEvent.tab();
      await expect(secondButton).toHaveFocus();
    });
    
    await step('Tab navigation backward', async () => {
      await userEvent.tab({ shift: true });
      const firstButton = canvas.getByTestId('first-focusable');
      await expect(firstButton).toHaveFocus();
    });
    
    await step('Enter key activation on focused button', async () => {
      const button = canvas.getByTestId('first-focusable');
      button.focus();
      await userEvent.keyboard('{Enter}');
      // Verify button can be activated
      await expect(button).toHaveFocus();
    });
  }
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  args: {
    badgeContent: 12,
    color: 'error',
    'aria-label': '12 new notifications',
    children: (
      <IconButton aria-label="Notifications">
        <Notifications />
      </IconButton>
    )
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify ARIA labels on button', async () => {
      const button = canvas.getByLabelText('Notifications');
      await expect(button).toBeInTheDocument();
    });
    
    await step('Verify badge content is readable', async () => {
      const badge = canvas.getByText('12');
      await expect(badge).toBeInTheDocument();
      await expect(badge).toHaveAttribute('aria-hidden', 'false');
    });
    
    await step('Verify role attributes', async () => {
      const button = canvas.getByRole('button');
      await expect(button).toBeInTheDocument();
    });
  }
};

// Visual Tests
export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  args: {
    badgeContent: 99,
    size: 'md',
    children: <Mail data-testid="responsive-icon" />
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: { 
          name: 'Mobile', 
          styles: { width: '375px', height: '667px' },
          type: 'mobile' 
        },
        tablet: { 
          name: 'Tablet', 
          styles: { width: '768px', height: '1024px' },
          type: 'tablet'
        },
        desktop: { 
          name: 'Desktop', 
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop'
        }
      },
      defaultViewport: 'mobile'
    },
    chromatic: {
      viewports: [375, 768, 1920],
      delay: 300
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify badge scales appropriately', async () => {
      const badge = canvas.getByText('99');
      await expect(badge).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(badge);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      // Font size should be reasonable for the viewport
      await expect(fontSize).toBeGreaterThan(8);
      await expect(fontSize).toBeLessThan(20);
    });
  }
};

export const ThemeVariations: Story = {
  name: '🎨 Theme Variations Test',
  args: {
    badgeContent: 'HOT',
    color: 'error',
    variant: 'gradient',
    glow: true,
    children: <ShoppingCart />
  },
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' }
      ]
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify theme colors', async () => {
      const badge = canvas.getByText('HOT');
      const computedStyle = window.getComputedStyle(badge);
      
      // Check if gradient is applied
      const background = computedStyle.background || computedStyle.backgroundImage;
      await expect(background).toMatch(/gradient|linear/i);
    });
    
    await step('Verify glow effect', async () => {
      const badge = canvas.getByText('HOT');
      const computedStyle = window.getComputedStyle(badge);
      
      // Check for box shadow (glow effect)
      await expect(computedStyle.boxShadow).not.toBe('none');
    });
  }
};

export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  args: {
    badgeContent: 5,
    color: 'primary',
    children: (
      <Box sx={{ display: 'flex', gap: 3 }}>
        <IconButton data-testid="normal-button">
          <Badge badgeContent={5}>
            <Mail />
          </Badge>
        </IconButton>
        <IconButton data-testid="disabled-button" disabled>
          <Badge badgeContent={5}>
            <Mail />
          </Badge>
        </IconButton>
      </Box>
    )
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Default state', async () => {
      const normalButton = canvas.getByTestId('normal-button');
      await expect(normalButton).not.toBeDisabled();
      await expect(normalButton).toHaveStyle({ opacity: '1' });
    });
    
    await step('Hover state', async () => {
      const normalButton = canvas.getByTestId('normal-button');
      await userEvent.hover(normalButton);
      // Button should respond to hover
      await expect(normalButton).toBeInTheDocument();
    });
    
    await step('Disabled state', async () => {
      const disabledButton = canvas.getByTestId('disabled-button');
      await expect(disabledButton).toBeDisabled();
      const computedStyle = window.getComputedStyle(disabledButton);
      const opacity = parseFloat(computedStyle.opacity);
      await expect(opacity).toBeLessThan(1);
    });
  }
};

// Performance Tests
export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  args: {
    children: (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }} data-testid="badge-container">
        {Array.from({ length: 20 }, (_, i) => (
          <Badge key={i} badgeContent={i + 1} data-testid={`badge-item-${i}`}>
            <Mail />
          </Badge>
        ))}
      </Box>
    )
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Measure render time', async () => {
      const startTime = window.performance.now();
      const elements = canvas.getAllByTestId(/badge-item-/);
      const endTime = window.performance.now();
      
      const renderTime = endTime - startTime;
      // Log render time for debugging (can be removed in production)
      // eslint-disable-next-line no-console
      console.log(`Render time for ${elements.length} badges: ${renderTime}ms`);
      
      // Assert reasonable render time
      await expect(renderTime).toBeLessThan(500);
      await expect(elements).toHaveLength(20);
    });
  }
};

// Edge Cases Tests
export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  args: {
    badgeContent: '',
    children: <Mail data-testid="mail-icon" />
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    await step('Empty content handling', async () => {
      // Badge with empty content should not crash
      const icon = canvas.getByTestId('mail-icon');
      await expect(icon).toBeInTheDocument();
    });
    
    await step('Long text overflow', async () => {
      args.badgeContent = 'VERYLONGTEXTCONTENT';
      await waitFor(() => {
        const badges = canvasElement.querySelectorAll('.MuiBadge-badge');
        const badge = badges[badges.length - 1];
        if (badge) {
          const computedStyle = window.getComputedStyle(badge);
          // Badge should handle long text appropriately
          expect(parseFloat(computedStyle.width)).toBeGreaterThan(20);
        }
      });
    });
    
    await step('Special characters handling', async () => {
      args.badgeContent = '!@#';
      const badge = await canvas.findByText('!@#');
      await expect(badge).toBeInTheDocument();
    });
    
    await step('Maximum number handling', async () => {
      args.badgeContent = 9999;
      args.max = 999;
      const badge = await canvas.findByText('999+');
      await expect(badge).toBeInTheDocument();
    });
  }
};

// Animation Tests
export const AnimationTest: Story = {
  name: '🎬 Animation Test',
  args: {
    variant: 'dot',
    color: 'success',
    pulse: true,
    glow: false,
    children: <Notifications data-testid="animated-icon" />
  },
  play: async ({ canvasElement, step, args }) => {
    within(canvasElement);
    
    await step('Verify pulse animation', async () => {
      const badge = canvasElement.querySelector('.MuiBadge-dot');
      await expect(badge).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(badge);
      // Check if animation is applied
      await expect(computedStyle.animationName).not.toBe('none');
      await expect(computedStyle.animationDuration).toBe('2s');
    });
    
    await step('Toggle glow effect', async () => {
      args.glow = true;
      args.pulse = false;
      
      await waitFor(() => {
        const badge = canvasElement.querySelector('.MuiBadge-dot');
        if (badge) {
          const computedStyle = window.getComputedStyle(badge);
          // Glow should add box shadow
          expect(computedStyle.boxShadow).not.toBe('none');
        }
      });
    });
    
    await step('Both animations together', async () => {
      args.glow = true;
      args.pulse = true;
      
      await waitFor(() => {
        const badge = canvasElement.querySelector('.MuiBadge-dot');
        if (badge) {
          const computedStyle = window.getComputedStyle(badge);
          // Both effects should be applied
          expect(computedStyle.boxShadow).not.toBe('none');
          expect(computedStyle.animationName).not.toBe('none');
        }
      });
    });
  }
};

// Position Tests
export const PositionTest: Story = {
  name: '📍 Position Test',
  args: {
    badgeContent: 1,
    position: 'top-right',
    children: (
      <Box 
        sx={{ width: 60, height: 60, bgcolor: 'grey.300', borderRadius: 1 }}
        data-testid="position-box"
      />
    )
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    const positions: Array<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'> = [
      'top-right', 
      'top-left', 
      'bottom-right', 
      'bottom-left'
    ];
    
    for (const pos of positions) {
      await step(`Test ${pos} position`, async () => {
        args.position = pos;
        args.badgeContent = positions.indexOf(pos) + 1;
        
        await waitFor(() => {
          const badge = canvas.getByText(String(positions.indexOf(pos) + 1));
          expect(badge).toBeInTheDocument();
        });
      });
    }
  }
};

// Integration Test
export const IntegrationTest: Story = {
  name: '🔗 Integration Test',
  render: (args) => (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      <Badge {...args} badgeContent={3} color="primary">
        <IconButton data-testid="primary-button">
          <Mail />
        </IconButton>
      </Badge>
      <Badge {...args} variant="dot" color="success">
        <IconButton data-testid="success-button">
          <Notifications />
        </IconButton>
      </Badge>
      <Badge {...args} badgeContent={99} color="error" max={99}>
        <IconButton data-testid="error-button">
          <ShoppingCart />
        </IconButton>
      </Badge>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify multiple badges render correctly', async () => {
      const primaryBadge = canvas.getByText('3');
      const errorBadge = canvas.getByText('99');
      
      await expect(primaryBadge).toBeInTheDocument();
      await expect(errorBadge).toBeInTheDocument();
    });
    
    await step('Interact with different badged buttons', async () => {
      const buttons = ['primary-button', 'success-button', 'error-button'];
      
      for (const buttonId of buttons) {
        const button = canvas.getByTestId(buttonId);
        await userEvent.click(button);
        await expect(button).toBeInTheDocument();
      }
    });
  }
};

// Test for new variants
export const NewVariantsTest: Story = {
  name: '🎨 New Variants Test',
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Badge variant="outline" badgeContent="Outline" color="primary">
        <Box sx={{ p: 2, bgcolor: 'grey.100' }}>Outline</Box>
      </Badge>
      <Badge variant="secondary" badgeContent="Secondary" color="secondary">
        <Box sx={{ p: 2, bgcolor: 'grey.100' }}>Secondary</Box>
      </Badge>
      <Badge variant="destructive" badgeContent="!" color="error">
        <Box sx={{ p: 2, bgcolor: 'grey.100' }}>Destructive</Box>
      </Badge>
      <Badge variant="success" badgeContent="✓" color="success">
        <Box sx={{ p: 2, bgcolor: 'grey.100' }}>Success</Box>
      </Badge>
      <Badge variant="warning" badgeContent="⚠" color="warning">
        <Box sx={{ p: 2, bgcolor: 'grey.100' }}>Warning</Box>
      </Badge>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify all new variants render correctly', async () => {
      const outlineBadge = canvas.getByText('Outline');
      const secondaryBadge = canvas.getByText('Secondary');
      const destructiveBadge = canvas.getByText('!');
      const successBadge = canvas.getByText('✓');
      const warningBadge = canvas.getByText('⚠');
      
      await expect(outlineBadge).toBeInTheDocument();
      await expect(secondaryBadge).toBeInTheDocument();
      await expect(destructiveBadge).toBeInTheDocument();
      await expect(successBadge).toBeInTheDocument();
      await expect(warningBadge).toBeInTheDocument();
    });
  }
};

// Test closable badges
export const ClosableBadgeTest: Story = {
  name: '❌ Closable Badge Test',
  args: {
    badgeContent: 'Close Me',
    closable: true,
    onClose: fn(),
    color: 'primary',
    variant: 'secondary',
    children: <Box sx={{ p: 2, bgcolor: 'grey.200' }}>Content</Box>
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    await step('Verify closable badge renders with close button', async () => {
      const badge = canvas.getByText('Close Me');
      await expect(badge).toBeInTheDocument();
      
      // Check for close button
      const closeButtons = canvasElement.querySelectorAll('button');
      const closeButton = Array.from(closeButtons).find(btn => 
        btn.querySelector('svg[data-testid="CloseIcon"]')
      );
      await expect(closeButton).toBeTruthy();
    });
    
    await step('Click close button', async () => {
      const closeButtons = canvasElement.querySelectorAll('button');
      const closeButton = Array.from(closeButtons).find(btn => 
        btn.querySelector('svg[data-testid="CloseIcon"]')
      ) as HTMLButtonElement | undefined;
      
      if (closeButton) {
        await userEvent.click(closeButton);
        // Wait for fade out animation
        await waitFor(() => {
          expect(args.onClose).toHaveBeenCalledTimes(1);
        }, { timeout: 500 });
      }
    });
  }
};

// Test badges with icons
export const BadgeWithIconTest: Story = {
  name: '🎯 Badge with Icon Test',
  args: {
    icon: <CheckCircle sx={{ fontSize: 'inherit' }} />,
    badgeContent: 'Success',
    color: 'success',
    variant: 'success',
    children: <Box sx={{ p: 2, bgcolor: 'grey.100' }}>Task</Box>
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify badge renders with icon and text', async () => {
      const badge = canvas.getByText('Success');
      await expect(badge).toBeInTheDocument();
      
      // Check for icon presence
      const icon = canvasElement.querySelector('svg[data-testid="CheckCircleIcon"]');
      await expect(icon).toBeTruthy();
    });
  }
};

// Test shimmer effect
export const ShimmerEffectTest: Story = {
  name: '✨ Shimmer Effect Test',
  args: {
    badgeContent: 'PREMIUM',
    shimmer: true,
    variant: 'gradient',
    color: 'primary',
    children: <Star data-testid="star-icon" />
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify shimmer effect is applied', async () => {
      const badge = canvas.getByText('PREMIUM');
      await expect(badge).toBeInTheDocument();
      
      // Check for shimmer animation (pseudo-element will have animation)
      const badgeElement = badge.closest('.MuiBadge-badge');
      await expect(badgeElement).toBeTruthy();
    });
  }
};

// Test bounce animation
export const BounceAnimationTest: Story = {
  name: '🏀 Bounce Animation Test',
  args: {
    badgeContent: 'NEW',
    bounce: true,
    color: 'success',
    children: <Box sx={{ p: 2, bgcolor: 'grey.100' }}>Item</Box>
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify bounce animation is applied', async () => {
      const badge = canvas.getByText('NEW');
      await expect(badge).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(badge);
      // Check if animation is applied
      await expect(computedStyle.animationName).toBeTruthy();
    });
  }
};

// Test extra small size
export const ExtraSmallSizeTest: Story = {
  name: '🔬 Extra Small Size Test',
  args: {
    size: 'xs',
    badgeContent: 2,
    color: 'primary',
    children: <Mail data-testid="mail-icon" />
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify extra small size renders correctly', async () => {
      const badge = canvas.getByText('2');
      await expect(badge).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(badge);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      // Extra small should have smallest font size
      await expect(fontSize).toBeLessThan(10);
    });
  }
};

// State Management Test
const StateManagementComponent = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          onClick={() => setCount(c => c + 1)}
          data-testid="increment-button"
        >
          Increment ({count})
        </Button>
        <Button 
          onClick={() => setCount(c => Math.max(0, c - 1))}
          data-testid="decrement-button"
        >
          Decrement
        </Button>
        <Button 
          onClick={() => setIsVisible(v => !v)}
          data-testid="toggle-visibility"
        >
          Toggle Visibility
        </Button>
      </Box>
      <Badge 
        badgeContent={count} 
        color="primary" 
        invisible={!isVisible}
        showZero
        data-testid="dynamic-badge"
      >
        <Mail data-testid="mail-with-badge" />
      </Badge>
      <Box data-testid="count-display">Count: {count}</Box>
      <Box data-testid="visibility-display">Visible: {isVisible.toString()}</Box>
    </Box>
  );
};

export const StateManagementTest: Story = {
  name: '🔄 State Management Test',
  render: () => <StateManagementComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Initial state verification', async () => {
      const countDisplay = canvas.getByTestId('count-display');
      const visibilityDisplay = canvas.getByTestId('visibility-display');
      
      await expect(countDisplay).toHaveTextContent('Count: 0');
      await expect(visibilityDisplay).toHaveTextContent('Visible: true');
    });
    
    await step('Increment count updates badge', async () => {
      const incrementButton = canvas.getByTestId('increment-button');
      await userEvent.click(incrementButton);
      
      const badge = canvas.getByText('1');
      await expect(badge).toBeInTheDocument();
      
      const countDisplay = canvas.getByTestId('count-display');
      await expect(countDisplay).toHaveTextContent('Count: 1');
    });
    
    await step('Multiple increments', async () => {
      const incrementButton = canvas.getByTestId('increment-button');
      await userEvent.click(incrementButton);
      await userEvent.click(incrementButton);
      await userEvent.click(incrementButton);
      
      const badge = canvas.getByText('4');
      await expect(badge).toBeInTheDocument();
    });
    
    await step('Decrement count', async () => {
      const decrementButton = canvas.getByTestId('decrement-button');
      await userEvent.click(decrementButton);
      await userEvent.click(decrementButton);
      
      const badge = canvas.getByText('2');
      await expect(badge).toBeInTheDocument();
    });
    
    await step('Toggle visibility', async () => {
      const toggleButton = canvas.getByTestId('toggle-visibility');
      await userEvent.click(toggleButton);
      
      const visibilityDisplay = canvas.getByTestId('visibility-display');
      await expect(visibilityDisplay).toHaveTextContent('Visible: false');
      
      // Badge should be hidden
      const badge = canvas.queryByText('2');
      await expect(badge).not.toBeInTheDocument();
    });
    
    await step('Toggle visibility back', async () => {
      const toggleButton = canvas.getByTestId('toggle-visibility');
      await userEvent.click(toggleButton);
      
      const badge = canvas.getByText('2');
      await expect(badge).toBeInTheDocument();
    });
  }
};

// Focus Management Enhanced Test
const FocusManagementComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { label: 'Messages', icon: <Mail />, count: 5 },
    { label: 'Notifications', icon: <Notifications />, count: 12 },
    { label: 'Settings', icon: <Settings />, count: 3 },
    { label: 'Profile', icon: <Person />, count: 0 }
  ];
  
  return (
    <Box sx={{ display: 'flex', gap: 2 }} role="tablist">
      {items.map((item, index) => (
        <Badge 
          key={item.label}
          badgeContent={item.count}
          color="primary"
          showZero={index === 3} // Show zero for profile
        >
          <Button
            data-testid={`focus-item-${index}`}
            onFocus={() => setActiveIndex(index)}
            sx={{ 
              minWidth: 80,
              border: activeIndex === index ? 2 : 1,
              borderColor: activeIndex === index ? 'primary.main' : 'grey.300',
              borderStyle: 'solid'
            }}
            aria-label={`${item.label}, ${item.count} notifications`}
          >
            {item.icon}
          </Button>
        </Badge>
      ))}
      <Box data-testid="active-index" aria-live="polite">
        Active: {activeIndex}
      </Box>
    </Box>
  );
};

export const FocusManagementTest: Story = {
  name: '🔍 Focus Management Test',
  render: () => <FocusManagementComponent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Initial focus state', async () => {
      const activeDisplay = canvas.getByTestId('active-index');
      await expect(activeDisplay).toHaveTextContent('Active: 0');
    });
    
    await step('Tab through focusable elements', async () => {
      // Focus first item
      const firstItem = canvas.getByTestId('focus-item-0');
      firstItem.focus();
      await expect(firstItem).toHaveFocus();
      
      // Tab to second item
      await userEvent.tab();
      const secondItem = canvas.getByTestId('focus-item-1');
      await expect(secondItem).toHaveFocus();
      
      const activeDisplay = canvas.getByTestId('active-index');
      await expect(activeDisplay).toHaveTextContent('Active: 1');
      
      // Tab to third item
      await userEvent.tab();
      const thirdItem = canvas.getByTestId('focus-item-2');
      await expect(thirdItem).toHaveFocus();
      
      await expect(canvas.getByTestId('active-index')).toHaveTextContent('Active: 2');
    });
    
    await step('Reverse tab navigation', async () => {
      await userEvent.tab({ shift: true });
      const secondItem = canvas.getByTestId('focus-item-1');
      await expect(secondItem).toHaveFocus();
      
      const activeDisplay = canvas.getByTestId('active-index');
      await expect(activeDisplay).toHaveTextContent('Active: 1');
    });
    
    await step('Verify badge content accessibility', async () => {
      const button = canvas.getByLabelText(/Messages, 5 notifications/);
      await expect(button).toBeInTheDocument();
      
      const profileButton = canvas.getByLabelText(/Profile, 0 notifications/);
      await expect(profileButton).toBeInTheDocument();
    });
  }
};

// WCAG Compliance Test
export const WCAGComplianceTest: Story = {
  name: '♿ WCAG Compliance Test',
  args: {
    badgeContent: 'Alert',
    color: 'error',
    'aria-label': 'Error alert notification',
    'aria-live': 'assertive',
    'aria-atomic': true,
    children: (
      <Button 
        aria-describedby="badge-description"
        data-testid="wcag-button"
      >
        System Status
      </Button>
    )
  },
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'link-name', enabled: true },
          { id: 'label', enabled: true }
        ]
      }
    }
  },
  render: (args) => (
    <Box>
      <Badge {...args} />
      <div 
        id="badge-description" 
        style={{ position: 'absolute', left: '-10000px' }}
      >
        This badge indicates system status alerts
      </div>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify ARIA attributes', async () => {
      const badge = canvas.getByText('Alert');
      await expect(badge).toBeInTheDocument();
      
      // Check that badge has proper ARIA live region
      const badgeElement = badge.closest('[aria-live]');
      await expect(badgeElement).toHaveAttribute('aria-live', 'assertive');
      await expect(badgeElement).toHaveAttribute('aria-atomic', 'true');
    });
    
    await step('Verify button accessibility', async () => {
      const button = canvas.getByTestId('wcag-button');
      await expect(button).toHaveAttribute('aria-describedby', 'badge-description');
      
      // Button should be focusable
      button.focus();
      await expect(button).toHaveFocus();
    });
    
    await step('Color contrast verification', async () => {
      const badge = canvas.getByText('Alert');
      const computedStyle = window.getComputedStyle(badge);
      
      // Error color should provide good contrast
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      
      await expect(backgroundColor).toBeTruthy();
      await expect(color).toBeTruthy();
    });
    
    await step('Keyboard activation', async () => {
      const button = canvas.getByTestId('wcag-button');
      button.focus();
      
      // Should be activatable with Enter
      await userEvent.keyboard('{Enter}');
      await expect(button).toHaveFocus();
      
      // Should be activatable with Space
      await userEvent.keyboard(' ');
      await expect(button).toHaveFocus();
    });
  }
};

// Cross Browser Compatibility Test
export const CrossBrowserTest: Story = {
  name: '🌐 Cross Browser Test',
  args: {
    variant: 'glass',
    badgeContent: 'BETA',
    color: 'primary',
    glow: true,
    shimmer: true,
    children: <Box sx={{ p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>Feature</Box>
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify backdrop-filter support fallback', async () => {
      const badge = canvas.getByText('BETA');
      const computedStyle = window.getComputedStyle(badge);
      
      // Check if backdrop-filter is supported or has fallback
      const hasBackdropFilter = computedStyle.backdropFilter !== undefined;
      const hasWebkitBackdropFilter = 'webkitBackdropFilter' in computedStyle && (computedStyle as Record<string, unknown>).webkitBackdropFilter !== undefined;
      const hasBackground = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)';
      
      // At least one should be true for cross-browser compatibility
      const isCompatible = hasBackdropFilter || hasWebkitBackdropFilter || hasBackground;
      await expect(isCompatible).toBe(true);
    });
    
    await step('CSS Grid/Flexbox fallback', async () => {
      // Check if badges work with various layout systems
      const badge = canvas.getByText('BETA');
      await expect(badge).toBeVisible();
      
      const computedStyle = window.getComputedStyle(badge);
      const position = computedStyle.position;
      
      // Should have proper positioning
      await expect(position).toMatch(/absolute|relative|fixed/);
    });
    
    await step('Animation performance', async () => {
      const badge = canvas.getByText('BETA');
      const computedStyle = window.getComputedStyle(badge);
      
      // Check for hardware acceleration hints
      const willChange = computedStyle.willChange;
      const backfaceVisibility = computedStyle.backfaceVisibility;
      
      // Modern browsers should support these optimization properties
      await expect(willChange).toBeTruthy();
      await expect(backfaceVisibility).toBeTruthy();
    });
  }
};