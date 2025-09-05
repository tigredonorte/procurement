import { CheckboxProps as MuiCheckboxProps } from '@mui/material';

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
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}