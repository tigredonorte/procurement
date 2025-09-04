# Monitoring and Health Checks Architecture

## 1. Health Check Strategy

### 1.1 Purpose and Scope
- **Service Health**: Monitor application and infrastructure components
- **Dependency Status**: Track external service availability
- **Performance Metrics**: Measure response times and system load
- **Early Warning**: Detect issues before they impact users

### 1.2 Health Check Types
- **Basic Health**: Simple application responsiveness check
- **Detailed Health**: Comprehensive dependency and resource checks
- **Deep Health**: Full system validation including data integrity
- **Synthetic Monitoring**: Simulated user interactions

## 2. Health Check Specifications

### 2.1 Health Check Endpoints

#### GET /health
**Purpose**: Basic application health check
**Authentication**: None (public endpoint)
**Response Format**:
```json
{
  "status": "healthy | degraded | unhealthy",
  "timestamp": "ISO 8601",
  "version": "semver",
  "uptime": "number (seconds)"
}
```
**Response Time**: <50ms
**Caching**: No caching, always fresh

#### GET /health/detailed
**Purpose**: Comprehensive system health check
**Authentication**: Required (admin or monitoring role)
**Response Format**:
```json
{
  "status": "healthy | degraded | unhealthy",
  "timestamp": "ISO 8601",
  "services": [
    {
      "name": "service-name",
      "status": "healthy | degraded | unhealthy",
      "responseTime": "number (ms)",
      "lastCheck": "ISO 8601",
      "details": "object (service-specific data)"
    }
  ],
  "system": {
    "memory": "object",
    "cpu": "object",
    "disk": "object"
  }
}
```

#### GET /health/readiness
**Purpose**: Kubernetes readiness probe
**Response**: 200 OK if ready to serve traffic
**Timeout**: 5 seconds

#### GET /health/liveness
**Purpose**: Kubernetes liveness probe
**Response**: 200 OK if application should continue running
**Timeout**: 10 seconds

### 2.2 Service Health Checks

| Service | Check Method | Healthy Threshold | Degraded Threshold | Unhealthy Threshold |
|---------|--------------|-------------------|-------------------|-------------------|
| **MongoDB** | Database ping | <100ms | 100-500ms | >500ms or error |
| **Redis** | PING command | <50ms | 50-200ms | >200ms or error |
| **Keycloak** | Token validation | <200ms | 200-1000ms | >1000ms or error |
| **External APIs** | HTTP GET /health | <500ms | 500-2000ms | >2000ms or error |
| **Queue System** | Queue stats | <100 pending | 100-1000 pending | >1000 pending |
| **File System** | Disk space check | >20% free | 10-20% free | <10% free |

### 2.3 Health Check Result Schema
```json
{
  "service": "string (service identifier)",
  "status": "healthy | degraded | unhealthy",
  "responseTime": "number (milliseconds)",
  "lastCheck": "ISO 8601 timestamp",
  "consecutiveFailures": "number",
  "details": {
    "message": "string (optional)",
    "error": "string (optional)",
    "metrics": "object (service-specific)"
  }
}
```

## 3. Monitoring Specifications

### 3.1 Key Performance Metrics

#### Application Metrics
| Metric | Type | Target | Warning | Critical |
|--------|------|--------|---------|----------|
| **API Response Time (P95)** | Histogram | <200ms | >500ms | >1000ms |
| **API Response Time (P99)** | Histogram | <500ms | >1000ms | >2000ms |
| **Request Rate** | Counter | Variable | N/A | N/A |
| **Error Rate** | Rate | <1% | >2% | >5% |
| **Active Connections** | Gauge | Variable | >80% limit | >95% limit |

#### Business Metrics
| Metric | Type | Target | Warning | Critical |
|--------|------|--------|---------|----------|
| **Research Requests/min** | Rate | Variable | N/A | N/A |
| **Job Processing Time** | Histogram | <30s | >60s | >120s |
| **Job Success Rate** | Rate | >99% | <95% | <90% |
| **Queue Depth** | Gauge | <100 | >500 | >1000 |
| **Webhook Delivery Success** | Rate | >98% | <95% | <90% |

#### Infrastructure Metrics
| Metric | Type | Target | Warning | Critical |
|--------|------|--------|---------|----------|
| **CPU Utilization** | Gauge | <70% | >80% | >90% |
| **Memory Usage** | Gauge | <80% | >90% | >95% |
| **Disk Usage** | Gauge | <80% | >90% | >95% |
| **Network I/O** | Counter | Variable | High sustained | Maxed out |

### 3.2 Service-Specific Monitoring

#### Database Monitoring
- **Connection Pool**: Active/idle connections, pool exhaustion
- **Query Performance**: Slow query count, average execution time
- **Replication Lag**: Primary/secondary synchronization delay
- **Storage**: Database size growth, index efficiency

#### Redis Monitoring
- **Memory Usage**: Used memory, fragmentation ratio
- **Command Rate**: Operations per second, slow commands
- **Connection Count**: Active clients, blocked clients
- **Persistence**: Last save time, background save status

#### Queue Monitoring
- **Job Metrics**: Processed/failed job counts, retry attempts
- **Worker Status**: Active workers, worker failures
- **Queue Depth**: Pending jobs by priority/type
- **Processing Time**: Job duration distribution

## 4. Error Tracking and Logging

### 4.1 Error Classification
- **Critical**: Service unavailable, data corruption, security breaches
- **Major**: Feature degradation, performance issues
- **Minor**: Edge case errors, validation failures
- **Informational**: Expected errors, user mistakes

### 4.2 Logging Requirements

#### Structured Log Format
```json
{
  "timestamp": "ISO 8601",
  "level": "error | warn | info | debug",
  "service": "service-name",
  "requestId": "UUID",
  "userId": "string (optional)",
  "event": "event-type",
  "message": "human-readable message",
  "context": "object (additional data)",
  "error": {
    "type": "error-class",
    "message": "error-message",
    "stack": "stack-trace",
    "code": "error-code"
  }
}
```

#### Log Levels and Usage
- **ERROR**: System errors, exceptions, failures requiring attention
- **WARN**: Degraded performance, retries, recoverable issues
- **INFO**: Business events, request/response logging
- **DEBUG**: Detailed diagnostic information for troubleshooting

## 5. Alerting Strategy

### 5.1 Alert Categories

#### P1 - Critical (Immediate Response)
- Service completely unavailable
- Database connection failures
- Authentication system down
- Data loss or corruption detected
- Security breaches

#### P2 - Major (1 Hour Response)
- High error rates (>5%)
- Severe performance degradation
- Queue backup (>1000 pending)
- External API failures
- Memory/disk critically low

#### P3 - Minor (4 Hour Response)
- Elevated error rates (2-5%)
- Moderate performance issues
- Configuration drift detected
- Certificate expiring soon
- Non-critical feature failures

### 5.2 Alert Configuration Schema
```json
{
  "alert": {
    "name": "string",
    "description": "string",
    "severity": "critical | major | minor",
    "condition": {
      "metric": "string",
      "operator": "> | < | >= | <= | ==",
      "threshold": "number",
      "duration": "duration string (5m, 1h)"
    },
    "notifications": [
      {
        "channel": "pagerduty | slack | email",
        "target": "string",
        "severity": "critical | major | minor"
      }
    ],
    "runbook": "URL to troubleshooting guide"
  }
}
```

## 6. Implementation Requirements

### 6.1 Health Check Implementation
- **Timeout Handling**: All checks must have configurable timeouts
- **Circuit Breaker**: Prevent cascading failures from dependency checks
- **Caching**: Cache results briefly to prevent overload
- **Graceful Degradation**: Continue serving if non-critical checks fail

### 6.2 Monitoring Integration
- **Prometheus Metrics**: Export metrics in Prometheus format
- **OpenTelemetry**: Use standard instrumentation libraries
- **Custom Metrics**: Business-specific measurements
- **Metric Labeling**: Consistent labeling strategy

### 6.3 Alert Management
- **Alert Routing**: Route alerts based on severity and team
- **Escalation**: Automatic escalation if not acknowledged
- **Suppression**: Prevent alert storms during incidents
- **Recovery Notifications**: Send all-clear when resolved

## 7. Monitoring Tools and Infrastructure

### 7.1 Required Components
- **Metrics Collection**: Prometheus or compatible
- **Time Series Database**: For historical metric storage
- **Alerting**: AlertManager or equivalent
- **Visualization**: Grafana dashboards
- **Log Aggregation**: ELK stack or similar
- **Distributed Tracing**: Jaeger or Zipkin

### 7.2 Dashboard Requirements
- **Operations Dashboard**: Real-time system status
- **Business Dashboard**: Key business metrics
- **Performance Dashboard**: Response times and throughput
- **Error Dashboard**: Error rates and types
- **Infrastructure Dashboard**: System resources

### 7.3 Retention Policies
- **Metrics**: 30 days high resolution, 1 year aggregated
- **Logs**: 90 days application logs, 1 year audit logs
- **Traces**: 7 days detailed traces, 30 days sampled
- **Alerts**: 1 year alert history

---

[← Back to Backend Architecture](./readme.md)