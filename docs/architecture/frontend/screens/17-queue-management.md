## 29. Research Queue Management

### 29.1 Queue Dashboard (`/app/queue`)

**Layout:**
```typescript
// Queue Status Cards
Grid {
  columns: { xs: 2, md: 4 },
  gap: 'md',
  marginBottom: 'xl'
}

StatCard {
  title: 'Queued',
  value: queuedCount,
  icon: <ClockIcon />,
  color: 'info',
  trend: queueTrend
}

StatCard {
  title: 'Processing',
  value: processingCount,
  icon: <LoaderIcon />,
  color: 'warning',
  animate: 'pulse'
}

StatCard {
  title: 'Completed Today',
  value: completedToday,
  icon: <CheckCircleIcon />,
  color: 'success'
}

StatCard {
  title: 'Failed',
  value: failedCount,
  icon: <XCircleIcon />,
  color: 'danger'
}

// Queue Table
Table {
  variant: 'glass',
  title: 'Research Queue',
  realTime: true, // WebSocket updates
  columns: [
    { key: 'position', label: '#', width: '60px' },
    { key: 'title', label: 'Research Title' },
    { key: 'priority', label: 'Priority' },
    { key: 'estimatedTime', label: 'Est. Time' },
    { key: 'status', label: 'Status' },
    { key: 'progress', label: 'Progress', width: '150px' },
    { key: 'actions', label: '', width: '100px' }
  ]
}

// Progress Cell Renderer
Progress {
  variant: 'linear',
  value: progress,
  size: 'sm',
  color: 'primary',
  showValue: true
}

// Priority Badge
Badge {
  variant: priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'default',
  text: priority
}

// Actions
DropdownMenu {
  items: [
    { icon: <ArrowUpIcon />, label: 'Increase Priority' },
    { icon: <PauseIcon />, label: 'Pause' },
    { icon: <XIcon />, label: 'Cancel', color: 'danger' }
  ]
}
```

This comprehensive specification provides a complete blueprint for implementing all MVP screens using the Requisio.com Design System, ensuring consistency, accessibility, performance, and maintainability across the entire application.