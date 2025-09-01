# Trade-offs and Decisions - Requisio.com

## 1. Executive Summary

This document captures the key architectural trade-offs and decisions made for Requisio.com, explaining the rationale behind each choice and its implications for the system.

## 2. Major Architectural Decisions

### 2.1 Microservices vs Monolith

#### Decision: Modular Monolith → Microservices
**Choice**: Start with modular monolith, evolve to microservices

**Trade-offs**:
| Aspect | Monolith (Initial) | Microservices (Future) |
|--------|-------------------|------------------------|
| **Complexity** | ✅ Simple deployment | ❌ Complex orchestration |
| **Development Speed** | ✅ Faster initially | ❌ Slower with coordination |
| **Scalability** | ❌ Scale everything | ✅ Scale independently |
| **Team Size** | ✅ Small team friendly | ❌ Requires larger team |
| **Cost** | ✅ Lower infrastructure | ❌ Higher overhead |
| **Debugging** | ✅ Easier tracing | ❌ Distributed tracing needed |

**Rationale**: 
- Start simple with 2-3 developers
- Maintain modular boundaries for future split
- Transition when team grows to 10+ developers

### 2.2 Database Selection

#### Decision: MongoDB (NoSQL) vs PostgreSQL (SQL)
**Choice**: MongoDB as primary database

**Trade-offs**:
| Aspect | MongoDB (Chosen) | PostgreSQL |
|--------|-----------------|------------|
| **Schema Flexibility** | ✅ Dynamic schema | ❌ Fixed schema |
| **JSON Support** | ✅ Native BSON | ⚠️ JSONB (good but not native) |
| **Transactions** | ⚠️ Limited multi-doc | ✅ Full ACID |
| **Joins** | ❌ No native joins | ✅ Complex joins |
| **Scaling** | ✅ Native sharding | ⚠️ Manual partitioning |
| **Learning Curve** | ✅ Simple for devs | ⚠️ SQL expertise needed |

**Rationale**:
- Semi-structured data from multiple APIs
- Need for schema evolution without downtime
- Document model fits research results naturally
- Horizontal scaling built-in

**Mitigation for weaknesses**:
- Use MongoDB transactions where critical
- Denormalize data strategically
- Use aggregation pipeline for complex queries

### 2.3 CAP Theorem Trade-off

#### Decision: AP (Availability + Partition Tolerance)
**Choice**: Prioritize availability over strong consistency

```
         CAP Triangle
              C
            /   \
           /     \
          /       \
         A ─────── P
         ↑         ↑
    [CHOSEN]   [REQUIRED]
```

**Trade-offs**:
| Scenario | Our Choice (AP) | Alternative (CP) |
|----------|----------------|------------------|
| **Network Partition** | ✅ System stays up | ❌ System blocks |
| **Data Consistency** | ⚠️ Eventual | ✅ Strong |
| **User Experience** | ✅ Always responsive | ❌ May timeout |
| **Conflict Resolution** | ❌ Complex | ✅ Simple |

**Rationale**:
- Research results don't need immediate consistency
- Better UX with available system
- Can tolerate stale data for seconds/minutes

**Implementation**:
```javascript
// Eventual consistency example
async function getResearchResults(id) {
  // Try cache first (might be stale)
  const cached = await redis.get(`research:${id}`);
  if (cached) return cached;
  
  // Fall back to primary DB
  const primary = await mongodb.findOne({_id: id});
  if (primary) {
    // Update cache async
    redis.setex(`research:${id}`, 300, primary);
    return primary;
  }
  
  // Last resort: read from secondary
  const secondary = await mongodb.findOne(
    {_id: id}, 
    {readPreference: 'secondary'}
  );
  return secondary;
}
```

### 2.4 Synchronous vs Asynchronous Processing

#### Decision: Async for Heavy Operations
**Choice**: BullMQ for research processing

**Trade-offs**:
| Aspect | Async (Chosen) | Sync |
|--------|---------------|------|
| **Response Time** | ✅ Immediate acknowledgment | ❌ Long wait |
| **Complexity** | ❌ Queue management | ✅ Simple flow |
| **Reliability** | ✅ Retry mechanism | ❌ Failure = lost |
| **User Experience** | ⚠️ Polling/WebSocket needed | ✅ Direct response |
| **Resource Usage** | ✅ Efficient | ❌ Thread blocking |

**Rationale**:
- External API calls can take 10-30 seconds
- Better resource utilization
- Natural retry mechanism for failures

### 2.5 Authentication Strategy

#### Decision: Keycloak vs Custom Auth
**Choice**: Keycloak for enterprise features

**Trade-offs**:
| Aspect | Keycloak (Chosen) | Custom Auth |
|--------|------------------|-------------|
| **Development Time** | ✅ Quick setup | ❌ Months to build |
| **Features** | ✅ SSO, MFA, LDAP | ❌ Build everything |
| **Customization** | ⚠️ Limited | ✅ Full control |
| **Maintenance** | ✅ Maintained by RedHat | ❌ Team responsibility |
| **Learning Curve** | ❌ Complex configuration | ✅ Team knows it |
| **Cost** | ⚠️ Resource heavy | ✅ Lightweight |

**Rationale**:
- Enterprise clients expect SSO
- Security is critical, use proven solution
- Focus engineering on core business

## 3. Performance Trade-offs

### 3.1 Caching Strategy

#### Decision: Multi-level Caching
**Choice**: Memory → Redis → MongoDB

**Trade-offs**:
```
┌─────────────────────────────────────┐
│         Memory Cache (L1)           │
│  Pros: ✅ <1ms latency              │
│  Cons: ❌ Limited size, volatile    │
├─────────────────────────────────────┤
│          Redis Cache (L2)           │
│  Pros: ✅ 1-5ms, shared            │
│  Cons: ❌ Network hop               │
├─────────────────────────────────────┤
│          MongoDB (L3)               │
│  Pros: ✅ Persistent, unlimited     │
│  Cons: ❌ 10-50ms latency          │
└─────────────────────────────────────┘
```

**Cache Invalidation Strategy**:
- TTL-based: 5 min for dynamic, 1 hour for static
- Event-based: Invalidate on updates
- Background refresh for popular items

### 3.2 API Rate Limiting

#### Decision: Token Bucket Algorithm
**Choice**: 100 requests/minute per user

**Trade-offs**:
| Algorithm | Pros | Cons |
|-----------|------|------|
| **Token Bucket** (Chosen) | ✅ Handles bursts | ❌ Complex |
| Fixed Window | ✅ Simple | ❌ Thunder herd |
| Sliding Window | ✅ Smooth | ❌ Memory intensive |

**Implementation**:
```javascript
class TokenBucket {
  constructor(capacity = 100, refillRate = 100/60) {
    this.tokens = capacity;
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }
  
  consume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
  
  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}
```

## 4. Cost vs Performance Trade-offs

### 4.1 Infrastructure Choices

| Component | Premium Option | Our Choice | Savings | Trade-off |
|-----------|---------------|------------|---------|-----------|
| **Database** | MongoDB Atlas | Self-managed | 60% | More maintenance |
| **Cache** | ElastiCache | Self-managed Redis | 50% | Manual failover |
| **Queue** | AWS SQS | BullMQ on Redis | 70% | Single point of failure |
| **Storage** | EBS | S3 + Local cache | 40% | Higher latency |

**Annual Cost Comparison**:
- Premium setup: $36,000/year
- Our choice: $14,400/year
- Savings: $21,600/year

### 4.2 Scaling Strategy

#### Decision: Vertical → Horizontal
**Choice**: Start vertical, plan horizontal

```
Year 1: Vertical Scaling (Simple)
┌────────────────┐
│   Big Server   │
│   (8 CPU)      │
└────────────────┘

Year 2: Horizontal Scaling (Complex)
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ 2CPU │ │ 2CPU │ │ 2CPU │ │ 2CPU │
└──────┘ └──────┘ └──────┘ └──────┘
```

**Trade-offs**:
- **Vertical**: Simple but has ceiling
- **Horizontal**: Complex but unlimited

## 5. Security Trade-offs

### 5.1 Encryption Strategy

#### Decision: Selective Encryption
**Choice**: Encrypt sensitive fields only

**Trade-offs**:
| Approach | Performance | Security | Cost |
|----------|------------|----------|------|
| **Full Encryption** | ❌ Slow | ✅ Maximum | ❌ High |
| **Selective** (Chosen) | ✅ Fast | ✅ Good | ✅ Low |
| **No Encryption** | ✅ Fastest | ❌ Risk | ✅ None |

**What we encrypt**:
- User passwords (bcrypt)
- API keys (AES-256)
- Personal data (PII)
- Webhook secrets

**What we don't encrypt**:
- Product search queries
- Public product data
- System logs (sanitized)

### 5.2 API Security

#### Decision: JWT with Refresh Tokens
**Choice**: Short-lived access, long-lived refresh

```javascript
// Token configuration
const tokenConfig = {
  access: {
    expiresIn: '15m',
    algorithm: 'RS256'
  },
  refresh: {
    expiresIn: '7d',
    storage: 'redis'
  }
}
```

**Trade-offs**:
- ✅ Stateless authentication
- ✅ Scalable
- ❌ Can't immediately revoke
- ❌ Token size overhead

## 6. Developer Experience Trade-offs

### 6.1 Technology Choices

| Technology | Alternative | Why We Chose It | Trade-off |
|------------|------------|-----------------|-----------|
| **TypeScript** | JavaScript | Type safety | Learning curve |
| **React 19** | Vue/Angular | Ecosystem | Newer, less stable |
| **Node.js 24** | Python/Go | JavaScript everywhere | Not best for CPU tasks |
| **pnpm** | npm/yarn | Disk efficiency | Less common |
| **Tailwind** | CSS/Sass | Rapid development | HTML bloat |

### 6.2 Testing Strategy

#### Decision: 70% Coverage Target
**Choice**: Practical over perfect

**Distribution**:
```
Unit Tests:        50% (Fast, many)
Integration Tests: 30% (Slower, critical paths)
E2E Tests:         20% (Slowest, user journeys)
```

**Trade-offs**:
- ✅ Fast CI/CD pipeline
- ✅ Good confidence
- ❌ Some edge cases missed
- ⚠️ Requires manual QA

## 7. Operational Trade-offs

### 7.1 Monitoring Depth

#### Decision: Essential Metrics Only
**Choice**: Start with basics, expand as needed

**What we monitor (MVP)**:
- API latency (P50, P95, P99)
- Error rates
- Job queue depth
- Database connections
- Disk usage

**What we defer**:
- Detailed traces
- User behavior analytics
- Cost per transaction
- Predictive alerting

### 7.2 Deployment Strategy

#### Decision: Blue-Green Deployment
**Choice**: Zero-downtime over simplicity

```
┌─────────────────────────────┐
│        Load Balancer        │
└──────────┬──────────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌─────────┐  ┌─────────┐
│  Blue   │  │  Green  │
│ (Active)│  │ (Standby)│
└─────────┘  └─────────┘
```

**Trade-offs**:
- ✅ Zero downtime
- ✅ Easy rollback
- ❌ 2x infrastructure
- ❌ Database migrations complex

## 8. Future Considerations

### 8.1 Technical Debt Acceptance

**What we're accepting now**:
1. **No GraphQL**: REST is simpler for MVP
2. **Limited i18n**: English only initially
3. **Basic search**: No Elasticsearch yet
4. **Manual scaling**: No Kubernetes initially

**When to address**:
- GraphQL: When API complexity > 20 endpoints
- i18n: When entering non-English markets
- Elasticsearch: When > 1M products
- Kubernetes: When > 5 services

### 8.2 Vendor Lock-in

**Accepted lock-ins**:
- AWS services (S3, CloudWatch)
- MongoDB query language
- Redis data structures

**Avoided lock-ins**:
- Using Terraform for IaC
- Standard Docker containers
- OpenAPI specifications
- Avoiding proprietary APIs

## 9. Decision Matrix Summary

| Decision | Risk | Impact | Reversibility | Confidence |
|----------|------|--------|---------------|------------|
| MongoDB | Medium | High | Hard | 85% |
| Keycloak | Low | Medium | Medium | 90% |
| BullMQ | Low | High | Easy | 95% |
| Node.js | Low | High | Hard | 90% |
| AP over CP | Medium | High | Hard | 80% |
| Microservices later | Low | High | N/A | 95% |

## 10. Conclusion

These trade-offs represent pragmatic choices for an MVP with a clear path to scale. Key principles:

1. **Start simple, evolve complexity**
2. **Optimize for developer productivity initially**
3. **Build in extension points**
4. **Accept technical debt strategically**
5. **Monitor and measure before optimizing**

The architecture is designed to handle 100K DAU initially and scale to 1M+ with incremental improvements rather than rewrites.

---

## Related Documents
- [01 - Requirements](./01-requirements.md)
- [02 - Capacity Estimation](./02-capacity-estimation.md)
- [03 - Data Modeling](./03-data-modeling.md)
- [04 - API Design](./04-api-design.md)
- [05 - System Architecture](./05-system-architecture.md)