# Accessibility Standards

[← Back to Main Documentation](./Readme.md)

---

## WCAG Compliance

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

## Keyboard Navigation

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

## Screen Reader Support

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

[Next: Implementation Guidelines →](./13-implementation-guidelines.md)