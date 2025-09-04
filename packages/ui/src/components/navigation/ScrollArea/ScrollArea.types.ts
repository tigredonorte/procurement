import { ReactNode, HTMLAttributes } from 'react';

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * The scrollbar display behavior
   */
  variant?: 'auto' | 'always' | 'hover' | 'hidden';
  
  /**
   * Maximum height of the scroll area
   */
  maxHeight?: number | string;
  
  /**
   * Maximum width of the scroll area
   */
  maxWidth?: number | string;
  
  /**
   * Width of the scroll area
   */
  width?: number | string;
  
  /**
   * Height of the scroll area
   */
  height?: number | string;
  
  /**
   * Content to be scrolled
   */
  children: ReactNode;
  
  /**
   * Whether scrollbars should use glassmorphism effect
   */
  glassmorphism?: boolean;
  
  /**
   * Scrollbar color theme
   */
  scrollbarColor?: 'primary' | 'secondary' | 'dark' | 'light' | 'custom';
  
  /**
   * Custom scrollbar color (when scrollbarColor is 'custom')
   */
  customScrollbarColor?: string;
  
  /**
   * Scrollbar width/thickness
   */
  scrollbarSize?: 'thin' | 'medium' | 'thick';
  
  /**
   * Whether to show shadow indicators for scrollable content
   */
  showShadows?: boolean;
  
  /**
   * Corner radius for the scrollbar
   */
  scrollbarRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  
  /**
   * Callback when scroll position changes
   */
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  
  /**
   * Callback when reaching scroll boundaries
   */
  onScrollEnd?: (direction: 'top' | 'bottom' | 'left' | 'right') => void;
  
  /**
   * Whether to enable smooth scrolling
   */
  smoothScrolling?: boolean;
  
  /**
   * Direction of scrolling
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  
  /**
   * Whether to hide native scrollbars completely
   */
  hideNativeScrollbars?: boolean;
  
  /**
   * Custom class name for styling
   */
  className?: string;
  
  /**
   * Whether the scroll area is disabled
   */
  disabled?: boolean;
  
  /**
   * Padding inside the scroll container
   */
  innerPadding?: number | string;
  
  /**
   * Whether to show scroll position indicator
   */
  showScrollIndicator?: boolean;
  
  /**
   * Fade edges when content overflows
   */
  fadeEdges?: boolean;
}