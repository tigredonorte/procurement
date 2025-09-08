import React, { FC, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Paper,
  InputAdornment,
  alpha,
  styled,
  useTheme,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { LocationOn as LocationIcon, MyLocation as CurrentLocationIcon } from '@mui/icons-material';

import type { AddressDetails, AddressAutocompleteProps } from './AddressAutocomplete.types';

// Styled components
const GlassTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
    transition: theme.transitions.create(['border-color', 'box-shadow', 'background']),
    '&:hover': {
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused': {
      background: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
    '& fieldset': {
      border: 'none',
    },
  },
}));

const SuggestionItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color']),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const LocationIconWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

const AddressText = styled(Box)(({ theme }) => ({
  flex: 1,
  '& .primary': {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.25),
  },
  '& .secondary': {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
}));

// Main component (simplified without actual Google Maps integration for demo)
export const AddressAutocomplete: FC<AddressAutocompleteProps> = ({
  variant = 'outlined',
  label = 'Address',
  placeholder = 'Enter an address',
  icon = <LocationIcon />,
  onSelect,
  floating = false,
  error = false,
  helperText,
  disabled = false,
  required = false,
  fullWidth = true,
  defaultValue = '',
  getCurrentLocation = false,
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Note: In a real implementation, you would use the Google Maps API
  // For demo purposes, we'll use mock data
  const mockAddresses = [
    '123 Main Street, San Francisco, CA 94102',
    '456 Oak Avenue, New York, NY 10001',
    '789 Pine Road, Los Angeles, CA 90001',
    '321 Elm Boulevard, Chicago, IL 60601',
    '654 Maple Drive, Houston, TX 77001',
  ];

  const handleInputChange = (event: React.SyntheticEvent, value: string) => {
    setInputValue(value);

    // Simulate API call delay
    setLoading(true);
    window.setTimeout(() => {
      if (value) {
        const filtered = mockAddresses.filter((addr) =>
          addr.toLowerCase().includes(value.toLowerCase()),
        );
        setOptions(filtered);
      } else {
        setOptions([]);
      }
      setLoading(false);
    }, 300);
  };

  const handleSelect = (event: React.SyntheticEvent, value: string | null) => {
    if (value) {
      // Mock address details
      const mockDetails: AddressDetails = {
        formatted: value,
        street: value.split(',')[0] || '',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
        coordinates: {
          lat: 37.7749,
          lng: -122.4194,
        },
      };
      onSelect(mockDetails);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const mockAddress: AddressDetails = {
            formatted: 'Current Location',
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          };
          onSelect(mockAddress);
          setInputValue('Current Location');
          setLoading(false);
        },
        () => {
          setLoading(false);
        },
      );
    }
  };

  const TextFieldComponent = variant === 'glass' ? GlassTextField : TextField;

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextFieldComponent
          {...params}
          variant={variant === 'glass' ? 'outlined' : variant}
          label={floating ? undefined : label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          InputProps={{
            ...params.InputProps,
            startAdornment: icon && <InputAdornment position="start">{icon}</InputAdornment>,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {getCurrentLocation && !loading && (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleGetCurrentLocation}
                      size="small"
                      title="Use current location"
                    >
                      <CurrentLocationIcon />
                    </IconButton>
                  </InputAdornment>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <SuggestionItem>
            <LocationIconWrapper>
              <LocationIcon fontSize="small" />
            </LocationIconWrapper>
            <AddressText>
              <div className="primary">{option.split(',')[0]}</div>
              <div className="secondary">{option.split(',').slice(1).join(',')}</div>
            </AddressText>
          </SuggestionItem>
        </li>
      )}
      PaperComponent={(props) => (
        <Paper
          {...props}
          elevation={8}
          sx={{
            mt: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
          }}
        />
      )}
    />
  );
};

// Export default
export default AddressAutocomplete;
