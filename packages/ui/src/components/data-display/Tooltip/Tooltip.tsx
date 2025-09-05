import React from 'react';
import { Tooltip as MuiTooltip, alpha, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

import { TooltipProps } from './Tooltip.types';

// Define pulse animation
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const getSizeStyles = (size: string): { fontSize: string; padding: string } => {
  const sizeMap = {
    sm: { fontSize: '0.75rem', padding: '4px 8px' },
    md: { fontSize: '0.875rem', padding: '6px 12px' },
    lg: { fontSize: '1rem', padding: '8px 16px' },
  } as const;
  
  return (sizeMap as any)[size] || sizeMap.md;
};

const StyledTooltip = styled(MuiTooltip, {
  shouldForwardProp: (prop) => 
    !['customVariant', 'customSize', 'glow', 'pulse'].includes(prop as string),
})<{ 
  customVariant?: string;
  customSize?: string;
  glow?: boolean; 
  pulse?: boolean;
}>(({ theme, customVariant, customSize = 'md', glow, pulse }) => {
  const sizeStyles = getSizeStyles(customSize);
  
  return {
    '& .MuiTooltip-tooltip': {
      borderRadius: theme.spacing(1),
      fontSize: sizeStyles.fontSize,
      padding: sizeStyles.padding,
      fontWeight: 500,
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      
      // Variant styles
      ...(customVariant === 'default' && {
        backgroundColor: alpha(theme.palette.grey[900], 0.9),
        color: theme.palette.common.white,
      }),
      
      ...(customVariant === 'dark' && {
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
      }),
      
      ...(customVariant === 'light' && {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.text.primary,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        boxShadow: theme.shadows[4],
      }),
      
      ...(customVariant === 'glass' && {
        backgroundColor: alpha(theme.palette.background.paper, 0.1),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        color: theme.palette.text.primary,
      }),
      
      // Glow effect
      ...(glow && !pulse && {
        boxShadow: `0 0 15px 3px ${alpha(theme.palette.primary.main, 0.4)} !important`,
        filter: 'brightness(1.05)',
      }),
      
      // Pulse animation
      ...(pulse && !glow && {
        animation: `${pulseAnimation} 2s infinite`,
      }),
      
      // Both glow and pulse
      ...(glow && pulse && {
        boxShadow: `0 0 15px 3px ${alpha(theme.palette.primary.main, 0.4)} !important`,
        filter: 'brightness(1.05)',
        animation: `${pulseAnimation} 2s infinite`,
      }),
    },
    
    '& .MuiTooltip-arrow': {
      color: customVariant === 'light' 
        ? theme.palette.common.white
        : customVariant === 'glass'
        ? alpha(theme.palette.background.paper, 0.1)
        : customVariant === 'dark'
        ? theme.palette.grey[900]
        : alpha(theme.palette.grey[900], 0.9),
    },
  };
});

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({
    variant = 'default',
    size = 'md',
    glow = false,
    pulse = false,
    maxWidth = 300,
    children,
    ...props
  }, ref) => {
    return (
      <StyledTooltip
        ref={ref}
        customVariant={variant}
        customSize={size}
        glow={glow}
        pulse={pulse}
        componentsProps={{
          tooltip: {
            sx: { maxWidth }
          }
        }}
        {...props}
      >
        {children}
      </StyledTooltip>
    );
  }
);

Tooltip.displayName = 'Tooltip';