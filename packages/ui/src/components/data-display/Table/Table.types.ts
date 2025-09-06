import { TableProps as MuiTableProps } from '@mui/material';
import React from 'react';

// Advanced feature types
export type TableDensity = 'compact' | 'normal' | 'comfortable';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  minWidth?: number;
  priority?: number; // 1 = highest priority, higher numbers = lower priority
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, rowData: Record<string, unknown>) => React.ReactNode;
}

export interface VirtualScrollConfig {
  enabled: boolean;
  rowHeight: number;
  overscan?: number; // Number of items to render outside visible area
  estimatedRowHeight?: number;
}

export interface ResponsiveConfig {
  enabled: boolean;
  columnPriorities?: number[]; // Priority order for columns
  breakpoints?: {
    hideColumns?: {
      xs?: number[]; // Column indices to hide on extra small screens
      sm?: number[]; // Column indices to hide on small screens
      md?: number[]; // Column indices to hide on medium screens
    };
  };
}

export interface SelectionConfig {
  enabled: boolean;
  selectedRows: (string | number)[];
  onSelectionChange: (selectedRows: (string | number)[]) => void;
  selectAllEnabled?: boolean;
  rowKeyExtractor?: (rowData: Record<string, unknown>, index: number) => string | number;
}

export interface TableProps extends Omit<MuiTableProps, 'variant'> {
  /**
   * The variant of the table
   */
  variant?: 'default' | 'striped' | 'glass' | 'minimal' | 'gradient';
  
  /**
   * Whether the table should have a glow effect
   */
  glow?: boolean;
  
  /**
   * Whether the table should have a pulse animation
   */
  pulse?: boolean;
  
  /**
   * Whether table rows should be hoverable
   */
  hoverable?: boolean;
  
  /**
   * Whether the table is in loading state
   */
  loading?: boolean;
  
  /**
   * Handler for row click
   */
  onRowClick?: (event: React.MouseEvent<globalThis.HTMLTableRowElement>, rowData: Record<string, unknown>) => void;
  
  /**
   * Handler for row focus
   */
  onRowFocus?: (event: React.FocusEvent<globalThis.HTMLTableRowElement>, rowData: Record<string, unknown>) => void;
  
  /**
   * Handler for row blur
   */
  onRowBlur?: (event: React.FocusEvent<globalThis.HTMLTableRowElement>, rowData: Record<string, unknown>) => void;

  // Advanced Features
  
  /**
   * The density of the table rows
   */
  density?: TableDensity;
  
  /**
   * Whether the table header should be sticky during scroll
   */
  stickyHeader?: boolean;
  
  /**
   * Row selection configuration
   */
  selectable?: boolean;
  
  /**
   * Array of selected row keys
   */
  selectedRows?: (string | number)[];
  
  /**
   * Callback when row selection changes
   */
  onSelectionChange?: (selectedRows: (string | number)[]) => void;
  
  /**
   * Function to extract unique key from row data
   */
  rowKeyExtractor?: (rowData: Record<string, unknown>, index: number) => string | number;
  
  /**
   * Whether columns are sortable
   */
  sortable?: boolean;
  
  /**
   * Current sort configuration
   */
  sortConfig?: SortConfig;
  
  /**
   * Callback when sort changes
   */
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  
  /**
   * Column configuration for advanced features
   */
  columns?: ColumnConfig[];
  
  /**
   * Table data for advanced features
   */
  data?: Record<string, unknown>[];
  
  /**
   * Whether to enable virtual scrolling for large datasets
   */
  virtualScrolling?: boolean;
  
  /**
   * Height of each row for virtual scrolling (required if virtualScrolling is true)
   */
  rowHeight?: number;
  
  /**
   * Number of items to render outside visible area for virtual scrolling
   */
  overscan?: number;
  
  /**
   * Whether to enable responsive design features
   */
  responsive?: boolean;
  
  /**
   * Priority order for columns in responsive mode (1 = highest priority)
   */
  columnPriorities?: number[];
  
  /**
   * Custom breakpoints for responsive behavior
   */
  responsiveBreakpoints?: {
    xs?: number; // pixel width
    sm?: number;
    md?: number;
    lg?: number;
  };
  
  /**
   * Whether to show column toggle menu on mobile
   */
  showColumnToggle?: boolean;
  
  /**
   * Container height for virtual scrolling
   */
  containerHeight?: number | string;
  
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;
  
  /**
   * Custom empty state component
   */
  emptyStateComponent?: React.ReactNode;
  
  /**
   * Whether to enable keyboard navigation
   */
  keyboardNavigation?: boolean;
  
  /**
   * Custom row renderer for advanced use cases
   */
  renderRow?: (rowData: Record<string, unknown>, index: number, isSelected: boolean) => React.ReactNode;
  
  /**
   * Custom cell renderer
   */
  renderCell?: (value: unknown, column: ColumnConfig, rowData: Record<string, unknown>, rowIndex: number) => React.ReactNode;
  
  /**
   * Whether to enable row drag and drop
   */
  draggableRows?: boolean;
  
  /**
   * Callback when rows are reordered
   */
  onRowsReorder?: (fromIndex: number, toIndex: number) => void;
  
  /**
   * Fixed columns configuration
   */
  fixedColumns?: {
    left?: number; // Number of columns to fix on the left
    right?: number; // Number of columns to fix on the right
  };
  
  /**
   * Custom styling for different row states
   */
  rowStyleConfig?: {
    selected?: React.CSSProperties;
    hover?: React.CSSProperties;
    focused?: React.CSSProperties;
  };
}

// Export utility types
export type TableSortDirection = 'asc' | 'desc';
export type TableVariant = 'default' | 'striped' | 'glass' | 'minimal' | 'gradient';

// Component prop interfaces for internal use
export interface TableHeaderProps {
  columns: ColumnConfig[];
  sortable?: boolean;
  sortConfig?: SortConfig;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectAll?: (selected: boolean) => void;
  density?: TableDensity;
  stickyHeader?: boolean;
}

export interface TableBodyProps {
  data: Record<string, unknown>[];
  columns: ColumnConfig[];
  selectedRows?: (string | number)[];
  onRowClick?: (event: React.MouseEvent<globalThis.HTMLTableRowElement>, rowData: Record<string, unknown>) => void;
  onRowFocus?: (event: React.FocusEvent<globalThis.HTMLTableRowElement>, rowData: Record<string, unknown>) => void;
  onRowBlur?: (event: React.FocusEvent<globalThis.HTMLTableRowElement>, rowData: Record<string, unknown>) => void;
  onSelectionChange?: (rowKey: string | number, selected: boolean) => void;
  rowKeyExtractor?: (rowData: Record<string, unknown>, index: number) => string | number;
  density?: TableDensity;
  selectable?: boolean;
  hoverable?: boolean;
  renderRow?: (rowData: Record<string, unknown>, index: number, isSelected: boolean) => React.ReactNode;
  renderCell?: (value: unknown, column: ColumnConfig, rowData: Record<string, unknown>, rowIndex: number) => React.ReactNode;
  virtualScrolling?: boolean;
  containerHeight?: number;
  rowHeight?: number;
  overscan?: number;
}

export interface VirtualTableBodyProps extends TableBodyProps {
  virtualScrolling: true;
  containerHeight: number;
  rowHeight: number;
}

export interface ResponsiveTableProps {
  responsive: boolean;
  columnPriorities?: number[];
  responsiveBreakpoints?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  showColumnToggle?: boolean;
  columns: ColumnConfig[];
  onColumnVisibilityChange?: (columnIndex: number, visible: boolean) => void;
}