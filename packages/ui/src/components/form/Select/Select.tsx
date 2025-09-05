import React from 'react';
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  styled,
  alpha,
} from '@mui/material';
import { SelectProps } from './Select.types';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: alpha(theme.palette.divider, 0.23),
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.error.main,
    },
  },
}));

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  '& .MuiSelect-select': {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
}));

export const Select = React.forwardRef<any, SelectProps>(
  ({
    variant = 'default',
    options,
    label,
    helperText,
    fullWidth = true,
    size = 'medium',
    error,
    placeholder,
    ...props
  }, ref) => {
    return (
      <StyledFormControl
        fullWidth={fullWidth}
        size={size}
        error={error}
      >
        {label && <InputLabel>{label}</InputLabel>}
        <StyledSelect
          ref={ref}
          label={label}
          displayEmpty={!!placeholder}
          {...props}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </StyledSelect>
        {helperText && (
          <FormHelperText error={error}>{helperText}</FormHelperText>
        )}
      </StyledFormControl>
    );
  }
);

Select.displayName = 'Select';