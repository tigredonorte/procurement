import React from 'react';
import { Table as MuiTable, alpha, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

import { TableProps } from './Table.types';

// Define pulse animation
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 currentColor;
    opacity: 1;
  }
  70% {
    box-shadow: 0 0 0 10px currentColor;
    opacity: 0;
  }
  100% {
    box-shadow: 0 0 0 0 currentColor;
    opacity: 0;
  }
`;

const StyledTable = styled(MuiTable, {
  shouldForwardProp: (prop) => 
    !['customVariant', 'glow', 'pulse', 'hoverable'].includes(prop as string),
})<{ 
  customVariant?: string;
  glow?: boolean; 
  pulse?: boolean;
  hoverable?: boolean;
}>(({ theme, customVariant, glow, pulse, hoverable }) => ({
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  position: 'relative',

  // Variant styles
  ...(customVariant === 'default' && {
    backgroundColor: theme.palette.background.paper,
    '& .MuiTableHead-root': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  }),

  ...(customVariant === 'striped' && {
    backgroundColor: theme.palette.background.paper,
    '& .MuiTableRow-root:nth-of-type(even)': {
      backgroundColor: alpha(theme.palette.action.hover, 0.5),
    },
  }),

  ...(customVariant === 'glass' && {
    backgroundColor: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  }),

  ...(customVariant === 'minimal' && {
    backgroundColor: 'transparent',
    '& .MuiTableCell-root': {
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    },
  }),

  // Hoverable rows
  ...(hoverable && {
    '& .MuiTableBody-root .MuiTableRow-root:hover': {
      backgroundColor: alpha(theme.palette.action.hover, 0.8),
      cursor: 'pointer',
    },
  }),

  // Glow effect
  ...(glow && !pulse && {
    boxShadow: `0 0 20px 5px ${alpha(theme.palette.primary.main, 0.3)} !important`,
    filter: 'brightness(1.05)',
  }),

  // Pulse animation
  ...(pulse && !glow && {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      backgroundColor: theme.palette.primary.main,
      opacity: 0.1,
      animation: `${pulseAnimation} 2s infinite`,
      pointerEvents: 'none',
      zIndex: -1,
    },
  }),

  // Both glow and pulse
  ...(glow && pulse && {
    position: 'relative',
    boxShadow: `0 0 20px 5px ${alpha(theme.palette.primary.main, 0.3)} !important`,
    filter: 'brightness(1.05)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      backgroundColor: theme.palette.primary.main,
      opacity: 0.1,
      animation: `${pulseAnimation} 2s infinite`,
      pointerEvents: 'none',
      zIndex: -1,
    },
  }),
}));

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({
    variant = 'default',
    glow = false,
    pulse = false,
    hoverable = false,
    children,
    ...props
  }, ref) => {
    return (
      <StyledTable
        ref={ref}
        customVariant={variant}
        glow={glow}
        pulse={pulse}
        hoverable={hoverable}
        {...props}
      >
        {children}
      </StyledTable>
    );
  }
);

Table.displayName = 'Table';