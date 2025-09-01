# External API Integration Architecture

## 1. Integration Overview

### 1.1 Integration Strategy
- **Multi-Provider Support**: Connect to multiple procurement APIs
- **Abstraction Layer**: Unified interface for different API formats
- **Resilience Patterns**: Circuit breakers, retries, fallbacks
- **Rate Limit Management**: Respect and track API quotas
- **Response Caching**: Reduce API calls and improve performance

### 1.2 Supported API Types
- **REST APIs**: JSON/XML over HTTP/HTTPS
- **GraphQL APIs**: Query-based data fetching
- **SOAP Services**: Legacy enterprise systems
- **Webhook Receivers**: Real-time event notifications
- **File-based APIs**: FTP/SFTP data exchanges

## 2. API Provider Configuration

### 2.1 Provider Registry
```json
{
  "providerId": "supplier_api_v2",
  "name": "Supplier Procurement API",
  "type": "REST",
  "baseUrl": "https://api.supplier.com/v2",
  "authentication": {
    "type": "api_key | oauth2 | basic | jwt",
    "config": {
      "headerName": "X-API-Key",
      "tokenEndpoint": "https://auth.supplier.com/token"
    }
  },
  "rateLimits": {
    "requests": 1000,
    "window": "1h",
    "concurrent": 10
  },
  "timeout": 30000,
  "retryPolicy": {
    "maxAttempts": 3,
    "backoffStrategy": "exponential"
  },
  "capabilities": ["search", "pricing", "availability", "orders"]
}
```

### 2.2 Authentication Methods

#### API Key Authentication
```json
{
  "type": "api_key",
  "config": {
    "headerName": "X-API-Key",
    "keyLocation": "header | query | cookie",
    "keyValue": "encrypted_key_reference"
  }
}
```

#### OAuth 2.0 Authentication
```json
{
  "type": "oauth2",
  "config": {
    "clientId": "string",
    "clientSecret": "encrypted_secret",
    "tokenEndpoint": "URL",
    "scope": ["read:products", "read:pricing"],
    "grantType": "client_credentials | authorization_code"
  }
}
```

#### JWT Authentication
```json
{
  "type": "jwt",
  "config": {
    "issuer": "string",
    "audience": "string",
    "algorithm": "RS256 | HS256",
    "privateKey": "encrypted_key",
    "tokenLifetime": 3600
  }
}
```

## 3. Request/Response Specifications

### 3.1 Unified Request Format
```json
{
  "provider": "provider_id",
  "operation": "search | getDetails | checkAvailability",
  "parameters": {
    "query": "string",
    "filters": {
      "category": ["string"],
      "priceRange": { "min": 0, "max": 1000 },
      "availability": "in_stock | all"
    },
    "pagination": {
      "page": 1,
      "limit": 50
    },
    "locale": "en-US",
    "currency": "USD"
  },
  "timeout": 15000,
  "cache": {
    "enabled": true,
    "ttl": 300
  }
}
```

### 3.2 Unified Response Format
```json
{
  "provider": "provider_id",
  "operation": "search",
  "status": "success | partial | failed",
  "data": {
    "results": ["array of normalized products"],
    "totalCount": 150,
    "hasMore": true
  },
  "metadata": {
    "requestId": "uuid",
    "timestamp": "ISO 8601",
    "duration": 1250,
    "cached": false,
    "rateLimit": {
      "remaining": 950,
      "reset": "ISO 8601"
    }
  },
  "errors": [
    {
      "code": "PARTIAL_FAILURE",
      "message": "Some results could not be fetched"
    }
  ]
}
```

## 4. Data Transformation Pipeline

### 4.1 Transformation Stages

#### Stage 1: Request Mapping
- Convert unified request to provider-specific format
- Apply provider-specific parameter names
- Handle pagination differences
- Add required headers

#### Stage 2: Response Parsing
- Parse different response formats (JSON, XML, CSV)
- Handle nested data structures
- Extract relevant fields
- Handle null/missing values

#### Stage 3: Data Normalization
- Map to standard product schema
- Convert units and currencies
- Standardize categories and taxonomies
- Clean and validate data

#### Stage 4: Enrichment
- Add provider metadata
- Calculate derived fields
- Apply business rules
- Add confidence scores

### 4.2 Mapping Configuration
```json
{
  "provider": "supplier_api",
  "mappings": {
    "request": {
      "query": "$.searchTerm",
      "category": "$.filters.productCategory",
      "minPrice": "$.priceFilter.minimum"
    },
    "response": {
      "id": "$.productId",
      "title": "$.name",
      "priceUnit": "$.pricing.amount",
      "currency": "$.pricing.currency",
      "availability": {
        "path": "$.stock.status",
        "transform": {
          "available": "in_stock",
          "outOfStock": "out_of_stock",
          "limited": "limited"
        }
      }
    }
  }
}
```

## 5. Circuit Breaker Configuration

### 5.1 Circuit Breaker States
- **Closed**: Normal operation, requests pass through
- **Open**: Failures exceeded threshold, requests blocked
- **Half-Open**: Testing if service recovered

### 5.2 Circuit Breaker Parameters
```json
{
  "errorThreshold": 50,
  "errorThresholdPercentage": 50,
  "timeout": 30000,
  "resetTimeout": 60000,
  "rollingWindow": 10000,
  "volumeThreshold": 10,
  "fallbackFunction": "returnCachedData",
  "monitoringPeriod": 60000
}
```

### 5.3 Failure Scenarios
| Scenario | Threshold | Action | Recovery |
|----------|-----------|--------|----------|
| High Error Rate | 50% errors in 10s | Open circuit | Wait 60s, test |
| Timeout | 3 consecutive | Open circuit | Exponential backoff |
| 5xx Errors | 5 in 30s | Open circuit | Health check |
| Rate Limit | 429 response | Pause requests | Wait for reset |

## 6. Rate Limiting Strategy

### 6.1 Rate Limit Tracking
```json
{
  "provider": "supplier_api",
  "limits": {
    "hourly": {
      "limit": 1000,
      "used": 450,
      "remaining": 550,
      "resetAt": "ISO 8601"
    },
    "daily": {
      "limit": 10000,
      "used": 3200,
      "remaining": 6800,
      "resetAt": "ISO 8601"
    },
    "concurrent": {
      "limit": 10,
      "active": 3
    }
  }
}
```

### 6.2 Rate Limit Headers
- **X-RateLimit-Limit**: Maximum requests allowed
- **X-RateLimit-Remaining**: Requests remaining
- **X-RateLimit-Reset**: Reset timestamp
- **Retry-After**: Seconds to wait (429 response)

### 6.3 Throttling Strategy
```json
{
  "strategy": "token_bucket",
  "config": {
    "capacity": 100,
    "refillRate": 10,
    "refillInterval": 1000
  },
  "queueing": {
    "enabled": true,
    "maxQueueSize": 500,
    "queueTimeout": 30000
  }
}
```

## 7. Caching Strategy

### 7.1 Cache Levels
- **L1 Cache**: In-memory cache (5 minutes TTL)
- **L2 Cache**: Redis cache (1 hour TTL)
- **L3 Cache**: Database cache (24 hours TTL)

### 7.2 Cache Key Structure
```
provider:operation:hash(parameters):version
Example: supplier_api:search:a1b2c3d4:v1
```

### 7.3 Cache Configuration
```json
{
  "enabled": true,
  "strategy": "LRU",
  "levels": {
    "memory": {
      "maxSize": "100MB",
      "ttl": 300,
      "checkPeriod": 60
    },
    "redis": {
      "ttl": 3600,
      "keyPrefix": "api_cache",
      "compression": true
    }
  },
  "invalidation": {
    "onUpdate": true,
    "scheduled": "0 */6 * * *"
  }
}
```

## 8. Error Handling

### 8.1 Error Categories
- **Network Errors**: Connection timeouts, DNS failures
- **Authentication Errors**: Invalid credentials, expired tokens
- **Rate Limit Errors**: Quota exceeded
- **Data Errors**: Invalid response format, missing fields
- **Business Errors**: Product not found, invalid parameters

### 8.2 Error Recovery Matrix
| Error Type | Recovery Strategy | Max Retries | Backoff |
|------------|------------------|-------------|---------|
| Network Timeout | Retry with backoff | 3 | Exponential |
| 5xx Error | Circuit breaker + retry | 2 | Linear |
| 429 Rate Limit | Wait and retry | 1 | Fixed delay |
| 401 Auth Error | Refresh token | 1 | None |
| 400 Bad Request | No retry | 0 | N/A |

## 9. Monitoring and Metrics

### 9.1 Key Metrics
- **Request Rate**: Requests per second by provider
- **Success Rate**: Percentage of successful requests
- **Response Time**: P50, P95, P99 latencies
- **Error Rate**: Errors by type and provider
- **Cache Hit Rate**: Percentage served from cache
- **Circuit Breaker State**: Open/closed status

### 9.2 Health Check Endpoints
```json
{
  "provider": "supplier_api",
  "status": "healthy | degraded | unhealthy",
  "checks": {
    "connectivity": "pass",
    "authentication": "pass",
    "rateLimit": "warning",
    "responseTime": "pass"
  },
  "metrics": {
    "avgResponseTime": 250,
    "successRate": 99.5,
    "requestsToday": 3456
  },
  "lastCheck": "ISO 8601"
}
```

## 10. Security Considerations

### 10.1 Credential Management
- **Encryption**: All credentials encrypted at rest
- **Rotation**: Automatic key rotation every 90 days
- **Vault Integration**: HashiCorp Vault or AWS Secrets Manager
- **Access Control**: Role-based access to credentials

### 10.2 Data Security
- **TLS**: All API communications over HTTPS
- **Certificate Pinning**: Verify server certificates
- **Request Signing**: HMAC signatures for sensitive operations
- **PII Handling**: Mask/redact sensitive data in logs

### 10.3 Compliance
- **GDPR**: Data minimization and retention policies
- **PCI DSS**: Secure handling of payment data
- **SOC 2**: Audit trails and access controls
- **HIPAA**: PHI data protection (if applicable)