import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography } from '@mui/material';
import { MessageCircle, Edit3, FileText, Star } from 'lucide-react';

import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs', 'component:Textarea'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'autosize', 'resizable', 'rich'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['start', 'end'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    variant: 'default',
    size: 'md',
    color: 'primary',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Your Message',
    placeholder: 'Type your message here...',
    helperText: 'This field is required',
  },
};

export const Variants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom>Default</Typography>
        <Textarea placeholder="Default textarea..." />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Autosize</Typography>
        <Textarea 
          variant="autosize"
          placeholder="This textarea will grow as you type..."
          minRows={2}
          maxRows={6}
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Resizable</Typography>
        <Textarea 
          variant="resizable"
          placeholder="You can manually resize this textarea..."
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Rich Text Editor</Typography>
        <Textarea 
          variant="rich"
          placeholder="Rich text editor with formatting tools..."
          label="Rich Text Editor"
          helperText="Format your content with bold, italic, lists, and more"
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Rich Text with Glass Effect</Typography>
        <Textarea 
          variant="rich"
          glass
          placeholder="Rich textarea with glass effect..."
          label="Glass Rich Editor"
        />
      </Box>
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
      <Textarea color="primary" placeholder="Primary color" label="Primary" />
      <Textarea color="secondary" placeholder="Secondary color" label="Secondary" />
      <Textarea color="success" placeholder="Success color" label="Success" />
      <Textarea color="warning" placeholder="Warning color" label="Warning" />
      <Textarea color="danger" placeholder="Danger color" label="Danger" />
      <Textarea color="neutral" placeholder="Neutral color" label="Neutral" />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Textarea size="xs" placeholder="Extra small textarea" label="Extra Small (xs)" />
      <Textarea size="sm" placeholder="Small textarea" label="Small (sm)" />
      <Textarea size="md" placeholder="Medium textarea" label="Medium (md)" />
      <Textarea size="lg" placeholder="Large textarea" label="Large (lg)" />
      <Textarea size="xl" placeholder="Extra large textarea" label="Extra Large (xl)" />
    </Box>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Textarea 
        icon={<MessageCircle size={20} />}
        placeholder="Message with start icon..."
        label="Start Icon"
      />
      
      <Textarea 
        icon={<Edit3 size={20} />}
        iconPosition="end"
        placeholder="Message with end icon..."
        label="End Icon"
      />
      
      <Textarea 
        icon={<FileText size={20} />}
        glass
        placeholder="Glass effect with icon..."
        label="Glass + Icon"
      />
    </Box>
  ),
};

export const SpecialEffects: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom>Glass Morphism</Typography>
        <Textarea 
          glass
          placeholder="Glass morphism effect..."
          icon={<Star size={20} />}
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Gradient Border</Typography>
        <Textarea 
          gradient
          placeholder="Gradient border effect..."
          color="secondary"
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Glow Effect</Typography>
        <Textarea 
          glow
          placeholder="Glowing textarea..."
          color="success"
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Glass Label</Typography>
        <Textarea 
          glassLabel
          label="Glass Label"
          placeholder="Textarea with glass label..."
        />
      </Box>
    </Box>
  ),
};

export const ErrorStates: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Textarea 
        error
        label="Error State"
        placeholder="This field has an error..."
        helperText="This field is required"
      />
      
      <Textarea 
        error
        glass
        label="Glass + Error"
        placeholder="Glass effect with error..."
        helperText="Please fix this error"
        icon={<MessageCircle size={20} />}
      />
    </Box>
  ),
};

export const RichTextShowcase: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom>Rich Text Editor - Primary</Typography>
        <Textarea 
          variant="rich"
          color="primary"
          placeholder="Start writing your content..."
          label="Content Editor"
          helperText="Use the toolbar to format your text"
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Rich Text with Character Limit</Typography>
        <Textarea 
          variant="rich"
          color="secondary"
          placeholder="Limited character content..."
          label="Limited Editor"
          maxLength={500}
          helperText="Maximum 500 characters"
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Glass Rich Editor</Typography>
        <Textarea 
          variant="rich"
          glass
          glassLabel
          color="success"
          placeholder="Beautiful glass effect editor..."
          label="Premium Editor"
        />
      </Box>
    </Box>
  ),
};

export const Playground: Story = {
  args: {
    placeholder: 'Playground textarea...',
    label: 'Playground',
    helperText: 'Try different combinations',
    variant: 'default',
    size: 'md',
    color: 'primary',
    glass: false,
    gradient: false,
    glow: false,
    glassLabel: false,
    error: false,
    iconPosition: 'start',
  },
};