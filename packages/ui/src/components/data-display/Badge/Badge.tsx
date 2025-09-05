import React from 'react';
import { Badge as MuiBadge, alpha, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

import { BadgeProps, BadgeSize, BadgeVariant } from './Badge.types';

// Define pulse animation
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const getColorFromTheme = (theme: any, color: string) => {
  const colorMap: Record<string, any> = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error,
    neutral: theme.palette.grey,
  };
  
  return colorMap[color] || theme.palette.primary;
};

const getSizeStyles = (size: BadgeSize) => {
  const sizeMap: Record<BadgeSize, { 
    minWidth: number; 
    height: number; 
    fontSize: string; 
    padding: string;
    dotSize: number;
  }> = {
    sm: { 
      minWidth: 16, 
      height: 16, 
      fontSize: '0.625rem', 
      padding: '0 4px',
      dotSize: 8,
    },
    md: { 
      minWidth: 20, 
      height: 20, 
      fontSize: '0.75rem', 
      padding: '0 6px',
      dotSize: 10,
    },
    lg: { 
      minWidth: 24, 
      height: 24, 
      fontSize: '0.875rem', 
      padding: '0 8px',
      dotSize: 12,
    },
  };
  
  return sizeMap[size] || sizeMap.md;
};

const getAnchorOrigin = (position: string) => {
  const positionMap: Record<string, { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' }> = {
    'top-right': { vertical: 'top', horizontal: 'right' },
    'top-left': { vertical: 'top', horizontal: 'left' },
    'bottom-right': { vertical: 'bottom', horizontal: 'right' },
    'bottom-left': { vertical: 'bottom', horizontal: 'left' },
  };
  
  return positionMap[position] || positionMap['top-right'];
};

const StyledBadge = styled(MuiBadge, {
  shouldForwardProp: (prop) => 
    !['customVariant', 'customSize', 'customColor', 'glow', 'pulse'].includes(prop as string),
})<{ 
  customVariant?: BadgeVariant;
  customSize?: BadgeSize;
  customColor?: string;
  glow?: boolean; 
  pulse?: boolean;
}>(({ theme, customVariant, customSize = 'md', customColor = 'primary', glow, pulse }) => {
  const colorPalette = getColorFromTheme(theme, customColor);
  const sizeStyles = getSizeStyles(customSize);
  
  return {
    '& .MuiBadge-badge': {
      transition: 'all 0.3s ease',
      fontWeight: 600,
      border: `2px solid ${theme.palette.background.paper}`,
      
      // Base styles based on variant
      ...(customVariant === 'default' && {
        backgroundColor: colorPalette.main,
        color: colorPalette.contrastText || '#fff',
        minWidth: sizeStyles.minWidth,
        height: sizeStyles.height,
        fontSize: sizeStyles.fontSize,
        padding: sizeStyles.padding,
        borderRadius: sizeStyles.height / 2,
      }),

      ...(customVariant === 'dot' && {
        backgroundColor: colorPalette.main,
        width: sizeStyles.dotSize,
        height: sizeStyles.dotSize,
        minWidth: sizeStyles.dotSize,
        borderRadius: '50%',
        padding: 0,
      }),

      ...(customVariant === 'count' && {
        backgroundColor: colorPalette.main,
        color: colorPalette.contrastText || '#fff',
        minWidth: sizeStyles.minWidth,
        height: sizeStyles.height,
        fontSize: sizeStyles.fontSize,
        padding: sizeStyles.padding,
        borderRadius: '50%',
      }),

      ...(customVariant === 'gradient' && {
        background: `linear-gradient(135deg, ${colorPalette.main} 0%, ${colorPalette.dark || colorPalette.main} 100%)`,
        color: '#fff',
        minWidth: sizeStyles.minWidth,
        height: sizeStyles.height,
        fontSize: sizeStyles.fontSize,
        padding: sizeStyles.padding,
        borderRadius: sizeStyles.height / 2,
      }),

      // Glow effect
      ...(glow && !pulse && {
        boxShadow: `0 0 10px 2px ${alpha(colorPalette.main, 0.6)} !important`,
        filter: 'brightness(1.1)',
      }),

      // Pulse animation
      ...(pulse && !glow && {
        animation: `${pulseAnimation} 2s infinite`,
      }),

      // Both glow and pulse
      ...(glow && pulse && {
        boxShadow: `0 0 10px 2px ${alpha(colorPalette.main, 0.6)} !important`,
        filter: 'brightness(1.1)',
        animation: `${pulseAnimation} 2s infinite`,
      }),
    },
  };
});

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    variant = 'default',
    size = 'md',
    color = 'primary',
    glow = false,
    pulse = false,
    max = 99,
    showZero = false,
    content,
    position = 'top-right',
    badgeContent,
    children,
    ...props
  }, ref) => {
    
    // Determine the badge content
    const getBadgeContent = () => {
      if (content !== undefined) return content;
      if (badgeContent !== undefined) return badgeContent;
      return null;
    };

    // For count variant, format numbers
    const formatCount = (count: any) => {
      if (typeof count === 'number') {
        if (count === 0 && !showZero) return null;
        if (count > max) return `${max}+`;
        return count;
      }
      return count;
    };

    const finalBadgeContent = variant === 'count' ? formatCount(getBadgeContent()) : getBadgeContent();
    const anchorOrigin = getAnchorOrigin(position);

    return (
      <StyledBadge
        ref={ref}
        customVariant={variant}
        customSize={size}
        customColor={color}
        glow={glow}
        pulse={pulse}
        badgeContent={variant === 'dot' ? '' : finalBadgeContent}
        variant={variant === 'dot' ? 'dot' : 'standard'}
        anchorOrigin={anchorOrigin}
        {...props}
      >
        {children}
      </StyledBadge>
    );
  }
);

Badge.displayName = 'Badge';