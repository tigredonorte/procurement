# Error Handling Patterns

## E. Error Handling Patterns

### E.1 Custom Error Classes

```typescript
// Custom error classes for different scenarios
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public code?: string
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(422, message, true, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(401, message, true, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(403, message, true, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, true, 'NOT_FOUND');
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super(429, 'Too many requests', true, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter;
  }
  public retryAfter: number;
}
```

### E.2 Global Error Handler Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error('Error occurred', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    request: {
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers,
      ip: req.ip,
      userId: req.user?.id,
    },
    timestamp: new Date().toISOString(),
  });

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err instanceof ValidationError && err.fields && { fields: err.fields }),
        ...(err instanceof RateLimitError && { retryAfter: err.retryAfter }),
      },
    });
  }

  // Handle MongoDB errors
  if (err.name === 'MongoError') {
    if (err.code === 11000) {
      return res.status(409).json({
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'Resource already exists',
        },
      });
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      },
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { 
        debug: {
          message: err.message,
          stack: err.stack,
        },
      }),
    },
  });
};
```