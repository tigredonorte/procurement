import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Layout/Skeleton/Tests',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: false }
  },
  tags: ['autodocs', 'test', 'component:Skeleton']
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// INTERACTION TESTS
// ============================================================================

export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    variant: 'rectangular',
    height: 60,
    'data-testid': 'skeleton-element'
  },
  render: (args) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Testing skeleton rendering and properties
      </Typography>
      <Skeleton {...args} />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Initial render verification', async () => {
      // Wait for skeleton to render
      const skeletonElement = await canvas.findByTestId('skeleton-element');
      await expect(skeletonElement).toBeInTheDocument();
      await expect(skeletonElement).toBeVisible();
    });
    
    await step('Verify skeleton has proper MUI class', async () => {
      const skeletonElement = canvas.getByTestId('skeleton-element');
      await expect(skeletonElement).toHaveClass('MuiSkeleton-root');
    });
    
    await step('Verify animation is running', async () => {
      const skeletonElement = canvas.getByTestId('skeleton-element');
      const computedStyle = window.getComputedStyle(skeletonElement);
      
      // Check that animation is applied
      await expect(computedStyle.animationName).toBeTruthy();
      await expect(computedStyle.animationDuration).toBeTruthy();
    });
  }
};

export const VariantTests: Story = {
  name: '🔄 Variant State Tests',
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle1">Text Variant</Typography>
        <Skeleton variant="text" data-testid="text-skeleton" />
      </Box>
      <Box>
        <Typography variant="subtitle1">Circular Variant</Typography>
        <Skeleton variant="circular" width={40} height={40} data-testid="circular-skeleton" />
      </Box>
      <Box>
        <Typography variant="subtitle1">Rectangular Variant</Typography>
        <Skeleton variant="rectangular" height={60} data-testid="rectangular-skeleton" />
      </Box>
      <Box>
        <Typography variant="subtitle1">Wave Variant</Typography>
        <Skeleton variant="wave" height={60} data-testid="wave-skeleton" />
      </Box>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify text skeleton properties', async () => {
      const textSkeleton = canvas.getByTestId('text-skeleton');
      await expect(textSkeleton).toHaveClass('MuiSkeleton-text');
      
      const computedStyle = window.getComputedStyle(textSkeleton);
      await expect(computedStyle.width).toBe('100%');
    });
    
    await step('Verify circular skeleton properties', async () => {
      const circularSkeleton = canvas.getByTestId('circular-skeleton');
      await expect(circularSkeleton).toHaveClass('MuiSkeleton-circular');
      
      const computedStyle = window.getComputedStyle(circularSkeleton);
      await expect(parseInt(computedStyle.width)).toBe(40);
      await expect(parseInt(computedStyle.height)).toBe(40);
    });
    
    await step('Verify rectangular skeleton properties', async () => {
      const rectangularSkeleton = canvas.getByTestId('rectangular-skeleton');
      await expect(rectangularSkeleton).toHaveClass('MuiSkeleton-rectangular');
      
      const computedStyle = window.getComputedStyle(rectangularSkeleton);
      await expect(parseInt(computedStyle.height)).toBe(60);
    });
    
    await step('Verify wave skeleton has wave animation', async () => {
      const waveSkeleton = canvas.getByTestId('wave-skeleton');
      await expect(waveSkeleton).toHaveClass('MuiSkeleton-wave');
      
      const computedStyle = window.getComputedStyle(waveSkeleton);
      await expect(computedStyle.animationName).toContain('wave');
    });
  }
};

export const MultipleSkeletonTest: Story = {
  name: '📝 Multiple Skeleton Test',
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Multiple Skeletons with Custom Spacing
      </Typography>
      <Box data-testid="multiple-skeleton-container">
        <Skeleton variant="text" count={3} spacing={2} />
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify multiple skeletons are rendered', async () => {
      const container = canvas.getByTestId('multiple-skeleton-container');
      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      await expect(skeletons).toHaveLength(3);
    });
    
    await step('Verify proper spacing between skeletons', async () => {
      const container = canvas.getByTestId('multiple-skeleton-container');
      const stackElement = container.querySelector('.MuiStack-root');
      await expect(stackElement).toBeInTheDocument();
    });
  }
};

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

export const AccessibilityTest: Story = {
  name: '⌨️ Accessibility Test',
  args: {
    'data-testid': 'accessible-skeleton'
  },
  render: (args) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Skeleton Accessibility Testing
      </Typography>
      <Skeleton {...args} variant="rectangular" height={60} />
      <Typography variant="body2" color="text.secondary" style={{ marginTop: 8 }}>
        Content is loading...
      </Typography>
    </Box>
  ),
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true }
        ]
      }
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify skeleton is not focusable', async () => {
      const skeleton = canvas.getByTestId('accessible-skeleton');
      await expect(skeleton).not.toHaveAttribute('tabindex');
      
      // Try to focus and ensure it doesn't receive focus
      skeleton.focus();
      await expect(skeleton).not.toHaveFocus();
    });
    
    await step('Verify proper ARIA attributes', async () => {
      const skeleton = canvas.getByTestId('accessible-skeleton');
      // MUI Skeleton should have appropriate ARIA attributes
      const ariaLabel = skeleton.getAttribute('aria-label');
      const ariaHidden = skeleton.getAttribute('aria-hidden');
      
      // Should either have aria-label or be aria-hidden
      if (!ariaHidden) {
        await expect(ariaLabel).toBeTruthy();
      }
    });
    
    await step('Verify loading context is provided', async () => {
      const loadingText = canvas.getByText(/content is loading/i);
      await expect(loadingText).toBeInTheDocument();
    });
  }
};

export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Content Loading State
      </Typography>
      <Box role="region" aria-label="Content loading" data-testid="loading-region">
        <Skeleton variant="text" count={2} />
        <Skeleton variant="rectangular" height={100} />
        <Typography 
          variant="body2" 
          color="text.secondary" 
          aria-live="polite"
          data-testid="loading-status"
        >
          Loading content, please wait...
        </Typography>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify loading region has proper ARIA', async () => {
      const loadingRegion = canvas.getByTestId('loading-region');
      await expect(loadingRegion).toHaveAttribute('role', 'region');
      await expect(loadingRegion).toHaveAttribute('aria-label', 'Content loading');
    });
    
    await step('Verify live region for status updates', async () => {
      const statusElement = canvas.getByTestId('loading-status');
      await expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });
  }
};

// ============================================================================
// VISUAL TESTS
// ============================================================================

export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  render: () => (
    <Box data-testid="responsive-container">
      <Typography variant="h6" gutterBottom>
        Responsive Skeleton Layout
      </Typography>
      <Stack spacing={2}>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="70%" />
          </Box>
        </Box>
      </Stack>
    </Box>
  ),
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
    
    await step('Verify responsive behavior', async () => {
      const container = canvas.getByTestId('responsive-container');
      await expect(container).toBeInTheDocument();
      
      // Check that skeletons adapt to container width
      const textSkeletons = container.querySelectorAll('.MuiSkeleton-text');
      await expect(textSkeletons.length).toBeGreaterThan(0);
      
      textSkeletons.forEach(skeleton => {
        expect(skeleton).toBeVisible();
      });
    });
  }
};

export const ThemeVariations: Story = {
  name: '🎨 Theme Variations Test',
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Theme Integration
      </Typography>
      <Card sx={{ p: 3 }} data-testid="themed-card">
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="rectangular" height={120} />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="50%" />
            </Box>
          </Box>
        </Stack>
      </Card>
    </Box>
  ),
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
    
    await step('Verify theme colors are applied', async () => {
      const card = canvas.getByTestId('themed-card');
      const skeletons = card.querySelectorAll('.MuiSkeleton-root');
      
      await expect(skeletons.length).toBeGreaterThan(0);
      
      // Verify skeletons have proper theme colors
      skeletons.forEach(skeleton => {
        const computedStyle = window.getComputedStyle(skeleton);
        expect(computedStyle.backgroundColor).toMatch(/rgb/);
      });
    });
  }
};

export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Default State</Typography>
        <Skeleton variant="rectangular" height={60} data-testid="default-skeleton" />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Custom Border Radius</Typography>
        <Skeleton 
          variant="rectangular" 
          height={60} 
          borderRadius={16}
          data-testid="rounded-skeleton" 
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>No Animation</Typography>
        <Skeleton 
          variant="rectangular" 
          height={60} 
          animation={false}
          data-testid="static-skeleton" 
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Wave Animation</Typography>
        <Skeleton 
          variant="wave" 
          height={60}
          data-testid="wave-skeleton" 
        />
      </Box>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Default skeleton state', async () => {
      const skeleton = canvas.getByTestId('default-skeleton');
      await expect(skeleton).toBeVisible();
      
      const computedStyle = window.getComputedStyle(skeleton);
      await expect(computedStyle.animationName).toBeTruthy();
    });
    
    await step('Custom border radius applied', async () => {
      const roundedSkeleton = canvas.getByTestId('rounded-skeleton');
      const computedStyle = window.getComputedStyle(roundedSkeleton);
      
      // Should have border radius applied
      expect(parseInt(computedStyle.borderRadius)).toBeGreaterThan(0);
    });
    
    await step('No animation skeleton is static', async () => {
      const staticSkeleton = canvas.getByTestId('static-skeleton');
      const computedStyle = window.getComputedStyle(staticSkeleton);
      
      // Animation should be 'none' or not present
      expect(computedStyle.animationName === 'none' || !computedStyle.animationName).toBeTruthy();
    });
    
    await step('Wave animation is applied', async () => {
      const waveSkeleton = canvas.getByTestId('wave-skeleton');
      const computedStyle = window.getComputedStyle(waveSkeleton);
      
      await expect(computedStyle.animationName).toContain('wave');
    });
  }
};

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  render: () => (
    <Box data-testid="performance-container">
      <Typography variant="h6" gutterBottom>
        Performance Test - Multiple Skeletons
      </Typography>
      <Stack spacing={1}>
        {Array.from({ length: 50 }, (_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Box>
            <Skeleton variant="rectangular" width={60} height={30} />
          </Box>
        ))}
      </Stack>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Measure render time for multiple skeletons', async () => {
      const startTime = window.performance.now();
      const container = canvas.getByTestId('performance-container');
      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      const endTime = window.performance.now();
      
      const renderTime = endTime - startTime;
      // Performance logging for debugging
      if (renderTime > 100) {
        throw new Error(`Render time too slow: ${renderTime}ms for ${skeletons.length} skeletons`);
      }
      
      // Should render efficiently
      await expect(renderTime).toBeLessThan(100);
      await expect(skeletons.length).toBe(150); // 50 * 3 skeletons each
    });
    
    await step('Test scroll performance with many skeletons', async () => {
      const container = canvas.getByTestId('performance-container');
      
      // Simulate scrolling
      container.scrollTop = 100;
      await new Promise(resolve => window.setTimeout(resolve, 50));
      
      container.scrollTop = 200;
      await new Promise(resolve => window.setTimeout(resolve, 50));
      
      container.scrollTop = 0;
      await new Promise(resolve => window.setTimeout(resolve, 50));
      
      // Should handle scrolling smoothly
      await expect(container).toBeInTheDocument();
    });
  }
};

// ============================================================================
// EDGE CASES TESTS
// ============================================================================

export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>Zero Count</Typography>
        <Skeleton variant="text" count={0} data-testid="zero-count" />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Large Count</Typography>
        <Box data-testid="large-count-container">
          <Skeleton variant="text" count={100} />
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Custom Dimensions</Typography>
        <Skeleton 
          variant="rectangular" 
          width={500} 
          height={300}
          data-testid="custom-dimensions" 
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Percentage Width</Typography>
        <Skeleton 
          variant="rectangular" 
          width="75%" 
          height={60}
          data-testid="percentage-width" 
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>String Width</Typography>
        <Skeleton 
          variant="rectangular" 
          width="300px" 
          height={60}
          data-testid="string-width" 
        />
      </Box>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Zero count renders nothing', async () => {
      const zeroCountElement = canvas.queryByTestId('zero-count');
      // Should not render any skeleton with count 0
      if (zeroCountElement) {
        const skeletons = zeroCountElement.querySelectorAll('.MuiSkeleton-root');
        await expect(skeletons.length).toBe(0);
      }
    });
    
    await step('Large count handles gracefully', async () => {
      const largeCountContainer = canvas.getByTestId('large-count-container');
      const skeletons = largeCountContainer.querySelectorAll('.MuiSkeleton-root');
      
      await expect(skeletons.length).toBe(100);
      await expect(largeCountContainer).toBeInTheDocument();
    });
    
    await step('Custom dimensions applied correctly', async () => {
      const customSkeleton = canvas.getByTestId('custom-dimensions');
      const computedStyle = window.getComputedStyle(customSkeleton);
      
      await expect(parseInt(computedStyle.width)).toBe(500);
      await expect(parseInt(computedStyle.height)).toBe(300);
    });
    
    await step('Percentage width works', async () => {
      const percentageSkeleton = canvas.getByTestId('percentage-width');
      const computedStyle = window.getComputedStyle(percentageSkeleton);
      
      // Should have width style applied
      await expect(computedStyle.width).toContain('%');
    });
    
    await step('String width with units works', async () => {
      const stringSkeleton = canvas.getByTestId('string-width');
      const computedStyle = window.getComputedStyle(stringSkeleton);
      
      await expect(parseInt(computedStyle.width)).toBe(300);
    });
  }
};

// ============================================================================
// INTEGRATION TESTS  
// ============================================================================

export const IntegrationTest: Story = {
  name: '🔗 Integration Test',
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Skeleton Integration with Other Components
      </Typography>
      <Card sx={{ maxWidth: 400 }} data-testid="integration-card">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="50%" />
            </Box>
          </Box>
          
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
          
          <Box>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Card integration works properly', async () => {
      const card = canvas.getByTestId('integration-card');
      await expect(card).toBeInTheDocument();
      
      const skeletons = card.querySelectorAll('.MuiSkeleton-root');
      await expect(skeletons.length).toBeGreaterThan(5);
    });
    
    await step('Mixed skeleton variants work together', async () => {
      const card = canvas.getByTestId('integration-card');
      
      const circularSkeletons = card.querySelectorAll('.MuiSkeleton-circular');
      const textSkeletons = card.querySelectorAll('.MuiSkeleton-text');
      const rectangularSkeletons = card.querySelectorAll('.MuiSkeleton-rectangular');
      
      await expect(circularSkeletons.length).toBeGreaterThan(0);
      await expect(textSkeletons.length).toBeGreaterThan(0);
      await expect(rectangularSkeletons.length).toBeGreaterThan(0);
    });
  }
};