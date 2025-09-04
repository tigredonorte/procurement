import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from './Heading';

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Heading component provides semantic HTML heading elements (h1-h6) with consistent styling and beautiful gradient effects.
Perfect for page titles, section headers, and creating clear visual hierarchy.

## Features
- 📊 **7 Levels** - h1 through h6 plus display variant
- 🌈 **Gradient Effects** - Beautiful gradient text support
- 🎨 **6 Color Themes** - Full theme color integration
- ⚖️ **5 Font Weights** - Customizable text weight
- 📱 **Responsive** - Scales beautifully across devices
- ♿ **Semantic HTML** - Proper heading hierarchy

## Usage

\`\`\`tsx
import { Heading } from '@procurement/ui';

// Basic headings
<Heading level="h1">Page Title</Heading>
<Heading level="h2">Section Title</Heading>
<Heading level="h3">Subsection</Heading>

// Display variant for hero text
<Heading level="display">
  Welcome to Our Platform
</Heading>

// With gradient effect
<Heading level="h1" gradient color="primary">
  Beautiful Gradient Heading
</Heading>

// Custom styling
<Heading level="h2" color="success" weight="medium">
  Success Message
</Heading>
\`\`\`

## Best Practices
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Use only one h1 per page
- Use display variant for hero/marketing text
- Apply gradients sparingly for emphasis

## Accessibility
- Semantic heading elements for screen readers
- Proper document outline structure
- Sufficient color contrast maintained
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'display'],
      description: 'Heading level (h1-h6) or display',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Heading color theme',
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight',
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'The Quick Brown Fox Jumps',
  },
};

export const Levels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Heading level="display">Display Heading - Hero Text</Heading>
      <Heading level="h1">H1 Heading - Page Title</Heading>
      <Heading level="h2">H2 Heading - Section Title</Heading>
      <Heading level="h3">H3 Heading - Subsection</Heading>
      <Heading level="h4">H4 Heading - Article Title</Heading>
      <Heading level="h5">H5 Heading - Card Title</Heading>
      <Heading level="h6">H6 Heading - Small Title</Heading>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Heading level="h2" color="neutral">
        Neutral Heading
      </Heading>
      <Heading level="h2" color="primary">
        Primary Heading
      </Heading>
      <Heading level="h2" color="secondary">
        Secondary Heading
      </Heading>
      <Heading level="h2" color="success">
        Success Heading
      </Heading>
      <Heading level="h2" color="warning">
        Warning Heading
      </Heading>
      <Heading level="h2" color="danger">
        Danger Heading
      </Heading>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Heading level="h3" weight="light">
        Light Weight Heading
      </Heading>
      <Heading level="h3" weight="normal">
        Normal Weight Heading
      </Heading>
      <Heading level="h3" weight="medium">
        Medium Weight Heading
      </Heading>
      <Heading level="h3" weight="semibold">
        Semibold Heading
      </Heading>
      <Heading level="h3" weight="bold">
        Bold Weight Heading
      </Heading>
    </div>
  ),
};

export const GradientHeadings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Heading level="display" gradient color="primary">
        Gradient Display Heading
      </Heading>
      <Heading level="h1" gradient color="secondary">
        Beautiful Gradient H1
      </Heading>
      <Heading level="h2" gradient color="success">
        Success Gradient Heading
      </Heading>
      <Heading level="h3" gradient color="warning">
        Warning Gradient Effect
      </Heading>
      <Heading level="h4" gradient color="danger">
        Danger Gradient Style
      </Heading>
    </div>
  ),
};

export const UseCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section>
        <Heading level="display" gradient color="primary">
          Welcome to Our Platform
        </Heading>
        <p style={{ fontSize: '1.125rem', marginTop: '16px', opacity: 0.8 }}>
          A beautiful display heading perfect for hero sections and landing pages.
        </p>
      </section>

      <section>
        <Heading level="h1" color="neutral">
          Documentation
        </Heading>
        <Heading level="h2" color="primary">
          Getting Started
        </Heading>
        <p style={{ marginTop: '12px', opacity: 0.8 }}>
          Semantic heading hierarchy for content structure.
        </p>
      </section>

      <section>
        <Heading level="h3" color="success">
          ✅ Features Available
        </Heading>
        <Heading level="h4" color="warning" weight="medium">
          ⚠️ Beta Features
        </Heading>
        <Heading level="h5" color="danger">
          🚫 Deprecated Features
        </Heading>
      </section>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    level: 'h2',
    color: 'neutral',
    weight: 'bold',
    gradient: false,
    children: 'Customize this heading using the controls',
  },
};
