## 7. Webhook Configuration Screen (`/app/webhooks`)

**Webhook List:**
```typescript
// Page Header
Stack {
  direction: 'row',
  justify: 'space-between',
  align: 'center',
  marginBottom: 'xl'
}

Heading {
  size: 'display-sm',
  weight: 'semibold'
}

Button {
  variant: 'gradient',
  size: 'md',
  icon: <PlusIcon />,
  glow: true,
  onClick: () => openModal()
}

// Webhook Cards
Stack {
  direction: 'column',
  gap: 'lg'
}

// Individual Webhook Card
Card {
  variant: 'glass',
  hover: 'lift',
  padding: 'lg'
}

Grid {
  columns: { xs: 1, md: 3 },
  gap: 'md',
  align: 'center'
}

// URL Section
Stack {
  direction: 'column',
  gap: 'xs'
}

Text {
  variant: 'caption',
  color: 'text-secondary'
}

Code {
  variant: 'inline',
  copyable: true
}

// Events Section
Stack {
  direction: 'row',
  gap: 'sm'
}

Chip {
  variant: 'outline',
  size: 'sm'
}

// Status & Actions
Stack {
  direction: 'row',
  gap: 'md',
  align: 'center',
  justify: 'flex-end'
}

Switch {
  variant: 'default',
  size: 'md',
  label: 'Active'
}

Button {
  variant: 'ghost',
  size: 'sm',
  icon: <EditIcon />
}

Button {
  variant: 'ghost',
  size: 'sm',
  icon: <TrashIcon />,
  color: 'danger'
}
```

**Add/Edit Webhook Modal:**
```typescript
// Using Stacked Modal
StackedModal {
  open: isOpen,
  onClose: handleClose,
  variant: 'slide',
  navigationTitle: 'Configure Webhook',
  size: 'md'
}

// Modal Content
Form {
  variant: 'vertical',
  validation: 'onBlur',
  gap: 'lg'
}

// URL Input
Input {
  variant: 'glass',
  label: 'Webhook URL',
  placeholder: 'https://your-domain.com/webhook',
  helper: 'Must be a valid HTTPS endpoint',
  required: true,
  type: 'url',
  icon: <LinkIcon />
}

// Secret Input
Input {
  variant: 'glass',
  label: 'Secret Key (Optional)',
  placeholder: 'Your secret for HMAC verification',
  helper: 'Used to sign webhook payloads',
  type: 'password',
  icon: <KeyIcon />,
  copyable: true
}

// Events Selection
CheckboxGroup {
  label: 'Events to Subscribe',
  options: [
    { value: 'research.completed', label: 'Research Completed' },
    { value: 'research.failed', label: 'Research Failed' }
  ],
  required: true
}

// Test Connection
Alert {
  variant: 'info',
  title: 'Test Your Webhook',
  description: 'Send a test payload to verify your endpoint'
}

Button {
  variant: 'outline',
  size: 'md',
  icon: <SendIcon />,
  fullWidth: true
}

// Modal Footer
ModalFooter {
  actions: [
    {
      variant: 'ghost',
      label: 'Cancel',
      onClick: handleClose
    },
    {
      variant: 'gradient',
      label: 'Save Webhook',
      onClick: handleSave,
      loading: isSaving
    }
  ]
}
```

