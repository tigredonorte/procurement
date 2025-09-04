## 4. New Research Screen (`/app/research/new`)

**Form Layout:**
```typescript
// Main Container
Card {
  variant: 'glass',
  maxWidth: '800px',
  margin: 'auto',
  padding: 'xl'
}

// Form Header
Heading {
  size: 'display-sm',
  weight: 'semibold',
  marginBottom: 'lg'
}

Text {
  variant: 'body',
  color: 'text-secondary',
  marginBottom: 'xl'
}

// Form
Form {
  variant: 'vertical',
  validation: 'onBlur',
  gap: 'xl'
}

// Query Input
Textarea {
  variant: 'glass',
  label: 'Research Query',
  placeholder: 'Enter products or categories to research...',
  helper: 'Be specific to get better results',
  required: true,
  rows: 3,
  autosize: true,
  maxRows: 6
}

// Advanced Settings (Collapsible)
Collapsible {
  variant: 'smooth',
  trigger: Button {
    variant: 'ghost',
    size: 'sm',
    icon: <ChevronDownIcon />
  }
}

// Inside Collapsible
Stack {
  direction: 'column',
  gap: 'lg'
}

// Source Selection
Select {
  variant: 'searchable',
  label: 'Data Sources',
  multi: true,
  placeholder: 'Select sources...',
  options: availableSources
}

// Max Results Slider
Slider {
  variant: 'marks',
  label: 'Maximum Results',
  min: 10,
  max: 100,
  step: 10,
  marks: true,
  defaultValue: 50
}

// Filter Accordion
Accordion {
  variant: 'separated',
  items: [
    {
      title: 'Price Range',
      content: // Price range inputs
    },
    {
      title: 'Availability',
      content: // Availability checkboxes
    },
    {
      title: 'Suppliers',
      content: // Supplier selection
    }
  ]
}

// Submit Buttons
Stack {
  direction: 'row',
  gap: 'md',
  justify: 'flex-end'
}

Button {
  variant: 'outline',
  size: 'lg'
}

Button {
  variant: 'gradient',
  size: 'lg',
  glow: true,
  loading: isSubmitting
}
```

## 5. Research List Screen (`/app/research`)

**Filters and Search:**
```typescript
// Top Bar
Stack {
  direction: { xs: 'column', md: 'row' },
  gap: 'md',
  marginBottom: 'lg'
}

// Search
Input {
  variant: 'glass',
  placeholder: 'Search research...',
  icon: <SearchIcon />,
  clearable: true,
  width: { xs: '100%', md: '300px' }
}

// Filter Buttons
ToggleGroup {
  variant: 'single',
  options: [
    { value: 'all', label: 'All' },
    { value: 'queued', label: 'Queued' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ]
}

// Sort Dropdown
Select {
  variant: 'default',
  size: 'md',
  options: [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'completedAt:desc', label: 'Recently Completed' }
  ]
}
```

**Research Cards Grid:**
```typescript
// Grid Container
Grid {
  columns: { xs: 1, md: 2, xl: 3 },
  gap: 'lg'
}

// Individual Research Card
Card {
  variant: 'glass',
  hover: 'glow',
  interactive: true,
  padding: 'lg'
}

// Card Content
Stack {
  direction: 'column',
  gap: 'md'
}

// Header with Status
Stack {
  direction: 'row',
  justify: 'space-between',
  align: 'start'
}

Heading {
  size: 'text-xl',
  weight: 'semibold',
  truncate: true
}

Badge {
  variant: statusVariant,
  size: 'sm'
}

// Query Preview
Text {
  variant: 'body',
  color: 'text-secondary',
  lines: 2 // Truncate to 2 lines
}

// Metadata
Stack {
  direction: 'row',
  gap: 'md',
  wrap: true
}

Text {
  variant: 'caption',
  color: 'text-tertiary'
}

// Progress (if processing)
Progress {
  variant: 'linear',
  value: progress,
  size: 'sm',
  color: 'primary'
}

// Action Buttons
Stack {
  direction: 'row',
  gap: 'sm',
  justify: 'flex-end'
}

Button {
  variant: 'ghost',
  size: 'sm',
  icon: <EyeIcon />
}

Button {
  variant: 'ghost',
  size: 'sm',
  icon: <DownloadIcon />
}
```

