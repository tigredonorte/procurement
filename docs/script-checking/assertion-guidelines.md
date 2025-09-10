# Assertion Script Guidelines for Software Development

## Executive Summary

This document provides comprehensive guidelines for creating assertion scripts that validate code against documentation, ensuring consistency between specifications and implementation across various software development contexts.

## Core Principles

### 1. Documentation-Driven Development (DDD)

- **Specification First**: Documentation must define the contract before implementation
- **Machine-Readable Sections**: Use consistent markdown patterns that scripts can parse
- **Single Source of Truth**: Each specification element should exist in exactly one place
- **Versioned & Timestamped**: Track when specifications were last updated

### 2. Progressive Validation Layers

```
Level 1: Structure & Presence (files exist, folders organized)
Level 2: Syntax & Compilation (code compiles, lints pass)
Level 3: Contract Compliance (implementation matches spec)
Level 4: Quality Gates (performance, security, accessibility)
Level 5: Integration Tests (end-to-end validation)
```

### 3. Fail-Fast Philosophy

- Stop at first critical failure
- Provide clear, actionable error messages
- Include exact file paths and line numbers
- Suggest fixes when possible

## Documentation Structure Standards

### Universal Section Headers

Every technical documentation should include these machine-parseable sections:

```markdown
## Metadata

**Status**: [draft|working|completed|verified|blocked:reason]
**Owner**: [team-name or person]
**Updated**: YYYY-MM-DD HH:MM
**Version**: X.Y.Z
**Tags**: [tag1, tag2, tag3]

## Contract

[Formal specification of inputs/outputs/behaviors]

## Implementation Checklist

- [ ] Item 1 [automated-check-id]
- [ ] Item 2 [automated-check-id]

## Test Coverage

**Unit**: X/Y (XX%)
**Integration**: X/Y (XX%)
**E2E**: X/Y (XX%)

## Dependencies

- dependency-1 (version-constraint)
- dependency-2 (version-constraint)
```

## Context-Specific Guidelines

### Backend API Services

#### Required Documentation Files

```
/api-name/
├── api.spec.md          # OpenAPI/AsyncAPI specification
├── api.tasks.md         # Implementation tracking
├── api.tests.md         # Test scenarios and coverage
├── api.security.md      # Security requirements
├── api.performance.md   # Performance benchmarks
└── api.changelog.md     # Version history
```

#### api.spec.md Structure

````markdown
## Metadata

**Service**: ServiceName
**Version**: 1.0.0
**Base Path**: /api/v1
**Updated**: 2025-01-10 14:30

## Endpoints

### GET /resource/{id}

**Description**: Retrieve a resource by ID
**Authentication**: Bearer token required
**Rate Limit**: 100 req/min

**Path Parameters**:

- `id` (string, required): Resource identifier

**Response 200**:

```json
{
  "id": "string",
  "name": "string",
  "created_at": "ISO8601"
}
```
````

**Response 404**:

```json
{
  "error": "Resource not found"
}
```

## Data Models

### Resource

| Field      | Type     | Required | Validation  |
| ---------- | -------- | -------- | ----------- |
| id         | string   | yes      | UUID v4     |
| name       | string   | yes      | 1-255 chars |
| created_at | datetime | yes      | ISO8601     |

## Business Rules

- BR001: Resources must have unique names within tenant
- BR002: Soft delete only, maintain audit trail

````

#### Assertion Script Checks for Backend
```javascript
const backendChecks = [
  // Structure checks
  { name: 'api-files', check: () => assertRequiredFiles(['api.spec.md', 'api.tests.md']) },

  // OpenAPI compliance
  { name: 'openapi-valid', check: () => validateOpenAPISpec() },
  { name: 'endpoints-exist', check: () => assertAllEndpointsImplemented() },

  // Contract validation
  { name: 'request-validation', check: () => assertRequestValidation() },
  { name: 'response-format', check: () => assertResponseFormat() },
  { name: 'status-codes', check: () => assertCorrectStatusCodes() },

  // Security
  { name: 'auth-required', check: () => assertAuthenticationEnforced() },
  { name: 'rate-limiting', check: () => assertRateLimiting() },
  { name: 'input-sanitization', check: () => assertInputSanitization() },

  // Data integrity
  { name: 'schema-validation', check: () => assertDatabaseSchema() },
  { name: 'business-rules', check: () => assertBusinessRulesEnforced() },

  // Performance
  { name: 'response-time', check: () => assertResponseTimeUnder(200) },
  { name: 'query-optimization', check: () => assertNoN1Queries() },

  // Testing
  { name: 'unit-coverage', check: () => assertMinCoverage('unit', 80) },
  { name: 'integration-tests', check: () => assertIntegrationTests() },
  { name: 'contract-tests', check: () => assertContractTests() },
];
````

### Frontend Pages/Flows

#### Required Documentation Files

```
/feature-name/
├── feature.spec.md      # User stories and acceptance criteria
├── feature.flow.md      # User flow diagrams and states
├── feature.design.md    # Design tokens and component usage
├── feature.a11y.md      # Accessibility requirements
├── feature.tests.md     # Test scenarios
└── feature.metrics.md   # Analytics and performance metrics
```

#### feature.flow.md Structure

```markdown
## Metadata

**Feature**: UserRegistration
**Entry Points**: [/signup, /register]
**Exit Points**: [/dashboard, /onboarding]

## Flow States

### State: Initial

**URL**: /signup
**Components**: [SignupForm, SocialLogin]
**Actions**:

- SUBMIT_FORM -> Validating
- SOCIAL_LOGIN -> Authenticating

### State: Validating

**Components**: [LoadingSpinner]
**Transitions**:

- SUCCESS -> EmailVerification
- VALIDATION_ERROR -> Initial (with errors)
- SERVER_ERROR -> ErrorState

## User Interactions

| Action      | Element               | Validation       | Next State |
| ----------- | --------------------- | ---------------- | ---------- |
| Enter email | input[name="email"]   | Email format     | -          |
| Submit form | button[type="submit"] | All fields valid | Validating |

## Error Handling

- NetworkError: Show retry button, preserve form data
- ValidationError: Inline field errors, focus first error
- ServerError: Global error message, contact support link
```

#### Assertion Script Checks for Frontend

```javascript
const frontendChecks = [
  // Component structure
  { name: 'component-exists', check: () => assertComponentFiles() },
  { name: 'barrel-exports', check: () => assertProperExports() },

  // Flow validation
  { name: 'routes-defined', check: () => assertRoutesExist() },
  { name: 'state-machines', check: () => assertStateTransitions() },
  { name: 'error-boundaries', check: () => assertErrorHandling() },

  // UI consistency
  { name: 'design-tokens', check: () => assertDesignTokenUsage() },
  { name: 'responsive-design', check: () => assertResponsiveBreakpoints() },
  { name: 'theme-support', check: () => assertThemeVariables() },

  // Accessibility
  { name: 'aria-labels', check: () => assertAriaLabels() },
  { name: 'keyboard-nav', check: () => assertKeyboardNavigation() },
  { name: 'focus-management', check: () => assertFocusManagement() },
  { name: 'screen-reader', check: () => assertScreenReaderSupport() },

  // Performance
  { name: 'bundle-size', check: () => assertBundleSizeLimit(500) },
  { name: 'lazy-loading', check: () => assertLazyLoading() },
  { name: 'image-optimization', check: () => assertImageOptimization() },

  // Testing
  { name: 'unit-tests', check: () => assertUnitTests() },
  { name: 'integration-tests', check: () => assertIntegrationTests() },
  { name: 'e2e-tests', check: () => assertE2ETests() },
  { name: 'visual-regression', check: () => assertVisualRegression() },
];
```

### Database Schemas

#### Required Documentation Files

```
/database/
├── schema.md           # Table definitions and relationships
├── migrations.md       # Migration history and rollback plans
├── indexes.md         # Index strategy and performance
├── constraints.md     # Business rules and data integrity
└── seed-data.md       # Test and initial data
```

#### schema.md Structure

```markdown
## Table: users

**Engine**: PostgreSQL
**Partitioning**: None
**Updated**: 2025-01-10

### Columns

| Column     | Type         | Constraints      | Default           | Index  |
| ---------- | ------------ | ---------------- | ----------------- | ------ |
| id         | UUID         | PRIMARY KEY      | gen_random_uuid() | PK     |
| email      | VARCHAR(255) | UNIQUE, NOT NULL | -                 | UNIQUE |
| created_at | TIMESTAMP    | NOT NULL         | CURRENT_TIMESTAMP | BTREE  |

### Relations

- Has many: posts (user_id)
- Has one: profile (user_id)

### Triggers

- before_insert: validate_email()
- after_update: audit_log()

### Constraints

- CHK_email_format: email ~ '^[^@]+@[^@]+\.[^@]+$'
- CHK_created_at: created_at <= CURRENT_TIMESTAMP
```

### Microservices

#### Required Documentation Files

```
/service-name/
├── service.contract.md   # Inter-service contracts
├── service.events.md     # Event definitions (pub/sub)
├── service.sla.md        # Service level agreements
├── service.deps.md       # Dependencies and versions
└── service.ops.md        # Operational runbook
```

## Enforcing TDD Methodology

### TDD Documentation Structure

#### tests-first.md Template

```markdown
## Test Specification

**Feature**: [Feature Name]
**Created**: YYYY-MM-DD HH:MM (must be before implementation timestamp)
**Implementation Started**: YYYY-MM-DD HH:MM

## Test Cases

### TC001: [Test Case Name]

**Given**: Initial state
**When**: Action performed
**Then**: Expected outcome
**Status**: ❌ Failing -> ✅ Passing
**Implementation Commit**: [git-hash]

### TC002: [Test Case Name]

**Given**: Initial state
**When**: Action performed  
**Then**: Expected outcome
**Status**: ❌ Failing -> ✅ Passing
**Implementation Commit**: [git-hash]
```

### TDD Assertion Script

```javascript
function assertTDDCompliance(featurePath) {
  const checks = [
    // Verify tests were written first
    () => {
      const testFile = `${featurePath}/tests-first.md`;
      const testCreated = extractTimestamp(testFile, 'Created');
      const implStarted = extractTimestamp(testFile, 'Implementation Started');

      if (implStarted <= testCreated) {
        throw new Error('Tests must be specified before implementation');
      }
    },

    // Verify all tests start as failing
    () => {
      const testCases = extractTestCases(`${featurePath}/tests-first.md`);
      testCases.forEach((tc) => {
        if (!tc.status.includes('❌ Failing ->')) {
          throw new Error(`Test ${tc.id} must show initial failing state`);
        }
      });
    },

    // Verify test files exist before implementation files
    () => {
      const testFiles = gitLog(`${featurePath}/*.test.*`);
      const implFiles = gitLog(`${featurePath}/*.{ts,js,py,java}`);

      const firstTest = getEarliestCommit(testFiles);
      const firstImpl = getEarliestCommit(implFiles);

      if (firstImpl < firstTest) {
        throw new Error('Test files must be committed before implementation');
      }
    },

    // Verify incremental implementation
    () => {
      const commits = gitLog(featurePath);
      const pattern = /^(test|feat|refactor):/;

      let lastType = 'test';
      commits.forEach((commit) => {
        const type = commit.message.match(pattern)?.[1];
        if (type === 'feat' && lastType !== 'test') {
          throw new Error('Each feature commit must follow a test commit');
        }
        lastType = type;
      });
    },
  ];

  return runChecks(checks);
}
```

## Script Organization Pattern

### Recommended Directory Structure

```
/scripts/
├── checks/
│   ├── run-all.js           # Main orchestrator
│   ├── check-component.js   # Component-specific checks
│   ├── check-api.js         # API-specific checks
│   └── check-flow.js        # User flow checks
├── guards/                  # Pre-condition checks
│   ├── environment.js       # Environment setup validation
│   ├── dependencies.js      # Dependency availability
│   └── permissions.js       # File system permissions
├── validators/              # Specific validation logic
│   ├── structure.js         # File/folder structure
│   ├── contracts.js         # Spec compliance
│   ├── quality.js          # Code quality metrics
│   └── tests.js            # Test coverage
└── reporters/              # Output formatting
    ├── console.js          # Terminal output
    ├── markdown.js         # Status reports
    └── json.js            # Machine-readable output
```

### Base Check Runner Template

```javascript
#!/usr/bin/env node

class CheckRunner {
  constructor(context, options = {}) {
    this.context = context;
    this.options = {
      failFast: true,
      parallel: false,
      maxConcurrency: 4,
      verbose: false,
      ...options,
    };
    this.results = [];
  }

  async run(checks) {
    console.log(`🚀 Starting ${this.context} validation...`);

    // Pre-flight checks
    await this.validateEnvironment();

    // Run main checks
    if (this.options.parallel) {
      await this.runParallel(checks);
    } else {
      await this.runSequential(checks);
    }

    // Generate report
    this.generateReport();

    // Exit with appropriate code
    const failed = this.results.filter((r) => r.status === 'FAIL');
    if (failed.length > 0) {
      console.error(`\n❌ ${failed.length} checks failed`);
      process.exit(1);
    }

    console.log(`\n✅ All ${this.results.length} checks passed`);
  }

  async runSequential(checks) {
    for (const [index, check] of checks.entries()) {
      console.log(`\n[${index + 1}/${checks.length}] ${check.description}`);

      try {
        await check.fn();
        this.results.push({
          name: check.name,
          status: 'PASS',
          duration: Date.now() - start,
        });
      } catch (error) {
        this.results.push({
          name: check.name,
          status: 'FAIL',
          error: error.message,
          duration: Date.now() - start,
        });

        if (this.options.failFast) {
          throw error;
        }
      }
    }
  }

  generateReport() {
    const report = {
      context: this.context,
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter((r) => r.status === 'PASS').length,
        failed: this.results.filter((r) => r.status === 'FAIL').length,
      },
      results: this.results,
    };

    // Write to file
    fs.writeFileSync(`${this.context}-report.json`, JSON.stringify(report, null, 2));

    // Generate markdown
    this.generateMarkdownReport(report);
  }
}
```

## Parsing Utilities

### Markdown Section Extractor

````javascript
class MarkdownParser {
  constructor(content) {
    this.content = content;
    this.lines = content.split('\n');
  }

  extractSection(heading, level = 2) {
    const pattern = new RegExp(`^${'#'.repeat(level)}\\s+${heading}`, 'i');
    const startIdx = this.lines.findIndex((line) => pattern.test(line));

    if (startIdx === -1) return null;

    // Find next section at same or higher level
    const endPattern = new RegExp(`^#{1,${level}}\\s+`);
    let endIdx = this.lines.findIndex((line, idx) => idx > startIdx && endPattern.test(line));

    if (endIdx === -1) endIdx = this.lines.length;

    return this.lines
      .slice(startIdx + 1, endIdx)
      .join('\n')
      .trim();
  }

  extractMetadata() {
    const section = this.extractSection('Metadata');
    if (!section) return {};

    const metadata = {};
    const pattern = /\*\*([^*]+)\*\*:\s*(.+)/g;
    let match;

    while ((match = pattern.exec(section)) !== null) {
      metadata[match[1].toLowerCase()] = match[2].trim();
    }

    return metadata;
  }

  extractTable(sectionName) {
    const section = this.extractSection(sectionName);
    if (!section) return [];

    const lines = section.split('\n');
    const tableStart = lines.findIndex((line) => line.includes('|'));
    if (tableStart === -1) return [];

    const headers = lines[tableStart]
      .split('|')
      .map((h) => h.trim())
      .filter(Boolean);

    const rows = [];
    for (let i = tableStart + 2; i < lines.length; i++) {
      if (!lines[i].includes('|')) break;

      const values = lines[i]
        .split('|')
        .map((v) => v.trim())
        .filter(Boolean);

      const row = {};
      headers.forEach((header, idx) => {
        row[header.toLowerCase()] = values[idx] || '';
      });
      rows.push(row);
    }

    return rows;
  }

  extractCodeBlock(language) {
    const pattern = new RegExp('```' + language + '\\n([\\s\\S]*?)\\n```', 'g');
    const matches = [];
    let match;

    while ((match = pattern.exec(this.content)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  }

  extractChecklist() {
    const pattern = /^[\s-]*\[([x\s])\]\s+(.+)$/gm;
    const items = [];
    let match;

    while ((match = pattern.exec(this.content)) !== null) {
      items.push({
        checked: match[1].toLowerCase() === 'x',
        text: match[2].trim(),
      });
    }

    return items;
  }
}
````

## Best Practices

### 1. Documentation Patterns

- **Consistent Headers**: Use exact header names for machine parsing
- **Structured Data**: Use tables for specifications, lists for requirements
- **Code Fences**: Include example requests/responses in code blocks
- **Timestamps**: Always use ISO 8601 format (YYYY-MM-DD HH:MM)
- **Status Tokens**: Use finite set of status values
- **Cross-References**: Link related documents with relative paths

### 2. Script Patterns

- **Single Responsibility**: Each validator checks one concern
- **Clear Error Messages**: Include file path, line number, expected vs actual
- **Idempotent Checks**: Running twice should produce same result
- **Clean Up**: Remove temporary files even on failure
- **Progress Reporting**: Show current step and total steps
- **Graceful Degradation**: Soft fail on non-critical checks

### 3. CI/CD Integration

```yaml
# Example GitHub Actions workflow
name: Validation Checks

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup environment
        run: npm install

      - name: Run structural checks
        run: npm run check:structure

      - name: Run contract validation
        run: npm run check:contracts

      - name: Run quality gates
        run: npm run check:quality

      - name: Generate report
        if: always()
        run: npm run report:generate

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: validation-report
          path: reports/
```

### 4. Progressive Enhancement

Start simple and add checks incrementally:

**Phase 1**: File existence and structure
**Phase 2**: Syntax validation and linting
**Phase 3**: Contract compliance
**Phase 4**: Quality metrics
**Phase 5**: Integration testing

### 5. Tool-Specific Validators

#### GraphQL APIs

```javascript
const graphqlChecks = [
  { name: 'schema-valid', check: () => validateGraphQLSchema() },
  { name: 'resolvers-exist', check: () => assertResolversImplemented() },
  { name: 'n+1-prevention', check: () => assertDataLoaderUsage() },
  { name: 'depth-limiting', check: () => assertQueryDepthLimit() },
  { name: 'cost-analysis', check: () => assertQueryCostAnalysis() },
];
```

#### gRPC Services

```javascript
const grpcChecks = [
  { name: 'proto-valid', check: () => validateProtoFiles() },
  { name: 'service-impl', check: () => assertServiceImplementation() },
  { name: 'error-codes', check: () => assertStandardErrorCodes() },
  { name: 'interceptors', check: () => assertInterceptors() },
  { name: 'health-check', check: () => assertHealthEndpoint() },
];
```

#### Event-Driven Systems

```javascript
const eventChecks = [
  { name: 'schema-registry', check: () => assertSchemaRegistered() },
  { name: 'event-versioning', check: () => assertEventVersioning() },
  { name: 'dead-letter-queue', check: () => assertDLQConfiguration() },
  { name: 'idempotency', check: () => assertIdempotentHandlers() },
  { name: 'ordering-guarantee', check: () => assertEventOrdering() },
];
```

## Anti-Patterns to Avoid

1. **Over-Validation**: Don't check implementation details, only contracts
2. **Brittle Regex**: Use proper parsers for complex formats
3. **Silent Failures**: Always log why a check failed
4. **Hardcoded Paths**: Use environment variables and relative paths
5. **Missing Context**: Include enough information to fix issues
6. **All-or-Nothing**: Allow partial passes with clear status
7. **Slow Checks**: Parallelize where possible, cache results
8. **Unclear Dependencies**: Document what needs to be running

## Monitoring and Metrics

### Check Execution Metrics

```javascript
class CheckMetrics {
  constructor() {
    this.metrics = {
      totalRuns: 0,
      passRate: 0,
      avgDuration: 0,
      failureReasons: {},
      flakiness: {},
    };
  }

  record(checkName, result, duration) {
    this.metrics.totalRuns++;

    if (result.status === 'FAIL') {
      const reason = result.error;
      this.metrics.failureReasons[reason] = (this.metrics.failureReasons[reason] || 0) + 1;
    }

    // Track flaky tests (pass/fail inconsistently)
    if (!this.metrics.flakiness[checkName]) {
      this.metrics.flakiness[checkName] = [];
    }
    this.metrics.flakiness[checkName].push(result.status);

    // Identify flaky if last 10 runs have mixed results
    const recent = this.metrics.flakiness[checkName].slice(-10);
    if (recent.length === 10) {
      const passes = recent.filter((s) => s === 'PASS').length;
      if (passes > 2 && passes < 8) {
        console.warn(`⚠️ Check "${checkName}" appears flaky`);
      }
    }
  }

  export() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
```

## Conclusion

These guidelines provide a framework for creating robust assertion scripts that ensure consistency between documentation and implementation. The key is to treat documentation as executable specifications that can be validated programmatically.

Remember:

- Start with simple checks and evolve
- Make documentation machine-readable
- Provide clear, actionable feedback
- Integrate with CI/CD pipelines
- Monitor and improve based on metrics

By following these patterns, teams can maintain high-quality codebases where documentation and implementation remain synchronized, catching issues early in the development cycle.
