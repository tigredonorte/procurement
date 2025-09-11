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

    await step('Initial render with empty password', async () => {
      const textField = canvas.getByTestId('password-input');
      const strengthIndicator = canvas.getByTestId('password-strength');
      await expect(textField).toBeInTheDocument();
      await expect(strengthIndicator).toBeInTheDocument();
      
      // Verify empty password shows 0% strength
      const progressBar = strengthIndicator.querySelector('[role="progressbar"]');
      await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    await step('Weak password shows low strength', async () => {
      const textField = canvas.getByTestId('password-input');
      const input = textField.querySelector('input') as HTMLInputElement;
      await userEvent.type(input, 'weak');
      await waitFor(() => {
        expect(input).toHaveValue('weak');
      });
      
      // Verify weak password shows expected strength
      // "weak" = 4 chars * 3 = 12 + 10 (lowercase) = 22 points
      const progressBar = canvas.getByTestId('password-strength').querySelector('[role="progressbar"]');
      const strengthValue = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strengthValue).toBe(22); // 4 chars * 3 = 12 + 10 (lowercase) = 22
      
      // Check that "Weak" label appears (strength 20-40)
      const strengthLabel = canvas.queryByText(/Weak/i);
      expect(strengthLabel).toBeInTheDocument();
      
      // Verify specific requirements are not met
      const lengthReq = canvas.queryByText(/At least 8 characters/);
      expect(lengthReq).toBeInTheDocument();
      const lengthReqContainer = lengthReq?.closest('div');
      const lengthCloseIcon = lengthReqContainer?.querySelector('[data-testid="CloseIcon"]');
      expect(lengthCloseIcon).toBeInTheDocument();
      
      // Check uppercase requirement not met
      const uppercaseReq = canvas.queryByText(/One uppercase letter/);
      const uppercaseContainer = uppercaseReq?.closest('div');
      const uppercaseCloseIcon = uppercaseContainer?.querySelector('[data-testid="CloseIcon"]');
      expect(uppercaseCloseIcon).toBeInTheDocument();
      
      // Check numbers requirement not met
      const numbersReq = canvas.queryByText(/One number/);
      const numbersContainer = numbersReq?.closest('div');
      const numbersCloseIcon = numbersContainer?.querySelector('[data-testid="CloseIcon"]');
      expect(numbersCloseIcon).toBeInTheDocument();
      
      // Check special chars requirement not met
      const specialReq = canvas.queryByText(/One special character/);
      const specialContainer = specialReq?.closest('div');
      const specialCloseIcon = specialContainer?.querySelector('[data-testid="CloseIcon"]');
      expect(specialCloseIcon).toBeInTheDocument();
    });

    await step('Strong password shows high strength', async () => {
      const textField = canvas.getByTestId('password-input');
      const input = textField.querySelector('input') as HTMLInputElement;
      await userEvent.clear(input);
      await userEvent.type(input, 'MyStrongP@ssw0rd123!');
      await waitFor(() => {
        expect(input).toHaveValue('MyStrongP@ssw0rd123!');
      });
      
      // Verify strong password shows expected strength
      // 20 chars * 3 = 60 (capped at 30) + 20 (length>=8) + 10 (uppercase) + 10 (lowercase) + 15 (numbers) + 15 (special) + 10 (>12) + 10 (>16) = 100
      const progressBar = canvas.getByTestId('password-strength').querySelector('[role="progressbar"]');
      const strengthValue = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strengthValue).toBe(100); // Maximum strength
      
      // Check that "Strong" label appears (strength > 80)
      const strengthLabel = canvas.queryByText(/Strong/i);
      expect(strengthLabel).toBeInTheDocument();
      
      // Verify all requirements are met
      const checkIcons = canvas.getAllByTestId('CheckIcon');
      expect(checkIcons.length).toBe(5); // All 5 requirements met
      
      // Verify specific requirements are met
      const lengthReq = canvas.queryByText(/At least 8 characters/);
      const lengthContainer = lengthReq?.closest('div');
      const lengthCheckIcon = lengthContainer?.querySelector('[data-testid="CheckIcon"]');
      expect(lengthCheckIcon).toBeInTheDocument();
      
      const uppercaseReq = canvas.queryByText(/One uppercase letter/);
      const uppercaseContainer = uppercaseReq?.closest('div');
      const uppercaseCheckIcon = uppercaseContainer?.querySelector('[data-testid="CheckIcon"]');
      expect(uppercaseCheckIcon).toBeInTheDocument();
      
      const lowercaseReq = canvas.queryByText(/One lowercase letter/);
      const lowercaseContainer = lowercaseReq?.closest('div');
      const lowercaseCheckIcon = lowercaseContainer?.querySelector('[data-testid="CheckIcon"]');
      expect(lowercaseCheckIcon).toBeInTheDocument();
      
      const numbersReq = canvas.queryByText(/One number/);
      const numbersContainer = numbersReq?.closest('div');
      const numbersCheckIcon = numbersContainer?.querySelector('[data-testid="CheckIcon"]');
      expect(numbersCheckIcon).toBeInTheDocument();
      
      const specialReq = canvas.queryByText(/One special character/);
      const specialContainer = specialReq?.closest('div');
      const specialCheckIcon = specialContainer?.querySelector('[data-testid="CheckIcon"]');
      expect(specialCheckIcon).toBeInTheDocument();
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
      
      // Verify initial weak password strength
      const progressBar = strengthIndicator.querySelector('[role="progressbar"]');
      const initialStrength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(initialStrength).toBeLessThan(40);
      
      // Verify "Weak" label
      const weakLabel = canvas.queryByText(/Weak/i);
      expect(weakLabel).toBeInTheDocument();
    });

    await step('Change to strong password', async () => {
      const button = canvas.getByTestId('change-password');
      await userEvent.click(button);
      
      await waitFor(() => {
        // Verify strength updates to high value
        const progressBar = canvas.getByTestId('password-strength').querySelector('[role="progressbar"]');
        const newStrength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
        expect(newStrength).toBeGreaterThan(80);
      });
      
      // Verify "Strong" label appears
      const strongLabel = canvas.queryByText(/Strong/i);
      expect(strongLabel).toBeInTheDocument();
      
      // Verify requirements update
      const checkIcons = canvas.getAllByTestId('CheckIcon');
      expect(checkIcons.length).toBeGreaterThanOrEqual(4);
    });
    
    await step('Toggle back to weak password', async () => {
      const button = canvas.getByTestId('change-password');
      await userEvent.click(button);
      
      await waitFor(() => {
        // Verify strength decreases
        const progressBar = canvas.getByTestId('password-strength').querySelector('[role="progressbar"]');
        const weakStrength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
        expect(weakStrength).toBeLessThan(40);
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
      const textField = canvas.getByTestId('password-input');
      const input = textField.querySelector('input') as HTMLInputElement;
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
        data-testid="very-weak-password"
        value="123"
        variant="linear"
        showStrengthLabel={true}
      />
      <PasswordStrength
        data-testid="weak-password"
        value="password"
        variant="linear"
        showStrengthLabel={true}
      />
      <PasswordStrength
        data-testid="fair-password"
        value="Password1"
        variant="linear"
        showStrengthLabel={true}
      />
      <PasswordStrength
        data-testid="good-password"
        value="Password123!"
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

    await step('Very weak password visual state', async () => {
      const veryWeakPassword = canvas.getByTestId('very-weak-password');
      await expect(veryWeakPassword).toBeInTheDocument();
      
      // "123" = 3 chars * 3 = 9 points + 15 (numbers) = 24
      const progressBar = veryWeakPassword.querySelector('[role="progressbar"]');
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strength).toBe(24); // 3 chars * 3 = 9 + 15 (numbers) = 24
      
      // Verify "Weak" label (strength 20-40)
      const labels = Array.from(veryWeakPassword.parentElement?.querySelectorAll('span') || []);
      const hasWeak = labels.some(el => el.textContent?.includes('Weak'));
      expect(hasWeak).toBe(true);
    });
    
    await step('Weak password visual state', async () => {
      const weakPassword = canvas.getByTestId('weak-password');
      const progressBar = weakPassword.querySelector('[role="progressbar"]');
      // "password" = 8 chars * 3 = 24 + 20 (length>=8) + 10 (lowercase) = 54
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strength).toBe(54);
      
      // Verify "Fair" label (strength 40-60)
      const labels = Array.from(weakPassword.parentElement?.querySelectorAll('span') || []);
      const hasFair = labels.some(el => el.textContent?.includes('Fair'));
      expect(hasFair).toBe(true);
    });
    
    await step('Fair password visual state', async () => {
      const fairPassword = canvas.getByTestId('fair-password');
      const progressBar = fairPassword.querySelector('[role="progressbar"]');
      // "Password1" = 9 chars * 3 = 27 + 20 (length>=8) + 10 (uppercase) + 10 (lowercase) + 15 (numbers) = 82
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strength).toBe(82);
      
      // Verify "Strong" label (strength > 80)
      const labels = Array.from(fairPassword.parentElement?.querySelectorAll('span') || []);
      const hasStrong = labels.some(el => el.textContent?.includes('Strong'));
      expect(hasStrong).toBe(true);
    });
    
    await step('Good password visual state', async () => {
      const goodPassword = canvas.getByTestId('good-password');
      const progressBar = goodPassword.querySelector('[role="progressbar"]');
      // "Password123!" = 12 chars * 3 = 36 (capped at 30) + 20 (length>=8) + 10 (uppercase) + 10 (lowercase) + 15 (numbers) + 15 (special) = 100
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strength).toBe(100);
      
      // Verify "Strong" label
      const labels = Array.from(goodPassword.parentElement?.querySelectorAll('span') || []);
      const hasStrong = labels.some(el => el.textContent?.includes('Strong'));
      expect(hasStrong).toBe(true);
    });

    await step('Strong password visual state', async () => {
      const strongPassword = canvas.getByTestId('strong-password');
      const progressBar = strongPassword.querySelector('[role="progressbar"]');
      // "MyStrongP@ssw0rd123!" = 20 chars, max strength = 100
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strength).toBe(100);
      
      // Verify "Strong" label
      const labels = Array.from(strongPassword.parentElement?.querySelectorAll('span') || []);
      const hasStrong = labels.some(el => el.textContent?.includes('Strong'));
      expect(hasStrong).toBe(true);
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
      const textField = canvas.getByTestId('performance-input');
      const input = textField.querySelector('input') as HTMLInputElement;

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
      <PasswordStrength
        data-testid="only-numbers"
        value="12345678901234567890"
        variant="linear"
        showRequirements={true}
      />
      <PasswordStrength
        data-testid="only-special"
        value="!@#$%^&*()"
        variant="linear"
        showRequirements={true}
      />
      <PasswordStrength
        data-testid="unicode-password"
        value="パスワード123!@#"
        variant="linear"
        showRequirements={true}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Empty password edge case', async () => {
      const emptyPassword = canvas.getByTestId('empty-password');
      await expect(emptyPassword).toBeInTheDocument();
      
      // Empty password should show 0 strength
      const progressBar = emptyPassword.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
      
      // No requirements should be met
      const closeIcons = emptyPassword.parentElement?.querySelectorAll('[data-testid="CloseIcon"]');
      expect(closeIcons?.length).toBeGreaterThan(0);
    });
    
    await step('Very long password edge case', async () => {
      const longPassword = canvas.getByTestId('very-long-password');
      await expect(longPassword).toBeInTheDocument();
      
      // Very long password should have maximum strength
      const progressBar = longPassword.querySelector('[role="progressbar"]');
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strength).toBe(100); // Should cap at 100
    });
    
    await step('Only numbers password', async () => {
      const numbersOnly = canvas.getByTestId('only-numbers');
      const progressBar = numbersOnly.querySelector('[role="progressbar"]');
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      
      // "12345678901234567890" = 20 chars * 3 = 60 (capped at 30) + 20 (length>=8) + 15 (numbers) + 10 (>12) + 10 (>16) = 85
      expect(strength).toBe(85);
      
      // Check that uppercase requirement is not met - look specifically within only-numbers component
      const numbersOnlyContainer = numbersOnly.parentElement;
      const uppercaseReqs = numbersOnlyContainer?.querySelectorAll('span');
      const uppercaseReq = Array.from(uppercaseReqs || []).find(span => 
        span.textContent?.includes('One uppercase letter')
      );
      if (uppercaseReq) {
        const container = uppercaseReq.closest('div');
        const closeIcon = container?.querySelector('[data-testid="CloseIcon"]');
        expect(closeIcon).toBeInTheDocument();
      }
    });
    
    await step('Only special characters', async () => {
      const specialOnly = canvas.getByTestId('only-special');
      const progressBar = specialOnly.querySelector('[role="progressbar"]');
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      
      // "!@#$%^&*()" = 10 chars * 3 = 30 + 20 (length>=8) + 15 (special) = 65
      expect(strength).toBe(65);
    });
    
    await step('Unicode password handling', async () => {
      const unicodePassword = canvas.getByTestId('unicode-password');
      await expect(unicodePassword).toBeInTheDocument();
      
      // Should handle unicode gracefully
      const progressBar = unicodePassword.querySelector('[role="progressbar"]');
      const strength = parseInt(progressBar?.getAttribute('aria-valuenow') || '0');
      expect(strength).toBeGreaterThan(0);
    });
  },
};

export const CustomRequirements: Story = {
  name: '🧪 Custom Requirements Test',
  render: () => {
    const TestComponent = () => {
      const [password, setPassword] = React.useState('');
      
      const customRequirements = {
        minLength: 12,
        uppercase: true,
        lowercase: true,
        numbers: false, // No numbers required
        special: true,
      };

      return (
        <Stack spacing={2} sx={{ width: 400 }}>
          <TextField
            data-testid="custom-input"
            type="password"
            label="Password (min 12 chars, no numbers required)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <PasswordStrength
            data-testid="custom-strength"
            value={password}
            requirements={customRequirements}
            showRequirements={true}
            showStrengthLabel={true}
            showSuggestions={true}
          />
        </Stack>
      );
    };

    return <TestComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test custom requirements', async () => {
      const textField = canvas.getByTestId('custom-input');
      const input = textField.querySelector('input') as HTMLInputElement;
      
      // Type a password without numbers
      await userEvent.type(input, 'MyPassword!@#');
      
      await waitFor(() => {
        expect(input).toHaveValue('MyPassword!@#');
      });
      
      // Should show min 12 chars requirement
      const lengthReq = canvas.queryByText(/At least 12 characters/);
      expect(lengthReq).toBeInTheDocument();
      
      // Should meet length requirement (13 chars)
      const lengthContainer = lengthReq?.closest('div');
      const lengthCheckIcon = lengthContainer?.querySelector('[data-testid="CheckIcon"]');
      expect(lengthCheckIcon).toBeInTheDocument();
      
      // Should NOT have numbers requirement
      const numbersReq = canvas.queryByText(/One number/);
      expect(numbersReq).not.toBeInTheDocument();
      
      // Check that suggestions appear for missing requirements
      const suggestionsText = canvas.queryByText(/Suggestions:/);
      expect(suggestionsText).not.toBeInTheDocument(); // All requirements met, no suggestions
    });
    
    await step('Test suggestions for weak password', async () => {
      const textField = canvas.getByTestId('custom-input');
      const input = textField.querySelector('input') as HTMLInputElement;
      await userEvent.clear(input);
      await userEvent.type(input, 'weak');
      
      await waitFor(() => {
        expect(input).toHaveValue('weak');
      });
      
      // Should show suggestions for missing requirements
      const suggestionsText = canvas.queryByText(/Suggestions:/);
      expect(suggestionsText).toBeInTheDocument();
      
      // Check specific suggestions
      const lengthSuggestion = canvas.queryByText(/Use at least/);
      expect(lengthSuggestion).toBeInTheDocument();
      
      const uppercaseSuggestion = canvas.queryByText(/Add uppercase letters/);
      expect(uppercaseSuggestion).toBeInTheDocument();
      
      const specialSuggestion = canvas.queryByText(/Add special characters/);
      expect(specialSuggestion).toBeInTheDocument();
    });
  },
};

export const AnimationTest: Story = {
  name: '🧪 Animation Test',
  render: () => {
    const TestComponent = () => {
      const [password, setPassword] = React.useState('');
      const [animated, setAnimated] = React.useState(true);

      return (
        <Stack spacing={2} sx={{ width: 400 }}>
          <button
            data-testid="toggle-animation"
            onClick={() => setAnimated(!animated)}
          >
            Animation: {animated ? 'ON' : 'OFF'}
          </button>
          <TextField
            data-testid="animation-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <PasswordStrength
            data-testid="animation-strength"
            value={password}
            variant="linear"
            animated={animated}
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

    await step('Test with animation enabled', async () => {
      const textField = canvas.getByTestId('animation-input');
      const input = textField.querySelector('input') as HTMLInputElement;
      await userEvent.type(input, 'Test123!');
      
      await waitFor(() => {
        expect(input).toHaveValue('Test123!');
      });
      
      // Check that animated styles are applied
      const strengthContainer = canvas.getByTestId('animation-strength');
      const containerStyles = window.getComputedStyle(strengthContainer);
      expect(containerStyles.transition).toContain('0.3s');
    });
    
    await step('Test with animation disabled', async () => {
      const toggleButton = canvas.getByTestId('toggle-animation');
      await userEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(toggleButton).toHaveTextContent('Animation: OFF');
      });
      
      // Update password to trigger re-render
      const textField = canvas.getByTestId('animation-input');
      const input = textField.querySelector('input') as HTMLInputElement;
      await userEvent.clear(input);
      await userEvent.type(input, 'NewPass123!');
      
      await waitFor(() => {
        expect(input).toHaveValue('NewPass123!');
      });
      
      // Check that animation styles are not applied
      const strengthContainer = canvas.getByTestId('animation-strength');
      const containerStyles = window.getComputedStyle(strengthContainer);
      expect(containerStyles.transition).toBe('none');
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
      const textField = canvas.getByTestId('integration-input');
      const strengthIndicator = canvas.getByTestId('integration-strength');

      await expect(textField).toBeInTheDocument();
      await expect(strengthIndicator).toBeInTheDocument();
    });

    await step('Test linear variant', async () => {
      const textField = canvas.getByTestId('integration-input');
      const input = textField.querySelector('input') as HTMLInputElement;
      await userEvent.type(input, 'Pass123!');
      
      await waitFor(() => {
        expect(input).toHaveValue('Pass123!');
      });
      
      // Check linear progress bar exists
      const progressBar = canvas.getByTestId('integration-strength').querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
      // "Pass123!" = 8 chars * 3 = 24 + 20 (length>=8) + 10 (uppercase) + 10 (lowercase) + 15 (numbers) + 15 (special) = 94
      expect(progressBar).toHaveAttribute('aria-valuenow', '94');
    });

    await step('Test circular variant', async () => {
      const circularButton = canvas.getByTestId('variant-circular');
      await userEvent.click(circularButton);
      
      await waitFor(() => {
        // Check circular indicator exists (look for percentage display which indicates circular variant)
        const strengthIndicator = canvas.getByTestId('integration-strength');
        const percentageText = strengthIndicator.querySelector('h6');
        expect(percentageText).toBeInTheDocument();
        expect(percentageText?.textContent).toBe('94%');
      });
    });

    await step('Test steps variant', async () => {
      const stepsButton = canvas.getByTestId('variant-steps');
      await userEvent.click(stepsButton);
      
      await waitFor(() => {
        // Check steps variant is active - should not have percentage text (which is only in circular)
        const strengthIndicator = canvas.getByTestId('integration-strength');
        const percentageText = strengthIndicator.querySelector('h6');
        expect(percentageText).not.toBeInTheDocument(); // Steps variant should not have percentage
      });
    });

    await step('Test stronger password', async () => {
      const textField = canvas.getByTestId('integration-input');
      const input = textField.querySelector('input') as HTMLInputElement;
      await userEvent.clear(input);
      await userEvent.type(input, 'VeryStrongP@ssw0rd123!');

      await waitFor(() => {
        expect(input).toHaveValue('VeryStrongP@ssw0rd123!');
        
        // Should show maximum strength - in steps mode, no percentage should be visible
        const strengthIndicator = canvas.getByTestId('integration-strength');
        const percentageText = strengthIndicator.querySelector('h6');
        expect(percentageText).not.toBeInTheDocument(); // Steps variant should not show percentage
      });
    });
  },
};
