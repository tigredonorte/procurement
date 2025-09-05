import React from 'react';
import { Avatar as MuiAvatar, Badge, alpha, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person } from '@mui/icons-material';

import { AvatarProps, AvatarSize, AvatarStatus } from './Avatar.types';

// Define pulse animation
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 currentColor;
    opacity: 1;
  }
  70% {
    box-shadow: 0 0 0 10px currentColor;
    opacity: 0;
  }
  100% {
    box-shadow: 0 0 0 0 currentColor;
    opacity: 0;
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

const getSizeStyles = (size: AvatarSize) => {
  const sizeMap: Record<AvatarSize, { width: number; height: number; fontSize: string }> = {
    xs: { width: 24, height: 24, fontSize: '0.75rem' },
    sm: { width: 32, height: 32, fontSize: '0.875rem' },
    md: { width: 40, height: 40, fontSize: '1rem' },
    lg: { width: 48, height: 48, fontSize: '1.125rem' },
    xl: { width: 64, height: 64, fontSize: '1.5rem' },
    xxl: { width: 80, height: 80, fontSize: '2rem' },
  };
  
  return sizeMap[size] || sizeMap.md;
};

const getStatusColor = (status: AvatarStatus, theme: any) => {
  const statusColorMap: Record<AvatarStatus, string> = {
    online: theme.palette.success.main,
    offline: theme.palette.grey[500],
    away: theme.palette.warning.main,
    busy: theme.palette.error.main,
  };
  
  return statusColorMap[status] || statusColorMap.offline;
};

const StyledAvatar = styled(MuiAvatar, {
  shouldForwardProp: (prop) => 
    !['customVariant', 'customSize', 'customColor', 'glow', 'pulse', 'bordered'].includes(prop as string),
})<{ 
  customVariant?: string;
  customSize?: AvatarSize;
  customColor?: string;
  glow?: boolean; 
  pulse?: boolean;
  bordered?: boolean;
}>(({ theme, customVariant, customSize = 'md', customColor = 'primary', glow, pulse, bordered }) => {
  const colorPalette = getColorFromTheme(theme, customColor);
  const sizeStyles = getSizeStyles(customSize);
  
  return {
    ...sizeStyles,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'visible',
    
    // Base background color when no image
    backgroundColor: colorPalette.main,
    color: colorPalette.contrastText || '#fff',

    // Variant styles
    ...(customVariant === 'circle' && {
      borderRadius: '50%',
    }),

    ...(customVariant === 'square' && {
      borderRadius: 0,
    }),

    ...(customVariant === 'rounded' && {
      borderRadius: theme.spacing(1),
    }),

    ...(customVariant === 'status' && {
      borderRadius: '50%',
    }),

    // Border
    ...(bordered && {
      border: `2px solid ${theme.palette.background.paper}`,
      boxShadow: `0 0 0 1px ${alpha(theme.palette.divider, 0.2)}`,
    }),

    // Glow effect
    ...(glow && !pulse && {
      boxShadow: `0 0 20px 5px ${alpha(colorPalette.main, 0.4)} !important`,
      filter: 'brightness(1.05)',
    }),

    // Pulse animation
    ...(pulse && !glow && {
      position: 'relative',
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

    // Both glow and pulse
    ...(glow && pulse && {
      position: 'relative',
      boxShadow: `0 0 20px 5px ${alpha(colorPalette.main, 0.4)} !important`,
      filter: 'brightness(1.05)',
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
});

const StatusBadge = styled(Badge, {
  shouldForwardProp: (prop) => 
    !['statusColor', 'avatarSize'].includes(prop as string),
})<{ 
  statusColor?: string;
  avatarSize?: AvatarSize;
}>(({ theme, statusColor, avatarSize = 'md' }) => {
  const sizeStyles = getSizeStyles(avatarSize);
  const badgeSize = Math.max(8, sizeStyles.width * 0.2);
  
  return {
    '& .MuiBadge-badge': {
      backgroundColor: statusColor || theme.palette.success.main,
      color: statusColor || theme.palette.success.main,
      width: badgeSize,
      height: badgeSize,
      borderRadius: '50%',
      border: `2px solid ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        content: '""',
      },
    },
  };
});

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({
    variant = 'circle',
    size = 'md',
    glow = false,
    pulse = false,
    status,
    fallback,
    icon,
    bordered = false,
    color = 'primary',
    src,
    alt,
    children,
    ...props
  }, ref) => {
    
    const avatarContent = children || fallback || icon || <Person />;
    
    const avatarElement = (
      <StyledAvatar
        ref={ref}
        customVariant={variant}
        customSize={size}
        customColor={color}
        glow={glow}
        pulse={pulse}
        bordered={bordered}
        src={src}
        alt={alt}
        {...props}
      >
        {avatarContent}
      </StyledAvatar>
    );

    // Wrap with status badge if variant is 'status' and status is provided
    if (variant === 'status' && status) {
      return (
        <StatusBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          statusColor={getStatusColor(status, { palette: { 
            success: { main: '#4caf50' }, 
            grey: { 500: '#9e9e9e' }, 
            warning: { main: '#ff9800' }, 
            error: { main: '#f44336' } 
          }})}
          avatarSize={size}
        >
          {avatarElement}
        </StatusBadge>
      );
    }

    return avatarElement;
  }
);

Avatar.displayName = 'Avatar';