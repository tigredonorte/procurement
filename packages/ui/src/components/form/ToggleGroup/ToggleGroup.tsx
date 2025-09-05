import React, { forwardRef } from 'react';
import { 
  ToggleButtonGroup,
  ToggleButton,
  Box,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { ToggleGroupProps } from './ToggleGroup.types';

const getColorFromTheme = (theme: { palette: { primary: { main: string; dark?: string; light?: string; contrastText?: string }; secondary: { main: string; dark?: string; light?: string; contrastText?: string }; success: { main: string; dark?: string; light?: string; contrastText?: string }; warning: { main: string; dark?: string; light?: string; contrastText?: string }; error: { main: string; dark?: string; light?: string; contrastText?: string }; grey?: { [key: number]: string } } }, color: string) => {
  if (color === 'neutral') {
    return {
      main: theme.palette.grey?.[700] || '#616161',
      dark: theme.palette.grey?.[800] || '#424242',
      light: theme.palette.grey?.[500] || '#9e9e9e',
      contrastText: '#fff'
    };
  }
  
  const colorMap: Record<string, { main: string; dark?: string; light?: string; contrastText?: string }> = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    danger: theme.palette.error,
  };
  
  const palette = colorMap[color] || theme.palette.primary;
  
  // Ensure palette has required properties
  return {
    main: palette?.main || theme.palette.primary.main,
    dark: palette?.dark || palette?.main || theme.palette.primary.dark,
    light: palette?.light || palette?.main || theme.palette.primary.light,
    contrastText: palette?.contrastText || '#fff'
  };
};

const StyledToggleGroup = styled(ToggleButtonGroup, {
  shouldForwardProp: (prop) => 
    !['customColor', 'customSize', 'glass'].includes(prop as string),
})<{ 
  customColor?: string;
  customSize?: string;
  glass?: boolean;
}>(({ theme, glass }) => ({
  backgroundColor: glass ? alpha(theme.palette.background.paper, 0.1) : 'transparent',
  backdropFilter: glass ? 'blur(20px)' : 'none',
  borderRadius: theme.spacing(1),
  padding: glass ? 4 : 0,
  border: glass ? `1px solid ${alpha(theme.palette.divider, 0.2)}` : 'none',
  
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: `${theme.shape.borderRadius}px !important`,
  },
}));

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({
    variant = 'single',
    color = 'primary',
    size = 'md',
    options,
    glow = false,
    glass = false,
    gradient = false,
    value,
    onChange,
    ...props
  }, ref) => {
    const colorPalette = getColorFromTheme({ palette: { primary: { main: '#1976d2' } } }, color);
    
    const sizeMap = {
      xs: { padding: '4px 8px', fontSize: '0.75rem' },
      sm: { padding: '6px 12px', fontSize: '0.875rem' },
      md: { padding: '8px 16px', fontSize: '1rem' },
      lg: { padding: '10px 20px', fontSize: '1.125rem' },
      xl: { padding: '12px 24px', fontSize: '1.25rem' },
    };

    return (
      <StyledToggleGroup
        ref={ref}
        customColor={color}
        customSize={size}
        glass={glass}
        value={value}
        onChange={onChange}
        exclusive={variant === 'exclusive' || variant === 'single'}
        {...props}
      >
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              ...sizeMap[size as keyof typeof sizeMap],
              
              '&.Mui-selected': {
                backgroundColor: `${color}.main`,
                color: 'white',
                
                ...(gradient && {
                  background: `linear-gradient(135deg, ${colorPalette.main}, ${colorPalette.dark})`,
                }),
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.icon}
              {option.label}
            </Box>
          </ToggleButton>
        ))}
      </StyledToggleGroup>
    );
  }
);

ToggleGroup.displayName = 'ToggleGroup';