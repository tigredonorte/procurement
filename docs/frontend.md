# Frontend Development Guide - Requisio.com

> **This document is the primary frontend reference for AI assistants and developers working on the Requisio.com procurement platform.**

## 🎯 MANDATORY READ SECTIONS BY ACTION

### 🚨 ALWAYS READ FIRST
Before any frontend work, **ALWAYS** read these essential files:
- **[UI Design System Overview](./architecture/frontend/ui/readme.md)** - Complete design philosophy and component library
- **[Component Architecture](./architecture/frontend/ui/07-component-architecture.md)** - How components are structured
- **[Design Philosophy](./architecture/frontend/ui/01-design-philosophy.md)** - Core design principles

### 📦 Creating UI Library Components (`@requisio/ui` package)
**MANDATORY READS:**
- **[docs/architecture/frontend/ui/**](./architecture/frontend/ui/)** - **ALL FILES** in this directory
- **[docs/architecture/frontend/components/**](./architecture/frontend/components/)** - **ALL FILES** in this directory
- **[Color System](./architecture/frontend/ui/03-color-system.md)** - Color tokens and semantic colors
- **[Typography](./architecture/frontend/ui/04-typography.md)** - Font system and type scales
- **[Spacing & Grid](./architecture/frontend/ui/05-spacing-grid.md)** - Layout system
- **[Motion & Animation](./architecture/frontend/ui/06-motion-animation.md)** - Animation guidelines
- **[Responsive Design](./architecture/frontend/ui/10-responsive-design.md)** - Breakpoints and responsive patterns
- **[Dark Mode Strategy](./architecture/frontend/ui/11-dark-mode.md)** - Theme implementation
- **[Accessibility Standards](./architecture/frontend/ui/12-accessibility.md)** - WCAG compliance
- **[Implementation Guidelines](./architecture/frontend/ui/13-implementation-guidelines.md)** - Development standards

**🎨 STORYBOOK REQUIREMENT:**
- **EVERY component in the UI library MUST have a corresponding `.stories.tsx` file**
- Stories should showcase all variants, states, and props
- Include documentation with examples for each component story
- Test components in isolation using Storybook before integration

### 🏗️ Creating Application Components (outside UI library)
**MANDATORY READS:**
- **[docs/architecture/frontend/architecture/**](./architecture/frontend/architecture/)** - **ALL FILES** in this directory
- **[docs/architecture/frontend/components/**](./architecture/frontend/components/)** - **ALL FILES** in this directory  
- **[State Management](./architecture/frontend/architecture/02-state-management.md)** - Redux Toolkit & RTK Query patterns
- **[Validation Schemas](./architecture/frontend/architecture/05-validation-schemas.md)** - Zod validation patterns
- **[Component Examples](./architecture/frontend/components/04-component-examples.md)** - Implementation examples

### 🖥️ Creating New Screens/Pages
**MANDATORY READS:**
- **[docs/implementation/screens/**](./implementation/screens/)** - **ALL FILES** in this directory
- **[Screen Implementation Examples](#screen-specifications)** (below in this document)
- **[PWA Configuration](./architecture/frontend/architecture/01-pwa-configuration.md)** - Progressive Web App setup
- **[Service Workers](./architecture/frontend/architecture/11-service-workers.md)** - MSW and caching strategies

### 🎨 Styling and Theming Work
**MANDATORY READS:**
- **[Visual Identity](./architecture/frontend/ui/02-visual-identity.md)** - Brand and visual guidelines
- **[Color System](./architecture/frontend/ui/03-color-system.md)** - Complete color tokens
- **[Typography](./architecture/frontend/ui/04-typography.md)** - Font hierarchy and usage
- **[Dark Mode Strategy](./architecture/frontend/ui/11-dark-mode.md)** - Theme switching implementation

### 🧪 Testing Frontend Components
**MANDATORY READS:**
- **[Development Standards](./architecture/platform-standards/02-development-standards.md)** - Testing strategies and standards
- **[Component Examples](./architecture/frontend/components/04-component-examples.md)** - Testing patterns

### 📱 Mobile/Responsive Work
**MANDATORY READS:**
- **[Responsive Design](./architecture/frontend/ui/10-responsive-design.md)** - Mobile-first approach and breakpoints
- **[PWA Configuration](./architecture/frontend/architecture/01-pwa-configuration.md)** - Mobile app features

### 🔗 API Integration Work
**MANDATORY READS:**
- **[State Management](./architecture/frontend/architecture/02-state-management.md)** - RTK Query for API calls
- **[Service Workers](./architecture/frontend/architecture/11-service-workers.md)** - MSW for API mocking

---

## 📁 COMPLETE FILE REFERENCE

### `/docs/architecture/frontend/ui/` - UI Design System
- `readme.md` - Complete design system overview
- `01-design-philosophy.md` - Core design principles 
- `02-visual-identity.md` - Brand guidelines and visual language
- `03-color-system.md` - Color tokens, palettes, and semantic colors
- `04-typography.md` - Font system, type scales, and hierarchy
- `05-spacing-grid.md` - Layout system and spacing tokens
- `06-motion-animation.md` - Animation principles and presets
- `07-component-architecture.md` - Component library structure
- `09b-additional-components.md` - Extended component specifications
- `10-responsive-design.md` - Breakpoint system and responsive patterns
- `11-dark-mode.md` - Dark theme implementation strategy
- `12-accessibility.md` - WCAG compliance and accessibility patterns
- `13-implementation-guidelines.md` - Development standards and best practices
- `14-appendices.md` - Additional resources and references

### `/docs/architecture/frontend/components/` - Component Implementation
- `readme.md` - Component organization overview
- `03-component-architecture.md` - Component structure and patterns
- `04-component-examples.md` - Implementation examples and testing
- `08-core-components.md` - Complete core component library
- `09-complex-components.md` - Advanced component patterns
- `09b-additional-components.md` - Extended component specifications

### `/docs/architecture/frontend/architecture/` - Application Architecture
- `readme.md` - Frontend architecture overview
- `01-pwa-configuration.md` - Progressive Web App setup
- `02-state-management.md` - Redux Toolkit and RTK Query patterns
- `05-validation-schemas.md` - Zod validation schemas and patterns
- `11-service-workers.md` - Service workers and MSW setup

### `/docs/implementation/screens/` - Screen Implementations
- `readme.md` - Screen implementation overview
- `01-authentication.md` - Login, register, and auth flows
- `02-app-shell.md` - Main application layout and navigation
- `03-dashboard.md` - Dashboard screen implementation
- `04-research-management.md` - Research list and management
- `05-research-details.md` - Individual research details view
- `06-webhooks.md` - Webhook configuration and management
- `07-settings.md` - Application settings screens
- `08-error-states.md` - Error handling and empty states
- `09-password-reset.md` - Password reset flow
- `10-notifications.md` - Notification center and preferences
- `11-api-keys.md` - API key management
- `12-research-progress.md` - Real-time research progress tracking
- `13-export-download.md` - Data export and download functionality
- `14-webhook-testing.md` - Webhook testing and debugging tools
- `15-onboarding.md` - User onboarding flow
- `16-user-profile.md` - User profile management
- `17-queue-management.md` - Research queue management

---

## 🏗️ DESIGN SYSTEM FOUNDATION

### Component Library Package
- **Package**: `@requisio/ui` - Material UI-based component library with custom design tokens
- **Base Framework**: Material-UI (MUI) with extensive customization
- **Styling**: Emotion CSS-in-JS with design tokens
- **Theme System**: Light/dark mode support with smooth transitions

### Key Design Principles
1. **Glass Morphism**: Subtle transparency and blur effects
2. **Gradient Accents**: Strategic use of gradients for emphasis
3. **Accessible by Default**: WCAG 2.1 AA compliance
4. **Mobile First**: Responsive design starting from mobile
5. **Performance Focused**: Optimized animations and bundle size

---

## 🖥️ SCREEN SPECIFICATIONS

> **Note**: For detailed implementation of each screen, refer to the corresponding files in `/docs/implementation/screens/`. The examples below provide component-level specifications for rapid development.

### Quick Reference - Screen Files
- **Authentication**: [01-authentication.md](./implementation/screens/01-authentication.md)
- **App Shell**: [02-app-shell.md](./implementation/screens/02-app-shell.md) 
- **Dashboard**: [03-dashboard.md](./implementation/screens/03-dashboard.md)
- **Research Management**: [04-research-management.md](./implementation/screens/04-research-management.md)
- **Research Details**: [05-research-details.md](./implementation/screens/05-research-details.md)
- **Webhooks**: [06-webhooks.md](./implementation/screens/06-webhooks.md)
- **Settings**: [07-settings.md](./implementation/screens/07-settings.md)
- **Error States**: [08-error-states.md](./implementation/screens/08-error-states.md)
- **All Other Screens**: See `/docs/implementation/screens/` directory

---

## ⚙️ TECHNICAL IMPLEMENTATION

### State Management Architecture
Read: **[State Management](./architecture/frontend/architecture/02-state-management.md)**

```typescript
// Redux Toolkit Store Structure
interface RootState {
  auth: AuthState;
  research: ResearchState;
  ui: UIState;
  api: ApiState; // RTK Query cache
}

// RTK Query API Slices
const researchApi = createApi({
  reducerPath: 'researchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/research',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState());
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Research', 'ResearchResult'],
  endpoints: (builder) => ({
    // Auto-generated hooks: useGetResearchListQuery, useCreateResearchMutation, etc.
  }),
});
```

### Form Validation with Zod
Read: **[Validation Schemas](./architecture/frontend/architecture/05-validation-schemas.md)**

```typescript
// Centralized validation schemas
export const createResearchSchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters'),
  sources: z.array(z.string()).min(1, 'Select at least one source'),
  maxResults: z.number().min(10).max(100),
});

// Usage in forms
const form = useForm({
  resolver: zodResolver(createResearchSchema),
  defaultValues: { query: '', sources: [], maxResults: 50 },
});
```

### Component Development Pattern
Read: **[Component Architecture](./architecture/frontend/components/03-component-architecture.md)**

```typescript
// Standard component structure
interface ComponentProps {
  variant?: 'default' | 'glass' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Component = ({
  variant = 'default',
  size = 'md',
  children,
  ...props
}: ComponentProps) => {
  const classes = useComponentStyles({ variant, size });
  
  return (
    <Box className={classes.root} {...props}>
      {children}
    </Box>
  );
};
```

---

## 🎨 STYLING AND THEMING

### Design Token Usage
Read: **[Color System](./architecture/frontend/ui/03-color-system.md)**

```typescript
// Using design tokens
const theme = {
  colors: {
    primary: {
      50: '#EEF2FF',
      500: '#6366F1', // Main brand color
      900: '#312E81',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      dark: 'rgba(0, 0, 0, 0.1)',
    }
  },
  spacing: (factor: number) => `${0.25 * factor}rem`, // 4px base
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  }
};
```

### Glass Morphism Implementation
```typescript
const glassStyles = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.borderRadius.lg,
};
```

---

## 📱 RESPONSIVE DESIGN PATTERNS

Read: **[Responsive Design](./architecture/frontend/ui/10-responsive-design.md)**

### Breakpoint System
```typescript
const breakpoints = {
  xs: 0,      // Mobile portrait
  sm: 640,    // Mobile landscape
  md: 768,    // Tablet portrait
  lg: 1024,   // Tablet landscape / Small desktop
  xl: 1280,   // Desktop
  '2xl': 1536 // Large desktop
};

// Usage in components
const responsive = {
  columns: { xs: 1, sm: 2, lg: 3, xl: 4 },
  padding: { xs: 'md', lg: 'xl' },
  fontSize: { xs: 'sm', md: 'md', lg: 'lg' }
};
```

---

## 🧪 TESTING STRATEGY

Read: **[Development Standards](./architecture/platform-standards/02-development-standards.md)**

### Component Testing Pattern
```typescript
// Standard component test structure
describe('ResearchCard', () => {
  const mockProps = {
    research: mockResearchData,
    onView: jest.fn(),
    onEdit: jest.fn(),
  };

  it('renders research information correctly', () => {
    render(<ResearchCard {...mockProps} />);
    expect(screen.getByText(mockProps.research.title)).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    render(<ResearchCard {...mockProps} />);
    await user.click(screen.getByRole('button', { name: /view/i }));
    expect(mockProps.onView).toHaveBeenCalledWith(mockProps.research.id);
  });
});
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### Code Splitting Strategy
```typescript
// Route-based code splitting
const Dashboard = lazy(() => import('./screens/Dashboard'));
const Research = lazy(() => import('./screens/Research'));

// Component-based splitting for large components
const ResearchTable = lazy(() => import('./components/ResearchTable'));

// Usage with Suspense
<Suspense fallback={<ComponentSkeleton />}>
  <ResearchTable />
</Suspense>
```

### Bundle Optimization
- **Tree Shaking**: Import only used components from MUI
- **Code Splitting**: Route and component level splitting  
- **Asset Optimization**: Image compression and lazy loading
- **Caching Strategy**: Service worker implementation

---

## 🔄 REAL-TIME FEATURES

Read: **[State Management](./architecture/frontend/architecture/02-state-management.md)**

### WebSocket Integration
```typescript
// WebSocket middleware for RTK Query
const websocketMiddleware: Middleware = (api) => (next) => (action) => {
  if (action.type === 'research/statusUpdate') {
    // Update research status in real-time
    api.dispatch(
      researchApi.util.updateQueryData(
        'getResearchList',
        undefined,
        (draft) => {
          const research = draft.find(r => r.id === action.payload.id);
          if (research) {
            research.status = action.payload.status;
            research.progress = action.payload.progress;
          }
        }
      )
    );
  }
  return next(action);
};
```

---

## 🎯 KEY SCREEN EXAMPLES

> **Full implementations available in `/docs/implementation/screens/`**

### 1. Authentication Screens (`/login`, `/register`)

**Key Components:**
```typescript
// Login Screen Layout
Container { variant: 'full-screen', responsive: { xs: 'single', lg: 'split' } }
├── Card { variant: 'gradient', background: 'mesh-light' } // Left panel
└── Card { variant: 'glass', padding: 'xl' } // Auth form
    ├── Heading { size: 'display-md', weight: 'bold' }
    ├── Form { variant: 'vertical', validation: 'onSubmit' }
    │   ├── Input { variant: 'glass', type: 'email', floating: true }
    │   ├── Input { variant: 'glass', type: 'password', floating: true }
    │   └── Button { variant: 'gradient', fullWidth: true, glow: true }
    └── Button { variant: 'ghost', text: 'Forgot Password?' }
```

**Implementation Reference**: [01-authentication.md](./implementation/screens/01-authentication.md)

### 2. Dashboard Screen (`/app/dashboard`)

**Key Components:**
```typescript
// Dashboard Layout
Grid { columns: { xs: 1, lg: 4 }, gap: 'lg' }
├── StatCard { title: 'Total Research', value: count, trend: '+12%' }
├── StatCard { title: 'Completed Today', value: todayCount }
├── StatCard { title: 'In Progress', value: activeCount }
└── StatCard { title: 'Success Rate', value: '94%' }

Card { variant: 'glass', padding: 'lg' }
├── CardHeader { title: 'Recent Research', action: ViewAllButton }
└── Table {
    variant: 'glass',
    hoverable: true,
    columns: ['query', 'status', 'createdAt', 'results', 'actions']
  }
```

**Implementation Reference**: [03-dashboard.md](./implementation/screens/03-dashboard.md)

### 3. Research Management (`/app/research`)

**Key Components:**
```typescript
// Research List Layout
Stack { direction: 'column', gap: 'lg' }
├── SearchAndFilters
│   ├── Input { variant: 'glass', placeholder: 'Search research...' }
│   ├── ToggleGroup { options: ['all', 'processing', 'completed'] }
│   └── Select { options: sortOptions }
└── Grid { columns: { xs: 1, md: 2, xl: 3 }, gap: 'lg' }
    └── ResearchCard {
        variant: 'glass',
        hover: 'glow',
        status: Badge,
        actions: DropdownMenu
      }
```

**Implementation Reference**: [04-research-management.md](./implementation/screens/04-research-management.md)

### 4. Research Details (`/app/research/:id`)

**Key Components:**
```typescript
// Research Details Layout
Stack { direction: 'column', gap: 'xl' }
├── Breadcrumbs { variant: 'arrow' }
├── PageHeader
│   ├── Heading { size: 'display-sm' }
│   └── ButtonGroup { actions: ['rerun', 'share', 'export'] }
├── StatusCard { variant: 'glass', metrics: Grid }
└── ResultsTable {
    variant: 'striped',
    sortable: true,
    selectable: true,
    pagination: true,
    columns: ['title', 'price', 'supplier', 'availability']
  }
```

**Implementation Reference**: [05-research-details.md](./implementation/screens/05-research-details.md)

---

## 📚 ADDITIONAL RESOURCES

### Architecture Documents
- **[PWA Configuration](./architecture/frontend/architecture/01-pwa-configuration.md)** - Progressive Web App setup
- **[Service Workers](./architecture/frontend/architecture/11-service-workers.md)** - Caching and offline support
- **[Frontend Architecture Overview](./architecture/frontend/architecture/readme.md)** - Complete architecture guide

### Design System Deep Dive
- **[Motion & Animation](./architecture/frontend/ui/06-motion-animation.md)** - Animation principles
- **[Accessibility](./architecture/frontend/ui/12-accessibility.md)** - WCAG compliance guide
- **[Implementation Guidelines](./architecture/frontend/ui/13-implementation-guidelines.md)** - Best practices

### Implementation Examples  
- **[Component Examples](./architecture/frontend/components/04-component-examples.md)** - Real implementation patterns
- **[Core Components](./architecture/frontend/components/08-core-components.md)** - Complete component catalog
- **[Complex Components](./architecture/frontend/components/09-complex-components.md)** - Advanced patterns

---

## 🎯 QUICK ACTION GUIDE

### I need to create a new UI component:
1. Read `/docs/architecture/frontend/ui/` (all files)
2. Read `/docs/architecture/frontend/components/` (all files)
3. Check [Core Components](./architecture/frontend/components/08-core-components.md) for existing patterns
4. Follow [Implementation Guidelines](./architecture/frontend/ui/13-implementation-guidelines.md)

### I need to create a new screen:
1. Read `/docs/implementation/screens/` (all files)
2. Check existing screen implementations for patterns
3. Read [State Management](./architecture/frontend/architecture/02-state-management.md) for data handling
4. Read [Validation Schemas](./architecture/frontend/architecture/05-validation-schemas.md) for forms

### I need to style components:
1. Read [Color System](./architecture/frontend/ui/03-color-system.md)
2. Read [Typography](./architecture/frontend/ui/04-typography.md)  
3. Read [Spacing & Grid](./architecture/frontend/ui/05-spacing-grid.md)
4. Read [Dark Mode Strategy](./architecture/frontend/ui/11-dark-mode.md)

### I need to handle responsive design:
1. Read [Responsive Design](./architecture/frontend/ui/10-responsive-design.md)
2. Read [PWA Configuration](./architecture/frontend/architecture/01-pwa-configuration.md)
3. Check mobile patterns in screen implementations

### I need to integrate APIs:
1. Read [State Management](./architecture/frontend/architecture/02-state-management.md)
2. Read [Service Workers](./architecture/frontend/architecture/11-service-workers.md) for mocking
3. Check existing API integration patterns in screens

This guide serves as the central reference for all frontend development on the Requisio.com platform. For specific implementation details, always refer to the linked documentation files.
