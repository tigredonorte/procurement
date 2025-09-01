# Monitoring and Health Checks

## I. Monitoring and Health Checks

### I.1 Comprehensive Health Check Implementation

```typescript
interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details?: any;
}

export class HealthCheckService {
  async checkAll(): Promise<HealthCheckResult[]> {
    const checks = await Promise.allSettled([
      this.checkMongoDB(),
      this.checkRedis(),
      this.checkKeycloak(),
      this.checkExternalAPI(),
      this.checkQueueHealth(),
    ]);

    return checks.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          service: 'unknown',
          status: 'unhealthy',
          responseTime: 0,
          error: result.reason.message,
        };
      }
    });
  }

  private async checkMongoDB(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      await mongoose.connection.db.admin().ping();
      return {
        service: 'mongodb',
        status: 'healthy',
        responseTime: Date.now() - start,
      };
    } catch (error) {
      return {
        service: 'mongodb',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: { error: error.message },
      };
    }
  }

  private async checkRedis(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      await redisClient.ping();
      const info = await redisClient.info('memory');
      return {
        service: 'redis',
        status: 'healthy',
        responseTime: Date.now() - start,
        details: { memory: this.parseRedisMemory(info) },
      };
    } catch (error) {
      return {
        service: 'redis',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: { error: error.message },
      };
    }
  }

  private async checkQueueHealth(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      const queue = new Queue('research-queue', { connection });
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
      ]);

      const status = waiting > 100 ? 'degraded' : 'healthy';

      return {
        service: 'queue',
        status,
        responseTime: Date.now() - start,
        details: {
          waiting,
          active,
          completed,
          failed,
        },
      };
    } catch (error) {
      return {
        service: 'queue',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: { error: error.message },
      };
    }
  }
}
```

## O.2 Metrics Collection

### O.2.1 Key Metrics to Track

| Metric | Type | Target | Alert Threshold |
|--------|------|--------|-----------------|
| API Response Time | Latency | < 200ms (p95) | > 500ms |
| Job Processing Time | Duration | < 30s | > 60s |
| Queue Depth | Gauge | < 100 | > 500 |
| Error Rate | Rate | < 1% | > 5% |
| Authentication Success | Rate | > 95% | < 90% |
| External API Success | Rate | > 98% | < 95% |

### O.2.2 Health Check Endpoints

```typescript
// Health Check Implementation
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION
  });
});

app.get('/health/detailed', authenticate, (req, res) => {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkKeycloak(),
    checkExternalAPI()
  ]);
  
  res.json({
    status: checks.every(c => c.healthy) ? 'healthy' : 'degraded',
    services: checks,
    timestamp: new Date().toISOString()
  });
});
```

## O.3 Error Tracking

### O.3.1 Error Handling Strategy

```typescript
// Global Error Handler
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.error('Operational error', {
      error: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });
    
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.statusCode
    });
  }
  
  // Unexpected errors
  logger.error('Unexpected error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal server error',
    code: 500
  });
};
```

## O.1 Logging Strategy

### O.1.1 Log Levels and Structure

```typescript
// Structured Logging with Winston
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usage
logger.info('Research request created', {
  requestId: request.id,
  userId: user.id,
  query: request.query,
  timestamp: new Date().toISOString()
});
```