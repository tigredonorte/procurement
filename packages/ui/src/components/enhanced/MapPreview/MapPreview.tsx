import React, { FC, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  MyLocation as CenterIcon,
  Fullscreen as FullscreenIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// Types
export interface MapPreviewProps {
  coordinates: { lat: number; lng: number };
  marker?: boolean;
  height?: string;
  interactive?: boolean;
  zoom?: number;
  onMarkerDrag?: (coords: { lat: number; lng: number }) => void;
  googleMapsApiKey?: string;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  showControls?: boolean;
}

// Map styles
const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ lightness: -80 }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
];

// Styled components
const MapContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
  border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
}));

const MapWrapper = styled(Box)<{ height: string }>(({ height }) => ({
  width: '100%',
  height: height,
  position: 'relative',
}));

const MapControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  boxShadow: theme.shadows[2],
  '&:hover': {
    background: theme.palette.background.paper,
    transform: 'scale(1.05)',
  },
}));

const CoordinatesDisplay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  padding: theme.spacing(1, 1.5),
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  borderRadius: theme.shape.borderRadius,
  zIndex: 1,
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.background.paper, 0.8),
  zIndex: 2,
}));

// Fallback map component (when Google Maps is not available)
const FallbackMap: FC<{ coordinates: { lat: number; lng: number }; height: string }> = ({
  coordinates,
  height,
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        width: '100%',
        height,
        background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <LocationIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
        <Typography variant="h6" color="text.secondary">
          Map Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
        </Typography>
      </Stack>
    </Box>
  );
};

// Main component
export const MapPreview: FC<MapPreviewProps> = ({
  coordinates,
  marker = true,
  height = '400px',
  interactive = true,
  zoom: initialZoom = 15,
  onMarkerDrag,
  googleMapsApiKey,
  mapType = 'roadmap',
  showControls = true,
}) => {
  const theme = useTheme();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const [currentMapType, setCurrentMapType] = useState(mapType);
  const [markerPosition, setMarkerPosition] = useState(coordinates);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Note: In a real implementation, you would use the Google Maps API
  // For demo purposes, we'll show a fallback UI
  const isLoaded = false; // This would come from useLoadScript

  const handleZoomIn = () => {
    if (map) {
      const newZoom = Math.min(currentZoom + 1, 20);
      map.setZoom(newZoom);
      setCurrentZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const newZoom = Math.max(currentZoom - 1, 1);
      map.setZoom(newZoom);
      setCurrentZoom(newZoom);
    }
  };

  const handleCenter = () => {
    if (map) {
      map.panTo(coordinates);
      setMarkerPosition(coordinates);
    }
  };

  const handleToggleMapType = () => {
    const types: Array<'roadmap' | 'satellite' | 'hybrid' | 'terrain'> = [
      'roadmap',
      'satellite',
      'hybrid',
      'terrain',
    ];
    const currentIndex = types.indexOf(currentMapType);
    const nextType = types[(currentIndex + 1) % types.length];
    setCurrentMapType(nextType);
    if (map) {
      map.setMapTypeId(nextType);
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(newPosition);
      if (onMarkerDrag) {
        onMarkerDrag(newPosition);
      }
    }
  };

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <MapContainer elevation={2}>
      <MapWrapper height={isFullscreen ? '100vh' : height}>
        {/* Since we don't have actual Google Maps API key, show fallback */}
        <FallbackMap coordinates={coordinates} height={isFullscreen ? '100vh' : height} />
        
        {showControls && (
          <MapControls>
            <ControlButton size="small" onClick={handleZoomIn} title="Zoom in">
              <ZoomInIcon fontSize="small" />
            </ControlButton>
            <ControlButton size="small" onClick={handleZoomOut} title="Zoom out">
              <ZoomOutIcon fontSize="small" />
            </ControlButton>
            <ControlButton size="small" onClick={handleCenter} title="Center map">
              <CenterIcon fontSize="small" />
            </ControlButton>
            <ControlButton size="small" onClick={handleToggleMapType} title="Change map type">
              <LayersIcon fontSize="small" />
            </ControlButton>
            <ControlButton 
              size="small" 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              title="Toggle fullscreen"
            >
              <FullscreenIcon fontSize="small" />
            </ControlButton>
          </MapControls>
        )}
        
        <CoordinatesDisplay>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
          </Typography>
        </CoordinatesDisplay>
      </MapWrapper>
    </MapContainer>
  );
};

// Import LocationIcon for fallback
import { LocationOn as LocationIcon } from '@mui/icons-material';

// Export default
export default MapPreview;