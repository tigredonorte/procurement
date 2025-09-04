import React from 'react';

export interface CalendarProps {
  /**
   * The variant of the calendar
   */
  variant?: 'default' | 'range' | 'multi' | 'year';
  
  /**
   * The color theme of the calendar
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  
  /**
   * The size of the calendar
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Current selected date or dates
   */
  value?: Date | Date[] | null;
  
  /**
   * Called when date selection changes
   */
  onChange?: (value: Date | Date[] | null) => void;
  
  /**
   * Whether the calendar should have glass morphism effect
   */
  glass?: boolean;
  
  /**
   * Whether the calendar should have gradient effects
   */
  gradient?: boolean;
  
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
}