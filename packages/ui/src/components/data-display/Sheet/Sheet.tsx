import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Backdrop,
  SwipeableDrawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import {
  SheetProps,
  SheetHeaderProps,
  SheetContentProps,
  SheetFooterProps,
  SheetOverlayProps,
} from './Sheet.types';

export const Sheet: React.FC<SheetProps> = ({
  open = false,
  onOpenChange,
  children,
  title,
  description,
  position = 'bottom',
  variant = 'default',
  size = 'md',
  color = 'primary',
  glow = false,
  pulse = false,
  glass = false,
  gradient = false,
  ripple = false,
  loading = false,
  disabled = false,
  className,
  style,
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  showHandle = true,
  swipeable = true,
  snapPoints,
  defaultSnapPoint,
  onClick,
  onFocus,
  onBlur,
  onClose,
  onOpen,
  footer,
  header,
  persistent = false,
  fullHeight = false,
  rounded = true,
  elevation = 16,
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(open);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(open);
    if (open) {
      onOpen?.();
    }
  }, [open, onOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape]);

  const handleClose = useCallback(() => {
    if (!persistent && !disabled) {
      setIsOpen(false);
      onOpenChange?.(false);
      onClose?.();
    }
  }, [persistent, disabled, onOpenChange, onClose]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick && !persistent) {
      handleClose();
    }
  }, [closeOnOverlayClick, persistent, handleClose]);

  const getSizeStyles = () => {
    const isHorizontal = position === 'left' || position === 'right';
    
    switch (size) {
      case 'xs':
        return isHorizontal ? { width: 240 } : { height: 200 };
      case 'sm':
        return isHorizontal ? { width: 320 } : { height: 300 };
      case 'md':
        return isHorizontal ? { width: 400 } : { height: 400 };
      case 'lg':
        return isHorizontal ? { width: 560 } : { height: 500 };
      case 'xl':
        return isHorizontal ? { width: 720 } : { height: 600 };
      case 'full':
        return isHorizontal ? { width: '100%' } : { height: '100%' };
      default:
        return isHorizontal ? { width: 400 } : { height: 400 };
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {
      backgroundColor: theme.palette.background.paper,
      transition: theme.transitions.create(['all'], {
        duration: theme.transitions.duration.standard,
      }),
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' as const : 'auto' as const,
    };

    const glowStyles = glow ? {
      boxShadow: `0 0 30px ${alpha(theme.palette[color].main, 0.4)}`,
    } : {};

    const pulseStyles = pulse ? {
      animation: 'pulse 2s infinite',
      '@keyframes pulse': {
        '0%': { boxShadow: `0 0 0 0 ${alpha(theme.palette[color].main, 0.4)}` },
        '70%': { boxShadow: `0 0 0 20px ${alpha(theme.palette[color].main, 0)}` },
        '100%': { boxShadow: `0 0 0 0 ${alpha(theme.palette[color].main, 0)}` },
      },
    } : {};

    const roundedStyles = rounded && (position === 'top' || position === 'bottom') ? {
      borderRadius: position === 'top' 
        ? `0 0 ${theme.spacing(2)} ${theme.spacing(2)}`
        : `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
    } : rounded && (position === 'left' || position === 'right') ? {
      borderRadius: position === 'left'
        ? `0 ${theme.spacing(2)} ${theme.spacing(2)} 0`
        : `${theme.spacing(2)} 0 0 ${theme.spacing(2)}`,
    } : {};

    switch (variant) {
      case 'glass':
        return {
          ...baseStyles,
          ...glowStyles,
          ...pulseStyles,
          ...roundedStyles,
          backgroundColor: alpha(theme.palette.background.paper, glass ? 0.8 : 0.95),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        };

      case 'gradient':
        return {
          ...baseStyles,
          ...glowStyles,
          ...pulseStyles,
          ...roundedStyles,
          background: gradient
            ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette[color].main, 0.05)})`
            : theme.palette.background.paper,
        };

      case 'elevated':
        return {
          ...baseStyles,
          ...glowStyles,
          ...pulseStyles,
          ...roundedStyles,
          boxShadow: theme.shadows[elevation],
        };

      case 'minimal':
        return {
          ...baseStyles,
          ...glowStyles,
          ...pulseStyles,
          ...roundedStyles,
          boxShadow: 'none',
          border: 'none',
        };

      default:
        return {
          ...baseStyles,
          ...glowStyles,
          ...pulseStyles,
          ...roundedStyles,
        };
    }
  };

  const DrawerComponent = swipeable ? SwipeableDrawer : Drawer;

  return (
    <>
      {showOverlay && isOpen && (
        <SheetOverlay
          open={isOpen}
          onClick={handleOverlayClick}
          blur={variant === 'glass'}
        />
      )}
      
      <DrawerComponent
        {...(swipeable ? { 
          onOpen: () => {
            setIsOpen(true);
            onOpenChange?.(true);
            onOpen?.();
          },
          disableSwipeToOpen: false,
          swipeAreaWidth: 20,
        } : {})}
        anchor={position}
        open={isOpen}
        onClose={handleClose}
        className={className}
        PaperProps={{
          sx: {
            ...getSizeStyles(),
            ...getVariantStyles(),
            ...style,
            overflow: 'visible',
            ...(fullHeight && {
              height: position === 'left' || position === 'right' ? '100%' : 'auto',
              width: position === 'top' || position === 'bottom' ? '100%' : 'auto',
            }),
          },
        }}
        ModalProps={{
          keepMounted: true,
          BackdropComponent: () => null,
        }}
      >
        <Box
          ref={sheetRef}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {(showHandle || title || description || showCloseButton || header) && (
            <SheetHeader
              title={title}
              description={description}
              showCloseButton={showCloseButton}
              onClose={handleClose}
              showHandle={showHandle && (position === 'bottom' || position === 'top')}
            >
              {header}
            </SheetHeader>
          )}
          
          <SheetContent padded>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 200,
                }}
              >
                <CircularProgress color={color} />
              </Box>
            ) : (
              children
            )}
          </SheetContent>
          
          {footer && (
            <SheetFooter sticky divider>
              {footer}
            </SheetFooter>
          )}
        </Box>
      </DrawerComponent>
    </>
  );
};

export const SheetHeader: React.FC<SheetHeaderProps> = ({
  title,
  description,
  showCloseButton,
  onClose,
  showHandle,
  className,
  style,
  children,
}) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        p: 2,
        pb: showHandle ? 1 : 2,
        ...style,
      }}
    >
      {showHandle && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <DragHandleIcon
            sx={{
              color: theme.palette.text.disabled,
              width: 32,
              height: 4,
              borderRadius: 2,
            }}
          />
        </Box>
      )}
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
          {children}
        </Box>
        
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ ml: 1, mt: -0.5 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export const SheetContent: React.FC<SheetContentProps> = ({
  children,
  className,
  style,
  padded = true,
}) => {
  return (
    <Box
      className={className}
      sx={{
        flex: 1,
        overflow: 'auto',
        p: padded ? 2 : 0,
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

export const SheetFooter: React.FC<SheetFooterProps> = ({
  children,
  className,
  style,
  sticky = false,
  divider = false,
}) => {
  return (
    <>
      {divider && <Divider />}
      <Box
        className={className}
        sx={{
          p: 2,
          position: sticky ? 'sticky' : 'relative',
          bottom: sticky ? 0 : 'auto',
          backgroundColor: 'background.paper',
          borderTop: sticky ? '1px solid' : 'none',
          borderColor: 'divider',
          ...style,
        }}
      >
        {children}
      </Box>
    </>
  );
};

export const SheetOverlay: React.FC<SheetOverlayProps> = ({
  open = false,
  onClick,
  className,
  style,
  blur = false,
}) => {
  const theme = useTheme();

  return (
    <Backdrop
      open={open}
      onClick={onClick}
      className={className}
      sx={{
        zIndex: theme.zIndex.drawer - 1,
        backgroundColor: alpha(theme.palette.common.black, 0.5),
        backdropFilter: blur ? 'blur(4px)' : 'none',
        ...style,
      }}
    />
  );
};