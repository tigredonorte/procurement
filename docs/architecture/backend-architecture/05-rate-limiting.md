# Rate Limiting Configuration

## H. Rate Limiting Configuration

### H.1 Advanced Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis';

// Different rate limits for different endpoints
export const rateLimiters = {
  // General API rate limit
  general: rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rl:general:',
    }),
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Strict limit for research submission
  research: rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rl:research:',
    }),
    windowMs: 60 * 1000,
    max: 10, // 10 research requests per minute
    message: 'Research request limit exceeded',
    keyGenerator: (req) => req.user?.id || req.ip,
  }),

  // Authentication endpoints
  auth: rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rl:auth:',
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
    message: 'Too many authentication attempts',
    skipSuccessfulRequests: true,
  }),

  // Webhook endpoints
  webhook: rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rl:webhook:',
    }),
    windowMs: 60 * 1000,
    max: 50,
    keyGenerator: (req) => req.user?.id || req.ip,
  }),
};
```

## P.1 API Rate Limiting Configuration

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userId: req.user?.id,
      path: req.path
    });
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: req.rateLimit.resetTime
    });
  }
});
```