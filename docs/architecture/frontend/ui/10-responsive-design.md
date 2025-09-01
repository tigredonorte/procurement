# Responsive Design

[← Back to Main Documentation](./Readme.md)

---

## Breakpoint System

```scss
$breakpoints: (
  xs: 0,      // Mobile portrait (320px - 639px)
  sm: 640px,  // Mobile landscape (640px - 767px)
  md: 768px,  // Tablet portrait (768px - 1023px)
  lg: 1024px, // Tablet landscape / Desktop (1024px - 1279px)
  xl: 1280px, // Desktop (1280px - 1535px)
  '2xl': 1536px, // Large desktop (1536px - 1919px)
  '3xl': 1920px, // Extra large desktop (1920px - 2549px)
  '4xl': 2550px, // 4k screens (2550px - 3199px)
  '5xl': 3200px,  // Ultra-wide displays (3200px+, optimized for 3200x1200)
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
  '3xl'?: T;
  '4xl'?: T;
  '5xl'?: T;
}

// Example usage with 16-column grid
interface ContainerProps {
  padding?: ResponsiveProps<number>;
  columns?: ResponsiveProps<number>; // Max 16 columns
  gap?: ResponsiveProps<number>;
  span?: ResponsiveProps<number>; // How many columns to span (1-16)
}

// Column span utilities
type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

interface GridItemProps {
  span?: {
    xs?: 1 | 2 | 3 | 4; // Mobile: 4 columns max
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // Mobile landscape: 8 columns
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; // Tablet: 12 columns
    lg?: ColumnSpan; // Desktop+: Full 16 columns
    xl?: ColumnSpan;
    '2xl'?: ColumnSpan;
    '3xl'?: ColumnSpan;
    '4xl'?: ColumnSpan;
    '5xl'?: ColumnSpan;
  };
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
.ui-component {
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

## 16-Column Grid System

### Grid Configuration
```scss
$grid-columns: 16; // Base 16-column grid for maximum flexibility
$grid-gutter: (
  xs: 16px,   // Mobile
  sm: 20px,   // Mobile landscape
  md: 24px,   // Tablet
  lg: 28px,   // Desktop
  xl: 32px,   // Large desktop
  '2xl': 36px, // Extra large
  '3xl': 40px, // Full HD
  '4xl': 48px  // Ultra-wide
);

$container-max-width: (
  xs: 100%,    // Full width on mobile
  sm: 100%,    // Full width on mobile landscape
  md: 100%,    // Full width on tablet
  lg: 100%,    // Full width on tablet landscape
  xl: 1280px,  // Constrained on desktop
  '2xl': 1536px,
  '3xl': 1920px,
  '4xl': 3040px // Optimized for 3200x1200 with margins
);
```

### Responsive Grid Implementation

#### React Component (Stateless/Pure)
```tsx
import React from 'react';
import './Grid.scss';

interface GridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;  // 1-4 columns on mobile
    sm?: number;  // 1-8 columns on mobile landscape  
    md?: number;  // 1-12 columns on tablet
    lg?: number;  // 1-16 columns on desktop+
    xl?: number;
    '2xl'?: number;
    '3xl'?: number;
    '4xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Pure stateless component
export const Grid: React.FC<GridProps> = ({ 
  children, 
  columns = {}, 
  gap = 'md',
  className = '' 
}) => {
  const columnClasses = Object.entries(columns)
    .map(([breakpoint, cols]) => `grid--cols-${breakpoint}-${cols}`)
    .join(' ');
    
  return (
    <div className={`grid grid--gap-${gap} ${columnClasses} ${className}`.trim()}>
      {children}
    </div>
  );
};

// Grid Item - Pure component
interface GridItemProps {
  children: React.ReactNode;
  span?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
    '3xl'?: number;
    '4xl'?: number;
  };
  className?: string;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  span = {},
  className = ''
}) => {
  const spanClasses = Object.entries(span)
    .map(([breakpoint, cols]) => `grid-item--span-${breakpoint}-${cols}`)
    .join(' ');
    
  return (
    <div className={`grid-item ${spanClasses} ${className}`.trim()}>
      {children}
    </div>
  );
};
```

#### SCSS Styles (Grid.scss)
```scss
@import '../styles/variables';
@import '../styles/mixins';

// Base grid styles
.grid {
  display: grid;
  width: 100%;
  
  // Default: 4 columns on mobile
  grid-template-columns: repeat(4, 1fr);
  
  // Mobile landscape: 8 columns
  @include breakpoint(sm) {
    grid-template-columns: repeat(8, 1fr);
  }
  
  // Tablet: 12 columns
  @include breakpoint(md) {
    grid-template-columns: repeat(12, 1fr);
  }
  
  // Desktop: Full 16 columns
  @include breakpoint(lg) {
    grid-template-columns: repeat(16, 1fr);
  }
  
  // Ultra-wide optimization
  @include breakpoint('4xl') {
    max-width: 3040px;
    margin: 0 auto;
  }
}

// Gap utilities
.grid--gap-sm { gap: 16px; }
.grid--gap-md { gap: 24px; }
.grid--gap-lg { gap: 32px; }
.grid--gap-xl { gap: 48px; }

// Responsive gap adjustments
@include breakpoint(sm) {
  .grid--gap-sm { gap: 20px; }
  .grid--gap-md { gap: 28px; }
  .grid--gap-lg { gap: 36px; }
  .grid--gap-xl { gap: 52px; }
}

@include breakpoint(lg) {
  .grid--gap-sm { gap: 24px; }
  .grid--gap-md { gap: 32px; }
  .grid--gap-lg { gap: 40px; }
  .grid--gap-xl { gap: 56px; }
}

@include breakpoint('4xl') {
  .grid--gap-sm { gap: 32px; }
  .grid--gap-md { gap: 40px; }
  .grid--gap-lg { gap: 48px; }
  .grid--gap-xl { gap: 64px; }
}

// Column count overrides
@each $breakpoint in map-keys($breakpoints) {
  @include breakpoint($breakpoint) {
    @for $i from 1 through 16 {
      .grid--cols-#{$breakpoint}-#{$i} {
        grid-template-columns: repeat(#{$i}, 1fr);
      }
    }
  }
}

// Grid item span utilities
.grid-item {
  // Span utilities for each breakpoint
  @each $breakpoint in map-keys($breakpoints) {
    @include breakpoint($breakpoint) {
      @for $i from 1 through 16 {
        &--span-#{$breakpoint}-#{$i} {
          grid-column: span #{$i};
        }
      }
    }
  }
}
  
```

## Layout Examples

### Dashboard Layout (16-column grid)
```tsx
// Pure component example
import React from 'react';
import { Grid, GridItem } from './components/Grid';
import './DashboardLayout.scss';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Grid 
        columns={{
          xs: 4,   // 4 columns on mobile
          sm: 8,   // 8 columns on mobile landscape
          md: 12,  // 12 columns on tablet
          lg: 16,  // Full 16 columns on desktop
          '4xl': 16 // Optimized for 3200x1200
        }}
        gap="lg"
      >
        {/* Sidebar - spans different columns based on breakpoint */}
        <GridItem 
          span={{
            xs: 4,  // Full width on mobile
            sm: 8,  // Full width on mobile landscape
            md: 3,  // 3/12 columns on tablet
            lg: 3,  // 3/16 columns on desktop
            '4xl': 2 // 2/16 columns on ultra-wide
          }}
          className="dashboard-sidebar"
        >
          {/* Sidebar content */}
        </GridItem>
        
        {/* Main content area */}
        <GridItem 
          span={{
            xs: 4,   // Full width on mobile
            sm: 8,   // Full width on mobile landscape
            md: 9,   // 9/12 columns on tablet
            lg: 13,  // 13/16 columns on desktop
            '4xl': 14 // 14/16 columns on ultra-wide
          }}
          className="dashboard-main"
        >
          {children}
        </GridItem>
      </Grid>
    </div>
  );
};

export default DashboardLayout;
```

### SCSS Mixins (_mixins.scss)
```scss
// Breakpoint mixin
@mixin breakpoint($size) {
  @if map-has-key($breakpoints, $size) {
    @media (min-width: map-get($breakpoints, $size)) {
      @content;
    }
  }
}

// Container mixin
@mixin container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  
  @include breakpoint(sm) { padding: 0 20px; }
  @include breakpoint(md) { padding: 0 24px; }
  @include breakpoint(lg) { padding: 0 32px; }
  @include breakpoint(xl) { 
    padding: 0 40px;
    max-width: map-get($container-max-width, xl);
  }
  @include breakpoint('2xl') { 
    max-width: map-get($container-max-width, '2xl');
  }
  @include breakpoint('3xl') { 
    max-width: map-get($container-max-width, '3xl');
  }
  @include breakpoint('4xl') { 
    padding: 0 80px;
    max-width: map-get($container-max-width, '4xl');
  }
}

// Grid span mixin
@mixin grid-span($columns) {
  grid-column: span #{$columns};
}

// Responsive property mixin
@mixin responsive-prop($property, $values) {
  @each $breakpoint, $value in $values {
    @if $breakpoint == 'xs' {
      #{$property}: $value;
    } @else {
      @include breakpoint($breakpoint) {
        #{$property}: $value;
      }
    }
  }
}
```

## Component Architecture Guidelines

### Pure Components
All layout components must be stateless and pure:
- No internal state (except forms)
- No side effects
- Predictable output based on props
- Optimized for re-rendering

### File Structure
```
components/
├── Grid/
│   ├── Grid.tsx        # Pure component
│   ├── Grid.scss       # Styles
│   ├── Grid.test.tsx   # Tests
│   └── index.ts        # Exports
├── Container/
│   ├── Container.tsx
│   ├── Container.scss
│   └── index.ts
└── Layout/
    ├── Layout.tsx
    ├── Layout.scss
    └── index.ts
```

---

[Next: Dark Mode →](./11-dark-mode.md)