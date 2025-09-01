# Development Standards

## N. Development Standards

### N.1 Code Organization

#### N.1.1 Monorepo Structure

```
pra-platform/
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

#### N.1.2 Naming Conventions

```typescript
// File naming
- PascalCase: Components (UserProfile.tsx)
- camelCase: Functions/utilities (parseData.ts)
- kebab-case: Folders (user-management/)
- SCREAMING_SNAKE_CASE: Constants (MAX_RETRIES)

// Code conventions
- Interfaces: Prefix with 'I' (IUser)
- Types: PascalCase (UserRole)
- Enums: PascalCase with UPPER_CASE values
```

### N.2 Testing Strategy

#### N.2.1 Test Coverage Requirements

| Component | Unit Tests | Integration Tests | E2E Tests |
|-----------|------------|-------------------|-----------|
| Frontend Components | 80% | - | - |
| Backend Controllers | 90% | 80% | - |
| Backend Services | 95% | 85% | - |
| Worker Jobs | 90% | 80% | - |
| Critical Paths | 100% | 95% | 80% |

#### N.2.2 Test Structure

```typescript
// Backend Test Example
describe('ResearchController', () => {
  describe('POST /api/v1/research', () => {
    it('should create research request when valid data provided', async () => {
      // Given
      const user = await createTestUser({ role: 'researcher' });
      const token = generateToken(user);
      const payload = {
        query: 'office chairs',
        parameters: { maxResults: 50 }
      };
      
      // When
      const response = await request(app)
        .post('/api/v1/research')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
      
      // Then
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        status: 'queued',
        query: payload.query
      });
    });
    
    it('should return 403 when user lacks permission', async () => {
      // Test implementation
    });
    
    it('should return 422 when invalid data provided', async () => {
      // Test implementation
    });
  });
});
```

### N.3 Git Workflow

#### N.3.1 Branch Strategy

```
main (production-ready)
  └── develop (integration branch)
       ├── feature/PRA-XXX-feature-name
       ├── fix/PRA-XXX-bug-description
       └── chore/PRA-XXX-task-description
```

#### N.3.2 Commit Convention

```
type(scope): subject

body (optional)

footer (optional)

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(research): add webhook notification support
```