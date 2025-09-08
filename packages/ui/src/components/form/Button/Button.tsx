import * as React from 'react';
import { Button as MuiButton, CircularProgress, alpha, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ButtonProps } from './Button.types';

// Define pulse animation globally
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 currentColor;
    opacity: 1;
  }
  70% {
    box-shadow: 0 0 0 15px currentColor;
    opacity: 0;
  }
  100% {
    box-shadow: 0 0 0 0 currentColor;
    opacity: 0;
  }
`;

interface ColorPalette {
  main: string;
  dark: string;
  light: string;
  contrastText: string;
}

const getColorFromTheme = (theme: { palette: any }, color: string): ColorPalette => {
  if (color === 'neutral') {
    return {
      main: theme.palette.grey?.[700] || '#616161',
      dark: theme.palette.grey?.[800] || '#424242',
      light: theme.palette.grey?.[500] || '#9e9e9e',
      contrastText: '#fff'
    };
  }
  
  const colorMap: Record<string, ColorPalette> = {
    primary: theme.palette.primary as ColorPalette,
    secondary: theme.palette.secondary as ColorPalette,
    success: theme.palette.success as ColorPalette,
    warning: theme.palette.warning as ColorPalette,
    danger: theme.palette.error as ColorPalette,
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

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => 
    ['glow', 'pulse', 'loading', 'customVariant', 'customColor', 'ripple'].indexOf(prop as string) === -1,
})<{ customVariant?: string; customColor?: string; glow?: boolean; pulse?: boolean; ripple?: boolean }>(
  ({ theme, customVariant, customColor = 'primary', glow, pulse }) => {
    const colorPalette = getColorFromTheme(theme, customColor);
    
    return {
      textTransform: 'none',
      fontWeight: 500,
      borderRadius: theme.spacing(1),
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',

      // Variant styles
      ...(customVariant === 'solid' && {
        backgroundColor: colorPalette.main,
        color: colorPalette.contrastText || '#fff',
        '&:hover': {
          backgroundColor: colorPalette.dark,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
      }),

      ...(customVariant === 'outline' && {
        backgroundColor: 'transparent',
        color: colorPalette.main,
        border: `2px solid ${colorPalette.main}`,
        '&:hover': {
          backgroundColor: alpha(colorPalette.main, 0.1),
          borderColor: colorPalette.dark,
        },
      }),

      ...(customVariant === 'ghost' && {
        backgroundColor: 'transparent',
        color: colorPalette.main,
        '&:hover': {
          backgroundColor: alpha(colorPalette.main, 0.1),
        },
      }),

      ...(customVariant === 'glass' && {
        backgroundColor: alpha(theme.palette.background.paper, 0.1),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        color: colorPalette.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.background.paper, 0.2),
          transform: 'translateY(-2px)',
        },
      }),

      ...(customVariant === 'gradient' && {
        background: customColor === 'primary' 
          ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
          : customColor === 'secondary'
          ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`
          : customColor === 'success'
          ? `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.dark} 100%)`
          : customColor === 'warning'
          ? `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.dark} 100%)`
          : customColor === 'danger'
          ? `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.error.dark} 100%)`
          : `linear-gradient(135deg, ${colorPalette.main} 0%, ${colorPalette.dark} 100%)`,
        color: '#fff',
        '&:hover': {
          filter: 'brightness(1.1)',
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[12],
        },
      }),

      // Glow effect - applied with !important to override variant shadows
      ...(glow && !pulse && {
        boxShadow: `0 0 20px 5px ${alpha(colorPalette.main, 0.6)}, 0 0 40px 10px ${alpha(colorPalette.main, 0.3)} !important`,
        filter: 'brightness(1.05)',
        '&:hover': {
          boxShadow: `0 0 25px 8px ${alpha(colorPalette.main, 0.7)}, 0 0 50px 15px ${alpha(colorPalette.main, 0.4)} !important`,
          filter: 'brightness(1.1)',
          transform: 'translateY(-2px) scale(1.02)',
        },
      }),

      // Pulse animation using pseudo-element
      ...(pulse && !glow && {
        position: 'relative',
        overflow: 'visible',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          transform: 'translate(-50%, -50%)',
          backgroundColor: colorPalette.main,
          opacity: 0.3,
          animation: `${pulseAnimation} 2s infinite`,
          pointerEvents: 'none',
          zIndex: -1,
        },
      }),

      // Both glow and pulse effects combined
      ...(glow && pulse && {
        position: 'relative',
        overflow: 'visible',
        boxShadow: `0 0 20px 5px ${alpha(colorPalette.main, 0.6)}, 0 0 40px 10px ${alpha(colorPalette.main, 0.3)} !important`,
        filter: 'brightness(1.05)',
        '&:hover': {
          boxShadow: `0 0 25px 8px ${alpha(colorPalette.main, 0.7)}, 0 0 50px 15px ${alpha(colorPalette.main, 0.4)} !important`,
          filter: 'brightness(1.1)',
          transform: 'translateY(-2px) scale(1.02)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          transform: 'translate(-50%, -50%)',
          backgroundColor: colorPalette.main,
          opacity: 0.3,
          animation: `${pulseAnimation} 2s infinite`,
          pointerEvents: 'none',
          zIndex: -1,
        },
      }),
    };
  }
);

const sizeMap = {
  xs: { padding: '4px 8px', fontSize: '0.75rem' },
  sm: { padding: '6px 12px', fontSize: '0.875rem' },
  md: { padding: '8px 16px', fontSize: '1rem' },
  lg: { padding: '10px 20px', fontSize: '1.125rem' },
  xl: { padding: '12px 24px', fontSize: '1.25rem' },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'solid',
    color = 'primary',
    size = 'md',
    loading = false,
    icon,
    glow = false,
    pulse = false,
    ripple = true,
    children,
    disabled,
    onClick,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const muiVariant = variant === 'outline' ? 'outlined' : 'contained';
    const muiColor = color === 'danger' ? 'error' : color === 'neutral' ? 'inherit' : color as 'primary' | 'secondary' | 'success' | 'warning' | 'info';

    return (
      <StyledButton
        ref={ref}
        variant={muiVariant}
        color={muiColor}
        customVariant={variant}
        customColor={color}
        glow={glow}
        pulse={pulse}
        ripple={ripple}
        disabled={disabled || loading}
        disableRipple={!ripple}
        startIcon={!loading && icon}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        sx={sizeMap[size]}
        {...props}
      >
        {loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          children
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';