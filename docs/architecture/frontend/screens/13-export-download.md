## 25. Export & Download Functionality

### 25.1 Export Modal

**Layout:**
```typescript
StackedModal {
  open: isOpen,
  title: 'Export Research Results',
  size: 'md'
}

// Format Selection
RadioGroup {
  variant: 'cards',
  label: 'Export Format',
  options: [
    {
      value: 'csv',
      label: 'CSV',
      description: 'Comma-separated values',
      icon: <FileSpreadsheetIcon />
    },
    {
      value: 'excel',
      label: 'Excel',
      description: 'Microsoft Excel format',
      icon: <FileExcelIcon />
    },
    {
      value: 'json',
      label: 'JSON',
      description: 'JavaScript Object Notation',
      icon: <FileJsonIcon />
    },
    {
      value: 'pdf',
      label: 'PDF',
      description: 'Portable Document Format',
      icon: <FilePdfIcon />
    }
  ]
}

// Options
Section {
  title: 'Export Options'
}

CheckboxGroup {
  options: [
    { value: 'includeMetadata', label: 'Include metadata' },
    { value: 'includeTimestamps', label: 'Include timestamps' },
    { value: 'includeSupplierDetails', label: 'Include supplier details' },
    { value: 'includeImages', label: 'Include product images (PDF only)' }
  ]
}

// Column Selection
MultiSelect {
  label: 'Select Columns to Export',
  placeholder: 'All columns selected',
  options: availableColumns,
  defaultValue: allColumns
}

// Preview
Collapsible {
  trigger: Button {
    variant: 'ghost',
    text: 'Preview export'
  }
}

Code {
  variant: 'block',
  maxHeight: '200px',
  text: exportPreview
}

// Actions
Stack {
  direction: 'row',
  gap: 'md',
  justify: 'flex-end'
}

Button {
  variant: 'outline',
  text: 'Cancel'
}

Button {
  variant: 'gradient',
  text: 'Export',
  icon: <DownloadIcon />,
  loading: isExporting
}
```

### 25.2 Bulk Export Screen (`/app/export`)

**Layout:**
```typescript
Card {
  variant: 'glass',
  padding: 'xl'
}

// Date Range Selection
DateRangePicker {
  label: 'Select Date Range',
  presets: [
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'Last 3 months', value: 'last3months' },
    { label: 'Custom range', value: 'custom' }
  ]
}

// Research Selection
Table {
  variant: 'selectable',
  title: 'Select Research to Export',
  selectAll: true,
  columns: [
    { key: 'select', type: 'checkbox' },
    { key: 'title', label: 'Research Title' },
    { key: 'date', label: 'Date' },
    { key: 'results', label: 'Results Count' },
    { key: 'size', label: 'Est. Size' }
  ]
}

// Export Summary
Card {
  variant: 'elevated',
  padding: 'md',
  background: 'gradient-subtle'
}

Grid {
  columns: 3,
  gap: 'md'
}

Stat {
  label: 'Selected Research',
  value: selectedCount
}

Stat {
  label: 'Total Results',
  value: totalResults
}

Stat {
  label: 'Estimated Size',
  value: estimatedSize
}
```

