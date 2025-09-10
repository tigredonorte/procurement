# UI/UX and Component Library Enforcement Guidelines

## Overview

This document defines validation patterns for enforcing the use of the custom component library, preventing direct HTML element usage, and ensuring design system compliance.

## Critical Enforcement Rules

### Component Library Enforcement

**MANDATORY**: All UI elements must use components from the @requisio/ui-library. Direct usage of HTML elements or Material-UI imports is strictly prohibited.

## Component Usage Validation

### Level 1: Import Validation

```javascript
const importValidation = {
  name: 'import-validation',
  critical: true,
  checks: [
    {
      name: 'no-direct-mui-imports',
      critical: true,
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for forbidden imports
        const forbiddenImports = [
          '@mui/material',
          '@mui/system',
          '@mui/icons-material',
          '@material-ui/core',
          '@material-ui/icons',
          'antd',
          'react-bootstrap',
          'semantic-ui-react',
          '@chakra-ui/react',
        ];

        const violations = [];
        for (const lib of forbiddenImports) {
          if (content.includes(`from '${lib}`) || content.includes(`from "${lib}`)) {
            violations.push({
              library: lib,
              message: `Direct import from ${lib} is forbidden. Use @requisio/ui-library components instead.`,
            });
          }
        }

        return {
          passed: violations.length === 0,
          violations,
        };
      },
    },
    {
      name: 'use-component-library',
      critical: true,
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check if component library is imported
        const hasLibraryImport =
          content.includes("from '@requisio/ui-library'") ||
          content.includes('from "@requisio/ui-library"');

        // Only enforce if file has JSX
        const hasJSX = content.includes('<') && content.includes('>');

        if (hasJSX && !hasLibraryImport) {
          return {
            passed: false,
            message: 'Components with JSX must import from @requisio/ui-library',
          };
        }

        return { passed: true };
      },
    },
  ],
};
```

### Level 2: HTML Element Detection

```javascript
const htmlElementValidation = {
  name: 'html-element-validation',
  critical: true,
  checks: [
    {
      name: 'no-native-html-elements',
      critical: true,
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        const ast = parseTypeScript(content);

        // Mapping of HTML elements to required components
        const elementToComponent = {
          // Layout elements
          '<div': 'Container, Card, Stack, or Box',
          '<span': 'Text or Typography',
          '<section': 'Container or Section',
          '<article': 'Card or Article',
          '<aside': 'Sidebar or Aside',
          '<header': 'Header or AppBar',
          '<footer': 'Footer',
          '<nav': 'NavigationMenu or Navbar',
          '<main': 'Container with main prop',

          // Typography
          '<h1': 'Heading variant="h1"',
          '<h2': 'Heading variant="h2"',
          '<h3': 'Heading variant="h3"',
          '<h4': 'Heading variant="h4"',
          '<h5': 'Heading variant="h5"',
          '<h6': 'Heading variant="h6"',
          '<p': 'Paragraph or Text',
          '<label': 'Label',
          '<code': 'Code',
          '<pre': 'Code block',
          '<blockquote': 'Blockquote',

          // Form elements
          '<input': 'Input, InputOTP, or specific input component',
          '<textarea': 'Textarea',
          '<select': 'Select',
          '<button': 'Button',
          '<form': 'Form',
          '<fieldset': 'FormSection',

          // Data display
          '<table': 'Table or DataGrid',
          '<ul': 'List variant="unordered"',
          '<ol': 'List variant="ordered"',
          '<li': 'ListItem',
          '<dl': 'DescriptionList',
          '<img': 'Image or Avatar',

          // Interactive elements
          '<a': 'Link or Button with href',
          '<dialog': 'Dialog or Modal',
          '<details': 'Collapsible or Accordion',
          '<summary': 'AccordionSummary',

          // Media
          '<video': 'Video component',
          '<audio': 'Audio component',
          '<canvas': 'Canvas or Chart',

          // Other
          '<hr': 'Separator',
          '<progress': 'Progress',
          '<meter': 'Progress variant="meter"',
        };

        const violations = [];

        for (const [element, component] of Object.entries(elementToComponent)) {
          // Use regex to find JSX elements
          const regex = new RegExp(`${element}[\\s>]`, 'g');
          const matches = content.match(regex);

          if (matches) {
            violations.push({
              element: element.replace('<', ''),
              required: component,
              count: matches.length,
              message: `Found ${matches.length} instance(s) of ${element}. Use ${component} instead.`,
            });
          }
        }

        return {
          passed: violations.length === 0,
          violations,
        };
      },
    },
    {
      name: 'semantic-html-replacement',
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for specific patterns that should use components
        const patterns = [
          {
            pattern: /<div className="card"/,
            replacement: 'Card component',
            message: 'Use Card component instead of div with card className',
          },
          {
            pattern: /<div.*role="button"/,
            replacement: 'Button component',
            message: 'Use Button component instead of div with role="button"',
          },
          {
            pattern: /<div.*contentEditable/,
            replacement: 'RichTextEditor component',
            message: 'Use RichTextEditor instead of contentEditable div',
          },
          {
            pattern: /<table.*className="data-/,
            replacement: 'DataGrid or Table component',
            message: 'Use DataGrid or Table component for data tables',
          },
        ];

        const violations = [];

        for (const { pattern, replacement, message } of patterns) {
          if (pattern.test(content)) {
            violations.push({ pattern: pattern.toString(), replacement, message });
          }
        }

        return {
          passed: violations.length === 0,
          violations,
        };
      },
    },
  ],
};
```

### Level 3: Component Mapping Validation

```javascript
const componentMappingValidation = {
  name: 'component-mapping',
  checks: [
    {
      name: 'correct-component-usage',
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        const components = parseJSXComponents(content);

        const recommendations = [];

        for (const component of components) {
          // Check if better component exists
          const suggestion = getComponentSuggestion(component);
          if (suggestion) {
            recommendations.push({
              current: component.name,
              suggested: suggestion.component,
              reason: suggestion.reason,
            });
          }
        }

        return {
          passed: recommendations.length === 0,
          recommendations,
        };
      },
    },
  ],
};

function getComponentSuggestion(component) {
  const suggestions = {
    // Layout improvements
    Container: (props) => {
      if (props.glass) return { component: 'Card', reason: 'Use Card with variant="glass"' };
      return null;
    },
    Box: (props) => {
      if (props.onClick)
        return { component: 'Button', reason: 'Clickable boxes should be Buttons' };
      if (props.shadow) return { component: 'Card', reason: 'Boxes with shadows should be Cards' };
      return null;
    },

    // Form improvements
    Input: (props) => {
      if (props.type === 'number')
        return { component: 'NumberInput', reason: 'Use NumberInput for numeric values' };
      if (props.type === 'email')
        return { component: 'EmailInput', reason: 'Use EmailInput for email addresses' };
      if (props.type === 'tel')
        return { component: 'PhoneInput', reason: 'Use PhoneInput for phone numbers' };
      if (props.multiline)
        return { component: 'Textarea', reason: 'Use Textarea for multiline input' };
      return null;
    },
  };

  const suggestionFn = suggestions[component.name];
  return suggestionFn ? suggestionFn(component.props) : null;
}
```

## Design System Compliance

### Visual Identity Validation

```javascript
const visualIdentityValidation = {
  name: 'visual-identity',
  checks: [
    {
      name: 'glassmorphism-usage',
      test: async (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check if glass variants are properly implemented
        if (content.includes('variant="glass"') || content.includes("variant='glass'")) {
          const hasBackdropFilter =
            content.includes('backdropFilter') || content.includes('backdrop-filter');
          const hasTransparency = content.includes('rgba') || content.includes('opacity');

          return {
            passed: hasBackdropFilter && hasTransparency,
            message: 'Glass variant must include backdrop-filter and transparency',
          };
        }

        return { passed: true };
      },
    },
    {
      name: 'gradient-implementation',
      test: async (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        if (content.includes('variant="gradient"')) {
          const gradients = [
            'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', // Primary
            'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)', // Secondary
            'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)', // Success
          ];

          const hasProperGradient = gradients.some((g) => content.includes(g));

          return {
            passed: hasProperGradient,
            message: 'Use predefined gradients from design system',
          };
        }

        return { passed: true };
      },
    },
    {
      name: 'neumorphism-shadows',
      test: async (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        if (content.includes('variant="neumorphic"')) {
          const hasInsetShadow = content.includes('inset');
          const hasMultipleShadows = (content.match(/box-shadow/g) || []).length >= 2;

          return {
            passed: hasInsetShadow && hasMultipleShadows,
            message: 'Neumorphic design requires inset shadows and multiple shadow layers',
          };
        }

        return { passed: true };
      },
    },
  ],
};
```

### Typography System Validation

```javascript
const typographyValidation = {
  name: 'typography-validation',
  checks: [
    {
      name: 'font-family-usage',
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for hardcoded font families
        const forbiddenFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'];

        const violations = forbiddenFonts.filter(
          (font) =>
            content.includes(`font-family: ${font}`) || content.includes(`fontFamily: '${font}'`),
        );

        return {
          passed: violations.length === 0,
          violations,
          message: 'Use Inter or system font stack from theme',
        };
      },
    },
    {
      name: 'type-scale-compliance',
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for hardcoded font sizes
        const invalidSizes = content.match(/fontSize: ['"]?\d+px/g) || [];

        return {
          passed: invalidSizes.length === 0,
          violations: invalidSizes,
          message: 'Use typography scale from theme (xs, sm, md, lg, xl, etc.)',
        };
      },
    },
  ],
};
```

### Spacing System Validation

```javascript
const spacingValidation = {
  name: 'spacing-validation',
  checks: [
    {
      name: 'spacing-scale-usage',
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for hardcoded spacing values
        const spacingPattern = /(?:margin|padding)(?:Top|Right|Bottom|Left)?: ['"]?\d+px/g;
        const hardcodedSpacing = content.match(spacingPattern) || [];

        // Allowed values from spacing scale
        const allowedValues = [
          '0px',
          '4px',
          '8px',
          '12px',
          '16px',
          '20px',
          '24px',
          '32px',
          '40px',
          '48px',
          '64px',
          '80px',
          '96px',
          '128px',
        ];

        const violations = hardcodedSpacing.filter((spacing) => {
          const value = spacing.match(/\d+px/)[0];
          return !allowedValues.includes(value);
        });

        return {
          passed: violations.length === 0,
          violations,
          message: 'Use spacing scale values (4px base unit)',
        };
      },
    },
  ],
};
```

## Storybook Validation

### Story Coverage Validation

```javascript
const storybookCoverageValidation = {
  name: 'storybook-coverage',
  critical: true,
  checks: [
    {
      name: 'required-stories',
      critical: true,
      test: async (component) => {
        const storyFile = `${component}.stories.tsx`;

        if (!fs.existsSync(storyFile)) {
          return {
            passed: false,
            message: `Missing Storybook file: ${storyFile}`,
          };
        }

        const content = fs.readFileSync(storyFile, 'utf8');

        // Required stories for every component
        const requiredStories = [
          'Default',
          'AllVariants',
          'AllSizes',
          'AllStates',
          'Interactive',
          'WithIcons',
          'EdgeCases',
          'Responsive',
          'DarkMode',
        ];

        const missingStories = requiredStories.filter(
          (story) =>
            !content.includes(`export const ${story}`) &&
            !content.includes(`export function ${story}`),
        );

        return {
          passed: missingStories.length === 0,
          missingStories,
          message: `Missing required stories: ${missingStories.join(', ')}`,
        };
      },
    },
    {
      name: 'story-completeness',
      test: async (component) => {
        const storyContent = fs.readFileSync(`${component}.stories.tsx`, 'utf8');
        const componentProps = await getComponentProps(component);

        // Check if all props are demonstrated
        const undemonstratedProps = [];

        for (const prop of componentProps) {
          if (!storyContent.includes(prop.name)) {
            undemonstratedProps.push(prop.name);
          }
        }

        return {
          passed: undemonstratedProps.length === 0,
          undemonstratedProps,
          message: `Props not demonstrated in stories: ${undemonstratedProps.join(', ')}`,
        };
      },
    },
    {
      name: 'variant-coverage',
      test: async (component) => {
        const storyContent = fs.readFileSync(`${component}.stories.tsx`, 'utf8');
        const docs = parseMarkdown(`${component}.md`);
        const variants = docs.getVariants();

        if (!variants || variants.length === 0) return { passed: true };

        const missingVariants = variants.filter(
          (variant) =>
            !storyContent.includes(`variant="${variant}"`) &&
            !storyContent.includes(`variant='${variant}'`),
        );

        return {
          passed: missingVariants.length === 0,
          missingVariants,
          message: `Variants not shown in stories: ${missingVariants.join(', ')}`,
        };
      },
    },
  ],
};
```

## Accessibility Validation

### Enhanced WCAG Compliance

```javascript
const wcagValidation = {
  name: 'wcag-compliance',
  checks: [
    {
      name: 'color-contrast',
      test: async (component) => {
        const colors = await extractColors(component);
        const violations = [];

        for (const { background, foreground, usage } of colors) {
          const ratio = getContrastRatio(background, foreground);

          if (usage === 'text' && ratio < 4.5) {
            violations.push({
              background,
              foreground,
              ratio,
              required: 4.5,
              level: 'AA',
            });
          }

          if (usage === 'large-text' && ratio < 3) {
            violations.push({
              background,
              foreground,
              ratio,
              required: 3,
              level: 'AA',
            });
          }
        }

        return {
          passed: violations.length === 0,
          violations,
        };
      },
    },
    {
      name: 'focus-indicators',
      test: async (component) => {
        const content = fs.readFileSync(`${component}.tsx`, 'utf8');

        // Check for focus styles
        const hasFocusStyles =
          content.includes(':focus') ||
          content.includes('&:focus') ||
          content.includes('focus:') ||
          content.includes('focusVisible');

        // Check for focus trap in modals/dialogs
        const isOverlay = ['Modal', 'Dialog', 'Drawer', 'Popover'].includes(component);
        const hasFocusTrap = isOverlay
          ? content.includes('FocusTrap') || content.includes('useFocusTrap')
          : true;

        return {
          passed: hasFocusStyles && hasFocusTrap,
          issues: [
            !hasFocusStyles && 'Missing focus styles',
            !hasFocusTrap && 'Missing focus trap for overlay component',
          ].filter(Boolean),
        };
      },
    },
  ],
};
```

## Performance Validation

### Bundle Size and Optimization

```javascript
const performanceOptimizationValidation = {
  name: 'performance-optimization',
  checks: [
    {
      name: 'lazy-loading',
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for heavy components that should be lazy loaded
        const heavyComponents = [
          'Chart',
          'DataGrid',
          'RichTextEditor',
          'CodeEditor',
          'MapPreview',
          'LottieAnimation',
        ];

        const violations = [];

        for (const component of heavyComponents) {
          if (
            content.includes(`import { ${component} }`) ||
            content.includes(`import ${component} from`)
          ) {
            // Check if it's lazy loaded
            const isLazy = content.includes(`lazy(() => import`) && content.includes(component);

            if (!isLazy) {
              violations.push({
                component,
                message: `${component} should be lazy loaded for better performance`,
              });
            }
          }
        }

        return {
          passed: violations.length === 0,
          violations,
        };
      },
    },
    {
      name: 'image-optimization',
      test: async (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for image components
        if (content.includes('Image') || content.includes('Avatar')) {
          const hasLazyLoading =
            content.includes('loading="lazy"') || content.includes("loading='lazy'");
          const hasAltText = content.includes('alt=');
          const hasSrcSet = content.includes('srcSet') || content.includes('srcset');

          return {
            passed: hasLazyLoading && hasAltText,
            issues: [
              !hasLazyLoading && 'Images should use lazy loading',
              !hasAltText && 'Images must have alt text',
              !hasSrcSet && 'Consider using srcSet for responsive images',
            ].filter(Boolean),
          };
        }

        return { passed: true };
      },
    },
  ],
};
```

## Validation Orchestrator

### Complete UI/UX Validation Runner

```javascript
class UIUXValidator {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.results = [];
    this.criticalFailures = [];
  }

  async validate() {
    const validations = [
      // Critical: Must pass
      { validator: importValidation, critical: true },
      { validator: htmlElementValidation, critical: true },
      { validator: storybookCoverageValidation, critical: true },

      // Important: Should pass
      { validator: componentMappingValidation, critical: false },
      { validator: visualIdentityValidation, critical: false },
      { validator: typographyValidation, critical: false },
      { validator: spacingValidation, critical: false },
      { validator: wcagValidation, critical: false },
      { validator: performanceOptimizationValidation, critical: false },
    ];

    // Get all component files
    const componentFiles = await this.getComponentFiles();

    for (const file of componentFiles) {
      console.log(`Validating: ${file}`);

      for (const { validator, critical } of validations) {
        const result = await this.runValidation(validator, file);

        if (critical && !result.passed) {
          this.criticalFailures.push({
            file,
            validation: validator.name,
            errors: result.errors,
          });
        }

        this.results.push({
          file,
          validation: validator.name,
          ...result,
        });
      }
    }

    return this.generateReport();
  }

  async getComponentFiles() {
    const componentsDir = path.join(this.projectPath, 'src/components');
    const files = [];

    const walk = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (
          entry.name.endsWith('.tsx') &&
          !entry.name.includes('.test.') &&
          !entry.name.includes('.stories.')
        ) {
          files.push(fullPath);
        }
      }
    };

    walk(componentsDir);
    return files;
  }

  async runValidation(validator, file) {
    const results = [];

    for (const check of validator.checks) {
      try {
        const result = await check.test(file);
        results.push({
          check: check.name,
          critical: check.critical,
          ...result,
        });
      } catch (error) {
        results.push({
          check: check.name,
          critical: check.critical,
          passed: false,
          error: error.message,
        });
      }
    }

    return {
      passed: results.every((r) => r.passed || !r.critical),
      results,
    };
  }

  generateReport() {
    const summary = {
      totalFiles: new Set(this.results.map((r) => r.file)).size,
      totalChecks: this.results.length,
      passed: this.results.filter((r) => r.passed).length,
      failed: this.results.filter((r) => !r.passed).length,
      criticalFailures: this.criticalFailures.length,
    };

    if (this.criticalFailures.length > 0) {
      console.error('\n❌ CRITICAL FAILURES DETECTED:');
      console.error('The following issues MUST be fixed:');

      for (const failure of this.criticalFailures) {
        console.error(`\n📁 ${failure.file}`);
        console.error(`   Validation: ${failure.validation}`);
        console.error(`   Errors:`, failure.errors);
      }

      console.error('\n🚫 Build blocked due to critical failures.');
      console.error('Fix these issues to proceed:');
      console.error('1. Replace all HTML elements with library components');
      console.error('2. Remove all direct MUI or other library imports');
      console.error('3. Ensure all components have complete Storybook coverage');
    }

    return {
      summary,
      criticalFailures: this.criticalFailures,
      allResults: this.results,
      blocked: this.criticalFailures.length > 0,
    };
  }
}

// Export for use in CI/CD
module.exports = { UIUXValidator };

// CLI execution
if (require.main === module) {
  const validator = new UIUXValidator(process.cwd());

  validator
    .validate()
    .then((report) => {
      console.log('\n📊 Validation Report:');
      console.log(JSON.stringify(report.summary, null, 2));

      if (report.blocked) {
        process.exit(1); // Block the build
      } else {
        console.log('\n✅ All critical validations passed!');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}
```

## Integration with CI/CD

### GitHub Actions Workflow

```yaml
name: UI/UX Validation

on:
  pull_request:
    paths:
      - 'src/components/**'
      - 'src/styles/**'

jobs:
  validate-ui:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '24'

      - name: Install dependencies
        run: pnpm install

      - name: Run UI/UX Validation
        run: |
          node validation/ui-ux-validator.js
        env:
          FAIL_ON_WARNING: false

      - name: Check Storybook Coverage
        run: |
          pnpm storybook:build
          node validation/story-coverage.js

      - name: Upload Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: ui-validation-report
          path: validation-report.json
```

## Related Documents

- [Component Validation](./01-component-validation.md)
- [State Management Validation](./02-state-validation.md)
- [PWA Validation](./03-pwa-validation.md)
