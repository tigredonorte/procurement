# Additional Complex Components

[← Back to Main Documentation](./readme.md)

---

## Extended Component Library

These components extend the core Material UI library with specialized functionality for the Requisio.com platform.

### AutoComplete Component

An autocomplete text input
(check autocomplete.md for more details)

### RichTextEditor Component

**Purpose**: WYSIWYG or Markdown editor with formatting toolbar

```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  mode?: 'wysiwyg' | 'markdown' | 'dual';
  variant?: 'glass' | 'outlined' | 'filled';
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
  toolbar?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    lists?: boolean;
    links?: boolean;
    codeBlocks?: boolean;
    images?: boolean;
    tables?: boolean;
  };
  collaborative?: {
    enabled: boolean;
    userId: string;
    roomId: string;
  };
}
```

**Features**:

- Bold/italic/underline formatting
- Ordered and unordered lists
- Link insertion and editing
- Code blocks with syntax highlighting
- Image embeds with drag-and-drop
- Markdown mode with live preview
- Collaborative editing (optional)
- Custom toolbar configuration
- Keyboard shortcuts support

### DataGrid / AdvancedTable Component

**Purpose**: Enhanced data table with sorting, filtering, pagination, and inline editing

```typescript
interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  variant?: 'glass' | 'bordered' | 'striped';
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
  };
  sorting?: boolean;
  filtering?: boolean;
  editable?: boolean;
  virtualization?: boolean;
  stickyHeader?: boolean;
  export?: {
    csv?: boolean;
    excel?: boolean;
    pdf?: boolean;
  };
  onRowEdit?: (row: T) => void;
  onSelectionChange?: (selected: T[]) => void;
}

interface ColumnDef<T> {
  key: keyof T;
  header: string;
  width?: number;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  cell?: (value: any, row: T) => React.ReactNode;
}
```

**Features**:

- Advanced sorting (multi-column)
- Column filtering with various operators
- Pagination with customizable page sizes
- Inline cell editing
- Column resizing and reordering
- Sticky headers for scrolling
- Row selection (single/multi)
- Virtualization for large datasets
- Export to CSV/Excel/PDF
- Responsive mobile view

### WorkflowBuilder / StepperFlow Component

**Purpose**: Drag-and-drop or linear step builder for automation pipelines and wizards

```typescript
interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'loop' | 'parallel';
  label: string;
  description?: string;
  icon?: React.ReactNode;
  config?: Record<string, any>;
  validation?: (config: any) => boolean | string;
}

interface WorkflowBuilderProps {
  steps: WorkflowStep[];
  value: WorkflowStep[];
  onChange: (workflow: WorkflowStep[]) => void;
  mode?: 'drag-drop' | 'linear' | 'hybrid';
  variant?: 'glass' | 'outlined';
  allowBranching?: boolean;
  validation?: {
    perStep?: boolean;
    onSave?: boolean;
  };
  persistence?: {
    autoSave?: boolean;
    resumable?: boolean;
  };
}
```

**Features**:

- Drag-and-drop step arrangement
- Linear step progression
- Branching logic support
- Conditional steps
- Validation per step
- Save and resume functionality
- Step templates library
- Undo/redo support
- Visual flow preview
- Mobile-optimized interface

### FileUpload Component

**Purpose**: File picker with drag-and-drop zone and upload management

```typescript
interface FileUploadProps {
  accept?: string | string[];
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  variant?: 'dropzone' | 'button' | 'inline';
  onUpload: (files: File[]) => Promise<void>;
  onProgress?: (progress: number, file: File) => void;
  onError?: (error: Error, file: File) => void;
  preview?: boolean;
  autoUpload?: boolean;
  allowRetry?: boolean;
  showProgress?: boolean;
}

interface UploadedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  preview?: string;
}
```

**Features**:

- Drag-and-drop file zone
- File type validation
- Size restrictions
- Progress bars with percentages
- Thumbnail previews for images
- Retry failed uploads
- Cancel ongoing uploads
- Multiple file selection
- Paste from clipboard
- Integration with cloud storage

### NotificationCenter Component

**Purpose**: In-app notification hub for persistent notifications

```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  notifications: Notification[];
  variant?: 'dropdown' | 'sidebar' | 'modal';
  groupBy?: 'type' | 'category' | 'date';
  filters?: {
    types?: boolean;
    dateRange?: boolean;
    search?: boolean;
  };
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  infiniteScroll?: boolean;
}
```

**Features**:

- Grouped by type/category/date
- Read/unread states with badges
- Time-based filtering
- Search functionality
- Infinite scroll pagination
- Mark as read (single/all)
- Delete notifications
- Real-time updates
- Sound/desktop notifications
- Notification preferences

### StackedModal Component

**Purpose**: GTM-style stacked modal system for nested workflows

```typescript
interface StackedModalProps {
  open: boolean;
  onClose: () => void;
  glass: boolean;
  navigationTitle?: string;
  children: React.ReactNode;
}
```

**Features**:

- Nested modal support with back navigation
- Smooth transitions between modal states
- Focus management and trap
- Keyboard navigation support
- Mobile-responsive sliding panels
- on small screens the active modal always ocuppies 100% of size. On tablets it occupies 90%, 80% on desktop, 70% on very large screens. When you open a modal inside of current modal, apply a class secondary-modal on it. The highest level modal has a class primary-modal. The rule of 100, 90,80,70 applies only on primary-modal. Secondary modal must ocuppy 100%. Secondary modal cannot have glass effect. Primary modal can have glass effect to see secondary modal or current page. If a third level modal opens, the primary becomes secondary, the new one is the primary and the secondary is removed from ui for performance. It applies for any new level. When modal becomes secondary is expected an expand effect that transforms it from current size to the new size. When a primary is closed, if there is a secondary, secondary becomes primary and you render the next level again (if there is next level), you render it as secondary. When transitioning from secondary to primary, or from primary to secondary there is a expand/contract effect. Actions on this modal is located on header alignet to right. This modal have a close button aligned to left. The title will be close to this close modal, also aligned to left

### AnimatedIcon Component

**Purpose**: Animated icons for loading states and interactions

```typescript
interface AnimatedIconProps {
  variant: 'processing' | 'success' | 'error' | 'loading' | 'pulse';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: ColorValue;
  duration?: number;
}
```

**Animation Variants**:

- `processing`: Rotating gear/spinner
- `success`: Check mark appearance
- `error`: X mark with shake
- `loading`: Smooth spinner
- `pulse`: Pulsing glow effect

### LottieAnimation Component

**Purpose**: Complex animations using Lottie files

```typescript
interface LottieAnimationProps {
  src: string; // Path to .json animation file
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  autoplay?: boolean;
  loop?: boolean;
  onComplete?: () => void;
}
```

**Use Cases**:

- Onboarding animations
- Empty state illustrations
- Success/error feedback
- Loading states

### TutorialOverlay Component

**Purpose**: Interactive tutorial system for user onboarding

```typescript
interface TutorialStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  initialStep?: number;
}
```

**Features**:

- Spotlight effect on target elements
- Step navigation with progress
- Skip and restart options
- Mobile-responsive positioning

### AddressAutocomplete Component

**Purpose**: Google Maps integrated address input

```typescript
interface AddressAutocompleteProps {
  variant?: 'glass' | 'outlined' | 'filled';
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  onSelect: (address: AddressDetails) => void;
  googleMapsApiKey: string;
  floating?: boolean;
  restrictions?: {
    country?: string | string[];
    types?: string[];
  };
}

interface AddressDetails {
  formatted: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
```

**Features**:

- Real-time address suggestions
- Address component parsing
- Coordinate extraction
- Country/type restrictions
- Validation support

### PhoneInput Component

**Purpose**: International phone number input with validation

```typescript
interface PhoneInputProps {
  variant?: 'glass' | 'outlined' | 'filled';
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  defaultValue?: string;
  countryCode?: string;
  floating?: boolean;
  onChange?: (value: string, isValid: boolean) => void;
  helper?: string;
}
```

**Features**:

- Country code selector
- Phone number formatting
- International validation
- Auto-detection of country
- Mobile keyboard optimization

### CodeEditor Component

**Purpose**: Syntax-highlighted code editing

```typescript
interface CodeEditorProps {
  language: 'json' | 'javascript' | 'typescript' | 'css' | 'html' | 'yaml';
  height?: string;
  theme?: 'light' | 'dark' | 'auto';
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  lineNumbers?: boolean;
  minimap?: boolean;
}
```

**Features**:

- Syntax highlighting
- Auto-completion
- Error highlighting
- Theme support
- Mobile-responsive

### MapPreview Component

**Purpose**: Interactive map display for addresses

```typescript
interface MapPreviewProps {
  coordinates: { lat: number; lng: number };
  marker?: boolean;
  height?: string;
  interactive?: boolean;
  zoom?: number;
  onMarkerDrag?: (coords: { lat: number; lng: number }) => void;
}
```

**Features**:

- Google Maps integration
- Marker placement
- Draggable markers
- Zoom controls
- Street view option

### TimingDiagram Component

**Purpose**: Visualize request/response timing

```typescript
interface TimingDiagramProps {
  data: {
    dns?: number;
    connect?: number;
    ssl?: number;
    request?: number;
    response?: number;
    total: number;
  };
  showLabels?: boolean;
  color?: ColorValue;
}
```

**Features**:

- Waterfall visualization
- Timing breakdowns
- Interactive tooltips
- Performance indicators

### PasswordStrength Component

**Purpose**: Visual password strength indicator

```typescript
interface PasswordStrengthProps {
  value: number; // 0-100
  showRequirements?: boolean;
  requirements?: {
    minLength?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    special?: boolean;
  };
}
```

**Features**:

- Strength meter
- Requirement checklist
- Real-time validation
- Color-coded feedback

### Timeline Component

**Purpose**: Activity timeline display

```typescript
interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  color?: ColorValue;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact' | 'detailed';
  orientation?: 'vertical' | 'horizontal';
}
```

**Features**:

- Chronological display
- Interactive items
- Expandable details
- Custom icons and colors

### CommandPalette Component

**Purpose**: Global command search interface

```typescript
interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  placeholder?: string;
  width?: string;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  category?: string;
  action: () => void;
}
```

**Features**:

- Fuzzy search
- Keyboard shortcuts
- Category grouping
- Recent commands
- Quick actions

## Enhanced Component Properties

### Glow Effect

**Applicable to**: Button, Card, Badge

```typescript
interface GlowProps {
  glow?:
    | boolean
    | {
        color?: ColorValue;
        intensity?: 'subtle' | 'medium' | 'strong';
        animate?: boolean;
      };
}
```

**Implementation**:

```scss
.glow {
  box-shadow: 0 0 20px rgba(primary-color, 0.4);

  &.animate {
    animation: pulse-glow 2s infinite;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(primary-color, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(primary-color, 0.6);
  }
}
```

### Pulse Animation

**Applicable to**: Badge, Avatar, Button

```typescript
interface PulseProps {
  pulse?:
    | boolean
    | {
        color?: ColorValue;
        duration?: number;
        scale?: number;
      };
}
```

**Implementation**:

```scss
.pulse {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
```

---

[Previous: Complex Components ←](./09-complex-components.md)
