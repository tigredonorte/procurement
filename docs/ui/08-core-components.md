# Core Components Library

[← Back to Main Documentation](./Readme.md)

---

## Complete Component List

Our UI library provides a comprehensive set of components, fully wrapping Material UI with custom styling and enhanced functionality. Below is the complete list organized by category:

### Layout Components

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAAccordion** | Expandable content panels | `default`, `glass`, `bordered`, `separated` |
| **PRACard** | Content container | `elevated`, `outlined`, `glass`, `gradient`, `neumorphic` |
| **PRACollapsible** | Collapsible content area | `default`, `smooth`, `spring` |
| **PRADrawer** | Side panel overlay | `left`, `right`, `top`, `bottom`, `glass` |
| **PRAResizable** | Resizable container | `horizontal`, `vertical`, `both` |
| **PRASeparator** | Visual divider | `solid`, `dashed`, `dotted`, `gradient` |
| **PRASidebar** | Navigation sidebar | `fixed`, `collapsible`, `floating`, `glass` |
| **PRASkeleton** | Loading placeholder | `text`, `circular`, `rectangular`, `wave` |
| **PRASpacer** | Flexible spacing | Fixed sizes from `xs` to `xl` |

### Navigation Components

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRABreadcrumbs** | Navigation path | `default`, `slash`, `arrow`, `chevron` |
| **PRAContextMenu** | Right-click menu | `default`, `glass`, `dark` |
| **PRADropdownMenu** | Dropdown options | `default`, `glass`, `minimal` |
| **PRANavigationMenu** | Main navigation | `horizontal`, `vertical`, `mega` |
| **PRAPagination** | Page navigation | `default`, `rounded`, `dots`, `minimal` |
| **PRAScrollArea** | Custom scrollbar area | `auto`, `always`, `hover`, `hidden` |
| **PRATabs** | Tabbed interface | `default`, `pills`, `underline`, `enclosed` |

### Form Components

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAButton** | Interactive button | `solid`, `outline`, `ghost`, `glass`, `gradient` |
| **PRACalendar** | Date picker calendar | `default`, `range`, `multi`, `year` |
| **PRACheckbox** | Checkbox input | `default`, `rounded`, `toggle`, `indeterminate` |
| **PRACommand** | Command palette | `default`, `floating`, `inline` |
| **PRAForm** | Form wrapper | `vertical`, `horizontal`, `inline`, `stepped` |
| **PRAInput** | Text input | `outlined`, `filled`, `glass`, `underline` |
| **PRAInputOTP** | OTP input field | `numeric`, `alphanumeric`, `masked` |
| **PRALabel** | Form label | `default`, `floating`, `required`, `optional` |
| **PRAMenubar** | Application menubar | `default`, `glass`, `minimal` |
| **PRARadioGroup** | Radio button group | `default`, `cards`, `buttons`, `segments` |
| **PRASelect** | Dropdown select | `default`, `searchable`, `multi`, `creatable` |
| **PRASlider** | Range slider | `default`, `range`, `marks`, `gradient` |
| **PRASwitch** | Toggle switch | `default`, `ios`, `android`, `label` |
| **PRATextarea** | Multi-line input | `default`, `autosize`, `resizable`, `rich` |
| **PRAToggle** | Toggle button | `default`, `outline`, `soft` |
| **PRAToggleGroup** | Toggle button group | `single`, `multiple`, `exclusive` |

### Data Display Components

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAAlert** | Alert message | `info`, `success`, `warning`, `danger`, `glass` |
| **PRAAlertDialog** | Confirmation dialog | `default`, `destructive`, `glass` |
| **PRAAvatar** | User avatar | `circle`, `square`, `rounded`, `status` |
| **PRABadge** | Status indicator | `default`, `dot`, `count`, `gradient` |
| **PRACarousel** | Image/content carousel | `default`, `cards`, `fade`, `3d` |
| **PRAChart** | Data visualization | `line`, `bar`, `pie`, `area`, `scatter` |
| **PRAHoverCard** | Hover tooltip card | `default`, `glass`, `detailed` |
| **PRAPopover** | Popover container | `default`, `glass`, `arrow` |
| **PRAProgress** | Progress indicator | `linear`, `circular`, `segmented`, `gradient` |
| **PRASheet** | Bottom sheet | `default`, `glass`, `draggable` |
| **PRATable** | Data table | `default`, `striped`, `glass`, `minimal` |
| **PRATooltip** | Tooltip overlay | `default`, `dark`, `light`, `glass` |

### Feedback Components

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRADialog** | Modal dialog | `default`, `glass`, `fullscreen`, `drawer` |
| **PRAModal** | Modal overlay | `center`, `top`, `bottom`, `glass` |
| **PRAStackedModal** | GTM-style nested dialogs | `fullscreen`, `slide`, `wizard` |
| **PRASonner** | Stacked notifications | `default`, `glass`, `minimal` |
| **PRAToast** | Toast notification | `default`, `success`, `error`, `promise` |

### Typography Components

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAText** | Text wrapper | `body`, `heading`, `caption`, `code` |
| **PRAHeading** | Heading element | `h1` through `h6`, `display` |
| **PRAParagraph** | Paragraph text | `default`, `lead`, `muted`, `small` |
| **PRACode** | Code display | `inline`, `block`, `highlight` |
| **PRABlockquote** | Quote block | `default`, `bordered`, `citation` |

### Utility Components

| Component | Description | Variants |
|-----------|-------------|----------|
| **PRAAspectRatio** | Aspect ratio container | `16:9`, `4:3`, `1:1`, `custom` |
| **PRAPortal** | Portal rendering | Target specific DOM nodes |
| **PRATransition** | Animation wrapper | `fade`, `slide`, `scale`, `collapse` |
| **PRAVirtualList** | Virtual scrolling | `fixed`, `variable`, `grid` |
| **PRAInfiniteScroll** | Infinite loading | `default`, `reverse`, `horizontal` |

## Component Implementation Examples

### Button Component

```typescript
interface PRAButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'glass' | 'gradient';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  glow?: boolean;
  pulse?: boolean;
  ripple?: boolean;
}

// Usage
<PRAButton 
  variant="gradient" 
  size="lg" 
  glow 
  icon={<SearchIcon />}
>
  Start Research
</PRAButton>
```

### Input Component

```typescript
interface PRAInputProps {
  variant?: 'outlined' | 'filled' | 'glass' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  icon?: React.ReactNode;
  adornment?: {
    start?: React.ReactNode;
    end?: React.ReactNode;
  };
  floating?: boolean;
  clearable?: boolean;
  copyable?: boolean;
  masked?: string; // Input mask pattern
}

// Usage
<PRAInput
  variant="glass"
  label="Search Products"
  icon={<SearchIcon />}
  clearable
  floating
/>
```

### Card Component

```typescript
interface PRACardProps {
  variant?: 'elevated' | 'outlined' | 'glass' | 'gradient' | 'neumorphic';
  interactive?: boolean;
  hover?: 'lift' | 'glow' | 'scale' | 'tilt' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  overflow?: 'visible' | 'hidden' | 'auto';
  glass?: {
    blur?: number;
    opacity?: number;
    color?: string;
  };
}

// Usage
<PRACard 
  variant="glass" 
  hover="glow"
  glass={{ blur: 20, opacity: 0.8 }}
>
  <PRACardHeader>
    <PRAHeading size="h4">Research Results</PRAHeading>
  </PRACardHeader>
  <PRACardContent>
    {/* Content */}
  </PRACardContent>
</PRACard>
```

### Modal/Dialog Component

```typescript
interface PRAModalProps {
  open: boolean;
  onClose: () => void;
  variant?: 'default' | 'glass' | 'fullscreen' | 'drawer' | 'command';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  animation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'zoom';
  backdrop?: 'default' | 'blur' | 'dark' | 'transparent';
  closable?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  preserveScroll?: boolean;
}

// Usage
<PRAModal
  open={isOpen}
  onClose={handleClose}
  variant="glass"
  size="lg"
  animation="scale"
  backdrop="blur"
>
  <PRAModalHeader>
    <PRAHeading>Product Details</PRAHeading>
    <PRAModalClose />
  </PRAModalHeader>
  <PRAModalContent>
    {/* Modal content */}
  </PRAModalContent>
  <PRAModalFooter>
    <PRAButton variant="ghost" onClick={handleClose}>Cancel</PRAButton>
    <PRAButton variant="gradient" onClick={handleConfirm}>Confirm</PRAButton>
  </PRAModalFooter>
</PRAModal>
```

### Table Component

```typescript
interface PRATableProps {
  variant?: 'default' | 'striped' | 'glass' | 'minimal' | 'bordered';
  density?: 'compact' | 'normal' | 'comfortable';
  stickyHeader?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    position?: 'top' | 'bottom' | 'both';
  };
  virtualized?: boolean;
  resizable?: boolean;
}

// Usage
<PRATable
  variant="glass"
  hoverable
  sortable
  pagination={{ enabled: true, pageSize: 20 }}
>
  <PRATableHeader>
    <PRATableRow>
      <PRATableHead>Product</PRATableHead>
      <PRATableHead>Price</PRATableHead>
      <PRATableHead>Status</PRATableHead>
    </PRATableRow>
  </PRATableHeader>
  <PRATableBody>
    {data.map(row => (
      <PRATableRow key={row.id}>
        <PRATableCell>{row.product}</PRATableCell>
        <PRATableCell>{row.price}</PRATableCell>
        <PRATableCell>
          <PRABadge variant="gradient">{row.status}</PRABadge>
        </PRATableCell>
      </PRATableRow>
    ))}
  </PRATableBody>
</PRATable>
```

## Component Styling System

All components follow a consistent styling system:

```typescript
// Base component style interface
interface ComponentStyleProps {
  // Spacing
  m?: SpacingValue;  // margin
  p?: SpacingValue;  // padding
  mx?: SpacingValue; // margin horizontal
  my?: SpacingValue; // margin vertical
  px?: SpacingValue; // padding horizontal
  py?: SpacingValue; // padding vertical
  
  // Display
  display?: 'block' | 'inline' | 'flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  
  // Sizing
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  
  // Flexbox/Grid
  flex?: string | number;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: SpacingValue;
  
  // Visual
  bg?: ColorValue;
  color?: ColorValue;
  border?: string;
  borderRadius?: RadiusValue;
  shadow?: ShadowValue;
  opacity?: number;
  
  // Animation
  animate?: boolean;
  transition?: string;
  transform?: string;
  
  // Responsive
  responsive?: {
    xs?: Partial<ComponentStyleProps>;
    sm?: Partial<ComponentStyleProps>;
    md?: Partial<ComponentStyleProps>;
    lg?: Partial<ComponentStyleProps>;
    xl?: Partial<ComponentStyleProps>;
  };
}
```

## Component Composition

Components can be composed for complex UI patterns:

```typescript
// Research Card Composition
<PRACard variant="glass" hover="lift">
  <PRACardHeader>
    <PRAAvatar src={user.avatar} status="online" />
    <PRAStack direction="column" gap={1}>
      <PRAHeading size="h5">{research.title}</PRAHeading>
      <PRAText variant="muted">{research.date}</PRAText>
    </PRAStack>
    <PRADropdownMenu>
      <PRAMenuItem icon={<EditIcon />}>Edit</PRAMenuItem>
      <PRAMenuItem icon={<DeleteIcon />}>Delete</PRAMenuItem>
    </PRADropdownMenu>
  </PRACardHeader>
  
  <PRACardContent>
    <PRAProgress value={research.progress} variant="gradient" />
    <PRAText>{research.description}</PRAText>
  </PRACardContent>
  
  <PRACardFooter>
    <PRAButtonGroup>
      <PRAButton variant="ghost" size="sm">Cancel</PRAButton>
      <PRAButton variant="gradient" size="sm">View Results</PRAButton>
    </PRAButtonGroup>
  </PRACardFooter>
</PRACard>
```

---

[Next: Complex Components →](./09-complex-components.md)