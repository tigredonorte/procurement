import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography, Paper, Button, Card, CardContent, TextField } from '@mui/material';
import React from 'react';

import { TutorialOverlay } from './TutorialOverlay';

const meta = {
  title: 'Enhanced/TutorialOverlay',
  component: TutorialOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An interactive tutorial overlay component for creating product tours, onboarding flows, and feature highlights.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['tooltip', 'modal', 'highlight', 'spotlight'],
      description: 'Tutorial overlay style',
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right', 'center'],
      description: 'Position relative to target',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show progress indicator',
    },
    allowSkip: {
      control: 'boolean',
      description: 'Allow users to skip tutorial',
    },
    animated: {
      control: 'boolean',
      description: 'Enable animations',
    },
  },
} satisfies Meta<typeof TutorialOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

const tutorialSteps = [
  {
    id: '1',
    target: '#welcome-card',
    title: 'Welcome to the Dashboard',
    content: 'This is your main dashboard where you can see all important metrics.',
    position: 'bottom' as const,
  },
  {
    id: '2',
    target: '#search-input',
    title: 'Search Functionality',
    content: 'Use this search bar to quickly find what you need.',
    position: 'bottom' as const,
  },
  {
    id: '3',
    target: '#notifications',
    title: 'Notifications',
    content: 'Stay updated with real-time notifications here.',
    position: 'left' as const,
  },
  {
    id: '4',
    target: '#profile-menu',
    title: 'Profile Settings',
    content: 'Access your profile and account settings from this menu.',
    position: 'left' as const,
  },
];

const DefaultComponent = () => {
const [showTutorial, setShowTutorial] = React.useState(false);

    return (
      <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Stack spacing={3}>
          <Button 
            variant="contained" 
            onClick={() => setShowTutorial(true)}
            sx={{ alignSelf: 'flex-start' }}
          >
            Start Tutorial
          </Button>

          <Card id="welcome-card">
            <CardContent>
              <Typography variant="h5">Dashboard</Typography>
              <Typography>Welcome to your personalized dashboard</Typography>
            </CardContent>
          </Card>

          <Stack direction="row" spacing={2}>
            <TextField
              id="search-input"
              label="Search"
              variant="outlined"
              fullWidth
              placeholder="Search for anything..."
            />
            <Button id="notifications" variant="outlined">
              Notifications (3)
            </Button>
            <Button id="profile-menu" variant="outlined">
              Profile
            </Button>
          </Stack>
        </Stack>

        {showTutorial && (
          <TutorialOverlay
            steps={tutorialSteps}
            onComplete={() => setShowTutorial(false)}
            onSkip={() => setShowTutorial(false)}
            variant="spotlight"
            showProgress={true}
            allowSkip={true}
            animated={true}
          />
        )}
      </Box>
    );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};

const OnboardingFlowComponent = () => {
const [startOnboarding, setStartOnboarding] = React.useState(false);
    
    const onboardingSteps = [
      {
        id: '1',
        target: '#create-project',
        title: 'Create Your First Project',
        content: 'Click here to create your first project and get started.',
        action: 'Click to Continue',
      },
      {
        id: '2',
        target: '#invite-team',
        title: 'Invite Team Members',
        content: 'Collaborate with your team by inviting them to your project.',
        action: 'Next',
      },
      {
        id: '3',
        target: '#customize',
        title: 'Customize Your Workspace',
        content: 'Make it yours! Customize themes, layouts, and preferences.',
        action: 'Next',
      },
      {
        id: '4',
        target: '#explore',
        title: 'Explore Features',
        content: 'Discover all the powerful features available to you.',
        action: 'Finish',
      },
    ];

    return (
      <Box sx={{ p: 4, minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Workspace
        </Typography>
        
        {!startOnboarding && (
          <Button 
            variant="contained" 
            size="large"
            onClick={() => setStartOnboarding(true)}
          >
            Begin Onboarding
          </Button>
        )}

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mt={4}>
          <Paper id="create-project" sx={{ p: 3 }}>
            <Typography variant="h6">Create Project</Typography>
            <Typography variant="body2" color="text.secondary">
              Start a new project from scratch or use a template
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              New Project
            </Button>
          </Paper>

          <Paper id="invite-team" sx={{ p: 3 }}>
            <Typography variant="h6">Team Members</Typography>
            <Typography variant="body2" color="text.secondary">
              Invite colleagues to collaborate
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Invite People
            </Button>
          </Paper>

          <Paper id="customize" sx={{ p: 3 }}>
            <Typography variant="h6">Customize</Typography>
            <Typography variant="body2" color="text.secondary">
              Personalize your workspace
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Settings
            </Button>
          </Paper>

          <Paper id="explore" sx={{ p: 3 }}>
            <Typography variant="h6">Explore</Typography>
            <Typography variant="body2" color="text.secondary">
              Discover all features
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              View All
            </Button>
          </Paper>
        </Box>

        {startOnboarding && (
          <TutorialOverlay
            steps={onboardingSteps}
            onComplete={() => {
              setStartOnboarding(false);
              alert('Onboarding completed!');
            }}
            variant="highlight"
            showProgress={true}
            allowSkip={true}
          />
        )}
      </Box>
    );
};

export const OnboardingFlow: Story = {
  render: () => <OnboardingFlowComponent />,
};

const FeatureHighlightComponent = () => {
const [highlightFeature, setHighlightFeature] = React.useState<string | null>(null);
    
    const features = {
      analytics: [
        {
          id: '1',
          target: '#chart',
          title: 'Interactive Charts',
          content: 'Click and drag to zoom, double-click to reset.',
        },
        {
          id: '2',
          target: '#filters',
          title: 'Advanced Filters',
          content: 'Filter data by date, category, or custom criteria.',
        },
      ],
      collaboration: [
        {
          id: '1',
          target: '#comments',
          title: 'Real-time Comments',
          content: 'Leave comments and get instant notifications.',
        },
        {
          id: '2',
          target: '#share',
          title: 'Share & Export',
          content: 'Share reports with your team or export to PDF.',
        },
      ],
    };

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Feature Highlights
        </Typography>
        
        <Stack direction="row" spacing={2} mb={3}>
          <Button 
            variant="outlined"
            onClick={() => setHighlightFeature('analytics')}
          >
            Show Analytics Features
          </Button>
          <Button 
            variant="outlined"
            onClick={() => setHighlightFeature('collaboration')}
          >
            Show Collaboration Features
          </Button>
        </Stack>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
          <Paper id="chart" sx={{ p: 3, height: 200 }}>
            <Typography variant="h6">Analytics Chart</Typography>
            <Box sx={{ bgcolor: 'primary.light', height: 100, mt: 2, borderRadius: 1 }} />
          </Paper>

          <Paper id="filters" sx={{ p: 3 }}>
            <Typography variant="h6">Filters</Typography>
            <Stack spacing={1} mt={2}>
              <Button size="small" variant="outlined">Date Range</Button>
              <Button size="small" variant="outlined">Category</Button>
            </Stack>
          </Paper>

          <Paper id="comments" sx={{ p: 3 }}>
            <Typography variant="h6">Comments</Typography>
            <Typography variant="body2" color="text.secondary">
              3 new comments
            </Typography>
          </Paper>

          <Paper id="share" sx={{ p: 3 }}>
            <Typography variant="h6">Share Options</Typography>
            <Stack direction="row" spacing={1} mt={2}>
              <Button size="small">Email</Button>
              <Button size="small">Link</Button>
              <Button size="small">PDF</Button>
            </Stack>
          </Paper>
        </Box>

        {highlightFeature && (
          <TutorialOverlay
            steps={features[highlightFeature as keyof typeof features]}
            onComplete={() => setHighlightFeature(null)}
            variant="tooltip"
            showProgress={true}
            animated={true}
          />
        )}
      </Box>
    );
};

export const FeatureHighlight: Story = {
  render: () => <FeatureHighlightComponent />,
};

const InteractiveTourComponent = () => {
const [tourActive, setTourActive] = React.useState(false);
    const [completedSteps, setCompletedSteps] = React.useState<string[]>([]);

    const interactiveSteps = [
      {
        id: 'step1',
        target: '#input1',
        title: 'Enter Your Name',
        content: 'Type your name in this field to personalize your experience.',
        requiresAction: true,
      },
      {
        id: 'step2',
        target: '#toggle1',
        title: 'Enable Notifications',
        content: 'Toggle this switch to receive important updates.',
        requiresAction: true,
      },
      {
        id: 'step3',
        target: '#select1',
        title: 'Choose Your Preference',
        content: 'Select your preferred option from the dropdown.',
        requiresAction: true,
      },
    ];

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Interactive Tutorial
        </Typography>
        
        <Button 
          variant="contained"
          onClick={() => setTourActive(true)}
          sx={{ mb: 3 }}
        >
          Start Interactive Tour
        </Button>

        <Stack spacing={3}>
          <TextField
            id="input1"
            label="Your Name"
            variant="outlined"
            disabled={!tourActive}
          />

          <Box id="toggle1">
            <label>
              <input type="checkbox" disabled={!tourActive} />
              {' '}Enable Notifications
            </label>
          </Box>

          <Box id="select1">
            <select disabled={!tourActive} style={{ padding: '8px' }}>
              <option>Choose an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </Box>
        </Stack>

        {completedSteps.length > 0 && (
          <Paper sx={{ p: 2, mt: 3, bgcolor: 'success.light' }}>
            <Typography variant="subtitle2">
              Completed: {completedSteps.join(', ')}
            </Typography>
          </Paper>
        )}

        {tourActive && (
          <TutorialOverlay
            steps={interactiveSteps}
            onComplete={() => {
              setTourActive(false);
              alert('Tutorial completed successfully!');
            }}
            onStepComplete={(stepId) => {
              setCompletedSteps([...completedSteps, stepId]);
            }}
            variant="spotlight"
            showProgress={true}
          />
        )}
      </Box>
    );
};

export const InteractiveTour: Story = {
  render: () => <InteractiveTourComponent />,
};

const CustomStylingComponent = () => {
const [activeVariant, setActiveVariant] = React.useState<'tooltip' | 'modal' | 'highlight' | 'spotlight'>('tooltip');

    const demoSteps = [
      {
        id: '1',
        target: '#demo-element',
        title: `${activeVariant} Style`,
        content: `This is how the ${activeVariant} variant looks. Each variant provides a different visual experience.`,
      },
    ];

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tutorial Overlay Variants
        </Typography>
        
        <Stack direction="row" spacing={2} mb={4}>
          {(['tooltip', 'modal', 'highlight', 'spotlight'] as const).map((variant) => (
            <Button
              key={variant}
              variant={activeVariant === variant ? 'contained' : 'outlined'}
              onClick={() => setActiveVariant(variant)}
            >
              {variant}
            </Button>
          ))}
        </Stack>

        <Box 
          id="demo-element"
          sx={{ 
            p: 4, 
            bgcolor: 'primary.main', 
            color: 'white',
            borderRadius: 2,
            textAlign: 'center',
            width: 300,
            mx: 'auto',
          }}
        >
          <Typography variant="h6">Target Element</Typography>
          <Typography>This element will be highlighted</Typography>
        </Box>

        <TutorialOverlay
          steps={demoSteps}
          variant={activeVariant}
          onComplete={() => { /** do nothing */}}
          showProgress={false}
          animated={true}
        />
      </Box>
    );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingComponent />,
};