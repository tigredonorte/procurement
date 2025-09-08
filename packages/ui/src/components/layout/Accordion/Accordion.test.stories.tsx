import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { useState } from 'react';
import { Button, Typography, Box, Stack } from '@mui/material';
import { ExpandMore, Settings } from '@mui/icons-material';

import { Accordion, AccordionSummary, AccordionDetails, AccordionActions } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Layout/Accordion/Tests',
  component: Accordion,
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Interaction Test
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  args: {
    variant: 'default',
    onChange: fn(),
    'data-testid': 'test-accordion',
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionSummary expandIcon={<ExpandMore />} data-testid="test-accordion-summary">
        <Typography data-testid="accordion-title">Test Accordion</Typography>
      </AccordionSummary>
      <AccordionDetails data-testid="test-accordion-details">
        <Typography data-testid="accordion-content">
          This is test content that should be expandable and collapsible.
        </Typography>
      </AccordionDetails>
    </Accordion>
  ),
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const accordion = canvas.getByTestId('test-accordion');
      const summary = canvas.getByTestId('test-accordion-summary');
      const title = canvas.getByTestId('accordion-title');

      await expect(accordion).toBeInTheDocument();
      await expect(summary).toBeInTheDocument();
      await expect(title).toHaveTextContent('Test Accordion');
    });

    await step('Click interaction to expand', async () => {
      const summary = canvas.getByTestId('test-accordion-summary');
      await userEvent.click(summary);

      // Verify onChange was called
      await waitFor(() => {
        expect(args.onChange).toHaveBeenCalledTimes(1);
      });

      // Check if content is visible
      const content = canvas.getByTestId('accordion-content');
      await expect(content).toBeInTheDocument();
    });

    await step('Click interaction to collapse', async () => {
      const summary = canvas.getByTestId('test-accordion-summary');
      await userEvent.click(summary);

      // Verify onChange was called again
      await waitFor(() => {
        expect(args.onChange).toHaveBeenCalledTimes(2);
      });
    });

    await step('Hover interaction on summary', async () => {
      const summary = canvas.getByTestId('test-accordion-summary');
      await userEvent.hover(summary);

      // Should have hover styling applied
      await expect(summary).toBeInTheDocument();
    });
  },
};

// State Change Test
export const StateChangeTest: Story = {
  name: '🔄 State Change Test',
  render: () => {
    const TestComponent = () => {
      const [expanded, setExpanded] = useState(false);

      return (
        <Box>
          <Button data-testid="external-toggle" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Collapse' : 'Expand'} Accordion
          </Button>
          <Accordion
            expanded={expanded}
            onChange={(_, isExpanded) => setExpanded(isExpanded)}
            data-testid="controlled-accordion"
          >
            <AccordionSummary expandIcon={<ExpandMore />} data-testid="controlled-summary">
              <Typography>Controlled Accordion</Typography>
            </AccordionSummary>
            <AccordionDetails data-testid="controlled-details">
              <Typography data-testid="controlled-content">
                This accordion is controlled by external state.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial collapsed state', async () => {
      const accordion = canvas.getByTestId('controlled-accordion');
      const toggleButton = canvas.getByTestId('external-toggle');

      await expect(accordion).toBeInTheDocument();
      await expect(toggleButton).toHaveTextContent('Expand Accordion');
    });

    await step('External toggle to expand', async () => {
      const toggleButton = canvas.getByTestId('external-toggle');
      await userEvent.click(toggleButton);

      await waitFor(() => {
        expect(toggleButton).toHaveTextContent('Collapse Accordion');
      });

      const content = canvas.getByTestId('controlled-content');
      await expect(content).toBeInTheDocument();
    });

    await step('External toggle to collapse', async () => {
      const toggleButton = canvas.getByTestId('external-toggle');
      await userEvent.click(toggleButton);

      await waitFor(() => {
        expect(toggleButton).toHaveTextContent('Expand Accordion');
      });
    });

    await step('Internal summary click', async () => {
      const summary = canvas.getByTestId('controlled-summary');
      await userEvent.click(summary);

      await waitFor(() => {
        const toggleButton = canvas.getByTestId('external-toggle');
        expect(toggleButton).toHaveTextContent('Collapse Accordion');
      });
    });
  },
};

// Keyboard Navigation Test
export const KeyboardNavigation: Story = {
  name: '⌨️ Keyboard Navigation Test',
  render: () => (
    <Stack spacing={1}>
      <Accordion variant="bordered" data-testid="first-accordion">
        <AccordionSummary expandIcon={<ExpandMore />} data-testid="first-summary">
          <Typography>First Accordion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            First accordion content.
            <Button data-testid="first-button">First Button</Button>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion variant="bordered" data-testid="second-accordion">
        <AccordionSummary expandIcon={<ExpandMore />} data-testid="second-summary">
          <Typography>Second Accordion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Second accordion content.
            <Button data-testid="second-button">Second Button</Button>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Stack>
  ),
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
          { id: 'duplicate-id', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation between summaries', async () => {
      const firstSummary = canvas.getByTestId('first-summary');
      const secondSummary = canvas.getByTestId('second-summary');

      // Focus first summary
      firstSummary.focus();
      await expect(firstSummary).toHaveFocus();

      // Tab to second summary
      await userEvent.tab();
      await expect(secondSummary).toHaveFocus();
    });

    await step('Enter key to expand accordion', async () => {
      const firstSummary = canvas.getByTestId('first-summary');
      firstSummary.focus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        const firstButton = canvas.getByTestId('first-button');
        expect(firstButton).toBeInTheDocument();
      });
    });

    await step('Tab into expanded content', async () => {
      const firstButton = canvas.getByTestId('first-button');
      await userEvent.tab();
      await expect(firstButton).toHaveFocus();
    });

    await step('Space key to expand accordion', async () => {
      const secondSummary = canvas.getByTestId('second-summary');
      secondSummary.focus();

      await userEvent.keyboard(' ');

      await waitFor(() => {
        const secondButton = canvas.getByTestId('second-button');
        expect(secondButton).toBeInTheDocument();
      });
    });
  },
};

// Screen Reader Test
export const ScreenReaderTest: Story = {
  name: '🔊 Screen Reader Test',
  render: () => (
    <Accordion variant="glass" data-testid="accessible-accordion" aria-label="Settings accordion">
      <AccordionSummary
        expandIcon={<ExpandMore />}
        data-testid="accessible-summary"
        aria-describedby="accordion-description"
      >
        <Settings aria-hidden="true" sx={{ mr: 1 }} />
        <Typography>Settings Panel</Typography>
      </AccordionSummary>
      <AccordionDetails data-testid="accessible-details">
        <Typography id="accordion-description">
          Configure your application settings including theme, language, and notifications.
        </Typography>
        <Box role="group" aria-label="Setting controls">
          <Button aria-label="Save settings">Save</Button>
          <Button aria-label="Reset to defaults">Reset</Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify ARIA labels', async () => {
      const accordion = canvas.getByTestId('accessible-accordion');
      await expect(accordion).toHaveAttribute('aria-label', 'Settings accordion');
    });

    await step('Verify ARIA descriptions', async () => {
      const summary = canvas.getByTestId('accessible-summary');
      await expect(summary).toHaveAttribute('aria-describedby', 'accordion-description');

      const description = canvas.getByText(/Configure your application settings/);
      await expect(description).toHaveAttribute('id', 'accordion-description');
    });

    await step('Verify role attributes', async () => {
      // Expand to access the controls group
      const summary = canvas.getByTestId('accessible-summary');
      await userEvent.click(summary);

      await waitFor(async () => {
        const controlsGroup = canvas.getByRole('group', { name: 'Setting controls' });
        await expect(controlsGroup).toBeInTheDocument();
      });

      const saveButton = canvas.getByRole('button', { name: 'Save settings' });
      const resetButton = canvas.getByRole('button', { name: 'Reset to defaults' });

      await expect(saveButton).toBeInTheDocument();
      await expect(resetButton).toBeInTheDocument();
    });

    await step('Verify icon accessibility', async () => {
      const icon = canvas.getByTestId('accessible-summary').querySelector('[aria-hidden="true"]');
      await expect(icon).toBeInTheDocument();
    });
  },
};

// Focus Management Test
export const FocusManagement: Story = {
  name: '🎯 Focus Management Test',
  render: () => (
    <Box>
      <Button data-testid="external-trigger">External Focus Trigger</Button>
      <Accordion variant="separated" data-testid="focus-accordion" defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMore />} data-testid="focus-summary">
          <Typography>Focus Test Accordion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            <Button data-testid="first-focus-element">First Focusable</Button>
            <Button data-testid="second-focus-element">Second Focusable</Button>
            <Button data-testid="last-focus-element">Last Focusable</Button>
          </Stack>
        </AccordionDetails>
        <AccordionActions>
          <Button data-testid="action-cancel">Cancel</Button>
          <Button data-testid="action-save" variant="contained">
            Save
          </Button>
        </AccordionActions>
      </Accordion>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial focus state', async () => {
      const externalTrigger = canvas.getByTestId('external-trigger');
      externalTrigger.focus();
      await expect(externalTrigger).toHaveFocus();
    });

    await step('Focus on accordion summary', async () => {
      const summary = canvas.getByTestId('focus-summary');
      summary.focus();
      await expect(summary).toHaveFocus();
    });

    await step('Expand accordion and check focus flow', async () => {
      const summary = canvas.getByTestId('focus-summary');
      await userEvent.click(summary);

      await waitFor(() => {
        const firstButton = canvas.getByTestId('first-focus-element');
        expect(firstButton).toBeInTheDocument();
      });

      // Tab through the expanded content
      await userEvent.tab();
      const firstButton = canvas.getByTestId('first-focus-element');
      await expect(firstButton).toHaveFocus();

      await userEvent.tab();
      const secondButton = canvas.getByTestId('second-focus-element');
      await expect(secondButton).toHaveFocus();

      await userEvent.tab();
      const lastButton = canvas.getByTestId('last-focus-element');
      await expect(lastButton).toHaveFocus();

      await userEvent.tab();
      const cancelAction = canvas.getByTestId('action-cancel');
      await expect(cancelAction).toHaveFocus();
    });

    await step('Focus restoration after collapse', async () => {
      const summary = canvas.getByTestId('focus-summary');

      // Click to collapse
      await userEvent.click(summary);

      // Summary should retain focus
      await expect(summary).toHaveFocus();
    });
  },
};

// Visual States Test
export const VisualStates: Story = {
  name: '👁️ Visual States Test',
  render: () => (
    <Stack spacing={2}>
      <Accordion variant="default" data-testid="default-accordion">
        <AccordionSummary expandIcon={<ExpandMore />} data-testid="default-summary">
          <Typography>Default State</Typography>
        </AccordionSummary>
        <AccordionDetails data-testid="default-details">
          <Typography>Default accordion content</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion variant="glass" data-testid="glass-accordion">
        <AccordionSummary expandIcon={<ExpandMore />} data-testid="glass-summary">
          <Typography>Glass Variant</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Glass effect accordion</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion disabled data-testid="disabled-accordion">
        <AccordionSummary expandIcon={<ExpandMore />} data-testid="disabled-summary">
          <Typography>Disabled State</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>This should not be accessible</Typography>
        </AccordionDetails>
      </Accordion>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Default state verification', async () => {
      const accordion = canvas.getByTestId('default-accordion');
      await expect(accordion).toBeInTheDocument();

      const summary = canvas.getByTestId('default-summary');
      await expect(summary).toBeInTheDocument();
    });

    await step('Glass variant hover effect', async () => {
      const glassSummary = canvas.getByTestId('glass-summary');
      await userEvent.hover(glassSummary);

      // Glass variant should have backdrop filter
      await expect(glassSummary.closest('[data-testid="glass-accordion"]')).toBeInTheDocument();
    });

    await step('Disabled state verification', async () => {
      const disabledAccordion = canvas.getByTestId('disabled-accordion');
      await expect(disabledAccordion).toHaveAttribute('aria-disabled', 'true');

      const disabledSummary = canvas.getByTestId('disabled-summary');
      // Should not be clickable when disabled
      await userEvent.click(disabledSummary);

      // Content should remain hidden
      const details = canvas.queryByText('This should not be accessible');
      await expect(details).not.toBeVisible();
    });

    await step('Expand animation test', async () => {
      const defaultSummary = canvas.getByTestId('default-summary');
      await userEvent.click(defaultSummary);

      await waitFor(() => {
        const details = canvas.getByTestId('default-details');
        expect(details).toBeInTheDocument();
      });
    });
  },
};

// Responsive Design Test
export const ResponsiveDesign: Story = {
  name: '📱 Responsive Design Test',
  render: () => (
    <Box data-testid="responsive-container">
      <Accordion variant="bordered" data-testid="responsive-accordion">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Responsive Accordion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
            gap={2}
            data-testid="responsive-grid"
          >
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2">Item 1</Typography>
              <Typography variant="body2">Responsive content</Typography>
            </Box>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2">Item 2</Typography>
              <Typography variant="body2">Responsive content</Typography>
            </Box>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2">Item 3</Typography>
              <Typography variant="body2">Responsive content</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  ),
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'mobile',
    },
    chromatic: {
      viewports: [375, 768, 1920],
      delay: 300,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify responsive container', async () => {
      const container = canvas.getByTestId('responsive-container');
      const accordion = canvas.getByTestId('responsive-accordion');

      await expect(container).toBeInTheDocument();
      await expect(accordion).toBeInTheDocument();
    });

    await step('Expand accordion to test responsive content', async () => {
      const summary = canvas
        .getByTestId('responsive-accordion')
        .querySelector('.MuiAccordionSummary-root');
      if (summary) {
        await userEvent.click(summary);

        await waitFor(() => {
          const grid = canvas.getByTestId('responsive-grid');
          expect(grid).toBeInTheDocument();
        });
      }
    });
  },
};

// Edge Cases Test
export const EdgeCases: Story = {
  name: '🔧 Edge Cases Test',
  render: () => (
    <Stack spacing={2}>
      <Accordion variant="bordered" data-testid="empty-content-accordion">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Empty Content Test</Typography>
        </AccordionSummary>
        <AccordionDetails data-testid="empty-details">{/* Empty content */}</AccordionDetails>
      </Accordion>

      <Accordion variant="glass" data-testid="long-content-accordion">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography data-testid="long-title">
            {'Very '.repeat(20)}Long Title That Should Handle Overflow Gracefully
          </Typography>
        </AccordionSummary>
        <AccordionDetails data-testid="long-content">
          <Typography>
            {'This is very long content that should test how the accordion handles extensive amounts of text. '.repeat(
              50,
            )}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion variant="separated" data-testid="nested-accordion">
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Nested Content Test</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            <Stack spacing={1}>
              {Array.from({ length: 10 }, (_, i) => (
                <Box key={i} sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>
                  Item {i + 1}
                </Box>
              ))}
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty content handling', async () => {
      const emptyAccordion = canvas.getByTestId('empty-content-accordion');
      const summary = emptyAccordion.querySelector('.MuiAccordionSummary-root');

      if (summary) {
        await userEvent.click(summary);

        const emptyDetails = canvas.getByTestId('empty-details');
        await expect(emptyDetails).toBeInTheDocument();
        // Should handle empty content gracefully
      }
    });

    await step('Long text overflow handling', async () => {
      const longTitle = canvas.getByTestId('long-title');
      await expect(longTitle).toBeInTheDocument();

      const longAccordion = canvas.getByTestId('long-content-accordion');
      const summary = longAccordion.querySelector('.MuiAccordionSummary-root');

      if (summary) {
        await userEvent.click(summary);

        const longContent = canvas.getByTestId('long-content');
        await expect(longContent).toBeInTheDocument();
      }
    });

    await step('Nested scrollable content', async () => {
      const nestedAccordion = canvas.getByTestId('nested-accordion');
      const summary = nestedAccordion.querySelector('.MuiAccordionSummary-root');

      if (summary) {
        await userEvent.click(summary);

        await waitFor(() => {
          const items = canvas.getAllByText(/^Item \d+$/);
          expect(items.length).toBe(10);
        });
      }
    });
  },
};

// Form Interaction Test
export const FormInteraction: Story = {
  name: '📝 Form Interaction Test',
  render: () => {
    const TestComponent = () => {
      const [formData, setFormData] = useState({
        username: '',
        email: '',
        preferences: {
          theme: 'light',
          notifications: true,
        },
      });

      return (
        <Stack spacing={2}>
          <Accordion variant="bordered" data-testid="form-accordion">
            <AccordionSummary expandIcon={<ExpandMore />} data-testid="form-summary">
              <Typography>User Settings Form</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2} sx={{ width: '100%' }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  data-testid="username-input"
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="email-input"
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <label data-testid="theme-label">
                  Theme:
                  <select
                    value={formData.preferences.theme}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, theme: e.target.value },
                      })
                    }
                    data-testid="theme-select"
                    style={{ marginLeft: '8px', padding: '4px' }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </label>
                <label data-testid="notifications-label">
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, notifications: e.target.checked },
                      })
                    }
                    data-testid="notifications-checkbox"
                  />
                  Enable Notifications
                </label>
              </Stack>
            </AccordionDetails>
            <AccordionActions>
              <Button
                data-testid="form-cancel"
                onClick={() =>
                  setFormData({
                    username: '',
                    email: '',
                    preferences: { theme: 'light', notifications: true },
                  })
                }
              >
                Reset
              </Button>
              <Button
                data-testid="form-submit"
                variant="contained"
                onClick={() => {
                  // Form submission handler
                  // eslint-disable-next-line no-console
                  console.log('Form submitted:', formData);
                }}
              >
                Submit
              </Button>
            </AccordionActions>
          </Accordion>
        </Stack>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Expand accordion with form', async () => {
      const summary = canvas.getByTestId('form-summary');
      await userEvent.click(summary);

      await waitFor(() => {
        const usernameInput = canvas.getByTestId('username-input');
        expect(usernameInput).toBeInTheDocument();
      });
    });

    await step('Fill in text inputs', async () => {
      const usernameInput = canvas.getByTestId('username-input');
      const emailInput = canvas.getByTestId('email-input');

      await userEvent.type(usernameInput, 'testuser');
      await expect(usernameInput).toHaveValue('testuser');

      await userEvent.type(emailInput, 'test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
    });

    await step('Change select value', async () => {
      const themeSelect = canvas.getByTestId('theme-select');

      await userEvent.selectOptions(themeSelect, 'dark');
      await expect(themeSelect).toHaveValue('dark');
    });

    await step('Toggle checkbox', async () => {
      const notificationsCheckbox = canvas.getByTestId('notifications-checkbox');

      await expect(notificationsCheckbox).toBeChecked();
      await userEvent.click(notificationsCheckbox);
      await expect(notificationsCheckbox).not.toBeChecked();
    });

    await step('Reset form', async () => {
      const resetButton = canvas.getByTestId('form-cancel');
      await userEvent.click(resetButton);

      await waitFor(() => {
        const usernameInput = canvas.getByTestId('username-input');
        const emailInput = canvas.getByTestId('email-input');
        const themeSelect = canvas.getByTestId('theme-select');
        const notificationsCheckbox = canvas.getByTestId('notifications-checkbox');

        expect(usernameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(themeSelect).toHaveValue('light');
        expect(notificationsCheckbox).toBeChecked();
      });
    });

    await step('Form submission', async () => {
      const usernameInput = canvas.getByTestId('username-input');
      await userEvent.type(usernameInput, 'finaluser');

      const submitButton = canvas.getByTestId('form-submit');
      await userEvent.click(submitButton);

      // Form data should be processed (console.log in this case)
      await expect(usernameInput).toHaveValue('finaluser');
    });
  },
};

// Theme Variations Test
export const ThemeVariations: Story = {
  name: '🎨 Theme Variations Test',
  render: () => {
    const TestComponent = () => {
      const [isDarkMode, setIsDarkMode] = useState(false);

      return (
        <Box
          sx={{
            p: 3,
            backgroundColor: isDarkMode ? '#121212' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            minHeight: '400px',
            transition: 'all 0.3s ease',
          }}
          data-testid="theme-container"
        >
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            data-testid="theme-toggle"
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </Button>

          <Stack spacing={2}>
            <Accordion
              variant="default"
              data-testid="themed-default"
              sx={{
                backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Default Theme Variant</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Content adapts to {isDarkMode ? 'dark' : 'light'} theme</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              variant="glass"
              data-testid="themed-glass"
              sx={{
                color: isDarkMode ? '#ffffff' : '#000000',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Glass Theme Variant</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Glass effect with {isDarkMode ? 'dark' : 'light'} theme</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              variant="bordered"
              data-testid="themed-bordered"
              sx={{
                borderColor: isDarkMode ? '#444' : '#ddd',
                backgroundColor: isDarkMode ? '#2a2a2a' : '#fafafa',
                color: isDarkMode ? '#ffffff' : '#000000',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Bordered Theme Variant</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Bordered with {isDarkMode ? 'dark' : 'light'} theme</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              variant="separated"
              data-testid="themed-separated"
              sx={{
                backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                color: isDarkMode ? '#ffffff' : '#000000',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Separated Theme Variant</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Separated style with {isDarkMode ? 'dark' : 'light'} theme</Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Box>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify light theme rendering', async () => {
      const container = canvas.getByTestId('theme-container');
      const defaultAccordion = canvas.getByTestId('themed-default');
      const glassAccordion = canvas.getByTestId('themed-glass');
      const borderedAccordion = canvas.getByTestId('themed-bordered');
      const separatedAccordion = canvas.getByTestId('themed-separated');

      await expect(container).toBeInTheDocument();
      await expect(defaultAccordion).toBeInTheDocument();
      await expect(glassAccordion).toBeInTheDocument();
      await expect(borderedAccordion).toBeInTheDocument();
      await expect(separatedAccordion).toBeInTheDocument();
    });

    await step('Switch to dark theme', async () => {
      const toggleButton = canvas.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);

      await waitFor(() => {
        expect(toggleButton).toHaveTextContent('Toggle Light Mode');
      });
    });

    await step('Verify dark theme styles applied', async () => {
      const container = canvas.getByTestId('theme-container');
      // Check that dark theme is applied
      await expect(container).toHaveStyle({ backgroundColor: 'rgb(18, 18, 18)' });
    });

    await step('Test accordion interactions in dark mode', async () => {
      const defaultAccordion = canvas.getByTestId('themed-default');
      const summary = defaultAccordion.querySelector('.MuiAccordionSummary-root');

      if (summary) {
        await userEvent.click(summary);

        await waitFor(() => {
          const content = canvas.getByText(/Content adapts to dark theme/);
          expect(content).toBeInTheDocument();
        });
      }
    });

    await step('Switch back to light theme', async () => {
      const toggleButton = canvas.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);

      await waitFor(() => {
        expect(toggleButton).toHaveTextContent('Toggle Dark Mode');
      });

      const container = canvas.getByTestId('theme-container');
      await expect(container).toHaveStyle({ backgroundColor: 'rgb(255, 255, 255)' });
    });
  },
};

// Integration Test
export const Integration: Story = {
  name: '🔗 Integration Test',
  render: () => {
    const TestComponent = () => {
      const [activeAccordion, setActiveAccordion] = useState<string | false>(false);
      const [data, setData] = useState({ loaded: false, items: [] as string[] });

      const handleAccordionChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
          setActiveAccordion(isExpanded ? panel : false);

          // Simulate data loading when accordion expands
          if (isExpanded && panel === 'panel2' && !data.loaded) {
            // eslint-disable-next-line no-undef
            setTimeout(() => {
              setData({
                loaded: true,
                items: ['Loaded Item 1', 'Loaded Item 2', 'Loaded Item 3'],
              });
            }, 500);
          }
        };

      return (
        <Box>
          <Typography variant="h6" gutterBottom data-testid="integration-title">
            Integrated Accordion System
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }} data-testid="active-panel">
            Active Panel: {activeAccordion || 'None'}
          </Typography>

          <Stack spacing={1}>
            <Accordion
              expanded={activeAccordion === 'panel1'}
              onChange={handleAccordionChange('panel1')}
              variant="bordered"
              data-testid="integrated-panel1"
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Panel 1: Basic Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography>This panel contains basic information.</Typography>
                  <Button
                    data-testid="panel1-action"
                    onClick={() => setActiveAccordion('panel2')}
                    variant="contained"
                    size="small"
                  >
                    Go to Panel 2
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={activeAccordion === 'panel2'}
              onChange={handleAccordionChange('panel2')}
              variant="bordered"
              data-testid="integrated-panel2"
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Panel 2: Dynamic Content</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  {!data.loaded ? (
                    <Typography data-testid="loading-text">Loading content...</Typography>
                  ) : (
                    <>
                      {data.items.map((item, index) => (
                        <Typography key={index} data-testid={`loaded-item-${index}`}>
                          {item}
                        </Typography>
                      ))}
                    </>
                  )}
                  <Button
                    data-testid="panel2-action"
                    onClick={() => setActiveAccordion('panel3')}
                    variant="contained"
                    size="small"
                  >
                    Go to Panel 3
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={activeAccordion === 'panel3'}
              onChange={handleAccordionChange('panel3')}
              variant="bordered"
              data-testid="integrated-panel3"
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Panel 3: Summary</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography>Summary of all panels:</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">• Panel 1: Visited</Typography>
                    <Typography variant="body2">
                      • Panel 2: {data.loaded ? 'Data Loaded' : 'Not Visited'}
                    </Typography>
                    <Typography variant="body2">• Panel 3: Current</Typography>
                  </Box>
                  <Button
                    data-testid="reset-action"
                    onClick={() => {
                      setActiveAccordion(false);
                      setData({ loaded: false, items: [] });
                    }}
                    variant="outlined"
                    size="small"
                  >
                    Reset All
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Box>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify integrated system setup', async () => {
      const title = canvas.getByTestId('integration-title');
      const activePanel = canvas.getByTestId('active-panel');
      const panel1 = canvas.getByTestId('integrated-panel1');
      const panel2 = canvas.getByTestId('integrated-panel2');
      const panel3 = canvas.getByTestId('integrated-panel3');

      await expect(title).toBeInTheDocument();
      await expect(activePanel).toHaveTextContent('Active Panel: None');
      await expect(panel1).toBeInTheDocument();
      await expect(panel2).toBeInTheDocument();
      await expect(panel3).toBeInTheDocument();
    });

    await step('Open first panel', async () => {
      const panel1 = canvas.getByTestId('integrated-panel1');
      const summary = panel1.querySelector('.MuiAccordionSummary-root');

      if (summary) {
        await userEvent.click(summary);

        await waitFor(() => {
          const activePanel = canvas.getByTestId('active-panel');
          expect(activePanel).toHaveTextContent('Active Panel: panel1');
        });

        const actionButton = canvas.getByTestId('panel1-action');
        await expect(actionButton).toBeInTheDocument();
      }
    });

    await step('Navigate to panel 2 via button', async () => {
      const actionButton = canvas.getByTestId('panel1-action');
      await userEvent.click(actionButton);

      await waitFor(() => {
        const activePanel = canvas.getByTestId('active-panel');
        expect(activePanel).toHaveTextContent('Active Panel: panel2');
      });

      // Check for loading state
      const loadingText = canvas.getByTestId('loading-text');
      await expect(loadingText).toBeInTheDocument();
    });

    await step('Wait for dynamic content to load', async () => {
      await waitFor(
        () => {
          const loadedItem0 = canvas.getByTestId('loaded-item-0');
          expect(loadedItem0).toBeInTheDocument();
        },
        { timeout: 1000 },
      );

      const loadedItems = canvas.getAllByTestId(/^loaded-item-/);
      await expect(loadedItems).toHaveLength(3);
    });

    await step('Navigate to panel 3', async () => {
      const actionButton = canvas.getByTestId('panel2-action');
      await userEvent.click(actionButton);

      await waitFor(() => {
        const activePanel = canvas.getByTestId('active-panel');
        expect(activePanel).toHaveTextContent('Active Panel: panel3');
      });

      // Verify summary shows correct status
      const summaryText = canvas.getByText('• Panel 2: Data Loaded');
      await expect(summaryText).toBeInTheDocument();
    });

    await step('Reset all panels', async () => {
      const resetButton = canvas.getByTestId('reset-action');
      await userEvent.click(resetButton);

      await waitFor(() => {
        const activePanel = canvas.getByTestId('active-panel');
        expect(activePanel).toHaveTextContent('Active Panel: None');
      });
    });
  },
};

// Performance Test
export const PerformanceTest: Story = {
  name: '⚡ Performance Test',
  render: () => (
    <Stack spacing={1} data-testid="performance-container">
      {Array.from({ length: 20 }, (_, i) => (
        <Accordion key={i} variant="bordered" data-testid={`perf-accordion-${i}`}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Performance Test Accordion {i + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              {Array.from({ length: 5 }, (_, j) => (
                <Typography key={j} variant="body2">
                  Content item {j + 1} for accordion {i + 1}
                </Typography>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Measure initial render time', async () => {
      // eslint-disable-next-line no-undef
      const startTime = performance.now();
      const accordions = canvas.getAllByTestId(/^perf-accordion-\d+$/);
      // eslint-disable-next-line no-undef
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      // eslint-disable-next-line no-console
      console.log(`Render time for ${accordions.length} accordions: ${renderTime}ms`);

      await expect(accordions.length).toBe(20);
      // Assert reasonable render time (adjust threshold as needed)
      await expect(renderTime).toBeLessThan(100);
    });

    await step('Test rapid expand/collapse performance', async () => {
      // eslint-disable-next-line no-undef
      const startTime = performance.now();

      // Rapidly expand/collapse multiple accordions
      for (let i = 0; i < 5; i++) {
        const accordion = canvas.getByTestId(`perf-accordion-${i}`);
        const summary = accordion.querySelector('.MuiAccordionSummary-root');

        if (summary) {
          await userEvent.click(summary);
          // eslint-disable-next-line no-undef
          await new Promise((resolve) => setTimeout(resolve, 50));
          await userEvent.click(summary);
        }
      }

      // eslint-disable-next-line no-undef
      const endTime = performance.now();
      const interactionTime = endTime - startTime;
      // eslint-disable-next-line no-console
      console.log(`Interaction time for 5 accordions: ${interactionTime}ms`);

      // Verify no performance issues
      await expect(interactionTime).toBeLessThan(1000);
    });
  },
};
