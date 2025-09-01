# Component Library Architecture

[← Back to Main Documentation](./Readme.md)

---

## Library Structure

```typescript
// Core wrapper around Material UI
interface PRAUIProvider {
  theme: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  density?: 'compact' | 'normal' | 'comfortable';
}
```

## Component API Pattern

```typescript
// Example: Button Component wrapping MUI
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface PRAButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'glass' | 'gradient';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  glow?: boolean;
  pulse?: boolean;
}

const PRAButton: React.FC<PRAButtonProps> = ({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  loading = false,
  glow = false,
  pulse = false,
  ...props
}) => {
  // Custom styling logic
  const customStyles = generateButtonStyles({ variant, color, size, glow, pulse });
  
  return (
    <MuiButton
      {...props}
      sx={customStyles}
      disabled={loading || props.disabled}
    >
      {loading ? <Spinner size={size} /> : props.children}
    </MuiButton>
  );
};
```

## Theme Provider Implementation

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const createPRATheme = (mode: 'light' | 'dark', customization?: ThemeCustomization) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: customization?.primaryColor || '#6366F1',
        light: '#818CF8',
        dark: '#4338CA',
        contrastText: '#FFFFFF'
      },
      secondary: {
        main: customization?.secondaryColor || '#06B6D4',
        light: '#22D3EE',
        dark: '#0E7490',
        contrastText: '#FFFFFF'
      },
      background: {
        default: mode === 'light' ? '#F8FAFC' : '#0F172A',
        paper: mode === 'light' ? '#FFFFFF' : '#1E293B'
      }
    },
    typography: {
      fontFamily: customization?.fontFamily || 'Inter, sans-serif',
      h1: { ...typeScale['display-xl'] },
      h2: { ...typeScale['display-lg'] },
      h3: { ...typeScale['display-md'] },
      h4: { ...typeScale['display-sm'] },
      h5: { ...typeScale['display-xs'] },
      h6: { ...typeScale['text-xl'] },
      body1: { ...typeScale['text-md'] },
      body2: { ...typeScale['text-sm'] }
    },
    shape: {
      borderRadius: radiusMap[customization?.borderRadius || 'md']
    },
    components: {
      // Override all MUI components here
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }
      }
    }
  });
};
```

---

[Next: Core Components →](./08-core-components.md)