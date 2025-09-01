# Component Patterns - Requisio.com

## Overview

This document defines the component patterns and architectural guidelines for the Requisio.com frontend, demonstrating best practices for TypeScript, Material-UI integration, and component composition.

## Component Categories

### 1. Page Components

**Purpose**: Top-level route components that compose features

**Pattern Requirements**:
- Lazy loading with React.lazy()
- Error boundaries for fault isolation
- Loading states during data fetch
- SEO metadata management

**Examples**:
- `DashboardPage`: Main user dashboard
- `ResearchPage`: Research request management
- `SettingsPage`: User preferences

### 2. Feature Components

**Purpose**: Complex business logic components

**Pattern Requirements**:
- Connected to Redux store
- Handle API calls via RTK Query
- Form validation with react-hook-form + Zod
- Optimistic UI updates

**Examples**:
- `ResearchForm`: Multi-step research submission
- `WebhookConfigurator`: Webhook management
- `ResultsAnalyzer`: AI results visualization

### 3. Layout Components

**Purpose**: Application structure and navigation

**Pattern Requirements**:
- Responsive design patterns
- Consistent spacing with MUI theme
- Accessibility compliance (ARIA)
- Dark mode support

**Examples**:
- `AppLayout`: Main application shell
- `Sidebar`: Navigation menu
- `Header`: Top navigation bar

### 4. UI Components

**Purpose**: Reusable presentation components

**Pattern Requirements**:
- Props-only (no direct state access)
- TypeScript interfaces for props
- Storybook documentation
- Customizable via MUI sx prop

**Examples**:
- `DataTable`: Sortable, filterable tables
- `StatusBadge`: Visual status indicators
- `LoadingSpinner`: Loading states

## Component Patterns

### Form Pattern

**Structure**:
```typescript
interface FormComponentProps<T> {
  onSubmit: (data: T) => Promise<void>;
  initialValues?: Partial<T>;
  loading?: boolean;
}
```

**Requirements**:
- Zod schema validation
- react-hook-form integration
- Error state handling
- Loading/disabled states
- Success feedback

### List Pattern

**Structure**:
```typescript
interface ListComponentProps<T> {
  items: T[];
  onItemClick?: (item: T) => void;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}
```

**Requirements**:
- Virtualization for large lists
- Pagination support
- Sort and filter capabilities
- Empty state handling
- Error boundaries

### Modal Pattern

**Structure**:
```typescript
interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  title: string;
  actions?: ModalAction[];
}
```

**Requirements**:
- Focus management
- Keyboard navigation (ESC to close)
- Backdrop click handling
- Animation transitions
- Mobile responsiveness

## State Management Patterns

### Local State
- Form input values
- UI toggle states
- Temporary selections

### Redux State
- User authentication
- Research requests
- Global notifications
- API cache (RTK Query)

### URL State
- Active filters
- Pagination
- Sort parameters
- Search queries

## Performance Patterns

### Code Splitting
```typescript
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
```

### Memoization
```typescript
const MemoizedList = memo(ListComponent, (prev, next) => {
  return prev.items === next.items;
});
```

### Virtual Scrolling
- Use react-window for lists > 100 items
- Implement infinite scroll for feeds
- Lazy load images with IntersectionObserver

## Testing Patterns

### Unit Tests
- Props validation
- Event handler calls
- Conditional rendering
- State updates

### Integration Tests
- Form submission flows
- API integration
- Redux store updates
- Router navigation

### Visual Tests
- Storybook snapshots
- Responsive layouts
- Theme variations
- Accessibility checks

## Accessibility Patterns

### ARIA Requirements
- Semantic HTML elements
- Proper heading hierarchy
- Form label associations
- Focus indicators
- Keyboard navigation

### Screen Reader Support
- Alt text for images
- ARIA labels for icons
- Live regions for updates
- Skip navigation links

## Error Handling Patterns

### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
```

### Fallback UI
- User-friendly error messages
- Retry mechanisms
- Contact support links
- Error reporting

## Styling Patterns

### Theme Consistency
- Use MUI theme variables
- Consistent spacing scale
- Color palette adherence
- Typography system

### Responsive Design
- Mobile-first approach
- Breakpoint consistency
- Flexible grids
- Touch-friendly targets

## Component Documentation

### Props Documentation
- TypeScript interfaces
- JSDoc comments
- Default values
- Usage examples

### Storybook Stories
- Default state
- Interactive controls
- Edge cases
- Mobile/desktop views

## Related Documentation

- [State Management](./02-state-management.md)
- [Validation Schemas](./05-validation-schemas.md)
- [Responsive Design](./07-responsive-design.md)

---

**Document Version**: 1.0.0 | **Last Updated**: 2025-09-01