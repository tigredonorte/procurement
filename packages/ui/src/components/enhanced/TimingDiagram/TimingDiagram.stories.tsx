import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography, Paper, Chip, Button } from '@mui/material';
import React from 'react';

import { TimingDiagram } from './TimingDiagram';

const meta = {
  title: 'Enhanced/TimingDiagram',
  component: TimingDiagram,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A Gantt-style timing diagram component for visualizing schedules, project timelines, and resource allocation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed', 'resource'],
      description: 'Display variant',
    },
    showGrid: {
      control: 'boolean',
      description: 'Show background grid',
    },
    showToday: {
      control: 'boolean',
      description: 'Highlight current date',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive features',
    },
    zoom: {
      control: { type: 'select' },
      options: ['day', 'week', 'month', 'quarter', 'year'],
      description: 'Time scale zoom level',
    },
  },
} satisfies Meta<typeof TimingDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

const projectTasks = [
  {
    id: '1',
    name: 'Project Planning',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-15'),
    progress: 100,
    color: '#4CAF50',
    assignee: 'John Doe',
  },
  {
    id: '2',
    name: 'Design Phase',
    start: new Date('2024-01-10'),
    end: new Date('2024-02-01'),
    progress: 100,
    color: '#2196F3',
    assignee: 'Sarah Smith',
  },
  {
    id: '3',
    name: 'Development Sprint 1',
    start: new Date('2024-01-20'),
    end: new Date('2024-02-15'),
    progress: 75,
    color: '#FF9800',
    assignee: 'Dev Team',
  },
  {
    id: '4',
    name: 'Testing Phase',
    start: new Date('2024-02-10'),
    end: new Date('2024-02-28'),
    progress: 30,
    color: '#9C27B0',
    assignee: 'QA Team',
  },
  {
    id: '5',
    name: 'Deployment',
    start: new Date('2024-02-25'),
    end: new Date('2024-03-05'),
    progress: 0,
    color: '#F44336',
    assignee: 'DevOps',
  },
];

export const Default: Story = {
  args: {
    tasks: projectTasks,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    variant: 'default',
    showGrid: true,
    showToday: true,
  },
};

const InteractiveGanttComponent = () => {
const [tasks, setTasks] = React.useState(projectTasks);
    const [selectedTask, setSelectedTask] = React.useState<string | null>(null);

    const handleTaskClick = (taskId: string) => {
      setSelectedTask(taskId);
    };

    const updateProgress = (taskId: string, progress: number) => {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, progress } : task
      ));
    };

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Interactive Project Timeline</Typography>
        
        <TimingDiagram
          tasks={tasks}
          startDate={new Date('2024-01-01')}
          endDate={new Date('2024-03-31')}
          variant="detailed"
          showGrid={true}
          showToday={true}
          interactive={true}
          onTaskClick={handleTaskClick}
        />
        
        {selectedTask && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selected Task: {tasks.find(t => t.id === selectedTask)?.name}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2">Progress:</Typography>
              <Button
                size="small"
                onClick={() => updateProgress(selectedTask, 0)}
              >
                0%
              </Button>
              <Button
                size="small"
                onClick={() => updateProgress(selectedTask, 50)}
              >
                50%
              </Button>
              <Button
                size="small"
                onClick={() => updateProgress(selectedTask, 100)}
              >
                100%
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>
    );
};

export const InteractiveGantt: Story = {
  render: () => <InteractiveGanttComponent />,
};

export const ResourceAllocation: Story = {
  render: () => {
    const resources = [
      {
        id: '1',
        name: 'Frontend Development',
        tasks: [
          { start: new Date('2024-01-05'), end: new Date('2024-01-20'), assignee: 'Alice' },
          { start: new Date('2024-01-25'), end: new Date('2024-02-10'), assignee: 'Bob' },
        ],
        color: '#4CAF50',
      },
      {
        id: '2',
        name: 'Backend Development',
        tasks: [
          { start: new Date('2024-01-10'), end: new Date('2024-01-30'), assignee: 'Charlie' },
          { start: new Date('2024-02-01'), end: new Date('2024-02-20'), assignee: 'David' },
        ],
        color: '#2196F3',
      },
      {
        id: '3',
        name: 'Database Design',
        tasks: [
          { start: new Date('2024-01-01'), end: new Date('2024-01-15'), assignee: 'Eve' },
          { start: new Date('2024-02-15'), end: new Date('2024-02-28'), assignee: 'Frank' },
        ],
        color: '#FF9800',
      },
      {
        id: '4',
        name: 'UI/UX Design',
        tasks: [
          { start: new Date('2024-01-01'), end: new Date('2024-01-25'), assignee: 'Grace' },
        ],
        color: '#9C27B0',
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Resource Allocation Chart</Typography>
        
        <TimingDiagram
          tasks={resources.flatMap(r => 
            r.tasks.map((task, idx) => ({
              id: `${r.id}-${idx}`,
              name: `${r.name} - ${task.assignee}`,
              start: task.start,
              end: task.end,
              color: r.color,
              assignee: task.assignee,
              progress: 50,
            }))
          )}
          startDate={new Date('2024-01-01')}
          endDate={new Date('2024-02-28')}
          variant="resource"
          showGrid={true}
          groupBy="assignee"
        />
      </Stack>
    );
  },
};

export const SprintPlanning: Story = {
  render: () => {
    const sprints = [
      {
        id: 'sprint1',
        name: 'Sprint 1',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-14'),
        tasks: [
          { name: 'User Authentication', progress: 100 },
          { name: 'Database Setup', progress: 100 },
        ],
      },
      {
        id: 'sprint2',
        name: 'Sprint 2',
        start: new Date('2024-01-15'),
        end: new Date('2024-01-28'),
        tasks: [
          { name: 'API Development', progress: 80 },
          { name: 'Frontend Components', progress: 60 },
        ],
      },
      {
        id: 'sprint3',
        name: 'Sprint 3',
        start: new Date('2024-01-29'),
        end: new Date('2024-02-11'),
        tasks: [
          { name: 'Integration Testing', progress: 30 },
          { name: 'Performance Optimization', progress: 10 },
        ],
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Sprint Overview</Typography>
        
        {sprints.map((sprint) => (
          <Paper key={sprint.id} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {sprint.name}
            </Typography>
            <TimingDiagram
              tasks={sprint.tasks.map((task, idx) => ({
                id: `${sprint.id}-${idx}`,
                name: task.name,
                start: sprint.start,
                end: sprint.end,
                progress: task.progress,
                color: task.progress === 100 ? '#4CAF50' :
                       task.progress >= 50 ? '#FF9800' : '#F44336',
              }))}
              startDate={sprint.start}
              endDate={sprint.end}
              variant="compact"
              showGrid={false}
              height={150}
            />
            <Box mt={1}>
              <Typography variant="caption" color="text.secondary">
                Average Progress: {Math.round(
                  sprint.tasks.reduce((acc, t) => acc + t.progress, 0) / sprint.tasks.length
                )}%
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    );
  },
};

export const MultipleProjects: Story = {
  render: () => {
    const projects = [
      {
        name: 'Website Redesign',
        tasks: [
          { id: 'w1', name: 'Planning', start: new Date('2024-01-01'), end: new Date('2024-01-10'), color: '#4CAF50' },
          { id: 'w2', name: 'Design', start: new Date('2024-01-08'), end: new Date('2024-01-25'), color: '#4CAF50' },
          { id: 'w3', name: 'Development', start: new Date('2024-01-20'), end: new Date('2024-02-15'), color: '#4CAF50' },
        ],
      },
      {
        name: 'Mobile App',
        tasks: [
          { id: 'm1', name: 'Research', start: new Date('2024-01-05'), end: new Date('2024-01-15'), color: '#2196F3' },
          { id: 'm2', name: 'Prototype', start: new Date('2024-01-12'), end: new Date('2024-01-30'), color: '#2196F3' },
          { id: 'm3', name: 'Testing', start: new Date('2024-01-25'), end: new Date('2024-02-10'), color: '#2196F3' },
        ],
      },
      {
        name: 'API Integration',
        tasks: [
          { id: 'a1', name: 'Architecture', start: new Date('2024-01-10'), end: new Date('2024-01-20'), color: '#FF9800' },
          { id: 'a2', name: 'Implementation', start: new Date('2024-01-18'), end: new Date('2024-02-05'), color: '#FF9800' },
        ],
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Multi-Project Timeline</Typography>
        
        <TimingDiagram
          tasks={projects.flatMap(p => 
            p.tasks.map(t => ({
              ...t,
              name: `[${p.name}] ${t.name}`,
              progress: Math.random() * 100,
            }))
          )}
          startDate={new Date('2024-01-01')}
          endDate={new Date('2024-02-28')}
          variant="default"
          showGrid={true}
          showToday={true}
        />
        
        <Stack direction="row" spacing={2}>
          {projects.map((project) => (
            <Chip
              key={project.name}
              label={project.name}
              sx={{ bgcolor: project.tasks[0].color, color: 'white' }}
            />
          ))}
        </Stack>
      </Stack>
    );
  },
};

export const Milestones: Story = {
  render: () => {
    const tasksWithMilestones = [
      {
        id: '1',
        name: 'Phase 1: Foundation',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
        progress: 100,
        color: '#4CAF50',
      },
      {
        id: 'm1',
        name: '🎯 Milestone: Architecture Review',
        start: new Date('2024-01-31'),
        end: new Date('2024-01-31'),
        progress: 100,
        color: '#FFD700',
        isMilestone: true,
      },
      {
        id: '2',
        name: 'Phase 2: Development',
        start: new Date('2024-02-01'),
        end: new Date('2024-02-28'),
        progress: 60,
        color: '#2196F3',
      },
      {
        id: 'm2',
        name: '🎯 Milestone: Beta Release',
        start: new Date('2024-02-28'),
        end: new Date('2024-02-28'),
        progress: 0,
        color: '#FFD700',
        isMilestone: true,
      },
      {
        id: '3',
        name: 'Phase 3: Testing',
        start: new Date('2024-03-01'),
        end: new Date('2024-03-20'),
        progress: 0,
        color: '#9C27B0',
      },
      {
        id: 'm3',
        name: '🎯 Milestone: Production Launch',
        start: new Date('2024-03-20'),
        end: new Date('2024-03-20'),
        progress: 0,
        color: '#FFD700',
        isMilestone: true,
      },
    ];

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Project Phases with Milestones</Typography>
        
        <TimingDiagram
          tasks={tasksWithMilestones}
          startDate={new Date('2024-01-01')}
          endDate={new Date('2024-03-31')}
          variant="detailed"
          showGrid={true}
          showToday={true}
          renderTask={(task) => {
            if (task.isMilestone) {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '20px',
                  }}
                >
                  💎
                </Box>
              );
            }
            return null;
          }}
        />
        
        <Paper sx={{ p: 2, bgcolor: 'warning.light' }}>
          <Typography variant="body2">
            💎 Milestones represent key deliverables and checkpoints
          </Typography>
        </Paper>
      </Stack>
    );
  },
};