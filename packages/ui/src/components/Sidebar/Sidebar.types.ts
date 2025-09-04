import { ReactNode } from 'react';

export type SidebarVariant = 'fixed' | 'collapsible' | 'floating' | 'glass';

export interface SidebarProps {
  children: ReactNode;
  variant?: SidebarVariant;
  open?: boolean;
  onToggle?: () => void;
  width?: number;
  collapsedWidth?: number;
  position?: 'left' | 'right';
  className?: string;
}

export interface SidebarHeaderProps {
  children: ReactNode;
  collapsed?: boolean;
}

export interface SidebarContentProps {
  children: ReactNode;
  collapsed?: boolean;
}

export interface SidebarFooterProps {
  children: ReactNode;
  collapsed?: boolean;
}