import { SliderProps as MuiSliderProps } from '@mui/material';

export interface SliderProps extends Omit<MuiSliderProps, 'color' | 'size'> {
  /**
   * The variant of the slider
   */
  variant?: 'default' | 'range' | 'marks' | 'gradient';
  
  /**
   * The color theme of the slider
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  
  /**
   * The size of the slider
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Label for the slider
   */
  label?: string;
  
  /**
   * Whether to show the current value
   */
  showValue?: boolean;
  
  /**
   * Whether the slider should have a glow effect
   */
  glow?: boolean;
  
  /**
   * Whether the slider should have glass morphism effect
   */
  glass?: boolean;
  
  /**
   * Whether the slider should have gradient effects
   */
  gradient?: boolean;
  
  /**
   * Custom thumb icon
   */
  thumbIcon?: React.ReactNode;
  
  /**
   * Whether to show marks
   */
  showMarks?: boolean;
  
  /**
   * Custom marks array
   */
  customMarks?: Array<{
    value: number;
    label?: string;
  }>;
  
  /**
   * Unit to display with the value
   */
  unit?: string;
  
  /**
   * Format function for the value display
   */
  formatValue?: (value: number) => string;
}