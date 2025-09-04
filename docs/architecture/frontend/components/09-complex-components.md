# Complex Components

[← Back to Main Documentation](./readme.md)

---

## Data Table Component

### Overview
Advanced data table component with support for sorting, filtering, pagination, and various display modes.

### Key Features
- **Display Variants**: default, striped, glass, minimal
- **Density Options**: compact, normal, comfortable
- **Sticky Header**: Keep headers visible during scroll
- **Enhanced Interactions**: Row hover effects, selection, sorting
- **Performance**: Virtual scrolling for large datasets
- **Responsive**: Automatic column prioritization on small screens

### Configuration Options
- Column definitions with custom renderers
- Sort handlers and default sort states
- Filter configurations per column
- Row actions and bulk operations
- Expandable rows for detail views
- Column resizing and reordering

## Chart Component

### Overview
Comprehensive charting solution supporting multiple visualization types with consistent theming.

### Supported Chart Types
- **Line Charts**: Time series and trend data
- **Bar Charts**: Categorical comparisons
- **Pie Charts**: Part-to-whole relationships
- **Area Charts**: Cumulative values over time
- **Scatter Plots**: Correlation analysis
- **Radar Charts**: Multi-dimensional comparisons

### Features
- **Theming**: Light, dark, and auto-adaptive themes
- **Animations**: Smooth entry and interaction animations
- **Interactivity**: Tooltips, zoom, pan, and drill-down
- **Responsive**: Automatic resizing and mobile optimization
- **Gradients**: Support for gradient fills and strokes
- **Real-time Updates**: Live data streaming support

## Navigation Component

### Overview
Flexible navigation system supporting multiple layout patterns and interaction modes.

### Navigation Patterns
- **Sidebar Navigation**: Fixed or collapsible side menu
- **Top Navigation**: Horizontal menu bar
- **Bottom Navigation**: Mobile-friendly bottom tabs
- **Floating Navigation**: Context-aware floating menu

### Features
- **Glass Morphism**: Translucent backgrounds with blur
- **Responsive Behavior**: Automatic adaptation to screen size
- **Nested Menus**: Multi-level navigation support
- **Active State Management**: Visual indicators for current location
- **Keyboard Navigation**: Full keyboard accessibility
- **Smooth Transitions**: Animated expand/collapse

## Form Component

### Overview
Advanced form system with built-in validation, field management, and multiple layout options.

### Form Layouts
- **Vertical**: Traditional top-to-bottom layout
- **Horizontal**: Label-field side-by-side
- **Inline**: Compact single-line forms
- **Stepped**: Multi-step wizard forms

### Features
- **Floating Labels**: Space-efficient animated labels
- **Validation**: Real-time, on-blur, or on-submit validation
- **Field Dependencies**: Conditional field visibility
- **Auto-save**: Periodic form state preservation
- **Progress Indication**: Visual progress for multi-step forms
- **Error Recovery**: Graceful error handling and recovery

## Stacked Modal Component (GTM-Style)

### Overview
Advanced modal system supporting nested modals with proper focus management, similar to Google Tag Manager's interface.

### Key Capabilities
- **Nested Modals**: Support for up to 3 levels of nesting
- **Focus Management**: Proper focus trap and restoration
- **Keyboard Navigation**: ESC key and tab navigation support
- **Visual Hierarchy**: Each level has distinct visual treatment
- **Smooth Animations**: Slide and fade transitions between levels

### Modal Variants
- **Fullscreen**: Takes entire viewport with optional margins
- **Slide Panel**: Slides in from the side
- **Wizard**: Step-by-step guided flow

### Stack Management Features
- **Context Provider**: Centralized modal stack management
- **Automatic Cleanup**: Proper cleanup on unmount
- **Body Scroll Lock**: Prevents background scrolling
- **ARIA Compliance**: Full accessibility support
- **Breadcrumb Navigation**: Shows depth in nested hierarchy

### Best Practices
- Limit nesting to 2-3 levels maximum
- Use wizard pattern for deeper flows
- Provide clear back/close navigation
- Maintain visual hierarchy with shadows and margins
- Include loading states for async operations

## Wizard Modal Pattern

### Overview
Alternative to deep nesting, providing a step-by-step flow within a single modal context.

### Features
- **Step Management**: Linear or non-linear progression
- **Validation**: Per-step validation before proceeding
- **Progress Indication**: Visual progress bar and step indicators
- **Skip Logic**: Conditional step skipping
- **Jump Navigation**: Direct navigation to visited steps
- **Data Persistence**: Form data maintained across steps

### Step Configuration
- Step title and subtitle
- Custom component per step
- Validation rules
- Skip conditions
- Completion callbacks

### Navigation Options
- Back/Next buttons
- Step indicator clicking (when allowed)
- Keyboard shortcuts
- Skip functionality for optional steps

## Implementation Guidelines

### Performance Considerations
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Lazy load chart data
- Debounce search and filter inputs
- Use CSS transforms for animations

### Accessibility Requirements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader announcements
- High contrast mode support

### Mobile Adaptations
- Touch-friendly interactions
- Swipe gestures for navigation
- Responsive breakpoints
- Optimized tap targets
- Reduced motion options

---

[Previous: Core Components ←](./08-core-components.md) | [Next: Additional Components →](./09b-additional-components.md)