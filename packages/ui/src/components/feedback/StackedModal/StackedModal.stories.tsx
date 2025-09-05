import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Typography, Box, Step, Stepper, StepLabel } from '@mui/material';
import { StackedModal, StackedModalStack, StackedModalStep } from './StackedModal';

const meta: Meta<typeof StackedModal> = {
  title: 'Feedback/StackedModal',
  component: StackedModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Advanced modal system with stacking capabilities, perfect for multi-step workflows and nested dialogs.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['fullscreen', 'slide', 'wizard'],
      description: 'Visual and behavioral variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the modal',
    },
    glass: {
      control: 'boolean',
      description: 'Enable glass morphism effect',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StackedModal>;

export const SlideVariant: Story = {
  render: () => {
    const [openModals, setOpenModals] = useState<Record<number, boolean>>({});

    const openModal = (level: number) => {
      setOpenModals(prev => ({ ...prev, [level]: true }));
    };

    const closeModal = (level: number) => {
      setOpenModals(prev => ({ ...prev, [level]: false }));
    };

    return (
      <StackedModalStack maxStack={3}>
        <Box>
          <Button variant="contained" onClick={() => openModal(1)}>
            Open First Modal
          </Button>

          <StackedModal
            open={openModals[1] || false}
            onClose={() => closeModal(1)}
            variant="slide"
            title="First Modal"
            size="md"
          >
            <Typography paragraph>
              This is the first modal in the stack. Notice how subsequent modals
              stack with subtle offsets and scaling effects.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => openModal(2)}
              fullWidth
            >
              Open Second Modal
            </Button>
          </StackedModal>

          <StackedModal
            open={openModals[2] || false}
            onClose={() => closeModal(2)}
            onBack={() => closeModal(2)}
            variant="slide"
            title="Second Modal"
            size="md"
            glass={true}
          >
            <Typography paragraph>
              This second modal demonstrates the stacking effect. Each modal
              receives proper z-indexing and visual depth cues.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => openModal(3)}
              fullWidth
            >
              Open Third Modal
            </Button>
          </StackedModal>

          <StackedModal
            open={openModals[3] || false}
            onClose={() => closeModal(3)}
            onBack={() => closeModal(3)}
            variant="slide"
            title="Third Modal"
            size="sm"
          >
            <Typography>
              This is the top-level modal with maximum stacking effects.
              Perfect for complex nested workflows.
            </Typography>
          </StackedModal>
        </Box>
      </StackedModalStack>
    );
  },
};

export const WizardWorkflow: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    
    const steps = [
      {
        title: 'Personal Information',
        subtitle: 'Tell us about yourself',
        content: 'Enter your basic personal details to get started.',
      },
      {
        title: 'Account Setup',
        subtitle: 'Configure your account',
        content: 'Set up your account preferences and security settings.',
      },
      {
        title: 'Payment Information',
        subtitle: 'Add payment method',
        content: 'Securely add your payment information for subscriptions.',
      },
      {
        title: 'Confirmation',
        subtitle: 'Review and confirm',
        content: 'Review all your information before completing setup.',
      },
    ];

    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setOpen(false);
        setCurrentStep(0);
      }
    };

    const handleBack = () => {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      }
    };

    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Start Setup Wizard
        </Button>

        <StackedModal
          open={open}
          onClose={() => setOpen(false)}
          variant="wizard"
          title="Account Setup Wizard"
          showBackButton={currentStep > 0}
          onBack={handleBack}
          size="lg"
        >
          <StackedModalStep
            title={steps[currentStep].title}
            subtitle={steps[currentStep].subtitle}
            stepNumber={currentStep + 1}
            totalSteps={steps.length}
            showProgress={true}
          >
            <Box sx={{ py: 3 }}>
              <Typography paragraph>
                {steps[currentStep].content}
              </Typography>
              
              <Box sx={{ 
                p: 3, 
                bgcolor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                mb: 3,
              }}>
                <Typography variant="body2" color="text.secondary">
                  Step {currentStep + 1} of {steps.length}: This would contain
                  the actual form fields and inputs for this step.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {currentStep > 0 && (
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                )}
                <Button variant="contained" onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </Box>
            </Box>
          </StackedModalStep>
        </StackedModal>
      </Box>
    );
  },
};

export const FullscreenVariant: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Fullscreen Modal
        </Button>

        <StackedModal
          open={open}
          onClose={() => setOpen(false)}
          variant="fullscreen"
          title="Fullscreen Experience"
          glass={true}
        >
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Immersive Fullscreen Modal
            </Typography>
            
            <Typography paragraph>
              The fullscreen variant provides maximum space for complex interfaces,
              detailed forms, or rich media content. Perfect for mobile-first designs.
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 3,
              my: 4,
            }}>
              {Array.from({ length: 6 }, (_, i) => (
                <Box 
                  key={i}
                  sx={{ 
                    p: 3, 
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Content Block {i + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fullscreen modals can accommodate complex layouts and
                    multiple content sections effectively.
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button size="large">
                Cancel
              </Button>
              <Button variant="contained" size="large">
                Save Changes
              </Button>
            </Box>
          </Box>
        </StackedModal>
      </Box>
    );
  },
};

export const ComplexNesting: Story = {
  render: () => {
    const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

    const toggle = (key: string) => {
      setOpenStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <StackedModalStack maxStack={5}>
        <Button variant="contained" onClick={() => toggle('settings')}>
          Open Settings
        </Button>

        <StackedModal
          open={openStates.settings || false}
          onClose={() => toggle('settings')}
          title="Settings"
          variant="slide"
        >
          <Typography paragraph>
            Main settings panel with various configuration options.
          </Typography>
          <Button onClick={() => toggle('profile')} fullWidth variant="outlined">
            Edit Profile
          </Button>
        </StackedModal>

        <StackedModal
          open={openStates.profile || false}
          onClose={() => toggle('profile')}
          onBack={() => toggle('profile')}
          title="Edit Profile"
          variant="slide"
          glass={true}
        >
          <Typography paragraph>
            Profile editing form with personal information.
          </Typography>
          <Button onClick={() => toggle('avatar')} fullWidth variant="outlined">
            Change Avatar
          </Button>
        </StackedModal>

        <StackedModal
          open={openStates.avatar || false}
          onClose={() => toggle('avatar')}
          onBack={() => toggle('avatar')}
          title="Avatar Selection"
          variant="slide"
          size="lg"
        >
          <Typography paragraph>
            Avatar selection interface with upload capabilities.
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 2,
            my: 2,
          }}>
            {Array.from({ length: 8 }, (_, i) => (
              <Box 
                key={i}
                sx={{ 
                  aspectRatio: 1,
                  bgcolor: 'primary.light',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.main' },
                }}
              >
                <Typography color="white">{i + 1}</Typography>
              </Box>
            ))}
          </Box>
        </StackedModal>
      </StackedModalStack>
    );
  },
};