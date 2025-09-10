# Frontend Component Validation Guidelines

## Overview

This document defines validation patterns for React components, including structure, props, behavior, and integration with the design system.

## Component Documentation Requirements

### Required Documentation Structure

```
/components/ComponentName/
├── ComponentName.md          # Component specification
├── ComponentName.tsx          # Implementation
├── ComponentName.test.tsx     # Unit tests
├── ComponentName.stories.tsx  # Storybook stories
├── ComponentName.types.ts     # TypeScript types
└── index.ts                  # Barrel export
```

### Component Specification Format

```markdown
## Metadata

**Component**: ComponentName
**Category**: data-display|forms|navigation|feedback
**Version**: 1.0.0
**Status**: completed
**Updated**: 2024-01-10 14:30

## Interface

### Props

| Prop    | Type               | Required | Default | Description       |
| ------- | ------------------ | -------- | ------- | ----------------- |
| id      | string             | ✅       | -       | Unique identifier |
| variant | 'glass' \| 'solid' | ❌       | 'solid' | Visual variant    |

### Events

| Event    | Payload     | Description    |
| -------- | ----------- | -------------- |
| onClick  | MouseEvent  | Click handler  |
| onChange | ChangeEvent | Change handler |

## Behavior

- Renders without errors
- Handles loading states
- Supports keyboard navigation
- Manages focus properly
```

## Validation Checks

### Level 1: Structure Validation

```javascript
const structureValidation = {
  name: 'component-structure',
  checks: [
    {
      name: 'file-exists',
      test: (component) => {
        const files = [
          `${component}.tsx`,
          `${component}.test.tsx`,
          `${component}.stories.tsx`,
          `${component}.types.ts`,
          `${component}.md`,
        ];
        return files.every((file) => fs.existsSync(file));
      },
    },
    {
      name: 'barrel-export',
      test: (component) => {
        const indexContent = fs.readFileSync('index.ts', 'utf8');
        return indexContent.includes(`export * from './${component}'`);
      },
    },
    {
      name: 'folder-structure',
      test: (component) => {
        const structure = getDirectoryStructure(component);
        return validateAgainstPattern(structure, COMPONENT_PATTERN);
      },
    },
  ],
};
```

### Level 2: TypeScript Validation

```javascript
const typeScriptValidation = {
  name: 'typescript-validation',
  checks: [
    {
      name: 'props-interface',
      test: async (component) => {
        const types = await parseTypeScript(`${component}.types.ts`);
        return types.interfaces.includes(`${component}Props`);
      },
    },
    {
      name: 'props-match-docs',
      test: async (component) => {
        const docs = parseMarkdown(`${component}.md`);
        const types = await parseTypeScript(`${component}.types.ts`);
        const docProps = docs.getTable('Props');
        const typeProps = types.getInterface(`${component}Props`);

        return docProps.every((docProp) =>
          typeProps.properties.some(
            (typeProp) => typeProp.name === docProp.name && typeProp.type === docProp.type,
          ),
        );
      },
    },
    {
      name: 'no-any-types',
      test: async (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');
        return !content.includes(': any');
      },
    },
  ],
};
```

### Level 3: React Component Validation

```javascript
const reactValidation = {
  name: 'react-validation',
  checks: [
    {
      name: 'component-renders',
      test: async (component) => {
        const { render } = await import('@testing-library/react');
        const Component = await import(`./${component}`);

        try {
          render(<Component.default {...getRequiredProps(component)} />);
          return true;
        } catch (error) {
          return false;
        }
      },
    },
    {
      name: 'props-validation',
      test: async (component) => {
        const Component = await import(`./${component}`);
        const props = getComponentProps(Component.default);

        // Check required props
        const requiredProps = getRequiredProps(component);
        return requiredProps.every((prop) => props.includes(prop));
      },
    },
    {
      name: 'hooks-rules',
      test: async (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check hooks are at top level
        const hooksPattern = /use[A-Z]\w+/g;
        const hooks = content.match(hooksPattern) || [];

        return hooks.every((hook) => {
          const hookLine = content.split('\n').find((line) => line.includes(hook));
          return (
            !hookLine?.includes('if') && !hookLine?.includes('for') && !hookLine?.includes('while')
          );
        });
      },
    },
  ],
};
```

### Level 4: Storybook Validation

```javascript
const storybookValidation = {
  name: 'storybook-validation',
  checks: [
    {
      name: 'stories-exist',
      test: (component) => {
        const stories = parseStorybook(`${component}.stories.tsx`);
        const requiredStories = ['Default', 'AllVariants', 'Interactive'];

        return requiredStories.every((story) => stories.exports.includes(story));
      },
    },
    {
      name: 'story-metadata',
      test: (component) => {
        const stories = parseStorybook(`${component}.stories.tsx`);

        return (
          stories.default &&
          stories.default.title &&
          stories.default.component &&
          stories.default.tags?.includes('autodocs')
        );
      },
    },
    {
      name: 'args-match-props',
      test: (component) => {
        const stories = parseStorybook(`${component}.stories.tsx`);
        const props = parseTypeScript(`${component}.types.ts`);

        return Object.keys(stories.default.args || {}).every((arg) =>
          props.properties.includes(arg),
        );
      },
    },
  ],
};
```

### Level 5: Accessibility Validation

```javascript
const accessibilityValidation = {
  name: 'accessibility-validation',
  checks: [
    {
      name: 'aria-attributes',
      test: async (component) => {
        const { render } = await import('@testing-library/react');
        const { axe } = await import('jest-axe');
        const Component = await import(`./${component}`);

        const { container } = render(<Component.default {...getRequiredProps(component)} />);

        const results = await axe(container);
        return results.violations.length === 0;
      },
    },
    {
      name: 'keyboard-navigation',
      test: async (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check for keyboard event handlers
        const keyboardEvents = ['onKeyDown', 'onKeyUp', 'onKeyPress'];

        const hasKeyboardSupport = keyboardEvents.some((event) => content.includes(event));

        // Check for tabIndex usage
        const hasTabIndex = content.includes('tabIndex');

        return hasKeyboardSupport || hasTabIndex;
      },
    },
    {
      name: 'focus-management',
      test: async (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check for focus-related code
        return (
          content.includes('useRef') &&
          (content.includes('.focus()') || content.includes('autoFocus'))
        );
      },
    },
  ],
};
```

### Level 6: Design System Compliance

```javascript
const designSystemValidation = {
  name: 'design-system-validation',
  checks: [
    {
      name: 'theme-usage',
      test: (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check for theme usage
        return content.includes('useTheme') || content.includes('theme.');
      },
    },
    {
      name: 'variant-support',
      test: async (component) => {
        const docs = parseMarkdown(`${component}.md`);
        const props = docs.getTable('Props');
        const variantProp = props.find((p) => p.name === 'variant');

        if (!variantProp) return true; // Not all components need variants

        const expectedVariants = ['glass', 'solid', 'outlined'];
        const supportedVariants = variantProp.type.split('|').map((v) => v.trim());

        return expectedVariants.some((v) => supportedVariants.includes(v));
      },
    },
    {
      name: 'responsive-design',
      test: (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check for responsive utilities
        const responsivePatterns = [
          'useMediaQuery',
          'breakpoints',
          '@media',
          'sx={{',
          'responsive',
        ];

        return responsivePatterns.some((pattern) => content.includes(pattern));
      },
    },
  ],
};
```

## Material-UI Specific Validation

### MUI Integration Checks

```javascript
const muiValidation = {
  name: 'mui-validation',
  checks: [
    {
      name: 'mui-imports',
      test: (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check for @mui imports
        return content.includes('@mui/material') || content.includes('@mui/system');
      },
    },
    {
      name: 'sx-prop-usage',
      test: (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check for sx prop (MUI v5 styling)
        return content.includes('sx={') || content.includes('sx:');
      },
    },
    {
      name: 'theme-provider',
      test: async (component) => {
        const stories = parseStorybook(`${component}.stories.tsx`);

        // Check if stories wrap components in ThemeProvider
        return stories.decorators?.some((d) => d.includes('ThemeProvider'));
      },
    },
  ],
};
```

## Testing Validation

### Test Coverage Checks

```javascript
const testValidation = {
  name: 'test-validation',
  checks: [
    {
      name: 'test-file-exists',
      test: (component) => {
        return fs.existsSync(`${component}.test.tsx`);
      },
    },
    {
      name: 'test-coverage',
      test: async (component) => {
        const coverage = await getCoverage(component);

        return (
          coverage.statements >= 80 &&
          coverage.branches >= 75 &&
          coverage.functions >= 80 &&
          coverage.lines >= 80
        );
      },
    },
    {
      name: 'test-patterns',
      test: (component) => {
        const content = fs.readFileSync(`${component}.test.tsx`, 'utf8');

        const requiredTests = [
          'renders without crashing',
          'handles props correctly',
          'fires events',
          'handles edge cases',
        ];

        return requiredTests.every(
          (test) =>
            content.toLowerCase().includes(test) ||
            content.includes(`it('${test}`) ||
            content.includes(`test('${test}`),
        );
      },
    },
  ],
};
```

## Performance Validation

### React Performance Checks

```javascript
const performanceValidation = {
  name: 'performance-validation',
  checks: [
    {
      name: 'memo-usage',
      test: (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check if component uses React.memo when appropriate
        const hasExpensiveOperations =
          content.includes('useMemo') ||
          content.includes('useCallback') ||
          content.includes('.map(') ||
          content.includes('.filter(');

        if (hasExpensiveOperations) {
          return content.includes('React.memo') || content.includes('memo(');
        }

        return true;
      },
    },
    {
      name: 'optimization-hooks',
      test: (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check for proper use of optimization hooks
        const hasCallbacks = content.match(/\(\) => \{/g)?.length > 2;
        const hasComplexState = content.match(/useState/g)?.length > 3;

        if (hasCallbacks && !content.includes('useCallback')) {
          return false;
        }

        if (hasComplexState && !content.includes('useMemo')) {
          return false;
        }

        return true;
      },
    },
  ],
};
```

## Validation Runner

### Component Validation Orchestrator

```javascript
class ComponentValidator {
  constructor(componentPath) {
    this.componentPath = componentPath;
    this.componentName = path.basename(componentPath);
    this.results = [];
  }

  async validate() {
    const validations = [
      structureValidation,
      typeScriptValidation,
      reactValidation,
      storybookValidation,
      accessibilityValidation,
      designSystemValidation,
      muiValidation,
      testValidation,
      performanceValidation,
    ];

    for (const validation of validations) {
      const result = await this.runValidation(validation);
      this.results.push(result);

      // Stop on critical failures
      if (result.critical && !result.passed) {
        break;
      }
    }

    return this.generateReport();
  }

  async runValidation(validation) {
    const results = [];

    for (const check of validation.checks) {
      try {
        const passed = await check.test(this.componentName);
        results.push({
          name: check.name,
          passed,
          error: passed ? null : `Check failed: ${check.name}`,
        });
      } catch (error) {
        results.push({
          name: check.name,
          passed: false,
          error: error.message,
        });
      }
    }

    return {
      name: validation.name,
      passed: results.every((r) => r.passed),
      results,
      critical: validation.critical || false,
    };
  }

  generateReport() {
    return {
      component: this.componentName,
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter((r) => r.passed).length,
        failed: this.results.filter((r) => !r.passed).length,
      },
      validations: this.results,
      recommendation: this.getRecommendation(),
    };
  }

  getRecommendation() {
    const failed = this.results.filter((r) => !r.passed);

    if (failed.length === 0) {
      return 'Component meets all validation criteria';
    }

    const critical = failed.filter((r) => r.critical);
    if (critical.length > 0) {
      return `Fix critical issues: ${critical.map((c) => c.name).join(', ')}`;
    }

    return `Address ${failed.length} validation issues`;
  }
}
```

## Related Documents

- [State Management Validation](./02-state-validation.md)
- [PWA Validation](./03-pwa-validation.md)
- [UI/UX Validation](./04-ui-validation.md)
