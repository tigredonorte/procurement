import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Typography, Box, Stack } from '@mui/material';
import { ExpandMore, Settings, Info, Security, Help } from '@mui/icons-material';

import { Accordion, AccordionSummary, AccordionDetails, AccordionActions } from './Accordion';

const meta = {
  title: 'Layout/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'glass', 'bordered', 'separated'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    defaultExpanded: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    disabled: false,
    defaultExpanded: false,
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">Basic Accordion</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          This is the content of the accordion. It can contain any React elements,
          including text, forms, images, or other components.
        </Typography>
      </AccordionDetails>
    </Accordion>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>Default Variant</Typography>
        <Accordion variant="default">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Default Accordion</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The default variant follows Material-UI's standard accordion styling.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Glass Variant</Typography>
        <Accordion variant="glass">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Glass Accordion</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The glass variant features a frosted glass effect with backdrop blur and transparency.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Bordered Variant</Typography>
        <Accordion variant="bordered">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Bordered Accordion</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The bordered variant has clean borders and rounded corners.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Separated Variant</Typography>
        <Accordion variant="separated">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Separated Accordion</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The separated variant has elevated shadows and spacing between items.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  ),
};

export const MultipleAccordions: Story = {
  render: () => (
    <Stack spacing={1}>
      <Accordion variant="bordered">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Settings sx={{ mr: 2 }} />
          <Typography>General Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom>
            Configure general application settings including language, timezone, and theme preferences.
          </Typography>
        </AccordionDetails>
        <AccordionActions>
          <Button size="small">Reset</Button>
          <Button size="small" variant="contained">Save</Button>
        </AccordionActions>
      </Accordion>

      <Accordion variant="bordered">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Security sx={{ mr: 2 }} />
          <Typography>Security Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom>
            Manage your security preferences including two-factor authentication,
            password requirements, and login alerts.
          </Typography>
        </AccordionDetails>
        <AccordionActions>
          <Button size="small" color="error">Disable</Button>
          <Button size="small" variant="contained">Update</Button>
        </AccordionActions>
      </Accordion>

      <Accordion variant="bordered">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Info sx={{ mr: 2 }} />
          <Typography>Notification Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom>
            Control how and when you receive notifications from the application.
          </Typography>
        </AccordionDetails>
        <AccordionActions>
          <Button size="small">Test</Button>
          <Button size="small" variant="contained">Apply</Button>
        </AccordionActions>
      </Accordion>
    </Stack>
  ),
};

export const ControlledAccordion: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (
      event: React.SyntheticEvent,
      isExpanded: boolean
    ) => {
      setExpanded(isExpanded ? panel : false);
    };

    return (
      <Stack spacing={1}>
        <Accordion 
          variant="separated" 
          expanded={expanded === 'panel1'} 
          onChange={handleChange('panel1')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Controlled Panel 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              This accordion is controlled - only one panel can be open at a time.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          variant="separated"
          expanded={expanded === 'panel2'} 
          onChange={handleChange('panel2')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Controlled Panel 2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Opening this panel will close the other one automatically.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          variant="separated"
          expanded={expanded === 'panel3'} 
          onChange={handleChange('panel3')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Controlled Panel 3</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              This demonstrates controlled accordion behavior with state management.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Stack>
    );
  },
};

export const ComplexContent: Story = {
  render: () => (
    <Accordion variant="glass" defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">Project Dashboard</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Progress</Typography>
              <Box sx={{ 
                height: 8, 
                backgroundColor: 'grey.200', 
                borderRadius: 1,
                position: 'relative'
              }}>
                <Box sx={{
                  width: '75%',
                  height: '100%',
                  backgroundColor: 'primary.main',
                  borderRadius: 1
                }} />
              </Box>
              <Typography variant="body2" color="text.secondary" mt={1}>
                75% Complete
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Team Members</Typography>
              <Stack direction="row" spacing={1}>
                {['A', 'B', 'C', 'D'].map((letter, index) => (
                  <Box
                    key={letter}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                  >
                    {letter}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            This accordion contains complex content including progress indicators,
            team member avatars, and structured layouts.
          </Typography>
        </Stack>
      </AccordionDetails>
      <AccordionActions>
        <Button startIcon={<Help />} size="small">Help</Button>
        <Button variant="contained" size="small">View Details</Button>
      </AccordionActions>
    </Accordion>
  ),
};

export const DisabledAccordion: Story = {
  render: () => (
    <Stack spacing={2}>
      <Accordion disabled>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This content cannot be accessed because the accordion is disabled.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion variant="glass">
        <AccordionSummary expandIcon={<ExpandMore />} disabled>
          <Typography>Disabled Summary Only</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Only the summary is disabled, but if opened programmatically, 
            the content would be accessible.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Stack>
  ),
};