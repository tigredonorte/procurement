import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography, Paper, Button, Grid } from '@mui/material';
import React from 'react';

import { MapPreview } from './MapPreview';

const meta = {
  title: 'Enhanced/MapPreview',
  component: MapPreview,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An interactive map preview component with markers, clustering, and customizable styles. Perfect for location-based features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'glass', 'satellite', 'dark'],
      description: 'Map style variant',
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
    showSearch: {
      control: 'boolean',
      description: 'Show search bar',
    },
    googleMapsApiKey: {
      control: 'text',
      description: 'Google Maps API key',
    },
  },
} satisfies Meta<typeof MapPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample locations
const sampleLocations = {
  sanFrancisco: { lat: 37.7749, lng: -122.4194 },
  newYork: { lat: 40.7128, lng: -74.0060 },
  london: { lat: 51.5074, lng: -0.1278 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  paris: { lat: 48.8566, lng: 2.3522 },
};

const multipleMarkers = [
  { 
    position: sampleLocations.sanFrancisco, 
    title: 'San Francisco Office',
    description: 'Main headquarters',
    icon: '🏢'
  },
  { 
    position: { lat: 37.7849, lng: -122.4094 }, 
    title: 'Warehouse A',
    description: 'Distribution center',
    icon: '📦'
  },
  { 
    position: { lat: 37.7649, lng: -122.4294 }, 
    title: 'Warehouse B',
    description: 'Storage facility',
    icon: '🏭'
  },
  { 
    position: { lat: 37.7949, lng: -122.3994 }, 
    title: 'Retail Store',
    description: 'Customer location',
    icon: '🛍️'
  },
];

export const Default: Story = {
  args: {
    center: sampleLocations.sanFrancisco,
    zoom: 12,
    height: '400px',
    googleMapsApiKey: 'demo-key',
    markers: [
      {
        position: sampleLocations.sanFrancisco,
        title: 'San Francisco',
      },
    ],
  },
};

export const MultipleMarkers: Story = {
  args: {
    center: sampleLocations.sanFrancisco,
    zoom: 11,
    height: '500px',
    googleMapsApiKey: 'demo-key',
    markers: multipleMarkers,
    showControls: true,
  },
};

const InteractiveMapComponent = () => {
const [selectedLocation, setSelectedLocation] = React.useState(sampleLocations.sanFrancisco);
    const [markers, setMarkers] = React.useState([
      { position: sampleLocations.sanFrancisco, title: 'Current Location' }
    ]);

    const handleMapClick = (lat: number, lng: number) => {
      const newMarker = {
        position: { lat, lng },
        title: `Location ${markers.length + 1}`,
      };
      setMarkers([...markers, newMarker]);
      setSelectedLocation({ lat, lng });
    };

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Interactive Map - Click to Add Markers</Typography>
        
        <MapPreview
          center={selectedLocation}
          zoom={12}
          height="500px"
          googleMapsApiKey="demo-key"
          markers={markers}
          interactive={true}
          showControls={true}
          onMapClick={handleMapClick}
        />
        
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Location:
          </Typography>
          <Typography variant="body2">
            Latitude: {selectedLocation.lat.toFixed(4)}, Longitude: {selectedLocation.lng.toFixed(4)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total markers: {markers.length}
          </Typography>
        </Paper>
      </Stack>
    );
};

export const InteractiveMap: Story = {
  render: () => <InteractiveMapComponent />,
};

const MapStylesComponent = () => {
const [variant, setVariant] = React.useState<'default' | 'glass' | 'satellite' | 'dark'>('default');
    
    return (
      <Stack spacing={3}>
        <Stack direction="row" spacing={1}>
          {(['default', 'glass', 'satellite', 'dark'] as const).map((style) => (
            <Button
              key={style}
              variant={variant === style ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setVariant(style)}
            >
              {style}
            </Button>
          ))}
        </Stack>
        
        <MapPreview
          variant={variant}
          center={sampleLocations.sanFrancisco}
          zoom={13}
          height="400px"
          googleMapsApiKey="demo-key"
          markers={[
            { position: sampleLocations.sanFrancisco, title: 'Location' }
          ]}
        />
      </Stack>
    );
};

export const MapStyles: Story = {
  render: () => <MapStylesComponent />,
};

export const WithSearch: Story = {
  args: {
    center: sampleLocations.newYork,
    zoom: 12,
    height: '500px',
    googleMapsApiKey: 'demo-key',
    showSearch: true,
    showControls: true,
    markers: [
      { position: sampleLocations.newYork, title: 'New York City' }
    ],
  },
};

export const DeliveryRoute: Story = {
  render: () => {
    const deliveryStops = [
      { position: { lat: 37.7749, lng: -122.4194 }, title: 'Start: Distribution Center', icon: '📍' },
      { position: { lat: 37.7849, lng: -122.4094 }, title: 'Stop 1: Customer A', icon: '1️⃣' },
      { position: { lat: 37.7949, lng: -122.3994 }, title: 'Stop 2: Customer B', icon: '2️⃣' },
      { position: { lat: 37.8049, lng: -122.3894 }, title: 'Stop 3: Customer C', icon: '3️⃣' },
      { position: { lat: 37.7649, lng: -122.4294 }, title: 'End: Return to Center', icon: '🏁' },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Delivery Route Visualization</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MapPreview
              center={sampleLocations.sanFrancisco}
              zoom={11}
              height="500px"
              googleMapsApiKey="demo-key"
              markers={deliveryStops}
              showRoute={true}
              routeColor="#2196f3"
              showControls={true}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Delivery Stops
              </Typography>
              <Stack spacing={1}>
                {deliveryStops.map((stop, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{stop.icon}</Typography>
                    <Typography variant="body2">{stop.title}</Typography>
                  </Box>
                ))}
              </Stack>
              
              <Box mt={3}>
                <Typography variant="caption" color="text.secondary">
                  Total Distance: 15.3 miles
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Estimated Time: 45 minutes
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    );
  },
};

const StoreLocatorComponent = () => {
const stores = [
      { position: { lat: 37.7749, lng: -122.4194 }, title: 'Downtown Store', hours: '9AM-9PM' },
      { position: { lat: 37.7649, lng: -122.4294 }, title: 'West Store', hours: '10AM-8PM' },
      { position: { lat: 37.7849, lng: -122.4094 }, title: 'North Store', hours: '9AM-10PM' },
      { position: { lat: 37.7949, lng: -122.3994 }, title: 'East Store', hours: '8AM-9PM' },
    ];

    const [selectedStore, setSelectedStore] = React.useState<typeof stores[0] | null>(null);

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Store Locator</Typography>
        
        <MapPreview
          center={sampleLocations.sanFrancisco}
          zoom={11}
          height="400px"
          googleMapsApiKey="demo-key"
          markers={stores.map(store => ({
            ...store,
            onClick: () => setSelectedStore(store),
          }))}
          showSearch={true}
          searchPlaceholder="Search for stores..."
          showControls={true}
        />
        
        {selectedStore && (
          <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="subtitle1">{selectedStore.title}</Typography>
            <Typography variant="body2">Hours: {selectedStore.hours}</Typography>
            <Button 
              variant="contained" 
              size="small" 
              sx={{ mt: 1, bgcolor: 'white', color: 'primary.main' }}
            >
              Get Directions
            </Button>
          </Paper>
        )}
      </Stack>
    );
};

export const StoreLocator: Story = {
  render: () => <StoreLocatorComponent />,
};

export const HeatMap: Story = {
  args: {
    center: sampleLocations.sanFrancisco,
    zoom: 11,
    height: '500px',
    googleMapsApiKey: 'demo-key',
    heatmapData: [
      { lat: 37.7749, lng: -122.4194, weight: 10 },
      { lat: 37.7649, lng: -122.4294, weight: 8 },
      { lat: 37.7849, lng: -122.4094, weight: 6 },
      { lat: 37.7949, lng: -122.3994, weight: 9 },
      { lat: 37.7549, lng: -122.4394, weight: 7 },
    ],
    showHeatmap: true,
    variant: 'dark',
  },
};

const GlobalLocationsComponent = () => {
const [selectedCity, setSelectedCity] = React.useState('sanFrancisco');
    
    return (
      <Stack spacing={3}>
        <Typography variant="h6">Global Office Locations</Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {Object.keys(sampleLocations).map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setSelectedCity(city)}
            >
              {city.replace(/([A-Z])/g, ' $1').trim()}
            </Button>
          ))}
        </Stack>
        
        <MapPreview
          center={sampleLocations[selectedCity as keyof typeof sampleLocations]}
          zoom={10}
          height="400px"
          googleMapsApiKey="demo-key"
          markers={[
            {
              position: sampleLocations[selectedCity as keyof typeof sampleLocations],
              title: selectedCity.replace(/([A-Z])/g, ' $1').trim(),
            }
          ]}
          animated={true}
        />
      </Stack>
    );
};

export const GlobalLocations: Story = {
  render: () => <GlobalLocationsComponent />,
};