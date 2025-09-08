import React from 'react';

export type AnimationVariant = 'rotate' | 'pulse' | 'translate' | 'none';
export type AnimationSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AnimatedIconProps {
  /** Icon element to animate - can be any React node (MUI icon, SVG, etc.) */
  children: React.ReactNode;
  /** Animation variant to apply */
  variant?: AnimationVariant;
  /** Size of the animated icon container */
  size?: AnimationSize;
  /** Custom color override for the icon */
  color?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Whether the animation should loop infinitely */
  loop?: boolean;
  /** Enable glow effect around the icon */
  glow?: boolean;
  /** Enable glass morphism effect */
  glass?: boolean;
  /** Glow color (only used when glow is true) */
  glowColor?: string;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Accessibility label */
  'aria-label'?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void;
}