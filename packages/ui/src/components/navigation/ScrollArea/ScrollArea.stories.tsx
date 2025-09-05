import type { Meta, StoryObj } from '@storybook/react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { 
  Person,
  Message,
  Folder,
  Image,
  Description,
  VideoLibrary,
  MusicNote,
} from '@mui/icons-material';

import { ScrollArea } from './ScrollArea';

const meta = {
  title: 'Navigation/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable scroll area component with various scrollbar styles and behaviors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['auto', 'always', 'hover', 'hidden'],
      description: 'The scrollbar display behavior',
    },
    scrollbarColor: {
      control: 'select',
      options: ['primary', 'secondary', 'dark', 'light', 'custom'],
      description: 'Color theme for the scrollbar',
    },
    scrollbarSize: {
      control: 'select',
      options: ['thin', 'medium', 'thick'],
      description: 'Width/thickness of the scrollbar',
    },
    scrollbarRadius: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large', 'full'],
      description: 'Border radius of the scrollbar',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Direction of scrolling',
    },
    glassmorphism: {
      control: 'boolean',
      description: 'Whether scrollbars should use glassmorphism effect',
    },
    showShadows: {
      control: 'boolean',
      description: 'Whether to show shadow indicators for scrollable content',
    },
    showScrollIndicator: {
      control: 'boolean',
      description: 'Whether to show scroll position indicator',
    },
    fadeEdges: {
      control: 'boolean',
      description: 'Fade edges when content overflows',
    },
    smoothScrolling: {
      control: 'boolean',
      description: 'Whether to enable smooth scrolling',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the scroll area is disabled',
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const LongContent = () => (
  <Box sx={{ py: 2 }}>
    {Array.from({ length: 50 }, (_, i) => (
      <Typography key={i} variant="body2" sx={{ mb: 1 }}>
        Line {i + 1}: This is a long line of text that demonstrates scrolling behavior. 
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua.
      </Typography>
    ))}
  </Box>
);

const ContactsList = () => (
  <List>
    {Array.from({ length: 30 }, (_, i) => (
      <Box key={i}>
        <ListItem>
          <Avatar sx={{ mr: 2, bgcolor: `hsl(${i * 12}, 70%, 60%)` }}>
            <Person />
          </Avatar>
          <ListItemText
            primary={`Contact ${i + 1}`}
            secondary={`user${i + 1}@example.com`}
          />
        </ListItem>
        {i < 29 && <Divider />}
      </Box>
    ))}
  </List>
);

const FileList = () => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: 25 }, (_, i) => {
      const types = [
        { icon: <Folder />, name: 'Folder', color: '#FFA726' },
        { icon: <Image />, name: 'Image', color: '#66BB6A' },
        { icon: <Description />, name: 'Document', color: '#42A5F5' },
        { icon: <VideoLibrary />, name: 'Video', color: '#EF5350' },
        { icon: <MusicNote />, name: 'Audio', color: '#AB47BC' },
      ];
      const type = types[i % types.length];
      
      return (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 1,
            mb: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Box sx={{ color: type.color, mr: 2 }}>
            {type.icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {type.name} {i + 1}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Modified 2 days ago • {Math.round(Math.random() * 1000)}KB
            </Typography>
          </Box>
        </Box>
      );
    })}
  </Box>
);

const MessagesList = () => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: 40 }, (_, i) => (
      <Card key={i} sx={{ mb: 2, bgcolor: i % 3 === 0 ? 'primary.50' : 'background.paper' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
              <Message fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2">
                User {i + 1}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {i + 1} minutes ago
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2">
            This is message #{i + 1}. Lorem ipsum dolor sit amet, consectetur 
            adipiscing elit. {i % 3 === 0 && 'This is a longer message with more content to demonstrate varying heights.'}
          </Typography>
          {i % 5 === 0 && (
            <Box sx={{ mt: 1 }}>
              <Chip size="small" label="Important" color="primary" />
            </Box>
          )}
        </CardContent>
      </Card>
    ))}
  </Box>
);

export const Auto: Story = {
  args: {
    variant: 'auto',
    height: 300,
    width: 400,
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <LongContent />
      </ScrollArea>
    </Paper>
  ),
};

export const Always: Story = {
  args: {
    variant: 'always',
    height: 300,
    width: 400,
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <LongContent />
      </ScrollArea>
    </Paper>
  ),
};

export const Hover: Story = {
  args: {
    variant: 'hover',
    height: 300,
    width: 400,
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, p: 2 }}>
          Hover over this area to see the scrollbar
        </Typography>
        <LongContent />
      </ScrollArea>
    </Paper>
  ),
};

export const Hidden: Story = {
  args: {
    variant: 'hidden',
    height: 300,
    width: 400,
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, p: 2 }}>
          Scrollable content with hidden scrollbars
        </Typography>
        <LongContent />
      </ScrollArea>
    </Paper>
  ),
};

export const WithGlassmorphism: Story = {
  args: {
    variant: 'always',
    height: 350,
    width: 400,
    glassmorphism: true,
    scrollbarColor: 'primary',
  },
  render: (args) => (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 2,
        p: 3,
      }}
    >
      <Paper elevation={8} sx={{ height: args.height, width: args.width, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <ScrollArea {...args}>
          <ContactsList />
        </ScrollArea>
      </Paper>
    </Box>
  ),
};

export const WithShadows: Story = {
  args: {
    variant: 'auto',
    height: 300,
    width: 450,
    showShadows: true,
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <FileList />
      </ScrollArea>
    </Paper>
  ),
};

export const WithScrollIndicator: Story = {
  args: {
    variant: 'hidden',
    height: 400,
    width: 350,
    showScrollIndicator: true,
    scrollbarColor: 'primary',
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <MessagesList />
      </ScrollArea>
    </Paper>
  ),
};

export const WithFadeEdges: Story = {
  args: {
    variant: 'hidden',
    height: 300,
    width: 400,
    fadeEdges: true,
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <LongContent />
      </ScrollArea>
    </Paper>
  ),
};

export const ThinScrollbar: Story = {
  args: {
    variant: 'always',
    height: 300,
    width: 400,
    scrollbarSize: 'thin',
    scrollbarColor: 'secondary',
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <ContactsList />
      </ScrollArea>
    </Paper>
  ),
};

export const ThickScrollbar: Story = {
  args: {
    variant: 'always',
    height: 300,
    width: 400,
    scrollbarSize: 'thick',
    scrollbarColor: 'dark',
    scrollbarRadius: 'large',
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <FileList />
      </ScrollArea>
    </Paper>
  ),
};

export const HorizontalScrolling: Story = {
  args: {
    variant: 'always',
    width: 400,
    height: 150,
    orientation: 'horizontal',
  },
  render: (args) => (
    <Paper elevation={2} sx={{ width: args.width, height: args.height }}>
      <ScrollArea {...args}>
        <Box sx={{ display: 'flex', gap: 2, p: 2, width: 800 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <Card key={i} sx={{ minWidth: 150, height: 100 }}>
              <CardContent>
                <Typography variant="h6">Card {i + 1}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Content for card {i + 1}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ScrollArea>
    </Paper>
  ),
};

export const CustomScrollbarColor: Story = {
  args: {
    variant: 'always',
    height: 300,
    width: 400,
    scrollbarColor: 'custom',
    customScrollbarColor: '#FF6B6B',
    scrollbarRadius: 'full',
  },
  render: (args) => (
    <Paper elevation={2} sx={{ height: args.height, width: args.width }}>
      <ScrollArea {...args}>
        <LongContent />
      </ScrollArea>
    </Paper>
  ),
};

export const ChatInterface: Story = {
  render: () => (
    <Box sx={{ display: 'flex', height: 500, width: 600, border: 1, borderColor: 'divider', borderRadius: 2 }}>
      {/* Sidebar */}
      <Box sx={{ width: 200, borderRight: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Contacts
        </Typography>
        <ScrollArea variant="hover" height={436} scrollbarSize="thin">
          <ContactsList />
        </ScrollArea>
      </Box>
      
      {/* Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Messages
        </Typography>
        <ScrollArea 
          variant="auto" 
          height={436} 
          showScrollIndicator 
          fadeEdges
          onScrollEnd={(direction) => {
            if (direction === 'top') {
              
            }
          }}
        >
          <MessagesList />
        </ScrollArea>
      </Box>
    </Box>
  ),
};

export const FileExplorer: Story = {
  render: () => (
    <Box sx={{ display: 'flex', height: 450, width: 700, border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* File Tree */}
      <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          Folders
        </Typography>
        <ScrollArea variant="hover" height={417} scrollbarSize="thin" showShadows>
          <List dense>
            {Array.from({ length: 30 }, (_, i) => (
              <ListItem key={i} sx={{ pl: (i % 3) * 2 + 1 }}>
                <Folder sx={{ mr: 1, color: 'warning.main' }} fontSize="small" />
                <ListItemText 
                  primary={`Folder ${i + 1}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </ScrollArea>
      </Box>
      
      {/* File List */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Files
        </Typography>
        <ScrollArea variant="auto" height={417} glassmorphism scrollbarColor="primary">
          <FileList />
        </ScrollArea>
      </Box>
    </Box>
  ),
};

export const VariantsComparison: Story = {
  render: () => (
    <Grid container spacing={3} sx={{ width: 800 }}>
      {[
        { title: 'Auto', variant: 'auto' },
        { title: 'Always', variant: 'always' },
        { title: 'Hover', variant: 'hover' },
        { title: 'Hidden', variant: 'hidden' },
      ].map(({ title, variant }) => (
        <Grid item xs={6} key={variant}>
          <Paper elevation={2}>
            <Typography variant="subtitle2" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              {title}
            </Typography>
            <ScrollArea variant={variant as any} height={200}>
              <Box sx={{ p: 2 }}>
                {Array.from({ length: 20 }, (_, i) => (
                  <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                    Line {i + 1}: {variant} scrollbar behavior
                  </Typography>
                ))}
              </Box>
            </ScrollArea>
          </Paper>
        </Grid>
      ))}
    </Grid>
  ),
};