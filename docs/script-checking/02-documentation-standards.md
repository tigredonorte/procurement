# Documentation Standards for Assertion Scripts

## Overview

This document defines standards for creating machine-parseable documentation that assertion scripts can validate against implementation.

## Universal Documentation Structure

### Required Sections

Every technical document must include these sections in order:

```markdown
## Metadata

Machine-readable metadata block

## Specification

Formal definition of the component/service

## Dependencies

Internal and external dependencies

## Examples

Code examples with expected behavior

## Validation Rules

What assertion scripts should check

## Change Log

Version history and breaking changes
```

## Metadata Standards

### Required Fields

```markdown
## Metadata

**Component**: ComponentName
**Version**: X.Y.Z (semver)
**Status**: draft|working|completed|verified|deprecated
**Owner**: team-name or email
**Updated**: YYYY-MM-DD HH:MM (ISO format)
**Tags**: [tag1, tag2, tag3]
```

### Status Definitions

| Status       | Meaning             | Validation Required |
| ------------ | ------------------- | ------------------- |
| `draft`      | Under development   | Structure only      |
| `working`    | Being implemented   | Basic validation    |
| `completed`  | Implementation done | Full validation     |
| `verified`   | Tested and approved | Strict validation   |
| `deprecated` | Being phased out    | Warning only        |

## Component Documentation

### Frontend Component Specification

```markdown
## Specification

### Component Interface

**Name**: UserProfile
**Type**: Functional Component
**Category**: data-display

### Props

| Prop    | Type                | Required | Default | Description     |
| ------- | ------------------- | -------- | ------- | --------------- |
| userId  | string              | ✅       | -       | User identifier |
| variant | 'compact' \| 'full' | ❌       | 'full'  | Display variant |
| onEdit  | () => void          | ❌       | -       | Edit callback   |

### State

| State   | Type           | Initial | Description   |
| ------- | -------------- | ------- | ------------- |
| loading | boolean        | false   | Loading state |
| error   | string \| null | null    | Error message |

### Events

| Event   | Payload            | Description           |
| ------- | ------------------ | --------------------- |
| onLoad  | { userId: string } | Fired when data loads |
| onError | { error: Error }   | Fired on error        |

### Styling

- **Variants**: compact, full, card
- **Responsive**: Mobile-first breakpoints
- **Theme**: Supports light/dark
```

### API Endpoint Specification

````markdown
## Specification

### Endpoint Details

**Method**: POST
**Path**: /api/v1/research
**Authentication**: Bearer token required
**Rate Limit**: 10 req/min

### Request

**Headers**:
| Header | Required | Value |
|--------|----------|-------|
| Authorization | ✅ | Bearer {token} |
| Content-Type | ✅ | application/json |

**Body Schema**:

```json
{
  "query": "string, 3-500 chars",
  "parameters": {
    "maxResults": "number, 10-100",
    "sources": "string[], min 1"
  }
}
```
````

### Response

**Success (201)**:

```json
{
  "requestId": "uuid",
  "status": "queued",
  "estimatedTime": "number (seconds)"
}
```

**Error (422)**:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "string",
  "details": {}
}
```

````

## Dependency Documentation

### Format Requirements

```markdown
## Dependencies

### Internal Dependencies
| Service | Version | Purpose | Critical |
|---------|---------|---------|----------|
| AuthService | ^2.0.0 | Authentication | ✅ |
| DataService | ^1.5.0 | Data fetching | ✅ |

### External Dependencies
| Package | Version | License | Security |
|---------|---------|---------|----------|
| react | ^19.0.0 | MIT | ✅ Audited |
| lodash | ^4.17.21 | MIT | ⚠️ Check CVE |

### API Dependencies
| Service | Endpoint | SLA | Fallback |
|---------|----------|-----|----------|
| UserAPI | /users/{id} | 99.9% | Cache |
| SearchAPI | /search | 99.5% | Queue |
````

## Code Example Standards

### Structure Requirements

````markdown
## Examples

### Basic Usage

```typescript
// Description of what this example demonstrates
import { UserProfile } from '@/components';

function Example() {
  return (
    <UserProfile
      userId="123"
      variant="compact"
      onEdit={() => console.log('Edit clicked')}
    />
  );
}

// Expected behavior:
// - Renders user profile in compact mode
// - Console logs on edit button click
```
````

### Error Handling

```typescript
// Show how to handle errors
try {
  const result = await apiCall();
  // Expected: Successful response
} catch (error) {
  // Expected: Error with code 'NETWORK_ERROR'
  expect(error.code).toBe('NETWORK_ERROR');
}
```

````

## Validation Rules Documentation

### Format for Validation Rules

```markdown
## Validation Rules

### Structural Validation
- ✅ Component file exists at: `src/components/UserProfile/UserProfile.tsx`
- ✅ Test file exists at: `src/components/UserProfile/UserProfile.test.tsx`
- ✅ Story file exists at: `src/components/UserProfile/UserProfile.stories.tsx`

### Interface Validation
- ✅ All required props have TypeScript types
- ✅ Props match documentation specification
- ✅ Default props are provided for optional props

### Behavioral Validation
- ✅ Component renders without errors
- ✅ Events fire as documented
- ✅ State updates trigger re-renders

### Quality Validation
- ⚠️ Test coverage > 80%
- ⚠️ No console errors in development
- ⚠️ Accessibility score > 95
````

## Schema Definitions

### JSON Schema Format

````markdown
## Data Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  }
}
```
````

````

### TypeScript Interface Format

```markdown
## Type Definitions

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

type UserRole = User['role'];
type UserId = User['id'];
````

````

## Performance Requirements

### Format for Performance Specs

```markdown
## Performance Requirements

### Load Time Metrics
| Metric | Target | Maximum | Measurement |
|--------|--------|---------|-------------|
| FCP | < 1.8s | 2.5s | Lighthouse |
| LCP | < 2.5s | 4.0s | Lighthouse |
| TTI | < 3.8s | 5.0s | Lighthouse |

### Runtime Performance
| Operation | Target | Maximum | Measurement |
|-----------|--------|---------|-------------|
| Initial Render | < 16ms | 32ms | React DevTools |
| Re-render | < 8ms | 16ms | React DevTools |
| API Response | < 200ms | 500ms | Network timing |
````

## Security Requirements

### Security Documentation Format

```markdown
## Security Requirements

### Authentication

- **Method**: JWT Bearer Token
- **Expiry**: 15 minutes
- **Refresh**: Required after expiry
- **Storage**: httpOnly cookie

### Authorization

- **Model**: RBAC (Role-Based Access Control)
- **Roles**: admin, user, guest
- **Permissions**: Defined in permissions.json

### Data Protection

- **Encryption**: AES-256 for sensitive data
- **Hashing**: bcrypt for passwords
- **Sanitization**: All user inputs sanitized
```

## Cross-References

### Linking Documentation

```markdown
## Related Documentation

- **Implements**: [User Story #123](./stories/US-123.md)
- **Depends On**: [AuthService](./services/auth-service.md)
- **Used By**: [Dashboard](./pages/dashboard.md)
- **Tests**: [UserProfile.test.ts](../tests/UserProfile.test.ts)
```

## Machine-Readable Markers

### Special Markers for Scripts

```markdown
<!-- VALIDATION:START -->

This section is validated by scripts

<!-- VALIDATION:END -->

<!-- GENERATED:START -->

This section is auto-generated - do not edit

<!-- GENERATED:END -->

<!-- TODO:VALIDATION Check prop types match -->
```

## Version Control Integration

### Change Tracking

```markdown
## Change Log

### [2.1.0] - 2024-01-10

#### Added

- New `variant` prop for display options
- Event handlers for user interactions

#### Changed

- **BREAKING**: Renamed `userId` to `id`
- Updated TypeScript types

#### Fixed

- Memory leak in useEffect
- Accessibility issues with focus management

#### Validation Impact

- Update prop validation for renamed field
- Add new variant options to tests
```

## Best Practices

### Do's

- ✅ Keep documentation next to code
- ✅ Update docs before implementing changes
- ✅ Use consistent formatting
- ✅ Include examples for all use cases
- ✅ Version all breaking changes

### Don'ts

- ❌ Use ambiguous language
- ❌ Mix concerns in one document
- ❌ Leave TODOs without tracking
- ❌ Skip metadata fields
- ❌ Use relative dates ("yesterday", "recently")

## Validation Script Integration

### How Scripts Use This Documentation

1. **Parse Metadata**: Extract version, status, and update time
2. **Validate Structure**: Check required sections exist
3. **Extract Specifications**: Parse tables and code blocks
4. **Compare Implementation**: Match code against specs
5. **Generate Reports**: Output validation results

### Example Parser Usage

```javascript
const doc = parseMarkdown('component.md');
const metadata = doc.getSection('Metadata');
const props = doc.getTable('Props');
const examples = doc.getCodeBlocks('typescript');

// Validate implementation matches documentation
validateComponent({
  metadata,
  props,
  examples,
  implementation: './src/components/UserProfile',
});
```

## Related Documents

- [Core Principles](./01-core-principles.md)
- [Validation Patterns](./03-validation-patterns.md)
- [Parser Utilities](./implementation/02-parser-utilities.md)
