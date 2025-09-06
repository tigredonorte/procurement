import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Paper, Box, Typography } from '@mui/material';
import React from 'react';

import { Code } from './Code';

const meta = {
  title: 'Typography/Code',
  component: Code,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A code typography component for displaying inline code, code blocks, and syntax-highlighted snippets with various styling options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['inline', 'block', 'terminal'],
      description: 'Code display variant',
    },
    language: {
      control: { type: 'select' },
      options: ['javascript', 'typescript', 'python', 'bash', 'json', 'css', 'html'],
      description: 'Programming language for syntax highlighting',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'github', 'monokai'],
      description: 'Color theme',
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Show line numbers (block variant only)',
    },
    copyable: {
      control: 'boolean',
      description: 'Enable copy to clipboard',
    },
    wrap: {
      control: 'boolean',
      description: 'Wrap long lines',
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'const greeting = "Hello, World!";',
    variant: 'inline',
  },
};

export const InlineCode: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography>
        Use the <Code variant="inline">useState</Code> hook to manage component state.
      </Typography>
      
      <Typography>
        Install the package with <Code variant="inline">npm install react</Code> or{' '}
        <Code variant="inline">yarn add react</Code>.
      </Typography>
      
      <Typography>
        The function <Code variant="inline">calculateTotal()</Code> returns a{' '}
        <Code variant="inline">number</Code> value.
      </Typography>
      
      <Typography>
        Press <Code variant="inline">Ctrl+S</Code> to save or{' '}
        <Code variant="inline">Cmd+S</Code> on Mac.
      </Typography>
    </Stack>
  ),
};

export const BlockCode: Story = {
  render: () => (
    <Stack spacing={3}>
      <Code variant="block" language="javascript">
{`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

 // Output: 55`}
      </Code>
      
      <Code variant="block" language="typescript">
{`interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};`}
      </Code>
      
      <Code variant="block" language="python">
{`def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))`}
      </Code>
    </Stack>
  ),
};

export const TerminalCode: Story = {
  render: () => (
    <Stack spacing={3}>
      <Code variant="terminal">
{`$ npm install @mui/material @emotion/react @emotion/styled
$ npm run dev

> procurement-ui@1.0.0 dev
> vite dev

  VITE v4.5.0  ready in 432 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h to show help`}
      </Code>
      
      <Code variant="terminal">
{`$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   src/components/Code.tsx
        modified:   src/index.ts

$ git commit -m "Add Code component"
[main abc1234] Add Code component
 2 files changed, 150 insertions(+)`}
      </Code>
    </Stack>
  ),
};

export const WithLineNumbers: Story = {
  render: () => (
    <Stack spacing={3}>
      <Code variant="block" language="javascript" showLineNumbers>
{`// React component with hooks
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;`}
      </Code>
    </Stack>
  ),
};

export const CopyableCode: Story = {
  render: () => (
    <Stack spacing={3}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Click the copy button to copy this code:
        </Typography>
        <Code variant="block" language="bash" copyable>
{`npm install
npm run build
npm run test`}
        </Code>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Configuration example:
        </Typography>
        <Code variant="block" language="json" copyable>
{`{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`}
        </Code>
      </Paper>
    </Stack>
  ),
};

export const ColorThemes: Story = {
  render: () => {
    const sampleCode = `const greeting = "Hello, World!";
`;

    return (
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>Light Theme</Typography>
          <Code variant="block" language="javascript" theme="light">
            {sampleCode}
          </Code>
        </Box>
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>Dark Theme</Typography>
          <Code variant="block" language="javascript" theme="dark">
            {sampleCode}
          </Code>
        </Box>
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>GitHub Theme</Typography>
          <Code variant="block" language="javascript" theme="github">
            {sampleCode}
          </Code>
        </Box>
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>Monokai Theme</Typography>
          <Code variant="block" language="javascript" theme="monokai">
            {sampleCode}
          </Code>
        </Box>
      </Stack>
    );
  },
};

export const DifferentLanguages: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>HTML</Typography>
        <Code variant="block" language="html">
{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`}
        </Code>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" gutterBottom>CSS</Typography>
        <Code variant="block" language="css">
{`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}`}
        </Code>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" gutterBottom>JSON</Typography>
        <Code variant="block" language="json">
{`{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}`}
        </Code>
      </Box>
    </Stack>
  ),
};

export const DocumentationExample: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>Installation</Typography>
        <Typography paragraph>
          To get started, install the package using npm or yarn:
        </Typography>
        <Code variant="block" language="bash" copyable>
{`npm install @company/ui-components
# or
yarn add @company/ui-components`}
        </Code>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Basic Usage</Typography>
        <Typography paragraph>
          Import and use the <Code variant="inline">Button</Code> component:
        </Typography>
        <Code variant="block" language="javascript" showLineNumbers copyable>
{`import { Button } from '@company/ui-components';

function App() {
  return (
    <Button variant="primary" onClick={() => alert('Clicked!')}>
      Click Me
    </Button>
  );
}`}
        </Code>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>API Reference</Typography>
        <Typography paragraph>
          The <Code variant="inline">Button</Code> component accepts the following props:
        </Typography>
        <Code variant="block" language="typescript">
{`interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}`}
        </Code>
      </Box>
    </Stack>
  ),
};

export const LongCodeWithWrap: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Without wrapping (scrollable)
        </Typography>
        <Code variant="block" language="javascript" wrap={false}>
{`const veryLongVariableName = "This is a very long string that would normally cause horizontal scrolling in the code block without wrapping enabled";`}
        </Code>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          With wrapping enabled
        </Typography>
        <Code variant="block" language="javascript" wrap={true}>
{`const veryLongVariableName = "This is a very long string that will wrap to the next line when wrapping is enabled in the code block";`}
        </Code>
      </Box>
    </Stack>
  ),
};

export const MixedContent: Story = {
  render: () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Working with Arrays in JavaScript
      </Typography>
      
      <Typography paragraph>
        JavaScript provides many useful array methods. The <Code variant="inline">map()</Code> method 
        creates a new array by transforming each element:
      </Typography>
      
      <Code variant="block" language="javascript" showLineNumbers>
{`const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
 // [2, 4, 6, 8, 10]`}
      </Code>
      
      <Typography paragraph sx={{ mt: 2 }}>
        You can also use <Code variant="inline">filter()</Code> to select specific elements and{' '}
        <Code variant="inline">reduce()</Code> to compute a single value:
      </Typography>
      
      <Code variant="block" language="javascript" showLineNumbers>
{`const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);`}
      </Code>
      
      <Typography variant="caption" display="block" sx={{ mt: 2 }}>
        💡 Tip: These methods don&apos;t modify the original array
      </Typography>
    </Paper>
  ),
};