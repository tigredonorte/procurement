# Responsive Design

[← Back to Main Documentation](./Readme.md)

---

## Breakpoint System

```scss
$breakpoints: (
  xs: 0,      // Mobile portrait
  sm: 640px,  // Mobile landscape
  md: 768px,  // Tablet portrait
  lg: 1024px, // Tablet landscape / Desktop
  xl: 1280px, // Desktop
  '2xl': 1536px // Large desktop
);
```

## Responsive Patterns

```typescript
// Component Responsive Props
interface ResponsiveProps<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// Example usage
interface PRAContainerProps {
  padding?: ResponsiveProps<number>;
  columns?: ResponsiveProps<number>;
  gap?: ResponsiveProps<number>;
}

// Implementation
const responsiveStyles = {
  padding: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40
  },
  fontSize: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20
  }
};
```

## Mobile-First Approach

```scss
// Component styles mobile-first
.pra-component {
  // Base (mobile) styles
  padding: 16px;
  font-size: 14px;
  
  @media (min-width: 640px) {
    padding: 20px;
    font-size: 16px;
  }
  
  @media (min-width: 768px) {
    padding: 24px;
    font-size: 18px;
  }
  
  @media (min-width: 1024px) {
    padding: 32px;
    font-size: 20px;
  }
}
```

## Responsive Grid

```typescript
const ResponsiveGrid = styled('div')`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, 1fr);
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 40px;
  }
`;
```

---

[Next: Dark Mode →](./11-dark-mode.md)