import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  NavigateNext,
  ChevronRight,
  ArrowForwardIos,
  Home,
} from '@mui/icons-material';

import { BreadcrumbsProps } from './Breadcrumbs.types';

const StyledBreadcrumbs = styled(MuiBreadcrumbs, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'color',
})<{ size?: string; color?: string }>(({ theme, size, color }) => ({
  '& .MuiBreadcrumbs-ol': {
    alignItems: 'center',
  },
  '& .MuiBreadcrumbs-separator': {
    marginLeft: theme.spacing(size === 'sm' ? 0.5 : size === 'lg' ? 1.5 : 1),
    marginRight: theme.spacing(size === 'sm' ? 0.5 : size === 'lg' ? 1.5 : 1),
    ...(color === 'primary' && {
      color: theme.palette.primary.main,
    }),
    ...(color === 'secondary' && {
      color: theme.palette.secondary.main,
    }),
  },
}));

const BreadcrumbLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'active',
})<{ size?: string; active?: boolean }>(({ theme, size, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  textDecoration: 'none',
  fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
  fontWeight: active ? 600 : 400,
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  padding: theme.spacing(0.25, 0.5),
  borderRadius: theme.spacing(0.5),
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  ...(active && {
    pointerEvents: 'none',
    cursor: 'default',
  }),
}));

const BreadcrumbText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size?: string }>(({ theme, size }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: theme.spacing(0.25, 0.5),
}));

const getSeparator = (variant: string) => {
  switch (variant) {
    case 'slash':
      return '/';
    case 'arrow':
      return <NavigateNext fontSize="small" />;
    case 'chevron':
      return <ChevronRight fontSize="small" />;
    default:
      return <ArrowForwardIos sx={{ fontSize: 12 }} />;
  }
};

const sizeIconMap = {
  sm: 'small' as const,
  md: 'small' as const,
  lg: 'medium' as const,
};

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      variant = 'default',
      items,
      separator,
      maxItems = 8,
      showHomeIcon = true,
      size = 'md',
      color = 'default',
      ...props
    },
    ref
  ) => {
    const finalSeparator = separator || getSeparator(variant);
    const iconSize = sizeIconMap[size];

    return (
      <StyledBreadcrumbs
        ref={ref}
        separator={finalSeparator}
        maxItems={maxItems}
        size={size}
        color={color}
        aria-label="breadcrumb"
        {...props}
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isActive = item.active || isLast;
          
          const icon = isFirst && showHomeIcon && !item.icon ? (
            <Home fontSize={iconSize} />
          ) : item.icon ? (
            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </Box>
          ) : null;

          if (isActive) {
            return (
              <BreadcrumbText key={index} size={size}>
                {icon}
                {item.label}
              </BreadcrumbText>
            );
          }

          return (
            <BreadcrumbLink
              key={index}
              href={item.href || '#'}
              onClick={item.onClick}
              size={size}
              active={isActive}
              underline="none"
            >
              {icon}
              {item.label}
            </BreadcrumbLink>
          );
        })}
      </StyledBreadcrumbs>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';