import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Collapse,
  Typography,
  Divider,
  alpha,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ExpandLess,
  ExpandMore,
  ChevronRight,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { NavigationMenuProps, NavigationMenuItem } from './NavigationMenu.types';

const NavigationContainer = styled(Box, {
  shouldForwardProp: (prop) => !['variant', 'collapsed'].includes(prop as string),
})<{ variant?: string; collapsed?: boolean }>(({ theme, variant, collapsed }) => ({
  display: 'flex',
  ...(variant === 'horizontal' && {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  }),
  ...(variant === 'vertical' && {
    flexDirection: 'column',
    width: collapsed ? 80 : 280,
    transition: 'width 0.3s ease',
    height: '100%',
  }),
  ...(variant === 'mega' && {
    flexDirection: 'column',
    width: '100%',
  }),
}));

const StyledList = styled(List, {
  shouldForwardProp: (prop) => !['variant', 'size'].includes(prop as string),
})<{ variant?: string; size?: string }>(({ theme, variant, size }) => ({
  padding: 0,
  width: '100%',
  ...(variant === 'horizontal' && {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }),
  ...(variant === 'mega' && {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  }),
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => !['variant', 'active', 'size', 'level'].includes(prop as string),
})<{ variant?: string; active?: boolean; size?: string; level?: number }>(({ theme, variant, active, size, level = 0 }) => ({
  padding: 0,
  ...(variant === 'horizontal' && {
    width: 'auto',
  }),
  ...(level > 0 && {
    paddingLeft: theme.spacing(2 * level),
  }),
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => !['variant', 'active', 'size', 'collapsed'].includes(prop as string),
})<{ variant?: string; active?: boolean; size?: string; collapsed?: boolean }>(({ theme, variant, active, size, collapsed }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5),
  transition: 'all 0.2s ease',
  
  ...(size === 'sm' && {
    padding: theme.spacing(1),
    fontSize: '0.875rem',
  }),
  ...(size === 'lg' && {
    padding: theme.spacing(2),
    fontSize: '1.125rem',
  }),
  
  ...(variant === 'horizontal' && {
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0, 0.5),
  }),
  
  ...(collapsed && {
    justifyContent: 'center',
    minHeight: 48,
  }),
  
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
  }),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(1),
}));

const CollapseButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.08),
  },
}));

const MegaMenuSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

const renderMenuItem = (
  item: NavigationMenuItem,
  variant: string = 'vertical',
  size: string = 'md',
  collapsed: boolean = false,
  level: number = 0,
  onItemClick?: (item: NavigationMenuItem) => void
): React.ReactNode => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (hasChildren) {
      setOpen(!open);
    }
    if (item.onClick) {
      item.onClick(event);
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };
  
  const itemContent = (
    <StyledListItem key={item.id} variant={variant} active={item.active} size={size} level={level}>
      <StyledListItemButton
        variant={variant}
        active={item.active}
        size={size}
        collapsed={collapsed}
        disabled={item.disabled}
        onClick={handleClick}
        component={item.href && !hasChildren ? 'a' : 'div'}
        href={item.href || undefined}
        target={item.target || undefined}
      >
        {item.icon && (
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
            {item.icon}
          </ListItemIcon>
        )}
        {!collapsed && (
          <>
            <ListItemText
              primary={item.label}
              secondary={item.description}
              primaryTypographyProps={{ 
                variant: size === 'sm' ? 'body2' : size === 'lg' ? 'h6' : 'body1' 
              }}
            />
            {item.badge && (
              <Badge
                badgeContent={item.badge}
                color="error"
                sx={{ mr: 1 }}
              />
            )}
            {hasChildren && (
              variant === 'horizontal' ? (
                <ChevronRight fontSize="small" />
              ) : (
                open ? <ExpandLess /> : <ExpandMore />
              )
            )}
          </>
        )}
      </StyledListItemButton>
    </StyledListItem>
  );
  
  if (hasChildren && variant !== 'horizontal') {
    return (
      <React.Fragment key={item.id}>
        {itemContent}
        {!collapsed && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) =>
                renderMenuItem(child, variant, size, collapsed, level + 1, onItemClick)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  }
  
  return itemContent;
};

export const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  (
    {
      variant = 'vertical',
      items,
      color = 'default',
      size = 'md',
      collapsible = false,
      collapsed: controlledCollapsed,
      onCollapseChange,
      logo,
      endContent,
      maxWidth,
      showDividers = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    
    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed;
    
    const handleCollapseToggle = () => {
      if (!isControlled) {
        setInternalCollapsed(!collapsed);
      }
      onCollapseChange?.(!collapsed);
    };
    
    const handleItemClick = (item: NavigationMenuItem) => {
      // Handle item click logic if needed
    };
    
    if (variant === 'mega') {
      return (
        <NavigationContainer
          ref={ref}
          variant={variant}
          className={className}
          style={{ maxWidth, ...style }}
          {...props}
        >
          <Paper elevation={1} sx={{ width: '100%', overflow: 'hidden' }}>
            {logo && <LogoContainer>{logo}</LogoContainer>}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, p: 2 }}>
              {items.map((section) => (
                <MegaMenuSection key={section.id}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    {section.label}
                  </Typography>
                  <List>
                    {section.children?.map((item) =>
                      renderMenuItem(item, variant, size, false, 0, handleItemClick)
                    )}
                  </List>
                </MegaMenuSection>
              ))}
            </Box>
          </Paper>
        </NavigationContainer>
      );
    }
    
    return (
      <NavigationContainer
        ref={ref}
        variant={variant}
        collapsed={collapsed}
        className={className}
        style={style}
        {...props}
      >
        <Paper
          elevation={variant === 'horizontal' ? 1 : 0}
          sx={{
            width: '100%',
            height: variant === 'vertical' ? '100%' : 'auto',
            overflow: 'hidden',
          }}
        >
          {logo && variant === 'vertical' && (
            <LogoContainer>
              {collapsed ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <MenuIcon />
                </Box>
              ) : (
                logo
              )}
            </LogoContainer>
          )}
          
          {collapsible && variant === 'vertical' && (
            <CollapseButton onClick={handleCollapseToggle}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
                <MenuIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Collapse" />}
            </CollapseButton>
          )}
          
          <StyledList variant={variant} size={size}>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {renderMenuItem(item, variant, size, collapsed, 0, handleItemClick)}
                {showDividers && index < items.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </StyledList>
          
          {endContent && (
            <Box sx={{ mt: 'auto', p: 2 }}>
              {endContent}
            </Box>
          )}
        </Paper>
      </NavigationContainer>
    );
  }
);

NavigationMenu.displayName = 'NavigationMenu';