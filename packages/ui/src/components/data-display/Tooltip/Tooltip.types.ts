import { TooltipProps as MuiTooltipProps } from '@mui/material';

export interface TooltipProps extends Omit<MuiTooltipProps, 'variant'> {
  /**
   * The variant of the tooltip
   */
  variant?: 'default' | 'dark' | 'light' | 'glass';
  
  /**
   * Whether the tooltip should have a glow effect
   */
  glow?: boolean;
  
  /**
   * Whether the tooltip should have a pulse animation
   */
  pulse?: boolean;
  
  /**
   * Size of the tooltip
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Maximum width of the tooltip
   */
  maxWidth?: number;
}