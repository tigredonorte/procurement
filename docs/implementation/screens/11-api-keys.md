## 23. API Keys Management

### 23.1 API Keys List Screen (`/app/settings/api-keys`)

**Layout:**
```typescript
// Header
Stack {
  direction: 'row',
  justify: 'space-between',
  align: 'center',
  marginBottom: 'xl'
}

Heading {
  size: 'text-xl',
  weight: 'semibold'
}

Button {
  variant: 'gradient',
  size: 'md',
  icon: <PlusIcon />,
  glow: true
}

// API Keys Table
Table {
  variant: 'glass',
  hoverable: true,
  columns: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'key', label: 'API Key', width: '300px' },
    { key: 'created', label: 'Created', sortable: true },
    { key: 'lastUsed', label: 'Last Used', sortable: true },
    { key: 'status', label: 'Status', width: '100px' },
    { key: 'actions', label: '', width: '120px' }
  ]
}

// Key Display Cell
Stack {
  direction: 'row',
  gap: 'sm',
  align: 'center'
}

Code {
  variant: 'inline',
  text: isRevealed ? apiKey : '••••••••••••••••'
}

Button {
  variant: 'ghost',
  size: 'xs',
  icon: isRevealed ? <EyeOffIcon /> : <EyeIcon />
}

Button {
  variant: 'ghost',
  size: 'xs',
  icon: <CopyIcon />
}
```

### 23.2 Create API Key Modal

**Layout:**
```typescript
StackedModal {
  open: isOpen,
  title: 'Create New API Key',
  size: 'md'
}

Form {
  variant: 'vertical',
  gap: 'lg'
}

Input {
  variant: 'glass',
  label: 'Key Name',
  placeholder: 'e.g., Production API Key',
  helper: 'A descriptive name for this API key',
  required: true
}

Select {
  variant: 'searchable',
  label: 'Permissions',
  multi: true,
  placeholder: 'Select permissions...',
  options: [
    { value: 'research.read', label: 'Read Research' },
    { value: 'research.write', label: 'Create Research' },
    { value: 'research.delete', label: 'Delete Research' },
    { value: 'webhook.manage', label: 'Manage Webhooks' }
  ],
  required: true
}

DatePicker {
  variant: 'range',
  label: 'Expiration (Optional)',
  placeholder: 'Never expires',
  minDate: tomorrow,
  helper: 'Set an expiration date for added security'
}

// Generated Key Display (after creation)
Alert {
  variant: 'success',
  title: 'API Key Created',
  description: 'Copy this key now. You won't be able to see it again.'
}

Code {
  variant: 'block',
  copyable: true,
  text: generatedKey
}
```

