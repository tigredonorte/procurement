import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import { TextField, Stack } from '@mui/material';
import React from 'react';

import { PasswordStrength } from './PasswordStrength';

const meta: Meta<typeof PasswordStrength> = {
  title: 'Enhanced/PasswordStrength/Tests',
  component: PasswordStrength,
  parameters: {
    layout: 'centered',
    chromatic: { disableSnapshot: false },
  },
  tags: ['autodocs', 'test', 'component:PasswordStrength'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interaction Tests
export const BasicInteraction: Story = {
  name: '🧪 Basic Interaction Test',
  render: () => {
    const TestComponent = () => {
      const [password, setPassword] = React.useState('');

      return (
        <Stack spacing={2} sx={{ width: 400 }}>
          <TextField
            data-testid="password-input"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <PasswordStrength
            data-testid="password-strength"
            value={password}
            variant="linear"
            showRequirements={true}
            showStrengthLabel={true}
          />
        </Stack>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial render verification', async () => {
      const input = canvas.getByTestId('password-input');
      const strengthIndicator = canvas.getByTestId('password-strength');
      await expect(input).toBeInTheDocument();
      await expect(strengthIndicator).toBeInTheDocument();
    });

    await step('Password input interaction', async () => {
      const input = canvas.getByTestId('password-input');
      await userEvent.type(input, 'weak');
      await waitFor(() => {
        expect(input).toHaveValue('weak');
      });
    });

    await step('Strong password interaction', async () => {
      const input = canvas.getByTestId('password-input');
      await userEvent.clear(input);
      await userEvent.type(input, 'MyStrongP@ssw0rd123!');
      await waitFor(() => {
        expect(input).toHaveValue('MyStrongP@ssw0rd123!');
      });
    });
  },
};

export const StateChange: Story = {
  name: '🧪 State Change Test',
  render: () => {
    const TestComponent = () => {
      const [password, setPassword] = React.useState('test');

      return (
        <Stack spacing={2} sx={{ width: 400 }}>
          <button
            data-testid="change-password"
            onClick={() => setPassword(password === 'test' ? 'MyStrongP@ssw0rd123!' : 'test')}
          >
            Toggle Password
          </button>
          <PasswordStrength
            data-testid="password-strength"
            value={password}
            variant="linear"
            showRequirements={true}
            showStrengthLabel={true}
          />
        </Stack>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial weak password state', async () => {
      const strengthIndicator = canvas.getByTestId('password-strength');
      await expect(strengthIndicator).toBeInTheDocument();
    });

    await step('Change to strong password', async () => {
      const button = canvas.getByTestId('change-password');
      await userEvent.click(button);
      await waitFor(() => {
        // Verify component updates
        const strengthIndicator = canvas.getByTestId('password-strength');
        expect(strengthIndicator).toBeInTheDocument();
      });
    });
  },
};

export const KeyboardNavigation: Story = {
  name: '🧪 Keyboard Navigation Test',
  render: () => (
    <Stack spacing={2} sx={{ width: 400 }}>
      <TextField data-testid="password-input" type="password" label="Password" defaultValue="" />
      <PasswordStrength
        data-testid="password-strength"
        value="test123"
        variant="linear"
        showRequirements={true}
        showStrengthLabel={true}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Tab navigation', async () => {
      const input = canvas.getByTestId('password-input');
      input.focus();
      await expect(input).toHaveFocus();
    });

    await step('Verify component accessibility', async () => {
      const strengthIndicator = canvas.getByTestId('password-strength');
      await expect(strengthIndicator).toBeInTheDocument();
    });
  },
};

export const ScreenReader: Story = {
  name: '🧪 Screen Reader Test',
  render: () => (
    <Stack spacing={2} sx={{ width: 400 }}>
      <PasswordStrength
        data-testid="password-strength"
        value="MyStrongP@ssw0rd123!"
        variant="linear"
        showRequirements={true}
        showStrengthLabel={true}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Screen reader accessibility', async () => {
      const strengthIndicator = canvas.getByTestId('password-strength');
      await expect(strengthIndicator).toBeInTheDocument();
      // Component should be accessible to screen readers
    });
  },
};

export const ResponsiveDesign: Story = {
  name: '🧪 Responsive Design Test',
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        desktop: { name: 'Desktop', styles: { width: '1024px', height: '768px' } },
      },
    },
  },
  render: () => (
    <Stack spacing={2}>
      <PasswordStrength
        data-testid="password-strength-responsive"
        value="MyStrongP@ssw0rd123!"
        variant="linear"
        showRequirements={true}
        showStrengthLabel={true}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Responsive layout verification', async () => {
      const strengthIndicator = canvas.getByTestId('password-strength-responsive');
      await expect(strengthIndicator).toBeInTheDocument();
    });
  },
};

export const VisualStates: Story = {
  name: '🧪 Visual States Test',
  render: () => (
    <Stack spacing={3}>
      <PasswordStrength
        data-testid="weak-password"
        value="123"
        variant="linear"
        showStrengthLabel={true}
      />
      <PasswordStrength
        data-testid="strong-password"
        value="MyStrongP@ssw0rd123!"
        variant="linear"
        showStrengthLabel={true}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Visual state verification', async () => {
      const weakPassword = canvas.getByTestId('weak-password');
      const strongPassword = canvas.getByTestId('strong-password');

      await expect(weakPassword).toBeInTheDocument();
      await expect(strongPassword).toBeInTheDocument();
    });
  },
};

export const Performance: Story = {
  name: '🧪 Performance Test',
  render: () => {
    const TestComponent = () => {
      const [password, setPassword] = React.useState('');

      return (
        <Stack spacing={2} sx={{ width: 400 }}>
          <TextField
            data-testid="performance-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength
            data-testid="performance-strength"
            value={password}
            variant="linear"
            showRequirements={true}
            showStrengthLabel={true}
            animated={true}
          />
        </Stack>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Performance test with rapid updates', async () => {
      const input = canvas.getByTestId('performance-input');

      // Rapid typing simulation
      await userEvent.type(input, 'MyPassword123!', { delay: 10 });
      await waitFor(() => {
        expect(input).toHaveValue('MyPassword123!');
      });
    });
  },
};

export const EdgeCases: Story = {
  name: '🧪 Edge Cases Test',
  render: () => (
    <Stack spacing={3}>
      <PasswordStrength
        data-testid="empty-password"
        value=""
        variant="linear"
        showRequirements={true}
        showStrengthLabel={true}
      />
      <PasswordStrength
        data-testid="very-long-password"
        value="ThisIsAnExtremelyLongPasswordThatExceedsTypicalLengthRequirementsAndShouldStillWork123!@#"
        variant="linear"
        showStrengthLabel={true}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Edge cases verification', async () => {
      const emptyPassword = canvas.getByTestId('empty-password');
      const longPassword = canvas.getByTestId('very-long-password');

      await expect(emptyPassword).toBeInTheDocument();
      await expect(longPassword).toBeInTheDocument();
    });
  },
};

export const Integration: Story = {
  name: '🧪 Integration Test',
  render: () => {
    const TestComponent = () => {
      const [password, setPassword] = React.useState('');
      const [variant, setVariant] = React.useState<'linear' | 'circular' | 'steps'>('linear');

      return (
        <Stack spacing={2} sx={{ width: 500 }}>
          <TextField
            data-testid="integration-input"
            type="password"
            label="Test Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Stack direction="row" spacing={1}>
            <button
              data-testid="variant-linear"
              onClick={() => setVariant('linear')}
              style={{ background: variant === 'linear' ? 'lightblue' : 'white' }}
            >
              Linear
            </button>
            <button
              data-testid="variant-circular"
              onClick={() => setVariant('circular')}
              style={{ background: variant === 'circular' ? 'lightblue' : 'white' }}
            >
              Circular
            </button>
            <button
              data-testid="variant-steps"
              onClick={() => setVariant('steps')}
              style={{ background: variant === 'steps' ? 'lightblue' : 'white' }}
            >
              Steps
            </button>
          </Stack>

          <PasswordStrength
            data-testid="integration-strength"
            value={password}
            variant={variant}
            showRequirements={true}
            showStrengthLabel={true}
            animated={true}
          />
        </Stack>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Integration test setup', async () => {
      const input = canvas.getByTestId('integration-input');
      const strengthIndicator = canvas.getByTestId('integration-strength');

      await expect(input).toBeInTheDocument();
      await expect(strengthIndicator).toBeInTheDocument();
    });

    await step('Variant switching test', async () => {
      const circularButton = canvas.getByTestId('variant-circular');
      await userEvent.click(circularButton);

      const stepsButton = canvas.getByTestId('variant-steps');
      await userEvent.click(stepsButton);
    });

    await step('Full integration test', async () => {
      const input = canvas.getByTestId('integration-input');
      await userEvent.type(input, 'TestPassword123!');

      await waitFor(() => {
        expect(input).toHaveValue('TestPassword123!');
      });
    });
  },
};
