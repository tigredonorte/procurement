import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, useTheme, Collapse } from '@mui/material';
import { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps } from './Collapsible.types';

export const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  open,
  variant = 'default',
  duration = 300,
  easing,
  onToggle,
  disabled = false,
  keepMounted = false,
  sx,
  className,
}) => {
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  const getTransitionSettings = () => {
    switch (variant) {
      case 'smooth':
        return {
          duration,
          easing: easing || theme.transitions.easing.easeInOut,
        };
      case 'spring':
        return {
          duration: duration * 1.2,
          easing: easing || 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        };
      default:
        return {
          duration,
          easing: easing || theme.transitions.easing.easeInOut,
        };
    }
  };

  const transition = getTransitionSettings();

  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setHeight(0);
    } else if (contentRef.current) {
      measureHeight();
    }
  }, [open, measureHeight, children]);


  if (variant === 'default') {
    // Use MUI's built-in Collapse for default variant
    return (
      <Collapse
        in={open}
        timeout={duration}
        sx={{
          ...sx,
        }}
        className={className}
        unmountOnExit={!keepMounted}
      >
        <Box>{children}</Box>
      </Collapse>
    );
  }

  // Custom implementation for smooth and spring variants
  return (
    <Box
      component="div"
      sx={{
        overflow: 'hidden',
        height: open ? height : 0,
        transition: `height ${transition.duration}ms ${transition.easing}`,
        willChange: 'height',
        ...sx,
      }}
      className={className}
    >
      <Box ref={contentRef}>
        {(keepMounted || open) && children}
      </Box>
    </Box>
  );
};

export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  onClick,
  disabled = false,
  expanded = false,
  className,
}) => {
  const theme = useTheme();

  return (
    <Box
      component="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      sx={{
        width: '100%',
        padding: theme.spacing(1, 2),
        border: 'none',
        backgroundColor: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: theme.transitions.create(['background-color', 'opacity'], {
          duration: theme.transitions.duration.short,
        }),
        opacity: disabled ? 0.6 : 1,
        '&:hover': {
          backgroundColor: disabled ? 'transparent' : theme.palette.action.hover,
        },
        '&:focus': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      {children}
    </Box>
  );
};

export const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  children,
  className,
}) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        padding: theme.spacing(2),
      }}
    >
      {children}
    </Box>
  );
};