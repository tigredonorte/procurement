## 1. Authentication Screens

### 1.1 Login Screen (`/login`)

**Layout Structure:**
- Full-screen split layout (60/40 on desktop, full-screen on mobile)
- Left panel: Gradient mesh background with product research imagery
- Right panel: Authentication form

**Components:**
```typescript
// Container
Container {
  variant: 'full-screen',
  responsive: { xs: 'single', lg: 'split' }
}

// Left Panel (Desktop only)
Card {
  variant: 'gradient',
  background: 'mesh-light' // mesh-dark in dark mode
}

// Right Panel
Card {
  variant: 'glass',
  padding: { xs: 'md', lg: 'xl' },
  glass: { blur: 20, opacity: 0.8 }
}

// Logo
Heading {
  size: 'display-md',
  weight: 'bold',
  color: 'primary'
}

// Form Container
Form {
  variant: 'vertical',
  validation: 'onSubmit',
  gap: 'lg'
}

// Email Input
Input {
  variant: 'glass',
  size: 'lg',
  label: 'Email Address',
  type: 'email',
  icon: <MailIcon />,
  floating: true,
  required: true
}

// Password Input
Input {
  variant: 'glass',
  size: 'lg',
  label: 'Password',
  type: 'password',
  icon: <LockIcon />,
  floating: true,
  required: true
}

// Remember Me
Checkbox {
  variant: 'default',
  label: 'Remember me for 30 days'
}

// Submit Button
Button {
  variant: 'gradient',
  size: 'lg',
  fullWidth: true,
  loading: isSubmitting,
  glow: true
}

// Forgot Password Link
Button {
  variant: 'ghost',
  size: 'sm',
  color: 'primary'
}

// SSO Option (if configured)
Separator {
  variant: 'gradient',
  text: 'OR'
}

Button {
  variant: 'outline',
  size: 'lg',
  fullWidth: true,
  icon: <KeycloakIcon />
}
```

**Typography:**
- Heading: Display-md (36px), weight: 600
- Subheading: Text-lg (18px), color: text-secondary
- Form labels: Label-lg (14px), weight: 500
- Error messages: Text-sm (14px), color: danger

### 1.2 Registration Screen (`/register`)

Similar to login with additional fields:

```typescript
// Additional Inputs
Input {
  variant: 'glass',
  size: 'lg',
  label: 'First Name',
  icon: <UserIcon />,
  floating: true,
  required: true
}

Input {
  variant: 'glass',
  size: 'lg',
  label: 'Last Name',
  floating: true,
  required: true
}

Input {
  variant: 'glass',
  size: 'lg',
  label: 'Organization',
  icon: <BuildingIcon />,
  floating: true,
  required: true
}

Select {
  variant: 'default',
  size: 'lg',
  label: 'Organization Type',
  options: ['Hospital', 'Hotel', 'School', 'Commercial Building', 'Other'],
  required: true
}

// Terms Checkbox
Checkbox {
  variant: 'default',
  required: true,
  label: 'I agree to the Terms of Service and Privacy Policy'
}
```

