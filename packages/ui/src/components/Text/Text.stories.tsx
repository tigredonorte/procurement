import type { Meta, StoryObj } from '@storybook/react';

import { Text } from './Text';

const meta = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Text component is a versatile text wrapper that provides consistent typography across your application.
It supports multiple variants, sizes, colors, and text decorations.

## Features
- 🎨 **4 Variants** - body, heading, caption, and code styles
- 📏 **5 Sizes** - from xs to xl for flexible sizing
- 🎨 **6 Color Themes** - full theme color support
- ⚖️ **5 Font Weights** - from light to bold
- ✨ **Text Decorations** - italic, underline, and strikethrough
- 🏷️ **Semantic HTML** - render as any HTML element

## Usage

\`\`\`tsx
import { Text } from '@procurement/ui';

// Basic usage
<Text>Default body text</Text>

// With variants
<Text variant="heading">Heading style</Text>
<Text variant="caption">Caption text</Text>
<Text variant="code">Inline code</Text>

// With styling
<Text color="primary" size="lg" weight="bold">
  Styled text
</Text>

// With decorations
<Text italic underline>
  Emphasized text
</Text>

// As different HTML elements
<Text as="strong" weight="bold">Strong text</Text>
<Text as="em" italic>Emphasized text</Text>
\`\`\`

## Accessibility
- Uses semantic HTML elements
- Maintains proper text contrast ratios
- Supports screen readers
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['body', 'heading', 'caption', 'code'],
      description: 'Text style variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Text color theme',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Text size',
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight',
    },
    as: {
      control: { type: 'select' },
      options: ['span', 'p', 'div', 'strong', 'em'],
      description: 'HTML element to render',
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    children: 'This is default body text with a clean, readable style.',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="body">Body text - perfect for regular content and paragraphs</Text>
      <Text variant="heading">Heading text - styled like a heading but inline</Text>
      <Text variant="caption">Caption text - smaller and subtle for secondary information</Text>
      <Text variant="code">Code text - monospace font with background styling</Text>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text color="neutral">Neutral text - default theme color</Text>
      <Text color="primary">Primary text - brand primary color</Text>
      <Text color="secondary">Secondary text - brand secondary color</Text>
      <Text color="success">Success text - positive actions and states</Text>
      <Text color="warning">Warning text - caution and attention</Text>
      <Text color="danger">Danger text - errors and critical states</Text>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="xs">Extra small text (0.75rem)</Text>
      <Text size="sm">Small text (0.875rem)</Text>
      <Text size="md">Medium text (1rem) - default</Text>
      <Text size="lg">Large text (1.125rem)</Text>
      <Text size="xl">Extra large text (1.25rem)</Text>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text weight="light">Light weight text (300)</Text>
      <Text weight="normal">Normal weight text (400) - default</Text>
      <Text weight="medium">Medium weight text (500)</Text>
      <Text weight="semibold">Semibold text (600)</Text>
      <Text weight="bold">Bold text (700)</Text>
    </div>
  ),
};

export const Decorations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text>Regular text without decorations</Text>
      <Text italic>Italic text for emphasis</Text>
      <Text underline>Underlined text for links or emphasis</Text>
      <Text strikethrough>Strikethrough text for deleted content</Text>
      <Text italic underline weight="bold">
        Combined: italic, underline, and bold
      </Text>
    </div>
  ),
};

export const SemanticElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text as="span">Rendered as span (inline)</Text>
      <Text as="p">Rendered as paragraph (block)</Text>
      <Text as="strong" weight="bold">
        Rendered as strong (semantic bold)
      </Text>
      <Text as="em" italic>
        Rendered as em (semantic italic)
      </Text>
      <Text as="div">Rendered as div (block container)</Text>
    </div>
  ),
};

export const CodeVariant: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p>
          Inline code example:{' '}
          <Text variant="code" size="sm">
            const value = 'hello'
          </Text>{' '}
          within text.
        </p>
      </div>
      <div>
        <Text variant="code" size="md">
          npm install @procurement/ui
        </Text>
      </div>
      <div>
        <Text variant="code" size="lg" color="primary">
          function calculateTotal(items) {'{'} ... {'}'}
        </Text>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'body',
    color: 'neutral',
    size: 'md',
    weight: 'normal',
    as: 'span',
    italic: false,
    underline: false,
    strikethrough: false,
    children: 'Customize this text using the controls panel',
  },
};
