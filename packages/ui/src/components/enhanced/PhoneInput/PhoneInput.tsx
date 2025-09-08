import React, { FC, useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
  styled,
  useTheme,
  Typography,
} from '@mui/material';
import { Phone as PhoneIcon, ArrowDropDown } from '@mui/icons-material';
import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

// Types
export interface PhoneInputProps {
  variant?: 'glass' | 'outlined' | 'filled';
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  defaultValue?: string;
  countryCode?: CountryCode;
  floating?: boolean;
  onChange?: (value: string, isValid: boolean, countryCode?: CountryCode) => void;
  helper?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

// Country data
const countries = [
  { code: 'US' as CountryCode, name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB' as CountryCode, name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'CA' as CountryCode, name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU' as CountryCode, name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'DE' as CountryCode, name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR' as CountryCode, name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'IT' as CountryCode, name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'ES' as CountryCode, name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'NL' as CountryCode, name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'JP' as CountryCode, name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'CN' as CountryCode, name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'IN' as CountryCode, name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'BR' as CountryCode, name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'MX' as CountryCode, name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'KR' as CountryCode, name: 'South Korea', dial: '+82', flag: '🇰🇷' },
];

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
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

const CountrySelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color']),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const CountryMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
    maxHeight: 400,
  },
}));

// Helper functions
const formatPhoneNumber = (value: string, country: CountryCode): string => {
  try {
    const phoneNumber = parsePhoneNumber(value, country);
    if (phoneNumber) {
      return phoneNumber.formatInternational();
    }
  } catch {
    // Invalid number, return as is
  }
  return value;
};

const validatePhoneNumber = (value: string, country: CountryCode): boolean => {
  if (!value) return false;
  try {
    return isValidPhoneNumber(value, country);
  } catch {
    return false;
  }
};

// Main component
export const PhoneInput: FC<PhoneInputProps> = ({
  variant = 'outlined',
  label = 'Phone Number',
  placeholder = 'Enter phone number',
  icon = <PhoneIcon />,
  defaultValue = '',
  countryCode: initialCountryCode = 'US',
  floating = false,
  onChange,
  helper,
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  fullWidth = true,
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(defaultValue);
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === initialCountryCode) || countries[0],
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!selectedCountry) return;

    const valid = validatePhoneNumber(value, selectedCountry.code);
    setIsValid(valid);

    if (onChange) {
      onChange(value, valid, selectedCountry.code);
    }
  }, [value, selectedCountry, onChange]);

  const handleCountryClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCountryClose = () => {
    setAnchorEl(null);
  };

  const handleCountrySelect = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    handleCountryClose();

    // Reformat number with new country code
    if (value) {
      const formatted = formatPhoneNumber(value, country.code);
      setValue(formatted);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value && selectedCountry) {
      const formatted = formatPhoneNumber(value, selectedCountry.code);
      setValue(formatted);
    }
  };

  const TextFieldComponent = variant === 'glass' ? GlassTextField : TextField;

  return (
    <>
      <TextFieldComponent
        variant={variant === 'glass' ? 'outlined' : variant}
        label={floating ? undefined : label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        error={error || (!isValid && value !== '' && !isFocused)}
        helperText={
          errorMessage || (!isValid && value !== '' && !isFocused ? 'Invalid phone number' : helper)
        }
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        type="tel"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CountrySelector onClick={handleCountryClick}>
                <Typography variant="h6" component="span" sx={{ mr: 0.5 }}>
                  {selectedCountry?.flag}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                  {selectedCountry?.dial}
                </Typography>
                <ArrowDropDown fontSize="small" />
              </CountrySelector>
            </InputAdornment>
          ),
          endAdornment: icon && (
            <InputAdornment position="end">
              <Box
                sx={{
                  color: isValid ? theme.palette.success.main : theme.palette.text.secondary,
                  transition: 'color 0.3s ease',
                }}
              >
                {icon}
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{
          '& input': {
            letterSpacing: '0.5px',
          },
        }}
      />

      <CountryMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCountryClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {countries.map((country) => (
          <MenuItem
            key={country.code}
            onClick={() => handleCountrySelect(country)}
            selected={country.code === selectedCountry?.code}
            sx={{
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Typography variant="h5" component="span">
                {country.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText
              primary={country.name}
              secondary={country.dial}
              primaryTypographyProps={{ fontSize: '0.9rem' }}
              secondaryTypographyProps={{ fontSize: '0.8rem' }}
            />
          </MenuItem>
        ))}
      </CountryMenu>
    </>
  );
};

// Export default
export default PhoneInput;
