# Backend API Service Design

## 1. Architecture Overview

### 1.1 Architecture Pattern
- **Pattern**: Layered architecture with dependency injection
- **Framework**: Express.js with TypeScript
- **Structure**: Controller → Service → Repository pattern
- **Communication**: RESTful API with JSON payloads

### 1.2 Core Design Principles
- **Separation of Concerns**: Each layer handles specific responsibilities
- **Dependency Injection**: Components receive dependencies through constructors
- **Error Propagation**: Errors bubble up through layers for centralized handling
- **Stateless Services**: All business logic components are stateless
- **Repository Pattern**: Data access abstracted from business logic

## 2. API Endpoint Specifications

### 2.1 Authentication Endpoints

#### POST /api/auth/register
**Purpose**: Register a new user account
**Request Body**:
```json
{
  "email": "string (email format)",
  "password": "string (min 8 chars)",
  "companyName": "string",
  "fullName": "string"
}
```
**Response**: 
- Status: 201 Created
- Body: `{ "id": "uuid", "email": "string", "createdAt": "ISO 8601" }`

#### POST /api/auth/login
**Purpose**: Authenticate user and obtain tokens
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**:
- Status: 200 OK
- Body: `{ "accessToken": "JWT", "refreshToken": "JWT", "expiresIn": 3600 }`

#### POST /api/auth/refresh
**Purpose**: Refresh access token using refresh token
**Request Body**:
```json
{
  "refreshToken": "string"
}
```
**Response**:
- Status: 200 OK
- Body: `{ "accessToken": "JWT", "expiresIn": 3600 }`

### 2.2 Research Request Endpoints

#### POST /api/research
**Purpose**: Submit a new research request
**Authentication**: Required (Bearer token)
**Request Body**:
```json
{
  "query": "string",
  "parameters": {
    "categories": ["string"],
    "priceRange": { "min": "number", "max": "number" },
    "suppliers": ["string"],
    "region": "string",
    "urgency": "low | medium | high"
  },
  "webhookUrl": "string (optional URL)",
  "metadata": "object (optional)"
}
```
**Response**:
- Status: 201 Created
- Body: `{ "requestId": "uuid", "status": "queued", "estimatedTime": "seconds", "queuePosition": "number" }`

#### GET /api/research/:requestId
**Purpose**: Get research request status and results
**Authentication**: Required
**Path Parameters**: 
- `requestId`: UUID of the research request
**Response**:
- Status: 200 OK
- Body:
```json
{
  "requestId": "uuid",
  "status": "queued | processing | completed | failed",
  "progress": "number (0-100)",
  "results": ["array of normalized products (when completed)"],
  "error": "object (when failed)",
  "createdAt": "ISO 8601",
  "completedAt": "ISO 8601 (optional)"
}
```

#### GET /api/research
**Purpose**: List user's research requests
**Authentication**: Required
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: string (filter by status)
- `fromDate`: ISO 8601 date
- `toDate`: ISO 8601 date
**Response**:
- Status: 200 OK
- Body:
```json
{
  "requests": ["array of research summaries"],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "hasNext": "boolean"
  }
}
```

### 2.3 Webhook Configuration Endpoints

#### POST /api/webhooks
**Purpose**: Register a webhook endpoint
**Authentication**: Required
**Request Body**:
```json
{
  "url": "string (URL)",
  "events": ["research.completed", "research.failed", "research.progress"],
  "secret": "string (optional)",
  "active": "boolean"
}
```
**Response**:
- Status: 201 Created
- Body: `{ "webhookId": "uuid", "url": "string", "active": "boolean" }`

#### PUT /api/webhooks/:webhookId
**Purpose**: Update webhook configuration
**Authentication**: Required
**Response**:
- Status: 200 OK
- Body: Updated webhook configuration

#### DELETE /api/webhooks/:webhookId
**Purpose**: Remove webhook configuration
**Authentication**: Required
**Response**:
- Status: 204 No Content

### 2.4 API Key Management

#### POST /api/keys
**Purpose**: Generate new API key
**Authentication**: Required
**Request Body**:
```json
{
  "name": "string",
  "permissions": ["read", "write"],
  "expiresAt": "ISO 8601 (optional)"
}
```
**Response**:
- Status: 201 Created
- Body: `{ "keyId": "uuid", "apiKey": "string (shown once)", "name": "string" }`

#### GET /api/keys
**Purpose**: List API keys (without sensitive data)
**Authentication**: Required
**Response**:
- Status: 200 OK
- Body: Array of key metadata (id, name, permissions, lastUsed, expiresAt)

## 3. Data Models

### 3.1 Core Entities

#### User Entity
- `id`: UUID
- `email`: Unique email address
- `passwordHash`: Bcrypt hash
- `companyName`: String
- `fullName`: String
- `role`: Enum (admin, user)
- `status`: Enum (active, suspended, deleted)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### ResearchRequest Entity
- `id`: UUID
- `userId`: Foreign key to User
- `query`: Search query string
- `parameters`: JSON object with search parameters
- `status`: Enum (queued, processing, completed, failed)
- `progress`: Integer (0-100)
- `results`: JSON array of normalized products
- `error`: JSON object with error details
- `webhookUrl`: Optional URL for notifications
- `metadata`: Optional JSON object
- `createdAt`: Timestamp
- `startedAt`: Optional timestamp
- `completedAt`: Optional timestamp

#### WebhookConfig Entity
- `id`: UUID
- `userId`: Foreign key to User
- `url`: Webhook endpoint URL
- `secret`: Optional shared secret for signing
- `events`: Array of subscribed events
- `active`: Boolean
- `lastTriggered`: Optional timestamp
- `failureCount`: Integer
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 3.2 Normalized Product Schema
```json
{
  "id": "string (unique identifier)",
  "title": "string",
  "description": "string (optional)",
  "priceUnit": "number",
  "currency": "string (ISO 4217)",
  "availability": "in_stock | out_of_stock | limited",
  "supplier": {
    "name": "string",
    "id": "string",
    "rating": "number (optional)"
  },
  "images": ["array of URLs"],
  "specifications": "object (key-value pairs)",
  "url": "string (product page URL)",
  "lastUpdated": "ISO 8601"
}
```

## 4. Service Layer Specifications

### 4.1 Authentication Service
**Responsibilities**:
- User registration validation and creation
- Password hashing and verification
- JWT token generation and validation
- Refresh token management
- Session management

**Key Methods**:
- `register(userData)`: Creates new user account
- `authenticate(credentials)`: Validates credentials and returns tokens
- `refreshToken(refreshToken)`: Issues new access token
- `validateToken(token)`: Verifies JWT and returns payload
- `revokeToken(token)`: Blacklists a token

### 4.2 Research Service
**Responsibilities**:
- Research request validation
- Queue job creation and management
- Status tracking and updates
- Result retrieval and formatting
- Progress monitoring

**Key Methods**:
- `createRequest(userId, query, parameters)`: Submits new research
- `getRequestStatus(requestId)`: Returns current status and progress
- `getResults(requestId)`: Retrieves completed results
- `cancelRequest(requestId)`: Cancels pending/processing request
- `retryRequest(requestId)`: Retries failed request

### 4.3 Webhook Service
**Responsibilities**:
- Webhook registration and validation
- Event dispatching
- Retry logic for failed deliveries
- Signature generation for secure webhooks
- Delivery tracking

**Key Methods**:
- `registerWebhook(userId, config)`: Creates webhook configuration
- `dispatch(event, data)`: Sends webhook notifications
- `verifySignature(payload, signature)`: Validates webhook authenticity
- `handleFailure(webhookId, error)`: Manages delivery failures
- `getDeliveryHistory(webhookId)`: Returns delivery logs

## 5. Middleware Components

### 5.1 Authentication Middleware
- Validates JWT tokens from Authorization header
- Extracts user context from token
- Handles token expiration gracefully
- Supports both Bearer tokens and API keys

### 5.2 Rate Limiting Middleware
- Implements per-user and per-IP rate limits
- Uses sliding window algorithm
- Configurable limits per endpoint
- Returns appropriate rate limit headers

### 5.3 Validation Middleware
- Validates request body against schemas
- Sanitizes input data
- Provides detailed validation errors
- Supports custom validation rules

### 5.4 Error Handling Middleware
- Catches and formats all errors consistently
- Logs errors with appropriate severity
- Returns user-friendly error messages
- Includes error codes for client handling

### 5.5 CORS Middleware
- Configures allowed origins
- Handles preflight requests
- Sets appropriate headers
- Supports credentials

## 6. Response Standards

### 6.1 Success Response Format
```json
{
  "success": true,
  "data": "response payload",
  "meta": {
    "timestamp": "ISO 8601",
    "version": "API version"
  }
}
```

### 6.2 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": "additional error context (optional)",
    "field": "field name (for validation errors)"
  },
  "meta": {
    "timestamp": "ISO 8601",
    "requestId": "UUID for tracking"
  }
}
```

### 6.3 Standard HTTP Status Codes
- **200**: Success
- **201**: Created
- **204**: No Content
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **422**: Unprocessable Entity
- **429**: Too Many Requests
- **500**: Internal Server Error
- **503**: Service Unavailable

## 7. API Versioning Strategy

- **Method**: URL path versioning (/api/v1/, /api/v2/)
- **Deprecation Policy**: 6-month notice before removing old versions
- **Backward Compatibility**: Minor versions maintain compatibility
- **Version Headers**: Include API version in response headers