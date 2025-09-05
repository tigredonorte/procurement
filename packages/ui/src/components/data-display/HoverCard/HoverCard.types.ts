import { PopoverProps as MuiPopoverProps } from '@mui/material';
import React from 'react';

export interface HoverCardProps extends Omit<MuiPopoverProps, 'variant' | 'open' | 'anchorEl'> {
  /**
   * The variant of the hover card
   */
  variant?: 'default' | 'glass' | 'detailed';
  
  /**
   * Whether the card should have a glow effect
   */
  glow?: boolean;
  
  /**
   * Whether the card should have a pulse animation
   */
  pulse?: boolean;
  
  /**
   * Title of the hover card
   */
  title?: string;
  
  /**
   * Description text
   */
  description?: string;
  
  /**
   * Avatar/image source
   */
  avatar?: string;
  
  /**
   * Custom trigger element
   */
  trigger?: React.ReactElement;
  
  /**
   * Delay before showing hover card (ms)
   */
  enterDelay?: number;
  
  /**
   * Delay before hiding hover card (ms)
   */
  exitDelay?: number;
  
  /**
   * Maximum width of the card
   */
  maxWidth?: number;
}