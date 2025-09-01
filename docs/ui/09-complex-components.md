# Complex Components

[← Back to Main Documentation](./Readme.md)

---

## Data Table Component

```typescript
interface PRADataTableProps {
  variant?: 'default' | 'striped' | 'glass' | 'minimal';
  density?: 'compact' | 'normal' | 'comfortable';
  stickyHeader?: boolean;
  enhancedHover?: boolean;
  sortable?: boolean;
  selectable?: boolean;
}

const tableStyles = {
  glass: {
    '& .MuiTableContainer-root': {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px'
    },
    '& .MuiTableHead-root': {
      background: 'rgba(99,102,241,0.05)'
    },
    '& .MuiTableRow-root:hover': {
      background: 'rgba(99,102,241,0.03)'
    }
  },
  striped: {
    '& .MuiTableRow-root:nth-of-type(even)': {
      background: 'var(--color-neutral-50)'
    }
  }
};
```

## Chart Component

```typescript
interface PRAChartProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar';
  variant?: 'default' | 'gradient' | 'glass' | 'minimal';
  animated?: boolean;
  interactive?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

const chartTheme = {
  gradient: {
    colors: [
      'rgba(99, 102, 241, 1)',
      'rgba(139, 92, 246, 1)',
      'rgba(6, 182, 212, 1)',
      'rgba(34, 211, 238, 1)'
    ],
    gradients: true,
    tooltip: {
      background: 'rgba(17, 24, 39, 0.9)',
      backdropFilter: 'blur(10px)'
    }
  }
};
```

## Navigation Component

```typescript
interface PRANavigationProps {
  variant?: 'sidebar' | 'top' | 'bottom' | 'floating';
  style?: 'default' | 'glass' | 'gradient' | 'minimal';
  collapsible?: boolean;
  sticky?: boolean;
}

const navigationStyles = {
  floating: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(17, 24, 39, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '8px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  glass: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255,255,255,0.1)'
  }
};
```

## Form Component

```typescript
interface PRAFormProps {
  variant?: 'default' | 'floating' | 'stepped' | 'wizard';
  layout?: 'vertical' | 'horizontal' | 'inline';
  validation?: 'immediate' | 'onBlur' | 'onSubmit';
  enhanced?: boolean; // Advanced animations and interactions
}

const formStyles = {
  floating: {
    '& .MuiFormControl-root': {
      '& .MuiInputLabel-root': {
        transform: 'translateY(16px)',
        '&.Mui-focused, &.MuiFormLabel-filled': {
          transform: 'translateY(-20px) scale(0.85)',
          background: 'var(--bg-primary)',
          padding: '0 8px'
        }
      }
    }
  },
  wizard: {
    '& .form-step': {
      animation: 'slideIn 0.3s ease-out'
    },
    '& .step-indicator': {
      background: 'linear-gradient(90deg, var(--color-primary) var(--progress), var(--color-neutral-200) var(--progress))'
    }
  }
};
```

---

[Next: Responsive Design →](./10-responsive-design.md)