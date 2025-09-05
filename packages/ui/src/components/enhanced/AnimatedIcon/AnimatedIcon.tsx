import React, { FC } from 'react';
import {
  Box,
  alpha,
  keyframes,
  styled,
  useTheme,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Settings,
  FiberManualRecord,
  Refresh,
} from '@mui/icons-material';

// Types
export type AnimationVariant = 'processing' | 'success' | 'error' | 'loading' | 'pulse';
export type AnimationSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AnimatedIconProps {
  variant: AnimationVariant;
  size?: AnimationSize;
  color?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Animation keyframes
const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const successAnimation = keyframes`
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(-5deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const errorAnimation = keyframes`
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  25% {
    transform: scale(1.1) rotate(5deg);
    opacity: 1;
  }
  50% {
    transform: scale(1) rotate(0deg) translateX(0);
  }
  60% {
    transform: scale(1) rotate(0deg) translateX(-5px);
  }
  70% {
    transform: scale(1) rotate(0deg) translateX(5px);
  }
  80% {
    transform: scale(1) rotate(0deg) translateX(-3px);
  }
  90% {
    transform: scale(1) rotate(0deg) translateX(3px);
  }
  100% {
    transform: scale(1) rotate(0deg) translateX(0);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const loadingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
  }
  50% {
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
  }
  100% {
    box-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
  }
`;

// Size configurations
const sizeConfigs: Record<AnimationSize, { size: number; strokeWidth: number }> = {
  sm: { size: 24, strokeWidth: 2 },
  md: { size: 32, strokeWidth: 2.5 },
  lg: { size: 48, strokeWidth: 3 },
  xl: { size: 64, strokeWidth: 3.5 },
};

// Styled components
const AnimationContainer = styled(Box)<{
  size: number;
  animationVariant: AnimationVariant;
  duration: number;
  customColor?: string;
}>(({ theme, size, animationVariant, duration, customColor }) => {
  const getAnimation = () => {
    switch (animationVariant) {
      case 'processing':
        return `${rotateAnimation} ${duration}s linear infinite`;
      case 'success':
        return `${successAnimation} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
      case 'error':
        return `${errorAnimation} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
      case 'loading':
        return `${loadingAnimation} ${duration}s cubic-bezier(0.4, 0.0, 0.2, 1) infinite`;
      case 'pulse':
        return `${pulseAnimation} ${duration}s ease-in-out infinite`;
      default:
        return 'none';
    }
  };

  const getColor = () => {
    if (customColor) return customColor;
    switch (animationVariant) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'processing':
      case 'loading':
        return theme.palette.primary.main;
      case 'pulse':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    color: getColor(),
    animation: getAnimation(),
    position: 'relative',
    '&::before': animationVariant === 'pulse' ? {
      content: '""',
      position: 'absolute',
      inset: -4,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${alpha(getColor(), 0.2)} 0%, transparent 70%)`,
      animation: `${pulseAnimation} ${duration}s ease-in-out infinite`,
    } : {},
    '& .MuiSvgIcon-root': {
      fontSize: size,
      width: size,
      height: size,
    },
  };
});

const LoadingSpinner = styled('svg')<{ size: number; strokeWidth: number }>(
  ({ size, strokeWidth }) => ({
    width: size,
    height: size,
    '& circle': {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeLinecap: 'round',
      strokeDasharray: `${(size - strokeWidth) * Math.PI * 0.75}`,
      strokeDashoffset: `${(size - strokeWidth) * Math.PI * 0.25}`,
      transformOrigin: 'center',
    },
  })
);

const ProcessingGear = styled(Settings)({
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
});

const SuccessIcon = styled(CheckCircle)({
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
});

const ErrorIcon = styled(Cancel)({
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
});

const PulseIcon = styled(FiberManualRecord)({
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
});

// Main component
export const AnimatedIcon: FC<AnimatedIconProps> = ({
  variant,
  size = 'md',
  color,
  duration = 2,
  className,
  style,
}) => {
  const theme = useTheme();
  const config = sizeConfigs[size];

  const renderIcon = () => {
    switch (variant) {
      case 'processing':
        return <ProcessingGear />;
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'loading':
        return (
          <LoadingSpinner
            size={config.size}
            strokeWidth={config.strokeWidth}
            viewBox={`0 0 ${config.size} ${config.size}`}
          >
            <circle
              cx={config.size / 2}
              cy={config.size / 2}
              r={(config.size - config.strokeWidth) / 2}
            />
          </LoadingSpinner>
        );
      case 'pulse':
        return <PulseIcon />;
      default:
        return null;
    }
  };

  return (
    <AnimationContainer
      size={config.size}
      animationVariant={variant}
      duration={duration}
      customColor={color}
      className={className}
      style={style}
      role="img"
      aria-label={`${variant} animation`}
    >
      {renderIcon()}
    </AnimationContainer>
  );
};

// Export default
export default AnimatedIcon;