# Requisio.com MVP Screen Specifications

## Design System Foundation

For complete design system documentation, see:
- **[UI/UX Design System](./architecture/frontend/ui/Readme.md)** - Complete design philosophy, visual identity, and component library
- **[Color System](./architecture/frontend/ui/03-color-system.md)** - Color palettes and semantic colors
- **[Typography](./architecture/frontend/ui/04-typography.md)** - Font system and type scales
- **[Component Architecture](./architecture/frontend/ui/07-component-architecture.md)** - Component library structure

### Component Library
- **Package**: `@requisio/ui` - Material UI-based component library
- **See**: [Core Components](./architecture/frontend/components/08-core-components.md) for complete component list
- **See**: [Complex Components](./architecture/frontend/components/09-complex-components.md) for advanced patterns

## 1. Authentication Screens

### 1.1 Login Screen (`/login`)

**Layout Structure:**
- Full-screen split layout (60/40 on desktop, full-screen on mobile)
- Left panel: Gradient mesh background with product research imagery
- Right panel: Authentication form

**Components:**
```typescript
// Container
Container {
  variant: 'full-screen',
  responsive: { xs: 'single', lg: 'split' }
}

// Left Panel (Desktop only)
Card {
  variant: 'gradient',
  background: 'mesh-light' // mesh-dark in dark mode
}

// Right Panel
Card {
  variant: 'glass',
  padding: { xs: 'md', lg: 'xl' },
  glass: { blur: 20, opacity: 0.8 }
}

// Logo
Heading {
  size: 'display-md',
  weight: 'bold',
  color: 'primary'
}

// Form Container
Form {
  variant: 'vertical',
  validation: 'onSubmit',
  gap: 'lg'
}

// Email Input
Input {
  variant: 'glass',
  size: 'lg',
  label: 'Email Address',
  type: 'email',
  icon: <MailIcon />,
  floating: true,
  required: true
}

// Password Input
Input {
  variant: 'glass',
  size: 'lg',
  label: 'Password',
  type: 'password',
  icon: <LockIcon />,
  floating: true,
  required: true
}

// Remember Me
Checkbox {
  variant: 'default',
  label: 'Remember me for 30 days'
}

// Submit Button
Button {
  variant: 'gradient',
  size: 'lg',
  fullWidth: true,
  loading: isSubmitting,
  glow: true
}

// Forgot Password Link
Button {
  variant: 'ghost',
  size: 'sm',
  color: 'primary'
}

// SSO Option (if configured)
Separator {
  variant: 'gradient',
  text: 'OR'
}

Button {
  variant: 'outline',
  size: 'lg',
  fullWidth: true,
  icon: <KeycloakIcon />
}
```

**Typography:**
- Heading: Display-md (36px), weight: 600
- Subheading: Text-lg (18px), color: text-secondary
- Form labels: Label-lg (14px), weight: 500
- Error messages: Text-sm (14px), color: danger

### 1.2 Registration Screen (`/register`)

Similar to login with additional fields:

```typescript
// Additional Inputs
Input {
  variant: 'glass',
  size: 'lg',
  label: 'First Name',
  icon: <UserIcon />,
  floating: true,
  required: true
}

Input {
  variant: 'glass',
  size: 'lg',
  label: 'Last Name',
  floating: true,
  required: true
}

Input {
  variant: 'glass',
  size: 'lg',
  label: 'Organization',
  icon: <BuildingIcon />,
  floating: true,
  required: true
}

Select {
  variant: 'default',
  size: 'lg',
  label: 'Organization Type',
  options: ['Hospital', 'Hotel', 'School', 'Commercial Building', 'Other'],
  required: true
}

// Terms Checkbox
Checkbox {
  variant: 'default',
  required: true,
  label: 'I agree to the Terms of Service and Privacy Policy'
}
```

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

## 8. Settings Screen (`/app/settings`)

**Settings Navigation:**
```typescript
// Tab Navigation
Tabs {
  variant: 'pills',
  orientation: { xs: 'horizontal', md: 'vertical' },
  tabs: [
    { value: 'profile', label: 'Profile', icon: <UserIcon /> },
    { value: 'organization', label: 'Organization', icon: <BuildingIcon /> },
    { value: 'notifications', label: 'Notifications', icon: <BellIcon /> },
    { value: 'security', label: 'Security', icon: <ShieldIcon /> },
    { value: 'api', label: 'API Keys', icon: <KeyIcon /> },
    { value: 'appearance', label: 'Appearance', icon: <PaletteIcon /> }
  ]
}
```

**Profile Tab:**
```typescript
Form {
  variant: 'horizontal',
  gap: 'lg'
}

// Avatar Upload
Stack {
  direction: 'column',
  align: 'center',
  gap: 'md'
}

Avatar {
  variant: 'circle',
  size: 'xl',
  src: userAvatar
}

Button {
  variant: 'outline',
  size: 'sm'
}

// Form Fields
Input {
  variant: 'outlined',
  label: 'First Name',
  defaultValue: user.firstName
}

Input {
  variant: 'outlined',
  label: 'Last Name',
  defaultValue: user.lastName
}

Input {
  variant: 'outlined',
  label: 'Email',
  type: 'email',
  defaultValue: user.email,
  disabled: true
}

// Save Button
Button {
  variant: 'gradient',
  size: 'md',
  alignSelf: 'flex-end'
}
```

**Appearance Tab:**
```typescript
// Theme Selection
RadioGroup {
  variant: 'cards',
  label: 'Theme Mode',
  options: [
    { value: 'light', label: 'Light', icon: <SunIcon /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
    { value: 'auto', label: 'System', icon: <ComputerIcon /> }
  ]
}

// Color Customization
ColorPicker {
  label: 'Primary Color',
  defaultValue: '#6366F1'
}

// Density Settings
Select {
  label: 'Interface Density',
  options: [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'comfortable', label: 'Comfortable' }
  ]
}
```

## 9. Error & Empty States

**404 Page:**
```typescript
Container {
  variant: 'centered',
  minHeight: '100vh'
}

Stack {
  direction: 'column',
  align: 'center',
  gap: 'xl'
}

Heading {
  size: 'display-lg',
  weight: 'bold',
  color: 'primary'
}

Text {
  variant: 'body',
  color: 'text-secondary',
  align: 'center'
}

Button {
  variant: 'gradient',
  size: 'lg',
  icon: <HomeIcon />,
  glow: true
}
```

**Empty State:**
```typescript
Card {
  variant: 'glass',
  padding: 'xl',
  align: 'center'
}

Stack {
  direction: 'column',
  align: 'center',
  gap: 'lg'
}

// Illustration
Avatar {
  variant: 'rounded',
  size: '2xl',
  src: '/empty-state.svg'
}

Heading {
  size: 'text-xl',
  weight: 'semibold'
}

Text {
  variant: 'body',
  color: 'text-secondary'
}

Button {
  variant: 'gradient',
  size: 'md',
  icon: <PlusIcon />
}
```

## 10. Loading States

**Page Loading:**
```typescript
Container {
  variant: 'centered',
  minHeight: '50vh'
}

Stack {
  direction: 'column',
  align: 'center',
  gap: 'lg'
}

Spinner {
  size: 'lg',
  color: 'primary'
}

Text {
  variant: 'body',
  color: 'text-secondary'
}
```

**Skeleton Loading:**
```typescript
// For tables
Skeleton {
  variant: 'rectangular',
  height: '400px',
  animation: 'wave'
}

// For cards
Grid {
  columns: { xs: 1, md: 2, xl: 3 },
  gap: 'lg'
}

Skeleton {
  variant: 'rectangular',
  height: '200px',
  borderRadius: 'md'
}
```

These specifications provide a complete blueprint for implementing all MVP screens using the Requisio.com Design System components. Each screen maintains consistency with the design tokens, follows accessibility standards, and implements responsive behavior as defined in the ui/Readme.md document.

## Progressive Web App & Service Workers

See **[PWA Configuration](./architecture/frontend/architecture/01-pwa-configuration.md)** for:
- PWA manifest configuration
- Service worker implementation
- Offline support strategies
- Caching patterns

See **[Service Workers & Mocking](./architecture/frontend/architecture/11-service-workers.md)** for:
- Mock Service Worker (MSW) setup
- Development environment mocking
- API simulation for testing

## Responsive Design & Accessibility

See **[Responsive Design](./architecture/frontend/components/10-responsive-design.md)** for:
- Breakpoint system
- Mobile-first approach
- Responsive patterns
- Grid system

See **[Accessibility Standards](./architecture/frontend/ui/12-accessibility.md)** for:
- WCAG compliance guidelines
- Keyboard navigation patterns
- Screen reader support
- ARIA implementation

## Performance, Animations & Themes

See **[Motion & Animation](./architecture/frontend/ui/06-motion-animation.md)** for:
- Animation principles and presets
- Performance guidelines
- Accessibility considerations

See **[Dark Mode Strategy](./architecture/frontend/ui/11-dark-mode.md)** for:
- Color mode implementation
- Theme transitions
- Component dark variants

## State Management & Architecture

See **[State Management](./architecture/frontend/architecture/02-state-management.md)** for:
- Redux Toolkit configuration
- RTK Query integration
- State synchronization patterns
- WebSocket real-time updates

See **[Component Architecture](./architecture/frontend/architecture/03-component-architecture.md)** for:
- Component organization
- State patterns
- Form validation with Zod

## Testing & Development

See **[Development Standards](./architecture/platform-standards/02-development-standards.md)** for:
- Testing strategies
- Code quality standards
- Performance optimization
- Bundle optimization

## 21. Password Reset Flow

### 21.1 Forgot Password Screen (`/forgot-password`)

**Layout:**
```typescript
// Container
Container {
  variant: 'centered',
  maxWidth: 'sm',
  minHeight: '100vh'
}

Card {
  variant: 'glass',
  padding: 'xl',
  glass: { blur: 20, opacity: 0.8 }
}

// Header
Stack {
  direction: 'column',
  align: 'center',
  gap: 'lg',
  marginBottom: 'xl'
}

Avatar {
  variant: 'rounded',
  size: 'lg',
  src: '/logo.svg'
}

Heading {
  size: 'display-sm',
  weight: 'semibold',
  align: 'center'
}

Text {
  variant: 'body',
  color: 'text-secondary',
  align: 'center'
}

// Form
Form {
  variant: 'vertical',
  validation: 'onSubmit',
  gap: 'lg'
}

Input {
  variant: 'glass',
  size: 'lg',
  label: 'Email Address',
  type: 'email',
  icon: <MailIcon />,
  placeholder: 'Enter your registered email',
  required: true,
  floating: true
}

// Success Message (after submission)
Alert {
  variant: 'success',
  title: 'Check your email',
  description: 'We've sent a password reset link to your email address'
}

// Submit Button
Button {
  variant: 'gradient',
  size: 'lg',
  fullWidth: true,
  loading: isSubmitting,
  glow: true
}

// Back to Login Link
Button {
  variant: 'ghost',
  size: 'sm',
  icon: <ArrowLeftIcon />,
  fullWidth: true
}
```

### 21.2 Reset Password Screen (`/reset-password/:token`)

**Layout:**
```typescript
// Similar container as forgot password
Card {
  variant: 'glass',
  padding: 'xl'
}

// Password Requirements
Alert {
  variant: 'info',
  title: 'Password Requirements',
  list: [
    'At least 8 characters',
    'One uppercase letter',
    'One lowercase letter',
    'One number',
    'One special character'
  ]
}

// Password Fields
Input {
  variant: 'glass',
  size: 'lg',
  label: 'New Password',
  type: 'password',
  icon: <LockIcon />,
  required: true,
  floating: true,
  strength: true // Show password strength meter
}

Input {
  variant: 'glass',
  size: 'lg',
  label: 'Confirm Password',
  type: 'password',
  icon: <LockIcon />,
  required: true,
  floating: true
}

// Password Strength Indicator
PasswordStrength {
  value: passwordStrength,
  showRequirements: true
}
```

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

## 26. Webhook Testing & Logs

### 26.1 Webhook Test Screen

**Layout:**
```typescript
Card {
  variant: 'glass',
  padding: 'lg'
}

// Test Configuration
Stack {
  direction: 'column',
  gap: 'lg'
}

Select {
  label: 'Select Webhook',
  placeholder: 'Choose a webhook to test',
  options: configuredWebhooks
}

// Payload Editor
Label {
  text: 'Test Payload'
}

CodeEditor {
  language: 'json',
  height: '300px',
  theme: darkMode ? 'dark' : 'light',
  value: testPayload,
  onChange: setTestPayload
}

// Test Controls
Stack {
  direction: 'row',
  gap: 'md',
  align: 'center'
}

Button {
  variant: 'gradient',
  icon: <SendIcon />,
  text: 'Send Test',
  loading: isTesting
}

Button {
  variant: 'outline',
  icon: <RefreshIcon />,
  text: 'Reset Payload'
}

// Response Display
Card {
  variant: 'elevated',
  padding: 'md',
  marginTop: 'lg'
}

Tabs {
  tabs: [
    {
      value: 'response',
      label: 'Response',
      content: <CodeBlock language="json" text={responseBody} />
    },
    {
      value: 'headers',
      label: 'Headers',
      content: <CodeBlock language="http" text={responseHeaders} />
    },
    {
      value: 'timing',
      label: 'Timing',
      content: <TimingDiagram data={timingData} />
    }
  ]
}
```

### 26.2 Webhook Logs Screen (`/app/webhooks/logs`)

**Layout:**
```typescript
// Filters
Stack {
  direction: 'row',
  gap: 'md',
  marginBottom: 'lg'
}

Select {
  placeholder: 'All webhooks',
  options: webhookOptions
}

Select {
  placeholder: 'All statuses',
  options: [
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' }
  ]
}

DateRangePicker {
  placeholder: 'Last 24 hours'
}

// Logs Table
Table {
  variant: 'striped',
  columns: [
    { key: 'timestamp', label: 'Time', sortable: true },
    { key: 'webhook', label: 'Webhook' },
    { key: 'event', label: 'Event' },
    { key: 'status', label: 'Status' },
    { key: 'statusCode', label: 'Response Code' },
    { key: 'duration', label: 'Duration' },
    { key: 'actions', label: '' }
  ]
}

// Log Detail Modal
Modal {
  title: 'Webhook Log Details',
  size: 'lg'
}

Tabs {
  tabs: [
    {
      value: 'request',
      label: 'Request',
      content: <CodeBlock language="json" text={requestBody} />
    },
    {
      value: 'response',
      label: 'Response',
      content: <CodeBlock language="json" text={responseBody} />
    },
    {
      value: 'error',
      label: 'Error',
      content: <Alert variant="danger" description={errorMessage} />
    }
  ]
}

// Retry Button
Button {
  variant: 'outline',
  icon: <RefreshIcon />,
  text: 'Retry',
  onClick: retryWebhook
}
```

## 27. Onboarding Flow

### 27.1 Welcome Screen (`/onboarding/welcome`)

**Layout:**
```typescript
Container {
  variant: 'centered',
  maxWidth: 'lg'
}

// Progress Indicator
Progress {
  variant: 'steps',
  currentStep: 1,
  totalSteps: 5,
  marginBottom: 'xl'
}

Card {
  variant: 'glass',
  padding: 'xl',
  align: 'center'
}

// Welcome Animation
LottieAnimation {
  src: '/animations/welcome.json',
  size: 'lg',
  autoplay: true
}

Heading {
  size: 'display-md',
  weight: 'bold',
  align: 'center'
}

Text {
  variant: 'lead',
  color: 'text-secondary',
  align: 'center',
  marginBottom: 'xl'
}

// Benefits List
List {
  variant: 'check',
  items: [
    'Automated product research',
    'Real-time data normalization',
    'Webhook integrations',
    'Export to multiple formats'
  ]
}

Button {
  variant: 'gradient',
  size: 'lg',
  text: 'Get Started',
  icon: <ArrowRightIcon />,
  glow: true
}
```

### 27.2 Organization Setup (`/onboarding/organization`)

**Layout:**
```typescript
Form {
  variant: 'vertical',
  gap: 'lg'
}

Input {
  label: 'Organization Name',
  placeholder: 'Enter your organization name',
  required: true,
  helper: 'This will be displayed on your dashboard'
}

Select {
  label: 'Organization Type',
  placeholder: 'Select type',
  options: [
    { value: 'hospital', label: 'Hospital' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'school', label: 'School' },
    { value: 'commercial', label: 'Commercial Building' },
    { value: 'other', label: 'Other' }
  ],
  required: true
}

Select {
  label: 'Organization Size',
  placeholder: 'Select size',
  options: [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '500+', label: '500+ employees' }
  ]
}

Textarea {
  label: 'Primary Use Case',
  placeholder: 'How will you use Requisio.com?',
  rows: 3,
  helper: 'Help us personalize your experience'
}
```

### 27.3 First Research Tutorial (`/onboarding/tutorial`)

**Layout:**
```typescript
// Interactive Tutorial Overlay
TutorialOverlay {
  steps: [
    {
      target: '.research-query-input',
      title: 'Enter Your Query',
      content: 'Start by typing what products you want to research',
      placement: 'bottom'
    },
    {
      target: '.data-sources-select',
      title: 'Choose Data Sources',
      content: 'Select which sources to search for products',
      placement: 'top'
    },
    {
      target: '.submit-research-btn',
      title: 'Start Research',
      content: 'Click here to begin the automated research process',
      placement: 'left'
    }
  ]
}

// Tutorial Controls
Stack {
  direction: 'row',
  justify: 'space-between',
  position: 'fixed',
  bottom: 'lg',
  right: 'lg'
}

Button {
  variant: 'ghost',
  text: 'Skip Tutorial'
}

ButtonGroup {
  buttons: [
    { variant: 'outline', text: 'Previous' },
    { variant: 'gradient', text: 'Next' }
  ]
}
```

### 27.4 Completion Screen (`/onboarding/complete`)

**Layout:**
```typescript
Card {
  variant: 'glass',
  padding: 'xl',
  align: 'center'
}

// Success Animation
LottieAnimation {
  src: '/animations/success.json',
  size: 'lg',
  autoplay: true,
  loop: false
}

Heading {
  size: 'display-md',
  weight: 'bold',
  align: 'center'
}

Text {
  variant: 'lead',
  color: 'text-secondary',
  align: 'center'
}

// Quick Actions
Grid {
  columns: { xs: 1, md: 3 },
  gap: 'lg',
  marginTop: 'xl'
}

ActionCard {
  icon: <SearchIcon />,
  title: 'Create Research',
  description: 'Start your first product research',
  href: '/app/research/new'
}

ActionCard {
  icon: <WebhookIcon />,
  title: 'Setup Webhooks',
  description: 'Configure webhook integrations',
  href: '/app/webhooks'
}

ActionCard {
  icon: <BookIcon />,
  title: 'View Docs',
  description: 'Learn more about features',
  href: '/docs'
}

Button {
  variant: 'gradient',
  size: 'lg',
  text: 'Go to Dashboard',
  icon: <HomeIcon />,
  glow: true,
  fullWidth: true
}
```

## 28. User Profile Management

### 28.1 Profile Overview Screen (`/app/profile`)

**Layout:**
```typescript
Grid {
  columns: { xs: 1, lg: 3 },
  gap: 'lg'
}

// Left Column - Profile Card
Card {
  variant: 'glass',
  padding: 'lg',
  span: { xs: 1, lg: 1 }
}

Stack {
  direction: 'column',
  align: 'center',
  gap: 'lg'
}

Avatar {
  variant: 'circle',
  size: '2xl',
  src: userAvatar,
  status: 'online',
  editable: true,
  onEdit: handleAvatarUpload
}

Heading {
  size: 'text-xl',
  weight: 'semibold'
}

Text {
  variant: 'body',
  color: 'text-secondary'
}

Badge {
  variant: 'gradient',
  text: userRole
}

// Edit Profile Button
Button {
  variant: 'outline',
  size: 'md',
  icon: <EditIcon />,
  text: 'Edit Profile',
  fullWidth: true,
  onClick: () => navigate('/app/profile/edit')
}

Separator />

// Quick Stats
Stack {
  direction: 'column',
  gap: 'md',
  width: '100%'
}

StatItem {
  label: 'Research Completed',
  value: researchCount
}

StatItem {
  label: 'Member Since',
  value: memberSince
}

StatItem {
  label: 'API Calls This Month',
  value: apiCallsCount
}

// Right Column - Activity & Settings
Stack {
  direction: 'column',
  gap: 'lg',
  span: { xs: 1, lg: 2 }
}

// Recent Activity
Card {
  variant: 'glass',
  padding: 'lg'
}

Heading {
  size: 'text-lg',
  weight: 'semibold',
  marginBottom: 'md'
}

Timeline {
  items: recentActivities,
  variant: 'compact'
}

// Quick Settings
Card {
  variant: 'glass',
  padding: 'lg'
}

Grid {
  columns: 2,
  gap: 'md'
}

SettingItem {
  icon: <BellIcon />,
  title: 'Notifications',
  value: notificationSettings,
  href: '/app/settings/notifications'
}

SettingItem {
  icon: <ShieldIcon />,
  title: 'Security',
  value: '2FA Enabled',
  href: '/app/settings/security'
}
```

### 28.2 Profile Edit Screen (`/app/profile/edit`)

**Layout:**
```typescript
Container {
  maxWidth: 'xl',
  padding: { xs: 'md', lg: 'xl' }
}

// Page Header
Stack {
  direction: 'row',
  align: 'center',
  gap: 'md',
  marginBottom: 'xl'
}

Button {
  variant: 'ghost',
  size: 'md',
  icon: <ArrowLeftIcon />,
  onClick: () => navigate('/app/profile')
}

Heading {
  size: 'display-sm',
  weight: 'semibold'
}

// Form Container
Card {
  variant: 'glass',
  padding: 'xl'
}

Form {
  variant: 'vertical',
  validation: 'onBlur',
  gap: 'xl'
}

// Profile Picture Section
Section {
  title: 'Profile Picture',
  marginBottom: 'lg'
}

Stack {
  direction: 'row',
  align: 'center',
  gap: 'lg'
}

Avatar {
  variant: 'circle',
  size: 'xl',
  src: userAvatar,
  editable: true
}

Stack {
  direction: 'column',
  gap: 'sm'
}

Button {
  variant: 'outline',
  size: 'sm',
  text: 'Upload New Photo',
  icon: <UploadIcon />
}

Text {
  variant: 'caption',
  color: 'text-secondary'
}

// Personal Information Section
Section {
  title: 'Personal Information',
  description: 'Update your personal details',
  icon: <UserIcon />
}

Grid {
  columns: { xs: 1, md: 2 },
  gap: 'lg'
}

Input {
  variant: 'glass',
  label: 'First Name',
  placeholder: 'Enter your first name',
  icon: <UserIcon />,
  required: true,
  defaultValue: user.firstName,
  floating: true
}

Input {
  variant: 'glass',
  label: 'Last Name',
  placeholder: 'Enter your last name',
  required: true,
  defaultValue: user.lastName,
  floating: true
}

Input {
  variant: 'glass',
  label: 'Display Name',
  placeholder: 'How should we display your name?',
  helper: 'This is how your name appears in the app',
  defaultValue: user.displayName,
  floating: true,
  span: { xs: 1, md: 2 }
}

// Contact Information Section
Section {
  title: 'Contact Information',
  description: 'Keep your contact details up to date',
  icon: <PhoneIcon />
}

Grid {
  columns: { xs: 1, md: 2 },
  gap: 'lg'
}

Input {
  variant: 'glass',
  label: 'Email Address',
  type: 'email',
  icon: <MailIcon />,
  defaultValue: user.email,
  disabled: true,
  helper: 'Contact support to change your email',
  floating: true
}

PhoneInput {
  variant: 'glass',
  label: 'Mobile Phone',
  placeholder: '+1 (555) 000-0000',
  icon: <PhoneIcon />,
  defaultValue: user.phone,
  countryCode: 'US',
  floating: true,
  helper: 'We'll use this for important account notifications'
}

Input {
  variant: 'glass',
  label: 'Alternative Phone (Optional)',
  placeholder: '+1 (555) 000-0000',
  icon: <PhoneIcon />,
  defaultValue: user.alternativePhone,
  floating: true
}

Select {
  variant: 'glass',
  label: 'Preferred Contact Method',
  options: [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'sms', label: 'SMS' }
  ],
  defaultValue: user.preferredContact,
  floating: true
}

// Shipping Address Section (For Future Automated Purchases)
Section {
  title: 'Shipping Address',
  description: 'Save your address for future automated purchase fulfillment',
  icon: <MapPinIcon />,
  badge: {
    variant: 'info',
    text: 'Coming Soon'
  }
}

// Address Autocomplete
AddressAutocomplete {
  variant: 'glass',
  label: 'Search Address',
  placeholder: 'Start typing your address...',
  icon: <SearchIcon />,
  onSelect: handleAddressSelect,
  googleMapsApiKey: GOOGLE_MAPS_KEY,
  floating: true
}

Grid {
  columns: { xs: 1, md: 2 },
  gap: 'lg'
}

Input {
  variant: 'glass',
  label: 'Street Address',
  placeholder: '123 Main Street',
  icon: <HomeIcon />,
  defaultValue: user.address?.street,
  required: addressEnabled,
  floating: true,
  span: { xs: 1, md: 2 }
}

Input {
  variant: 'glass',
  label: 'Apartment, Suite, etc. (Optional)',
  placeholder: 'Apt 4B',
  defaultValue: user.address?.apartment,
  floating: true,
  span: { xs: 1, md: 2 }
}

Input {
  variant: 'glass',
  label: 'City',
  placeholder: 'New York',
  icon: <BuildingIcon />,
  defaultValue: user.address?.city,
  required: addressEnabled,
  floating: true
}

Select {
  variant: 'searchable',
  label: 'State/Province',
  placeholder: 'Select state',
  options: stateOptions,
  defaultValue: user.address?.state,
  required: addressEnabled,
  floating: true
}

Input {
  variant: 'glass',
  label: 'ZIP/Postal Code',
  placeholder: '10001',
  defaultValue: user.address?.zipCode,
  required: addressEnabled,
  pattern: '[0-9]{5}(-[0-9]{4})?',
  floating: true
}

Select {
  variant: 'searchable',
  label: 'Country',
  placeholder: 'Select country',
  options: countryOptions,
  defaultValue: user.address?.country || 'US',
  required: addressEnabled,
  floating: true
}

// Toggle for enabling address
Switch {
  label: 'Enable automated purchase delivery',
  helper: 'Allow Requisio to ship approved purchases directly to this address',
  defaultChecked: addressEnabled,
  onChange: setAddressEnabled
}

// Billing Address Section
Collapsible {
  trigger: Checkbox {
    label: 'Billing address is different from shipping address',
    defaultChecked: hasDifferentBilling
  }
}

// Billing Address Fields (Similar structure to shipping)
Grid {
  columns: { xs: 1, md: 2 },
  gap: 'lg'
}

// ... billing address fields similar to shipping

// Company Information Section (Optional)
Section {
  title: 'Organization Details',
  description: 'Additional information for business accounts',
  icon: <BriefcaseIcon />
}

Grid {
  columns: { xs: 1, md: 2 },
  gap: 'lg'
}

Input {
  variant: 'glass',
  label: 'Company Name',
  placeholder: 'Acme Corporation',
  icon: <BuildingIcon />,
  defaultValue: user.company?.name,
  floating: true
}

Input {
  variant: 'glass',
  label: 'Department',
  placeholder: 'Procurement',
  defaultValue: user.company?.department,
  floating: true
}

Input {
  variant: 'glass',
  label: 'Job Title',
  placeholder: 'Procurement Manager',
  icon: <BriefcaseIcon />,
  defaultValue: user.company?.jobTitle,
  floating: true
}

Input {
  variant: 'glass',
  label: 'Employee ID (Optional)',
  placeholder: 'EMP-12345',
  defaultValue: user.company?.employeeId,
  floating: true
}

// Preferences Section
Section {
  title: 'Preferences',
  description: 'Customize your experience',
  icon: <SettingsIcon />
}

Grid {
  columns: { xs: 1, md: 2 },
  gap: 'lg'
}

Select {
  variant: 'glass',
  label: 'Language',
  options: [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' }
  ],
  defaultValue: user.preferences?.language || 'en',
  floating: true
}

Select {
  variant: 'glass',
  label: 'Timezone',
  options: timezoneOptions,
  defaultValue: user.preferences?.timezone,
  floating: true
}

Select {
  variant: 'glass',
  label: 'Date Format',
  options: [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ],
  defaultValue: user.preferences?.dateFormat,
  floating: true
}

Select {
  variant: 'glass',
  label: 'Currency',
  options: currencyOptions,
  defaultValue: user.preferences?.currency || 'USD',
  floating: true
}

// Form Actions
Stack {
  direction: 'row',
  gap: 'md',
  justify: 'space-between',
  marginTop: 'xl'
}

Button {
  variant: 'ghost',
  size: 'lg',
  text: 'Cancel',
  onClick: handleCancel
}

Stack {
  direction: 'row',
  gap: 'md'
}

Button {
  variant: 'outline',
  size: 'lg',
  text: 'Reset Changes',
  onClick: handleReset
}

Button {
  variant: 'gradient',
  size: 'lg',
  text: 'Save Changes',
  icon: <SaveIcon />,
  loading: isSaving,
  glow: true
}
```

### 28.3 Profile Completion Widget

**Component for Dashboard:**
```typescript
// Profile Completion Card
Card {
  variant: 'glass',
  padding: 'lg'
}

Stack {
  direction: 'column',
  gap: 'md'
}

Stack {
  direction: 'row',
  justify: 'space-between',
  align: 'center'
}

Heading {
  size: 'text-lg',
  weight: 'semibold'
}

Badge {
  variant: completionPercentage === 100 ? 'success' : 'warning',
  text: `${completionPercentage}% Complete`
}

Progress {
  variant: 'linear',
  value: completionPercentage,
  color: completionPercentage === 100 ? 'success' : 'primary',
  size: 'md'
}

// Missing Fields List
if (missingFields.length > 0) {
  Stack {
    direction: 'column',
    gap: 'sm'
  }
  
  Text {
    variant: 'caption',
    color: 'text-secondary'
  }
  
  List {
    variant: 'compact',
    items: missingFields.map(field => ({
      icon: <CircleIcon />,
      text: field.label,
      action: {
        icon: <ArrowRightIcon />,
        onClick: () => navigate('/app/profile/edit#' + field.id)
      }
    }))
  }
  
  Button {
    variant: 'outline',
    size: 'sm',
    text: 'Complete Profile',
    icon: <EditIcon />,
    fullWidth: true
  }
}
```

### 28.4 Address Validation Modal

**For Future Purchase Automation:**
```typescript
Modal {
  open: isValidatingAddress,
  title: 'Verify Shipping Address',
  size: 'md'
}

Stack {
  direction: 'column',
  gap: 'lg'
}

Alert {
  variant: 'info',
  title: 'Address Verification',
  description: 'We found a suggested address. Please confirm or edit.'
}

// Address Comparison
Grid {
  columns: 2,
  gap: 'md'
}

Card {
  variant: 'elevated',
  padding: 'md'
}

Label {
  text: 'You Entered:',
  weight: 'semibold'
}

Address {
  lines: enteredAddress,
  variant: 'compact'
}

Card {
  variant: 'elevated',
  padding: 'md',
  border: 'primary'
}

Label {
  text: 'Suggested:',
  weight: 'semibold'
}

Address {
  lines: suggestedAddress,
  variant: 'compact',
  highlight: differences
}

// Map Preview
MapPreview {
  coordinates: suggestedCoordinates,
  marker: true,
  height: '200px',
  interactive: false
}

// Actions
Stack {
  direction: 'row',
  gap: 'md',
  justify: 'flex-end'
}

Button {
  variant: 'outline',
  text: 'Use Original',
  onClick: useOriginalAddress
}

Button {
  variant: 'gradient',
  text: 'Use Suggested',
  onClick: useSuggestedAddress,
  glow: true
}
```

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