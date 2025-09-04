## 3. Dashboard Screen (`/app/dashboard`)

**Layout:**
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
  glow: true
}
```

**Statistics Cards:**
```typescript
// Stats Grid
Grid {
  columns: { xs: 1, sm: 2, lg: 4 },
  gap: 'lg'
}

// Individual Stat Card
Card {
  variant: 'glass',
  hover: 'lift',
  padding: 'lg'
}

Stack {
  direction: 'column',
  gap: 'sm'
}

Text {
  variant: 'caption',
  color: 'text-secondary'
}

Heading {
  size: 'display-xs',
  weight: 'bold'
}

Badge {
  variant: 'gradient',
  text: '+12%'
}
```

**Recent Research Table:**
```typescript
Card {
  variant: 'glass',
  padding: 'none',
  overflow: 'hidden'
}

CardHeader {
  padding: 'lg',
  borderBottom: true
}

Table {
  variant: 'glass',
  hoverable: true,
  density: 'comfortable',
  columns: [
    { key: 'query', label: 'Research Query', sortable: true },
    { key: 'status', label: 'Status', width: '120px' },
    { key: 'createdAt', label: 'Started', sortable: true },
    { key: 'completedAt', label: 'Completed', sortable: true },
    { key: 'results', label: 'Results', width: '100px' },
    { key: 'actions', label: '', width: '80px' }
  ]
}

// Status Badge in Table
Badge {
  variant: statusVariant, // 'success', 'warning', 'danger', 'info'
  size: 'sm'
}

// Action Menu in Table
DropdownMenu {
  variant: 'minimal',
  trigger: Button {
    variant: 'ghost',
    size: 'sm',
    icon: <MoreVerticalIcon />
  }
}
```

