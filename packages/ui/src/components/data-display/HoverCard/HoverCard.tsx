import React from 'react';
import {
  Popover,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  alpha,
  keyframes
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { HoverCardProps } from './HoverCard.types';

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

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => 
    !['customVariant', 'glow', 'pulse'].includes(prop as string),
})<{ 
  customVariant?: string; 
  glow?: boolean; 
  pulse?: boolean; 
}>(({ theme, customVariant, glow, pulse }) => ({
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  minWidth: 200,
  maxWidth: 400,

  // Variant styles
  ...(customVariant === 'default' && {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    boxShadow: theme.shadows[8],
  }),

  ...(customVariant === 'glass' && {
    backgroundColor: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  }),

  ...(customVariant === 'detailed' && {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    boxShadow: theme.shadows[12],
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

const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    overflow: 'visible',
  },
}));

export const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({
    variant = 'default',
    glow = false,
    pulse = false,
    title,
    description,
    avatar,
    trigger,
    enterDelay = 700,
    exitDelay = 0,
    maxWidth = 400,
    children,
    ...props
  }, ref) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const enterTimeoutRef = React.useRef<number>();
    const exitTimeoutRef = React.useRef<number>();

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
      if (exitTimeoutRef.current) {
        window.clearTimeout(exitTimeoutRef.current);
      }
      
      enterTimeoutRef.current = window.setTimeout(() => {
        setAnchorEl(event.currentTarget);
        setIsOpen(true);
      }, enterDelay);
    };

    const handleMouseLeave = () => {
      if (enterTimeoutRef.current) {
        window.clearTimeout(enterTimeoutRef.current);
      }
      
      exitTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
        setAnchorEl(null);
      }, exitDelay);
    };

    const handlePopoverMouseEnter = () => {
      if (exitTimeoutRef.current) {
        window.clearTimeout(exitTimeoutRef.current);
      }
    };

    const handlePopoverMouseLeave = () => {
      exitTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
        setAnchorEl(null);
      }, exitDelay);
    };

    React.useEffect(() => {
      return () => {
        if (enterTimeoutRef.current) {
          window.clearTimeout(enterTimeoutRef.current);
        }
        if (exitTimeoutRef.current) {
          window.clearTimeout(exitTimeoutRef.current);
        }
      };
    }, []);

    const triggerElement = trigger ? (
      React.cloneElement(trigger, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })
    ) : (
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        {children}
      </span>
    );

    return (
      <>
        {triggerElement}
        <StyledPopover
          ref={ref}
          open={isOpen}
          anchorEl={anchorEl}
          onClose={() => setIsOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          {...props}
        >
          <StyledCard
            customVariant={variant}
            glow={glow}
            pulse={pulse}
            sx={{ maxWidth }}
          >
            <CardContent sx={{ p: variant === 'detailed' ? 3 : 2 }}>
              {variant === 'detailed' && (avatar || title || description) ? (
                <>
                  {avatar && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={avatar} sx={{ width: 48, height: 48, mr: 2 }} />
                      <Box>
                        {title && (
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {title}
                          </Typography>
                        )}
                        {description && (
                          <Typography variant="body2" color="text.secondary">
                            {description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                  {!avatar && title && (
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {title}
                    </Typography>
                  )}
                  {!avatar && description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {description}
                    </Typography>
                  )}
                  {children && (
                    <Box>
                      {children}
                    </Box>
                  )}
                </>
              ) : (
                <>
                  {title && (
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {title}
                    </Typography>
                  )}
                  {description && (
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  )}
                  {children}
                </>
              )}
            </CardContent>
          </StyledCard>
        </StyledPopover>
      </>
    );
  }
);

HoverCard.displayName = 'HoverCard';