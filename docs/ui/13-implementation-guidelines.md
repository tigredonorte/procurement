# Implementation Guidelines

[← Back to Main Documentation](./Readme.md)

---

## Component Creation Pattern

```typescript
// Standard component template
import React from 'react';
import { styled } from '@mui/material/styles';
import { usePRATheme } from '@pra/ui-library';

interface ComponentProps {
  // Props definition
}

const StyledComponent = styled('div')<ComponentProps>(({ theme, ...props }) => ({
  // Base styles
  ...baseStyles,
  
  // Variant styles
  ...variantStyles[props.variant],
  
  // Responsive styles
  ...responsiveStyles,
  
  // Theme-based styles
  ...(theme.palette.mode === 'dark' ? darkStyles : lightStyles),
  
  // Animation styles
  ...animationStyles
}));

export const PRAComponent: React.FC<ComponentProps> = React.memo(({ 
  children,
  ...props 
}) => {
  const theme = usePRATheme();
  
  return (
    <StyledComponent {...props} theme={theme}>
      {children}
    </StyledComponent>
  );
});

PRAComponent.displayName = 'PRAComponent';
```

## Theme Customization API

```typescript
// User customization interface
interface PRAThemeCustomization {
  colors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    danger?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: {
      base?: number;
      scale?: number;
    };
  };
  spacing?: {
    unit?: number;
  };
  borderRadius?: {
    base?: number;
  };
  shadows?: {
    intensity?: 'low' | 'medium' | 'high';
  };
}

// Usage
const App = () => {
  const customTheme: PRAThemeCustomization = {
    colors: {
      primary: '#8B5CF6',
      secondary: '#10B981'
    },
    typography: {
      fontFamily: 'Poppins, sans-serif'
    },
    borderRadius: {
      base: 8
    }
  };
  
  return (
    <PRAUIProvider theme="dark" customization={customTheme}>
      <YourApp />
    </PRAUIProvider>
  );
};
```

## Performance Optimization

```typescript
// Lazy loading components
const PRADataTable = React.lazy(() => import('./components/DataTable'));
const PRAChart = React.lazy(() => import('./components/Chart'));

// Memoization for expensive computations
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});

// Virtual scrolling for large lists
import { VariableSizeList } from 'react-window';

// CSS-in-JS optimization
const useStyles = makeStyles((theme) => ({
  // Styles
}), { name: 'PRAComponent' }); // Named for better debugging
```

## Bundle Size Optimization

```typescript
// Tree-shakeable exports
export { PRAButton } from './Button';
export { PRAInput } from './Input';
export { PRACard } from './Card';

// Don't use barrel exports for large component libraries
// Bad: export * from './components';
// Good: Import only what you need

// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

---

[Next: Appendices →](./14-appendices.md)