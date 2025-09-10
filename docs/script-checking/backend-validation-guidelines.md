# Backend Validation Guidelines

## Overview

This document provides guidelines for creating assertion scripts across different backend contexts: API services, worker services, infrastructure, and monitoring systems. Each context requires specific validation approaches and documentation standards.

## 1. API Service Validation

### 1.1 Required Documentation Files

```
/api/
├── api.spec.md           # OpenAPI/REST specification
├── api.endpoints.md      # Endpoint details and examples
├── api.models.md         # Data models and schemas
├── api.auth.md          # Authentication/authorization specs
├── api.errors.md        # Error codes and handling
├── api.ratelimits.md    # Rate limiting configuration
└── api.tests.md         # Test scenarios and coverage
```

### 1.2 API Specification Structure (api.spec.md)

````markdown
## Metadata

**Service**: ServiceName
**Version**: X.Y.Z
**Base Path**: /api/vX
**Status**: draft|working|completed|verified
**Updated**: YYYY-MM-DD HH:MM
**Owner**: team-name

## Endpoints

### METHOD /path/{param}

**Authentication**: Required|Optional|None
**Rate Limit**: X req/min
**Cache**: TTL in seconds
**Circuit Breaker**: enabled|disabled
**Timeout**: Xs

**Request**:

- Headers: [required headers]
- Parameters: [path/query parameters]
- Body: [schema reference or inline]

**Response [STATUS]**:

```json
{response schema}
```
````

## Service Dependencies

- **Internal**: [service-name] (version)
- **External**: [api-name] (SLA)

## Performance Requirements

- **P95 Latency**: <Xms
- **Throughput**: X req/sec
- **Concurrent Connections**: X

````

### 1.3 API Validation Checks

```javascript
const apiValidationChecks = [
  // Documentation completeness
  { name: 'docs-complete', check: () => assertAllRequiredDocsExist() },
  { name: 'docs-freshness', check: () => assertDocsFreshness(72) }, // hours

  // Endpoint implementation
  { name: 'endpoints-defined', check: () => assertAllEndpointsInCode() },
  { name: 'routes-mapped', check: () => assertRoutesMatchSpec() },
  { name: 'methods-correct', check: () => assertHTTPMethodsAlign() },

  // Request/Response validation
  { name: 'request-validation', check: () => assertRequestValidationExists() },
  { name: 'response-format', check: () => assertResponseMatchesSpec() },
  { name: 'error-handling', check: () => assertErrorHandlersImplemented() },

  // Middleware chain
  { name: 'auth-middleware', check: () => assertAuthMiddlewareInChain() },
  { name: 'rate-limit-middleware', check: () => assertRateLimitingConfigured() },
  { name: 'validation-middleware', check: () => assertValidationMiddleware() },
  { name: 'cors-config', check: () => assertCORSConfiguration() },

  // Security
  { name: 'input-sanitization', check: () => assertInputSanitization() },
  { name: 'sql-injection', check: () => assertSQLInjectionPrevention() },
  { name: 'xss-protection', check: () => assertXSSProtection() },

  // Performance
  { name: 'query-optimization', check: () => assertNoN1Queries() },
  { name: 'pagination', check: () => assertPaginationImplemented() },
  { name: 'caching-strategy', check: () => assertCachingImplemented() },

  // Testing
  { name: 'unit-tests', check: () => assertUnitTestCoverage(80) },
  { name: 'integration-tests', check: () => assertIntegrationTests() },
  { name: 'contract-tests', check: () => assertContractTests() },
  { name: 'load-tests', check: () => assertLoadTestResults() }
];
````

## 2. Worker Service Validation

### 2.1 Required Documentation Files

```
/workers/
├── worker.jobs.md        # Job definitions and schemas
├── worker.queues.md      # Queue configuration
├── worker.pipeline.md    # Processing pipeline stages
├── worker.retry.md       # Retry policies and DLQ
├── worker.scaling.md     # Scaling and performance
└── worker.monitoring.md  # Metrics and health checks
```

### 2.2 Worker Job Specification (worker.jobs.md)

````markdown
## Metadata

**Service**: WorkerServiceName
**Queue System**: BullMQ|RabbitMQ|SQS
**Redis**: Connection details
**Updated**: YYYY-MM-DD HH:MM

## Job Definitions

### JobType: research-process

**Queue**: research-queue
**Priority**: high|medium|low
**Concurrency**: 5
**Timeout**: 300s
**Retry Policy**: exponential backoff, 3 attempts

**Payload Schema**:

```json
{
  "requestId": "uuid",
  "userId": "uuid",
  "parameters": {}
}
```
````

**Processing Stages**:
| Stage | Description | Progress | Duration | Retryable |
|-------|-------------|----------|----------|-----------|
| validation | Validate input | 0-10% | <5s | No |
| external-api | Call APIs | 10-50% | 10-60s | Yes |
| normalization | Transform data | 50-80% | 5-15s | Yes |
| storage | Save results | 80-90% | <5s | Yes |
| notification | Send webhooks | 90-100% | <2s | Yes |

**Success Metrics**:

- Success Rate: >95%
- P95 Duration: <60s
- Retry Rate: <10%

**Dead Letter Queue**:

- Trigger: 3 failed attempts
- Retention: 30 days
- Alert: immediate

````

### 2.3 Worker Validation Checks

```javascript
const workerValidationChecks = [
  // Queue configuration
  { name: 'queue-exists', check: () => assertQueuesDefined() },
  { name: 'redis-connection', check: () => assertRedisConnectivity() },
  { name: 'queue-health', check: () => assertQueueHealthMetrics() },

  // Job processors
  { name: 'job-handlers', check: () => assertAllJobHandlersExist() },
  { name: 'job-schemas', check: () => assertJobPayloadValidation() },
  { name: 'job-timeout', check: () => assertJobTimeoutConfiguration() },

  // Processing pipeline
  { name: 'pipeline-stages', check: () => assertAllStagesImplemented() },
  { name: 'stage-progress', check: () => assertProgressReporting() },
  { name: 'stage-errors', check: () => assertStageErrorHandling() },

  // Retry and recovery
  { name: 'retry-policy', check: () => assertRetryConfiguration() },
  { name: 'dlq-setup', check: () => assertDeadLetterQueue() },
  { name: 'circuit-breaker', check: () => assertCircuitBreaker() },

  // External integrations
  { name: 'api-clients', check: () => assertExternalAPIClients() },
  { name: 'rate-limiting', check: () => assertExternalRateLimits() },
  { name: 'fallback-data', check: () => assertFallbackMechanisms() },

  // Performance
  { name: 'concurrency', check: () => assertConcurrencyLimits() },
  { name: 'memory-leaks', check: () => assertNoMemoryLeaks() },
  { name: 'job-duration', check: () => assertJobDurationTargets() },

  // Monitoring
  { name: 'metrics-export', check: () => assertMetricsExported() },
  { name: 'health-endpoint', check: () => assertWorkerHealthCheck() },
  { name: 'alert-rules', check: () => assertAlertingConfigured() }
];
````

## 3. Infrastructure Validation

### 3.1 Required Documentation Files

```
/infrastructure/
├── infra.architecture.md  # System architecture
├── infra.network.md       # Network topology and security
├── infra.storage.md       # Database and file storage
├── infra.compute.md       # Servers, containers, functions
├── infra.security.md      # Security groups, IAM, secrets
├── infra.monitoring.md    # Observability stack
├── infra.disaster.md      # DR and backup strategies
└── infra.costs.md         # Cost optimization
```

### 3.2 Infrastructure Specification (infra.architecture.md)

```markdown
## Metadata

**Environment**: production|staging|development
**Cloud Provider**: AWS|GCP|Azure
**Region**: primary-region
**Updated**: YYYY-MM-DD HH:MM

## Component Inventory

### Compute Resources

| Component  | Type      | Size        | Count | Auto-scaling |
| ---------- | --------- | ----------- | ----- | ------------ |
| API Server | EC2/VM    | t3.medium   | 3     | Yes (3-10)   |
| Worker     | Container | 2CPU/4GB    | 5     | Yes (5-20)   |
| Database   | RDS       | db.r5.large | 1     | No           |

### Network Architecture

| Resource      | Configuration  | Security        |
| ------------- | -------------- | --------------- |
| VPC           | 10.0.0.0/16    | Private subnets |
| Load Balancer | Application LB | SSL termination |
| CDN           | CloudFront     | WAF enabled     |

### High Availability

- **Availability Zones**: 3
- **Failover Strategy**: Active-passive
- **RTO**: 30 minutes
- **RPO**: 5 minutes

## Security Configuration

### Access Control

| Service  | Authentication | Authorization   |
| -------- | -------------- | --------------- |
| API      | JWT/OAuth2     | RBAC            |
| Database | IAM            | Least privilege |
| S3       | IAM roles      | Bucket policies |

### Encryption

- **At Rest**: AES-256
- **In Transit**: TLS 1.3
- **Key Management**: KMS
```

### 3.3 Infrastructure Validation Checks

```javascript
const infrastructureValidationChecks = [
  // Resource provisioning
  { name: 'resources-exist', check: () => assertAllResourcesProvisioned() },
  { name: 'resource-tags', check: () => assertResourceTagging() },
  { name: 'resource-sizing', check: () => assertResourceSizing() },

  // Network configuration
  { name: 'network-segmentation', check: () => assertNetworkSegmentation() },
  { name: 'security-groups', check: () => assertSecurityGroupRules() },
  { name: 'ssl-certificates', check: () => assertSSLCertificates() },
  { name: 'dns-configuration', check: () => assertDNSRecords() },

  // High availability
  { name: 'multi-az', check: () => assertMultiAZDeployment() },
  { name: 'load-balancing', check: () => assertLoadBalancerHealth() },
  { name: 'auto-scaling', check: () => assertAutoScalingPolicies() },
  { name: 'failover-tested', check: () => assertFailoverCapability() },

  // Security
  { name: 'iam-policies', check: () => assertIAMPolicies() },
  { name: 'encryption-enabled', check: () => assertEncryption() },
  { name: 'secrets-management', check: () => assertSecretsInVault() },
  { name: 'network-acls', check: () => assertNetworkACLs() },
  { name: 'waf-rules', check: () => assertWAFConfiguration() },

  // Backup and recovery
  { name: 'backup-configured', check: () => assertBackupSchedule() },
  { name: 'backup-tested', check: () => assertBackupRestoration() },
  { name: 'snapshot-retention', check: () => assertSnapshotRetention() },
  { name: 'dr-runbook', check: () => assertDisasterRecoveryPlan() },

  // Monitoring
  { name: 'cloudwatch-alarms', check: () => assertCloudWatchAlarms() },
  { name: 'log-aggregation', check: () => assertLogAggregation() },
  { name: 'metrics-dashboard', check: () => assertMetricsDashboards() },

  // Compliance
  { name: 'compliance-scan', check: () => assertComplianceChecks() },
  { name: 'vulnerability-scan', check: () => assertVulnerabilityScans() },
  { name: 'patch-management', check: () => assertPatchingSchedule() },
];
```

## 4. Monitoring & Observability Validation

### 4.1 Required Documentation Files

```
/monitoring/
├── monitoring.metrics.md    # Metric definitions and targets
├── monitoring.logs.md       # Logging standards and retention
├── monitoring.traces.md     # Distributed tracing setup
├── monitoring.alerts.md     # Alert rules and escalation
├── monitoring.dashboards.md # Dashboard specifications
├── monitoring.slo.md        # Service level objectives
└── monitoring.runbooks.md   # Incident response procedures
```

### 4.2 Monitoring Specification (monitoring.metrics.md)

````markdown
## Metadata

**Stack**: Prometheus|DataDog|CloudWatch
**Retention**: 30 days raw, 1 year aggregated
**Updated**: YYYY-MM-DD HH:MM

## Key Metrics

### Application Metrics

| Metric                        | Type      | Labels                 | Target    | Alert         |
| ----------------------------- | --------- | ---------------------- | --------- | ------------- |
| http_request_duration_seconds | Histogram | method,endpoint,status | P95<200ms | P95>500ms     |
| http_requests_total           | Counter   | method,endpoint,status | -         | error_rate>2% |
| active_connections            | Gauge     | service                | <1000     | >900          |

### Business Metrics

| Metric                  | Type    | Description             | Target | Alert    |
| ----------------------- | ------- | ----------------------- | ------ | -------- |
| research_requests_total | Counter | Total research requests | -      | drop>50% |
| research_success_rate   | Gauge   | Success percentage      | >95%   | <90%     |
| webhook_delivery_rate   | Gauge   | Delivery success        | >98%   | <95%     |

## Logging Standards

### Log Format

```json
{
  "timestamp": "ISO8601",
  "level": "ERROR|WARN|INFO|DEBUG",
  "service": "service-name",
  "trace_id": "correlation-id",
  "message": "human-readable",
  "context": {}
}
```
````

### Log Retention

| Level | Retention | Storage |
| ----- | --------- | ------- |
| ERROR | 90 days   | Hot     |
| WARN  | 60 days   | Hot     |
| INFO  | 30 days   | Warm    |
| DEBUG | 7 days    | Cold    |

## Alert Configuration

### P1 Alerts (Critical)

| Alert           | Condition     | Duration | Action       |
| --------------- | ------------- | -------- | ------------ |
| Service Down    | up==0         | 1m       | Page on-call |
| Database Down   | mysql_up==0   | 30s      | Page on-call |
| High Error Rate | error_rate>5% | 5m       | Page on-call |

### P2 Alerts (High)

| Alert        | Condition  | Duration | Action      |
| ------------ | ---------- | -------- | ----------- |
| High Latency | P95>1s     | 10m      | Slack alert |
| Queue Backup | depth>1000 | 15m      | Email team  |
| Memory High  | usage>90%  | 10m      | Auto-scale  |

````

### 4.3 Monitoring Validation Checks

```javascript
const monitoringValidationChecks = [
  // Metrics collection
  { name: 'metrics-exported', check: () => assertMetricsExported() },
  { name: 'metric-cardinality', check: () => assertMetricCardinality() },
  { name: 'metric-naming', check: () => assertMetricNamingConvention() },

  // Logging
  { name: 'structured-logs', check: () => assertStructuredLogging() },
  { name: 'log-correlation', check: () => assertLogCorrelation() },
  { name: 'log-sampling', check: () => assertLogSampling() },
  { name: 'sensitive-data', check: () => assertNoSensitiveDataInLogs() },

  // Distributed tracing
  { name: 'trace-instrumentation', check: () => assertTraceInstrumentation() },
  { name: 'trace-propagation', check: () => assertTracePropagation() },
  { name: 'trace-sampling', check: () => assertTraceSampling() },

  // Alerting
  { name: 'alert-rules', check: () => assertAlertRulesDefined() },
  { name: 'alert-routing', check: () => assertAlertRouting() },
  { name: 'alert-testing', check: () => assertAlertTesting() },
  { name: 'runbook-links', check: () => assertRunbookLinks() },

  // Dashboards
  { name: 'dashboard-exists', check: () => assertDashboardsCreated() },
  { name: 'dashboard-accuracy', check: () => assertDashboardAccuracy() },
  { name: 'dashboard-performance', check: () => assertDashboardLoadTime() },

  // SLO/SLA
  { name: 'slo-defined', check: () => assertSLOsDefined() },
  { name: 'slo-measured', check: () => assertSLOMeasurement() },
  { name: 'error-budget', check: () => assertErrorBudgetTracking() },

  // Health checks
  { name: 'health-endpoints', check: () => assertHealthEndpoints() },
  { name: 'readiness-probe', check: () => assertReadinessProbe() },
  { name: 'liveness-probe', check: () => assertLivenessProbe() }
];
````

## 5. Security Validation

### 5.1 Required Documentation Files

```
/security/
├── security.auth.md        # Authentication mechanisms
├── security.authz.md       # Authorization model
├── security.encryption.md  # Encryption standards
├── security.secrets.md     # Secrets management
├── security.audit.md       # Audit logging
├── security.compliance.md  # Compliance requirements
└── security.incidents.md   # Incident response plan
```

### 5.2 Security Validation Checks

```javascript
const securityValidationChecks = [
  // Authentication
  { name: 'auth-implementation', check: () => assertAuthenticationImplemented() },
  { name: 'token-validation', check: () => assertTokenValidation() },
  { name: 'session-management', check: () => assertSessionManagement() },
  { name: 'mfa-support', check: () => assertMFAImplementation() },

  // Authorization
  { name: 'rbac-implementation', check: () => assertRBACImplemented() },
  { name: 'permission-checks', check: () => assertPermissionChecks() },
  { name: 'resource-isolation', check: () => assertResourceIsolation() },

  // Data protection
  { name: 'encryption-at-rest', check: () => assertEncryptionAtRest() },
  { name: 'encryption-in-transit', check: () => assertEncryptionInTransit() },
  { name: 'pii-handling', check: () => assertPIIProtection() },
  { name: 'data-masking', check: () => assertDataMasking() },

  // Vulnerability prevention
  { name: 'sql-injection', check: () => assertSQLInjectionPrevention() },
  { name: 'xss-protection', check: () => assertXSSProtection() },
  { name: 'csrf-protection', check: () => assertCSRFProtection() },
  { name: 'dependency-scan', check: () => assertDependencyScanning() },

  // Audit and compliance
  { name: 'audit-logging', check: () => assertAuditLogging() },
  { name: 'compliance-checks', check: () => assertComplianceRequirements() },
  { name: 'security-headers', check: () => assertSecurityHeaders() },
];
```

## 6. Data Validation Patterns

### 6.1 Schema-Driven Validation

```javascript
class SchemaValidator {
  constructor(schemaPath) {
    this.schemas = this.loadSchemas(schemaPath);
  }

  validateEndpoint(endpoint, method, data) {
    const schema = this.schemas[`${method}:${endpoint}`];
    if (!schema) {
      throw new Error(`No schema defined for ${method} ${endpoint}`);
    }

    // Validate against JSON Schema
    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    if (!validate(data)) {
      return {
        valid: false,
        errors: validate.errors,
      };
    }

    // Additional business logic validation
    return this.validateBusinessRules(endpoint, data);
  }

  validateBusinessRules(endpoint, data) {
    const rules = this.getBusinessRules(endpoint);
    const violations = [];

    for (const rule of rules) {
      if (!rule.validate(data)) {
        violations.push({
          rule: rule.id,
          message: rule.message,
        });
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }
}
```

### 6.2 Runtime Contract Validation

```javascript
class ContractValidator {
  async validateAPIContract(endpoint, testData) {
    // Start test server
    const server = await this.startTestServer();

    // Make actual request
    const response = await fetch(`${server.url}${endpoint}`, {
      method: testData.method,
      headers: testData.headers,
      body: JSON.stringify(testData.body),
    });

    // Validate response structure
    const responseData = await response.json();
    const schemaValid = this.validateResponseSchema(responseData);

    // Validate response headers
    const headersValid = this.validateResponseHeaders(response.headers);

    // Validate status code
    const statusValid = response.status === testData.expectedStatus;

    return {
      schemaValid,
      headersValid,
      statusValid,
      details: {
        actualStatus: response.status,
        expectedStatus: testData.expectedStatus,
        response: responseData,
      },
    };
  }
}
```

## 7. Integration Testing Patterns

### 7.1 End-to-End Validation

```javascript
class E2EValidator {
  async validateUserJourney(journey) {
    const results = [];
    const context = {};

    for (const step of journey.steps) {
      const result = await this.executeStep(step, context);
      results.push(result);

      if (!result.success) {
        break; // Stop on first failure
      }

      // Update context for next step
      Object.assign(context, result.context);
    }

    return {
      journey: journey.name,
      success: results.every((r) => r.success),
      steps: results,
    };
  }

  async executeStep(step, context) {
    switch (step.type) {
      case 'api_call':
        return await this.executeAPICall(step, context);
      case 'database_check':
        return await this.executeDatabaseCheck(step, context);
      case 'queue_check':
        return await this.executeQueueCheck(step, context);
      case 'webhook_verify':
        return await this.executeWebhookVerify(step, context);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }
}
```

## 8. Performance Validation

### 8.1 Load Testing Validation

```javascript
class PerformanceValidator {
  async validatePerformanceTargets(config) {
    const results = await this.runLoadTest(config);

    const validations = {
      throughput: results.rps >= config.targets.minRPS,
      latencyP50: results.latency.p50 <= config.targets.maxP50,
      latencyP95: results.latency.p95 <= config.targets.maxP95,
      latencyP99: results.latency.p99 <= config.targets.maxP99,
      errorRate: results.errorRate <= config.targets.maxErrorRate,
      concurrency: results.maxConcurrent >= config.targets.minConcurrency,
    };

    return {
      passed: Object.values(validations).every((v) => v),
      validations,
      metrics: results,
    };
  }

  async runLoadTest(config) {
    // Use k6, JMeter, or custom load testing
    const command = `k6 run --vus ${config.vus} --duration ${config.duration} ${config.script}`;
    const output = await exec(command);
    return this.parseLoadTestResults(output);
  }
}
```

## 9. Compliance Validation

### 9.1 Regulatory Compliance Checks

```javascript
class ComplianceValidator {
  validateGDPR() {
    return {
      dataMinimization: this.checkDataMinimization(),
      rightToDelete: this.checkRightToDelete(),
      dataPortability: this.checkDataPortability(),
      consentManagement: this.checkConsentManagement(),
      breachNotification: this.checkBreachNotification(),
    };
  }

  validateSOC2() {
    return {
      security: this.checkSecurityControls(),
      availability: this.checkAvailabilityMetrics(),
      processingIntegrity: this.checkProcessingIntegrity(),
      confidentiality: this.checkConfidentiality(),
      privacy: this.checkPrivacyControls(),
    };
  }

  validatePCIDSS() {
    return {
      networkSegmentation: this.checkNetworkSegmentation(),
      encryption: this.checkPaymentDataEncryption(),
      accessControl: this.checkAccessControls(),
      monitoring: this.checkSecurityMonitoring(),
      testing: this.checkSecurityTesting(),
    };
  }
}
```

## 10. Orchestration Script

### 10.1 Master Validation Runner

```javascript
#!/usr/bin/env node

class BackendValidationOrchestrator {
  constructor(config) {
    this.config = config;
    this.validators = {
      api: new APIValidator(),
      worker: new WorkerValidator(),
      infrastructure: new InfrastructureValidator(),
      monitoring: new MonitoringValidator(),
      security: new SecurityValidator(),
      performance: new PerformanceValidator(),
      compliance: new ComplianceValidator(),
    };
  }

  async runFullValidation() {
    const results = {};
    const startTime = Date.now();

    console.log('🚀 Starting Backend Validation Suite\n');

    // Run validations in parallel where possible
    const [apiResults, workerResults] = await Promise.all([
      this.validators.api.validate(),
      this.validators.worker.validate(),
    ]);

    results.api = apiResults;
    results.worker = workerResults;

    // Infrastructure must be validated before monitoring
    results.infrastructure = await this.validators.infrastructure.validate();
    results.monitoring = await this.validators.monitoring.validate();

    // Security and compliance can run in parallel
    const [securityResults, complianceResults] = await Promise.all([
      this.validators.security.validate(),
      this.validators.compliance.validate(),
    ]);

    results.security = securityResults;
    results.compliance = complianceResults;

    // Performance testing last (most resource intensive)
    if (this.config.includePerformance) {
      results.performance = await this.validators.performance.validate();
    }

    // Generate comprehensive report
    const report = this.generateReport(results, startTime);

    // Save report
    await this.saveReport(report);

    // Exit with appropriate code
    const hasFailures = this.hasFailures(results);
    process.exit(hasFailures ? 1 : 0);
  }

  generateReport(results, startTime) {
    const duration = (Date.now() - startTime) / 1000;
    const summary = this.generateSummary(results);

    return {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      environment: process.env.NODE_ENV || 'development',
      summary,
      details: results,
      recommendations: this.generateRecommendations(results),
    };
  }

  generateSummary(results) {
    const summary = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      byCategory: {},
    };

    for (const [category, categoryResults] of Object.entries(results)) {
      const categorySum = {
        total: categoryResults.checks.length,
        passed: categoryResults.checks.filter((c) => c.status === 'PASS').length,
        failed: categoryResults.checks.filter((c) => c.status === 'FAIL').length,
      };

      summary.byCategory[category] = categorySum;
      summary.total += categorySum.total;
      summary.passed += categorySum.passed;
      summary.failed += categorySum.failed;
    }

    summary.successRate = ((summary.passed / summary.total) * 100).toFixed(1);

    return summary;
  }

  async saveReport(report) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `validation-report-${timestamp}.json`;

    await fs.writeFile(filename, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to: ${filename}`);

    // Also save a latest.json for easy access
    await fs.writeFile('validation-report-latest.json', JSON.stringify(report, null, 2));
  }
}

// Execute validation
if (require.main === module) {
  const config = {
    includePerformance: process.env.INCLUDE_PERFORMANCE === 'true',
    environment: process.env.TARGET_ENV || 'development',
    parallel: process.env.PARALLEL === 'true',
  };

  const orchestrator = new BackendValidationOrchestrator(config);
  orchestrator.runFullValidation().catch(console.error);
}
```

## Best Practices

### Documentation Standards

1. **Machine-Parseable Format**: Use consistent markdown structure with defined sections
2. **Versioning**: Track all documentation changes with timestamps
3. **Cross-References**: Link related documents and maintain consistency
4. **Examples**: Include request/response examples for all endpoints
5. **Change Tracking**: Maintain changelog for breaking changes

### Validation Patterns

1. **Progressive Enhancement**: Start with basic checks, add complexity gradually
2. **Fail Fast**: Stop validation chain on critical failures
3. **Detailed Reporting**: Include enough context to fix issues
4. **Idempotency**: Validation runs should be repeatable
5. **Performance**: Validation should complete within reasonable time

### CI/CD Integration

1. **Pre-commit Hooks**: Run quick validations before commits
2. **PR Checks**: Full validation suite on pull requests
3. **Deployment Gates**: Block deployments on validation failures
4. **Scheduled Runs**: Regular validation of production systems
5. **Metrics Collection**: Track validation success rates over time
