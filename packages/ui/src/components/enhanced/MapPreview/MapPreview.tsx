import React, { FC, useState } from 'react';
import { Box, Paper, IconButton, Stack, Typography, alpha, styled, useTheme } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  MyLocation as CenterIcon,
  Fullscreen as FullscreenIcon,
  Layers as LayersIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

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
  height = '400px',
  zoom: initialZoom = 15,
  mapType = 'roadmap',
  showControls = true,
}) => {
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const [currentMapType, setCurrentMapType] = useState<
    'roadmap' | 'satellite' | 'hybrid' | 'terrain'
  >(mapType);
  const [markerPosition, setMarkerPosition] = useState(coordinates);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setCurrentZoom(Math.min(currentZoom + 1, 20));
  };

  const handleZoomOut = () => {
    setCurrentZoom(Math.max(currentZoom - 1, 1));
  };

  const handleCenter = () => {
    setMarkerPosition(coordinates);
  };

  const handleToggleMapType = () => {
    const types: Array<'roadmap' | 'satellite' | 'hybrid' | 'terrain'> = [
      'roadmap',
      'satellite',
      'hybrid',
      'terrain',
    ];
    const currentIndex = types.indexOf(currentMapType);
    const nextIndex = (currentIndex + 1) % types.length;
    const nextType = types[nextIndex] as 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
    setCurrentMapType(nextType);
  };

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

// Export default
export default MapPreview;
