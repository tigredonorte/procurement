import { ModalProps as MuiModalProps } from '@mui/material';
import { ReactNode } from 'react';

export type ModalVariant = 'center' | 'top' | 'bottom' | 'glass';
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps extends Omit<MuiModalProps, 'children'> {
  children: ReactNode;
  variant?: ModalVariant;
  size?: ModalSize;
  backdrop?: boolean;
  persistent?: boolean;
  glass?: boolean;
  gradient?: boolean;
  glow?: boolean;
  pulse?: boolean;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
}

export interface ModalContentProps {
  children: ReactNode;
  padding?: number | string;
}