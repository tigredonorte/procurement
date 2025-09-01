# PRA MVP Screen Specifications

## 1. Authentication Screens

### 1.1 Login Screen (`/login`)

**Layout Structure:**
- Full-screen split layout (60/40 on desktop, full-screen on mobile)
- Left panel: Gradient mesh background with product research imagery
- Right panel: Authentication form

**Components:**
```typescript
// Container
PRAContainer {
  variant: 'full-screen',
  responsive: { xs: 'single', lg: 'split' }
}

// Left Panel (Desktop only)
PRACard {
  variant: 'gradient',
  background: 'mesh-light' // mesh-dark in dark mode
}

// Right Panel
PRACard {
  variant: 'glass',
  padding: { xs: 'md', lg: 'xl' },
  glass: { blur: 20, opacity: 0.8 }
}

// Logo
PRAHeading {
  size: 'display-md',
  weight: 'bold',
  color: 'primary'
}

// Form Container
PRAForm {
  variant: 'vertical',
  validation: 'onSubmit',
  gap: 'lg'
}

// Email Input
PRAInput {
  variant: 'glass',
  size: 'lg',
  label: 'Email Address',
  type: 'email',
  icon: <MailIcon />,
  floating: true,
  required: true
}

// Password Input
PRAInput {
  variant: 'glass',
  size: 'lg',
  label: 'Password',
  type: 'password',
  icon: <LockIcon />,
  floating: true,
  required: true
}

// Remember Me
PRACheckbox {
  variant: 'default',
  label: 'Remember me for 30 days'
}

// Submit Button
PRAButton {
  variant: 'gradient',
  size: 'lg',
  fullWidth: true,
  loading: isSubmitting,
  glow: true
}

// Forgot Password Link
PRAButton {
  variant: 'ghost',
  size: 'sm',
  color: 'primary'
}

// SSO Option (if configured)
PRASeparator {
  variant: 'gradient',
  text: 'OR'
}

PRAButton {
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
PRAInput {
  variant: 'glass',
  size: 'lg',
  label: 'First Name',
  icon: <UserIcon />,
  floating: true,
  required: true
}

PRAInput {
  variant: 'glass',
  size: 'lg',
  label: 'Last Name',
  floating: true,
  required: true
}

PRAInput {
  variant: 'glass',
  size: 'lg',
  label: 'Organization',
  icon: <BuildingIcon />,
  floating: true,
  required: true
}

PRASelect {
  variant: 'default',
  size: 'lg',
  label: 'Organization Type',
  options: ['Hospital', 'Hotel', 'School', 'Commercial Building', 'Other'],
  required: true
}

// Terms Checkbox
PRACheckbox {
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
PRAContainer {
  variant: 'fluid',
  maxWidth: '2xl'
}

// Header
PRANavbar {
  variant: 'glass',
  sticky: true,
  height: '64px',
  shadow: 'sm'
}

// Sidebar (Collapsible)
PRASidebar {
  variant: 'glass',
  collapsible: true,
  width: { collapsed: '64px', expanded: '280px' },
  position: 'fixed'
}

// Content Area
PRAScrollArea {
  variant: 'auto',
  padding: { xs: 'md', lg: 'xl' }
}
```

**Header Components:**
```typescript
// Logo
PRAHeading {
  size: 'display-xs',
  weight: 'semibold'
}

// Search Bar (Global)
PRACommand {
  variant: 'floating',
  placeholder: 'Search research, products, or actions...',
  width: '400px'
}

// User Menu
PRADropdownMenu {
  variant: 'glass',
  trigger: PRAAvatar {
    variant: 'circle',
    size: 'md',
    status: 'online'
  }
}

// Notifications
PRAButton {
  variant: 'ghost',
  size: 'md',
  icon: <BellIcon />,
  badge: { count: notificationCount, variant: 'gradient' }
}
```

**Sidebar Navigation:**
```typescript
// Navigation Items
PRANavigationMenu {
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
PRAStack {
  direction: 'row',
  justify: 'space-between',
  align: 'center',
  marginBottom: 'xl'
}

PRAHeading {
  size: 'display-sm',
  weight: 'semibold'
}

PRAButton {
  variant: 'gradient',
  size: 'md',
  icon: <PlusIcon />,
  glow: true
}
```

**Statistics Cards:**
```typescript
// Stats Grid
PRAGrid {
  columns: { xs: 1, sm: 2, lg: 4 },
  gap: 'lg'
}

// Individual Stat Card
PRACard {
  variant: 'glass',
  hover: 'lift',
  padding: 'lg'
}

PRAStack {
  direction: 'column',
  gap: 'sm'
}

PRAText {
  variant: 'caption',
  color: 'text-secondary'
}

PRAHeading {
  size: 'display-xs',
  weight: 'bold'
}

PRABadge {
  variant: 'gradient',
  text: '+12%'
}
```

**Recent Research Table:**
```typescript
PRACard {
  variant: 'glass',
  padding: 'none',
  overflow: 'hidden'
}

PRACardHeader {
  padding: 'lg',
  borderBottom: true
}

PRATable {
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
PRABadge {
  variant: statusVariant, // 'success', 'warning', 'danger', 'info'
  size: 'sm'
}

// Action Menu in Table
PRADropdownMenu {
  variant: 'minimal',
  trigger: PRAButton {
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
PRACard {
  variant: 'glass',
  maxWidth: '800px',
  margin: 'auto',
  padding: 'xl'
}

// Form Header
PRAHeading {
  size: 'display-sm',
  weight: 'semibold',
  marginBottom: 'lg'
}

PRAText {
  variant: 'body',
  color: 'text-secondary',
  marginBottom: 'xl'
}

// Form
PRAForm {
  variant: 'vertical',
  validation: 'onBlur',
  gap: 'xl'
}

// Query Input
PRATextarea {
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
PRACollapsible {
  variant: 'smooth',
  trigger: PRAButton {
    variant: 'ghost',
    size: 'sm',
    icon: <ChevronDownIcon />
  }
}

// Inside Collapsible
PRAStack {
  direction: 'column',
  gap: 'lg'
}

// Source Selection
PRASelect {
  variant: 'searchable',
  label: 'Data Sources',
  multi: true,
  placeholder: 'Select sources...',
  options: availableSources
}

// Max Results Slider
PRASlider {
  variant: 'marks',
  label: 'Maximum Results',
  min: 10,
  max: 100,
  step: 10,
  marks: true,
  defaultValue: 50
}

// Filter Accordion
PRAAccordion {
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
PRAStack {
  direction: 'row',
  gap: 'md',
  justify: 'flex-end'
}

PRAButton {
  variant: 'outline',
  size: 'lg'
}

PRAButton {
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
PRAStack {
  direction: { xs: 'column', md: 'row' },
  gap: 'md',
  marginBottom: 'lg'
}

// Search
PRAInput {
  variant: 'glass',
  placeholder: 'Search research...',
  icon: <SearchIcon />,
  clearable: true,
  width: { xs: '100%', md: '300px' }
}

// Filter Buttons
PRAToggleGroup {
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
PRASelect {
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
PRAGrid {
  columns: { xs: 1, md: 2, xl: 3 },
  gap: 'lg'
}

// Individual Research Card
PRACard {
  variant: 'glass',
  hover: 'glow',
  interactive: true,
  padding: 'lg'
}

// Card Content
PRAStack {
  direction: 'column',
  gap: 'md'
}

// Header with Status
PRAStack {
  direction: 'row',
  justify: 'space-between',
  align: 'start'
}

PRAHeading {
  size: 'text-xl',
  weight: 'semibold',
  truncate: true
}

PRABadge {
  variant: statusVariant,
  size: 'sm'
}

// Query Preview
PRAText {
  variant: 'body',
  color: 'text-secondary',
  lines: 2 // Truncate to 2 lines
}

// Metadata
PRAStack {
  direction: 'row',
  gap: 'md',
  wrap: true
}

PRAText {
  variant: 'caption',
  color: 'text-tertiary'
}

// Progress (if processing)
PRAProgress {
  variant: 'linear',
  value: progress,
  size: 'sm',
  color: 'primary'
}

// Action Buttons
PRAStack {
  direction: 'row',
  gap: 'sm',
  justify: 'flex-end'
}

PRAButton {
  variant: 'ghost',
  size: 'sm',
  icon: <EyeIcon />
}

PRAButton {
  variant: 'ghost',
  size: 'sm',
  icon: <DownloadIcon />
}
```

## 6. Research Details Screen (`/app/research/:id`)

**Header Section:**
```typescript
// Back Navigation
PRABreadcrumbs {
  variant: 'arrow',
  items: [
    { label: 'Research', href: '/app/research' },
    { label: query, active: true }
  ]
}

// Title Bar
PRAStack {
  direction: { xs: 'column', md: 'row' },
  justify: 'space-between',
  align: { xs: 'start', md: 'center' },
  gap: 'md',
  marginBottom: 'xl'
}

PRAHeading {
  size: 'display-sm',
  weight: 'semibold'
}

// Action Buttons
PRAButtonGroup {
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
PRACard {
  variant: 'glass',
  padding: 'lg',
  marginBottom: 'lg'
}

PRAGrid {
  columns: { xs: 1, md: 4 },
  gap: 'md'
}

// Status Item
PRAStack {
  direction: 'column',
  gap: 'xs'
}

PRAText {
  variant: 'caption',
  color: 'text-secondary'
}

PRAText {
  variant: 'body',
  weight: 'medium'
}
```

**Results Table:**
```typescript
PRACard {
  variant: 'glass',
  padding: 'none',
  overflow: 'hidden'
}

// Table Header with Controls
PRACardHeader {
  padding: 'lg'
}

PRAStack {
  direction: 'row',
  justify: 'space-between',
  align: 'center'
}

PRAHeading {
  size: 'text-xl',
  weight: 'semibold'
}

// View Toggle
PRAToggleGroup {
  variant: 'single',
  size: 'sm',
  options: [
    { value: 'table', icon: <TableIcon /> },
    { value: 'cards', icon: <GridIcon /> }
  ]
}

// Results Table
PRATable {
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
PRAText {
  variant: 'body',
  weight: 'semibold',
  align: 'right'
}

// Availability Cell
PRABadge {
  variant: availability === 'in_stock' ? 'success' : 'warning',
  size: 'sm'
}

// Image Cell
PRAAvatar {
  variant: 'rounded',
  size: 'sm',
  src: imageUrl
}
```

## 7. Webhook Configuration Screen (`/app/webhooks`)

**Webhook List:**
```typescript
// Page Header
PRAStack {
  direction: 'row',
  justify: 'space-between',
  align: 'center',
  marginBottom: 'xl'
}

PRAHeading {
  size: 'display-sm',
  weight: 'semibold'
}

PRAButton {
  variant: 'gradient',
  size: 'md',
  icon: <PlusIcon />,
  glow: true,
  onClick: () => openModal()
}

// Webhook Cards
PRAStack {
  direction: 'column',
  gap: 'lg'
}

// Individual Webhook Card
PRACard {
  variant: 'glass',
  hover: 'lift',
  padding: 'lg'
}

PRAGrid {
  columns: { xs: 1, md: 3 },
  gap: 'md',
  align: 'center'
}

// URL Section
PRAStack {
  direction: 'column',
  gap: 'xs'
}

PRAText {
  variant: 'caption',
  color: 'text-secondary'
}

PRACode {
  variant: 'inline',
  copyable: true
}

// Events Section
PRAStack {
  direction: 'row',
  gap: 'sm'
}

PRAChip {
  variant: 'outline',
  size: 'sm'
}

// Status & Actions
PRAStack {
  direction: 'row',
  gap: 'md',
  align: 'center',
  justify: 'flex-end'
}

PRASwitch {
  variant: 'default',
  size: 'md',
  label: 'Active'
}

PRAButton {
  variant: 'ghost',
  size: 'sm',
  icon: <EditIcon />
}

PRAButton {
  variant: 'ghost',
  size: 'sm',
  icon: <TrashIcon />,
  color: 'danger'
}
```

**Add/Edit Webhook Modal:**
```typescript
// Using Stacked Modal
PRAStackedModal {
  open: isOpen,
  onClose: handleClose,
  variant: 'slide',
  navigationTitle: 'Configure Webhook',
  size: 'md'
}

// Modal Content
PRAForm {
  variant: 'vertical',
  validation: 'onBlur',
  gap: 'lg'
}

// URL Input
PRAInput {
  variant: 'glass',
  label: 'Webhook URL',
  placeholder: 'https://your-domain.com/webhook',
  helper: 'Must be a valid HTTPS endpoint',
  required: true,
  type: 'url',
  icon: <LinkIcon />
}

// Secret Input
PRAInput {
  variant: 'glass',
  label: 'Secret Key (Optional)',
  placeholder: 'Your secret for HMAC verification',
  helper: 'Used to sign webhook payloads',
  type: 'password',
  icon: <KeyIcon />,
  copyable: true
}

// Events Selection
PRACheckboxGroup {
  label: 'Events to Subscribe',
  options: [
    { value: 'research.completed', label: 'Research Completed' },
    { value: 'research.failed', label: 'Research Failed' }
  ],
  required: true
}

// Test Connection
PRAAlert {
  variant: 'info',
  title: 'Test Your Webhook',
  description: 'Send a test payload to verify your endpoint'
}

PRAButton {
  variant: 'outline',
  size: 'md',
  icon: <SendIcon />,
  fullWidth: true
}

// Modal Footer
PRAModalFooter {
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
PRATabs {
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
PRAForm {
  variant: 'horizontal',
  gap: 'lg'
}

// Avatar Upload
PRAStack {
  direction: 'column',
  align: 'center',
  gap: 'md'
}

PRAAvatar {
  variant: 'circle',
  size: 'xl',
  src: userAvatar
}

PRAButton {
  variant: 'outline',
  size: 'sm'
}

// Form Fields
PRAInput {
  variant: 'outlined',
  label: 'First Name',
  defaultValue: user.firstName
}

PRAInput {
  variant: 'outlined',
  label: 'Last Name',
  defaultValue: user.lastName
}

PRAInput {
  variant: 'outlined',
  label: 'Email',
  type: 'email',
  defaultValue: user.email,
  disabled: true
}

// Save Button
PRAButton {
  variant: 'gradient',
  size: 'md',
  alignSelf: 'flex-end'
}
```

**Appearance Tab:**
```typescript
// Theme Selection
PRARadioGroup {
  variant: 'cards',
  label: 'Theme Mode',
  options: [
    { value: 'light', label: 'Light', icon: <SunIcon /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
    { value: 'auto', label: 'System', icon: <ComputerIcon /> }
  ]
}

// Color Customization
PRAColorPicker {
  label: 'Primary Color',
  defaultValue: '#6366F1'
}

// Density Settings
PRASelect {
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
PRAContainer {
  variant: 'centered',
  minHeight: '100vh'
}

PRAStack {
  direction: 'column',
  align: 'center',
  gap: 'xl'
}

PRAHeading {
  size: 'display-lg',
  weight: 'bold',
  color: 'primary'
}

PRAText {
  variant: 'body',
  color: 'text-secondary',
  align: 'center'
}

PRAButton {
  variant: 'gradient',
  size: 'lg',
  icon: <HomeIcon />,
  glow: true
}
```

**Empty State:**
```typescript
PRACard {
  variant: 'glass',
  padding: 'xl',
  align: 'center'
}

PRAStack {
  direction: 'column',
  align: 'center',
  gap: 'lg'
}

// Illustration
PRAAvatar {
  variant: 'rounded',
  size: '2xl',
  src: '/empty-state.svg'
}

PRAHeading {
  size: 'text-xl',
  weight: 'semibold'
}

PRAText {
  variant: 'body',
  color: 'text-secondary'
}

PRAButton {
  variant: 'gradient',
  size: 'md',
  icon: <PlusIcon />
}
```

## 10. Loading States

**Page Loading:**
```typescript
PRAContainer {
  variant: 'centered',
  minHeight: '50vh'
}

PRAStack {
  direction: 'column',
  align: 'center',
  gap: 'lg'
}

PRASpinner {
  size: 'lg',
  color: 'primary'
}

PRAText {
  variant: 'body',
  color: 'text-secondary'
}
```

**Skeleton Loading:**
```typescript
// For tables
PRASkeleton {
  variant: 'rectangular',
  height: '400px',
  animation: 'wave'
}

// For cards
PRAGrid {
  columns: { xs: 1, md: 2, xl: 3 },
  gap: 'lg'
}

PRASkeleton {
  variant: 'rectangular',
  height: '200px',
  borderRadius: 'md'
}
```

These specifications provide a complete blueprint for implementing all MVP screens using the PRA Design System components. Each screen maintains consistency with the design tokens, follows accessibility standards, and implements responsive behavior as defined in the ui-ux.md document.