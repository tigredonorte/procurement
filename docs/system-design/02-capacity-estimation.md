# Capacity Estimation - Requisio.com

## 1. Capacity Planning

### 1.1 Base Data for Calculations

#### Users and Usage
- **100K Daily Active Users (DAU)** - Target for end of first year
- **10 searches per user/day** - Estimated average
- **Average request size**: 5KB (query + parameters)
- **Average response size**: 50KB (normalized results)
- **Conversion rate**: 20% of searches generate action (webhook, export)
- **Read vs Write ratio**: 10:1 (more reads than writes)
- **Peak traffic**: 3x during business hours (9am-6pm)

#### Scientific Notation
> ⚠️ Using scientific notation for calculation precision
> - 1 day ≈ 100,000 seconds (10⁵) for simplification
> - 1 actual day = 86,400 seconds

### 1.2 Requests per Second (RPS) Calculation

#### Total Requests
```
Requests per day = DAU × requests/user
                 = 100K × 10
                 = 1M requests/day (10⁶)

Average RPS = 10⁶ / 10⁵ = 10 RPS
```

#### Read/Write Distribution
```
Write RPS = 10 / 11 ≈ 1 RPS (research creation)
Read RPS = 100 / 11 ≈ 9 RPS (status/results queries)
```

#### Peak Traffic
```
Peak RPS = Average RPS × 3
         = 10 × 3
         = 30 RPS

Peak Write RPS = 3 RPS
Peak Read RPS = 27 RPS
```

### 1.3 Bandwidth Calculation

#### Upload (Inbound)
```
Upload bandwidth = RPS × request size
                 = 10 × 5KB
                 = 50 KB/s

Peak upload = 30 × 5KB = 150 KB/s
```

#### Download (Outbound)
```
Download bandwidth = Read RPS × response size
                   = 9 × 50KB
                   = 450 KB/s

Peak download = 27 × 50KB = 1,350 KB/s ≈ 1.4 MB/s
```

#### Total Bandwidth
```
Average total = 50 + 450 = 500 KB/s
Peak total = 150 + 1,350 = 1,500 KB/s ≈ 1.5 MB/s
```

### 1.4 Storage Calculation

#### Main Data Storage
```
Storage per search = query(5KB) + results(50KB) + metadata(5KB)
                   = 60KB

Storage per second = Write RPS × size × replication factor
                   = 1 × 60KB × 3
                   = 180 KB/s

Storage per day = 180 KB/s × 10⁵ s
                = 1.8 × 10⁷ KB
                = 18 GB/day

Storage per month = 18 GB × 30
                  = 540 GB/month

Storage per year = 540 GB × 12
                 = 6.5 TB/year
```

#### Logs and Audit Storage
```
Log per request = 2KB
Logs per day = 10⁶ requests × 2KB = 2 GB/day
Logs per year (with 10:1 compression) = 2 GB × 365 / 10 = 73 GB/year
```

#### Total Projected Storage
```
Year 1: 6.5 TB (data) + 73 GB (logs) ≈ 6.6 TB
Year 2: 13.2 TB (assuming linear growth)
Year 3: 20 TB (with safety margin)
```

### 1.5 Processing (Jobs) Calculation

#### Research Jobs
```
Jobs per day = Write requests = 100K
Jobs per second = 1 job/s

Average processing time = 10 seconds
Concurrent jobs = 1 × 10 = 10 simultaneous jobs

Required workers = 10 / 5 (jobs per worker) = 2 minimum workers
Recommended workers = 4 (for redundancy)
```

#### Webhooks
```
Webhooks per day = 20% × 100K = 20K
Webhooks per second = 20K / 10⁵ = 0.2/s

With retry (3 attempts average) = 0.6 requests/s
```

## 2. Infrastructure Sizing

### 2.1 Application Servers

#### Backend API
```
RPS per server = 100 (typical Node.js capacity)
Required servers = 30 (peak) / 100 = 0.3
Recommended servers = 2 (minimum HA)

Specification per server:
- 2 vCPUs
- 4 GB RAM
- Auto-scaling: 2-6 instances
```

#### Workers
```
Required workers = 4
Specification per worker:
- 2 vCPUs
- 8 GB RAM (intensive processing)
- Auto-scaling: 2-8 instances
```

### 2.2 Database

#### MongoDB Cluster
```
Required storage = 6.6 TB (year 1)
Estimated IOPS = 100 (10 RPS × 10 operations/request)

Recommended configuration:
- 3 nodes (1 primary, 2 secondary)
- 4 vCPUs per node
- 16 GB RAM per node
- 2 TB SSD per node
```

#### Redis Cache
```
Hot data (20% of searches) = 100MB
Session data = 10MB
Queue data = 50MB
Total = 200MB

Configuration:
- 1 Redis instance
- 2 GB RAM
- Persistence enabled
```

### 2.3 Estimated Costs (Cloud)

#### AWS (Example)
```
Backend (2 × t3.medium) = $60/month
Workers (4 × t3.large) = $240/month
MongoDB (3 × db.r5.large) = $600/month
Redis (cache.t3.micro) = $20/month
Load Balancer = $25/month
Storage (S3) = $150/month
Bandwidth = $100/month

Monthly Total ≈ $1,200
Annual Total ≈ $14,400
```

## 3. Growth Plan

### Year 1 (100K DAU)
- 2 backend servers
- 4 workers
- 3-node MongoDB
- 1 Redis instance

### Year 2 (500K DAU)
- 4 backend servers
- 8 workers
- 5-node MongoDB (sharding)
- 2 Redis instances (replication)

### Year 3 (1M DAU)
- 8 backend servers
- 16 workers
- MongoDB cluster with sharding
- Redis cluster
- Global CDN
- Multi-region deployment

## 4. Optimizations and Considerations

### Cache Strategy
- Frequent search cache (TTL: 1 hour)
- Static results cache (TTL: 24 hours)
- Session cache (TTL: 30 minutes)

### Compression
- Gzip for HTTP responses (reduces 70% bandwidth)
- Log compression (reduces 90% storage)
- Historical data compression

### Performance Targets
- API Latency: P50 < 50ms, P95 < 200ms, P99 < 500ms
- Job Processing: P50 < 5s, P95 < 15s, P99 < 30s
- Webhook Delivery: P50 < 1s, P95 < 3s, P99 < 10s

---

## Next Documents
- [03 - Data Modeling](./03-data-modeling.md)
- [04 - API Design](./04-api-design.md)
- [05 - System Architecture](./05-system-architecture.md)
- [06 - Trade-offs and Decisions](./06-trade-offs.md)