## 9. Error & Empty States

**404 Page:**
```typescript
Container {
  variant: 'centered',
  minHeight: '100vh'
}

Stack {
  direction: 'column',
  align: 'center',
  gap: 'xl'
}

Heading {
  size: 'display-lg',
  weight: 'bold',
  color: 'primary'
}

Text {
  variant: 'body',
  color: 'text-secondary',
  align: 'center'
}

Button {
  variant: 'gradient',
  size: 'lg',
  icon: <HomeIcon />,
  glow: true
}
```

**Empty State:**
```typescript
Card {
  variant: 'glass',
  padding: 'xl',
  align: 'center'
}

Stack {
  direction: 'column',
  align: 'center',
  gap: 'lg'
}

// Illustration
Avatar {
  variant: 'rounded',
  size: '2xl',
  src: '/empty-state.svg'
}

Heading {
  size: 'text-xl',
  weight: 'semibold'
}

Text {
  variant: 'body',
  color: 'text-secondary'
}

Button {
  variant: 'gradient',
  size: 'md',
  icon: <PlusIcon />
}
```

## 10. Loading States

**Page Loading:**
```typescript
Container {
  variant: 'centered',
  minHeight: '50vh'
}

Stack {
  direction: 'column',
  align: 'center',
  gap: 'lg'
}

Spinner {
  size: 'lg',
  color: 'primary'
}

Text {
  variant: 'body',
  color: 'text-secondary'
}
```

**Skeleton Loading:**
```typescript
// For tables
Skeleton {
  variant: 'rectangular',
  height: '400px',
  animation: 'wave'
}

// For cards
Grid {
  columns: { xs: 1, md: 2, xl: 3 },
  gap: 'lg'
}

Skeleton {
  variant: 'rectangular',
  height: '200px',
  borderRadius: 'md'
}
```

These specifications provide a complete blueprint for implementing all MVP screens using the Requisio.com Design System components. Each screen maintains consistency with the design tokens, follows accessibility standards, and implements responsive behavior as defined in the ui/Readme.md document.

