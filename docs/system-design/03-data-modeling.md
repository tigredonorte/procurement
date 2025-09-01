# Data Modeling - Requisio.com

## 1. Overview

### 1.1 Database Selection

#### MongoDB (Primary Database)
- **Type**: NoSQL Document Store
- **Justification**:
  - Flexibility for semi-structured data from different APIs
  - Schema evolution without downtime
  - Native JSON data support
  - Good performance for complex queries
  - Native horizontal sharding

#### Redis (Cache and Queues)
- **Type**: In-memory Key-Value Store
- **Usage**:
  - Session cache
  - Results cache
  - BullMQ job queues
  - Rate limiting

## 2. MongoDB Modeling

### 2.1 Collection: users

```javascript
{
  _id: ObjectId("..."),
  keycloakId: "uuid-from-keycloak",
  email: "user@company.com",
  firstName: "John",
  lastName: "Doe",
  organization: {
    name: "St. Paul Hospital",
    type: "hospital", // hospital, hotel, school, commercial_building
    taxId: "12-3456789"
  },
  role: "researcher", // researcher, admin, viewer
  preferences: {
    defaultSearchParams: {
      sources: ["serpapi"],
      maxResults: 50,
      language: "en-US"
    },
    notifications: {
      email: true,
      webhook: true
    },
    ui: {
      theme: "light",
      density: "comfortable",
      language: "en-US"
    }
  },
  webhookConfig: {
    url: "https://api.company.com/webhook",
    secret: "encrypted-hmac-secret",
    events: ["research.completed", "research.failed"],
    active: true,
    lastDelivery: ISODate("2025-09-01T10:00:00Z"),
    failureCount: 0
  },
  limits: {
    dailySearches: 100,
    concurrentSearches: 5,
    apiCallsPerMonth: 10000
  },
  usage: {
    searchesToday: 45,
    searchesThisMonth: 890,
    lastSearchAt: ISODate("2025-09-01T15:30:00Z")
  },
  metadata: {
    createdAt: ISODate("2024-01-15T10:00:00Z"),
    updatedAt: ISODate("2025-09-01T15:30:00Z"),
    lastLoginAt: ISODate("2025-09-01T09:00:00Z"),
    loginCount: 234,
    ipAddress: "192.168.1.100"
  }
}
```

**Indexes:**
```javascript
db.users.createIndex({ "keycloakId": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "organization.taxId": 1 })
db.users.createIndex({ "metadata.createdAt": -1 })
```

### 2.2 Collection: research_requests

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // reference to users
  query: {
    text: "ergonomic office chairs",
    categories: ["furniture", "office"],
    filters: {
      priceRange: {
        min: 200,
        max: 800,
        currency: "USD"
      },
      availability: "in_stock",
      suppliers: ["supplier1", "supplier2"],
      location: "New York, NY"
    }
  },
  parameters: {
    sources: ["serpapi", "custom_api"],
    maxResults: 100,
    searchDepth: "deep", // shallow, medium, deep
    includeImages: true,
    includeReviews: false
  },
  status: {
    current: "processing", // queued, processing, completed, failed, cancelled
    progress: 65, // percentage 0-100
    message: "Processing page 3 of 5",
    startedAt: ISODate("2025-09-01T10:00:00Z"),
    completedAt: null,
    processingTime: null // in seconds
  },
  results: {
    summary: {
      totalFound: 150,
      totalProcessed: 100,
      totalNormalized: 95,
      avgPrice: 450.50,
      priceRange: { min: 199, max: 799 },
      topSuppliers: ["Supplier A", "Supplier B"]
    },
    products: [
      {
        id: "prod-001", // unique identifier
        title: "Premium Ergonomic Chair",
        description: "Chair with lumbar support and armrests", // optional
        priceUnit: 599.99,
        currency: "USD", // ISO 4217
        availability: "in_stock", // in_stock | out_of_stock | limited
        supplier: {
          name: "ErgoFurniture Inc",
          id: "supplier-123",
          rating: 4.5 // optional
        },
        images: [
          "https://cdn.example.com/chair1.jpg",
          "https://cdn.example.com/chair2.jpg"
        ],
        specifications: {
          material: "Mesh fabric",
          color: "Black",
          weight: "35lbs",
          dimensions: "27x27x47 inches",
          warranty: "5 years"
        },
        url: "https://original-source.com/product",
        lastUpdated: ISODate("2025-09-01T10:05:00Z") // ISO 8601
      }
      // ... more products
    ]
  },
  rawData: {
    // Original API data for auditing
    serpapi: { /* raw response */ },
    custom_api: { /* raw response */ }
  },
  errors: [
    {
      timestamp: ISODate("2025-09-01T10:03:00Z"),
      source: "custom_api",
      error: "Rate limit exceeded",
      retry: true,
      retryCount: 1
    }
  ],
  jobInfo: {
    jobId: "job-123456",
    queue: "research-jobs",
    priority: 1,
    attempts: 1,
    worker: "worker-01"
  },
  notifications: {
    webhook: {
      sent: true,
      sentAt: ISODate("2025-09-01T10:10:00Z"),
      responseCode: 200,
      retries: 0
    },
    email: {
      sent: false,
      scheduled: ISODate("2025-09-01T10:15:00Z")
    }
  },
  metadata: {
    createdAt: ISODate("2025-09-01T10:00:00Z"),
    updatedAt: ISODate("2025-09-01T10:10:00Z"),
    expiresAt: ISODate("2025-01-26T10:00:00Z"), // TTL for cleanup
    version: 1
  }
}
```

**Indexes:**
```javascript
db.research_requests.createIndex({ "userId": 1, "metadata.createdAt": -1 })
db.research_requests.createIndex({ "status.current": 1 })
db.research_requests.createIndex({ "jobInfo.jobId": 1 }, { unique: true })
db.research_requests.createIndex({ "metadata.expiresAt": 1 }, { expireAfterSeconds: 0 })
db.research_requests.createIndex({ "query.text": "text" }) // Full-text search
```

### 2.3 Collection: webhook_logs

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  researchId: ObjectId("..."),
  webhook: {
    url: "https://api.company.com/webhook",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Signature": "hmac-sha256-signature"
    }
  },
  payload: {
    event: "research.completed",
    researchId: "...",
    timestamp: ISODate("2025-09-01T10:10:00Z"),
    data: { /* normalized results */ }
  },
  delivery: {
    status: "success", // success, failed, pending
    attempts: 1,
    lastAttempt: ISODate("2025-09-01T10:10:00Z"),
    nextRetry: null,
    response: {
      statusCode: 200,
      headers: {},
      body: "OK",
      responseTime: 245 // ms
    },
    error: null
  },
  metadata: {
    createdAt: ISODate("2025-09-01T10:10:00Z"),
    expiresAt: ISODate("2024-12-29T10:10:00Z") // 3 days TTL
  }
}
```

**Indexes:**
```javascript
db.webhook_logs.createIndex({ "userId": 1, "metadata.createdAt": -1 })
db.webhook_logs.createIndex({ "researchId": 1 })
db.webhook_logs.createIndex({ "delivery.status": 1 })
db.webhook_logs.createIndex({ "metadata.expiresAt": 1 }, { expireAfterSeconds: 0 })
```

### 2.4 Collection: api_integrations

```javascript
{
  _id: ObjectId("..."),
  name: "serpapi",
  displayName: "SerpAPI Search",
  type: "search_engine",
  status: "active", // active, inactive, maintenance
  config: {
    baseUrl: "https://serpapi.com/search",
    timeout: 30000,
    retryPolicy: {
      maxRetries: 3,
      backoffMultiplier: 2,
      initialDelay: 1000
    },
    rateLimit: {
      requests: 100,
      interval: 60000 // 1 minute
    }
  },
  authentication: {
    type: "api_key",
    keyLocation: "query", // header, query
    keyName: "api_key",
    encryptedKey: "encrypted-value" // Stored via Doppler
  },
  mapping: {
    // Field mapping from API to our model
    title: "$.title",
    price: "$.price",
    availability: "$.in_stock",
    supplier: "$.seller.name",
    image: "$.thumbnail"
  },
  statistics: {
    totalRequests: 45678,
    successRate: 98.5,
    avgResponseTime: 1250, // ms
    lastUsed: ISODate("2025-09-01T15:00:00Z"),
    lastError: null
  },
  metadata: {
    createdAt: ISODate("2024-01-01T00:00:00Z"),
    updatedAt: ISODate("2025-09-01T10:00:00Z")
  }
}
```

## 3. Redis Modeling

### 3.1 Cache Structure

#### Session Cache
```
Key: session:{userId}
Value: {
  token: "jwt-token",
  user: { /* user data */ },
  abilities: [ /* CASL permissions */ ],
  expiresAt: "timestamp"
}
TTL: 1800 seconds (30 minutes)
```

#### Research Results Cache
```
Key: research:result:{queryHash}
Value: { /* normalized results */ }
TTL: 3600 seconds (1 hour)
```

#### Rate Limiting
```
Key: ratelimit:{userId}:{endpoint}
Value: counter
TTL: 60 seconds
```

### 3.2 BullMQ Queues

#### research-jobs Queue
```javascript
{
  name: "process-research",
  data: {
    researchId: "...",
    userId: "...",
    query: { /* search params */ },
    priority: 1
  },
  opts: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
}
```

#### webhook-delivery Queue
```javascript
{
  name: "deliver-webhook",
  data: {
    webhookLogId: "...",
    url: "...",
    payload: { /* data */ }
  },
  opts: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  }
}
```

## 4. Access Patterns and Queries

### 4.1 Frequent Queries

1. **List user's research**
```javascript
db.research_requests.find({ 
  userId: ObjectId("...") 
}).sort({ "metadata.createdAt": -1 }).limit(20)
```

2. **Find research by status**
```javascript
db.research_requests.find({ 
  userId: ObjectId("..."),
  "status.current": "completed"
})
```

3. **Usage statistics**
```javascript
db.research_requests.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: {
    _id: "$status.current",
    count: { $sum: 1 },
    avgProcessingTime: { $avg: "$status.processingTime" }
  }}
])
```

### 4.2 Write Patterns

1. **Status update**
```javascript
db.research_requests.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      "status.current": "completed",
      "status.completedAt": new Date(),
      "status.progress": 100
    }
  }
)
```

2. **Counter increment**
```javascript
db.users.updateOne(
  { _id: ObjectId("...") },
  { 
    $inc: { 
      "usage.searchesToday": 1,
      "usage.searchesThisMonth": 1
    }
  }
)
```

## 5. Optimization Strategies

### 5.1 Sharding Strategy
- **Shard Key**: `{ userId: 1, _id: 1 }`
- Distributes data evenly by user
- Keeps user queries on same shard

### 5.2 Data Archival
- Move searches > 90 days to archive collection
- Compress raw data after 30 days
- Automatic TTL for logs after 7 days

### 5.3 Strategic Denormalization
- Copy user name into research_requests
- Cache counters in parent documents
- Pre-calculate common aggregations

---

## Next Documents
- [04 - API Design](./04-api-design.md)
- [05 - System Architecture](./05-system-architecture.md)
- [06 - Trade-offs and Decisions](./06-trade-offs.md)