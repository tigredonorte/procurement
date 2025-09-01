# Epic F — Comprehensive UI/UX Design System Implementation

[← Back to Tasks Overview](./Readme.md)

---

## Goal Statement
Implement a comprehensive, accessible, and scalable design system that provides consistent user experience across all Requisio.com interfaces, supporting both light and dark themes, multiple density levels, and advanced interaction patterns while maintaining WCAG AAA accessibility compliance.

## Success Criteria
- Complete design system with 50+ reusable components
- WCAG AAA accessibility compliance across all interfaces
- Seamless light/dark mode switching with user preference persistence
- Responsive design supporting mobile, tablet, and desktop experiences
- Advanced interaction patterns including stacked modals and complex workflows
- Performance targets: <2s page load, <100ms component render times
- Developer experience: Clear documentation and easy component adoption

## Technical Requirements

### Design System Foundation
- **Component Library**: Custom components built on Material-UI foundation
- **Theme System**: Comprehensive theming with design tokens
- **Typography**: Scalable font system with semantic text styles
- **Color System**: Accessible color palettes with automatic contrast validation
- **Spacing System**: Consistent 8px grid system with responsive scaling
- **Motion Design**: Purposeful animations with reduced motion support

### Accessibility Standards
- **WCAG AAA Compliance**: All components meet highest accessibility standards
- **Keyboard Navigation**: Complete keyboard accessibility for all interactions
- **Screen Reader Support**: Comprehensive ARIA implementation
- **Focus Management**: Logical focus flow and visible focus indicators
- **Color Accessibility**: Minimum 7:1 contrast ratios for all text

## Tasks

### F1. Comprehensive Design System Foundation
**Priority**: Critical | **Effort**: L | **Dependencies**: A1

**Scope:**
- Implement complete design token system with semantic naming
- Create comprehensive theme architecture supporting multiple variants
- Set up responsive typography system with fluid scaling
- Implement advanced color system with automatic accessibility validation
- Create spacing and layout systems with consistent patterns

**Technical Implementation:**

**Design Token Architecture:**
```typescript
// Design tokens with semantic naming
const designTokens = {
  colors: {
    // Base color palette
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb', 
      500: '#2196f3',  // Main brand color
      900: '#0d47a1',
    },
    semantic: {
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Fira Code", "Monaco", "Cascadia Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    0: '0px',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};
```

**Advanced Theme System:**
```typescript
interface ThemeConfig {
  mode: 'light' | 'dark';
  density: 'compact' | 'comfortable' | 'spacious';
  colorScheme: 'default' | 'high-contrast' | 'colorblind-friendly';
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const createTheme = (config: ThemeConfig): Theme => {
  const { mode, density, colorScheme, reducedMotion, fontSize } = config;
  
  return {
    palette: createPalette(mode, colorScheme),
    typography: createTypography(fontSize),
    spacing: createSpacing(density),
    components: createComponents(config),
    transitions: createTransitions(reducedMotion),
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      },
    },
  };
};

const createPalette = (mode: 'light' | 'dark', colorScheme: string) => {
  const baseColors = designTokens.colors;
  
  return {
    mode,
    primary: {
      main: baseColors.primary[500],
      light: baseColors.primary[100],
      dark: baseColors.primary[900],
      contrastText: mode === 'light' ? '#ffffff' : '#000000',
    },
    background: {
      default: mode === 'light' ? '#ffffff' : '#0a0a0a',
      paper: mode === 'light' ? '#ffffff' : '#1a1a1a',
      elevated: mode === 'light' ? '#f8f9fa' : '#2a2a2a',
    },
    text: {
      primary: mode === 'light' ? baseColors.neutral[900] : '#ffffff',
      secondary: mode === 'light' ? baseColors.neutral[600] : '#a0a0a0',
      disabled: mode === 'light' ? baseColors.neutral[400] : '#666666',
    },
    // Additional semantic colors
    success: createSemanticColorPalette(baseColors.semantic.success, mode),
    warning: createSemanticColorPalette(baseColors.semantic.warning, mode),
    error: createSemanticColorPalette(baseColors.semantic.error, mode),
    info: createSemanticColorPalette(baseColors.semantic.info, mode),
  };
};
```

**Responsive Typography System:**
```typescript
const createTypography = (fontSize: 'small' | 'medium' | 'large') => {
  const sizeMultiplier = {
    small: 0.875,
    medium: 1,
    large: 1.125,
  }[fontSize];

  return {
    fontFamily: designTokens.typography.fontFamily.primary,
    h1: {
      fontSize: `${2.25 * sizeMultiplier}rem`,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: `${1.875 * sizeMultiplier}rem`,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: `${1.5 * sizeMultiplier}rem`,
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: `${1.25 * sizeMultiplier}rem`,
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: `${1.125 * sizeMultiplier}rem`,
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: `${1 * sizeMultiplier}rem`,
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: `${1 * sizeMultiplier}rem`,
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: `${0.875 * sizeMultiplier}rem`,
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: `${0.75 * sizeMultiplier}rem`,
      fontWeight: 400,
      lineHeight: 1.4,
    },
  };
};
```

**Accessibility Color Validation:**
```typescript
class AccessibilityValidator {
  static validateContrast(
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AAA'
  ): { valid: boolean; ratio: number; recommendation?: string } {
    const ratio = this.calculateContrastRatio(foreground, background);
    const requiredRatio = level === 'AAA' ? 7 : 4.5;
    
    return {
      valid: ratio >= requiredRatio,
      ratio,
      recommendation: ratio < requiredRatio 
        ? `Increase contrast. Current: ${ratio.toFixed(2)}, Required: ${requiredRatio}`
        : undefined,
    };
  }

  static generateAccessiblePalette(baseColor: string): ColorPalette {
    const palette = this.generateColorScale(baseColor);
    
    // Validate all combinations
    const validatedPalette = palette.map(color => {
      const lightBg = this.validateContrast(color, '#ffffff');
      const darkBg = this.validateContrast(color, '#000000');
      
      return {
        ...color,
        accessibility: {
          lightBackground: lightBg,
          darkBackground: darkBg,
          recommended: lightBg.valid || darkBg.valid,
        },
      };
    });
    
    return validatedPalette;
  }
}
```

**Acceptance Criteria:**
- [ ] Complete design token system implemented with semantic naming
- [ ] Theme switching works seamlessly between light/dark modes
- [ ] Typography system supports multiple size preferences
- [ ] Color system passes WCAG AAA contrast requirements
- [ ] Spacing system provides consistent visual rhythm
- [ ] Design tokens are consumed consistently across components
- [ ] Theme preferences persist across browser sessions
- [ ] High contrast and colorblind-friendly options available

**Files Created:**
- `packages/frontend/src/theme/tokens.ts`
- `packages/frontend/src/theme/createTheme.ts`
- `packages/frontend/src/theme/accessibility.ts`
- `packages/frontend/src/hooks/useTheme.ts`
- `packages/frontend/src/contexts/ThemeContext.tsx`

---

### F2. Advanced Component Library Development
**Priority**: Critical | **Effort**: XL | **Dependencies**: F1

**Scope:**
- Build comprehensive component library with 50+ components
- Implement advanced interaction patterns (stacked modals, complex workflows)
- Create data display components with virtualization support
- Develop form components with advanced validation and accessibility
- Implement navigation and layout components with responsive behavior

**Technical Implementation:**

**Core Component Architecture:**
```typescript
// Base component interface
interface ComponentProps {
  className?: string;
  testId?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  children?: React.ReactNode;
}

// Enhanced button component
interface ButtonProps extends ComponentProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { 
    variant = 'primary',
    size = 'md', 
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    className,
    testId,
    onClick,
    ...props 
  },
  ref
) => {
  const theme = useTheme();
  const buttonStyles = useMemo(() => createButtonStyles({
    variant,
    size,
    loading,
    disabled,
    fullWidth,
    theme,
  }), [variant, size, loading, disabled, fullWidth, theme]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }, [disabled, loading, onClick]);

  return (
    <button
      ref={ref}
      className={clsx(buttonStyles.root, className)}
      disabled={disabled || loading}
      data-testid={testId}
      onClick={handleClick}
      {...props}
    >
      {loading && <Spinner size={size} className={buttonStyles.spinner} />}
      {leftIcon && !loading && (
        <span className={buttonStyles.leftIcon}>{leftIcon}</span>
      )}
      <span className={buttonStyles.content}>{children}</span>
      {rightIcon && !loading && (
        <span className={buttonStyles.rightIcon}>{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
```

**Advanced Modal System (Stacked Modals):**
```typescript
interface ModalStackContextType {
  modals: Modal[];
  openModal: (modal: ModalConfig) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  currentModal: Modal | null;
}

const ModalStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<Modal[]>([]);
  const [zIndexBase, setZIndexBase] = useState(1300);

  const openModal = useCallback((config: ModalConfig): string => {
    const id = uuidv4();
    const modal: Modal = {
      id,
      ...config,
      zIndex: zIndexBase + modals.length,
      onClose: () => {
        config.onClose?.();
        closeModal(id);
      },
    };
    
    setModals(prev => [...prev, modal]);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return id;
  }, [modals.length, zIndexBase]);

  const closeModal = useCallback((id?: string) => {
    setModals(prev => {
      const newModals = id 
        ? prev.filter(modal => modal.id !== id)
        : prev.slice(0, -1); // Close top modal if no ID provided
      
      // Restore body scroll if no modals remain
      if (newModals.length === 0) {
        document.body.style.overflow = '';
      }
      
      return newModals;
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
    document.body.style.overflow = '';
  }, []);

  const currentModal = modals[modals.length - 1] || null;

  return (
    <ModalStackContext.Provider value={{
      modals,
      openModal,
      closeModal,
      closeAllModals,
      currentModal,
    }}>
      {children}
      <ModalRenderer modals={modals} />
    </ModalStackContext.Provider>
  );
};

const ModalRenderer: React.FC<{ modals: Modal[] }> = ({ modals }) => {
  return (
    <>
      {modals.map((modal, index) => (
        <ModalComponent
          key={modal.id}
          modal={modal}
          isTopModal={index === modals.length - 1}
        />
      ))}
    </>
  );
};
```

**Data Table with Virtualization:**
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filtering?: FilteringConfig;
  selection?: SelectionConfig;
  virtualization?: VirtualizationConfig;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
}

const DataTable = <T extends Record<string, any>>(
  props: DataTableProps<T>
) => {
  const {
    data,
    columns,
    loading = false,
    pagination,
    sorting,
    filtering,
    selection,
    virtualization,
    onRowClick,
    onSelectionChange,
  } = props;

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({});
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  
  // Virtual scrolling for large datasets
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableRef.current,
    estimateSize: () => virtualization?.estimatedRowHeight || 40,
    overscan: 10,
  });

  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply filtering
    if (Object.keys(filterConfig).length > 0) {
      result = result.filter(row => 
        Object.entries(filterConfig).every(([key, filterValue]) => {
          const cellValue = row[key];
          return applyFilter(cellValue, filterValue);
        })
      );
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [data, sortConfig, filterConfig]);

  return (
    <div className="data-table">
      <TableHeader
        columns={columns}
        sortConfig={sortConfig}
        onSort={setSortConfig}
        filterConfig={filterConfig}
        onFilter={setFilterConfig}
        selection={selection}
        selectedCount={selectedRows.size}
        totalCount={processedData.length}
        onSelectAll={handleSelectAll}
      />
      
      <div ref={tableRef} className="table-body" style={{ height: '400px', overflow: 'auto' }}>
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map(virtualRow => {
            const row = processedData[virtualRow.index];
            return (
              <TableRow
                key={virtualRow.index}
                row={row}
                columns={columns}
                selected={selectedRows.has(row.id)}
                onClick={() => onRowClick?.(row)}
                onSelect={() => handleRowSelect(row.id)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
      
      {pagination && (
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={Math.ceil(processedData.length / pagination.pageSize)}
          pageSize={pagination.pageSize}
          totalItems={processedData.length}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  );
};
```

**Advanced Form Components:**
```typescript
interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  description,
  required = false,
  error,
  touched = false,
  disabled = false,
  children,
}) => {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;
  const hasError = touched && error;

  return (
    <div className={clsx('form-field', {
      'form-field--error': hasError,
      'form-field--disabled': disabled,
    })}>
      {label && (
        <label htmlFor={fieldId} className="form-field__label">
          {label}
          {required && (
            <span className="form-field__required" aria-label="Required">
              *
            </span>
          )}
        </label>
      )}
      
      {description && (
        <p id={descriptionId} className="form-field__description">
          {description}
        </p>
      )}
      
      <div className="form-field__input">
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-describedby': clsx(
            description && descriptionId,
            hasError && errorId
          ),
          'aria-invalid': hasError,
          'aria-required': required,
          disabled,
        })}
      </div>
      
      {hasError && (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Advanced input with built-in validation
const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  validation,
  autoComplete,
  maxLength,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const debouncedValidation = useDebouncedCallback(async (val: string) => {
    if (validation) {
      setIsValidating(true);
      const result = await validation(val);
      setValidationResult(result);
      setIsValidating(false);
    }
  }, 300);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(e);
    debouncedValidation(newValue);
  }, [onChange, debouncedValidation]);

  return (
    <div className="input-wrapper">
      <input
        type={type}
        value={internalValue}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={clsx('input', {
          'input--error': validationResult && !validationResult.valid,
          'input--success': validationResult && validationResult.valid,
          'input--validating': isValidating,
        })}
        {...props}
      />
      
      {isValidating && (
        <div className="input__validation-indicator">
          <Spinner size="sm" />
        </div>
      )}
      
      {validationResult && (
        <div className={clsx('input__validation-message', {
          'input__validation-message--error': !validationResult.valid,
          'input__validation-message--success': validationResult.valid,
        })}>
          {validationResult.message}
        </div>
      )}
    </div>
  );
};
```

**Acceptance Criteria:**
- [ ] 50+ components implemented with consistent API patterns
- [ ] Stacked modal system supports complex workflows
- [ ] Data table handles 10,000+ rows with virtualization
- [ ] Form components provide real-time validation feedback
- [ ] All components are fully accessible (WCAG AAA)
- [ ] Component performance meets targets (<100ms render time)
- [ ] TypeScript support with comprehensive type definitions
- [ ] Comprehensive testing coverage (>95%)

**Files Created:**
- `packages/frontend/src/components/` (50+ component files)
- `packages/frontend/src/hooks/useVirtualizer.ts`
- `packages/frontend/src/contexts/ModalStackContext.tsx`
- `packages/frontend/src/utils/validation.ts`
- `packages/frontend/src/styles/components.scss`

---

Continue this pattern for the remaining tasks F3 and F4, then move to the other epics...

**Navigation:** [← Epic E - Webhooks](./05-epic-e-webhooks.md) | [Epic G - Observability →](./07-epic-g-observability.md)