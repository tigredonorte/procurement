import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import { CreditCard, Banknote, Smartphone, Globe, Star, Heart, Zap, Shield } from 'lucide-react';
import { useState } from 'react';

import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'cards', 'buttons', 'segments'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    direction: {
      control: { type: 'select' },
      options: ['row', 'column'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const paymentOptions = [
  { value: 'card', label: 'Credit Card', icon: <CreditCard size={20} />, description: 'Pay with your credit or debit card' },
  { value: 'cash', label: 'Cash', icon: <Banknote size={20} />, description: 'Pay with cash on delivery' },
  { value: 'mobile', label: 'Mobile Pay', icon: <Smartphone size={20} />, description: 'Use your mobile wallet' },
  { value: 'online', label: 'Online Banking', icon: <Globe size={20} />, description: 'Transfer from your bank account' },
];

const simpleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const priorityOptions = [
  { value: 'low', label: 'Low', icon: <Shield size={16} /> },
  { value: 'medium', label: 'Medium', icon: <Star size={16} /> },
  { value: 'high', label: 'High', icon: <Zap size={16} /> },
  { value: 'critical', label: 'Critical', icon: <Heart size={16} /> },
];

export const Default: Story = {
  args: {
    options: simpleOptions,
    label: 'Select an option',
    variant: 'default',
  },
};

const VariantsComponent = () => {
const [values, setValues] = useState<Record<string, string>>({
      default: '',
      cards: '',
      buttons: '',
      segments: '',
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Default</Typography>
          <RadioGroup
            variant="default"
            options={paymentOptions}
            value={values.default}
            onChange={(e) => setValues(prev => ({ ...prev, default: e.target.value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Cards</Typography>
          <RadioGroup
            variant="cards"
            options={paymentOptions}
            value={values.cards}
            onChange={(e) => setValues(prev => ({ ...prev, cards: e.target.value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Buttons</Typography>
          <RadioGroup
            variant="buttons"
            options={priorityOptions}
            direction="row"
            value={values.buttons}
            onChange={(e) => setValues(prev => ({ ...prev, buttons: e.target.value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Segments</Typography>
          <RadioGroup
            variant="segments"
            options={priorityOptions}
            value={values.segments}
            onChange={(e) => setValues(prev => ({ ...prev, segments: e.target.value }))}
          />
        </Box>
      </Box>
    );
};

export const Variants: Story = {
  render: () => <VariantsComponent />,
};

const ColorsComponent = () => {
const [values, setValues] = useState({
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      danger: '',
      neutral: '',
    });

    const colors = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {colors.map((color) => (
          <Box key={color}>
            <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
              {color}
            </Typography>
            <RadioGroup
              variant="buttons"
              color={color}
              options={priorityOptions}
              direction="row"
              value={values[color]}
              onChange={(e) => setValues(prev => ({ ...prev, [color]: e.target.value }))}
            />
          </Box>
        ))}
      </Box>
    );
};

export const Colors: Story = {
  render: () => <ColorsComponent />,
};

const SizesComponent = () => {
const [values, setValues] = useState({
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    });

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sizes.map((size) => (
          <Box key={size}>
            <Typography variant="h6" gutterBottom>
              Size: {size.toUpperCase()}
            </Typography>
            <RadioGroup
              variant="buttons"
              size={size}
              options={priorityOptions}
              direction="row"
              value={values[size]}
              onChange={(e) => setValues(prev => ({ ...prev, [size]: e.target.value }))}
            />
          </Box>
        ))}
      </Box>
    );
};

export const Sizes: Story = {
  render: () => <SizesComponent />,
};

const CardVariantComponent = () => {
const [value, setValue] = useState('');

    return (
      <RadioGroup
        variant="cards"
        label="Payment Method"
        options={paymentOptions}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        showDescriptions
      />
    );
};

export const CardVariant: Story = {
  render: () => <CardVariantComponent />,
};

const SpecialEffectsComponent = () => {
const [values, setValues] = useState({
      glass: '',
      gradient: '',
      glow: '',
      glassLabel: '',
    });

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Glass Morphism</Typography>
          <RadioGroup
            variant="cards"
            glass
            options={priorityOptions}
            value={values.glass}
            onChange={(e) => setValues(prev => ({ ...prev, glass: e.target.value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Gradient</Typography>
          <RadioGroup
            variant="buttons"
            gradient
            color="secondary"
            options={priorityOptions}
            direction="row"
            value={values.gradient}
            onChange={(e) => setValues(prev => ({ ...prev, gradient: e.target.value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Glow Effect</Typography>
          <RadioGroup
            variant="cards"
            glow
            color="success"
            options={priorityOptions}
            value={values.glow}
            onChange={(e) => setValues(prev => ({ ...prev, glow: e.target.value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Glass Label</Typography>
          <RadioGroup
            variant="segments"
            glassLabel
            label="Priority Level"
            options={priorityOptions}
            value={values.glassLabel}
            onChange={(e) => setValues(prev => ({ ...prev, glassLabel: e.target.value }))}
          />
        </Box>
      </Box>
    );
};

export const SpecialEffects: Story = {
  render: () => <SpecialEffectsComponent />,
};

const WithDirectionsComponent = () => {
const [values, setValues] = useState({
      column: '',
      row: '',
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="h6" gutterBottom>Column Layout</Typography>
          <RadioGroup
            variant="buttons"
            direction="column"
            options={priorityOptions}
            value={values.column}
            onChange={(e) => setValues(prev => ({ ...prev, column: e.target.value }))}
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Row Layout</Typography>
          <RadioGroup
            variant="buttons"
            direction="row"
            options={priorityOptions}
            value={values.row}
            onChange={(e) => setValues(prev => ({ ...prev, row: e.target.value }))}
          />
        </Box>
      </Box>
    );
};

export const WithDirections: Story = {
  render: () => <WithDirectionsComponent />,
};

const ErrorStateComponent = () => {
const [value, setValue] = useState('');

    return (
      <RadioGroup
        variant="cards"
        label="Required Selection"
        options={paymentOptions}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error
        helperText="Please select a payment method"
        showDescriptions
      />
    );
};

export const ErrorState: Story = {
  render: () => <ErrorStateComponent />,
};

export const Playground: Story = {
  args: {
    options: paymentOptions,
    label: 'Payment Method',
    helperText: 'Choose your preferred payment method',
    variant: 'cards',
    color: 'primary',
    size: 'md',
    direction: 'column',
    showDescriptions: true,
    glass: false,
    gradient: false,
    glow: false,
    glassLabel: false,
    error: false,
  },
};