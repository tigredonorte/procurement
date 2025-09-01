# Epic G — Comprehensive Observability & Operations

[← Back to Tasks Overview](./Readme.md)

---

## Goal Statement
Implement a comprehensive observability and operational monitoring system that provides deep visibility into system performance, user behavior, and business metrics, enabling proactive issue detection, root cause analysis, and data-driven optimization decisions.

## Success Criteria
- Complete observability stack with logs, metrics, traces, and alerts
- Mean Time to Detection (MTTD) < 5 minutes for critical issues
- Mean Time to Resolution (MTTR) < 30 minutes for system issues
- 99.9% uptime monitoring with automated alerting
- Comprehensive dashboards for technical and business metrics
- Performance targets: <1% overhead from monitoring, <100ms additional latency

## Technical Requirements

### Observability Stack
- **Logging**: Structured JSON logs with correlation IDs
- **Metrics**: Prometheus-compatible metrics collection
- **Tracing**: Distributed tracing with OpenTelemetry
- **Alerting**: Multi-channel alerting with escalation policies
- **Dashboards**: Real-time monitoring and analytics dashboards
- **Health Checks**: Comprehensive health monitoring for all services

## Tasks

### G1. Enterprise-Grade Structured Logging System
**Priority**: Critical | **Effort**: M | **Dependencies**: A1, A2

**Scope:**
- Implement comprehensive structured logging across all services
- Set up centralized log aggregation and correlation
- Create log-based alerting and monitoring
- Implement log retention and archival policies
- Set up log analysis and search capabilities

**Technical Implementation:**

**Structured Logging Framework:**
```typescript
interface LogContext {
  requestId: string;
  userId?: string;
  sessionId?: string;
  traceId?: string;
  spanId?: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  metadata?: Record<string, any>;
  duration?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

class Logger {
  private context: Partial<LogContext>;
  private winston: WinstonLogger;

  constructor(context: Partial<LogContext>) {
    this.context = context;
    this.winston = createWinstonLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }),
        new winston.transports.HTTP({
          host: 'log-aggregator.internal',
          port: 9200,
          path: '/logs',
        }),
      ],
    });
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log('info', message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log('error', message, {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
      } : undefined,
    });
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const logEntry: LogContext = {
      ...this.context,
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      requestId: this.context.requestId || generateRequestId(),
      traceId: this.getTraceId(),
      spanId: this.getSpanId(),
    };

    this.winston.log(level, logEntry);
    
    // Send critical errors to monitoring
    if (level === 'error' || level === 'fatal') {
      this.sendToErrorTracking(logEntry);
    }
  }
}
```

**Request Correlation Middleware:**
```typescript
const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  const sessionId = req.headers['x-session-id'] as string;
  const userId = req.user?.id;
  
  // Add correlation IDs to request context
  req.correlationContext = {
    requestId,
    sessionId,
    userId,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    method: req.method,
    path: req.path,
    startTime: Date.now(),
  };
  
  // Add to response headers for client correlation
  res.setHeader('x-request-id', requestId);
  res.setHeader('x-trace-id', req.correlationContext.traceId);
  
  // Create logger with context
  req.logger = new Logger({
    requestId,
    userId,
    sessionId,
    service: 'api',
    version: process.env.APP_VERSION,
    environment: process.env.NODE_ENV,
  });
  
  // Log request start
  req.logger.info('Request started', {
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - req.correlationContext.startTime;
    req.logger.info('Request completed', {
      statusCode: res.statusCode,
      duration,
      contentLength: res.getHeader('content-length'),
    });
  });
  
  next();
};
```

**Acceptance Criteria:**
- [ ] All services produce structured JSON logs
- [ ] Request correlation works end-to-end
- [ ] Log aggregation captures all application logs
- [ ] Log retention policies implemented (90 days standard, 1 year compliance)
- [ ] Log-based alerting configured for critical errors
- [ ] Log search and analysis tools available
- [ ] Performance impact <1% on application throughput

---

### G2. Comprehensive Health & Readiness Monitoring
**Priority**: Critical | **Effort**: M | **Dependencies**: G1

**Scope:**
- Implement detailed health checks for all services and dependencies
- Create readiness probes for container orchestration
- Set up automated health monitoring and alerting
- Implement circuit breaker patterns based on health status
- Create health status dashboards and APIs

**Technical Implementation:**

**Health Check Framework:**
```typescript
interface HealthCheck {
  name: string;
  check: () => Promise<HealthCheckResult>;
  timeout: number;
  critical: boolean;
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  duration: number;
  metadata?: Record<string, any>;
}

class HealthService {
  private checks: Map<string, HealthCheck> = new Map();
  private cache: Map<string, { result: HealthCheckResult; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  registerCheck(check: HealthCheck): void {
    this.checks.set(check.name, check);
  }

  async runHealthChecks(): Promise<OverallHealthStatus> {
    const results = new Map<string, HealthCheckResult>();
    const promises = Array.from(this.checks.entries()).map(async ([name, check]) => {
      try {
        const cached = this.cache.get(name);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
          results.set(name, cached.result);
          return;
        }

        const startTime = Date.now();
        const result = await Promise.race([
          check.check(),
          new Promise<HealthCheckResult>((_, reject) => 
            setTimeout(() => reject(new Error('Health check timeout')), check.timeout)
          ),
        ]);
        
        result.duration = Date.now() - startTime;
        results.set(name, result);
        this.cache.set(name, { result, timestamp: Date.now() });
        
      } catch (error) {
        results.set(name, {
          status: 'unhealthy',
          message: error.message,
          duration: Date.now() - startTime,
        });
      }
    });

    await Promise.all(promises);
    return this.aggregateHealthStatus(results);
  }

  private aggregateHealthStatus(results: Map<string, HealthCheckResult>): OverallHealthStatus {
    const criticalChecks = Array.from(this.checks.values()).filter(c => c.critical);
    const criticalResults = criticalChecks.map(c => results.get(c.name)!);
    
    const hasUnhealthyCritical = criticalResults.some(r => r.status === 'unhealthy');
    const hasDegradedCritical = criticalResults.some(r => r.status === 'degraded');
    
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (hasUnhealthyCritical) {
      overallStatus = 'unhealthy';
    } else if (hasDegradedCritical) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      status: overallStatus,
      checks: Object.fromEntries(results),
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION,
      uptime: process.uptime(),
    };
  }
}

// Database health check
const databaseHealthCheck: HealthCheck = {
  name: 'database',
  timeout: 5000,
  critical: true,
  check: async () => {
    try {
      await mongoose.connection.db.admin().ping();
      const stats = await mongoose.connection.db.stats();
      
      return {
        status: 'healthy',
        message: 'Database connection is healthy',
        duration: 0, // Will be set by HealthService
        metadata: {
          collections: stats.collections,
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`,
        duration: 0,
      };
    }
  },
};

// Redis health check
const redisHealthCheck: HealthCheck = {
  name: 'redis',
  timeout: 3000,
  critical: true,
  check: async () => {
    try {
      const start = Date.now();
      const pong = await redisClient.ping();
      const latency = Date.now() - start;
      
      const info = await redisClient.info('memory');
      const memoryInfo = parseRedisInfo(info);
      
      const status = latency > 1000 ? 'degraded' : 'healthy';
      
      return {
        status,
        message: `Redis is ${status} (latency: ${latency}ms)`,
        duration: 0,
        metadata: {
          latency,
          usedMemory: memoryInfo.used_memory_human,
          connectedClients: memoryInfo.connected_clients,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Redis connection failed: ${error.message}`,
        duration: 0,
      };
    }
  },
};
```

**Health Check Endpoints:**
```typescript
// Kubernetes-compatible health endpoints
app.get('/healthz', async (req, res) => {
  try {
    const health = await healthService.runHealthChecks();
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Readiness probe - more strict than liveness
app.get('/readyz', async (req, res) => {
  try {
    const health = await healthService.runHealthChecks();
    
    // Only ready if all critical systems are healthy
    const isReady = health.status === 'healthy';
    const statusCode = isReady ? 200 : 503;
    
    res.status(statusCode).json({
      ready: isReady,
      health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      message: 'Readiness check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Detailed health status for monitoring
app.get('/health/detailed', async (req, res) => {
  const health = await healthService.runHealthChecks();
  const systemInfo = {
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    uptime: process.uptime(),
    version: process.env.APP_VERSION,
    nodeVersion: process.version,
    platform: process.platform,
    pid: process.pid,
  };
  
  res.json({
    ...health,
    system: systemInfo,
    environment: process.env.NODE_ENV,
  });
});
```

**Acceptance Criteria:**
- [ ] Health checks cover all critical dependencies
- [ ] Readiness probes prevent traffic to unhealthy instances
- [ ] Health status cached to prevent overwhelming dependencies
- [ ] Circuit breakers triggered by health check failures
- [ ] Health monitoring dashboards display real-time status
- [ ] Automated alerting on health degradation
- [ ] Health check performance impact <10ms per check

---

### G3. Advanced Metrics & Performance Monitoring
**Priority**: High | **Effort**: L | **Dependencies**: G1, G2

**Scope:**
- Implement comprehensive application and business metrics
- Set up Prometheus-compatible metrics collection
- Create performance monitoring and alerting
- Implement custom metrics for business KPIs
- Set up metrics visualization and dashboards

**Technical Implementation:**

**Metrics Collection Framework:**
```typescript
class MetricsCollector {
  private prometheus = require('prom-client');
  private registry: prometheus.Registry;
  
  // Application metrics
  private httpRequestDuration: prometheus.Histogram;
  private httpRequestTotal: prometheus.Counter;
  private activeConnections: prometheus.Gauge;
  private errorRate: prometheus.Counter;
  
  // Business metrics
  private researchRequestsTotal: prometheus.Counter;
  private researchCompletionTime: prometheus.Histogram;
  private webhookDeliverySuccess: prometheus.Counter;
  private activeUsers: prometheus.Gauge;
  
  // System metrics
  private memoryUsage: prometheus.Gauge;
  private cpuUsage: prometheus.Gauge;
  private gcDuration: prometheus.Histogram;

  constructor() {
    this.registry = new prometheus.Registry();
    this.initializeMetrics();
    this.startSystemMetricsCollection();
  }

  private initializeMetrics() {
    this.httpRequestDuration = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    });

    this.httpRequestTotal = new prometheus.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.researchRequestsTotal = new prometheus.Counter({
      name: 'research_requests_total',
      help: 'Total number of research requests',
      labelNames: ['user_id', 'status', 'api_provider'],
    });

    this.researchCompletionTime = new prometheus.Histogram({
      name: 'research_completion_time_seconds',
      help: 'Research request completion time in seconds',
      labelNames: ['api_provider', 'complexity'],
      buckets: [1, 5, 10, 30, 60, 120, 300, 600],
    });

    // Register all metrics
    this.registry.registerMetric(this.httpRequestDuration);
    this.registry.registerMetric(this.httpRequestTotal);
    this.registry.registerMetric(this.researchRequestsTotal);
    this.registry.registerMetric(this.researchCompletionTime);
    // ... register other metrics
  }

  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDuration.labels(method, route, statusCode.toString()).observe(duration / 1000);
    this.httpRequestTotal.labels(method, route, statusCode.toString()).inc();
  }

  recordResearchRequest(userId: string, status: string, apiProvider: string, duration?: number) {
    this.researchRequestsTotal.labels(userId, status, apiProvider).inc();
    
    if (duration && status === 'completed') {
      const complexity = this.calculateComplexity(duration);
      this.researchCompletionTime.labels(apiProvider, complexity).observe(duration / 1000);
    }
  }

  getMetrics(): string {
    return this.registry.metrics();
  }
}

// Metrics middleware for Express
const metricsMiddleware = (metrics: MetricsCollector) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const route = req.route?.path || req.path;
      
      metrics.recordHttpRequest(
        req.method,
        route,
        res.statusCode,
        duration
      );
    });
    
    next();
  };
};

// Business metrics tracking
class BusinessMetrics {
  private metricsCollector: MetricsCollector;
  
  constructor(metricsCollector: MetricsCollector) {
    this.metricsCollector = metricsCollector;
  }
  
  trackUserRegistration(userId: string, organizationType: string) {
    this.metricsCollector.recordCustomMetric('user_registrations_total', 1, {
      organization_type: organizationType,
    });
  }
  
  trackResearchRequest(researchData: ResearchRequest) {
    this.metricsCollector.recordResearchRequest(
      researchData.userId.toString(),
      researchData.status.current,
      researchData.parameters.sources[0] || 'unknown'
    );
  }
  
  trackWebhookDelivery(webhookId: string, success: boolean, responseTime: number) {
    this.metricsCollector.recordCustomMetric('webhook_deliveries_total', 1, {
      webhook_id: webhookId,
      success: success.toString(),
    });
    
    this.metricsCollector.recordCustomMetric('webhook_response_time_seconds', responseTime / 1000, {
      webhook_id: webhookId,
    });
  }
}
```

**Custom Dashboards Configuration:**
```json
{
  "dashboard": {
    "title": "Requisio.com - Application Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [{
          "expr": "rate(http_requests_total[5m])",
          "legendFormat": "{{method}} {{route}}"
        }]
      },
      {
        "title": "Response Time P95",
        "type": "graph", 
        "targets": [{
          "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
          "legendFormat": "95th percentile"
        }]
      },
      {
        "title": "Research Requests by Status",
        "type": "pie",
        "targets": [{
          "expr": "sum by (status) (research_requests_total)",
          "legendFormat": "{{status}}"
        }]
      },
      {
        "title": "Active Users (24h)",
        "type": "stat",
        "targets": [{
          "expr": "count(count by (user_id) (increase(http_requests_total{route=\"/api/v1/research\"}[24h])))"
        }]
      }
    ]
  }
}
```

**Acceptance Criteria:**
- [ ] Comprehensive application metrics collected
- [ ] Business KPIs tracked and visualized
- [ ] Performance monitoring with SLA alerting
- [ ] Custom dashboards for different stakeholders
- [ ] Metrics retention for historical analysis
- [ ] Automated anomaly detection on key metrics
- [ ] Metrics collection overhead <2% of system resources

**Done when:** Complete observability stack deployed; MTTD <5min; comprehensive dashboards operational; automated alerting configured.

---

**Navigation:** [← Epic F - UI/UX](./06-epic-f-ui-ux.md) | [Epic H - Security →](./08-epic-h-security.md)