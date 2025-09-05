import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Typography, Paper, TextField, Alert } from '@mui/material';
import React from 'react';

import { PasswordStrength } from './PasswordStrength';

const meta = {
  title: 'Enhanced/PasswordStrength',
  component: PasswordStrength,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A password strength indicator component with real-time feedback, requirements checking, and beautiful visual indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['linear', 'circular', 'steps', 'detailed'],
      description: 'Visual style of the strength indicator',
    },
    showRequirements: {
      control: 'boolean',
      description: 'Show password requirements checklist',
    },
    showStrengthText: {
      control: 'boolean',
      description: 'Show strength level text',
    },
    showSuggestions: {
      control: 'boolean',
      description: 'Show password improvement suggestions',
    },
    minLength: {
      control: { type: 'number', min: 6, max: 20 },
      description: 'Minimum password length',
    },
  },
} satisfies Meta<typeof PasswordStrength>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultComponent = () => {
const [password, setPassword] = React.useState('');
    
    return (
      <Stack spacing={3} sx={{ maxWidth: 400 }}>
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          placeholder="Enter your password"
        />
        <PasswordStrength
          password={password}
          variant="linear"
          showRequirements={true}
          showStrengthText={true}
        />
      </Stack>
    );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};

const AllVariantsComponent = () => {
const [password, setPassword] = React.useState('MyP@ssw0rd123!');
    
    return (
      <Stack spacing={4}>
        <TextField
          type="password"
          label="Test Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          helperText="Try different passwords to see the indicators change"
        />
        
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Linear Progress</Typography>
            <PasswordStrength
              password={password}
              variant="linear"
              showStrengthText={true}
            />
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Circular Progress</Typography>
            <PasswordStrength
              password={password}
              variant="circular"
              showStrengthText={true}
            />
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Steps Indicator</Typography>
            <PasswordStrength
              password={password}
              variant="steps"
              showStrengthText={true}
            />
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Detailed View</Typography>
            <PasswordStrength
              password={password}
              variant="detailed"
              showStrengthText={true}
            />
          </Paper>
        </Box>
      </Stack>
    );
};

export const AllVariants: Story = {
  render: () => <AllVariantsComponent />,
};

const WithRequirementsComponent = () => {
const [password, setPassword] = React.useState('');
    
    return (
      <Stack spacing={3} sx={{ maxWidth: 500 }}>
        <Typography variant="h6">Create a Strong Password</Typography>
        
        <TextField
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          placeholder="Enter a strong password"
        />
        
        <PasswordStrength
          password={password}
          variant="linear"
          showRequirements={true}
          showStrengthText={true}
          showSuggestions={true}
          requirements={{
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
          }}
        />
      </Stack>
    );
};

export const WithRequirements: Story = {
  render: () => <WithRequirementsComponent />,
};

export const PasswordComparison: Story = {
  render: () => {
    const passwords = {
      weak: 'password',
      fair: 'Password1',
      good: 'MyPassword123',
      strong: 'MyP@ssw0rd!',
      veryStrong: 'MyS3cur3P@ssw0rd!2024',
    };
    
    return (
      <Stack spacing={3}>
        <Typography variant="h6">Password Strength Examples</Typography>
        
        {Object.entries(passwords).map(([level, pwd]) => (
          <Paper key={level} sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'capitalize' }}>
              {level}: "{pwd}"
            </Typography>
            <PasswordStrength
              password={pwd}
              variant="linear"
              showStrengthText={true}
            />
          </Paper>
        ))}
      </Stack>
    );
  },
};

const RegistrationFormComponent = () => {
const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showSuccess, setShowSuccess] = React.useState(false);
    
    const passwordsMatch = password === confirmPassword && password !== '';
    const isStrong = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    
    const handleSubmit = () => {
      if (passwordsMatch && isStrong) {
        setShowSuccess(true);
        window.setTimeout(() => setShowSuccess(false), 3000);
      }
    };
    
    return (
      <Stack spacing={3} sx={{ maxWidth: 400 }}>
        <Typography variant="h6">Create Your Account</Typography>
        
        <TextField
          label="Email"
          type="email"
          fullWidth
          defaultValue="user@example.com"
        />
        
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        
        <PasswordStrength
          password={password}
          variant="linear"
          showRequirements={true}
          showStrengthText={true}
        />
        
        <TextField
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          error={confirmPassword !== '' && !passwordsMatch}
          helperText={confirmPassword !== '' && !passwordsMatch ? 'Passwords do not match' : ''}
        />
        
        {showSuccess && (
          <Alert severity="success">Account created successfully!</Alert>
        )}
        
        <button 
          onClick={handleSubmit}
          disabled={!passwordsMatch || !isStrong}
        >
          Create Account
        </button>
      </Stack>
    );
};

export const RegistrationForm: Story = {
  render: () => <RegistrationFormComponent />,
};

const WithCustomRequirementsComponent = () => {
const [password, setPassword] = React.useState('');
    
    return (
      <Stack spacing={3} sx={{ maxWidth: 500 }}>
        <Typography variant="h6">Enterprise Password Policy</Typography>
        
        <Alert severity="info">
          Your organization requires strong passwords for security
        </Alert>
        
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        
        <PasswordStrength
          password={password}
          variant="detailed"
          showRequirements={true}
          showStrengthText={true}
          showSuggestions={true}
          requirements={{
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            disallowCommon: true,
            disallowRepeating: true,
          }}
          customMessages={{
            weak: 'Too weak - Not acceptable',
            fair: 'Fair - Needs improvement',
            good: 'Good - Almost there',
            strong: 'Strong - Acceptable',
            veryStrong: 'Very Strong - Excellent!',
          }}
        />
      </Stack>
    );
};

export const WithCustomRequirements: Story = {
  render: () => <WithCustomRequirementsComponent />,
};

const RealTimeValidationComponent = () => {
const [password, setPassword] = React.useState('');
    const [focused, setFocused] = React.useState(false);
    
    return (
      <Stack spacing={3} sx={{ maxWidth: 400 }}>
        <Typography variant="h6">Real-time Password Validation</Typography>
        
        <TextField
          type="password"
          label="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          fullWidth
          placeholder="Start typing..."
        />
        
        {(focused || password) && (
          <PasswordStrength
            password={password}
            variant="linear"
            showRequirements={true}
            showStrengthText={true}
            showSuggestions={focused}
            animated={true}
          />
        )}
        
        {password.length > 0 && (
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="caption">
              Password entropy: {(password.length * 4.3).toFixed(0)} bits
            </Typography>
          </Paper>
        )}
      </Stack>
    );
};

export const RealTimeValidation: Story = {
  render: () => <RealTimeValidationComponent />,
};

const MinimalIndicatorComponent = () => {
const [password, setPassword] = React.useState('');
    
    return (
      <Stack spacing={2} sx={{ maxWidth: 300 }}>
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          size="small"
        />
        <PasswordStrength
          password={password}
          variant="linear"
          showRequirements={false}
          showStrengthText={false}
          showSuggestions={false}
        />
      </Stack>
    );
};

export const MinimalIndicator: Story = {
  render: () => <MinimalIndicatorComponent />,
};