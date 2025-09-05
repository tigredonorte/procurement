import { ReactNode } from 'react';

export type StackedModalVariant = 'fullscreen' | 'slide' | 'wizard';
export type StackedModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface StackedModalProps {
  children: ReactNode;
  open: boolean;
  variant?: StackedModalVariant;
  size?: StackedModalSize;
  title?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  backdrop?: boolean;
  persistent?: boolean;
  glass?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  zIndex?: number;
}

export interface StackedModalStackProps {
  children: ReactNode;
  maxStack?: number;
}

export interface StackedModalStepProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  showProgress?: boolean;
}