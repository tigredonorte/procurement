import type { Meta, StoryObj } from '@storybook/react';

import { Blockquote } from './Blockquote';

const meta = {
  title: 'Typography/Blockquote',
  component: Blockquote,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Blockquote component provides beautiful quote display with multiple visual styles and proper attribution.
Perfect for testimonials, citations, and highlighting important quotes.

## Features
- 🎨 **3 Variants** - default, bordered, and citation styles
- 👤 **Author Attribution** - Display author and source
- 🎨 **6 Color Themes** - Full theme color support
- ✨ **Visual Effects** - Gradient borders and quote icons
- 🌓 **Theme Aware** - Optimized for light/dark modes
- ♿ **Semantic HTML** - Proper blockquote elements

## Usage

\`\`\`tsx
import { Blockquote } from '@procurement/ui';

// Basic blockquote
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
  color="primary"
>
  Success is liking yourself, liking what you do, 
  and liking how you do it.
</Blockquote>

// Bordered variant with gradient
<Blockquote variant="bordered" color="primary">
  Important quote with visual emphasis.
</Blockquote>
\`\`\`

## Variants

### Default
- Clean left border accent
- Subtle background
- Minimal design

### Bordered
- Gradient border effect
- Quote icon decoration
- Enhanced visual presence

### Citation
- Centered text alignment
- Formal presentation
- Perfect for testimonials

## Best Practices
- Use citation variant for formal quotes
- Include author for credibility
- Add source for academic citations
- Use colors sparingly for emphasis
- Keep quotes concise and impactful

## Accessibility
- Semantic blockquote elements
- Proper text contrast
- Screen reader friendly attribution
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'bordered', 'citation'],
      description: 'Blockquote visual style',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Blockquote color theme',
    },
    author: {
      control: { type: 'text' },
      description: 'Quote author name',
    },
    source: {
      control: { type: 'text' },
      description: 'Quote source or publication',
    },
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600 }}>Default Variant</h3>
        <Blockquote variant="default">
          The future belongs to those who believe in the beauty of their dreams. This style provides
          a clean, minimal approach with a left border accent that draws attention without being
          overwhelming.
        </Blockquote>
      </div>

      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600 }}>
          Bordered Variant
        </h3>
        <Blockquote variant="bordered">
          Innovation distinguishes between a leader and a follower. The bordered style creates a
          more prominent visual presence with gradient borders and decorative quote icons.
        </Blockquote>
      </div>

      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600 }}>
          Citation Variant
        </h3>
        <Blockquote variant="citation" author="Maya Angelou" source="Letter to My Daughter">
          Success is liking yourself, liking what you do, and liking how you do it. The citation
          style is perfect for formal quotes with proper attribution.
        </Blockquote>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Blockquote color="neutral" author="Anonymous">
        Neutral quote - using the default theme colors for a subtle, professional appearance.
      </Blockquote>

      <Blockquote color="primary" variant="bordered">
        Primary colored blockquote - emphasizes brand identity and draws attention to key messages.
      </Blockquote>

      <Blockquote color="secondary" variant="default">
        Secondary colored quote - perfect for complementary content that supports the main message.
      </Blockquote>

      <Blockquote color="success" variant="citation" author="Vince Lombardi">
        Success colored quote - ideal for positive, motivational, or achievement-related content.
      </Blockquote>

      <Blockquote color="warning" variant="bordered">
        Warning colored blockquote - use for important notices, cautions, or highlighted
        information.
      </Blockquote>

      <Blockquote color="danger" variant="default" author="Sun Tzu" source="The Art of War">
        Danger colored quote - perfect for critical information, errors, or urgent messages.
      </Blockquote>
    </div>
  ),
};

export const WithAttribution: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <Blockquote author="Albert Einstein">
        Imagination is more important than knowledge. For knowledge is limited, whereas imagination
        embraces the entire world, stimulating progress, giving birth to evolution.
      </Blockquote>

      <Blockquote
        author="Nelson Mandela"
        source="Long Walk to Freedom"
        variant="bordered"
        color="primary"
      >
        Education is the most powerful weapon which you can use to change the world.
      </Blockquote>

      <Blockquote
        variant="citation"
        author="Marie Curie"
        source="Nobel Prize Acceptance Speech"
        color="secondary"
      >
        In science, we must be interested in things, not in persons.
      </Blockquote>

      <Blockquote source="Harvard Business Review" color="success">
        The best leaders are those who can adapt their style to the situation and the people they
        are leading.
      </Blockquote>
    </div>
  ),
};

export const LongQuotes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Blockquote
        variant="default"
        author="John F. Kennedy"
        source="Inaugural Address, 1961"
        color="primary"
      >
        And so, my fellow Americans: ask not what your country can do for you—ask what you can do
        for your country. My fellow citizens of the world: ask not what America will do for you, but
        what together we can do for the freedom of man.
      </Blockquote>

      <Blockquote
        variant="bordered"
        author="Theodore Roosevelt"
        source="Citizenship in a Republic, 1910"
        color="neutral"
      >
        It is not the critic who counts; not the man who points out how the strong man stumbles, or
        where the doer of deeds could have done them better. The credit belongs to the man who is
        actually in the arena, whose face is marred by dust and sweat and blood; who strives
        valiantly; who errs, who comes short again and again, because there is no effort without
        error and shortcoming.
      </Blockquote>

      <Blockquote
        variant="citation"
        author="Maya Angelou"
        source="I Know Why the Caged Bird Sings"
        color="secondary"
      >
        There is no greater agony than bearing an untold story inside you. The idea is to write it
        so that people hear it and it slides through the brain and goes straight to the heart.
      </Blockquote>
    </div>
  ),
};

export const BusinessQuotes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px' }}>
      <h2 style={{ margin: '0 0 24px 0' }}>Leadership & Innovation</h2>

      <Blockquote variant="bordered" color="primary" author="Peter Drucker">
        Management is doing things right; leadership is doing the right things.
      </Blockquote>

      <Blockquote variant="default" color="success" author="Thomas Edison">
        Genius is one percent inspiration and ninety-nine percent perspiration.
      </Blockquote>

      <Blockquote
        variant="citation"
        color="secondary"
        author="Reid Hoffman"
        source="The Start-up of You"
      >
        Starting a company is like jumping off a cliff and assembling a plane on the way down.
      </Blockquote>

      <Blockquote variant="bordered" color="warning" author="Warren Buffett">
        Risk comes from not knowing what you're doing.
      </Blockquote>

      <Blockquote color="neutral" author="Henry Ford">
        Whether you think you can or you think you can't, you're right.
      </Blockquote>
    </div>
  ),
};

export const TechnicalDocumentation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: '0 0 16px 0' }}>Best Practices</h3>
        <Blockquote variant="default" color="success" source="React Documentation">
          Components let you split the UI into independent, reusable pieces, and think about each
          piece in isolation.
        </Blockquote>
      </div>

      <div>
        <h3 style={{ margin: '0 0 16px 0' }}>Important Note</h3>
        <Blockquote variant="bordered" color="warning" source="TypeScript Handbook">
          TypeScript's type system is structural, not nominal. This means that types are compatible
          if their members are compatible.
        </Blockquote>
      </div>

      <div>
        <h3 style={{ margin: '0 0 16px 0' }}>Expert Opinion</h3>
        <Blockquote
          variant="citation"
          color="primary"
          author="Dan Abramov"
          source="React Core Team"
        >
          The best API is no API. The second-best API is one that's so simple and obvious that you
          can't screw it up.
        </Blockquote>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    color: 'neutral',
    author: '',
    source: '',
    children:
      'Customize this blockquote using the controls panel to explore all the available styling options.',
  },
};
