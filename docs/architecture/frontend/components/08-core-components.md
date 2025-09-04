# Core Components Library

[← Back to Main Documentation](./readme.md)

---

## Complete Component List

Our UI library provides a comprehensive set of components, fully wrapping Material UI with custom styling and enhanced functionality. Below is the complete list organized by category:

### Layout Components

| Component       | Description               | Variants                                                  |
| --------------- | ------------------------- | --------------------------------------------------------- |
| **Accordion**   | Expandable content panels | `default`, `glass`, `bordered`, `separated`               |
| **Container**   | Container component       |
| **Card**        | Content container         | `elevated`, `outlined`, `glass`, `gradient`, `neumorphic` |
| **Collapsible** | Collapsible content area  | `default`, `smooth`, `spring`                             |
| **Drawer**      | Side panel overlay        | `left`, `right`, `top`, `bottom`, `glass`                 |
| **Resizable**   | Resizable container       | `horizontal`, `vertical`, `both`                          |
| **Separator**   | Visual divider            | `solid`, `dashed`, `dotted`, `gradient`                   |
| **Sidebar**     | Navigation sidebar        | `fixed`, `collapsible`, `floating`, `glass`               |
| **Skeleton**    | Loading placeholder       | `text`, `circular`, `rectangular`, `wave`                 |
| **Spacer**      | Flexible spacing          | Fixed sizes from `xs` to `xl`                             |

### Navigation Components

| Component          | Description           | Variants                                    |
| ------------------ | --------------------- | ------------------------------------------- |
| **Breadcrumbs**    | Navigation path       | `default`, `slash`, `arrow`, `chevron`      |
| **ContextMenu**    | Right-click menu      | `default`, `glass`, `dark`                  |
| **DropdownMenu**   | Dropdown options      | `default`, `glass`, `minimal`               |
| **NavigationMenu** | Main navigation       | `horizontal`, `vertical`, `mega`            |
| **Pagination**     | Page navigation       | `default`, `rounded`, `dots`, `minimal`     |
| **ScrollArea**     | Custom scrollbar area | `auto`, `always`, `hover`, `hidden`         |
| **Tabs**           | Tabbed interface      | `default`, `pills`, `underline`, `enclosed` |

### Form Components

| Component       | Description          | Variants                                         |
| --------------- | -------------------- | ------------------------------------------------ |
| **Button**      | Interactive button   | `solid`, `outline`, `ghost`, `glass`, `gradient` |
| **Calendar**    | Date picker calendar | `default`, `range`, `multi`, `year`              |
| **Checkbox**    | Checkbox input       | `default`, `rounded`, `toggle`, `indeterminate`  |
| **Command**     | Command palette      | `default`, `floating`, `inline`                  |
| **Form**        | Form wrapper         | `vertical`, `horizontal`, `inline`, `stepped`    |
| **Input**       | Text input           | `outlined`, `filled`, `glass`, `underline`       |
| **InputOTP**    | OTP input field      | `numeric`, `alphanumeric`, `masked`              |
| **Label**       | Form label           | `default`, `floating`, `required`, `optional`    |
| **Menubar**     | Application menubar  | `default`, `glass`, `minimal`                    |
| **RadioGroup**  | Radio button group   | `default`, `cards`, `buttons`, `segments`        |
| **Select**      | Dropdown select      | `default`, `searchable`, `multi`, `creatable`    |
| **Slider**      | Range slider         | `default`, `range`, `marks`, `gradient`          |
| **Switch**      | Toggle switch        | `default`, `ios`, `android`, `label`             |
| **Textarea**    | Multi-line input     | `default`, `autosize`, `resizable`, `rich`       |
| **Toggle**      | Toggle button        | `default`, `outline`, `soft`                     |
| **ToggleGroup** | Toggle button group  | `single`, `multiple`, `exclusive`                |

### Data Display Components

| Component       | Description            | Variants                                        |
| --------------- | ---------------------- | ----------------------------------------------- |
| **Alert**       | Alert message          | `info`, `success`, `warning`, `danger`, `glass` |
| **AlertDialog** | Confirmation dialog    | `default`, `destructive`, `glass`               |
| **Avatar**      | User avatar            | `circle`, `square`, `rounded`, `status`         |
| **Badge**       | Status indicator       | `default`, `dot`, `count`, `gradient`           |
| **Carousel**    | Image/content carousel | `default`, `cards`, `fade`, `3d`                |
| **Chart**       | Data visualization     | `line`, `bar`, `pie`, `area`, `scatter`         |
| **HoverCard**   | Hover tooltip card     | `default`, `glass`, `detailed`                  |
| **Popover**     | Popover container      | `default`, `glass`, `arrow`                     |
| **Progress**    | Progress indicator     | `linear`, `circular`, `segmented`, `gradient`   |
| **Sheet**       | Bottom sheet           | `default`, `glass`, `draggable`                 |
| **Table**       | Data table             | `default`, `striped`, `glass`, `minimal`        |
| **Tooltip**     | Tooltip overlay        | `default`, `dark`, `light`, `glass`             |

### Feedback Components

| Component        | Description              | Variants                                   |
| ---------------- | ------------------------ | ------------------------------------------ |
| **Dialog**       | Modal dialog             | `default`, `glass`, `fullscreen`, `drawer` |
| **Modal**        | Modal overlay            | `center`, `top`, `bottom`, `glass`         |
| **StackedModal** | GTM-style nested dialogs | `fullscreen`, `slide`, `wizard`            |
| **Sonner**       | Stacked notifications    | `default`, `glass`, `minimal`              |
| **Toast**        | Toast notification       | `default`, `success`, `error`, `promise`   |

### Typography Components

| Component      | Description     | Variants                             |
| -------------- | --------------- | ------------------------------------ |
| **Text**       | Text wrapper    | `body`, `heading`, `caption`, `code` |
| **Heading**    | Heading element | `h1` through `h6`, `display`         |
| **Paragraph**  | Paragraph text  | `default`, `lead`, `muted`, `small`  |
| **Code**       | Code display    | `inline`, `block`, `highlight`       |
| **Blockquote** | Quote block     | `default`, `bordered`, `citation`    |

### Utility Components

| Component          | Description            | Variants                             |
| ------------------ | ---------------------- | ------------------------------------ |
| **AspectRatio**    | Aspect ratio container | `16:9`, `4:3`, `1:1`, `custom`       |
| **Portal**         | Portal rendering       | Target specific DOM nodes            |
| **Transition**     | Animation wrapper      | `fade`, `slide`, `scale`, `collapse` |
| **VirtualList**    | Virtual scrolling      | `fixed`, `variable`, `grid`          |
| **InfiniteScroll** | Infinite loading       | `default`, `reverse`, `horizontal`   |

## Component API Specifications

### Core Component Properties

Each component in our library supports a standard set of properties:

#### Common Properties

- **variant**: Visual style variant specific to each component
- **size**: Size options (xs, sm, md, lg, xl)
- **color**: Theme color palette options
- **disabled**: Disable interaction state
- **className**: Custom CSS classes
- **style**: Inline style overrides

#### Interactive Properties

- **onClick**: Click event handler
- **onFocus/onBlur**: Focus event handlers
- **loading**: Loading state indicator
- **ripple**: Ripple effect on interaction

#### Visual Enhancement Properties

- **glow**: Glow effect for emphasis
- **pulse**: Pulse animation for attention
- **glass**: Glassmorphism effects with blur and opacity
- **gradient**: Gradient backgrounds and borders

## Component Styling System

All components follow a consistent styling system with these categories:

### Spacing Properties

- Margin and padding utilities (m, p, mx, my, px, py)
- Support for responsive spacing values
- Consistent spacing scale from design tokens

### Display Properties

- Display types (block, inline, flex, grid, none)
- Position values (static, relative, absolute, fixed, sticky)
- Overflow handling

### Sizing Properties

- Width and height controls
- Min/max constraints
- Responsive sizing options

### Layout Properties

- Flexbox utilities
- Grid system support
- Gap and alignment controls

### Visual Properties

- Background and color options
- Border and radius controls
- Shadow effects from design system
- Opacity and blend modes

### Animation Properties

- Transition configurations
- Transform utilities
- Animation presets

### Responsive Design

- Breakpoint-specific property overrides
- Mobile-first approach
- Fluid typography and spacing

## Component Composition Patterns

### Compound Components

Components are designed to work together in compound patterns:

- **Card** with CardHeader, CardContent, CardFooter
- **Modal** with ModalHeader, ModalContent, ModalFooter
- **Table** with TableHeader, TableBody, TableRow, TableCell
- **Form** with FormField, FormLabel, FormControl, FormMessage

### Layout Composition

- Use **Stack** for vertical/horizontal layouts
- Use **Grid** for complex grid-based layouts
- Use **Flex** for flexible box layouts
- Combine with **Spacer** for precise spacing control

### State Management

- Components support controlled and uncontrolled modes
- Built-in state management for complex interactions
- Integration with form libraries (React Hook Form)
- Support for validation and error states

### Accessibility Features

- ARIA attributes automatically applied
- Keyboard navigation support
- Screen reader optimizations
- Focus management utilities

---

[Previous: Component Examples ←](./04-component-examples.md) | [Next: Complex Components →](./09-complex-components.md)
