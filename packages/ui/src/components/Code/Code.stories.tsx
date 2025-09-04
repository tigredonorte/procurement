import type { Meta, StoryObj } from '@storybook/react';

import { Code } from './Code';

const meta = {
  title: 'Typography/Code',
  component: Code,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Code component provides beautiful code display with support for inline snippets and block code with advanced features.
Perfect for documentation, tutorials, and technical content.

## Features
- 🎨 **3 Variants** - inline, block, and highlight styles
- 📋 **Copy Functionality** - One-click copy with visual feedback
- 🔢 **Line Numbers** - Optional line numbering for blocks
- 🏷️ **Language Labels** - Display programming language
- 📏 **4 Size Options** - From xs to lg
- 🌓 **Theme Aware** - Adapts to light/dark modes

## Usage

\`\`\`tsx
import { Code } from '@procurement/ui';

// Inline code
<Code variant="inline">npm install</Code>

// Block code with copy button
<Code variant="block" copyable>
  const result = await fetchData();
  console.log(result);
</Code>

// Highlighted code with line numbers
<Code 
  variant="highlight" 
  lineNumbers 
  copyable 
  language="JavaScript"
>
{‌\`function calculate(x, y) {
  return x + y;
}\`}
</Code>

// With language label
<Code variant="block" language="Python">
  def hello():
      print("Hello, World!")
</Code>
\`\`\`

## Best Practices
- Use inline variant for short code mentions
- Enable copyable for useful code snippets
- Add language labels for context
- Use line numbers for longer code blocks
- Apply highlight variant for important code

## Features Details

### Copy Functionality
- Visual feedback with checkmark when copied
- Tooltip shows "Copy code" / "Copied!"
- Preserves exact formatting

### Line Numbers
- Non-selectable for clean copying
- Properly aligned with code
- Scales with font size

## Accessibility
- Semantic code elements
- Keyboard accessible copy button
- Screen reader friendly
- High contrast in both themes
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['inline', 'block', 'highlight'],
      description: 'Code display variant',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Code size',
    },
    language: {
      control: { type: 'text' },
      description: 'Programming language label (for block variants)',
    },
    copyable: {
      control: { type: 'boolean' },
      description: 'Show copy button (for block variants)',
    },
    lineNumbers: {
      control: { type: 'boolean' },
      description: 'Show line numbers (for block variants)',
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'const message = "Hello, World!";',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>Inline Code</h3>
        <p>
          Use inline code like <Code variant="inline">npm install</Code> within your text content.
          This is perfect for mentioning <Code variant="inline">function names</Code>,
          <Code variant="inline">variables</Code>, or <Code variant="inline">command snippets</Code>
          .
        </p>
      </div>

      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>Block Code</h3>
        <Code variant="block">
          {`function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}`}
        </Code>
      </div>

      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>Highlight Code</h3>
        <Code variant="highlight">
          {`// This is a highlighted code block
// Perfect for important code snippets
export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d'
  }
};`}
        </Code>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <strong>Inline sizes:</strong>{' '}
        <Code variant="inline" size="xs">
          xs size
        </Code>
        ,{' '}
        <Code variant="inline" size="sm">
          sm size
        </Code>
        ,{' '}
        <Code variant="inline" size="md">
          md size
        </Code>
        ,{' '}
        <Code variant="inline" size="lg">
          lg size
        </Code>
      </div>

      <div>
        <strong>Extra Small Block:</strong>
        <Code variant="block" size="xs">
          console.log("Extra small code block");
        </Code>
      </div>

      <div>
        <strong>Small Block:</strong>
        <Code variant="block" size="sm">
          console.log("Small code block");
        </Code>
      </div>

      <div>
        <strong>Medium Block (Default):</strong>
        <Code variant="block" size="md">
          console.log("Medium code block");
        </Code>
      </div>

      <div>
        <strong>Large Block:</strong>
        <Code variant="block" size="lg">
          console.log("Large code block");
        </Code>
      </div>
    </div>
  ),
};

export const WithLanguageLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Code variant="block" language="JavaScript">
        {`const users = await fetch('/api/users')
  .then(response => response.json())
  .catch(error => console.error(error));`}
      </Code>

      <Code variant="highlight" language="Python">
        {`def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)`}
      </Code>

      <Code variant="block" language="CSS">
        {`.button {
  background: linear-gradient(45deg, #007bff, #0056b3);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
}`}
      </Code>

      <Code variant="highlight" language="SQL">
        {`SELECT users.name, COUNT(orders.id) as order_count
FROM users 
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.id
ORDER BY order_count DESC;`}
      </Code>
    </div>
  ),
};

export const CopyableCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Installation Command</h4>
        <Code variant="block" copyable language="bash">
          npm install @procurement/ui
        </Code>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Configuration Example</h4>
        <Code variant="highlight" copyable language="JSON">
          {`{
  "name": "@procurement/ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "dependencies": {
    "react": "^18.0.0",
    "@mui/material": "^5.0.0"
  }
}`}
        </Code>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>React Component</h4>
        <Code variant="block" copyable language="TypeScript">
          {`import { Button, Heading, Text } from '@procurement/ui';

export function WelcomeCard() {
  return (
    <div className="welcome-card">
      <Heading level="h2" gradient>Welcome!</Heading>
      <Text variant="body">
        Start building amazing interfaces with our component library.
      </Text>
      <Button variant="solid" color="primary">
        Get Started
      </Button>
    </div>
  );
}`}
        </Code>
      </div>
    </div>
  ),
};

export const WithLineNumbers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Code variant="block" lineNumbers language="JavaScript">
        {`function processUserData(userData) {
  // Validate input
  if (!userData || typeof userData !== 'object') {
    throw new Error('Invalid user data');
  }

  // Extract and normalize fields
  const { name, email, age } = userData;
  const normalizedName = name.trim().toLowerCase();
  
  // Validate email format
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Return processed data
  return {
    name: normalizedName,
    email: email.toLowerCase(),
    age: parseInt(age),
    createdAt: new Date().toISOString()
  };
}`}
      </Code>

      <Code variant="highlight" lineNumbers copyable language="CSS">
        {`.component {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`}
      </Code>
    </div>
  ),
};

export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section>
        <h3 style={{ margin: '0 0 16px 0' }}>API Documentation</h3>
        <p>
          To install the package, run: <Code variant="inline">npm install @procurement/ui</Code>
        </p>
        <p>
          Then import components:{' '}
          <Code variant="inline">import {'{ Button }'} from '@procurement/ui'</Code>
        </p>

        <Code variant="highlight" copyable language="TypeScript">
          {`// Basic usage example
import { Button, Text, Heading } from '@procurement/ui';

function App() {
  return (
    <div>
      <Heading level="h1">My App</Heading>
      <Text>Welcome to the application</Text>
      <Button onClick={() => alert('Hello!')}>
        Click me
      </Button>
    </div>
  );
}`}
        </Code>
      </section>

      <section>
        <h3 style={{ margin: '0 0 16px 0' }}>Configuration File</h3>
        <p>
          Create a <Code variant="inline">config.json</Code> file with the following structure:
        </p>

        <Code variant="block" copyable lineNumbers language="JSON">
          {`{
  "theme": {
    "primary": "#007bff",
    "secondary": "#6c757d"
  },
  "components": {
    "Button": {
      "defaultVariant": "solid",
      "defaultSize": "md"
    }
  },
  "features": {
    "darkMode": true,
    "animations": true
  }
}`}
        </Code>
      </section>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'inline',
    size: 'md',
    language: '',
    copyable: false,
    lineNumbers: false,
    children: 'console.log("Hello, World!");',
  },
};
