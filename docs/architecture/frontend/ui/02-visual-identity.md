# Visual Identity

[← Back to Main Documentation](./Readme.md)

## Visual Style

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

## Design Treatments

### **Glassmorphism**
- Semi-transparent backgrounds with backdrop blur
- Subtle borders with opacity
- Used for modals, cards, and overlays

### **Gradients**
- Primary: Linear gradient from brand purple to blue
- Success: Emerald to teal
- Warning: Amber to orange
- Danger: Rose to red
- Mesh gradients for backgrounds

### **Neumorphism (Soft UI)**
- Subtle use for toggles and buttons
- Light mode: Soft shadows with light sources from top-left
- Dark mode: Inverted shadow hierarchy

## Application Examples

### Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}
```

### Gradient Button
```css
.gradient-button {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
}

.gradient-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}
```

### Neumorphic Input
```css
.neumorphic-input {
  background: #f0f0f0;
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 12px;
}
```

---

[Next: Color System →](./03-color-system.md)