# Spacing & Grid System

[← Back to Main Documentation](./Readme.md)

---

## 1. Spacing Scale

```scss
$spacing: (
  0: 0,
  px: 1px,
  0.5: 2px,
  1: 4px,
  1.5: 6px,
  2: 8px,
  2.5: 10px,
  3: 12px,
  3.5: 14px,
  4: 16px,
  5: 20px,
  6: 24px,
  7: 28px,
  8: 32px,
  9: 36px,
  10: 40px,
  11: 44px,
  12: 48px,
  14: 56px,
  16: 64px,
  20: 80px,
  24: 96px,
  28: 112px,
  32: 128px,
  36: 144px,
  40: 160px,
  44: 176px,
  48: 192px,
  52: 208px,
  56: 224px,
  60: 240px,
  64: 256px,
  72: 288px,
  80: 320px,
  96: 384px
);
```

## 2. Grid System: 16-Column Grid System

### Grid Configuration

```scss
$grid: (
  columns: 16,
  gap: (
    xs: 16px,    // Mobile
    sm: 20px,    // Small tablet
    md: 24px,    // Tablet
    lg: 28px,    // Desktop
    xl: 32px,    // Large desktop
    '2xl': 36px, // Ultra-wide
    '3xl': 40px, // 4K displays
    '4xl': 48px  // 5K+ displays
  ),
  container: (
    xs: '100%',   // < 640px
    sm: 640px,    // ≥ 640px
    md: 768px,    // ≥ 768px
    lg: 1024px,   // ≥ 1024px
    xl: 1280px,   // ≥ 1280px
    '2xl': 1536px,// ≥ 1536px
    '3xl': 1920px,// ≥ 1920px (Full HD)
    '4xl': 2560px,// ≥ 2560px (QHD)
    '5xl': 3200px // ≥ 3200px (Ultra-wide)
  ),
  margin: (
    xs: 16px,
    sm: 24px,
    md: 32px,
    lg: 48px,
    xl: 64px,
    '2xl': 80px,
    '3xl': 96px,
    '4xl': 128px,
    '5xl': 160px
  )
);
```

### Breakpoint System

```typescript
interface Breakpoints {
  xs: 0;      // Mobile portrait
  sm: 640;    // Mobile landscape
  md: 768;    // Tablet portrait
  lg: 1024;   // Tablet landscape / Small desktop
  xl: 1280;   // Desktop
  '2xl': 1536; // Large desktop
  '3xl': 1920; // Full HD
  '4xl': 2560; // QHD / 2K
  '5xl': 3200; // Ultra-wide / 4K+
}
```

### Column Spans by Breakpoint

```typescript
interface ColumnSpans {
  // Mobile (xs-sm): Full width layouts
  xs: {
    full: 16,
    half: 8,
    third: 5,  // ~5.33 columns
    quarter: 4
  },
  
  // Tablet (md-lg): 2-3 column layouts
  md: {
    sidebar: 4,   // 25% width
    content: 12,  // 75% width
    half: 8,      // 50% width
    third: 5,     // ~31% width
    twoThirds: 11 // ~69% width
  },
  
  // Desktop (xl-2xl): Complex layouts
  xl: {
    sidebar: 3,    // ~19% width
    content: 10,   // ~62% width
    aside: 3,      // ~19% width
    half: 8,       // 50% width
    third: 5,      // ~31% width
    quarter: 4,    // 25% width
    twoThirds: 11, // ~69% width
    threeQuarters: 12 // 75% width
  },
  
  // Ultra-wide (3xl+): Multi-column layouts
  '3xl': {
    sidebar: 2,     // 12.5% width
    content: 8,     // 50% width
    secondary: 4,   // 25% width
    aside: 2,       // 12.5% width
    quarter: 4,     // 25% width
    third: 5,       // ~31% width
    half: 8,        // 50% width
    twoThirds: 11,  // ~69% width
    threeQuarters: 12 // 75% width
  }
}
```

## 3. Layout Patterns

### Responsive Layout Configurations

```typescript
interface LayoutPatterns {
  // Content widths
  'content-width': {
    xs: '100%',
    sm: '100%',
    md: '720px',
    lg: '960px',
    xl: '1140px',
    '2xl': '1320px',
    '3xl': '1600px',
    '4xl': '2000px',
    '5xl': '2400px'
  };
  
  // Sidebar widths
  'sidebar-width': {
    xs: '100%',    // Full width on mobile
    sm: '100%',    // Full width on small screens
    md: '280px',   // Fixed width on tablet
    lg: '320px',   // Slightly wider on desktop
    xl: '360px',   // Comfortable desktop size
    '2xl': '400px', // Large desktop
    '3xl': '440px', // Ultra-wide screens
    '4xl': '480px', // 4K displays
    '5xl': '520px'  // 5K+ displays
  };
  
  // Header/Footer heights
  'header-height': {
    xs: '56px',
    sm: '64px',
    md: '72px',
    lg: '80px',
    xl: '88px',
    '2xl': '96px'
  };
  
  'footer-height': {
    xs: '64px',
    sm: '72px',
    md: '80px',
    lg: '88px',
    xl: '96px',
    '2xl': '104px'
  };
  
  // Modal widths
  'modal-width': {
    xs: '95vw',
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px',
    '2xl': '1200px',
    '3xl': '1400px',
    '4xl': '1600px',
    full: '95vw'
  };
  
  // Card padding
  'card-padding': {
    xs: '12px',
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '28px',
    '2xl': '32px',
    '3xl': '36px',
    '4xl': '40px'
  };
}
```

### Common Layout Templates

```typescript
// Dashboard Layout (16-column grid)
interface DashboardLayout {
  xs: {
    nav: 16,      // Full width
    main: 16,     // Full width
    aside: 16     // Full width (stacked)
  };
  
  md: {
    nav: 4,       // 25% sidebar
    main: 12,     // 75% content
    aside: 0      // Hidden
  };
  
  xl: {
    nav: 3,       // ~19% sidebar
    main: 10,     // ~62% content
    aside: 3      // ~19% right panel
  };
  
  '3xl': {
    nav: 2,       // 12.5% compact sidebar
    main: 10,     // 62.5% main content
    aside: 4      // 25% extended aside
  };
  
  '5xl': {
    nav: 2,       // 12.5% sidebar
    main: 8,      // 50% centered content
    aside: 3,     // 18.75% right panel
    extra: 3      // 18.75% additional panel
  };
}

// Content Layout (16-column grid)
interface ContentLayout {
  xs: {
    content: 16   // Full width
  };
  
  md: {
    content: 14,  // Centered with 1 column margin each side
    offset: 1
  };
  
  lg: {
    content: 12,  // Centered with 2 column margins
    offset: 2
  };
  
  xl: {
    content: 10,  // Centered with 3 column margins
    offset: 3
  };
  
  '3xl': {
    content: 8,   // 50% centered for readability
    offset: 4
  };
  
  '5xl': {
    content: 6,   // 37.5% ultra-centered for optimal reading
    offset: 5
  };
}

// Multi-Column Card Layout
interface CardGridLayout {
  xs: 16,    // 1 card per row
  sm: 8,     // 2 cards per row
  md: 5,     // 3 cards per row (with gaps)
  lg: 4,     // 4 cards per row
  xl: 4,     // 4 cards per row
  '2xl': 3,  // 5 cards per row (with gaps)
  '3xl': 2,  // 8 cards per row
  '4xl': 2,  // 8 cards per row
  '5xl': 2   // 8 cards per row
}
```

### Grid Utilities

```scss
// Generate column classes
@for $i from 1 through 16 {
  .col-#{$i} {
    grid-column: span #{$i} / span #{$i};
  }
  
  .col-start-#{$i} {
    grid-column-start: #{$i};
  }
  
  .col-end-#{$i} {
    grid-column-end: #{$i};
  }
}

// Responsive column classes
@each $breakpoint, $min-width in $breakpoints {
  @media (min-width: #{$min-width}px) {
    @for $i from 1 through 16 {
      .#{$breakpoint}\\:col-#{$i} {
        grid-column: span #{$i} / span #{$i};
      }
    }
  }
}

// Grid container
.grid-16 {
  display: grid;
  grid-template-columns: repeat(16, minmax(0, 1fr));
}
```

### Usage Examples

```jsx
// Basic 16-column grid
<div className="grid-16 gap-6">
  <div className="col-3">Sidebar</div>
  <div className="col-10">Main Content</div>
  <div className="col-3">Aside</div>
</div>

// Responsive grid
<div className="grid-16 gap-4 lg:gap-8 3xl:gap-12">
  <div className="col-16 md:col-4 xl:col-3 3xl:col-2">
    Navigation
  </div>
  <div className="col-16 md:col-12 xl:col-10 3xl:col-10">
    Main Content
  </div>
  <div className="hidden xl:block xl:col-3 3xl:col-4">
    Additional Info
  </div>
</div>

// Card grid with 16-column system
<div className="grid-16 gap-6">
  {cards.map(card => (
    <div className="col-16 sm:col-8 md:col-5 lg:col-4 2xl:col-3 3xl:col-2">
      <Card {...card} />
    </div>
  ))}
</div>
```

## 4. Benefits of 16-Column Grid

### 1. **Better Division Options**
- 16 columns divide evenly by 2, 4, 8, and 16
- Allows for more flexible layouts (1/8, 3/16, 5/16, etc.)
- Better support for complex dashboard layouts

### 2. **Large Screen Optimization**
- More granular control on screens > 1920px
- Supports up to 8 columns of content on ultra-wide displays
- Better utilization of 4K and 5K screen real estate

### 3. **Improved Responsive Design**
- Smoother transitions between breakpoints
- More layout options at each screen size
- Better content density control

### 4. **Professional Applications**
- Ideal for data-heavy interfaces
- Better for multi-panel dashboards
- Supports complex enterprise layouts

---

[Next: Motion & Animation →](./06-motion-animation.md)