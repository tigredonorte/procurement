import { CardProps as MuiCardProps } from '@mui/material';
import { ReactNode } from 'react';

export type CardVariant = 'elevated' | 'outlined' | 'glass' | 'gradient' | 'neumorphic';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  children: ReactNode;
  variant?: CardVariant;
  interactive?: boolean;
  glow?: boolean;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface CardHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  avatar?: ReactNode;
  children?: ReactNode;
}

export interface CardContentProps {
  children: ReactNode;
  dense?: boolean;
}

export interface CardActionsProps {
  children: ReactNode;
  disableSpacing?: boolean;
  alignment?: 'left' | 'center' | 'right' | 'space-between';
}

export interface CardMediaProps {
  component?: React.ElementType;
  image?: string;
  title?: string;
  height?: number | string;
  children?: ReactNode;
}