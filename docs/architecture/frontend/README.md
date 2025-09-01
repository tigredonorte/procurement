# Frontend Architecture Documentation

[← Back to Architecture](../README.md)

---

This directory contains all frontend-related architecture documentation for the Requisio.com platform.

## 📁 Directory Structure

### [Frontend Architecture](../frontend-architecture/)
Core frontend architecture and patterns:
- **[PWA Configuration](../frontend-architecture/01-pwa-configuration.md)** - Progressive Web App setup
- **[State Management](../frontend-architecture/02-state-management.md)** - Redux Toolkit and RTK Query
- **[Component Architecture](../frontend-architecture/03-component-architecture.md)** - Component patterns
- **[Component Examples](../frontend-architecture/04-component-examples.md)** - Implementation examples
- **[Validation Schemas](../frontend-architecture/05-validation-schemas.md)** - Zod validation patterns
- **[Service Workers & Mocking](../frontend-architecture/11-service-workers.md)** - PWA and MSW setup

### [Screen Specifications](./screens/)
Detailed screen implementations:
- **[01-authentication.md](./screens/01-authentication.md)** - Login and registration
- **[02-app-shell.md](./screens/02-app-shell.md)** - Main application layout
- **[03-dashboard.md](./screens/03-dashboard.md)** - Dashboard overview
- **[04-research-management.md](./screens/04-research-management.md)** - Research CRUD operations
- **[05-research-details.md](./screens/05-research-details.md)** - Detailed research view
- **[06-webhooks.md](./screens/06-webhooks.md)** - Webhook configuration
- **[07-settings.md](./screens/07-settings.md)** - Application settings
- **[08-error-states.md](./screens/08-error-states.md)** - Error and empty states
- **[09-password-reset.md](./screens/09-password-reset.md)** - Password recovery flow
- **[10-notifications.md](./screens/10-notifications.md)** - Notification system
- **[11-api-keys.md](./screens/11-api-keys.md)** - API key management
- **[12-research-progress.md](./screens/12-research-progress.md)** - Real-time progress tracking
- **[13-export-download.md](./screens/13-export-download.md)** - Data export features
- **[14-webhook-testing.md](./screens/14-webhook-testing.md)** - Webhook testing tools
- **[15-onboarding.md](./screens/15-onboarding.md)** - User onboarding flow
- **[16-user-profile.md](./screens/16-user-profile.md)** - Profile management
- **[17-queue-management.md](./screens/17-queue-management.md)** - Research queue system

## 🎨 Related Design System Documentation

### [UI/UX Design System](../ui/)
- **[Design Philosophy](../ui/01-design-philosophy.md)** - Core design principles
- **[Visual Identity](../ui/02-visual-identity.md)** - Brand guidelines
- **[Color System](../ui/03-color-system.md)** - Color palettes and usage
- **[Typography](../ui/04-typography.md)** - Font system and scales
- **[Spacing & Grid](../ui/05-spacing-grid.md)** - Layout system
- **[Motion & Animation](../ui/06-motion-animation.md)** - Animation guidelines
- **[Component Architecture](../ui/07-component-architecture.md)** - Component structure
- **[Core Components](../ui/08-core-components.md)** - Basic UI components
- **[Complex Components](../ui/09-complex-components.md)** - Advanced patterns
- **[Additional Components](../ui/09b-additional-components.md)** - Extended library
- **[Responsive Design](../ui/10-responsive-design.md)** - Mobile-first approach
- **[Dark Mode](../ui/11-dark-mode.md)** - Theme implementation
- **[Accessibility](../ui/12-accessibility.md)** - WCAG compliance

## 🛠 Technology Stack

### Core Technologies
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **State Management**: Redux Toolkit with RTK Query
- **UI Library**: Material-UI (MUI) v5
- **Component Library**: `@requisio/ui`
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Keycloak integration
- **Authorization**: CASL.js for permissions
- **Build Tool**: Vite
- **Testing**: Vitest (unit), Playwright (E2E)

### Progressive Web App
- Service Workers for offline support
- Web App Manifest
- Push Notifications
- Background Sync
- Cache strategies

### Development Tools
- Mock Service Worker (MSW) for API mocking
- Redux DevTools for state debugging
- React DevTools for component inspection
- Lighthouse for PWA auditing

## 📋 Key Features

### Authentication & Authorization
- Keycloak SSO integration
- JWT token management
- Role-based access control (RBAC)
- Permission-based UI rendering

### State Management
- Centralized Redux store
- RTK Query for API caching
- Optimistic updates
- WebSocket real-time sync
- Local storage persistence

### Component System
- Feature-based organization
- Reusable component library
- TypeScript type safety
- Glassmorphic design
- Dark mode support

### Performance
- Code splitting
- Lazy loading
- Virtual scrolling
- Image optimization
- Bundle optimization

### Accessibility
- WCAG AAA compliance
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA implementation

## 🔗 Quick Links

### For Developers
- [State Management](../frontend-architecture/02-state-management.md)
- [Component Examples](../frontend-architecture/04-component-examples.md)
- [Screen Specifications](./screens/)
- [Validation Schemas](../frontend-architecture/05-validation-schemas.md)

### For Designers
- [Design Philosophy](../ui/01-design-philosophy.md)
- [Color System](../ui/03-color-system.md)
- [Typography](../ui/04-typography.md)
- [Component Library](../ui/08-core-components.md)

### For DevOps
- [PWA Configuration](../frontend-architecture/01-pwa-configuration.md)
- [Service Workers](../frontend-architecture/11-service-workers.md)
- [Development Standards](../platform-standards/02-development-standards.md)

## 📚 Development Guidelines

### Component Creation
1. Follow the component architecture patterns
2. Use TypeScript for type safety
3. Implement proper error boundaries
4. Include accessibility features
5. Write unit tests

### State Management
1. Use RTK Query for API calls
2. Implement optimistic updates
3. Handle error states properly
4. Use selectors for derived state
5. Persist critical state

### Performance Best Practices
1. Implement code splitting
2. Use React.memo for expensive components
3. Virtualize long lists
4. Optimize bundle size
5. Monitor Core Web Vitals

### Testing Strategy
1. Unit tests for business logic
2. Integration tests for features
3. E2E tests for critical paths
4. Visual regression testing
5. Accessibility testing

## 📖 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-09-01 | Initial frontend architecture documentation |

---

**Note**: This documentation is part of the Requisio.com Procurement Research Automation Platform architecture.