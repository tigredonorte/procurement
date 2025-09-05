import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  Backdrop,
  SwipeableDrawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {
  SheetProps,
  SheetHeaderProps,
  SheetContentProps,
  SheetFooterProps,
  SheetOverlayProps,
} from './Sheet.types';

// Spring physics configuration for smooth animations
const SPRING_CONFIG = {
  tension: 200,
  friction: 25,
  velocity: 0,
};

// Velocity threshold for snap detection (pixels per millisecond)
const DEFAULT_VELOCITY_THRESHOLD = 0.5;

// Drag resistance factor at boundaries
const DEFAULT_DRAG_RESISTANCE = 0.3;

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
  snapPoints = [0.25, 0.5, 0.75, 1],
  defaultSnapPoint = 0.5,
  onSnapPointChange,
  minSnapPoint = 0,
  maxSnapPoint = 1,
  velocityThreshold = DEFAULT_VELOCITY_THRESHOLD,
  dragResistance = DEFAULT_DRAG_RESISTANCE,
  animationConfig = SPRING_CONFIG,
  onClick,
  onFocus,
  onBlur,
  onClose,
  onOpen,
  onDragStart,
  onDragEnd,
  footer,
  header,
  persistent = false,
  fullHeight = false,
  rounded = true,
  elevation = 16,
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(open);
  const [currentSnapPoint, setCurrentSnapPoint] = useState(defaultSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const velocityRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);

  const isDraggableVariant = variant === 'draggable';
  const isBottomSheet = position === 'bottom';
  const isTopSheet = position === 'top';
  const isVerticalSheet = isBottomSheet || isTopSheet;

  // Sort snap points for easier navigation
  const sortedSnapPoints = useMemo(() => {
    const points = [...snapPoints].sort((a, b) => a - b);
    // Ensure snap points are within bounds
    return points.filter(point => point >= minSnapPoint && point <= maxSnapPoint);
  }, [snapPoints, minSnapPoint, maxSnapPoint]);

  useEffect(() => {
    setIsOpen(open);
    if (open) {
      onOpen?.();
      if (isDraggableVariant && isVerticalSheet) {
        // Initialize at default snap point
        setCurrentSnapPoint(defaultSnapPoint);
        updateSheetHeight(defaultSnapPoint);
      }
    }
  }, [open, onOpen, isDraggableVariant, isVerticalSheet, defaultSnapPoint]);

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

  const updateSheetHeight = useCallback((snapPoint: number) => {
    if (!sheetRef.current || !isVerticalSheet) return;
    
    const viewportHeight = window.innerHeight;
    const height = Math.round(viewportHeight * snapPoint);
    
    if (isBottomSheet) {
      sheetRef.current.style.height = `${height}px`;
      sheetRef.current.style.transform = 'translateY(0)';
    } else if (isTopSheet) {
      sheetRef.current.style.height = `${height}px`;
    }
    
    setCurrentHeight(height);
  }, [isBottomSheet, isTopSheet, isVerticalSheet]);

  const animateToSnapPoint = useCallback((targetSnapPoint: number, velocity = 0) => {
    if (!sheetRef.current || !isVerticalSheet) return;
    
    setIsAnimating(true);
    const startSnapPoint = currentSnapPoint;
    const distance = targetSnapPoint - startSnapPoint;
    const startTime = performance.now();
    
    // Spring animation parameters
    const { tension, friction } = { ...SPRING_CONFIG, ...animationConfig };
    const springLength = 0;
    let currentVelocity = velocity * 1000; // Convert to pixels per second
    
    const animate = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000; // Convert to seconds
      
      // Spring physics calculations
      const springForce = -tension * (startSnapPoint - targetSnapPoint + springLength);
      const dampingForce = -friction * currentVelocity;
      const acceleration = springForce + dampingForce;
      
      currentVelocity += acceleration * 0.016; // 60fps timestep
      const progress = Math.min(1, elapsed * 4); // Smooth easing
      
      const currentPosition = startSnapPoint + (distance * progress);
      
      updateSheetHeight(currentPosition);
      
      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setCurrentSnapPoint(targetSnapPoint);
        onSnapPointChange?.(targetSnapPoint);
        updateSheetHeight(targetSnapPoint);
      }
    };
    
    animate();
  }, [currentSnapPoint, isVerticalSheet, updateSheetHeight, animationConfig, onSnapPointChange]);

  const findClosestSnapPoint = useCallback((currentPosition: number, velocity: number = 0) => {
    // If velocity is significant, snap to next/previous point
    if (Math.abs(velocity) > velocityThreshold) {
      const currentIndex = sortedSnapPoints.findIndex(point => 
        Math.abs(point - currentSnapPoint) < 0.01
      );
      
      if (velocity > 0 && currentIndex < sortedSnapPoints.length - 1) {
        // Dragging up (for bottom sheet) - go to next higher snap point
        return sortedSnapPoints[currentIndex + 1];
      } else if (velocity < 0 && currentIndex > 0) {
        // Dragging down (for bottom sheet) - go to next lower snap point
        return sortedSnapPoints[currentIndex - 1];
      }
    }
    
    // Find closest snap point
    return sortedSnapPoints.reduce((closest, point) => {
      const currentDistance = Math.abs(currentPosition - closest);
      const pointDistance = Math.abs(currentPosition - point);
      return pointDistance < currentDistance ? point : closest;
    }, sortedSnapPoints[0] || currentSnapPoint);
  }, [sortedSnapPoints, currentSnapPoint, velocityThreshold]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggableVariant || !isVerticalSheet || isAnimating) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragStartY(clientY);
    lastYRef.current = clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    
    onDragStart?.();
  }, [isDraggableVariant, isVerticalSheet, isAnimating, onDragStart]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !sheetRef.current || !isVerticalSheet) return;
    
    e.preventDefault();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentTime = performance.now();
    
    // Calculate velocity
    const deltaY = clientY - lastYRef.current;
    const deltaTime = currentTime - lastTimeRef.current;
    if (deltaTime > 0) {
      velocityRef.current = deltaY / deltaTime;
    }
    
    lastYRef.current = clientY;
    lastTimeRef.current = currentTime;
    
    const viewportHeight = window.innerHeight;
    const dragDelta = isBottomSheet ? (dragStartY - clientY) : (clientY - dragStartY);
    const deltaSnapPoint = dragDelta / viewportHeight;
    let newSnapPoint = currentSnapPoint + deltaSnapPoint;
    
    // Apply resistance at boundaries
    if (newSnapPoint < minSnapPoint) {
      const overshoot = minSnapPoint - newSnapPoint;
      newSnapPoint = minSnapPoint - (overshoot * dragResistance);
    } else if (newSnapPoint > maxSnapPoint) {
      const overshoot = newSnapPoint - maxSnapPoint;
      newSnapPoint = maxSnapPoint + (overshoot * dragResistance);
    }
    
    updateSheetHeight(newSnapPoint);
  }, [isDragging, isVerticalSheet, isBottomSheet, dragStartY, currentSnapPoint, minSnapPoint, maxSnapPoint, dragResistance, updateSheetHeight]);

  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !isVerticalSheet) return;
    
    e.preventDefault();
    setIsDragging(false);
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const viewportHeight = window.innerHeight;
    const totalDragDelta = isBottomSheet ? (dragStartY - clientY) : (clientY - dragStartY);
    const deltaSnapPoint = totalDragDelta / viewportHeight;
    const currentPosition = currentSnapPoint + deltaSnapPoint;
    
    // Calculate final velocity for momentum-based snapping
    const velocity = isBottomSheet ? -velocityRef.current : velocityRef.current;
    
    // Find and animate to closest snap point
    const targetSnapPoint = findClosestSnapPoint(currentPosition, velocity);
    if (targetSnapPoint !== undefined) {
      animateToSnapPoint(targetSnapPoint, velocity);
      onDragEnd?.(targetSnapPoint);
    }
  }, [isDragging, isVerticalSheet, isBottomSheet, dragStartY, currentSnapPoint, findClosestSnapPoint, animateToSnapPoint, onDragEnd]);

  // Add drag event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
      const handleMouseUp = (e: MouseEvent) => handleDragEnd(e);
      const handleTouchMove = (e: TouchEvent) => handleDragMove(e);
      const handleTouchEnd = (e: TouchEvent) => handleDragEnd(e);
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const getSizeStyles = () => {
    const isHorizontal = position === 'left' || position === 'right';
    
    // For draggable variant, use dynamic height based on snap point
    if (isDraggableVariant && isVerticalSheet && currentHeight !== null) {
      return { height: currentHeight };
    }
    
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
      transition: !isDragging && !isAnimating 
        ? theme.transitions.create(['all'], {
            duration: theme.transitions.duration.standard,
          })
        : 'none',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' as const : 'auto' as const,
      cursor: isDraggableVariant && isVerticalSheet ? 'grab' : 'auto',
      ...(isDragging && { cursor: 'grabbing' }),
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
      case 'draggable':
        return {
          ...baseStyles,
          ...glowStyles,
          ...pulseStyles,
          ...roundedStyles,
          boxShadow: theme.shadows[Math.min(elevation + 4, 24)],
          // Add subtle border for better visibility
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        };

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

  const DrawerComponent = swipeable && !isDraggableVariant ? SwipeableDrawer : Drawer;

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
        {...(swipeable && !isDraggableVariant ? { 
          onOpen: () => {
            setIsOpen(true);
            onOpenChange?.(true);
            onOpen?.();
          },
          onClose: handleClose,
          disableSwipeToOpen: false,
          swipeAreaWidth: 20,
        } : {
          onClose: handleClose,
        })}
        anchor={position}
        open={isOpen}
        className={className}
        PaperProps={{
          ref: sheetRef,
          sx: {
            ...getSizeStyles(),
            ...getVariantStyles(),
            ...style,
            overflow: 'visible',
            ...(fullHeight && !isDraggableVariant && {
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
          ref={contentRef}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            userSelect: isDragging ? 'none' : 'auto',
          }}
        >
          {(showHandle || title || description || showCloseButton || header) && (
            <SheetHeader
              title={title}
              description={description}
              showCloseButton={showCloseButton}
              onClose={handleClose}
              showHandle={showHandle && isVerticalSheet}
              isDraggable={isDraggableVariant && isVerticalSheet}
              onDragStart={handleDragStart}
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
  isDraggable = false,
  onDragStart,
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
        cursor: isDraggable ? 'grab' : 'auto',
        '&:active': isDraggable ? { cursor: 'grabbing' } : {},
        ...style,
      }}
      onMouseDown={isDraggable ? onDragStart : undefined}
      onTouchStart={isDraggable ? onDragStart : undefined}
    >
      {showHandle && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 1,
            pointerEvents: isDraggable ? 'none' : 'auto',
          }}
        >
          <Box
            sx={{
              width: isDraggable ? 48 : 32,
              height: isDraggable ? 6 : 4,
              backgroundColor: theme.palette.text.disabled,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              ...(isDraggable && {
                backgroundColor: theme.palette.action.active,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  transform: 'scaleX(1.1)',
                },
              }),
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