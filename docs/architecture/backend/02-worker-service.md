# Worker Service Architecture

## 1. Worker Service Overview

### 1.1 Purpose and Responsibilities
- **Asynchronous Processing**: Handle time-consuming research operations
- **External API Integration**: Communicate with third-party procurement APIs
- **Data Normalization**: Transform heterogeneous data into standard format
- **Webhook Notifications**: Dispatch events to registered endpoints
- **Retry Management**: Handle transient failures with exponential backoff

### 1.2 Architecture Components
- **Queue System**: BullMQ for job management
- **Redis Backend**: Persistent queue storage and job state
- **Worker Pool**: Configurable number of concurrent workers
- **Job Processor**: Business logic execution engine
- **Event Emitter**: Real-time progress and status updates

## 2. Job Queue Specifications

### 2.1 Queue Configuration
- **Queue Name**: `research-queue`
- **Connection**: Redis with configurable URL
- **Concurrency**: 5 workers (configurable)
- **Rate Limiting**: 10 jobs per second
- **Job Priority Levels**: high (1), medium (2), low (3)

### 2.2 Job Types

#### research-process
**Purpose**: Process new research requests
**Payload**:
```json
{
  "requestId": "uuid",
  "userId": "uuid",
  "query": "string",
  "parameters": {
    "categories": ["string"],
    "priceRange": { "min": "number", "max": "number" },
    "suppliers": ["string"],
    "region": "string"
  },
  "webhookUrl": "string (optional)",
  "priority": "high | medium | low"
}
```
**Expected Duration**: 30-300 seconds
**Retry Policy**: 3 attempts with exponential backoff

#### research-retry
**Purpose**: Retry failed research requests
**Payload**:
```json
{
  "originalRequestId": "uuid",
  "attemptNumber": "number",
  "previousError": "object"
}
```
**Retry Policy**: Manual trigger, max 5 total attempts

#### webhook-dispatch
**Purpose**: Send webhook notifications
**Payload**:
```json
{
  "webhookId": "uuid",
  "url": "string",
  "event": "string",
  "data": "object",
  "signature": "string (optional)"
}
```
**Retry Policy**: 5 attempts with exponential backoff

### 2.3 Job Lifecycle States
- **waiting**: Job is queued, waiting for worker
- **active**: Job is being processed by worker
- **completed**: Job finished successfully
- **failed**: Job failed after all retry attempts
- **delayed**: Job scheduled for future execution
- **paused**: Queue is paused, job on hold

## 3. Processing Pipeline

### 3.1 Pipeline Stages

#### Stage 1: Validation
- Verify request parameters
- Check user quotas and limits
- Validate external API credentials
- **Progress**: 0-10%

#### Stage 2: External API Calls
- Query multiple procurement APIs in parallel
- Handle rate limiting per API
- Manage API-specific authentication
- **Progress**: 10-50%

#### Stage 3: Data Collection
- Aggregate responses from all sources
- Handle partial failures gracefully
- Store raw data for debugging
- **Progress**: 50-60%

#### Stage 4: Data Normalization
- Transform to standard schema
- Clean and validate data
- Deduplicate results
- Enrich with additional metadata
- **Progress**: 60-80%

#### Stage 5: Storage
- Save normalized results to database
- Update request status
- Generate summary statistics
- **Progress**: 80-90%

#### Stage 6: Notification
- Trigger webhook notifications
- Send real-time updates via WebSocket
- Update user dashboard
- **Progress**: 90-100%

### 3.2 Progress Tracking
```json
{
  "requestId": "uuid",
  "stage": "string",
  "progress": "number (0-100)",
  "message": "string",
  "estimatedTimeRemaining": "seconds",
  "timestamp": "ISO 8601"
}
```

## 4. Data Normalization

### 4.1 Normalization Strategy
- **Input Formats**: JSON, XML, CSV from various APIs
- **Output Format**: Standardized JSON schema
- **Mapping Rules**: Configurable per data source
- **Validation**: Schema validation using JSON Schema
- **Fallback Values**: Default values for missing fields

### 4.2 Normalized Product Schema
```json
{
  "id": "string (unique across all sources)",
  "sourceId": "string (original ID from source)",
  "source": "string (API source name)",
  "title": "string",
  "description": "string (optional)",
  "category": "string",
  "price": {
    "amount": "number",
    "currency": "string (ISO 4217)",
    "unit": "string (piece, kg, etc.)"
  },
  "availability": {
    "status": "in_stock | out_of_stock | limited",
    "quantity": "number (optional)",
    "leadTime": "days (optional)"
  },
  "supplier": {
    "id": "string",
    "name": "string",
    "rating": "number (0-5)",
    "location": "string",
    "certifications": ["string"]
  },
  "specifications": {
    "dimensions": "object (optional)",
    "weight": "object (optional)",
    "material": "string (optional)",
    "customFields": "object"
  },
  "images": [
    {
      "url": "string",
      "type": "primary | secondary",
      "alt": "string"
    }
  ],
  "metadata": {
    "url": "string (product page)",
    "lastUpdated": "ISO 8601",
    "confidence": "number (0-1)",
    "tags": ["string"]
  }
}
```

### 4.3 Transformation Rules

#### Price Normalization
- Convert all prices to base currency (USD default)
- Handle volume discounts and tiered pricing
- Include tax information where available
- Calculate per-unit pricing

#### Availability Mapping
- Map vendor-specific status to standard values
- Calculate estimated delivery dates
- Handle pre-order and backorder scenarios
- Include minimum order quantities

## 5. Error Handling

### 5.1 Error Categories

#### Transient Errors (Retryable)
- **API_RATE_LIMIT**: External API rate limit exceeded
- **API_TIMEOUT**: Request timeout
- **NETWORK_ERROR**: Connection failures
- **SERVICE_UNAVAILABLE**: Temporary service outage
- **QUOTA_EXCEEDED**: Temporary quota limit

#### Permanent Errors (Non-retryable)
- **INVALID_PARAMETERS**: Malformed request
- **AUTHENTICATION_FAILED**: Invalid API credentials
- **INSUFFICIENT_PERMISSIONS**: Access denied
- **RESOURCE_NOT_FOUND**: Invalid resource ID
- **ACCOUNT_SUSPENDED**: User account issues

### 5.2 Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "category": "transient | permanent",
    "source": "internal | external_api_name",
    "details": {
      "apiResponse": "object (optional)",
      "attemptNumber": "number",
      "nextRetryAt": "ISO 8601 (optional)"
    }
  },
  "timestamp": "ISO 8601"
}
```

## 6. Retry Strategies

### 6.1 Exponential Backoff Configuration
```json
{
  "attempts": 3,
  "backoff": {
    "type": "exponential",
    "delay": 2000,
    "multiplier": 2,
    "maxDelay": 30000
  }
}
```

### 6.2 Retry Decision Matrix
| Error Type | Retry | Max Attempts | Backoff Strategy |
|------------|-------|--------------|------------------|
| Rate Limit | Yes | 5 | Exponential with jitter |
| Timeout | Yes | 3 | Exponential |
| Network | Yes | 3 | Linear |
| Auth Failed | No | 0 | N/A |
| Invalid Data | No | 0 | N/A |

## 7. Performance Metrics

### 7.1 Key Performance Indicators
- **Job Throughput**: Jobs processed per minute
- **Average Processing Time**: Time from queue to completion
- **Success Rate**: Percentage of successful jobs
- **Queue Depth**: Number of pending jobs
- **Worker Utilization**: Percentage of busy workers

### 7.2 Monitoring Endpoints

#### GET /metrics/worker
**Response**:
```json
{
  "workers": {
    "active": "number",
    "idle": "number",
    "total": "number"
  },
  "queue": {
    "waiting": "number",
    "active": "number",
    "completed": "number",
    "failed": "number"
  },
  "performance": {
    "avgProcessingTime": "seconds",
    "successRate": "percentage",
    "throughput": "jobs/minute"
  }
}
```

## 8. Scaling Considerations

### 8.1 Horizontal Scaling
- **Worker Instances**: Scale workers independently
- **Queue Partitioning**: Separate queues by priority
- **Redis Clustering**: Distribute queue storage
- **Load Balancing**: Round-robin job distribution

### 8.2 Vertical Scaling
- **Concurrency Tuning**: Adjust workers per instance
- **Memory Management**: Configure job result storage
- **Connection Pooling**: Optimize database connections
- **Batch Processing**: Group similar requests

## 9. Dead Letter Queue

### 9.1 DLQ Configuration
- **Queue Name**: `research-queue-dlq`
- **Trigger**: Jobs failed after max retries
- **Retention**: 30 days
- **Manual Review**: Admin interface for inspection

### 9.2 DLQ Entry Format
```json
{
  "originalJob": "object",
  "failureReason": "string",
  "attempts": "number",
  "firstFailedAt": "ISO 8601",
  "lastFailedAt": "ISO 8601",
  "stackTrace": "string (optional)"
}
```

## 10. Event System

### 10.1 Worker Events
- **job.started**: Job processing began
- **job.progress**: Progress update
- **job.completed**: Job finished successfully
- **job.failed**: Job failed
- **job.retrying**: Retry attempt starting
- **worker.error**: Worker-level error

### 10.2 Event Payload Structure
```json
{
  "event": "string",
  "jobId": "string",
  "workerId": "string",
  "data": "object",
  "timestamp": "ISO 8601"
}
```