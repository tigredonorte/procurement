import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Stack, 
  Box, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  Settings, 
  Notifications, 
  Security,
  Help,
  Star,
  Folder,
  Description,
  Image,
  VideoLibrary
} from '@mui/icons-material';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

const meta = {
  title: 'Layout/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'smooth', 'spring'],
    },
    duration: {
      control: { type: 'number' },
      min: 100,
      max: 1000,
      step: 50,
    },
    keepMounted: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    variant: 'default',
    duration: 300,
    keepMounted: false,
  },
  render: (args) => (
    <Collapsible {...args}>
      <Box sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Collapsible Content
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This content can be collapsed and expanded. The animation behavior
          depends on the variant prop selected.
        </Typography>
      </Box>
    </Collapsible>
  ),
};

export const AllVariants: Story = {
  render: () => {
    const [openStates, setOpenStates] = useState({
      default: false,
      smooth: false,
      spring: false,
    });

    const toggleOpen = (variant: keyof typeof openStates) => {
      setOpenStates(prev => ({
        ...prev,
        [variant]: !prev[variant],
      }));
    };

    return (
      <Stack spacing={3}>
        <Card>
          <CollapsibleTrigger
            onClick={() => toggleOpen('default')}
            expanded={openStates.default}
          >
            <Typography variant="h6">Default Variant</Typography>
            {openStates.default ? <ExpandLess /> : <ExpandMore />}
          </CollapsibleTrigger>
          <Collapsible open={openStates.default} variant="default">
            <CollapsibleContent>
              <Typography variant="body2" color="text.secondary">
                The default variant uses Material-UI's built-in Collapse component
                with standard easing and timing. It provides reliable, accessible
                animation behavior.
              </Typography>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card>
          <CollapsibleTrigger
            onClick={() => toggleOpen('smooth')}
            expanded={openStates.smooth}
          >
            <Typography variant="h6">Smooth Variant</Typography>
            {openStates.smooth ? <ExpandLess /> : <ExpandMore />}
          </CollapsibleTrigger>
          <Collapsible open={openStates.smooth} variant="smooth">
            <CollapsibleContent>
              <Typography variant="body2" color="text.secondary">
                The smooth variant provides a more refined animation with custom
                easing curves. It offers a more polished, professional feel with
                smoother transitions.
              </Typography>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card>
          <CollapsibleTrigger
            onClick={() => toggleOpen('spring')}
            expanded={openStates.spring}
          >
            <Typography variant="h6">Spring Variant</Typography>
            {openStates.spring ? <ExpandLess /> : <ExpandMore />}
          </CollapsibleTrigger>
          <Collapsible open={openStates.spring} variant="spring">
            <CollapsibleContent>
              <Typography variant="body2" color="text.secondary">
                The spring variant uses elastic easing to create a bouncy,
                playful animation effect. Perfect for applications that want
                to add character and delight to their interactions.
              </Typography>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </Stack>
    );
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [variant, setVariant] = useState<'default' | 'smooth' | 'spring'>('smooth');
    const [duration, setDuration] = useState(300);

    return (
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Interactive Controls
          </Typography>
          <Stack direction="row" spacing={2} mb={2}>
            <Button 
              variant={variant === 'default' ? 'contained' : 'outlined'}
              onClick={() => setVariant('default')}
              size="small"
            >
              Default
            </Button>
            <Button 
              variant={variant === 'smooth' ? 'contained' : 'outlined'}
              onClick={() => setVariant('smooth')}
              size="small"
            >
              Smooth
            </Button>
            <Button 
              variant={variant === 'spring' ? 'contained' : 'outlined'}
              onClick={() => setVariant('spring')}
              size="small"
            >
              Spring
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">Duration: {duration}ms</Typography>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{ width: 200 }}
            />
          </Stack>
        </Box>

        <Card>
          <CollapsibleTrigger
            onClick={() => setIsOpen(!isOpen)}
            expanded={isOpen}
          >
            <Typography variant="h6">Test the Animation</Typography>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </CollapsibleTrigger>
          <Collapsible open={isOpen} variant={variant} duration={duration}>
            <CollapsibleContent>
              <Typography variant="body1" gutterBottom>
                Dynamic Animation Testing
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Current settings: {variant} variant with {duration}ms duration.
                Try different combinations to see how the animation behavior changes.
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  This content area demonstrates how different variants and durations
                  affect the collapse animation. The spring variant adds bounce,
                  smooth provides refined easing, and default uses standard timing.
                </Typography>
              </Box>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </Stack>
    );
  },
};

export const SettingsPanel: Story = {
  render: () => {
    const [openSections, setOpenSections] = useState({
      general: false,
      notifications: false,
      security: false,
      help: false,
    });

    const toggleSection = (section: keyof typeof openSections) => {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    const SettingsSection = ({ 
      id, 
      icon, 
      title, 
      children 
    }: { 
      id: keyof typeof openSections; 
      icon: React.ReactNode; 
      title: string; 
      children: React.ReactNode;
    }) => (
      <Card sx={{ mb: 1 }}>
        <CollapsibleTrigger
          onClick={() => toggleSection(id)}
          expanded={openSections[id]}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Box>
          {openSections[id] ? <ExpandLess /> : <ExpandMore />}
        </CollapsibleTrigger>
        <Collapsible open={openSections[id]} variant="smooth">
          <CollapsibleContent>
            {children}
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );

    return (
      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom>
          Settings Panel
        </Typography>
        
        <SettingsSection id="general" icon={<Settings />} title="General Settings">
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Configure general application preferences
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Button variant="outlined" size="small">Language</Button>
              <Button variant="outlined" size="small">Theme</Button>
              <Button variant="outlined" size="small">Time Zone</Button>
              <Button variant="outlined" size="small">Format</Button>
            </Box>
          </Stack>
        </SettingsSection>

        <SettingsSection id="notifications" icon={<Notifications />} title="Notifications">
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Manage your notification preferences
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Email notifications" secondary="Receive updates via email" />
                <Button size="small">Configure</Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Push notifications" secondary="Browser and mobile notifications" />
                <Button size="small">Configure</Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="SMS notifications" secondary="Text message alerts" />
                <Button size="small">Configure</Button>
              </ListItem>
            </List>
          </Stack>
        </SettingsSection>

        <SettingsSection id="security" icon={<Security />} title="Security & Privacy">
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Manage your security settings and privacy options
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="contained" size="small" sx={{ alignSelf: 'flex-start' }}>
                Change Password
              </Button>
              <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
                Two-Factor Authentication
              </Button>
              <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
                Privacy Settings
              </Button>
            </Box>
          </Stack>
        </SettingsSection>

        <SettingsSection id="help" icon={<Help />} title="Help & Support">
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Get help and support resources
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Star fontSize="small" /></ListItemIcon>
                <ListItemText primary="User Guide" secondary="Learn how to use the application" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Help fontSize="small" /></ListItemIcon>
                <ListItemText primary="FAQ" secondary="Frequently asked questions" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                <ListItemText primary="Contact Support" secondary="Get help from our team" />
              </ListItem>
            </List>
          </Stack>
        </SettingsSection>
      </Box>
    );
  },
};

export const FileExplorer: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
      documents: false,
      images: false,
      videos: false,
    });

    const toggle = (folder: string) => {
      setExpanded(prev => ({
        ...prev,
        [folder]: !prev[folder],
      }));
    };

    return (
      <Box sx={{ maxWidth: 400, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          File Explorer
        </Typography>
        
        <List component="nav" dense>
          <ListItem>
            <CollapsibleTrigger onClick={() => toggle('documents')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Folder color={expanded.documents ? 'primary' : 'action'} />
                <Typography>Documents</Typography>
              </Box>
              {expanded.documents ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
          </ListItem>
          <Collapsible open={expanded.documents} variant="spring">
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem>
                <ListItemIcon><Description fontSize="small" /></ListItemIcon>
                <ListItemText primary="Report.pdf" secondary="2.1 MB" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Description fontSize="small" /></ListItemIcon>
                <ListItemText primary="Presentation.pptx" secondary="5.3 MB" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Description fontSize="small" /></ListItemIcon>
                <ListItemText primary="Spreadsheet.xlsx" secondary="1.8 MB" />
              </ListItem>
            </List>
          </Collapsible>

          <ListItem>
            <CollapsibleTrigger onClick={() => toggle('images')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Folder color={expanded.images ? 'primary' : 'action'} />
                <Typography>Images</Typography>
              </Box>
              {expanded.images ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
          </ListItem>
          <Collapsible open={expanded.images} variant="spring">
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem>
                <ListItemIcon><Image fontSize="small" /></ListItemIcon>
                <ListItemText primary="photo1.jpg" secondary="3.2 MB" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Image fontSize="small" /></ListItemIcon>
                <ListItemText primary="photo2.jpg" secondary="2.8 MB" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Image fontSize="small" /></ListItemIcon>
                <ListItemText primary="screenshot.png" secondary="1.1 MB" />
              </ListItem>
            </List>
          </Collapsible>

          <ListItem>
            <CollapsibleTrigger onClick={() => toggle('videos')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Folder color={expanded.videos ? 'primary' : 'action'} />
                <Typography>Videos</Typography>
              </Box>
              {expanded.videos ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
          </ListItem>
          <Collapsible open={expanded.videos} variant="spring">
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem>
                <ListItemIcon><VideoLibrary fontSize="small" /></ListItemIcon>
                <ListItemText primary="tutorial.mp4" secondary="15.7 MB" />
              </ListItem>
              <ListItem>
                <ListItemIcon><VideoLibrary fontSize="small" /></ListItemIcon>
                <ListItemText primary="demo.mov" secondary="8.3 MB" />
              </ListItem>
            </List>
          </Collapsible>
        </List>
      </Box>
    );
  },
};