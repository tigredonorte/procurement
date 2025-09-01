# Dark Mode Strategy

[← Back to Main Documentation](./Readme.md)

---

## Color Mode Implementation

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

## Dark Mode Transitions

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

## Component Dark Variants

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

[Next: Accessibility →](./12-accessibility.md)