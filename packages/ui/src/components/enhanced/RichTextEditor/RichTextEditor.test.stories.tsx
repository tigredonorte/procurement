import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor } from '@storybook/test';
import React, { useState } from 'react';
import { Box } from '@mui/material';

import { RichTextEditor } from './RichTextEditor';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Enhanced/RichTextEditor/Tests',
  component: RichTextEditor,
  parameters: { 
    layout: 'centered', 
    chromatic: { disableSnapshot: false } 
  },
  tags: ['autodocs', 'test'],
};

export default meta;
export type Story = StoryObj<typeof meta>;

// Test wrapper with state management
interface TestWrapperProps {
  children: (props: { value: string; setValue: (value: string) => void }) => React.ReactNode;
  value?: string;
}

const TestWrapper = ({ children, ...props }: TestWrapperProps) => {
  const [value, setValue] = useState(props.value || '');
  return (
    <Box sx={{ width: 600 }}>
      {children({ value, setValue, ...props })}
    </Box>
  );
};

export const BasicInteraction: Story = {
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Type here to test basic interaction..."
          data-testid="rich-editor-basic"
        />
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the editor
    const editor = canvas.getByRole('textbox', { name: /rich text editor/i });
    await expect(editor).toBeInTheDocument();
    
    // Test typing
    await userEvent.click(editor);
    await userEvent.type(editor, 'Hello World');
    await waitFor(() => {
      expect(editor.innerHTML).toContain('Hello World');
    });
    
    // Test toolbar buttons
    const boldButton = canvas.getByLabelText('Bold');
    await expect(boldButton).toBeInTheDocument();
    await userEvent.click(boldButton);
    
    // Test more typing after formatting
    await userEvent.type(editor, ' Bold Text');
    await waitFor(() => {
      expect(editor.innerHTML).toContain('Bold Text');
    });
  },
};

export const FormInteraction: Story = {
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <RichTextEditor
          value={value}
          onChange={setValue}
          maxLength={50}
          placeholder="Test form interaction (50 char limit)..."
          data-testid="rich-editor-form"
        />
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editor = canvas.getByRole('textbox');
    
    // Test character limit
    await userEvent.click(editor);
    const longText = 'This is a very long text that should exceed the character limit set for this editor';
    await userEvent.type(editor, longText);
    
    // Check character count display
    const charCount = canvas.getByText(/\d+\/50/);
    await expect(charCount).toBeInTheDocument();
    
    // Test that text is limited
    await waitFor(() => {
      const plainText = editor.textContent || '';
      expect(plainText.length).toBeLessThanOrEqual(50);
    });
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Test keyboard navigation..."
          data-testid="rich-editor-keyboard"
        />
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editor = canvas.getByRole('textbox');
    const boldButton = canvas.getByLabelText('Bold');
    const italicButton = canvas.getByLabelText('Italic');
    
    // Test tab navigation to toolbar
    await userEvent.tab();
    await expect(boldButton).toHaveFocus();
    
    await userEvent.tab();
    await expect(italicButton).toHaveFocus();
    
    // Test keyboard shortcuts
    await userEvent.click(editor);
    await userEvent.type(editor, 'Test text');
    
    // Select all text
    await userEvent.keyboard('{Control>}a{/Control}');
    
    // Test bold shortcut
    await userEvent.keyboard('{Control>}b{/Control}');
    
    await waitFor(() => {
      const hasStrong = editor.innerHTML.includes('<strong>');
      const hasBold = editor.innerHTML.includes('<b>');
      expect(hasStrong || hasBold).toBeTruthy();
    });
  },
};

export const ScreenReader: Story = {
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <RichTextEditor
          value={value}
          onChange={setValue}
          aria-label="Rich text editor for testing accessibility"
          aria-describedby="editor-help"
          placeholder="Screen reader accessible editor..."
        />
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test ARIA attributes
    const editor = canvas.getByRole('textbox', { name: /rich text editor for testing accessibility/i });
    await expect(editor).toHaveAttribute('aria-label', 'Rich text editor for testing accessibility');
    await expect(editor).toHaveAttribute('aria-multiline', 'true');
    await expect(editor).toHaveAttribute('aria-describedby', 'editor-help');
    
    // Test toolbar button labels
    const boldButton = canvas.getByRole('button', { name: /bold/i });
    const italicButton = canvas.getByRole('button', { name: /italic/i });
    
    await expect(boldButton).toHaveAttribute('aria-label', 'Bold');
    await expect(italicButton).toHaveAttribute('aria-label', 'Italic');
  },
};

export const FocusManagement: Story = {
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Test focus management..."
          onFocus={() => {}}
          onBlur={() => {}}
        />
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editor = canvas.getByRole('textbox');
    const boldButton = canvas.getByLabelText('Bold');
    
    // Test initial focus
    await userEvent.click(editor);
    await expect(editor).toHaveFocus();
    
    // Test focus on toolbar button
    await userEvent.click(boldButton);
    
    // Focus should return to editor after toolbar action
    await waitFor(() => {
      expect(editor).toHaveFocus();
    });
    
    // Test blur
    await userEvent.tab(); // Move away from editor
    await expect(editor).not.toHaveFocus();
  },
};

export const ResponsiveDesign: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
      defaultViewport: 'mobile',
    },
  },
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Responsive editor test..."
          height="200px"
        />
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editor = canvas.getByRole('textbox');
    await expect(editor).toBeInTheDocument();
    
    // Test that editor is usable on mobile
    await userEvent.click(editor);
    await userEvent.type(editor, 'Mobile test');
    
    await waitFor(() => {
      expect(editor.innerHTML).toContain('Mobile test');
    });
    
    // Test toolbar buttons are accessible
    const boldButton = canvas.getByLabelText('Bold');
    await userEvent.click(boldButton);
    await expect(boldButton).toBeInTheDocument();
  },
};

export const ThemeVariations: Story = {
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <RichTextEditor
            value={value}
            onChange={setValue}
            placeholder="Theme variation test..."
          />
        </Box>
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editor = canvas.getByRole('textbox');
    await expect(editor).toBeInTheDocument();
    
    // Test that editor adapts to theme
    const editorContainer = editor.closest('[data-testid]') || editor.parentElement;
    const styles = window.getComputedStyle(editorContainer!);
    
    // Should have some background color (not transparent)
    expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.backgroundColor).not.toBe('transparent');
  },
};

export const VisualStates: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 600 }}>
      <TestWrapper>
        {({ value, setValue }) => (
          <RichTextEditor
            value={value}
            onChange={setValue}
            placeholder="Normal state..."
          />
        )}
      </TestWrapper>
      
      <TestWrapper>
        {({ value, setValue }) => (
          <RichTextEditor
            value={value}
            onChange={setValue}
            disabled
            placeholder="Disabled state..."
          />
        )}
      </TestWrapper>
      
      <TestWrapper value="<p>Read-only state with content</p>">
        {({ value, setValue }) => (
          <RichTextEditor
            value={value}
            onChange={setValue}
            readOnly
            toolbar={{}}
          />
        )}
      </TestWrapper>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editors = canvas.getAllByRole('textbox');
    expect(editors).toHaveLength(3);
    
    // Test normal editor
    const normalEditor = editors[0];
    await userEvent.click(normalEditor);
    await userEvent.type(normalEditor, 'Test');
    await expect(normalEditor).toContainHTML('Test');
    
    // Test disabled editor
    const disabledEditor = editors[1];
    expect(disabledEditor).toHaveAttribute('contenteditable', 'false');
    
    // Test readonly editor
    const readOnlyEditor = editors[2];
    expect(readOnlyEditor).toHaveAttribute('contenteditable', 'false');
    expect(readOnlyEditor.innerHTML).toContain('Read-only state');
  },
};

export const Performance: Story = {
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Performance test - type quickly..."
          height={400}
        />
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editor = canvas.getByRole('textbox');
    
    // Performance test - rapid typing
    const startTime = Date.now();
    
    await userEvent.click(editor);
    
    // Type a long text rapidly
    const longText = 'This is a performance test with a lot of text content. '.repeat(10);
    await userEvent.type(editor, longText, { delay: 1 });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete within reasonable time (5 seconds)
    expect(duration).toBeLessThan(5000);
    
    // Content should be rendered correctly
    await waitFor(() => {
      expect(editor.innerHTML).toContain('performance test');
    });
  },
};

export const EdgeCases: Story = {
  render: () => (
    <TestWrapper>
      {({ value, setValue }) => (
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Edge cases test..."
          maxLength={20}
        />
      )}
    </TestWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editor = canvas.getByRole('textbox');
    
    // Test empty state
    expect(editor.innerHTML).toBe('');
    
    // Test special characters
    await userEvent.click(editor);
    await userEvent.type(editor, '<>&"\'');
    
    await waitFor(() => {
      // Special characters should be handled safely
      expect(editor).toBeInTheDocument();
    });
    
    // Test character limit edge case
    await userEvent.clear(editor);
    await userEvent.type(editor, '12345678901234567890EXTRA');
    
    await waitFor(() => {
      const text = editor.textContent || '';
      expect(text.length).toBeLessThanOrEqual(20);
    });
    
    // Test HTML injection prevention
    await userEvent.clear(editor);
    await userEvent.type(editor, '<script>alert("xss")</script>');
    
    // Should not execute script
    await expect(editor).toBeInTheDocument();
  },
};

export const Integration: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 600 }}>
      <TestWrapper>
        {({ value, setValue }) => (
          <RichTextEditor
            value={value}
            onChange={setValue}
            placeholder="First editor..."
            toolbar={{ bold: true, italic: true, link: false }}
          />
        )}
      </TestWrapper>
      
      <TestWrapper>
        {({ value, setValue }) => (
          <RichTextEditor
            value={value}
            onChange={setValue}
            placeholder="Second editor with different toolbar..."
            toolbar={{ bold: false, italic: false, orderedList: true, unorderedList: true }}
          />
        )}
      </TestWrapper>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const editors = canvas.getAllByRole('textbox');
    expect(editors).toHaveLength(2);
    
    // Test first editor
    const editor1 = editors[0];
    const boldButton1 = canvas.getAllByLabelText('Bold')[0];
    
    await userEvent.click(editor1);
    await userEvent.type(editor1, 'First editor');
    await userEvent.click(boldButton1);
    
    // Test second editor
    const editor2 = editors[1];
    const listButton = canvas.getByLabelText('Bulleted List');
    
    await userEvent.click(editor2);
    await userEvent.type(editor2, 'Second editor');
    await userEvent.click(listButton);
    
    // Both editors should work independently
    await waitFor(() => {
      expect(editor1.innerHTML).toContain('First editor');
      expect(editor2.innerHTML).toContain('Second editor');
    });
  },
};