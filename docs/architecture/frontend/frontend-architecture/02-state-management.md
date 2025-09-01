# State Management - Requisio.com

## Overview

This document defines the state management architecture for Requisio.com using Redux Toolkit, RTK Query for API integration, and state synchronization patterns.

## State Architecture

### Core Principles

1. **Single Source of Truth**: All application state in centralized Redux store
2. **Predictable Updates**: State mutations only through dispatched actions
3. **Type Safety**: Full TypeScript support throughout state management
4. **Optimistic Updates**: Immediate UI feedback with rollback on failure
5. **Cache Management**: Intelligent caching with RTK Query

## Store Structure

### Root State Shape

```typescript
interface RootState {
  auth: AuthState;
  research: ResearchState;
  ui: UIState;
  api: ApiState; // RTK Query managed
}
```

## Feature Slices

### Auth Slice

**Purpose**: Manage authentication state and user sessions

**State Shape**:
- `user`: Current user information
- `tokens`: Access and refresh tokens
- `abilities`: User permissions (CASL integration)
- `isAuthenticated`: Authentication status
- `loading`: Auth operation status
- `error`: Error messages

**Key Actions**:
- `loginWithKeycloak`: Authenticate via Keycloak
- `refreshToken`: Refresh expired tokens
- `logout`: Clear authentication state
- `setUser`: Update user information

### Research Slice

**Purpose**: Manage research requests and AI analysis state

**State Shape**:
- `requests`: List of research requests
- `currentRequest`: Active research details
- `filters`: Applied search filters
- `pagination`: Page state
- `loading`: Operation status
- `error`: Error handling

**Key Actions**:
- `fetchResearchRequests`: Load paginated requests
- `createResearchRequest`: Submit new research
- `updateRequestStatus`: Track progress
- `setFilters`: Apply search filters

### UI Slice

**Purpose**: Manage UI state and user preferences

**State Shape**:
- `notifications`: Toast/alert queue
- `sidebarOpen`: Navigation state
- `theme`: Light/dark mode
- `loading`: Component loading states

**Key Actions**:
- `addNotification`: Show user feedback
- `toggleTheme`: Switch color mode
- `toggleSidebar`: Navigation control
- `setLoading`: Track async operations

## RTK Query Integration

### API Slice Configuration

**Base Configuration**:
- Base URL: `/api/v1`
- Automatic token injection
- Retry logic (max 3 attempts)
- Cache invalidation tags

### Endpoint Categories

#### Research Endpoints
- `getResearchRequests`: Paginated list with filters
- `getResearchRequest`: Single request details
- `createResearchRequest`: Submit new research
- `updateResearchRequest`: Modify existing

#### User Endpoints
- `getCurrentUser`: Profile information
- `updateUserProfile`: Edit user data
- `getUserPreferences`: Settings
- `updatePreferences`: Save settings

#### Webhook Endpoints
- `getWebhooks`: List configurations
- `createWebhook`: Add new webhook
- `updateWebhook`: Modify configuration
- `deleteWebhook`: Remove webhook
- `testWebhook`: Validate endpoint

## State Synchronization

### WebSocket Integration

**Real-time Updates**:
- Research status changes
- AI analysis progress
- Notification delivery
- Collaborative features

**Connection Management**:
- Automatic reconnection
- Heartbeat monitoring
- Message queueing when offline

### Local Storage Persistence

**Persisted State**:
- Authentication tokens
- User preferences
- Theme selection
- Draft research requests

**Hydration Strategy**:
1. Load persisted state on app init
2. Validate token expiry
3. Sync with server state
4. Handle conflicts

## Performance Optimizations

### Selector Memoization

Use reselect for expensive computations:
- Filtered research lists
- Aggregated statistics
- Derived permissions

### Normalized State

**Entity Management**:
- Research requests by ID
- User data normalization
- Relationship mapping

### Batch Updates

Group related state changes:
- Bulk status updates
- Multiple filter changes
- Pagination with data

## Error Handling

### Global Error Boundary

React Error Boundaries for component error isolation:
- Wrap feature modules in error boundaries
- Fallback UI for error states
- Error reporting to monitoring service
- Recovery actions for users

Redux error handling:
- Network failures
- Token expiration
- Permission denied
- Rate limiting

### Retry Strategies

**Automatic Retry**:
- Network requests (exponential backoff)
- Token refresh
- WebSocket reconnection

**Manual Retry**:
- User-initiated refresh
- Failed form submissions

## Testing Strategy

### Unit Tests
- Reducer logic
- Action creators
- Selectors
- Thunks

### Integration Tests
- Store configuration
- Middleware chain
- API mocking
- State persistence

## Migration Path

### From Local State
1. Identify shared state
2. Create Redux slices
3. Connect components
4. Remove prop drilling

### Legacy API Integration
1. Wrap in RTK Query
2. Add caching layer
3. Implement optimistic updates
4. Handle errors consistently

## Related Documentation

- [Component Architecture](./03-component-architecture.md)
- [API Integration](./10-api-integration.md)
- [PWA Configuration](./01-pwa-configuration.md)

---

**Document Version**: 1.0.0 | **Last Updated**: 2025-09-01