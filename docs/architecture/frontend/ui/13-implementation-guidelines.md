# Implementation Guidelines

[← Back to Main Documentation](./readme.md)

---

## Component Creation Pattern

### Folder Structure

Each component should be organized in its own folder with the following structure:

```
components/
├── Button/
│   ├── Button.tsx           # Component implementation
│   ├── Button.scss          # Component styles (optional if using styled-components)
│   ├── Button.types.ts      # TypeScript interfaces
│   ├── Button.test.tsx      # Component tests
│   ├── Button.stories.tsx   # Storybook stories (REQUIRED)
│   └── index.ts            # Export barrel
├── Card/
│   ├── Card.tsx
│   ├── Card.scss
│   ├── Card.types.ts
│   ├── Card.test.tsx
│   ├── Card.stories.tsx    # REQUIRED
│   └── index.ts
└── ...
```

## Component Implementation Standards

### PureComponent Pattern
- Use PureComponent or React.memo for performance optimization
- Implement proper shouldComponentUpdate logic when needed
- Keep components focused on single responsibilities
- Separate presentational logic from business logic

### TypeScript Interfaces
- Define clear prop interfaces with JSDoc comments
- Use optional chaining for optional props
- Export interfaces for reusability
- Leverage union types for variant props

### Default Props
- Define sensible defaults for optional props
- Use static defaultProps or default parameters
- Document why specific defaults were chosen

### Event Handling
- Use arrow functions for event handlers to maintain context
- Prevent event bubbling when appropriate
- Add proper event typing for TypeScript
- Debounce or throttle expensive operations

## Styling Guidelines

### SCSS Architecture
- Follow BEM naming convention for class names
- Use design tokens from variables file
- Create mixins for reusable patterns
- Implement responsive styles using breakpoint mixins

### CSS Custom Properties
- Use CSS variables for dynamic theming
- Define component-level custom properties
- Support dark mode through CSS variable overrides
- Maintain fallback values for older browsers

### Animation Standards
- Use CSS transforms for performance
- Prefer CSS animations over JavaScript when possible
- Implement reduced motion media queries
- Use GPU-accelerated properties

## Component Composition

### Compound Components
Create related components that work together:
- Card with CardHeader, CardBody, CardFooter
- Table with TableHeader, TableBody, TableRow
- Form with FormField, FormLabel, FormError

### Render Props Pattern
Use for flexible component customization:
- Custom renderers for list items
- Dynamic content in modals
- Flexible data display components

### Higher-Order Components
Apply for cross-cutting concerns:
- Authentication checks
- Permission validation
- Analytics tracking
- Error boundaries

## State Management

### Local State
- Use useState for simple component state
- Implement useReducer for complex state logic
- Leverage useContext for component trees
- Avoid unnecessary state lifting

### Form State
- Use controlled components for form inputs
- Implement validation on blur and submit
- Provide clear error messages
- Support field-level and form-level validation

### Async State
- Handle loading, error, and success states
- Implement proper cleanup in useEffect
- Use AbortController for cancellable requests
- Cache responses when appropriate

## Performance Optimization

### Rendering Optimization
- Use React.memo for expensive components
- Implement useMemo for expensive computations
- Apply useCallback for stable function references
- Virtualize long lists with react-window

### Bundle Optimization
- Implement code splitting with lazy loading
- Tree-shake unused code
- Optimize image loading with lazy loading
- Use production builds for deployment

### Runtime Performance
- Debounce search and filter inputs
- Throttle scroll and resize handlers
- Use CSS containment for layout optimization
- Implement progressive enhancement

## Accessibility Implementation

### ARIA Support
- Add appropriate ARIA roles and labels
- Implement aria-live regions for dynamic content
- Use semantic HTML elements
- Provide skip navigation links

### Keyboard Navigation
- Support Tab navigation flow
- Implement focus trap for modals
- Add keyboard shortcuts for common actions
- Provide visible focus indicators

### Screen Reader Support
- Add descriptive alt text for images
- Use heading hierarchy properly
- Implement form labels and descriptions
- Announce dynamic content changes

## Testing Strategy

### Unit Testing
- Test component rendering with different props
- Verify event handler behavior
- Check conditional rendering logic
- Test error boundaries

### Integration Testing
- Test component interactions
- Verify data flow between components
- Test form submissions
- Check navigation flows

### Visual Testing
- Implement snapshot testing for UI consistency
- Use visual regression testing tools
- Test responsive layouts
- Verify dark mode rendering

## Storybook Requirements

### Mandatory Story Coverage
Every component in the UI library **MUST** include comprehensive Storybook stories:

#### Required Stories
- **Default Story**: Basic component with default props
- **All Variants**: Showcase every variant prop option
- **All Sizes**: Display all size variations
- **All States**: Show loading, disabled, error, success states
- **Interactive States**: Hover, focus, active states
- **With Icons/Media**: If applicable, show with icons or images
- **Edge Cases**: Long text, empty content, boundary conditions
- **Responsive**: Different breakpoint behaviors

#### Story Structure
```typescript
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';

const meta = {
  title: 'Category/Component',
  component: Component,
  parameters: {
    layout: 'centered', // or 'fullscreen', 'padded'
  },
  tags: ['autodocs'], // Enables automatic documentation
  argTypes: {
    // Define control types for props
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

// Individual stories
export const Default: Story = {
  args: {
    children: 'Default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack>
      {/* Show all variants */}
    </Stack>
  ),
};
```

#### Story Best Practices
- Use meaningful story names that describe the use case
- Group related props in single stories for comparison
- Include controls for interactive prop testing
- Add play functions for interaction testing
- Document prop combinations that work well together
- Show both light and dark mode compatibility

## Documentation Standards

### Component Documentation
- Write clear JSDoc comments for props
- Provide usage examples in Storybook
- Document component variants
- Include accessibility notes
- **Every component MUST have stories demonstrating all features**

### API Documentation
- Document all public methods
- Provide TypeScript definitions
- Include example responses
- Note breaking changes

## Development Workflow

### Code Review Checklist
- Component follows naming conventions
- Props are properly typed
- Styles use design tokens
- Accessibility requirements met
- Tests provide adequate coverage
- **Storybook stories exist and cover all variants/states**
- Documentation is complete
- Stories are properly categorized and tagged

### Pre-commit Checks
- ESLint passes without errors
- Prettier formatting applied
- TypeScript compilation succeeds
- Unit tests pass
- Bundle size within limits

### Continuous Integration
- Automated testing on pull requests
- Visual regression testing
- Performance budgets enforced
- Accessibility audits run
- Documentation builds successfully

---

[Next: Appendices →](./14-appendices.md)