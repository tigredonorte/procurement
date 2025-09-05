import { InputHTMLAttributes, ReactNode } from 'react';

export type InputVariant = 'outlined' | 'filled' | 'glass' | 'underline';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: boolean;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  fullWidth?: boolean;
  floating?: boolean;
}