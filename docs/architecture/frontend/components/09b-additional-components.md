# Additional Complex Components

[← Back to Main Documentation](./readme.md)

---

## Extended Component Library

These components extend the core Material UI library with specialized functionality for the Requisio.com platform.

### StackedModal Component

**Purpose**: GTM-style stacked modal system for nested workflows

```typescript
interface StackedModalProps {
  open: boolean;
  onClose: () => void;
  variant?: 'slide' | 'fade' | 'zoom';
  navigationTitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}
```

**Features**:
- Nested modal support with back navigation
- Smooth transitions between modal states
- Focus management and trap
- Keyboard navigation support
- Mobile-responsive sliding panels

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
  glow?: boolean | {
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
  0%, 100% { box-shadow: 0 0 20px rgba(primary-color, 0.4); }
  50% { box-shadow: 0 0 30px rgba(primary-color, 0.6); }
}
```

### Pulse Animation

**Applicable to**: Badge, Avatar, Button

```typescript
interface PulseProps {
  pulse?: boolean | {
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