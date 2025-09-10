# User Management API Specification

## Metadata

**Service**: UserManagementAPI
**Version**: 2.1.0
**Base Path**: /api/v2/users
**Status**: working
**Owner**: backend-team
**Updated**: 2025-01-10 14:30
**Tags**: [authentication, user-data, core-service]

## Endpoints

### GET /users/{userId}

**Description**: Retrieve user details by ID
**Authentication**: Bearer token required
**Rate Limit**: 100 req/min
**Cache**: 5 minutes

**Path Parameters**:

- `userId` (string, required): User unique identifier (UUID v4)

**Query Parameters**:

- `include` (string, optional): Comma-separated list of related data to include (profile,settings,roles)

**Response 200**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "johndoe",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-06-20T14:22:00Z",
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": "https://cdn.example.com/avatars/user123.jpg"
  }
}
```

**Response 401**:

```json
{
  "error": "unauthorized",
  "message": "Invalid or expired authentication token"
}
```

**Response 404**:

```json
{
  "error": "not_found",
  "message": "User not found"
}
```

### POST /users

**Description**: Create a new user account
**Authentication**: Admin token required
**Rate Limit**: 10 req/min
**Idempotency**: Required (via Idempotency-Key header)

**Request Headers**:

- `Idempotency-Key` (string, required): Unique request identifier for idempotent operations

**Request Body**:

```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "SecurePassword123!",
  "profile": {
    "first_name": "Jane",
    "last_name": "Smith"
  },
  "roles": ["user"]
}
```

**Response 201**:

```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "email": "newuser@example.com",
  "username": "newuser",
  "status": "pending_verification",
  "created_at": "2025-01-10T14:30:00Z",
  "verification_token_sent": true
}
```

**Response 400**:

```json
{
  "error": "validation_error",
  "message": "Invalid request data",
  "details": {
    "email": "Email already exists",
    "password": "Password must be at least 8 characters"
  }
}
```

**Response 409**:

```json
{
  "error": "conflict",
  "message": "Username already taken"
}
```

### PUT /users/{userId}

**Description**: Update user information
**Authentication**: Bearer token required (self or admin)
**Rate Limit**: 20 req/min
**Audit**: All changes logged

**Path Parameters**:

- `userId` (string, required): User unique identifier

**Request Body**:

```json
{
  "email": "updated@example.com",
  "profile": {
    "first_name": "John",
    "last_name": "Updated"
  }
}
```

**Response 200**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "updated@example.com",
  "username": "johndoe",
  "status": "active",
  "updated_at": "2025-01-10T14:35:00Z",
  "changes_applied": ["email", "profile.last_name"]
}
```

### DELETE /users/{userId}

**Description**: Soft delete a user account
**Authentication**: Admin token required
**Rate Limit**: 5 req/min
**Confirmation**: Requires confirmation token

**Path Parameters**:

- `userId` (string, required): User unique identifier

**Query Parameters**:

- `confirmation_token` (string, required): Deletion confirmation token from email

**Response 200**:

```json
{
  "message": "User account successfully deleted",
  "deleted_at": "2025-01-10T14:40:00Z",
  "data_retention_days": 30
}
```

### GET /users

**Description**: List users with pagination and filtering
**Authentication**: Bearer token required
**Rate Limit**: 50 req/min
**Cache**: 2 minutes

**Query Parameters**:

- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (max: 100, default: 20)
- `status` (string, optional): Filter by status (active,inactive,pending)
- `search` (string, optional): Search in email and username
- `sort` (string, optional): Sort field (created_at,updated_at,username)
- `order` (string, optional): Sort order (asc,desc)

**Response 200**:

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "johndoe",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "links": {
    "self": "/api/v2/users?page=1&limit=20",
    "next": "/api/v2/users?page=2&limit=20",
    "last": "/api/v2/users?page=8&limit=20"
  }
}
```

## Data Models

### User

| Field                 | Type     | Required | Validation                          | Description                 |
| --------------------- | -------- | -------- | ----------------------------------- | --------------------------- |
| id                    | UUID     | yes      | UUID v4                             | Unique identifier           |
| email                 | string   | yes      | RFC 5322 email                      | User email address          |
| username              | string   | yes      | 3-30 chars, alphanumeric+underscore | Unique username             |
| password_hash         | string   | yes      | bcrypt hash                         | Encrypted password          |
| status                | enum     | yes      | active,inactive,pending,suspended   | Account status              |
| email_verified        | boolean  | yes      | -                                   | Email verification status   |
| created_at            | datetime | yes      | ISO 8601                            | Account creation timestamp  |
| updated_at            | datetime | yes      | ISO 8601                            | Last modification timestamp |
| deleted_at            | datetime | no       | ISO 8601                            | Soft deletion timestamp     |
| last_login_at         | datetime | no       | ISO 8601                            | Last successful login       |
| failed_login_attempts | integer  | yes      | 0-10                                | Failed login counter        |
| locked_until          | datetime | no       | ISO 8601                            | Account lock expiration     |

### Profile

| Field         | Type   | Required | Validation           | Description         |
| ------------- | ------ | -------- | -------------------- | ------------------- |
| user_id       | UUID   | yes      | FK to User.id        | User reference      |
| first_name    | string | no       | 1-50 chars           | First name          |
| last_name     | string | no       | 1-50 chars           | Last name           |
| avatar_url    | string | no       | Valid URL            | Profile picture URL |
| bio           | string | no       | Max 500 chars        | User biography      |
| date_of_birth | date   | no       | Past date, 13+ years | Birth date          |
| phone         | string | no       | E.164 format         | Phone number        |
| timezone      | string | no       | IANA timezone        | User timezone       |
| locale        | string | no       | ISO 639-1            | Preferred language  |

### Role

| Field       | Type     | Required | Validation            | Description         |
| ----------- | -------- | -------- | --------------------- | ------------------- |
| id          | UUID     | yes      | UUID v4               | Role identifier     |
| name        | string   | yes      | 3-50 chars            | Role name           |
| description | string   | no       | Max 200 chars         | Role description    |
| permissions | array    | yes      | Valid permission keys | List of permissions |
| created_at  | datetime | yes      | ISO 8601              | Creation timestamp  |

## Business Rules

- BR001: Email addresses must be unique across all users (including soft-deleted)
- BR002: Usernames must be unique among active users
- BR003: Password must meet complexity requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- BR004: Failed login attempts > 5 triggers 15-minute account lock
- BR005: Email verification required within 7 days of registration
- BR006: Soft-deleted user data retained for 30 days then permanently deleted
- BR007: Users can only update their own profile unless admin role
- BR008: Username changes limited to once per 30 days
- BR009: Email changes require re-verification
- BR010: Admin actions require 2FA confirmation
- BR011: API tokens expire after 24 hours of inactivity
- BR012: Rate limits apply per IP and per user token
- BR013: Sensitive fields (SSN, payment info) must be encrypted at rest
- BR014: All password changes trigger email notification
- BR015: Profile pictures must be < 5MB and in approved formats (jpg, png, webp)

## Security Requirements

### Authentication

- **Method**: OAuth 2.0 Bearer Token
- **Token Type**: JWT
- **Expiration**: 1 hour (access), 30 days (refresh)
- **Rotation**: Refresh tokens rotated on use
- **Storage**: HttpOnly cookies for web, secure storage for mobile

### Authorization

- **Model**: Role-Based Access Control (RBAC)
- **Roles**: admin, moderator, user, guest
- **Inheritance**: Hierarchical (admin > moderator > user > guest)
- **Attribute-Based**: Additional context-aware permissions

### Data Protection

- **Encryption at Rest**: AES-256-GCM
- **Encryption in Transit**: TLS 1.3
- **PII Handling**: Tokenization for sensitive fields
- **Key Management**: AWS KMS or HashiCorp Vault

### Audit Requirements

- **Events Logged**: All write operations, auth attempts, permission changes
- **Retention**: 90 days hot storage, 7 years cold storage
- **Format**: Structured JSON with correlation IDs
- **Compliance**: GDPR, CCPA, SOC2

## Performance Requirements

### Response Times (95th percentile)

- GET single resource: < 100ms
- GET list (paginated): < 200ms
- POST/PUT operations: < 300ms
- DELETE operations: < 150ms

### Throughput

- Read operations: 10,000 req/sec
- Write operations: 1,000 req/sec
- Concurrent connections: 50,000

### Availability

- **SLA**: 99.9% uptime
- **Maintenance Window**: Sunday 02:00-04:00 UTC
- **Disaster Recovery**: RPO 1 hour, RTO 4 hours

## Error Handling

### Error Response Format

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {},
  "correlation_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-10T14:30:00Z",
  "documentation_url": "https://docs.api.example.com/errors/error_code"
}
```

### Standard Error Codes

| Code                | HTTP Status | Description                       |
| ------------------- | ----------- | --------------------------------- |
| unauthorized        | 401         | Missing or invalid authentication |
| forbidden           | 403         | Insufficient permissions          |
| not_found           | 404         | Resource does not exist           |
| validation_error    | 400         | Request validation failed         |
| conflict            | 409         | Resource state conflict           |
| rate_limit_exceeded | 429         | Too many requests                 |
| internal_error      | 500         | Server error                      |
| service_unavailable | 503         | Temporary unavailability          |

## Dependencies

### External Services

- **Authentication**: Auth0 / Okta (v2.x)
- **Email Service**: SendGrid API (v3.x)
- **Storage**: AWS S3 (for avatars)
- **Cache**: Redis (v7.x)
- **Search**: Elasticsearch (v8.x)

### Internal Services

- **Notification Service**: v1.2+ (for email/SMS)
- **Audit Service**: v2.0+ (for compliance logging)
- **Analytics Service**: v1.0+ (for metrics)

## Testing Requirements

### Unit Tests

- **Coverage Target**: 85%
- **Focus Areas**: Business logic, validators, transformers

### Integration Tests

- **Coverage Target**: 70%
- **Focus Areas**: Database operations, external service calls

### Contract Tests

- **Tool**: Pact or Spring Cloud Contract
- **Scenarios**: All endpoint variations

### Load Tests

- **Tool**: K6 or JMeter
- **Scenarios**: Normal load, peak load, stress test
- **Frequency**: Before each release

### Security Tests

- **SAST**: SonarQube scan on each commit
- **DAST**: OWASP ZAP weekly scan
- **Dependency Scan**: Daily vulnerability check

## Changelog

### v2.1.0 (2025-01-10)

- Added profile picture upload support
- Implemented rate limiting per endpoint
- Enhanced password complexity requirements

### v2.0.0 (2024-12-01)

- Breaking: Changed response format for list endpoints
- Added pagination links
- Implemented soft delete

### v1.5.0 (2024-10-15)

- Added 2FA support for admin operations
- Improved error response format
- Added correlation IDs for debugging
