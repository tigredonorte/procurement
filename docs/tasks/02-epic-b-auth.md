# Epic B — Authentication & Authorization System

[← Back to Tasks Overview](./Readme.md)

---

## Goal Statement
Implement a comprehensive, secure authentication and authorization system using Keycloak integration with JWT tokens, role-based access control (RBAC), and permission-based authorization that supports the MVP user roles and scales for future organizational complexity.

## Success Criteria
- Secure user authentication with industry-standard protocols (OIDC/OAuth2)
- Granular permission system supporting current and future roles
- Zero trust security model with proper token validation
- Seamless user experience with automatic token refresh
- Comprehensive audit logging of all authentication events
- Protection against common auth vulnerabilities (CSRF, session fixation, etc.)

## Technical Requirements

### Security Standards Compliance
- **Authentication Protocol**: OpenID Connect (OIDC) with OAuth 2.0
- **Token Format**: JWT with RS256 signing
- **Session Management**: Stateless with refresh token rotation
- **Authorization Model**: CASL.js for fine-grained permissions
- **Security Headers**: Comprehensive security header implementation
- **Audit Requirements**: Complete authentication event logging

### User Roles & Permissions Matrix
| Role | Research CRUD | Webhooks | Admin Users | System Config | API Access |
|------|---------------|----------|-------------|---------------|-------------|
| **Admin** | Full | Full | Full | Full | Full |
| **Manager** | Full | Full | Limited | None | Full |
| **Researcher** | Own Resources | Own Config | None | None | Limited |
| **Viewer** | Read Only | None | None | None | Read Only |

## Tasks

### B1. Backend Keycloak Integration & JWT Middleware
**Priority**: Critical | **Effort**: L | **Dependencies**: A1, A2, A3

**Scope:**
- Implement comprehensive Keycloak integration with OIDC protocol
- Create JWT validation middleware with proper security checks
- Implement user synchronization with MongoDB User collection
- Set up token validation and refresh mechanisms
- Configure comprehensive security headers and CORS

**Technical Implementation:**

**JWT Middleware Features:**
- Token signature verification using Keycloak public keys
- Token expiration validation with grace period
- Audience and issuer verification
- Rate limiting per user and IP
- Request correlation ID generation
- Comprehensive error handling and logging

**User Synchronization:**
```typescript
interface IUser {
  _id: ObjectId;
  keycloakId: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: {
    name: string;
    type: 'hospital' | 'hotel' | 'school' | 'commercial_building';
    taxId?: string;
  };
  role: 'admin' | 'manager' | 'researcher' | 'viewer';
  permissions: string[];
  preferences: UserPreferences;
  webhookConfig?: WebhookConfig;
  limits: UsageLimits;
  usage: UsageStats;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    loginCount: number;
    ipAddress?: string;
  };
}
```

**Security Configuration:**
- Keycloak realm: `requisio-platform`
- Client configuration with confidential client
- Token validation with proper audience checks
- Automatic user profile synchronization
- Session timeout and cleanup

**Acceptance Criteria:**
- [ ] JWT tokens validated against Keycloak public keys
- [ ] User data synchronized from Keycloak to MongoDB
- [ ] Token refresh mechanism works automatically
- [ ] Rate limiting prevents brute force attacks
- [ ] Comprehensive security headers implemented
- [ ] All authentication events logged with correlation IDs
- [ ] Error handling provides appropriate feedback without leaking info
- [ ] CORS configured for frontend domain only

**Files Created/Modified:**
- `packages/backend/src/middleware/auth.middleware.ts`
- `packages/backend/src/services/auth.service.ts`
- `packages/backend/src/models/User.model.ts`
- `packages/backend/src/controllers/auth.controller.ts`
- `packages/backend/src/utils/jwt.utils.ts`

---

### B2. CASL.js Authorization Framework
**Priority**: Critical | **Effort**: M | **Dependencies**: B1

**Scope:**
- Implement comprehensive CASL.js authorization system
- Define granular permissions for all resource types
- Create role-based ability definitions
- Implement middleware for API endpoint protection
- Set up resource ownership validation

**Technical Implementation:**

**Permission Definitions:**
```typescript
type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects = 'Research' | 'Webhook' | 'User' | 'Organization' | 'all';

type AppAbility = PureAbility<[Actions, Subjects]>;
```

**Role-Based Abilities:**
- **Admin**: `can('manage', 'all')` - Full system access
- **Manager**: Organization-scoped management with user oversight
- **Researcher**: Own resource management with create/read/update
- **Viewer**: Read-only access to assigned resources

**Resource-Based Authorization:**
- Ownership validation for user-created resources
- Organization-level access control
- Shared resource permissions
- Hierarchical permission inheritance

**Middleware Integration:**
```typescript
const requirePermission = (action: Actions, subject: Subjects) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const ability = defineAbilityFor(req.user);
    if (ability.can(action, subject)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};
```

**Acceptance Criteria:**
- [ ] All API endpoints protected with appropriate permissions
- [ ] Users can only access resources they own or have been granted access to
- [ ] Role transitions work correctly (promotion/demotion)
- [ ] Permission checks happen at both API and resource levels
- [ ] Comprehensive permission testing covers all role combinations
- [ ] Performance impact of permission checks is minimal
- [ ] Clear error messages for authorization failures

**Files Created:**
- `packages/backend/src/auth/abilities.ts`
- `packages/backend/src/middleware/permissions.middleware.ts`
- `packages/backend/src/auth/ability-factory.ts`
- `packages/shared/src/types/permissions.types.ts`

---

### B3. Frontend Keycloak Integration & Token Management
**Priority**: Critical | **Effort**: L | **Dependencies**: B1

**Scope:**
- Implement keycloak-js adapter with proper configuration
- Create authentication context and hooks
- Implement automatic token refresh
- Set up protected route guards
- Create login/logout user flows

**Technical Implementation:**

**Keycloak Configuration:**
```typescript
const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: 'requisio-platform',
  clientId: 'requisio-frontend',
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256',
  checkLoginIframe: true,
  checkLoginIframeInterval: 30
};
```

**Authentication Context:**
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  refreshToken: () => Promise<string | null>;
  hasPermission: (action: string, subject: string) => boolean;
}
```

**Token Management Features:**
- Automatic token refresh 2 minutes before expiration
- Secure token storage (memory + httpOnly cookies for refresh)
- Token injection in all API requests
- Logout cleanup and session termination
- Silent authentication for session continuity

**Route Protection:**
- ProtectedRoute component with permission checks
- Automatic redirect to login for unauthenticated users
- Role-based route access control
- Loading states during authentication checks

**Acceptance Criteria:**
- [ ] Users can log in and out successfully
- [ ] Tokens automatically refresh before expiration
- [ ] Protected routes redirect unauthenticated users
- [ ] Authentication state persists across browser sessions
- [ ] Silent authentication works without user interruption
- [ ] All API calls include valid authentication headers
- [ ] Logout clears all authentication data
- [ ] Error handling for authentication failures

**Files Created:**
- `packages/frontend/src/contexts/AuthContext.tsx`
- `packages/frontend/src/hooks/useAuth.ts`
- `packages/frontend/src/components/ProtectedRoute.tsx`
- `packages/frontend/src/services/auth.service.ts`
- `packages/frontend/src/utils/token.utils.ts`
- `packages/frontend/public/silent-check-sso.html`

---

### B4. Frontend Permission-Based UI Components
**Priority**: High | **Effort**: M | **Dependencies**: B2, B3

**Scope:**
- Implement CASL.js React integration for UI permission control
- Create permission-aware components and hooks
- Implement conditional rendering based on user abilities
- Set up role-based navigation and menu systems
- Create permission debugging tools for development

**Technical Implementation:**

**Permission Hooks:**
```typescript
const usePermissions = () => {
  const { user } = useAuth();
  const ability = useMemo(() => defineAbilityFor(user), [user]);
  
  const can = useCallback((action: string, subject: string, resource?: any) => {
    return ability.can(action, subject, resource);
  }, [ability]);
  
  return { ability, can };
};
```

**Permission Components:**
```typescript
interface CanProps {
  I: string;  // action
  a: string;  // subject  
  this?: any; // resource
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const Can: React.FC<CanProps> = ({ I, a, this: resource, children, fallback }) => {
  const { can } = usePermissions();
  
  if (can(I, a, resource)) {
    return <>{children}</>;
  }
  
  return <>{fallback || null}</>;
};
```

**UI Permission Integration:**
- Navigation menus hide items based on permissions
- Action buttons disabled/hidden for unauthorized actions
- Form fields read-only based on edit permissions
- Data tables show/hide columns based on access rights
- Bulk actions filtered by user capabilities

**Development Tools:**
- Permission debugger showing current user abilities
- Visual indicators for permission-controlled elements
- Testing utilities for simulating different user roles
- Performance monitoring for permission checks

**Acceptance Criteria:**
- [ ] UI elements correctly hide/show based on permissions
- [ ] Navigation adapts to user role and permissions
- [ ] Unauthorized actions are not accessible in UI
- [ ] Permission changes reflect immediately in UI
- [ ] Performance impact of permission checks is negligible
- [ ] Development tools help debug permission issues
- [ ] Accessibility maintained with dynamic content
- [ ] Loading states handled during permission evaluation

**Files Created:**
- `packages/frontend/src/hooks/usePermissions.ts`
- `packages/frontend/src/components/Can.tsx`
- `packages/frontend/src/components/PermissionBoundary.tsx`
- `packages/frontend/src/utils/abilities.client.ts`
- `packages/shared/src/abilities/index.ts`

---

## Security Considerations

### Authentication Security
- **Token Security**: RS256 signatures, short expiration times, secure storage
- **Session Management**: Stateless design, proper logout, session invalidation
- **CSRF Protection**: SameSite cookies, CSRF tokens where needed
- **XSS Prevention**: Proper token storage, Content Security Policy
- **Brute Force Protection**: Rate limiting, account lockout mechanisms

### Authorization Security
- **Principle of Least Privilege**: Users get minimum necessary permissions
- **Resource Ownership**: Strict validation of resource access rights
- **Permission Validation**: Server-side validation for all operations
- **Audit Trail**: Complete logging of authorization decisions
- **Permission Escalation Prevention**: Secure role transition controls

## Dependencies & Integration

**Depends On:**
- Epic A: Development infrastructure and containerized services
- Keycloak service configured and running
- MongoDB for user data persistence
- Redis for session and rate limiting data

**Enables:**
- Epic C: Authenticated API endpoints for research management
- Epic D: User context for worker job processing
- Epic E: User-specific webhook configurations
- Epic F: Permission-aware UI components and navigation
- All future epics requiring user context and authorization

## Risk Mitigation

- **Keycloak Dependency**: Fallback authentication mechanisms
- **Token Compromise**: Short-lived tokens with refresh rotation
- **Permission Complexity**: Comprehensive testing matrix
- **Performance Impact**: Caching and optimization strategies
- **User Experience**: Smooth authentication flows with proper loading states

## Definition of Done

**Technical Validation:**
- [ ] End-to-end authentication flow works without issues
- [ ] Protected API endpoints return 401 for unauthenticated requests
- [ ] Protected API endpoints return 403 for unauthorized requests
- [ ] UI correctly hides/disables unauthorized actions
- [ ] Token refresh happens automatically and transparently
- [ ] User sessions persist appropriately across browser sessions
- [ ] All authentication events are logged with proper correlation
- [ ] Security headers implemented according to OWASP guidelines

**Security Validation:**
- [ ] No authentication bypass vulnerabilities
- [ ] Proper CORS configuration prevents unauthorized origins
- [ ] Rate limiting prevents brute force attacks
- [ ] Tokens are not exposed in client-side logs or errors
- [ ] Permission checks cannot be bypassed on frontend or backend
- [ ] User data synchronization works correctly with Keycloak

**Quality Metrics:**
- [ ] Authentication success rate: >99.5%
- [ ] Token refresh success rate: >99%
- [ ] API response time impact: <50ms overhead
- [ ] Permission check performance: <10ms average
- [ ] Test coverage: >95% for auth-related code
- [ ] Zero critical security vulnerabilities in auth flow

---

**Navigation:** [← Epic A - Foundations](./01-epic-a-foundations.md) | [Epic C - Research Core →](./03-epic-c-research-core.md)