# External API Integration

## F. External API Integration

### F.1 API Client with Circuit Breaker

```typescript
import CircuitBreaker from 'opossum';
import axios, { AxiosInstance } from 'axios';

export class ExternalAPIClient {
  private client: AxiosInstance;
  private breaker: CircuitBreaker;

  constructor(private apiKey: string, private baseUrl: string) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    // Circuit breaker configuration
    const options = {
      timeout: 30000, // 30 seconds
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
      rollingCountTimeout: 10000,
      rollingCountBuckets: 10,
      name: 'ExternalAPIClient',
    };

    this.breaker = new CircuitBreaker(this.makeRequest.bind(this), options);

    // Circuit breaker events
    this.breaker.on('open', () => {
      logger.warn('Circuit breaker opened for External API');
    });

    this.breaker.on('halfOpen', () => {
      logger.info('Circuit breaker half-open for External API');
    });

    this.breaker.on('close', () => {
      logger.info('Circuit breaker closed for External API');
    });
  }

  async search(query: string, options?: SearchOptions): Promise<any> {
    return this.breaker.fire({
      method: 'POST',
      url: '/search',
      data: {
        query,
        ...options,
      },
    });
  }

  private async makeRequest(config: any) {
    const response = await this.client.request(config);
    return response.data;
  }
}
```

### F.2 Retry Logic with Exponential Backoff

```typescript
export class RetryableClient {
  private maxRetries = 3;
  private baseDelay = 1000;
  private maxDelay = 10000;

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        logger.warn(`Operation failed (attempt ${attempt}/${this.maxRetries})`, {
          context,
          error: error.message,
          attempt,
        });

        if (attempt < this.maxRetries) {
          const delay = Math.min(
            this.baseDelay * Math.pow(2, attempt - 1),
            this.maxDelay
          );
          await this.delay(delay);
        }
      }
    }

    logger.error(`Operation failed after ${this.maxRetries} attempts`, {
      context,
      error: lastError.message,
    });

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## P.3 External API Integration Patterns

```typescript
// API Client with Retry Logic
class ExternalAPIClient {
  private maxRetries = 3;
  private retryDelay = 1000;
  
  async search(query: string, options?: SearchOptions): Promise<any> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          },
          body: JSON.stringify({ query, ...options })
        });
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        return await response.json();
        
      } catch (error) {
        lastError = error;
        logger.warn(`API call failed (attempt ${attempt}/${this.maxRetries})`, {
          error: error.message,
          query
        });
        
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    
    throw lastError;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```