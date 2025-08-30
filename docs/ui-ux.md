# Product Research Aggregator - Design System
## Modern UI/UX Guidelines & Component Library Architecture

### Version 1.0.0 | December 2024

---

## Table of Contents
1. [Design Philosophy & Principles](#1-design-philosophy--principles)
2. [Visual Identity](#2-visual-identity)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Grid System](#5-spacing--grid-system)
6. [Motion & Animation](#6-motion--animation)
7. [Component Library Architecture](#7-component-library-architecture)
8. [Core Components](#8-core-components)
9. [Complex Components](#9-complex-components)
10. [Responsive Design](#10-responsive-design)
11. [Dark Mode Strategy](#11-dark-mode-strategy)
12. [Accessibility Standards](#12-accessibility-standards)
13. [Implementation Guidelines](#13-implementation-guidelines)

---

## 1. Design Philosophy & Principles

### 1.1 Core Philosophy
**"Intelligent Simplicity"** - Combining sophisticated data visualization with an intuitive, clean interface that makes complex research feel effortless.

### 1.2 Design Principles

#### **Clarity Through Contrast**
- Bold typography paired with generous whitespace
- High contrast between interactive and static elements
- Clear visual hierarchy using size, weight, and color

#### **Fluid Intelligence**
- Smooth micro-interactions that feel responsive and alive
- Predictive UI elements that anticipate user needs
- Progressive disclosure of complex features

#### **Data-Driven Aesthetics**
- Glassmorphic elements for data overlays
- Subtle gradients indicating data flow and processing states
- Neumorphic touches for interactive controls

#### **Accessible Innovation**
- WCAG AAA compliance without sacrificing visual appeal
- Inclusive design that works for all users
- Performance-first approach to animations

---

## 2. Visual Identity

### 2.1 Brand Personality
- **Professional**: Enterprise-ready appearance
- **Innovative**: Cutting-edge visual treatments
- **Trustworthy**: Consistent, reliable interface patterns
- **Efficient**: Streamlined workflows with minimal friction

### 2.2 Visual Style

```scss
// Core Visual Properties
$visual-style: (
  border-radius: (
    xs: 4px,
    sm: 8px,
    md: 12px,
    lg: 16px,
    xl: 24px,
    round: 9999px
  ),
  shadows: (
    xs: '0 2px 4px rgba(0,0,0,0.04)',
    sm: '0 4px 6px rgba(0,0,0,0.07)',
    md: '0 8px 16px rgba(0,0,0,0.08)',
    lg: '0 16px 32px rgba(0,0,0,0.10)',
    xl: '0 24px 48px rgba(0,0,0,0.12)',
    glow: '0 0 40px rgba(99,102,241,0.3)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)'
  ),
  blur: (
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)'
  ),
  glass: (
    light: 'background: rgba(255,255,255,0.7); backdrop-filter: blur(10px)',
    dark: 'background: rgba(17,24,39,0.7); backdrop-filter: blur(10px)'
  )
);
```

### 2.3 Design Treatments

#### **Glassmorphism**
- Semi-transparent backgrounds with backdrop blur
- Subtle borders with opacity
- Used for modals, cards, and overlays

#### **Gradients**
- Primary: Linear gradient from brand purple to blue
- Success: Emerald to teal
- Warning: Amber to orange
- Danger: Rose to red
- Mesh gradients for backgrounds

#### **Neumorphism (Soft UI)**
- Subtle use for toggles and buttons
- Light mode: Soft shadows with light sources from top-left
- Dark mode: Inverted shadow hierarchy

---

## 3. Color System

### 3.1 Color Architecture

```typescript
interface ColorSystem {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
  info: ColorScale;
  gradient: GradientPalette;
  semantic: SemanticColors;
}
```

### 3.2 Color Palettes

#### **Primary Palette - Indigo/Purple**
```scss
$primary: (
  50: #EEF2FF,   // Lightest
  100: #E0E7FF,
  200: #C7D2FE,
  300: #A5B4FC,
  400: #818CF8,
  500: #6366F1,  // Base
  600: #4F46E5,
  700: #4338CA,
  800: #3730A3,
  900: #312E81,
  950: #1E1B4B   // Darkest
);
```

#### **Secondary Palette - Cyan/Teal**
```scss
$secondary: (
  50: #ECFEFF,
  100: #CFFAFE,
  200: #A5F3FC,
  300: #67E8F9,
  400: #22D3EE,
  500: #06B6D4,  // Base
  600: #0891B2,
  700: #0E7490,
  800: #155E75,
  900: #164E63,
  950: #083344
);
```

#### **Neutral Palette - Slate**
```scss
$neutral: (
  50: #F8FAFC,
  100: #F1F5F9,
  200: #E2E8F0,
  300: #CBD5E1,
  400: #94A3B8,
  500: #64748B,
  600: #475569,
  700: #334155,
  800: #1E293B,
  900: #0F172A,
  950: #020617
);
```

#### **Semantic Colors**
```scss
$semantic: (
  success: (
    light: #10B981,  // Emerald-500
    dark: #34D399,   // Emerald-400
    bg-light: #D1FAE5,
    bg-dark: #064E3B
  ),
  warning: (
    light: #F59E0B,  // Amber-500
    dark: #FCD34D,   // Amber-300
    bg-light: #FEF3C7,
    bg-dark: #78350F
  ),
  danger: (
    light: #EF4444,  // Red-500
    dark: #F87171,   // Red-400
    bg-light: #FEE2E2,
    bg-dark: #7F1D1D
  ),
  info: (
    light: #3B82F6,  // Blue-500
    dark: #60A5FA,   // Blue-400
    bg-light: #DBEAFE,
    bg-dark: #1E3A8A
  )
);
```

#### **Gradient Definitions**
```scss
$gradients: (
  primary: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  secondary: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
  warning: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
  mesh-light: 'radial-gradient(at 40% 20%, hsla(280,100%,74%,0.1) 0px, transparent 50%),
               radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%),
               radial-gradient(at 0% 50%, hsla(355,100%,93%,0.1) 0px, transparent 50%)',
  mesh-dark: 'radial-gradient(at 40% 20%, hsla(280,100%,54%,0.2) 0px, transparent 50%),
              radial-gradient(at 80% 0%, hsla(189,100%,36%,0.15) 0px, transparent 50%),
              radial-gradient(at 0% 50%, hsla(355,100%,73%,0.1) 0px, transparent 50%)'
);
```

### 3.3 Functional Color Mapping

```typescript
interface FunctionalColors {
  // Backgrounds
  'bg-primary': 'var(--color-neutral-50)';
  'bg-secondary': 'var(--color-neutral-100)';
  'bg-tertiary': 'var(--color-neutral-200)';
  'bg-elevated': 'var(--color-white)';
  'bg-overlay': 'rgba(0,0,0,0.5)';
  'bg-glass': 'rgba(255,255,255,0.7)';
  
  // Text
  'text-primary': 'var(--color-neutral-900)';
  'text-secondary': 'var(--color-neutral-600)';
  'text-tertiary': 'var(--color-neutral-500)';
  'text-disabled': 'var(--color-neutral-400)';
  'text-inverse': 'var(--color-white)';
  
  // Borders
  'border-default': 'var(--color-neutral-200)';
  'border-hover': 'var(--color-neutral-300)';
  'border-focus': 'var(--color-primary-500)';
  'border-error': 'var(--color-danger-500)';
  
  // Interactive States
  'interactive-hover': 'var(--color-primary-50)';
  'interactive-active': 'var(--color-primary-100)';
  'interactive-selected': 'var(--color-primary-500)';
}
```

---

## 4. Typography

### 4.1 Font Stack

```scss
$font-families: (
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  display: "'Poppins', 'Inter', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace"
);
```

### 4.2 Type Scale

```scss
$type-scale: (
  // Display
  'display-2xl': (size: 72px, weight: 700, line-height: 1.1, tracking: -0.02em),
  'display-xl': (size: 60px, weight: 700, line-height: 1.1, tracking: -0.02em),
  'display-lg': (size: 48px, weight: 600, line-height: 1.2, tracking: -0.01em),
  'display-md': (size: 36px, weight: 600, line-height: 1.2, tracking: -0.01em),
  'display-sm': (size: 30px, weight: 600, line-height: 1.3, tracking: 0),
  'display-xs': (size: 24px, weight: 600, line-height: 1.3, tracking: 0),
  
  // Text
  'text-xl': (size: 20px, weight: 400, line-height: 1.5, tracking: 0),
  'text-lg': (size: 18px, weight: 400, line-height: 1.5, tracking: 0),
  'text-md': (size: 16px, weight: 400, line-height: 1.5, tracking: 0),
  'text-sm': (size: 14px, weight: 400, line-height: 1.5, tracking: 0),
  'text-xs': (size: 12px, weight: 400, line-height: 1.5, tracking: 0.01em),
  
  // Labels
  'label-lg': (size: 14px, weight: 500, line-height: 1.4, tracking: 0.01em),
  'label-md': (size: 12px, weight: 500, line-height: 1.4, tracking: 0.02em),
  'label-sm': (size: 11px, weight: 500, line-height: 1.4, tracking: 0.03em),
  
  // Code
  'code-lg': (size: 16px, weight: 400, line-height: 1.6, tracking: 0),
  'code-md': (size: 14px, weight: 400, line-height: 1.6, tracking: 0),
  'code-sm': (size: 12px, weight: 400, line-height: 1.6, tracking: 0)
);
```

### 4.3 Font Weights

```scss
$font-weights: (
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900
);
```

---

## 5. Spacing & Grid System

### 5.1 Spacing Scale

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

### 5.2 Grid System

```scss
$grid: (
  columns: 12,
  gap: (
    xs: 16px,
    sm: 20px,
    md: 24px,
    lg: 32px,
    xl: 40px
  ),
  container: (
    xs: '100%',
    sm: 640px,
    md: 768px,
    lg: 1024px,
    xl: 1280px,
    '2xl': 1536px
  ),
  margin: (
    xs: 16px,
    sm: 24px,
    md: 32px,
    lg: 48px,
    xl: 64px,
    '2xl': 80px
  )
);
```

### 5.3 Layout Patterns

```typescript
interface LayoutPatterns {
  'content-width': '720px';
  'sidebar-width': '280px';
  'header-height': '64px';
  'footer-height': '80px';
  'modal-width': {
    sm: '400px';
    md: '600px';
    lg: '800px';
    xl: '1000px';
    full: '95vw';
  };
  'card-padding': {
    sm: '16px';
    md: '24px';
    lg: '32px';
  };
}
```

---

## 6. Motion & Animation

### 6.1 Animation Principles

- **Purposeful**: Every animation should have a clear purpose
- **Fast**: Keep durations under 400ms for micro-interactions
- **Smooth**: Use cubic-bezier easing for natural motion
- **Consistent**: Maintain timing across similar interactions

### 6.2 Duration Scale

```scss
$duration: (
  instant: 0ms,
  fast: 150ms,
  normal: 250ms,
  slow: 350ms,
  slower: 500ms,
  slowest: 700ms
);
```

### 6.3 Easing Functions

```scss
$easing: (
  linear: 'linear',
  ease-in: 'cubic-bezier(0.4, 0, 1, 1)',
  ease-out: 'cubic-bezier(0, 0, 0.2, 1)',
  ease-in-out: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.5, 1.5, 0.5, 1)',
  smooth: 'cubic-bezier(0.37, 0, 0.63, 1)'
);
```

### 6.4 Animation Presets

```typescript
const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 250
  },
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: 350
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: 200
  },
  shimmer: {
    from: { backgroundPosition: '-200% 0' },
    to: { backgroundPosition: '200% 0' },
    duration: 1500,
    repeat: 'infinite'
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    duration: 2000,
    repeat: 'infinite'
  }
};
```

---

## 7. Component Library Architecture

### 7.1 Library Structure

```typescript
// Core wrapper around Material UI
interface PRAUIProvider {
  theme: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  density?: 'compact' | 'normal' | 'comfortable';
}
```

### 7.2 Component API Pattern

```typescript
// Example: Button Component wrapping MUI
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface PRAButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'glass' | 'gradient';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  glow?: boolean;
  pulse?: boolean;
}

const PRAButton: React.FC<PRAButtonProps> = ({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  loading = false,
  glow = false,
  pulse = false,
  ...props
}) => {
  // Custom styling logic
  const customStyles = generateButtonStyles({ variant, color, size, glow, pulse });
  
  return (
    <MuiButton
      {...props}
      sx={customStyles}
      disabled={loading || props.disabled}
    >
      {loading ? <Spinner size={size} /> : props.children}
    </MuiButton>
  );
};
```

### 7.3 Theme Provider Implementation

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const createPRATheme = (mode: 'light' | 'dark', customization?: ThemeCustomization) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: customization?.primaryColor || '#6366F1',
        light: '#818CF8',
        dark: '#4338CA',
        contrastText: '#FFFFFF'
      },
      secondary: {
        main: customization?.secondaryColor || '#06B6D4',
        light: '#22D3EE',
        dark: '#0E7490',
        contrastText: '#FFFFFF'
      },
      background: {
        default: mode === 'light' ? '#F8FAFC' : '#0F172A',
        paper: mode === 'light' ? '#FFFFFF' : '#1E293B'
      }
    },
    typography: {
      fontFamily: customization?.fontFamily || 'Inter, sans-serif',
      h1: { ...typeScale['display-xl'] },
      h2: { ...typeScale['display-lg'] },
      h3: { ...typeScale['display-md'] },
      h4: { ...typeScale['display-sm'] },
      h5: { ...typeScale['display-xs'] },
      h6: { ...typeScale['text-xl'] },
      body1: { ...typeScale['text-md'] },
      body2: { ...typeScale['text-sm'] }
    },
    shape: {
      borderRadius: radiusMap[customization?.borderRadius || 'md']
    },
    components: {
      // Override all MUI components here
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }
      }
    }
  });
};
```

---

## 8. Core Components Library

### 8.1 Complete Component List

Our UI library provides a comprehensive set of components, fully wrapping Material UI with custom styling and enhanced functionality. Below is the complete list organized by category:

#### **Layout Components**

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAAccordion** | Expandable content panels | `default`, `glass`, `bordered`, `separated` |
| **PRACard** | Content container | `elevated`, `outlined`, `glass`, `gradient`, `neumorphic` |
| **PRACollapsible** | Collapsible content area | `default`, `smooth`, `spring` |
| **PRADrawer** | Side panel overlay | `left`, `right`, `top`, `bottom`, `glass` |
| **PRAResizable** | Resizable container | `horizontal`, `vertical`, `both` |
| **PRASeparator** | Visual divider | `solid`, `dashed`, `dotted`, `gradient` |
| **PRASidebar** | Navigation sidebar | `fixed`, `collapsible`, `floating`, `glass` |
| **PRASkeleton** | Loading placeholder | `text`, `circular`, `rectangular`, `wave` |
| **PRASpacer** | Flexible spacing | Fixed sizes from `xs` to `xl` |

#### **Navigation Components**

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRABreadcrumbs** | Navigation path | `default`, `slash`, `arrow`, `chevron` |
| **PRAContextMenu** | Right-click menu | `default`, `glass`, `dark` |
| **PRADropdownMenu** | Dropdown options | `default`, `glass`, `minimal` |
| **PRANavigationMenu** | Main navigation | `horizontal`, `vertical`, `mega` |
| **PRAPagination** | Page navigation | `default`, `rounded`, `dots`, `minimal` |
| **PRAScrollArea** | Custom scrollbar area | `auto`, `always`, `hover`, `hidden` |
| **PRATabs** | Tabbed interface | `default`, `pills`, `underline`, `enclosed` |

#### **Form Components**

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAButton** | Interactive button | `solid`, `outline`, `ghost`, `glass`, `gradient` |
| **PRACalendar** | Date picker calendar | `default`, `range`, `multi`, `year` |
| **PRACheckbox** | Checkbox input | `default`, `rounded`, `toggle`, `indeterminate` |
| **PRACommand** | Command palette | `default`, `floating`, `inline` |
| **PRAForm** | Form wrapper | `vertical`, `horizontal`, `inline`, `stepped` |
| **PRAInput** | Text input | `outlined`, `filled`, `glass`, `underline` |
| **PRAInputOTP** | OTP input field | `numeric`, `alphanumeric`, `masked` |
| **PRALabel** | Form label | `default`, `floating`, `required`, `optional` |
| **PRAMenubar** | Application menubar | `default`, `glass`, `minimal` |
| **PRARadioGroup** | Radio button group | `default`, `cards`, `buttons`, `segments` |
| **PRASelect** | Dropdown select | `default`, `searchable`, `multi`, `creatable` |
| **PRASlider** | Range slider | `default`, `range`, `marks`, `gradient` |
| **PRASwitch** | Toggle switch | `default`, `ios`, `android`, `label` |
| **PRATextarea** | Multi-line input | `default`, `autosize`, `resizable`, `rich` |
| **PRAToggle** | Toggle button | `default`, `outline`, `soft` |
| **PRAToggleGroup** | Toggle button group | `single`, `multiple`, `exclusive` |

#### **Data Display Components**

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAAlert** | Alert message | `info`, `success`, `warning`, `danger`, `glass` |
| **PRAAlertDialog** | Confirmation dialog | `default`, `destructive`, `glass` |
| **PRAAvatar** | User avatar | `circle`, `square`, `rounded`, `status` |
| **PRABadge** | Status indicator | `default`, `dot`, `count`, `gradient` |
| **PRACarousel** | Image/content carousel | `default`, `cards`, `fade`, `3d` |
| **PRAChart** | Data visualization | `line`, `bar`, `pie`, `area`, `scatter` |
| **PRAHoverCard** | Hover tooltip card | `default`, `glass`, `detailed` |
| **PRAPopover** | Popover container | `default`, `glass`, `arrow` |
| **PRAProgress** | Progress indicator | `linear`, `circular`, `segmented`, `gradient` |
| **PRASheet** | Bottom sheet | `default`, `glass`, `draggable` |
| **PRATable** | Data table | `default`, `striped`, `glass`, `minimal` |
| **PRATooltip** | Tooltip overlay | `default`, `dark`, `light`, `glass` |

#### **Feedback Components**

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRADialog** | Modal dialog | `default`, `glass`, `fullscreen`, `drawer` |
| **PRAModal** | Modal overlay | `center`, `top`, `bottom`, `glass` |
| **PRAStackedModal** | GTM-style nested dialogs | `fullscreen`, `slide`, `wizard` |
| **PRASonner** | Stacked notifications | `default`, `glass`, `minimal` |
| **PRAToast** | Toast notification | `default`, `success`, `error`, `promise` |

#### **Typography Components**

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAText** | Text wrapper | `body`, `heading`, `caption`, `code` |
| **PRAHeading** | Heading element | `h1` through `h6`, `display` |
| **PRAParagraph** | Paragraph text | `default`, `lead`, `muted`, `small` |
| **PRACode** | Code display | `inline`, `block`, `highlight` |
| **PRABlockquote** | Quote block | `default`, `bordered`, `citation` |

#### **Utility Components**

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAAspectRatio** | Aspect ratio container | `16:9`, `4:3`, `1:1`, `custom` |
| **PRAPortal** | Portal rendering | Target specific DOM nodes |
| **PRATransition** | Animation wrapper | `fade`, `slide`, `scale`, `collapse` |
| **PRAVirtualList** | Virtual scrolling | `fixed`, `variable`, `grid` |
| **PRAInfiniteScroll** | Infinite loading | `default`, `reverse`, `horizontal` |

### 8.2 Component Implementation Examples

#### **Button Component**

```typescript
interface PRAButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'glass' | 'gradient';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  glow?: boolean;
  pulse?: boolean;
  ripple?: boolean;
}

// Usage
<PRAButton 
  variant="gradient" 
  size="lg" 
  glow 
  icon={<SearchIcon />}
>
  Start Research
</PRAButton>
```

#### **Input Component**

```typescript
interface PRAInputProps {
  variant?: 'outlined' | 'filled' | 'glass' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  icon?: React.ReactNode;
  adornment?: {
    start?: React.ReactNode;
    end?: React.ReactNode;
  };
  floating?: boolean;
  clearable?: boolean;
  copyable?: boolean;
  masked?: string; // Input mask pattern
}

// Usage
<PRAInput
  variant="glass"
  label="Search Products"
  icon={<SearchIcon />}
  clearable
  floating
/>
```

#### **Card Component**

```typescript
interface PRACardProps {
  variant?: 'elevated' | 'outlined' | 'glass' | 'gradient' | 'neumorphic';
  interactive?: boolean;
  hover?: 'lift' | 'glow' | 'scale' | 'tilt' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  overflow?: 'visible' | 'hidden' | 'auto';
  glass?: {
    blur?: number;
    opacity?: number;
    color?: string;
  };
}

// Usage
<PRACard 
  variant="glass" 
  hover="glow"
  glass={{ blur: 20, opacity: 0.8 }}
>
  <PRACardHeader>
    <PRAHeading size="h4">Research Results</PRAHeading>
  </PRACardHeader>
  <PRACardContent>
    {/* Content */}
  </PRACardContent>
</PRACard>
```

#### **Modal/Dialog Component**

```typescript
interface PRAModalProps {
  open: boolean;
  onClose: () => void;
  variant?: 'default' | 'glass' | 'fullscreen' | 'drawer' | 'command';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  animation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'zoom';
  backdrop?: 'default' | 'blur' | 'dark' | 'transparent';
  closable?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  preserveScroll?: boolean;
}

// Usage
<PRAModal
  open={isOpen}
  onClose={handleClose}
  variant="glass"
  size="lg"
  animation="scale"
  backdrop="blur"
>
  <PRAModalHeader>
    <PRAHeading>Product Details</PRAHeading>
    <PRAModalClose />
  </PRAModalHeader>
  <PRAModalContent>
    {/* Modal content */}
  </PRAModalContent>
  <PRAModalFooter>
    <PRAButton variant="ghost" onClick={handleClose}>Cancel</PRAButton>
    <PRAButton variant="gradient" onClick={handleConfirm}>Confirm</PRAButton>
  </PRAModalFooter>
</PRAModal>
```

#### **Table Component**

```typescript
interface PRATableProps {
  variant?: 'default' | 'striped' | 'glass' | 'minimal' | 'bordered';
  density?: 'compact' | 'normal' | 'comfortable';
  stickyHeader?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    position?: 'top' | 'bottom' | 'both';
  };
  virtualized?: boolean;
  resizable?: boolean;
}

// Usage
<PRATable
  variant="glass"
  hoverable
  sortable
  pagination={{ enabled: true, pageSize: 20 }}
>
  <PRATableHeader>
    <PRATableRow>
      <PRATableHead>Product</PRATableHead>
      <PRATableHead>Price</PRATableHead>
      <PRATableHead>Status</PRATableHead>
    </PRATableRow>
  </PRATableHeader>
  <PRATableBody>
    {data.map(row => (
      <PRATableRow key={row.id}>
        <PRATableCell>{row.product}</PRATableCell>
        <PRATableCell>{row.price}</PRATableCell>
        <PRATableCell>
          <PRABadge variant="gradient">{row.status}</PRABadge>
        </PRATableCell>
      </PRATableRow>
    ))}
  </PRATableBody>
</PRATable>
```

#### **Stacked Modal Component (GTM-Style)**

```typescript
interface PRAStackedModalProps {
  open: boolean;
  onClose: () => void;
  variant?: 'fullscreen' | 'slide' | 'wizard';
  children: React.ReactNode;
  // Stack management
  level?: number; // Current nesting level
  maxDepth?: number; // Maximum allowed depth (default: 3)
  parentId?: string; // Reference to parent modal
  // Behavior
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  preserveScroll?: boolean;
  returnFocusTo?: HTMLElement;
  // Navigation
  onBack?: () => void;
  showBackButton?: boolean;
  navigationTitle?: string;
  // Animation
  animation?: 'slide-up' | 'slide-right' | 'fade-scale';
  animationDuration?: number;
}

interface StackedModalManager {
  stack: ModalStackItem[];
  push: (modal: ModalStackItem) => void;
  pop: () => void;
  clear: () => void;
  getCurrentLevel: () => number;
  getActiveModal: () => ModalStackItem | null;
}

// Implementation with context for stack management
const StackedModalContext = React.createContext<StackedModalManager | null>(null);

export const PRAStackedModalProvider: React.FC = ({ children }) => {
  const [stack, setStack] = useState<ModalStackItem[]>([]);
  
  const manager: StackedModalManager = {
    stack,
    push: (modal) => {
      setStack(prev => [...prev, { ...modal, level: prev.length }]);
      // Lock body scroll for new layer
      document.body.style.overflow = 'hidden';
      // Set aria-hidden on previous layers
      setPreviousLayersInert(prev.length);
    },
    pop: () => {
      setStack(prev => {
        const newStack = prev.slice(0, -1);
        if (newStack.length === 0) {
          document.body.style.overflow = '';
        }
        restorePreviousLayerFocus(newStack.length);
        return newStack;
      });
    },
    clear: () => {
      setStack([]);
      document.body.style.overflow = '';
      restoreAllLayersFocus();
    },
    getCurrentLevel: () => stack.length - 1,
    getActiveModal: () => stack[stack.length - 1] || null
  };
  
  return (
    <StackedModalContext.Provider value={manager}>
      {children}
      <StackedModalRenderer />
    </StackedModalContext.Provider>
  );
};

// The actual modal component
export const PRAStackedModal: React.FC<PRAStackedModalProps> = ({
  open,
  onClose,
  variant = 'fullscreen',
  children,
  level = 0,
  maxDepth = 3,
  showBackButton = true,
  navigationTitle,
  onBack,
  animation = 'slide-up',
  animationDuration = 300,
  closeOnEscape = true,
  closeOnBackdrop = false,
  ...props
}) => {
  const manager = useContext(StackedModalContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Focus management
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      manager?.push({
        id: generateId(),
        level,
        ref: modalRef.current,
        onClose
      });
      
      // Focus trap setup
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
    
    return () => {
      if (open && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);
  
  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        const activeModal = manager?.getActiveModal();
        if (activeModal?.id === props.parentId) {
          onClose();
        }
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, closeOnEscape, onClose]);
  
  // Check depth limit
  if (level >= maxDepth) {
    console.warn(`Maximum modal depth (${maxDepth}) reached. Consider using a wizard pattern instead.`);
    return null;
  }
  
  if (!open) return null;
  
  return (
    <Portal>
      <div
        className={`pra-stacked-modal-backdrop ${variant}`}
        style={{
          zIndex: 1000 + (level * 10),
          backgroundColor: level === 0 
            ? 'rgba(0, 0, 0, 0.5)' 
            : 'rgba(0, 0, 0, 0.2)'
        }}
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden={level > 0}
      />
      
      <div
        ref={modalRef}
        className={`pra-stacked-modal ${variant} ${animation}`}
        style={{
          zIndex: 1001 + (level * 10),
          animationDuration: `${animationDuration}ms`
        }}
        role="dialog"
        aria-modal="true"
        aria-label={navigationTitle || 'Modal dialog'}
      >
        {/* Header with navigation */}
        {(variant === 'fullscreen' || variant === 'slide') && (
          <div className="pra-stacked-modal-header">
            {showBackButton && level > 0 && (
              <PRAButton
                variant="ghost"
                size="sm"
                icon={<ChevronLeftIcon />}
                onClick={onBack || onClose}
                aria-label="Go back"
              >
                Back
              </PRAButton>
            )}
            
            {navigationTitle && (
              <h2 className="pra-stacked-modal-title">
                {navigationTitle}
              </h2>
            )}
            
            <PRAButton
              variant="ghost"
              size="sm"
              icon={<CloseIcon />}
              onClick={onClose}
              aria-label="Close dialog"
            />
          </div>
        )}
        
        {/* Breadcrumb for deep nesting */}
        {level > 1 && (
          <div className="pra-stacked-modal-breadcrumb">
            <PRABreadcrumbs>
              {Array.from({ length: level + 1 }).map((_, i) => (
                <PRABreadcrumbItem key={i}>
                  Step {i + 1}
                </PRABreadcrumbItem>
              ))}
            </PRABreadcrumbs>
          </div>
        )}
        
        {/* Content */}
        <div className="pra-stacked-modal-content">
          {children}
        </div>
      </div>
    </Portal>
  );
};

// Styles for stacked modal
const stackedModalStyles = {
  '.pra-stacked-modal': {
    '&.fullscreen': {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--bg-elevated)',
      display: 'flex',
      flexDirection: 'column',
      
      '&.slide-up': {
        animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      '&.slide-right': {
        animation: 'slideRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      '@media (min-width: 768px)': {
        // On larger screens, add margin for visual hierarchy
        '&[data-level="1"]': {
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        },
        '&[data-level="2"]': {
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px',
          borderRadius: '12px',
          boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
        }
      }
    },
    
    '&.slide': {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '90%',
      maxWidth: '600px',
      background: 'var(--bg-elevated)',
      boxShadow: '-10px 0 40px rgba(0,0,0,0.2)',
      transform: 'translateX(0)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      
      '&.entering': {
        transform: 'translateX(100%)',
      },
      
      '&.exiting': {
        transform: 'translateX(100%)',
      }
    },
    
    '&.wizard': {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      background: 'var(--bg-elevated)',
      borderRadius: '16px',
      boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
    }
  },
  
  '.pra-stacked-modal-header': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)',
  },
  
  '.pra-stacked-modal-content': {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
    
    // Smooth scrolling
    scrollBehavior: 'smooth',
    
    // Custom scrollbar
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'var(--bg-secondary)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--color-neutral-400)',
      borderRadius: '4px',
      
      '&:hover': {
        background: 'var(--color-neutral-500)',
      }
    }
  },
  
  // Animations
  '@keyframes slideUp': {
    from: {
      transform: 'translateY(100%)',
      opacity: 0,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    }
  },
  
  '@keyframes slideRight': {
    from: {
      transform: 'translateX(-100%)',
      opacity: 0,
    },
    to: {
      transform: 'translateX(0)',
      opacity: 1,
    }
  },
  
  '@keyframes fadeScale': {
    from: {
      transform: 'scale(0.95)',
      opacity: 0,
    },
    to: {
      transform: 'scale(1)',
      opacity: 1,
    }
  }
};

// Usage Example
const ResearchFlowExample = () => {
  const [modals, setModals] = useState({
    main: false,
    details: false,
    configure: false
  });
  
  return (
    <PRAStackedModalProvider>
      {/* Main Research Modal */}
      <PRAStackedModal
        open={modals.main}
        onClose={() => setModals({ ...modals, main: false })}
        variant="fullscreen"
        navigationTitle="New Research"
        level={0}
      >
        <PRAForm>
          <PRAInput label="Research Query" />
          <PRAButton 
            variant="gradient"
            onClick={() => setModals({ ...modals, details: true })}
          >
            Advanced Settings
          </PRAButton>
        </PRAForm>
        
        {/* Nested Details Modal */}
        <PRAStackedModal
          open={modals.details}
          onClose={() => setModals({ ...modals, details: false })}
          onBack={() => setModals({ ...modals, details: false })}
          variant="fullscreen"
          navigationTitle="Advanced Settings"
          level={1}
        >
          <PRAForm>
            <PRASelect label="Data Sources" multiple />
            <PRASlider label="Result Count" min={10} max={100} />
            <PRAButton
              variant="outline"
              onClick={() => setModals({ ...modals, configure: true })}
            >
              Configure Sources
            </PRAButton>
          </PRAForm>
          
          {/* Deeply Nested Configuration Modal */}
          <PRAStackedModal
            open={modals.configure}
            onClose={() => setModals({ ...modals, configure: false })}
            onBack={() => setModals({ ...modals, configure: false })}
            variant="slide"
            navigationTitle="Source Configuration"
            level={2}
          >
            <PRAAlert variant="warning">
              Maximum nesting depth reached. Consider using a wizard pattern for deeper flows.
            </PRAAlert>
            <PRAList>
              {/* Configuration options */}
            </PRAList>
          </PRAStackedModal>
        </PRAStackedModal>
      </PRAStackedModal>
    </PRAStackedModalProvider>
  );
};
```

### 8.5 Alternative Pattern: Wizard Modal

For flows deeper than 2-3 levels, we provide a wizard pattern as recommended:

```typescript
interface PRAWizardModalProps {
  open: boolean;
  onClose: () => void;
  steps: WizardStep[];
  currentStep?: number;
  onComplete: (data: any) => void;
  variant?: 'default' | 'vertical' | 'minimal';
  allowSkip?: boolean;
  allowJump?: boolean; // Jump to any step
}

interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  component: React.ComponentType<WizardStepProps>;
  validation?: (data: any) => boolean | Promise<boolean>;
  canSkip?: boolean;
}

export const PRAWizardModal: React.FC<PRAWizardModalProps> = ({
  open,
  onClose,
  steps,
  currentStep = 0,
  onComplete,
  variant = 'default',
  allowSkip = false,
  allowJump = false
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [wizardData, setWizardData] = useState({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleNext = async () => {
    const step = steps[activeStep];
    if (step.validation) {
      const isValid = await step.validation(wizardData);
      if (!isValid) {
        setErrors({ [step.id]: 'Please complete this step before proceeding' });
        return;
      }
    }
    
    if (activeStep === steps.length - 1) {
      onComplete(wizardData);
      onClose();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
  };
  
  const handleJumpToStep = (stepIndex: number) => {
    if (allowJump || stepIndex < activeStep) {
      setActiveStep(stepIndex);
    }
  };
  
  return (
    <PRAModal
      open={open}
      onClose={onClose}
      size="lg"
      variant="glass"
    >
      <div className="pra-wizard-modal">
        {/* Progress indicator */}
        <div className="pra-wizard-progress">
          <PRAProgress 
            value={(activeStep + 1) / steps.length * 100}
            variant="gradient"
          />
          <div className="pra-wizard-steps">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`pra-wizard-step ${
                  index === activeStep ? 'active' : ''
                } ${index < activeStep ? 'completed' : ''}`}
                onClick={() => handleJumpToStep(index)}
              >
                <div className="step-indicator">
                  {index < activeStep ? <CheckIcon /> : index + 1}
                </div>
                <div className="step-label">
                  <span className="step-title">{step.title}</span>
                  {step.subtitle && (
                    <span className="step-subtitle">{step.subtitle}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Step content */}
        <div className="pra-wizard-content">
          {React.createElement(steps[activeStep].component, {
            data: wizardData,
            onUpdate: (data: any) => setWizardData({ ...wizardData, ...data }),
            errors: errors[steps[activeStep].id]
          })}
        </div>
        
        {/* Navigation */}
        <div className="pra-wizard-actions">
          <PRAButton
            variant="ghost"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </PRAButton>
          
          <div className="pra-wizard-actions-right">
            {allowSkip && steps[activeStep].canSkip && (
              <PRAButton
                variant="ghost"
                onClick={() => setActiveStep(prev => prev + 1)}
              >
                Skip
              </PRAButton>
            )}
            
            <PRAButton
              variant="gradient"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
            </PRAButton>
          </div>
        </div>
      </div>
    </PRAModal>
  );
};
```

### 8.3 Component Styling System

All components follow a consistent styling system:

```typescript
// Base component style interface
interface ComponentStyleProps {
  // Spacing
  m?: SpacingValue;  // margin
  p?: SpacingValue;  // padding
  mx?: SpacingValue; // margin horizontal
  my?: SpacingValue; // margin vertical
  px?: SpacingValue; // padding horizontal
  py?: SpacingValue; // padding vertical
  
  // Display
  display?: 'block' | 'inline' | 'flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  
  // Sizing
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  
  // Flexbox/Grid
  flex?: string | number;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: SpacingValue;
  
  // Visual
  bg?: ColorValue;
  color?: ColorValue;
  border?: string;
  borderRadius?: RadiusValue;
  shadow?: ShadowValue;
  opacity?: number;
  
  // Animation
  animate?: boolean;
  transition?: string;
  transform?: string;
  
  // Responsive
  responsive?: {
    xs?: Partial<ComponentStyleProps>;
    sm?: Partial<ComponentStyleProps>;
    md?: Partial<ComponentStyleProps>;
    lg?: Partial<ComponentStyleProps>;
    xl?: Partial<ComponentStyleProps>;
  };
}
```

### 8.4 Component Composition

Components can be composed for complex UI patterns:

```typescript
// Research Card Composition
<PRACard variant="glass" hover="lift">
  <PRACardHeader>
    <PRAAvatar src={user.avatar} status="online" />
    <PRAStack direction="column" gap={1}>
      <PRAHeading size="h5">{research.title}</PRAHeading>
      <PRAText variant="muted">{research.date}</PRAText>
    </PRAStack>
    <PRADropdownMenu>
      <PRAMenuItem icon={<EditIcon />}>Edit</PRAMenuItem>
      <PRAMenuItem icon={<DeleteIcon />}>Delete</PRAMenuItem>
    </PRADropdownMenu>
  </PRACardHeader>
  
  <PRACardContent>
    <PRAProgress value={research.progress} variant="gradient" />
    <PRAText>{research.description}</PRAText>
  </PRACardContent>
  
  <PRACardFooter>
    <PRAButtonGroup>
      <PRAButton variant="ghost" size="sm">Cancel</PRAButton>
      <PRAButton variant="gradient" size="sm">View Results</PRAButton>
    </PRAButtonGroup>
  </PRACardFooter>
</PRACard>
```

---

## 9. Complex Components

### 9.1 Data Table Component

```typescript
interface PRADataTableProps {
  variant?: 'default' | 'striped' | 'glass' | 'minimal';
  density?: 'compact' | 'normal' | 'comfortable';
  stickyHeader?: boolean;
  enhancedHover?: boolean;
  sortable?: boolean;
  selectable?: boolean;
}

const tableStyles = {
  glass: {
    '& .MuiTableContainer-root': {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px'
    },
    '& .MuiTableHead-root': {
      background: 'rgba(99,102,241,0.05)'
    },
    '& .MuiTableRow-root:hover': {
      background: 'rgba(99,102,241,0.03)'
    }
  },
  striped: {
    '& .MuiTableRow-root:nth-of-type(even)': {
      background: 'var(--color-neutral-50)'
    }
  }
};
```

### 9.2 Chart Component

```typescript
interface PRAChartProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar';
  variant?: 'default' | 'gradient' | 'glass' | 'minimal';
  animated?: boolean;
  interactive?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

const chartTheme = {
  gradient: {
    colors: [
      'rgba(99, 102, 241, 1)',
      'rgba(139, 92, 246, 1)',
      'rgba(6, 182, 212, 1)',
      'rgba(34, 211, 238, 1)'
    ],
    gradients: true,
    tooltip: {
      background: 'rgba(17, 24, 39, 0.9)',
      backdropFilter: 'blur(10px)'
    }
  }
};
```

### 9.3 Navigation Component

```typescript
interface PRANavigationProps {
  variant?: 'sidebar' | 'top' | 'bottom' | 'floating';
  style?: 'default' | 'glass' | 'gradient' | 'minimal';
  collapsible?: boolean;
  sticky?: boolean;
}

const navigationStyles = {
  floating: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(17, 24, 39, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '8px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  glass: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255,255,255,0.1)'
  }
};
```

### 9.4 Form Component

```typescript
interface PRAFormProps {
  variant?: 'default' | 'floating' | 'stepped' | 'wizard';
  layout?: 'vertical' | 'horizontal' | 'inline';
  validation?: 'immediate' | 'onBlur' | 'onSubmit';
  enhanced?: boolean; // Advanced animations and interactions
}

const formStyles = {
  floating: {
    '& .MuiFormControl-root': {
      '& .MuiInputLabel-root': {
        transform: 'translateY(16px)',
        '&.Mui-focused, &.MuiFormLabel-filled': {
          transform: 'translateY(-20px) scale(0.85)',
          background: 'var(--bg-primary)',
          padding: '0 8px'
        }
      }
    }
  },
  wizard: {
    '& .form-step': {
      animation: 'slideIn 0.3s ease-out'
    },
    '& .step-indicator': {
      background: 'linear-gradient(90deg, var(--color-primary) var(--progress), var(--color-neutral-200) var(--progress))'
    }
  }
};
```

---

## 10. Responsive Design

### 10.1 Breakpoint System

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

### 10.2 Responsive Patterns

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

### 10.3 Mobile-First Approach

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

### 10.4 Responsive Grid

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

## 11. Dark Mode Strategy

### 11.1 Color Mode Implementation

```typescript
interface ThemeMode {
  light: ThemeConfig;
  dark: ThemeConfig;
  auto: 'system'; // Follow system preference
}

const darkModeColors = {
  // Backgrounds
  'bg-primary': '#0F172A',
  'bg-secondary': '#1E293B',
  'bg-tertiary': '#334155',
  'bg-elevated': '#1E293B',
  'bg-glass': 'rgba(30, 41, 59, 0.7)',
  
  // Text
  'text-primary': '#F1F5F9',
  'text-secondary': '#CBD5E1',
  'text-tertiary': '#94A3B8',
  
  // Borders
  'border-default': '#334155',
  'border-hover': '#475569',
  
  // Semantic adjustments
  'primary': '#818CF8',  // Lighter for better contrast
  'secondary': '#22D3EE'
};
```

### 11.2 Dark Mode Transitions

```scss
// Smooth color transitions
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

// Prevent transition on theme toggle for better UX
html.theme-transitioning * {
  transition: none !important;
}
```

### 11.3 Component Dark Variants

```typescript
const darkVariants = {
  card: {
    glass: {
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.1)'
    },
    elevated: {
      background: '#1E293B',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }
  },
  button: {
    gradient: {
      background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)'
    }
  },
  input: {
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.2)'
  }
};
```

---

## 12. Accessibility Standards

### 12.1 WCAG Compliance

```typescript
interface AccessibilityStandards {
  contrastRatio: {
    normal: 4.5;  // WCAG AA
    large: 3;     // WCAG AA for large text
    enhanced: 7;  // WCAG AAA
  };
  focusIndicator: {
    outline: '2px solid var(--color-primary)';
    outlineOffset: '2px';
  };
  minimumTouchTarget: '44px';
  animationReducedMotion: '@media (prefers-reduced-motion: reduce)';
}
```

### 12.2 Keyboard Navigation

```scss
// Focus styles
.pra-focusable {
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
}

// Skip navigation
.skip-nav {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  
  &:focus {
    top: 0;
  }
}
```

### 12.3 Screen Reader Support

```typescript
const AriaLabels = {
  navigation: 'Main navigation',
  search: 'Search products',
  filter: 'Filter results',
  sort: 'Sort by',
  pagination: 'Pagination controls',
  modal: 'Dialog window',
  loading: 'Loading content',
  error: 'Error message',
  success: 'Success message'
};

const AriaLive = {
  polite: 'polite',    // Non-critical updates
  assertive: 'assertive', // Important updates
  off: 'off'           // No announcement
};
```

---

## 13. Implementation Guidelines

### 13.1 Component Creation Pattern

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

### 13.2 Theme Customization API

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

### 13.3 Performance Optimization

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

### 13.4 Bundle Size Optimization

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

## Appendices

### A. Color Contrast Matrix

| Background | Text Color | Contrast Ratio | WCAG Level |
|------------|-----------|----------------|------------|
| White | Neutral-600 | 4.54:1 | AA |
| White | Neutral-700 | 7.24:1 | AAA |
| Primary-500 | White | 4.51:1 | AA |
| Dark-900 | White | 15.8:1 | AAA |
| Dark-800 | Neutral-300 | 9.2:1 | AAA |

### B. Component Size Matrix

| Component | XS | SM | MD | LG | XL |
|-----------|----|----|----|----|-----|
| Button Height | 28px | 32px | 36px | 40px | 48px |
| Input Height | 32px | 36px | 40px | 44px | 52px |
| Icon Size | 16px | 18px | 20px | 24px | 28px |
| Avatar Size | 24px | 32px | 40px | 48px | 64px |
| Chip Height | 20px | 24px | 28px | 32px | 36px |

### C. Z-Index Scale

```scss
$z-index: (
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal-backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  tour: 1090
);
```

### D. Export Structure

```typescript
// Main export from @pra/ui-library
export {
  // Provider
  PRAUIProvider,
  usePRATheme,
  
  // Core Components
  PRAButton,
  PRAInput,
  PRASelect,
  PRACheckbox,
  PRARadio,
  PRASwitch,
  
  // Layout Components
  PRAContainer,
  PRAGrid,
  PRAStack,
  PRASpacer,
  
  // Data Display
  PRACard,
  PRATable,
  PRAList,
  PRAAvatar,
  PRABadge,
  PRAChip,
  
  // Feedback
  PRAAlert,
  PRAToast,
  PRAProgress,
  PRASkeleton,
  PRASpinner,
  
  // Navigation
  PRANavbar,
  PRASidebar,
  PRABreadcrumb,
  PRATabs,
  PRAPagination,
  
  // Overlay
  PRAModal,
  PRADrawer,
  PRAPopover,
  PRATooltip,
  
  // Forms
  PRAForm,
  PRAFormField,
  PRAFormSection,
  
  // Charts
  PRAChart,
  PRASparkline,
  
  // Utilities
  PRAThemeCustomizer,
  PRAColorPicker,
  
  // Types
  type PRATheme,
  type PRAComponent,
  type PRAThemeCustomization
};
```

---

## Document Version Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-12-26 | Design System Team | Initial design system documentation |

## Review and Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Head of Design | | | |
| Lead Frontend Engineer | | | |
| Product Manager | | | |
| Accessibility Lead | | | |