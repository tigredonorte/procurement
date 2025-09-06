# Component Verification and Enhancement Instructions for AI Agents

## Overview

This document provides systematic instructions for AI agents to verify, enhance, and test React components in a TypeScript/React codebase with Storybook integration.

## Prerequisites

- Component name will be provided as `[COMPONENT_NAME]`
- Component path pattern: `packages/ui/src/components/{category}/{ComponentName}/`
- Categories: `data-display`, `feedback`, `form`, `layout`, `navigation`, `utility`

## Step-by-Step Verification Process

### Phase 1: Documentation Review

1. **Read frontend.md**

   ```bash
   # Read the main frontend documentation
   Read packages/ui/frontend.md
   ```

2. **Read Component Documentation**
   ```bash
   # Read component-specific documentation
   Read packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.md
   ```

### Phase 2: Implementation Verification

1. **Analyze Component Implementation**
   - Read all component files:
     ```bash
     Read packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.tsx
     Read packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.types.ts
     Read packages/ui/src/components/{category}/{ComponentName}/index.ts
     ```

2. **Verify Against Requirements**
   - Check all required props are implemented
   - Verify all variants are supported
   - Ensure accessibility attributes are present
   - Validate TypeScript types match documentation
   - Check for proper MUI integration
   - Verify responsive behavior implementation

3. **Implementation Checklist**
   - [ ] All required props from documentation are implemented
   - [ ] Optional props have default values
   - [ ] Component forwards refs if needed
   - [ ] Proper TypeScript typing with exported interfaces
   - [ ] Accessibility attributes (aria-\*, role, etc.)
   - [ ] Theme integration via MUI
   - [ ] Responsive design considerations

### Phase 3: Storybook Stories Coverage

1. **Read Existing Stories**

   ```bash
   Read packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.stories.tsx
   ```

2. **Required Story Scenarios**
   - **Default**: Basic component with minimal props
   - **All Variants**: Story for each variant/type
   - **Interactive States**: Hover, focus, active, disabled
   - **Size Variations**: All size props if applicable
   - **Content Variations**: Empty, minimal, maximum content
   - **Edge Cases**: Long text, overflow scenarios
   - **Accessibility**: Keyboard navigation, screen reader
   - **Responsive**: Mobile, tablet, desktop views
   - **Theme**: Light/dark mode if applicable

3. **Story Template Structure**

   ```typescript
   import type { Meta, StoryObj } from '@storybook/react';
   import { ComponentName } from './ComponentName';

   const meta: Meta<typeof ComponentName> = {
     title: 'Category/ComponentName',
     component: ComponentName,
     parameters: {
       layout: 'centered',
       docs: {
         description: {
           component: 'Component description from documentation',
         },
       },
     },
     tags: ['autodocs'],
     argTypes: {
       // Define controls for each prop
     },
   };

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {
       // Default props
     },
   };
   ```

### Phase 4: Lint Verification and Fixes

1. **Run Lint Check**

   ```bash
   cd packages/ui && npx eslint src/components/{category}/{ComponentName}/ --ext .ts,.tsx
   ```

2. **Common Lint Fixes**
   - Import order issues
   - Unused variables
   - Missing dependencies in hooks
   - Improper type assertions
   - Missing return types

3. **Auto-fix When Possible**
   ```bash
   cd packages/ui && npx eslint src/components/{category}/{ComponentName}/ --ext .ts,.tsx --fix
   ```

### Phase 5: Type-Check Verification and Fixes

1. **Run Type Check**

   ```bash
   cd packages/ui && npx tsc --noEmit --project tsconfig.json
   ```

2. **Common Type Issues**
   - Missing type exports
   - Incorrect prop types
   - Missing generic constraints
   - Improper type unions/intersections

3. **Type Safety Checklist**
   - [ ] All props have proper types
   - [ ] No `any` types unless absolutely necessary
   - [ ] Proper generic types where applicable
   - [ ] Exported types for external use

### Phase 6: Storybook Testing

**🚨 CRITICAL: DO NOT START STORYBOOK! 🚨**

**Storybook is already running at: http://192.168.166.133:6008/**

1. **Access Existing Storybook Instance**

   ```
   IMPORTANT: DO NOT run any storybook commands!
   DO NOT execute: npx storybook dev, npm run storybook, or any storybook start commands!

   The Storybook server is already running and accessible at:
   🔗 http://192.168.166.133:6008/
   ```

2. **Test Component in Browser**
   - Use MCP browser tools to navigate to `http://192.168.166.133:6008/`
   - Navigate to your component's story section
   - Navigate to the Test stories (ComponentName/Tests section)
   - Verify all test stories render correctly
   - Ensure all interactive tests pass without errors
   - Check browser console for any JavaScript errors
   - Verify all test stories show green checkmarks (✅) indicating passing tests

### Phase 7: Comprehensive Storybook Tests

#### 7.1 Create or Update Test Stories File

1. **Check if test file exists**

   ```bash
   # Check for existing test file
   ls packages/ui/src/components/{category}/{ComponentName}/{ComponentName}.test.stories.tsx

   # If not exists, create it
   # If exists, read and update it
   ```

2. **Create Complete Test File Structure**

   ```typescript
   // File: {ComponentName}.test.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
   import { ComponentName } from './ComponentName';

   const meta: Meta<typeof ComponentName> = {
     title: 'Category/ComponentName/Tests',
     component: ComponentName,
     parameters: {
       layout: 'centered',
       chromatic: { disableSnapshot: false },
     },
     tags: ['autodocs', 'test'],
   };

   export default meta;
   type Story = StoryObj<typeof meta>;
   ```

#### 7.2 Interaction Tests

**Purpose**: Test user interactions like clicks, keyboard navigation, form inputs

1. **Basic Interaction Test Template**

   ```typescript
   export const BasicInteraction: Story = {
     name: '🧪 Basic Interaction Test',
     args: {
       // Component props for testing
       onClick: fn(),
       onChange: fn(),
     },
     play: async ({ canvasElement, step, args }) => {
       const canvas = within(canvasElement);

       await step('Initial render verification', async () => {
         const element = canvas.getByTestId('component-id');
         await expect(element).toBeInTheDocument();
       });

       await step('Click interaction', async () => {
         const button = canvas.getByRole('button');
         await userEvent.click(button);
         await expect(args.onClick).toHaveBeenCalledTimes(1);
       });

       await step('Hover interaction', async () => {
         const element = canvas.getByTestId('hoverable');
         await userEvent.hover(element);
         await expect(element).toHaveStyle({ opacity: '0.8' });
       });
     },
   };
   ```

2. **Form Interaction Test (if applicable)**

   ```typescript
   export const FormInteraction: Story = {
     name: '📝 Form Interaction Test',
     args: {
       onChange: fn(),
       onSubmit: fn(),
     },
     play: async ({ canvasElement, args, step }) => {
       const canvas = within(canvasElement);

       await step('Type in input field', async () => {
         const input = canvas.getByRole('textbox');
         await userEvent.type(input, 'Test input');
         await expect(input).toHaveValue('Test input');
         await expect(args.onChange).toHaveBeenCalled();
       });

       await step('Clear input field', async () => {
         const input = canvas.getByRole('textbox');
         await userEvent.clear(input);
         await expect(input).toHaveValue('');
       });

       await step('Submit form', async () => {
         const submitButton = canvas.getByRole('button', { name: /submit/i });
         await userEvent.click(submitButton);
         await expect(args.onSubmit).toHaveBeenCalled();
       });
     },
   };
   ```

3. **State Change Test**

   ```typescript
   export const StateChangeTest: Story = {
     name: '🔄 State Change Test',
     args: {
       initialState: 'inactive',
     },
     play: async ({ canvasElement, step }) => {
       const canvas = within(canvasElement);

       await step('Verify initial state', async () => {
         const element = canvas.getByTestId('stateful-component');
         await expect(element).toHaveAttribute('data-state', 'inactive');
       });

       await step('Toggle state', async () => {
         const toggle = canvas.getByRole('switch');
         await userEvent.click(toggle);
         const element = canvas.getByTestId('stateful-component');
         await waitFor(() => {
           expect(element).toHaveAttribute('data-state', 'active');
         });
       });
     },
   };
   ```

#### 7.3 Accessibility Tests

**Purpose**: Ensure component meets WCAG standards and is keyboard/screen reader accessible

1. **Keyboard Navigation Test**

   ```typescript
   export const KeyboardNavigation: Story = {
     name: '⌨️ Keyboard Navigation Test',
     args: {
       // Props
     },
     parameters: {
       a11y: {
         element: '#storybook-root',
         config: {
           rules: [
             { id: 'color-contrast', enabled: true },
             { id: 'aria-required-attr', enabled: true },
             { id: 'aria-roles', enabled: true },
             { id: 'aria-valid-attr-value', enabled: true },
             { id: 'button-name', enabled: true },
             { id: 'duplicate-id', enabled: true },
             { id: 'label', enabled: true },
           ],
         },
       },
     },
     play: async ({ canvasElement, step }) => {
       const canvas = within(canvasElement);

       await step('Tab navigation forward', async () => {
         const firstElement = canvas.getByTestId('first-focusable');
         const secondElement = canvas.getByTestId('second-focusable');

         // Focus first element
         firstElement.focus();
         await expect(firstElement).toHaveFocus();

         // Tab to next element
         await userEvent.tab();
         await expect(secondElement).toHaveFocus();
       });

       await step('Tab navigation backward', async () => {
         await userEvent.tab({ shift: true });
         const firstElement = canvas.getByTestId('first-focusable');
         await expect(firstElement).toHaveFocus();
       });

       await step('Enter key activation', async () => {
         const button = canvas.getByRole('button');
         button.focus();
         await userEvent.keyboard('{Enter}');
         // Verify action was triggered
       });

       await step('Space key activation', async () => {
         const checkbox = canvas.getByRole('checkbox');
         checkbox.focus();
         await userEvent.keyboard(' ');
         await expect(checkbox).toBeChecked();
       });

       await step('Escape key handling', async () => {
         const modal = canvas.queryByRole('dialog');
         if (modal) {
           await userEvent.keyboard('{Escape}');
           await waitFor(() => {
             expect(modal).not.toBeInTheDocument();
           });
         }
       });
     },
   };
   ```

2. **Screen Reader Test**

   ```typescript
   export const ScreenReaderTest: Story = {
     name: '🔊 Screen Reader Test',
     args: {
       ariaLabel: 'Test component',
       ariaDescribedBy: 'description-id',
     },
     play: async ({ canvasElement, step }) => {
       const canvas = within(canvasElement);

       await step('Verify ARIA labels', async () => {
         const element = canvas.getByLabelText('Test component');
         await expect(element).toBeInTheDocument();
         await expect(element).toHaveAttribute('aria-label', 'Test component');
       });

       await step('Verify ARIA descriptions', async () => {
         const element = canvas.getByTestId('component');
         await expect(element).toHaveAttribute('aria-describedby', 'description-id');

         const description = canvas.getByTestId('description-id');
         await expect(description).toBeInTheDocument();
       });

       await step('Verify role attributes', async () => {
         const nav = canvas.getByRole('navigation');
         await expect(nav).toBeInTheDocument();

         const button = canvas.getByRole('button');
         await expect(button).toHaveAttribute('type', 'button');
       });

       await step('Verify live regions', async () => {
         const liveRegion = canvas.getByRole('status');
         await expect(liveRegion).toHaveAttribute('aria-live', 'polite');
       });
     },
   };
   ```

3. **Focus Management Test**

   ```typescript
   export const FocusManagement: Story = {
     name: '🎯 Focus Management Test',
     args: {
       autoFocus: true,
     },
     play: async ({ canvasElement, step }) => {
       const canvas = within(canvasElement);

       await step('Auto focus on mount', async () => {
         const autoFocusElement = canvas.getByTestId('auto-focus');
         await waitFor(() => {
           expect(autoFocusElement).toHaveFocus();
         });
       });

       await step('Focus trap in modal', async () => {
         const openButton = canvas.getByRole('button', { name: /open modal/i });
         await userEvent.click(openButton);

         const modal = await canvas.findByRole('dialog');
         const firstFocusable = within(modal).getByTestId('first-modal-element');
         await expect(firstFocusable).toHaveFocus();

         // Tab through modal elements
         await userEvent.tab();
         await userEvent.tab();
         // Should cycle back to first element
         await userEvent.tab();
         await expect(firstFocusable).toHaveFocus();
       });

       await step('Focus restoration', async () => {
         const triggerButton = canvas.getByTestId('trigger');
         triggerButton.focus();

         // Open and close modal
         await userEvent.click(triggerButton);
         const closeButton = canvas.getByRole('button', { name: /close/i });
         await userEvent.click(closeButton);

         // Focus should return to trigger
         await expect(triggerButton).toHaveFocus();
       });
     },
   };
   ```

#### 7.4 Visual Tests

**Purpose**: Test component appearance across different viewports and states

1. **Responsive Design Test**

   ```typescript
   export const ResponsiveDesign: Story = {
     name: '📱 Responsive Design Test',
     args: {
       // Props
     },
     parameters: {
       viewport: {
         viewports: {
           mobile: {
             name: 'Mobile',
             styles: { width: '375px', height: '667px' },
             type: 'mobile',
           },
           tablet: {
             name: 'Tablet',
             styles: { width: '768px', height: '1024px' },
             type: 'tablet',
           },
           desktop: {
             name: 'Desktop',
             styles: { width: '1920px', height: '1080px' },
             type: 'desktop',
           },
         },
         defaultViewport: 'mobile',
       },
       chromatic: {
         viewports: [375, 768, 1920],
         delay: 300,
       },
     },
     play: async ({ canvasElement, step }) => {
       const canvas = within(canvasElement);

       await step('Verify mobile layout', async () => {
         const container = canvas.getByTestId('responsive-container');
         const computedStyle = window.getComputedStyle(container);

         if (window.innerWidth <= 768) {
           await expect(computedStyle.flexDirection).toBe('column');
         } else {
           await expect(computedStyle.flexDirection).toBe('row');
         }
       });
     },
   };
   ```

2. **Theme Variation Test**

   ```typescript
   export const ThemeVariations: Story = {
     name: '🎨 Theme Variations Test',
     args: {
       // Props
     },
     parameters: {
       backgrounds: {
         default: 'light',
         values: [
           { name: 'light', value: '#ffffff' },
           { name: 'dark', value: '#1a1a1a' },
         ],
       },
     },
     play: async ({ canvasElement, step }) => {
       const canvas = within(canvasElement);

       await step('Verify theme colors', async () => {
         const element = canvas.getByTestId('themed-component');
         const computedStyle = window.getComputedStyle(element);

         // Check if colors match theme
         await expect(computedStyle.backgroundColor).toMatch(/rgb/);
       });
     },
   };
   ```

3. **Visual States Test**

   ```typescript
   export const VisualStates: Story = {
     name: '👁️ Visual States Test',
     args: {
       // Props
     },
     play: async ({ canvasElement, step }) => {
       const canvas = within(canvasElement);

       await step('Default state', async () => {
         const element = canvas.getByTestId('component');
         await expect(element).toHaveStyle({ opacity: '1' });
       });

       await step('Hover state', async () => {
         const element = canvas.getByTestId('component');
         await userEvent.hover(element);
         await waitFor(() => {
           expect(element).toHaveStyle({ transform: 'scale(1.02)' });
         });
       });

       await step('Active state', async () => {
         const button = canvas.getByRole('button');
         await userEvent.click(button);
         await expect(button).toHaveClass('active');
       });

       await step('Disabled state', async () => {
         const disabledButton = canvas.getByTestId('disabled-button');
         await expect(disabledButton).toBeDisabled();
         await expect(disabledButton).toHaveStyle({ opacity: '0.5' });
       });

       await step('Loading state', async () => {
         const loadingElement = canvas.queryByTestId('loading');
         if (loadingElement) {
           await expect(loadingElement).toBeInTheDocument();
           const spinner = within(loadingElement).getByRole('progressbar');
           await expect(spinner).toBeInTheDocument();
         }
       });

       await step('Error state', async () => {
         const errorElement = canvas.queryByTestId('error');
         if (errorElement) {
           await expect(errorElement).toHaveStyle({ borderColor: 'rgb(244, 67, 54)' });
         }
       });
     },
   };
   ```

#### 7.5 Performance Tests

**Purpose**: Ensure component performs well under various conditions

```typescript
export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  args: {
    items: Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    })),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Measure render time', async () => {
      const startTime = performance.now();
      const elements = canvas.getAllByTestId(/item-/);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      console.log(`Render time for ${elements.length} items: ${renderTime}ms`);

      // Assert reasonable render time (adjust threshold as needed)
      await expect(renderTime).toBeLessThan(1000);
    });

    await step('Test scroll performance', async () => {
      const scrollContainer = canvas.getByTestId('scroll-container');

      // Simulate rapid scrolling
      for (let i = 0; i < 10; i++) {
        scrollContainer.scrollTop = i * 100;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Verify no janky behavior
      await expect(scrollContainer).toBeInTheDocument();
    });
  },
};
```

#### 7.6 Edge Cases Tests

**Purpose**: Test boundary conditions and error scenarios

```typescript
export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  args: {
    // Props for edge cases
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty content handling', async () => {
      const emptyContainer = canvas.queryByTestId('empty-state');
      if (emptyContainer) {
        await expect(emptyContainer).toHaveTextContent(/no data/i);
      }
    });

    await step('Long text overflow', async () => {
      const textElement = canvas.getByTestId('text-content');
      const computedStyle = window.getComputedStyle(textElement);
      await expect(computedStyle.textOverflow).toBe('ellipsis');
    });

    await step('Maximum limits', async () => {
      const input = canvas.getByRole('textbox');
      const longText = 'a'.repeat(1000);
      await userEvent.type(input, longText);

      // Should truncate or handle gracefully
      await expect(input.value.length).toBeLessThanOrEqual(255);
    });

    await step('Invalid props handling', async () => {
      // Component should handle invalid props gracefully
      const component = canvas.getByTestId('component');
      await expect(component).toBeInTheDocument();
    });
  },
};
```

#### 7.7 Integration Tests

**Purpose**: Test component integration with other components

```typescript
export const IntegrationTest: Story = {
  name: '🔗 Integration Test',
  args: {
    // Props
  },
  render: (args) => (
    <div>
      <ComponentName {...args} />
      <RelatedComponent />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Communication between components', async () => {
      const trigger = canvas.getByTestId('trigger-component');
      const receiver = canvas.getByTestId('receiver-component');

      await userEvent.click(trigger);

      await waitFor(() => {
        expect(receiver).toHaveTextContent('Updated');
      });
    });
  }
};
```

#### 7.8 Running and Verifying Tests

1. **Run Storybook Test Runner**

   ```bash
   # Install test runner if not present
   cd packages/ui && npm install --save-dev @storybook/test-runner

   # Run all tests
   npx test-storybook --url http://localhost:6006

   # Run specific component tests
   npx test-storybook --url http://localhost:6006 --stories-filter="**/ComponentName.test.stories.tsx"

   # Run with coverage
   npx test-storybook --url http://localhost:6006 --coverage
   ```

2. **Verify Test Results**

   ```bash
   # Check test output
   # All tests should pass
   # Coverage should be > 80%
   ```

3. **Generate Test Report**
   ```bash
   # Generate HTML report
   npx test-storybook --url http://localhost:6006 --junit --outputFile test-results.xml
   ```

### Phase 8: Browser Testing with MCP

1. **Navigate to Component**

   ```typescript
   mcp__playwright__browser_navigate({ url: 'http://192.xxx.xxx.xxx:6007' });
   mcp__playwright__browser_snapshot();
   ```

2. **Test Interactions**

   ```typescript
   // Click on story
   mcp__playwright__browser_click({
     element: 'ComponentName story',
     ref: 'story-ref',
   });

   // Take screenshot
   mcp__playwright__browser_take_screenshot({
     filename: 'component-test.png',
   });
   ```

3. **Verify Accessibility**
   ```typescript
   // Test keyboard navigation
   mcp__playwright__browser_press_key({ key: 'Tab' });
   mcp__playwright__browser_press_key({ key: 'Enter' });
   ```

## Verification Checklist Summary

- [ ] Frontend.md documentation read and understood
- [ ] Component documentation read and understood
- [ ] Implementation matches all requirements
- [ ] All required props implemented
- [ ] TypeScript types properly defined and exported
- [ ] Storybook stories cover all scenarios
- [ ] Lint passes without errors
- [ ] Type-check passes without errors
- [ ] Storybook renders all stories correctly
- [ ] Interaction tests implemented and passing
- [ ] Accessibility tests implemented and passing
- [ ] Visual tests implemented
- [ ] Browser testing completed successfully

## Common Issues and Solutions

### Port Conflicts

```bash
# Find and kill process on port
lsof -i :6006 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Use alternative port
npx storybook dev --host 0.0.0.0 --port 6007
```

### Type Errors

- Ensure all imports are correct
- Check for circular dependencies
- Verify MUI version compatibility

### Storybook Not Loading

- Clear cache: `rm -rf node_modules/.cache`
- Rebuild: `npm run build-storybook`
- Check for compilation errors

## Notes

- **DO NOT** run `npx playwright install chrome` - it will cause the process to hang
- Always use `--host 0.0.0.0` for external access
- Access via IP address (192.xxx.xxx.xxx) not localhost
- Multiple agents may be running - check ports 6006-6010

## Component Categories Reference

- `data-display`: Tables, Lists, Cards, etc.
- `feedback`: Alerts, Toasts, Modals, etc.
- `form`: Inputs, Selects, Checkboxes, etc.
- `layout`: Grid, Container, Stack, etc.
- `navigation`: Menu, Breadcrumbs, Tabs, etc.
- `utility`: AspectRatio, Portal, Transitions, etc.

## Component Status Tracking
Read `componets.tasks.md`

## Agent Post-Completion Instructions

**CRITICAL: When you finish working on a component, you MUST commit your changes automatically.**

### Required Actions After Component Completion:

1. **Add all modified files to git staging:**

   ```bash
   git add src/components/{category}/{ComponentName}/
   ```

2. **Commit with appropriate semantic message:**

   ```bash
   # For new features/enhancements:
   git commit -m "feat({ComponentName}): complete comprehensive testing and verification"

   # For bug fixes:
   git commit -m "fix({ComponentName}): resolve lint errors and add comprehensive test stories"

   # For documentation updates:
   git commit -m "docs({ComponentName}): update component status and testing coverage"
   ```

3. **Always include components-check.md in the commit:**
   ```bash
   git add components-check.md src/components/{category}/{ComponentName}/
   ```

### Commit Message Templates:

- **New component completion:** `feat({ComponentName}): complete comprehensive testing and verification`
- **Bug fixes during verification:** `fix({ComponentName}): resolve lint errors and add comprehensive test stories`
- **Test story additions:** `test({ComponentName}): add comprehensive interaction and accessibility tests`
- **Type/lint fixes:** `fix({ComponentName}): resolve TypeScript and lint issues`
- **Status updates only:** `docs: mark {ComponentName} component as completed in status tracking`

### Example Complete Workflow:

```bash
# After completing all phases for Switch component:
git add src/components/form/Switch/ components-check.md
git commit -m "feat(Switch): complete comprehensive testing and verification"
```

**DO NOT** push to remote or create pull requests - only commit locally.
