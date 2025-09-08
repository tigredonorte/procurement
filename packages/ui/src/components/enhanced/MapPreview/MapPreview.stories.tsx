import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography, Paper, Button, Grid } from '@mui/material';
import React from 'react';

import { MapPreview } from './MapPreview';

const meta: Meta<typeof MapPreview> = {
  title: 'Enhanced/MapPreview',
  component: MapPreview,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An interactive map preview component with markers, clustering, and customizable styles. Perfect for location-based features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    coordinates: {
      control: 'object',
      description: 'Map center coordinates',
    },
    mapType: {
      control: { type: 'select' },
      options: ['roadmap', 'satellite', 'hybrid', 'terrain'],
      description: 'Map type variant',
    },
    height: {
      control: 'text',
      description: 'Height of the map container',
    },
    zoom: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Initial zoom level',
    },
    showControls: {
      control: 'boolean',
      description: 'Show map controls',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable user interaction',
    },
    marker: {
      control: 'boolean',
      description: 'Show center marker',
    },
    googleMapsApiKey: {
      control: 'text',
      description: 'Google Maps API key',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample locations
const sampleLocations = {
  sanFrancisco: { lat: 37.7749, lng: -122.4194 },
  newYork: { lat: 40.7128, lng: -74.006 },
  london: { lat: 51.5074, lng: -0.1278 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  paris: { lat: 48.8566, lng: 2.3522 },
};

export const Default: Story = {
  args: {
    coordinates: sampleLocations.sanFrancisco,
    zoom: 12,
    height: '400px',
    mapType: 'roadmap',
    marker: true,
    showControls: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">All Map Types</Typography>
      <Grid container spacing={2}>
        {(['roadmap', 'satellite', 'hybrid', 'terrain'] as const).map((mapType) => (
          <Grid item xs={12} sm={6} key={mapType}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {mapType.charAt(0).toUpperCase() + mapType.slice(1)}
              </Typography>
              <MapPreview
                coordinates={sampleLocations.sanFrancisco}
                mapType={mapType}
                zoom={13}
                height="300px"
                marker={true}
                showControls={true}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Different Sizes</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Small (250px)
          </Typography>
          <MapPreview
            coordinates={sampleLocations.sanFrancisco}
            height="250px"
            zoom={12}
            marker={true}
            showControls={true}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Medium (400px)
          </Typography>
          <MapPreview
            coordinates={sampleLocations.sanFrancisco}
            height="400px"
            zoom={12}
            marker={true}
            showControls={true}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Large (600px)
          </Typography>
          <MapPreview
            coordinates={sampleLocations.sanFrancisco}
            height="600px"
            zoom={12}
            marker={true}
            showControls={true}
          />
        </Grid>
      </Grid>
    </Stack>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Component States</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>
            With Controls
          </Typography>
          <MapPreview
            coordinates={sampleLocations.sanFrancisco}
            height="300px"
            zoom={12}
            marker={true}
            showControls={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>
            Without Controls
          </Typography>
          <MapPreview
            coordinates={sampleLocations.sanFrancisco}
            height="300px"
            zoom={12}
            marker={true}
            showControls={false}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>
            With Marker
          </Typography>
          <MapPreview
            coordinates={sampleLocations.newYork}
            height="300px"
            zoom={12}
            marker={true}
            showControls={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>
            Without Marker
          </Typography>
          <MapPreview
            coordinates={sampleLocations.newYork}
            height="300px"
            zoom={12}
            marker={false}
            showControls={true}
          />
        </Grid>
      </Grid>
    </Stack>
  ),
};

const InteractiveMapComponent = () => {
  const [coordinates, setCoordinates] = React.useState(sampleLocations.sanFrancisco);
  const [mapType, setMapType] = React.useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>(
    'roadmap',
  );
  const [zoom, setZoom] = React.useState(12);

  const locations = Object.entries(sampleLocations);

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Interactive Controls</Typography>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Location
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {locations.map(([name, coords]) => (
                <Button
                  key={name}
                  variant={coordinates === coords ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setCoordinates(coords)}
                >
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Map Type
            </Typography>
            <Stack direction="row" spacing={1}>
              {(['roadmap', 'satellite', 'hybrid', 'terrain'] as const).map((type) => (
                <Button
                  key={type}
                  variant={mapType === type ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setMapType(type)}
                >
                  {type}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Zoom: {zoom}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => setZoom(Math.max(1, zoom - 1))}>
                -
              </Button>
              <Button size="small" onClick={() => setZoom(Math.min(20, zoom + 1))}>
                +
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <MapPreview
        coordinates={coordinates}
        mapType={mapType}
        zoom={zoom}
        height="400px"
        marker={true}
        showControls={true}
      />

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Current State:
        </Typography>
        <Typography variant="body2">
          Location: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
        </Typography>
        <Typography variant="body2">Map Type: {mapType}</Typography>
        <Typography variant="body2">Zoom Level: {zoom}</Typography>
      </Paper>
    </Stack>
  );
};

export const InteractiveStates: Story = {
  render: () => <InteractiveMapComponent />,
};

export const Responsive: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Responsive Behavior</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          The map adapts to different screen sizes and container widths
        </Typography>

        <Stack spacing={3}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Full Width
            </Typography>
            <MapPreview
              coordinates={sampleLocations.london}
              height="300px"
              zoom={12}
              marker={true}
              showControls={true}
            />
          </Box>

          <Box sx={{ width: '75%' }}>
            <Typography variant="subtitle2" gutterBottom>
              75% Width
            </Typography>
            <MapPreview
              coordinates={sampleLocations.tokyo}
              height="300px"
              zoom={12}
              marker={true}
              showControls={true}
            />
          </Box>

          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" gutterBottom>
              50% Width
            </Typography>
            <MapPreview
              coordinates={sampleLocations.paris}
              height="300px"
              zoom={12}
              marker={true}
              showControls={true}
            />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  ),
};

export const WithCustomHeight: Story = {
  args: {
    coordinates: sampleLocations.newYork,
    height: '500px',
    zoom: 12,
    mapType: 'satellite',
    marker: true,
    showControls: true,
  },
};

export const MinimalSetup: Story = {
  args: {
    coordinates: sampleLocations.tokyo,
    height: '300px',
    zoom: 10,
    marker: false,
    showControls: false,
  },
};

export const HighZoom: Story = {
  args: {
    coordinates: sampleLocations.paris,
    height: '400px',
    zoom: 18,
    mapType: 'satellite',
    marker: true,
    showControls: true,
  },
};

export const LowZoom: Story = {
  args: {
    coordinates: sampleLocations.london,
    height: '400px',
    zoom: 5,
    mapType: 'terrain',
    marker: true,
    showControls: true,
  },
};
