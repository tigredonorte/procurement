import React from 'react';
import { Box, useTheme, Typography } from '@mui/material';

import { SeparatorProps } from './Separator.types';

export const Separator: React.FC<SeparatorProps> = ({
  variant = 'solid',
  orientation = 'horizontal',
  size = 'md',
  color,
  margin,
  length,
  children,
  className,
}) => {
  const theme = useTheme();

  const getThickness = () => {
    switch (size) {
      case 'xs': return 1;
      case 'sm': return 2;
      case 'md': return 3;
      case 'lg': return 4;
      case 'xl': return 6;
      default: return 3;
    }
  };

  const getMargin = () => {
    if (margin !== undefined) return margin;
    switch (size) {
      case 'xs': return theme.spacing(0.5);
      case 'sm': return theme.spacing(1);
      case 'md': return theme.spacing(2);
      case 'lg': return theme.spacing(3);
      case 'xl': return theme.spacing(4);
      default: return theme.spacing(2);
    }
  };

  const getBorderStyle = () => {
    switch (variant) {
      case 'dashed': return 'dashed';
      case 'dotted': return 'dotted';
      case 'gradient': return 'solid';
      default: return 'solid';
    }
  };

  const getColor = () => {
    if (color) return color;
    return theme.palette.divider;
  };

  const getGradientBackground = () => {
    if (variant !== 'gradient') return undefined;
    
    if (orientation === 'horizontal') {
      return `linear-gradient(90deg, transparent 0%, ${getColor()} 50%, transparent 100%)`;
    } else {
      return `linear-gradient(180deg, transparent 0%, ${getColor()} 50%, transparent 100%)`;
    }
  };

  const getSeparatorStyles = () => {
    const isHorizontal = orientation === 'horizontal';
    const thickness = getThickness();
    const marginValue = getMargin();
    
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      margin: isHorizontal 
        ? `${marginValue}px 0` 
        : `0 ${marginValue}px`,
      width: isHorizontal ? (length || '100%') : thickness,
      height: isHorizontal ? thickness : (length || '100%'),
    };

    if (variant === 'gradient') {
      return {
        ...baseStyles,
        background: getGradientBackground(),
        border: 'none',
      };
    }

    return {
      ...baseStyles,
      borderColor: getColor(),
      borderStyle: getBorderStyle(),
      borderWidth: 0,
      [isHorizontal ? 'borderTopWidth' : 'borderLeftWidth']: thickness,
    };
  };

  if (children) {
    const isHorizontal = orientation === 'horizontal';
    
    return (
      <Box
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: getMargin(),
          flexDirection: isHorizontal ? 'row' : 'column',
          gap: theme.spacing(2),
        }}
      >
        <Box sx={getSeparatorStyles()} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexShrink: 0,
            padding: theme.spacing(0, 1),
            backgroundColor: theme.palette.background.default,
          }}
        >
          {children}
        </Typography>
        <Box sx={getSeparatorStyles()} />
      </Box>
    );
  }

  return (
    <Box
      className={className}
      sx={getSeparatorStyles()}
      role="separator"
      aria-orientation={orientation}
    />
  );
};