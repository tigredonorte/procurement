# Typography

[← Back to Main Documentation](./Readme.md)

---

## Font Stack

```scss
$font-families: (
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  display: "'Poppins', 'Inter', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace"
);
```

## Type Scale

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

## Font Weights

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

[Next: Spacing & Grid System →](./05-spacing-grid.md)