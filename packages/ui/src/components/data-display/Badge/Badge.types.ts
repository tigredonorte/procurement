import { BadgeProps as MuiBadgeProps } from '@mui/material';
import React from 'react';

export type BadgeVariant = 'default' | 'dot' | 'count' | 'gradient' | 'glass';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends Omit<MuiBadgeProps, 'variant' | 'color' | 'content'> {
  /**
   * The variant of the badge
   */
  variant?: BadgeVariant;
  
  /**
   * The size of the badge
   */
  size?: BadgeSize;
  
  /**
   * The color of the badge
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  
  /**
   * Whether the badge should have a glow effect
   */
  glow?: boolean;
  
  /**
   * Whether the badge should have a pulse animation
   */
  pulse?: boolean;
  
  /**
   * Maximum count to display (shows "max+" when exceeded)
   */
  max?: number;
  
  /**
   * Whether to show zero count
   */
  showZero?: boolean;
  
  /**
   * Custom content for the badge
   */
  content?: React.ReactNode;
  
  /**
   * Position of the badge
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}