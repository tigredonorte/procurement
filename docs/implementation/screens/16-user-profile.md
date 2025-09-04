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

