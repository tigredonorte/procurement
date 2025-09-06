import { CheckboxProps as MuiCheckboxProps } from '@mui/material';
import { ChangeEvent, MouseEventHandler, FocusEventHandler } from 'react';

export type CheckboxVariant = 'default' | 'rounded' | 'toggle';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'variant'> {
  variant?: CheckboxVariant;
  label?: string;
  error?: boolean;
  helperText?: string;
  loading?: boolean;
  ripple?: boolean;
  glow?: boolean;
  pulse?: boolean;
  'data-testid'?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}