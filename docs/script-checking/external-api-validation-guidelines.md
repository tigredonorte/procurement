# External API Integration & Rate Limiting Validation Guidelines

## 1. External API Integration Validation

### 1.1 Required Documentation Structure

```
/external-apis/
├── api-registry.md         # All external APIs catalog
├── api-contracts/
│   ├── supplier-api.md     # Per-provider specifications
│   ├── pricing-api.md
│   └── inventory-api.md
├── api-mappings.md         # Data transformation rules
├── api-credentials.md      # Authentication configurations (encrypted)
├── api-fallbacks.md        # Fallback strategies
└── api-sla.md             # Service level agreements
```

### 1.2 Provider Configuration Schema (api-registry.md)

````markdown
## Provider: SupplierAPI

**Status**: active|degraded|maintenance|deprecated
**Added**: YYYY-MM-DD
**Updated**: YYYY-MM-DD HH:MM
**Owner**: integration-team

### Connection Details

| Property     | Value                            | Notes                    |
| ------------ | -------------------------------- | ------------------------ |
| Base URL     | https://api.supplier.com/v2      | Production endpoint      |
| Sandbox URL  | https://sandbox.api.supplier.com | Testing endpoint         |
| Auth Type    | OAuth2                           | Client credentials flow  |
| Timeout      | 30s                              | Maximum request duration |
| Retry Policy | Exponential                      | 3 attempts max           |

### Rate Limits

| Window     | Limit | Current Usage        | Reset     |
| ---------- | ----- | -------------------- | --------- |
| Per Minute | 100   | Tracked in Redis     | Rolling   |
| Per Hour   | 5000  | Tracked in Redis     | Fixed     |
| Concurrent | 10    | Semaphore controlled | Immediate |

### Capabilities

- ✅ Product Search
- ✅ Price Lookup
- ✅ Inventory Check
- ❌ Order Placement (not implemented)
- ✅ Webhook Support

### Circuit Breaker Configuration

```yaml
errorThreshold: 50
errorThresholdPercentage: 50
timeout: 30000
resetTimeout: 60000
volumeThreshold: 10
```
````

### Data Mapping Rules

```json
{
  "request": {
    "search_term": "$.query",
    "page_size": "$.limit",
    "filters.category": "$.category_id"
  },
  "response": {
    "products[].id": "$.items[].product_id",
    "products[].name": "$.items[].title",
    "products[].price": {
      "path": "$.items[].pricing.amount",
      "transform": "convertCurrency"
    }
  }
}
```

### Health Check

**Endpoint**: GET /health
**Expected Response**: 200 OK
**Check Frequency**: Every 30s
**Last Check**: YYYY-MM-DD HH:MM:SS
**Status**: ✅ Healthy

````

### 1.3 External API Validation Checks

```javascript
const externalAPIValidationChecks = [
  // Provider configuration
  {
    name: 'provider-registry',
    check: () => assertAllProvidersDocumented(),
    critical: true
  },
  {
    name: 'provider-credentials',
    check: () => assertCredentialsConfigured(),
    critical: true
  },
  {
    name: 'provider-health',
    check: () => assertProviderHealthChecks(),
    critical: false
  },

  // Authentication
  {
    name: 'auth-implementation',
    check: () => assertAuthenticationMethods(),
    critical: true
  },
  {
    name: 'token-refresh',
    check: () => assertTokenRefreshLogic(),
    critical: true
  },
  {
    name: 'credential-rotation',
    check: () => assertCredentialRotation(),
    critical: false
  },

  // Rate limiting
  {
    name: 'rate-limit-tracking',
    check: () => assertRateLimitTracking(),
    critical: true
  },
  {
    name: 'rate-limit-headers',
    check: () => assertRateLimitHeaderParsing(),
    critical: true
  },
  {
    name: 'throttling-logic',
    check: () => assertThrottlingImplementation(),
    critical: true
  },

  // Circuit breaker
  {
    name: 'circuit-breaker-config',
    check: () => assertCircuitBreakerConfiguration(),
    critical: true
  },
  {
    name: 'circuit-breaker-states',
    check: () => assertCircuitBreakerStates(),
    critical: true
  },
  {
    name: 'fallback-mechanisms',
    check: () => assertFallbackImplementation(),
    critical: false
  },

  // Data transformation
  {
    name: 'request-mapping',
    check: () => assertRequestTransformation(),
    critical: true
  },
  {
    name: 'response-parsing',
    check: () => assertResponseParsing(),
    critical: true
  },
  {
    name: 'data-normalization',
    check: () => assertDataNormalization(),
    critical: true
  },
  {
    name: 'error-mapping',
    check: () => assertErrorMapping(),
    critical: false
  },

  // Caching
  {
    name: 'cache-strategy',
    check: () => assertCachingStrategy(),
    critical: false
  },
  {
    name: 'cache-invalidation',
    check: () => assertCacheInvalidation(),
    critical: false
  },

  // Monitoring
  {
    name: 'api-metrics',
    check: () => assertAPIMetrics(),
    critical: false
  },
  {
    name: 'sla-monitoring',
    check: () => assertSLACompliance(),
    critical: false
  }
];
````

### 1.4 Provider Integration Test Suite

```javascript
class ExternalAPIIntegrationValidator {
  async validateProvider(providerId) {
    const provider = await this.loadProviderConfig(providerId);
    const results = [];

    // Test authentication
    results.push(await this.testAuthentication(provider));

    // Test basic connectivity
    results.push(await this.testConnectivity(provider));

    // Test rate limiting behavior
    results.push(await this.testRateLimiting(provider));

    // Test data transformation
    results.push(await this.testDataTransformation(provider));

    // Test error handling
    results.push(await this.testErrorHandling(provider));

    // Test circuit breaker
    results.push(await this.testCircuitBreaker(provider));

    return {
      provider: providerId,
      timestamp: new Date().toISOString(),
      results,
      summary: this.generateSummary(results),
    };
  }

  async testAuthentication(provider) {
    const tests = [];

    // Test successful authentication
    tests.push({
      name: 'Valid credentials',
      test: async () => {
        const token = await this.authenticate(provider);
        return token && token.length > 0;
      },
    });

    // Test token refresh
    tests.push({
      name: 'Token refresh',
      test: async () => {
        const token = await this.getExpiredToken(provider);
        const newToken = await this.refreshToken(provider, token);
        return newToken !== token;
      },
    });

    // Test invalid credentials handling
    tests.push({
      name: 'Invalid credentials',
      test: async () => {
        try {
          await this.authenticateWithInvalid(provider);
          return false;
        } catch (error) {
          return error.code === 'AUTH_FAILED';
        }
      },
    });

    return this.runTests(tests);
  }

  async testRateLimiting(provider) {
    const tests = [];

    // Test rate limit enforcement
    tests.push({
      name: 'Rate limit enforcement',
      test: async () => {
        const limit = provider.rateLimit.perMinute;
        const responses = [];

        // Make requests up to limit + 5
        for (let i = 0; i < limit + 5; i++) {
          const response = await this.makeRequest(provider);
          responses.push(response);
        }

        // Check that we got rate limited
        const rateLimited = responses.filter((r) => r.status === 429);
        return rateLimited.length > 0;
      },
    });

    // Test rate limit headers
    tests.push({
      name: 'Rate limit headers',
      test: async () => {
        const response = await this.makeRequest(provider);
        return response.headers['x-ratelimit-limit'] && response.headers['x-ratelimit-remaining'];
      },
    });

    return this.runTests(tests);
  }

  async testCircuitBreaker(provider) {
    const tests = [];

    // Test circuit breaker opens on failures
    tests.push({
      name: 'Circuit breaker opens',
      test: async () => {
        // Force failures
        for (let i = 0; i < 10; i++) {
          await this.forceFailure(provider);
        }

        // Check circuit state
        const state = await this.getCircuitState(provider);
        return state === 'OPEN';
      },
    });

    // Test circuit breaker recovery
    tests.push({
      name: 'Circuit breaker recovery',
      test: async () => {
        // Wait for reset timeout
        await this.wait(provider.circuitBreaker.resetTimeout);

        // Check state is half-open
        const state = await this.getCircuitState(provider);
        return state === 'HALF_OPEN';
      },
    });

    return this.runTests(tests);
  }
}
```

## 2. Rate Limiting Validation

### 2.1 Rate Limit Documentation Structure

```
/rate-limiting/
├── rate-limits.md          # All rate limit configurations
├── rate-limit-tiers.md     # User tier definitions
├── rate-limit-overrides.md # Special cases and bypasses
├── throttling-strategy.md  # Throttling implementation
└── rate-limit-metrics.md   # Usage and violation tracking
```

### 2.2 Rate Limit Configuration Schema

````markdown
## Rate Limit Configuration

### Global Settings

| Setting         | Value        | Description                |
| --------------- | ------------ | -------------------------- |
| Algorithm       | Token Bucket | Rate limiting algorithm    |
| Storage         | Redis        | Rate limit counter storage |
| Window Type     | Sliding      | Rolling or fixed window    |
| Header Standard | RFC 6585     | Rate limit header format   |

### Endpoint Rate Limits

#### Authentication Endpoints

| Endpoint       | Method | Window | Limit | Key  | Bypass      |
| -------------- | ------ | ------ | ----- | ---- | ----------- |
| /auth/login    | POST   | 15m    | 5     | IP   | No          |
| /auth/register | POST   | 1h     | 3     | IP   | No          |
| /auth/refresh  | POST   | 1h     | 20    | User | No          |
| /auth/logout   | POST   | 1m     | 10    | User | Yes (admin) |

#### API Endpoints

| Endpoint         | Method | Window | Free | Basic | Premium | Enterprise |
| ---------------- | ------ | ------ | ---- | ----- | ------- | ---------- |
| /api/research    | POST   | 1m     | 5    | 10    | 25      | 100        |
| /api/research/\* | GET    | 1m     | 50   | 100   | 250     | 1000       |
| /api/webhooks    | \*     | 1m     | 20   | 50    | 100     | 500        |

### Rate Limit Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  },
  "headers": {
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": "1640995200",
    "Retry-After": "60"
  }
}
```
````

### Throttling Strategy

| Threshold | Action         | Duration    |
| --------- | -------------- | ----------- |
| 50%       | Warning header | -           |
| 80%       | Delay 100ms    | Per request |
| 90%       | Delay 500ms    | Per request |
| 100%      | Reject         | Until reset |

````

### 2.3 Rate Limiting Validation Checks

```javascript
const rateLimitingValidationChecks = [
  // Configuration
  {
    name: 'rate-limit-config',
    check: () => assertRateLimitConfiguration(),
    critical: true
  },
  {
    name: 'redis-connection',
    check: () => assertRedisConnectivity(),
    critical: true
  },
  {
    name: 'tier-definitions',
    check: () => assertUserTiersDefined(),
    critical: true
  },

  // Implementation
  {
    name: 'middleware-order',
    check: () => assertRateLimitMiddlewareOrder(),
    critical: true
  },
  {
    name: 'key-generation',
    check: () => assertKeyGenerationLogic(),
    critical: true
  },
  {
    name: 'counter-accuracy',
    check: () => assertCounterAccuracy(),
    critical: true
  },

  // Headers
  {
    name: 'response-headers',
    check: () => assertRateLimitHeaders(),
    critical: true
  },
  {
    name: 'retry-after',
    check: () => assertRetryAfterHeader(),
    critical: true
  },

  // Bypass logic
  {
    name: 'admin-bypass',
    check: () => assertAdminBypass(),
    critical: false
  },
  {
    name: 'internal-bypass',
    check: () => assertInternalServiceBypass(),
    critical: false
  },

  // Monitoring
  {
    name: 'metrics-export',
    check: () => assertRateLimitMetrics(),
    critical: false
  },
  {
    name: 'violation-logging',
    check: () => assertViolationLogging(),
    critical: false
  }
];
````

### 2.4 Rate Limit Testing Framework

```javascript
class RateLimitValidator {
  async validateEndpointLimits(endpoint, method) {
    const config = this.getRateLimitConfig(endpoint, method);
    const results = [];

    // Test each tier
    for (const tier of ['free', 'basic', 'premium', 'enterprise']) {
      results.push(await this.testTierLimit(endpoint, method, tier, config[tier]));
    }

    return {
      endpoint: `${method} ${endpoint}`,
      results,
      timestamp: new Date().toISOString(),
    };
  }

  async testTierLimit(endpoint, method, tier, limit) {
    const user = await this.createTestUser(tier);
    const requests = [];

    // Make requests up to limit
    for (let i = 0; i < limit + 5; i++) {
      const response = await this.makeAuthenticatedRequest(endpoint, method, user.token);

      requests.push({
        index: i,
        status: response.status,
        remaining: response.headers['x-ratelimit-remaining'],
        reset: response.headers['x-ratelimit-reset'],
      });

      // Small delay to avoid thundering herd
      await this.sleep(10);
    }

    // Analyze results
    const accepted = requests.filter((r) => r.status < 429).length;
    const rejected = requests.filter((r) => r.status === 429).length;

    return {
      tier,
      limit,
      accepted,
      rejected,
      correct: accepted <= limit && rejected > 0,
      headers: this.validateHeaders(requests),
    };
  }

  validateHeaders(requests) {
    const issues = [];

    for (let i = 1; i < requests.length; i++) {
      const prev = requests[i - 1];
      const curr = requests[i];

      // Remaining should decrease or reset
      if (curr.status < 429) {
        const prevRemaining = parseInt(prev.remaining);
        const currRemaining = parseInt(curr.remaining);

        if (currRemaining !== prevRemaining - 1 && currRemaining !== limit - 1) {
          issues.push(`Invalid remaining count at request ${i}`);
        }
      }

      // Reset time should be consistent within window
      if (prev.reset !== curr.reset && curr.status < 429) {
        const timeDiff = Math.abs(parseInt(prev.reset) - parseInt(curr.reset));
        if (timeDiff > 1) {
          issues.push(`Inconsistent reset time at request ${i}`);
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  async testSlidingWindow(endpoint, method) {
    const limit = 10;
    const window = 60; // seconds
    const results = [];

    // First burst
    for (let i = 0; i < limit; i++) {
      await this.makeRequest(endpoint, method);
    }

    // Wait half window
    await this.sleep(window * 500);

    // Try more requests - should partially succeed in sliding window
    for (let i = 0; i < limit; i++) {
      const response = await this.makeRequest(endpoint, method);
      results.push({
        time: Date.now(),
        status: response.status,
      });
    }

    // In sliding window, some should succeed
    const succeeded = results.filter((r) => r.status < 429).length;

    return {
      test: 'sliding_window',
      passed: succeeded > 0 && succeeded < limit,
      details: {
        limit,
        window,
        succeeded,
        expected: 'Partial success in sliding window',
      },
    };
  }
}
```

## 3. Integration with Circuit Breaker

### 3.1 Circuit Breaker State Machine

```javascript
class CircuitBreakerValidator {
  async validateCircuitBreaker(serviceId) {
    const states = ['CLOSED', 'OPEN', 'HALF_OPEN'];
    const transitions = [];

    // Test all state transitions
    transitions.push(await this.testClosedToOpen(serviceId));
    transitions.push(await this.testOpenToHalfOpen(serviceId));
    transitions.push(await this.testHalfOpenToClosed(serviceId));
    transitions.push(await this.testHalfOpenToOpen(serviceId));

    return {
      service: serviceId,
      states: states,
      transitions,
      valid: transitions.every((t) => t.valid),
    };
  }

  async testClosedToOpen(serviceId) {
    // Reset to closed state
    await this.resetCircuit(serviceId);

    // Generate failures
    const threshold = await this.getThreshold(serviceId);
    for (let i = 0; i < threshold + 1; i++) {
      await this.forceFailure(serviceId);
    }

    // Check state
    const state = await this.getState(serviceId);

    return {
      from: 'CLOSED',
      to: 'OPEN',
      trigger: `${threshold} failures`,
      valid: state === 'OPEN',
    };
  }

  async testOpenToHalfOpen(serviceId) {
    // Ensure open state
    await this.forceOpen(serviceId);

    // Wait for timeout
    const timeout = await this.getResetTimeout(serviceId);
    await this.sleep(timeout);

    // Check state
    const state = await this.getState(serviceId);

    return {
      from: 'OPEN',
      to: 'HALF_OPEN',
      trigger: `${timeout}ms timeout`,
      valid: state === 'HALF_OPEN',
    };
  }
}
```

## 4. Caching Strategy Validation

### 4.1 Cache Configuration Validation

```javascript
class CacheValidator {
  async validateCacheStrategy(providerId) {
    const config = await this.getCacheConfig(providerId);
    const tests = [];

    // Test cache key generation
    tests.push(await this.testCacheKeyGeneration(config));

    // Test TTL configuration
    tests.push(await this.testCacheTTL(config));

    // Test cache invalidation
    tests.push(await this.testCacheInvalidation(config));

    // Test cache warming
    tests.push(await this.testCacheWarming(config));

    return {
      provider: providerId,
      config,
      tests,
      valid: tests.every((t) => t.passed),
    };
  }

  async testCacheKeyGeneration(config) {
    const testCases = [
      {
        params: { query: 'laptop', page: 1 },
        expected: 'provider:search:7b2271756572793a226c6170746f70222c2270616765223a317d:v1',
      },
      {
        params: { query: 'laptop', page: 2 },
        expected: 'provider:search:7b2271756572793a226c6170746f70222c2270616765223a327d:v1',
      },
    ];

    const results = [];
    for (const testCase of testCases) {
      const key = this.generateCacheKey(config, testCase.params);
      results.push({
        params: testCase.params,
        generated: key,
        expected: testCase.expected,
        match: key === testCase.expected,
      });
    }

    return {
      test: 'cache_key_generation',
      passed: results.every((r) => r.match),
      results,
    };
  }

  async testCacheTTL(config) {
    const key = 'test:ttl:' + Date.now();
    const value = { test: 'data' };

    // Set with TTL
    await this.cache.set(key, value, config.ttl);

    // Check immediately
    const immediate = await this.cache.get(key);

    // Wait for TTL
    await this.sleep(config.ttl * 1000 + 100);

    // Check after TTL
    const expired = await this.cache.get(key);

    return {
      test: 'cache_ttl',
      passed: immediate !== null && expired === null,
      details: {
        ttl: config.ttl,
        immediateCheck: immediate !== null,
        expiredCheck: expired === null,
      },
    };
  }
}
```

## 5. Data Transformation Validation

### 5.1 Mapping Rules Validation

```javascript
class DataTransformationValidator {
  async validateTransformations(providerId) {
    const mappings = await this.loadMappings(providerId);
    const testData = await this.loadTestData(providerId);
    const results = [];

    for (const testCase of testData) {
      results.push(await this.validateTransformation(mappings, testCase.input, testCase.expected));
    }

    return {
      provider: providerId,
      totalTests: testData.length,
      passed: results.filter((r) => r.valid).length,
      failed: results.filter((r) => !r.valid).length,
      results,
    };
  }

  async validateTransformation(mappings, input, expected) {
    const transformed = await this.transform(mappings, input);
    const validation = this.deepCompare(transformed, expected);

    return {
      input: input,
      expected: expected,
      actual: transformed,
      valid: validation.isEqual,
      differences: validation.differences,
    };
  }

  transform(mappings, data) {
    const result = {};

    for (const [targetPath, sourceConfig] of Object.entries(mappings)) {
      let value;

      if (typeof sourceConfig === 'string') {
        // Simple path mapping
        value = this.getValueByPath(data, sourceConfig);
      } else {
        // Complex mapping with transformation
        value = this.getValueByPath(data, sourceConfig.path);

        if (sourceConfig.transform) {
          value = this.applyTransformation(value, sourceConfig.transform);
        }

        if (sourceConfig.default && value === undefined) {
          value = sourceConfig.default;
        }
      }

      this.setValueByPath(result, targetPath, value);
    }

    return result;
  }

  applyTransformation(value, transform) {
    switch (transform) {
      case 'convertCurrency':
        return this.convertCurrency(value);
      case 'normalizeDate':
        return this.normalizeDate(value);
      case 'cleanHtml':
        return this.cleanHtml(value);
      case 'mapStatus':
        return this.mapStatus(value);
      default:
        if (typeof transform === 'object') {
          // Value mapping
          return transform[value] || value;
        }
        return value;
    }
  }
}
```

## 6. Error Recovery Validation

### 6.1 Retry Logic Validation

```javascript
class RetryLogicValidator {
  async validateRetryStrategies() {
    const strategies = ['exponential', 'linear', 'fibonacci'];
    const results = [];

    for (const strategy of strategies) {
      results.push(await this.validateStrategy(strategy));
    }

    return {
      strategies: results,
      valid: results.every((r) => r.valid),
    };
  }

  async validateStrategy(strategy) {
    const config = this.getStrategyConfig(strategy);
    const attempts = [];
    let attempt = 0;

    while (attempt < config.maxAttempts) {
      const start = Date.now();

      try {
        await this.makeFailingRequest();
      } catch (error) {
        const delay = Date.now() - start;
        attempts.push({
          attempt: attempt + 1,
          delay,
          expectedDelay: this.calculateExpectedDelay(strategy, attempt, config),
        });
      }

      attempt++;
    }

    // Validate delays match strategy
    const valid = attempts.every((a) => {
      const tolerance = 100; // 100ms tolerance
      return Math.abs(a.delay - a.expectedDelay) < tolerance;
    });

    return {
      strategy,
      attempts,
      valid,
    };
  }

  calculateExpectedDelay(strategy, attempt, config) {
    switch (strategy) {
      case 'exponential':
        return Math.min(
          config.initialDelay * Math.pow(config.multiplier, attempt),
          config.maxDelay,
        );
      case 'linear':
        return Math.min(config.initialDelay + config.increment * attempt, config.maxDelay);
      case 'fibonacci':
        return Math.min(this.fibonacci(attempt) * config.baseDelay, config.maxDelay);
      default:
        return config.initialDelay;
    }
  }
}
```

## 7. Monitoring Integration

### 7.1 Metrics Export Validation

```javascript
class APIMetricsValidator {
  async validateMetricsExport() {
    const requiredMetrics = [
      'external_api_request_duration_seconds',
      'external_api_request_total',
      'external_api_errors_total',
      'circuit_breaker_state',
      'rate_limit_remaining',
      'cache_hit_ratio',
    ];

    const exportedMetrics = await this.getExportedMetrics();
    const results = [];

    for (const metric of requiredMetrics) {
      const found = exportedMetrics.find((m) => m.name === metric);
      results.push({
        metric,
        exported: !!found,
        labels: found ? found.labels : [],
        type: found ? found.type : null,
      });
    }

    return {
      required: requiredMetrics.length,
      found: results.filter((r) => r.exported).length,
      missing: results.filter((r) => !r.exported).map((r) => r.metric),
      results,
    };
  }
}
```

## 8. Compliance Validation

### 8.1 SLA Compliance Checks

```javascript
class SLAComplianceValidator {
  async validateSLACompliance(providerId) {
    const sla = await this.loadSLA(providerId);
    const metrics = await this.getProviderMetrics(providerId, '24h');

    const compliance = {
      availability: this.checkAvailability(metrics, sla.availability),
      responseTime: this.checkResponseTime(metrics, sla.responseTime),
      errorRate: this.checkErrorRate(metrics, sla.errorRate),
      throughput: this.checkThroughput(metrics, sla.throughput),
    };

    return {
      provider: providerId,
      period: '24h',
      sla,
      metrics,
      compliance,
      compliant: Object.values(compliance).every((c) => c.met),
    };
  }

  checkAvailability(metrics, target) {
    const uptime = (metrics.successfulRequests / metrics.totalRequests) * 100;
    return {
      target: target,
      actual: uptime.toFixed(2),
      met: uptime >= target,
    };
  }

  checkResponseTime(metrics, target) {
    return {
      target: target.p95,
      actual: metrics.p95ResponseTime,
      met: metrics.p95ResponseTime <= target.p95,
    };
  }
}
```

## 9. Integration Test Orchestration

### 9.1 Full Integration Test Suite

```javascript
#!/usr/bin/env node

class ExternalAPITestOrchestrator {
  async runFullValidation() {
    const providers = await this.loadProviders();
    const results = {};

    for (const provider of providers) {
      console.log(`\nValidating provider: ${provider.id}`);

      results[provider.id] = {
        configuration: await this.validateConfiguration(provider),
        connectivity: await this.validateConnectivity(provider),
        authentication: await this.validateAuthentication(provider),
        rateLimiting: await this.validateRateLimiting(provider),
        circuitBreaker: await this.validateCircuitBreaker(provider),
        dataTransformation: await this.validateDataTransformation(provider),
        caching: await this.validateCaching(provider),
        monitoring: await this.validateMonitoring(provider),
        sla: await this.validateSLA(provider),
      };
    }

    return this.generateReport(results);
  }

  generateReport(results) {
    const summary = {
      totalProviders: Object.keys(results).length,
      healthy: 0,
      degraded: 0,
      failed: 0,
      providers: [],
    };

    for (const [providerId, tests] of Object.entries(results)) {
      const failedTests = Object.values(tests).filter((t) => !t.valid).length;
      const status = failedTests === 0 ? 'healthy' : failedTests <= 2 ? 'degraded' : 'failed';

      summary[status]++;
      summary.providers.push({
        id: providerId,
        status,
        failedTests,
        details: tests,
      });
    }

    return summary;
  }
}

// Run validation
if (require.main === module) {
  const orchestrator = new ExternalAPITestOrchestrator();
  orchestrator
    .runFullValidation()
    .then((report) => {
      console.log('\n📊 Validation Report:');
      console.log(JSON.stringify(report, null, 2));
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}
```

## Best Practices

### External API Integration

1. **Always use circuit breakers** to prevent cascade failures
2. **Implement proper retry logic** with exponential backoff
3. **Cache responses** to reduce API calls and improve performance
4. **Monitor SLA compliance** continuously
5. **Have fallback strategies** for critical operations

### Rate Limiting

1. **Use sliding windows** for smoother rate limiting
2. **Implement tiered limits** based on user plans
3. **Return proper headers** for client-side handling
4. **Log violations** for abuse detection
5. **Provide grace periods** for burst traffic

### Data Transformation

1. **Version your mappings** to handle API changes
2. **Validate transformed data** against schemas
3. **Handle missing fields** gracefully with defaults
4. **Log transformation errors** for debugging
5. **Test with real data** from providers

### Monitoring

1. **Export metrics** for all external API calls
2. **Track success rates** per provider
3. **Monitor response times** at percentiles
4. **Alert on SLA violations** immediately
5. **Maintain historical data** for trend analysis
