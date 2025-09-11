import type { Meta, StoryObj } from '@storybook/react-vite';
import { Face, Star } from '@mui/icons-material';

import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'DataDisplay/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compact tag/label component with optional avatar, selection, and deletion functionality. Supports keyboard navigation and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Text content displayed in the chip',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the chip',
    },
    color: {
      control: 'text',
      description: 'Theme color token',
    },
    avatarSrc: {
      control: 'text',
      description: 'Source URL for avatar image',
    },
    selected: {
      control: 'boolean',
      description: 'Current selection state',
    },
    selectable: {
      control: 'boolean',
      description: 'Enables selection toggle capability',
    },
    deletable: {
      control: 'boolean',
      description: 'Shows delete button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all interactions',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default Chip',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined Chip',
    variant: 'outlined',
  },
};

export const WithAvatar: Story = {
  args: {
    label: 'Avatar Chip',
    avatarSrc: 'https://mui.com/static/images/avatar/1.jpg',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Icon Chip',
    icon: <Face />,
  },
};

export const Selectable: Story = {
  args: {
    label: 'Selectable',
    selectable: true,
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    label: 'Selected',
    selectable: true,
    selected: true,
  },
};

export const Deletable: Story = {
  args: {
    label: 'Deletable',
    deletable: true,
    onDelete: () => {},
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const SmallSize: Story = {
  args: {
    label: 'Small',
    size: 'small',
  },
};

export const MediumSize: Story = {
  args: {
    label: 'Medium',
    size: 'medium',
  },
};

export const LargeSize: Story = {
  args: {
    label: 'Large',
    size: 'medium',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Chip label="Small" size="small" />
      <Chip label="Medium" size="medium" />
      <Chip label="Large" size="medium" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Chip label="Filled" variant="filled" />
      <Chip label="Outlined" variant="outlined" />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      <Chip label="Default" />
      <Chip label="Selected" selectable selected />
      <Chip label="Deletable" deletable onDelete={() => {}} />
      <Chip label="Disabled" disabled />
      <Chip label="With Avatar" avatarSrc="https://mui.com/static/images/avatar/1.jpg" />
      <Chip label="With Icon" icon={<Star />} />
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      <Chip label="Clickable" onClick={() => {}} />
      <Chip label="Selectable" selectable />
      <Chip label="Deletable" deletable onDelete={() => {}} />
      <Chip label="Combined" selectable deletable onClick={() => {}} onDelete={() => {}} />
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {Array.from({ length: 10 }, (_, i) => (
          <Chip key={i} label={`Tag ${i + 1}`} size="small" />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {Array.from({ length: 8 }, (_, i) => (
          <Chip key={i} label={`Category ${i + 1}`} size="medium" deletable onDelete={() => {}} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Chip key={i} label={`Filter ${i + 1}`} size="medium" selectable />
        ))}
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    label: 'This is a very long chip label that demonstrates text truncation behavior',
    deletable: true,
    onDelete: () => {},
  },
};

export const GlassEffect: Story = {
  render: () => (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        borderRadius: '12px',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Chip label="Glass Filled" variant="filled" />
        <Chip label="Glass Outlined" variant="outlined" />
        <Chip
          label="Glass Avatar"
          variant="outlined"
          avatarSrc="https://mui.com/static/images/avatar/1.jpg"
        />
        <Chip label="Glass Deletable" variant="outlined" deletable onDelete={() => {}} />
      </div>
    </div>
  ),
};
