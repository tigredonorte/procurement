# Epic D — Asynchronous Worker Service & External API Integration

[← Back to Tasks Overview](./readme.md)

---

## Goal Statement
Implement a robust, scalable asynchronous worker service using BullMQ that processes research requests by integrating with external APIs, performing intelligent data normalization, and maintaining comprehensive error handling with retry mechanisms, ensuring reliable delivery of high-quality research results.

## Success Criteria
- High-throughput job processing with configurable concurrency
- Reliable external API integration with comprehensive error handling
- Consistent data normalization producing standardized product information
- Intelligent retry mechanisms with exponential backoff
- Comprehensive audit logging for debugging and compliance
- Performance targets: Process 1000+ jobs/hour, <5% failure rate, <30s average processing time

## Technical Requirements

### Worker Architecture
- **Queue System**: BullMQ with Redis backend
- **Concurrency**: Configurable worker pools with scaling capabilities
- **Job Processing**: Stateless workers with comprehensive error handling
- **Monitoring**: Detailed metrics, logging, and health checks
- **External APIs**: Circuit breaker patterns, rate limiting compliance
- **Data Processing**: Streaming capabilities for large datasets

### External API Integration Standards
- **Primary Integration**: SerpAPI for initial MVP
- **Extensible Architecture**: Plugin system for additional API integrations
- **Security**: Secure credential management via Doppler
- **Reliability**: Circuit breakers, timeouts, retry mechanisms
- **Rate Limiting**: Compliance with API provider limits
- **Cost Optimization**: Request optimization and caching strategies

## Tasks

### D1. BullMQ Worker Service Foundation
**Priority**: Critical | **Effort**: L | **Dependencies**: A2, A3, C1

**Scope:**
- Implement comprehensive BullMQ worker service with advanced job processing
- Create scalable worker architecture with configurable concurrency
- Implement complete job lifecycle management with status tracking
- Set up comprehensive logging, monitoring, and health checks
- Create job prioritization and queue management systems

**Technical Implementation:**

**Worker Service Architecture:**
```typescript
class ResearchWorkerService {
  private worker: Worker;
  private queue: Queue;
  private logger: Logger;
  private metrics: MetricsService;
  private healthChecker: HealthCheckService;

  constructor(
    private apiIntegrationService: APIIntegrationService,
    private normalizationService: NormalizationService,
    private notificationService: NotificationService
  ) {}

  async processJob(job: Job<ResearchJobData>): Promise<void> {
    const { researchId, userId, query, parameters } = job.data;
    
    try {
      // 1. Update status to processing
      await this.updateResearchStatus(researchId, 'processing', 0);
      
      // 2. Fetch data from external APIs
      const rawData = await this.fetchExternalData(query, parameters);
      
      // 3. Normalize the data
      const normalizedData = await this.normalizeData(rawData);
      
      // 4. Store results and update status
      await this.storeResults(researchId, normalizedData, rawData);
      
      // 5. Send notifications
      await this.sendNotifications(researchId, userId, 'completed');
      
    } catch (error) {
      await this.handleJobError(researchId, error);
      throw error;
    }
  }
}
```

**Job Configuration & Management:**
```typescript
interface ResearchJobData {
  researchId: string;
  userId: string;
  query: ResearchQuery;
  parameters: ResearchParameters;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata: {
    submittedAt: Date;
    estimatedDuration: number;
    retryCount: number;
  };
}

const jobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000,
  },
  removeOnComplete: 10,
  removeOnFail: 50,
  delay: 0, // immediate processing
};
```

**Worker Pool Configuration:**
```typescript
const workerConfig = {
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
  maxStalledCount: 3,
  stalledInterval: 30 * 1000,
  maxMemoryUsage: parseInt(process.env.MAX_MEMORY_USAGE || '500') * 1024 * 1024,
  autorun: true,
};
```

**Status Lifecycle Management:**
- **queued**: Job added to queue, waiting for processing
- **processing**: Worker actively processing the request
- **completed**: Successfully processed with results
- **failed**: Processing failed after all retries
- **cancelled**: User cancelled the request
- **stalled**: Job stalled and being retried

**Health Check Implementation:**
```typescript
class WorkerHealthCheck {
  async checkHealth(): Promise<HealthStatus> {
    return {
      redis: await this.checkRedisConnection(),
      database: await this.checkDatabaseConnection(),
      externalApis: await this.checkExternalAPIHealth(),
      memoryUsage: process.memoryUsage(),
      activeJobs: await this.getActiveJobCount(),
      queueHealth: await this.checkQueueHealth(),
    };
  }
}
```

**Acceptance Criteria:**
- [ ] Worker processes jobs reliably with configurable concurrency
- [ ] Complete job lifecycle tracking from queued to completed/failed
- [ ] Health checks provide comprehensive service status
- [ ] Job prioritization works correctly
- [ ] Memory usage stays within configured limits
- [ ] Worker auto-recovery from Redis connection failures
- [ ] Comprehensive logging for all job processing events
- [ ] Metrics collection for performance monitoring

**Files Created:**
- `packages/worker/src/services/WorkerService.ts`
- `packages/worker/src/processors/ResearchJobProcessor.ts`
- `packages/worker/src/health/HealthCheckService.ts`
- `packages/worker/src/monitoring/MetricsService.ts`
- `packages/worker/src/config/worker.config.ts`

---

### D2. Advanced External API Integration Framework
**Priority**: Critical | **Effort**: L | **Dependencies**: D1, A3

**Scope:**
- Implement comprehensive SerpAPI integration with advanced features
- Create extensible API integration framework for future providers
- Implement circuit breaker patterns and intelligent retry mechanisms
- Set up rate limiting compliance and cost optimization
- Create comprehensive error handling and logging systems

**Technical Implementation:**

**API Integration Service Architecture:**
```typescript
abstract class APIIntegrationProvider {
  abstract name: string;
  abstract rateLimit: RateLimitConfig;
  abstract authenticate(): Promise<void>;
  abstract search(query: SearchQuery): Promise<RawAPIResponse>;
  abstract validateResponse(response: any): boolean;
  abstract transformQuery(query: ResearchQuery): SearchQuery;
}

class SerpAPIProvider extends APIIntegrationProvider {
  name = 'serpapi';
  rateLimit = { requests: 100, window: 60000 }; // 100 req/min
  
  private circuitBreaker: CircuitBreaker;
  private rateLimiter: RateLimiter;
  private client: AxiosInstance;

  constructor() {
    super();
    this.setupCircuitBreaker();
    this.setupRateLimiter();
    this.setupHttpClient();
  }

  async search(query: SearchQuery): Promise<RawAPIResponse> {
    return this.circuitBreaker.execute(async () => {
      await this.rateLimiter.acquire();
      
      const response = await this.client.get('/search', {
        params: {
          engine: 'google_shopping',
          q: query.text,
          api_key: await this.getApiKey(),
          num: query.maxResults,
          ...this.buildSearchParams(query)
        },
        timeout: 30000,
      });
      
      this.validateResponse(response.data);
      return response.data;
    });
  }

  private setupCircuitBreaker() {
    this.circuitBreaker = new CircuitBreaker({
      threshold: 5,
      timeout: 60000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    });
  }
}
```

**Advanced Query Transformation:**
```typescript
class QueryTransformationService {
  transformForSerpAPI(researchQuery: ResearchQuery): SerpAPIQuery {
    return {
      q: this.buildSearchString(researchQuery),
      engine: 'google_shopping',
      num: researchQuery.parameters.maxResults,
      tbm: 'shop',
      location: researchQuery.filters?.location,
      price_min: researchQuery.filters?.priceRange?.min,
      price_max: researchQuery.filters?.priceRange?.max,
      sort: this.mapSortOrder(researchQuery.parameters.sortBy),
      safe: 'active',
    };
  }

  private buildSearchString(query: ResearchQuery): string {
    let searchString = query.text;
    
    if (query.categories?.length) {
      searchString += ` ${query.categories.join(' OR ')}`;
    }
    
    if (query.filters?.suppliers?.length) {
      const suppliers = query.filters.suppliers.join(' OR ');
      searchString += ` (${suppliers})`;
    }
    
    return searchString.trim();
  }
}
```

**Comprehensive Error Handling:**
```typescript
class APIErrorHandler {
  handleError(error: any, provider: string, attempt: number): APIError {
    if (error.response) {
      // HTTP error responses
      switch (error.response.status) {
        case 401:
          return new APIAuthError(provider, 'Invalid API credentials');
        case 429:
          return new APIRateLimitError(provider, error.response.headers['retry-after']);
        case 503:
          return new APIServiceUnavailableError(provider, 'Service temporarily unavailable');
        default:
          return new APIHTTPError(provider, error.response.status, error.response.data);
      }
    } else if (error.code === 'ETIMEDOUT') {
      return new APITimeoutError(provider, 'Request timeout');
    } else {
      return new APIConnectionError(provider, error.message);
    }
  }

  shouldRetry(error: APIError, attempt: number, maxAttempts: number): boolean {
    if (attempt >= maxAttempts) return false;
    
    return (
      error instanceof APITimeoutError ||
      error instanceof APIConnectionError ||
      (error instanceof APIRateLimitError && error.retryAfter < 300) ||
      (error instanceof APIHTTPError && [502, 503, 504].includes(error.statusCode))
    );
  }

  calculateRetryDelay(attempt: number, error: APIError): number {
    if (error instanceof APIRateLimitError && error.retryAfter) {
      return error.retryAfter * 1000;
    }
    
    // Exponential backoff with jitter
    const baseDelay = Math.pow(2, attempt) * 1000;
    const jitter = Math.random() * 0.1 * baseDelay;
    return Math.min(baseDelay + jitter, 60000); // Max 60s delay
  }
}
```

**Cost Optimization Features:**
- **Request Deduplication**: Cache identical queries for short periods
- **Parameter Optimization**: Reduce unnecessary API parameters
- **Result Caching**: Store results for common queries
- **Batch Processing**: Combine similar requests where possible
- **Usage Monitoring**: Track API costs and usage patterns

**Acceptance Criteria:**
- [ ] SerpAPI integration works reliably with comprehensive error handling
- [ ] Circuit breaker prevents cascade failures
- [ ] Rate limiting respects API provider limits
- [ ] Retry mechanisms handle transient failures effectively
- [ ] API costs are optimized through caching and deduplication
- [ ] All API interactions logged with correlation IDs
- [ ] External API health monitoring works correctly
- [ ] Response validation prevents processing invalid data

**Files Created:**
- `packages/worker/src/api/providers/SerpAPIProvider.ts`
- `packages/worker/src/api/APIIntegrationService.ts`
- `packages/worker/src/api/CircuitBreaker.ts`
- `packages/worker/src/api/RateLimiter.ts`
- `packages/worker/src/api/ErrorHandler.ts`
- `packages/worker/src/api/QueryTransformation.ts`

---

### D3. Intelligent Data Normalization Engine
**Priority**: Critical | **Effort**: M | **Dependencies**: D2

**Scope:**
- Implement comprehensive data normalization for product information
- Create intelligent field extraction with multiple fallback strategies
- Implement data quality scoring and validation
- Set up price normalization and currency conversion
- Create supplier deduplication and standardization
- Implement image processing and validation

**Technical Implementation:**

**Normalization Service Architecture:**
```typescript
class DataNormalizationService {
  constructor(
    private fieldExtractors: Map<string, FieldExtractor>,
    private currencyService: CurrencyService,
    private imageProcessor: ImageProcessor,
    private qualityAssessor: QualityAssessor,
    private supplierNormalizer: SupplierNormalizer
  ) {}

  async normalizeProducts(rawData: RawAPIResponse): Promise<NormalizedProduct[]> {
    const rawProducts = this.extractRawProducts(rawData);
    const normalizedProducts: NormalizedProduct[] = [];

    for (const rawProduct of rawProducts) {
      try {
        const normalized = await this.normalizeProduct(rawProduct);
        const quality = await this.qualityAssessor.assess(normalized);
        
        if (quality.score >= 0.7) { // Minimum quality threshold
          normalizedProducts.push({ ...normalized, qualityScore: quality.score });
        }
      } catch (error) {
        this.logger.warn('Product normalization failed', { rawProduct, error });
      }
    }

    return this.deduplicateProducts(normalizedProducts);
  }

  private async normalizeProduct(raw: any): Promise<NormalizedProduct> {
    return {
      id: this.generateProductId(raw),
      title: await this.extractTitle(raw),
      description: await this.extractDescription(raw),
      priceUnit: await this.extractAndNormalizePrice(raw),
      currency: await this.extractCurrency(raw),
      availability: await this.extractAvailability(raw),
      supplier: await this.normalizeSupplier(raw),
      images: await this.processImages(raw),
      specifications: await this.extractSpecifications(raw),
      url: await this.extractSourceURL(raw),
      lastUpdated: new Date(),
    };
  }
}
```

**Advanced Field Extraction:**
```typescript
class FieldExtractor {
  async extractTitle(raw: any): Promise<string> {
    // Multiple extraction strategies with fallbacks
    const strategies = [
      () => raw.title,
      () => raw.product?.title,
      () => raw.snippet?.title,
      () => this.extractFromHTML(raw.html, 'title'),
      () => this.extractFromMetadata(raw, 'title'),
    ];

    for (const strategy of strategies) {
      try {
        const title = strategy();
        if (this.isValidTitle(title)) {
          return this.cleanTitle(title);
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error('Could not extract valid title');
  }

  private isValidTitle(title: any): boolean {
    return typeof title === 'string' && 
           title.length >= 3 && 
           title.length <= 200 &&
           !this.containsSpam(title);
  }

  private cleanTitle(title: string): string {
    return title
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .substring(0, 200);
  }
}
```

**Price Normalization & Currency Conversion:**
```typescript
class PriceNormalizationService {
  private currencyRates: Map<string, number> = new Map();

  async extractAndNormalizePrice(raw: any): Promise<number> {
    const priceData = this.extractPriceData(raw);
    
    if (!priceData) {
      throw new Error('No price data found');
    }

    const basePrice = this.parsePrice(priceData.price);
    const currency = this.normalizeCurrency(priceData.currency);
    
    // Convert to USD for standardization
    if (currency !== 'USD') {
      const rate = await this.getCurrencyRate(currency, 'USD');
      return Math.round(basePrice * rate * 100) / 100;
    }
    
    return basePrice;
  }

  private parsePrice(priceString: string): number {
    const cleaned = priceString
      .replace(/[^\d.,]/g, '')
      .replace(',', '.');
    
    const price = parseFloat(cleaned);
    
    if (isNaN(price) || price <= 0) {
      throw new Error(`Invalid price: ${priceString}`);
    }
    
    return price;
  }

  private normalizeCurrency(currency: string): string {
    const currencyMap: Record<string, string> = {
      '$': 'USD',
      '€': 'EUR',
      '£': 'GBP',
      '¥': 'JPY',
      // Add more currency mappings
    };
    
    return currencyMap[currency] || currency.toUpperCase();
  }
}
```

**Supplier Standardization:**
```typescript
class SupplierNormalizer {
  private supplierAliases: Map<string, string> = new Map();
  private verifiedSuppliers: Set<string> = new Set();

  async normalizeSupplier(raw: any): Promise<NormalizedSupplier> {
    const rawSupplier = this.extractSupplierData(raw);
    const normalizedName = this.normalizeSupplierName(rawSupplier.name);
    
    return {
      name: normalizedName,
      id: this.generateSupplierId(normalizedName),
      rating: await this.extractSupplierRating(raw),
      verified: this.verifiedSuppliers.has(normalizedName),
      url: this.extractSupplierURL(raw),
    };
  }

  private normalizeSupplierName(name: string): string {
    const cleaned = name.trim().toLowerCase();
    
    // Check for known aliases
    if (this.supplierAliases.has(cleaned)) {
      return this.supplierAliases.get(cleaned)!;
    }
    
    // Apply normalization rules
    return this.applyNormalizationRules(name);
  }
}
```

**Image Processing & Validation:**
```typescript
class ImageProcessor {
  async processImages(raw: any): Promise<string[]> {
    const rawImages = this.extractImageURLs(raw);
    const processedImages: string[] = [];
    
    for (const imageUrl of rawImages) {
      try {
        if (await this.validateImage(imageUrl)) {
          const optimizedUrl = await this.optimizeImage(imageUrl);
          processedImages.push(optimizedUrl);
        }
      } catch (error) {
        this.logger.warn('Image processing failed', { imageUrl, error });
      }
    }
    
    return processedImages.slice(0, 5); // Limit to 5 images
  }

  private async validateImage(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      
      return (
        response.ok &&
        contentType?.startsWith('image/') &&
        contentLength > 1000 && // Minimum size
        contentLength < 10 * 1024 * 1024 // Maximum 10MB
      );
    } catch {
      return false;
    }
  }
}
```

**Data Quality Assessment:**
```typescript
class QualityAssessor {
  async assess(product: NormalizedProduct): Promise<QualityScore> {
    const scores = {
      titleQuality: this.assessTitleQuality(product.title),
      priceQuality: this.assessPriceQuality(product.priceUnit, product.currency),
      supplierQuality: this.assessSupplierQuality(product.supplier),
      imageQuality: this.assessImageQuality(product.images),
      completeness: this.assessCompleteness(product),
    };
    
    const weights = {
      titleQuality: 0.25,
      priceQuality: 0.25,
      supplierQuality: 0.20,
      imageQuality: 0.15,
      completeness: 0.15,
    };
    
    const overallScore = Object.entries(scores)
      .reduce((sum, [key, score]) => sum + score * weights[key], 0);
    
    return {
      score: overallScore,
      breakdown: scores,
      recommendations: this.generateRecommendations(scores),
    };
  }
}
```

**Acceptance Criteria:**
- [ ] 7 core product fields extracted consistently (95%+ success rate)
- [ ] Price normalization handles multiple currencies and formats
- [ ] Supplier deduplication reduces duplicate entries by 80%+
- [ ] Image validation prevents broken/invalid images
- [ ] Quality scoring identifies high-quality products (70%+ score)
- [ ] Data normalization handles edge cases gracefully
- [ ] Processing speed: <5 seconds per 100 products
- [ ] Normalized data passes validation schemas

**Files Created:**
- `packages/worker/src/normalization/DataNormalizationService.ts`
- `packages/worker/src/normalization/FieldExtractor.ts`
- `packages/worker/src/normalization/PriceNormalizer.ts`
- `packages/worker/src/normalization/SupplierNormalizer.ts`
- `packages/worker/src/normalization/ImageProcessor.ts`
- `packages/worker/src/normalization/QualityAssessor.ts`

---

### D4. Comprehensive Error Handling & Audit System
**Priority**: High | **Effort**: M | **Dependencies**: D1, D2, D3

**Scope:**
- Implement comprehensive error handling with categorization and recovery strategies
- Create detailed audit logging for compliance and debugging
- Set up error analytics and alerting systems
- Implement job failure analysis and automatic recovery
- Create comprehensive debugging tools and data preservation

**Technical Implementation:**

**Error Handling Framework:**
```typescript
enum ErrorCategory {
  EXTERNAL_API = 'external_api',
  DATA_NORMALIZATION = 'data_normalization',
  DATABASE = 'database',
  NETWORK = 'network',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
}

enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

class WorkerError extends Error {
  constructor(
    public category: ErrorCategory,
    public severity: ErrorSeverity,
    public code: string,
    message: string,
    public context?: any,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'WorkerError';
  }
}

class ErrorHandler {
  private errorStrategies: Map<ErrorCategory, ErrorRecoveryStrategy>;
  private alertManager: AlertManager;
  private auditLogger: AuditLogger;

  async handleError(error: WorkerError, jobData: ResearchJobData): Promise<ErrorHandlingResult> {
    // Log the error with full context
    await this.auditLogger.logError(error, jobData);
    
    // Determine recovery strategy
    const strategy = this.errorStrategies.get(error.category);
    const result = await strategy?.execute(error, jobData) || { action: 'fail', delay: 0 };
    
    // Send alerts for critical errors
    if (error.severity === ErrorSeverity.CRITICAL) {
      await this.alertManager.sendAlert(error, jobData);
    }
    
    // Update error analytics
    await this.updateErrorMetrics(error, jobData);
    
    return result;
  }
}
```

**Detailed Audit Logging:**
```typescript
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  jobId: string;
  researchId: string;
  userId: string;
  event: 'job_started' | 'job_completed' | 'job_failed' | 'api_call' | 'data_normalized';
  category: string;
  severity: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  context: {
    duration?: number;
    memoryUsage?: NodeJS.MemoryUsage;
    apiProvider?: string;
    errorCode?: string;
    retryCount?: number;
    rawDataSize?: number;
    normalizedProductCount?: number;
  };
  metadata: {
    workerVersion: string;
    nodeVersion: string;
    environment: string;
    hostname: string;
  };
}

class AuditLogger {
  async logJobStart(jobData: ResearchJobData): Promise<void> {
    await this.log({
      event: 'job_started',
      severity: 'info',
      message: `Research job started for query: ${jobData.query.text}`,
      context: {
        memoryUsage: process.memoryUsage(),
      },
      ...this.extractCommonFields(jobData),
    });
  }

  async logAPICall(provider: string, duration: number, success: boolean): Promise<void> {
    await this.log({
      event: 'api_call',
      severity: success ? 'info' : 'warn',
      message: `API call to ${provider} ${success ? 'succeeded' : 'failed'}`,
      context: {
        apiProvider: provider,
        duration,
      },
    });
  }

  async logDataNormalization(productCount: number, qualityScores: number[]): Promise<void> {
    const avgQuality = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
    
    await this.log({
      event: 'data_normalized',
      severity: 'info',
      message: `Normalized ${productCount} products with avg quality ${avgQuality.toFixed(2)}`,
      context: {
        normalizedProductCount: productCount,
        avgQualityScore: avgQuality,
      },
    });
  }
}
```

**Error Recovery Strategies:**
```typescript
abstract class ErrorRecoveryStrategy {
  abstract execute(error: WorkerError, jobData: ResearchJobData): Promise<ErrorHandlingResult>;
}

class ExternalAPIErrorStrategy extends ErrorRecoveryStrategy {
  async execute(error: WorkerError, jobData: ResearchJobData): Promise<ErrorHandlingResult> {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      return {
        action: 'retry',
        delay: this.calculateRateLimitDelay(error.context.retryAfter),
        message: 'Rate limit exceeded, retrying after delay',
      };
    }
    
    if (error.code === 'SERVICE_UNAVAILABLE') {
      return {
        action: 'retry',
        delay: Math.min(Math.pow(2, jobData.metadata.retryCount) * 1000, 300000), // Max 5 min
        message: 'Service unavailable, using exponential backoff',
      };
    }
    
    if (error.code === 'INVALID_API_KEY') {
      return {
        action: 'fail',
        delay: 0,
        message: 'Invalid API credentials, manual intervention required',
      };
    }
    
    return { action: 'retry', delay: 30000 }; // Default 30s retry
  }
}

class DataNormalizationErrorStrategy extends ErrorRecoveryStrategy {
  async execute(error: WorkerError, jobData: ResearchJobData): Promise<ErrorHandlingResult> {
    if (error.code === 'INSUFFICIENT_DATA_QUALITY') {
      // Try with relaxed quality thresholds
      return {
        action: 'retry',
        delay: 1000,
        message: 'Retrying with relaxed quality thresholds',
        modifiedParameters: { qualityThreshold: 0.5 },
      };
    }
    
    if (error.code === 'NO_VALID_PRODUCTS') {
      // Mark as completed but with warnings
      return {
        action: 'complete_with_warning',
        delay: 0,
        message: 'No valid products found after normalization',
      };
    }
    
    return { action: 'fail', delay: 0 };
  }
}
```

**Raw Data Preservation & Debugging:**
```typescript
class RawDataManager {
  async preserveRawData(
    researchId: string,
    provider: string,
    rawData: any,
    normalizedData?: NormalizedProduct[]
  ): Promise<void> {
    const preservationRecord = {
      researchId,
      provider,
      timestamp: new Date(),
      rawData: this.sanitizeRawData(rawData),
      normalizedData,
      metadata: {
        rawDataSize: JSON.stringify(rawData).length,
        normalizedCount: normalizedData?.length || 0,
        processingVersion: process.env.WORKER_VERSION,
      },
    };
    
    // Store in separate collection for debugging
    await this.rawDataCollection.insertOne(preservationRecord);
    
    // Set TTL for automatic cleanup (30 days)
    await this.rawDataCollection.createIndex(
      { timestamp: 1 },
      { expireAfterSeconds: 30 * 24 * 60 * 60 }
    );
  }

  private sanitizeRawData(rawData: any): any {
    // Remove sensitive information while preserving structure
    return this.deepClone(rawData, (key, value) => {
      if (typeof key === 'string' && this.isSensitiveField(key)) {
        return '[REDACTED]';
      }
      return value;
    });
  }
}
```

**Error Analytics & Monitoring:**
```typescript
class ErrorAnalytics {
  async generateErrorReport(timeRange: { start: Date; end: Date }): Promise<ErrorReport> {
    const errors = await this.getErrorsInRange(timeRange);
    
    return {
      totalErrors: errors.length,
      errorsByCategory: this.groupBy(errors, 'category'),
      errorsBySeverity: this.groupBy(errors, 'severity'),
      topErrorCodes: this.getTopErrorCodes(errors, 10),
      errorTrends: this.calculateErrorTrends(errors),
      recoveryRates: this.calculateRecoveryRates(errors),
      recommendations: this.generateRecommendations(errors),
    };
  }

  private calculateRecoveryRates(errors: AuditLogEntry[]): RecoveryRateAnalysis {
    const attempts = new Map<string, { total: number; successful: number }>();
    
    errors.forEach(error => {
      const key = `${error.researchId}_${error.context.errorCode}`;
      const stats = attempts.get(key) || { total: 0, successful: 0 };
      
      stats.total++;
      if (error.context.recovered) {
        stats.successful++;
      }
      
      attempts.set(key, stats);
    });
    
    return {
      overallRecoveryRate: this.calculateOverallRate(attempts),
      byErrorCode: this.calculateRatesByCode(attempts),
      byCategory: this.calculateRatesByCategory(attempts),
    };
  }
}
```

**Acceptance Criteria:**
- [ ] All errors categorized and handled with appropriate strategies
- [ ] Comprehensive audit logs capture complete job lifecycle
- [ ] Raw data preserved for debugging and compliance (30-day retention)
- [ ] Error recovery strategies reduce failure rate by 60%+
- [ ] Critical errors trigger immediate alerts
- [ ] Error analytics provide actionable insights
- [ ] Debugging tools help identify root causes quickly
- [ ] Job failure analysis prevents recurring issues

**Files Created:**
- `packages/worker/src/errors/ErrorHandler.ts`
- `packages/worker/src/audit/AuditLogger.ts`
- `packages/worker/src/recovery/RecoveryStrategies.ts`
- `packages/worker/src/debug/RawDataManager.ts`
- `packages/worker/src/analytics/ErrorAnalytics.ts`
- `packages/worker/src/monitoring/AlertManager.ts`

---

## Performance & Scalability

### Processing Performance
- **Throughput Target**: 1000+ jobs per hour with 5 concurrent workers
- **Memory Efficiency**: <500MB average memory usage per worker
- **Processing Time**: <30 seconds average per research request
- **Success Rate**: >95% job completion rate

### Scalability Features
- **Horizontal Scaling**: Support for multiple worker instances
- **Dynamic Scaling**: Auto-scaling based on queue depth
- **Load Balancing**: Even distribution of work across workers
- **Resource Monitoring**: Memory and CPU usage tracking

## Dependencies & Integration

**Depends On:**
- Epic A: Containerized infrastructure and secrets management
- Epic C: Research request data models and job queue
- Redis for BullMQ job processing
- MongoDB for data persistence
- External APIs (SerpAPI) with valid credentials

**Enables:**
- Epic E: Webhook notifications triggered by job completion
- Epic G: Monitoring and observability for worker operations
- Epic H: Security controls for external API interactions
- Complete research workflow from request to results

## Risk Mitigation

- **External API Reliability**: Circuit breakers and fallback strategies
- **Data Quality**: Multiple validation layers and quality scoring
- **Performance**: Memory management and resource monitoring
- **Error Handling**: Comprehensive retry mechanisms and recovery strategies
- **Scalability**: Horizontal scaling capabilities and load testing

## Definition of Done

**Functional Validation:**
- [ ] Workers process research requests end-to-end successfully
- [ ] External API integration handles all common error scenarios
- [ ] Data normalization produces consistent, high-quality results
- [ ] Error handling and recovery mechanisms work reliably
- [ ] Job lifecycle tracking accurate from queued to completed

**Performance Validation:**
- [ ] Processing throughput meets target (1000+ jobs/hour)
- [ ] Average processing time <30 seconds per request
- [ ] Memory usage stays within limits (<500MB per worker)
- [ ] Success rate >95% for typical research queries
- [ ] External API rate limits respected and optimized

**Quality Validation:**
- [ ] Test coverage >90% for worker-related code
- [ ] All error scenarios properly handled and tested
- [ ] Data normalization accuracy >95% for core fields
- [ ] Audit logging captures complete operational context
- [ ] Raw data preservation enables effective debugging
- [ ] Integration tests cover complete job processing flow

---

**Navigation:** [← Epic C - Research Core](./03-epic-c-research-core.md) | [Epic E - Webhooks →](./05-epic-e-webhooks.md)