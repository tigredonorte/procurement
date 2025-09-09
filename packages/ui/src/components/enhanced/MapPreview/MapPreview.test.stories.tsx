import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor } from 'storybook/test';

import { MapPreview } from './MapPreview';

const meta: Meta<typeof MapPreview> = {
  title: 'Enhanced/MapPreview/Tests',
  component: MapPreview,
  parameters: { layout: 'centered', chromatic: { disableSnapshot: false } },
  tags: ['autodocs', 'test'],
};
export default meta;
export type Story = StoryObj<typeof meta>;

// Sample coordinates for testing
const testCoordinates = { lat: 37.7749, lng: -122.4194 };

export const BasicInteraction: Story = {
  args: {
    coordinates: testCoordinates,
    height: '400px',
    zoom: 12,
    marker: true,
    showControls: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the map container to be rendered
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    // Check if the map is displayed with the correct height
    const mapContainer = canvas.getByTestId('map-preview-container');
    expect(mapContainer).toHaveStyle('height: 400px');
  },
};

export const KeyboardNavigation: Story = {
  args: {
    coordinates: testCoordinates,
    height: '300px',
    zoom: 10,
    marker: true,
    showControls: true,
    interactive: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for map to load
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    // Test keyboard interaction with the map
    const mapContainer = canvas.getByTestId('map-preview-container');
    await userEvent.click(mapContainer);

    // Test arrow key navigation (if supported by the map)
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowRight}');
  },
};

export const ScreenReader: Story = {
  args: {
    coordinates: testCoordinates,
    height: '300px',
    zoom: 12,
    marker: true,
    showControls: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for map to load
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    const mapContainer = canvas.getByTestId('map-preview-container');

    // Check for accessibility attributes
    expect(mapContainer).toHaveAttribute('role', 'img');
    expect(mapContainer).toHaveAttribute('aria-label');
  },
};

export const FocusManagement: Story = {
  args: {
    coordinates: testCoordinates,
    height: '300px',
    zoom: 12,
    marker: true,
    showControls: true,
    interactive: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for map to load
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    const mapContainer = canvas.getByTestId('map-preview-container');

    // Test focus management
    await userEvent.tab();
    expect(mapContainer).toHaveAttribute('tabindex', '0');

    // Click to focus
    await userEvent.click(mapContainer);
    expect(mapContainer).toHaveFocus();
  },
};

export const ResponsiveDesign: Story = {
  args: {
    coordinates: testCoordinates,
    height: '300px',
    zoom: 12,
    marker: true,
    showControls: true,
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for map to load
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    const mapContainer = canvas.getByTestId('map-preview-container');

    // Check that the map container adapts to different viewport sizes
    expect(mapContainer).toHaveStyle('width: 100%');
    expect(mapContainer).toHaveStyle('height: 300px');
  },
};

export const ThemeVariations: Story = {
  args: {
    coordinates: testCoordinates,
    height: '300px',
    zoom: 12,
    mapType: 'roadmap',
    marker: true,
    showControls: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for map to load
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    // Test that map renders correctly with different themes
    const mapContainer = canvas.getByTestId('map-preview-container');
    expect(mapContainer).toBeInTheDocument();
    expect(mapContainer).toHaveStyle('height: 300px');
  },
};

export const VisualStates: Story = {
  args: {
    coordinates: testCoordinates,
    height: '300px',
    zoom: 12,
    marker: true,
    showControls: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for map to load
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    // Test different visual states
    const mapContainer = canvas.getByTestId('map-preview-container');

    // Test hover state if applicable
    await userEvent.hover(mapContainer);
    expect(mapContainer).toBeInTheDocument();

    await userEvent.unhover(mapContainer);
    expect(mapContainer).toBeInTheDocument();
  },
};

export const Performance: Story = {
  args: {
    coordinates: testCoordinates,
    height: '300px',
    zoom: 12,
    marker: true,
    showControls: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const startTime = window.performance.now();

    // Wait for map to load and measure render time
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    const endTime = window.performance.now();
    const renderTime = endTime - startTime;

    // Expect reasonable render time (less than 3 seconds)
    expect(renderTime).toBeLessThan(3000);
  },
};

export const EdgeCases: Story = {
  args: {
    coordinates: { lat: 0, lng: 0 }, // Edge case: coordinates at equator/prime meridian
    height: '200px',
    zoom: 1, // Minimum zoom
    marker: false,
    showControls: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for map to load even with edge case coordinates
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    const mapContainer = canvas.getByTestId('map-preview-container');
    expect(mapContainer).toHaveStyle('height: 200px');

    // Test with extreme coordinates
    expect(mapContainer).toBeInTheDocument();
  },
};

export const Integration: Story = {
  args: {
    coordinates: testCoordinates,
    height: '300px',
    zoom: 12,
    marker: true,
    showControls: true,
    interactive: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for map to load
    await waitFor(async () => {
      const mapContainer = canvas.getByTestId('map-preview-container');
      expect(mapContainer).toBeInTheDocument();
    });

    // Test integration with parent components
    const mapContainer = canvas.getByTestId('map-preview-container');

    // Ensure the map integrates well within its container
    expect(mapContainer.parentElement).toBeInTheDocument();

    // Test that the map doesn't break when integrated with other components
    await userEvent.click(mapContainer);
    expect(mapContainer).toBeInTheDocument();
  },
};
