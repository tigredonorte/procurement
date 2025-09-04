import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormatQuote } from '@mui/icons-material';

import { BlockquoteProps } from './Blockquote.types';

const getColorFromTheme = (theme: any, color: string) => {
  if (color === 'neutral') {
    return {
      main: theme.palette.grey?.[700] || '#616161',
      light: theme.palette.grey?.[500] || '#9e9e9e',
      dark: theme.palette.grey?.[800] || '#424242',
    };
  }

  const colorMap: Record<string, any> = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    danger: theme.palette.error,
  };

  return colorMap[color] || theme.palette.primary;
};

const StyledBlockquote = styled('blockquote', {
  shouldForwardProp: (prop) => !['customVariant', 'customColor'].includes(prop as string),
})<{
  customVariant?: string;
  customColor?: string;
}>(({ theme, customVariant = 'default', customColor = 'neutral' }) => {
  const colorPalette = getColorFromTheme(theme, customColor);

  const baseStyles = {
    margin: '1.5em 0',
    padding: 0,
    position: 'relative' as const,
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: '1.125rem',
    lineHeight: 1.6,
    fontStyle: 'italic',
    color: theme.palette.text.primary,
  };

  // Variant-specific styles
  const variantStyles = {
    default: {
      ...baseStyles,
      paddingLeft: theme.spacing(3),
      borderLeft: `4px solid ${colorPalette.main}`,
      backgroundColor: alpha(colorPalette.main, 0.05),
      padding: theme.spacing(2, 3),
      borderRadius: theme.shape.borderRadius,
    },
    bordered: {
      ...baseStyles,
      padding: theme.spacing(3),
      border: `2px solid ${alpha(colorPalette.main, 0.2)}`,
      borderRadius: theme.shape.borderRadius * 2,
      backgroundColor: alpha(colorPalette.main, 0.03),
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        background: `linear-gradient(135deg, ${colorPalette.main}, ${colorPalette.light})`,
        borderRadius: theme.shape.borderRadius * 2,
        padding: '2px',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'exclude',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
      },
    },
    citation: {
      ...baseStyles,
      padding: theme.spacing(2, 3),
      backgroundColor:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.grey[50], 0.95),
      backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      borderRadius: theme.shape.borderRadius * 2,
      boxShadow: theme.palette.mode === 'dark' ? theme.shadows[4] : 'none',
      textAlign: 'center' as const,
    },
  };

  return variantStyles[customVariant as keyof typeof variantStyles] || variantStyles.default;
});

const QuoteIcon = styled(FormatQuote)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  fontSize: '2rem',
  opacity: 0.3,
  transform: 'rotate(180deg)',
}));

const CitationContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'right',
  fontStyle: 'normal',
  opacity: 0.8,
}));

const AuthorName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(0.5),
}));

const SourceName = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  opacity: 0.7,
}));

export const Blockquote = React.forwardRef<HTMLElement, BlockquoteProps>(
  ({ variant = 'default', author, source, color = 'neutral', children, ...props }, ref) => {
    const showCitation = author || source;
    const showIcon = variant === 'bordered' || variant === 'citation';
    const colorPalette = getColorFromTheme(
      {
        palette: {
          primary: { main: '#1976d2' },
          secondary: { main: '#dc004e' },
          success: { main: '#2e7d32' },
          warning: { main: '#ed6c02' },
          error: { main: '#d32f2f' },
          grey: { 700: '#616161', 500: '#9e9e9e', 800: '#424242' },
        },
      },
      color,
    );

    return (
      <StyledBlockquote ref={ref} customVariant={variant} customColor={color} {...props}>
        {showIcon && <QuoteIcon style={{ color: colorPalette.main }} />}

        <Typography
          component="div"
          sx={{
            fontSize: 'inherit',
            lineHeight: 'inherit',
            fontStyle: 'inherit',
            color: 'inherit',
            margin: 0,
          }}
        >
          {children}
        </Typography>

        {showCitation && (
          <CitationContainer>
            {author && <AuthorName>— {author}</AuthorName>}
            {source && <SourceName>{source}</SourceName>}
          </CitationContainer>
        )}
      </StyledBlockquote>
    );
  },
);

Blockquote.displayName = 'Blockquote';
