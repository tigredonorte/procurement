# Frontend Architecture - Requisio.com

This directory contains the comprehensive frontend architecture documentation for the Requisio.com procurement research platform. The documentation is organized into specific topics for easy navigation and reference.

## 📚 Documentation Structure

### Core Architecture
- **[PWA Configuration](./01-pwa-configuration.md)** - Progressive Web App setup and service worker implementation
- **[State Management](./02-state-management.md)** - Redux Toolkit store configuration and state architecture
- **[Component Architecture](./03-component-architecture.md)** - Component design patterns and organization
- **[Component Examples](./04-component-examples.md)** - Implementation examples of key components

### Data & Validation
- **[Validation Schemas](./05-validation-schemas.md)** - Zod schemas for form validation and data integrity
- **[Error Handling](./06-error-handling.md)** - Frontend error handling patterns and strategies

### Service Workers & PWA
- **[Service Workers & Mocking](./11-service-workers.md)** - Service worker implementation and MSW for development

### Design System
- **[Responsive Design](./07-responsive-design.md)** - Grid system and responsive design implementation
- **[UI Components](./08-ui-components.md)** - Material-UI component customization and theming

### Security & Performance
- **[Authentication](./09-authentication.md)** - Keycloak integration and protected routes
- **[API Integration](./10-api-integration.md)** - External API client patterns and data fetching

## 🏗️ Technology Stack

- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **UI Library**: Material-UI (MUI) v5
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v7
- **Authentication**: Keycloak integration
- **Authorization**: CASL.js for permissions
- **PWA**: Service Worker with offline support
- **Build Tool**: Vite
- **Testing Tool (unit tests)**: Vitest
- **Testing Tool (e2e tests)**: Playwrite

## 🎯 Key Features

### Progressive Web App
- Offline functionality
- App-like experience
- Push notifications support
- Install prompts

### State Management
- Centralized Redux store
- RTK Query for API caching
- Optimistic updates
- Real-time synchronization

### Component Architecture
- Feature-based organization
- Reusable component library
- TypeScript for type safety
- Automated testing

### Security
- Token-based authentication
- Role-based access control
- Permission-based UI rendering
- Secure API communication

## 📖 Quick Start

For developers new to the frontend architecture:

1. Start with [Component Architecture](./03-component-architecture.md) to understand the structure
2. Review [State Management](./02-state-management.md) for data flow patterns
3. Check [Component Examples](./04-component-examples.md) for implementation references
4. Refer to [Validation Schemas](./05-validation-schemas.md) for form handling

## 🔗 Related Documentation
- [System Architecture Overview](../05-system-architecture.md)
- [API Design](../04-api-design.md)
- [UI/UX Guidelines](../../ui/Readme.md)
- [Development Standards](../07-appendix.md#n-development-standards)

## 📄 Document Version

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-09-01 | Initial frontend architecture documentation |

---

*This documentation is part of the Requisio.com Procurement Research Automation Platform system design.*