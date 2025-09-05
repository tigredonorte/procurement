import { TableProps as MuiTableProps } from '@mui/material';
import React from 'react';

export interface TableProps extends Omit<MuiTableProps, 'variant'> {
  /**
   * The variant of the table
   */
  variant?: 'default' | 'striped' | 'glass' | 'minimal';
  
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
}