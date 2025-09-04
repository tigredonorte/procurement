import type { Meta, StoryObj } from '@storybook/react';

import { Paragraph } from './Paragraph';

const meta = {
  title: 'Typography/Paragraph',
  component: Paragraph,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Paragraph component provides semantic paragraph elements with optimized typography for long-form content.
It includes variants for different content types and emphasis levels.

## Features
- 📝 **4 Variants** - default, lead, muted, and small styles
- 📏 **5 Sizes** - Flexible sizing from xs to xl
- 🎨 **6 Color Themes** - Full theme color support
- 📖 **Optimized Line Spacing** - Comfortable reading experience
- 📱 **Responsive** - Adapts to screen sizes
- ♿ **Semantic HTML** - Proper paragraph elements

## Usage

\`\`\`tsx
import { Paragraph } from '@procurement/ui';

// Basic paragraph
<Paragraph>
  This is a standard paragraph with comfortable line spacing
  and optimal readability for body content.
</Paragraph>

// Lead paragraph for introductions
<Paragraph variant="lead">
  This lead paragraph stands out with larger text,
  perfect for article introductions.
</Paragraph>

// Muted for secondary content
<Paragraph variant="muted">
  Supporting information that appears more subtle.
</Paragraph>

// Small for fine print
<Paragraph variant="small">
  Legal text, disclaimers, or fine print.
</Paragraph>

// With custom styling
<Paragraph color="primary" size="lg">
  Styled paragraph with custom color and size.
</Paragraph>
\`\`\`

## Best Practices
- Use lead variant for article introductions
- Apply muted variant for secondary information
- Use small variant for disclaimers and fine print
- Maintain consistent spacing between paragraphs
- Limit line length for optimal readability

## Accessibility
- Semantic paragraph elements
- Proper text contrast ratios
- Readable line heights and spacing
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'lead', 'muted', 'small'],
      description: 'Paragraph style variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Paragraph color theme',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Paragraph size',
    },
  },
} satisfies Meta<typeof Paragraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      'This is a default paragraph with comfortable line spacing and readable typography. It provides excellent readability for longer content and maintains good visual hierarchy.',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600 }}>Default Variant</h3>
        <Paragraph variant="default">
          This is the default paragraph style, perfect for body text and regular content. It has
          comfortable line spacing and standard font weight for optimal readability.
        </Paragraph>
      </div>

      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600 }}>Lead Variant</h3>
        <Paragraph variant="lead">
          This is a lead paragraph that stands out with larger font size and improved letter
          spacing. Perfect for introductory text, summaries, or content that needs extra emphasis.
        </Paragraph>
      </div>

      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600 }}>Muted Variant</h3>
        <Paragraph variant="muted">
          This is muted text that appears more subtle and secondary. It's ideal for supporting
          information, disclaimers, or content that should be less prominent than the main text.
        </Paragraph>
      </div>

      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600 }}>Small Variant</h3>
        <Paragraph variant="small">
          This is small text for fine print, captions, legal text, or any content that needs to be
          compact while remaining readable. It maintains good proportions despite the smaller size.
        </Paragraph>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Paragraph color="neutral">
        Neutral paragraph - using the default text color from your theme.
      </Paragraph>
      <Paragraph color="primary">
        Primary colored paragraph - perfect for highlighting important information.
      </Paragraph>
      <Paragraph color="secondary">
        Secondary colored paragraph - great for complementary content.
      </Paragraph>
      <Paragraph color="success">
        Success colored paragraph - ideal for positive messages and confirmations.
      </Paragraph>
      <Paragraph color="warning">
        Warning colored paragraph - use for cautions and important notices.
      </Paragraph>
      <Paragraph color="danger">
        Danger colored paragraph - perfect for error messages and critical alerts.
      </Paragraph>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Paragraph size="xs">
        Extra small paragraph text. This size is perfect for fine print, legal disclaimers, or any
        content that needs to be compact while maintaining readability.
      </Paragraph>
      <Paragraph size="sm">
        Small paragraph text. Great for secondary content, captions, or supporting information that
        should be less prominent than main content.
      </Paragraph>
      <Paragraph size="md">
        Medium paragraph text (default size). This is the standard size for most body content,
        providing excellent readability and comfortable reading experience.
      </Paragraph>
      <Paragraph size="lg">
        Large paragraph text. Ideal for lead paragraphs, important announcements, or content that
        needs extra visibility and emphasis.
      </Paragraph>
      <Paragraph size="xl">
        Extra large paragraph text. Perfect for hero content, key messages, or any text that should
        grab immediate attention from readers.
      </Paragraph>
    </div>
  ),
};

export const ContentExamples: Story = {
  render: () => (
    <article style={{ maxWidth: '600px' }}>
      <h1 style={{ margin: '0 0 16px 0' }}>Article Title</h1>

      <Paragraph variant="lead">
        This lead paragraph introduces the article with engaging content that draws readers in. It
        uses larger text and improved spacing to create visual hierarchy and encourage continued
        reading.
      </Paragraph>

      <Paragraph>
        This is the main body content of the article. It provides detailed information using the
        default paragraph style, which offers optimal readability for longer content. The
        comfortable line spacing and appropriate font size make it easy to read through extended
        passages.
      </Paragraph>

      <Paragraph>
        Here's another paragraph continuing the main content. Notice how the consistent spacing and
        typography create a pleasant reading rhythm that keeps users engaged with the content.
      </Paragraph>

      <Paragraph variant="muted" size="sm">
        This muted paragraph provides additional context or supporting information. It's styled to
        be less prominent than the main content while remaining readable and accessible.
      </Paragraph>

      <Paragraph variant="small">
        © 2024 Example Company. This small text is perfect for copyright notices, legal
        disclaimers, or other fine print that needs to be included but shouldn't dominate the
        layout.
      </Paragraph>
    </article>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    color: 'neutral',
    size: 'md',
    children:
      'Customize this paragraph using the controls panel to explore all the available options and see how they affect the appearance and styling.',
  },
};
