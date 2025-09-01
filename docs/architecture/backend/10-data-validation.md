# Data Validation Architecture

## 1. Validation Strategy

### 1.1 Validation Principles
- **Input Validation**: All external input must be validated before processing
- **Schema-First**: Define schemas before implementing endpoints
- **Fail Fast**: Reject invalid data early in the request lifecycle
- **Consistent Errors**: Standardized validation error responses
- **Type Safety**: Ensure runtime data matches TypeScript types

### 1.2 Validation Layers
- **API Gateway**: Basic format and size validation
- **Request Middleware**: Schema validation for all endpoints
- **Business Logic**: Domain-specific validation rules
- **Database Layer**: Final constraint validation
- **Response Validation**: Ensure response data integrity

## 2. Validation Schema Definitions

### 2.1 User Management Schemas

#### User Registration Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["email", "password", "companyName", "fullName"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 254
    },
    "password": {
      "type": "string",
      "minLength": 12,
      "maxLength": 128,
      "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
    },
    "companyName": {
      "type": "string",
      "minLength": 2,
      "maxLength": 100,
      "pattern": "^[A-Za-z0-9\\s\\-&.,]+$"
    },
    "fullName": {
      "type": "string",
      "minLength": 2,
      "maxLength": 100,
      "pattern": "^[A-Za-z\\s\\-']+$"
    }
  },
  "additionalProperties": false
}
```

#### User Login Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["email", "password"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "password": {
      "type": "string",
      "minLength": 1,
      "maxLength": 128
    }
  },
  "additionalProperties": false
}
```

### 2.2 Research Request Schemas

#### Research Request Creation Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["query"],
  "properties": {
    "query": {
      "type": "string",
      "minLength": 3,
      "maxLength": 1000,
      "pattern": "^[^<>{}]+$"
    },
    "parameters": {
      "type": "object",
      "properties": {
        "categories": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["electronics", "office", "industrial", "medical", "automotive", "other"]
          },
          "maxItems": 5,
          "uniqueItems": true
        },
        "priceRange": {
          "type": "object",
          "properties": {
            "min": {
              "type": "number",
              "minimum": 0,
              "maximum": 1000000
            },
            "max": {
              "type": "number",
              "minimum": 0,
              "maximum": 1000000
            },
            "currency": {
              "type": "string",
              "pattern": "^[A-Z]{3}$"
            }
          },
          "additionalProperties": false
        },
        "suppliers": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "maxItems": 10,
          "uniqueItems": true
        },
        "region": {
          "type": "string",
          "enum": ["north-america", "europe", "asia-pacific", "global"]
        },
        "urgency": {
          "type": "string",
          "enum": ["low", "medium", "high"]
        },
        "maxResults": {
          "type": "number",
          "minimum": 10,
          "maximum": 1000,
          "default": 50
        }
      },
      "additionalProperties": false
    },
    "webhookUrl": {
      "type": "string",
      "format": "uri",
      "pattern": "^https://"
    },
    "metadata": {
      "type": "object",
      "maxProperties": 10
    }
  },
  "additionalProperties": false
}
```

### 2.3 Webhook Configuration Schemas

#### Webhook Registration Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["url", "events"],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "pattern": "^https://[^\\s/$.?#].[^\\s]*$",
      "maxLength": 2048
    },
    "events": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "research.queued",
          "research.started", 
          "research.progress",
          "research.completed",
          "research.failed",
          "research.cancelled"
        ]
      },
      "minItems": 1,
      "maxItems": 6,
      "uniqueItems": true
    },
    "secret": {
      "type": "string",
      "minLength": 16,
      "maxLength": 64,
      "pattern": "^[A-Za-z0-9+/=]+$"
    },
    "active": {
      "type": "boolean",
      "default": true
    },
    "retryPolicy": {
      "type": "object",
      "properties": {
        "maxRetries": {
          "type": "number",
          "minimum": 0,
          "maximum": 10,
          "default": 3
        },
        "backoffMultiplier": {
          "type": "number",
          "minimum": 1,
          "maximum": 10,
          "default": 2
        },
        "initialDelaySeconds": {
          "type": "number",
          "minimum": 1,
          "maximum": 300,
          "default": 5
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### 2.4 API Key Management Schemas

#### API Key Creation Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "permissions"],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "pattern": "^[A-Za-z0-9\\s\\-_]+$"
    },
    "permissions": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["read", "write", "admin"]
      },
      "minItems": 1,
      "maxItems": 3,
      "uniqueItems": true
    },
    "expiresAt": {
      "type": "string",
      "format": "date-time"
    },
    "ipWhitelist": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "ipv4"
      },
      "maxItems": 10,
      "uniqueItems": true
    }
  },
  "additionalProperties": false
}
```

## 3. Query Parameter Validation

### 3.1 Pagination Parameters
```json
{
  "page": {
    "type": "integer",
    "minimum": 1,
    "maximum": 1000,
    "default": 1
  },
  "limit": {
    "type": "integer", 
    "minimum": 1,
    "maximum": 100,
    "default": 20
  }
}
```

### 3.2 Filtering Parameters
```json
{
  "status": {
    "type": "string",
    "enum": ["queued", "processing", "completed", "failed", "cancelled"]
  },
  "fromDate": {
    "type": "string",
    "format": "date"
  },
  "toDate": {
    "type": "string",
    "format": "date"
  },
  "search": {
    "type": "string",
    "minLength": 1,
    "maxLength": 100,
    "pattern": "^[A-Za-z0-9\\s\\-_]+$"
  }
}
```

### 3.3 Sorting Parameters
```json
{
  "sortBy": {
    "type": "string",
    "enum": ["createdAt", "updatedAt", "status", "priority"]
  },
  "sortOrder": {
    "type": "string",
    "enum": ["asc", "desc"],
    "default": "desc"
  }
}
```

## 4. Response Validation Schemas

### 4.1 Success Response Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["success", "data", "meta"],
  "properties": {
    "success": {
      "type": "boolean",
      "const": true
    },
    "data": {
      "type": ["object", "array", "null"]
    },
    "meta": {
      "type": "object",
      "required": ["timestamp"],
      "properties": {
        "timestamp": {
          "type": "string",
          "format": "date-time"
        },
        "version": {
          "type": "string",
          "pattern": "^v\\d+(\\.\\d+)*$"
        },
        "requestId": {
          "type": "string",
          "format": "uuid"
        }
      }
    }
  },
  "additionalProperties": false
}
```

### 4.2 Error Response Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["success", "error", "meta"],
  "properties": {
    "success": {
      "type": "boolean",
      "const": false
    },
    "error": {
      "type": "object",
      "required": ["code", "message"],
      "properties": {
        "code": {
          "type": "string",
          "pattern": "^[A-Z_]+$"
        },
        "message": {
          "type": "string",
          "minLength": 1,
          "maxLength": 500
        },
        "details": {
          "type": ["object", "array", "string", "null"]
        },
        "field": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "meta": {
      "type": "object",
      "required": ["timestamp", "requestId"],
      "properties": {
        "timestamp": {
          "type": "string",
          "format": "date-time"
        },
        "requestId": {
          "type": "string",
          "format": "uuid"
        }
      }
    }
  },
  "additionalProperties": false
}
```

## 5. Validation Rules and Constraints

### 5.1 Business Rule Validations

#### Research Request Rules
- **Query Length**: Minimum 3 characters, maximum 1000 characters
- **Rate Limiting**: Maximum 10 requests per minute per user
- **Parameter Limits**: Maximum 5 categories, 10 suppliers
- **Price Range**: Must be positive numbers, max < min validation
- **Webhook URL**: Must use HTTPS, valid domain required

#### User Account Rules
- **Email Uniqueness**: Email addresses must be unique across system
- **Password Strength**: Minimum 12 characters with complexity requirements
- **Company Name**: No special characters except common business symbols
- **Account Limits**: Maximum 5 API keys per user

### 5.2 Data Integrity Constraints

#### Foreign Key Constraints
- **User References**: All entities must reference valid user IDs
- **Webhook Events**: Events must reference existing research requests
- **API Key Usage**: Keys must belong to authenticated user

#### Temporal Constraints
- **Date Ranges**: End date must be after start date
- **Expiration**: Future dates only for expiration times
- **Timestamps**: All timestamps must be in ISO 8601 format

## 6. Custom Validation Functions

### 6.1 Business Logic Validators
```json
{
  "customValidators": {
    "isValidWebhookUrl": {
      "description": "Validates webhook URL accessibility",
      "parameters": ["url"],
      "rules": [
        "Must respond to HEAD request",
        "Must return 2xx status code",
        "Must accept application/json content-type"
      ]
    },
    "isUniqueApiKeyName": {
      "description": "Ensures API key name uniqueness per user",
      "parameters": ["userId", "name"],
      "rules": [
        "Name must be unique within user's API keys",
        "Case-insensitive comparison"
      ]
    },
    "isValidPriceRange": {
      "description": "Validates price range parameters",
      "parameters": ["min", "max", "currency"],
      "rules": [
        "Min must be less than max",
        "Currency must be supported",
        "Values must be positive"
      ]
    }
  }
}
```

### 6.2 Security Validators
```json
{
  "securityValidators": {
    "sanitizeHtmlInput": {
      "description": "Remove HTML tags and dangerous characters",
      "parameters": ["input"],
      "rules": [
        "Strip all HTML tags",
        "Remove script content",
        "Escape special characters"
      ]
    },
    "validateApiKeyFormat": {
      "description": "Ensures API key follows expected format",
      "parameters": ["apiKey"],
      "rules": [
        "Must start with 'pk_' prefix",
        "Must be 64 characters total",
        "Must contain only alphanumeric characters"
      ]
    },
    "checkRateLimitHeaders": {
      "description": "Validates rate limit compliance",
      "parameters": ["userId", "endpoint"],
      "rules": [
        "Check current rate limit usage",
        "Prevent request if limit exceeded",
        "Update usage counters"
      ]
    }
  }
}
```

## 7. Validation Error Handling

### 7.1 Error Classification
| Error Type | HTTP Status | Error Code Pattern | Example |
|------------|-------------|-------------------|---------|
| **Required Field** | 400 | FIELD_REQUIRED | EMAIL_REQUIRED |
| **Invalid Format** | 400 | INVALID_FORMAT | INVALID_EMAIL_FORMAT |
| **Out of Range** | 400 | OUT_OF_RANGE | PASSWORD_TOO_SHORT |
| **Business Rule** | 422 | BUSINESS_RULE_VIOLATION | DUPLICATE_EMAIL |
| **Rate Limit** | 429 | RATE_LIMIT_EXCEEDED | TOO_MANY_REQUESTS |

### 7.2 Validation Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field": "email",
      "providedValue": "invalid-email",
      "constraint": "Must be a valid email address",
      "suggestion": "Please provide a valid email in format: user@domain.com"
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "uuid-here"
  }
}
```

## 8. Implementation Requirements

### 8.1 Validation Middleware Requirements
- **Early Validation**: Validate before business logic execution
- **Performance**: Validation should add <10ms request latency
- **Caching**: Cache compiled schemas for performance
- **Error Aggregation**: Collect all validation errors before responding
- **Logging**: Log validation failures for monitoring

### 8.2 Schema Management
- **Version Control**: Track schema changes in version control
- **Backward Compatibility**: Maintain compatibility across API versions
- **Documentation**: Auto-generate API documentation from schemas
- **Testing**: Validate schemas against test data sets
- **Deployment**: Deploy schema updates with application releases

### 8.3 Monitoring and Metrics
- **Validation Failures**: Track failure rates by endpoint
- **Common Errors**: Identify most frequent validation issues
- **Performance Impact**: Monitor validation execution time
- **Schema Evolution**: Track schema change frequency
- **User Experience**: Measure impact on user success rates

---

[← Back to Backend Architecture](./Readme.md)