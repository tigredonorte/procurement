## 2. Main Application Shell

### 2.1 App Layout (`/app/*`)

**Structure:**
```typescript
// Main Container
Container {
  variant: 'fluid',
  maxWidth: '2xl'
}

// Header
Navbar {
  variant: 'glass',
  sticky: true,
  height: '64px',
  shadow: 'sm'
}

// Sidebar (Collapsible)
Sidebar {
  variant: 'glass',
  collapsible: true,
  width: { collapsed: '64px', expanded: '280px' },
  position: 'fixed'
}

// Content Area
ScrollArea {
  variant: 'auto',
  padding: { xs: 'md', lg: 'xl' }
}
```

**Header Components:**
```typescript
// Logo
Heading {
  size: 'display-xs',
  weight: 'semibold'
}

// Search Bar (Global)
Command {
  variant: 'floating',
  placeholder: 'Search research, products, or actions...',
  width: '400px'
}

// User Menu
DropdownMenu {
  variant: 'glass',
  trigger: Avatar {
    variant: 'circle',
    size: 'md',
    status: 'online'
  }
}

// Notifications
Button {
  variant: 'ghost',
  size: 'md',
  icon: <BellIcon />,
  badge: { count: notificationCount, variant: 'gradient' }
}
```

**Sidebar Navigation:**
```typescript
// Navigation Items
NavigationMenu {
  variant: 'vertical',
  items: [
    {
      icon: <DashboardIcon />,
      label: 'Dashboard',
      badge: null
    },
    {
      icon: <SearchIcon />,
      label: 'New Research',
      badge: null
    },
    {
      icon: <ClipboardListIcon />,
      label: 'My Research',
      badge: { count: activeCount, variant: 'gradient' }
    },
    {
      icon: <WebhookIcon />,
      label: 'Webhooks',
      badge: null
    },
    {
      icon: <SettingsIcon />,
      label: 'Settings',
      badge: null
    }
  ]
}
```

