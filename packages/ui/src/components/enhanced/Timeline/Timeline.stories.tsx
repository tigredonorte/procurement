import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography, Paper, Chip, Avatar } from '@mui/material';
import {
  CheckCircle,
  Schedule,
  LocalShipping,
  Payment,
  Inventory,
  Person,
  Flag,
  Star,
  Warning,
  Error,
} from '@mui/icons-material';
import React from 'react';

import { Timeline } from './Timeline';

const meta = {
  title: 'Enhanced/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A beautiful timeline component for displaying chronological events, processes, and historical data with various styles and animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'alternate', 'opposite', 'grouped'],
      description: 'Timeline layout variant',
    },
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Timeline orientation',
    },
    connectorStyle: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted', 'gradient'],
      description: 'Connector line style',
    },
    animated: {
      control: 'boolean',
      description: 'Enable animations',
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const orderEvents = [
  {
    id: '1',
    title: 'Order Placed',
    description: 'Your order has been successfully placed',
    time: '2024-01-15 10:30 AM',
    icon: <CheckCircle />,
    color: 'success' as const,
  },
  {
    id: '2',
    title: 'Payment Confirmed',
    description: 'Payment has been processed successfully',
    time: '2024-01-15 10:35 AM',
    icon: <Payment />,
    color: 'success' as const,
  },
  {
    id: '3',
    title: 'Order Processing',
    description: 'Your order is being prepared',
    time: '2024-01-15 2:00 PM',
    icon: <Inventory />,
    color: 'info' as const,
  },
  {
    id: '4',
    title: 'Shipped',
    description: 'Your order has been shipped',
    time: '2024-01-16 9:00 AM',
    icon: <LocalShipping />,
    color: 'primary' as const,
  },
  {
    id: '5',
    title: 'Out for Delivery',
    description: 'Your package is out for delivery',
    time: '2024-01-17 8:00 AM',
    icon: <Schedule />,
    color: 'warning' as const,
    active: true,
  },
];

export const Default: Story = {
  args: {
    items: orderEvents,
    variant: 'default',
    orientation: 'vertical',
  },
};

export const AlternateLayout: Story = {
  args: {
    items: orderEvents,
    variant: 'alternate',
    orientation: 'vertical',
    animated: true,
  },
};

export const ProjectMilestones: Story = {
  render: () => {
    const milestones = [
      {
        id: '1',
        title: 'Project Kickoff',
        description: 'Initial planning and team assembly',
        time: 'Jan 1, 2024',
        icon: <Flag />,
        color: 'primary' as const,
        metadata: { team: 'All Teams', status: 'Completed' },
      },
      {
        id: '2',
        title: 'Design Phase',
        description: 'UI/UX design and prototyping',
        time: 'Jan 15, 2024',
        icon: <Star />,
        color: 'secondary' as const,
        metadata: { team: 'Design Team', status: 'Completed' },
      },
      {
        id: '3',
        title: 'Development Sprint 1',
        description: 'Core features implementation',
        time: 'Feb 1, 2024',
        icon: <CheckCircle />,
        color: 'success' as const,
        metadata: { team: 'Dev Team', status: 'Completed' },
      },
      {
        id: '4',
        title: 'Testing Phase',
        description: 'QA and bug fixes',
        time: 'Mar 1, 2024',
        icon: <Warning />,
        color: 'warning' as const,
        metadata: { team: 'QA Team', status: 'In Progress' },
        active: true,
      },
      {
        id: '5',
        title: 'Launch',
        description: 'Product release to production',
        time: 'Apr 1, 2024',
        icon: <Flag />,
        color: 'default' as const,
        metadata: { team: 'All Teams', status: 'Pending' },
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Project Timeline</Typography>
        <Timeline
          items={milestones}
          variant="opposite"
          orientation="vertical"
          animated
          renderContent={(item) => (
            <Box>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              {item.metadata && (
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip label={item.metadata.team} size="small" />
                  <Chip 
                    label={item.metadata.status} 
                    size="small"
                    color={item.metadata.status === 'Completed' ? 'success' : 
                           item.metadata.status === 'In Progress' ? 'warning' : 'default'}
                  />
                </Stack>
              )}
            </Box>
          )}
        />
      </Stack>
    );
  },
};

export const UserActivity: Story = {
  render: () => {
    const activities = [
      {
        id: '1',
        title: 'John commented',
        description: '"Great work on this feature!"',
        time: '2 hours ago',
        icon: <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>,
        color: 'primary' as const,
      },
      {
        id: '2',
        title: 'Sarah uploaded a file',
        description: 'design-mockup-v2.fig',
        time: '3 hours ago',
        icon: <Avatar sx={{ width: 32, height: 32 }}>SJ</Avatar>,
        color: 'secondary' as const,
      },
      {
        id: '3',
        title: 'System update',
        description: 'Database maintenance completed',
        time: '5 hours ago',
        icon: <Warning />,
        color: 'warning' as const,
      },
      {
        id: '4',
        title: 'Mike completed task',
        description: 'API integration finished',
        time: '1 day ago',
        icon: <Avatar sx={{ width: 32, height: 32 }}>MT</Avatar>,
        color: 'success' as const,
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Recent Activity</Typography>
        <Timeline
          items={activities}
          variant="default"
          orientation="vertical"
          connectorStyle="dotted"
        />
      </Stack>
    );
  },
};

export const HorizontalTimeline: Story = {
  render: () => {
    const events = [
      {
        id: '1',
        title: '2020',
        description: 'Company Founded',
        icon: <Flag />,
        color: 'primary' as const,
      },
      {
        id: '2',
        title: '2021',
        description: 'Series A Funding',
        icon: <Star />,
        color: 'success' as const,
      },
      {
        id: '3',
        title: '2022',
        description: 'International Expansion',
        icon: <CheckCircle />,
        color: 'info' as const,
      },
      {
        id: '4',
        title: '2023',
        description: '1M Users Milestone',
        icon: <Person />,
        color: 'warning' as const,
      },
      {
        id: '5',
        title: '2024',
        description: 'IPO Launch',
        icon: <Flag />,
        color: 'error' as const,
        active: true,
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Company History</Typography>
        <Box sx={{ overflowX: 'auto', pb: 2 }}>
          <Timeline
            items={events}
            orientation="horizontal"
            variant="default"
            animated
          />
        </Box>
      </Stack>
    );
  },
};

const ProcessFlowComponent = () => {
const [currentStep, setCurrentStep] = React.useState(2);
    
    const processSteps = [
      {
        id: '1',
        title: 'Requirements',
        description: 'Gather and analyze requirements',
        icon: <CheckCircle />,
        color: 'success' as const,
      },
      {
        id: '2',
        title: 'Design',
        description: 'Create system architecture',
        icon: <CheckCircle />,
        color: 'success' as const,
      },
      {
        id: '3',
        title: 'Development',
        description: 'Implement features',
        icon: <Schedule />,
        color: 'primary' as const,
        active: true,
      },
      {
        id: '4',
        title: 'Testing',
        description: 'QA and validation',
        icon: <Schedule />,
        color: 'default' as const,
      },
      {
        id: '5',
        title: 'Deployment',
        description: 'Release to production',
        icon: <Schedule />,
        color: 'default' as const,
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Development Process</Typography>
        <Timeline
          items={processSteps.map((step, index) => ({
            ...step,
            active: index === currentStep,
            color: index < currentStep ? 'success' : 
                   index === currentStep ? 'primary' : 'default',
          }))}
          variant="default"
          orientation="vertical"
          connectorStyle="gradient"
        />
        <Stack direction="row" spacing={2}>
          <button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4}
          >
            Next
          </button>
        </Stack>
      </Stack>
    );
};

export const ProcessFlow: Story = {
  render: () => <ProcessFlowComponent />,
};

export const ErrorStates: Story = {
  render: () => {
    const incidents = [
      {
        id: '1',
        title: 'Service Started',
        description: 'All systems operational',
        time: '00:00',
        icon: <CheckCircle />,
        color: 'success' as const,
      },
      {
        id: '2',
        title: 'Warning Detected',
        description: 'High memory usage detected',
        time: '02:15',
        icon: <Warning />,
        color: 'warning' as const,
      },
      {
        id: '3',
        title: 'Error Occurred',
        description: 'Database connection failed',
        time: '02:45',
        icon: <Error />,
        color: 'error' as const,
      },
      {
        id: '4',
        title: 'Recovery Started',
        description: 'Automatic recovery initiated',
        time: '02:50',
        icon: <Schedule />,
        color: 'info' as const,
      },
      {
        id: '5',
        title: 'Service Restored',
        description: 'All systems back online',
        time: '03:00',
        icon: <CheckCircle />,
        color: 'success' as const,
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Incident Timeline</Typography>
        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Timeline
            items={incidents}
            variant="alternate"
            orientation="vertical"
            animated
          />
        </Paper>
      </Stack>
    );
  },
};

export const CustomContent: Story = {
  render: () => {
    const releases = [
      {
        id: '1',
        title: 'Version 1.0',
        version: '1.0.0',
        date: 'Jan 2024',
        features: ['Initial release', 'Core features', 'Basic UI'],
        breaking: false,
      },
      {
        id: '2',
        title: 'Version 1.1',
        version: '1.1.0',
        date: 'Feb 2024',
        features: ['Performance improvements', 'Bug fixes', 'New API endpoints'],
        breaking: false,
      },
      {
        id: '3',
        title: 'Version 2.0',
        version: '2.0.0',
        date: 'Mar 2024',
        features: ['Complete redesign', 'New architecture', 'Breaking changes'],
        breaking: true,
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Release History</Typography>
        <Timeline
          items={releases.map(release => ({
            id: release.id,
            title: release.title,
            time: release.date,
            icon: release.breaking ? <Warning /> : <CheckCircle />,
            color: release.breaking ? 'error' : 'success',
          }))}
          variant="opposite"
          renderContent={(item) => {
            const release = releases.find(r => r.id === item.id);
            return (
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Typography variant="h6">{release?.title}</Typography>
                  <Chip 
                    label={release?.version} 
                    size="small"
                    color={release?.breaking ? 'error' : 'default'}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {release?.date}
                </Typography>
                <Box mt={1}>
                  {release?.features.map((feature, idx) => (
                    <Typography key={idx} variant="body2">
                      • {feature}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            );
          }}
        />
      </Stack>
    );
  },
};