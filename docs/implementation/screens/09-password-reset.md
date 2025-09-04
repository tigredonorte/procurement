## 21. Password Reset Flow

### 21.1 Forgot Password Screen (`/forgot-password`)

**Layout:**
```typescript
// Container
Container {
  variant: 'centered',
  maxWidth: 'sm',
  minHeight: '100vh'
}

Card {
  variant: 'glass',
  padding: 'xl',
  glass: { blur: 20, opacity: 0.8 }
}

// Header
Stack {
  direction: 'column',
  align: 'center',
  gap: 'lg',
  marginBottom: 'xl'
}

Avatar {
  variant: 'rounded',
  size: 'lg',
  src: '/logo.svg'
}

Heading {
  size: 'display-sm',
  weight: 'semibold',
  align: 'center'
}

Text {
  variant: 'body',
  color: 'text-secondary',
  align: 'center'
}

// Form
Form {
  variant: 'vertical',
  validation: 'onSubmit',
  gap: 'lg'
}

Input {
  variant: 'glass',
  size: 'lg',
  label: 'Email Address',
  type: 'email',
  icon: <MailIcon />,
  placeholder: 'Enter your registered email',
  required: true,
  floating: true
}

// Success Message (after submission)
Alert {
  variant: 'success',
  title: 'Check your email',
  description: 'We've sent a password reset link to your email address'
}

// Submit Button
Button {
  variant: 'gradient',
  size: 'lg',
  fullWidth: true,
  loading: isSubmitting,
  glow: true
}

// Back to Login Link
Button {
  variant: 'ghost',
  size: 'sm',
  icon: <ArrowLeftIcon />,
  fullWidth: true
}
```

### 21.2 Reset Password Screen (`/reset-password/:token`)

**Layout:**
```typescript
// Similar container as forgot password
Card {
  variant: 'glass',
  padding: 'xl'
}

// Password Requirements
Alert {
  variant: 'info',
  title: 'Password Requirements',
  list: [
    'At least 8 characters',
    'One uppercase letter',
    'One lowercase letter',
    'One number',
    'One special character'
  ]
}

// Password Fields
Input {
  variant: 'glass',
  size: 'lg',
  label: 'New Password',
  type: 'password',
  icon: <LockIcon />,
  required: true,
  floating: true,
  strength: true // Show password strength meter
}

Input {
  variant: 'glass',
  size: 'lg',
  label: 'Confirm Password',
  type: 'password',
  icon: <LockIcon />,
  required: true,
  floating: true
}

// Password Strength Indicator
PasswordStrength {
  value: passwordStrength,
  showRequirements: true
}
```

