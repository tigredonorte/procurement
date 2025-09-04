# Component Library Architecture

[← Back to Main Documentation](./readme.md)

---

## Library Structure

```typescript
// Core wrapper around Material UI
interface UIProvider {
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

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'glass' | 'gradient';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  glow?: boolean;
  pulse?: boolean;
}

const Button: React.FC<ButtonProps> = ({
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
import React, { PureComponent, createContext } from 'react';

interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  colors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    danger?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: {
      base?: number;
      scale?: number;
    };
  };
  borderRadius?: {
    base?: number;
  };
}

export const ThemeContext = createContext<ThemeConfig | null>(null);

export class ThemeProvider extends PureComponent<{ theme: ThemeConfig; children: React.ReactNode }> {
  componentDidMount() {
    this.applyTheme();
  }

  componentDidUpdate(prevProps: { theme: ThemeConfig }) {
    if (prevProps.theme !== this.props.theme) {
      this.applyTheme();
    }
  }

  applyTheme = () => {
    const { theme } = this.props;
    const root = document.documentElement;

    // Apply theme mode
    if (theme.mode === 'dark') {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else if (theme.mode === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    } else {
      // Auto mode - follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark-mode', prefersDark);
      root.classList.toggle('light-mode', !prefersDark);
    }

    // Apply custom CSS variables
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }

    if (theme.typography?.fontFamily) {
      root.style.setProperty('--font-family', theme.typography.fontFamily);
    }

    if (theme.borderRadius?.base) {
      root.style.setProperty('--border-radius-base', `${theme.borderRadius.base}px`);
    }
  };

  render() {
    return (
      <ThemeContext.Provider value={this.props.theme}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
};
```

---

[Next: Responsive Design →](./10-responsive-design.md)