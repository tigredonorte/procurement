import { CheckboxProps as MuiCheckboxProps } from '@mui/material';

export type CheckboxVariant = 'default' | 'rounded' | 'toggle';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'variant'> {
  variant?: CheckboxVariant;
  label?: string;
  error?: boolean;
  helperText?: string;
}