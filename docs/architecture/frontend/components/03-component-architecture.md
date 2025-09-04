# Component Architecture - Requisio.com

[← Back to Main Documentation](./readme.md)

## Frontend Service Architecture

### Architecture Pattern
- **Pattern**: Component-based architecture with Redux Toolkit for state management
- **Structure**: Feature-based folder organization
- **Routing**: React Router v6 with protected routes

### Key Components Structure

```typescript
// Component Structure
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── research/
│   │   ├── ResearchForm.tsx
│   │   ├── ResearchList.tsx
│   │   └── ResearchDetails.tsx
│   └── common/
│       ├── Header.tsx
│       └── Layout.tsx
├── features/
│   ├── auth/
│   │   └── authSlice.ts
│   └── research/
│       └── researchSlice.ts
├── services/
│   ├── api.ts
│   └── keycloak.ts
└── hooks/
    ├── useAuth.ts
    └── usePermissions.ts
```

### State Management Structure

```typescript
// Redux Store Structure
interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    abilities: Ability[];
  };
  research: {
    requests: ResearchRequest[];
    currentRequest: ResearchRequest | null;
    loading: boolean;
    error: string | null;
  };
  ui: {
    notifications: Notification[];
  };
}
```

---

[Next: Component Examples →](./04-component-examples.md)

**Document Version**: 1.0.0 | **Last Updated**: 2025-09-01