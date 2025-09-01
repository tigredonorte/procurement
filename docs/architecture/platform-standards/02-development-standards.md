# Development Standards - Requisio.com

## Overview

This document outlines the development standards, best practices, and conventions for the Requisio.com platform development team.

---

## 1. Code Organization

### 1.1 Monorepo Structure

```
requisio-platform/
├── packages/
│   ├── frontend/          # React application
│   ├── backend/           # Express API server
│   ├── worker/            # BullMQ worker service
│   └── shared/            # Shared types and utilities
├── docker/
│   ├── frontend/
│   ├── backend/
│   └── worker/
├── scripts/               # Build and deployment scripts
├── docs/                  # Documentation
├── .github/               # GitHub Actions workflows
├── docker-compose.yml     # Development environment
├── pnpm-workspace.yaml    # Workspace configuration
└── package.json           # Root package configuration
```

### 1.2 Package Structure

Each package follows a consistent structure:

```
packages/[package-name]/
├── src/
│   ├── components/        # UI components (frontend)
│   ├── controllers/       # Request handlers (backend)
│   ├── services/          # Business logic
│   ├── models/            # Data models
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript definitions
├── tests/
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── fixtures/          # Test data
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Naming Conventions

### 2.1 File Naming

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `UserProfile.tsx` |
| Functions/Utilities | camelCase | `parseData.ts` |
| Folders | kebab-case | `user-management/` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| Configuration files | lowercase with dots | `config.production.js` |

### 2.2 Code Conventions

```typescript
// Interfaces: Prefix with 'I'
interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Types: PascalCase
type UserRole = 'researcher' | 'admin' | 'viewer';

// Enums: PascalCase with UPPER_CASE values
enum ResearchStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Classes: PascalCase
class ResearchService {
  // Methods: camelCase
  async createRequest() {}
  
  // Private methods: prefix with underscore
  private _validateQuery() {}
}

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 30000;
```

---

## 3. Testing Strategy

### 3.1 Test Coverage Requirements

| Component | Unit Tests | Integration Tests | E2E Tests |
|-----------|------------|-------------------|-----------|
| Frontend Components | 80% | - | - |
| Backend Controllers | 90% | 80% | - |
| Backend Services | 95% | 85% | - |
| Worker Jobs | 90% | 80% | - |
| Critical Paths | 100% | 95% | 80% |
| Utility Functions | 100% | - | - |

### 3.2 Test Structure

#### Test Organization Guidelines

- **Unit Tests**: Focus on individual functions/methods in isolation
  - Use mocks for dependencies
  - Follow AAA pattern: Arrange, Act, Assert
  - Test both success and failure cases
  
- **Integration Tests**: Test API endpoints and service interactions
  - Use test database instances
  - Test authentication and authorization
  - Validate response formats and status codes
  
- **E2E Tests**: Test critical user flows
  - Focus on happy paths and critical error scenarios
  - Use realistic data and scenarios

### 3.3 Test Utilities

- Create reusable test utilities for common operations
- Maintain test fixtures and factories for consistent test data
- Implement cleanup functions to prevent test pollution
- Use test helpers for authentication tokens and user creation

---

## 4. Git Workflow

### 4.1 Branch Strategy

```
main (production-ready)
  └── develop (integration branch)
       ├── feature/REQ-XXX-feature-name
       ├── fix/REQ-XXX-bug-description
       ├── hotfix/REQ-XXX-critical-fix
       └── chore/REQ-XXX-task-description
```

### 4.2 Branch Naming Rules

- **feature/**: New features and enhancements
- **fix/**: Bug fixes (non-critical)
- **hotfix/**: Critical production fixes
- **chore/**: Maintenance tasks, refactoring
- **docs/**: Documentation updates

### 4.3 Commit Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body (optional)

footer (optional)
```

#### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

#### Examples

```bash
# Feature commit
feat(research): add webhook notification support

Implement webhook notifications for completed research requests.
Users can now configure webhooks to receive real-time updates.

Closes REQ-123

# Bug fix commit
fix(auth): resolve token refresh race condition

Prevent multiple simultaneous refresh attempts by implementing
a token refresh queue.

Fixes REQ-456

# Breaking change
feat(api)!: change research response format

BREAKING CHANGE: Research results now return normalized data
in a different structure. Update clients accordingly.
```

### 4.4 Pull Request Process

1. **Create PR from feature branch to develop**
2. **PR Title Format**: `[REQ-XXX] Brief description`
3. **PR Description must include**:
   - Summary of changes
   - Testing performed
   - Screenshots (for UI changes)
   - Breaking changes (if any)
   - Checklist completion

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Changes generate no breaking changes
```

---

## 5. Code Quality Standards

### 5.1 Linting Rules

- Extend from recommended ESLint and TypeScript configurations
- Enforce explicit function return types
- Disallow unused variables
- Warn on `any` type usage
- Restrict console usage (allow warn/error only)
- Prefer const over let when possible
- Disable PropTypes for TypeScript projects

### 5.2 Code Review Checklist

- [ ] Code follows naming conventions
- [ ] No hardcoded values (use constants/config)
- [ ] Error handling implemented
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Tests included and passing
- [ ] Documentation updated
- [ ] No commented-out code
- [ ] No TODO comments without tickets

### 5.3 Security Standards

#### Required Security Practices

1. **Input Validation**
   - Sanitize and validate all user inputs
   - Use validation libraries (e.g., validator.js)
   - Escape special characters

2. **SQL Injection Prevention**
   - Always use parameterized queries
   - Never concatenate user input into queries
   - Use ORM/ODM query builders

3. **XSS Prevention**
   - Sanitize user-generated content
   - Use Content Security Policy headers
   - Escape HTML entities in outputs

4. **Rate Limiting**
   - Implement rate limiting on all API endpoints
   - Use progressive delays for failed auth attempts
   - Configure per-user and per-IP limits

5. **Authentication & Authorization**
   - Verify JWT tokens on every request
   - Implement proper RBAC using CASL.js
   - Use secure token storage practices

---

## 6. Documentation Standards

### 6.1 Code Documentation

#### JSDoc Requirements

- Document all public functions and classes
- Include parameter descriptions with types
- Document return values and types
- List potential exceptions/errors
- Provide usage examples for complex functions
- Use clear, concise descriptions

#### Documentation Elements

- `@param` - Describe each parameter
- `@returns` - Describe return value
- `@throws` - List possible exceptions
- `@example` - Provide usage examples
- `@deprecated` - Mark deprecated code
- `@since` - Version information

### 6.2 API Documentation

#### OpenAPI/Swagger Requirements

- Document all API endpoints using OpenAPI 3.0 specification
- Include request/response schemas
- Define authentication requirements
- Provide example requests and responses
- Document error responses and status codes
- Keep documentation synchronized with implementation

#### Documentation Components

- Summary and description for each endpoint
- Request body schemas and validation rules
- Response schemas for all status codes
- Security requirements and scopes
- Tags for logical grouping

---

## 7. Performance Standards

### 7.1 Performance Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| API Response Time (P50) | < 100ms | 200ms |
| API Response Time (P95) | < 200ms | 500ms |
| Page Load Time | < 2s | 3s |
| Time to Interactive | < 3s | 5s |
| Bundle Size (gzipped) | < 200KB | 300KB |

### 7.2 Performance Best Practices

#### Backend Optimization

1. **Pagination**
   - Implement cursor-based or offset pagination
   - Limit maximum page size to prevent overload
   - Use database-level pagination (skip/limit)

2. **Caching Strategy**
   - Cache frequently accessed data in Redis
   - Implement cache invalidation strategies
   - Use appropriate TTL values

3. **Database Optimization**
   - Create indexes for frequently queried fields
   - Use compound indexes for complex queries
   - Optimize query patterns with explain plans

4. **Frontend Optimization**
   - Use React.memo for expensive components
   - Implement useMemo and useCallback appropriately
   - Lazy load components and routes
   - Optimize bundle size with code splitting

---

[← Back to System Design](./README.md) | [Next: Monitoring & Observability →](./10-monitoring-observability.md)