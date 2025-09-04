# Typography Components

A comprehensive set of typography components for building consistent and beautiful text interfaces.

## Components

### Text

A flexible text component with multiple variants and styling options.

```tsx
import { Text } from '@procurement/ui';

// Basic usage
<Text>Default body text</Text>

// Variants
<Text variant="body">Body text</Text>
<Text variant="heading">Heading style text</Text>
<Text variant="caption">Caption text</Text>
<Text variant="code">Inline code</Text>

// Styling
<Text color="primary" size="lg" weight="bold">Styled text</Text>
<Text italic underline>Emphasized text</Text>
```

#### Props

- `variant`: 'body' | 'heading' | 'caption' | 'code' (default: 'body')
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' (default: 'neutral')
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `weight`: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' (default: 'normal')
- `as`: HTML element to render as (default: 'span')
- `italic`: boolean (default: false)
- `underline`: boolean (default: false)
- `strikethrough`: boolean (default: false)

### Heading

Semantic heading component with multiple levels and gradient support.

```tsx
import { Heading } from '@procurement/ui';

// Basic usage
<Heading level="h1">Page Title</Heading>
<Heading level="h2">Section Title</Heading>

// Display variant for hero text
<Heading level="display">Welcome to Our Platform</Heading>

// Gradient effect
<Heading level="h1" gradient color="primary">
  Beautiful Gradient Heading
</Heading>
```

#### Props

- `level`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'display' (default: 'h2')
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' (default: 'neutral')
- `weight`: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' (default: 'bold')
- `gradient`: boolean - Enable gradient text effect (default: false)

### Paragraph

Semantic paragraph component for body content with variants.

```tsx
import { Paragraph } from '@procurement/ui';

// Basic usage
<Paragraph>
  This is a standard paragraph with comfortable line spacing.
</Paragraph>

// Lead paragraph
<Paragraph variant="lead">
  This lead paragraph stands out with larger text size.
</Paragraph>

// Muted text
<Paragraph variant="muted">
  Supporting information that appears more subtle.
</Paragraph>

// Small print
<Paragraph variant="small">
  Fine print or legal text.
</Paragraph>
```

#### Props

- `variant`: 'default' | 'lead' | 'muted' | 'small' (default: 'default')
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' (default: 'neutral')
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')

### Code

Versatile code component with inline and block variants, copy functionality, and line numbers.

```tsx
import { Code } from '@procurement/ui';

// Inline code
<Code variant="inline">npm install</Code>

// Block code with syntax highlighting
<Code variant="block" language="JavaScript" copyable>
{`function hello() {
  console.log("Hello, World!");
}`}
</Code>

// Highlighted code with line numbers
<Code variant="highlight" lineNumbers copyable language="CSS">
{`.button {
  background: linear-gradient(45deg, #007bff, #0056b3);
  padding: 12px 24px;
}`}
</Code>
```

#### Props

- `variant`: 'inline' | 'block' | 'highlight' (default: 'inline')
- `size`: 'xs' | 'sm' | 'md' | 'lg' (default: 'md')
- `language`: string - Programming language label (optional)
- `copyable`: boolean - Show copy button for block variants (default: false)
- `lineNumbers`: boolean - Show line numbers for block variants (default: false)

### Blockquote

Semantic blockquote component with multiple styles and attribution.

```tsx
import { Blockquote } from '@procurement/ui';

// Basic usage
<Blockquote>
  The only way to do great work is to love what you do.
</Blockquote>

// With author
<Blockquote author="Steve Jobs">
  Innovation distinguishes between a leader and a follower.
</Blockquote>

// Citation style with source
<Blockquote
  variant="citation"
  author="Maya Angelou"
  source="Letter to My Daughter"
>
  Success is liking yourself, liking what you do, and liking how you do it.
</Blockquote>

// Bordered variant with gradient
<Blockquote variant="bordered" color="primary">
  Important quote with visual emphasis.
</Blockquote>
```

#### Props

- `variant`: 'default' | 'bordered' | 'citation' (default: 'default')
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' (default: 'neutral')
- `author`: string - Quote author name (optional)
- `source`: string - Quote source or publication (optional)

## Theme Support

All typography components support both light and dark themes automatically. They adapt their colors, backgrounds, and effects based on the current theme mode.

### Light Mode

- Clean, minimal shadows
- Subtle backgrounds
- High contrast text

### Dark Mode

- Enhanced shadows and effects
- Backdrop filters for depth
- Adjusted contrast for readability

## Accessibility

All components follow accessibility best practices:

- Semantic HTML elements
- Proper heading hierarchy
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly

## Examples

### Article Layout

```tsx
<article>
  <Heading level="h1">Article Title</Heading>

  <Paragraph variant="lead">
    This lead paragraph introduces the article with engaging content.
  </Paragraph>

  <Heading level="h2" color="primary">
    Getting Started
  </Heading>

  <Paragraph>Main body content with detailed information.</Paragraph>

  <Code variant="block" copyable language="JavaScript">
    {`// Example code
const result = await fetchData();`}
  </Code>

  <Blockquote author="Expert Name" source="Conference 2024">
    An insightful quote that supports the content.
  </Blockquote>

  <Paragraph variant="muted" size="sm">
    Additional notes or disclaimers.
  </Paragraph>
</article>
```

### Documentation

```tsx
<div>
  <Heading level="h3">API Reference</Heading>

  <Paragraph>
    To install the package, run: <Code variant="inline">npm install @procurement/ui</Code>
  </Paragraph>

  <Code variant="highlight" copyable lineNumbers language="TypeScript">
    {`import { Button, Heading, Text } from '@procurement/ui';

function App() {
  return (
    <div>
      <Heading>My App</Heading>
      <Text>Welcome</Text>
    </div>
  );
}`}
  </Code>
</div>
```

## Best Practices

1. **Maintain Hierarchy**: Use heading levels sequentially (h1 → h2 → h3)
2. **Consistent Styling**: Use the same variant for similar content types
3. **Appropriate Variants**:
   - Use `lead` for introductory paragraphs
   - Use `muted` for secondary information
   - Use `citation` blockquotes for formal quotes
4. **Color Usage**:
   - `primary/secondary`: Brand emphasis
   - `success`: Positive messages
   - `warning`: Cautions
   - `danger`: Errors or critical information
   - `neutral`: Default content
5. **Code Components**:
   - Use `inline` for short code mentions
   - Use `block` for code examples
   - Use `highlight` for important code
   - Always add `language` for better context
   - Enable `copyable` for useful code snippets

## Performance

- Components use React.forwardRef for ref forwarding
- Styled with MUI's styled system for optimal performance
- Memoized children processing for Code line numbers
- Efficient re-rendering with proper prop forwarding

## TypeScript

All components are fully typed with TypeScript. Import types as needed:

```tsx
import type {
  TextProps,
  HeadingProps,
  ParagraphProps,
  CodeProps,
  BlockquoteProps,
} from '@procurement/ui';
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for all screen sizes
- Graceful degradation for older browsers
