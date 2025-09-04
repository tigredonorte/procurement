## 24. Research Progress & Real-time Updates

### 24.1 Research Progress Modal

**Layout:**
```typescript
Modal {
  open: isProcessing,
  variant: 'center',
  size: 'md',
  closeOnBackdrop: false
}

Stack {
  direction: 'column',
  align: 'center',
  gap: 'xl',
  padding: 'xl'
}

// Animated Icon
AnimatedIcon {
  variant: 'processing',
  size: 'xl'
}

Heading {
  size: 'text-xl',
  weight: 'semibold',
  align: 'center'
}

Text {
  variant: 'body',
  color: 'text-secondary',
  align: 'center'
}

// Progress Indicators
Progress {
  variant: 'circular',
  value: progress,
  size: 'lg',
  showValue: true
}

// Steps Progress
Stepper {
  variant: 'vertical',
  activeStep: currentStep,
  steps: [
    { label: 'Initializing', status: 'completed' },
    { label: 'Fetching data from sources', status: 'active' },
    { label: 'Processing results', status: 'pending' },
    { label: 'Normalizing data', status: 'pending' },
    { label: 'Generating report', status: 'pending' }
  ]
}

// Live Logs (collapsible)
Collapsible {
  trigger: Button {
    variant: 'ghost',
    size: 'sm',
    text: 'Show details'
  }
}

ScrollArea {
  maxHeight: '200px',
  variant: 'terminal'
}

Code {
  variant: 'block',
  language: 'log',
  text: processingLogs
}

// Action Buttons
Stack {
  direction: 'row',
  gap: 'md',
  justify: 'center'
}

Button {
  variant: 'outline',
  size: 'md',
  text: 'Run in Background'
}

Button {
  variant: 'ghost',
  size: 'md',
  text: 'Cancel',
  color: 'danger'
}
```

### 24.2 Live Research Updates (WebSocket)

**Component:**
```typescript
// Toast Notifications for Updates
Toast {
  variant: 'info',
  position: 'bottom-right',
  duration: 5000,
  title: 'Research Update',
  description: updateMessage,
  action: {
    label: 'View',
    onClick: navigateToResearch
  }
}

// Real-time Status Badge
Badge {
  variant: 'pulse', // Animated pulse effect
  color: statusColor,
  text: statusText
}
```

