# Motion & Animation

[← Back to Main Documentation](./Readme.md)

---

## Animation Principles

- **Purposeful**: Every animation should have a clear purpose
- **Fast**: Keep durations under 400ms for micro-interactions
- **Smooth**: Use cubic-bezier easing for natural motion
- **Consistent**: Maintain timing across similar interactions

## Duration Scale

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

## Easing Functions

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

## Animation Presets

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

[Next: Component Library Architecture →](./07-component-architecture.md)