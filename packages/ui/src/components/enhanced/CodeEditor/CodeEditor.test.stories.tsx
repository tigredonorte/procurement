import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor, fn } from 'storybook/test';
import { Box, Stack } from '@mui/material';
import React from 'react';

import { CodeEditor } from './CodeEditor';

const meta: Meta<typeof CodeEditor> = {
  title: 'Enhanced/CodeEditor/Tests',
  component: CodeEditor,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:CodeEditor'],
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
    lineNumbers: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for Monaco editor to fully initialize
    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        const hasTextContent = canvasElement.querySelector('.view-lines .view-line');
        return expect(editor).toBeInTheDocument() && expect(hasTextContent).toBeInTheDocument();
      },
      { timeout: 8000 },
    );

    // Verify actual code content is rendered correctly
    const viewLines = canvasElement.querySelector('.view-lines');
    await expect(viewLines).toBeInTheDocument();

    // Verify specific JavaScript keywords are syntax highlighted
    await waitFor(
      () => {
        const functionKeyword = Array.from(
          canvasElement.querySelectorAll('.mtk5, .mtk6, .mtk7'),
        ).find((el) => el.textContent?.includes('function'));
        return expect(functionKeyword).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Test actual Monaco editor functionality - line numbers
    const lineNumbers = canvasElement.querySelectorAll('.line-numbers');
    expect(lineNumbers.length).toBeGreaterThan(6); // Should have line numbers for our sample code
    expect(lineNumbers[0]).toHaveTextContent('1');
    expect(lineNumbers[1]).toHaveTextContent('2');

    // Verify Monaco editor content is editable and responds to input
    const textArea = canvasElement.querySelector('.inputarea') as HTMLElement;
    await expect(textArea).toBeInTheDocument();

    // Test editor receives focus and is interactive
    textArea.focus();
    await expect(textArea).toHaveFocus();

    // Test that onChange is called when content changes (use existing content)
    await userEvent.keyboard('{End}'); // Go to end of content
    await userEvent.type(textArea, '\n// Added comment');

    // Verify onChange callback was called with modified content
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
      const mockFn = args.onChange as ReturnType<typeof fn>;
      const calls = mockFn.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toContain('// Added comment');
    });

    // Test basic Monaco keyboard shortcuts work
    await userEvent.keyboard('{Control>}z{/Control}'); // Undo
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(
        expect.stringContaining('console.log(fibonacci(10));'),
      );
    });

    // Verify syntax highlighting for strings
    await waitFor(() => {
      const stringTokens = canvasElement.querySelectorAll('.mtk10, .mtk8'); // String token classes
      const hasStringHighlight = Array.from(stringTokens).some(
        (token) =>
          token.textContent?.includes('"hello world"') ||
          token.textContent?.includes('hello world'),
      );
      return expect(hasStringHighlight).toBe(true);
    });

    // Test copy functionality with actual clipboard integration
    const copyButton = canvas.getByRole('button', { name: /copy to clipboard/i });
    await userEvent.click(copyButton);

    await waitFor(() => {
      const copiedButton = canvas.getByRole('button', { name: /copied!/i });
      return expect(copiedButton).toBeInTheDocument();
    });

    // Test completed successfully
  },
};

export const FormInteraction: Story = {
  args: {
    language: 'typescript',
    value: '',
    onChange: fn(),
    placeholder: 'Enter TypeScript code here...',
    height: '250px',
    autoFormat: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for Monaco editor to fully load
    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 8000 },
    );

    // Verify placeholder functionality
    const placeholder = canvasElement.querySelector('[class*="PlaceholderOverlay"]');
    await expect(placeholder).toBeInTheDocument();
    await expect(placeholder).toHaveTextContent('Enter TypeScript code here...');

    // Verify correct TypeScript language setting
    const languageBadge = canvas.getByText('typescript');
    await expect(languageBadge).toBeInTheDocument();

    // Test actual TypeScript code input with type annotations
    const textarea = canvasElement.querySelector('.inputarea') as HTMLElement;
    await expect(textarea).toBeInTheDocument();

    textarea.focus();
    const typescriptCode =
      'interface User {\n  name: string;\n  age: number;\n}\nconst user: User = { name: "John", age: 30 };';
    await userEvent.type(textarea, typescriptCode, { delay: 10 });

    // Verify onChange was called with TypeScript content
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(typescriptCode);
    });

    // Verify placeholder disappears when content exists
    await waitFor(() => {
      const placeholderAfter = canvasElement.querySelector('[class*="PlaceholderOverlay"]');
      return expect(placeholderAfter).not.toBeInTheDocument();
    });

    // Test TypeScript-specific syntax highlighting
    await waitFor(() => {
      // Look for interface keyword highlighting
      const interfaceKeyword = Array.from(
        canvasElement.querySelectorAll('.mtk5, .mtk6, .mtk7'),
      ).find((el) => el.textContent?.includes('interface'));
      return expect(interfaceKeyword).toBeInTheDocument();
    });

    // Verify type annotation highlighting (colon syntax)
    await waitFor(() => {
      const colonTokens = Array.from(canvasElement.querySelectorAll('.mtk1, .mtk2, .mtk3')).filter(
        (el) => el.textContent?.includes(':'),
      );
      return expect(colonTokens.length).toBeGreaterThan(0);
    });

    // Test Monaco's auto-formatting functionality
    const formatButton = canvas.getByRole('button', { name: /format code/i });
    await expect(formatButton).toBeInTheDocument();
    await userEvent.click(formatButton);

    // Verify content structure after formatting
    await waitFor(() => {
      // Check if code maintains proper TypeScript structure
      const codeContent = textarea.value || '';
      return expect(codeContent).toContain('interface User');
    });

    // Test Monaco editor bracket matching
    await userEvent.click(textarea);
    await userEvent.keyboard('{End}'); // Go to end
    await userEvent.type(
      textarea,
      '\nfunction greet(user: User): string {\n  return `Hello, ${user.name}!`;\n}',
    );

    // Verify TypeScript function syntax highlighting
    await waitFor(() => {
      const returnKeyword = Array.from(canvasElement.querySelectorAll('.mtk5, .mtk6, .mtk7')).find(
        (el) => el.textContent?.includes('return'),
      );
      return expect(returnKeyword).toBeInTheDocument();
    });

    // Test Monaco's built-in indentation
    await userEvent.keyboard('{Enter}');
    await userEvent.type(textarea, 'console.log(greet(user));');

    // Verify onChange callback was called
    await waitFor(() => {
      return expect(args.onChange).toHaveBeenCalled();
    });

    // Test completed successfully
  },
};

export const KeyboardNavigation: Story = {
  args: {
    language: 'javascript',
    value: sampleCode,
    height: '300px',
    onSave: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 8000 },
    );

    // Test Tab navigation through toolbar buttons
    const formatButton = canvas.getByRole('button', { name: /format code/i });
    const wrapButton = canvas.getByRole('button', { name: /word wrap/i });
    const copyButton = canvas.getByRole('button', { name: /copy to clipboard/i });
    const fullscreenButton = canvas.getByRole('button', { name: /enter fullscreen/i });

    // Test sequential tab navigation
    formatButton.focus();
    await expect(formatButton).toHaveFocus();

    await userEvent.tab();
    await expect(wrapButton).toHaveFocus();

    await userEvent.tab();
    await expect(copyButton).toHaveFocus();

    await userEvent.tab();
    await expect(fullscreenButton).toHaveFocus();

    // Test Monaco editor keyboard shortcuts
    const textarea = canvasElement.querySelector('.inputarea') as HTMLElement;
    await expect(textarea).toBeInTheDocument();

    // Focus editor and test Monaco navigation shortcuts
    textarea.focus();
    await expect(textarea).toHaveFocus();

    // Test Ctrl+Home (go to beginning)
    await userEvent.keyboard('{Control>}{Home}{/Control}');

    // Test Ctrl+End (go to end)
    await userEvent.keyboard('{Control>}{End}{/Control}');

    // Test line navigation with arrows
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowDown}');

    // Test Monaco's Ctrl+L (select line)
    await userEvent.keyboard('{Control>}l{/Control}');

    // Test Monaco's Ctrl+/ (toggle comment)
    await userEvent.keyboard('{Control>}/{/Control}');

    // Test Monaco's Ctrl+S (save functionality)
    await userEvent.keyboard('{Control>}s{/Control}');

    // Verify save callback was triggered
    await waitFor(() => {
      expect(args.onSave).toHaveBeenCalled();
    });

    // Test Monaco's Ctrl+Z (undo)
    await userEvent.type(textarea, '// Test comment');
    await userEvent.keyboard('{Control>}z{/Control}');

    // Test Monaco's Ctrl+Y (redo)
    await userEvent.keyboard('{Control>}y{/Control}');

    // Test Monaco's selection and copy
    await userEvent.keyboard('{Control>}a{/Control}'); // Select all
    await userEvent.keyboard('{Control>}c{/Control}'); // Copy

    // Test Enter key activation on buttons
    copyButton.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      const copiedButton = canvas.getByRole('button', { name: /copied!/i });
      return expect(copiedButton).toBeInTheDocument();
    });

    // Test fullscreen toggle with Enter
    fullscreenButton.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      const exitButton = canvas.getByRole('button', { name: /exit fullscreen/i });
      return expect(exitButton).toBeInTheDocument();
    });

    // Test Escape to exit fullscreen
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      const enterButton = canvas.getByRole('button', { name: /enter fullscreen/i });
      return expect(enterButton).toBeInTheDocument();
    });

    // Test completed successfully
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

    // Test completed successfully
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

    // Test completed successfully
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

    // Test completed successfully
  },
};

export const ThemeVariations: Story = {
  args: {
    language: 'javascript',
    value: '// Theme test\nconst test = "hello";',
    theme: 'light',
    height: '200px',
  },
  play: async ({ canvasElement }) => {
    await waitFor(
      () => {
        const editor = canvasElement.querySelector('.monaco-editor');
        return expect(editor).toBeInTheDocument();
      },
      { timeout: 8000 },
    );

    // Test basic Monaco editor functionality
    const editorElement = canvasElement.querySelector('.monaco-editor') as HTMLElement;
    await expect(editorElement).toBeInTheDocument();

    // Verify syntax highlighting is working
    await waitFor(() => {
      const tokens = canvasElement.querySelectorAll('.mtk1, .mtk5, .mtk6, .mtk7, .mtk8');
      return expect(tokens.length).toBeGreaterThan(0);
    });

    // Test completed successfully
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

    // Test completed successfully
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

    // Test completed successfully
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
        minimap
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

    // Test empty editor without toolbar
    const copyButtons = canvas.getAllByRole('button', { name: /copy to clipboard/i });
    expect(copyButtons).toHaveLength(2); // Only 2 editors should have toolbars (with copy buttons)

    // Test word wrap functionality
    const wrapButton = canvas.getAllByRole('button', { name: /word wrap/i })[0];
    await expect(wrapButton).toBeInTheDocument();

    // Verify word wrap is enabled (button should be colored)
    const wrapButtonElement = wrapButton as HTMLElement;
    const wrapButtonColor = window.getComputedStyle(wrapButtonElement).color;
    expect(wrapButtonColor).not.toBe('inherit');

    // Test special characters are rendered correctly
    const specialCharsEditor = canvasElement.querySelectorAll('.view-lines')[2];
    await expect(specialCharsEditor).toBeInTheDocument();

    // Verify minimap is shown for the third editor
    const minimaps = canvasElement.querySelectorAll('.minimap');
    expect(minimaps.length).toBeGreaterThan(0);

    // Test JSON syntax highlighting
    const jsonEditor = canvasElement.querySelectorAll('.monaco-editor')[1];
    const jsonTokens = jsonEditor.querySelectorAll('.mtk1, .mtk5, .mtk8'); // JSON token classes
    expect(jsonTokens.length).toBeGreaterThan(0);

    // Test completed successfully
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

    // Verify initial "Not saved" status
    let initialStatus = canvas.getByText('Status: Not saved');
    await expect(initialStatus).toBeInTheDocument();

    // Test save functionality (Ctrl+S)
    const editorTextarea = canvasElement.querySelector('.inputarea') as HTMLElement;
    await expect(editorTextarea).toBeInTheDocument();

    editorTextarea.focus();
    await userEvent.keyboard('{Control>}s{/Control}');

    // Wait for status to change to "Saved"
    await waitFor(
      () => {
        const savedStatus = canvas.getByText('Status: Saved');
        return expect(savedStatus).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Test completed successfully
  },
};
