import { ToggleButtonProps } from '@mui/material';
import React from 'react';

export interface ToggleProps extends Omit<ToggleButtonProps, 'color' | 'size'> {
  /**
   * The variant of the toggle
   */
  variant?: 'default' | 'outline' | 'soft';
  
  /**
   * The color theme of the toggle
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  
  /**
   * The size of the toggle
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Icon for the toggle
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the toggle should have a glow effect
   */
  glow?: boolean;
  
  /**
   * Whether the toggle should have glass morphism effect
   */
  glass?: boolean;
  
  /**
   * Whether the toggle should have gradient effects
   */
  gradient?: boolean;
}