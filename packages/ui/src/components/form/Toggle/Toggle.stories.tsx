import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography } from '@mui/material';
import { 
  Bold, 
  Italic, 
  Underline,
  Heart,
  Star,
  Bookmark,
  ThumbsUp,
  Download,
  Share2,
  Settings,
  Bell,
  Moon,
  Sun,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useState } from 'react';

import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Form/Toggle',
  component: Toggle,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs', 'component:Toggle'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'soft'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Toggle Button',
    variant: 'default',
    color: 'primary',
    size: 'md',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Like',
    icon: <Heart size={16} />,
    variant: 'default',
    color: 'danger',
  },
};

export const IconOnly: Story = {
  args: {
    icon: <Star size={16} />,
    variant: 'default',
    color: 'warning',
  },
};

const VariantsComponent = () => {
const [states, setStates] = useState({
      default: false,
      outline: false,
      soft: false,
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Default</Typography>
          <Toggle
            variant="default"
            icon={<Bold size={16} />}
            selected={states.default}
            onChange={() => setStates(prev => ({ ...prev, default: !prev.default }))}
          >
            Bold Text
          </Toggle>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Outline</Typography>
          <Toggle
            variant="outline"
            color="secondary"
            icon={<Italic size={16} />}
            selected={states.outline}
            onChange={() => setStates(prev => ({ ...prev, outline: !prev.outline }))}
          >
            Italic Text
          </Toggle>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Soft</Typography>
          <Toggle
            variant="soft"
            color="success"
            icon={<Underline size={16} />}
            selected={states.soft}
            onChange={() => setStates(prev => ({ ...prev, soft: !prev.soft }))}
          >
            Underline Text
          </Toggle>
        </Box>
      </Box>
    );
};

export const Variants: Story = {
  render: () => <VariantsComponent />,
};

const ColorsComponent = () => {
const [states, setStates] = useState({
      primary: false,
      secondary: false,
      success: false,
      warning: false,
      danger: false,
      neutral: false,
    });

    const icons = {
      primary: <ThumbsUp size={16} />,
      secondary: <Share2 size={16} />,
      success: <Download size={16} />,
      warning: <Bell size={16} />,
      danger: <Heart size={16} />,
      neutral: <Settings size={16} />,
    };

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        {Object.entries(states).map(([color, selected]) => (
          <Toggle
            key={color}
            color={color}
            icon={icons[color as keyof typeof icons]}
            selected={selected}
            onChange={() => setStates(prev => ({ ...prev, [color]: !prev[color as keyof typeof prev] }))}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </Toggle>
        ))}
      </Box>
    );
};

export const Colors: Story = {
  render: () => <ColorsComponent />,
};

const SizesComponent = () => {
const [states, setStates] = useState({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
        {Object.entries(states).map(([size, selected]) => (
          <Box key={size} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ minWidth: '40px' }}>
              {size.toUpperCase()}:
            </Typography>
            <Toggle
              size={size}
              icon={<Star size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 18 : 20} />}
              selected={selected}
              onChange={() => setStates(prev => ({ ...prev, [size]: !prev[size as keyof typeof prev] }))}
            >
              Toggle {size.toUpperCase()}
            </Toggle>
          </Box>
        ))}
      </Box>
    );
};

export const Sizes: Story = {
  render: () => <SizesComponent />,
};

const SpecialEffectsComponent = () => {
const [states, setStates] = useState({
      glass: false,
      gradient: false,
      glow: false,
      combined: false,
    });

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Glass Morphism</Typography>
          <Toggle
            glass
            icon={<Moon size={16} />}
            selected={states.glass}
            onChange={() => setStates(prev => ({ ...prev, glass: !prev.glass }))}
          >
            Glass Effect
          </Toggle>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Gradient</Typography>
          <Toggle
            gradient
            color="secondary"
            icon={<Sun size={16} />}
            selected={states.gradient}
            onChange={() => setStates(prev => ({ ...prev, gradient: !prev.gradient }))}
          >
            Gradient
          </Toggle>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Glow Effect</Typography>
          <Toggle
            glow
            color="success"
            icon={<Star size={16} />}
            selected={states.glow}
            onChange={() => setStates(prev => ({ ...prev, glow: !prev.glow }))}
          >
            Glow Effect
          </Toggle>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Combined Effects</Typography>
          <Toggle
            glass
            gradient
            glow
            color="warning"
            size="lg"
            icon={<Heart size={18} />}
            selected={states.combined}
            onChange={() => setStates(prev => ({ ...prev, combined: !prev.combined }))}
          >
            All Effects
          </Toggle>
        </Box>
      </Box>
    );
};

export const SpecialEffects: Story = {
  render: () => <SpecialEffectsComponent />,
};

const ActionButtonsComponent = () => {
const [states, setStates] = useState({
      like: false,
      bookmark: false,
      share: false,
      download: false,
    });

    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Toggle
          variant="soft"
          color="danger"
          icon={<Heart size={16} />}
          selected={states.like}
          onChange={() => setStates(prev => ({ ...prev, like: !prev.like }))}
        >
          {states.like ? 'Liked' : 'Like'}
        </Toggle>
        
        <Toggle
          variant="outline"
          color="warning"
          icon={<Bookmark size={16} />}
          selected={states.bookmark}
          onChange={() => setStates(prev => ({ ...prev, bookmark: !prev.bookmark }))}
        >
          {states.bookmark ? 'Saved' : 'Save'}
        </Toggle>
        
        <Toggle
          variant="soft"
          color="secondary"
          icon={<Share2 size={16} />}
          selected={states.share}
          onChange={() => setStates(prev => ({ ...prev, share: !prev.share }))}
        >
          Share
        </Toggle>
        
        <Toggle
          variant="outline"
          color="success"
          icon={<Download size={16} />}
          selected={states.download}
          onChange={() => setStates(prev => ({ ...prev, download: !prev.download }))}
        >
          Download
        </Toggle>
      </Box>
    );
};

export const ActionButtons: Story = {
  render: () => <ActionButtonsComponent />,
};

const MediaControlsComponent = () => {
const [states, setStates] = useState({
      play: false,
      sound: true,
    });

    return (
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Toggle
          size="lg"
          color="primary"
          icon={states.play ? <Pause size={20} /> : <Play size={20} />}
          selected={states.play}
          onChange={() => setStates(prev => ({ ...prev, play: !prev.play }))}
        />
        
        <Toggle
          size="md"
          color="secondary"
          variant="soft"
          icon={states.sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
          selected={states.sound}
          onChange={() => setStates(prev => ({ ...prev, sound: !prev.sound }))}
        >
          {states.sound ? 'Mute' : 'Unmute'}
        </Toggle>
      </Box>
    );
};

export const MediaControls: Story = {
  render: () => <MediaControlsComponent />,
};

export const DisabledState: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Toggle disabled icon={<Settings size={16} />}>
        Disabled Default
      </Toggle>
      
      <Toggle disabled selected icon={<Star size={16} />} color="warning">
        Disabled Selected
      </Toggle>
      
      <Toggle disabled variant="outline" color="secondary">
        Disabled Outline
      </Toggle>
      
      <Toggle disabled variant="soft" color="success">
        Disabled Soft
      </Toggle>
    </Box>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Toggle Button',
    variant: 'default',
    color: 'primary',
    size: 'md',
    glass: false,
    gradient: false,
    glow: false,
    disabled: false,
  },
};