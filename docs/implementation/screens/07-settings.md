## 8. Settings Screen (`/app/settings`)

**Settings Navigation:**
```typescript
// Tab Navigation
Tabs {
  variant: 'pills',
  orientation: { xs: 'horizontal', md: 'vertical' },
  tabs: [
    { value: 'profile', label: 'Profile', icon: <UserIcon /> },
    { value: 'organization', label: 'Organization', icon: <BuildingIcon /> },
    { value: 'notifications', label: 'Notifications', icon: <BellIcon /> },
    { value: 'security', label: 'Security', icon: <ShieldIcon /> },
    { value: 'api', label: 'API Keys', icon: <KeyIcon /> },
    { value: 'appearance', label: 'Appearance', icon: <PaletteIcon /> }
  ]
}
```

**Profile Tab:**
```typescript
Form {
  variant: 'horizontal',
  gap: 'lg'
}

// Avatar Upload
Stack {
  direction: 'column',
  align: 'center',
  gap: 'md'
}

Avatar {
  variant: 'circle',
  size: 'xl',
  src: userAvatar
}

Button {
  variant: 'outline',
  size: 'sm'
}

// Form Fields
Input {
  variant: 'outlined',
  label: 'First Name',
  defaultValue: user.firstName
}

Input {
  variant: 'outlined',
  label: 'Last Name',
  defaultValue: user.lastName
}

Input {
  variant: 'outlined',
  label: 'Email',
  type: 'email',
  defaultValue: user.email,
  disabled: true
}

// Save Button
Button {
  variant: 'gradient',
  size: 'md',
  alignSelf: 'flex-end'
}
```

**Appearance Tab:**
```typescript
// Theme Selection
RadioGroup {
  variant: 'cards',
  label: 'Theme Mode',
  options: [
    { value: 'light', label: 'Light', icon: <SunIcon /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
    { value: 'auto', label: 'System', icon: <ComputerIcon /> }
  ]
}

// Color Customization
ColorPicker {
  label: 'Primary Color',
  defaultValue: '#6366F1'
}

// Density Settings
Select {
  label: 'Interface Density',
  options: [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'comfortable', label: 'Comfortable' }
  ]
}
```

