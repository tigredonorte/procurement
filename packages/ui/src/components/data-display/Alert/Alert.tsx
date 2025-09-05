import React from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  Collapse,
  IconButton,
  alpha,
  keyframes,
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { CheckCircle, Info, Warning, Error, Close } from '@mui/icons-material';

import { AlertProps } from './Alert.types';

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

const getColorFromTheme = (theme: Theme, variant: string) => {
  const colorMap: Record<string, { main: string; light?: string; dark?: string }> = {
    info: theme.palette.info,
    success: theme.palette.success,
    warning: theme.palette.warning,
    danger: theme.palette.error,
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    neutral: {
      main: theme.palette.grey[500] || '#9E9E9E',
      light: theme.palette.grey[300] || '#E0E0E0',
      dark: theme.palette.grey[700] || '#616161',
    },
  };

  return colorMap[variant] || theme.palette.info;
};

const getVariantIcon = (variant: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    info: <Info />,
    success: <CheckCircle />,
    warning: <Warning />,
    danger: <Error />,
  };

  return iconMap[variant];
};

const StyledAlert = styled(MuiAlert, {
  shouldForwardProp: (prop) =>
    !['customVariant', 'customColor', 'glow', 'pulse'].includes(prop as string),
})<{
  customVariant?: string;
  customColor?: string;
  glow?: boolean;
  pulse?: boolean;
}>(({ theme, customVariant, customColor, glow, pulse }) => {
  const colorPalette = getColorFromTheme(theme, customColor || customVariant || 'info');

  return {
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',

    // Base styles
    '.MuiAlert-message': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },

    // Variant styles
    ...(customVariant === 'info' && {
      backgroundColor: alpha(colorPalette.main, 0.1),
      color: colorPalette.main,
      border: `1px solid ${alpha(colorPalette.main, 0.2)}`,
      '.MuiAlert-icon': {
        color: colorPalette.main,
      },
    }),

    ...(customVariant === 'success' && {
      backgroundColor: alpha(colorPalette.main, 0.1),
      color: colorPalette.main,
      border: `1px solid ${alpha(colorPalette.main, 0.2)}`,
      '.MuiAlert-icon': {
        color: colorPalette.main,
      },
    }),

    ...(customVariant === 'warning' && {
      backgroundColor: alpha(colorPalette.main, 0.1),
      color: colorPalette.main,
      border: `1px solid ${alpha(colorPalette.main, 0.2)}`,
      '.MuiAlert-icon': {
        color: colorPalette.main,
      },
    }),

    ...(customVariant === 'danger' && {
      backgroundColor: alpha(colorPalette.main, 0.1),
      color: colorPalette.main,
      border: `1px solid ${alpha(colorPalette.main, 0.2)}`,
      '.MuiAlert-icon': {
        color: colorPalette.main,
      },
    }),

    ...(customVariant === 'glass' && {
      backgroundColor: alpha(theme.palette.background.paper, 0.1),
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      color: theme.palette.text.primary,
      '.MuiAlert-icon': {
        color: theme.palette.primary.main,
      },
    }),

    ...(customVariant === 'gradient' && {
      background: `linear-gradient(135deg, ${alpha(colorPalette.light || colorPalette.main, 0.9)}, ${alpha(colorPalette.dark || colorPalette.main, 0.9)})`,
      color: theme.palette.getContrastText(colorPalette.main),
      border: 'none',
      '.MuiAlert-icon': {
        color: theme.palette.getContrastText(colorPalette.main),
      },
      '&:hover': {
        filter: 'brightness(1.05)',
      },
    }),

    // Glow effect
    ...(glow &&
      !pulse && {
        boxShadow: `0 0 20px 5px ${alpha(colorPalette.main, 0.3)} !important`,
        filter: 'brightness(1.05)',
      }),

    // Pulse animation
    ...(pulse &&
      !glow && {
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          backgroundColor: colorPalette.main,
          opacity: 0.2,
          animation: `${pulseAnimation} 2s infinite`,
          pointerEvents: 'none',
          zIndex: -1,
        },
      }),

    // Both glow and pulse
    ...(glow &&
      pulse && {
        position: 'relative',
        boxShadow: `0 0 20px 5px ${alpha(colorPalette.main, 0.3)} !important`,
        filter: 'brightness(1.05)',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          backgroundColor: colorPalette.main,
          opacity: 0.2,
          animation: `${pulseAnimation} 2s infinite`,
          pointerEvents: 'none',
          zIndex: -1,
        },
      }),
  };
});

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      color,
      glow = false,
      pulse = false,
      icon,
      showIcon = true,
      closable = false,
      onClose,
      title,
      description,
      children,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
      setOpen(false);
      onClose?.();
    };

    const severity =
      variant === 'danger'
        ? 'error'
        : variant === 'glass'
          ? 'info'
          : variant === 'gradient'
            ? 'info'
            : variant;

    const displayIcon = showIcon ? icon || getVariantIcon(variant) : false;

    const content = (
      <>
        {title && <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>}
        {description && <div>{description}</div>}
        {children}
      </>
    );

    return (
      <Collapse in={open}>
        <StyledAlert
          ref={ref}
          severity={severity}
          customVariant={variant}
          customColor={color}
          glow={glow}
          pulse={pulse}
          icon={displayIcon}
          action={
            closable && (
              <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
                <Close fontSize="inherit" />
              </IconButton>
            )
          }
          {...props}
        >
          {content}
        </StyledAlert>
      </Collapse>
    );
  },
);

Alert.displayName = 'Alert';
