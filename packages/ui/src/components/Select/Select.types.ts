import { SelectProps as MuiSelectProps } from '@mui/material';
import { ReactNode } from 'react';

export type SelectVariant = 'default' | 'searchable' | 'multi' | 'creatable';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  variant?: SelectVariant;
  options: SelectOption[];
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  placeholder?: string;
}