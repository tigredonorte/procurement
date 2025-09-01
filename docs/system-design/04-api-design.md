# API Design - Requisio.com

## 1. API Overview

### 1.1 Design Principles
- **RESTful**: Follow REST conventions for resource-based APIs
- **Versioned**: All APIs versioned with `/api/v1` prefix
- **Consistent**: Uniform response formats and error handling
- **Documented**: OpenAPI/Swagger specification
- **Secure**: Authentication required for all endpoints
- **Paginated**: Large datasets returned with pagination

### 1.2 Base Configuration
```
Base URL: https://api.requisio.com
Version: v1
Content-Type: application/json
Authentication: Bearer {JWT_TOKEN}
```

## 2. Authentication Endpoints

### 2.1 User Registration
```yaml
POST /api/v1/auth/register
Request:
  body:
    email: string (required)
    password: string (min 8 chars)
    firstName: string
    lastName: string
    organization:
      name: string
      type: enum [hospital, hotel, school, commercial_building]
Response:
  201 Created:
    id: string
    email: string
    message: "Registration successful"
  400 Bad Request:
    error: "Validation error"
    details: []
```

### 2.2 User Login
```yaml
POST /api/v1/auth/login
Request:
  body:
    email: string
    password: string
Response:
  200 OK:
    token: string (JWT)
    refreshToken: string
    user:
      id: string
      email: string
      role: string
      organization: object
    abilities: [] # CASL permissions
  401 Unauthorized:
    error: "Invalid credentials"
```

### 2.3 Token Refresh
```yaml
POST /api/v1/auth/refresh
Headers:
  Authorization: Bearer {REFRESH_TOKEN}
Response:
  200 OK:
    token: string
    refreshToken: string
  401 Unauthorized:
    error: "Invalid or expired refresh token"
```

### 2.4 Logout
```yaml
POST /api/v1/auth/logout
Headers:
  Authorization: Bearer {TOKEN}
Response:
  204 No Content
```

## 3. Research Management Endpoints

### 3.1 Create Research Request
```yaml
POST /api/v1/research
Headers:
  Authorization: Bearer {TOKEN}
Request:
  body:
    query:
      text: string (required, min 3 chars)
      categories: string[] (optional)
      filters:
        priceRange:
          min: number
          max: number
          currency: string (USD, EUR, GBP)
        availability: enum [in_stock, all]
        suppliers: string[]
        location: string
    parameters:
      sources: string[] (default: ["serpapi"])
      maxResults: number (10-500, default: 50)
      searchDepth: enum [shallow, medium, deep]
      includeImages: boolean (default: true)
      includeReviews: boolean (default: false)
Response:
  201 Created:
    id: string
    status: "queued"
    estimatedTime: number (seconds)
    createdAt: string (ISO 8601)
  400 Bad Request:
    error: "Validation error"
    details: []
  429 Too Many Requests:
    error: "Rate limit exceeded"
    retryAfter: number (seconds)
```

### 3.2 List Research Requests
```yaml
GET /api/v1/research
Headers:
  Authorization: Bearer {TOKEN}
Query Parameters:
  page: number (default: 1)
  limit: number (10-100, default: 20)
  status: enum [queued, processing, completed, failed]
  sortBy: enum [createdAt, completedAt, status]
  sortOrder: enum [asc, desc]
  search: string (text search)
Response:
  200 OK:
    data: [
      {
        id: string
        query: object
        status: object
        createdAt: string
        completedAt: string
        resultsCount: number
      }
    ]
    pagination:
      page: number
      limit: number
      total: number
      pages: number
    links:
      self: string
      next: string
      prev: string
      first: string
      last: string
```

### 3.3 Get Research Details
```yaml
GET /api/v1/research/{id}
Headers:
  Authorization: Bearer {TOKEN}
Path Parameters:
  id: string (research ID)
Response:
  200 OK:
    id: string
    userId: string
    query: object
    parameters: object
    status:
      current: string
      progress: number
      message: string
      startedAt: string
      completedAt: string
      processingTime: number
    results:
      summary: object
      products: []
    metadata:
      createdAt: string
      updatedAt: string
  404 Not Found:
    error: "Research not found"
```

### 3.4 Get Research Status
```yaml
GET /api/v1/research/{id}/status
Headers:
  Authorization: Bearer {TOKEN}
Path Parameters:
  id: string
Response:
  200 OK:
    id: string
    status: string
    progress: number (0-100)
    message: string
    estimatedTimeRemaining: number (seconds)
```

### 3.5 Cancel Research
```yaml
DELETE /api/v1/research/{id}
Headers:
  Authorization: Bearer {TOKEN}
Path Parameters:
  id: string
Response:
  204 No Content
  400 Bad Request:
    error: "Cannot cancel completed research"
```

### 3.6 Export Research Results
```yaml
GET /api/v1/research/{id}/export
Headers:
  Authorization: Bearer {TOKEN}
Path Parameters:
  id: string
Query Parameters:
  format: enum [json, csv, xlsx]
Response:
  200 OK:
    Content-Type: varies by format
    Content-Disposition: attachment; filename="research-{id}.{ext}"
    Body: File content
```

## 4. Webhook Configuration Endpoints

### 4.1 List Webhooks
```yaml
GET /api/v1/webhooks
Headers:
  Authorization: Bearer {TOKEN}
Response:
  200 OK:
    webhooks: [
      {
        id: string
        url: string
        events: string[]
        active: boolean
        lastDelivery: string
        failureCount: number
        createdAt: string
      }
    ]
```

### 4.2 Create Webhook
```yaml
POST /api/v1/webhooks
Headers:
  Authorization: Bearer {TOKEN}
Request:
  body:
    url: string (valid HTTPS URL)
    events: string[] (required)
      - research.completed
      - research.failed
      - research.cancelled
    secret: string (optional, for HMAC)
Response:
  201 Created:
    id: string
    url: string
    events: string[]
    active: boolean
    createdAt: string
```

### 4.3 Update Webhook
```yaml
PUT /api/v1/webhooks/{id}
Headers:
  Authorization: Bearer {TOKEN}
Path Parameters:
  id: string
Request:
  body:
    url: string (optional)
    events: string[] (optional)
    active: boolean (optional)
    secret: string (optional)
Response:
  200 OK:
    id: string
    url: string
    events: string[]
    active: boolean
    updatedAt: string
```

### 4.4 Delete Webhook
```yaml
DELETE /api/v1/webhooks/{id}
Headers:
  Authorization: Bearer {TOKEN}
Path Parameters:
  id: string
Response:
  204 No Content
```

### 4.5 Test Webhook
```yaml
POST /api/v1/webhooks/{id}/test
Headers:
  Authorization: Bearer {TOKEN}
Path Parameters:
  id: string
Response:
  200 OK:
    success: boolean
    statusCode: number
    responseTime: number
    error: string (if failed)
```

## 5. User Management Endpoints

### 5.1 Get User Profile
```yaml
GET /api/v1/users/me
Headers:
  Authorization: Bearer {TOKEN}
Response:
  200 OK:
    id: string
    email: string
    firstName: string
    lastName: string
    organization: object
    role: string
    preferences: object
    limits: object
    usage: object
    createdAt: string
```

### 5.2 Update User Profile
```yaml
PATCH /api/v1/users/me
Headers:
  Authorization: Bearer {TOKEN}
Request:
  body:
    firstName: string (optional)
    lastName: string (optional)
    preferences: object (optional)
Response:
  200 OK:
    (updated user object)
```

### 5.3 Get Usage Statistics
```yaml
GET /api/v1/users/me/usage
Headers:
  Authorization: Bearer {TOKEN}
Query Parameters:
  period: enum [day, week, month, year]
Response:
  200 OK:
    period: string
    searches:
      total: number
      successful: number
      failed: number
    apiCalls: number
    webhooks:
      sent: number
      delivered: number
      failed: number
    quotaRemaining:
      daily: number
      monthly: number
```

## 6. Webhook Payload Formats

### 6.1 Research Completed Event
```json
{
  "event": "research.completed",
  "timestamp": "2025-09-01T10:00:00Z",
  "signature": "hmac-sha256-signature",
  "data": {
    "researchId": "res_123456",
    "userId": "usr_789012",
    "query": {
      "text": "ergonomic office chairs",
      "filters": {}
    },
    "status": "completed",
    "processingTime": 15.5,
    "results": {
      "summary": {
        "totalFound": 150,
        "totalNormalized": 95,
        "avgPrice": 450.50
      },
      "products": [
        {
          "id": "prod_001",
          "title": "Premium Ergonomic Chair",
          "price": 599.99,
          "currency": "USD",
          "availability": "in_stock",
          "supplier": "ErgoFurniture Inc",
          "imageUrl": "https://...",
          "description": "..."
        }
      ]
    }
  }
}
```

### 6.2 Research Failed Event
```json
{
  "event": "research.failed",
  "timestamp": "2025-09-01T10:00:00Z",
  "signature": "hmac-sha256-signature",
  "data": {
    "researchId": "res_123456",
    "userId": "usr_789012",
    "query": {
      "text": "ergonomic office chairs"
    },
    "error": {
      "code": "API_ERROR",
      "message": "External API rate limit exceeded",
      "details": {
        "source": "serpapi",
        "retryAfter": 3600
      }
    }
  }
}
```

## 7. Error Response Format

### 7.1 Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "query.text",
        "message": "Minimum length is 3 characters"
      }
    ],
    "timestamp": "2025-09-01T10:00:00Z",
    "path": "/api/v1/research",
    "requestId": "req_abc123"
  }
}
```

### 7.2 Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid request data |
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (duplicate) |
| RATE_LIMIT | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Temporary unavailability |

## 8. Rate Limiting

### 8.1 Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703592000
X-RateLimit-Reset-After: 3600
```

### 8.2 Rate Limits by Endpoint
| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 5 | 15 min |
| POST /research | 100 | 1 hour |
| GET /research | 1000 | 1 hour |
| POST /webhooks/*/test | 10 | 1 hour |
| Default | 100 | 1 min |

## 9. API Versioning Strategy

### 9.1 Version in URL
- Current: `/api/v1/`
- Future: `/api/v2/`

### 9.2 Deprecation Policy
- Minimum 6 months notice before deprecation
- Sunset headers in responses
- Migration guide documentation

### 9.3 Backward Compatibility
- New optional fields allowed
- Existing fields not removed in same major version
- Response format additions allowed

---

## Next Documents
- [05 - System Architecture](./05-system-architecture.md)
- [06 - Trade-offs and Decisions](./06-trade-offs.md)