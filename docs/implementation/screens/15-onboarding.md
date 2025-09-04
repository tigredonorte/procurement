## 27. Onboarding Flow

### 27.1 Welcome Screen (`/onboarding/welcome`)

**Layout:**
```typescript
Container {
  variant: 'centered',
  maxWidth: 'lg'
}

// Progress Indicator
Progress {
  variant: 'steps',
  currentStep: 1,
  totalSteps: 5,
  marginBottom: 'xl'
}

Card {
  variant: 'glass',
  padding: 'xl',
  align: 'center'
}

// Welcome Animation
LottieAnimation {
  src: '/animations/welcome.json',
  size: 'lg',
  autoplay: true
}

Heading {
  size: 'display-md',
  weight: 'bold',
  align: 'center'
}

Text {
  variant: 'lead',
  color: 'text-secondary',
  align: 'center',
  marginBottom: 'xl'
}

// Benefits List
List {
  variant: 'check',
  items: [
    'Automated product research',
    'Real-time data normalization',
    'Webhook integrations',
    'Export to multiple formats'
  ]
}

Button {
  variant: 'gradient',
  size: 'lg',
  text: 'Get Started',
  icon: <ArrowRightIcon />,
  glow: true
}
```

### 27.2 Organization Setup (`/onboarding/organization`)

**Layout:**
```typescript
Form {
  variant: 'vertical',
  gap: 'lg'
}

Input {
  label: 'Organization Name',
  placeholder: 'Enter your organization name',
  required: true,
  helper: 'This will be displayed on your dashboard'
}

Select {
  label: 'Organization Type',
  placeholder: 'Select type',
  options: [
    { value: 'hospital', label: 'Hospital' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'school', label: 'School' },
    { value: 'commercial', label: 'Commercial Building' },
    { value: 'other', label: 'Other' }
  ],
  required: true
}

Select {
  label: 'Organization Size',
  placeholder: 'Select size',
  options: [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '500+', label: '500+ employees' }
  ]
}

Textarea {
  label: 'Primary Use Case',
  placeholder: 'How will you use Requisio.com?',
  rows: 3,
  helper: 'Help us personalize your experience'
}
```

### 27.3 First Research Tutorial (`/onboarding/tutorial`)

**Layout:**
```typescript
// Interactive Tutorial Overlay
TutorialOverlay {
  steps: [
    {
      target: '.research-query-input',
      title: 'Enter Your Query',
      content: 'Start by typing what products you want to research',
      placement: 'bottom'
    },
    {
      target: '.data-sources-select',
      title: 'Choose Data Sources',
      content: 'Select which sources to search for products',
      placement: 'top'
    },
    {
      target: '.submit-research-btn',
      title: 'Start Research',
      content: 'Click here to begin the automated research process',
      placement: 'left'
    }
  ]
}

// Tutorial Controls
Stack {
  direction: 'row',
  justify: 'space-between',
  position: 'fixed',
  bottom: 'lg',
  right: 'lg'
}

Button {
  variant: 'ghost',
  text: 'Skip Tutorial'
}

ButtonGroup {
  buttons: [
    { variant: 'outline', text: 'Previous' },
    { variant: 'gradient', text: 'Next' }
  ]
}
```

### 27.4 Completion Screen (`/onboarding/complete`)

**Layout:**
```typescript
Card {
  variant: 'glass',
  padding: 'xl',
  align: 'center'
}

// Success Animation
LottieAnimation {
  src: '/animations/success.json',
  size: 'lg',
  autoplay: true,
  loop: false
}

Heading {
  size: 'display-md',
  weight: 'bold',
  align: 'center'
}

Text {
  variant: 'lead',
  color: 'text-secondary',
  align: 'center'
}

// Quick Actions
Grid {
  columns: { xs: 1, md: 3 },
  gap: 'lg',
  marginTop: 'xl'
}

ActionCard {
  icon: <SearchIcon />,
  title: 'Create Research',
  description: 'Start your first product research',
  href: '/app/research/new'
}

ActionCard {
  icon: <WebhookIcon />,
  title: 'Setup Webhooks',
  description: 'Configure webhook integrations',
  href: '/app/webhooks'
}

ActionCard {
  icon: <BookIcon />,
  title: 'View Docs',
  description: 'Learn more about features',
  href: '/docs'
}

Button {
  variant: 'gradient',
  size: 'lg',
  text: 'Go to Dashboard',
  icon: <HomeIcon />,
  glow: true,
  fullWidth: true
}
```

