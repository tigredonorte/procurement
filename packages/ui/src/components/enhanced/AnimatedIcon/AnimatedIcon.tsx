import { FC } from 'react';
import {
  Box,
  alpha,
  keyframes,
  styled,
} from '@mui/material';

import type { AnimatedIconProps, AnimationVariant, AnimationSize } from './AnimatedIcon.types';

// Animation keyframes
const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const translateAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const glowPulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
  }
  50% {
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
  }
  100% {
    box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
  }
`;

// Size configurations
const sizeConfigs: Record<AnimationSize, { size: number; fontSize: number }> = {
  sm: { size: 24, fontSize: 20 },
  md: { size: 32, fontSize: 28 },
  lg: { size: 48, fontSize: 44 },
  xl: { size: 64, fontSize: 60 },
};

// Styled components
const AnimationContainer = styled(Box)<{
  $size: number;
  $fontSize: number;
  $animationVariant: AnimationVariant;
  $duration: number;
  $delay: number;
  $loop: boolean;
  $glow: boolean;
  $glass: boolean;
  $glowColor?: string;
  $customColor?: string;
}>(({ 
  theme, 
  $size, 
  $fontSize, 
  $animationVariant, 
  $duration, 
  $delay, 
  $loop, 
  $glow, 
  $glass, 
  $glowColor, 
  $customColor 
}) => {
  const getAnimation = () => {
    const iterationCount = $loop ? 'infinite' : '1';
    const animationDelay = $delay > 0 ? `${$delay}s` : '0s';
    
    switch ($animationVariant) {
      case 'rotate':
        return `${rotateAnimation} ${$duration}s linear ${iterationCount} ${animationDelay}`;
      case 'pulse':
        return `${pulseAnimation} ${$duration}s ease-in-out ${iterationCount} ${animationDelay}`;
      case 'translate':
        return `${translateAnimation} ${$duration}s ease-in-out ${iterationCount} ${animationDelay}`;
      default:
        return 'none';
    }
  };

  const getColor = () => {
    if ($customColor) return $customColor;
    return theme.palette.primary.main;
  };

  const getGlowColor = () => {
    if ($glowColor) return $glowColor;
    return getColor();
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: $size,
    height: $size,
    color: getColor(),
    animation: getAnimation(),
    position: 'relative' as const,
    cursor: 'default',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  };

  const glowStyles = $glow ? {
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      inset: -8,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${alpha(getGlowColor(), 0.3)} 0%, transparent 70%)`,
      animation: `${glowPulseAnimation} ${$duration * 1.2}s ease-in-out infinite`,
      zIndex: -1,
    },
    filter: `drop-shadow(0 0 8px ${alpha(getGlowColor(), 0.5)})`,
  } : {};

  const glassStyles = $glass ? {
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.2)}, ${alpha(theme.palette.background.paper, 0.1)})`,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  } : {};

  return {
    ...baseStyles,
    ...glowStyles,
    ...glassStyles,
    '& .MuiSvgIcon-root': {
      fontSize: $fontSize,
      width: $fontSize,
      height: $fontSize,
    },
    '& svg': {
      fontSize: $fontSize,
      width: $fontSize,
      height: $fontSize,
    },
    '&:hover': {
      transform: 'scale(1.05)',
    },
  };
});

// Main component
export const AnimatedIcon: FC<AnimatedIconProps> = ({
  children,
  variant = 'none',
  size = 'md',
  color,
  duration = 2,
  delay = 0,
  loop = true,
  glow = false,
  glass = false,
  glowColor,
  className,
  style,
  'aria-label': ariaLabel,
  onClick,
}) => {
  const config = sizeConfigs[size];

  return (
    <AnimationContainer
      $size={config.size}
      $fontSize={config.fontSize}
      $animationVariant={variant}
      $duration={duration}
      $delay={delay}
      $loop={loop}
      $glow={glow}
      $glass={glass}
      $glowColor={glowColor}
      $customColor={color}
      className={className}
      style={style}
      role="img"
      aria-label={ariaLabel || `Animated ${variant} icon`}
      onClick={onClick}
    >
      {children}
    </AnimationContainer>
  );
};

// Export default
export default AnimatedIcon;