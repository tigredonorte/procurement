import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { SidebarProps, SidebarHeaderProps, SidebarContentProps, SidebarFooterProps } from './Sidebar.types';

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  variant = 'fixed',
  open = true,
  onToggle,
  width = 280,
  collapsedWidth = 64,
  position = 'left',
  className,
}) => {
  const theme = useTheme();
  
  const isCollapsed = variant === 'collapsible' && !open;
  const currentWidth = isCollapsed ? collapsedWidth : width;

  const getVariantStyles = () => {
    switch (variant) {
      case 'floating':
        return {
          position: 'fixed' as const,
          top: theme.spacing(2),
          bottom: theme.spacing(2),
          [position]: theme.spacing(2),
          borderRadius: theme.spacing(2),
          boxShadow: theme.shadows[8],
          zIndex: theme.zIndex.drawer,
        };
      case 'glass':
        return {
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
        };
      case 'collapsible':
        return {
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        };
      default:
        return {
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        };
    }
  };

  return (
    <Box
      className={className}
      sx={{
        width: currentWidth,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...getVariantStyles(),
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ collapsed?: boolean }>(child)) {
          // Check if this is one of our Sidebar sub-components that accepts collapsed prop
          const childType = child.type;
          if (childType === SidebarHeader || childType === SidebarContent || childType === SidebarFooter) {
            return React.cloneElement(child, { collapsed: isCollapsed });
          }
        }
        return child;
      })}
    </Box>
  );
};

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  collapsed = false,
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  );
};

export const SidebarContent: React.FC<SidebarContentProps> = ({
  children,
  collapsed = false,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
      }}
    >
      {children}
    </Box>
  );
};

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  collapsed = false,
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
};