import { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material';
import { ReactNode } from 'react';

export interface BreadcrumbItem {
  /**
   * The label to display for the breadcrumb
   */
  label: string;
  
  /**
   * The href for the breadcrumb link
   */
  href?: string;
  
  /**
   * Icon to display before the label
   */
  icon?: ReactNode;
  
  /**
   * Whether this is the current/active breadcrumb
   */
  active?: boolean;
  
  /**
   * Click handler for the breadcrumb
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => void;
}

export interface BreadcrumbsProps extends Omit<MuiBreadcrumbsProps, 'separator'> {
  /**
   * The variant of the breadcrumbs separator
   */
  variant?: 'default' | 'slash' | 'arrow' | 'chevron';
  
  /**
   * Array of breadcrumb items
   */
  items: BreadcrumbItem[];
  
  /**
   * Custom separator element (overrides variant)
   */
  separator?: ReactNode;
  
  /**
   * Maximum number of items to display before collapsing
   */
  maxItems?: number;
  
  /**
   * Whether to show home icon for first item
   */
  showHomeIcon?: boolean;
  
  /**
   * Size of the breadcrumbs
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color scheme
   */
  color?: 'default' | 'primary' | 'secondary';
}