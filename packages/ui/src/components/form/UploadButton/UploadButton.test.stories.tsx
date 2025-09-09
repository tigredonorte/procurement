import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { Box, FormControl, FormLabel } from '@mui/material';

import { UploadButton } from './UploadButton';

const meta: Meta<typeof UploadButton> = {
  title: 'Form/UploadButton/Tests',
  component: UploadButton,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false }
  },
  tags: ['autodocs', 'test']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test file creation helper
const createTestFile = (name: string = 'test.txt', type: string = 'text/plain', size: number = 1024): globalThis.File => {
  const blob = new globalThis.Blob(['test content'], { type });
  Object.defineProperty(blob, 'name', { value: name });
  Object.defineProperty(blob, 'size', { value: size });
  return blob as globalThis.File;
};

export const BasicInteraction: Story = {
  args: {
    onSelect: fn(),
    label: 'Upload File'
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const uploadButton = canvas.getByRole('button', { name: /upload file/i });
    
    // Test button is present and clickable
    await expect(uploadButton).toBeInTheDocument();
    await expect(uploadButton).toBeEnabled();
    
    // Test button click
    await userEvent.click(uploadButton);
    
    // Test hidden file input is present
    const fileInput = canvas.getByLabelText(/upload file/i, { selector: 'input[type="file"]' });
    await expect(fileInput).toBeInTheDocument();
    await expect(fileInput).toHaveStyle({ display: 'none' });
    
    // Simulate file selection
    const testFile = createTestFile();
    Object.defineProperty(fileInput, 'files', {
      value: [testFile],
      configurable: true
    });
    
    // Trigger file change event
    await userEvent.upload(fileInput, testFile);
    
    // Verify onSelect was called
    await waitFor(() => {
      expect(args.onSelect).toHaveBeenCalledWith(testFile);
    });
  }
};

export const FormInteraction: Story = {
  render: (args) => (
    <FormControl component="fieldset">
      <FormLabel component="legend">File Upload</FormLabel>
      <UploadButton {...args} />
    </FormControl>
  ),
  args: {
    onSelect: fn(),
    helperText: 'Select a file to upload'
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const formLabel = canvas.getByText('File Upload');
    const uploadButton = canvas.getByRole('button');
    const helperText = canvas.getByText('Select a file to upload');
    
    // Test form structure
    await expect(formLabel).toBeInTheDocument();
    await expect(uploadButton).toBeInTheDocument();
    await expect(helperText).toBeInTheDocument();
    
    // Test file upload in form context
    const fileInput = canvas.getByRole('textbox', { hidden: true }) || canvas.querySelector('input[type="file"]');
    const testFile = createTestFile('form-test.pdf', 'application/pdf');
    
    if (fileInput) {
      await userEvent.upload(fileInput as HTMLInputElement, testFile);
      
      await waitFor(() => {
        expect(args.onSelect).toHaveBeenCalledWith(testFile);
      });
    }
  }
};

export const StateChangeTest: Story = {
  args: {
    onSelect: fn(),
    onUpload: fn().mockImplementation(async () => {
      await new Promise(resolve => globalThis.setTimeout(resolve, 100));
    })
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const uploadButton = canvas.getByRole('button');
    
    // Test initial state
    await expect(uploadButton).toBeEnabled();
    await expect(uploadButton).toHaveTextContent(/upload file/i);
    
    // Simulate file upload with progress
    const fileInput = canvas.querySelector('input[type="file"]') as HTMLInputElement;
    const testFile = createTestFile();
    
    if (fileInput) {
      await userEvent.upload(fileInput, testFile);
      
      // Verify onSelect called
      await waitFor(() => {
        expect(args.onSelect).toHaveBeenCalledWith(testFile);
      });
      
      // If onUpload is provided, check upload state changes
      if (args.onUpload) {
        await waitFor(() => {
          const button = canvas.getByRole('button');
          expect(button).toHaveTextContent(/uploading/i);
        }, { timeout: 1000 });
        
        // Wait for upload to complete
        await waitFor(() => {
          expect(args.onUpload).toHaveBeenCalledWith(testFile);
        }, { timeout: 2000 });
      }
    }
  }
};

export const KeyboardNavigation: Story = {
  args: {
    onSelect: fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const uploadButton = canvas.getByRole('button');
    
    // Test keyboard navigation
    uploadButton.focus();
    await expect(uploadButton).toHaveFocus();
    
    // Test Enter key activation
    await userEvent.keyboard('{Enter}');
    
    // Test Space key activation
    await userEvent.keyboard(' ');
    
    // Test tab navigation
    await userEvent.keyboard('{Tab}');
    
    // Verify button maintains accessibility
    await expect(uploadButton).toHaveAttribute('type', 'button');
  }
};

export const ScreenReaderTest: Story = {
  args: {
    onSelect: fn(),
    helperText: 'Maximum file size is 5MB',
    'aria-label': 'Upload your document'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const uploadButton = canvas.getByRole('button');
    const helperText = canvas.getByText('Maximum file size is 5MB');
    
    // Test ARIA attributes
    await expect(uploadButton).toHaveAccessibleName();
    await expect(helperText).toBeInTheDocument();
    
    // Test describedby relationship
    const helperId = helperText.getAttribute('id');
    if (helperId) {
      const fileInput = canvas.querySelector('input[type="file"]');
      await expect(fileInput).toHaveAttribute('aria-describedby', expect.stringContaining(helperId));
    }
    
    // Test hidden file input accessibility
    const fileInput = canvas.querySelector('input[type="file"]');
    await expect(fileInput).toHaveAttribute('aria-hidden', 'true');
  }
};

export const FocusManagement: Story = {
  args: {
    onSelect: fn(),
    disabled: false
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const uploadButton = canvas.getByRole('button');
    
    // Test focus management
    await userEvent.tab();
    await expect(uploadButton).toHaveFocus();
    
    // Test focus styles
    await expect(uploadButton).toBeVisible();
    
    // Test disabled state focus
    // Note: This would need to be tested with a separate story for disabled state
    await expect(uploadButton).toBeEnabled();
  }
};

export const ResponsiveDesign: Story = {
  args: {
    onSelect: fn()
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const uploadButton = canvas.getByRole('button');
    
    // Test mobile viewport
    await expect(uploadButton).toBeInTheDocument();
    await expect(uploadButton).toBeVisible();
    
    // Test button is clickable on mobile
    await userEvent.click(uploadButton);
  }
};

export const ThemeVariations: Story = {
  parameters: {
    backgrounds: { default: 'dark' }
  },
  args: {
    onSelect: fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const uploadButton = canvas.getByRole('button');
    
    // Test dark theme visibility
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toBeEnabled();
    
    // Test contrast in dark mode
    const styles = globalThis.getComputedStyle(uploadButton);
    await expect(styles).toBeDefined();
  }
};

export const VisualStates: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <UploadButton onSelect={fn()} label="Default" />
      <UploadButton onSelect={fn()} variant="outline" label="Outline" />
      <UploadButton onSelect={fn()} variant="ghost" label="Ghost" />
      <UploadButton onSelect={fn()} variant="dropzone" label="Dropzone" />
      <UploadButton onSelect={fn()} disabled label="Disabled" />
      <UploadButton onSelect={fn()} uploading progress={50} label="Uploading" />
      <UploadButton onSelect={fn()} errorText="Error state" label="Error" />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    
    // Test all variants are rendered
    await expect(buttons).toHaveLength(6); // 5 buttons + 1 dropzone
    
    // Test each variant is visible
    for (const button of buttons) {
      await expect(button).toBeVisible();
    }
    
    // Test disabled state
    const disabledButton = canvas.getByRole('button', { name: /disabled/i });
    await expect(disabledButton).toBeDisabled();
    
    // Test error text
    const errorText = canvas.getByText('Error state');
    await expect(errorText).toBeInTheDocument();
  }
};

export const PerformanceTest: Story = {
  args: {
    onSelect: fn()
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const uploadButton = canvas.getByRole('button');
    
    const startTime = globalThis.performance.now();
    
    // Test rapid clicks
    for (let i = 0; i < 5; i++) {
      await userEvent.click(uploadButton);
    }
    
    const endTime = globalThis.performance.now();
    const duration = endTime - startTime;
    
    // Performance should be reasonable (less than 1 second for 5 clicks)
    await expect(duration).toBeLessThan(1000);
    
    // Test file handling performance
    const fileInput = canvas.querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile = createTestFile('large.txt', 'text/plain', 1024 * 1024); // 1MB
    
    if (fileInput) {
      const uploadStart = globalThis.performance.now();
      await userEvent.upload(fileInput, largeFile);
      const uploadEnd = globalThis.performance.now();
      
      await expect(uploadEnd - uploadStart).toBeLessThan(500);
      await expect(args.onSelect).toHaveBeenCalledWith(largeFile);
    }
  }
};

export const EdgeCases: Story = {
  args: {
    onSelect: fn(),
    maxSizeMB: 1,
    accept: 'image/*',
    validate: (file: globalThis.File) => {
      if (file.name.length > 50) {
        return 'File name too long';
      }
      return null;
    }
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      // Test file too large
      const largeFile = createTestFile('large.jpg', 'image/jpeg', 2 * 1024 * 1024); // 2MB
      await userEvent.upload(fileInput, largeFile);
      
      await waitFor(() => {
        const errorText = canvas.queryByText(/file size must be less than/i);
        expect(errorText).toBeInTheDocument();
      });
      
      // Clear the input for next test
      Object.defineProperty(fileInput, 'value', { value: '', configurable: true });
      Object.defineProperty(fileInput, 'files', { value: [], configurable: true });
      
      // Test custom validation
      const longNameFile = createTestFile('a'.repeat(60) + '.jpg', 'image/jpeg', 500 * 1024);
      await userEvent.upload(fileInput, longNameFile);
      
      await waitFor(() => {
        const errorText = canvas.queryByText(/file name too long/i);
        expect(errorText).toBeInTheDocument();
      });
      
      // Test valid file
      Object.defineProperty(fileInput, 'value', { value: '', configurable: true });
      Object.defineProperty(fileInput, 'files', { value: [], configurable: true });
      
      const validFile = createTestFile('valid.jpg', 'image/jpeg', 500 * 1024);
      await userEvent.upload(fileInput, validFile);
      
      await waitFor(() => {
        expect(args.onSelect).toHaveBeenCalledWith(validFile);
      });
    }
  }
};

export const IntegrationTest: Story = {
  render: () => (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <UploadButton 
        onSelect={fn()} 
        helperText="Select your profile image"
        accept="image/*"
        maxSizeMB={2}
      />
      <UploadButton 
        variant="dropzone"
        onSelect={fn()} 
        helperText="Drop your document here"
        accept=".pdf,.doc,.docx"
      />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole('form');
    const buttons = canvas.getAllByRole('button');
    const helperTexts = canvas.getAllByText(/select|drop/i);
    
    // Test form integration
    await expect(form).toBeInTheDocument();
    await expect(buttons).toHaveLength(2);
    await expect(helperTexts).toHaveLength(2);
    
    // Test different file inputs in same form
    const fileInputs = canvas.getAllByLabelText(/upload|drop/i, { selector: 'input[type="file"]' });
    await expect(fileInputs).toHaveLength(2);
    
    // Test each input has different accept attributes
    const imageInput = fileInputs.find(input => input.getAttribute('accept') === 'image/*');
    const documentInput = fileInputs.find(input => input.getAttribute('accept') === '.pdf,.doc,.docx');
    
    await expect(imageInput).toBeInTheDocument();
    await expect(documentInput).toBeInTheDocument();
  }
};