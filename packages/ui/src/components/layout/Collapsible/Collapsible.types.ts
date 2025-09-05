import { ReactNode, CSSProperties } from 'react';

export type CollapsibleVariant = 'default' | 'smooth' | 'spring';

export interface CollapsibleProps {
  children: ReactNode;
  open: boolean;
  variant?: CollapsibleVariant;
  duration?: number;
  easing?: string;
  onToggle?: (open: boolean) => void;
  disabled?: boolean;
  keepMounted?: boolean;
  sx?: CSSProperties;
  className?: string;
}

export interface CollapsibleTriggerProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  expanded?: boolean;
  className?: string;
}

export interface CollapsibleContentProps {
  children: ReactNode;
  className?: string;
}