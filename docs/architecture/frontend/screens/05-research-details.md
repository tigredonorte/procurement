## 6. Research Details Screen (`/app/research/:id`)

**Header Section:**
```typescript
// Back Navigation
Breadcrumbs {
  variant: 'arrow',
  items: [
    { label: 'Research', href: '/app/research' },
    { label: query, active: true }
  ]
}

// Title Bar
Stack {
  direction: { xs: 'column', md: 'row' },
  justify: 'space-between',
  align: { xs: 'start', md: 'center' },
  gap: 'md',
  marginBottom: 'xl'
}

Heading {
  size: 'display-sm',
  weight: 'semibold'
}

// Action Buttons
ButtonGroup {
  buttons: [
    {
      variant: 'outline',
      icon: <RefreshIcon />,
      label: 'Rerun'
    },
    {
      variant: 'outline',
      icon: <ShareIcon />,
      label: 'Share'
    },
    {
      variant: 'gradient',
      icon: <DownloadIcon />,
      label: 'Export'
    }
  ]
}
```

**Status Card:**
```typescript
Card {
  variant: 'glass',
  padding: 'lg',
  marginBottom: 'lg'
}

Grid {
  columns: { xs: 1, md: 4 },
  gap: 'md'
}

// Status Item
Stack {
  direction: 'column',
  gap: 'xs'
}

Text {
  variant: 'caption',
  color: 'text-secondary'
}

Text {
  variant: 'body',
  weight: 'medium'
}
```

**Results Table:**
```typescript
Card {
  variant: 'glass',
  padding: 'none',
  overflow: 'hidden'
}

// Table Header with Controls
CardHeader {
  padding: 'lg'
}

Stack {
  direction: 'row',
  justify: 'space-between',
  align: 'center'
}

Heading {
  size: 'text-xl',
  weight: 'semibold'
}

// View Toggle
ToggleGroup {
  variant: 'single',
  size: 'sm',
  options: [
    { value: 'table', icon: <TableIcon /> },
    { value: 'cards', icon: <GridIcon /> }
  ]
}

// Results Table
Table {
  variant: 'striped',
  hoverable: true,
  sortable: true,
  selectable: true,
  density: 'normal',
  pagination: {
    enabled: true,
    pageSize: 20,
    position: 'bottom'
  },
  columns: [
    { key: 'select', type: 'checkbox', width: '48px' },
    { key: 'title', label: 'Product', sortable: true },
    { key: 'price', label: 'Price', sortable: true, align: 'right' },
    { key: 'currency', label: 'Currency', width: '100px' },
    { key: 'availability', label: 'Status', width: '120px' },
    { key: 'supplier', label: 'Supplier', sortable: true },
    { key: 'image', label: 'Image', width: '60px' },
    { key: 'actions', label: '', width: '48px' }
  ]
}

// Cell Renderers
// Price Cell
Text {
  variant: 'body',
  weight: 'semibold',
  align: 'right'
}

// Availability Cell
Badge {
  variant: availability === 'in_stock' ? 'success' : 'warning',
  size: 'sm'
}

// Image Cell
Avatar {
  variant: 'rounded',
  size: 'sm',
  src: imageUrl
}
```

