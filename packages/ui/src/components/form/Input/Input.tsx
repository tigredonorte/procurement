import React, { useState } from 'react';
import { TextField, alpha, styled, InputAdornment } from '@mui/material';
import { InputProps } from './Input.types';

const StyledTextField = styled(TextField)<{ 
  customVariant?: InputProps['variant'];
  floating?: boolean;
}>(({ theme, customVariant, floating }) => ({
  '& .MuiInputBase-root': {
    transition: 'all 0.3s ease',
    
    ...(customVariant === 'glass' && {
      backgroundColor: alpha(theme.palette.background.paper, 0.1),
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.15),
        borderColor: alpha(theme.palette.primary.main, 0.3),
      },
      '&.Mui-focused': {
        backgroundColor: alpha(theme.palette.background.paper, 0.2),
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
      },
    }),
    
    ...(customVariant === 'underline' && {
      '&:before': {
        borderBottomColor: alpha(theme.palette.divider, 0.42),
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottomColor: theme.palette.primary.main,
      },
      '&:after': {
        borderBottomColor: theme.palette.primary.main,
      },
    }),
  },
  
  ...(floating && {
    '& .MuiInputLabel-root': {
      transform: 'translate(14px, 16px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
        backgroundColor: theme.palette.background.paper,
        padding: '0 4px',
      },
    },
  }),
  
  '& .MuiOutlinedInput-root': {
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
  
  '& .MuiFilledInput-root': {
    backgroundColor: alpha(theme.palette.action.hover, 0.04),
    '&:hover': {
      backgroundColor: alpha(theme.palette.action.hover, 0.08),
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.action.hover, 0.12),
    },
  },
}));

const sizeMap = {
  sm: { size: 'small' as const },
  md: { size: 'medium' as const },
  lg: { size: 'medium' as const, sx: { '& .MuiInputBase-input': { padding: '16px 14px' } } },
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'outlined',
    size = 'md',
    label,
    error,
    helperText,
    startAdornment,
    endAdornment,
    fullWidth = true,
    floating = false,
    onFocus,
    onBlur,
    color, // Extract color to prevent passing to MUI
    ...props
  }, ref) => {
    const [focused, setFocused] = useState(false);
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };
    
    const muiVariant = variant === 'glass' ? 'outlined' : 
                       variant === 'underline' ? 'standard' : 
                       variant;
    
    const sizeProps = sizeMap[size];
    
    return (
      <StyledTextField
        ref={ref}
        variant={muiVariant as any}
        customVariant={variant}
        floating={floating}
        label={label}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        onFocus={handleFocus}
        onBlur={handleBlur}
        InputProps={{
          startAdornment: startAdornment && (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ),
          endAdornment: endAdornment && (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ),
        }}
        {...sizeProps}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';