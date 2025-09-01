# System Architecture - Requisio.com

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTS                              │
├─────────────────────────────────────────────────────────────┤
│  Web Browser (React)  │  Mobile App  │  External Systems    │
└───────────┬───────────┴───────┬──────┴────────┬─────────────┘
            │                   │               │
            ▼                   ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                              │
│                  (Kong / AWS API GW)                         │
│         • Rate Limiting • Auth • Load Balancing              │
└─────────────────────────────────────────────────────────────┘
            │                   │               │
            ▼                   ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                    MICROSERVICES                             │
├─────────────────┬──────────────────┬────────────────────────┤
│   Auth Service  │  Research Service │   Webhook Service      │
│   (Keycloak)    │    (Node.js)      │     (Node.js)         │
└─────────────────┴──────────────────┴────────────────────────┘
            │                   │               │
            ▼                   ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
├──────────────┬─────────────────┬─────────────────────────────┤
│   MongoDB    │     Redis       │        S3                  │
│  (Primary)   │    (Cache)      │    (File Storage)         │
└──────────────┴─────────────────┴─────────────────────────────┘
            │                   │               │
            ▼                   ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                 ASYNC PROCESSING                             │
├─────────────────────────────────────────────────────────────┤
│          BullMQ Workers (Research Processing)                │
│          • API Calls • Data Normalization • Storage         │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19 + TypeScript | SPA User Interface |
| API Gateway | Kong / AWS API Gateway | Request routing, rate limiting |
| Backend | Node.js 24 + Express | RESTful API services |
| Authentication | Keycloak | Identity and access management |
| Primary Database | MongoDB 7 | Document storage |
| Cache | Redis 7 | Session and results cache |
| Queue | BullMQ | Async job processing |
| File Storage | AWS S3 / MinIO | Static assets and exports |
| Container | Docker + Kubernetes | Orchestration |
| Monitoring | Prometheus + Grafana | Metrics and visualization |
| Logging | ELK Stack | Centralized logging |

## 2. Component Architecture

### 2.1 Frontend Architecture

```
React Application
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── research/        # Research-specific components
│   │   └── webhooks/        # Webhook management
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Research/
│   │   └── Settings/
│   ├── services/
│   │   ├── api/            # API client
│   │   ├── auth/           # Auth helpers
│   │   └── websocket/      # Real-time updates
│   ├── stores/             # State management (Zustand)
│   └── utils/              # Utilities
```

### 2.2 Backend Services

#### Auth Service (Keycloak Integration)
```javascript
// Authentication flow
POST /auth/login
  → Validate credentials with Keycloak
  → Generate JWT token
  → Create session in Redis
  → Return token + user data

// Authorization middleware
function authorize(req, res, next) {
  → Verify JWT token
  → Check Redis session
  → Load CASL abilities
  → Attach to request
}
```

#### Research Service
```javascript
// Research processing flow
POST /research
  → Validate request
  → Create job in BullMQ
  → Store initial record in MongoDB
  → Return job ID

// Worker processing
async function processResearch(job) {
  → Fetch from external APIs
  → Normalize data
  → Store results
  → Trigger webhooks
  → Update status
}
```

#### Webhook Service
```javascript
// Webhook delivery
async function deliverWebhook(event, data) {
  → Load webhook config
  → Generate HMAC signature
  → Send HTTP request
  → Handle retries
  → Log delivery status
}
```

### 2.3 Data Flow Architecture

```
User Request → API Gateway → Backend Service
                    ↓
              Validation Layer
                    ↓
              Business Logic
                    ↓
         ┌──────────┴──────────┐
         ↓                     ↓
    Sync Response        Async Job (BullMQ)
         ↓                     ↓
    Return to User      Background Processing
                              ↓
                        Store Results
                              ↓
                     Webhook Notification
```

## 3. Deployment Architecture

### 3.1 Kubernetes Deployment

```yaml
# Deployment structure
namespace: requisio-prod
├── deployments/
│   ├── frontend-deployment
│   ├── backend-deployment
│   ├── worker-deployment
│   └── keycloak-deployment
├── services/
│   ├── frontend-service
│   ├── backend-service
│   └── keycloak-service
├── configmaps/
│   └── app-config
├── secrets/
│   └── app-secrets (via Doppler)
└── ingress/
    └── main-ingress
```

### 3.2 Infrastructure as Code

```terraform
# Terraform main structure
module "networking" {
  vpc_cidr = "10.0.0.0/16"
  subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
}

module "kubernetes" {
  cluster_name = "requisio-cluster"
  node_groups = {
    api = { instance_type = "t3.medium", min = 2, max = 6 }
    workers = { instance_type = "t3.large", min = 2, max = 8 }
  }
}

module "databases" {
  mongodb_instance = "db.r5.large"
  redis_instance   = "cache.t3.micro"
}
```

### 3.3 CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    - Run unit tests
    - Run integration tests
    - Code coverage check
    
  build:
    - Build Docker images
    - Push to registry
    - Update manifests
    
  deploy:
    - Apply Kubernetes manifests
    - Run database migrations
    - Health check
    - Rollback on failure
```

## 4. Security Architecture

### 4.1 Security Layers

```
┌─────────────────────────────────────────┐
│          WAF (Web Application Firewall) │
├─────────────────────────────────────────┤
│               DDoS Protection           │
├─────────────────────────────────────────┤
│            SSL/TLS Termination          │
├─────────────────────────────────────────┤
│           API Gateway Security          │
│    • Rate Limiting                      │
│    • API Key Validation                 │
│    • Request Validation                 │
├─────────────────────────────────────────┤
│          Application Security           │
│    • JWT Authentication                 │
│    • RBAC (CASL.js)                    │
│    • Input Validation                   │
│    • CORS Policy                        │
├─────────────────────────────────────────┤
│            Data Security                │
│    • Encryption at Rest (AES-256)       │
│    • Encryption in Transit (TLS 1.3)    │
│    • Secret Management (Doppler)        │
└─────────────────────────────────────────┘
```

### 4.2 Authentication Flow

```
User Login Request
    ↓
Keycloak Authentication
    ↓
JWT Token Generation
    ↓
Redis Session Creation
    ↓
CASL Abilities Loading
    ↓
Authenticated Response
```

## 5. Monitoring and Observability

### 5.1 Metrics Collection

```yaml
# Prometheus metrics
requisio_api_requests_total
requisio_api_request_duration_seconds
requisio_research_jobs_total
requisio_research_job_duration_seconds
requisio_webhook_deliveries_total
requisio_cache_hits_total
requisio_database_connections_active
```

### 5.2 Logging Strategy

```javascript
// Structured logging with Winston
logger.info('Research completed', {
  researchId: 'res_123',
  userId: 'usr_456',
  duration: 15.5,
  resultsCount: 95,
  timestamp: new Date().toISOString()
});
```

### 5.3 Alerting Rules

| Alert | Condition | Action |
|-------|-----------|--------|
| High Error Rate | 5xx > 1% for 5 min | Page on-call |
| API Latency | P95 > 500ms for 10 min | Notify team |
| Job Queue Backup | Queue > 1000 for 15 min | Scale workers |
| Database Connection | Connections > 80% | Investigate |
| Disk Usage | > 85% full | Clean up logs |

## 6. Scaling Strategy

### 6.1 Horizontal Scaling

```yaml
# Auto-scaling configuration
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    name: backend-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        averageUtilization: 80
```

### 6.2 Database Scaling

```javascript
// MongoDB sharding strategy
sh.shardCollection("requisio.research_requests", {
  "userId": 1,
  "_id": 1
})

// Read preference for scaling
const readPreference = {
  mode: "secondaryPreferred",
  maxStalenessSeconds: 90
}
```

### 6.3 Caching Strategy

```javascript
// Multi-level caching
const getCachedResult = async (key) => {
  // L1: Application memory cache
  if (memCache.has(key)) return memCache.get(key);
  
  // L2: Redis cache
  const redisResult = await redis.get(key);
  if (redisResult) {
    memCache.set(key, redisResult);
    return redisResult;
  }
  
  // L3: Database
  const dbResult = await mongodb.find(key);
  if (dbResult) {
    redis.setex(key, 3600, dbResult);
    memCache.set(key, dbResult);
    return dbResult;
  }
}
```

## 7. Disaster Recovery

### 7.1 Backup Strategy

```yaml
# Backup configuration
backups:
  mongodb:
    frequency: daily
    retention: 30 days
    type: incremental
    storage: s3://requisio-backups/mongodb/
  
  redis:
    frequency: hourly
    retention: 7 days
    type: snapshot
    storage: s3://requisio-backups/redis/
```

### 7.2 Recovery Procedures

| Scenario | RTO | RPO | Procedure |
|----------|-----|-----|-----------|
| Service Failure | 5 min | 0 | Kubernetes auto-restart |
| Database Failure | 30 min | 1 hour | Restore from backup |
| Region Failure | 4 hours | 1 hour | Failover to DR region |
| Complete Loss | 24 hours | 24 hours | Full restore from backups |

### 7.3 High Availability

```
Primary Region (us-east-1)
├── Availability Zone A
│   ├── Backend Instances
│   ├── MongoDB Primary
│   └── Redis Master
├── Availability Zone B
│   ├── Backend Instances
│   ├── MongoDB Secondary
│   └── Redis Replica
└── Availability Zone C
    ├── Backend Instances
    └── MongoDB Secondary

DR Region (us-west-2)
├── Standby Infrastructure
└── Replicated Data
```

## 8. Development Environment

### 8.1 Local Development

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - REACT_APP_API_URL=http://localhost:4000
  
  backend:
    build: ./backend
    ports: ["4000:4000"]
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/requisio
      - REDIS_URL=redis://redis:6379
  
  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
  
  redis:
    image: redis:7
    ports: ["6379:6379"]
  
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    ports: ["8080:8080"]
```

### 8.2 Environment Management

```javascript
// Environment configuration
const config = {
  development: {
    apiUrl: 'http://localhost:4000',
    wsUrl: 'ws://localhost:4000',
    logLevel: 'debug'
  },
  staging: {
    apiUrl: 'https://api-staging.requisio.com',
    wsUrl: 'wss://api-staging.requisio.com',
    logLevel: 'info'
  },
  production: {
    apiUrl: 'https://api.requisio.com',
    wsUrl: 'wss://api.requisio.com',
    logLevel: 'error'
  }
}
```

---

## Next Documents
- [06 - Trade-offs and Decisions](./06-trade-offs.md)