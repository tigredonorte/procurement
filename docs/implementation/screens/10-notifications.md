## 22. Notification Center

### 22.1 Notification Dropdown (`/app/notifications`)

**Layout:**
```typescript
// Dropdown Container
Popover {
  variant: 'glass',
  maxHeight: '400px',
  width: '360px'
}

// Header
Stack {
  direction: 'row',
  justify: 'space-between',
  align: 'center',
  padding: 'md',
  borderBottom: true
}

Heading {
  size: 'text-lg',
  weight: 'semibold'
}

Button {
  variant: 'ghost',
  size: 'sm',
  text: 'Mark all as read'
}

// Notification List
ScrollArea {
  maxHeight: '320px'
}

Stack {
  direction: 'column',
  gap: 'none'
}

// Individual Notification Item
NotificationItem {
  variant: unread ? 'unread' : 'read',
  padding: 'md',
  hover: 'highlight'
}

Stack {
  direction: 'row',
  gap: 'md'
}

// Icon based on type
Avatar {
  variant: 'rounded',
  size: 'sm',
  color: notificationColor,
  icon: notificationIcon
}

// Content
Stack {
  direction: 'column',
  gap: 'xs',
  flex: 1
}

Text {
  variant: 'body',
  weight: unread ? 'medium' : 'normal'
}

Text {
  variant: 'caption',
  color: 'text-secondary'
}

// Time
Text {
  variant: 'caption',
  color: 'text-tertiary'
}

// Footer
Button {
  variant: 'ghost',
  fullWidth: true,
  text: 'View all notifications'
}
```

### 22.2 Notification Settings Screen (`/app/settings/notifications`)

**Layout:**
```typescript
Card {
  variant: 'glass',
  padding: 'lg'
}

Stack {
  direction: 'column',
  gap: 'xl'
}

// Email Notifications
Section {
  title: 'Email Notifications',
  description: 'Choose what emails you want to receive'
}

Stack {
  direction: 'column',
  gap: 'md'
}

// Notification Toggle Item
Stack {
  direction: 'row',
  justify: 'space-between',
  align: 'center'
}

Stack {
  direction: 'column',
  gap: 'xs'
}

Text {
  variant: 'body',
  weight: 'medium'
}

Text {
  variant: 'caption',
  color: 'text-secondary'
}

Switch {
  variant: 'default',
  size: 'md'
}

// Push Notifications
Section {
  title: 'Push Notifications',
  description: 'Get notified in real-time'
}

// Browser Permission Status
Alert {
  variant: permission === 'granted' ? 'success' : 'warning',
  title: permission === 'granted' ? 'Push notifications enabled' : 'Enable push notifications',
  action: permission !== 'granted' ? {
    label: 'Enable',
    onClick: requestPermission
  } : null
}
```

