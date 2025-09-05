import { ReactNode } from 'react';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'promise';
export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export interface ToastProps {
  id?: string;
  message: ReactNode;
  variant?: ToastVariant;
  duration?: number;
  persistent?: boolean;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  promise?: {
    loading: string;
    success: string | ((data: any) => string);
    error: string | ((error: any) => string);
  };
  glass?: boolean;
  onClose?: (id: string) => void;
}

export interface ToastContainerProps {
  position?: ToastPosition;
  maxToasts?: number;
  gap?: number;
  className?: string;
}

export interface ToastContextType {
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => Promise<T>;
}