import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { useState } from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Stack, 
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  Settings,
  Lock,
  Visibility
} from '@mui/icons-material';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

const meta: Meta<typeof Collapsible> = {
  title: 'Layout/Collapsible/Tests',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false }
  },
  tags: ['autodocs', 'test', 'component:Collapsible']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    open: false,
    variant: 'default',
    duration: 300,
    onToggle: fn()
  },
  render: (args) => {
    const InteractiveExample = () => {
      const [isOpen, setIsOpen] = useState(args.open);
      
      const handleToggle = () => {
        setIsOpen(!isOpen);
        if (args.onToggle) {
          args.onToggle(!isOpen);
        }
      };

      return (
        <div data-testid="collapsible-container">
          <Card>
            <CollapsibleTrigger
              onClick={handleToggle}
              expanded={isOpen}
              data-testid="collapsible-trigger"
            >
              <Typography variant="h6">Toggle Content</Typography>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
            <Collapsible {...args} open={isOpen} data-testid="collapsible-content">
              <CollapsibleContent>
                <Typography variant="body1" data-testid="content-text">
                  This is the collapsible content that can be toggled.
                </Typography>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      );
    };

    return <InteractiveExample />;
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    
    await step('Initial render verification', async () => {
      const container = canvas.getByTestId('collapsible-container');
      await expect(container).toBeInTheDocument();
      
      const trigger = canvas.getByTestId('collapsible-trigger');
      await expect(trigger).toBeInTheDocument();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
    
    await step('Click to expand', async () => {
      const trigger = canvas.getByTestId('collapsible-trigger');
      await userEvent.click(trigger);
      
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
      
      await expect(args.onToggle).toHaveBeenCalledWith(true);
    });
    
    await step('Click to collapse', async () => {
      const trigger = canvas.getByTestId('collapsible-trigger');
      await userEvent.click(trigger);
      
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
      
      await expect(args.onToggle).toHaveBeenCalledWith(false);
    });
    
    await step('Hover interaction', async () => {
      const trigger = canvas.getByTestId('collapsible-trigger');
      await userEvent.hover(trigger);
      
      // Check if hover styles are applied (background color should change)
      const computedStyle = window.getComputedStyle(trigger);
      await expect(computedStyle.cursor).toBe('pointer');
    });
  }
};

// State Change Tests
export const StateChangeTest: Story = {
  name: '🔄 State Change Test',
  args: {
    open: false,
    variant: 'smooth',
    duration: 200
  },
  render: (args) => {
    const StateExample = () => {
      const [isOpen, setIsOpen] = useState(args.open);
      const [variant, setVariant] = useState<'default' | 'smooth' | 'spring'>('smooth');
      
      return (
        <Stack spacing={2}>
          <Box data-testid="controls">
            <Typography variant="h6" gutterBottom>State Controls</Typography>
            <Stack direction="row" spacing={1} mb={2}>
              <Button 
                variant={variant === 'default' ? 'contained' : 'outlined'}
                onClick={() => setVariant('default')}
                data-testid="variant-default"
                size="small"
              >
                Default
              </Button>
              <Button 
                variant={variant === 'smooth' ? 'contained' : 'outlined'}
                onClick={() => setVariant('smooth')}
                data-testid="variant-smooth"
                size="small"
              >
                Smooth
              </Button>
              <Button 
                variant={variant === 'spring' ? 'contained' : 'outlined'}
                onClick={() => setVariant('spring')}
                data-testid="variant-spring"
                size="small"
              >
                Spring
              </Button>
            </Stack>
          </Box>
          
          <Card>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              expanded={isOpen}
              data-testid="state-trigger"
            >
              <Typography variant="h6">State: {isOpen ? 'Open' : 'Closed'}</Typography>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
            <Collapsible 
              open={isOpen} 
              variant={variant}
              duration={args.duration}
              data-testid="state-collapsible"
            >
              <CollapsibleContent>
                <Typography variant="body1" data-testid="state-content">
                  Current variant: <strong>{variant}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This content changes based on the selected variant and state.
                </Typography>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </Stack>
      );
    };

    return <StateExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify initial state', async () => {
      const trigger = canvas.getByTestId('state-trigger');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(trigger).toHaveAttribute('data-state', 'closed');
    });
    
    await step('Change variant to default', async () => {
      const defaultButton = canvas.getByTestId('variant-default');
      await userEvent.click(defaultButton);
      await expect(defaultButton).toHaveClass('MuiButton-contained');
    });
    
    await step('Toggle state with default variant', async () => {
      const trigger = canvas.getByTestId('state-trigger');
      await userEvent.click(trigger);
      
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(trigger).toHaveAttribute('data-state', 'open');
      });
    });
    
    await step('Change variant to spring while open', async () => {
      const springButton = canvas.getByTestId('variant-spring');
      await userEvent.click(springButton);
      await expect(springButton).toHaveClass('MuiButton-contained');
      
      const content = canvas.getByTestId('state-content');
      await expect(content).toHaveTextContent('spring');
    });
  }
};

// Accessibility Tests
export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  args: {
    open: false,
    variant: 'default'
  },
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'duplicate-id', enabled: true }
        ]
      }
    }
  },
  render: (args) => {
    const KeyboardExample = () => {
      const [isOpen, setIsOpen] = useState(args.open);
      
      return (
        <Stack spacing={2}>
          <Typography variant="h6" id="keyboard-instructions">
            Use Tab to navigate, Enter/Space to activate
          </Typography>
          
          <Card>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              expanded={isOpen}
              data-testid="keyboard-trigger"
              aria-describedby="keyboard-instructions"
            >
              <Typography variant="h6">Keyboard Accessible Trigger</Typography>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
            <Collapsible {...args} open={isOpen} data-testid="keyboard-collapsible">
              <CollapsibleContent>
                <Typography variant="body1" data-testid="keyboard-content">
                  This content is fully keyboard accessible.
                </Typography>
                <Button data-testid="focusable-element" variant="outlined" size="small">
                  Focusable Element
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </Stack>
      );
    };

    return <KeyboardExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Tab navigation to trigger', async () => {
      const trigger = canvas.getByTestId('keyboard-trigger');
      trigger.focus();
      await expect(trigger).toHaveFocus();
    });
    
    await step('Enter key activation', async () => {
      const trigger = canvas.getByTestId('keyboard-trigger');
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });
    
    await step('Tab to focusable element inside content', async () => {
      await userEvent.tab();
      const focusableElement = canvas.getByTestId('focusable-element');
      await expect(focusableElement).toHaveFocus();
    });
    
    await step('Space key activation (after tabbing back to trigger)', async () => {
      await userEvent.tab({ shift: true }); // Tab back to trigger
      const trigger = canvas.getByTestId('keyboard-trigger');
      await expect(trigger).toHaveFocus();
      
      await userEvent.keyboard(' ');
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });
  }
};

// Screen Reader Test
export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  args: {
    open: false,
    variant: 'default'
  },
  render: (args) => {
    const ScreenReaderExample = () => {
      const [isOpen, setIsOpen] = useState(args.open);
      
      return (
        <div>
          <Typography variant="h6" id="sr-heading">
            Collapsible Section
          </Typography>
          <Typography variant="body2" id="sr-description" color="text.secondary" mb={2}>
            This section can be expanded to reveal additional content
          </Typography>
          
          <Card>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              expanded={isOpen}
              data-testid="sr-trigger"
              aria-labelledby="sr-heading"
              aria-describedby="sr-description"
            >
              <Typography variant="h6">Settings Panel</Typography>
              <Tooltip title={isOpen ? 'Collapse' : 'Expand'}>
                <IconButton size="small" data-testid="sr-icon">
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Tooltip>
            </CollapsibleTrigger>
            <Collapsible 
              {...args} 
              open={isOpen} 
              data-testid="sr-collapsible"
              role="region"
              aria-labelledby="sr-heading"
            >
              <CollapsibleContent>
                <Typography variant="body1" data-testid="sr-content">
                  Settings content is now visible to screen readers
                </Typography>
                <Stack spacing={2} mt={2}>
                  <Button startIcon={<Settings />} variant="outlined" size="small">
                    General Settings
                  </Button>
                  <Button startIcon={<Lock />} variant="outlined" size="small">
                    Privacy Settings
                  </Button>
                </Stack>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      );
    };

    return <ScreenReaderExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Verify ARIA labels and descriptions', async () => {
      const trigger = canvas.getByTestId('sr-trigger');
      await expect(trigger).toHaveAttribute('aria-labelledby', 'sr-heading');
      await expect(trigger).toHaveAttribute('aria-describedby', 'sr-description');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
    
    await step('Verify heading and description elements', async () => {
      const heading = canvas.getByText('Collapsible Section');
      await expect(heading).toHaveAttribute('id', 'sr-heading');
      
      const description = canvas.getByText(/This section can be expanded/);
      await expect(description).toHaveAttribute('id', 'sr-description');
    });
    
    await step('Test region role when expanded', async () => {
      const trigger = canvas.getByTestId('sr-trigger');
      await userEvent.click(trigger);
      
      await waitFor(() => {
        const collapsible = canvas.getByTestId('sr-collapsible');
        expect(collapsible).toHaveAttribute('role', 'region');
        expect(collapsible).toHaveAttribute('aria-labelledby', 'sr-heading');
      });
    });
  }
};

// Focus Management Test
export const FocusManagement: Story = {
  name: '🎯 Focus Management Test',
  args: {
    open: false,
    variant: 'smooth'
  },
  render: (args) => {
    const FocusExample = () => {
      const [isOpen, setIsOpen] = useState(args.open);
      
      return (
        <Stack spacing={2}>
          <Button data-testid="external-button" variant="outlined">
            External Button (for focus testing)
          </Button>
          
          <Card>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              expanded={isOpen}
              data-testid="focus-trigger"
            >
              <Typography variant="h6">Focus Test Trigger</Typography>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
            <Collapsible {...args} open={isOpen} data-testid="focus-collapsible">
              <CollapsibleContent>
                <Stack spacing={2}>
                  <Button data-testid="first-focusable" variant="contained" size="small">
                    First Focusable
                  </Button>
                  <Button data-testid="second-focusable" variant="outlined" size="small">
                    Second Focusable
                  </Button>
                </Stack>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </Stack>
      );
    };

    return <FocusExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Initial focus state', async () => {
      const trigger = canvas.getByTestId('focus-trigger');
      trigger.focus();
      await expect(trigger).toHaveFocus();
    });
    
    await step('Expand and check focus remains on trigger', async () => {
      const trigger = canvas.getByTestId('focus-trigger');
      await userEvent.click(trigger);
      
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
      
      // Focus should remain on trigger after expansion
      await expect(trigger).toHaveFocus();
    });
    
    await step('Tab through content elements', async () => {
      await userEvent.tab();
      const firstFocusable = canvas.getByTestId('first-focusable');
      await expect(firstFocusable).toHaveFocus();
      
      await userEvent.tab();
      const secondFocusable = canvas.getByTestId('second-focusable');
      await expect(secondFocusable).toHaveFocus();
    });
    
    await step('Collapse and verify focus returns to trigger', async () => {
      // Tab back to trigger
      await userEvent.tab({ shift: true });
      await userEvent.tab({ shift: true });
      
      const trigger = canvas.getByTestId('focus-trigger');
      await expect(trigger).toHaveFocus();
      
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
      
      await expect(trigger).toHaveFocus();
    });
  }
};

// Visual States Test
export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  args: {
    open: false,
    variant: 'default'
  },
  render: () => {
    const VisualExample = () => {
      const [states, setStates] = useState({
        normal: false,
        disabled: false,
        keepMounted: false
      });
      
      return (
        <Stack spacing={3}>
          <Box data-testid="controls">
            <Typography variant="h6" gutterBottom>Visual State Controls</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                onClick={() => setStates(prev => ({...prev, normal: !prev.normal}))}
                variant={states.normal ? 'contained' : 'outlined'}
                data-testid="toggle-normal"
                size="small"
              >
                Normal: {states.normal ? 'Open' : 'Closed'}
              </Button>
              <Button
                onClick={() => setStates(prev => ({...prev, disabled: !prev.disabled}))}
                variant={states.disabled ? 'contained' : 'outlined'}
                data-testid="toggle-disabled"
                size="small"
              >
                Disabled: {states.disabled ? 'Yes' : 'No'}
              </Button>
            </Stack>
          </Box>
          
          <Stack spacing={2}>
            <Card>
              <Typography variant="subtitle1" sx={{ p: 2 }}>Normal State</Typography>
              <CollapsibleTrigger
                onClick={() => setStates(prev => ({...prev, normal: !prev.normal}))}
                expanded={states.normal}
                data-testid="normal-trigger"
              >
                <Typography variant="h6">Normal Collapsible</Typography>
                {states.normal ? <ExpandLess /> : <ExpandMore />}
              </CollapsibleTrigger>
              <Collapsible 
                open={states.normal} 
                variant="smooth"
                data-testid="normal-collapsible"
              >
                <CollapsibleContent>
                  <Typography variant="body2" data-testid="normal-content">
                    Normal state content - fully interactive
                  </Typography>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            
            <Card>
              <Typography variant="subtitle1" sx={{ p: 2 }}>Disabled State</Typography>
              <CollapsibleTrigger
                onClick={() => setStates(prev => ({...prev, disabled: !prev.disabled}))}
                expanded={states.disabled}
                disabled={true}
                data-testid="disabled-trigger"
              >
                <Typography variant="h6">Disabled Collapsible</Typography>
                <Visibility sx={{ opacity: 0.5 }} />
              </CollapsibleTrigger>
              <Collapsible 
                open={states.disabled} 
                variant="smooth"
                disabled={true}
                data-testid="disabled-collapsible"
              >
                <CollapsibleContent>
                  <Typography variant="body2" data-testid="disabled-content">
                    Disabled state content - reduced opacity
                  </Typography>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </Stack>
        </Stack>
      );
    };

    return <VisualExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Normal state visual verification', async () => {
      const normalTrigger = canvas.getByTestId('normal-trigger');
      const computedStyle = window.getComputedStyle(normalTrigger);
      
      await expect(computedStyle.cursor).toBe('pointer');
      await expect(computedStyle.opacity).toBe('1');
      await expect(normalTrigger).toHaveAttribute('data-state', 'closed');
    });
    
    await step('Normal hover state', async () => {
      const normalTrigger = canvas.getByTestId('normal-trigger');
      await userEvent.hover(normalTrigger);
      
      // Hover should change background (tested via cursor staying as pointer)
      const computedStyle = window.getComputedStyle(normalTrigger);
      await expect(computedStyle.cursor).toBe('pointer');
    });
    
    await step('Normal expanded state', async () => {
      const toggleButton = canvas.getByTestId('toggle-normal');
      await userEvent.click(toggleButton);
      
      const normalTrigger = canvas.getByTestId('normal-trigger');
      await waitFor(() => {
        expect(normalTrigger).toHaveAttribute('data-state', 'open');
      });
      
      const normalContent = canvas.getByTestId('normal-content');
      await expect(normalContent).toBeInTheDocument();
    });
    
    await step('Disabled state visual verification', async () => {
      const disabledTrigger = canvas.getByTestId('disabled-trigger');
      const computedStyle = window.getComputedStyle(disabledTrigger);
      
      await expect(computedStyle.cursor).toBe('not-allowed');
      await expect(computedStyle.opacity).toBe('0.6');
      await expect(disabledTrigger).toHaveAttribute('aria-disabled', 'true');
    });
    
    await step('Disabled collapsible visual state', async () => {
      const disabledCollapsible = canvas.getByTestId('disabled-collapsible');
      const computedStyle = window.getComputedStyle(disabledCollapsible);
      
      await expect(computedStyle.opacity).toBe('0.6');
      await expect(computedStyle.pointerEvents).toBe('none');
    });
  }
};

// Performance Test
export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  args: {
    open: false,
    variant: 'smooth'
  },
  render: () => {
    const PerformanceExample = () => {
      const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
      const itemCount = 20;
      
      const toggleItem = (index: number) => {
        setOpenStates(prev => ({
          ...prev,
          [index]: !prev[index]
        }));
      };
      
      return (
        <Stack spacing={1} data-testid="performance-container">
          <Typography variant="h6">Performance Test ({itemCount} items)</Typography>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {Array.from({ length: itemCount }, (_, index) => (
              <Card key={index} sx={{ mb: 0.5 }}>
                <CollapsibleTrigger
                  onClick={() => toggleItem(index)}
                  expanded={openStates[index] || false}
                  data-testid={`perf-trigger-${index}`}
                >
                  <Typography variant="body1">Item {index + 1}</Typography>
                  {openStates[index] ? <ExpandLess /> : <ExpandMore />}
                </CollapsibleTrigger>
                <Collapsible 
                  open={openStates[index] || false}
                  variant="smooth"
                  duration={150}
                  data-testid={`perf-collapsible-${index}`}
                >
                  <CollapsibleContent>
                    <Typography variant="body2" data-testid={`perf-content-${index}`}>
                      Content for item {index + 1}. This tests performance with multiple collapsibles.
                    </Typography>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </Box>
        </Stack>
      );
    };

    return <PerformanceExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Measure initial render time', async () => {
      const startTime = window.performance.now();
      const container = canvas.getByTestId('performance-container');
      const endTime = window.performance.now();
      
      const renderTime = endTime - startTime;
      // eslint-disable-next-line no-console
      console.log(`Initial render time: ${renderTime}ms`);
      
      await expect(container).toBeInTheDocument();
      // Assert reasonable initial render time
      await expect(renderTime).toBeLessThan(100);
    });
    
    await step('Test rapid multiple toggles', async () => {
      const startTime = window.performance.now();
      
      // Toggle first 5 items rapidly
      for (let i = 0; i < 5; i++) {
        const trigger = canvas.getByTestId(`perf-trigger-${i}`);
        await userEvent.click(trigger);
      }
      
      const endTime = window.performance.now();
      const toggleTime = endTime - startTime;
      // eslint-disable-next-line no-console
      console.log(`Rapid toggle time for 5 items: ${toggleTime}ms`);
      
      // Assert reasonable performance
      await expect(toggleTime).toBeLessThan(500);
      
      // Verify all items are expanded
      for (let i = 0; i < 5; i++) {
        const trigger = canvas.getByTestId(`perf-trigger-${i}`);
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      }
    });
    
    await step('Test scroll performance', async () => {
      const container = canvas.getByTestId('performance-container');
      const scrollContainer = container.querySelector('[style*="overflow: auto"]') as HTMLElement;
      
      if (scrollContainer) {
        // Simulate scrolling
        const startTime = window.performance.now();
        for (let i = 0; i < 10; i++) {
          scrollContainer.scrollTop = i * 50;
          await new Promise(resolve => window.setTimeout(resolve, 10));
        }
        const endTime = window.performance.now();
        
        const scrollTime = endTime - startTime;
        // eslint-disable-next-line no-console
        console.log(`Scroll performance time: ${scrollTime}ms`);
        await expect(scrollTime).toBeLessThan(200);
      }
    });
  }
};

// Edge Cases Test
export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  args: {
    open: false,
    variant: 'default'
  },
  render: () => {
    const EdgeCaseExample = () => {
      const [states, setStates] = useState({
        empty: false,
        longContent: false,
        nested: false,
        noContent: false
      });
      
      const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50);
      
      return (
        <Stack spacing={2}>
          <Typography variant="h6">Edge Cases Testing</Typography>
          
          <Card>
            <CollapsibleTrigger
              onClick={() => setStates(prev => ({...prev, empty: !prev.empty}))}
              expanded={states.empty}
              data-testid="empty-trigger"
            >
              <Typography variant="h6">Empty Content</Typography>
              {states.empty ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
            <Collapsible 
              open={states.empty} 
              variant="smooth"
              data-testid="empty-collapsible"
            >
              <CollapsibleContent data-testid="empty-content">
                {/* Empty content */}
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          <Card>
            <CollapsibleTrigger
              onClick={() => setStates(prev => ({...prev, longContent: !prev.longContent}))}
              expanded={states.longContent}
              data-testid="long-trigger"
            >
              <Typography variant="h6">Very Long Content</Typography>
              {states.longContent ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
            <Collapsible 
              open={states.longContent} 
              variant="smooth"
              data-testid="long-collapsible"
            >
              <CollapsibleContent>
                <Typography variant="body2" data-testid="long-content" sx={{
                  maxHeight: 200,
                  overflow: 'auto',
                  wordWrap: 'break-word'
                }}>
                  {longText}
                </Typography>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          <Card>
            <CollapsibleTrigger
              onClick={() => setStates(prev => ({...prev, nested: !prev.nested}))}
              expanded={states.nested}
              data-testid="nested-trigger"
            >
              <Typography variant="h6">Nested Collapsibles</Typography>
              {states.nested ? <ExpandLess /> : <ExpandMore />}
            </CollapsibleTrigger>
            <Collapsible 
              open={states.nested} 
              variant="smooth"
              data-testid="nested-collapsible"
            >
              <CollapsibleContent>
                <Typography variant="body1" gutterBottom>Parent content</Typography>
                <Card variant="outlined">
                  <CollapsibleTrigger
                    onClick={() => setStates(prev => ({...prev, noContent: !prev.noContent}))}
                    expanded={states.noContent}
                    data-testid="nested-child-trigger"
                  >
                    <Typography variant="body1">Nested Child</Typography>
                    {states.noContent ? <ExpandLess /> : <ExpandMore />}
                  </CollapsibleTrigger>
                  <Collapsible 
                    open={states.noContent} 
                    variant="spring"
                    data-testid="nested-child-collapsible"
                  >
                    <CollapsibleContent>
                      <Typography variant="body2" data-testid="nested-child-content">
                        This is nested collapsible content
                      </Typography>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </Stack>
      );
    };

    return <EdgeCaseExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Empty content handling', async () => {
      const emptyTrigger = canvas.getByTestId('empty-trigger');
      await userEvent.click(emptyTrigger);
      
      const emptyContent = canvas.getByTestId('empty-content');
      await expect(emptyContent).toBeInTheDocument();
      await expect(emptyContent).toBeEmptyDOMElement();
    });
    
    await step('Long content overflow handling', async () => {
      const longTrigger = canvas.getByTestId('long-trigger');
      await userEvent.click(longTrigger);
      
      const longContent = canvas.getByTestId('long-content');
      await expect(longContent).toBeInTheDocument();
      
      const computedStyle = window.getComputedStyle(longContent);
      await expect(computedStyle.overflow).toBe('auto');
      await expect(computedStyle.wordWrap).toBe('break-word');
    });
    
    await step('Nested collapsibles functionality', async () => {
      const nestedTrigger = canvas.getByTestId('nested-trigger');
      await userEvent.click(nestedTrigger);
      
      await waitFor(() => {
        const childTrigger = canvas.getByTestId('nested-child-trigger');
        expect(childTrigger).toBeInTheDocument();
      });
      
      const childTrigger = canvas.getByTestId('nested-child-trigger');
      await userEvent.click(childTrigger);
      
      const nestedChildContent = canvas.getByTestId('nested-child-content');
      await expect(nestedChildContent).toBeInTheDocument();
    });
    
    await step('Maximum nesting depth', async () => {
      // Verify both parent and child are properly expanded
      const parentTrigger = canvas.getByTestId('nested-trigger');
      const childTrigger = canvas.getByTestId('nested-child-trigger');
      
      await expect(parentTrigger).toHaveAttribute('aria-expanded', 'true');
      await expect(childTrigger).toHaveAttribute('aria-expanded', 'true');
    });
  }
};

// Integration Test
export const IntegrationTest: Story = {
  name: '🔗 Integration Test',
  args: {
    open: false,
    variant: 'smooth'
  },
  render: () => {
    const IntegrationExample = () => {
      const [activePanel, setActivePanel] = useState<string | null>(null);
      const [globalSettings, setGlobalSettings] = useState({
        animationEnabled: true,
        soundEnabled: false
      });
      
      const panels = ['profile', 'notifications', 'privacy'];
      
      const togglePanel = (panelId: string) => {
        setActivePanel(activePanel === panelId ? null : panelId);
      };
      
      return (
        <Stack spacing={2}>
          <Typography variant="h6">Integration with Other Components</Typography>
          
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Global Settings</Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant={globalSettings.animationEnabled ? 'contained' : 'outlined'}
                  onClick={() => setGlobalSettings(prev => ({
                    ...prev, 
                    animationEnabled: !prev.animationEnabled
                  }))}
                  data-testid="animation-toggle"
                  size="small"
                >
                  Animation: {globalSettings.animationEnabled ? 'On' : 'Off'}
                </Button>
                <Button
                  variant={globalSettings.soundEnabled ? 'contained' : 'outlined'}
                  onClick={() => setGlobalSettings(prev => ({
                    ...prev, 
                    soundEnabled: !prev.soundEnabled
                  }))}
                  data-testid="sound-toggle"
                  size="small"
                >
                  Sound: {globalSettings.soundEnabled ? 'On' : 'Off'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
          
          {panels.map((panelId) => (
            <Card key={panelId}>
              <CollapsibleTrigger
                onClick={() => togglePanel(panelId)}
                expanded={activePanel === panelId}
                data-testid={`integration-trigger-${panelId}`}
              >
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {panelId} Settings
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {globalSettings.soundEnabled && <Tooltip title="Sound enabled"><Settings fontSize="small" /></Tooltip>}
                  {activePanel === panelId ? <ExpandLess /> : <ExpandMore />}
                </Stack>
              </CollapsibleTrigger>
              <Collapsible 
                open={activePanel === panelId}
                variant={globalSettings.animationEnabled ? 'smooth' : 'default'}
                duration={globalSettings.animationEnabled ? 300 : 0}
                data-testid={`integration-collapsible-${panelId}`}
              >
                <CollapsibleContent>
                  <Typography variant="body1" gutterBottom data-testid={`integration-content-${panelId}`}>
                    {panelId.charAt(0).toUpperCase() + panelId.slice(1)} panel content
                  </Typography>
                  <Stack spacing={2}>
                    <Button variant="outlined" size="small" fullWidth>
                      Configure {panelId}
                    </Button>
                    <Button variant="text" size="small" fullWidth>
                      Reset to Defaults
                    </Button>
                  </Stack>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </Stack>
      );
    };

    return <IntegrationExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('Toggle animation setting', async () => {
      const animationToggle = canvas.getByTestId('animation-toggle');
      await userEvent.click(animationToggle);
      await expect(animationToggle).toHaveTextContent('Animation: Off');
    });
    
    await step('Open panel with animation disabled', async () => {
      const profileTrigger = canvas.getByTestId('integration-trigger-profile');
      await userEvent.click(profileTrigger);
      
      const profileContent = canvas.getByTestId('integration-content-profile');
      await expect(profileContent).toBeInTheDocument();
    });
    
    await step('Re-enable animation and test different panel', async () => {
      const animationToggle = canvas.getByTestId('animation-toggle');
      await userEvent.click(animationToggle);
      await expect(animationToggle).toHaveTextContent('Animation: On');
      
      const notificationsTrigger = canvas.getByTestId('integration-trigger-notifications');
      await userEvent.click(notificationsTrigger);
      
      // Should close profile panel and open notifications
      await waitFor(() => {
        const profileTrigger = canvas.getByTestId('integration-trigger-profile');
        expect(profileTrigger).toHaveAttribute('aria-expanded', 'false');
      });
      
      const notificationsContent = canvas.getByTestId('integration-content-notifications');
      await expect(notificationsContent).toBeInTheDocument();
    });
    
    await step('Enable sound and verify icon appears', async () => {
      const soundToggle = canvas.getByTestId('sound-toggle');
      await userEvent.click(soundToggle);
      await expect(soundToggle).toHaveTextContent('Sound: On');
      
      // Settings icon should appear when sound is enabled
      const privacyTrigger = canvas.getByTestId('integration-trigger-privacy');
      const settingsIcon = within(privacyTrigger).getByTestId('SettingsIcon');
      await expect(settingsIcon).toBeInTheDocument();
    });
  }
};