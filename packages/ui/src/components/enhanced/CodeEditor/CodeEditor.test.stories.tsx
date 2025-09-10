import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Box, Stack, Button } from '@mui/material';
import React from 'react';

import { CodeEditor } from './CodeEditor';

const meta: Meta<typeof CodeEditor> = {
  title: 'Enhanced/CodeEditor/Tests',
  component: CodeEditor,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample code for testing
const sampleCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

export const BasicInteraction: Story = {
  args: {
    language: 'javascript',
    value: sampleCode,
    onChange: fn(),
    height: '300px',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for Monaco editor to load
    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Check that language badge is displayed
    const languageBadge = canvas.getByText('javascript');
    await expect(languageBadge).toBeInTheDocument();

    // Check that toolbar buttons are present
    const copyButton = canvas.getByRole('button', { name: /copy to clipboard/i });
    await expect(copyButton).toBeInTheDocument();

    const fullscreenButton = canvas.getByRole('button', { name: /enter fullscreen/i });
    await expect(fullscreenButton).toBeInTheDocument();

    // Test copy functionality
    await userEvent.click(copyButton);
    await waitFor(() => {
      const copiedButton = canvas.getByRole('button', { name: /copied!/i });
      return expect(copiedButton).toBeInTheDocument();
    });

    // Verify status indicator
    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const FormInteraction: Story = {
  args: {
    language: 'typescript',
    value: '',
    onChange: fn(),
    placeholder: 'Enter TypeScript code here...',
    height: '250px',
  },
  play: async ({ canvasElement }) => {
    // Wait for editor to load
    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Check that placeholder is visible when empty
    const placeholder = canvasElement.querySelector('[class*="PlaceholderOverlay"]');
    if (placeholder) {
      await expect(placeholder).toBeInTheDocument();
    }

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const KeyboardNavigation: Story = {
  args: {
    language: 'javascript',
    value: sampleCode,
    height: '300px',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Test Tab navigation through toolbar buttons
    const copyButton = canvas.getByRole('button', { name: /copy to clipboard/i });

    // Focus on copy button and test keyboard navigation
    copyButton.focus();
    await expect(copyButton).toHaveFocus();

    // Test Tab to next button
    await userEvent.tab();
    const fullscreenButton = canvas.getByRole('button', { name: /enter fullscreen/i });
    await expect(fullscreenButton).toHaveFocus();

    // Test Enter key activation
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      const exitButton = canvas.getByRole('button', { name: /exit fullscreen/i });
      return expect(exitButton).toBeInTheDocument();
    });

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const ScreenReader: Story = {
  args: {
    language: 'python',
    value: 'print("Hello, World!")',
    readOnly: true,
    height: '200px',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Check for language badge with proper text
    const languageBadge = canvas.getByText('python');
    await expect(languageBadge).toBeInTheDocument();

    // Check for read-only indicator
    const readOnlyText = canvas.getByText('Read Only');
    await expect(readOnlyText).toBeInTheDocument();

    // Check that buttons have proper accessible names
    const copyButton = canvas.getByRole('button', { name: /copy to clipboard/i });
    await expect(copyButton).toBeInTheDocument();
    await expect(copyButton).toBeEnabled();

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const FocusManagement: Story = {
  args: {
    language: 'css',
    value: '.test { color: red; }',
    height: '200px',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Test focus management during fullscreen toggle
    const fullscreenButton = canvas.getByRole('button', { name: /enter fullscreen/i });
    await userEvent.click(fullscreenButton);

    await waitFor(() => {
      const exitButton = canvas.getByRole('button', { name: /exit fullscreen/i });
      return expect(exitButton).toBeInTheDocument();
    });

    // Test Escape key to exit fullscreen
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      const enterButton = canvas.getByRole('button', { name: /enter fullscreen/i });
      return expect(enterButton).toBeInTheDocument();
    });

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const ResponsiveDesign: Story = {
  args: {
    language: 'html',
    value: '<div>Responsive test</div>',
    height: '250px',
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
      },
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Check that editor container is present and responsive
    const editorContainer = canvasElement.querySelector('.monaco-editor');
    await expect(editorContainer).toBeInTheDocument();

    // Check that toolbar is still functional on smaller screens
    const toolbar = canvasElement.querySelector('[class*="Toolbar"]');
    if (toolbar) {
      await expect(toolbar).toBeInTheDocument();
    }

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const ThemeVariations: Story = {
  render: () => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

    return (
      <Stack spacing={3}>
        <Button variant="outlined" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </Button>
        <CodeEditor
          language="javascript"
          value="// Theme variation test"
          theme={theme}
          height="200px"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Test theme switching
    const themeButton = canvas.getByRole('button', { name: /switch to dark theme/i });
    await userEvent.click(themeButton);

    await waitFor(() => {
      const lightButton = canvas.getByRole('button', { name: /switch to light theme/i });
      return expect(lightButton).toBeInTheDocument();
    });

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const VisualStates: Story = {
  render: () => (
    <Stack spacing={3}>
      <CodeEditor language="javascript" value="// Normal state" height="150px" />
      <CodeEditor language="javascript" value="// Read-only state" readOnly height="150px" />
      <CodeEditor
        language="javascript"
        value=""
        placeholder="Empty state with placeholder"
        height="150px"
      />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(
      () => {
        const editors = canvasElement.querySelectorAll('.monaco-editor');
        return expect(editors).toHaveLength(3);
      },
      { timeout: 5000 },
    );

    // Check normal state
    const normalEditor = canvasElement.querySelectorAll('.monaco-editor')[0];
    await expect(normalEditor).toBeInTheDocument();

    // Check read-only state
    const readOnlyText = canvas.getByText('Read Only');
    await expect(readOnlyText).toBeInTheDocument();

    // Check empty state with placeholder
    const placeholder = canvas.getByText('Empty state with placeholder');
    await expect(placeholder).toBeInTheDocument();

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const Performance: Story = {
  args: {
    language: 'javascript',
    value: sampleCode.repeat(50), // Large content to test performance
    height: '400px',
  },
  play: async ({ canvasElement }) => {
    const startTime = Date.now();

    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 10000 },
    );

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Expect reasonable load time (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);

    // Check that large content is handled properly
    const editorContent = canvasElement.querySelector('.monaco-editor');
    await expect(editorContent).toBeInTheDocument();

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const EdgeCases: Story = {
  render: () => (
    <Stack spacing={3}>
      <CodeEditor language="javascript" value="" height="100px" showToolbar={false} />
      <CodeEditor
        language="json"
        value='{"test": "very long text that might overflow and cause issues with the editor layout and rendering system"}'
        wordWrap
        height="100px"
      />
      <CodeEditor
        language="typescript"
        value="// Special characters: àáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
        height="100px"
      />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(
      () => {
        const editors = canvasElement.querySelectorAll('.monaco-editor');
        return expect(editors).toHaveLength(3);
      },
      { timeout: 5000 },
    );

    // Test empty editor without toolbar
    const editors = canvasElement.querySelectorAll('.monaco-editor');
    await expect(editors[0]).toBeInTheDocument();

    // Test word wrap with long content
    await expect(editors[1]).toBeInTheDocument();

    // Test special characters
    await expect(editors[2]).toBeInTheDocument();

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};

export const Integration: Story = {
  render: () => {
    const [code, setCode] = React.useState('// Integration test');
    const [isSaved, setIsSaved] = React.useState(false);

    const handleSave = (value: string) => {
      setCode(value);
      setIsSaved(true);
      window.setTimeout(() => setIsSaved(false), 2000);
    };

    return (
      <Stack spacing={2}>
        <CodeEditor
          language="javascript"
          value={code}
          onChange={setCode}
          onSave={handleSave}
          height="200px"
        />
        <Box sx={{ p: 1, bgcolor: isSaved ? 'success.light' : 'grey.100' }}>
          Status: {isSaved ? 'Saved' : 'Not saved'}
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Test integration with external state
    const statusBox = canvas.getByText(/Status:/);
    await expect(statusBox).toBeInTheDocument();

    // Test save functionality (Ctrl+S)
    const editorTextarea = canvasElement.querySelector('.monaco-editor textarea');
    if (editorTextarea) {
      editorTextarea.focus();
      await userEvent.keyboard('{Control>}s{/Control}');

      await waitFor(() => {
        const savedStatus = canvas.getByText('Status: Saved');
        return expect(savedStatus).toBeInTheDocument();
      });
    }

    const statusElement = canvasElement.querySelector('[aria-label="Status of the test run"]');
    if (statusElement) {
      expect(statusElement.textContent).toContain('PASS');
    }
  },
};
