# Input Component

## Purpose
The Input component provides a flexible text input field with comprehensive validation, styling options, and accessibility features. It supports various input types, states, and integration with form libraries.

## Features
- Multiple visual variants (outlined, filled, glass, underline, gradient)
- Three size options (sm, md, lg)
- Support for different input types (text, email, password, number, tel, url)
- Loading states with spinner indicator
- Error states with helper text
- Floating label animations
- Visual effects (glow, pulse)
- Start and end adornments for icons
- Full keyboard navigation support
- Screen reader compatibility
- Responsive design

## Props Documentation

### Core Props
- `variant`: Visual variant of the input ('outlined' | 'filled' | 'glass' | 'underline' | 'gradient')
- `size`: Size of the input ('sm' | 'md' | 'lg')
- `label`: Label text for the input
- `placeholder`: Placeholder text
- `value`: Controlled input value
- `defaultValue`: Uncontrolled default value
- `onChange`: Change event handler

### State Props
- `disabled`: Disables the input
- `readOnly`: Makes input read-only
- `required`: Marks input as required
- `error`: Error state flag
- `helperText`: Helper or error text displayed below input
- `loading`: Shows loading spinner and disables input

### Visual Props
- `fullWidth`: Makes input take full container width (default: true)
- `floating`: Enables floating label animation
- `glow`: Adds glow effect on focus
- `pulse`: Adds pulse animation

### Adornment Props
- `startAdornment`: Content to display at the start of the input
- `endAdornment`: Content to display at the end of the input

## Usage Examples

### Basic Input
```tsx
<Input
  label="Name"
  placeholder="Enter your name"
  onChange={(e) => console.log(e.target.value)}
/>
```

### With Validation
```tsx
<Input
  label="Email"
  type="email"
  error={!isValidEmail}
  helperText={!isValidEmail ? "Please enter a valid email" : ""}
  required
/>
```

### With Icons
```tsx
<Input
  label="Search"
  placeholder="Search..."
  startAdornment={<SearchIcon />}
  endAdornment={
    <IconButton onClick={handleClear}>
      <ClearIcon />
    </IconButton>
  }
/>
```

### Password Input with Toggle
```tsx
<Input
  label="Password"
  type={showPassword ? 'text' : 'password'}
  startAdornment={<LockIcon />}
  endAdornment={
    <IconButton onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  }
/>
```

### Glass Morphism Style
```tsx
<Input
  variant="glass"
  label="Glass Input"
  glow
  floating
  placeholder="Modern glass effect"
/>
```

### Loading State
```tsx
<Input
  label="Processing"
  loading
  placeholder="Please wait..."
/>
```

## Accessibility

### ARIA Attributes
- Proper label association with `aria-label` or `aria-labelledby`
- `aria-invalid` for error states
- `aria-required` for required fields
- `aria-describedby` for helper text association

### Keyboard Navigation
- Tab/Shift+Tab for focus navigation
- Standard text editing keyboard shortcuts
- Enter key support for form submission

### Screen Reader Support
- Clear label announcements
- Error state announcements
- Helper text announcements
- Loading state announcements

## Best Practices

1. **Always provide labels**: Use the `label` prop for accessibility
2. **Error handling**: Provide clear error messages in `helperText`
3. **Loading states**: Use `loading` prop during async operations
4. **Icon usage**: Use meaningful icons that enhance UX
5. **Validation**: Validate on blur rather than on every keystroke
6. **Required fields**: Mark required fields clearly
7. **Placeholder text**: Use placeholders as hints, not labels
8. **Size consistency**: Use consistent sizes across forms

## Performance Considerations

- The component uses React.forwardRef for proper ref forwarding
- Styled components are memoized to prevent unnecessary re-renders
- Event handlers are optimized to prevent excessive updates
- Loading state properly disables interactions

## Browser Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes
- Touch-friendly interaction areas