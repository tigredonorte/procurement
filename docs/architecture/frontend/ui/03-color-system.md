# Color System

[← Back to Main Documentation](./Readme.md)

---

## Color Architecture

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

## Color Palettes

### Primary Palette - Indigo/Purple
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

### Secondary Palette - Cyan/Teal
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

### Neutral Palette - Slate
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

### Semantic Colors
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

### Gradient Definitions
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

## Functional Color Mapping

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

[Next: Typography →](./04-typography.md)