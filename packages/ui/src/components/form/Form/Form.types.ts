import { FormHTMLAttributes } from 'react';

export type FormVariant = 'vertical' | 'horizontal' | 'inline' | 'stepped';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  variant?: FormVariant;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export interface FormLabelProps {
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}

export interface FormControlProps {
  error?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export interface FormMessageProps {
  error?: boolean;
  children: React.ReactNode;
}