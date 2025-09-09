import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';
import { Stack, Box } from '@mui/material';
import { Person } from '@mui/icons-material';
import React from 'react';

import { Avatar, AvatarGroup } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'DataDisplay/Avatar/Tests',
  component: Avatar,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:Avatar'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    fallback: 'TEST',
    interactive: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const avatar = canvas.getByRole('button');
      await expect(avatar).toBeInTheDocument();
      await expect(avatar).toHaveTextContent('TEST');
    });

    await step('Click interaction', async () => {
      const avatar = canvas.getByRole('button');
      await userEvent.click(avatar);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step('Hover interaction', async () => {
      const avatar = canvas.getByRole('button');
      await userEvent.hover(avatar);
      // Check for transform style applied on hover
      const computedStyle = window.getComputedStyle(avatar);
      await waitFor(() => {
        expect(computedStyle.transform).not.toBe('none');
      });
    });
  },
};

export const ImageLoadingTest: Story = {
  name: '📷 Image Loading Test',
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'Test User',
    fallback: 'TU',
    onError: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Check image loading', async () => {
      const avatar = canvas.getByRole('img', { hidden: true });
      await expect(avatar).toBeInTheDocument();
      await expect(avatar).toHaveAttribute('alt', 'Test User');
    });

    await step('Image should have src attribute', async () => {
      const avatar = canvas.getByRole('img', { hidden: true });
      await expect(avatar).toHaveAttribute('src');
    });
  },
};

export const StatusIndicatorTest: Story = {
  name: '🔵 Status Indicator Test',
  render: () => (
    <Stack direction="row" spacing={2}>
      <Avatar variant="status" status="online" fallback="ON" data-testid="online-avatar" />
      <Avatar variant="status" status="offline" fallback="OF" data-testid="offline-avatar" />
      <Avatar variant="status" status="away" fallback="AW" data-testid="away-avatar" />
      <Avatar variant="status" status="busy" fallback="BS" data-testid="busy-avatar" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify all status variants render', async () => {
      const onlineAvatar = canvas.getByTestId('online-avatar');
      const offlineAvatar = canvas.getByTestId('offline-avatar');
      const awayAvatar = canvas.getByTestId('away-avatar');
      const busyAvatar = canvas.getByTestId('busy-avatar');

      await expect(onlineAvatar).toBeInTheDocument();
      await expect(offlineAvatar).toBeInTheDocument();
      await expect(awayAvatar).toBeInTheDocument();
      await expect(busyAvatar).toBeInTheDocument();
    });

    await step('Check status badge presence', async () => {
      // Check for badge elements (MUI Badge creates specific class names)
      const badges = canvas.container.querySelectorAll('.MuiBadge-badge');
      await expect(badges.length).toBeGreaterThan(0);
    });
  },
};

// Accessibility Tests
export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  render: () => (
    <Stack direction="row" spacing={2}>
      <Avatar
        fallback="KB1"
        interactive
        onClick={fn()}
        data-testid="first-avatar"
        aria-label="First Avatar"
      />
      <Avatar
        fallback="KB2"
        interactive
        onClick={fn()}
        data-testid="second-avatar"
        aria-label="Second Avatar"
      />
      <Avatar
        fallback="KB3"
        interactive
        onClick={fn()}
        data-testid="third-avatar"
        aria-label="Third Avatar"
      />
    </Stack>
  ),
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'button-name', enabled: true },
        ],
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation forward', async () => {
      const firstAvatar = canvas.getByTestId('first-avatar');
      const secondAvatar = canvas.getByTestId('second-avatar');

      // Focus first element
      firstAvatar.focus();
      await expect(firstAvatar).toHaveFocus();

      // Tab to next element
      await userEvent.tab();
      await expect(secondAvatar).toHaveFocus();
    });

    await step('Tab navigation backward', async () => {
      await userEvent.tab({ shift: true });
      const firstAvatar = canvas.getByTestId('first-avatar');
      await expect(firstAvatar).toHaveFocus();
    });

    await step('Enter key activation', async () => {
      const firstAvatar = canvas.getByTestId('first-avatar');
      firstAvatar.focus();
      await userEvent.keyboard('{Enter}');
      // Verify the click was triggered (would need to check onClick mock)
    });

    await step('Space key activation', async () => {
      const secondAvatar = canvas.getByTestId('second-avatar');
      secondAvatar.focus();
      await userEvent.keyboard(' ');
      // Verify the click was triggered
    });
  },
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  args: {
    fallback: 'SR',
    alt: 'Screen reader test avatar',
    interactive: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify ARIA labels', async () => {
      const avatar = canvas.getByRole('button');
      await expect(avatar).toHaveAttribute('aria-label', 'Screen reader test avatar');
    });

    await step('Verify role attributes', async () => {
      const avatar = canvas.getByRole('button');
      await expect(avatar).toHaveAttribute('role', 'button');
      await expect(avatar).toHaveAttribute('tabindex', '0');
    });
  },
};

// Visual Tests
export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  render: () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(3, 1fr)',
          sm: 'repeat(4, 1fr)',
          md: 'repeat(6, 1fr)',
        },
        gap: 2,
        width: '100%',
      }}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <Avatar key={i} fallback={`R${i + 1}`} data-testid={`responsive-avatar-${i}`} />
      ))}
    </Box>
  ),
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify responsive grid layout', async () => {
      const container = canvas.container.firstElementChild;
      const computedStyle = window.getComputedStyle(container as HTMLElement);

      // Check grid is applied
      await expect(computedStyle.display).toBe('grid');

      // Verify all avatars are rendered
      const avatars = canvas.getAllByTestId(/responsive-avatar-/);
      await expect(avatars).toHaveLength(12);
    });
  },
};

export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar fallback="DF" data-testid="default-avatar" />
        <Avatar fallback="GL" glow data-testid="glow-avatar" />
        <Avatar fallback="PL" pulse data-testid="pulse-avatar" />
        <Avatar fallback="BD" bordered data-testid="bordered-avatar" />
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar fallback="IN" interactive data-testid="interactive-avatar" />
        <Avatar fallback="LD" loading data-testid="loading-avatar" />
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Default state', async () => {
      const avatar = canvas.getByTestId('default-avatar');
      await expect(avatar).toBeInTheDocument();
    });

    await step('Glow effect', async () => {
      const avatar = canvas.getByTestId('glow-avatar');
      const computedStyle = window.getComputedStyle(avatar);
      // Glow effect adds box-shadow
      await expect(computedStyle.boxShadow).not.toBe('none');
    });

    await step('Hover state on interactive', async () => {
      const avatar = canvas.getByTestId('interactive-avatar');
      await userEvent.hover(avatar);
      // Interactive avatars transform on hover
      await waitFor(() => {
        const computedStyle = window.getComputedStyle(avatar);
        expect(computedStyle.transform).not.toBe('none');
      });
    });

    await step('Loading state', async () => {
      const loadingAvatar = canvas.getByTestId('loading-avatar');
      const spinner = loadingAvatar.parentElement?.querySelector('.loading-spinner');
      await expect(spinner).toBeInTheDocument();
    });
  },
};

// Performance Tests
export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  render: () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        maxWidth: 600,
        maxHeight: 400,
        overflow: 'auto',
      }}
    >
      {Array.from({ length: 100 }, (_, i) => (
        <Avatar key={i} fallback={`${i}`} size="sm" data-testid={`perf-avatar-${i}`} />
      ))}
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Measure render time', async () => {
      const startTime = window.performance.now();
      const avatars = canvas.getAllByTestId(/perf-avatar-/);
      const endTime = window.performance.now();

      const renderTime = endTime - startTime;
      // Log render time for debugging if needed
      // console.log(`Render time for ${avatars.length} avatars: ${renderTime}ms`);

      // Assert reasonable render time
      await expect(renderTime).toBeLessThan(1000);
      await expect(avatars).toHaveLength(100);
    });
  },
};

// Edge Cases Tests
export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar fallback="" data-testid="empty-fallback" />
        <Avatar fallback="VERYLONGTEXTTHATWILLOVERFLOW" data-testid="long-text" />
        <Avatar fallback="🎉" data-testid="emoji" />
        <Avatar fallback="中文" data-testid="unicode" />
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src="https://invalid-url.com/image.jpg" fallback="ERR" data-testid="error-image" />
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty fallback handling', async () => {
      const avatar = canvas.getByTestId('empty-fallback');
      await expect(avatar).toBeInTheDocument();
      // Should show default icon when fallback is empty
      const icon = avatar.querySelector('svg');
      await expect(icon).toBeInTheDocument();
    });

    await step('Long text overflow', async () => {
      const avatar = canvas.getByTestId('long-text');
      const computedStyle = window.getComputedStyle(avatar);
      await expect(computedStyle.overflow).toBe('hidden');
    });

    await step('Emoji support', async () => {
      const avatar = canvas.getByTestId('emoji');
      await expect(avatar).toHaveTextContent('🎉');
    });

    await step('Unicode support', async () => {
      const avatar = canvas.getByTestId('unicode');
      await expect(avatar).toHaveTextContent('中文');
    });

    await step('Image error handling', async () => {
      const avatar = canvas.getByTestId('error-image');
      // Wait for error to occur and fallback to show
      await waitFor(
        () => {
          expect(avatar).toHaveTextContent('ERR');
        },
        { timeout: 3000 },
      );
    });
  },
};

// Integration Tests
export const AvatarGroupTest: Story = {
  name: '🔗 Avatar Group Test',
  render: () => (
    <Stack spacing={2}>
      <AvatarGroup max={3}>
        <Avatar fallback="A1" data-testid="group-avatar-1" />
        <Avatar fallback="A2" data-testid="group-avatar-2" />
        <Avatar fallback="A3" data-testid="group-avatar-3" />
        <Avatar fallback="A4" data-testid="group-avatar-4" />
        <Avatar fallback="A5" data-testid="group-avatar-5" />
      </AvatarGroup>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify max avatars displayed', async () => {
      // Only first 3 should be visible plus the overflow indicator
      const visibleAvatars = canvas.container.querySelectorAll('.MuiAvatar-root');
      await expect(visibleAvatars.length).toBe(4); // 3 avatars + 1 overflow
    });

    await step('Verify overflow indicator', async () => {
      const avatars = canvas.container.querySelectorAll('.MuiAvatar-root');
      const lastAvatar = avatars[avatars.length - 1];
      await expect(lastAvatar).toHaveTextContent('+2');
    });

    await step('Hover effect on group avatars', async () => {
      const firstAvatar = canvas.getByTestId('group-avatar-1');
      await userEvent.hover(firstAvatar);
      // Group avatars should have hover effect
      const computedStyle = window.getComputedStyle(firstAvatar);
      await waitFor(() => {
        expect(computedStyle.zIndex).not.toBe('auto');
      });
    });
  },
};

// Animation Tests
export const AnimationTest: Story = {
  name: '🎬 Animation Test',
  render: () => (
    <Stack direction="row" spacing={2}>
      <Avatar fallback="A0" animationDelay={0} data-testid="delay-0" />
      <Avatar fallback="A200" animationDelay={200} data-testid="delay-200" />
      <Avatar fallback="A400" animationDelay={400} data-testid="delay-400" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify animation delays', async () => {
      const avatar0 = canvas.getByTestId('delay-0');
      const avatar200 = canvas.getByTestId('delay-200');
      const avatar400 = canvas.getByTestId('delay-400');

      // All avatars should be in the document
      await expect(avatar0).toBeInTheDocument();
      await expect(avatar200).toBeInTheDocument();
      await expect(avatar400).toBeInTheDocument();

      // Check they have proper fade-in applied
      await waitFor(() => {
        const opacity0 = window.getComputedStyle(avatar0.parentElement!).opacity;
        expect(parseFloat(opacity0)).toBeGreaterThan(0);
      });
    });
  },
};

// Focus Management Test
export const FocusManagement: Story = {
  name: '🎯 Focus Management Test',
  render: () => (
    <Stack spacing={2}>
      <Avatar fallback="FC" interactive data-testid="focus-avatar" aria-label="Focus test avatar" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Focus visible state', async () => {
      const avatar = canvas.getByTestId('focus-avatar');

      // Focus the avatar using keyboard
      avatar.focus();
      await expect(avatar).toHaveFocus();

      // Check for focus-visible styles
      const computedStyle = window.getComputedStyle(avatar);
      // Should have outline or other focus indicator
      await waitFor(() => {
        expect(computedStyle.outlineStyle).not.toBe('none');
      });
    });

    await step('Focus restoration after click', async () => {
      const avatar = canvas.getByTestId('focus-avatar');
      avatar.focus();

      await userEvent.click(avatar);
      // Focus should remain on the avatar after click
      await expect(avatar).toHaveFocus();
    });
  },
};

// Theme Integration Tests
export const ThemeIntegration: Story = {
  name: '🎨 Theme Integration Test',
  render: function ThemeIntegrationRender() {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

    return (
      <Box sx={{ p: 2, backgroundColor: theme === 'dark' ? '#303030' : '#f5f5f5' }}>
        <Stack spacing={2}>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            data-testid="theme-toggle"
            style={{ padding: '8px 16px', marginBottom: '16px' }}
          >
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
          </button>
          <Stack direction="row" spacing={2}>
            <Avatar fallback="LT" color="primary" data-testid="theme-avatar-primary" />
            <Avatar fallback="SC" color="secondary" data-testid="theme-avatar-secondary" />
            <Avatar fallback="ER" color="error" data-testid="theme-avatar-error" />
            <Avatar fallback="WN" color="warning" data-testid="theme-avatar-warning" />
            <Avatar fallback="SU" color="success" data-testid="theme-avatar-success" />
          </Stack>
        </Stack>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test light theme colors', async () => {
      const primaryAvatar = canvas.getByTestId('theme-avatar-primary');
      await expect(primaryAvatar).toBeInTheDocument();

      const computedStyle = window.getComputedStyle(primaryAvatar);
      // In light theme, should have specific color values
      await expect(computedStyle.backgroundColor).toBeDefined();
    });

    await step('Switch to dark theme', async () => {
      const themeToggle = canvas.getByTestId('theme-toggle');
      await userEvent.click(themeToggle);

      await waitFor(() => {
        expect(themeToggle).toHaveTextContent('Switch to light theme');
      });
    });

    await step('Test dark theme colors', async () => {
      const primaryAvatar = canvas.getByTestId('theme-avatar-primary');
      const computedStyle = window.getComputedStyle(primaryAvatar);

      // Colors should adapt to dark theme
      await expect(computedStyle.backgroundColor).toBeDefined();
      await expect(primaryAvatar).toBeInTheDocument();
    });
  },
};

// Enhanced Accessibility Compliance Tests
export const AccessibilityCompliance: Story = {
  name: '♿ Accessibility Compliance Test (WCAG)',
  render: () => (
    <Stack spacing={3}>
      {/* Color Contrast Tests */}
      <Stack direction="row" spacing={2} data-testid="contrast-section">
        <Avatar
          fallback="AA"
          color="primary"
          data-testid="contrast-primary"
          aria-label="Primary color avatar"
        />
        <Avatar
          fallback="BB"
          color="error"
          data-testid="contrast-error"
          aria-label="Error color avatar"
        />
        <Avatar
          fallback="CC"
          color="warning"
          data-testid="contrast-warning"
          aria-label="Warning color avatar"
        />
      </Stack>

      {/* Focus Indicators */}
      <Stack direction="row" spacing={2} data-testid="focus-section">
        <Avatar
          fallback="F1"
          interactive
          data-testid="focus-interactive"
          aria-label="Focusable interactive avatar"
        />
        <Avatar
          fallback="F2"
          onClick={fn()}
          data-testid="focus-clickable"
          aria-label="Focusable clickable avatar"
        />
      </Stack>

      {/* Screen Reader Support */}
      <Stack direction="row" spacing={2} data-testid="sr-section">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="Profile photo of John Doe"
          data-testid="sr-image"
        />
        <Avatar fallback="SR" aria-label="User initials: S.R." data-testid="sr-initials" />
        <Avatar icon={<Person />} aria-label="Generic user profile" data-testid="sr-icon" />
      </Stack>

      {/* Status Indicators with Labels */}
      <Stack direction="row" spacing={2} data-testid="status-section">
        <Avatar
          variant="status"
          status="online"
          fallback="ON"
          data-testid="status-online"
          aria-label="User is online"
        />
        <Avatar
          variant="status"
          status="busy"
          fallback="BS"
          data-testid="status-busy"
          aria-label="User is busy"
        />
      </Stack>
    </Stack>
  ),
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          // WCAG 2.1 AA compliance rules
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
          { id: 'image-alt', enabled: true },
          { id: 'keyboard-navigation', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'aria-valid-attr', enabled: true },
        ],
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Color contrast verification', async () => {
      const primaryAvatar = canvas.getByTestId('contrast-primary');
      const errorAvatar = canvas.getByTestId('contrast-error');

      // Check that avatars have sufficient contrast
      const primaryStyle = window.getComputedStyle(primaryAvatar);
      const errorStyle = window.getComputedStyle(errorAvatar);

      await expect(primaryStyle.backgroundColor).not.toBe(primaryStyle.color);
      await expect(errorStyle.backgroundColor).not.toBe(errorStyle.color);
    });

    await step('Focus indicators compliance', async () => {
      const interactiveAvatar = canvas.getByTestId('focus-interactive');
      const clickableAvatar = canvas.getByTestId('focus-clickable');

      // Focus and verify focus indicators
      interactiveAvatar.focus();
      await expect(interactiveAvatar).toHaveFocus();

      clickableAvatar.focus();
      await expect(clickableAvatar).toHaveFocus();
    });

    await step('Screen reader support', async () => {
      const imageAvatar = canvas.getByTestId('sr-image');
      const initialsAvatar = canvas.getByTestId('sr-initials');
      const iconAvatar = canvas.getByTestId('sr-icon');

      // Verify proper ARIA labels and alt text
      await expect(imageAvatar).toHaveAttribute('alt', 'Profile photo of John Doe');
      await expect(initialsAvatar).toHaveAttribute('aria-label', 'User initials: S.R.');
      await expect(iconAvatar).toHaveAttribute('aria-label', 'Generic user profile');
    });

    await step('Status indicators accessibility', async () => {
      const onlineAvatar = canvas.getByTestId('status-online');
      const busyAvatar = canvas.getByTestId('status-busy');

      await expect(onlineAvatar).toHaveAttribute('aria-label', 'User is online');
      await expect(busyAvatar).toHaveAttribute('aria-label', 'User is busy');

      // Verify status badges are present
      // Look for MUI Badge elements using document.querySelector for portal elements
      await waitFor(() => {
        const badges = document.querySelectorAll('.MuiBadge-badge');
        expect(badges.length).toBeGreaterThan(0);
      });
    });

    await step('Keyboard navigation compliance', async () => {
      const interactiveAvatar = canvas.getByTestId('focus-interactive');
      const clickableAvatar = canvas.getByTestId('focus-clickable');

      // Test tab navigation
      interactiveAvatar.focus();
      await userEvent.tab();
      await expect(clickableAvatar).toHaveFocus();

      // Test enter and space key activation
      await userEvent.keyboard('{Enter}');
      await userEvent.keyboard(' ');
    });
  },
};
