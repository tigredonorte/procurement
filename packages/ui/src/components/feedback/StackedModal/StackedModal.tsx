import React, { createContext, useContext, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  LinearProgress,
  Slide,
  useTheme,
  alpha,
  Backdrop,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  StackedModalProps,
  StackedModalStackProps,
  StackedModalStepProps,
} from './StackedModal.types';

interface StackedModalContextType {
  stackCount: number;
  addToStack: () => void;
  removeFromStack: () => void;
}

const StackedModalContext = createContext<StackedModalContextType>({
  stackCount: 0,
  addToStack: () => {},
  removeFromStack: () => {},
});

export const StackedModalStack: React.FC<StackedModalStackProps> = ({
  children,
  maxStack = 5,
}) => {
  const [stackCount, setStackCount] = useState(0);

  const addToStack = () => {
    if (stackCount < maxStack) {
      setStackCount(prev => prev + 1);
    }
  };

  const removeFromStack = () => {
    setStackCount(prev => Math.max(0, prev - 1));
  };

  return (
    <StackedModalContext.Provider value={{ stackCount, addToStack, removeFromStack }}>
      {children}
    </StackedModalContext.Provider>
  );
};

export const StackedModal: React.FC<StackedModalProps> = ({
  children,
  open,
  variant = 'slide',
  size = 'md',
  title,
  showBackButton = true,
  showCloseButton = true,
  backdrop = true,
  persistent = false,
  glass = false,
  onClose,
  onBack,
  zIndex = 1300,
}) => {
  const theme = useTheme();
  const { stackCount, addToStack, removeFromStack } = useContext(StackedModalContext);

  React.useEffect(() => {
    if (open) {
      addToStack();
    } else {
      removeFromStack();
    }
    
    return () => {
      if (open) {
        removeFromStack();
      }
    };
  }, [open]);

  const getSize = () => {
    switch (size) {
      case 'sm': return { maxWidth: 'sm' as const, fullWidth: true };
      case 'md': return { maxWidth: 'md' as const, fullWidth: true };
      case 'lg': return { maxWidth: 'lg' as const, fullWidth: true };
      case 'xl': return { maxWidth: 'xl' as const, fullWidth: true };
      default: return { maxWidth: 'md' as const, fullWidth: true };
    }
  };

  const getVariantStyles = () => {
    const stackOffset = stackCount * 8;
    
    const baseStyles = {
      transform: `translateX(${stackOffset}px) scale(${1 - stackCount * 0.02})`,
      transition: theme.transitions.create(['transform', 'box-shadow'], {
        duration: theme.transitions.duration.standard,
      }),
    };

    switch (variant) {
      case 'fullscreen':
        return {
          ...baseStyles,
          margin: 0,
          maxWidth: 'none',
          maxHeight: 'none',
          height: '100vh',
          borderRadius: 0,
        };

      case 'slide':
        return {
          ...baseStyles,
          backgroundColor: glass 
            ? alpha(theme.palette.background.paper, 0.1)
            : theme.palette.background.paper,
          backdropFilter: glass ? 'blur(20px)' : 'none',
          border: glass 
            ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            : 'none',
          boxShadow: `0 ${4 + stackCount * 2}px ${16 + stackCount * 4}px ${alpha(theme.palette.common.black, 0.1 + stackCount * 0.05)}`,
        };

      case 'wizard':
        return {
          ...baseStyles,
          minHeight: '60vh',
          backgroundColor: glass 
            ? alpha(theme.palette.background.paper, 0.1)
            : theme.palette.background.paper,
          backdropFilter: glass ? 'blur(20px)' : 'none',
        };

      default:
        return baseStyles;
    }
  };

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (persistent && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return;
    }
    onClose?.();
  };

  const renderHeader = () => {
    if (variant === 'fullscreen') {
      return (
        <AppBar position="static" elevation={0}>
          <Toolbar>
            {showBackButton && onBack && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={onBack}
                aria-label="back"
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {showCloseButton && onClose && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      );
    }

    if (title) {
      return (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showBackButton && onBack && (
              <IconButton size="small" onClick={onBack} aria-label="back">
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6">{title}</Typography>
          </Box>
          {showCloseButton && onClose && (
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="close"
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      );
    }

    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={variant === 'fullscreen'}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      BackdropComponent={backdrop ? Backdrop : undefined}
      BackdropProps={{
        sx: {
          backgroundColor: glass 
            ? alpha(theme.palette.common.black, 0.2)
            : alpha(theme.palette.common.black, 0.5),
          backdropFilter: glass ? 'blur(8px)' : 'none',
        },
      }}
      PaperProps={{
        sx: getVariantStyles(),
      }}
      sx={{
        zIndex: zIndex + stackCount,
      }}
      {...getSize()}
    >
      {renderHeader()}
      <DialogContent sx={{ p: variant === 'fullscreen' ? 2 : 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export const StackedModalStep: React.FC<StackedModalStepProps> = ({
  children,
  title,
  subtitle,
  stepNumber,
  totalSteps,
  showProgress = true,
}) => {
  const progress = stepNumber && totalSteps ? (stepNumber / totalSteps) * 100 : 0;

  return (
    <Box>
      {showProgress && stepNumber && totalSteps && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Step {stepNumber} of {totalSteps}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              },
            }}
          />
        </Box>
      )}
      
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      
      {subtitle && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {subtitle}
        </Typography>
      )}
      
      {children}
    </Box>
  );
};