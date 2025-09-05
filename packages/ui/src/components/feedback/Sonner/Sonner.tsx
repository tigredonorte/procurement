import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Slide,
  Collapse,
  useTheme,
  alpha,
  Portal,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CircularProgress,
} from '@mui/icons-material';
import {
  SonnerProps,
  SonnerToasterProps,
  SonnerContextType,
} from './Sonner.types';

const SonnerContext = createContext<SonnerContextType | null>(null);

interface SonnerItem extends SonnerProps {
  id: string;
  createdAt: number;
  visible: boolean;
}

export const SonnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<SonnerItem[]>([]);
  const toastCounter = useRef(0);

  const addToast = useCallback((toast: Omit<SonnerProps, 'id'>, type?: SonnerProps['type']): string => {
    const id = `sonner-${++toastCounter.current}`;
    const newToast: SonnerItem = {
      ...toast,
      id,
      type: type || toast.type || 'default',
      createdAt: Date.now(),
      visible: true,
    };

    setToasts(prev => [...prev, newToast]);

    if (!toast.persistent && toast.duration !== 0) {
      const duration = toast.duration ?? 4000;
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }, []);

  const toast = useCallback((message: React.ReactNode, options?: Partial<SonnerProps>) => {
    return addToast({ ...options, title: message }, 'default');
  }, [addToast]);

  const success = useCallback((message: React.ReactNode, options?: Partial<SonnerProps>) => {
    return addToast({ ...options, title: message }, 'success');
  }, [addToast]);

  const error = useCallback((message: React.ReactNode, options?: Partial<SonnerProps>) => {
    return addToast({ ...options, title: message }, 'error');
  }, [addToast]);

  const warning = useCallback((message: React.ReactNode, options?: Partial<SonnerProps>) => {
    return addToast({ ...options, title: message }, 'warning');
  }, [addToast]);

  const info = useCallback((message: React.ReactNode, options?: Partial<SonnerProps>) => {
    return addToast({ ...options, title: message }, 'info');
  }, [addToast]);

  const loading = useCallback((message: React.ReactNode, options?: Partial<SonnerProps>) => {
    return addToast({ ...options, title: message, persistent: true }, 'loading');
  }, [addToast]);

  const dismiss = useCallback((id?: string) => {
    if (id) {
      setToasts(prev => prev.map(toast => 
        toast.id === id ? { ...toast, visible: false } : toast
      ));
      
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 300);
    } else {
      setToasts(prev => prev.map(toast => ({ ...toast, visible: false })));
      
      setTimeout(() => {
        setToasts([]);
      }, 300);
    }
  }, []);

  const promise = useCallback(async <T,>(
    promiseToResolve: Promise<T>,
    options: {
      loading: React.ReactNode;
      success: React.ReactNode | ((data: T) => React.ReactNode);
      error: React.ReactNode | ((error: any) => React.ReactNode);
    }
  ): Promise<T> => {
    const toastId = loading(options.loading);

    try {
      const data = await promiseToResolve;
      dismiss(toastId);
      
      const successMessage = typeof options.success === 'function' 
        ? options.success(data) 
        : options.success;
      
      success(successMessage);
      return data;
    } catch (err) {
      dismiss(toastId);
      
      const errorMessage = typeof options.error === 'function' 
        ? options.error(err) 
        : options.error;
      
      error(errorMessage);
      throw err;
    }
  }, [loading, success, error, dismiss]);

  const contextValue: SonnerContextType = {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    promise,
  };

  return (
    <SonnerContext.Provider value={contextValue}>
      {children}
      <SonnerToaster toasts={toasts} onDismiss={dismiss} />
    </SonnerContext.Provider>
  );
};

export const useSonner = (): SonnerContextType => {
  const context = useContext(SonnerContext);
  if (!context) {
    throw new Error('useSonner must be used within a SonnerProvider');
  }
  return context;
};

const SonnerToast: React.FC<SonnerItem & { onDismiss: (id: string) => void }> = ({
  id,
  title,
  description,
  type = 'default',
  variant = 'default',
  closable = true,
  action,
  cancel,
  icon,
  important = false,
  visible,
  onDismiss,
}) => {
  const theme = useTheme();

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ fontSize: 20, color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 20, color: 'error.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 20, color: 'warning.main' }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 20, color: 'info.main' }} />;
      case 'loading':
        return <CircularProgress size={16} />;
      default:
        return null;
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: theme.spacing(1.5),
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[4],
      transition: theme.transitions.create([
        'all',
        'transform',
        'opacity',
      ], {
        duration: theme.transitions.duration.short,
      }),
      transform: visible ? 'scale(1)' : 'scale(0.95)',
      opacity: visible ? 1 : 0,
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyles,
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
        };

      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.background.default,
          border: 'none',
          boxShadow: 'none',
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          borderRadius: 0,
        };

      default:
        return baseStyles;
    }
  };

  const handleDismiss = () => {
    onDismiss(id);
  };

  return (
    <Collapse in={visible} timeout={200}>
      <Box
        sx={{
          ...getVariantStyles(),
          p: 2,
          mb: 1,
          minWidth: 356,
          maxWidth: 400,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
        }}
      >
        {getIcon()}
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {title && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: important ? 600 : 500,
                color: 'text.primary',
                mb: description ? 0.5 : 0,
              }}
            >
              {title}
            </Typography>
          )}
          
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              {description}
            </Typography>
          )}
          
          {(action || cancel) && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              {action && (
                <Button
                  size="small"
                  onClick={action.onClick}
                  variant="contained"
                  sx={{ fontSize: '0.75rem', py: 0.5, px: 1.5 }}
                >
                  {action.label}
                </Button>
              )}
              {cancel && (
                <Button
                  size="small"
                  onClick={cancel.onClick}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', py: 0.5, px: 1.5 }}
                >
                  {cancel.label}
                </Button>
              )}
            </Box>
          )}
        </Box>
        
        {closable && (
          <IconButton
            size="small"
            onClick={handleDismiss}
            sx={{
              ml: 'auto',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Collapse>
  );
};

const SonnerToaster: React.FC<{
  toasts: SonnerItem[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <Box key={toast.id} sx={{ pointerEvents: 'auto' }}>
            <SonnerToast {...toast} onDismiss={onDismiss} />
          </Box>
        ))}
      </Box>
    </Portal>
  );
};