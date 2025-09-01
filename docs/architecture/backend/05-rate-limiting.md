# Rate Limiting Architecture

## 1. Rate Limiting Strategy

### 1.1 Purpose and Scope
- **Protection**: Prevent API abuse and ensure service availability
- **Fair Usage**: Ensure equitable access to platform resources
- **Resource Management**: Protect backend services from overload
- **Security**: Mitigate brute force attacks and DDoS attempts

### 1.2 Rate Limiting Approach
- **Distributed**: Use Redis for centralized rate limiting across instances
- **Tiered**: Different limits based on endpoint type and user tier
- **Flexible**: Support for per-user, per-IP, and per-endpoint limits
- **Standard Headers**: RFC-compliant rate limit headers in responses

## 2. Rate Limit Specifications

### 2.1 General API Limits

| Endpoint Category | Window | Limit | Key Generator | Notes |
|------------------|--------|-------|---------------|-------|
| **General API** | 1 minute | 100 requests | IP address | Standard API endpoints |
| **Research Requests** | 1 minute | 10 requests | User ID | High-cost operations |
| **Authentication** | 15 minutes | 5 attempts | IP address | Login/register attempts |
| **Webhooks** | 1 minute | 50 requests | User ID | Webhook operations |
| **Admin API** | 1 minute | 200 requests | User ID | Administrative endpoints |

### 2.2 Endpoint-Specific Limits

#### Research Endpoints
- **POST /api/research**: 10 requests per minute per user
- **GET /api/research/:id**: 60 requests per minute per user
- **GET /api/research**: 30 requests per minute per user

#### Authentication Endpoints
- **POST /api/auth/login**: 5 attempts per 15 minutes per IP
- **POST /api/auth/register**: 3 attempts per hour per IP
- **POST /api/auth/refresh**: 20 requests per hour per user

#### Webhook Endpoints
- **POST /api/webhooks**: 50 requests per minute per user
- **PUT /api/webhooks/:id**: 20 requests per minute per user
- **DELETE /api/webhooks/:id**: 10 requests per minute per user

### 2.3 User Tier-Based Limits

| User Tier | Research Requests/min | API Calls/min | Concurrent Requests |
|-----------|----------------------|---------------|-------------------|
| **Free** | 5 | 50 | 2 |
| **Basic** | 10 | 100 | 5 |
| **Premium** | 25 | 250 | 10 |
| **Enterprise** | 100 | 1000 | 25 |

## 3. Rate Limit Configuration Schema

### 3.1 Rate Limiter Configuration
```json
{
  "rateLimiter": {
    "store": {
      "type": "redis",
      "host": "string",
      "port": "number",
      "prefix": "string"
    },
    "windowMs": "number (milliseconds)",
    "max": "number (requests)",
    "message": "string",
    "keyGenerator": "function | 'ip' | 'user'",
    "standardHeaders": "boolean",
    "legacyHeaders": "boolean",
    "skipSuccessfulRequests": "boolean",
    "skipFailedRequests": "boolean"
  }
}
```

### 3.2 Dynamic Rate Limit Rules
```json
{
  "dynamicRules": [
    {
      "pattern": "/api/research/*",
      "method": "POST",
      "limits": {
        "free": { "window": 60000, "max": 5 },
        "premium": { "window": 60000, "max": 25 }
      }
    },
    {
      "pattern": "/api/auth/login",
      "method": "POST",
      "limits": {
        "default": { "window": 900000, "max": 5 }
      },
      "keyGenerator": "ip"
    }
  ]
}
```

## 4. Rate Limit Response Format

### 4.1 Standard Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1640995200
Retry-After: 60
```

### 4.2 Rate Limit Exceeded Response
```json
{
  "error": "Rate limit exceeded",
  "code": 429,
  "details": {
    "limit": 100,
    "remaining": 0,
    "resetTime": 1640995200,
    "retryAfter": 60
  },
  "message": "Too many requests. Please try again in 60 seconds."
}
```

## 5. Rate Limiting Policies

### 5.1 Bypass Rules
- **Health Checks**: `/health` endpoints exempt from rate limiting
- **Webhooks Incoming**: External webhook deliveries have separate limits
- **Internal Services**: Service-to-service communication exempt
- **Admin Override**: Administrative accounts can bypass limits

### 5.2 Escalation Strategy
- **Warning**: At 80% of limit, include warning headers
- **Soft Limit**: At 100%, apply rate limiting
- **Hard Limit**: At 120% (burst), temporary IP blocking
- **Abuse Detection**: Persistent abuse triggers automated review

### 5.3 Error Handling
- **Graceful Degradation**: Continue processing other requests
- **Informative Responses**: Clear error messages with retry guidance
- **Monitoring**: Log rate limit violations for analysis
- **Recovery**: Automatic reset after time window expires

## 6. Implementation Requirements

### 6.1 Technical Requirements
- **Redis Integration**: Centralized counter storage
- **High Availability**: Rate limiting should not be a single point of failure
- **Performance**: Minimal latency impact (<5ms per request)
- **Scalability**: Support horizontal scaling of API instances

### 6.2 Monitoring and Alerting
- **Metrics**: Track rate limit hit rates, top abusers, endpoint usage
- **Alerts**: Notify on unusual rate limit patterns or abuse
- **Dashboards**: Real-time rate limiting statistics
- **Reports**: Daily/weekly rate limit usage summaries

### 6.3 Configuration Management
- **Dynamic Updates**: Support hot-reloading of rate limit rules
- **Environment-Specific**: Different limits for dev/staging/production
- **Feature Flags**: Ability to disable/modify limits per feature
- **Audit Trail**: Log all rate limit configuration changes

---

[← Back to Backend Architecture](./Readme.md)