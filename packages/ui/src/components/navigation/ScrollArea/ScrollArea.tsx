import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, alpha, Theme } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { ScrollAreaProps } from './ScrollArea.types';

const getScrollbarStyles = (
  theme: Theme,
  variant: string,
  scrollbarColor: string,
  customScrollbarColor: string,
  scrollbarSize: string,
  scrollbarRadius: string,
  glassmorphism: boolean,
  hideNativeScrollbars: boolean,
) => {
  const scrollbarWidth = scrollbarSize === 'thin' ? 6 : scrollbarSize === 'thick' ? 16 : 12; // medium

  const borderRadius =
    scrollbarRadius === 'none'
      ? 0
      : scrollbarRadius === 'small'
        ? 2
        : scrollbarRadius === 'large'
          ? 8
          : scrollbarRadius === 'full'
            ? scrollbarWidth / 2
            : 4; // medium

  const getScrollbarColor = () => {
    if (scrollbarColor === 'custom' && customScrollbarColor) {
      return customScrollbarColor;
    }
    switch (scrollbarColor) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary?.main || theme.palette.grey[600];
      case 'dark':
        return theme.palette.grey[800];
      case 'light':
        return theme.palette.grey[400];
      default:
        return theme.palette.grey[600];
    }
  };

  const baseColor = getScrollbarColor();
  const trackColor = alpha(baseColor, 0.1);
  const thumbColor = glassmorphism ? alpha(baseColor, 0.6) : alpha(baseColor, 0.8);
  const thumbHoverColor = glassmorphism ? alpha(baseColor, 0.8) : baseColor;

  if (hideNativeScrollbars) {
    return {
      /* Hide native scrollbars */
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    };
  }

  const baseScrollbarStyles = {
    /* Firefox */
    scrollbarWidth: scrollbarSize === 'thin' ? 'thin' : 'auto',
    scrollbarColor: `${thumbColor} ${trackColor}`,

    /* WebKit browsers */
    '&::-webkit-scrollbar': {
      width: scrollbarWidth,
      height: scrollbarWidth,
    },

    '&::-webkit-scrollbar-track': {
      background: trackColor,
      borderRadius: borderRadius,
      ...(glassmorphism && {
        backdropFilter: 'blur(10px)',
        background: alpha(trackColor, 0.3),
      }),
    },

    '&::-webkit-scrollbar-thumb': {
      background: thumbColor,
      borderRadius: borderRadius,
      transition: 'all 0.2s ease',
      ...(glassmorphism && {
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.common?.white || '#ffffff', 0.2)}`,
      }),

      '&:hover': {
        background: thumbHoverColor,
        ...(glassmorphism && {
          boxShadow: `0 2px 8px ${alpha(baseColor, 0.3)}`,
        }),
      },
    },

    '&::-webkit-scrollbar-corner': {
      background: trackColor,
    },
  };

  if (variant === 'hover') {
    return {
      ...baseScrollbarStyles,
      '&::-webkit-scrollbar': {
        ...baseScrollbarStyles['&::-webkit-scrollbar'],
        opacity: 0,
        transition: 'opacity 0.2s ease',
      },
      '&::-webkit-scrollbar-track': {
        ...baseScrollbarStyles['&::-webkit-scrollbar-track'],
        opacity: 0,
        transition: 'opacity 0.2s ease',
      },
      '&::-webkit-scrollbar-thumb': {
        ...baseScrollbarStyles['&::-webkit-scrollbar-thumb'],
        opacity: 0,
        transition: 'all 0.2s ease',
      },
      '&:hover': {
        '&::-webkit-scrollbar': {
          opacity: 1,
        },
        '&::-webkit-scrollbar-track': {
          opacity: 1,
        },
        '&::-webkit-scrollbar-thumb': {
          opacity: 1,
        },
      },
    };
  }

  if (variant === 'hidden') {
    return {
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    };
  }

  return baseScrollbarStyles;
};

const ScrollContainer = styled(Box)(() => ({}));

const ScrollIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 4,
  top: 4,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: 12,
  padding: theme.spacing(0.5, 1),
  fontSize: '0.75rem',
  color: theme.palette.primary.main,
  fontWeight: 500,
  zIndex: 3,
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(8px)',
}));

const InnerContainer = styled(Box)<{ innerPadding?: number | string }>(({ innerPadding }) => ({
  ...(innerPadding && {
    padding: innerPadding,
  }),
}));

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      variant = 'auto',
      maxHeight,
      maxWidth,
      width,
      height,
      children,
      glassmorphism = false,
      scrollbarColor = 'primary',
      customScrollbarColor,
      scrollbarSize = 'medium',
      showShadows = false,
      scrollbarRadius = 'medium',
      onScroll,
      onScrollEnd,
      smoothScrolling = true,
      orientation = 'both',
      hideNativeScrollbars = false,
      className,
      disabled = false,
      innerPadding,
      showScrollIndicator = false,
      fadeEdges = false,
      style,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollInfo, setScrollInfo] = useState({
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 0,
      scrollWidth: 0,
      clientHeight: 0,
      clientWidth: 0,
    });
    const [, setShowTopShadow] = useState(false);
    const [, setShowBottomShadow] = useState(false);

    const handleScroll = useCallback(
      (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        const newScrollInfo = {
          scrollTop: target.scrollTop,
          scrollLeft: target.scrollLeft,
          scrollHeight: target.scrollHeight,
          scrollWidth: target.scrollWidth,
          clientHeight: target.clientHeight,
          clientWidth: target.clientWidth,
        };

        setScrollInfo(newScrollInfo);

        // Update shadow visibility
        if (showShadows) {
          setShowTopShadow(target.scrollTop > 0);
          setShowBottomShadow(target.scrollTop < target.scrollHeight - target.clientHeight);
        }

        // Handle scroll end callbacks
        if (onScrollEnd) {
          const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } =
            newScrollInfo;

          if (scrollTop === 0) onScrollEnd('top');
          if (scrollTop + clientHeight >= scrollHeight) onScrollEnd('bottom');
          if (scrollLeft === 0) onScrollEnd('left');
          if (scrollLeft + clientWidth >= scrollWidth) onScrollEnd('right');
        }

        onScroll?.(event);
      },
      [onScroll, onScrollEnd, showShadows],
    );

    useEffect(() => {
      const scrollElement = scrollRef.current;
      if (scrollElement && showShadows) {
        // Initial shadow state
        setShowTopShadow(scrollElement.scrollTop > 0);
        setShowBottomShadow(
          scrollElement.scrollTop < scrollElement.scrollHeight - scrollElement.clientHeight,
        );
      }
    }, [showShadows]);

    const scrollPercentage =
      scrollInfo.scrollHeight > 0
        ? Math.round(
            (scrollInfo.scrollTop / (scrollInfo.scrollHeight - scrollInfo.clientHeight)) * 100,
          )
        : 0;

    const containerStyles = {
      ...(maxHeight && { maxHeight }),
      ...(maxWidth && { maxWidth }),
      ...(width && { width }),
      ...(height && { height }),
      position: 'relative' as const,
      overflow:
        orientation === 'vertical'
          ? ('hidden auto' as const)
          : orientation === 'horizontal'
            ? ('auto hidden' as const)
            : ('auto' as const),
      ...(smoothScrolling && {
        scrollBehavior: 'smooth' as const,
      }),
      ...(disabled && {
        pointerEvents: 'none' as const,
        opacity: 0.6,
      }),
      ...style,
    };

    const sxStyles = {
      ...getScrollbarStyles(
        theme,
        variant,
        scrollbarColor,
        customScrollbarColor || '',
        scrollbarSize,
        scrollbarRadius,
        glassmorphism,
        hideNativeScrollbars,
      ),
      ...(showShadows && {
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          height: 20,
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'opacity 0.2s ease',
        },
        '&::before': {
          top: 0,
          background: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.8)}, transparent)`,
        },
        '&::after': {
          bottom: 0,
          background: `linear-gradient(to top, ${alpha(theme.palette.background.paper, 0.8)}, transparent)`,
        },
      }),
      ...(fadeEdges && {
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          height: 30,
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'opacity 0.3s ease',
        },
        '&::before': {
          top: 0,
          background: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, transparent 100%)`,
        },
        '&::after': {
          bottom: 0,
          background: `linear-gradient(to top, ${theme.palette.background.paper} 0%, transparent 100%)`,
        },
      }),
    };

    return (
      <ScrollContainer
        ref={(element: HTMLDivElement | null) => {
          if (scrollRef.current !== element) {
            (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
          }
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
          }
        }}
        className={className}
        onScroll={handleScroll}
        style={containerStyles}
        sx={sxStyles}
        {...props}
      >
        {showScrollIndicator && scrollInfo.scrollHeight > scrollInfo.clientHeight && (
          <ScrollIndicator>{scrollPercentage}%</ScrollIndicator>
        )}

        <InnerContainer innerPadding={innerPadding}>{children}</InnerContainer>
      </ScrollContainer>
    );
  },
);

ScrollArea.displayName = 'ScrollArea';
