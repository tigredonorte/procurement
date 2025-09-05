import React, { forwardRef } from 'react';
import { 
  Switch as MuiSwitch,
  FormControlLabel,
  Box,
  Typography,
  FormHelperText,
  alpha,
  keyframes
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SwitchProps } from './Switch.types';

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
  }
  100% {
    box-shadow: 0 0 5px currentColor;
  }
`;

const slideAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
`;

const bounceAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const getColorFromTheme = (theme: any, color: string) => {
  if (color === 'neutral') {
    return {
      main: theme.palette.grey?.[700] || '#616161',
      dark: theme.palette.grey?.[800] || '#424242',
      light: theme.palette.grey?.[500] || '#9e9e9e',
      contrastText: '#fff'
    };
  }
  
  const colorMap: Record<string, any> = {
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

const StyledSwitch = styled(MuiSwitch, {
  shouldForwardProp: (prop) => 
    !['customVariant', 'customColor', 'customSize', 'glow', 'glass', 'gradient', 
      'trackWidth', 'trackHeight', 'onText', 'offText'].includes(prop as string),
})<{ 
  customVariant?: string;
  customColor?: string;
  customSize?: string;
  glow?: boolean;
  glass?: boolean;
  gradient?: boolean;
  trackWidth?: number;
  trackHeight?: number;
  onText?: string;
  offText?: string;
}>(({ theme, customVariant, customColor = 'primary', customSize = 'md', glow, glass, gradient, trackWidth, trackHeight, onText, offText }) => {
  const colorPalette = getColorFromTheme(theme, customColor);
  
  const sizeMap = {
    xs: { width: 34, height: 18, padding: 1, thumbSize: 14 },
    sm: { width: 42, height: 22, padding: 1, thumbSize: 18 },
    md: { width: 50, height: 26, padding: 1, thumbSize: 22 },
    lg: { width: 58, height: 30, padding: 2, thumbSize: 24 },
    xl: { width: 66, height: 34, padding: 2, thumbSize: 28 },
  };

  const currentSize = sizeMap[customSize as keyof typeof sizeMap];
  const width = trackWidth || currentSize.width;
  const height = trackHeight || currentSize.height;
  const thumbSize = currentSize.thumbSize;

  const iosVariant = customVariant === 'ios';
  const androidVariant = customVariant === 'android';
  const labelVariant = customVariant === 'label';
  const materialVariant = customVariant === 'material';

  return {
    width,
    height,
    padding: 0,
    overflow: 'visible',
    '& .MuiSwitch-switchBase': {
      padding: currentSize.padding,
      margin: 0,
      transitionDuration: '300ms',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      ...(iosVariant && {
        transform: 'translateX(2px)',
      }),
      '&:hover': {
        '& .MuiSwitch-thumb': {
          transform: 'scale(1.05)',
          boxShadow: `${theme.shadows[4]}, 0 0 12px ${alpha(colorPalette.main, 0.2)}`,
        },
      },
      '&.Mui-checked': {
        transform: `translateX(${width - thumbSize - currentSize.padding * 2}px)`,
        color: '#fff',
        '& .MuiSwitch-thumb': {
          animation: `${bounceAnimation} 0.3s ease-out`,
        },
        '& + .MuiSwitch-track': {
          backgroundColor: gradient 
            ? colorPalette.main 
            : colorPalette.main,
          opacity: 1,
          border: 0,
          position: 'relative',
          overflow: 'hidden',
          ...(glow && {
            animation: `${glowAnimation} 2s ease-in-out infinite`,
            boxShadow: `0 0 10px ${alpha(colorPalette.main, 0.6)}, inset 0 0 10px ${alpha(colorPalette.main, 0.2)}`,
          }),
          ...(gradient && {
            background: `linear-gradient(90deg, ${colorPalette.light} 0%, ${colorPalette.main} 50%, ${colorPalette.dark} 100%)`,
            backgroundSize: '200% 100%',
            animation: `${shimmerAnimation} 3s ease infinite`,
          }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
        ...(iosVariant && {
          transform: `translateX(${width - thumbSize - 4}px)`,
        }),
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: colorPalette.main,
        border: `6px solid ${alpha(colorPalette.main, 0.2)}`,
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      width: thumbSize,
      height: thumbSize,
      borderRadius: iosVariant ? '50%' : androidVariant ? 4 : materialVariant ? thumbSize / 3 : '50%',
      backgroundColor: '#fff',
      boxShadow: iosVariant 
        ? `0 3px 1px 0 ${alpha('#000', 0.04)}, 0 3px 8px 0 ${alpha('#000', 0.12)}, 0 1px 0 0 ${alpha('#000', 0.08)}`
        : androidVariant
        ? theme.shadows[3]
        : theme.shadows[2],
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...(glass && {
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      }),
      ...(materialVariant && {
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          backgroundColor: colorPalette.main,
          opacity: 0,
          transform: 'scale(0)',
          transition: 'all 0.3s ease',
        },
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: iosVariant ? height / 2 : androidVariant ? height / 3 : materialVariant ? height / 2.5 : height / 2,
      backgroundColor: iosVariant
        ? alpha(theme.palette.common.black, 0.1)
        : androidVariant
        ? alpha(theme.palette.action.disabled, 0.2)
        : alpha(theme.palette.action.disabled, 0.3),
      opacity: 1,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      boxShadow: iosVariant 
        ? `inset 0 0 0 0.5px ${alpha('#000', 0.1)}, inset 0 2px 3px ${alpha('#000', 0.12)}`
        : 'none',
      ...(glass && {
        backgroundColor: alpha(theme.palette.background.paper, 0.1),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      }),
      ...(gradient && !glass && {
        background: `linear-gradient(135deg, ${alpha(colorPalette.light, 0.3)}, ${alpha(colorPalette.main, 0.2)})`,
      }),
      ...(labelVariant && (onText || offText) && {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        fontSize: '0.75rem',
        fontWeight: 500,
        color: theme.palette.text.secondary,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          fontSize: '0.75rem',
          fontWeight: 500,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        },
        ...(onText && {
          '&::before': {
            content: `"${onText}"`,
            left: theme.spacing(1),
            color: '#fff',
          },
        }),
        ...(offText && {
          '&::after': {
            content: `"${offText}"`,
            right: theme.spacing(1),
            color: theme.palette.text.secondary,
          },
        }),
      }),
    },
  };
});

const LabelContainer = styled(Box)<{ labelPosition?: string; error?: boolean }>(
  ({ theme, labelPosition, error }) => ({
    display: 'flex',
    alignItems: labelPosition === 'top' || labelPosition === 'bottom' ? 'flex-start' : 'center',
    flexDirection: labelPosition === 'top' ? 'column' : labelPosition === 'bottom' ? 'column-reverse' : 'row',
    gap: theme.spacing(labelPosition === 'top' || labelPosition === 'bottom' ? 1 : 2),
    width: '100%',
    ...(error && {
      '& .MuiTypography-root': {
        color: theme.palette.error.main,
      },
    }),
  })
);

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({
    variant = 'default',
    color = 'primary',
    size = 'md',
    label,
    description,
    glow = false,
    glass = false,
    gradient = false,
    labelPosition = 'end',
    onIcon,
    offIcon,
    onText,
    offText,
    error = false,
    helperText,
    trackWidth,
    trackHeight,
    checked,
    onChange,
    animated = true,
    ...props
  }, ref) => {

    const switchElement = (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <StyledSwitch
          ref={ref}
          customVariant={variant}
          customColor={color}
          customSize={size}
          glow={glow}
          glass={glass}
          gradient={gradient}
          trackWidth={trackWidth}
          trackHeight={trackHeight}
          onText={onText}
          offText={offText}
          checked={checked}
          onChange={onChange}
          {...props}
        />
        
        {/* Icon overlays */}
        {(onIcon || offIcon) && (
          <>
            {onIcon && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: checked ? 4 : '50%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: checked ? 1 : 0,
                  transform: checked && animated ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
                  pointerEvents: 'none',
                  zIndex: 2,
                  color: '#fff',
                  fontSize: size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 18 : 20,
                }}
              >
                {onIcon}
              </Box>
            )}
            {offIcon && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: !checked ? 4 : '50%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: !checked ? 1 : 0,
                  transform: !checked && animated ? 'translate(50%, -50%) scale(1)' : 'translate(50%, -50%) scale(0.8)',
                  pointerEvents: 'none',
                  zIndex: 2,
                  color: 'text.secondary',
                  fontSize: size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 18 : 20,
                }}
              >
                {offIcon}
              </Box>
            )}
          </>
        )}
      </Box>
    );

    if (!label) {
      return (
        <Box>
          {switchElement}
          {helperText && (
            <FormHelperText error={error} sx={{ mt: 1 }}>
              {helperText}
            </FormHelperText>
          )}
        </Box>
      );
    }

    return (
      <Box>
        <LabelContainer labelPosition={labelPosition} error={error}>
          {labelPosition === 'start' && switchElement}
          
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              color={error ? 'error.main' : 'text.primary'}
            >
              {label}
            </Typography>
            {description && (
              <Typography
                variant="caption"
                color={error ? 'error.main' : 'text.secondary'}
                sx={{ display: 'block', mt: 0.5 }}
              >
                {description}
              </Typography>
            )}
          </Box>
          
          {labelPosition !== 'start' && switchElement}
        </LabelContainer>
        
        {helperText && (
          <FormHelperText error={error} sx={{ mt: 1 }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    );
  }
);

Switch.displayName = 'Switch';