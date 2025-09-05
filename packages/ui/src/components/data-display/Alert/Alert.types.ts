import { AlertProps as MuiAlertProps } from '@mui/material';
import React from 'react';

export interface AlertProps extends Omit<MuiAlertProps, 'variant' | 'color'> {
  /**
   * The variant of the alert
   */
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'glass' | 'gradient';
  
  /**
   * The color of the alert (when not using variant-specific colors)
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  
  /**
   * Whether the alert should have a glow effect
   */
  glow?: boolean;
  
  /**
   * Whether the alert should have a pulse animation
   */
  pulse?: boolean;
  
  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;
  
  /**
   * Whether to show the default severity icon
   */
  showIcon?: boolean;
  
  /**
   * Whether the alert can be closed
   */
  closable?: boolean;
  
  /**
   * Callback when alert is closed
   */
  onClose?: () => void;
  
  /**
   * Title for the alert
   */
  title?: string;
  
  /**
   * Description text
   */
  description?: string;
}