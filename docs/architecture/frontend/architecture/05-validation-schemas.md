# Validation Schemas - Requisio.com

## Overview

This document defines the validation patterns and requirements for the Requisio.com frontend application using Zod for data validation, form handling, and type safety.

## Validation Strategy

### Core Principles

1. **Type Safety**: All forms and API responses validated at runtime
2. **User Feedback**: Clear, actionable error messages
3. **Progressive Validation**: Real-time feedback as users type
4. **Consistency**: Shared validation between frontend and backend
5. **Composability**: Reusable schema components

## Schema Categories

### 1. User Schemas

#### Registration Schema
**Fields Required**:
- `email`: Valid email format, max 255 chars
- `firstName`: 1-100 chars, alphabetic only
- `lastName`: 1-100 chars, alphabetic only
- `organization`: 1-200 chars
- `role`: Enum (researcher, admin)
- `password`: 8-128 chars, strong password rules
- `confirmPassword`: Must match password

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### Profile Update Schema
**Fields**:
- `firstName`, `lastName`: Required
- `organization`: Required
- `phone`: Optional, E.164 format
- `timezone`: Optional, valid timezone
- `language`: Optional, supported locale

### 2. Research Request Schemas

#### Request Creation Schema
**Core Fields**:
- `query`: 3-500 chars, trimmed
- `sources`: Array, min 1, max 10 sources
- `maxResults`: Integer, 10-100 range

**Filter Options**:
- `priceRange`: Min/max with currency
- `availability`: Enum (all, in_stock, out_of_stock)
- `suppliers`: Array, max 20
- `location`: String, max 100 chars
- `categories`: Array, max 10
- `rating`: Min/max range 0-5

**Advanced Options**:
- `includeReviews`: Boolean
- `includeSpecs`: Boolean
- `includeImages`: Boolean
- `sortBy`: Enum (relevance, price, rating, newest)

#### Research Filter Schema
**List View Filters**:
- `status`: Research status enum
- `dateRange`: Start/end date validation
- `query`: Search string
- `sources`: Selected data sources

### 3. Webhook Schemas

#### Configuration Schema
**Required Fields**:
- `name`: 1-100 chars
- `url`: HTTPS URL only
- `events`: Array, min 1 event

**Optional Fields**:
- `secret`: 16-256 chars for signing
- `headers`: Max 10 custom headers
- `active`: Boolean status

**Retry Policy**:
- `maxRetries`: 0-10
- `retryDelay`: 1-60 seconds
- `backoffMultiplier`: 1-5

### 4. API Response Schemas

#### Paginated Response Pattern
```typescript
{
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  },
  meta?: {
    timestamp: string,
    version: string
  }
}
```

#### Error Response Pattern
```typescript
{
  code: string,
  message: string,
  details?: any,
  field?: string
}
```

## Validation Patterns

### Cross-Field Validation

**Password Confirmation**:
- Compare password fields
- Ensure new password differs from current

**Date Range Validation**:
- Start date before end date
- Date within allowed range

**Price Range Validation**:
- Min price <= Max price
- Positive values only

### Conditional Validation

**Dynamic Requirements**:
- Required fields based on user role
- Different validation for draft vs submit
- Optional fields become required based on other fields

### Transform Patterns

**Data Sanitization**:
- Trim whitespace
- Normalize phone numbers
- Convert to proper case
- Parse numeric strings

**Default Values**:
- Set sensible defaults
- Apply user preferences
- Use environment defaults

## Error Handling

### Error Message Guidelines

**User-Friendly Messages**:
- Specific about what's wrong
- Suggest how to fix it
- Avoid technical jargon
- Include field context

**Examples**:
- ❌ "Invalid input"
- ✅ "Email must be a valid email address"
- ❌ "Validation failed"
- ✅ "Password must contain at least one uppercase letter"

### Error Display Patterns

**Field-Level Errors**:
- Show inline with form field
- Red text color
- Icon indicator
- Helper text replacement

**Form-Level Errors**:
- Summary at top of form
- Scroll to first error
- Focus management
- Clear on correction

## Performance Considerations

### Async Validation

**When to Use**:
- Email uniqueness check
- URL availability test
- API endpoint validation

**Implementation**:
- Debounce user input (300ms)
- Show loading state
- Cache validation results
- Handle network failures

### Schema Optimization

**Best Practices**:
- Lazy load complex schemas
- Memoize schema creation
- Use partial schemas for drafts
- Separate client/server schemas

## Testing Validation

### Unit Tests
- Valid input acceptance
- Invalid input rejection
- Error message accuracy
- Transform functions
- Default values

### Integration Tests
- Form submission flow
- API response validation
- Error recovery
- Multi-step forms

## Internationalization

### Translatable Messages

**Structure**:
```typescript
{
  'validation.email.invalid': 'Invalid email address',
  'validation.required': '{field} is required',
  'validation.min': '{field} must be at least {min} characters'
}
```

**Supported Languages**:
- English (en)
- Spanish (es)
- French (fr)
- German (de)

## Related Documentation

- [Component Patterns](./04-component-examples.md)
- [State Management](./02-state-management.md)
- 

---

**Document Version**: 1.0.0 | **Last Updated**: 2025-09-01