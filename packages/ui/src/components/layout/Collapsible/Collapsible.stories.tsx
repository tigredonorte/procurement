import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Stack, 
  Box,
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
  tags: ['autodocs', 'component:Collapsible'],
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

const AllVariantsComponent = () => {
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
                The default variant uses Material-UI&apos;s built-in Collapse component
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
};

export const AllVariants: Story = {
  render: () => <AllVariantsComponent />,
};

const InteractiveExampleComponent = () => {
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
};

export const InteractiveExample: Story = {
  render: () => <InteractiveExampleComponent />,
};

const SettingsPanelComponent = () => {
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
};

export const SettingsPanel: Story = {
  render: () => <SettingsPanelComponent />,
};

const FileExplorerComponent = () => {
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
};

export const FileExplorer: Story = {
  render: () => <FileExplorerComponent />,
};

const CallbackExampleComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleToggle = (open: boolean) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`${timestamp}: Collapsible ${open ? 'opened' : 'closed'}`, ...prev.slice(0, 4)]);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">OnToggle Callback Example</Typography>
      
      <Card>
        <CollapsibleTrigger
          onClick={() => setIsOpen(!isOpen)}
          expanded={isOpen}
        >
          <Typography variant="h6">Toggle Me</Typography>
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </CollapsibleTrigger>
        <Collapsible 
          open={isOpen} 
          variant="smooth" 
          onToggle={handleToggle}
        >
          <CollapsibleContent>
            <Typography variant="body1" gutterBottom>
              This collapsible demonstrates the onToggle callback functionality.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Every time the state changes, the callback is triggered and logged below.
            </Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card>
        <CardContent sx={{ bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>Event Log</Typography>
          {logs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No events yet. Try toggling the collapsible above.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {logs.map((log, index) => (
                <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {log}
                </Typography>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export const CallbackExample: Story = {
  render: () => <CallbackExampleComponent />,
};

// Required story exports for validation
export const AllSizes: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography variant="h6">Size Variations</Typography>
      <Card>
        <CollapsibleTrigger expanded={true}>
          <Typography variant="body2">Small Content</Typography>
        </CollapsibleTrigger>
        <Collapsible open={true} variant="smooth">
          <CollapsibleContent>
            <Typography variant="body2">Small</Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      
      <Card>
        <CollapsibleTrigger expanded={true}>
          <Typography variant="h6">Medium Content</Typography>
        </CollapsibleTrigger>
        <Collapsible open={true} variant="smooth">
          <CollapsibleContent>
            <Typography variant="body1" paragraph>
              This is medium-sized content that demonstrates how the Collapsible component
              handles different content lengths. It includes multiple paragraphs and more text.
            </Typography>
            <Typography variant="body2">
              Additional content to show the component scales appropriately.
            </Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      
      <Card>
        <CollapsibleTrigger expanded={true}>
          <Typography variant="h6">Large Content</Typography>
        </CollapsibleTrigger>
        <Collapsible open={true} variant="smooth">
          <CollapsibleContent>
            <Typography variant="h6" gutterBottom>Large Content Section</Typography>
            <Typography variant="body1" paragraph>
              This demonstrates the Collapsible component with substantial content.
              The component should handle large amounts of content gracefully without
              performance degradation or animation issues.
            </Typography>
            <Typography variant="body1" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris.
            </Typography>
            <List>
              <ListItem><ListItemText primary="Feature 1" secondary="Description of feature" /></ListItem>
              <ListItem><ListItemText primary="Feature 2" secondary="Description of feature" /></ListItem>
              <ListItem><ListItemText primary="Feature 3" secondary="Description of feature" /></ListItem>
            </List>
            <Typography variant="body1" paragraph>
              More content to demonstrate the component's ability to handle large content
              areas while maintaining smooth animations and good performance.
            </Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </Stack>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography variant="h6">All Component States</Typography>
      
      <Card>
        <CollapsibleTrigger expanded={false} disabled={false}>
          <Typography variant="body1">Closed State</Typography>
          <ExpandMore />
        </CollapsibleTrigger>
        <Collapsible open={false} variant="smooth">
          <CollapsibleContent>
            <Typography>This content is collapsed</Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      
      <Card>
        <CollapsibleTrigger expanded={true} disabled={false}>
          <Typography variant="body1">Open State</Typography>
          <ExpandLess />
        </CollapsibleTrigger>
        <Collapsible open={true} variant="smooth">
          <CollapsibleContent>
            <Typography>This content is expanded and visible</Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      
      <Card>
        <CollapsibleTrigger expanded={false} disabled={true}>
          <Typography variant="body1" color="text.disabled">Disabled State</Typography>
          <ExpandMore />
        </CollapsibleTrigger>
        <Collapsible open={false} disabled={true} variant="smooth">
          <CollapsibleContent>
            <Typography>This content is disabled</Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      
      <Card>
        <CollapsibleTrigger expanded={true}>
          <Typography variant="body1">Keep Mounted</Typography>
          <ExpandLess />
        </CollapsibleTrigger>
        <Collapsible open={true} keepMounted={true} variant="smooth">
          <CollapsibleContent>
            <Typography>This content stays in DOM when collapsed (keepMounted=true)</Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </Stack>
  ),
};

export const InteractiveStates: Story = {
  render: () => <InteractiveExampleComponent />,
};

export const Responsive: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1200px', height: '800px' } },
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '100vw', padding: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Responsive Collapsible
      </Typography>
      <Card sx={{ width: '100%' }}>
        <CollapsibleTrigger expanded={true}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 1
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                wordBreak: 'break-word'
              }}
            >
              Responsive Content Section
            </Typography>
            <ExpandLess />
          </Box>
        </CollapsibleTrigger>
        <Collapsible open={true} variant="smooth">
          <CollapsibleContent>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr'
              },
              gap: { xs: 1, sm: 2, md: 3 }
            }}>
              <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Mobile: Single column layout for optimal readability on small screens.
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'secondary.50', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Tablet: Two-column layout provides good balance between content and space.
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Desktop: Three-column layout maximizes the available screen real estate.
                </Typography>
              </Box>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                textAlign: { xs: 'left', md: 'center' }
              }}
            >
              This content adapts to different screen sizes using responsive design patterns.
            </Typography>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </Box>
  ),
};