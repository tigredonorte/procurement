# Epic E — Comprehensive Webhook Notification System

[← Back to Tasks Overview](./Readme.md)

---

## Goal Statement
Implement a robust, enterprise-grade webhook notification system that enables real-time integration with external systems through secure, reliable, and fully auditable webhook deliveries with comprehensive retry mechanisms, signature verification, and advanced management capabilities.

## Success Criteria
- High-reliability webhook delivery with 99.9% success rate for reachable endpoints
- Secure webhook signatures using HMAC-SHA256 for payload verification
- Comprehensive retry mechanisms with intelligent backoff strategies
- Real-time delivery status tracking and detailed audit logging
- User-friendly management interface with testing and debugging tools
- Support for multiple event types with granular subscription control
- Performance targets: <2s delivery time, support for 10k+ webhooks per hour

## Technical Requirements

### Webhook System Architecture
- **Delivery Engine**: Asynchronous delivery with BullMQ job processing
- **Security**: HMAC-SHA256 signatures with rotating secrets
- **Reliability**: Exponential backoff retry with circuit breaker protection
- **Monitoring**: Comprehensive delivery analytics and health monitoring
- **Scalability**: Horizontal scaling support with load balancing
- **Compliance**: Complete audit trail for security and compliance requirements

### Event Types & Payload Standards
- **research.queued**: Research request submitted to processing queue
- **research.started**: Research processing has begun
- **research.progress**: Research processing progress updates (optional)
- **research.completed**: Research successfully completed with results
- **research.failed**: Research processing failed with error details
- **research.cancelled**: Research request cancelled by user
- **system.maintenance**: System maintenance notifications

## Tasks

### E1. Comprehensive Webhook Configuration System
**Priority**: High | **Effort**: L | **Dependencies**: B1, B2, C1

**Scope:**
- Implement complete webhook configuration data model with advanced features
- Create full CRUD API for webhook management with permission controls
- Set up webhook validation, testing, and health monitoring
- Implement webhook secret management with rotation capabilities
- Create webhook discovery and auto-configuration features

**Technical Implementation:**

**Enhanced Webhook Configuration Model:**
```typescript
interface WebhookConfig {
  _id: ObjectId;
  userId: ObjectId;
  name: string;  // User-friendly name
  description?: string;
  url: string;  // Webhook endpoint URL
  method: 'POST' | 'PUT' | 'PATCH';  // HTTP method
  headers: Record<string, string>;  // Custom headers
  authentication?: {
    type: 'bearer' | 'basic' | 'api_key' | 'custom';
    credentials: EncryptedCredentials;
  };
  events: WebhookEvent[];  // Subscribed events
  filters?: {
    researchCategories?: string[];
    urgencyLevels?: ('low' | 'medium' | 'high')[];
    statusChangesOnly?: boolean;
  };
  security: {
    secret: string;  // HMAC secret (encrypted)
    signatureVersion: 'v1' | 'v2';
    encryptPayload: boolean;
    allowedIPs?: string[];  // IP whitelist
  };
  delivery: {
    timeout: number;  // Request timeout in ms
    retryPolicy: {
      maxAttempts: number;
      initialDelay: number;
      maxDelay: number;
      multiplier: number;
      jitterRange: number;
    };
    batchDelivery: {
      enabled: boolean;
      maxBatchSize: number;
      maxWaitTime: number;
    };
  };
  status: {
    active: boolean;
    lastDelivery?: Date;
    lastSuccessfulDelivery?: Date;
    consecutiveFailures: number;
    totalDeliveries: number;
    successfulDeliveries: number;
    health: 'healthy' | 'degraded' | 'failing' | 'disabled';
  };
  monitoring: {
    enableHealthChecks: boolean;
    healthCheckInterval: number;
    alertThresholds: {
      failureRate: number;
      responseTime: number;
    };
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    tags: string[];
  };
}
```

**Webhook Event Definitions:**
```typescript
enum WebhookEvent {
  RESEARCH_QUEUED = 'research.queued',
  RESEARCH_STARTED = 'research.started', 
  RESEARCH_PROGRESS = 'research.progress',
  RESEARCH_COMPLETED = 'research.completed',
  RESEARCH_FAILED = 'research.failed',
  RESEARCH_CANCELLED = 'research.cancelled',
  SYSTEM_MAINTENANCE = 'system.maintenance',
}

interface WebhookEventMetadata {
  event: WebhookEvent;
  description: string;
  payloadSchema: object;
  rateLimit?: {
    maxPerMinute: number;
    burstLimit: number;
  };
  requiresAuth: boolean;
  deprecated?: {
    version: string;
    replacedBy?: WebhookEvent;
  };
}
```

**Comprehensive Webhook API Endpoints:**

**1. Create Webhook Configuration**
```
POST /api/v1/webhooks
Authentication: Required
Permissions: webhook.create

Request Body: WebhookCreateRequest
Features:
- URL validation and reachability testing
- Automatic secret generation
- Event subscription validation
- Duplicate detection

Response: 201 Created with webhook ID and test results
```

**2. Advanced Webhook Listing**
```
GET /api/v1/webhooks
Query Parameters:
- status: active|inactive|failing
- event: filter by subscribed events
- health: filter by health status
- tags: filter by metadata tags
- search: full-text search

Response: Paginated list with health metrics
```

**3. Webhook Testing & Validation**
```
POST /api/v1/webhooks/{id}/test
Features:
- Test payload delivery
- Endpoint reachability validation
- Response time measurement
- SSL certificate verification
- Custom test payloads

Response: Detailed test results with recommendations
```

**4. Webhook Health Monitoring**
```
GET /api/v1/webhooks/{id}/health
Response:
- Delivery success rate (24h, 7d, 30d)
- Average response time
- Error distribution
- Uptime percentage
- Recent delivery attempts
```

**Webhook Validation Service:**
```typescript
class WebhookValidationService {
  async validateWebhookConfig(config: WebhookCreateRequest): Promise<ValidationResult> {
    const results = await Promise.all([
      this.validateURL(config.url),
      this.testConnectivity(config.url, config.timeout),
      this.validateSSL(config.url),
      this.checkDNS(config.url),
      this.validateEvents(config.events),
      this.validateHeaders(config.headers),
    ]);
    
    return this.consolidateResults(results);
  }

  private async validateURL(url: string): Promise<ValidationCheck> {
    try {
      const parsed = new URL(url);
      
      // Security checks
      if (parsed.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
        return { valid: false, error: 'HTTPS required in production' };
      }
      
      if (this.isPrivateIP(parsed.hostname)) {
        return { valid: false, error: 'Private IP addresses not allowed' };
      }
      
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  private async testConnectivity(url: string, timeout: number): Promise<ValidationCheck> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        timeout,
        headers: { 'User-Agent': 'Requisio-Webhook-Validator/1.0' },
      });
      
      return {
        valid: response.status < 500,
        metadata: {
          statusCode: response.status,
          responseTime: response.headers.get('response-time'),
          server: response.headers.get('server'),
        }
      };
    } catch (error) {
      return { valid: false, error: 'Connectivity test failed', details: error.message };
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Complete webhook CRUD operations with validation
- [ ] URL validation includes security checks and reachability testing
- [ ] Event subscription system supports granular filtering
- [ ] Webhook testing provides comprehensive endpoint validation
- [ ] Health monitoring tracks delivery success rates and response times
- [ ] Secret management supports rotation without service interruption
- [ ] API performance meets targets (<100ms for CRUD operations)
- [ ] Comprehensive error handling with actionable feedback

**Files Created:**
- `packages/backend/src/models/WebhookConfig.model.ts`
- `packages/backend/src/controllers/webhook.controller.ts`
- `packages/backend/src/services/webhook-validation.service.ts`
- `packages/backend/src/routes/webhook.routes.ts`
- `packages/shared/src/types/webhook.types.ts`

---

### E2. Enterprise-Grade Webhook Delivery Engine
**Priority**: Critical | **Effort**: L | **Dependencies**: E1, D1

**Scope:**
- Implement robust webhook delivery system with BullMQ job processing
- Create intelligent retry mechanisms with circuit breaker protection
- Set up comprehensive signature generation and verification
- Implement batch delivery capabilities for high-volume scenarios
- Create detailed delivery logging and analytics system

**Technical Implementation:**

**Webhook Delivery Service:**
```typescript
class WebhookDeliveryService {
  constructor(
    private deliveryQueue: Queue<WebhookDeliveryJob>,
    private signatureService: WebhookSignatureService,
    private retryManager: WebhookRetryManager,
    private auditLogger: WebhookAuditLogger,
    private circuitBreaker: CircuitBreakerManager
  ) {}

  async deliverWebhook(payload: WebhookPayload, config: WebhookConfig): Promise<void> {
    const jobData: WebhookDeliveryJob = {
      id: uuidv4(),
      webhookId: config._id.toString(),
      payload,
      config: this.sanitizeConfig(config),
      attempt: 1,
      scheduledAt: new Date(),
      metadata: {
        correlationId: payload.correlationId,
        priority: this.calculatePriority(payload.event),
        batchable: this.isBatchableEvent(payload.event),
      },
    };

    // Add job to delivery queue with appropriate options
    await this.deliveryQueue.add(
      'deliver-webhook',
      jobData,
      {
        priority: jobData.metadata.priority,
        attempts: config.delivery.retryPolicy.maxAttempts,
        backoff: {
          type: 'exponential',
          delay: config.delivery.retryPolicy.initialDelay,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      }
    );

    await this.auditLogger.logWebhookQueued(jobData);
  }

  async processDelivery(job: Job<WebhookDeliveryJob>): Promise<void> {
    const { webhookId, payload, config } = job.data;
    const startTime = Date.now();

    try {
      // Check circuit breaker status
      if (!this.circuitBreaker.canExecute(webhookId)) {
        throw new WebhookError('CIRCUIT_BREAKER_OPEN', 'Circuit breaker is open');
      }

      // Generate signature
      const signature = await this.signatureService.generateSignature(
        payload,
        config.security.secret,
        config.security.signatureVersion
      );

      // Prepare request
      const requestConfig = this.buildRequestConfig(config, signature);
      const requestBody = config.security.encryptPayload 
        ? await this.encryptPayload(payload, config.security.secret)
        : JSON.stringify(payload);

      // Execute delivery
      const response = await this.executeDelivery(
        config.url,
        requestBody,
        requestConfig
      );

      // Record successful delivery
      const duration = Date.now() - startTime;
      await this.recordSuccess(webhookId, response, duration);
      await this.circuitBreaker.recordSuccess(webhookId);
      
      await this.auditLogger.logWebhookDelivered({
        ...job.data,
        response: this.sanitizeResponse(response),
        duration,
        success: true,
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      await this.recordFailure(webhookId, error, duration);
      await this.circuitBreaker.recordFailure(webhookId);
      
      await this.auditLogger.logWebhookFailed({
        ...job.data,
        error: this.sanitizeError(error),
        duration,
        success: false,
      });

      // Determine if retry should be attempted
      if (this.shouldRetry(error, job.attemptsMade, config)) {
        throw error; // Let BullMQ handle the retry
      }
    }
  }
}
```

**Advanced Signature Service:**
```typescript
class WebhookSignatureService {
  async generateSignature(
    payload: WebhookPayload,
    secret: string,
    version: 'v1' | 'v2'
  ): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000);
    const payloadString = JSON.stringify(payload);
    
    switch (version) {
      case 'v1':
        return this.generateV1Signature(payloadString, secret);
      case 'v2':
        return this.generateV2Signature(payloadString, secret, timestamp);
      default:
        throw new Error(`Unsupported signature version: ${version}`);
    }
  }

  private generateV2Signature(payload: string, secret: string, timestamp: number): string {
    const signedPayload = `${timestamp}.${payload}`;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');
    
    return `t=${timestamp},v2=${signature}`;
  }

  verifySignature(
    payload: string,
    signature: string,
    secret: string,
    tolerance: number = 300
  ): boolean {
    try {
      const elements = signature.split(',');
      const timestamp = parseInt(elements.find(e => e.startsWith('t='))?.substring(2) || '0');
      const sig = elements.find(e => e.startsWith('v2='))?.substring(3);
      
      if (!sig || !timestamp) return false;
      
      // Check timestamp tolerance (prevent replay attacks)
      if (Math.abs(Date.now() / 1000 - timestamp) > tolerance) {
        return false;
      }
      
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${timestamp}.${payload}`, 'utf8')
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(sig, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch {
      return false;
    }
  }
}
```

**Intelligent Retry Manager:**
```typescript
class WebhookRetryManager {
  shouldRetry(error: any, attempt: number, config: WebhookConfig): boolean {
    const { maxAttempts } = config.delivery.retryPolicy;
    
    if (attempt >= maxAttempts) return false;
    
    // Don't retry client errors (4xx except 408, 429)
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return error.response.status === 408 || error.response.status === 429;
    }
    
    // Retry server errors (5xx) and network errors
    return (
      error.response?.status >= 500 ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ENOTFOUND'
    );
  }

  calculateDelay(attempt: number, config: WebhookConfig, error?: any): number {
    const { initialDelay, maxDelay, multiplier, jitterRange } = config.delivery.retryPolicy;
    
    // Handle rate limiting with specific retry-after
    if (error?.response?.status === 429) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '60');
      return Math.min(retryAfter * 1000, maxDelay);
    }
    
    // Exponential backoff with jitter
    const exponentialDelay = initialDelay * Math.pow(multiplier, attempt - 1);
    const jitter = exponentialDelay * jitterRange * (Math.random() - 0.5);
    
    return Math.min(exponentialDelay + jitter, maxDelay);
  }
}
```

**Circuit Breaker Protection:**
```typescript
class WebhookCircuitBreaker {
  private circuitStates = new Map<string, CircuitState>();
  
  canExecute(webhookId: string): boolean {
    const state = this.getCircuitState(webhookId);
    
    switch (state.status) {
      case 'CLOSED':
        return true;
      case 'OPEN':
        return Date.now() > state.nextAttempt;
      case 'HALF_OPEN':
        return state.attemptsSinceOpen < 1;
      default:
        return true;
    }
  }

  recordSuccess(webhookId: string): void {
    const state = this.getCircuitState(webhookId);
    state.consecutiveFailures = 0;
    state.status = 'CLOSED';
    this.circuitStates.set(webhookId, state);
  }

  recordFailure(webhookId: string): void {
    const state = this.getCircuitState(webhookId);
    state.consecutiveFailures++;
    
    if (state.consecutiveFailures >= 5) { // Threshold
      state.status = 'OPEN';
      state.nextAttempt = Date.now() + (5 * 60 * 1000); // 5 minutes
    }
    
    this.circuitStates.set(webhookId, state);
  }
}
```

**Batch Delivery System:**
```typescript
class WebhookBatchDelivery {
  private batchBuffer = new Map<string, WebhookPayload[]>();
  private batchTimers = new Map<string, NodeJS.Timeout>();

  async addToBatch(webhookId: string, payload: WebhookPayload, config: WebhookConfig): Promise<void> {
    if (!config.delivery.batchDelivery.enabled) {
      await this.deliverSingle(webhookId, payload, config);
      return;
    }

    const batch = this.batchBuffer.get(webhookId) || [];
    batch.push(payload);
    this.batchBuffer.set(webhookId, batch);

    // Check if batch is full
    if (batch.length >= config.delivery.batchDelivery.maxBatchSize) {
      await this.deliverBatch(webhookId, config);
      return;
    }

    // Set/reset timer for batch delivery
    this.resetBatchTimer(webhookId, config);
  }

  private resetBatchTimer(webhookId: string, config: WebhookConfig): void {
    const existingTimer = this.batchTimers.get(webhookId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.deliverBatch(webhookId, config);
    }, config.delivery.batchDelivery.maxWaitTime);

    this.batchTimers.set(webhookId, timer);
  }
}
```

**Comprehensive Audit Logging:**
```typescript
interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  attempt: number;
  event: WebhookEvent;
  timestamp: Date;
  success: boolean;
  responseStatus?: number;
  responseTime: number;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    correlationId: string;
    userAgent?: string;
    ipAddress?: string;
    retryAttempt: number;
  };
}

class WebhookAuditLogger {
  async logWebhookDelivered(log: WebhookDeliveryLog): Promise<void> {
    await this.deliveryLogsCollection.insertOne({
      ...log,
      timestamp: new Date(),
      ttl: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)), // 90 days
    });

    // Update webhook health metrics
    await this.updateHealthMetrics(log.webhookId, log.success, log.responseTime);
  }

  async getDeliveryHistory(
    webhookId: string,
    options: { limit?: number; offset?: number; status?: 'success' | 'failure' }
  ): Promise<WebhookDeliveryLog[]> {
    return this.deliveryLogsCollection
      .find({
        webhookId,
        ...(options.status && { success: options.status === 'success' }),
      })
      .sort({ timestamp: -1 })
      .limit(options.limit || 50)
      .skip(options.offset || 0)
      .toArray();
  }
}
```

**Acceptance Criteria:**
- [ ] Webhook delivery succeeds for reachable endpoints with 99.9% reliability
- [ ] Intelligent retry mechanisms handle transient failures effectively
- [ ] HMAC signatures generated correctly and verifiable by recipients
- [ ] Circuit breaker prevents cascade failures to unhealthy endpoints
- [ ] Batch delivery optimizes performance for high-volume scenarios
- [ ] Comprehensive audit logging captures all delivery attempts
- [ ] Delivery performance meets targets (<2s average delivery time)
- [ ] Error categorization helps identify systemic issues

**Files Created:**
- `packages/worker/src/webhooks/WebhookDeliveryService.ts`
- `packages/worker/src/webhooks/WebhookSignatureService.ts`
- `packages/worker/src/webhooks/WebhookRetryManager.ts`
- `packages/worker/src/webhooks/WebhookCircuitBreaker.ts`
- `packages/worker/src/webhooks/WebhookAuditLogger.ts`
- `packages/worker/src/webhooks/WebhookBatchDelivery.ts`

---

### E3. Advanced Frontend Webhook Management Interface
**Priority**: High | **Effort**: L | **Dependencies**: E1, E2, F2

**Scope:**
- Create comprehensive webhook management dashboard
- Implement webhook testing and validation tools
- Build real-time delivery monitoring and analytics
- Create webhook debugging and troubleshooting interface
- Implement webhook templates and configuration wizards
- Design responsive interface with accessibility compliance

**Technical Implementation:**

**Webhook Management Dashboard:**
```typescript
const WebhookDashboard: React.FC = () => {
  const { data: webhooks, isLoading } = useGetWebhooksQuery();
  const { data: analytics } = useGetWebhookAnalyticsQuery();
  
  return (
    <DashboardLayout title="Webhook Management">
      <WebhookOverviewCards analytics={analytics} />
      <WebhookHealthMonitor webhooks={webhooks} />
      <WebhookList webhooks={webhooks} onEdit={handleEdit} onTest={handleTest} />
      <RecentDeliveries limit={50} />
    </DashboardLayout>
  );
};

const WebhookOverviewCards: React.FC<{ analytics: WebhookAnalytics }> = ({ analytics }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Active Webhooks"
          value={analytics.totalActive}
          change={analytics.activeChange}
          icon={<WebhookIcon />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Success Rate (24h)"
          value={`${analytics.successRate24h}%`}
          change={analytics.successRateChange}
          icon={<CheckCircleIcon />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Avg Response Time"
          value={`${analytics.avgResponseTime}ms`}
          change={analytics.responseTimeChange}
          icon={<SpeedIcon />}
          color="info"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Deliveries (24h)"
          value={analytics.deliveries24h}
          change={analytics.deliveriesChange}
          icon={<SendIcon />}
          color="secondary"
        />
      </Grid>
    </Grid>
  );
};
```

**Advanced Webhook Configuration Form:**
```typescript
const WebhookConfigurationForm: React.FC<{ webhook?: Webhook; onSave: (webhook: Webhook) => void }> = ({
  webhook,
  onSave,
}) => {
  const form = useForm<WebhookFormData>({
    resolver: zodResolver(WebhookConfigSchema),
    defaultValues: webhook || getDefaultWebhookConfig(),
  });

  const [testResult, setTestResult] = useState<WebhookTestResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <StepWizard>
          <Step title="Basic Configuration" component={BasicConfigStep} />
          <Step title="Event Subscriptions" component={EventSubscriptionStep} />
          <Step title="Security Settings" component={SecurityConfigStep} />
          <Step title="Delivery Options" component={DeliveryConfigStep} />
          <Step title="Testing & Validation" component={TestingStep} />
        </StepWizard>
      </form>
    </FormProvider>
  );
};

const BasicConfigStep: React.FC = () => {
  const { control, watch } = useFormContext<WebhookFormData>();
  const url = watch('url');
  const { data: validation, isLoading } = useValidateWebhookUrlQuery(url, {
    skip: !url || !isValidUrl(url),
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Webhook Name"
              placeholder="My Integration Webhook"
              error={!!fieldState.error}
              helperText={fieldState.error?.message || "Give your webhook a descriptive name"}
              fullWidth
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Controller
          name="url"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Endpoint URL"
              placeholder="https://api.example.com/webhooks/research"
              error={!!fieldState.error}
              helperText={
                fieldState.error?.message ||
                (validation?.valid ? "✅ URL is valid and reachable" : validation?.error)
              }
              fullWidth
              InputProps={{
                endAdornment: isLoading && <CircularProgress size={20} />
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <URLValidationStatus validation={validation} />
      </Grid>
    </Grid>
  );
};
```

**Real-time Delivery Monitoring:**
```typescript
const WebhookDeliveryMonitor: React.FC<{ webhookId: string }> = ({ webhookId }) => {
  const { data: deliveries, isLoading } = useGetWebhookDeliveriesQuery({
    webhookId,
    limit: 100,
  });
  
  const { data: liveDelivery } = useWebhookDeliverySubscription(webhookId);
  
  const columns: GridColumns = [
    {
      field: 'timestamp',
      headerName: 'Time',
      width: 160,
      renderCell: ({ value }) => (
        <Tooltip title={format(value, 'PPpp')}>
          <span>{formatDistanceToNow(value, { addSuffix: true })}</span>
        </Tooltip>
      ),
    },
    {
      field: 'event',
      headerName: 'Event',
      width: 150,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={getEventColor(value)}
          variant="outlined"
        />
      ),
    },
    {
      field: 'success',
      headerName: 'Status',
      width: 100,
      renderCell: ({ value, row }) => (
        <StatusIndicator
          success={value}
          responseCode={row.responseStatus}
          responseTime={row.responseTime}
        />
      ),
    },
    {
      field: 'responseTime',
      headerName: 'Response Time',
      width: 120,
      renderCell: ({ value }) => (
        <span className={getResponseTimeClass(value)}>
          {value}ms
        </span>
      ),
    },
    {
      field: 'attempt',
      headerName: 'Attempt',
      width: 80,
      renderCell: ({ value }) => (
        <Badge badgeContent={value > 1 ? value : 0} color="warning">
          <span>{value}</span>
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: ({ row }) => (
        <Box>
          <IconButton size="small" onClick={() => viewDetails(row)}>
            <VisibilityIcon />
          </IconButton>
          {!row.success && (
            <IconButton size="small" onClick={() => retryDelivery(row)}>
              <RefreshIcon />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Delivery History"
        action={
          <Box display="flex" gap={1}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={refetch}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              onClick={exportDeliveries}
            >
              Export
            </Button>
          </Box>
        }
      />
      <CardContent>
        <DataGrid
          rows={deliveries || []}
          columns={columns}
          autoHeight
          pageSize={25}
          checkboxSelection={false}
          disableSelectionOnClick
          loading={isLoading}
          components={{
            NoRowsOverlay: () => (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" gutterBottom>
                  No deliveries yet
                </Typography>
                <Typography color="textSecondary">
                  Webhook deliveries will appear here once events are triggered
                </Typography>
              </Box>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};
```

**Webhook Testing Interface:**
```typescript
const WebhookTester: React.FC<{ webhook: Webhook }> = ({ webhook }) => {
  const [testPayload, setTestPayload] = useState<string>('');
  const [testResult, setTestResult] = useState<WebhookTestResult | null>(null);
  const [isTestingConnectivity, setIsTestingConnectivity] = useState(false);
  const [isTestingDelivery, setIsTestingDelivery] = useState(false);
  
  const testConnectivity = async () => {
    setIsTestingConnectivity(true);
    try {
      const result = await webhookApi.testConnectivity(webhook.id);
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsTestingConnectivity(false);
    }
  };

  const testDelivery = async () => {
    setIsTestingDelivery(true);
    try {
      const payload = testPayload ? JSON.parse(testPayload) : generateSamplePayload(webhook.events[0]);
      const result = await webhookApi.testDelivery(webhook.id, payload);
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsTestingDelivery(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Webhook Testing" />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Connectivity Test
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Verify that your endpoint is reachable and responding correctly.
              </Typography>
              
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={testConnectivity}
                  disabled={isTestingConnectivity}
                  startIcon={isTestingConnectivity ? <CircularProgress size={16} /> : <NetworkCheckIcon />}
                >
                  {isTestingConnectivity ? 'Testing...' : 'Test Connectivity'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Payload Delivery Test
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Send a test webhook payload to verify end-to-end delivery.
              </Typography>
              
              <Box mt={2}>
                <TextField
                  label="Custom Test Payload (JSON)"
                  multiline
                  rows={4}
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  placeholder="Leave empty to use sample payload"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                
                <Button
                  variant="contained"
                  onClick={testDelivery}
                  disabled={isTestingDelivery}
                  startIcon={isTestingDelivery ? <CircularProgress size={16} /> : <SendIcon />}
                >
                  {isTestingDelivery ? 'Sending...' : 'Send Test Webhook'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {testResult && (
            <Grid item xs={12}>
              <WebhookTestResults result={testResult} />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
```

**Webhook Analytics Dashboard:**
```typescript
const WebhookAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const { data: analytics } = useGetWebhookAnalyticsQuery({ timeRange });
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title="Delivery Success Rate" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.successRateOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  labelFormatter={formatTooltipTimestamp}
                  formatter={(value) => [`${value}%`, 'Success Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#4caf50"
                  strokeWidth={2}
                  dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Top Failing Webhooks" />
          <CardContent>
            <List>
              {analytics?.topFailingWebhooks?.map((webhook) => (
                <ListItem key={webhook.id}>
                  <ListItemText
                    primary={webhook.name}
                    secondary={`${webhook.failureRate}% failure rate`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => navigateToWebhook(webhook.id)}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
```

**Acceptance Criteria:**
- [ ] Comprehensive webhook management interface with CRUD operations
- [ ] Real-time delivery monitoring with live updates
- [ ] Webhook testing tools validate connectivity and payload delivery
- [ ] Analytics dashboard provides actionable insights
- [ ] Responsive design works on all screen sizes
- [ ] Accessibility compliance (WCAG AAA)
- [ ] Error states handled gracefully with clear guidance
- [ ] Performance optimized for large webhook lists (1000+ webhooks)

**Files Created:**
- `packages/frontend/src/pages/WebhookDashboard.tsx`
- `packages/frontend/src/components/WebhookConfigurationForm.tsx`
- `packages/frontend/src/components/WebhookDeliveryMonitor.tsx`
- `packages/frontend/src/components/WebhookTester.tsx`
- `packages/frontend/src/components/WebhookAnalytics.tsx`
- `packages/frontend/src/hooks/useWebhookSubscription.ts`
- `packages/frontend/src/services/webhook.api.ts`

---

## Performance & Scalability

### Delivery Performance
- **Delivery Speed**: <2 seconds average delivery time
- **Throughput**: Support 10,000+ webhook deliveries per hour
- **Concurrent Deliveries**: 100+ simultaneous webhook deliveries
- **Retry Efficiency**: Intelligent backoff reduces API load by 70%

### System Scalability
- **Horizontal Scaling**: Multiple webhook delivery workers
- **Queue Management**: BullMQ with Redis clustering support
- **Circuit Breaker**: Prevents cascade failures
- **Batch Processing**: Optimizes high-volume scenarios

## Security Considerations

### Webhook Security
- **HMAC Signatures**: SHA-256 signatures for payload verification
- **Timestamp Validation**: Prevents replay attacks (5-minute tolerance)
- **IP Whitelisting**: Optional IP-based access control
- **TLS Requirements**: HTTPS-only in production environments
- **Secret Rotation**: Support for zero-downtime secret rotation

### Data Protection
- **Payload Encryption**: Optional end-to-end encryption
- **Audit Logging**: Complete delivery trail for compliance
- **Data Retention**: Configurable log retention periods
- **Access Control**: Permission-based webhook management

## Dependencies & Integration

**Depends On:**
- Epic B: Authentication and authorization for webhook management
- Epic C: Research events that trigger webhook deliveries
- Epic D: Worker service integration for delivery processing
- Redis for BullMQ job processing
- MongoDB for webhook configuration and audit storage

**Enables:**
- Real-time integration with external systems
- Automated workflow triggers based on research completion
- Third-party system notifications and updates
- Integration with customer business processes

## Risk Mitigation

- **Endpoint Reliability**: Circuit breaker prevents repeated failures
- **Delivery Assurance**: Comprehensive retry mechanisms
- **Performance Impact**: Asynchronous processing prevents API blocking
- **Security Risks**: HMAC signatures and HTTPS requirements
- **Monitoring**: Real-time alerting for delivery failures

## Definition of Done

**Functional Validation:**
- [ ] Users can create, configure, and manage webhooks through UI
- [ ] Webhook deliveries trigger correctly for subscribed events
- [ ] HMAC signatures generated and verifiable by recipients
- [ ] Retry mechanisms handle transient failures effectively
- [ ] Circuit breaker prevents cascade failures
- [ ] Real-time monitoring shows delivery status and performance

**Performance Validation:**
- [ ] Webhook delivery success rate >99.9% for reachable endpoints
- [ ] Average delivery time <2 seconds
- [ ] Support 10,000+ deliveries per hour
- [ ] UI responds in <500ms for webhook management operations
- [ ] Real-time updates have <1 second latency

**Security Validation:**
- [ ] All webhook deliveries include valid HMAC signatures
- [ ] Timestamp validation prevents replay attacks
- [ ] HTTPS enforced for all webhook endpoints in production
- [ ] Secret rotation works without service interruption
- [ ] IP whitelisting functions correctly when configured
- [ ] Audit logs capture all webhook activities

---

**Navigation:** [← Epic D - Worker](./04-epic-d-worker.md) | [Epic F - UI/UX →](./06-epic-f-ui-ux.md)